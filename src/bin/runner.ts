#!/usr/bin/env tsx
/**
 * 执行器进程：`pnpm runner`
 *
 * 分容器部署时唯一能调用 CLI 的进程：常驻调度器 + 消费看板写在 `data/requests/` 的
 * 请求 + 写心跳。看板容器不装 CLI、不挂凭据卷，靠这里代办。
 */

import { refreshCatalog, readCachedCatalog } from "../capabilities/catalog";
import { checkAndRecord } from "../capabilities/readiness-cache";
import { describeActiveWorkConflict, findActiveWork } from "../core/active-work";
import { readAutoRunSwitch, recordSchedulerProcess } from "../core/auto-run";
import { loadConfig, type AppConfig } from "../core/config";
import { resumeInterruptedJudging } from "../core/judge/ai-round";
import { executeFingerprintCheckBatch, executeFingerprintFill } from "../core/model-fingerprint/collect";
import { configPath } from "../core/paths";
import { handleProfileCredential, handleProfileModels } from "../core/profile-credential-request";
import {
  claimNextRequest,
  cleanStaleGithubRequestCodes,
  completeRequest,
  failRequest,
  pruneRequests,
  type RunnerRequest,
} from "../core/requests";
import { narrowConfig, scheduledRound } from "../core/run-selection";
import { recoverInterruptedRuns } from "../core/run/recover-interrupted";
import { executeRun } from "../core/runner";
import { HEARTBEAT_INTERVAL_MS, writeHeartbeat } from "../core/runner-link";
import { startScheduler } from "../core/scheduler";
import {
  expandEqualsTokens,
  extractGlobalPathFlags,
  formatCliError,
  hasHelpFlag,
  stripPnpmSeparators,
} from "./cli-args";
import {
  handleDataRepoStatus,
  handleGithubAppConvert,
  handleGithubDisconnect,
  handleGithubTokenExchange,
  handleSyncData,
  prepareDataRepo,
} from "./runner-sync";

const REQUEST_POLL_MS = 1000;
const PRUNE_INTERVAL_MS = 60 * 60 * 1000;

const VALID_RUNNER_FLAGS: readonly string[] = [
  "--config",
  "-c",
  "--data-dir",
  "--help",
  "-h",
];

export function formatRunnerHelp(): string {
  return [
    "用法: pnpm runner [-- <options>]",
    "别名: pnpm pelican runner [options]",
    "",
    "说明:",
    "  启动分容器执行器常驻进程（内含定时调度器、data/requests 队列消费与心跳）。",
    "",
    "选项:",
    "  -c, --config <path>     覆盖配置文件路径（同 PELICAN_CONFIG）",
    "  --data-dir <path>       覆盖数据目录路径（同 PELICAN_DATA_DIR）",
    "  -h, --help              显示此帮助信息并退出",
  ].join("\n");
}

function log(message: string): void {
  console.log(`${new Date().toISOString()} ${message}`);
}

export async function runRunnerCli(
  argv: readonly string[] = process.argv.slice(2),
  writeLine: (line: string) => void = console.log,
): Promise<void> {
  if (hasHelpFlag(stripPnpmSeparators(argv))) {
    writeLine(formatRunnerHelp());
    return;
  }
  const tokens = expandEqualsTokens(stripPnpmSeparators(extractGlobalPathFlags(argv)));
  for (const token of tokens) {
    throw new Error(formatCliError(token, VALID_RUNNER_FLAGS, "pnpm runner -- --help"));
  }
  await main();
}

async function main(): Promise<void> {
  const startedAt = new Date();
  const config = loadConfig(configPath());
  log(`执行器启动，配置：${configPath()}，定时目标 ${scheduledRound(config).targets.length}/${config.targets.length}`);

  await writeHeartbeat(startedAt);
  setInterval(() => void writeHeartbeat(startedAt).catch((cause: unknown) => log(`写心跳失败：${describe(cause)}`)), HEARTBEAT_INTERVAL_MS);
  // 调度器登记仍写，供本进程内的单例判断
  await recordSchedulerProcess(process.pid, startedAt);

  // 看板容器探测不了能力目录，首次启动时在这里补上
  if ((await readCachedCatalog()) === null) {
    log("没有能力目录缓存，先探测一次");
    await refreshCatalog(config.customModels).catch((cause: unknown) => log(`探测失败：${describe(cause)}`));
  }

  // 配置了数据仓地址时先把本地副本 clone 好，收尾与自动同步才有地方写
  await prepareDataRepo(config, log);
  // 上一个进程退出前没跑完的轮次先收尾，已完成的作品照常导出
  const recovered = await recoverInterruptedRuns(config, log);
  // 没评完的评审队列在后台续评，不耽误调度与请求处理；裁判调用串行，与新一轮互不影响
  void resumeJudging(recovered.judgingInterrupted);

  const { enabled } = await readAutoRunSwitch();
  log(`自动任务开关：${enabled ? "开" : "关（到点跳过，在看板上打开）"}`);
  // 调度器每个触发点重读配置，看板改的定时目标、题目与节奏无需重启执行器
  const scheduler = startScheduler(() => loadConfig(configPath()), log);

  await cleanStaleGithubRequestCodes().catch(() => {});
  setInterval(() => void pruneRequests().catch(() => {}), PRUNE_INTERVAL_MS);
  const polling = setInterval(() => void pollRequests(), REQUEST_POLL_MS);

  const shutdown = (signal: NodeJS.Signals) => {
    log(`收到 ${signal}，停止执行器`);
    scheduler.stop();
    clearInterval(polling);
    process.exit(0);
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

async function resumeJudging(runIds: readonly string[]): Promise<void> {
  for (const runId of runIds) {
    await resumeInterruptedJudging(loadConfig(configPath()), runId, log).catch((cause: unknown) => log(`[${runId}] 续评失败：${describe(cause)}`));
  }
}

let handling = false;

/** 每次认领一条；发起一轮的请求在开跑后即答复，整轮在后台继续 */
async function pollRequests(): Promise<void> {
  if (handling) return;
  handling = true;
  try {
    const request = await claimNextRequest();
    if (request === null) return;
    log(`认领请求 ${request.id}（${request.kind}）`);
    await handle(request);
  } catch (cause) {
    log(`处理请求失败：${describe(cause)}`);
  } finally {
    handling = false;
  }
}

export async function handle(request: RunnerRequest): Promise<void> {
  const full = loadConfig(configPath());
  switch (request.kind) {
    case "check-readiness":
      await checkAndRecord([...new Set(full.targets.map((target) => target.cli))]);
      return completeRequest(request.id, {});
    case "probe-capabilities":
      await refreshCatalog(full.customModels);
      return completeRequest(request.id, {});
    case "run":
      return startRun(request, full);
    case "fingerprint-fill":
      return startFingerprintFill(request, full);
    case "fingerprint-check":
      return startFingerprintCheck(request, full);
    case "data-repo-status":
      return handleDataRepoStatus(request, full, log);
    case "sync-data":
      return handleSyncData(request, full, log);
    case "github-app-convert":
      return handleGithubAppConvert(request);
    case "github-token-exchange":
      return handleGithubTokenExchange(request, full);
    case "github-disconnect":
      return handleGithubDisconnect(request);
    case "profile-credential":
      return handleProfileCredential(request, full);
    case "profile-models":
      return handleProfileModels(request, full);
  }
}

async function startFingerprintFill(request: RunnerRequest, full: AppConfig): Promise<void> {
  const active = await findActiveWork();
  if (active !== null) return failRequest(request.id, describeActiveWorkConflict(active));
  await new Promise<void>((resolve) => {
    let answered = false;
    executeFingerprintFill(full, {
      ...(request.fingerprintFill ?? {}),
      log,
      onStarted: (jobId) => {
        answered = true;
        void completeRequest(request.id, { jobId }).finally(resolve);
      },
    })
      .then((res) => {
        if (!answered) void completeRequest(request.id, { jobId: res.jobId ?? undefined, calls: res.callsExecuted }).finally(resolve);
      })
      .catch((cause: unknown) => {
        log(`模型指纹补齐失败：${describe(cause)}`);
        if (!answered) void failRequest(request.id, describe(cause)).finally(resolve);
      });
  });
}

async function startFingerprintCheck(request: RunnerRequest, full: AppConfig): Promise<void> {
  const payload = request.fingerprintCheck;
  if (!payload) return failRequest(request.id, "缺少 fingerprintCheck 请求载荷");
  const active = await findActiveWork();
  if (active !== null) return failRequest(request.id, describeActiveWorkConflict(active));
  await new Promise<void>((resolve) => {
    let answered = false;
    executeFingerprintCheckBatch(full, {
      ...payload,
      log,
      onStarted: (jobId) => {
        answered = true;
        void completeRequest(request.id, { jobId }).finally(resolve);
      },
    })
      .then((records) => {
        if (!answered) {
          void completeRequest(request.id, {
            checkId: records[0]?.checkId,
            checkIds: records.map((r) => r.checkId),
          }).finally(resolve);
        }
      })
      .catch((cause: unknown) => {
        log(`模型指纹核验失败：${describe(cause)}`);
        if (!answered) void failRequest(request.id, describe(cause)).finally(resolve);
      });
  });
}

async function startRun(request: RunnerRequest, full: AppConfig): Promise<void> {
  let config: AppConfig;
  try {
    config = request.selection === null ? scheduledRound(full) : narrowConfig(full, request.selection);
  } catch (cause) {
    await failRequest(request.id, describe(cause));
    return;
  }
  const active = await findActiveWork();
  if (active !== null) {
    await failRequest(request.id, describeActiveWorkConflict(active));
    return;
  }
  const calls = config.targets.length * config.run.promptIds.length;
  // 进度文件写好即答复看板；整轮在后台跑完，开跑前抛错才算失败
  await new Promise<void>((resolve) => {
    let answered = false;
    executeRun(config, {
      trigger: "manual",
      candidateOverrides: request.selection?.candidateOverrides,
      log,
      onStarted: (runId) => {
        answered = true;
        void completeRequest(request.id, { runId, calls }).then(resolve);
      },
    }).catch((cause: unknown) => {
      log(`手动执行失败：${describe(cause)}`);
      if (!answered) void failRequest(request.id, describe(cause)).then(resolve);
    });
  });
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

if (process.argv[1]?.endsWith("runner.ts") || process.argv[1]?.endsWith("runner")) {
  runRunnerCli(process.argv.slice(2)).catch((cause: unknown) => {
    console.error(describe(cause));
    process.exit(1);
  });
}

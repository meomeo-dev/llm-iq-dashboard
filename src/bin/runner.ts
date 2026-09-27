#!/usr/bin/env tsx
/**
 * 执行器进程：`pnpm runner`
 *
 * 分容器部署时唯一能调用 CLI 的进程：常驻调度器 + 消费看板写在 `data/requests/` 的
 * 请求 + 写心跳。看板容器不装 CLI、不挂凭据卷，靠这里代办。
 */

import { refreshCatalog, readCachedCatalog } from "../capabilities/catalog";
import { checkAndRecord } from "../capabilities/readiness-cache";
import { readAutoRunSwitch, recordSchedulerProcess } from "../core/auto-run";
import { loadConfig, type AppConfig } from "../core/config";
import { configPath } from "../core/paths";
import { findActiveRun } from "../core/progress";
import { claimNextRequest, completeRequest, failRequest, pruneRequests, type RunnerRequest } from "../core/requests";
import { narrowConfig, scheduledRound } from "../core/run-selection";
import { executeRun } from "../core/runner";
import { HEARTBEAT_INTERVAL_MS, writeHeartbeat } from "../core/runner-link";
import { startScheduler } from "../core/scheduler";

const REQUEST_POLL_MS = 1000;
const PRUNE_INTERVAL_MS = 60 * 60 * 1000;

function log(message: string): void {
  console.log(`${new Date().toISOString()} ${message}`);
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

  const { enabled } = await readAutoRunSwitch();
  log(`自动任务开关：${enabled ? "开" : "关（到点跳过，在看板上打开）"}`);
  // 调度器每个触发点重读配置，看板改的定时目标、题目与节奏无需重启执行器
  const scheduler = startScheduler(() => loadConfig(configPath()), log);

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

async function handle(request: RunnerRequest): Promise<void> {
  // 每条请求都重读配置：看板改过的配置对下一条立即生效
  const full = loadConfig(configPath());
  switch (request.kind) {
    case "check-readiness": {
      await checkAndRecord([...new Set(full.targets.map((target) => target.cli))]);
      await completeRequest(request.id, {});
      return;
    }
    case "probe-capabilities": {
      await refreshCatalog(full.customModels);
      await completeRequest(request.id, {});
      return;
    }
    case "run":
      await startRun(request, full);
      return;
  }
}

async function startRun(request: RunnerRequest, full: AppConfig): Promise<void> {
  let config: AppConfig;
  try {
    config = request.selection === null ? scheduledRound(full) : narrowConfig(full, request.selection);
  } catch (cause) {
    await failRequest(request.id, describe(cause));
    return;
  }
  const active = await findActiveRun();
  if (active !== null) {
    await failRequest(request.id, `已有一轮正在执行（${active.runId}）`);
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

main().catch((cause: unknown) => {
  console.error(describe(cause));
  process.exit(1);
});

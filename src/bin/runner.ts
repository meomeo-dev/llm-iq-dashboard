#!/usr/bin/env tsx
/**
 * 执行器进程：`pnpm runner`
 *
 * 分容器部署时唯一能调用 CLI 的进程：常驻调度器 + 消费看板写在 `data/requests/` 的
 * 请求 + 写心跳。看板容器不装 CLI、不挂凭据卷，靠这里代办。
 */

import { existsSync } from "node:fs";
import { refreshCatalog, readCachedCatalog } from "../capabilities/catalog";
import { checkAndRecord } from "../capabilities/readiness-cache";
import { readAutoRunSwitch, recordSchedulerProcess } from "../core/auto-run";
import { loadConfig, type AppConfig } from "../core/config";
import { configPath } from "../core/paths";
import { findActiveRun } from "../core/progress";
import { claimNextRequest, cleanStaleGithubRequestCodes, completeRequest, failRequest, pruneRequests, type RunnerRequest } from "../core/requests";
import { narrowConfig, scheduledRound } from "../core/run-selection";
import { resumeInterruptedJudging } from "../core/judge/ai-round";
import { recoverInterruptedRuns } from "../core/run/recover-interrupted";
import { handleProfileCredential, handleProfileModels } from "../core/profile-credential-request";
import { executeRun } from "../core/runner";
import { HEARTBEAT_INTERVAL_MS, writeHeartbeat } from "../core/runner-link";
import { startScheduler } from "../core/scheduler";
import {
  buildPushEnv,
  clearGithubCredentials,
  convertManifest,
  exchangeCode,
  fetchRepositoryId,
  fetchUserLogin,
  parseGitHubRemote,
  readAccessToken,
  readGithubApp,
  readGithubConnection,
  revokeGrant,
  writeAccessToken,
  writeGithubApp,
  writeGithubUser,
} from "../core/github-auth";
import {
  getAheadCommits,
  getPushTarget,
  gitExec,
  inspectGitRepo,
  pushCurrentBranch,
  verifyUpstreamContains,
} from "../core/sync/data-repo-git";
import type {
  PushCapability,
  SyncActionMode,
  SyncActionRequest,
  SyncActionResult,
} from "../core/sync/data-repo-panel-types";
import {
  getRawDataRepoPath,
  readDataRepoManifest,
  saveLastAction,
} from "../core/sync/data-repo-status";
import { performSyncAction, type SyncActionReport } from "../core/sync/sync-actions";
import { confirmPublished, type ConfirmPublishedReport } from "../core/sync/sync-orchestrator";

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
    case "data-repo-status":
      await handleDataRepoStatus(request, full);
      return;
    case "sync-data":
      await handleSyncData(request, full);
      return;
    case "github-app-convert":
      await handleGithubAppConvert(request);
      return;
    case "github-token-exchange":
      await handleGithubTokenExchange(request, full);
      return;
    case "github-disconnect":
      await handleGithubDisconnect(request);
      return;
    case "profile-credential":
      await handleProfileCredential(request, full);
      return;
    case "profile-models":
      await handleProfileModels(request, full);
      return;
  }
}

async function handleGithubAppConvert(request: RunnerRequest): Promise<void> {
  const code = request.githubAction?.code;
  if (!code) {
    await failRequest(request.id, "缺少 GitHub App 授权码 (code)");
    return;
  }
  try {
    const creds = await convertManifest(code);
    await writeGithubApp(creds);
    const conn = await readGithubConnection();
    await completeRequest(request.id, { githubConnection: conn });
  } catch (cause) {
    await failRequest(request.id, describe(cause));
  }
}

async function resolveRepoFullNameAndId(
  repoPath?: string,
): Promise<{ fullName: string; repoId: number | null }> {
  let fullName = "meomeo-dev/llm-iq-data";
  let repoId: number | null = null;
  if (!repoPath) return { fullName, repoId };
  try {
    const remote = (await gitExec(repoPath, ["remote", "get-url", "origin"])).trim();
    const parsed = parseGitHubRemote(remote);
    if (parsed) {
      fullName = parsed;
      const parts = parsed.split("/");
      if (parts.length === 2 && parts[0] && parts[1]) {
        repoId = await fetchRepositoryId(parts[0], parts[1]);
      }
    }
  } catch {
    // 忽略未配置 remote
  }
  return { fullName, repoId };
}

async function handleGithubTokenExchange(
  request: RunnerRequest,
  full: AppConfig,
): Promise<void> {
  const code = request.githubAction?.code;
  if (!code) {
    await failRequest(request.id, "缺少 GitHub 授权码 (code)");
    return;
  }
  try {
    const app = await readGithubApp();
    if (!app) {
      await failRequest(request.id, "未找到 GitHub App 凭据，请重新发起连接");
      return;
    }
    const { fullName, repoId } = await resolveRepoFullNameAndId(full.dataRepo?.path);
    const tokens = await exchangeCode(app, code, repoId);
    const login = await fetchUserLogin(tokens.access_token);
    const now = Date.now();
    const expiresAt = tokens.expires_in
      ? new Date(now + tokens.expires_in * 1000).toISOString()
      : null;
    const refreshExpiresAt = tokens.refresh_token_expires_in
      ? new Date(now + tokens.refresh_token_expires_in * 1000).toISOString()
      : null;
    await writeGithubUser({
      login,
      refresh_token: tokens.refresh_token,
      expiresAt,
      refreshExpiresAt,
      repositoryFullName: fullName,
    });
    await writeAccessToken(tokens.access_token);
    const conn = await readGithubConnection();
    await completeRequest(request.id, { githubConnection: conn });
  } catch (cause) {
    await failRequest(request.id, describe(cause));
  }
}

async function handleGithubDisconnect(request: RunnerRequest): Promise<void> {
  let revoked = true;
  let revokeError: string | undefined;
  try {
    const app = await readGithubApp();
    const token = await readAccessToken();
    if (app && token) {
      await revokeGrant(app, token);
    }
  } catch (cause) {
    revoked = false;
    revokeError = `撤销 GitHub 授权失败: ${describe(cause)}`;
  } finally {
    await clearGithubCredentials().catch(() => {});
    const conn = await readGithubConnection();
    await completeRequest(request.id, {
      githubConnection: conn,
      githubDisconnectResult: { revoked, revokeError },
    });
  }
}

async function handleDataRepoStatus(request: RunnerRequest, full: AppConfig): Promise<void> {
  const conn = await readGithubConnection();
  const pushCapability: PushCapability =
    conn.state === "connected" ? "github-app" : "unavailable";

  if (!full.dataRepo || !existsSync(full.dataRepo.path)) {
    await completeRequest(request.id, {
      statusResult: { repo: null, manifest: null, github: conn, pushCapability },
    });
    return;
  }
  const repoPath = full.dataRepo.path;
  const gitInfo = await inspectGitRepo(repoPath);
  const rawPath = getRawDataRepoPath(full, configPath());
  const repo = { path: rawPath, ...gitInfo };
  const manifest = await readDataRepoManifest(repoPath);
  await completeRequest(request.id, {
    statusResult: { repo, manifest, github: conn, pushCapability },
  });
}

function isAheadCommitsMatch(actual: string[], confirmed?: string[]): boolean {
  if (!confirmed) return false;
  if (actual.length !== confirmed.length) return false;
  return actual.every((sha, idx) => sha === confirmed[idx]);
}

async function doRunnerPushAndVerify(
  repoPath: string,
  currentAhead: string[],
): Promise<ConfirmPublishedReport> {
  const target = await getPushTarget(repoPath);
  const pushEnv = await buildPushEnv(target.pushUrl);
  await pushCurrentBranch(repoPath, pushEnv, target);

  if (currentAhead.length > 0 && currentAhead[0]) {
    const latestSha = currentAhead[0];
    const contained = await verifyUpstreamContains(repoPath, latestSha, target.upstreamBranch, pushEnv);
    if (!contained) {
      throw new Error(`推送后远程分支未包含提交 (${latestSha})，推送校验失败`);
    }
  }

  return confirmPublished({ repoPath, dryRun: false });
}

async function handleRunnerPush(
  requestId: string,
  action: SyncActionRequest,
  full: AppConfig,
  startedAt: string,
): Promise<void> {
  // 互斥锁由发起请求的 web 进程持有（共享数据卷上的文件标记），这里不再重复获取；
  // 推送前重新比对领先提交清单，保证只推送用户确认过的内容
  try {
    const conn = await readGithubConnection();
    if (conn.state !== "connected") {
      throw new Error("容器内无推送凭据，请在宿主机推送");
    }
    if (!full.dataRepo || !existsSync(full.dataRepo.path)) {
      throw new Error("数据仓未配置");
    }
    const repoPath = full.dataRepo.path;
    const currentAhead = await getAheadCommits(repoPath);
    if (!isAheadCommitsMatch(currentAhead, action.confirmation?.aheadCommits)) {
      throw new Error("待推送提交清单已发生变化，请刷新面板后重新确认");
    }

    const report = await doRunnerPushAndVerify(repoPath, currentAhead);
    const result: SyncActionResult = {
      mode: "push",
      startedAt,
      finishedAt: new Date().toISOString(),
      ok: true,
      report,
      executedBy: "runner",
      error: null,
    };
    await saveLastAction(result);
    await completeRequest(requestId, { syncResult: result });
  } catch (cause) {
    const error = describe(cause);
    log(`执行器 push 失败：${error}`);
    await recordSyncFailure(requestId, "push", error, startedAt);
  }
}

async function recordSyncFailure(
  requestId: string,
  mode: SyncActionMode,
  error: string,
  startedAt: string,
): Promise<void> {
  const result: SyncActionResult = {
    mode,
    startedAt,
    finishedAt: new Date().toISOString(),
    ok: false,
    report: null,
    executedBy: "runner",
    error,
  };
  await saveLastAction(result);
  await completeRequest(requestId, { syncResult: result });
}

async function handleSyncData(request: RunnerRequest, full: AppConfig): Promise<void> {
  const action = request.syncAction;
  const startedAt = new Date().toISOString();
  if (!action) {
    await failRequest(request.id, "缺少 syncAction 请求体");
    return;
  }
  if (action.mode === "push") {
    await handleRunnerPush(request.id, action, full, startedAt);
    return;
  }
  if (!full.dataRepo || !existsSync(full.dataRepo.path)) {
    await recordSyncFailure(request.id, action.mode, "数据仓未配置", startedAt);
    return;
  }
  await performRunnerSync(request.id, action, full, startedAt);
}

async function performRunnerSync(
  requestId: string,
  action: SyncActionRequest,
  full: AppConfig,
  startedAt: string,
): Promise<void> {
  const { mode } = action;
  if (mode === "push") throw new Error("push 由 handleRunnerPush 处理");
  let ok = true;
  let report: SyncActionReport | null = null;
  let error: string | null = null;
  try {
    report = await performSyncAction(action, full);
  } catch (cause) {
    ok = false;
    error = describe(cause);
    log(`执行同步动作 ${mode} 失败：${error}`);
  }
  const result: SyncActionResult = {
    mode,
    startedAt,
    finishedAt: new Date().toISOString(),
    ok,
    report,
    executedBy: "runner",
    error,
  };
  await saveLastAction(result);
  await completeRequest(requestId, { syncResult: result });
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

if (process.argv[1]?.endsWith("runner.ts") || process.argv[1]?.endsWith("runner")) {
  main().catch((cause: unknown) => {
    console.error(describe(cause));
    process.exit(1);
  });
}

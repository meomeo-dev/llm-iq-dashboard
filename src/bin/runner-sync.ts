/**
 * 执行器进程的 GitHub App 授权与数据仓同步处理（从 src/bin/runner.ts 拆分）。
 */

import { existsSync } from "node:fs";
import type { AppConfig } from "../core/config";
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
import { configPath } from "../core/paths";
import { completeRequest, failRequest, type RunnerRequest } from "../core/requests";
import type { Logger } from "../core/runner";
import { describeCheckout, ensureDataRepoCheckout } from "../core/sync/data-repo-checkout";
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

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

export async function handleGithubAppConvert(request: RunnerRequest): Promise<void> {
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

/** 目标仓：配置里的 repository 优先，没配才看本地副本的 origin，都没有用缺省仓 */
async function resolveRepoFullNameAndId(
  dataRepo?: AppConfig["dataRepo"],
): Promise<{ fullName: string; repoId: number | null }> {
  let fullName = "meomeo-dev/llm-iq-data";
  let repoId: number | null = null;
  if (!dataRepo) return { fullName, repoId };
  try {
    const remote =
      dataRepo.repository ?? (await gitExec(dataRepo.path, ["remote", "get-url", "origin"])).trim();
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

export async function handleGithubTokenExchange(
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
    const { fullName, repoId } = await resolveRepoFullNameAndId(full.dataRepo);
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

export async function handleGithubDisconnect(request: RunnerRequest): Promise<void> {
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

/**
 * 配置了仓地址就先把本地副本准备好（没有就 clone），结果写日志；
 * 返回本地副本路径，没配或目录不存在为 null。clone 失败只记日志，面板按「路径不可达」提示
 */
export async function prepareDataRepo(full: AppConfig, log: Logger): Promise<string | null> {
  if (!full.dataRepo) return null;
  if (full.dataRepo.repository !== null) {
    try {
      const note = describeCheckout(await ensureDataRepoCheckout(full.dataRepo, { log }));
      if (note !== null) log(note);
    } catch (cause) {
      log(`数据仓 clone 失败：${describe(cause)}`);
    }
  }
  return existsSync(full.dataRepo.path) ? full.dataRepo.path : null;
}

export async function handleDataRepoStatus(
  request: RunnerRequest,
  full: AppConfig,
  log: Logger,
): Promise<void> {
  const conn = await readGithubConnection();
  const pushCapability: PushCapability =
    conn.state === "connected" ? "github-app" : "unavailable";

  const repoPath = await prepareDataRepo(full, log);
  if (repoPath === null) {
    await completeRequest(request.id, {
      statusResult: { repo: null, manifest: null, github: conn, pushCapability },
    });
    return;
  }
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
    const contained = await verifyUpstreamContains(
      repoPath,
      latestSha,
      target.upstreamBranch,
      pushEnv,
    );
    if (!contained) {
      throw new Error(`推送后远程分支未包含提交 (${latestSha})，推送校验失败`);
    }
  }

  return confirmPublished({ repoPath, dryRun: false, skipLock: true });
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

async function handleRunnerPush(
  requestId: string,
  action: SyncActionRequest,
  full: AppConfig,
  startedAt: string,
  log: Logger,
): Promise<void> {
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

async function performRunnerSync(
  requestId: string,
  action: SyncActionRequest,
  full: AppConfig,
  startedAt: string,
  log: Logger,
): Promise<void> {
  const { mode } = action;
  if (mode === "push") throw new Error("push 由 handleRunnerPush 处理");
  let ok = true;
  let report: SyncActionReport | null = null;
  let error: string | null = null;
  try {
    report = await performSyncAction(action, full, undefined, { skipLock: true });
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

export async function handleSyncData(
  request: RunnerRequest,
  full: AppConfig,
  log: Logger,
): Promise<void> {
  const action = request.syncAction;
  const startedAt = new Date().toISOString();
  if (!action) {
    await failRequest(request.id, "缺少 syncAction 请求体");
    return;
  }
  if (action.mode === "push") {
    await handleRunnerPush(request.id, action, full, startedAt, log);
    return;
  }
  if ((await prepareDataRepo(full, log)) === null) {
    await recordSyncFailure(request.id, action.mode, "数据仓未配置", startedAt);
    return;
  }
  await performRunnerSync(request.id, action, full, startedAt, log);
}

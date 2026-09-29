/**
 * 看板交给执行器的请求：`data/requests/` 下每个请求一个 JSON 文件。
 *
 * 看板写入 pending，执行器认领后处理并写回结果；看板轮询等待。只有三类请求：
 * 发起一轮、重新检查 CLI 就绪、重新探测能力目录。停止一轮与自动任务开关本来就是
 * 文件（cancel.json、auto-run.json），不经这里。
 */

import { randomBytes } from "node:crypto";
import { mkdir, readdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { readCachedCatalog } from "../capabilities/catalog";
import type { CapabilitySnapshot } from "../capabilities/types";
import { dataRoot } from "./paths";
import type { RunSelection } from "./run-selection";
import type { CliKind } from "./types";
import type {
  DataRepoStatus,
  GithubConnection,
  PushCapability,
  SyncActionRequest,
  SyncActionResult,
} from "./sync/data-repo-panel-types";

const REQUESTS_DIR = "requests";
const POLL_MS = 250;
/** 处理完的请求文件保留这么久，便于排查 */
const KEEP_FINISHED_MS = 60 * 60 * 1000;

export type RequestKind =
  | "run"
  | "check-readiness"
  | "probe-capabilities"
  | "sync-data"
  | "data-repo-status"
  | "github-app-convert"
  | "github-token-exchange"
  | "github-disconnect"
  | "profile-credential";
export type RequestState = "pending" | "claimed" | "done" | "failed";

export interface RunnerRequest {
  id: string;
  kind: RequestKind;
  state: RequestState;
  requestedAt: string;
  claimedAt: string | null;
  finishedAt: string | null;
  /** kind 为 run 时的范围；null 表示按配置跑整轮 */
  selection: RunSelection | null;
  /** kind 为 sync-data 时的动作载荷 */
  syncAction?: SyncActionRequest | null;
  /** kind 为 github-* 时的授权载荷，完成处理后 code 覆写为 null */
  githubAction?: { code: string | null } | null;
  /** kind 为 profile-credential 时的载荷，处理完或等待超时后 apiKey 覆写为 null */
  profileCredential?: ProfileCredentialAction | null;
  /** done：发起一轮时为 runId 与调用数；sync-data 为 syncResult；data-repo-status 为 statusResult；github 为 githubConnection */
  result: {
    runId?: string;
    calls?: number;
    error?: string;
    syncResult?: SyncActionResult;
    statusResult?: {
      repo: DataRepoStatus["repo"];
      manifest: DataRepoStatus["manifest"];
      github?: GithubConnection;
      pushCapability?: PushCapability;
    };
    githubConnection?: GithubConnection;
    githubDisconnectResult?: { revoked: boolean; revokeError?: string };
  } | null;
}

/** 探测约需十几秒（agy 列模型要联网） */
const PROBE_TIMEOUT_MS = 90_000;
/** 执行器代答数据仓状态默认等待时间（毫秒） */
const DATA_REPO_STATUS_TIMEOUT_MS = 10_000;

/** 让执行器重新探测能力目录，完成后读回缓存；执行器不在或失败时为 null */
export async function probeViaRunner(): Promise<CapabilitySnapshot | null> {
  const settled = await waitForRequest((await enqueueRequest("probe-capabilities")).id, PROBE_TIMEOUT_MS);
  return settled?.state === "done" ? readCachedCatalog() : null;
}

/** 让执行器代答数据仓状态；超时或失败返回 null */
export async function requestRunnerDataRepoStatus(
  timeoutMs: number = DATA_REPO_STATUS_TIMEOUT_MS,
): Promise<{
  repo: DataRepoStatus["repo"];
  manifest: DataRepoStatus["manifest"];
  github?: GithubConnection;
  pushCapability?: PushCapability;
} | null> {
  const req = await enqueueRequest("data-repo-status");
  const settled = await waitForRequest(req.id, timeoutMs);
  return settled?.state === "done" ? (settled.result?.statusResult ?? null) : null;
}

const GITHUB_REQUEST_TIMEOUT_MS = 60_000;

/** 写入或删除某个 profile 的 API key；分容器时只有执行器能写凭据目录 */
export interface ProfileCredentialAction {
  op: "set" | "delete";
  cli: CliKind;
  name: string;
  /** op 为 set 时的 key；落盘后即抹掉，不在请求文件里久留 */
  apiKey: string | null;
}

const PROFILE_CREDENTIAL_TIMEOUT_MS = 15_000;

/** 让执行器代写 profile 的 API key；未在时限内完成时抹掉请求里的 key 并返回错误 */
export async function requestRunnerProfileCredential(
  action: ProfileCredentialAction,
  timeoutMs: number = PROFILE_CREDENTIAL_TIMEOUT_MS,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const req = await enqueueRequest("profile-credential", { profileCredential: action });
  const settled = await waitForRequest(req.id, timeoutMs);
  if (settled?.state === "done") return { ok: true };
  await scrubProfileKey(req.id).catch(() => {});
  return { ok: false, error: settled?.result?.error ?? "执行器未响应，API key 未保存" };
}

async function scrubProfileKey(id: string): Promise<void> {
  const current = await readRequest(id);
  if (current?.profileCredential?.apiKey) {
    await save({ ...current, profileCredential: { ...current.profileCredential, apiKey: null } });
  }
}

/** 让执行器代办 GitHub App 授权动作；超时或失败返回错误描述 */
export async function requestRunnerGithubAction(
  kind: "github-app-convert" | "github-token-exchange" | "github-disconnect",
  code?: string | null,
  timeoutMs: number = GITHUB_REQUEST_TIMEOUT_MS,
): Promise<{
  ok: boolean;
  connection?: GithubConnection;
  disconnectResult?: { revoked: boolean; revokeError?: string };
  error?: string;
}> {
  const req = await enqueueRequest(kind, {
    githubAction: code ? { code } : null,
  });
  const settled = await waitForRequest(req.id, timeoutMs);
  if (settled?.state === "done") {
    return {
      ok: true,
      connection: settled.result?.githubConnection,
      disconnectResult: settled.result?.githubDisconnectResult,
    };
  }
  if (code) {
    await clearRequestCode(req.id).catch(() => {});
  }
  return {
    ok: false,
    error: settled?.result?.error ?? "执行器未响应 GitHub 授权请求",
  };
}

export function requestsDir(): string {
  return join(dataRoot(), REQUESTS_DIR);
}

export interface EnqueuePayload {
  selection?: RunSelection | null;
  syncAction?: SyncActionRequest | null;
  githubAction?: { code: string | null } | null;
  profileCredential?: ProfileCredentialAction | null;
}

export async function enqueueRequest(
  kind: RequestKind,
  payload: RunSelection | EnqueuePayload | null = null,
  now: Date = new Date(),
): Promise<RunnerRequest> {
  let selection: RunSelection | null = null;
  let syncAction: SyncActionRequest | null = null;
  let githubAction: { code: string | null } | null = null;
  let profileCredential: ProfileCredentialAction | null = null;

  if (payload !== null) {
    if (
      "syncAction" in payload ||
      "githubAction" in payload ||
      "profileCredential" in payload ||
      ("selection" in payload && payload.selection !== undefined)
    ) {
      const p = payload as EnqueuePayload;
      selection = p.selection ?? null;
      syncAction = p.syncAction ?? null;
      githubAction = p.githubAction ?? null;
      profileCredential = p.profileCredential ?? null;
    } else {
      selection = payload as RunSelection;
    }
  }

  const request: RunnerRequest = {
    id: `${now.toISOString().replace(/[-:.]/g, "")}-${randomBytes(4).toString("hex")}`,
    kind,
    state: "pending",
    requestedAt: now.toISOString(),
    claimedAt: null,
    finishedAt: null,
    selection,
    ...(syncAction !== null ? { syncAction } : {}),
    ...(githubAction !== null ? { githubAction } : {}),
    ...(profileCredential !== null ? { profileCredential } : {}),
    result: null,
  };
  await mkdir(requestsDir(), { recursive: true });
  await save(request);
  return request;
}

export async function readRequest(id: string): Promise<RunnerRequest | null> {
  try {
    return JSON.parse(await readFile(join(requestsDir(), `${id}.json`), "utf8")) as RunnerRequest;
  } catch {
    return null;
  }
}

/** 等到请求进入终态或超时；超时返回最后看到的状态（可能仍是 pending） */
export async function waitForRequest(id: string, timeoutMs: number): Promise<RunnerRequest | null> {
  const deadline = Date.now() + timeoutMs;
  let latest: RunnerRequest | null = null;
  while (Date.now() < deadline) {
    latest = await readRequest(id);
    if (latest !== null && (latest.state === "done" || latest.state === "failed")) return latest;
    await sleep(POLL_MS);
  }
  return latest;
}

/** 执行器：认领最早的 pending 请求；没有则 null */
export async function claimNextRequest(now: Date = new Date()): Promise<RunnerRequest | null> {
  const pending = (await listRequests()).filter((request) => request.state === "pending");
  const next = pending.sort((a, b) => a.requestedAt.localeCompare(b.requestedAt))[0];
  if (next === undefined) return null;
  const claimed: RunnerRequest = { ...next, state: "claimed", claimedAt: now.toISOString() };
  await save(claimed);
  return claimed;
}

export async function completeRequest(id: string, result: NonNullable<RunnerRequest["result"]>, now: Date = new Date()): Promise<void> {
  await settle(id, "done", result, now);
}

export async function failRequest(id: string, error: string, now: Date = new Date()): Promise<void> {
  await settle(id, "failed", { error }, now);
}

/** 删除处理完超过一小时的请求文件 */
export async function pruneRequests(now: Date = new Date()): Promise<number> {
  let removed = 0;
  for (const request of await listRequests()) {
    if (request.finishedAt === null || now.getTime() - Date.parse(request.finishedAt) < KEEP_FINISHED_MS) continue;
    await unlink(join(requestsDir(), `${request.id}.json`)).catch(() => {});
    removed += 1;
  }
  return removed;
}

async function listRequests(): Promise<RunnerRequest[]> {
  let names: string[];
  try {
    names = await readdir(requestsDir());
  } catch {
    return [];
  }
  const found: RunnerRequest[] = [];
  for (const name of names) {
    if (!name.endsWith(".json")) continue;
    const request = await readRequest(name.slice(0, -".json".length));
    if (request !== null) found.push(request);
  }
  return found;
}

async function settle(
  id: string,
  state: "done" | "failed",
  result: NonNullable<RunnerRequest["result"]>,
  now: Date,
): Promise<void> {
  const current = await readRequest(id);
  if (current === null) return;
  const githubAction = current.githubAction
    ? { ...current.githubAction, code: null }
    : undefined;
  const profileCredential = current.profileCredential
    ? { ...current.profileCredential, apiKey: null }
    : undefined;
  await save({
    ...current,
    state,
    finishedAt: now.toISOString(),
    result,
    ...(githubAction !== undefined ? { githubAction } : {}),
    ...(profileCredential !== undefined ? { profileCredential } : {}),
  });
}

/**
 * 抹除请求中的授权码 (code)
 */
export async function clearRequestCode(id: string): Promise<void> {
  const current = await readRequest(id);
  if (current?.githubAction?.code) {
    await save({
      ...current,
      githubAction: { ...current.githubAction, code: null },
    });
  }
}

const STALE_GITHUB_REQUEST_MS = 60 * 60 * 1000;

/**
 * 清理超过 1 小时的未完成 github-* 请求中的 code
 */
export async function cleanStaleGithubRequestCodes(
  now: Date = new Date(),
): Promise<number> {
  let cleaned = 0;
  for (const request of await listRequests()) {
    if (
      request.kind.startsWith("github-") &&
      request.githubAction?.code &&
      (request.state === "pending" || request.state === "claimed") &&
      now.getTime() - Date.parse(request.requestedAt) >= STALE_GITHUB_REQUEST_MS
    ) {
      await save({
        ...request,
        githubAction: { ...request.githubAction, code: null },
      });
      cleaned += 1;
    }
  }
  return cleaned;
}

/** 写临时文件再原子替换：看板随时可能在读 */
async function save(request: RunnerRequest): Promise<void> {
  const target = join(requestsDir(), `${request.id}.json`);
  const staging = `${target}.staging`;
  await writeFile(staging, `${JSON.stringify(request, null, 2)}\n`, "utf8");
  await rename(staging, target);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

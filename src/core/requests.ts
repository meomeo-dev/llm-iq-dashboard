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
import { withAuthFileLock } from "./auth/store";
import type { ProbeId } from "./model-fingerprint/types";
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
const REQUESTS_LOCK_NAME = "requests.lock";
const POLL_MS = 250;
/** 处理完的请求文件保留这么久，便于排查 */
const KEEP_FINISHED_MS = 60 * 60 * 1000;
/** 请求默认有效期：超过后仍处于 pending 的请求在认领时自动作废，防止迟到认领产生幽灵任务 */
export const DEFAULT_REQUEST_TTL_MS = 2 * 60 * 1000;

export type RequestKind =
  | "run"
  | "check-readiness"
  | "probe-capabilities"
  | "sync-data"
  | "data-repo-status"
  | "github-app-convert"
  | "github-token-exchange"
  | "github-disconnect"
  | "profile-credential"
  | "profile-models"
  | "fingerprint-fill"
  | "fingerprint-check";
export type RequestState = "pending" | "claimed" | "done" | "failed";

export interface FingerprintFillRequestPayload {
  cli?: CliKind;
  profile?: string;
  profilesByCli?: Partial<Record<CliKind, string>>;
  model?: string;
  probes?: ProbeId[];
  count?: number;
  exclude?: string[];
  include?: string[];
  reset?: boolean;
}

export interface FingerprintCheckTargetPayload {
  cli: CliKind;
  profile?: string;
  model: string;
  probes?: ProbeId[];
}

export interface FingerprintCheckRequestPayload extends FingerprintCheckTargetPayload {
  targets?: FingerprintCheckTargetPayload[];
}

export interface RunnerRequest {
  id: string;
  kind: RequestKind;
  state: RequestState;
  requestedAt: string;
  /** pending 请求的有效期；超过该时刻仍未被认领则在认领时自动置为 failed */
  expiresAt?: string | null;
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
  /** kind 为 profile-models 时要拉模型清单的 profile；只读，不含 key */
  profileTarget?: { cli: CliKind; name: string } | null;
  /** kind 为 fingerprint-fill 时的参数 */
  fingerprintFill?: FingerprintFillRequestPayload | null;
  /** kind 为 fingerprint-check 时的参数 */
  fingerprintCheck?: FingerprintCheckRequestPayload | null;
  /** done：发起一轮时为 runId 与调用数；sync-data 为 syncResult；data-repo-status 为 statusResult；github 为 githubConnection */
  result: {
    runId?: string;
    jobId?: string;
    checkId?: string;
    checkIds?: string[];
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
    /** profile-models：上游返回的模型标识 */
    profileModels?: string[];
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
  await expirePendingRequest(req.id, "执行器未响应，API key 未保存").catch(() => {});
  await scrubProfileKey(req.id).catch(() => {});
  return { ok: false, error: settled?.result?.error ?? "执行器未响应，API key 未保存" };
}

const PROFILE_MODELS_TIMEOUT_MS = 30_000;

/** 让执行器用凭据目录里的 key 拉上游模型清单；载荷只有 profile 名，不含 key */
export async function requestRunnerProfileModels(
  target: Pick<ProfileCredentialAction, "cli" | "name">,
  timeoutMs: number = PROFILE_MODELS_TIMEOUT_MS,
): Promise<{ ok: true; models: string[] } | { ok: false; error: string }> {
  const req = await enqueueRequest("profile-models", { profileTarget: target });
  const settled = await waitForRequest(req.id, timeoutMs);
  if (settled?.state === "done") return { ok: true, models: settled.result?.profileModels ?? [] };
  return { ok: false, error: settled?.result?.error ?? "执行器未响应，未能拉取模型清单" };
}

async function scrubProfileKey(id: string): Promise<void> {
  await withAuthFileLock(REQUESTS_LOCK_NAME, async () => {
    const current = await readRequest(id);
    if (current?.profileCredential?.apiKey) {
      await save(scrubSecretsOf(current));
    }
  });
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
  await expirePendingRequest(req.id, "执行器未响应 GitHub 授权请求").catch(() => {});
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
  profileTarget?: { cli: CliKind; name: string } | null;
  fingerprintFill?: FingerprintFillRequestPayload | null;
  fingerprintCheck?: FingerprintCheckRequestPayload | null;
  ttlMs?: number | null;
}

function normalizePayload(payload: RunSelection | EnqueuePayload | null): Required<EnqueuePayload> {
  if (payload === null) {
    return {
      selection: null, syncAction: null, githubAction: null,
      profileCredential: null, profileTarget: null, fingerprintFill: null, fingerprintCheck: null, ttlMs: null,
    };
  }
  if (
    "syncAction" in payload ||
    "githubAction" in payload ||
    "profileCredential" in payload ||
    "profileTarget" in payload ||
    "fingerprintFill" in payload ||
    "fingerprintCheck" in payload ||
    "ttlMs" in payload ||
    ("selection" in payload && payload.selection !== undefined)
  ) {
    const p = payload as EnqueuePayload;
    return {
      selection: p.selection ?? null,
      syncAction: p.syncAction ?? null,
      githubAction: p.githubAction ?? null,
      profileCredential: p.profileCredential ?? null,
      profileTarget: p.profileTarget ?? null,
      fingerprintFill: p.fingerprintFill ?? null,
      fingerprintCheck: p.fingerprintCheck ?? null,
      ttlMs: p.ttlMs ?? null,
    };
  }
  return {
    selection: payload as RunSelection, syncAction: null, githubAction: null,
    profileCredential: null, profileTarget: null, fingerprintFill: null, fingerprintCheck: null, ttlMs: null,
  };
}

export async function enqueueRequest(
  kind: RequestKind,
  payload: RunSelection | EnqueuePayload | null = null,
  now: Date = new Date(),
): Promise<RunnerRequest> {
  const norm = normalizePayload(payload);
  const ttlMs = norm.ttlMs ?? DEFAULT_REQUEST_TTL_MS;
  const request: RunnerRequest = {
    id: `${now.toISOString().replace(/[-:.]/g, "")}-${randomBytes(4).toString("hex")}`,
    kind,
    state: "pending",
    requestedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ttlMs).toISOString(),
    claimedAt: null,
    finishedAt: null,
    selection: norm.selection,
    ...(norm.syncAction !== null ? { syncAction: norm.syncAction } : {}),
    ...(norm.githubAction !== null ? { githubAction: norm.githubAction } : {}),
    ...(norm.profileCredential !== null ? { profileCredential: norm.profileCredential } : {}),
    ...(norm.profileTarget !== null ? { profileTarget: norm.profileTarget } : {}),
    ...(norm.fingerprintFill !== null ? { fingerprintFill: norm.fingerprintFill } : {}),
    ...(norm.fingerprintCheck !== null ? { fingerprintCheck: norm.fingerprintCheck } : {}),
    result: null,
  };
  await mkdir(requestsDir(), { recursive: true, mode: 0o700 });
  await withAuthFileLock(REQUESTS_LOCK_NAME, () => save(request));
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

function scrubSecretsOf(request: RunnerRequest): RunnerRequest {
  const githubAction = request.githubAction ? { ...request.githubAction, code: null } : undefined;
  const profileCredential = request.profileCredential
    ? { ...request.profileCredential, apiKey: null }
    : undefined;
  return {
    ...request,
    ...(githubAction !== undefined ? { githubAction } : {}),
    ...(profileCredential !== undefined ? { profileCredential } : {}),
  };
}

/** 执行器：认领最早的未过期 pending 请求；已过期的 pending 请求自动标为 failed */
export async function claimNextRequest(now: Date = new Date()): Promise<RunnerRequest | null> {
  return withAuthFileLock(REQUESTS_LOCK_NAME, async () => {
    const pending = (await listRequests())
      .filter((request) => request.state === "pending")
      .sort((a, b) => a.requestedAt.localeCompare(b.requestedAt));
    for (const candidate of pending) {
      if (candidate.expiresAt != null && Date.parse(candidate.expiresAt) <= now.getTime()) {
        await save({
          ...scrubSecretsOf(candidate),
          state: "failed",
          finishedAt: now.toISOString(),
          result: { error: "请求已过期，未在有效期内被执行器认领" },
        });
        continue;
      }
      const claimed: RunnerRequest = { ...candidate, state: "claimed", claimedAt: now.toISOString() };
      await save(claimed);
      return claimed;
    }
    return null;
  });
}

/**
 * 若请求仍处于 pending 状态，则原子将其置为 failed 并抹除敏感字段；
 * 若请求已被执行器认领（claimed）或已进入终态（done / failed），则保留原状态并返回当前记录。
 */
export async function expirePendingRequest(
  id: string,
  error: string = "等待执行器响应超时，请求已取消",
  now: Date = new Date(),
): Promise<RunnerRequest | null> {
  return withAuthFileLock(REQUESTS_LOCK_NAME, async () => {
    const current = await readRequest(id);
    if (current === null) return null;
    if (current.state !== "pending") return current;
    const expired: RunnerRequest = {
      ...scrubSecretsOf(current),
      state: "failed",
      finishedAt: now.toISOString(),
      result: { error },
    };
    await save(expired);
    return expired;
  });
}

export async function completeRequest(id: string, result: NonNullable<RunnerRequest["result"]>, now: Date = new Date()): Promise<void> {
  await settle(id, "done", result, now);
}

export async function failRequest(id: string, error: string, now: Date = new Date()): Promise<void> {
  await settle(id, "failed", { error }, now);
}

/** 删除处理完超过一小时的请求文件，并顺带抹除滞留请求中的敏感凭据 */
export async function pruneRequests(now: Date = new Date()): Promise<number> {
  await cleanStaleGithubRequestCodes(now).catch(() => {});
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
  await withAuthFileLock(REQUESTS_LOCK_NAME, async () => {
    const current = await readRequest(id);
    if (current === null) return;
    await save({
      ...scrubSecretsOf(current),
      state,
      finishedAt: now.toISOString(),
      result,
    });
  });
}

/** 抹除请求中的授权码 (code) */
export async function clearRequestCode(id: string): Promise<void> {
  await withAuthFileLock(REQUESTS_LOCK_NAME, async () => {
    const current = await readRequest(id);
    if (current?.githubAction?.code) {
      await save(scrubSecretsOf(current));
    }
  });
}

const STALE_GITHUB_REQUEST_MS = 60 * 60 * 1000;
const STALE_CREDENTIAL_REQUEST_MS = 5 * 60 * 1000;

/** 清理滞留请求中的一次性授权码 (githubAction.code) 与 API key (profileCredential.apiKey) */
export async function cleanStaleGithubRequestCodes(
  now: Date = new Date(),
): Promise<number> {
  return withAuthFileLock(REQUESTS_LOCK_NAME, async () => {
    let cleaned = 0;
    for (const request of await listRequests()) {
      const ageMs = now.getTime() - Date.parse(request.requestedAt);
      const staleGithub =
        request.kind.startsWith("github-") &&
        Boolean(request.githubAction?.code) &&
        (request.state === "pending" || request.state === "claimed") &&
        ageMs >= STALE_GITHUB_REQUEST_MS;
      const staleProfileKey =
        Boolean(request.profileCredential?.apiKey) &&
        (request.state === "pending" || request.state === "claimed") &&
        ageMs >= STALE_CREDENTIAL_REQUEST_MS;
      if (staleGithub || staleProfileKey) {
        await save(scrubSecretsOf(request));
        cleaned += 1;
      }
    }
    return cleaned;
  });
}

/** 写 0600 临时文件再原子替换：看板随时可能在读 */
async function save(request: RunnerRequest): Promise<void> {
  const target = join(requestsDir(), `${request.id}.json`);
  const staging = `${target}.${process.pid}.${Date.now()}.${randomBytes(3).toString("hex")}.staging`;
  await writeFile(staging, `${JSON.stringify(request, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  await rename(staging, target);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

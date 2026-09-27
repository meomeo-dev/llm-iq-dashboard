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
import type {
  DataRepoStatus,
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
  | "data-repo-status";
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
  /** done：发起一轮时为 runId 与调用数；sync-data 为 syncResult；data-repo-status 为 statusResult；failed：原因 */
  result: {
    runId?: string;
    calls?: number;
    error?: string;
    syncResult?: SyncActionResult;
    statusResult?: {
      repo: DataRepoStatus["repo"];
      manifest: DataRepoStatus["manifest"];
    };
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
} | null> {
  const req = await enqueueRequest("data-repo-status");
  const settled = await waitForRequest(req.id, timeoutMs);
  return settled?.state === "done" ? (settled.result?.statusResult ?? null) : null;
}

export function requestsDir(): string {
  return join(dataRoot(), REQUESTS_DIR);
}

export interface EnqueuePayload {
  selection?: RunSelection | null;
  syncAction?: SyncActionRequest | null;
}

export async function enqueueRequest(
  kind: RequestKind,
  payload: RunSelection | EnqueuePayload | null = null,
  now: Date = new Date(),
): Promise<RunnerRequest> {
  let selection: RunSelection | null = null;
  let syncAction: SyncActionRequest | null = null;

  if (payload !== null) {
    if ("syncAction" in payload || ("selection" in payload && payload.selection !== undefined)) {
      const p = payload as EnqueuePayload;
      selection = p.selection ?? null;
      syncAction = p.syncAction ?? null;
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

async function settle(id: string, state: "done" | "failed", result: NonNullable<RunnerRequest["result"]>, now: Date): Promise<void> {
  const current = await readRequest(id);
  if (current === null) return;
  await save({ ...current, state, finishedAt: now.toISOString(), result });
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

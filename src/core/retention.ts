/**
 * 历史轮次的滚动保留与修剪分级守卫（retention guard）。
 *
 * 规则：
 * 1. 过期且台账为 published：删除；
 * 2. 过期且台账为 skipped/unpublishable-prompt、skipped/empty 或 skipped/discarded（所有者丢弃）：删除；
 * 3. 过期且台账为 skipped/rejected：永不自动删除，汇总日志“保留 N 个被拒绝的过期轮次（需人工处理）”；
 * 4. 残轮判定：只有 run.json 不存在（ENOENT）或解析成功且 inProgress === true 才算残轮；
 *    读取失败（EACCES 等）或 JSON 损坏一律保留并记日志。
 *    台账已有 exported / published / skipped(rejected) 记录的轮次不走 abandoned 分支，不得被改写；
 *    残轮过期超过保留期两倍（now - runIdTime > 2 × retentionDays），在删除目录前重新读取最新台账并合并
 *    skipped/abandoned 记录原子保存后再删除；未超过两倍时保持现状（保留）；
 *    skipped/abandoned 但 run.json 完整且非 inProgress 的轮次不删除（按普通未发布轮次保留）；
 * 5. 过期空目录照旧删除；
 * 6. 其他未发布的过期轮次保留，并汇总记一行日志“保留 N 个未发布的过期轮次”；
 * 7. 台账读不到（文件不存在）等价于“全部未发布”；
 * 8. 修剪复用数据仓动作锁（data-repo-action-lock），拿不到锁时跳过修剪。
 */

import { readdir, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import type { Logger } from "./runner";
import { runDir } from "./paths";
import { listRunIds, runIdTime } from "./store";
import {
  loadSyncLedger,
  saveSyncLedger,
  type RunSyncRecord,
} from "./sync/sync-ledger";
import { acquireDataRepoSyncLock } from "./sync/data-repo-action-lock";

const DAY_MS = 24 * 60 * 60 * 1000;

/** 过期即删的跳过原因与日志里的叫法 */
const SKIPPED_PRUNE_LABELS = {
  "unpublishable-prompt": "过期不可发布轮次",
  empty: "过期空轮次",
  discarded: "过期已丢弃轮次",
} as const;
const RUN_FILE = "run.json";

type PruneOutcome = "deleted" | "unpublished" | "rejected" | "retained";

type RunFileInspection =
  | { kind: "missing" }
  | { kind: "in-progress" }
  | { kind: "completed" }
  | { kind: "error" };

async function removeExpiredDir(
  dir: string,
  runId: string,
  label: string,
  log: Logger,
): Promise<boolean> {
  try {
    await rm(dir, { recursive: true, force: true });
    return true;
  } catch (cause) {
    log(`清理${label} ${runId} 失败：${cause instanceof Error ? cause.message : cause}`);
    return false;
  }
}

async function readDirFiles(
  dir: string,
  runId: string,
  log: Logger,
): Promise<string[] | null> {
  try {
    return await readdir(dir);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      log(`读取过期轮次目录 ${runId} 失败：${err instanceof Error ? err.message : err}`);
    }
    return null;
  }
}

async function checkRunFile(
  dir: string,
  runId: string,
  log: Logger,
): Promise<RunFileInspection> {
  const filePath = join(dir, RUN_FILE);
  let content: string;
  try {
    content = await readFile(filePath, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return { kind: "missing" };
    }
    const msg = err instanceof Error ? err.message : String(err);
    log(`读取过期轮次 ${runId} 的 ${RUN_FILE} 失败：${msg}`);
    return { kind: "error" };
  }

  try {
    const parsed = JSON.parse(content) as { inProgress?: unknown };
    if (parsed && typeof parsed === "object" && parsed.inProgress === true) {
      return { kind: "in-progress" };
    }
    return { kind: "completed" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log(`过期轮次 ${runId} 的 ${RUN_FILE} 损坏：${msg}`);
    return { kind: "error" };
  }
}

async function markAbandonedAndPrune(
  dir: string,
  runId: string,
  nowIso: string,
  customDataDir: string | undefined,
  log: Logger,
): Promise<PruneOutcome> {
  const latestLedger = await loadSyncLedger(customDataDir);
  const currentRecord = latestLedger[runId];
  if (currentRecord?.status === "published") {
    const del = await removeExpiredDir(dir, runId, "过期轮次", log);
    return del ? "deleted" : "retained";
  }
  if (currentRecord?.status === "exported") return "unpublished";
  if (currentRecord?.status === "skipped" && currentRecord.reason === "rejected") {
    return "rejected";
  }

  if (currentRecord?.status !== "skipped" || currentRecord.reason !== "abandoned") {
    latestLedger[runId] = {
      status: "skipped",
      reason: "abandoned",
      skippedAt: nowIso,
    };
    await saveSyncLedger(latestLedger, customDataDir);
  }

  const del = await removeExpiredDir(dir, runId, "过期残轮", log);
  return del ? "deleted" : "retained";
}

async function handleResidualRun(
  dir: string,
  runId: string,
  runTime: Date,
  doubleCutoff: number,
  record: RunSyncRecord | undefined,
  nowIso: string,
  customDataDir: string | undefined,
  log: Logger,
): Promise<PruneOutcome> {
  if (record?.status === "published") {
    const del = await removeExpiredDir(dir, runId, "过期轮次", log);
    return del ? "deleted" : "retained";
  }
  if (record?.status === "exported") return "unpublished";
  if (record?.status === "skipped" && record.reason === "rejected") return "rejected";
  if (runTime.getTime() >= doubleCutoff) return "retained";

  return markAbandonedAndPrune(dir, runId, nowIso, customDataDir, log);
}

async function handleCompletedRun(
  dir: string,
  runId: string,
  record: RunSyncRecord | undefined,
  log: Logger,
): Promise<PruneOutcome> {
  if (record?.status === "published") {
    const del = await removeExpiredDir(dir, runId, "过期轮次", log);
    return del ? "deleted" : "retained";
  }
  if (record?.status === "skipped") {
    if (record.reason === "unpublishable-prompt" || record.reason === "empty" || record.reason === "discarded") {
      const label = SKIPPED_PRUNE_LABELS[record.reason];
      const del = await removeExpiredDir(dir, runId, label, log);
      return del ? "deleted" : "retained";
    }
    if (record.reason === "rejected") {
      return "rejected";
    }
    // skipped/abandoned 但 run.json 完整且非 inProgress 的轮次不删除（按普通未发布轮次保留）
    if (record.reason === "abandoned") {
      return "unpublished";
    }
  }
  return "unpublished";
}

async function inspectAndPruneRun(
  runId: string,
  runTime: Date,
  doubleCutoff: number,
  record: RunSyncRecord | undefined,
  nowIso: string,
  customDataDir: string | undefined,
  log: Logger,
): Promise<PruneOutcome> {
  const dir = runDir(runId);
  const files = await readDirFiles(dir, runId, log);
  if (files === null) return "retained";
  if (files.length === 0) {
    const del = await removeExpiredDir(dir, runId, "过期空目录", log);
    return del ? "deleted" : "retained";
  }

  const fileStatus = await checkRunFile(dir, runId, log);
  if (fileStatus.kind === "error") {
    return "retained";
  }
  if (fileStatus.kind === "missing" || fileStatus.kind === "in-progress") {
    return handleResidualRun(
      dir,
      runId,
      runTime,
      doubleCutoff,
      record,
      nowIso,
      customDataDir,
      log,
    );
  }
  return handleCompletedRun(dir, runId, record, log);
}

async function collectExpiredEntries(
  cutoff: number,
): Promise<Array<{ runId: string; at: Date }>> {
  const expiredEntries: Array<{ runId: string; at: Date }> = [];
  for (const id of await listRunIds()) {
    const at = runIdTime(id);
    if (at !== null && at.getTime() < cutoff) {
      expiredEntries.push({ runId: id, at });
    }
  }
  return expiredEntries;
}

function logPruningSummary(
  retentionDays: number,
  counts: { deleted: number; unpublished: number; rejected: number },
  log: Logger,
): void {
  if (counts.rejected > 0) log(`保留 ${counts.rejected} 个被拒绝的过期轮次（需人工处理）`);
  if (counts.unpublished > 0) log(`保留 ${counts.unpublished} 个未发布的过期轮次`);
  if (counts.deleted > 0) log(`按 ${retentionDays} 天保留期清理了 ${counts.deleted} 个过期轮次`);
}

/**
 * 带有修剪分级守卫的过期清理。
 */
export async function pruneExpiredRuns(
  retentionDays: number,
  log: Logger,
  now = new Date(),
  customDataDir?: string,
): Promise<void> {
  const lock = await acquireDataRepoSyncLock(customDataDir);
  if (!lock.acquired) {
    log(`获取同步锁失败，跳过本轮修剪：${lock.reason ?? "已有一个数据仓动作正在执行"}`);
    return;
  }

  try {
    const cutoff = now.getTime() - retentionDays * DAY_MS;
    const doubleCutoff = now.getTime() - 2 * retentionDays * DAY_MS;
    const nowIso = now.toISOString();
    const expiredEntries = await collectExpiredEntries(cutoff);
    const ledger = await loadSyncLedger(customDataDir);
    const counts = { deleted: 0, unpublished: 0, rejected: 0 };

    for (const { runId, at } of expiredEntries) {
      const outcome = await inspectAndPruneRun(
        runId,
        at,
        doubleCutoff,
        ledger[runId],
        nowIso,
        customDataDir,
        log,
      );
      if (outcome === "deleted") counts.deleted += 1;
      else if (outcome === "unpublished") counts.unpublished += 1;
      else if (outcome === "rejected") counts.rejected += 1;
    }

    logPruningSummary(retentionDays, counts, log);
  } finally {
    await lock.release();
  }
}

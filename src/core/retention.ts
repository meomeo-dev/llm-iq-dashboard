/**
 * 历史轮次的滚动保留与修剪守卫（retention guard）。
 *
 * 规则：
 * 1. 过期且台账为 published 才删除；
 * 2. 未发布的过期轮次保留，并汇总记一行日志；
 * 3. 过期且目录为空的可以删除；
 * 4. 只有 progress.json 等过程文件、没有 run.json 的过期目录保留；
 * 5. 台账读不到（文件不存在）等价于“全部未发布”。
 */

import { readdir, rm } from "node:fs/promises";
import type { Logger } from "./runner";
import { runDir } from "./paths";
import { listRunIds, runIdTime } from "./store";
import { loadSyncLedger } from "./sync/sync-ledger";

const DAY_MS = 24 * 60 * 60 * 1000;
const RUN_FILE = "run.json";

/**
 * 带有修剪守卫的过期清理。
 */
export async function pruneExpiredRuns(
  retentionDays: number,
  log: Logger,
  now = new Date(),
): Promise<void> {
  const cutoff = now.getTime() - retentionDays * DAY_MS;
  const expiredIds = (await listRunIds()).filter((id) => {
    const at = runIdTime(id);
    return at !== null && at.getTime() < cutoff;
  });

  const ledger = await loadSyncLedger();

  let deletedCount = 0;
  let unPublishedCount = 0;

  for (const runId of expiredIds) {
    const dir = runDir(runId);
    let files: string[] = [];
    try {
      files = await readdir(dir);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        continue;
      }
      log(
        `读取过期轮次目录 ${runId} 失败：${err instanceof Error ? err.message : err}`,
      );
      continue;
    }

    // 1. 空目录：可以删除
    if (files.length === 0) {
      try {
        await rm(dir, { recursive: true, force: true });
        deletedCount += 1;
      } catch (cause) {
        log(`清理过期空目录 ${runId} 失败：${cause instanceof Error ? cause.message : cause}`);
      }
      continue;
    }

    // 2. 只有过程文件没有 run.json：保留不删
    const hasRunJson = files.includes(RUN_FILE);
    if (!hasRunJson) {
      continue;
    }

    // 3. 有 run.json：检查是否已 published
    const syncRecord = ledger[runId];
    if (syncRecord?.status === "published") {
      try {
        await rm(dir, { recursive: true, force: true });
        deletedCount += 1;
      } catch (cause) {
        log(`清理过期轮次 ${runId} 失败：${cause instanceof Error ? cause.message : cause}`);
      }
    } else {
      unPublishedCount += 1;
    }
  }

  if (unPublishedCount > 0) {
    log(`保留 ${unPublishedCount} 个未发布的过期轮次`);
  }
  if (deletedCount > 0) {
    log(`按 ${retentionDays} 天保留期清理了 ${deletedCount} 个过期轮次`);
  }
}

/**
 * 历史轮次的滚动保留：只留最近 N 天，更早的整轮目录一并删除。
 *
 * 年龄按 runId 中的开始时刻判断而非 mtime：进行中的一轮会反复重写 run.json。
 */

import { rm } from "node:fs/promises";
import type { Logger } from "./runner";
import { runDir } from "./paths";
import { listRunIds, runIdTime } from "./store";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 删除开始时刻早于 now - retentionDays 天的轮次；非 runId 形式的目录不动，
 * 单个目录删除失败只记日志。
 */
export async function pruneExpiredRuns(retentionDays: number, log: Logger, now = new Date()): Promise<void> {
  const cutoff = now.getTime() - retentionDays * DAY_MS;
  const expired = (await listRunIds()).filter((id) => {
    const at = runIdTime(id);
    return at !== null && at.getTime() < cutoff;
  });

  for (const runId of expired) {
    try {
      await rm(runDir(runId), { recursive: true, force: true });
    } catch (cause) {
      log(`清理过期轮次 ${runId} 失败：${cause instanceof Error ? cause.message : cause}`);
    }
  }
  if (expired.length > 0) log(`按 ${retentionDays} 天保留期清理了 ${expired.length} 个过期轮次`);
}

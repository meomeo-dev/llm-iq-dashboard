/**
 * 同步台账 skipped 记录写入辅助函数（ledger-skip）。
 */

import type { SyncLedger } from "./sync-ledger";

/**
 * 记录不可发布题目导致的跳过。
 * 已是 exported/published 的记录不得被覆盖为 skipped。
 * 原因相同的已有 skipped 记录保留原 skippedAt，不计入本次新增，返回 false。
 * 返回是否有写入修改。
 */
export function recordSkippedUnpublishable(
  ledger: SyncLedger,
  runId: string,
  nowIso = new Date().toISOString(),
): boolean {
  const existing = ledger[runId];
  if (existing?.status === "exported" || existing?.status === "published") {
    return false;
  }
  if (existing?.status === "skipped" && existing.reason === "unpublishable-prompt") {
    return false;
  }
  ledger[runId] = {
    status: "skipped",
    reason: "unpublishable-prompt",
    skippedAt: nowIso,
  };
  return true;
}

/**
 * 记录泄漏扫描拦截导致的拒绝。
 * details 仅保留文件名与规则名，绝不记录命中的原文。
 * 已是 exported/published 的记录不得被覆盖为 skipped。
 * 原因相同的已有 skipped 记录保留原 skippedAt，不计入本次新增，返回 false。
 * 返回是否有写入修改。
 */
export function recordSkippedRejected(
  ledger: SyncLedger,
  runId: string,
  reasons: readonly { file: string; reason: string }[],
  nowIso = new Date().toISOString(),
): boolean {
  const existing = ledger[runId];
  if (existing?.status === "exported" || existing?.status === "published") {
    return false;
  }
  if (existing?.status === "skipped" && existing.reason === "rejected") {
    return false;
  }
  ledger[runId] = {
    status: "skipped",
    reason: "rejected",
    skippedAt: nowIso,
    details: reasons.map((r) => ({ file: r.file, reason: r.reason })),
  };
  return true;
}

/**
 * 所有者对待导出轮次的台账决定：丢弃（不发布）与恢复，以及导出子集的沿用规则。
 *
 * 丢弃记为 skipped/discarded：不再出现在待导出清单，任何同步（含不带清单的整批同步）都不导出它；
 * 本地目录不立即删除，过了保留期由修剪按不发布轮次删除。恢复只撤销丢弃，别的跳过原因不动。
 */

import { loadSyncLedger, saveSyncLedger, type RunSyncRecord, type SyncLedger } from "./sync-ledger";

export interface LedgerDecisionReport {
  /** 本次状态有变化的轮次 */
  changed: string[];
  /** 状态不允许改或已是目标状态的轮次，附原因 */
  unchanged: Array<{ runId: string; reason: string }>;
}

export function isDiscarded(record: RunSyncRecord | undefined): boolean {
  return record?.status === "skipped" && record.reason === "discarded";
}

/** 丢弃：已导出或已发布的轮次不能丢弃（数据仓只追加），其余跳过原因保留原样 */
export async function discardRuns(
  runIds: readonly string[],
  dataDir?: string,
  nowIso = new Date().toISOString(),
): Promise<LedgerDecisionReport> {
  return decide(runIds, dataDir, (ledger, runId) => {
    const existing = ledger[runId];
    if (isDiscarded(existing)) return "已丢弃";
    if (existing !== undefined) return existing.status === "skipped" ? `已跳过（${existing.reason}）` : "已导出，不能丢弃";
    ledger[runId] = { status: "skipped", reason: "discarded", skippedAt: nowIso };
    return null;
  });
}

/** 恢复：撤销丢弃，这一轮回到待导出清单 */
export async function restoreRuns(runIds: readonly string[], dataDir?: string): Promise<LedgerDecisionReport> {
  return decide(runIds, dataDir, (ledger, runId) => {
    if (!isDiscarded(ledger[runId])) return "未被丢弃";
    delete ledger[runId];
    return null;
  });
}

/** 逐轮套用决定；有变化才写回台账。apply 返回 null 表示已改，否则为未改的原因 */
async function decide(
  runIds: readonly string[],
  dataDir: string | undefined,
  apply: (ledger: SyncLedger, runId: string) => string | null,
): Promise<LedgerDecisionReport> {
  const ledger = await loadSyncLedger(dataDir);
  const report: LedgerDecisionReport = { changed: [], unchanged: [] };
  for (const runId of new Set(runIds)) {
    const reason = apply(ledger, runId);
    if (reason === null) report.changed.push(runId);
    else report.unchanged.push({ runId, reason });
  }
  if (report.changed.length > 0) await saveSyncLedger(ledger, dataDir);
  return report;
}

/**
 * 每轮实际要用的导出子集：已导出或已发布的轮次沿用台账里记的子集（没记即整轮），
 * 保证再次评估与数据仓里的记录一致；尚未导出的用本次请求给的子集。
 */
export function effectiveSelection(
  ledger: SyncLedger,
  requested: Readonly<Record<string, readonly string[]>> | undefined,
  runIds: readonly string[],
): Record<string, readonly string[]> {
  const selection: Record<string, readonly string[]> = {};
  for (const runId of runIds) {
    const record = ledger[runId];
    if (record !== undefined && record.status !== "skipped") {
      if (record.attempts !== undefined) selection[runId] = record.attempts;
      continue;
    }
    const picked = requested?.[runId];
    if (picked !== undefined) selection[runId] = picked;
  }
  return selection;
}

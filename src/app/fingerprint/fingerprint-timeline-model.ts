/**
 * 模型指纹渠道核验泳道与 6 宫格探针卡片纯函数视图模型（复用主看板 TimelineAxis 与 layoutColumns 契约）。
 */

import {
  formatDuration,
  formatTokens,
  formatUsd,
} from "@/app/components/card/card-format";
import type { Moment } from "@/app/components/timeline/moments";
import {
  formatZonedClock,
  zonedDayFraction,
  zonedDayKey,
} from "@/app/components/timeline/zoned-time";
import type { Verdict as JudgeVerdict } from "@/core/judge/schema";
import {
  summarizeCheckRecordMetrics,
  type CheckRecordMetricsSummary,
} from "@/core/model-fingerprint/cost";
import {
  PROBE_IDS,
  type FingerprintCheckRecord,
  type InconclusiveReason,
  type ProbeId,
  type Verdict,
} from "@/core/model-fingerprint/types";
import { orderProfileNames, type ProfileView } from "@/core/profile-view";
import type { CliKind } from "@/core/types";
import {
  formatSimilarityScore,
  isRecordCheckPassed,
  normalizeCheckProfile,
  orderCheckRecordsByProfile,
  resolveActiveCheckView,
} from "./fingerprint-model";

export {
  isRecordCheckPassed,
  normalizeCheckProfile,
  orderCheckRecordsByProfile,
  resolveActiveCheckView,
};

export interface CellVerdictCount {
  verdict: JudgeVerdict;
  count: number;
}

const CELL_VERDICT_ORDER: readonly JudgeVerdict[] = ["online", "degraded", "pending"];

export function recordToJudgeVerdict(record: FingerprintCheckRecord): JudgeVerdict {
  if (isRecordCheckPassed(record)) return "online";
  if (resolveActiveCheckView(record).verdict === "inconsistent") return "degraded";
  return "pending";
}

export function summarizeCellVerdicts(
  records: readonly FingerprintCheckRecord[],
): CellVerdictCount[] {
  const mapped = records.map(recordToJudgeVerdict);
  return CELL_VERDICT_ORDER.map((verdict) => ({
    verdict,
    count: mapped.filter((v) => v === verdict).length,
  })).filter((item) => item.count > 0);
}

export interface CheckRow {
  key: string;
  cli: CliKind;
  declaredModel: string;
}

export interface CheckMoment extends Moment {
  recordsByRow: ReadonlyMap<string, FingerprintCheckRecord>;
  cellRecordsByRow: ReadonlyMap<string, readonly FingerprintCheckRecord[]>;
  records: readonly FingerprintCheckRecord[];
}

export type ProbeSlotKind = "valid" | "failed" | "skipped" | "empty";

export interface ProbeSlotView {
  probe: ProbeId;
  kind: ProbeSlotKind;
  score: number | null;
  scoreText: string;
  isTopModel: boolean;
  dotStatus: "ok" | "no-svg" | "error";
  calls: number;
  durationMs: number;
  costUsd: number | null;
  tokens: number | null;
  tooltip: string;
}

export interface CheckCardViewModel {
  checkId: string;
  activeVerdict: Verdict;
  activeInconclusiveReason: InconclusiveReason | null;
  isSingleRefPassed: boolean;
  selfSim: number | null;
  selfSimText: string;
  selfLowerBound: number | null;
  selfBoundPassed: boolean;
  rescored: boolean;
  totalCalls: number;
  totalDurationMs: number;
  totalCostUsd: number | null;
  totalTokens: number | null;
  durationText: string;
  costText: string;
  slots: readonly ProbeSlotView[];
}

export interface RowConsistencyStats {
  total: number;
  passed: number;
  latestSelfSim: number | null;
  totalCostUsd: number | null;
}

export function checkRowKeyOf(record: Pick<FingerprintCheckRecord, "cli" | "declaredModel">): string {
  return `${record.cli}/${record.declaredModel}`;
}

export function checkTargetKeyOf(record: Pick<FingerprintCheckRecord, "cli" | "profile" | "declaredModel">): string {
  return `${record.cli}/${normalizeCheckProfile(record.profile)}/${record.declaredModel}`;
}

export function listCheckRows(records: readonly FingerprintCheckRecord[]): CheckRow[] {
  const byKey = new Map<string, CheckRow>();
  for (const r of records) {
    const key = checkRowKeyOf(r);
    if (!byKey.has(key)) {
      byKey.set(key, { key, cli: r.cli, declaredModel: r.declaredModel });
    }
  }
  return [...byKey.values()].sort(
    (a, b) => a.cli.localeCompare(b.cli) || a.declaredModel.localeCompare(b.declaredModel),
  );
}

export function listRowUpstreams(
  rowKey: string,
  records: readonly FingerprintCheckRecord[],
  profiles: readonly ProfileView[] = [],
): string[] {
  const matched = records.filter((r) => checkRowKeyOf(r) === rowKey);
  return orderProfileNames(matched.map((r) => normalizeCheckProfile(r.profile)), profiles).filter(
    (name) => name !== "default",
  );
}

interface MutableCheckMoment {
  runId: string;
  startedAt: string;
  dayKey: string;
  fraction: number;
  clock: string;
  seenTargets: Set<string>;
  cellRecordsByRow: Map<string, FingerprintCheckRecord[]>;
  records: FingerprintCheckRecord[];
}

function finalizeCheckMoment(m: MutableCheckMoment, profiles: readonly ProfileView[] = []): CheckMoment {
  const okCount = m.records.filter(isRecordCheckPassed).length;
  const recordsByRow = new Map<string, FingerprintCheckRecord>();
  const cellRecordsByRow = new Map<string, readonly FingerprintCheckRecord[]>();
  for (const [rowKey, list] of m.cellRecordsByRow.entries()) {
    const ordered = orderCheckRecordsByProfile(list, profiles);
    cellRecordsByRow.set(rowKey, ordered);
    if (ordered[0]) recordsByRow.set(rowKey, ordered[0]);
  }
  return {
    runId: m.runId,
    startedAt: m.startedAt,
    dayKey: m.dayKey,
    fraction: m.fraction,
    clock: m.clock,
    okCount,
    totalCount: m.records.length,
    cards: [],
    recordsByRow,
    cellRecordsByRow,
    records: m.records,
  };
}

export function groupCheckMoments(
  records: readonly FingerprintCheckRecord[],
  timeZone: string,
  dayKeyFilter?: string | null,
  profiles: readonly ProfileView[] = [],
): CheckMoment[] {
  const ascending = [...records]
    .filter((r) => !dayKeyFilter || zonedDayKey(new Date(r.createdAt), timeZone) === dayKeyFilter)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.checkId.localeCompare(b.checkId));

  const byClock = new Map<string, MutableCheckMoment[]>();
  const allMoments: MutableCheckMoment[] = [];

  for (const record of ascending) {
    const at = new Date(record.createdAt);
    const dayKey = zonedDayKey(at, timeZone);
    const clock = formatZonedClock(at, timeZone);
    const bucketKey = `${dayKey} ${clock}`;
    const rowKey = checkRowKeyOf(record);
    const targetKey = checkTargetKeyOf(record);
    const bucket = byClock.get(bucketKey) ?? [];
    const target = bucket.find((m) => !m.seenTargets.has(targetKey));

    if (target) {
      target.seenTargets.add(targetKey);
      const cellList = target.cellRecordsByRow.get(rowKey) ?? [];
      cellList.push(record);
      target.cellRecordsByRow.set(rowKey, cellList);
      target.records.push(record);
    } else {
      const created: MutableCheckMoment = {
        runId: `${clock}-${bucket.length}-${record.checkId}`,
        startedAt: record.createdAt,
        dayKey,
        fraction: zonedDayFraction(at, timeZone),
        clock,
        seenTargets: new Set([targetKey]),
        cellRecordsByRow: new Map([[rowKey, [record]]]),
        records: [record],
      };
      bucket.push(created);
      byClock.set(bucketKey, bucket);
      allMoments.push(created);
    }
  }
  return allMoments.map((m) => finalizeCheckMoment(m, profiles));
}

export function computeRowConsistencyStats(
  rowKey: string,
  records: readonly FingerprintCheckRecord[],
): RowConsistencyStats {
  const matched = records
    .filter((r) => checkRowKeyOf(r) === rowKey)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const passed = matched.filter(isRecordCheckPassed).length;
  const latest = matched[0] ? resolveActiveCheckView(matched[0]) : null;
  const costs = matched
    .map((r) => summarizeCheckRecordMetrics(r).totalCostUsd)
    .filter((c): c is number => c !== null);
  return {
    total: matched.length,
    passed,
    latestSelfSim: latest?.selfSim ?? null,
    totalCostUsd: costs.length > 0 ? costs.reduce((a, b) => a + b, 0) : null,
  };
}

function formatProbeSlotCostTail(pm: CheckRecordMetricsSummary["byProbe"][ProbeId]): string {
  if (!pm || pm.callCount === 0) return "";
  const parts = [`${pm.callCount}x`, formatDuration(pm.totalDurationMs)];
  if (pm.totalCostUsd !== null) parts.push(formatUsd(pm.totalCostUsd));
  if (pm.totalTokens !== null) parts.push(`${formatTokens(pm.totalTokens)} tok`);
  return ` · ${parts.join(" · ")}`;
}

function buildProbeSlotView(
  probe: ProbeId,
  record: FingerprintCheckRecord,
  activeView: FingerprintCheckRecord,
  metrics: CheckRecordMetricsSummary,
): ProbeSlotView {
  const rowScores = activeView.probeScores[probe] ?? {};
  const rawScore = rowScores[record.declaredModel] ?? null;
  const scoreValues = Object.values(rowScores).filter((v): v is number => typeof v === "number");
  const maxScore = scoreValues.length > 0 ? Math.max(...scoreValues) : null;
  const isTopModel = rawScore !== null && maxScore !== null && rawScore >= maxScore - 1e-12;
  const pm = metrics.byProbe[probe];
  const baseFields = {
    calls: pm?.callCount ?? 0,
    durationMs: pm?.totalDurationMs ?? 0,
    costUsd: pm?.totalCostUsd ?? null,
    tokens: pm?.totalTokens ?? null,
  };
  const costTail = formatProbeSlotCostTail(pm);

  if (activeView.validProbes.includes(probe)) {
    const scoreText = formatSimilarityScore(rawScore);
    return {
      probe, kind: "valid", score: rawScore, scoreText, isTopModel,
      dotStatus: isTopModel ? "ok" : "no-svg", ...baseFields,
      tooltip: `${probe}: ${scoreText}${costTail}`,
    };
  }
  if (record.skippedProbes.some((s) => s.probe === probe)) {
    return {
      probe, kind: "skipped", score: null, scoreText: "—",
      isTopModel: false, dotStatus: "no-svg", ...baseFields, tooltip: `${probe}: skipped`,
    };
  }
  if (record.failedProbes.some((f) => f.probe === probe) || record.selectedProbes.includes(probe)) {
    const reason = record.failedProbes.find((f) => f.probe === probe)?.lastReason ?? "failed";
    return {
      probe, kind: "failed", score: null, scoreText: "—",
      isTopModel: false, dotStatus: "error", ...baseFields, tooltip: `${probe}: ${reason}${costTail}`,
    };
  }
  return {
    probe, kind: "empty", score: null, scoreText: "—",
    isTopModel: false, dotStatus: "no-svg", ...baseFields, tooltip: `${probe}: not selected`,
  };
}

function summarizeCellMetrics(
  records: readonly FingerprintCheckRecord[],
): Pick<CheckRecordMetricsSummary, "callCount" | "totalDurationMs" | "totalCostUsd" | "totalTokens"> {
  let callCount = 0;
  let totalDurationMs = 0;
  let totalCostUsd = 0;
  let hasCost = false;
  let totalTokens = 0;
  let hasTokens = false;
  for (const rec of records) {
    const m = summarizeCheckRecordMetrics(rec);
    callCount += m.callCount;
    totalDurationMs += m.totalDurationMs;
    if (m.totalCostUsd !== null) {
      totalCostUsd += m.totalCostUsd;
      hasCost = true;
    }
    if (m.totalTokens !== null) {
      totalTokens += m.totalTokens;
      hasTokens = true;
    }
  }
  return {
    callCount,
    totalDurationMs,
    totalCostUsd: hasCost ? totalCostUsd : null,
    totalTokens: hasTokens ? totalTokens : null,
  };
}

export function buildCheckCardViewModel(
  record: FingerprintCheckRecord,
  cellRecords?: readonly FingerprintCheckRecord[],
): CheckCardViewModel {
  const active = resolveActiveCheckView(record);
  const activeInconclusiveReason = active.inconclusiveReason ?? null;
  const selfBoundPassed =
    active.selfSim !== null && active.selfLowerBound !== null && active.selfSim >= active.selfLowerBound;
  const isSingleRefPassed =
    active.verdict === "inconclusive" &&
    activeInconclusiveReason === "single-reference-only" &&
    selfBoundPassed;
  const metrics = summarizeCheckRecordMetrics(record);
  const cellMetrics =
    cellRecords && cellRecords.length > 1 ? summarizeCellMetrics(cellRecords) : metrics;

  return {
    checkId: record.checkId,
    activeVerdict: active.verdict,
    activeInconclusiveReason,
    isSingleRefPassed,
    selfSim: active.selfSim,
    selfSimText: formatSimilarityScore(active.selfSim),
    selfLowerBound: active.selfLowerBound,
    selfBoundPassed,
    rescored: record.rescores.length > 0,
    totalCalls: cellMetrics.callCount,
    totalDurationMs: cellMetrics.totalDurationMs,
    totalCostUsd: cellMetrics.totalCostUsd,
    totalTokens: cellMetrics.totalTokens,
    durationText: cellMetrics.totalDurationMs > 0 ? formatDuration(cellMetrics.totalDurationMs) : "—",
    costText: formatUsd(cellMetrics.totalCostUsd),
    slots: PROBE_IDS.map((probe) => buildProbeSlotView(probe, record, active, metrics)),
  };
}

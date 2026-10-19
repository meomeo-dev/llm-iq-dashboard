import {
  formatAttemptCostTitle,
  formatDuration,
  formatTokens,
  formatUsd,
} from "@/app/components/card/card-format";
import {
  summarizeAttemptMetrics,
  summarizeCheckRecordMetrics,
} from "@/core/model-fingerprint/cost";
import {
  PROBE_IDS,
  type FingerprintCheckRecord,
  type InconclusiveReason,
  type ProbeId,
  type Verdict,
} from "@/core/model-fingerprint/types";
import {
  formatPercent,
  formatSimilarityScore,
  normalizeCheckProfile,
  resolveActiveCheckView,
} from "./fingerprint-model";

export interface ModelSimilarityRowView {
  rank: number;
  model: string;
  isDeclared: boolean;
  isUsurperTop: boolean;
  meanSim: number | null;
  meanSimText: string;
  barPercent: number;
  boundPercent: number | null;
  deltaVsDeclared: number | null;
  deltaText: string | null;
}

export interface ProbeComparisonSlotView {
  probe: ProbeId;
  status: "valid" | "failed" | "skipped" | "unselected";
  declaredScore: number | null;
  declaredScoreText: string;
  isTop: boolean;
  lagLevel: "none" | "warn" | "err";
  bestRivalModel: string | null;
  bestRivalScore: number | null;
  bestRivalScoreText: string;
  deltaVsRival: number | null;
  deltaVsRivalText: string | null;
  failedReason: string | null;
  failedAttempts: number;
  skippedMissing: number | null;
  calls: number;
  durationMs: number;
  costUsd: number | null;
  tokens: number | null;
  tooltip: string;
}

export interface CheckDetailViewModel {
  activeView: FingerprintCheckRecord;
  normProfile: string;
  effortBadge: string;
  activeVerdict: Verdict;
  activeInconclusiveReason: InconclusiveReason | null;
  isSingleRefPassed: boolean;
  allProbesFailed: boolean;
  totalAttemptCalls: number;
  totalDurationMs: number;
  totalCostUsd: number | null;
  totalTokens: number | null;
  costBreakdownTitle: string | undefined;
  tone: "ok" | "err" | "warn";
  selfBoundChecked: boolean;
  selfBoundPassed: boolean;
  selfSimText: string;
  selfLowerBoundText: string;
  usurperModel: string | null;
  usurperSimText: string | null;
  usurperDeltaText: string | null;
  latestRescoreAt: string | null;
  originalVerdict: Verdict;
  expectedConsistencyText: string;
  modelRows: readonly ModelSimilarityRowView[];
  probeSlots: readonly ProbeComparisonSlotView[];
}

export function resolveModelMeanSim(record: FingerprintCheckRecord, model: string): number | null {
  if (model === record.declaredModel && record.selfSim !== null) return record.selfSim;
  const fromRanking = record.ranking.find((r) => r.model === model);
  if (fromRanking) return fromRanking.meanSim;
  const fromComp = record.comparisons.find((c) => c.candidateModel === model);
  if (fromComp) return fromComp.candidateSelfSim;
  const values = record.validProbes
    .map((p) => record.probeScores[p]?.[model])
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function scaleSimilarityBarPercent(score: number | null): number {
  if (score === null || !Number.isFinite(score)) return 0;
  const clamped = Math.max(0, Math.min(1, (score - 0.5) / 0.5));
  return Math.round(Math.max(0.06, clamped) * 100);
}

function collectCandidateModels(active: FingerprintCheckRecord): string[] {
  const probeModels = active.validProbes.flatMap((p) => Object.keys(active.probeScores[p] ?? {}));
  return Array.from(
    new Set([
      active.declaredModel,
      ...active.ranking.map((r) => r.model),
      ...active.comparisons.map((c) => c.candidateModel),
      ...probeModels,
    ]),
  );
}

export function buildModelSimilarityRows(active: FingerprintCheckRecord): ModelSimilarityRowView[] {
  const models = collectCandidateModels(active);
  const declaredMean = resolveModelMeanSim(active, active.declaredModel);
  const boundPct =
    active.selfLowerBound !== null ? scaleSimilarityBarPercent(active.selfLowerBound) : null;
  const unsorted = models.map((model) => {
    const meanSim = resolveModelMeanSim(active, model);
    const isDeclared = model === active.declaredModel;
    const delta =
      !isDeclared && meanSim !== null && declaredMean !== null ? meanSim - declaredMean : null;
    return {
      model,
      isDeclared,
      meanSim,
      meanSimText: formatSimilarityScore(meanSim),
      barPercent: scaleSimilarityBarPercent(meanSim),
      boundPercent: isDeclared ? boundPct : null,
      deltaVsDeclared: delta,
      deltaText: delta !== null ? `${delta >= 0 ? "+" : ""}${delta.toFixed(4)}` : null,
    };
  });
  unsorted.sort((a, b) => {
    if (a.meanSim !== null && b.meanSim !== null && b.meanSim !== a.meanSim) {
      return b.meanSim - a.meanSim;
    }
    if (a.meanSim !== null && b.meanSim === null) return -1;
    if (a.meanSim === null && b.meanSim !== null) return 1;
    if (a.isDeclared !== b.isDeclared) return a.isDeclared ? -1 : 1;
    return a.model.localeCompare(b.model);
  });
  return unsorted.map((item, idx) => ({
    ...item,
    rank: idx + 1,
    isUsurperTop:
      idx === 0 && !item.isDeclared && item.deltaVsDeclared !== null && item.deltaVsDeclared > 0,
  }));
}

function buildProbeTooltipHeader(probe: ProbeId, m: ReturnType<typeof summarizeAttemptMetrics>): string {
  const parts = [
    m.callCount > 0 ? `${m.callCount} calls` : null,
    m.totalDurationMs > 0 ? formatDuration(m.totalDurationMs) : null,
    m.totalTokens !== null ? `${formatTokens(m.totalTokens)} tok` : null,
    m.totalCostUsd !== null ? formatUsd(m.totalCostUsd) : null,
  ].filter(Boolean);
  return parts.length > 0 ? `${probe} (${parts.join(" · ")})` : probe;
}

function buildSingleProbeSlot(
  probe: ProbeId,
  record: FingerprintCheckRecord,
  active: FingerprintCheckRecord,
): ProbeComparisonSlotView {
  const validSet = new Set(active.validProbes);
  const failed = record.failedProbes.find((f) => f.probe === probe);
  const skipped = record.skippedProbes.find((s) => s.probe === probe);
  const scores = active.probeScores[probe] ?? {};
  const rawDecl = scores[record.declaredModel];
  const declScore = typeof rawDecl === "number" && Number.isFinite(rawDecl) ? rawDecl : null;
  const rivals = Object.entries(scores)
    .filter(([m, v]) => m !== record.declaredModel && typeof v === "number" && Number.isFinite(v))
    .sort((a, b) => b[1] - a[1]);
  const bestRival = rivals[0] ?? null;
  const delta = declScore !== null && bestRival ? declScore - bestRival[1] : null;
  const isTop = delta === null || delta >= 0;
  const lagLevel = delta === null || delta >= 0 ? "none" : delta <= -0.05 ? "err" : "warn";
  const status = validSet.has(probe) ? "valid" : failed ? "failed" : skipped ? "skipped" : "unselected";
  const allScoreLines = Object.entries(scores)
    .filter(([, v]) => typeof v === "number" && Number.isFinite(v))
    .sort((a, b) => b[1] - a[1])
    .map(([m, v]) => `${m}: ${formatSimilarityScore(v)}`);
  const pm = summarizeAttemptMetrics(record.probeAttempts?.[probe] ?? []);
  const headerLine = buildProbeTooltipHeader(probe, pm);
  return {
    probe, status, declaredScore: declScore,
    declaredScoreText: declScore !== null ? formatSimilarityScore(declScore) : "—",
    isTop, lagLevel,
    bestRivalModel: bestRival ? bestRival[0] : null,
    bestRivalScore: bestRival ? bestRival[1] : null,
    bestRivalScoreText: bestRival ? formatSimilarityScore(bestRival[1]) : "—",
    deltaVsRival: delta,
    deltaVsRivalText: delta !== null ? `${delta >= 0 ? "+" : ""}${delta.toFixed(4)}` : null,
    failedReason: failed ? String(failed.lastReason) : null,
    failedAttempts: failed?.attemptsUsed ?? 0,
    skippedMissing: null,
    calls: pm.callCount, durationMs: pm.totalDurationMs, costUsd: pm.totalCostUsd, tokens: pm.totalTokens,
    tooltip: allScoreLines.length > 0 ? `${headerLine}\n${allScoreLines.join("\n")}` : headerLine,
  };
}

function resolveVerdictTone(
  activeVerdict: Verdict,
  isSingleRefPassed: boolean,
  allProbesFailed: boolean,
): "ok" | "err" | "warn" {
  if (activeVerdict === "consistent" || isSingleRefPassed) return "ok";
  if (activeVerdict === "inconsistent" || allProbesFailed) return "err";
  return "warn";
}

function formatEffortBadge(record: FingerprintCheckRecord): string {
  if (record.effortHonored === false) return `${record.requestedEffort} → fixed`;
  if (record.appliedEffort !== record.requestedEffort) {
    return `${record.requestedEffort} → ${record.appliedEffort}`;
  }
  return record.appliedEffort;
}

function formatRecordCostBreakdownTitle(
  m: ReturnType<typeof summarizeCheckRecordMetrics>,
  profile: string | undefined,
): string | undefined {
  const usage =
    m.totalTokens !== null
      ? {
          tokens: { input: m.inputTokens, cache_read: m.cacheReadTokens, output: m.outputTokens },
          reasoningTokens: m.reasoningTokens,
          serviceTier: "standard" as const,
          reportedCostUsd: m.reportedCostUsd,
        }
      : null;
  if (m.totalCostUsd === null && usage === null) return undefined;
  return formatAttemptCostTitle({ usage, estimatedCostUsd: m.totalCostUsd, profile }) || undefined;
}

export function buildCheckDetailViewModel(record: FingerprintCheckRecord): CheckDetailViewModel {
  const activeView = resolveActiveCheckView(record);
  const activeVerdict = activeView.verdict;
  const activeInconclusive = activeView.inconclusiveReason ?? null;
  const latestRescore = record.rescores[record.rescores.length - 1];
  const selfBoundChecked = activeView.selfSim !== null && activeView.selfLowerBound !== null;
  const selfBoundPassed = selfBoundChecked && activeView.selfSim! >= activeView.selfLowerBound!;
  const isSingleRefPassed =
    activeVerdict === "inconclusive" && activeInconclusive === "single-reference-only" && selfBoundPassed;
  const allProbesFailed = activeView.validProbes.length === 0 && record.failedProbes.length > 0;
  const modelRows = buildModelSimilarityRows(activeView);
  const topRow = modelRows[0];
  const usurper = topRow && !topRow.isDeclared && (topRow.deltaVsDeclared ?? 0) > 0 ? topRow : null;
  const metrics = summarizeCheckRecordMetrics(record);
  return {
    activeView,
    normProfile: normalizeCheckProfile(record.profile),
    effortBadge: formatEffortBadge(record),
    activeVerdict,
    activeInconclusiveReason: (activeInconclusive as InconclusiveReason | null) ?? null,
    isSingleRefPassed,
    allProbesFailed,
    totalAttemptCalls: metrics.callCount,
    totalDurationMs: metrics.totalDurationMs,
    totalCostUsd: metrics.totalCostUsd,
    totalTokens: metrics.totalTokens,
    costBreakdownTitle: formatRecordCostBreakdownTitle(metrics, record.profile),
    tone: resolveVerdictTone(activeVerdict, isSingleRefPassed, allProbesFailed),
    selfBoundChecked,
    selfBoundPassed,
    selfSimText: formatSimilarityScore(activeView.selfSim),
    selfLowerBoundText: formatSimilarityScore(activeView.selfLowerBound),
    usurperModel: usurper?.model ?? activeView.closestCandidate ?? null,
    usurperSimText: usurper?.meanSimText ?? null,
    usurperDeltaText: usurper?.deltaText ?? null,
    latestRescoreAt: latestRescore?.rescoredAt ?? null,
    originalVerdict: record.verdict,
    expectedConsistencyText: formatPercent(activeView.expectedConsistency),
    modelRows,
    probeSlots: PROBE_IDS.map((p) => buildSingleProbeSlot(p, record, activeView)),
  };
}

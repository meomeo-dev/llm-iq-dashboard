/**
 * 模型指纹成本与 Token 计量汇总纯函数（cost.ts）：
 * 统一从 ProbeAttempt / ProbeSampleSet / FingerprintCheckRecord 提取单次均价、累计官价、耗时与分项 Token。
 */

import type { TokenUsage } from "../../pricing/types";
import type { CliKind } from "../types";
import {
  PROBE_IDS,
  type FingerprintCheckRecord,
  type ProbeAttempt,
  type ProbeId,
  type ProbeSampleSet,
} from "./types";

export interface AttemptMetricsSummary {
  readonly callCount: number;
  readonly totalDurationMs: number;
  readonly totalCostUsd: number | null;
  readonly unitCostUsd: number | null;
  readonly totalTokens: number | null;
  readonly inputTokens: number;
  readonly cacheReadTokens: number;
  readonly cacheWriteTokens: number;
  readonly outputTokens: number;
  readonly reasoningTokens: number;
  readonly reportedCostUsd: number | null;
}

export interface CheckRecordMetricsSummary extends AttemptMetricsSummary {
  readonly byProbe: Partial<Record<ProbeId, AttemptMetricsSummary>>;
}

export function resolveAttemptCostUsd(
  attempt: Pick<ProbeAttempt, "estimatedCostUsd" | "usage">,
): number | null {
  const c = attempt.estimatedCostUsd ?? attempt.usage?.reportedCostUsd ?? null;
  return typeof c === "number" && Number.isFinite(c) && c >= 0 ? c : null;
}

export function sumAttemptTokens(usage: TokenUsage | null | undefined): number | null {
  if (!usage || !usage.tokens) return null;
  const vals = Object.values(usage.tokens).filter(
    (n): n is number => typeof n === "number" && Number.isFinite(n),
  );
  return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) : null;
}

function accumulateTokenBreakdown(
  usage: TokenUsage | null | undefined,
  acc: { input: number; cacheRead: number; cacheWrite: number; output: number; reasoning: number; reported: number; hasReported: boolean },
): void {
  if (!usage) return;
  const m = usage.tokens;
  if (m) {
    acc.input += m.input ?? 0;
    acc.cacheRead += m.cache_read ?? 0;
    acc.cacheWrite += (m.cache_write_5m ?? 0) + (m.cache_write_1h ?? 0);
    acc.output += m.output ?? 0;
  }
  if (usage.reasoningTokens && usage.reasoningTokens > 0) acc.reasoning += usage.reasoningTokens;
  if (typeof usage.reportedCostUsd === "number" && Number.isFinite(usage.reportedCostUsd)) {
    acc.reported += usage.reportedCostUsd;
    acc.hasReported = true;
  }
}

export function summarizeAttemptMetrics(
  attempts: readonly Pick<ProbeAttempt, "durationMs" | "usage" | "estimatedCostUsd">[],
): AttemptMetricsSummary {
  let totalDurationMs = 0;
  let costSum = 0;
  let costCount = 0;
  let tokenSum = 0;
  let hasTokens = false;
  const breakdown = { input: 0, cacheRead: 0, cacheWrite: 0, output: 0, reasoning: 0, reported: 0, hasReported: false };

  for (const att of attempts) {
    if (typeof att.durationMs === "number" && Number.isFinite(att.durationMs) && att.durationMs > 0) {
      totalDurationMs += att.durationMs;
    }
    const cost = resolveAttemptCostUsd(att);
    if (cost !== null) {
      costSum += cost;
      costCount += 1;
    }
    const tok = sumAttemptTokens(att.usage);
    if (tok !== null) {
      tokenSum += tok;
      hasTokens = true;
    }
    accumulateTokenBreakdown(att.usage, breakdown);
  }

  return {
    callCount: attempts.length,
    totalDurationMs,
    totalCostUsd: costCount > 0 ? costSum : null,
    unitCostUsd: costCount > 0 ? costSum / costCount : null,
    totalTokens: hasTokens ? tokenSum : null,
    inputTokens: breakdown.input,
    cacheReadTokens: breakdown.cacheRead,
    cacheWriteTokens: breakdown.cacheWrite,
    outputTokens: breakdown.output,
    reasoningTokens: breakdown.reasoning,
    reportedCostUsd: breakdown.hasReported ? breakdown.reported : null,
  };
}

export function summarizeCheckRecordMetrics(
  record: Pick<FingerprintCheckRecord, "probeAttempts">,
): CheckRecordMetricsSummary {
  const byProbe: Partial<Record<ProbeId, AttemptMetricsSummary>> = {};
  const allAttempts: ProbeAttempt[] = [];
  for (const probe of PROBE_IDS) {
    const list = record.probeAttempts?.[probe];
    if (list && list.length > 0) {
      byProbe[probe] = summarizeAttemptMetrics(list);
      allAttempts.push(...list);
    }
  }
  return {
    ...summarizeAttemptMetrics(allAttempts),
    byProbe,
  };
}

export function estimateCallUnitCost(sampleSet: ProbeSampleSet | undefined): number | null {
  if (!sampleSet || sampleSet.attempts.length === 0) return null;
  return summarizeAttemptMetrics(sampleSet.attempts).unitCostUsd;
}

export function computeTargetFallbackCost(
  sets: Iterable<ProbeSampleSet>,
  cli: CliKind,
  model: string,
): number | null {
  let modelSum = 0;
  let modelCount = 0;
  let cliSum = 0;
  let cliCount = 0;
  for (const s of sets) {
    if (s.cli !== cli) continue;
    for (const a of s.attempts) {
      const c = resolveAttemptCostUsd(a);
      if (c === null) continue;
      cliSum += c;
      cliCount += 1;
      if (s.model === model) {
        modelSum += c;
        modelCount += 1;
      }
    }
  }
  if (modelCount > 0) return modelSum / modelCount;
  return cliCount > 0 ? cliSum / cliCount : null;
}

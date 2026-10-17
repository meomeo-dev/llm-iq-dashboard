/**
 * 基于信息论的经验频率分布与以 2 为底的 Jensen-Shannon 散度（JSD，Lin 1991）计算。
 * 只消费 ProbeFeatures 接口（chars / bigrams / segments），不硬编码具体探针名称。
 */

import type { Probe } from "./probes";
import type { ProbeFeatures } from "./types";

export type EmpiricalDistribution = ReadonlyMap<string, number>;

export interface PooledProbeDistributions {
  readonly chars: EmpiricalDistribution;
  readonly bigrams: EmpiricalDistribution;
  readonly segments?: EmpiricalDistribution;
}

export function clamp01(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function buildEmpiricalDistribution(items: readonly string[]): Map<string, number> {
  if (items.length === 0) {
    throw new Error("Cannot build empirical distribution from an empty feature list");
  }
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  const total = items.length;
  const dist = new Map<string, number>();
  for (const [key, count] of counts.entries()) {
    dist.set(key, count / total);
  }
  return dist;
}

function hasPositiveSupport(dist: EmpiricalDistribution): boolean {
  for (const weight of dist.values()) {
    if (weight > 0) return true;
  }
  return false;
}

function klDivergenceToMidpoint(
  dist: EmpiricalDistribution,
  other: EmpiricalDistribution,
): number {
  let sum = 0;
  for (const [token, p] of dist.entries()) {
    if (p <= 0) continue;
    const q = Math.max(0, other.get(token) ?? 0);
    const m = 0.5 * (p + q);
    sum += p * Math.log2(p / m);
  }
  return sum;
}

export function computeJsd(
  distP: EmpiricalDistribution,
  distQ: EmpiricalDistribution,
): number {
  if (!hasPositiveSupport(distP) || !hasPositiveSupport(distQ)) {
    throw new Error("Cannot compute JSD on an empty distribution");
  }
  const klPM = klDivergenceToMidpoint(distP, distQ);
  const klQM = klDivergenceToMidpoint(distQ, distP);
  return clamp01(0.5 * klPM + 0.5 * klQM);
}

export function computeJsdSimilarity(
  distP: EmpiricalDistribution,
  distQ: EmpiricalDistribution,
): number {
  return clamp01(1 - computeJsd(distP, distQ));
}

export function poolProbeDistributions(
  probe: Pick<Probe, "extractFeatures">,
  values: readonly string[],
): PooledProbeDistributions {
  if (values.length === 0) {
    throw new Error("Cannot pool probe distributions from an empty canonical value list");
  }
  const allChars: string[] = [];
  const allBigrams: string[] = [];
  const allSegments: string[] = [];
  let hasSegments = false;

  for (const value of values) {
    const feat: ProbeFeatures = probe.extractFeatures(value);
    allChars.push(...feat.chars);
    allBigrams.push(...feat.bigrams);
    if (feat.segments !== undefined) {
      hasSegments = true;
      allSegments.push(...feat.segments);
    }
  }

  return {
    chars: buildEmpiricalDistribution(allChars),
    bigrams: buildEmpiricalDistribution(allBigrams),
    ...(hasSegments ? { segments: buildEmpiricalDistribution(allSegments) } : {}),
  };
}

export function computePooledProbeScore(
  refDist: PooledProbeDistributions,
  queryDist: PooledProbeDistributions,
): number {
  const charSim = computeJsdSimilarity(refDist.chars, queryDist.chars);
  const bigramSim = computeJsdSimilarity(refDist.bigrams, queryDist.bigrams);
  if (refDist.segments !== undefined && queryDist.segments !== undefined) {
    const segSim = computeJsdSimilarity(refDist.segments, queryDist.segments);
    return clamp01((charSim + bigramSim + segSim) / 3);
  }
  return clamp01((charSim + bigramSim) / 2);
}

export function computeProbeSubsetScore(
  probe: Pick<Probe, "extractFeatures">,
  refValues: readonly string[],
  queryValues: readonly string[],
): number {
  const refDist = poolProbeDistributions(probe, refValues);
  const queryDist = poolProbeDistributions(probe, queryValues);
  return computePooledProbeScore(refDist, queryDist);
}

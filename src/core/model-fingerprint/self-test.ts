/**
 * 配对无重叠交叉验证自检（self-test.ts）：
 * 不调用模型，在已采集基准样本上计算无重叠留出折、第 5 百分位自身下界 q_0.05、
 * 模型对判定阈值 t_{C,A}、自检一致率 expectedConsistency、单条样本留一相似度 sampleSelfSim
 * 以及不同样本子集容量下的区分度变化曲线。
 */

import {
  computePooledProbeScore, computeProbeSubsetScore, poolProbeDistributions, type PooledProbeDistributions,
} from "./jsd";
import { getProbe, type Probe, type PromptCodec } from "./probes";
import {
  DEFAULT_SAMPLES_PER_PROBE, DEFAULT_TARGET_ACCURACY, DEFAULT_VALUES_PER_CHECK,
  MAX_SELF_TEST_FOLDS, MIN_PAIRWISE_THRESHOLD, MIN_SAMPLES_PER_PROBE, PROBE_IDS,
  resolveProbeTargetSamples,
  type DecodedAttemptSummary, type ModelPromptOverrides, type ProbeId, type ProbeSampleSet, type QualifiedProbeValue,
} from "./types";

export interface PreparedProbeFolds {
  readonly probeId: ProbeId; readonly probe: Probe; readonly pool: readonly QualifiedProbeValue[];
  readonly queryDists: readonly PooledProbeDistributions[]; readonly remainingByFold: readonly (readonly string[])[];
  readonly singleRefCapacity: number; readonly singleRefDists: readonly PooledProbeDistributions[];
}

export interface PairwiseCalibration {
  readonly sharedProbes: ProbeId[]; readonly foldDiffsC: readonly number[]; readonly foldDiffsA: readonly number[];
  readonly threshold: number | null; readonly distinguishable: boolean;
  readonly conditionalAccuracy: number | null; readonly coverageC: number; readonly coverageA: number;
}

export interface SelfTestPairSummary {
  readonly modelC: string; readonly modelA: string; readonly sharedProbes: ProbeId[];
  readonly threshold: number | null; readonly distinguishable: boolean;
  readonly conditionalAccuracy: number | null; readonly decidableRate: number;
}

export interface CapacityCurvePoint {
  readonly subsetSize: number; readonly distinguishablePairs: number;
  readonly totalPairs: number; readonly meanExpectedConsistency: number;
}

export interface SelfTestReport {
  readonly samplesPerProbe: number; readonly samplesByProbe?: Partial<Record<ProbeId, number>>;
  readonly valuesPerCheck: number; readonly foldCount: number; readonly targetAccuracy: number;
  readonly modelSelfBounds: Record<string, { usableProbes: ProbeId[]; selfLowerBound: number; expectedConsistency: number; expectedFalseInconsistentRate: number }>;
  readonly pairs: SelfTestPairSummary[];
  readonly probeSeparability: Partial<Record<ProbeId, { distinguishablePairs: number; totalPairs: number; meanThreshold: number | null }>>;
  readonly capacityCurve: CapacityCurvePoint[];
}

export function resolveMinProbeTargetSamples(
  probes: readonly ProbeId[],
  options?: { samplesPerProbe?: number; samplesByProbe?: Partial<Record<ProbeId, number>> },
): number {
  if (probes.length === 0) return options?.samplesPerProbe ?? DEFAULT_SAMPLES_PER_PROBE;
  return Math.min(...probes.map((p) => resolveProbeTargetSamples(p, options)));
}

export function extractValidValuesFromSampleSet(
  sampleSet: Pick<ProbeSampleSet, "probe" | "cli" | "model" | "attempts">,
  overrides?: ModelPromptOverrides,
  customProbe?: Probe,
): QualifiedProbeValue[] {
  const probe = customProbe ?? getProbe(sampleSet.probe);
  const activeCodec: PromptCodec = probe.resolveCodec({ cli: sampleSet.cli, model: sampleSet.model }, overrides);
  const results: QualifiedProbeValue[] = [];
  for (const attempt of sampleSet.attempts) {
    if (attempt.outcome !== "ok" || attempt.excluded === true) continue;
    for (const value of probe.extractAttempt(attempt, activeCodec).values) {
      results.push({ reqId: attempt.reqId, value });
    }
  }
  return results;
}

export function capAndSliceReferencePool(
  values: readonly QualifiedProbeValue[],
  samplesPerProbe: number,
  valuesPerCheck: number,
): QualifiedProbeValue[] {
  const maxPerReqId = Math.max(1, Math.floor(samplesPerProbe / (2 * valuesPerCheck)));
  const countsByReq = new Map<string, number>();
  const pool: QualifiedProbeValue[] = [];
  for (const item of values) {
    const used = countsByReq.get(item.reqId) ?? 0;
    if (used >= maxPerReqId) continue;
    countsByReq.set(item.reqId, used + 1);
    pool.push(item);
    if (pool.length >= samplesPerProbe) break;
  }
  return pool;
}

function binomialCoeff(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  const m = Math.min(k, n - k);
  let res = 1;
  for (let i = 1; i <= m; i += 1) res = Math.round((res * (n - m + i)) / i);
  return res;
}

function enumerateCombinations(n: number, m: number): number[][] {
  const results: number[][] = [];
  const current: number[] = [];
  const dfs = (start: number): void => {
    if (current.length === m) {
      results.push([...current]);
      return;
    }
    for (let i = start; i <= n - (m - current.length); i += 1) {
      current.push(i);
      dfs(i + 1);
      current.pop();
    }
  };
  dfs(0);
  return results;
}

function sampleDeterministicCombinations(n: number, m: number, count: number): number[][] {
  let seed = ((n * 65537) ^ (m * 257) ^ 0x9e3779b9) >>> 0;
  const nextRand = (): number => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const seen = new Set<string>();
  const results: number[][] = [];
  while (results.length < count) {
    const indices = Array.from({ length: n }, (_, i) => i);
    for (let i = 0; i < m; i += 1) {
      const pick = i + Math.floor(nextRand() * (n - i));
      [indices[i], indices[pick]] = [indices[pick]!, indices[i]!];
    }
    const combo = indices.slice(0, m).sort((a, b) => a - b);
    const key = combo.join(",");
    if (!seen.has(key)) {
      seen.add(key);
      results.push(combo);
    }
  }
  return results;
}

export function buildFoldIndexSets(samplesPerProbe: number, valuesPerCheck: number): number[][] {
  if (valuesPerCheck <= 1) return Array.from({ length: samplesPerProbe }, (_, i) => [i]);
  return binomialCoeff(samplesPerProbe, valuesPerCheck) <= MAX_SELF_TEST_FOLDS
    ? enumerateCombinations(samplesPerProbe, valuesPerCheck)
    : sampleDeterministicCombinations(samplesPerProbe, valuesPerCheck, MAX_SELF_TEST_FOLDS);
}

export function prepareModelProbeFolds(
  probeId: ProbeId,
  pool: readonly QualifiedProbeValue[],
  foldIndices: readonly (readonly number[])[],
  customProbe?: Probe,
): PreparedProbeFolds {
  const probe = customProbe ?? getProbe(probeId);
  const queryDists: PooledProbeDistributions[] = [];
  const remainingByFold: string[][] = [];
  for (const idxSet of foldIndices) {
    const mappedIdx = idxSet.map((idx) => idx % pool.length);
    const heldOutPos = new Set(mappedIdx);
    const heldOutReqIds = new Set(mappedIdx.map((idx) => pool[idx]!.reqId));
    const queryVals =
      mappedIdx.length === 1
        ? pool.filter((item, pos) => heldOutPos.has(pos) || heldOutReqIds.has(item.reqId)).map((item) => item.value)
        : mappedIdx.map((idx) => pool[idx]!.value);
    const remaining = pool
      .filter((item, pos) => !heldOutPos.has(pos) && !heldOutReqIds.has(item.reqId))
      .map((item) => item.value);
    queryDists.push(poolProbeDistributions(probe, queryVals));
    remainingByFold.push(remaining);
  }
  const singleRefCapacity = Math.min(...remainingByFold.map((rem) => rem.length));
  const singleRefDists = remainingByFold.map((rem) => poolProbeDistributions(probe, rem.slice(0, singleRefCapacity)));
  return { probeId, probe, pool, queryDists, remainingByFold, singleRefCapacity, singleRefDists };
}

export function prepareAllModelsFolds(
  sampleSetsByModel: ReadonlyMap<string, Readonly<Partial<Record<ProbeId, ProbeSampleSet>>>>,
  selectedProbes: readonly ProbeId[],
  samplesPerProbe: number,
  valuesPerCheck: number,
  foldIndices: readonly (readonly number[])[],
  overrides?: ModelPromptOverrides,
  samplesByProbe?: Partial<Record<ProbeId, number>>,
): Map<string, Partial<Record<ProbeId, PreparedProbeFolds>>> {
  const preparedByModel = new Map<string, Partial<Record<ProbeId, PreparedProbeFolds>>>();
  for (const [model, byProbe] of sampleSetsByModel.entries()) {
    const prepMap: Partial<Record<ProbeId, PreparedProbeFolds>> = {};
    for (const p of selectedProbes) {
      const set = byProbe[p];
      if (!set) continue;
      const targetForProbe = resolveProbeTargetSamples(p, { samplesPerProbe, samplesByProbe });
      const pool = capAndSliceReferencePool(extractValidValuesFromSampleSet(set, overrides), targetForProbe, valuesPerCheck);
      if (pool.length >= targetForProbe) prepMap[p] = prepareModelProbeFolds(p, pool, foldIndices);
    }
    if (Object.keys(prepMap).length > 0) preparedByModel.set(model, prepMap);
  }
  return preparedByModel;
}

export function computeSelfSimFoldScores(
  probes: readonly ProbeId[],
  preparedByProbe: Readonly<Partial<Record<ProbeId, PreparedProbeFolds>>>,
  foldCount: number,
): number[] {
  return Array.from({ length: foldCount }, (_, r) => {
    const sum = probes.reduce(
      (acc, p) => acc + computePooledProbeScore(preparedByProbe[p]!.singleRefDists[r]!, preparedByProbe[p]!.queryDists[r]!),
      0,
    );
    return sum / probes.length;
  });
}

export function computeFifthPercentileBound(foldScores: readonly number[]): number {
  const sorted = [...foldScores].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.floor(0.05 * sorted.length) - 1)]!;
}

export function computeIntraProbeConvergence(
  probeId: ProbeId,
  rawValues: readonly QualifiedProbeValue[],
  targetValues: number,
  valuesPerCheck: number,
  customProbe?: Probe,
): { intraProbeSim: number | null; intraProbeLowerBound: number | null } {
  const pool = capAndSliceReferencePool(rawValues, targetValues, valuesPerCheck);
  if (pool.length < MIN_SAMPLES_PER_PROBE) return { intraProbeSim: null, intraProbeLowerBound: null };
  const probe = customProbe ?? getProbe(probeId);
  const folds = buildFoldIndexSets(pool.length, valuesPerCheck);
  const prep = prepareModelProbeFolds(probeId, pool, folds, probe);
  if (prep.singleRefCapacity < 1) return { intraProbeSim: null, intraProbeLowerBound: null };
  const checkScores = computeSelfSimFoldScores([probeId], { [probeId]: prep }, folds.length);
  const reqIds = [...new Set(pool.map((v) => v.reqId))];
  const splitScores =
    reqIds.length >= 2
      ? buildFoldIndexSets(reqIds.length, Math.floor(reqIds.length / 2))
          .slice(0, 20)
          .map((idxSet) => {
            const setA = new Set(idxSet.map((i) => reqIds[i]!));
            const halfA = pool.filter((v) => setA.has(v.reqId)).map((v) => v.value);
            const halfB = pool.filter((v) => !setA.has(v.reqId)).map((v) => v.value);
            const cap = Math.min(halfA.length, halfB.length);
            return computeProbeSubsetScore(probe, halfA.slice(0, cap), halfB.slice(0, cap));
          })
      : [
          computeProbeSubsetScore(
            probe,
            pool.slice(0, Math.floor(pool.length / 2)).map((v) => v.value),
            pool.slice(Math.floor(pool.length / 2), 2 * Math.floor(pool.length / 2)).map((v) => v.value),
          ),
        ];
  const meanSplitSim = splitScores.reduce((a, b) => a + b, 0) / splitScores.length;
  return { intraProbeSim: meanSplitSim, intraProbeLowerBound: computeFifthPercentileBound(checkScores) };
}

export function buildPairwiseRefDistsForProbe(
  prepC: PreparedProbeFolds,
  prepA: PreparedProbeFolds,
): { refDistsC: PooledProbeDistributions[]; refDistsA: PooledProbeDistributions[] } {
  const commonCap = Math.min(prepC.singleRefCapacity, prepA.singleRefCapacity);
  const slicePool = (prep: PreparedProbeFolds): PooledProbeDistributions[] =>
    commonCap === prep.singleRefCapacity
      ? [...prep.singleRefDists]
      : prep.remainingByFold.map((rem) => poolProbeDistributions(prep.probe, rem.slice(0, commonCap)));
  return { refDistsC: slicePool(prepC), refDistsA: slicePool(prepA) };
}

function solvePairwiseThreshold(
  foldDiffsC: readonly number[],
  foldDiffsA: readonly number[],
  targetAccuracy: number,
) {
  const R = foldDiffsC.length;
  const minDecided = Math.min(10, R);
  const candSet = new Set<number>([MIN_PAIRWISE_THRESHOLD]);
  for (const d of [...foldDiffsC, ...foldDiffsA]) {
    if (Math.abs(d) >= MIN_PAIRWISE_THRESHOLD) candSet.add(Math.abs(d));
  }
  for (const t of [...candSet].sort((a, b) => a - b)) {
    const decidedC = foldDiffsC.filter((d) => Math.abs(d) >= t).length;
    const decidedA = foldDiffsA.filter((d) => Math.abs(d) >= t).length;
    const totalDecided = decidedC + decidedA;
    if (decidedC / R < 0.5 || decidedA / R < 0.5 || totalDecided < minDecided) continue;
    const correct = foldDiffsC.filter((d) => d >= t).length + foldDiffsA.filter((d) => d <= -t).length;
    const acc = correct / totalDecided;
    if (acc >= targetAccuracy) {
      return { threshold: t, distinguishable: true, conditionalAccuracy: acc, coverageC: decidedC / R, coverageA: decidedA / R };
    }
  }
  return { threshold: null, distinguishable: false, conditionalAccuracy: null, coverageC: 0, coverageA: 0 };
}

export function calibrateModelPair(
  sharedProbes: readonly ProbeId[],
  preparedC: Readonly<Partial<Record<ProbeId, PreparedProbeFolds>>>,
  preparedA: Readonly<Partial<Record<ProbeId, PreparedProbeFolds>>>,
  foldCount: number,
  targetAccuracy = DEFAULT_TARGET_ACCURACY,
): PairwiseCalibration {
  const foldDiffsC = new Array<number>(foldCount).fill(0);
  const foldDiffsA = new Array<number>(foldCount).fill(0);
  for (const p of sharedProbes) {
    const prepC = preparedC[p]!;
    const prepA = preparedA[p]!;
    const { refDistsC, refDistsA } = buildPairwiseRefDistsForProbe(prepC, prepA);
    for (let r = 0; r < foldCount; r += 1) {
      foldDiffsC[r]! += (computePooledProbeScore(refDistsC[r]!, prepC.queryDists[r]!) - computePooledProbeScore(refDistsA[r]!, prepC.queryDists[r]!)) / sharedProbes.length;
      foldDiffsA[r]! += (computePooledProbeScore(refDistsC[r]!, prepA.queryDists[r]!) - computePooledProbeScore(refDistsA[r]!, prepA.queryDists[r]!)) / sharedProbes.length;
    }
  }
  return { sharedProbes: [...sharedProbes], foldDiffsC, foldDiffsA, ...solvePairwiseThreshold(foldDiffsC, foldDiffsA, targetAccuracy) };
}

export function computeExpectedRatesForDeclaredModel(
  selfFoldScores: readonly number[],
  selfLowerBound: number,
  calibrations: readonly PairwiseCalibration[],
): { expectedConsistency: number; expectedFalseInconsistentRate: number } {
  const R = selfFoldScores.length;
  const distCals = calibrations.filter(
    (c): c is PairwiseCalibration & { threshold: number } => c.distinguishable && c.threshold !== null,
  );
  if (distCals.length === 0 || R === 0) return { expectedConsistency: 0, expectedFalseInconsistentRate: 0 };
  let consistentFolds = 0;
  let falseInconsistentFolds = 0;
  for (let r = 0; r < R; r += 1) {
    if (distCals.some((c) => c.foldDiffsC[r]! <= -c.threshold)) {
      falseInconsistentFolds += 1;
    } else if (selfFoldScores[r]! >= selfLowerBound && distCals.every((c) => c.foldDiffsC[r]! >= c.threshold)) {
      consistentFolds += 1;
    }
  }
  return { expectedConsistency: consistentFolds / R, expectedFalseInconsistentRate: falseInconsistentFolds / R };
}

export function decodeSampleSetAttempts(
  sampleSet: ProbeSampleSet,
  samplesPerProbe = DEFAULT_SAMPLES_PER_PROBE,
  valuesPerCheck = DEFAULT_VALUES_PER_CHECK,
  overrides?: ModelPromptOverrides,
  customProbe?: Probe,
  samplesByProbe?: Partial<Record<ProbeId, number>>,
): DecodedAttemptSummary[] {
  const probe = customProbe ?? getProbe(sampleSet.probe);
  const targetForProbe = resolveProbeTargetSamples(sampleSet.probe, { samplesPerProbe, samplesByProbe });
  const activeCodec = probe.resolveCodec({ cli: sampleSet.cli, model: sampleSet.model }, overrides);
  const allValid: QualifiedProbeValue[] = [];
  const extracted = sampleSet.attempts.map((a) => {
    if (a.outcome !== "ok") return { values: [] as string[], matchedCodecId: null, rejectionReason: null };
    const ext = probe.extractAttempt(a, activeCodec);
    if (a.excluded !== true) ext.values.forEach((v) => allValid.push({ reqId: a.reqId, value: v }));
    return ext;
  });
  const activeCounts = new Map<string, number>();
  for (const item of capAndSliceReferencePool(allValid, targetForProbe, valuesPerCheck)) {
    activeCounts.set(item.reqId, (activeCounts.get(item.reqId) ?? 0) + 1);
  }
  return sampleSet.attempts.map((a, idx) => {
    const ext = extracted[idx]!;
    const rest = allValid.filter((v) => v.reqId !== a.reqId).map((v) => v.value);
    const sampleSelfSim =
      a.outcome === "ok" && a.excluded !== true && ext.values.length > 0 && rest.length > 0
        ? computeProbeSubsetScore(probe, rest, ext.values)
        : null;
    return {
      reqId: a.reqId, at: a.at, profile: a.profile, codecId: a.codecId ?? "default",
      valuesPerCall: a.valuesPerCall, outcome: a.outcome, wroteFile: a.wroteFile === true,
      excluded: a.excluded === true, durationMs: a.durationMs, usage: a.usage,
      estimatedCostUsd: a.estimatedCostUsd, cliVersion: a.cliVersion,
      values: ext.values, matchedCodecId: ext.matchedCodecId, rejectionReason: ext.rejectionReason,
      sampleSelfSim, activeWindowCount: activeCounts.get(a.reqId) ?? 0,
    };
  });
}

function evaluatePreparedModels(
  preparedByModel: ReadonlyMap<string, Partial<Record<ProbeId, PreparedProbeFolds>>>,
  selectedProbes: readonly ProbeId[],
  foldCount: number,
  targetAccuracy: number,
) {
  const models = [...preparedByModel.keys()].sort();
  const modelSelfBounds: SelfTestReport["modelSelfBounds"] = {};
  const pairs: SelfTestPairSummary[] = [];
  for (const modelC of models) {
    const prepC = preparedByModel.get(modelC)!;
    const usableC = selectedProbes.filter((p) => prepC[p] !== undefined);
    const selfScores = computeSelfSimFoldScores(usableC, prepC, foldCount);
    const selfLowerBound = computeFifthPercentileBound(selfScores);
    const cals: PairwiseCalibration[] = [];
    for (const modelA of models) {
      if (modelA === modelC) continue;
      const prepA = preparedByModel.get(modelA)!;
      const shared = usableC.filter((p) => prepA[p] !== undefined);
      if (shared.length === 0) continue;
      const cal = calibrateModelPair(shared, prepC, prepA, foldCount, targetAccuracy);
      cals.push(cal);
      pairs.push({
        modelC, modelA, sharedProbes: cal.sharedProbes, threshold: cal.threshold,
        distinguishable: cal.distinguishable, conditionalAccuracy: cal.conditionalAccuracy,
        decidableRate: 0.5 * (cal.coverageC + cal.coverageA),
      });
    }
    modelSelfBounds[modelC] = {
      usableProbes: usableC, selfLowerBound,
      ...computeExpectedRatesForDeclaredModel(selfScores, selfLowerBound, cals),
    };
  }
  return { models, modelSelfBounds, pairs };
}

function computeProbeSeparability(
  models: readonly string[],
  preparedByModel: ReadonlyMap<string, Partial<Record<ProbeId, PreparedProbeFolds>>>,
  selectedProbes: readonly ProbeId[],
  foldCount: number,
  targetAccuracy: number,
): SelfTestReport["probeSeparability"] {
  const probeSeparability: SelfTestReport["probeSeparability"] = {};
  for (const p of selectedProbes) {
    const pModels = models.filter((m) => preparedByModel.get(m)?.[p] !== undefined);
    let distCount = 0;
    let totalCount = 0;
    const thresholds: number[] = [];
    for (let i = 0; i < pModels.length; i += 1) {
      for (let j = i + 1; j < pModels.length; j += 1) {
        totalCount += 1;
        const cal = calibrateModelPair([p], preparedByModel.get(pModels[i]!)!, preparedByModel.get(pModels[j]!)!, foldCount, targetAccuracy);
        if (cal.distinguishable && cal.threshold !== null) {
          distCount += 1;
          thresholds.push(cal.threshold);
        }
      }
    }
    probeSeparability[p] = {
      distinguishablePairs: distCount, totalPairs: totalCount,
      meanThreshold: thresholds.length > 0 ? thresholds.reduce((a, b) => a + b, 0) / thresholds.length : null,
    };
  }
  return probeSeparability;
}

function buildCapacityCurve(
  sampleSetsByModel: ReadonlyMap<string, Readonly<Partial<Record<ProbeId, ProbeSampleSet>>>>,
  selectedProbes: readonly ProbeId[], maxSubsetSize: number, valuesPerCheck: number,
  targetAccuracy: number, overrides?: ModelPromptOverrides,
): CapacityCurvePoint[] {
  const minSubset = Math.max(5, 2 * valuesPerCheck);
  const candidates: number[] = [];
  for (let step = 5; step < maxSubsetSize; step += 5) candidates.push(step);
  candidates.push(maxSubsetSize);
  const sizes = candidates.filter((s, idx, arr) => s >= minSubset && s <= maxSubsetSize && arr.indexOf(s) === idx);
  return sizes.map((subsetSize) => {
    const subFolds = buildFoldIndexSets(subsetSize, valuesPerCheck);
    const subPrep = prepareAllModelsFolds(sampleSetsByModel, selectedProbes, subsetSize, valuesPerCheck, subFolds, overrides);
    const subEval = evaluatePreparedModels(subPrep, selectedProbes, subFolds.length, targetAccuracy);
    const uniquePairs = subEval.pairs.filter((pr) => pr.modelC < pr.modelA);
    const meanExpectedConsistency =
      subEval.models.length > 0
        ? subEval.models.reduce((acc, m) => acc + (subEval.modelSelfBounds[m]?.expectedConsistency ?? 0), 0) / subEval.models.length
        : 0;
    return {
      subsetSize, distinguishablePairs: uniquePairs.filter((pr) => pr.distinguishable).length,
      totalPairs: uniquePairs.length, meanExpectedConsistency,
    };
  });
}

export function buildSelfTestReport(options: {
  sampleSetsByModel: ReadonlyMap<string, Readonly<Partial<Record<ProbeId, ProbeSampleSet>>>>;
  probes?: readonly ProbeId[]; samplesPerProbe?: number; samplesByProbe?: Partial<Record<ProbeId, number>>;
  valuesPerCheck?: number; targetAccuracy?: number; overrides?: ModelPromptOverrides;
}): SelfTestReport {
  const valuesPerCheck = options.valuesPerCheck ?? DEFAULT_VALUES_PER_CHECK;
  const targetAccuracy = options.targetAccuracy ?? DEFAULT_TARGET_ACCURACY;
  const selectedProbes = options.probes && options.probes.length > 0 ? options.probes : PROBE_IDS;
  const minTarget = resolveMinProbeTargetSamples(selectedProbes, {
    samplesPerProbe: options.samplesPerProbe, samplesByProbe: options.samplesByProbe,
  });
  const foldIndices = buildFoldIndexSets(minTarget, valuesPerCheck);
  const foldCount = foldIndices.length;
  const preparedByModel = prepareAllModelsFolds(
    options.sampleSetsByModel, selectedProbes, options.samplesPerProbe ?? minTarget,
    valuesPerCheck, foldIndices, options.overrides, options.samplesByProbe,
  );
  const { models, modelSelfBounds, pairs } = evaluatePreparedModels(preparedByModel, selectedProbes, foldCount, targetAccuracy);
  return {
    samplesPerProbe: options.samplesPerProbe ?? minTarget,
    ...(options.samplesByProbe ? { samplesByProbe: options.samplesByProbe } : {}),
    valuesPerCheck, foldCount, targetAccuracy, modelSelfBounds, pairs,
    probeSeparability: computeProbeSeparability(models, preparedByModel, selectedProbes, foldCount, targetAccuracy),
    capacityCurve: buildCapacityCurve(options.sampleSetsByModel, selectedProbes, minTarget, valuesPerCheck, targetAccuracy, options.overrides),
  };
}

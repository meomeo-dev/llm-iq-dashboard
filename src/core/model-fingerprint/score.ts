/**
 * 模型指纹打分与四态判决状态机（score.ts）：
 * 基于等容量子参照（单模型 N_ref,p(M) 与成对公共容量 N_ref,p(C, A)）计算单探针相似度、
 * 成对得分差 D(A)、候选自身下界过滤 A_match、确定性全序 closestCandidate 以及四态判决。
 */

import {
  computePooledProbeScore,
  poolProbeDistributions,
  type PooledProbeDistributions,
} from "./jsd";
import { getProbe } from "./probes";
import {
  buildFoldIndexSets,
  buildPairwiseRefDistsForProbe,
  calibrateModelPair,
  computeExpectedRatesForDeclaredModel,
  computeFifthPercentileBound,
  computeSelfSimFoldScores,
  prepareAllModelsFolds,
  resolveMinProbeTargetSamples,
  type PairwiseCalibration,
  type PreparedProbeFolds,
} from "./self-test";
import {
  DEFAULT_SAMPLES_PER_PROBE,
  DEFAULT_TARGET_ACCURACY,
  DEFAULT_VALUES_PER_CHECK,
  PROBE_IDS,
  type InconclusiveReason,
  type ModelComparisonResult,
  type ModelPromptOverrides,
  type ModelRankingEntry,
  type ProbeId,
  type ProbeSampleSet,
  type UncomparedModelInfo,
  type Verdict,
} from "./types";

export interface ScoreCheckOptions {
  readonly declaredModel: string;
  readonly queryValuesByProbe: Readonly<Partial<Record<ProbeId, readonly string[]>>>;
  readonly sampleSetsByModel: ReadonlyMap<
    string,
    Readonly<Partial<Record<ProbeId, ProbeSampleSet>>>
  >;
  readonly selectedProbes?: readonly ProbeId[];
  readonly samplesPerProbe?: number;
  readonly samplesByProbe?: Partial<Record<ProbeId, number>>;
  readonly valuesPerCheck?: number;
  readonly targetAccuracy?: number;
  readonly overrides?: ModelPromptOverrides;
}

export interface ScoreCheckOutput {
  readonly validProbes: ProbeId[];
  readonly uncomparedModels: UncomparedModelInfo[];
  readonly probeScores: Partial<Record<ProbeId, Record<string, number>>>;
  readonly selfSim: number | null;
  readonly selfLowerBound: number | null;
  readonly expectedConsistency: number | null;
  readonly expectedFalseInconsistentRate: number | null;
  readonly verdict: Verdict;
  readonly inconclusiveReason: InconclusiveReason | null;
  readonly closestCandidate: string | null;
  readonly comparisons: ModelComparisonResult[];
  readonly ranking: ModelRankingEntry[];
}

function compareCodePointOrder(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function compareMatchingCandidates(a: ModelComparisonResult, b: ModelComparisonResult): number {
  if (a.scoreDiff !== b.scoreDiff) return a.scoreDiff - b.scoreDiff;
  if (a.sharedProbes.length !== b.sharedProbes.length) {
    return b.sharedProbes.length - a.sharedProbes.length;
  }
  if (a.candidateSelfSim !== b.candidateSelfSim) {
    return b.candidateSelfSim - a.candidateSelfSim;
  }
  return compareCodePointOrder(a.candidateModel, b.candidateModel);
}

function resolveInconclusiveReason(
  passesSelfBound: boolean,
  totalComparisons: number,
  distCount: number,
): InconclusiveReason {
  if (!passesSelfBound) return "below-self-lower-bound";
  if (totalComparisons === 0) return "single-reference-only";
  if (distCount === 0) return "candidates-indistinguishable";
  return "within-threshold-margin";
}

export function evaluateVerdictState(params: {
  validProbes: readonly ProbeId[];
  selfSim: number | null;
  selfLowerBound: number | null;
  comparisons: readonly ModelComparisonResult[];
}): {
  verdict: Verdict;
  inconclusiveReason: InconclusiveReason | null;
  closestCandidate: string | null;
} {
  const { validProbes, selfSim, selfLowerBound, comparisons } = params;
  if (validProbes.length === 0 || selfSim === null || selfLowerBound === null) {
    return { verdict: "not-comparable", inconclusiveReason: null, closestCandidate: null };
  }
  const distComparisons = comparisons.filter(
    (c): c is ModelComparisonResult & { threshold: number } =>
      c.distinguishable && c.threshold !== null,
  );
  const inconsistent = distComparisons.filter((c) => c.scoreDiff <= -c.threshold);
  if (inconsistent.length > 0) {
    const matched = inconsistent
      .filter((c) => c.candidateSelfSim >= c.candidateLowerBound)
      .sort(compareMatchingCandidates);
    return {
      verdict: "inconsistent",
      inconclusiveReason: null,
      closestCandidate: matched[0]?.candidateModel ?? null,
    };
  }
  const passesSelfBound = selfSim >= selfLowerBound;
  if (
    passesSelfBound &&
    distComparisons.length > 0 &&
    distComparisons.every((c) => c.scoreDiff >= c.threshold)
  ) {
    return { verdict: "consistent", inconclusiveReason: null, closestCandidate: null };
  }
  return {
    verdict: "inconclusive",
    inconclusiveReason: resolveInconclusiveReason(
      passesSelfBound,
      comparisons.length,
      distComparisons.length,
    ),
    closestCandidate: null,
  };
}

function computeSingleModelProbeScores(
  validProbes: readonly ProbeId[],
  queryDistByProbe: Readonly<Partial<Record<ProbeId, PooledProbeDistributions>>>,
  preparedByModel: ReadonlyMap<string, Partial<Record<ProbeId, PreparedProbeFolds>>>,
): Partial<Record<ProbeId, Record<string, number>>> {
  const probeScores: Partial<Record<ProbeId, Record<string, number>>> = {};
  for (const p of validProbes) {
    const qDist = queryDistByProbe[p]!;
    const byModel: Record<string, number> = {};
    for (const [model, prepMap] of preparedByModel.entries()) {
      const prep = prepMap[p];
      if (!prep) continue;
      const sum = prep.singleRefDists.reduce(
        (acc, refDist) => acc + computePooledProbeScore(refDist, qDist),
        0,
      );
      byModel[model] = sum / prep.singleRefDists.length;
    }
    probeScores[p] = byModel;
  }
  return probeScores;
}

function computePairwiseProbeDeltas(
  sharedProbes: readonly ProbeId[],
  prepC: Readonly<Partial<Record<ProbeId, PreparedProbeFolds>>>,
  prepA: Readonly<Partial<Record<ProbeId, PreparedProbeFolds>>>,
  queryDistByProbe: Readonly<Partial<Record<ProbeId, PooledProbeDistributions>>>,
  foldCount: number,
): Partial<Record<ProbeId, number>> {
  const probeDeltas: Partial<Record<ProbeId, number>> = {};
  for (const p of sharedProbes) {
    const qDist = queryDistByProbe[p]!;
    const { refDistsC, refDistsA } = buildPairwiseRefDistsForProbe(prepC[p]!, prepA[p]!);
    let foldSum = 0;
    for (let r = 0; r < foldCount; r += 1) {
      foldSum +=
        computePooledProbeScore(refDistsC[r]!, qDist) -
        computePooledProbeScore(refDistsA[r]!, qDist);
    }
    probeDeltas[p] = foldSum / foldCount;
  }
  return probeDeltas;
}

function buildCandidateComparison(params: {
  candidateModel: string;
  sharedProbes: readonly ProbeId[];
  prepC: Readonly<Partial<Record<ProbeId, PreparedProbeFolds>>>;
  prepA: Readonly<Partial<Record<ProbeId, PreparedProbeFolds>>>;
  sampleSetsA: Readonly<Partial<Record<ProbeId, ProbeSampleSet>>>;
  queryDistByProbe: Readonly<Partial<Record<ProbeId, PooledProbeDistributions>>>;
  probeScores: Readonly<Partial<Record<ProbeId, Record<string, number>>>>;
  foldCount: number;
  targetAccuracy: number;
}): { comparison: ModelComparisonResult; calibration: PairwiseCalibration } {
  const { candidateModel, sharedProbes, prepC, prepA, foldCount, targetAccuracy } = params;
  const calibration = calibrateModelPair(sharedProbes, prepC, prepA, foldCount, targetAccuracy);
  const probeDeltas = computePairwiseProbeDeltas(
    sharedProbes,
    prepC,
    prepA,
    params.queryDistByProbe,
    foldCount,
  );
  const deltaSum = sharedProbes.reduce((acc, p) => acc + (probeDeltas[p] ?? 0), 0);
  const candSimSum = sharedProbes.reduce(
    (acc, p) => acc + (params.probeScores[p]?.[candidateModel] ?? 0),
    0,
  );
  const rawScoreDiff = deltaSum / sharedProbes.length;
  const candidateSelfSim = candSimSum / sharedProbes.length;
  const candidateLowerBound = computeFifthPercentileBound(
    computeSelfSimFoldScores(sharedProbes, prepA, foldCount),
  );
  const candidateAppliedEffort = params.sampleSetsA[sharedProbes[0]!]?.appliedEffort ?? "low";

  return {
    calibration,
    comparison: {
      candidateModel,
      candidateAppliedEffort,
      sharedProbes: [...sharedProbes],
      probeDeltas,
      scoreDiff: rawScoreDiff,
      rawScoreDiff,
      threshold: calibration.threshold,
      distinguishable: calibration.distinguishable,
      candidateSelfSim,
      candidateLowerBound,
    },
  };
}

function buildModelRanking(
  validProbes: readonly ProbeId[],
  probeScores: Readonly<Partial<Record<ProbeId, Record<string, number>>>>,
  models: readonly string[],
): ModelRankingEntry[] {
  if (validProbes.length === 0) return [];
  const entries: ModelRankingEntry[] = [];
  for (const model of models) {
    if (!validProbes.every((p) => probeScores[p]?.[model] !== undefined)) continue;
    const sum = validProbes.reduce((acc, p) => acc + (probeScores[p]?.[model] ?? 0), 0);
    entries.push({ model, meanSim: sum / validProbes.length });
  }
  return entries.sort((a, b) =>
    b.meanSim !== a.meanSim ? b.meanSim - a.meanSim : compareCodePointOrder(a.model, b.model),
  );
}

function emptyScoreOutput(
  allOtherModels: readonly string[],
  selectedProbes: readonly ProbeId[],
): ScoreCheckOutput {
  return {
    validProbes: [],
    uncomparedModels: allOtherModels.map((model) => ({ model, missingProbes: [...selectedProbes] })),
    probeScores: {},
    selfSim: null,
    selfLowerBound: null,
    expectedConsistency: null,
    expectedFalseInconsistentRate: null,
    verdict: "not-comparable",
    inconclusiveReason: null,
    closestCandidate: null,
    comparisons: [],
    ranking: [],
  };
}

function collectCandidateComparisons(params: {
  allOtherModels: readonly string[];
  validProbes: readonly ProbeId[];
  prepC: Readonly<Partial<Record<ProbeId, PreparedProbeFolds>>>;
  preparedByModel: ReadonlyMap<string, Partial<Record<ProbeId, PreparedProbeFolds>>>;
  sampleSetsByModel: ReadonlyMap<string, Readonly<Partial<Record<ProbeId, ProbeSampleSet>>>>;
  queryDistByProbe: Readonly<Partial<Record<ProbeId, PooledProbeDistributions>>>;
  probeScores: Readonly<Partial<Record<ProbeId, Record<string, number>>>>;
  foldCount: number;
  targetAccuracy: number;
}) {
  const uncomparedModels: UncomparedModelInfo[] = [];
  const comparisons: ModelComparisonResult[] = [];
  const calibrations: PairwiseCalibration[] = [];

  for (const modelA of params.allOtherModels) {
    const prepA = params.preparedByModel.get(modelA);
    const sharedProbes = params.validProbes.filter((p) => prepA?.[p] !== undefined);
    if (!prepA || sharedProbes.length === 0) {
      uncomparedModels.push({
        model: modelA,
        missingProbes: params.validProbes.filter((p) => prepA?.[p] === undefined),
      });
      continue;
    }
    const { comparison, calibration } = buildCandidateComparison({
      candidateModel: modelA,
      sharedProbes,
      prepC: params.prepC,
      prepA,
      sampleSetsA: params.sampleSetsByModel.get(modelA) ?? {},
      queryDistByProbe: params.queryDistByProbe,
      probeScores: params.probeScores,
      foldCount: params.foldCount,
      targetAccuracy: params.targetAccuracy,
    });
    comparisons.push(comparison);
    calibrations.push(calibration);
  }
  return { uncomparedModels, comparisons, calibrations };
}

export function scoreVerificationQuery(options: ScoreCheckOptions): ScoreCheckOutput {
  const samplesPerProbe = options.samplesPerProbe ?? DEFAULT_SAMPLES_PER_PROBE;
  const valuesPerCheck = options.valuesPerCheck ?? DEFAULT_VALUES_PER_CHECK;
  const targetAccuracy = options.targetAccuracy ?? DEFAULT_TARGET_ACCURACY;
  const selectedProbes =
    options.selectedProbes && options.selectedProbes.length > 0 ? options.selectedProbes : PROBE_IDS;
  const minTarget = resolveMinProbeTargetSamples(selectedProbes, {
    samplesPerProbe: options.samplesPerProbe, samplesByProbe: options.samplesByProbe,
  });
  const foldIndices = buildFoldIndexSets(minTarget, valuesPerCheck);
  const foldCount = foldIndices.length;
  const preparedByModel = prepareAllModelsFolds(
    options.sampleSetsByModel, selectedProbes, samplesPerProbe,
    valuesPerCheck, foldIndices, options.overrides, options.samplesByProbe,
  );
  const prepC = preparedByModel.get(options.declaredModel);
  const validProbes = selectedProbes.filter(
    (p) => prepC?.[p] !== undefined && (options.queryValuesByProbe[p]?.length ?? 0) >= valuesPerCheck,
  );
  const allOtherModels = [...options.sampleSetsByModel.keys()].filter((m) => m !== options.declaredModel).sort();
  if (!prepC || validProbes.length === 0) return emptyScoreOutput(allOtherModels, selectedProbes);

  const queryDistByProbe = Object.fromEntries(
    validProbes.map((p) => {
      const probe = getProbe(p);
      const maxBatch = Math.max(valuesPerCheck, probe.defaultCodec.valuesPerCall);
      return [p, poolProbeDistributions(probe, options.queryValuesByProbe[p]!.slice(0, maxBatch))];
    }),
  ) as Partial<Record<ProbeId, PooledProbeDistributions>>;
  const probeScores = computeSingleModelProbeScores(validProbes, queryDistByProbe, preparedByModel);
  const selfSim =
    validProbes.reduce((acc, p) => acc + (probeScores[p]?.[options.declaredModel] ?? 0), 0) / validProbes.length;
  const selfFoldScoresC = computeSelfSimFoldScores(validProbes, prepC, foldCount);
  const selfLowerBound = computeFifthPercentileBound(selfFoldScoresC);
  const { uncomparedModels, comparisons, calibrations } = collectCandidateComparisons({
    allOtherModels, validProbes, prepC, preparedByModel,
    sampleSetsByModel: options.sampleSetsByModel, queryDistByProbe, probeScores, foldCount, targetAccuracy,
  });
  return {
    validProbes, uncomparedModels, probeScores, selfSim, selfLowerBound,
    ...computeExpectedRatesForDeclaredModel(selfFoldScoresC, selfLowerBound, calibrations),
    ...evaluateVerdictState({ validProbes, selfSim, selfLowerBound, comparisons }),
    comparisons,
    ranking: buildModelRanking(validProbes, probeScores, [options.declaredModel, ...allOtherModels]),
  };
}

/**
 * 模型指纹纯函数规划器（plan.ts）：
 * 负责解析探针子集、模拟 --reset/--exclude/--include 内存干跑、计算基准补齐计划（planReferenceFill）、
 * 汇总配置与磁盘并集状态（planFingerprintStatus）以及生成核验执行计划（planVerificationCheck）。
 */

import type { CliKind, EffortLevel } from "../types";
import { getProbe } from "./probes";
import {
  buildFoldIndexSets,
  calibrateModelPair,
  capAndSliceReferencePool,
  computeExpectedRatesForDeclaredModel,
  computeFifthPercentileBound,
  computeIntraProbeConvergence,
  computeSelfSimFoldScores,
  extractValidValuesFromSampleSet,
  prepareAllModelsFolds,
  resolveMinProbeTargetSamples,
  type PairwiseCalibration,
  type PreparedProbeFolds,
} from "./self-test";
import {
  DEFAULT_CHECK_ATTEMPTS,
  DEFAULT_MAX_CALLS_FACTOR,
  DEFAULT_SAMPLES_PER_PROBE,
  DEFAULT_TARGET_ACCURACY,
  DEFAULT_VALUES_PER_CHECK,
  PROBE_IDS,
  isProbeId,
  resolveProbeTargetSamples,
  type FingerprintReferenceTarget,
  type ModelPromptOverrides,
  type ProbeId,
  type ProbeSampleSet,
  type SkippedProbeInfo,
  type UncomparedModelInfo,
} from "./types";

export interface SampleMutationOptions {
  readonly reset?: boolean;
  readonly excludeReqIds?: readonly string[];
  readonly includeReqIds?: readonly string[];
}

export interface ProbeGapSummary {
  readonly cli: CliKind;
  readonly model: string;
  readonly probe: ProbeId;
  readonly codecId: string;
  readonly valuesPerCall: number;
  readonly targetValues: number;
  readonly validValues: number;
  readonly rawValidValues: number;
  readonly missingValues: number;
  readonly plannedValues: number;
  readonly estimatedCalls: number;
  readonly maxCalls: number;
  readonly estimatedCostUsd: number | null;
  readonly usable: boolean;
  readonly intraProbeSim: number | null;
  readonly intraProbeLowerBound: number | null;
  readonly totalAttempts: number;
  readonly excludedAttempts: number;
  readonly cliVersions: string[];
  readonly appliedEffort?: EffortLevel;
  readonly effortHonored?: boolean;
}

export interface FillPlan {
  readonly probes: ProbeId[];
  readonly items: ProbeGapSummary[];
  readonly pendingItems: ProbeGapSummary[];
  readonly totalPlannedValues: number;
  readonly totalEstimatedCalls: number;
  readonly totalMaxCalls: number;
  readonly totalEstimatedCostUsd: number | null;
}

export interface ModelStatusEntry {
  readonly cli: CliKind;
  readonly model: string;
  readonly configuredInReferences: boolean;
  readonly onDisk: boolean;
  readonly usableProbes: ProbeId[];
  readonly probes: Record<ProbeId, ProbeGapSummary>;
}

export interface CheckProbeExecutionPlan {
  readonly probe: ProbeId;
  readonly codecId: string;
  readonly valuesPerCall: number;
  readonly targetValues: number;
  readonly estimatedCalls: number;
  readonly maxCalls: number;
  readonly estimatedCostUsd: number | null;
}

export interface VerificationCheckPlan {
  readonly cli: CliKind;
  readonly declaredModel: string;
  readonly selectedProbes: ProbeId[];
  readonly executableProbes: CheckProbeExecutionPlan[];
  readonly skippedProbes: SkippedProbeInfo[];
  readonly candidateModels: string[];
  readonly indistinguishableCandidates: string[];
  readonly uncomparedModels: UncomparedModelInfo[];
  readonly expectedConsistency: number | null;
  readonly expectedFalseInconsistentRate: number | null;
  readonly totalEstimatedCalls: number;
  readonly totalMaxCalls: number;
  readonly totalEstimatedCostUsd: number | null;
}

function filterValidProbes(list?: readonly string[]): ProbeId[] {
  if (!list || list.length === 0) return [];
  const seen = new Set<ProbeId>();
  const out: ProbeId[] = [];
  for (const item of list) {
    const trimmed = item.trim();
    if (isProbeId(trimmed) && !seen.has(trimmed)) {
      seen.add(trimmed);
      out.push(trimmed);
    }
  }
  return out;
}

export function resolveSelectedProbes(
  requested?: readonly string[],
  configured?: readonly ProbeId[],
): ProbeId[] {
  if (requested !== undefined && requested.length > 0) {
    const fromRequested = filterValidProbes(requested);
    if (fromRequested.length === 0) throw new Error(`Invalid probe filter: ${requested.join(", ")}`);
    return fromRequested;
  }
  const fromConfigured = filterValidProbes(configured);
  return fromConfigured.length > 0 ? fromConfigured : [...PROBE_IDS];
}

export function simulateSampleSetMutation(
  sampleSet: ProbeSampleSet | undefined,
  options?: SampleMutationOptions,
): ProbeSampleSet | undefined {
  if (!sampleSet) return undefined;
  if (options?.reset === true) return { ...sampleSet, attempts: [] };
  const excludeSet = new Set(options?.excludeReqIds ?? []);
  const includeSet = new Set(options?.includeReqIds ?? []);
  if (excludeSet.size === 0 && includeSet.size === 0) return sampleSet;
  return {
    ...sampleSet,
    attempts: sampleSet.attempts.map((a) => {
      if (excludeSet.has(a.reqId)) return { ...a, excluded: true };
      if (includeSet.has(a.reqId)) {
        const next = { ...a };
        delete next.excluded;
        return next;
      }
      return a;
    }),
  };
}

function estimateCallUnitCost(sampleSet: ProbeSampleSet | undefined): number | null {
  if (!sampleSet || sampleSet.attempts.length === 0) return null;
  const costs = sampleSet.attempts
    .map((a) => a.estimatedCostUsd ?? a.usage?.reportedCostUsd)
    .filter((c): c is number => typeof c === "number" && Number.isFinite(c) && c >= 0);
  return costs.length > 0 ? costs.reduce((a, b) => a + b, 0) / costs.length : null;
}

function computeTargetFallbackCost(
  sets: Iterable<ProbeSampleSet>,
  cli: CliKind,
  model: string,
): number | null {
  let sum = 0;
  let count = 0;
  for (const s of sets) {
    if (s.cli !== cli || s.model !== model) continue;
    for (const a of s.attempts) {
      const c = a.estimatedCostUsd ?? a.usage?.reportedCostUsd;
      if (typeof c === "number" && Number.isFinite(c) && c >= 0) {
        sum += c;
        count += 1;
      }
    }
  }
  return count > 0 ? sum / count : null;
}

function collectCliVersions(sampleSet: ProbeSampleSet | undefined): string[] {
  if (!sampleSet) return [];
  const versions = new Set<string>();
  for (const a of sampleSet.attempts) {
    if (a.cliVersion && a.cliVersion.trim() !== "") versions.add(a.cliVersion.trim());
  }
  return [...versions];
}

export function computeProbeSampleGap(params: {
  cli: CliKind;
  model: string;
  probe: ProbeId;
  sampleSet?: ProbeSampleSet;
  samplesPerProbe?: number;
  samplesByProbe?: Partial<Record<ProbeId, number>>;
  valuesPerCheck?: number;
  maxCallsFactor?: number;
  countLimit?: number;
  overrides?: ModelPromptOverrides;
  mutation?: SampleMutationOptions;
  fallbackUnitCostUsd?: number | null;
}): ProbeGapSummary {
  const targetValues = resolveProbeTargetSamples(params.probe, {
    samplesPerProbe: params.samplesPerProbe,
    samplesByProbe: params.samplesByProbe,
  });
  const valuesPerCheck = params.valuesPerCheck ?? DEFAULT_VALUES_PER_CHECK;
  const maxCallsFactor = params.maxCallsFactor ?? DEFAULT_MAX_CALLS_FACTOR;
  const probeObj = getProbe(params.probe);
  const codec = probeObj.resolveCodec({ cli: params.cli, model: params.model }, params.overrides);
  const effectiveSet = simulateSampleSetMutation(params.sampleSet, params.mutation);
  const rawValues = effectiveSet ? extractValidValuesFromSampleSet(effectiveSet, params.overrides, probeObj) : [];
  const validValues = capAndSliceReferencePool(rawValues, targetValues, valuesPerCheck).length;
  const missingValues = Math.max(0, targetValues - validValues);
  const plannedValues =
    params.countLimit !== undefined ? Math.min(missingValues, Math.max(0, params.countLimit)) : missingValues;
  const estimatedCalls = plannedValues > 0 ? Math.ceil(plannedValues / codec.valuesPerCall) : 0;
  const unitCost = estimateCallUnitCost(params.sampleSet) ?? params.fallbackUnitCostUsd ?? null;
  const { intraProbeSim, intraProbeLowerBound } = computeIntraProbeConvergence(
    params.probe, rawValues, targetValues, valuesPerCheck, probeObj,
  );

  return {
    cli: params.cli, model: params.model, probe: params.probe, codecId: codec.id,
    valuesPerCall: codec.valuesPerCall, targetValues, validValues, rawValidValues: rawValues.length,
    missingValues, plannedValues, estimatedCalls, maxCalls: estimatedCalls * maxCallsFactor,
    estimatedCostUsd: unitCost !== null ? estimatedCalls * unitCost : null,
    usable: validValues >= targetValues, intraProbeSim, intraProbeLowerBound,
    totalAttempts: effectiveSet?.attempts.length ?? 0,
    excludedAttempts: effectiveSet?.attempts.filter((a) => a.excluded === true).length ?? 0,
    cliVersions: collectCliVersions(effectiveSet),
    appliedEffort: params.sampleSet?.appliedEffort, effortHonored: params.sampleSet?.effortHonored,
  };
}

export function resolveFillTargets(
  configuredReferences: readonly FingerprintReferenceTarget[],
  sampleSets: ReadonlyMap<string, ProbeSampleSet>,
  cliFilter?: CliKind,
  modelFilter?: string,
): FingerprintReferenceTarget[] {
  if (modelFilter !== undefined && modelFilter.trim() !== "") {
    const trimmedModel = modelFilter.trim();
    if (cliFilter !== undefined) return [{ cli: cliFilter, model: trimmedModel }];
    const matchedConfig = configuredReferences.filter((r) => r.model === trimmedModel);
    if (matchedConfig.length > 0) return matchedConfig;
    const seen = new Set<string>();
    const fromDisk: FingerprintReferenceTarget[] = [];
    for (const set of sampleSets.values()) {
      if (set.model === trimmedModel && !seen.has(`${set.cli}:${set.model}`)) {
        seen.add(`${set.cli}:${set.model}`);
        fromDisk.push({ cli: set.cli, model: set.model });
      }
    }
    return fromDisk;
  }
  return cliFilter !== undefined ? configuredReferences.filter((r) => r.cli === cliFilter) : [...configuredReferences];
}

export function planReferenceFill(options: {
  configuredReferences: readonly FingerprintReferenceTarget[]; sampleSets: ReadonlyMap<string, ProbeSampleSet>;
  cliFilter?: CliKind; modelFilter?: string; requestedProbes?: readonly string[]; configuredProbes?: readonly ProbeId[];
  samplesPerProbe?: number; samplesByProbe?: Partial<Record<ProbeId, number>>;
  valuesPerCheck?: number; maxCallsFactor?: number; countLimit?: number;
  overrides?: ModelPromptOverrides; mutation?: SampleMutationOptions;
}): FillPlan {
  const probes = resolveSelectedProbes(options.requestedProbes, options.configuredProbes);
  const targets = resolveFillTargets(options.configuredReferences, options.sampleSets, options.cliFilter, options.modelFilter);
  const items = targets.flatMap((target) => {
    const fallbackCost = computeTargetFallbackCost(options.sampleSets.values(), target.cli, target.model);
    return probes.map((probe) =>
      computeProbeSampleGap({
        cli: target.cli, model: target.model, probe,
        sampleSet: options.sampleSets.get(`${target.cli}:${target.model}:${probe}`),
        samplesPerProbe: options.samplesPerProbe, samplesByProbe: options.samplesByProbe,
        valuesPerCheck: options.valuesPerCheck, maxCallsFactor: options.maxCallsFactor,
        countLimit: options.countLimit, overrides: options.overrides,
        mutation: options.mutation, fallbackUnitCostUsd: fallbackCost,
      }),
    );
  });
  const pendingItems = items.filter((item) => item.plannedValues > 0);
  const knownCosts = pendingItems.map((i) => i.estimatedCostUsd).filter((c): c is number => c !== null);

  return {
    probes, items, pendingItems,
    totalPlannedValues: pendingItems.reduce((acc, i) => acc + i.plannedValues, 0),
    totalEstimatedCalls: pendingItems.reduce((acc, i) => acc + i.estimatedCalls, 0),
    totalMaxCalls: pendingItems.reduce((acc, i) => acc + i.maxCalls, 0),
    totalEstimatedCostUsd: knownCosts.length > 0 ? knownCosts.reduce((a, b) => a + b, 0) : null,
  };
}

export function planFingerprintStatus(options: {
  configuredReferences: readonly FingerprintReferenceTarget[];
  onDiskSampleSets: readonly ProbeSampleSet[];
  cliFilter?: CliKind;
  modelFilter?: string;
  requestedProbes?: readonly string[];
  configuredProbes?: readonly ProbeId[];
  samplesPerProbe?: number;
  samplesByProbe?: Partial<Record<ProbeId, number>>;
  valuesPerCheck?: number;
  maxCallsFactor?: number;
  overrides?: ModelPromptOverrides;
}): ModelStatusEntry[] {
  const probes = resolveSelectedProbes(options.requestedProbes, options.configuredProbes);
  const configuredKeys = new Set(options.configuredReferences.map((r) => `${r.cli}:${r.model}`));
  const diskKeys = new Set(options.onDiskSampleSets.map((s) => `${s.cli}:${s.model}`));
  const allTargets = new Map<string, FingerprintReferenceTarget>(
    options.configuredReferences.map((r) => [`${r.cli}:${r.model}`, r]),
  );
  for (const s of options.onDiskSampleSets) allTargets.set(`${s.cli}:${s.model}`, { cli: s.cli, model: s.model });
  const sampleMap = new Map(options.onDiskSampleSets.map((s) => [`${s.cli}:${s.model}:${s.probe}`, s]));

  return [...allTargets.entries()]
    .filter(
      ([, t]) =>
        (!options.cliFilter || t.cli === options.cliFilter) &&
        (!options.modelFilter || t.model === options.modelFilter.trim()),
    )
    .map(([key, target]) => {
      const fallbackCost = computeTargetFallbackCost(options.onDiskSampleSets, target.cli, target.model);
      const perProbe = {} as Record<ProbeId, ProbeGapSummary>;
      for (const probe of probes) {
        perProbe[probe] = computeProbeSampleGap({
          cli: target.cli, model: target.model, probe,
          sampleSet: sampleMap.get(`${target.cli}:${target.model}:${probe}`),
          samplesPerProbe: options.samplesPerProbe, samplesByProbe: options.samplesByProbe,
          valuesPerCheck: options.valuesPerCheck, maxCallsFactor: options.maxCallsFactor,
          overrides: options.overrides, fallbackUnitCostUsd: fallbackCost,
        });
      }
      return {
        cli: target.cli, model: target.model,
        configuredInReferences: configuredKeys.has(key), onDisk: diskKeys.has(key),
        usableProbes: probes.filter((p) => perProbe[p]!.usable), probes: perProbe,
      };
    });
}

function partitionCheckProbes(params: {
  cli: CliKind;
  declaredModel: string;
  selectedProbes: readonly ProbeId[];
  declaredSets: Readonly<Partial<Record<ProbeId, ProbeSampleSet>>>;
  samplesPerProbe?: number;
  samplesByProbe?: Partial<Record<ProbeId, number>>;
  valuesPerCheck: number;
  checkAttempts: number;
  overrides?: ModelPromptOverrides;
}) {
  const declaredList = Object.values(params.declaredSets).filter((s): s is ProbeSampleSet => s !== undefined);
  const fallbackCost = computeTargetFallbackCost(declaredList, params.cli, params.declaredModel);
  const executableProbes: CheckProbeExecutionPlan[] = [];
  const skippedProbes: SkippedProbeInfo[] = [];
  for (const probe of params.selectedProbes) {
    const gap = computeProbeSampleGap({
      cli: params.cli, model: params.declaredModel, probe,
      sampleSet: params.declaredSets[probe],
      samplesPerProbe: params.samplesPerProbe, samplesByProbe: params.samplesByProbe,
      valuesPerCheck: params.valuesPerCheck, overrides: params.overrides, fallbackUnitCostUsd: fallbackCost,
    });
    if (!gap.usable) {
      skippedProbes.push({ probe, missingValues: gap.missingValues, estimatedCalls: gap.estimatedCalls });
      continue;
    }
    const estCalls = Math.ceil(params.valuesPerCheck / gap.valuesPerCall);
    const unitCost = estimateCallUnitCost(params.declaredSets[probe]) ?? fallbackCost;
    executableProbes.push({
      probe, codecId: gap.codecId, valuesPerCall: gap.valuesPerCall, targetValues: params.valuesPerCheck,
      estimatedCalls: estCalls, maxCalls: estCalls * params.checkAttempts,
      estimatedCostUsd: unitCost !== null ? estCalls * unitCost : null,
    });
  }
  return { executableProbes, skippedProbes };
}

function inspectCheckCandidates(params: {
  declaredModel: string;
  otherModels: readonly string[];
  execIds: readonly ProbeId[];
  preparedByModel: ReadonlyMap<string, Partial<Record<ProbeId, PreparedProbeFolds>>>;
  foldCount: number;
  targetAccuracy: number;
}) {
  const candidateModels: string[] = [];
  const indistinguishableCandidates: string[] = [];
  const uncomparedModels: UncomparedModelInfo[] = [];
  const calibrations: PairwiseCalibration[] = [];
  const prepC = params.preparedByModel.get(params.declaredModel);

  for (const modelA of params.otherModels) {
    const prepA = params.preparedByModel.get(modelA);
    const shared = params.execIds.filter((p) => prepA?.[p] !== undefined);
    if (!prepA || shared.length === 0) {
      uncomparedModels.push({ model: modelA, missingProbes: params.execIds.filter((p) => !prepA?.[p]) });
      continue;
    }
    candidateModels.push(modelA);
    if (prepC) {
      const cal = calibrateModelPair(shared, prepC, prepA, params.foldCount, params.targetAccuracy);
      calibrations.push(cal);
      if (!cal.distinguishable) indistinguishableCandidates.push(modelA);
    }
  }
  return { prepC, candidateModels, indistinguishableCandidates, uncomparedModels, calibrations };
}

export function planVerificationCheck(options: {
  cli: CliKind; declaredModel: string;
  sampleSetsByModel: ReadonlyMap<string, Readonly<Partial<Record<ProbeId, ProbeSampleSet>>>>;
  requestedProbes?: readonly string[]; configuredProbes?: readonly ProbeId[];
  samplesPerProbe?: number; samplesByProbe?: Partial<Record<ProbeId, number>>;
  valuesPerCheck?: number; checkAttempts?: number; targetAccuracy?: number; overrides?: ModelPromptOverrides;
}): VerificationCheckPlan {
  const valuesPerCheck = options.valuesPerCheck ?? DEFAULT_VALUES_PER_CHECK;
  const checkAttempts = options.checkAttempts ?? DEFAULT_CHECK_ATTEMPTS;
  const targetAccuracy = options.targetAccuracy ?? DEFAULT_TARGET_ACCURACY;
  const selectedProbes = resolveSelectedProbes(options.requestedProbes, options.configuredProbes);
  const { executableProbes, skippedProbes } = partitionCheckProbes({
    cli: options.cli, declaredModel: options.declaredModel, selectedProbes,
    declaredSets: options.sampleSetsByModel.get(options.declaredModel) ?? {},
    samplesPerProbe: options.samplesPerProbe, samplesByProbe: options.samplesByProbe,
    valuesPerCheck, checkAttempts, overrides: options.overrides,
  });
  const execIds = executableProbes.map((e) => e.probe);
  const minTarget = resolveMinProbeTargetSamples(execIds.length > 0 ? execIds : selectedProbes, {
    samplesPerProbe: options.samplesPerProbe, samplesByProbe: options.samplesByProbe,
  });
  const foldIndices = buildFoldIndexSets(minTarget, valuesPerCheck);
  const preparedByModel = prepareAllModelsFolds(
    options.sampleSetsByModel, execIds, options.samplesPerProbe ?? DEFAULT_SAMPLES_PER_PROBE,
    valuesPerCheck, foldIndices, options.overrides, options.samplesByProbe,
  );
  const otherModels = [...options.sampleSetsByModel.keys()].filter((m) => m !== options.declaredModel).sort();
  const { prepC, candidateModels, indistinguishableCandidates, uncomparedModels, calibrations } =
    inspectCheckCandidates({
      declaredModel: options.declaredModel, otherModels, execIds,
      preparedByModel, foldCount: foldIndices.length, targetAccuracy,
    });
  const selfScores = prepC && execIds.length > 0 ? computeSelfSimFoldScores(execIds, prepC, foldIndices.length) : null;
  const rates = selfScores
    ? computeExpectedRatesForDeclaredModel(selfScores, computeFifthPercentileBound(selfScores), calibrations)
    : { expectedConsistency: null, expectedFalseInconsistentRate: null };
  const knownCosts = executableProbes.map((p) => p.estimatedCostUsd).filter((c): c is number => c !== null);
  return {
    cli: options.cli, declaredModel: options.declaredModel, selectedProbes,
    executableProbes, skippedProbes, candidateModels, indistinguishableCandidates, uncomparedModels, ...rates,
    totalEstimatedCalls: executableProbes.reduce((acc, p) => acc + p.estimatedCalls, 0),
    totalMaxCalls: executableProbes.reduce((acc, p) => acc + p.maxCalls, 0),
    totalEstimatedCostUsd: knownCosts.length > 0 ? knownCosts.reduce((a, b) => a + b, 0) : null,
  };
}

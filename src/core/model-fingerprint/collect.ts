/** 模型指纹并发采集与批量核验编排器（collect.ts）：支持多目标单作业编排、按模型分道并发与道内跨探针并发。 */
import type { CapabilitySnapshot } from "../../capabilities/types";
import { describeActiveWorkConflict, findActiveWork } from "../active-work";
import { resolveModelFingerprintConfig, type AppConfig, type ModelFingerprintConfig } from "../config";
import type { Logger } from "../runner";
import { DEFAULT_PROFILE, type CliKind } from "../types";
import {
  clearFingerprintWorkdir, createSessionConcurrencyGate, DEFAULT_DEPS, executeWarmablePool,
  invokeSingleProbeCall, openTrackedJobEnv, resolveFillTargetProfile, resolveFingerprintTarget, runWithConcurrencyLimit,
  type CallExecutionEnv, type CollectDeps, type ResolvedFingerprintTarget, type SessionConcurrencyGate,
} from "./collect-core";
import type { PlannedProbeLaneItem } from "./job";
import {
  planReferenceFill, planVerificationCheck, resolveFillTargets, resolveSelectedProbes,
  type ProbeGapSummary, type VerificationCheckPlan,
} from "./plan";
import { getProbe } from "./probes/index";
import { scoreVerificationQuery } from "./score";
import {
  appendSampleAttempt, buildSampleSetsByKeyMap, buildSampleSetsByModelMap, extractValidCanonicalValues,
  formatCheckId, formatEnvironmentId, listAllSampleSets, mutateSampleSetFlags,
  readCheckRecord, resetSampleSetToArchive, rescoreCheckRecord, saveCheckRecord,
} from "./store";
import {
  resolveProbeValuesPerCheck, type FailedProbeInfo, type FingerprintCheckRecord,
  type ProbeAttempt, type ProbeId, type ProbeOutcome, type ProbeSampleSet, type RejectionReason,
} from "./types";

export { clearFingerprintWorkdir, resolveFillTargetProfile, resolveFingerprintTarget, rescoreCheckRecord };
export type { CollectDeps, ResolvedFingerprintTarget };

export interface ExecuteFillOptions {
  cli?: CliKind;
  profile?: string;
  profilesByCli?: Readonly<Partial<Record<CliKind, string>>>;
  model?: string;
  probes?: readonly string[];
  count?: number;
  exclude?: readonly string[];
  include?: readonly string[];
  reset?: boolean;
  jobId?: string;
  onStarted?: (jobId: string) => void;
  log?: Logger;
}

export interface ExecuteFillProbeSummary {
  cli: CliKind;
  model: string;
  probe: ProbeId;
  collectedNewValues: number;
  effectiveValues: number;
  attemptsUsed: number;
  rejectionCounts: Record<string, number>;
}

export interface ExecuteFillResult {
  jobId: string | null;
  callsExecuted: number;
  failedCalls: number;
  cancelled: boolean;
  items: ExecuteFillProbeSummary[];
}

export interface ExecuteCheckTarget {
  cli: CliKind;
  profile?: string;
  model: string;
  probes?: readonly string[];
}

export interface ExecuteCheckOptions extends ExecuteCheckTarget {
  targets?: readonly ExecuteCheckTarget[];
  jobId?: string;
  onStarted?: (jobId: string) => void;
  log?: Logger;
}

async function applyDiskMutationsForFill(
  config: AppConfig, fpCfg: ModelFingerprintConfig, catalog: CapabilitySnapshot | null, options: ExecuteFillOptions,
): Promise<void> {
  if (options.reset !== true && (options.exclude?.length ?? 0) === 0 && (options.include?.length ?? 0) === 0) return;
  if (options.reset === true && (!options.cli || !options.model?.trim() || (options.probes?.length ?? 0) === 0)) {
    throw new Error("--reset 必须同时显式指定 --cli <cli>、--model <model> 与 --probes <probe,...>");
  }
  const selectedProbes = resolveSelectedProbes(options.probes, fpCfg.probes);
  const existingMap = buildSampleSetsByKeyMap(await listAllSampleSets({ appliedEffort: fpCfg.effort }));
  const targets = resolveFillTargets(fpCfg.references, existingMap, options.cli, options.model);
  for (const target of targets) {
    const { requestedEffort } = resolveFingerprintTarget(config, catalog, target.cli, target.model);
    for (const probe of selectedProbes) {
      if (options.reset === true) await resetSampleSetToArchive({ cli: target.cli, appliedEffort: requestedEffort, model: target.model, probe });
      if ((options.exclude?.length ?? 0) > 0 || (options.include?.length ?? 0) > 0) {
        await mutateSampleSetFlags({ cli: target.cli, appliedEffort: requestedEffort, model: target.model, probe, exclude: options.exclude, include: options.include });
      }
    }
  }
}

async function collectSingleFillItem(
  fpCfg: ModelFingerprintConfig, env: CallExecutionEnv, targetInfo: ResolvedFingerprintTarget,
  profile: string, item: ProbeGapSummary, gate: SessionConcurrencyGate,
): Promise<ExecuteFillProbeSummary> {
  const { cli, model } = targetInfo.target;
  const activeCodec = getProbe(item.probe).resolveCodec({ cli, model }, fpCfg.modelPrompts);
  const targetNew = item.plannedValues;
  const targetTotal = item.validValues + targetNew;
  let effectiveValues = item.validValues;
  let collectedNewValues = 0;
  const rejectionCounts: Record<string, number> = {};

  const attemptsUsed = await executeWarmablePool({
    concurrency: fpCfg.concurrency,
    maxAttempts: Math.ceil(targetNew / activeCodec.valuesPerCall) * fpCfg.maxCallsFactor,
    valuesPerCall: activeCodec.valuesPerCall,
    signal: env.signal,
    gate,
    isComplete: () => collectedNewValues >= targetNew || effectiveValues >= targetTotal,
    canPreReserve: (inFlightValues) => collectedNewValues + inFlightValues < targetNew && effectiveValues + inFlightValues < targetTotal,
    onStep: async (callIndex) => {
      await invokeSingleProbeCall(env, targetInfo, profile, item.probe, fpCfg.modelPrompts, callIndex, async (res) => {
        const updated = await appendSampleAttempt(
          { probe: item.probe, cli, model, requestedEffort: targetInfo.requestedEffort, appliedEffort: targetInfo.appliedEffort, effortHonored: targetInfo.effortHonored },
          res.attempt,
        );
        const valid = extractValidCanonicalValues(updated, item.targetValues, resolveProbeValuesPerCheck(item.probe, fpCfg), fpCfg.modelPrompts);
        const rejectKey = res.attempt.outcome !== "ok" ? res.attempt.outcome : res.rejectionReason;
        if (rejectKey !== null) rejectionCounts[rejectKey] = (rejectionCounts[rejectKey] ?? 0) + 1;
        effectiveValues = valid.length;
        collectedNewValues = Math.max(0, valid.length - item.validValues);
      });
    },
  });
  if (!env.signal.aborted) await env.tracker.trimProbeQueue(cli, profile, model, item.probe);
  return { cli, model, probe: item.probe, collectedNewValues, effectiveValues, attemptsUsed, rejectionCounts };
}

export async function executeFingerprintFill(
  config: AppConfig, options: ExecuteFillOptions, customDeps?: Partial<CollectDeps>,
): Promise<ExecuteFillResult> {
  const deps: CollectDeps = { ...DEFAULT_DEPS, ...customDeps };
  const active = await findActiveWork();
  if (active !== null) throw new Error(describeActiveWorkConflict(active));

  const fpCfg = resolveModelFingerprintConfig(config);
  const catalog = await deps.loadCapabilityCatalog();
  await applyDiskMutationsForFill(config, fpCfg, catalog, options);

  const plan = planReferenceFill({
    configuredReferences: fpCfg.references,
    sampleSets: buildSampleSetsByKeyMap(await listAllSampleSets({ appliedEffort: fpCfg.effort })),
    cliFilter: options.cli, modelFilter: options.model, requestedProbes: options.probes, configuredProbes: fpCfg.probes,
    samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe,
    valuesPerCheck: fpCfg.valuesPerCheck, valuesPerCheckByProbe: fpCfg.valuesPerCheckByProbe,
    maxCallsFactor: fpCfg.maxCallsFactor, countLimit: options.count, overrides: fpCfg.modelPrompts,
  });

  if (options.count === 0 || plan.pendingItems.length === 0) {
    return { jobId: null, callsExecuted: 0, failedCalls: 0, cancelled: false, items: [] };
  }
  return runFillJobExecution(config, fpCfg, catalog, deps, options, plan.pendingItems, plan.totalEstimatedCalls);
}

async function runFillJobExecution(
  config: AppConfig, fpCfg: ModelFingerprintConfig, catalog: CapabilitySnapshot | null, deps: CollectDeps,
  options: ExecuteFillOptions, pendingItems: readonly ProbeGapSummary[], totalEstimatedCalls: number,
): Promise<ExecuteFillResult> {
  const plannedItems: PlannedProbeLaneItem[] = pendingItems.map((item) => {
    const itemProfile = resolveFillTargetProfile(config, item.cli, options);
    const t = resolveFingerprintTarget(config, catalog, item.cli, item.model, itemProfile);
    return { cli: item.cli, profile: itemProfile, model: item.model, effort: t.appliedEffort, probe: item.probe, estimatedCalls: item.estimatedCalls, timeoutMs: t.target.timeoutMs };
  });
  const laneGroups = new Map<string, ProbeGapSummary[]>();
  for (const item of pendingItems) {
    const key = `${item.cli}:${item.model}`;
    const group = laneGroups.get(key) ?? [];
    group.push(item);
    laneGroups.set(key, group);
  }
  const laneLimit = Math.min(Math.max(1, config.run.concurrency), Math.max(1, laneGroups.size));
  const { tracker, cancelWatch, env } = await openTrackedJobEnv({
    config, deps, targets: pendingItems.map((i) => ({ cli: i.cli, profile: resolveFillTargetProfile(config, i.cli, options) })),
    allowDisabled: true, jobId: options.jobId, kind: "fill", totalEstimatedCalls, laneLimit, plannedItems, onStarted: options.onStarted,
  });

  try {
    const groupResults = await runWithConcurrencyLimit([...laneGroups.values()], laneLimit, async (itemsForModel) => {
      if (cancelWatch.signal.aborted) return [] as ExecuteFillProbeSummary[];
      const first = itemsForModel[0]!;
      const itemProfile = resolveFillTargetProfile(config, first.cli, options);
      const targetInfo = resolveFingerprintTarget(config, catalog, first.cli, first.model, itemProfile);
      const gate = createSessionConcurrencyGate(fpCfg.concurrency);
      return Promise.all(itemsForModel.map((item) => collectSingleFillItem(fpCfg, env, targetInfo, itemProfile, item, gate)));
    });
    const summaries = groupResults.flat();
    const finalJob = await tracker.finish();
    return {
      jobId: tracker.jobId, callsExecuted: finalJob.completedCalls, failedCalls: finalJob.failedCalls ?? 0,
      cancelled: cancelWatch.signal.aborted, items: summaries,
    };
  } catch (cause) {
    await tracker.finish({ error: cause instanceof Error ? cause.message : String(cause) });
    throw cause;
  } finally {
    cancelWatch.stop();
    await env.sessions.closeAll();
  }
}

async function collectSingleCheckProbe(
  fpCfg: ModelFingerprintConfig, env: CallExecutionEnv, targetInfo: ResolvedFingerprintTarget,
  profile: string, probeId: ProbeId, gate: SessionConcurrencyGate,
): Promise<{ attempts: ProbeAttempt[]; collected: string[]; lastReason: RejectionReason | ProbeOutcome }> {
  const { cli, model } = targetInfo.target;
  const activeCodec = getProbe(probeId).resolveCodec({ cli, model }, fpCfg.modelPrompts);
  const needed = resolveProbeValuesPerCheck(probeId, fpCfg);
  const resultsByIndex: Array<{ attempt: ProbeAttempt; acceptedValues: string[]; reason: RejectionReason | ProbeOutcome | null } | undefined> = [];
  let collectedCount = 0;

  await executeWarmablePool({
    concurrency: fpCfg.concurrency,
    maxAttempts: Math.ceil(needed / activeCodec.valuesPerCall) * fpCfg.checkAttempts,
    valuesPerCall: activeCodec.valuesPerCall,
    signal: env.signal,
    gate,
    isComplete: () => collectedCount >= needed,
    canPreReserve: (inFlightValues) => collectedCount + inFlightValues < needed,
    onStep: async (callIndex) => {
      const res = await invokeSingleProbeCall(env, targetInfo, profile, probeId, fpCfg.modelPrompts, callIndex);
      if (env.signal.aborted && res.attempt.outcome !== "ok") return;
      const reason = res.attempt.outcome !== "ok" ? res.attempt.outcome : res.rejectionReason;
      resultsByIndex[callIndex] = { attempt: res.attempt, acceptedValues: res.acceptedValues, reason };
      collectedCount += res.acceptedValues.length;
    },
  });
  if (!env.signal.aborted) await env.tracker.trimProbeQueue(cli, profile, model, probeId);

  const ordered = resultsByIndex.filter((r): r is NonNullable<typeof r> => r !== undefined);
  const attempts = ordered.map((r) => r.attempt);
  const collected = ordered.flatMap((r) => r.acceptedValues).slice(0, Math.max(needed, activeCodec.valuesPerCall));
  const lastReason = ordered.reduce<RejectionReason | ProbeOutcome>((acc, r) => (r.reason !== null ? r.reason : acc), "no_candidate");
  return { attempts, collected, lastReason };
}

async function collectCheckProbes(
  fpCfg: ModelFingerprintConfig, env: CallExecutionEnv, targetInfo: ResolvedFingerprintTarget,
  profile: string, probesToRun: readonly ProbeId[],
) {
  const probeAttempts: Partial<Record<ProbeId, ProbeAttempt[]>> = {};
  const queryValuesByProbe: Partial<Record<ProbeId, string[]>> = {};
  const validProbes: ProbeId[] = [];
  const failedProbes: FailedProbeInfo[] = [];
  const gate = createSessionConcurrencyGate(fpCfg.concurrency);

  const probeResults = await Promise.all(
    probesToRun.map(async (probeId) => {
      if (env.signal.aborted) {
        return { probeId, attempts: [] as ProbeAttempt[], collected: [] as string[], lastReason: "no_candidate" as const };
      }
      const res = await collectSingleCheckProbe(fpCfg, env, targetInfo, profile, probeId, gate);
      return { probeId, ...res };
    }),
  );

  for (const { probeId, attempts, collected, lastReason } of probeResults) {
    if (env.signal.aborted && attempts.length === 0) continue;
    probeAttempts[probeId] = attempts;
    if (collected.length >= resolveProbeValuesPerCheck(probeId, fpCfg)) {
      validProbes.push(probeId);
      queryValuesByProbe[probeId] = collected;
    } else {
      failedProbes.push({ probe: probeId, collectedValues: collected.length, attemptsUsed: attempts.length, lastReason });
    }
  }
  return { probeAttempts, queryValuesByProbe, validProbes, failedProbes };
}

interface PreparedCheckTarget {
  input: ExecuteCheckTarget;
  profile: string;
  targetInfo: ResolvedFingerprintTarget;
  sampleSetsByModel: ReadonlyMap<string, Partial<Record<ProbeId, ProbeSampleSet>>>;
  plan: VerificationCheckPlan;
}

function normalizeCheckTargets(options: ExecuteCheckOptions): ExecuteCheckTarget[] {
  const list = options.targets && options.targets.length > 0 ? options.targets : [options];
  const seen = new Set<string>();
  const deduped: ExecuteCheckTarget[] = [];
  for (const t of list) {
    const profile = t.profile?.trim() ? t.profile.trim() : DEFAULT_PROFILE;
    const key = `${t.cli}:${profile}:${t.model}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push({ cli: t.cli, profile, model: t.model, probes: t.probes });
  }
  return deduped;
}

async function prepareCheckBatch(
  config: AppConfig, fpCfg: ModelFingerprintConfig, catalog: CapabilitySnapshot | null, targets: readonly ExecuteCheckTarget[],
): Promise<PreparedCheckTarget[]> {
  const allSets = await listAllSampleSets({ appliedEffort: fpCfg.effort });
  const prepared: PreparedCheckTarget[] = [];
  for (const input of targets) {
    const profile = input.profile?.trim() ? input.profile.trim() : DEFAULT_PROFILE;
    const targetInfo = resolveFingerprintTarget(config, catalog, input.cli, input.model, profile);
    const cliSets = allSets.filter((s) => s.cli === input.cli);
    const sampleSetsByModel = buildSampleSetsByModelMap(cliSets);
    const plan = planVerificationCheck({
      cli: input.cli, declaredModel: input.model, sampleSetsByModel,
      requestedProbes: input.probes, configuredProbes: fpCfg.probes,
      samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe,
      valuesPerCheck: fpCfg.valuesPerCheck, valuesPerCheckByProbe: fpCfg.valuesPerCheckByProbe,
      checkAttempts: fpCfg.checkAttempts, targetAccuracy: fpCfg.targetAccuracy, overrides: fpCfg.modelPrompts,
    });
    if (plan.executableProbes.length === 0) {
      throw new Error(`声明模型 ${input.cli}/${input.model} 在所选探针上没有任何满额基准样本集，无法发起核验。请先运行 pnpm fingerprint:fill 补齐基准样本。`);
    }
    prepared.push({ input, profile, targetInfo, sampleSetsByModel, plan });
  }
  return prepared;
}

async function resolveUniqueCheckId(cli: CliKind, profile: string, now: Date, model: string, includeModel: boolean): Promise<string> {
  const initial = formatCheckId(cli, profile, now, includeModel ? model : undefined);
  if ((await readCheckRecord(initial)) === null) return initial;
  const withModel = formatCheckId(cli, profile, now, model);
  if ((await readCheckRecord(withModel)) === null) return withModel;
  for (let seq = 2; seq <= 99; seq += 1) {
    const candidate = `${withModel}-${seq}`;
    if ((await readCheckRecord(candidate)) === null) return candidate;
  }
  return `${withModel}-${Date.now() % 1000}`;
}

async function finalizeAndSaveCheckRecord(params: {
  prepared: PreparedCheckTarget;
  env: CallExecutionEnv;
  fpCfg: ModelFingerprintConfig;
  collected: Awaited<ReturnType<typeof collectCheckProbes>>;
  includeModelInId: boolean;
  now?: Date;
}): Promise<FingerprintCheckRecord> {
  const { prepared, env, fpCfg, collected, includeModelInId } = params;
  const { input, profile, targetInfo, sampleSetsByModel, plan } = prepared;
  const scoreOut = scoreVerificationQuery({
    declaredModel: input.model, selectedProbes: plan.selectedProbes, queryValuesByProbe: collected.queryValuesByProbe,
    sampleSetsByModel, samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe,
    valuesPerCheck: fpCfg.valuesPerCheck, valuesPerCheckByProbe: fpCfg.valuesPerCheckByProbe,
    targetAccuracy: fpCfg.targetAccuracy, overrides: fpCfg.modelPrompts,
  });
  const now = params.now ?? new Date();
  const checkId = await resolveUniqueCheckId(input.cli, profile, now, targetInfo.target.model, includeModelInId);
  const record: FingerprintCheckRecord = {
    checkId, createdAt: now.toISOString(), cli: input.cli, profile,
    environment: formatEnvironmentId(input.cli, targetInfo.requestedEffort),
    declaredModel: targetInfo.target.model, requestedEffort: targetInfo.requestedEffort,
    appliedEffort: targetInfo.appliedEffort, effortHonored: targetInfo.effortHonored,
    cliVersion: env.cliVersions.get(input.cli) ?? `${input.cli} unknown`,
    selectedProbes: plan.selectedProbes, skippedProbes: plan.skippedProbes,
    failedProbes: collected.failedProbes, probeAttempts: collected.probeAttempts,
    ...scoreOut, rescores: [],
  };
  await saveCheckRecord(record);
  return record;
}

function buildCheckPlannedItems(preparedList: readonly PreparedCheckTarget[]): PlannedProbeLaneItem[] {
  return preparedList.flatMap((item) =>
    item.plan.executableProbes.map((p) => ({
      cli: item.input.cli, profile: item.profile, model: item.input.model,
      effort: item.targetInfo.appliedEffort, probe: p.probe,
      estimatedCalls: p.estimatedCalls, timeoutMs: item.targetInfo.target.timeoutMs,
    })),
  );
}

export async function executeFingerprintCheckBatch(
  config: AppConfig, options: ExecuteCheckOptions, customDeps?: Partial<CollectDeps>,
): Promise<FingerprintCheckRecord[]> {
  const deps: CollectDeps = { ...DEFAULT_DEPS, ...customDeps };
  const active = await findActiveWork();
  if (active !== null) throw new Error(describeActiveWorkConflict(active));

  const fpCfg = resolveModelFingerprintConfig(config);
  const catalog = await deps.loadCapabilityCatalog();
  const preparedList = await prepareCheckBatch(config, fpCfg, catalog, normalizeCheckTargets(options));
  const plannedItems = buildCheckPlannedItems(preparedList);
  const totalEstimatedCalls = preparedList.reduce((sum, item) => sum + item.plan.totalEstimatedCalls, 0);
  const laneLimit = Math.min(Math.max(1, config.run.concurrency), Math.max(1, preparedList.length));
  const batchNow = new Date();

  const { tracker, cancelWatch, env } = await openTrackedJobEnv({
    config, deps, targets: preparedList.map((item) => ({ cli: item.input.cli, profile: item.profile })),
    allowDisabled: true, jobId: options.jobId, kind: "check",
    totalEstimatedCalls, laneLimit, plannedItems, onStarted: options.onStarted,
  });

  try {
    const maybeRecords = await runWithConcurrencyLimit(preparedList, laneLimit, async (prepared) => {
      if (cancelWatch.signal.aborted) return null;
      const probesToRun = prepared.plan.executableProbes.map((p) => p.probe);
      const collected = await collectCheckProbes(fpCfg, env, prepared.targetInfo, prepared.profile, probesToRun);
      if (cancelWatch.signal.aborted && collected.validProbes.length < probesToRun.length) return null;
      const record = await finalizeAndSaveCheckRecord({
        prepared, env, fpCfg, collected, includeModelInId: preparedList.length > 1, now: batchNow,
      });
      await tracker.recordCheckResult(record.checkId);
      return record;
    });
    const records = maybeRecords.filter((r): r is FingerprintCheckRecord => r !== null);
    const checkIds = records.map((r) => r.checkId);
    await tracker.finish({ checkId: checkIds[checkIds.length - 1] ?? null, checkIds });
    return records;
  } catch (cause) {
    await tracker.finish({ error: cause instanceof Error ? cause.message : String(cause) });
    throw cause;
  } finally {
    cancelWatch.stop();
    await env.sessions.closeAll();
  }
}

export async function executeFingerprintCheck(
  config: AppConfig, options: ExecuteCheckOptions, customDeps?: Partial<CollectDeps>,
): Promise<FingerprintCheckRecord> {
  const records = await executeFingerprintCheckBatch(config, options, customDeps);
  if (records.length > 0) return records[0]!;
  const fpCfg = resolveModelFingerprintConfig(config);
  const profile = options.profile?.trim() ? options.profile.trim() : DEFAULT_PROFILE;
  const now = new Date();
  return {
    checkId: formatCheckId(options.cli, profile, now), createdAt: now.toISOString(),
    cli: options.cli, profile, environment: formatEnvironmentId(options.cli, fpCfg.effort),
    declaredModel: options.model, requestedEffort: fpCfg.effort, appliedEffort: fpCfg.effort,
    effortHonored: true, cliVersion: `${options.cli} cancelled`,
    selectedProbes: [], skippedProbes: [], failedProbes: [], probeAttempts: {},
    validProbes: [], probeScores: {}, selfSim: null, selfLowerBound: null,
    verdict: "not-comparable", inconclusiveReason: null, closestCandidate: null,
    comparisons: [], uncomparedModels: [], ranking: [],
    expectedConsistency: null, expectedFalseInconsistentRate: null, rescores: [],
  };
}

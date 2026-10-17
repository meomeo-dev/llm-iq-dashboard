/** 模型指纹并发采集与核验编排器（collect.ts）：预占计数、首请求串行缓存预热、目录隔离清理、凭据拦截与费用统计。 */
import { randomUUID } from "node:crypto";
import { mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { openSessionPool, type AgentReply, type ProfileLaunch, type SessionPool } from "../../adapters/index";
import { effortAdjustable as isEffortAdjustable, effortsFor, readCachedCatalog } from "../../capabilities/catalog";
import { runProbeCommand } from "../../capabilities/probe-command";
import type { CapabilitySnapshot } from "../../capabilities/types";
import { estimateCost, type PriceCatalog } from "../../pricing/catalog";
import { loadPriceCatalog } from "../../pricing/catalog-files";
import { usageFromTranscript } from "../../pricing/usage";
import { describeActiveWorkConflict, findActiveWork } from "../active-work";
import { resolveModelFingerprintConfig, type AppConfig, type ModelFingerprintConfig } from "../config";
import { buildConfigLeakGuard, type LeakGuard } from "../leak-guard";
import { fingerprintWorkdir } from "../paths";
import { launchFor, type Logger } from "../runner";
import { DEFAULT_PROFILE, foldEffort, type AttemptStatus, type CliKind, type EffortLevel, type Target } from "../types";
import { buildPlannedJobLanes, createFingerprintJobTracker, watchFingerprintJobCancel, type FingerprintJobTracker, type PlannedProbeLaneItem } from "./job";
import { planReferenceFill, planVerificationCheck, resolveFillTargets, resolveSelectedProbes, type ProbeGapSummary } from "./plan";
import { getProbe } from "./probes/index";
import { scoreVerificationQuery } from "./score";
import {
  appendSampleAttempt, buildSampleSetsByKeyMap, buildSampleSetsByModelMap, extractValidCanonicalValues,
  formatCheckId, formatEnvironmentId, listAllSampleSets, mutateSampleSetFlags,
  resetSampleSetToArchive, rescoreCheckRecord, saveCheckRecord,
} from "./store";
import type { FailedProbeInfo, FingerprintCheckRecord, ModelPromptOverrides, ProbeAttempt, ProbeId, ProbeOutcome, ProbeSampleSet, RejectionReason } from "./types";

export { rescoreCheckRecord };

export interface CollectDeps {
  openSessionPool: (launches: ReadonlyMap<string, ProfileLaunch>, options?: { fingerprint?: boolean }) => SessionPool;
  resolveCliVersion: (cli: CliKind) => Promise<string>;
  buildLeakGuard: (config: AppConfig) => Promise<LeakGuard>;
  loadPriceCatalog: () => PriceCatalog | null;
  loadCapabilityCatalog: () => Promise<CapabilitySnapshot | null>;
  launchProfile: (config: AppConfig, cli: CliKind, name: string, options?: { allowDisabled?: boolean }) => Promise<ProfileLaunch | string>;
  generateReqId: () => string;
}

const DEFAULT_DEPS: CollectDeps = {
  openSessionPool, resolveCliVersion: defaultResolveCliVersion, buildLeakGuard: buildConfigLeakGuard,
  loadPriceCatalog, loadCapabilityCatalog: readCachedCatalog, launchProfile: launchFor, generateReqId: () => randomUUID().slice(0, 8),
};

async function defaultResolveCliVersion(cli: CliKind): Promise<string> {
  const output = await runProbeCommand(cli, ["--version"]);
  const first = output.stdout.split(/\r?\n/).map((l) => l.trim()).find((l) => l.length > 0);
  return first ? `${cli} ${first.replace(new RegExp(`^${cli}\\s+`, "i"), "")}` : `${cli} unknown`;
}

export async function clearFingerprintWorkdir(workdir: string = fingerprintWorkdir()): Promise<void> {
  await mkdir(workdir, { recursive: true });
  const entries = await readdir(workdir).catch(() => [] as string[]);
  await Promise.all(entries.map((entry) => rm(join(workdir, entry), { recursive: true, force: true })));
}

export interface ResolvedFingerprintTarget {
  target: Target; requestedEffort: EffortLevel; appliedEffort: EffortLevel; effortAdjustable: boolean; effortHonored: boolean;
}

export function resolveFingerprintTarget(
  config: AppConfig, catalog: CapabilitySnapshot | null, cli: CliKind, model: string, profile: string = DEFAULT_PROFILE,
): ResolvedFingerprintTarget {
  const requestedEffort = resolveModelFingerprintConfig(config).effort;
  const appliedEffort = foldEffort(requestedEffort, effortsFor(catalog, cli, model));
  const matched = config.targets.find((t) => t.cli === cli && t.model === model && (t.effort === appliedEffort || t.effort === requestedEffort));
  const timeoutMs = matched?.timeoutMs ?? config.run.timeoutByEffort[appliedEffort] ?? config.run.timeoutByCli[cli] ?? config.run.defaultTimeoutMs;
  return {
    target: {
      id: `fingerprint-${cli}-${model}-${appliedEffort}`, label: `${cli}/${model}`, cli, model, effort: appliedEffort,
      ...(profile !== DEFAULT_PROFILE ? { profile } : {}), timeoutMs, enabled: true, extraArgs: matched?.extraArgs ?? [],
    },
    requestedEffort, appliedEffort, effortAdjustable: isEffortAdjustable(catalog, cli, model), effortHonored: appliedEffort === requestedEffort,
  };
}

function isLeakHit(reply: AgentReply, guard: LeakGuard): boolean {
  if (guard.size === 0) return false;
  return guard.hits(reply.text) || reply.writtenFiles.some((f) => guard.hits(f.content)) || guard.hits(reply.transcript);
}

function classifyReplyOutcome(reply: AgentReply, leaked: boolean): ProbeOutcome {
  if (leaked) return "leak-blocked";
  if (reply.timedOut) return "timeout";
  if (reply.error !== null) return /content.?filter|safety|moderation|policy|blocked/i.test(reply.error) ? "content-filter" : "error";
  return "ok";
}

interface CallExecutionEnv {
  sessions: SessionPool; leakGuard: LeakGuard; priceCatalog: PriceCatalog | null;
  cliVersions: Map<CliKind, string>; workdir: string; signal: AbortSignal; deps: CollectDeps;
  tracker: FingerprintJobTracker;
}

function buildProbeAttemptRecord(
  env: CallExecutionEnv, targetInfo: ResolvedFingerprintTarget, profile: string, reqId: string,
  codecId: string, valuesPerCall: number, startedIso: string, durationMs: number, reply: AgentReply,
): ProbeAttempt {
  const { cli, model } = targetInfo.target;
  const leaked = isLeakHit(reply, env.leakGuard);
  const usage = usageFromTranscript(cli, reply.transcript);
  const estimatedCostUsd = estimateCost(env.priceCatalog, { cli, model, startedAt: startedIso }, usage).usd;
  return {
    at: startedIso, profile, reqId, ...(codecId !== "default" ? { codecId } : {}), valuesPerCall,
    outcome: classifyReplyOutcome(reply, leaked), ...(reply.writtenFiles.length > 0 ? { wroteFile: true } : {}),
    rawText: leaked ? "" : reply.text, durationMs, usage, estimatedCostUsd,
    cliVersion: env.cliVersions.get(cli) ?? `${cli} unknown`,
  };
}

async function invokeSingleProbeCall(
  env: CallExecutionEnv, targetInfo: ResolvedFingerprintTarget, profile: string,
  probeId: ProbeId, modelPrompts: ModelPromptOverrides, callIndex: number = 0,
): Promise<{ attempt: ProbeAttempt; acceptedValues: string[]; rejectionReason: RejectionReason | null }> {
  const { cli, model, timeoutMs } = targetInfo.target;
  const probe = getProbe(probeId);
  const activeCodec = probe.resolveCodec({ cli, model }, modelPrompts);
  const reqId = env.deps.generateReqId();
  const slot = await env.tracker.startProbeCall({
    cli, profile, model, effort: targetInfo.appliedEffort, probe: probeId, callIndex, timeoutMs,
  });
  const startedMs = Date.now();
  const startedIso = new Date(startedMs).toISOString();

  await mkdir(env.workdir, { recursive: true });
  const reply = await env.sessions.sessionFor(cli, profile === DEFAULT_PROFILE ? undefined : profile).ask({
    target: targetInfo.target, promptText: activeCodec.buildPrompt(reqId), workdir: env.workdir,
    appliedEffort: targetInfo.appliedEffort, effortAdjustable: targetInfo.effortAdjustable,
    timeoutMs, signal: env.signal, fingerprint: true,
  });

  if (reply.writtenFiles.length > 0) await clearFingerprintWorkdir(env.workdir);
  const attempt = buildProbeAttemptRecord(
    env, targetInfo, profile, reqId, activeCodec.id, activeCodec.valuesPerCall,
    startedIso, Math.max(0, Date.now() - startedMs), reply,
  );
  const extraction = attempt.outcome === "ok"
    ? probe.extractAttempt(attempt, activeCodec)
    : { values: [] as string[], rejectionReason: null };
  if (!(env.signal.aborted && attempt.outcome !== "ok")) {
    const status: AttemptStatus =
      attempt.outcome === "ok" && extraction.values.length > 0 ? "ok" : attempt.outcome === "timeout" ? "timeout" : "error";
    await env.tracker.finishProbeCall(slot, {
      status, durationMs: attempt.durationMs, probe: probeId, currentTarget: `${cli}/${model}`,
    });
  }
  return { attempt, acceptedValues: extraction.values, rejectionReason: extraction.rejectionReason };
}

export interface ExecuteFillOptions {
  cli?: CliKind; profile?: string; model?: string; probes?: readonly string[]; count?: number;
  exclude?: readonly string[]; include?: readonly string[]; reset?: boolean;
  jobId?: string; onStarted?: (jobId: string) => void; log?: Logger;
}

export interface ExecuteFillProbeSummary {
  cli: CliKind; model: string; probe: ProbeId; collectedNewValues: number;
  effectiveValues: number; attemptsUsed: number; rejectionCounts: Record<string, number>;
}

export interface ExecuteFillResult {
  jobId: string | null; callsExecuted: number; failedCalls: number; cancelled: boolean; items: ExecuteFillProbeSummary[];
}

export interface ExecuteCheckOptions {
  cli: CliKind; profile?: string; model: string; probes?: readonly string[];
  jobId?: string; onStarted?: (jobId: string) => void; log?: Logger;
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

async function executeWarmablePool(params: {
  concurrency: number; maxAttempts: number; valuesPerCall: number; signal: AbortSignal;
  warmedSessions: Set<string>; sessionKey: string; isComplete: () => boolean;
  canPreReserve: (inFlightValues: number) => boolean; onStep: (callIndex: number) => Promise<void>;
}): Promise<number> {
  let launched = 0;
  let inFlight = 0;
  const canLaunch = (): boolean =>
    !params.signal.aborted && launched < params.maxAttempts && !params.isComplete() && params.canPreReserve(inFlight * params.valuesPerCall);
  const stepOne = async (): Promise<void> => {
    const callIndex = launched;
    launched += 1;
    inFlight += 1;
    try { await params.onStep(callIndex); } finally { inFlight -= 1; }
  };
  if (!params.warmedSessions.has(params.sessionKey) && canLaunch()) {
    params.warmedSessions.add(params.sessionKey);
    await stepOne();
  }
  await Promise.all(
    Array.from({ length: Math.max(1, params.concurrency) }, async () => {
      while (!params.signal.aborted && !params.isComplete() && launched < params.maxAttempts) {
        if (canLaunch()) await stepOne();
        else if (inFlight > 0) await new Promise((resolve) => setTimeout(resolve, 10));
        else break;
      }
    }),
  );
  return launched;
}

async function collectSingleFillItem(
  fpCfg: ModelFingerprintConfig, env: CallExecutionEnv, targetInfo: ResolvedFingerprintTarget,
  profile: string, item: ProbeGapSummary, warmedSessions: Set<string>,
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
    valuesPerCall: activeCodec.valuesPerCall, signal: env.signal,
    warmedSessions, sessionKey: `${cli}:${profile}:${model}`,
    isComplete: () => collectedNewValues >= targetNew || effectiveValues >= targetTotal,
    canPreReserve: (inFlightValues) => collectedNewValues + inFlightValues < targetNew && effectiveValues + inFlightValues < targetTotal,
    onStep: async (callIndex) => {
      const res = await invokeSingleProbeCall(env, targetInfo, profile, item.probe, fpCfg.modelPrompts, callIndex);
      if (env.signal.aborted && res.attempt.outcome !== "ok") return;
      const updated = await appendSampleAttempt(
        { probe: item.probe, cli, model, requestedEffort: targetInfo.requestedEffort, appliedEffort: targetInfo.appliedEffort, effortHonored: targetInfo.effortHonored },
        res.attempt,
      );
      const valid = extractValidCanonicalValues(updated, item.targetValues, fpCfg.valuesPerCheck, fpCfg.modelPrompts);
      const rejectKey = res.attempt.outcome !== "ok" ? res.attempt.outcome : res.rejectionReason;
      if (rejectKey !== null) rejectionCounts[rejectKey] = (rejectionCounts[rejectKey] ?? 0) + 1;
      effectiveValues = valid.length;
      collectedNewValues = Math.max(0, valid.length - item.validValues);
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
    configuredReferences: fpCfg.references, sampleSets: buildSampleSetsByKeyMap(await listAllSampleSets({ appliedEffort: fpCfg.effort })),
    cliFilter: options.cli, modelFilter: options.model, requestedProbes: options.probes,
    configuredProbes: fpCfg.probes, samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe,
    valuesPerCheck: fpCfg.valuesPerCheck, maxCallsFactor: fpCfg.maxCallsFactor, countLimit: options.count, overrides: fpCfg.modelPrompts,
  });

  if (options.count === 0 || plan.pendingItems.length === 0) {
    return { jobId: null, callsExecuted: 0, failedCalls: 0, cancelled: false, items: [] };
  }
  return runFillJobExecution(config, fpCfg, catalog, deps, options, plan.pendingItems, plan.totalEstimatedCalls);
}

async function openTrackedJobEnv(params: {
  config: AppConfig; deps: CollectDeps; clis: readonly CliKind[]; profile: string;
  allowDisabled: boolean; jobId?: string; kind: "fill" | "check"; totalEstimatedCalls: number;
  plannedItems: readonly PlannedProbeLaneItem[]; onStarted?: (jobId: string) => void;
}) {
  const launches = new Map<string, ProfileLaunch>();
  if (params.profile !== DEFAULT_PROFILE) {
    for (const cli of new Set(params.clis)) {
      const launch = await params.deps.launchProfile(params.config, cli, params.profile, { allowDisabled: params.allowDisabled });
      if (typeof launch === "string") throw new Error(launch);
      launches.set(params.profile, launch);
    }
  }
  const workdir = fingerprintWorkdir();
  await clearFingerprintWorkdir(workdir);
  const [leakGuard, priceCatalog] = await Promise.all([params.deps.buildLeakGuard(params.config), Promise.resolve(params.deps.loadPriceCatalog())]);
  const cliVersions = new Map<CliKind, string>();
  for (const cli of new Set(params.clis)) cliVersions.set(cli, await params.deps.resolveCliVersion(cli));
  const sessions = params.deps.openSessionPool(launches, { fingerprint: true });

  const lanes = buildPlannedJobLanes(params.plannedItems);
  const tracker = await createFingerprintJobTracker({
    jobId: params.jobId, kind: params.kind, totalEstimatedCalls: params.totalEstimatedCalls, lanes,
  });
  params.onStarted?.(tracker.jobId);
  const cancelWatch = watchFingerprintJobCancel(tracker.jobId);
  cancelWatch.signal.addEventListener("abort", () => void tracker.markCancelling(), { once: true });
  const env: CallExecutionEnv = { sessions, leakGuard, priceCatalog, cliVersions, workdir, signal: cancelWatch.signal, deps: params.deps, tracker };
  return { tracker, cancelWatch, env };
}

async function runFillJobExecution(
  config: AppConfig, fpCfg: ModelFingerprintConfig, catalog: CapabilitySnapshot | null,
  deps: CollectDeps, options: ExecuteFillOptions, pendingItems: readonly ProbeGapSummary[], totalEstimatedCalls: number,
): Promise<ExecuteFillResult> {
  const profile = options.profile ?? DEFAULT_PROFILE;
  const plannedItems: PlannedProbeLaneItem[] = pendingItems.map((item) => {
    const t = resolveFingerprintTarget(config, catalog, item.cli, item.model, profile);
    return { cli: item.cli, profile, model: item.model, effort: t.appliedEffort, probe: item.probe, estimatedCalls: item.estimatedCalls, timeoutMs: t.target.timeoutMs };
  });
  const { tracker, cancelWatch, env } = await openTrackedJobEnv({
    config, deps, clis: pendingItems.map((i) => i.cli), profile,
    allowDisabled: false, jobId: options.jobId, kind: "fill", totalEstimatedCalls, plannedItems, onStarted: options.onStarted,
  });
  const summaries: ExecuteFillProbeSummary[] = [];
  const warmedSessions = new Set<string>();

  try {
    for (const item of pendingItems) {
      if (cancelWatch.signal.aborted) break;
      const targetInfo = resolveFingerprintTarget(config, catalog, item.cli, item.model, profile);
      summaries.push(await collectSingleFillItem(fpCfg, env, targetInfo, profile, item, warmedSessions));
    }
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
  profile: string, probeId: ProbeId, warmedSessions: Set<string>,
): Promise<{ attempts: ProbeAttempt[]; collected: string[]; lastReason: RejectionReason | ProbeOutcome }> {
  const { cli, model } = targetInfo.target;
  const activeCodec = getProbe(probeId).resolveCodec({ cli, model }, fpCfg.modelPrompts);
  const needed = fpCfg.valuesPerCheck;
  const resultsByIndex: Array<{ attempt: ProbeAttempt; acceptedValues: string[]; reason: RejectionReason | ProbeOutcome | null } | undefined> = [];
  let collectedCount = 0;

  await executeWarmablePool({
    concurrency: fpCfg.concurrency,
    maxAttempts: Math.ceil(needed / activeCodec.valuesPerCall) * fpCfg.checkAttempts,
    valuesPerCall: activeCodec.valuesPerCall, signal: env.signal,
    warmedSessions, sessionKey: `${cli}:${profile}:${model}`,
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
  const warmedSessions = new Set<string>();

  for (const probeId of probesToRun) {
    if (env.signal.aborted) break;
    const { attempts, collected, lastReason } = await collectSingleCheckProbe(
      fpCfg, env, targetInfo, profile, probeId, warmedSessions,
    );
    probeAttempts[probeId] = attempts;
    if (collected.length >= fpCfg.valuesPerCheck) {
      validProbes.push(probeId);
      queryValuesByProbe[probeId] = collected;
    } else {
      failedProbes.push({ probe: probeId, collectedValues: collected.length, attemptsUsed: attempts.length, lastReason });
    }
  }
  return { probeAttempts, queryValuesByProbe, validProbes, failedProbes };
}

export async function executeFingerprintCheck(
  config: AppConfig, options: ExecuteCheckOptions, customDeps?: Partial<CollectDeps>,
): Promise<FingerprintCheckRecord> {
  const deps: CollectDeps = { ...DEFAULT_DEPS, ...customDeps };
  const active = await findActiveWork();
  if (active !== null) throw new Error(describeActiveWorkConflict(active));

  const fpCfg = resolveModelFingerprintConfig(config);
  const profile = options.profile ?? DEFAULT_PROFILE;
  const catalog = await deps.loadCapabilityCatalog();
  const targetInfo = resolveFingerprintTarget(config, catalog, options.cli, options.model, profile);
  const referenceSampleSets = await listAllSampleSets({ cli: options.cli, appliedEffort: fpCfg.effort });
  const sampleSetsByModel = buildSampleSetsByModelMap(referenceSampleSets);

  const plan = planVerificationCheck({
    cli: options.cli, declaredModel: options.model, sampleSetsByModel,
    requestedProbes: options.probes, configuredProbes: fpCfg.probes,
    samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe, valuesPerCheck: fpCfg.valuesPerCheck,
    checkAttempts: fpCfg.checkAttempts, targetAccuracy: fpCfg.targetAccuracy, overrides: fpCfg.modelPrompts,
  });
  if (plan.executableProbes.length === 0) {
    throw new Error(`声明模型 ${options.cli}/${options.model} 在所选探针上没有任何满额基准样本集，无法发起核验。请先运行 pnpm fingerprint:fill 补齐基准样本。`);
  }
  return runCheckJobExecution(config, fpCfg, deps, options, profile, targetInfo, sampleSetsByModel, plan);
}

async function finalizeAndSaveCheckRecord(params: {
  options: ExecuteCheckOptions; profile: string; targetInfo: ResolvedFingerprintTarget;
  env: CallExecutionEnv; fpCfg: ModelFingerprintConfig;
  sampleSetsByModel: ReadonlyMap<string, Partial<Record<ProbeId, ProbeSampleSet>>>;
  plan: ReturnType<typeof planVerificationCheck>; collected: Awaited<ReturnType<typeof collectCheckProbes>>;
}): Promise<FingerprintCheckRecord> {
  const { options, profile, targetInfo, env, fpCfg, sampleSetsByModel, plan, collected } = params;
  const scoreOut = scoreVerificationQuery({
    declaredModel: options.model, selectedProbes: plan.selectedProbes,
    queryValuesByProbe: collected.queryValuesByProbe, sampleSetsByModel,
    samplesPerProbe: fpCfg.samplesPerProbe, samplesByProbe: fpCfg.samplesByProbe, valuesPerCheck: fpCfg.valuesPerCheck,
    targetAccuracy: fpCfg.targetAccuracy, overrides: fpCfg.modelPrompts,
  });
  const now = new Date();
  const record: FingerprintCheckRecord = {
    checkId: formatCheckId(options.cli, profile, now), createdAt: now.toISOString(),
    cli: options.cli, profile, environment: formatEnvironmentId(options.cli, targetInfo.requestedEffort),
    declaredModel: targetInfo.target.model, requestedEffort: targetInfo.requestedEffort,
    appliedEffort: targetInfo.appliedEffort, effortHonored: targetInfo.effortHonored,
    cliVersion: env.cliVersions.get(options.cli) ?? `${options.cli} unknown`,
    selectedProbes: plan.selectedProbes, skippedProbes: plan.skippedProbes,
    failedProbes: collected.failedProbes, probeAttempts: collected.probeAttempts,
    ...scoreOut, rescores: [],
  };
  await saveCheckRecord(record);
  return record;
}

async function runCheckJobExecution(
  config: AppConfig, fpCfg: ModelFingerprintConfig, deps: CollectDeps, options: ExecuteCheckOptions,
  profile: string, targetInfo: ResolvedFingerprintTarget,
  sampleSetsByModel: ReadonlyMap<string, Partial<Record<ProbeId, ProbeSampleSet>>>,
  plan: ReturnType<typeof planVerificationCheck>,
): Promise<FingerprintCheckRecord> {
  const plannedItems: PlannedProbeLaneItem[] = plan.executableProbes.map((p) => ({
    cli: options.cli, profile, model: options.model, effort: targetInfo.appliedEffort,
    probe: p.probe, estimatedCalls: p.estimatedCalls, timeoutMs: targetInfo.target.timeoutMs,
  }));
  const { tracker, cancelWatch, env } = await openTrackedJobEnv({
    config, deps, clis: [options.cli], profile, allowDisabled: true,
    jobId: options.jobId, kind: "check", totalEstimatedCalls: plan.totalEstimatedCalls, plannedItems, onStarted: options.onStarted,
  });

  try {
    const collected = await collectCheckProbes(fpCfg, env, targetInfo, profile, plan.executableProbes.map((p) => p.probe));
    const record = await finalizeAndSaveCheckRecord({ options, profile, targetInfo, env, fpCfg, sampleSetsByModel, plan, collected });
    await tracker.finish({ checkId: record.checkId });
    return record;
  } catch (cause) {
    await tracker.finish({ error: cause instanceof Error ? cause.message : String(cause) });
    throw cause;
  } finally {
    cancelWatch.stop();
    await env.sessions.closeAll();
  }
}

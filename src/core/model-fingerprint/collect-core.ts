/** 模型指纹底层单次调用、缓存预热并发闸门与作业环境管理（collect-core.ts）。 */
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
import { resolveModelFingerprintConfig, type AppConfig } from "../config";
import { buildConfigLeakGuard, type LeakGuard } from "../leak-guard";
import { fingerprintWorkdir } from "../paths";
import { launchFor } from "../runner";
import { DEFAULT_PROFILE, foldEffort, type AttemptStatus, type CliKind, type EffortLevel, type Target } from "../types";
import {
  buildPlannedJobLanes,
  createFingerprintJobTracker,
  watchFingerprintJobCancel,
  type FingerprintJobTracker,
  type PlannedProbeLaneItem,
} from "./job";
import { getProbe } from "./probes/index";
import type {
  ModelPromptOverrides,
  ProbeAttempt,
  ProbeId,
  ProbeOutcome,
  RejectionReason,
} from "./types";

export interface CollectDeps {
  openSessionPool: (launches: ReadonlyMap<string, ProfileLaunch>, options?: { fingerprint?: boolean }) => SessionPool;
  resolveCliVersion: (cli: CliKind) => Promise<string>;
  buildLeakGuard: (config: AppConfig) => Promise<LeakGuard>;
  loadPriceCatalog: () => PriceCatalog | null;
  loadCapabilityCatalog: () => Promise<CapabilitySnapshot | null>;
  launchProfile: (config: AppConfig, cli: CliKind, name: string, options?: { allowDisabled?: boolean }) => Promise<ProfileLaunch | string>;
  generateReqId: () => string;
}

export const DEFAULT_DEPS: CollectDeps = {
  openSessionPool,
  resolveCliVersion: defaultResolveCliVersion,
  buildLeakGuard: buildConfigLeakGuard,
  loadPriceCatalog,
  loadCapabilityCatalog: readCachedCatalog,
  launchProfile: launchFor,
  generateReqId: () => randomUUID().slice(0, 8),
};

async function defaultResolveCliVersion(cli: CliKind): Promise<string> {
  const output = await runProbeCommand(cli, ["--version"]);
  const first = output.stdout.split(/\r?\n/).map((l) => l.trim()).find((l) => l.length > 0);
  const cleaned = first?.replace(new RegExp(`^(?:${cli}\\s+)?${cli}(?:-cli)?\\s+`, "i"), "");
  return cleaned ? `${cli} ${cleaned}` : `${cli} unknown`;
}

export async function clearFingerprintWorkdir(workdir: string = fingerprintWorkdir()): Promise<void> {
  await mkdir(workdir, { recursive: true });
  const entries = await readdir(workdir).catch(() => [] as string[]);
  await Promise.all(entries.map((entry) => rm(join(workdir, entry), { recursive: true, force: true })));
}

export interface ResolvedFingerprintTarget {
  target: Target;
  requestedEffort: EffortLevel;
  appliedEffort: EffortLevel;
  effortAdjustable: boolean;
  effortHonored: boolean;
}

export interface FillProfileOptions {
  cli?: CliKind;
  profile?: string;
  profilesByCli?: Readonly<Partial<Record<CliKind, string>>>;
}

export function resolveFillTargetProfile(
  config: AppConfig,
  cli: CliKind,
  options: FillProfileOptions,
): string {
  const byCli = options.profilesByCli?.[cli]?.trim();
  if (byCli && byCli !== DEFAULT_PROFILE) return byCli;
  const raw = options.profile?.trim();
  if (!raw || raw === DEFAULT_PROFILE) return DEFAULT_PROFILE;
  if (options.cli !== undefined) {
    return options.cli === cli ? raw : DEFAULT_PROFILE;
  }
  const declared = config.profiles.find((p) => p.name === raw);
  if (declared && declared.cli !== cli) return DEFAULT_PROFILE;
  return raw;
}

export function resolveFingerprintTarget(
  config: AppConfig,
  catalog: CapabilitySnapshot | null,
  cli: CliKind,
  model: string,
  profile: string = DEFAULT_PROFILE,
): ResolvedFingerprintTarget {
  const requestedEffort = resolveModelFingerprintConfig(config).effort;
  const appliedEffort = foldEffort(requestedEffort, effortsFor(catalog, cli, model));
  const matched = config.targets.find((t) => t.cli === cli && t.model === model && (t.effort === appliedEffort || t.effort === requestedEffort));
  const timeoutMs = matched?.timeoutMs ?? config.run.timeoutByEffort[appliedEffort] ?? config.run.timeoutByCli[cli] ?? config.run.defaultTimeoutMs;
  return {
    target: {
      id: `fingerprint-${cli}-${model}-${appliedEffort}`,
      label: `${cli}/${model}`,
      cli,
      model,
      effort: appliedEffort,
      ...(profile !== DEFAULT_PROFILE ? { profile } : {}),
      timeoutMs,
      enabled: true,
      extraArgs: matched?.extraArgs ?? [],
    },
    requestedEffort,
    appliedEffort,
    effortAdjustable: isEffortAdjustable(catalog, cli, model),
    effortHonored: appliedEffort === requestedEffort,
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

export interface CallExecutionEnv {
  sessions: SessionPool;
  leakGuard: LeakGuard;
  priceCatalog: PriceCatalog | null;
  cliVersions: Map<CliKind, string>;
  workdir: string;
  signal: AbortSignal;
  deps: CollectDeps;
  tracker: FingerprintJobTracker;
}

function buildProbeAttemptRecord(
  env: CallExecutionEnv,
  targetInfo: ResolvedFingerprintTarget,
  profile: string,
  reqId: string,
  codecId: string,
  valuesPerCall: number,
  startedIso: string,
  durationMs: number,
  reply: AgentReply,
): ProbeAttempt {
  const { cli, model } = targetInfo.target;
  const leaked = isLeakHit(reply, env.leakGuard);
  const usage = usageFromTranscript(cli, reply.transcript);
  const estimatedCostUsd = estimateCost(env.priceCatalog, { cli, model, startedAt: startedIso }, usage).usd;
  return {
    at: startedIso,
    profile,
    reqId,
    ...(codecId !== "default" ? { codecId } : {}),
    valuesPerCall,
    outcome: classifyReplyOutcome(reply, leaked),
    ...(reply.writtenFiles.length > 0 || reply.notes.length > 0 ? { wroteFile: true } : {}),
    rawText: leaked ? "" : reply.text,
    durationMs,
    usage,
    estimatedCostUsd,
    cliVersion: env.cliVersions.get(cli) ?? `${cli} unknown`,
  };
}

export interface ProbeCallResult {
  attempt: ProbeAttempt;
  acceptedValues: string[];
  rejectionReason: RejectionReason | null;
}

export async function invokeSingleProbeCall(
  env: CallExecutionEnv,
  targetInfo: ResolvedFingerprintTarget,
  profile: string,
  probeId: ProbeId,
  modelPrompts: ModelPromptOverrides,
  callIndex: number = 0,
  onBeforeFinishSlot?: (res: ProbeCallResult) => Promise<void>,
): Promise<ProbeCallResult> {
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
  const out: ProbeCallResult = { attempt, acceptedValues: extraction.values, rejectionReason: extraction.rejectionReason };

  if (env.signal.aborted) {
    await env.tracker.cancelProbeCall(slot, attempt.durationMs);
    return { attempt, acceptedValues: [], rejectionReason: null };
  }
  await onBeforeFinishSlot?.(out);
  const status: AttemptStatus =
    attempt.outcome === "ok" && extraction.values.length > 0 ? "ok" : attempt.outcome === "timeout" ? "timeout" : "error";
  await env.tracker.finishProbeCall(slot, {
    status, durationMs: attempt.durationMs, probe: probeId, currentTarget: `${cli}/${model}`,
    costUsd: attempt.estimatedCostUsd ?? attempt.usage?.reportedCostUsd ?? null,
  });
  return out;
}

/**
 * 同一 (cli, profile, model) 的并发与首请求预热闸门：
 * 第 1 个请求独占执行以建立 Prompt Cache，完成后放开至 concurrency 并发上限（跨探针共享）。
 */
export interface SessionConcurrencyGate {
  run<T>(fn: () => Promise<T>): Promise<T>;
}

export function createSessionConcurrencyGate(concurrency: number): SessionConcurrencyGate {
  const limit = Math.max(1, concurrency);
  let warmed = false;
  let warming = false;
  let active = 0;
  const queue: Array<() => void> = [];

  const pump = () => {
    while (queue.length > 0) {
      if (!warmed) {
        if (warming || active > 0) return;
        warming = true;
        active += 1;
        queue.shift()!();
        return;
      }
      if (active >= limit) return;
      active += 1;
      queue.shift()!();
    }
  };

  return {
    async run<T>(fn: () => Promise<T>): Promise<T> {
      await new Promise<void>((resolve) => {
        queue.push(resolve);
        pump();
      });
      try {
        return await fn();
      } finally {
        active -= 1;
        if (warming) {
          warming = false;
          warmed = true;
        }
        pump();
      }
    },
  };
}

export async function executeWarmablePool(params: {
  concurrency: number;
  maxAttempts: number;
  valuesPerCall: number;
  signal: AbortSignal;
  gate: SessionConcurrencyGate;
  isComplete: () => boolean;
  canPreReserve: (inFlightValues: number) => boolean;
  onStep: (callIndex: number) => Promise<void>;
}): Promise<number> {
  let launched = 0;
  let inFlight = 0;
  const canLaunch = (): boolean =>
    !params.signal.aborted &&
    launched < params.maxAttempts &&
    !params.isComplete() &&
    params.canPreReserve(inFlight * params.valuesPerCall);

  const stepOne = async (): Promise<void> => {
    const callIndex = launched;
    launched += 1;
    inFlight += 1;
    try {
      await params.gate.run(async () => {
        if (params.signal.aborted || params.isComplete()) return;
        await params.onStep(callIndex);
      });
    } finally {
      inFlight -= 1;
    }
  };

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

export async function runWithConcurrencyLimit<T, R>(
  items: readonly T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIdx = 0;
  await Promise.all(
    Array.from({ length: Math.min(Math.max(1, limit), items.length) }, async () => {
      while (nextIdx < items.length) {
        const i = nextIdx;
        nextIdx += 1;
        results[i] = await worker(items[i]!, i);
      }
    }),
  );
  return results;
}

async function launchProfilesForTargets(
  config: AppConfig,
  deps: CollectDeps,
  targets: ReadonlyArray<{ cli: CliKind; profile: string }>,
  allowDisabled: boolean,
): Promise<Map<string, ProfileLaunch>> {
  const launches = new Map<string, ProfileLaunch>();
  const seenProfileClis = new Set<string>();
  for (const t of targets) {
    if (t.profile === DEFAULT_PROFILE) continue;
    const pairKey = `${t.cli}:${t.profile}`;
    if (seenProfileClis.has(pairKey)) continue;
    seenProfileClis.add(pairKey);
    const launch = await deps.launchProfile(config, t.cli, t.profile, { allowDisabled });
    if (typeof launch === "string") throw new Error(launch);
    launches.set(t.profile, launch);
  }
  return launches;
}

export async function openTrackedJobEnv(params: {
  config: AppConfig;
  deps: CollectDeps;
  targets: ReadonlyArray<{ cli: CliKind; profile: string }>;
  allowDisabled: boolean;
  jobId?: string;
  kind: "fill" | "check";
  totalEstimatedCalls: number;
  laneLimit?: number;
  plannedItems: readonly PlannedProbeLaneItem[];
  onStarted?: (jobId: string) => void;
}) {
  const launches = await launchProfilesForTargets(params.config, params.deps, params.targets, params.allowDisabled);
  const workdir = fingerprintWorkdir();
  await clearFingerprintWorkdir(workdir);
  const [leakGuard, priceCatalog] = await Promise.all([
    params.deps.buildLeakGuard(params.config),
    Promise.resolve(params.deps.loadPriceCatalog()),
  ]);
  const cliVersions = new Map<CliKind, string>();
  for (const cli of new Set(params.targets.map((t) => t.cli))) {
    cliVersions.set(cli, await params.deps.resolveCliVersion(cli));
  }
  const sessions = params.deps.openSessionPool(launches, { fingerprint: true });
  const lanes = buildPlannedJobLanes(params.plannedItems);
  const tracker = await createFingerprintJobTracker({
    jobId: params.jobId, kind: params.kind, totalEstimatedCalls: params.totalEstimatedCalls,
    laneLimit: params.laneLimit, lanes,
  });
  params.onStarted?.(tracker.jobId);
  const cancelWatch = watchFingerprintJobCancel(tracker.jobId);
  cancelWatch.signal.addEventListener("abort", () => void tracker.markCancelling(), { once: true });
  const env: CallExecutionEnv = {
    sessions, leakGuard, priceCatalog, cliVersions, workdir, signal: cancelWatch.signal, deps: params.deps, tracker,
  };
  return { tracker, cancelWatch, env };
}

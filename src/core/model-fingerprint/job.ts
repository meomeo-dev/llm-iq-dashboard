/**
 * 模型指纹后台作业状态管理（data/model-fingerprint/jobs/<jobId>.json & <jobId>.cancel.json）：
 * 支持跨进程存活判定（兼容同机 PID 与分容器 externalRunner 心跳）及取消信号监听。
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fingerprintJobsRoot } from "../paths";
import { isProcessAlive, processStartMark } from "../process-identity";
import type { CallProgress, LaneProgress, ProgressView } from "../progress";
import { requestCancelAt, watchCancelAt, type CancelRequest, type CancelWatch } from "../run-cancel";
import { externalRunner, heartbeatCovers, readFreshHeartbeat, type RunnerHeartbeat } from "../runner-link";
import { formatRunId } from "../runner";
import { writeJsonPathAtomic } from "../store";
import { DEFAULT_PROFILE, type AttemptStatus, type CliKind, type EffortLevel } from "../types";
import type { FingerprintJobKind, FingerprintJobRecord, ProbeId } from "./types";

const RECENT_FINGERPRINT_JOBS = 5;

export type { FingerprintJobKind, FingerprintJobRecord } from "./types";

export interface FingerprintJobView extends FingerprintJobRecord {
  alive: boolean;
}

export interface PlannedProbeLaneItem {
  cli: CliKind;
  profile: string;
  model: string;
  effort: EffortLevel;
  probe: ProbeId;
  estimatedCalls: number;
  timeoutMs: number;
}

export interface FingerprintJobTracker {
  readonly jobId: string;
  snapshot(): FingerprintJobRecord;
  setTotalCalls(totalEstimatedCalls: number): Promise<void>;
  markProgress(update: {
    completedCalls?: number;
    failedCalls?: number;
    currentTarget?: string | null;
    currentProbe?: ProbeId | null;
  }): Promise<void>;
  startProbeCall(params: {
    cli: CliKind;
    profile: string;
    model: string;
    effort: EffortLevel;
    probe: ProbeId;
    callIndex: number;
    timeoutMs: number;
  }): Promise<{ laneIndex: number; slotIndex: number }>;
  finishProbeCall(
    slot: { laneIndex: number; slotIndex: number },
    result: { status: AttemptStatus; durationMs: number; probe: ProbeId; currentTarget: string; costUsd?: number | null },
  ): Promise<void>;
  cancelProbeCall(slot: { laneIndex: number; slotIndex: number }, durationMs: number): Promise<void>;
  recordCheckResult(checkId: string): Promise<void>;
  trimProbeQueue(cli: CliKind, profile: string, model: string, probe: ProbeId): Promise<void>;
  markCancelling(at?: string): Promise<void>;
  finish(outcome?: { checkId?: string | null; checkIds?: readonly string[]; error?: string | null }): Promise<FingerprintJobRecord>;
}

export function buildPlannedJobLanes(items: readonly PlannedProbeLaneItem[]): LaneProgress[] {
  const lanes: LaneProgress[] = [];
  const laneByKey = new Map<string, LaneProgress>();
  for (const item of items) {
    const normProfile = item.profile === DEFAULT_PROFILE ? undefined : item.profile;
    const key = `${item.cli}:${normProfile ?? DEFAULT_PROFILE}:${item.model}`;
    let lane = laneByKey.get(key);
    if (!lane) {
      lane = { cli: item.cli, model: item.model, ...(normProfile ? { profile: normProfile } : {}), calls: [] };
      laneByKey.set(key, lane);
      lanes.push(lane);
    }
    const count = Math.max(1, item.estimatedCalls);
    for (let i = 0; i < count; i += 1) {
      lane.calls.push({
        targetId: `${item.cli}__${item.profile}__${item.model}__${item.effort}`,
        promptId: count > 1 ? `${item.probe}#${i + 1}` : item.probe,
        effort: item.effort,
        state: "queued",
        startedAt: null,
        timeoutMs: item.timeoutMs,
        status: null,
        durationMs: null,
      });
    }
  }
  return lanes;
}

export function fingerprintJobPath(jobId: string): string {
  return join(fingerprintJobsRoot(), `${jobId}.json`);
}

export function fingerprintJobCancelPath(jobId: string): string {
  return join(fingerprintJobsRoot(), `${jobId}.cancel.json`);
}

export function formatFingerprintJobId(at: Date = new Date()): string {
  return formatRunId(at);
}

export async function saveFingerprintJob(record: FingerprintJobRecord): Promise<void> {
  await writeJsonPathAtomic(fingerprintJobPath(record.jobId), record);
}

export async function readFingerprintJob(jobId: string): Promise<FingerprintJobRecord | null> {
  try {
    const raw = await readFile(fingerprintJobPath(jobId), "utf8");
    return JSON.parse(raw) as FingerprintJobRecord;
  } catch {
    return null;
  }
}

async function resolveUniqueJobId(explicitId: string | undefined, startedAt: string): Promise<string> {
  if (explicitId) return explicitId;
  const base = formatFingerprintJobId(new Date(startedAt));
  if ((await readFingerprintJob(base)) === null) return base;
  for (let seq = 2; seq <= 99; seq += 1) {
    const candidate = `${base}-${seq}`;
    if ((await readFingerprintJob(candidate)) === null) return candidate;
  }
  return `${base}-${Date.now() % 1000}`;
}

function buildInitialJobRecord(initial: {
  jobId: string;
  kind: FingerprintJobKind;
  startedAt: string;
  totalEstimatedCalls: number;
  laneLimit?: number;
  lanes?: LaneProgress[];
}): FingerprintJobRecord {
  return {
    jobId: initial.jobId,
    kind: initial.kind,
    pid: process.pid,
    pidStart: processStartMark(process.pid),
    startedAt: initial.startedAt,
    updatedAt: initial.startedAt,
    finishedAt: null,
    cancelledAt: null,
    completedCalls: 0,
    totalEstimatedCalls: initial.totalEstimatedCalls,
    failedCalls: 0,
    currentTarget: null,
    currentProbe: null,
    checkId: null,
    checkIds: [],
    error: null,
    laneLimit: initial.laneLimit ?? Math.max(1, initial.lanes?.length ?? 1),
    lanes: initial.lanes ? structuredClone(initial.lanes) : [],
  };
}

function cancelRemainingCallsInLanes(lanes: LaneProgress[] | undefined): void {
  if (!lanes) return;
  const nowMs = Date.now();
  for (const lane of lanes) {
    for (const call of lane.calls) {
      if (call.state === "queued" || call.state === "running") {
        call.durationMs = call.startedAt ? Math.max(0, nowMs - Date.parse(call.startedAt)) : null;
        call.state = "cancelled";
      }
    }
  }
}

function allocateCallSlotInRecord(
  record: FingerprintJobRecord,
  params: { cli: CliKind; profile: string; model: string; effort: EffortLevel; probe: ProbeId; callIndex: number; timeoutMs: number },
): { laneIndex: number; slotIndex: number } {
  record.lanes ??= [];
  const normProfile = params.profile === DEFAULT_PROFILE ? undefined : params.profile;
  let laneIndex = record.lanes.findIndex((l) => l.cli === params.cli && l.model === params.model && l.profile === normProfile);
  if (laneIndex === -1) {
    laneIndex = record.lanes.length;
    record.lanes.push({ cli: params.cli, model: params.model, ...(normProfile ? { profile: normProfile } : {}), calls: [] });
  }
  const lane = record.lanes[laneIndex]!;
  const exactTag = `${params.probe}#${params.callIndex + 1}`;
  let slotIndex = lane.calls.findIndex((c) => c.state === "queued" && (c.promptId === exactTag || c.promptId === params.probe));
  if (slotIndex === -1) {
    slotIndex = lane.calls.findIndex((c) => c.state === "queued" && c.promptId.startsWith(`${params.probe}#`));
  }
  const nowIso = new Date().toISOString();
  if (slotIndex === -1) {
    const newCall: CallProgress = {
      targetId: `${params.cli}__${params.profile}__${params.model}__${params.effort}`,
      promptId: exactTag,
      effort: params.effort,
      state: "running",
      startedAt: nowIso,
      timeoutMs: params.timeoutMs,
      status: null,
      durationMs: null,
    };
    let lastSameProbe = -1;
    for (let i = 0; i < lane.calls.length; i += 1) {
      const pid = lane.calls[i]!.promptId;
      if (pid === params.probe || pid.startsWith(`${params.probe}#`)) lastSameProbe = i;
    }
    if (lastSameProbe >= 0) {
      slotIndex = lastSameProbe + 1;
      lane.calls.splice(slotIndex, 0, newCall);
    } else {
      slotIndex = lane.calls.length;
      lane.calls.push(newCall);
    }
    record.totalEstimatedCalls = Math.max(record.totalEstimatedCalls, record.lanes.reduce((s, l) => s + l.calls.length, 0));
  } else {
    lane.calls[slotIndex]!.state = "running";
    lane.calls[slotIndex]!.startedAt = nowIso;
  }
  return { laneIndex, slotIndex };
}

function refreshRunningCursor(record: FingerprintJobRecord): void {
  for (const lane of record.lanes ?? []) {
    for (const call of lane.calls) {
      if (call.state === "running") {
        record.currentTarget = `${lane.cli}/${lane.model}`;
        const rawProbe = call.promptId.split("#")[0] as ProbeId;
        record.currentProbe = rawProbe;
        return;
      }
    }
  }
  record.currentTarget = null;
  record.currentProbe = null;
}

function applyFinishCallToRecord(
  record: FingerprintJobRecord,
  slot: { laneIndex: number; slotIndex: number },
  result: { status: AttemptStatus; durationMs: number; currentTarget: string; probe: ProbeId; costUsd?: number | null },
): void {
  const call = record.lanes?.[slot.laneIndex]?.calls[slot.slotIndex];
  if (call) {
    call.state = "done";
    call.status = result.status;
    call.durationMs = result.durationMs;
    if (result.costUsd !== undefined) call.costUsd = result.costUsd;
  }
  record.completedCalls += 1;
  if (result.status !== "ok") record.failedCalls = (record.failedCalls ?? 0) + 1;
  if (typeof result.costUsd === "number" && Number.isFinite(result.costUsd) && result.costUsd > 0) {
    record.spentCostUsd = Number(((record.spentCostUsd ?? 0) + result.costUsd).toFixed(6));
  }
  refreshRunningCursor(record);
}

function applyCancelCallToRecord(
  record: FingerprintJobRecord,
  slot: { laneIndex: number; slotIndex: number },
  durationMs: number,
): void {
  const call = record.lanes?.[slot.laneIndex]?.calls[slot.slotIndex];
  if (call && (call.state === "running" || call.state === "queued")) {
    call.state = "cancelled";
    call.durationMs = durationMs;
  }
  refreshRunningCursor(record);
}

function applyTrimProbeQueueToRecord(
  record: FingerprintJobRecord,
  cli: CliKind,
  profile: string,
  model: string,
  probe: ProbeId,
): boolean {
  const normProfile = profile === DEFAULT_PROFILE ? undefined : profile;
  const lane = record.lanes?.find((l) => l.cli === cli && l.model === model && l.profile === normProfile);
  if (!lane) return false;
  lane.calls = lane.calls.filter((c) => c.state !== "queued" || (c.promptId !== probe && !c.promptId.startsWith(`${probe}#`)));
  record.totalEstimatedCalls = Math.max(record.completedCalls, (record.lanes ?? []).reduce((s, l) => s + l.calls.length, 0));
  return true;
}

function applyJobOutcomeToRecord(
  record: FingerprintJobRecord,
  outcome?: { checkId?: string | null; checkIds?: readonly string[]; error?: string | null },
): void {
  if (outcome?.checkId !== undefined) record.checkId = outcome.checkId;
  if (outcome?.checkIds !== undefined) record.checkIds = [...outcome.checkIds];
  if (outcome?.error !== undefined) record.error = outcome.error;
  if (record.cancelledAt != null) cancelRemainingCallsInLanes(record.lanes);
  Object.assign(record, { currentTarget: null, currentProbe: null, finishedAt: new Date().toISOString() });
}

export async function createFingerprintJobTracker(initial: {
  jobId?: string; kind: FingerprintJobKind; startedAt?: string;
  totalEstimatedCalls: number; laneLimit?: number; lanes?: LaneProgress[];
}): Promise<FingerprintJobTracker> {
  const startedAt = initial.startedAt ?? new Date().toISOString();
  const jobId = await resolveUniqueJobId(initial.jobId, startedAt);
  const record = buildInitialJobRecord({ ...initial, jobId, startedAt });
  await saveFingerprintJob(record);

  let writeChain = Promise.resolve();
  const persist = (): Promise<void> => {
    record.updatedAt = new Date().toISOString();
    const snapshot = structuredClone(record);
    writeChain = writeChain.catch(() => {}).then(() => saveFingerprintJob(snapshot));
    return writeChain;
  };

  return {
    jobId: record.jobId,
    snapshot: () => structuredClone(record),
    setTotalCalls: async (n) => { record.totalEstimatedCalls = n; await persist(); },
    markProgress: async (u) => { Object.assign(record, u); await persist(); },
    startProbeCall: async (params) => {
      const slot = allocateCallSlotInRecord(record, params);
      Object.assign(record, { currentTarget: `${params.cli}/${params.model}`, currentProbe: params.probe });
      await persist();
      return slot;
    },
    finishProbeCall: async (slot, result) => { applyFinishCallToRecord(record, slot, result); await persist(); },
    cancelProbeCall: async (slot, durationMs) => { applyCancelCallToRecord(record, slot, durationMs); await persist(); },
    recordCheckResult: async (checkId) => {
      record.checkId = checkId;
      record.checkIds = [...new Set([...(record.checkIds ?? []), checkId])];
      await persist();
    },
    trimProbeQueue: async (cli, profile, model, probe) => {
      if (applyTrimProbeQueueToRecord(record, cli, profile, model, probe)) await persist();
    },
    markCancelling: async (at = new Date().toISOString()) => { record.cancelledAt = at; await persist(); },
    finish: async (outcome) => {
      applyJobOutcomeToRecord(record, outcome);
      await persist();
      return structuredClone(record);
    },
  };
}

function synthesizeLegacyJobLanes(job: FingerprintJobView): LaneProgress[] {
  const total = Math.max(job.totalEstimatedCalls, job.completedCalls);
  if (total === 0) return [];
  const [rawCli, rawModel] = (job.currentTarget ?? "").split("/");
  const cli: CliKind = rawCli === "claude" || rawCli === "codex" || rawCli === "agy" ? rawCli : "agy";
  const model = rawModel || (job.kind === "fill" ? "fingerprint-fill" : "fingerprint-check");
  const failed = job.failedCalls ?? 0;
  const okCount = Math.max(0, job.completedCalls - failed);
  const avgMs = job.completedCalls > 0
    ? Math.max(0, Math.round((Date.parse(job.finishedAt ?? job.updatedAt) - Date.parse(job.startedAt)) / job.completedCalls))
    : 0;
  const calls: CallProgress[] = Array.from({ length: total }, (_, i) => {
    const promptId = job.currentProbe ?? `${job.kind}#${i + 1}`;
    if (i < okCount) {
      return { targetId: `${cli}__${model}`, promptId, effort: "low", state: "done", startedAt: job.startedAt, timeoutMs: 120_000, status: "ok", durationMs: avgMs };
    }
    if (i < job.completedCalls) {
      return { targetId: `${cli}__${model}`, promptId, effort: "low", state: "done", startedAt: job.startedAt, timeoutMs: 120_000, status: "error", durationMs: avgMs };
    }
    if (i === job.completedCalls && job.alive) {
      return { targetId: `${cli}__${model}`, promptId, effort: "low", state: "running", startedAt: job.updatedAt, timeoutMs: 120_000, status: null, durationMs: null };
    }
    return {
      targetId: `${cli}__${model}`,
      promptId,
      effort: "low",
      state: job.cancelledAt ? "cancelled" : "queued",
      startedAt: null,
      timeoutMs: 120_000,
      status: null,
      durationMs: null,
    };
  });
  return [{ cli, model, calls }];
}

export function fingerprintJobToProgressView(job: FingerprintJobView): ProgressView {
  const lanes = job.lanes && job.lanes.length > 0 ? job.lanes : synthesizeLegacyJobLanes(job);
  return {
    runId: job.jobId,
    trigger: "manual",
    jobKind: job.kind,
    startedAt: job.startedAt,
    updatedAt: job.updatedAt,
    finishedAt: job.finishedAt,
    cancelledAt: job.cancelledAt ?? null,
    budgetStop: null,
    jobError: job.error ?? null,
    spentCostUsd: job.spentCostUsd,
    pid: job.pid,
    pidStart: job.pidStart ?? null,
    laneLimit: job.laneLimit ?? 1,
    lanes,
    alive: job.alive,
  };
}

async function listJobIds(): Promise<string[]> {
  try {
    const entries = await readdir(fingerprintJobsRoot(), { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(".json") && !e.name.endsWith(".cancel.json"))
      .map((e) => e.name.slice(0, -".json".length))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

async function runnerHeartbeat(): Promise<RunnerHeartbeat | null> {
  return externalRunner() ? readFreshHeartbeat() : null;
}

function isJobRunnerAlive(job: FingerprintJobRecord, beat: RunnerHeartbeat | null): boolean {
  if (externalRunner()) return heartbeatCovers(beat, job.pid, job.pidStart ?? null);
  return isProcessAlive(job.pid, job.pidStart ?? null);
}

export async function listRecentFingerprintJobs(
  limit: number = RECENT_FINGERPRINT_JOBS,
): Promise<FingerprintJobView[]> {
  const ids = (await listJobIds()).slice(0, limit);
  const beat = await runnerHeartbeat();
  const views: FingerprintJobView[] = [];
  for (const id of ids) {
    const job = await readFingerprintJob(id);
    if (job !== null) {
      views.push({
        ...job,
        alive: job.finishedAt === null && isJobRunnerAlive(job, beat),
      });
    }
  }
  return views;
}

export async function findActiveFingerprintJob(): Promise<FingerprintJobView | null> {
  const recent = await listRecentFingerprintJobs(RECENT_FINGERPRINT_JOBS);
  return recent.find((job) => job.alive) ?? null;
}

export async function requestFingerprintJobCancel(
  jobId: string,
  now: Date = new Date(),
): Promise<CancelRequest> {
  return requestCancelAt(fingerprintJobCancelPath(jobId), now);
}

export function watchFingerprintJobCancel(jobId: string, intervalMs?: number): CancelWatch {
  return watchCancelAt(fingerprintJobCancelPath(jobId), intervalMs);
}

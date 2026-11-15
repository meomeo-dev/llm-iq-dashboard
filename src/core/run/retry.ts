/**
 * 同轮次（runId）原地重跑失败项 / 补跑中断未完成项（src/core/run/retry.ts）。
 *
 * 严格遵循单轮零样本基准规则：
 *   1. 锁定并复用既有 run.json 的 prompts（含随机抽样绑定的 candidateId）与 harnessGuard；
 *   2. 预填 keptAttempts 至 slots 前缀，仅将待重跑调用置为 undefined 并在重跑前清理旧产物文件；
 *   3. 每次调用按全新单轮无状态考场执行，实时更新 progress.json 与 run.json。
 */

import { effortAdjustable as isEffortAdjustable, effortsFor, readCachedCatalog } from "../../capabilities/catalog";
import type { CapabilitySnapshot } from "../../capabilities/types";
import { acquireExecutionLock, describeActiveWorkConflict } from "../active-work";
import type { AppConfig } from "../config";
import { readProgress, type RunProgress } from "../progress";
import { clearCancel } from "../run-cancel";
import { groupIntoLanes, loadCatalog, type Job, type LaneItem } from "../run-plan";
import type { RunSelection } from "../run-selection";
import { ExecuteOptions, type Logger, runPreparedLanes } from "../runner";
import { cleanAttemptArtifacts, ensureRunDir, loadRun, runIdTime } from "../store";
import {
  buildTargetId,
  DEFAULT_PROFILE,
  foldEffort,
  type Attempt,
  type CliKind,
  type EffortLevel,
  type RunRecord,
  type Target,
} from "../types";
import type { RenderedPrompt } from "../variables";
import { openBudget } from "./prepare";

export interface RetryItem {
  target: Target;
  prompt: RenderedPrompt;
  previous?: Attempt;
}

export interface PreparedRetry {
  runId: string;
  startedAt: Date;
  existingRecord: RunRecord;
  keptAttempts: Attempt[];
  retryItems: RetryItem[];
  jobs: Job[];
  lanes: LaneItem[][];
}

function attemptLookupKey(targetId: string, promptId: string): string {
  return `${targetId}\0${promptId}`;
}

function resolveFallbackTimeout(config: AppConfig, cli: CliKind, effort: EffortLevel): number {
  return (
    config.run.timeoutByEffort?.[effort] ??
    config.run.timeoutByCli?.[cli] ??
    config.run.defaultTimeoutMs
  );
}

function synthesizeTarget(
  config: AppConfig,
  targetId: string,
  meta: { cli: CliKind; profile?: string; model: string; effort: EffortLevel; label?: string },
): Target {
  const profile = meta.profile === undefined || meta.profile === DEFAULT_PROFILE ? undefined : meta.profile;
  return {
    id: targetId,
    label: meta.label ?? `${meta.cli} / ${meta.model} (${meta.effort})`,
    cli: meta.cli,
    ...(profile !== undefined ? { profile } : {}),
    model: meta.model,
    effort: meta.effort,
    timeoutMs: resolveFallbackTimeout(config, meta.cli, meta.effort),
    extraArgs: [],
    enabled: true,
  };
}

function expandConfigTargetsWithProfiles(config: AppConfig): Map<string, Target> {
  const byId = new Map<string, Target>();
  for (const target of config.targets) {
    byId.set(target.id, target);
    for (const profile of config.profiles) {
      if (profile.cli !== target.cli) continue;
      const id = buildTargetId(target.cli, target.model, target.effort, profile.name);
      if (!byId.has(id)) {
        byId.set(id, { ...target, id, profile: profile.name });
      }
    }
  }
  return byId;
}

function collectRunTargets(
  config: AppConfig,
  record: RunRecord,
  progress: RunProgress | null,
  selection: RunSelection,
): Target[] {
  const configById = expandConfigTargetsWithProfiles(config);
  const resolved = new Map<string, Target>();

  for (const attempt of record.attempts) {
    if (resolved.has(attempt.targetId)) continue;
    const fromConfig = configById.get(attempt.targetId);
    resolved.set(
      attempt.targetId,
      fromConfig ?? synthesizeTarget(config, attempt.targetId, attempt),
    );
  }
  for (const lane of progress?.lanes ?? []) {
    for (const call of lane.calls) {
      if (resolved.has(call.targetId)) continue;
      const fromConfig = configById.get(call.targetId);
      resolved.set(
        call.targetId,
        fromConfig ??
          synthesizeTarget(config, call.targetId, {
            cli: lane.cli,
            profile: lane.profile,
            model: lane.model,
            effort: call.effort,
          }),
      );
    }
  }
  for (const targetId of selection.targetIds) {
    if (!resolved.has(targetId) && configById.has(targetId)) {
      resolved.set(targetId, configById.get(targetId)!);
    }
  }
  return [...resolved.values()];
}

function shouldRetryAttempt(attempt: Attempt | undefined, includeNoSvg: boolean): boolean {
  if (attempt === undefined) return true;
  if (attempt.status === "error" || attempt.status === "timeout") return true;
  if (includeNoSvg && attempt.status === "no-svg") return true;
  return false;
}

function selectRetryItems(
  record: RunRecord,
  targets: readonly Target[],
  selection: RunSelection,
): { retryItems: RetryItem[]; keptAttempts: Attempt[] } {
  const targetFilter = selection.targetIds.length > 0 ? new Set(selection.targetIds) : null;
  const promptFilter = selection.promptIds.length > 0 ? new Set(selection.promptIds) : null;
  const includeNoSvg = Boolean(selection.includeNoSvg);
  const existingByKey = new Map<string, Attempt>();
  for (const attempt of record.attempts) {
    existingByKey.set(attemptLookupKey(attempt.targetId, attempt.promptId), attempt);
  }

  const retryItems: RetryItem[] = [];
  const retryKeys = new Set<string>();

  for (const prompt of record.prompts) {
    if (promptFilter !== null && !promptFilter.has(prompt.promptId)) continue;
    for (const target of targets) {
      if (targetFilter !== null && !targetFilter.has(target.id)) continue;
      const key = attemptLookupKey(target.id, prompt.promptId);
      const previous = existingByKey.get(key);
      if (!shouldRetryAttempt(previous, includeNoSvg)) continue;
      retryKeys.add(key);
      retryItems.push({ target, prompt, ...(previous !== undefined ? { previous } : {}) });
    }
  }

  const keptAttempts = record.attempts.filter(
    (attempt) => !retryKeys.has(attemptLookupKey(attempt.targetId, attempt.promptId)),
  );
  return { retryItems, keptAttempts };
}

function buildRetryJobsAndLanes(
  retryItems: readonly RetryItem[],
  keptCount: number,
  catalog: CapabilitySnapshot | null,
  log: Logger,
): { jobs: Job[]; lanes: LaneItem[][] } {
  const jobs: Job[] = retryItems.map(({ target, prompt }) => {
    const supported = effortsFor(catalog, target.cli, target.model);
    const appliedEffort = foldEffort(target.effort, supported);
    if (appliedEffort !== target.effort) {
      log(
        `${target.id}：${target.model} 不支持 ${target.effort}，折叠为 ${appliedEffort}` +
          `（可用 ${supported.join("/")}）`,
      );
    }
    return {
      target,
      prompt,
      appliedEffort,
      effortAdjustable: isEffortAdjustable(catalog, target.cli, target.model),
    };
  });
  const lanes = groupIntoLanes(jobs).map((lane) =>
    lane.map((item) => ({ job: item.job, index: item.index + keptCount })),
  );
  return { jobs, lanes };
}

/** 规划同轮次原地重跑（可供 CLI --dry-run 与正式执行共用） */
export async function planRunRetry(
  config: AppConfig,
  selection: RunSelection,
  options?: { refreshCapabilities?: boolean; log?: Logger },
): Promise<PreparedRetry> {
  const log = options?.log ?? (() => {});
  const runId = selection.retryRunId?.trim() ?? "";
  const startedAt = runIdTime(runId);
  if (!runId || startedAt === null) {
    throw new Error(`无效的轮次 ID：${runId || "(空)"}`);
  }
  const existingRecord = await loadRun(runId);
  if (existingRecord === null) {
    throw new Error(`找不到要重跑的轮次记录：${runId}`);
  }
  const progress = await readProgress(runId);
  const targets = collectRunTargets(config, existingRecord, progress, selection);
  const { retryItems, keptAttempts } = selectRetryItems(existingRecord, targets, selection);
  if (retryItems.length === 0) {
    throw new Error(`轮次 ${runId} 中没有符合条件的待重跑调用`);
  }
  const catalog = options?.refreshCapabilities ? await loadCatalog(config, true, log) : await readCachedCatalog();
  const { jobs, lanes } = buildRetryJobsAndLanes(retryItems, keptAttempts.length, catalog, log);
  return { runId, startedAt, existingRecord, keptAttempts, retryItems, jobs, lanes };
}

/** 执行同轮次原地重跑，保留既有成功调用并原地更新 run.json 与 progress.json */
export async function executeRunRetry(
  config: AppConfig,
  selection: RunSelection,
  options: ExecuteOptions,
): Promise<RunRecord> {
  const log = options.log ?? (() => {});
  const targetRunId = selection.retryRunId?.trim() ?? "";
  const lock = await acquireExecutionLock({ kind: "run", runId: targetRunId, trigger: options.trigger });
  if (!lock.acquired) throw new Error(describeActiveWorkConflict(lock.conflict));

  try {
    const prepared = await planRunRetry(config, selection, { refreshCapabilities: options.refreshCapabilities, log });
    const { runId, startedAt, existingRecord, keptAttempts, retryItems, jobs, lanes } = prepared;
    const budget = await openBudget(config.budget, new Date());
    await ensureRunDir(runId);
    await clearCancel(runId);
    for (const item of retryItems) {
      await cleanAttemptArtifacts(runId, item.target.id, item.prompt.promptId, item.previous);
    }
    log(`[${runId}] 原地重跑开始：保留 ${keptAttempts.length} 次已完成调用，重跑 ${jobs.length} 次调用（${lanes.length} 道）`);
    const slots: (Attempt | undefined)[] = [...keptAttempts, ...new Array<Attempt | undefined>(jobs.length)];
    return await runPreparedLanes({
      runId, startedAt, prompts: existingRecord.prompts, harnessGuard: existingRecord.harnessGuard ?? null,
      lanes, slots, budget, config, options, log, saveInitialSnapshot: true,
    });
  } finally {
    await lock.release();
  }
}

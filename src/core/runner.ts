/**
 * 一轮鹈鹕基准的编排：工作量为 `提示词 × 目标`，只依赖适配器与存储契约。
 *
 * 单个目标失败收敛为一条失败记录，不影响同批其他目标。并发按 CLI × profile × 模型分道
 * （lane）：不同模型并行；同一模型的调用在道内串行，避免挤占该模型的限速并保持耗时可比。
 * 非默认 profile 各起一个独立进程，profile 之间并行，上限 run.profileConcurrency。
 */

import type { ProfileLaunch } from "../adapters/index";
import type { AppConfig } from "./config";
import { profileKeyPath, readProfileKey } from "./profile-credentials";
import { createProgressTracker, type ProgressTracker } from "./progress";
import { createSerialWriter, type SerialWriter } from "./serial-writes";
import { watchCancel, type CancelWatch } from "./run-cancel";
import { saveRun } from "./store";
import type { Attempt, RunRecord } from "./types";
import { buildLeakGuard, credentialFiles, type LeakGuard } from "./leak-guard";
import { describeProgress, laneIdentity, type LaneItem } from "./run-plan";
import type { RenderedPrompt } from "./variables";
import { discardScratch } from "./scratch-cleanup";
import { closeJudgeBrowser } from "./judge/browser";
import { createAttemptJudge } from "./judge/judge-attempt";
import { executeLanes, type LaneHooks } from "./run/execute-lanes";
import { postRunSync } from "./run/post-sync";
import {
  callBlocker,
  costOf,
  openBudget,
  preflight,
  prepareRunPlan,
  prepareRunStorage,
  type CallBlockers,
  type Logger,
} from "./run/prepare";
import type { BudgetGate } from "./budget";

export type { Logger };

export interface ExecuteOptions {
  trigger: RunRecord["trigger"];
  log?: Logger;
  /** 强制重新探测能力目录，不读缓存 */
  refreshCapabilities?: boolean;
  /** 进度文件首次落盘后回调，此后读取进度必能读到这一轮（见 app/api/run/route.ts） */
  onStarted?: (runId: string) => void;
  /** 单次执行时手动指定候选题目的映射（promptId -> candidateId） */
  candidateOverrides?: Readonly<Record<string, string>>;
}

interface RunState {
  cancelledAt?: string;
  budgetStop?: string;
}

function setupCancelWatch(runId: string, log: Logger, progress: ProgressTracker, state: RunState): CancelWatch {
  const cancel = watchCancel(runId);
  cancel.signal.addEventListener(
    "abort",
    () => {
      state.cancelledAt = new Date().toISOString();
      log(`[${runId}] 收到停止请求：不再发起排队中的调用，终止执行中的调用`);
      progress.markCancelling(state.cancelledAt);
    },
    { once: true },
  );
  return cancel;
}

interface ProfileGate {
  launches: Map<string, ProfileLaunch>;
  blockers: Map<string, string>;
}

/** 一个 profile 的放行检查：可调用时返回启动参数，否则返回拦截原因 */
async function launchFor(config: AppConfig, name: string): Promise<ProfileLaunch | string> {
  const profile = config.profiles.find((candidate) => candidate.name === name);
  if (profile === undefined) return `profile ${name} 未登记，未发起调用`;
  if (!profile.enabled) return `profile ${name} 已停用，未发起调用`;
  const apiKey = await readProfileKey(profile.cli, name);
  if (apiKey === null) return `profile ${name} 还没有填 API key，未发起调用`;
  return { name, baseUrl: profile.baseUrl, queryParams: profile.queryParams, apiKey };
}

/**
 * 为本轮用到的非默认 profile 读 key、组启动参数。key 只进内存与该 profile 的子进程
 * 环境；拦下的 profile 其调用记 error，不回落到登录态。
 */
async function prepareProfileLaunches(config: AppConfig, lanes: readonly LaneItem[][], log: Logger): Promise<ProfileGate> {
  const used = new Set(lanes.map((lane) => laneIdentity(lane).profile).filter((name) => name !== undefined));
  const gate: ProfileGate = { launches: new Map(), blockers: new Map() };
  for (const name of used) {
    const launch = await launchFor(config, name);
    if (typeof launch === "string") {
      gate.blockers.set(name, launch);
      log(launch);
    } else {
      gate.launches.set(name, launch);
    }
  }
  return gate;
}

function buildLaneHooks(
  runId: string,
  blockers: CallBlockers,
  budget: BudgetGate | null,
  slots: (Attempt | undefined)[],
  progress: ProgressTracker,
  writer: SerialWriter,
  state: RunState,
  snapshot: (inProgress: boolean) => RunRecord,
  log: Logger,
): LaneHooks {
  return {
    admit: (job) => {
      const blocker = callBlocker(blockers, job.target);
      if (blocker !== undefined) return { kind: "fail", error: blocker };
      const refusal = budget?.admit(job.target.id) ?? null;
      return refusal === null ? null : { kind: "skip", reason: refusal };
    },
    onSkipped: (lane, call, { job }, reason) => {
      log(`[${runId}] ${job.target.id} @${job.prompt.promptId} 未发起：${reason}`);
      if (state.budgetStop === undefined) {
        state.budgetStop = reason;
        progress.markBudgetStop(reason);
      }
      progress.markCancelled(lane, call);
    },
    onStart: (lane, call) => progress.markRunning(lane, call),
    onDone: (lane, call, { job, index }, attempt) => {
      log(`[${runId}] ${attempt.targetId} @${job.prompt.promptId} → ${attempt.status} (${attempt.durationMs}ms)`);
      if (callBlocker(blockers, job.target) === undefined) budget?.settle(attempt.targetId, costOf(attempt));
      slots[index] = attempt;
      progress.markDone(lane, call, attempt);
      writer.enqueue(() => saveRun(snapshot(true)));
    },
    onCancelled: (lane, call) => progress.markCancelled(lane, call),
  };
}

/** 指纹覆盖三家 CLI 的登录凭据与全部已登记 profile 的 key，不论本轮是否用到 */
async function setupLeakGuard(runId: string, config: AppConfig, log: Logger): Promise<LeakGuard> {
  const profileKeys = config.profiles.map((profile) => profileKeyPath(profile.cli, profile.name));
  const guard = await buildLeakGuard([...credentialFiles(), ...profileKeys]);
  if (guard.size === 0) log(`[${runId}] 未读到任何凭据文件，本轮不做输出泄漏比对`);
  return guard;
}

async function initRunProgressTracking(
  runId: string,
  trigger: RunRecord["trigger"],
  startedAt: Date,
  concurrency: number,
  lanes: LaneItem[][],
  log: Logger,
  onStarted?: (runId: string) => void,
): Promise<{ writer: SerialWriter; progress: ProgressTracker }> {
  const writer = createSerialWriter(log);
  const progress = createProgressTracker(
    describeProgress(runId, trigger, startedAt, concurrency, lanes),
    writer,
  );
  await writer.drain();
  onStarted?.(runId);
  return { writer, progress };
}

function createRunSnapshot(
  runId: string,
  prompts: RenderedPrompt[],
  startedAt: Date,
  trigger: RunRecord["trigger"],
  inProgress: boolean,
  slots: (Attempt | undefined)[],
  state: RunState,
): RunRecord {
  return {
    runId,
    prompts,
    startedAt: startedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt.getTime(),
    trigger,
    inProgress,
    ...(state.cancelledAt !== undefined ? { cancelledAt: state.cancelledAt } : {}),
    ...(state.budgetStop !== undefined ? { budgetStop: state.budgetStop } : {}),
    attempts: slots.filter((attempt): attempt is Attempt => attempt !== undefined),
  };
}

async function finishRunRecord(
  snapshot: (inProgress: boolean) => RunRecord,
  progress: ProgressTracker,
  runId: string,
  config: AppConfig,
  log: Logger,
): Promise<RunRecord> {
  await progress.finish();
  const record = snapshot(false);
  await saveRun(record);
  await discardScratch(runId);
  await postRunSync(config, runId, log);
  return record;
}

export async function executeRun(
  config: AppConfig,
  options: ExecuteOptions,
): Promise<RunRecord> {
  const log = options.log ?? (() => {});
  const startedAt = new Date();
  const runId = formatRunId(startedAt);
  const budget = await openBudget(config.budget, startedAt);

  await prepareRunStorage(config, runId, startedAt, log);
  const { prompts, jobs, lanes } = await prepareRunPlan(config, startedAt, options, log);

  log(
    `[${runId}] 开始，${prompts.length} 条提示词 × ${config.targets.length} 个目标 = ${jobs.length} 次调用，` +
      `${lanes.length} 个模型分道，同时最多 ${config.run.profileConcurrency} 个 profile、` +
      `每个 profile 最多 ${config.run.concurrency} 道`,
  );

  const slots = new Array<Attempt | undefined>(jobs.length);
  const state: RunState = {};
  const snapshot = (inProgress: boolean): RunRecord =>
    createRunSnapshot(runId, prompts, startedAt, options.trigger, inProgress, slots, state);

  const { writer, progress } = await initRunProgressTracking(
    runId, options.trigger, startedAt, config.run.concurrency, lanes, log, options.onStarted,
  );

  const profiles = await prepareProfileLaunches(config, lanes, log);
  const blockers: CallBlockers = { ...(await preflight(lanes, log)), profile: profiles.blockers };
  const leakGuard = await setupLeakGuard(runId, config, log);
  const cancel = setupCancelWatch(runId, log, progress, state);

  try {
    const hooks = buildLaneHooks(runId, blockers, budget, slots, progress, writer, state, snapshot, log);
    const limits = { profiles: config.run.profileConcurrency, lanesPerProfile: config.run.concurrency };
    const judge = createAttemptJudge(config.judge.enabled, log);
    const round = { runId, signal: cancel.signal, leakGuard, judge, profileLaunches: profiles.launches };
    await executeLanes(lanes, limits, round, hooks);
  } finally {
    cancel.stop();
    await closeJudgeBrowser();
  }

  const record = await finishRunRecord(snapshot, progress, runId, config, log);
  const outcome = state.cancelledAt !== undefined ? "已停止" : "完成";
  log(`[${runId}] ${outcome}，成功 ${countOk(record.attempts)}/${record.attempts.length}`);
  return record;
}

function countOk(attempts: readonly Attempt[]): number {
  return attempts.filter((attempt) => attempt.status === "ok").length;
}

/** runId 取 UTC 紧凑时刻，字典序即时间序，无需索引文件 */
export function formatRunId(at: Date): string {
  const iso = at.toISOString();
  const compact = [...iso].filter((ch) => ch !== "-" && ch !== ":").join("");
  return compact.slice(0, compact.indexOf(".")).concat("Z");
}

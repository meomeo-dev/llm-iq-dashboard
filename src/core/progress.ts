/**
 * 一轮执行的实时进度：data/runs/<runId>/progress.json
 *
 * run.json 只收已完成的调用；这里记录每次调用的排队 / 执行 / 完成状态与起止时刻，
 * 供看板显示执行中的调用与超时余量。执行进程与看板进程只通过此文件交流。
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { runDir } from "./paths";
import { isProcessAlive, processStartMark } from "./process-identity";
import { externalRunner, heartbeatCovers, readFreshHeartbeat, type RunnerHeartbeat } from "./runner-link";
import type { SerialWriter } from "./serial-writes";
import { listRunIds, writeJsonAtomic } from "./store";
import type { Attempt, AttemptStatus, CliKind, EffortLevel, RunRecord } from "./types";

const PROGRESS_FILE = "progress.json";

/** cancelled：本轮被人停下时还没跑完的调用（排队中未发起，或执行中被终止） */
export type CallState = "queued" | "running" | "done" | "cancelled";

export interface CallProgress {
  targetId: string;
  promptId: string;
  effort: EffortLevel;
  state: CallState;
  startedAt: string | null;
  /** 本次调用的超时上限，看板据此显示已用时长占比 */
  timeoutMs: number;
  status: AttemptStatus | null;
  durationMs: number | null;
}

/** 一道 = 一个 CLI × 模型；道内的调用按执行顺序排列 */
export interface LaneProgress {
  cli: CliKind;
  model: string;
  calls: CallProgress[];
}

export interface RunProgress {
  runId: string;
  trigger: RunRecord["trigger"];
  startedAt: string;
  updatedAt: string;
  /** 整轮结束时写入；进程被杀时保持 null，需结合 pid 判断 */
  finishedAt: string | null;
  /**
   * 执行方接受停止请求的时刻（见 run-cancel.ts）。有值而 finishedAt 为空表示正在停止，
   * 两者都有表示已停止。旧进度文件可能缺失。
   */
  cancelledAt?: string | null;
  /** 首次因预算上限未发起调用的原因；旧进度文件可能缺失 */
  budgetStop?: string | null;
  /** 执行进程的 pid，看板据此判断进程是否存活 */
  pid: number;
  /** 执行进程的启动标记，与 pid 一起认定进程（见 process-identity.ts）；旧记录可能缺失 */
  pidStart?: string | null;
  /** 同时在跑的道数上限 */
  laneLimit: number;
  lanes: LaneProgress[];
}

/** 下发给看板的形态，附执行进程是否存活；未结束且进程不在即为被中断的轮次 */
export interface ProgressView extends RunProgress {
  alive: boolean;
}

export interface ProgressTracker {
  markRunning: (lane: number, call: number) => void;
  markDone: (lane: number, call: number, attempt: Attempt) => void;
  /** 记下接受停止请求的时刻，看板据此显示“正在停止” */
  markCancelling: (at: string) => void;
  markCancelled: (lane: number, call: number) => void;
  /** 记下预算拦下调用的原因；被拦下的调用随后以 markCancelled 标记 */
  markBudgetStop: (reason: string) => void;
  /** 写入 finishedAt 并等全部写入落盘 */
  finish: () => Promise<void>;
}

type InitialProgress = Omit<
  RunProgress,
  "updatedAt" | "finishedAt" | "cancelledAt" | "budgetStop" | "pid" | "pidStart"
>;

function initRunProgress(initial: InitialProgress): RunProgress {
  return {
    ...initial,
    updatedAt: initial.startedAt,
    finishedAt: null,
    cancelledAt: null,
    budgetStop: null,
    pid: process.pid,
    pidStart: processStartMark(process.pid),
  };
}

function buildProgressTrackerActions(progress: RunProgress, writer: SerialWriter): ProgressTracker {
  const save = (): void => {
    progress.updatedAt = new Date().toISOString();
    const snapshot = structuredClone(progress);
    writer.enqueue(() => writeJsonAtomic(progress.runId, PROGRESS_FILE, snapshot));
  };
  const callAt = (lane: number, call: number): CallProgress => {
    const found = progress.lanes[lane]?.calls[call];
    if (found === undefined) throw new Error(`进度中没有第 ${lane} 道第 ${call} 个调用`);
    return found;
  };

  save();
  return {
    markRunning: (lane, call) => {
      Object.assign(callAt(lane, call), { state: "running", startedAt: new Date().toISOString() });
      save();
    },
    markDone: (lane, call, attempt) => {
      Object.assign(callAt(lane, call), { state: "done", status: attempt.status, durationMs: attempt.durationMs });
      save();
    },
    markCancelling: (at) => {
      progress.cancelledAt = at;
      save();
    },
    markCancelled: (lane, call) => {
      const target = callAt(lane, call);
      const durationMs = target.startedAt === null ? null : Date.now() - Date.parse(target.startedAt);
      Object.assign(target, { state: "cancelled", durationMs });
      save();
    },
    markBudgetStop: (reason) => {
      progress.budgetStop = reason;
      save();
    },
    async finish() {
      progress.finishedAt = new Date().toISOString();
      save();
      await writer.drain();
    },
  };
}

/** 每次状态变化整份重写（文件仅几 KB），读取方无需拼接增量 */
export function createProgressTracker(
  initial: InitialProgress,
  writer: SerialWriter,
): ProgressTracker {
  const progress = initRunProgress(initial);
  return buildProgressTrackerActions(progress, writer);
}

/** 最近几轮的进度，新的在前；没有进度文件的轮次跳过 */
export async function listRecentProgress(limit: number): Promise<RunProgress[]> {
  const ids = (await listRunIds()).slice(0, limit);
  const found: RunProgress[] = [];
  for (const id of ids) {
    const progress = await readProgress(id);
    if (progress !== null) found.push(progress);
  }
  return found;
}

/** 看板展示的轮次数；手动与定时执行可能前后相接，取最近三轮 */
export const RECENT_PROGRESS_RUNS = 3;

/** 最近几轮的进度视图，附执行进程是否存活；/api/progress 与 /api/events 共用 */
export async function listProgressViews(limit: number = RECENT_PROGRESS_RUNS): Promise<ProgressView[]> {
  const runs = await listRecentProgress(limit);
  const beat = await runnerHeartbeat();
  return runs.map((run) => ({ ...run, alive: run.finishedAt === null && isRunnerAlive(run, beat) }));
}

/** 手动与定时执行互斥，同时在跑的轮次至多一轮，扫描最近几轮即可 */
const ACTIVE_SCAN_RUNS = 3;

/**
 * 任一进程中正在执行的轮次。手动执行与定时执行分属看板和调度器两个进程，
 * 靠进度文件加 pid 存活判断跨进程防止重入。
 */
export async function findActiveRun(): Promise<RunProgress | null> {
  const recent = await listRecentProgress(ACTIVE_SCAN_RUNS);
  const beat = await runnerHeartbeat();
  return recent.find((run) => run.finishedAt === null && isRunnerAlive(run, beat)) ?? null;
}

/** 外部执行器模式下读心跳；进程内执行时不需要 */
async function runnerHeartbeat(): Promise<RunnerHeartbeat | null> {
  return externalRunner() ? readFreshHeartbeat() : null;
}

async function readProgress(runId: string): Promise<RunProgress | null> {
  try {
    return JSON.parse(await readFile(join(runDir(runId), PROGRESS_FILE), "utf8")) as RunProgress;
  } catch {
    return null;
  }
}

/**
 * 执行进程是否还在：同一容器内看 pid；看板与执行器分容器时看不到对方的 pid，
 * 改看执行器心跳是否新鲜且登记的 pid 就是执行器
 */
function isRunnerAlive(run: RunProgress, beat: RunnerHeartbeat | null): boolean {
  if (externalRunner()) return heartbeatCovers(beat, run.pid, run.pidStart ?? null);
  return isProcessAlive(run.pid, run.pidStart ?? null);
}

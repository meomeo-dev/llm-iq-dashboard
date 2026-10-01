/** 进度视图的纯函数：阶段判定、计数、时长格式。 */

import type { CallProgress, JudgeItemProgress, ProgressView } from "@/core/progress";

/**
 * stopping：已接受停止请求、还在收尾；cancelled：被人停下后已结束；
 * judging：调用都结束了，AI 层还在逐件请裁判打分（ACR-020）
 */
export type RunPhase = "running" | "stopping" | "interrupted" | "finished" | "cancelled" | "judging";

/**
 * 调用超出超时上限这么久仍在“执行中”即视为进程已不在（适配器到点会终止调用），
 * 用于应对 pid 被系统复用导致的存活检查误判。
 */
const OVERDUE_GRACE_MS = 2 * 60 * 1000;

/** 调用都结束了但 AI 层评审还没收尾（与 core/progress.ts 的 isJudging 同口径；这里不能引 Node 侧模块） */
function judging(run: ProgressView): boolean {
  return run.finishedAt !== null && run.judging != null && run.judging.finishedAt === null;
}

export function phaseOf(run: ProgressView, now: number): RunPhase {
  const cancelled = run.cancelledAt != null;
  // 评审进程被杀时 alive 为假，按已完成显示，未评完的作品保持待复核
  if (judging(run) && run.alive) return "judging";
  if (run.finishedAt !== null) return cancelled ? "cancelled" : "finished";
  if (!run.alive) return "interrupted";
  if (cancelled) return "stopping";
  const overdue = allCalls(run).some(
    (call) => call.state === "running" && elapsedMs(call, now) > call.timeoutMs + OVERDUE_GRACE_MS,
  );
  return overdue ? "interrupted" : "running";
}

/** 仍占用执行位的阶段，此时不能发起新的一轮 */
export function isActivePhase(phase: RunPhase): boolean {
  return phase === "running" || phase === "stopping";
}

export interface CallCounts {
  total: number;
  done: number;
  running: number;
  cancelled: number;
  ok: number;
}

export function countCalls(calls: readonly CallProgress[]): CallCounts {
  return {
    total: calls.length,
    done: calls.filter((call) => call.state === "done").length,
    running: calls.filter((call) => call.state === "running").length,
    cancelled: calls.filter((call) => call.state === "cancelled").length,
    ok: calls.filter((call) => call.status === "ok").length,
  };
}

export interface JudgeCounts {
  total: number;
  done: number;
  failed: number;
  running: JudgeItemProgress | null;
}

export function countJudging(items: readonly JudgeItemProgress[]): JudgeCounts {
  return {
    total: items.length,
    done: items.filter((item) => item.state === "done").length,
    failed: items.filter((item) => item.state === "failed").length,
    running: items.find((item) => item.state === "running") ?? null,
  };
}

/** 某件作品在最近几轮的评审队列里的状态；不在队列里为 null */
export function judgeItemOf(runs: readonly ProgressView[] | null, runId: string, attemptKey: string): JudgeItemProgress | null {
  const run = runs?.find((item) => item.runId === runId);
  return run?.judging?.items.find((item) => item.attemptKey === attemptKey) ?? null;
}

export function allCalls(run: ProgressView): CallProgress[] {
  return run.lanes.flatMap((lane) => lane.calls);
}

export function elapsedMs(call: CallProgress, now: number): number {
  if (call.durationMs !== null) return call.durationMs;
  if (call.startedAt === null) return 0;
  return Math.max(0, now - Date.parse(call.startedAt));
}

/** 计时是否还在走：执行中、正在停止、评审中；中断、已完成、已停止的轮次停表 */
export function isTicking(phase: RunPhase): boolean {
  return isActivePhase(phase) || phase === "judging";
}

/**
 * 调用与评审条目计时用的时钟：还在走时取当前时刻，停表后取进度文件最后一次更新。
 * 进程消失后进度文件里残留的「执行中」条目据此停在最后一次更新，不再随墙钟增长。
 */
export function runClock(run: ProgressView, phase: RunPhase, now: number): number {
  return isTicking(phase) ? now : Date.parse(run.updatedAt);
}

/** 整轮已用时长：结束的按结束时刻，中断的停在最后一次更新 */
export function runElapsedMs(run: ProgressView, phase: RunPhase, now: number): number {
  const end = isActivePhase(phase) ? now : Date.parse(run.finishedAt ?? run.updatedAt);
  return Math.max(0, end - Date.parse(run.startedAt));
}

/** 分秒制（1:05、12:30、1:02:05），便于与超时上限对比 */
export function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  if (hours === 0) return `${minutes}:${seconds}`;
  return `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`;
}

/** 提示词的短名：classic-v1 → classic，xiyou-v1 → xiyou */
export function promptTag(promptId: string): string {
  return promptId.split("-")[0] ?? promptId;
}

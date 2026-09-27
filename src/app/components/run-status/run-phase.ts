/** 进度视图的纯函数：阶段判定、计数、时长格式。 */

import type { CallProgress, ProgressView } from "@/core/progress";

/** stopping：已接受停止请求、还在收尾；cancelled：被人停下后已结束 */
export type RunPhase = "running" | "stopping" | "interrupted" | "finished" | "cancelled";

/**
 * 调用超出超时上限这么久仍在“执行中”即视为进程已不在（适配器到点会终止调用），
 * 用于应对 pid 被系统复用导致的存活检查误判。
 */
const OVERDUE_GRACE_MS = 2 * 60 * 1000;

export function phaseOf(run: ProgressView, now: number): RunPhase {
  const cancelled = run.cancelledAt != null;
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

export function allCalls(run: ProgressView): CallProgress[] {
  return run.lanes.flatMap((lane) => lane.calls);
}

export function elapsedMs(call: CallProgress, now: number): number {
  if (call.durationMs !== null) return call.durationMs;
  if (call.startedAt === null) return 0;
  return Math.max(0, now - Date.parse(call.startedAt));
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

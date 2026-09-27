import type { RunOptionsView } from "@/app/api/run/route";
import type { ProgressView } from "@/core/progress";
import { useLiveProgress } from "../live-state/live-store";

/**
 * 正在执行的轮次（任一进程），以推送的进度为准。推送尚未带上刚发起的轮次时按本面板
 * 发起的轮次算；推送未连上时用打开面板时取到的值。
 */
export function useActiveRunId(options: RunOptionsView | null, startedRunId: string | null): string | null {
  const progress = useLiveProgress();
  if (progress === null) return startedRunId ?? options?.activeRunId ?? null;
  const running = progress.find((run) => run.finishedAt === null && run.alive);
  if (running !== undefined) return running.runId;
  return startedRunId !== null && !hasReached(progress, startedRunId) ? startedRunId : null;
}

/** 这一轮是否已接受停止请求、正在收尾 */
export function useIsStopping(runId: string | null): boolean {
  const progress = useLiveProgress();
  if (runId === null) return false;
  return progress?.some((run) => run.runId === runId && run.cancelledAt != null && run.finishedAt === null) === true;
}

/**
 * 推送的进度是否已含这一轮或更新的轮次。runId 字典序即时间序，这一轮被挤出
 * “最近几轮”时同样算已含，避免按钮一直锁定。
 */
export function hasReached(progress: readonly ProgressView[], runId: string): boolean {
  return progress.some((run) => run.runId >= runId);
}

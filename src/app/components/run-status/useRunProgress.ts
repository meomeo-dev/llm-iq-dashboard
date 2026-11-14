"use client";

import type { ProgressView } from "@/core/progress";
import { useLiveProgress } from "../live-state/live-store";

/**
 * 执行进度（经 /api/events 推送）。不再触发整页 router.refresh()，矩阵结果的
 * 增量拉取由 useDashboardSync 按 runsRevision 事件单独驱动。
 */
export function useRunProgress(): ProgressView[] | null {
  return useLiveProgress();
}

/** 编码每轮完成态、已完成调用集合与 AI 评审完成态的复合签名，任意状态跃迁均触发刷新 */
export function progressDoneSignature(runs: readonly ProgressView[]): string {
  return runs
    .map((run) => {
      const doneCalls = run.lanes
        .flatMap((lane) => lane.calls)
        .filter((call) => call.state === "done")
        .map((call) => `${call.targetId}/${call.promptId}`)
        .join(",");
      const doneJudges = (run.judging?.items ?? [])
        .filter((item) => item.state === "done" || item.state === "failed")
        .map((item) => `${item.attemptKey}:${item.state}`)
        .join(",");
      const judgeFinished = run.judging?.finishedAt ?? "";
      return `${run.runId}:${run.finishedAt ?? ""}:${run.cancelledAt ?? ""}:${doneCalls}:${doneJudges}:${judgeFinished}`;
    })
    .join("|");
}

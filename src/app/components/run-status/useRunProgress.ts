"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { ProgressView } from "@/core/progress";
import { useLiveProgress } from "../live-state/live-store";

/**
 * 执行进度（经 /api/events 推送）。已完成调用数变化时刷新整页数据，新结果随即
 * 出现在矩阵中。
 */
export function useRunProgress(): ProgressView[] | null {
  const router = useRouter();
  const runs = useLiveProgress();
  const lastDone = useRef<number | null>(null);

  const done = runs === null ? null : countDone(runs);
  useEffect(() => {
    if (done === null) return;
    if (lastDone.current !== null && lastDone.current !== done) router.refresh();
    lastDone.current = done;
  }, [done, router]);

  return runs;
}

/** 已完成调用数加已结束轮次数，使轮次收尾（写终稿）也触发刷新 */
function countDone(runs: readonly ProgressView[]): number {
  let total = 0;
  for (const run of runs) {
    if (run.finishedAt !== null) total += 1;
    for (const lane of run.lanes) total += lane.calls.filter((call) => call.state === "done").length;
  }
  return total;
}

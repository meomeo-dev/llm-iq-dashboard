/**
 * 模型分道并行执行编排
 */

import { mapWithConcurrency } from "../concurrency";
import type { Attempt } from "../types";
import { openSessionPool } from "../../adapters/index";
import { buildAttempt, runAttempt, type AttemptContext } from "../run-attempt";
import type { Job, LaneItem } from "../run-plan";

export type Admission = null | { kind: "fail"; error: string } | { kind: "skip"; reason: string };

export interface LaneHooks {
  admit: (job: Job) => Admission;
  onSkipped: (lane: number, call: number, item: LaneItem, reason: string) => void;
  onStart: (lane: number, call: number) => void;
  onDone: (lane: number, call: number, item: LaneItem, attempt: Attempt) => void;
  /** 停止后没有结果的调用：未发起的排队项或执行中被终止的调用 */
  onCancelled: (lane: number, call: number) => void;
}

async function executeLaneItem(
  item: LaneItem,
  laneIndex: number,
  callIndex: number,
  context: AttemptContext,
  hooks: LaneHooks,
): Promise<void> {
  const admission = hooks.admit(item.job);
  if (admission?.kind === "skip") {
    hooks.onSkipped(laneIndex, callIndex, item, admission.reason);
    return;
  }

  hooks.onStart(laneIndex, callIndex);
  const attempt =
    admission === null
      ? await runAttempt(item.job, context)
      : buildAttempt(item.job, new Date(), { status: "error", error: admission.error });

  // 被终止的调用只有半截输出，不计入结果；停止前已交出作品的保留
  if (context.signal.aborted && attempt.status !== "ok") {
    hooks.onCancelled(laneIndex, callIndex);
    return;
  }

  hooks.onDone(laneIndex, callIndex, item, attempt);
}

async function executeSingleLane(
  lane: readonly LaneItem[],
  laneIndex: number,
  context: AttemptContext,
  hooks: LaneHooks,
): Promise<void> {
  for (const [callIndex, item] of lane.entries()) {
    if (context.signal.aborted) {
      hooks.onCancelled(laneIndex, callIndex);
      continue;
    }
    await executeLaneItem(item, laneIndex, callIndex, context, hooks);
  }
}

/**
 * 各道并行、道内串行地跑完全部调用，每次发起前经 hooks.admit 放行；
 * signal 触发后余下的调用全部取消。
 */
export async function executeLanes(
  lanes: readonly LaneItem[][],
  laneLimit: number,
  round: Omit<AttemptContext, "sessions">,
  hooks: LaneHooks,
): Promise<void> {
  const { signal } = round;
  // codex 的 app-server 是长驻进程，无论本轮成败都要关闭
  const sessions = openSessionPool();
  const context: AttemptContext = { ...round, sessions };
  try {
    await mapWithConcurrency(lanes, laneLimit, async (lane, laneIndex) => {
      await executeSingleLane(lane, laneIndex, context, hooks);
    });
  } finally {
    await sessions.closeAll();
  }
}

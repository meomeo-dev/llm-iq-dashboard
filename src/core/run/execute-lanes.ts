/**
 * 模型分道并行执行编排：先按 profile 分组、组间并行，组内再按模型分道并行。
 * 每个 profile 一个独立的 CLI 进程，组间并行不会让它们共享任何状态。
 */

import { mapWithConcurrency } from "../concurrency";
import { DEFAULT_PROFILE, type Attempt } from "../types";
import { openSessionPool, type ProfileLaunch } from "../../adapters/index";
import { buildAttempt, runAttempt, type AttemptContext } from "../run-attempt";
import type { Job, LaneItem } from "../run-plan";

/** 两级并行上限：同时在跑的 profile 数、每个 profile 内同时在跑的道数 */
export interface LaneLimits {
  profiles: number;
  lanesPerProfile: number;
}

/** 一轮的执行环境：调用上下文之外，另带本轮放行的非默认 profile 启动参数 */
export type RoundContext = Omit<AttemptContext, "sessions"> & {
  profileLaunches: ReadonlyMap<string, ProfileLaunch>;
};

/** 带全局道号的道；进度文件按全局道号定位，分组不能改变道号 */
interface IndexedLane {
  lane: readonly LaneItem[];
  laneIndex: number;
}

/** 按道首目标的 profile 分组，组的顺序即 profile 首次出现的顺序 */
export function groupLanesByProfile(lanes: readonly LaneItem[][]): IndexedLane[][] {
  const groups = new Map<string, IndexedLane[]>();
  lanes.forEach((lane, laneIndex) => {
    const profile = lane[0]?.job.target.profile ?? DEFAULT_PROFILE;
    const group = groups.get(profile) ?? [];
    group.push({ lane, laneIndex });
    groups.set(profile, group);
  });
  return [...groups.values()];
}

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
 * profile 组间并行、组内各道并行、道内串行地跑完全部调用，每次发起前经 hooks.admit
 * 放行；signal 触发后余下的调用全部取消。
 */
export async function executeLanes(
  lanes: readonly LaneItem[][],
  limits: LaneLimits,
  round: RoundContext,
  hooks: LaneHooks,
): Promise<void> {
  const { profileLaunches, ...attemptRound } = round;
  // codex 的 app-server 是长驻进程，无论本轮成败都要关闭
  const sessions = openSessionPool(profileLaunches);
  const context: AttemptContext = { ...attemptRound, sessions };
  try {
    await mapWithConcurrency(groupLanesByProfile(lanes), limits.profiles, async (group) => {
      await mapWithConcurrency(group, limits.lanesPerProfile, async ({ lane, laneIndex }) => {
        await executeSingleLane(lane, laneIndex, context, hooks);
      });
    });
  } finally {
    await sessions.closeAll();
  }
}

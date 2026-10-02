/** 执行状态的阶段判定，含正在停止与已停止 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  countCalls, countJudging, elapsedMs, isActivePhase, isTicking, judgeItemOf, pendingJudgeState, phaseOf, runClock,
} from "@/app/components/run-status/run-phase";
import type { CallProgress, ProgressView } from "@/core/progress";

const NOW = Date.parse("2026-09-25T05:45:00Z");

function call(state: CallProgress["state"]): CallProgress {
  return {
    targetId: "claude__claude-opus-5-5__high",
    promptId: "xiyou-v1",
    effort: "high",
    state,
    startedAt: state === "queued" ? null : "2026-09-25T05:44:00Z",
    timeoutMs: 300_000,
    status: state === "done" ? "ok" : null,
    durationMs: state === "done" ? 30_000 : null,
  };
}

function run(overrides: Partial<ProgressView>): ProgressView {
  return {
    runId: "20260925T054153Z",
    trigger: "manual",
    startedAt: "2026-09-25T05:41:53Z",
    updatedAt: "2026-09-25T05:44:30Z",
    finishedAt: null,
    cancelledAt: null,
    pid: 1,
    laneLimit: 6,
    lanes: [{ cli: "claude", model: "claude-opus-5-5", calls: [call("done"), call("running"), call("queued")] }],
    alive: true,
    ...overrides,
  };
}

const judgingRun = (finishedJudging: string | null, alive = true) => run({
  finishedAt: "2026-09-25T05:44:50Z", alive,
  judging: { startedAt: "2026-09-25T05:44:51Z", finishedAt: finishedJudging, items: [
    { attemptKey: "a", targetId: "claude__m__high", promptId: "animated-pelican-v1", state: "done", startedAt: "2026-09-25T05:44:51Z", durationMs: 9000, verdict: "online", score: 88, note: null },
    { attemptKey: "b", targetId: "claude__m__low", promptId: "animated-pelican-v1", state: "running", startedAt: "2026-09-25T05:44:59Z", durationMs: null, verdict: null, score: null, note: null },
  ] },
});

describe("AI 层评审阶段（ACR-020）", () => {
  test("调用都结束、评审未收尾且进程还在：评审中；收尾后已完成", () => {
    assert.equal(phaseOf(judgingRun(null), NOW), "judging");
    assert.equal(phaseOf(judgingRun("2026-09-25T05:46:00Z"), NOW), "finished");
    assert.equal(isActivePhase("judging"), false, "评审中不占执行位");
  });

  test("评审进程消失：按已完成显示，队列状态保留供提示", () => {
    assert.equal(phaseOf(judgingRun(null, false), NOW), "finished");
  });

  test("待复核作品的实时状态：进程在时排队 / 评审中，进程不在即中断，有结论或不在队列为 null", () => {
    const alive = [judgingRun(null)];
    assert.equal(pendingJudgeState(alive, alive[0]!.runId, "b", NOW), "running");
    assert.equal(pendingJudgeState(alive, alive[0]!.runId, "a", NOW), null, "已有结论");
    assert.equal(pendingJudgeState(alive, alive[0]!.runId, "zzz", NOW), null, "不在队列");
    assert.equal(pendingJudgeState(alive, "other-run", "b", NOW), null, "不在最近几轮");
    const gone = [judgingRun(null, false)];
    assert.equal(pendingJudgeState(gone, gone[0]!.runId, "b", NOW), "interrupted");
    const finished = [judgingRun("2026-09-25T05:46:00Z")];
    assert.equal(pendingJudgeState(finished, finished[0]!.runId, "b", NOW), "interrupted", "收尾后仍没结论的条目按中断显示");
  });

  test("队列计数与按作品查找", () => {
    const view = judgingRun(null);
    assert.deepEqual(countJudging(view.judging!.items), { total: 2, done: 1, failed: 0, running: view.judging!.items[1]! });
    assert.equal(judgeItemOf([view], view.runId, "b")?.state, "running");
    assert.equal(judgeItemOf([view], view.runId, "zzz"), null);
    assert.equal(judgeItemOf(null, view.runId, "a"), null);
  });
});

describe("停表：进程消失后不再随墙钟计时", () => {
  test("执行中与评审中计时走，中断、已完成、已停止停表", () => {
    assert.deepEqual((["running", "stopping", "judging"] as const).map(isTicking), [true, true, true]);
    assert.deepEqual((["interrupted", "finished", "cancelled"] as const).map(isTicking), [false, false, false]);
  });

  test("中断轮次里残留的执行中调用停在进度文件最后一次更新", () => {
    const dead = run({ alive: false });
    const later = NOW + 20 * 3600_000;
    const phase = phaseOf(dead, later);
    assert.equal(phase, "interrupted");
    const clock = runClock(dead, phase, later);
    assert.equal(clock, Date.parse(dead.updatedAt));
    assert.equal(elapsedMs(call("running"), clock), 30_000, "05:44:00 开始，05:44:30 最后一次更新");
  });

  test("执行中的轮次按当前时刻计时", () => {
    const live = run({});
    assert.equal(runClock(live, phaseOf(live, NOW), NOW), NOW);
  });
});

describe("phaseOf", () => {
  test("未请求停止时为执行中、中断或已完成", () => {
    assert.equal(phaseOf(run({}), NOW), "running");
    assert.equal(phaseOf(run({ alive: false }), NOW), "interrupted");
    assert.equal(phaseOf(run({ finishedAt: "2026-09-25T05:44:50Z" }), NOW), "finished");
  });

  test("接受停止请求后、结束前为正在停止", () => {
    assert.equal(phaseOf(run({ cancelledAt: "2026-09-25T05:44:40Z" }), NOW), "stopping");
  });

  test("停止后结束为已停止", () => {
    const stopped = run({ cancelledAt: "2026-09-25T05:44:40Z", finishedAt: "2026-09-25T05:44:45Z" });
    assert.equal(phaseOf(stopped, NOW), "cancelled");
  });

  test("停止中的执行进程消失时算中断", () => {
    assert.equal(phaseOf(run({ cancelledAt: "2026-09-25T05:44:40Z", alive: false }), NOW), "interrupted");
  });

  test("进度文件缺少 cancelledAt 时按未停止处理", () => {
    const legacy = run({});
    delete legacy.cancelledAt;
    assert.equal(phaseOf(legacy, NOW), "running");
  });
});

test("执行中与正在停止都占着执行位", () => {
  assert.equal(isActivePhase("running"), true);
  assert.equal(isActivePhase("stopping"), true);
  assert.equal(isActivePhase("cancelled"), false);
  assert.equal(isActivePhase("finished"), false);
  assert.equal(isActivePhase("interrupted"), false);
});

test("被取消的调用单独计数，不算已完成", () => {
  const counts = countCalls([call("done"), call("cancelled"), call("cancelled"), call("queued")]);
  assert.deepEqual(counts, { total: 4, done: 1, running: 0, cancelled: 2, ok: 1 });
});

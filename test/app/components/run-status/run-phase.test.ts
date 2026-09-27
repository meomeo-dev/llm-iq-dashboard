/** 执行状态的阶段判定，含正在停止与已停止 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { countCalls, isActivePhase, phaseOf } from "@/app/components/run-status/run-phase";
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

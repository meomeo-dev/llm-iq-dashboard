/**
 * 待导出勾选状态：新轮次默认整轮勾上；轮内去掉调用变部分勾选、全去掉即未勾；
 * 未勾的轮里点一次调用只勾它；请求范围只给部分勾选的轮次列子集。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  initialSelection,
  isAttemptPicked,
  reconcileSelection,
  runPick,
  selectionScope,
  toggleAttempt,
  toggleRun,
} from "@/app/config/pending-selection-model";
import type { PendingRun } from "@/core/sync/data-repo-panel-types";

function run(runId: string, keys: string[]): PendingRun {
  const items = keys.map((key) => ({
    key, promptId: "p", cli: "codex", model: "m", effort: "low", status: "ok", svgFile: null,
  }));
  return { runId, promptIds: ["p"], attempts: keys.length, ok: keys.length, profiles: [], items };
}

const A = run("20260930T030000Z", ["a1@p", "a2@p", "a3@p"]);
const B = run("20260930T040000Z", ["b1@p"]);

test("缺省整轮勾选，范围不列子集", () => {
  const state = initialSelection([A, B]);
  assert.equal(runPick(state, A), "all");
  assert.deepEqual(selectionScope(state, [A, B]), { runIds: [A.runId, B.runId], attempts: {} });
});

test("去掉一次调用变部分勾选，全部去掉即未勾选", () => {
  let state = toggleAttempt(initialSelection([A, B]), A, "a2@p");
  assert.equal(runPick(state, A), "some");
  assert.equal(isAttemptPicked(state, A.runId, "a2@p"), false);
  assert.deepEqual(selectionScope(state, [A, B]).attempts, { [A.runId]: ["a1@p", "a3@p"] });
  state = toggleAttempt(toggleAttempt(state, A, "a1@p"), A, "a3@p");
  assert.equal(runPick(state, A), "none");
  assert.deepEqual(selectionScope(state, [A, B]).runIds, [B.runId]);
});

test("未勾的轮里点一次调用只勾它；整轮勾选框在部分勾选时取消整轮", () => {
  let state = toggleRun(initialSelection([A]), A);
  assert.equal(runPick(state, A), "none");
  state = toggleAttempt(state, A, "a3@p");
  assert.deepEqual(selectionScope(state, [A]).attempts, { [A.runId]: ["a3@p"] });
  state = toggleRun(state, A);
  assert.equal(runPick(state, A), "none");
  state = toggleRun(state, A);
  assert.equal(runPick(state, A), "all");
});

test("刷新后保留选择与去掉的调用，新轮次勾上，消失的轮次清掉", () => {
  const state = toggleAttempt(toggleRun(initialSelection([A]), A), A, "a1@p");
  const next = reconcileSelection(state, [A, B], new Set([A.runId]));
  assert.equal(runPick(next, B), "all");
  assert.deepEqual(selectionScope(next, [A, B]).attempts, { [A.runId]: ["a1@p"] });
  const gone = reconcileSelection(next, [B], new Set([A.runId, B.runId]));
  assert.equal(gone.excluded.has(A.runId), false);
});

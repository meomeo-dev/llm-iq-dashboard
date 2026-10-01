import assert from "node:assert/strict";
import { test } from "node:test";
import { judgeLabel, judgeRoutes, moveJudge } from "../../../src/app/config/judge-panel-model";
import type { JudgeModel } from "../../../src/core/config/types";

const agy: JudgeModel = { cli: "agy", model: "gemini-3.8-flash", effort: "high" };
const claude: JudgeModel = { cli: "claude", model: "claude-sonnet-5-5", effort: "high" };
const codex: JudgeModel = { cli: "codex", model: "gpt-6-sol", effort: "medium" };

test("moveJudge 上移、下移与越界", () => {
  assert.deepEqual(moveJudge([agy, claude, codex], 1, -1), [claude, agy, codex]);
  assert.deepEqual(moveJudge([agy, claude, codex], 0, 1), [claude, agy, codex]);
  assert.deepEqual(moveJudge([agy, claude], 0, -1), [agy, claude]);
  assert.deepEqual(moveJudge([agy, claude], 1, 1), [agy, claude]);
});

test("judgeRoutes 按清单顺序跳过同厂商裁判", () => {
  const routes = new Map(judgeRoutes([agy, claude]).map((r) => [r.subject, r.judges]));
  assert.deepEqual(routes.get("codex"), [agy, claude]);
  assert.deepEqual(routes.get("claude"), [agy]);
  assert.deepEqual(routes.get("agy"), [claude]);
  const swapped = new Map(judgeRoutes([claude, agy]).map((r) => [r.subject, r.judges]));
  assert.deepEqual(swapped.get("codex"), [claude, agy]);
});

test("judgeRoutes 只有同厂商裁判时为空", () => {
  const routes = new Map(judgeRoutes([agy]).map((r) => [r.subject, r.judges]));
  assert.deepEqual(routes.get("agy"), []);
});

test("judgeLabel 模型未填时提示", () => {
  assert.equal(judgeLabel({ ...codex, model: "" }), "codex · 未填模型 · medium");
});

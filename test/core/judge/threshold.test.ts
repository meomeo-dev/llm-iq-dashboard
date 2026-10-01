/** 及格线调整后旧记录的结论按当前及格线重定；版本不同或已是当前及格线的记录原样返回 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { ANIMATED_PELICAN_RUBRIC, withCurrentThreshold, type Judgement } from "@/core/judge/schema";

function record(score: number, passThreshold: number, version = ANIMATED_PELICAN_RUBRIC.version): Judgement {
  const criteria = ANIMATED_PELICAN_RUBRIC.criteria.map((c, i) => ({
    id: c.id, source: c.source, title: c.title, standard: c.standard, maxScore: c.maxScore, score: i === 0 ? score : 0, reason: "x",
  }));
  return {
    schemaVersion: 1,
    subject: { runId: "r", attemptKey: "k", promptId: ANIMATED_PELICAN_RUBRIC.id, cli: "codex", model: "m", effort: "high", svgFile: "k.svg" },
    rubric: { id: ANIMATED_PELICAN_RUBRIC.id, version, passThreshold },
    gates: [{ id: "G1", source: "static", title: "t", standard: "s", passed: true, evidence: "e" }],
    criteria,
    total: { score, maxScore: 100, verdict: score >= passThreshold ? "online" : "degraded", judgedAt: "2026-09-30T00:00:00Z" },
    judges: [], contactSheet: null, blindDescription: null,
  } as unknown as Judgement;
}

test("withCurrentThreshold：60 分及格线下的 70 分旧记录按 78 分重定为降智，分数不变，及格线改成当前值", () => {
  const old = record(70, 60);
  const fixed = withCurrentThreshold(old);
  assert.equal(fixed.total.verdict, "degraded");
  assert.equal(fixed.total.score, 70);
  assert.equal(fixed.rubric.passThreshold, ANIMATED_PELICAN_RUBRIC.passThreshold);
  assert.equal(withCurrentThreshold(record(80, 60)).total.verdict, "online");
  assert.equal(old.total.verdict, "online", "原记录对象不被改动");
});

test("withCurrentThreshold：及格线相同、版本不同或标准未知的记录原样返回", () => {
  const same = record(70, ANIMATED_PELICAN_RUBRIC.passThreshold);
  assert.equal(withCurrentThreshold(same), same);
  const older = record(70, 60, ANIMATED_PELICAN_RUBRIC.version - 1);
  assert.equal(withCurrentThreshold(older), older);
  const unknown = { ...record(70, 60), rubric: { id: "other-v1", version: 1, passThreshold: 60 } } as Judgement;
  assert.equal(withCurrentThreshold(unknown), unknown);
});

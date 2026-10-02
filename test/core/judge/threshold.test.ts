/** 及格线与关键标准门槛调整后旧记录的结论按当前规则重定；版本不同或结论未变的记录原样返回 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { ANIMATED_PELICAN_RUBRIC, withCurrentRules, type Judgement } from "@/core/judge/schema";

function record(score: number, passThreshold: number, version = ANIMATED_PELICAN_RUBRIC.version): Judgement {
  const criteria = ANIMATED_PELICAN_RUBRIC.criteria.map((c, i) => ({
    // 关键标准 C8、C9 给满分免得触发门槛；剩下的分全记在第一条上，只为凑出想要的总分
    id: c.id, source: c.source, title: c.title, standard: c.standard, maxScore: c.maxScore,
    score: c.minScore !== undefined ? c.maxScore : i === 0 ? score - 40 : 0, reason: "x",
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

test("withCurrentRules：60 分及格线下的 70 分旧记录按 78 分重定为降智，分数不变，及格线改成当前值", () => {
  const old = record(70, 60);
  const fixed = withCurrentRules(old);
  assert.equal(fixed.total.verdict, "degraded");
  assert.equal(fixed.total.score, 70);
  assert.equal(fixed.rubric.passThreshold, ANIMATED_PELICAN_RUBRIC.passThreshold);
  assert.equal(withCurrentRules(record(80, 60)).total.verdict, "online");
  assert.equal(old.total.verdict, "online", "原记录对象不被改动");
});

test("withCurrentRules：及格线相同、版本不同或标准未知的记录原样返回", () => {
  const same = record(70, ANIMATED_PELICAN_RUBRIC.passThreshold);
  assert.equal(withCurrentRules(same), same);
  const older = record(70, 60, ANIMATED_PELICAN_RUBRIC.version - 1);
  assert.equal(withCurrentRules(older), older);
  const unknown = { ...record(70, 60), rubric: { id: "other-v1", version: 1, passThreshold: 60 } } as Judgement;
  assert.equal(withCurrentRules(unknown), unknown);
});

test("关键标准门槛：C8 或 C9 低于 6 分即不计那一项的分并判降智，等于 6 分照常计分", () => {
  const full = (overrides: Record<string, number>): Judgement => {
    const base = record(0, ANIMATED_PELICAN_RUBRIC.passThreshold);
    const criteria = base.criteria.map((c) => ({ ...c, score: overrides[c.id] ?? c.maxScore }));
    return { ...base, criteria } as Judgement;
  };
  const wingsOff = withCurrentRules(full({ C9: 3 }));
  assert.equal(wingsOff.total.verdict, "degraded");
  assert.equal(wingsOff.total.score, 80, "其余 80 分照计，C9 的 3 分不计");
  const wingsBarely = withCurrentRules(full({ C9: 6 }));
  assert.equal(wingsBarely.total.verdict, "online");
  assert.equal(wingsBarely.total.score, 86);
  assert.equal(withCurrentRules(full({ C8: 5 })).total.verdict, "degraded");
  assert.equal(withCurrentRules(full({ C7: 0 })).total.verdict, "online", "非关键标准没有门槛");
  const older = full({ C9: 3 });
  older.rubric = { ...older.rubric, version: ANIMATED_PELICAN_RUBRIC.version - 1 };
  assert.equal(withCurrentRules(older), older, "版本不同的记录不套当前门槛");
});

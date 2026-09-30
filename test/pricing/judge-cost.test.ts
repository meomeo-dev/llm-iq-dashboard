/** AI 层裁判成本：从评审记录的 ai 裁判取用量，按 id 解析 cli / model 计价 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { judgeCostOf } from "@/pricing/judge-cost";
import type { Judgement } from "@/core/judge/schema";

const base: Judgement = {
  schemaVersion: 1,
  subject: { runId: "r", attemptKey: "k", promptId: "animated-pelican-v1", cli: "codex", model: "m", effort: "high", svgFile: "k.svg" },
  rubric: { id: "animated-pelican-v1", version: 3, passThreshold: 60 },
  judges: [{ kind: "code", id: "static-judge@1", judgedAt: "2026-09-30T00:00:00Z" }],
  gates: [], criteria: [],
  total: { score: 0, maxScore: 100, verdict: "pending", judgedAt: "2026-09-30T00:00:00Z" },
};

describe("judgeCostOf", () => {
  test("没有 AI 裁判即 null", () => {
    assert.equal(judgeCostOf(base), null);
    assert.equal(judgeCostOf(null), null);
  });

  test("有 AI 裁判：带回裁判 id、问答次数与用量；成本结构与作品成本同形", () => {
    const usage = { tokens: { input: 1000, output: 100 }, reasoningTokens: 0, serviceTier: "standard" as const, reportedCostUsd: null };
    const judged = { ...base, judges: [...base.judges, { kind: "ai" as const, id: "agy/gemini-3.8-flash@high", judgedAt: "2026-09-30T00:01:00Z", usage, asks: 2 }] };
    const cost = judgeCostOf(judged);
    assert.equal(cost?.judgeId, "agy/gemini-3.8-flash@high");
    assert.equal(cost?.asks, 2);
    assert.deepEqual(cost?.usage, usage);
    assert.ok(["priced", "partial", "unpriced"].includes(cost!.cost.status));
  });

  test("裁判 id 解析不出 cli：按无法计价处理而不抛错", () => {
    const judged = { ...base, judges: [{ kind: "ai" as const, id: "weird", judgedAt: "2026-09-30T00:01:00Z" }] };
    assert.equal(judgeCostOf(judged)?.cost.status, "unpriced");
  });
});

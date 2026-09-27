/** 成本预算：历史汇总、整轮预测与逐次放行 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { dayBudgetExhausted, forecastRound, openBudgetGate, summarizeHistory, type CostHistory } from "@/core/budget";

const NOW = new Date("2026-09-25T12:00:00Z");
const history = (expected: Record<string, number>, spentLastDayUsd = 0): CostHistory => ({
  expected: new Map(Object.entries(expected)), spentLastDayUsd,
});

describe("summarizeHistory", () => {
  test("预测取各目标最近 10 次的平均；近 24 小时花费按调用开始时刻累计", () => {
    const samples = [
      ...Array.from({ length: 12 }, (_, i) => ({
        targetId: "a", startedAt: new Date(NOW.getTime() - (i + 1) * 3_600_000).toISOString(), usd: i < 10 ? 1 : 100,
      })),
      { targetId: "b", startedAt: "2026-09-20T00:00:00Z", usd: 0.5 },
    ];
    const result = summarizeHistory(samples, NOW);
    assert.equal(result.expected.get("a"), 1);
    assert.equal(result.expected.get("b"), 0.5);
    assert.equal(result.spentLastDayUsd, 10 + 200);
  });
});

describe("forecastRound", () => {
  test("按目标 × 提示词累计，没有历史的目标单独计数", () => {
    const forecast = forecastRound(["a", "b", "c"], 2, new Map([["a", 1], ["b", 0.25]]));
    assert.deepEqual(forecast, { usd: 2.5, calls: 6, unpricedCalls: 2 });
  });
});

describe("预算放行", () => {
  test("近 24 小时已达每日上限时本轮不开始", () => {
    const budget = { perRoundUsd: null, perDayUsd: 5 };
    assert.match(dayBudgetExhausted(budget, history({}, 5)) ?? "", /每日上限/);
    assert.equal(dayBudgetExhausted(budget, history({}, 4.99)), null);
    assert.equal(dayBudgetExhausted({ perRoundUsd: 1, perDayUsd: null }, history({}, 999)), null);
  });

  test("按预测占位：并行的调用不会一起越过每轮上限", () => {
    const gate = openBudgetGate({ perRoundUsd: 2, perDayUsd: null }, history({ a: 0.8 }));
    assert.equal(gate.admit("a"), null);
    assert.equal(gate.admit("a"), null);
    assert.match(gate.admit("a") ?? "", /每轮上限/);
  });

  test("结算以实际成本替换占位", () => {
    const gate = openBudgetGate({ perRoundUsd: 2, perDayUsd: null }, history({ a: 0.8 }));
    assert.equal(gate.admit("a"), null);
    gate.settle("a", 0.1);
    assert.equal(gate.admit("a"), null);
    assert.equal(gate.admit("a"), null);
  });

  test("单次预测就超过上限的调用不发起，便宜的照常放行", () => {
    const gate = openBudgetGate({ perRoundUsd: 1, perDayUsd: null }, history({ max: 4, low: 0.2 }));
    assert.match(gate.admit("max") ?? "", /每轮上限/);
    assert.equal(gate.admit("low"), null);
  });

  test("已到顶后，没有历史成本的调用同样不放行", () => {
    const gate = openBudgetGate({ perRoundUsd: null, perDayUsd: 3 }, history({ a: 1 }, 2));
    assert.equal(gate.admit("a"), null);
    assert.match(gate.admit("unknown") ?? "", /每日上限/);
  });
});

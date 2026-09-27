/** 卡片页脚的耗时与成本文案 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { formatCost, formatDuration } from "@/app/components/card/card-format";
import type { CostEstimate } from "@/pricing/types";

describe("formatDuration", () => {
  test("秒数取整进位到分钟，不出现 60s", () => {
    assert.equal(formatDuration(119_600), "2m0s");
    assert.equal(formatDuration(67_000), "1m7s");
    assert.equal(formatDuration(59_940), "59.9s");
  });
});

describe("formatCost", () => {
  const cost = (usd: number | null, status: CostEstimate["status"] = "priced"): CostEstimate => ({
    status, usd, modelId: null, channelId: null, serviceTier: "standard", catalogTag: null, lines: [], note: null,
  });

  test("一美元以下三位小数，以上两位；部分计价标下限；无法计价为 —", () => {
    assert.equal(formatCost(cost(0.82194)), "$0.822");
    assert.equal(formatCost(cost(1.37)), "$1.37");
    assert.equal(formatCost(cost(0.0004)), "<$0.001");
    assert.equal(formatCost(cost(0.5, "partial")), "≥$0.500");
    assert.equal(formatCost(cost(null, "unpriced")), "—");
  });
});

/**
 * 价格目录查价：模型名解析、按时刻取价与折算。目录数据用最小构造，不依赖同步下来的附件。
 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { estimateCost, identifierKey, type PriceCatalog, type PriceRow } from "@/pricing/catalog";
import { parseCsv } from "@/pricing/csv";
import type { TokenUsage } from "@/pricing/types";

const price = (modelId: string, meter: string, amount: number, extra: Partial<PriceRow> = {}): PriceRow => ({
  modelId, channelId: "anthropic-api", serviceTier: "standard", meter, amount,
  validFrom: "2026-01-01T00:00:00Z", validTo: null, ...extra,
});

const identifier = (identifierText: string, modelId: string, clientId = "") => ({
  identifier: identifierText, identifierKey: identifierKey(identifierText),
  namespaceKind: clientId === "" ? "catalog" : "client", clientId, modelId,
  impliedServiceTier: "", validFrom: null, validTo: null,
});

const CATALOG: PriceCatalog = {
  tag: "data-test",
  prices: [
    price("claude-sonnet-5", "input", 2),
    price("claude-sonnet-5", "cache_read", 0.2),
    price("claude-sonnet-5", "cache_write_1h", 4),
    price("claude-sonnet-5", "output", 10),
    // 旧价在 2026-06-01 失效，此后为新价
    price("gemini-3.8-flash", "input", 1, { channelId: "gemini-api", validTo: "2026-06-01T00:00:00Z" }),
    price("gemini-3.8-flash", "input", 0.75, { channelId: "gemini-api", validFrom: "2026-06-01T00:00:00Z" }),
  ],
  identifiers: [
    identifier("claude-sonnet-5", "claude-sonnet-5"),
    identifier("gemini-3.8-flash", "gemini-3.8-flash"),
    identifier("gemini-3.8-flash-high", "gemini-3.8-flash", "agy"),
  ],
};

const usage = (tokens: TokenUsage["tokens"]): TokenUsage => ({
  tokens, reasoningTokens: 0, serviceTier: "standard", reportedCostUsd: null,
});

describe("estimateCost", () => {
  test("与 Claude CLI 自报成本一致（真实转录的用量与目录标价）", () => {
    const cost = estimateCost(
      CATALOG,
      { cli: "claude", model: "claude-sonnet-5", startedAt: "2026-09-22T11:39:20Z" },
      usage({ input: 8, cache_read: 123739, output: 5352, cache_write_1h: 45468 }),
    );
    assert.equal(cost.status, "priced");
    assert.equal(cost.channelId, "anthropic-api");
    assert.ok(Math.abs((cost.usd ?? 0) - 0.2601558) < 1e-9);
  });

  test("按调用时刻取当时生效的价格", () => {
    const call = (startedAt: string) =>
      estimateCost(CATALOG, { cli: "agy", model: "gemini-3.8-flash", startedAt }, usage({ input: 1_000_000 })).usd;
    assert.equal(call("2026-05-31T23:59:59Z"), 1);
    assert.equal(call("2026-06-01T00:00:00Z"), 0.75);
  });

  test("客户端专有标签按该 CLI 的命名空间解析", () => {
    const cost = estimateCost(
      CATALOG,
      { cli: "agy", model: "gemini-3.8-flash-high", startedAt: "2026-09-25T00:00:00Z" },
      usage({ input: 1_000_000 }),
    );
    assert.equal(cost.modelId, "gemini-3.8-flash");
    const other = estimateCost(
      CATALOG,
      { cli: "codex", model: "gemini-3.8-flash-high", startedAt: "2026-09-25T00:00:00Z" },
      usage({ input: 1 }),
    );
    assert.equal(other.status, "unpriced");
  });

  test("有计价项缺价格时为 partial，只合计有价格的部分", () => {
    const cost = estimateCost(
      CATALOG,
      { cli: "agy", model: "gemini-3.8-flash", startedAt: "2026-09-25T00:00:00Z" },
      usage({ input: 1_000_000, output: 10 }),
    );
    assert.equal(cost.status, "partial");
    assert.equal(cost.usd, 0.75);
    assert.match(cost.note ?? "", /output/);
  });

  test("没有 fast 档价格时不拿 standard 价代替", () => {
    const fast = { ...usage({ input: 1 }), serviceTier: "fast" as const };
    const cost = estimateCost(CATALOG, { cli: "claude", model: "claude-sonnet-5", startedAt: "2026-09-25T00:00:00Z" }, fast);
    assert.equal(cost.status, "unpriced");
    assert.equal(cost.serviceTier, "fast");
  });

  test("目录未同步或没有用量时标明原因", () => {
    const call = { cli: "claude" as const, model: "claude-sonnet-5", startedAt: "2026-09-25T00:00:00Z" };
    assert.match(estimateCost(null, call, usage({ input: 1 })).note ?? "", /pricing:sync/);
    assert.match(estimateCost(CATALOG, call, null).note ?? "", /用量/);
  });
});

describe("parseCsv", () => {
  test("引号字段可含逗号、换行与转义引号；兼容 CRLF", () => {
    const rows = parseCsv('a,b\r\n1,"x, ""y""\nz"\r\n2,\r\n');
    assert.deepEqual(rows, [{ a: "1", b: 'x, "y"\nz' }, { a: "2", b: "" }]);
  });
});

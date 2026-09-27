/**
 * 三家 CLI 的用量口径各不相同；折算前必须统一成互不重叠的计价项，否则缓存读取或
 * 推理 token 会被重复计费。样例数字取自真实转录。
 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { usageFromTranscript } from "@/pricing/usage";

const json = (value: unknown) => JSON.stringify(value);

describe("usageFromTranscript", () => {
  test("claude：四项并列，缓存写入按 TTL 分档，thinking 已含在 output 内", () => {
    const transcript = [
      json({ type: "system", subtype: "init", model: "claude-sonnet-5" }),
      json({
        type: "result",
        total_cost_usd: 0.2601558,
        usage: {
          input_tokens: 8,
          cache_creation_input_tokens: 45468,
          cache_read_input_tokens: 123739,
          output_tokens: 5352,
          cache_creation: { ephemeral_1h_input_tokens: 45468, ephemeral_5m_input_tokens: 0 },
          output_tokens_details: { thinking_tokens: 172 },
          speed: "standard",
        },
      }),
      "===== stderr =====",
    ].join("\n");
    assert.deepEqual(usageFromTranscript("claude", transcript), {
      tokens: { input: 8, cache_read: 123739, output: 5352, cache_write_1h: 45468 },
      reasoningTokens: 172,
      serviceTier: "standard",
      reportedCostUsd: 0.2601558,
    });
  });

  test("claude：快速模式记 fast 档", () => {
    const transcript = json({ type: "result", usage: { input_tokens: 1, output_tokens: 1, speed: "fast" } });
    assert.equal(usageFromTranscript("claude", transcript)?.serviceTier, "fast");
  });

  test("codex：取最后一条累计值，缓存读写从 input 中扣出", () => {
    const update = (inputTokens: number, outputTokens: number) =>
      json({
        method: "thread/tokenUsage/updated",
        params: {
          tokenUsage: {
            total: {
              totalTokens: inputTokens + outputTokens,
              inputTokens,
              cachedInputTokens: 21248,
              cacheWriteInputTokens: 1000,
              outputTokens,
              reasoningOutputTokens: 516,
            },
          },
        },
      });
    const transcript = [update(20000, 100), update(31105, 4003)].join("\n");
    assert.deepEqual(usageFromTranscript("codex", transcript), {
      tokens: { input: 8857, cache_read: 21248, cache_write: 1000, output: 4003 },
      reasoningTokens: 516,
      serviceTier: "standard",
      reportedCostUsd: null,
    });
  });

  test("agy：缓存读取与 input 并列；重试的每次尝试都累加", () => {
    const result = (input: number, cacheRead: number, output: number) =>
      json({
        event: "result",
        result: {
          status: "SUCCESS",
          usage: {
            input_tokens: input, output_tokens: output, thinking_tokens: 100,
            cache_read_tokens: cacheRead, total_tokens: input + output,
          },
        },
      });
    const transcript = [result(23830, 27282, 6500), "===== retry =====", result(100, 0, 50)].join("\n");
    assert.deepEqual(usageFromTranscript("agy", transcript)?.tokens, {
      input: 23930, cache_read: 27282, output: 6550,
    });
  });

  test("没有用量事件时返回 null，而不是记作 0；agy 的逐步用量不算", () => {
    assert.equal(usageFromTranscript("agy", json({ event: "init" })), null);
    const step = json({ event: "step_update", usage: { input_tokens: 5, output_tokens: 5 } });
    assert.equal(usageFromTranscript("agy", step), null);
    assert.equal(usageFromTranscript("codex", "not json"), null);
  });
});

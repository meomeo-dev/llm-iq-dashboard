/** judge 配置：缺省关闭，只认布尔值 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { parseJudge } from "@/core/config/loader";

describe("parseJudge", () => {
  const aiOff = { enabled: false, judges: [], timeoutMs: 300000, concurrency: 5 };

  test("不写即关闭，AI 层也关闭", () => {
    assert.deepEqual(parseJudge(undefined, []), { enabled: false, ai: aiOff });
  });

  test("enabled: true 开启代码层", () => {
    assert.deepEqual(parseJudge({ enabled: true }, []), { enabled: true, ai: aiOff });
  });

  test("非布尔值报错并回落为关闭", () => {
    const errors: string[] = [];
    assert.deepEqual(parseJudge({ enabled: "yes" }, errors), { enabled: false, ai: aiOff });
    assert.equal(errors[0], "judge.enabled 必须是布尔值");
  });

  test("judge.ai：裁判清单与超时；坏的裁判条目报错并剔除", () => {
    const errors: string[] = [];
    const parsed = parseJudge({ ai: { judges: [
      { cli: "claude", model: "claude-sonnet-5-5", effort: "medium" },
      { cli: "gemini", model: "x", effort: "low" },
    ], timeoutMs: 1000 } }, errors);
    assert.deepEqual(parsed.ai, { enabled: true, judges: [{ cli: "claude", model: "claude-sonnet-5-5", effort: "medium" }], timeoutMs: 1000, concurrency: 5 });
    assert.match(errors[0] ?? "", /judge\.ai\.judges\[1\]/);
  });

  test("judge.ai.concurrency：每个裁判的并行度，不写为 5；非整数、越界报错并回落 5", () => {
    const judges = [{ cli: "claude", model: "claude-sonnet-5-5", effort: "medium" }];
    assert.equal(parseJudge({ ai: { judges, concurrency: 3 } }, []).ai.concurrency, 3);
    for (const bad of [0, 2.5, 21, "many"]) {
      const errors: string[] = [];
      assert.equal(parseJudge({ ai: { judges, concurrency: bad } }, errors).ai.concurrency, 5, String(bad));
      assert.match(errors[0] ?? "", /judge\.ai\.concurrency/);
    }
  });

  test("judge.ai 开启但没有裁判：报错且按关闭处理", () => {
    const errors: string[] = [];
    assert.equal(parseJudge({ ai: { enabled: true } }, errors).ai.enabled, false);
    assert.match(errors[0] ?? "", /至少要有一个裁判/);
  });
});

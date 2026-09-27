import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { parseRunRequestBody } from "@/app/api/run/run-request";

describe("parseRunRequestBody 纯逻辑测试", () => {
  test("空字符串或纯空白返回 null（按配置跑整轮）", () => {
    assert.equal(parseRunRequestBody(""), null);
    assert.equal(parseRunRequestBody("   \n\t  "), null);
  });

  test("合法请求体解析出 targetIds 与 promptIds", () => {
    const json = JSON.stringify({
      targetIds: ["target-1", "target-2"],
      promptIds: ["pelican-bicycle"],
    });
    const parsed = parseRunRequestBody(json);
    assert.deepEqual(parsed, {
      targetIds: ["target-1", "target-2"],
      promptIds: ["pelican-bicycle"],
    });
  });

  test("包含 candidateOverrides 时过滤非空字符串", () => {
    const json = JSON.stringify({
      targetIds: ["target-1"],
      promptIds: ["classics-ancient"],
      candidateOverrides: {
        "classics-ancient": "poet-libai",
        invalid: "   ",
        num: 123,
      },
    });
    const parsed = parseRunRequestBody(json);
    assert.deepEqual(parsed, {
      targetIds: ["target-1"],
      promptIds: ["classics-ancient"],
      candidateOverrides: {
        "classics-ancient": "poet-libai",
      },
    });
  });

  test("缺少 targetIds 抛出校验异常", () => {
    const json = JSON.stringify({ promptIds: ["p1"] });
    assert.throws(
      () => parseRunRequestBody(json),
      /请求体须为 \{ targetIds: string\[\], promptIds: string\[\] \}/
    );
  });

  test("targetIds 包含非字符串元素抛出校验异常", () => {
    const json = JSON.stringify({ targetIds: [123], promptIds: ["p1"] });
    assert.throws(
      () => parseRunRequestBody(json),
      /请求体须为 \{ targetIds: string\[\], promptIds: string\[\] \}/
    );
  });

  test("缺少 promptIds 抛出校验异常", () => {
    const json = JSON.stringify({ targetIds: ["t1"] });
    assert.throws(
      () => parseRunRequestBody(json),
      /请求体须为 \{ targetIds: string\[\], promptIds: string\[\] \}/
    );
  });

  test("非法 JSON 抛出解析异常", () => {
    assert.throws(() => parseRunRequestBody("{ invalid json"), SyntaxError);
  });
});

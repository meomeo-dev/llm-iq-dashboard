/**
 * 必测矩阵 #4：强度折叠（不越级加码）。折叠方向错了，强度对比会得出相反结论。
 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { foldEffort } from "@/core/types";

describe("foldEffort", () => {
  test("支持请求档位时原样使用", () => {
    assert.equal(foldEffort("high", ["low", "high"]), "high");
  });

  test("不支持时取不高于请求档位的最高可用档", () => {
    assert.equal(foldEffort("medium", ["low", "high"]), "low");
    assert.equal(foldEffort("max", ["low", "medium", "high"]), "high");
  });

  test("请求低于全部可用档时退到最低档", () => {
    assert.equal(foldEffort("low", ["high", "max"]), "high");
  });

  test("模型未声明可用档位时原样透传", () => {
    assert.equal(foldEffort("xhigh", []), "xhigh");
  });
});

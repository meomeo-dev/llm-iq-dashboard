import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { tally, zoneLabel } from "@/app/components/toolbar/toolbar-calc";

describe("toolbar-calc 纯计算逻辑测试", () => {
  test("tally：按出现次数降序，频次相同时按名称字母升序", () => {
    const input = ["claude", "agy", "claude", "codex", "agy", "claude", "apple"];
    const result = tally(input);
    assert.deepEqual(result, [
      { value: "claude", label: "claude", count: 3 },
      { value: "agy", label: "agy", count: 2 },
      { value: "apple", label: "apple", count: 1 },
      { value: "codex", label: "codex", count: 1 },
    ]);
  });

  test("tally：空数组返回空数组", () => {
    assert.deepEqual(tally([]), []);
  });

  test("zoneLabel：取匹配选项标签并附加偏移", () => {
    const options = [
      { id: "Asia/Shanghai", label: "北京" },
      { id: "UTC", label: "UTC" },
    ];
    const label = zoneLabel(options, "Asia/Shanghai");
    assert.match(label, /^北京 /);
  });

  test("zoneLabel：找不到选项时退回使用 timeZone 作为标签", () => {
    const label = zoneLabel([], "Asia/Tokyo");
    assert.match(label, /^Asia\/Tokyo /);
  });
});

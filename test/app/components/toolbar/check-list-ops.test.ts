import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  isAllShown,
  invertHidden,
  showAllHidden,
  toggleHidden,
} from "@/app/components/toolbar/check-list-ops";

describe("check-list-ops 集合纯操作测试", () => {
  test("isAllShown：当且仅当列表内所有取值均不在 hidden 集合时返回 true", () => {
    assert.equal(isAllShown(new Set(), ["a", "b"]), true);
    assert.equal(isAllShown(new Set(["c"]), ["a", "b"]), true);
    assert.equal(isAllShown(new Set(["a"]), ["a", "b"]), false);
    assert.equal(isAllShown(new Set(), []), true);
  });

  test("showAllHidden：保留不在当前 values 里的隐藏项，清除当前 values 里的隐藏项", () => {
    const hidden = new Set(["a", "other"]);
    const values = ["a", "b"];
    const next = showAllHidden(hidden, values);
    assert.deepEqual([...next], ["other"]);
  });

  test("invertHidden：对当前 values 范围内的项进行布尔反转", () => {
    const hidden = new Set(["a", "other"]);
    const values = ["a", "b"];
    const next = invertHidden(hidden, values);
    // a 从 hidden 中移除，b 加入 hidden，other 保持在 hidden
    assert.equal(next.has("a"), false);
    assert.equal(next.has("b"), true);
    assert.equal(next.has("other"), true);
  });

  test("toggleHidden：单项取反切换", () => {
    const hidden = new Set(["a", "b"]);
    const toggledOff = toggleHidden(hidden, "a");
    assert.equal(toggledOff.has("a"), false);
    assert.equal(toggledOff.has("b"), true);

    const toggledOn = toggleHidden(toggledOff, "a");
    assert.equal(toggledOn.has("a"), true);
    assert.equal(toggledOn.has("b"), true);
  });
});

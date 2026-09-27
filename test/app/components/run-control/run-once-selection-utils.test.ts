import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toggled, without } from "@/app/components/run-control/run-once-selection-utils";
import { hasReached } from "@/app/components/run-control/use-run-once-progress";
import type { ProgressView } from "@/core/progress";

describe("run-once-selection-utils", () => {
  test("toggled: 切换已有项则删除，切换未有项则增加", () => {
    const initial = new Set(["a", "b"]);
    const res1 = toggled(initial, ["b", "c"]);
    assert.deepEqual([...res1].sort(), ["a", "c"]);

    const res2 = toggled(res1, ["a"]);
    assert.deepEqual([...res2], ["c"]);
  });

  test("without: 移除指定项", () => {
    const initial = new Set(["a", "b", "c"]);
    const res = without(initial, ["b", "d"]);
    assert.deepEqual([...res].sort(), ["a", "c"]);
  });
});

describe("hasReached", () => {
  test("进度列表包含当前轮次或更新轮次时返回 true", () => {
    const progress = [
      { runId: "20260927T020000Z" } as ProgressView,
      { runId: "20260927T010000Z" } as ProgressView,
    ];
    assert.equal(hasReached(progress, "20260927T010000Z"), true);
    assert.equal(hasReached(progress, "20260927T000000Z"), true);
    assert.equal(hasReached(progress, "20260927T030000Z"), false);
  });
});

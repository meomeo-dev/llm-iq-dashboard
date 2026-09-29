import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  calculateFilterBadge,
  countFilteredGroups,
} from "@/app/components/toolbar/filter-badge";
import type { CheckItem } from "@/app/components/toolbar/CheckList";
import type { FilterGroup } from "@/app/components/toolbar/FilterMenu";

describe("filter-badge 筛选徽章纯逻辑测试", () => {
  const items: CheckItem[] = [
    { value: "a", label: "A", count: 1 },
    { value: "b", label: "B", count: 2 },
    { value: "c", label: "C", count: 3 },
  ];

  test("未筛选时显示总数且 filtered 为 false", () => {
    const b = calculateFilterBadge(items, new Set());
    assert.deepEqual(b, { text: "3", filtered: false });
  });

  test("部分筛选时显示 shown/total 且 filtered 为 true", () => {
    const b = calculateFilterBadge(items, new Set(["a"]));
    assert.deepEqual(b, { text: "2/3", filtered: true });
  });

  test("hidden 集合含无关取值时不影响当日本组计算", () => {
    const b = calculateFilterBadge(items, new Set(["other-key"]));
    assert.deepEqual(b, { text: "3", filtered: false });
  });

  test("countFilteredGroups：统计存在被筛掉项的维度数量", () => {
    const groups: FilterGroup[] = [
      { key: "cli", label: "CLI", items },
      { key: "model", label: "Model", items },
    ];
    assert.equal(
      countFilteredGroups(groups, {
        cli: new Set(["a"]),
        profile: new Set(),
        model: new Set(),
        effort: new Set(),
        promptId: new Set(),
      }),
      1
    );
  });
});

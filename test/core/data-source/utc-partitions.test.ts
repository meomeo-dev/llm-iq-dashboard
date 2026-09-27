/** 日期窗口到数据仓 UTC 分区的映射测试 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  dayPartitionPath,
  utcDatesBetween,
} from "../../../src/core/data-source/utc-partitions";

describe("utc-partitions 日期窗口映射", () => {
  test("单日窗口精确映射到单个 UTC 日期", () => {
    const from = new Date("2026-09-27T02:00:00.000Z");
    const to = new Date("2026-09-27T08:00:00.000Z");
    assert.deepEqual(utcDatesBetween(from, to), ["2026-09-27"]);
  });

  test("跨午夜窗口正确映射到两个 UTC 日期", () => {
    const from = new Date("2026-09-26T22:00:00.000Z");
    const to = new Date("2026-09-27T04:00:00.000Z");
    assert.deepEqual(utcDatesBetween(from, to), ["2026-09-26", "2026-09-27"]);
  });

  test("半开区间边界：恰好跨至午夜时刻不算下一天", () => {
    const from = new Date("2026-09-27T00:00:00.000Z");
    const to = new Date("2026-09-28T00:00:00.000Z");
    assert.deepEqual(utcDatesBetween(from, to), ["2026-09-27"]);
  });

  test("午夜过 1 毫秒即算入下一天", () => {
    const from = new Date("2026-09-27T00:00:00.000Z");
    const to = new Date("2026-09-28T00:00:00.001Z");
    assert.deepEqual(utcDatesBetween(from, to), ["2026-09-27", "2026-09-28"]);
  });

  test("跨月与跨年多日窗口无遗漏", () => {
    const from = new Date("2026-09-29T12:00:00.000Z");
    const to = new Date("2026-10-02T12:00:00.000Z");
    assert.deepEqual(utcDatesBetween(from, to), [
      "2026-09-29",
      "2026-09-30",
      "2026-10-01",
      "2026-10-02",
    ]);
  });

  test("非法与空窗口（from >= to）返回空数组", () => {
    const d = new Date("2026-09-27T10:00:00.000Z");
    assert.deepEqual(utcDatesBetween(d, d), []);

    const later = new Date("2026-09-27T11:00:00.000Z");
    assert.deepEqual(utcDatesBetween(later, d), []);
  });

  test("dayPartitionPath 将 YYYY-MM-DD 转为 runs/YYYY/MM/DD", () => {
    assert.equal(dayPartitionPath("2026-09-27"), "runs/2026/09/27");
    assert.equal(dayPartitionPath("2025-01-05"), "runs/2025/01/05");
    assert.equal(dayPartitionPath("invalid-date"), null);
  });
});

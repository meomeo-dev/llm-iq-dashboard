import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  monthCells,
  monthOf,
  shiftMonth,
  toDayKey,
} from "@/app/components/toolbar/calendar-grid";

describe("calendar-grid 日历纯计算逻辑测试", () => {
  test("monthOf：正确解析 YYYY-MM-DD", () => {
    assert.deepEqual(monthOf("2026-09-27"), { year: 2026, month: 9 });
    assert.deepEqual(monthOf("2025-01-01"), { year: 2025, month: 1 });
  });

  test("shiftMonth：跨月跨年平移", () => {
    assert.deepEqual(shiftMonth({ year: 2026, month: 9 }, -1), { year: 2026, month: 8 });
    assert.deepEqual(shiftMonth({ year: 2026, month: 9 }, 1), { year: 2026, month: 10 });
    assert.deepEqual(shiftMonth({ year: 2026, month: 1 }, -1), { year: 2025, month: 12 });
    assert.deepEqual(shiftMonth({ year: 2025, month: 12 }, 1), { year: 2026, month: 1 });
  });

  test("toDayKey：格式化 Date 为 YYYY-MM-DD", () => {
    assert.equal(toDayKey(new Date(2026, 8, 27)), "2026-09-27");
    assert.equal(toDayKey(new Date(2026, 0, 5)), "2026-01-05");
  });

  test("monthCells：以周一开始，以 null 填充月初前空白", () => {
    // 2026-09-01 是周二，周一开始排，月初前补 1 个 null
    const cells = monthCells({ year: 2026, month: 9 });
    assert.equal(cells[0], null);
    assert.equal(cells[1], "2026-09-01");
    assert.equal(cells[cells.length - 1], "2026-09-30");
    assert.equal(cells.length, 1 + 30);
  });
});

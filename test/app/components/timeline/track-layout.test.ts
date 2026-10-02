import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { Moment } from "@/app/components/timeline/moments";
import {
  CELL_WIDTH,
  HOUR_WIDTH,
  HOUR_WIDTH_MAX,
  fitHourWidth,
  layoutColumns,
  timeX,
} from "@/app/components/timeline/track-layout";

/** 只有时刻有意义的最小 moment：钟点 HH:MM 换算成一天中的位置 */
function momentAt(clock: string): Moment {
  const [hours, minutes] = clock.split(":").map(Number);
  const fraction = (hours! * 60 + minutes!) / (24 * 60);
  return {
    runId: clock,
    startedAt: `2026-10-02T${clock}:00Z`,
    dayKey: "2026-10-02",
    fraction,
    clock,
    cards: [],
    okCount: 0,
  };
}

describe("fitHourWidth", () => {
  test("整点一轮用缺省宽度", () => {
    const moments = ["18:00", "19:00", "20:00", "21:00"].map(momentAt);
    assert.equal(fitHourWidth(moments, CELL_WIDTH), HOUR_WIDTH);
  });

  test("相邻轮次挨得近时放大到两列放得下", () => {
    const moments = ["19:38", "20:00", "20:23", "21:00"].map(momentAt);
    const hourWidth = fitHourWidth(moments, CELL_WIDTH);
    assert.ok(hourWidth > HOUR_WIDTH && hourWidth <= HOUR_WIDTH_MAX, String(hourWidth));
    const { columns } = layoutColumns(moments, CELL_WIDTH);
    for (const column of columns) assert.equal(column.x, column.exactX, column.moment.clock);
  });

  test("间隔不到 15 分钟的那一对不抬高比例，只被推开", () => {
    const moments = ["20:00", "20:05", "21:00"].map(momentAt);
    assert.equal(fitHourWidth(moments, CELL_WIDTH), HOUR_WIDTH);
    const { columns } = layoutColumns(moments, CELL_WIDTH);
    assert.ok(columns[1]!.x > columns[1]!.exactX);
    // 被推开的列顶着下一列，但位移小于一个列宽，不会层层累积
    assert.ok(columns[2]!.x - columns[2]!.exactX < CELL_WIDTH);
  });

  test("单轮或空数据用缺省宽度", () => {
    assert.equal(fitHourWidth([], CELL_WIDTH), HOUR_WIDTH);
    assert.equal(fitHourWidth([momentAt("12:00")], CELL_WIDTH), HOUR_WIDTH);
  });
});

describe("layoutColumns", () => {
  test("轨道宽度与现在线都按同一小时宽度换算", () => {
    const moments = ["19:38", "20:00"].map(momentAt);
    const { width, hourWidth } = layoutColumns(moments, CELL_WIDTH);
    assert.equal(timeX(1, hourWidth) - timeX(0, hourWidth), hourWidth * 24);
    assert.ok(width >= timeX(1, hourWidth));
  });
});

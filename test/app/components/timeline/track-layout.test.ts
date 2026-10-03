import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { Moment } from "@/app/components/timeline/moments";
import {
  CELL_WIDTH,
  HOUR_WIDTH,
  TRACK_PADDING,
  UNIFORM_SCALE,
  buildScale,
  hourX,
  layoutColumns,
  timeX,
} from "@/app/components/timeline/track-layout";

/** 只有时刻有意义的最小 moment：钟点 HH:MM 换算成一天中的位置 */
function momentAt(clock: string, runId = clock): Moment {
  const [hours, minutes] = clock.split(":").map(Number);
  const fraction = (hours! * 60 + minutes!) / (24 * 60);
  return {
    runId,
    startedAt: `2026-10-02T${clock}:00Z`,
    dayKey: "2026-10-02",
    fraction,
    clock,
    cards: [],
    okCount: 0,
  };
}

/** 浮点换算后的像素相等 */
function assertNear(actual: number, expected: number, message?: string): void {
  assert.ok(Math.abs(actual - expected) < 1e-6, `${message ?? ""} ${actual} ≠ ${expected}`.trim());
}

/** 两个时刻按缺省比例应相距的像素数 */
function naturalWidth(fromClock: string, toClock: string): number {
  return (momentAt(toClock).fraction - momentAt(fromClock).fraction) * 24 * HOUR_WIDTH;
}

describe("buildScale", () => {
  test("整点一轮时整天等比例", () => {
    const moments = ["18:00", "19:00", "20:00", "21:00"].map((clock) => momentAt(clock));
    const scale = buildScale(moments, CELL_WIDTH);
    assert.equal(scale[0]!.x, TRACK_PADDING);
    assert.equal(scale[scale.length - 1]!.x, TRACK_PADDING + HOUR_WIDTH * 24);
    for (let hour = 0; hour < 24; hour += 1) {
      assertNear(hourX(hour + 1, scale) - hourX(hour, scale), HOUR_WIDTH, `hour ${hour}`);
    }
  });

  test("挨得近的两轮只撑开它们之间的那一段，其余时段不变", () => {
    const moments = ["19:04", "19:19", "20:15", "21:15"].map((clock) => momentAt(clock));
    const scale = buildScale(moments, CELL_WIDTH);
    const at = (clock: string): number => timeX(momentAt(clock).fraction, scale);
    assert.ok(at("19:19") - at("19:04") >= CELL_WIDTH, "撑到放得下两列");
    assertNear(at("20:15") - at("19:19"), naturalWidth("19:19", "20:15"), "密集段之后仍按缺省比例");
    assertNear(at("21:15") - at("20:15"), HOUR_WIDTH);
    assertNear(hourX(19, scale) - hourX(18, scale), HOUR_WIDTH, "密集段之前的钟点不受影响");
    const { columns } = layoutColumns(moments, CELL_WIDTH);
    for (const column of columns) assert.equal(column.x, column.exactX, column.moment.clock);
  });

  test("只撑不压：相隔很久的两轮之间仍按缺省比例", () => {
    const scale = buildScale(["01:00", "23:00"].map((clock) => momentAt(clock)), CELL_WIDTH);
    assertNear(timeX(momentAt("23:00").fraction, scale) - timeX(momentAt("01:00").fraction, scale), HOUR_WIDTH * 22);
  });

  test("单轮或空数据用等比例", () => {
    assert.deepEqual(buildScale([], CELL_WIDTH), UNIFORM_SCALE);
    const single = buildScale([momentAt("12:00")], CELL_WIDTH);
    assert.equal(single[single.length - 1]!.x, TRACK_PADDING + HOUR_WIDTH * 24);
  });
});

describe("layoutColumns", () => {
  test("时间戳完全相同的轮次才被推开，标记留在原处", () => {
    const moments = [momentAt("20:00", "a"), momentAt("20:00", "b"), momentAt("21:00")];
    const { columns } = layoutColumns(moments, CELL_WIDTH);
    assert.equal(columns[0]!.x, columns[0]!.exactX);
    assert.equal(columns[1]!.exactX, columns[0]!.exactX);
    assert.ok(columns[1]!.x >= columns[0]!.x + CELL_WIDTH);
    assert.ok(columns[2]!.x - columns[2]!.exactX < CELL_WIDTH, "位移不会层层累积");
  });

  test("轨道宽度盖住 24:00 与最后一列", () => {
    const { width, scale } = layoutColumns(["19:38", "23:59"].map((clock) => momentAt(clock)), CELL_WIDTH);
    assert.ok(width >= timeX(1, scale) + CELL_WIDTH / 2);
    assert.equal(timeX(1), TRACK_PADDING + HOUR_WIDTH * 24, "缺省比例是等比例");
  });
});

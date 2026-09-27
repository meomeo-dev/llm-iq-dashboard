/**
 * 必测矩阵 #7：runId 与分日。按天载入、日历计数、过期清理都靠它。
 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { zonedDayKey } from "@/app/components/timeline/zoned-time";
import { formatRunId } from "@/core/runner";
import { runIdTime } from "@/core/store";

describe("runId", () => {
  test("formatRunId 与 runIdTime 互逆（精确到秒）", () => {
    const at = new Date("2026-09-24T14:00:07.531Z");
    const runId = formatRunId(at);
    assert.equal(runId, "20260924T140007Z");
    assert.equal(runIdTime(runId)?.toISOString(), "2026-09-24T14:00:07.000Z");
  });

  test("字典序等于时间序", () => {
    const earlier = formatRunId(new Date("2026-09-09T23:00:00Z"));
    const later = formatRunId(new Date("2026-09-10T00:00:00Z"));
    assert.ok(earlier < later);
  });

  test("非 runId 形式的目录名返回 null", () => {
    assert.equal(runIdTime("scratch"), null);
    assert.equal(runIdTime("20260924T1400Z"), null);
  });
});

describe("zonedDayKey", () => {
  test("同一时刻在不同时区落在不同日子", () => {
    const at = new Date("2026-09-24T03:00:00Z");
    assert.equal(zonedDayKey(at, "UTC"), "2026-09-24");
    assert.equal(zonedDayKey(at, "America/New_York"), "2026-09-23");
    assert.equal(zonedDayKey(at, "Asia/Shanghai"), "2026-09-24");
  });
});

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  computeNowMark,
  filterVisibleMoments,
  groupDayMoments,
} from "@/app/components/dashboard/dashboard-moments";
import type { Moment } from "@/app/components/timeline/moments";
import type { DashboardCard } from "@/core/types";
import { NO_FILTERS } from "@/app/components/toolbar/filters";

describe("dashboard-moments 看板时间线与卡片纯计算测试", () => {
  const mockCard = (cli: string, model: string): DashboardCard => ({
    judge: null,
    targetId: `${cli}__${model}__high`,
    promptId: "p1",
    cli: cli as "claude" | "agy" | "codex",
    model,
    effort: "high",
    appliedEffort: "high",
    effortHonored: true,
    label: model,
    status: "ok",
    svgFile: null,
    rawFile: null,
    startedAt: "2026-09-27T02:00:00.000Z",
    finishedAt: "2026-09-27T02:01:00.000Z",
    durationMs: 60000,
    svgBytes: null,
    error: null,
    runId: "r1",
    runStartedAt: "2026-09-27T02:00:00.000Z",
    trigger: "manual",
    runInProgress: false,
    promptText: "",
    bindings: {},
    usage: null,
    cost: {
      usd: 0.05,
      status: "priced",
      lines: [],
      note: null,
      channelId: "anthropic",
      modelId: model,
      serviceTier: "standard",
      catalogTag: null,
    },
  });

  const moment1: Moment = {
    runId: "r1",
    startedAt: "2026-09-27T03:00:00.000Z",
    dayKey: "2026-09-27",
    clock: "03:00",
    fraction: 0.125,
    okCount: 1,
    cards: [mockCard("claude", "m1")],
  };

  const moment2: Moment = {
    runId: "r2",
    startedAt: "2026-09-27T01:00:00.000Z",
    dayKey: "2026-09-27",
    clock: "01:00",
    fraction: 0.041,
    okCount: 1,
    cards: [mockCard("agy", "m2")],
  };

  const momentOtherDay: Moment = {
    runId: "r3",
    startedAt: "2026-09-26T12:00:00.000Z",
    dayKey: "2026-09-26",
    clock: "12:00",
    fraction: 0.5,
    okCount: 1,
    cards: [mockCard("codex", "m3")],
  };

  test("groupDayMoments：过滤出指定日期的 moment 并按 startedAt 升序排列", () => {
    const list = groupDayMoments([moment1, momentOtherDay, moment2], "2026-09-27");
    assert.equal(list.length, 2);
    assert.equal(list[0]?.runId, "r2"); // 01:00 优先于 03:00
    assert.equal(list[1]?.runId, "r1");
  });

  test("filterVisibleMoments：筛掉不符合条件的卡片，剔除空 moment", () => {
    const moments = [moment1, moment2];
    const visibleAll = filterVisibleMoments(moments, NO_FILTERS);
    assert.equal(visibleAll.length, 2);

    const hiddenClaude = {
      ...NO_FILTERS,
      cli: new Set(["claude"]),
    };
    const visibleAgyOnly = filterVisibleMoments(moments, hiddenClaude);
    assert.equal(visibleAgyOnly.length, 1);
    assert.equal(visibleAgyOnly[0]?.runId, "r2");
  });

  test("computeNowMark：当且仅当所选日为今天且时间与时区均就绪时返回标记", () => {
    const now = new Date("2026-09-27T12:00:00.000Z");
    const tz = "UTC";
    assert.ok(computeNowMark(now, tz, "2026-09-27", "2026-09-27") !== null);
    assert.equal(computeNowMark(null, tz, "2026-09-27", "2026-09-27"), null);
    assert.equal(computeNowMark(now, null, "2026-09-27", "2026-09-27"), null);
    assert.equal(computeNowMark(now, tz, "2026-09-26", "2026-09-27"), null);
  });
});

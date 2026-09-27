import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  resolveDashboardDayKey,
  resolveOpenCell,
  resolvePromptStandard,
  summarize,
} from "@/app/components/dashboard/dashboard-calc";
import type { DashboardCard } from "@/core/types";
import type { Moment } from "@/app/components/timeline/moments";
import type { PromptStandard } from "@/core/prompt";

describe("dashboard-calc 看板纯计算与状态解析测试", () => {
  const mockCard = (id: string, runId: string, status: "ok" | "error" = "ok", bindings: Record<string, string> = {}): DashboardCard => ({
    targetId: `claude__${id}__high`,
    promptId: id,
    cli: "claude",
    model: id,
    effort: "high",
    appliedEffort: "high",
    effortHonored: true,
    label: id,
    status,
    svgFile: null,
    rawFile: null,
    startedAt: "2026-09-27T02:00:00.000Z",
    finishedAt: "2026-09-27T02:01:00.000Z",
    durationMs: 60000,
    svgBytes: null,
    error: null,
    runId,
    runStartedAt: "2026-09-27T02:00:00.000Z",
    trigger: "manual",
    runInProgress: false,
    promptText: "",
    bindings,
    usage: null,
    cost: {
      usd: 0.05,
      status: "priced",
      lines: [],
      note: null,
      channelId: "anthropic",
      modelId: id,
      serviceTier: "standard",
      catalogTag: null,
    },
  });

  test("summarize：统计轮次数、作品数与成功率（四舍五入）", () => {
    const cards = [
      mockCard("m1", "run-1", "ok"),
      mockCard("m2", "run-1", "ok"),
      mockCard("m3", "run-2", "error"),
    ];
    const summary = summarize(cards);
    assert.deepEqual(summary, {
      runs: 2,
      works: 3,
      rate: 67, // 2 / 3 = 66.66% -> 67%
    });
  });

  test("summarize：空列表成功率为 0", () => {
    assert.deepEqual(summarize([]), { runs: 0, works: 0, rate: 0 });
  });

  test("resolveOpenCell：从可见数据中还原对应 Moment 与 Row", () => {
    const card = mockCard("pelican", "run-1", "ok", { 回目: "第一回" });
    const moment: Moment = {
      runId: "run-1",
      startedAt: "2026-09-27T02:00:00.000Z",
      dayKey: "2026-09-27",
      clock: "02:00",
      fraction: 0.1,
      okCount: 1,
      cards: [card],
    };
    const rowKey = "claude/pelican/pelican";
    const found = resolveOpenCell({ runId: "run-1", rowKey }, [moment]);
    assert.ok(found !== null);
    assert.equal(found.moment.runId, "run-1");
    assert.equal(found.row.key, rowKey);
    assert.deepEqual(found.bindings, { 回目: "第一回" });

    // 找不到时返回 null
    assert.equal(resolveOpenCell(null, [moment]), null);
    assert.equal(resolveOpenCell({ runId: "run-nonexistent", rowKey }, [moment]), null);
  });

  test("resolvePromptStandard：优先匹配带 candidate/回目的标准，后退回题目级别", () => {
    const standards: Record<string, PromptStandard> = {
      "classics::poet-libai": { coreKey: "libai", groundTruth: "gt1", evaluationCriteria: "ec1" },
      "poet-dufu": { coreKey: "dufu", groundTruth: "gt2", evaluationCriteria: "ec2" },
      "classics": { coreKey: "classics-generic", groundTruth: "gt3", evaluationCriteria: "ec3" },
    };

    // 匹配 promptId::candidate
    const res1 = resolvePromptStandard(standards, "classics", { candidate: "poet-libai" });
    assert.equal(res1?.coreKey, "libai");

    // 匹配 candidate 单独名称
    const res2 = resolvePromptStandard(standards, "other", { 回目: "poet-dufu" });
    assert.equal(res2?.coreKey, "dufu");

    // 无 bindings 时退回 promptId
    const res3 = resolvePromptStandard(standards, "classics", {});
    assert.equal(res3?.coreKey, "classics-generic");

    // 均不匹配返回 null
    const res4 = resolvePromptStandard(standards, "unknown", {});
    assert.equal(res4, null);
  });

  test("resolveDashboardDayKey：优先 pickedDay，展台模式今天无数据时默认落到最近有数据的一天", () => {
    // 显式指定 pickedDay
    assert.equal(
      resolveDashboardDayKey({
        pickedDay: "2026-09-20",
        defaultShowcaseDay: "2026-09-26",
        todayKey: "2026-09-27",
      }),
      "2026-09-20"
    );

    // 展台模式未指定 pickedDay，取 defaultShowcaseDay
    assert.equal(
      resolveDashboardDayKey({
        pickedDay: null,
        defaultShowcaseDay: "2026-09-26",
        todayKey: "2026-09-27",
      }),
      "2026-09-26"
    );

    // 常规模式未指定 pickedDay，取 todayKey
    assert.equal(
      resolveDashboardDayKey({
        pickedDay: null,
        defaultShowcaseDay: null,
        todayKey: "2026-09-27",
      }),
      "2026-09-27"
    );
  });
});

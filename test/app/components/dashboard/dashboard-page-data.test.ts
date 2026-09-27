import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  buildPromptStandards,
  cardWindow,
  readDashboardSettings,
  sortNewestFirst,
} from "@/app/components/dashboard/dashboard-page-data";
import type { DashboardCard } from "@/core/types";
import type { PromptSpec } from "@/core/prompt";

describe("dashboard-page-data 服务端页面数据加载纯逻辑测试", () => {
  test("cardWindow：未指定日期时，按传入 now 取最近 24 小时宽窗口", () => {
    const now = new Date("2026-09-27T12:00:00.000Z");
    const window = cardWindow(null, now);
    assert.equal(window.from.toISOString(), "2026-09-26T12:00:00.000Z");
    assert.equal(window.to.toISOString(), "2026-09-27T13:00:00.000Z");
  });

  test("cardWindow：指定合法 YYYY-MM-DD 时，覆盖全球时区偏移窗口", () => {
    const window = cardWindow("2026-09-27", new Date());
    // 2026-09-27T00:00:00Z 往前 14 小时为 2026-09-26T10:00:00Z
    assert.equal(window.from.toISOString(), "2026-09-26T10:00:00.000Z");
    // 2026-09-27T00:00:00Z + 24h + 12h = 2026-09-28T12:00:00Z
    assert.equal(window.to.toISOString(), "2026-09-28T12:00:00.000Z");
  });

  test("sortNewestFirst：按 startedAt 降序排列，且不污染原数组", () => {
    const c1 = { startedAt: "2026-09-27T01:00:00.000Z" } as DashboardCard;
    const c2 = { startedAt: "2026-09-27T03:00:00.000Z" } as DashboardCard;
    const c3 = { startedAt: "2026-09-27T02:00:00.000Z" } as DashboardCard;
    const original = [c1, c2, c3];
    const sorted = sortNewestFirst(original);
    assert.deepEqual(
      sorted.map((c) => c.startedAt),
      [
        "2026-09-27T03:00:00.000Z",
        "2026-09-27T02:00:00.000Z",
        "2026-09-27T01:00:00.000Z",
      ]
    );
    assert.equal(original[0], c1); // 原数组不变
  });

  test("buildPromptStandards：汇总题目及候选的多重映射标准", () => {
    const prompts = [
      {
        id: "p1",
        label: "题目一",
        standard: { coreKey: "k1", groundTruth: "gt1", evaluationCriteria: "ec1" },
        candidates: [
          {
            id: "c1",
            label: "候选一",
            standard: { coreKey: "k1-c1", groundTruth: "gt-c1", evaluationCriteria: "ec-c1" },
          },
        ],
      },
    ] as unknown as PromptSpec[];

    const map = buildPromptStandards(prompts);
    assert.equal(map["p1"]?.coreKey, "k1");
    assert.equal(map["p1::候选一"]?.coreKey, "k1-c1");
    assert.equal(map["p1::c1"]?.coreKey, "k1-c1");
    assert.equal(map["候选一"]?.coreKey, "k1-c1");
    assert.equal(map["c1"]?.coreKey, "k1-c1");
  });

  test("readDashboardSettings：能正确读取题目配置", () => {
    const settings = readDashboardSettings();
    assert.ok(Array.isArray(settings.prompts));
    assert.ok(settings.prompts.length > 0);
  });
});

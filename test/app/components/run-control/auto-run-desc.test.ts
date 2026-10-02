import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { describeSchedule, subline } from "@/app/components/run-control/auto-run-desc";
import type { AutoRunView } from "@/core/auto-run";

describe("auto-run-desc", () => {
  describe("subline", () => {
    test("state 为 null 时返回读取中", () => {
      assert.equal(subline(null, "UTC"), "读取中…");
    });

    test("未启用时返回已暂停", () => {
      const state: AutoRunView = {
        enabled: false,
        updatedAt: null,
        schedulerPid: 1234,
        schedule: { cron: "0 * * * *", intervalMinutes: null, timezone: "UTC" },
        nextRunAt: "2026-09-27T12:00:00Z",
        pendingRun: null,
      };
      assert.equal(subline(state, "UTC"), "已暂停");
    });

    test("启用但未配置节奏时返回未设节奏", () => {
      const state: AutoRunView = {
        enabled: true,
        updatedAt: null,
        schedulerPid: 1234,
        schedule: { cron: null, intervalMinutes: null, timezone: null },
        nextRunAt: null,
        pendingRun: null,
      };
      assert.equal(subline(state, "UTC"), "未设节奏");
    });

    test("调度器未运行时提示未运行", () => {
      const state: AutoRunView = {
        enabled: true,
        updatedAt: null,
        schedulerPid: null,
        schedule: { cron: "0 * * * *", intervalMinutes: null, timezone: "UTC" },
        nextRunAt: null,
        pendingRun: null,
      };
      assert.equal(subline(state, "UTC"), "调度器未运行");
    });

    test("有下一次执行时间时格式化输出时区钟点", () => {
      const state: AutoRunView = {
        enabled: true,
        updatedAt: null,
        schedulerPid: 1234,
        schedule: { cron: "0 * * * *", intervalMinutes: null, timezone: "UTC" },
        nextRunAt: "2026-09-27T12:00:00Z",
        pendingRun: null,
      };
      assert.equal(subline(state, "UTC"), "下次 12:00");
    });

    test("无下一次执行时间但有固定分钟间隔时显示每 X 分钟", () => {
      const state: AutoRunView = {
        enabled: true,
        updatedAt: null,
        schedulerPid: 1234,
        schedule: { cron: null, intervalMinutes: 30, timezone: null },
        nextRunAt: null,
        pendingRun: null,
      };
      assert.equal(subline(state, "UTC"), "每 30 分钟");
    });
  });

  describe("describeSchedule", () => {
    test("state 为 null 时返回默认标题", () => {
      assert.equal(describeSchedule(null), "自动任务");
    });

    test("未配置节奏时提示未设节奏", () => {
      const state: AutoRunView = {
        enabled: true,
        updatedAt: null,
        schedulerPid: 1234,
        schedule: { cron: null, intervalMinutes: null, timezone: null },
        nextRunAt: null,
        pendingRun: null,
      };
      assert.ok(describeSchedule(state).includes("配置里没有定时节奏"));
    });

    test("配置了 cron 与时区时包含对应描述", () => {
      const state: AutoRunView = {
        enabled: true,
        updatedAt: null,
        schedulerPid: 5678,
        schedule: { cron: "*/10 * * * *", intervalMinutes: null, timezone: "Asia/Shanghai" },
        nextRunAt: null,
        pendingRun: null,
      };
      const desc = describeSchedule(state);
      assert.ok(desc.includes("cron */10 * * * *"));
      assert.ok(desc.includes("Asia/Shanghai"));
      assert.ok(desc.includes("调度器 pid 5678"));
      assert.ok(desc.includes("运行中"));
    });

    test("暂停状态与无 pid 状态正确呈现", () => {
      const state: AutoRunView = {
        enabled: false,
        updatedAt: null,
        schedulerPid: null,
        schedule: { cron: null, intervalMinutes: 15, timezone: null },
        nextRunAt: null,
        pendingRun: null,
      };
      const desc = describeSchedule(state);
      assert.ok(desc.includes("已暂停"));
      assert.ok(desc.includes("每 15 分钟"));
      assert.ok(desc.includes("调度器未运行"));
    });
  });
});

/**
 * 运行编排与状态追踪特征测试（Run Orchestration Characterization Tests）
 *
 * 覆盖 runner.ts / run-attempt.ts / progress.ts 中即将重构的各项函数：
 * 1. createProgressTracker: 状态流转（markRunning, markDone, markCancelled, markCancelling, markBudgetStop, finish）
 * 2. formatRunId: 日期时间格式化
 * 3. buildAttempt: 属性组装与状态重载
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { createProgressTracker, type LaneProgress, type RunProgress } from "@/core/progress";
import { formatRunId } from "@/core/runner";
import { buildAttempt } from "@/core/run-attempt";
import type { Job } from "@/core/run-plan";
import type { Attempt } from "@/core/types";

test("formatRunId: 生成符合紧凑 UTC 规范的 runId", () => {
  const d = new Date("2026-09-27T08:15:30.123Z");
  const runId = formatRunId(d);
  assert.equal(runId, "20260927T081530Z");
});

test("buildAttempt: 非默认 profile 写入 profile 字段，默认 profile 不写", () => {
  const base: Job = {
    target: {
      id: "codex__m__high", cli: "codex", model: "m", effort: "high",
      label: "m", timeoutMs: 1000, extraArgs: [], enabled: true,
    },
    prompt: { promptId: "classic-v1", text: "p", bindings: {} },
    appliedEffort: "high",
    effortAdjustable: true,
  };
  const byLogin = buildAttempt(base, new Date(), { status: "ok" });
  assert.equal("profile" in byLogin, false, "默认 profile 的记录形状与引入 profile 之前相同");

  const viaProfile = buildAttempt(
    { ...base, target: { ...base.target, id: "codex__m__high__kedaya", profile: "kedaya" } },
    new Date(),
    { status: "ok" },
  );
  assert.equal(viaProfile.profile, "kedaya");
});

test("buildAttempt: 正确填充目标元数据与计算持续时间", () => {
  const job: Job = {
    target: {
      id: "claude__model-a__high",
      cli: "claude",
      model: "model-a",
      effort: "high",
      label: "Model A High",
      timeoutMs: 30000,
      extraArgs: [],
      enabled: true,
    },
    prompt: {
      promptId: "classic-v1",
      text: "Generate SVG",
      bindings: {},
    },
    appliedEffort: "high",
    effortAdjustable: true,
  };

  const startedAt = new Date(Date.now() - 500);
  const attempt = buildAttempt(job, startedAt, {
    status: "ok",
    svgFile: "test.svg",
    svgBytes: 1234,
    rawFile: "test.txt",
    effortHonored: true,
    usage: {
      tokens: { input: 100, output: 200 },
      reasoningTokens: 0,
      serviceTier: "standard",
      reportedCostUsd: null,
    },
  });

  assert.equal(attempt.targetId, "claude__model-a__high");
  assert.equal(attempt.promptId, "classic-v1");
  assert.equal(attempt.status, "ok");
  assert.equal(attempt.svgFile, "test.svg");
  assert.equal(attempt.svgBytes, 1234);
  assert.equal(attempt.rawFile, "test.txt");
  assert.ok(attempt.durationMs >= 400);
});

test("createProgressTracker: 跟踪各调用状态变化并触发写入队列", async () => {
  const written: any[] = [];
  const fakeWriter = {
    enqueue: (task: () => Promise<void>) => {
      // 捕获任务调用
      written.push(task);
    },
    drain: async () => {},
  };

  const initialLanes: LaneProgress[] = [
    {
      cli: "claude",
      model: "model-a",
      calls: [
        {
          targetId: "claude__model-a__high",
          promptId: "classic-v1",
          effort: "high",
          state: "queued",
          startedAt: null,
          timeoutMs: 30000,
          status: null,
          durationMs: null,
        },
      ],
    },
  ];

  const tracker = createProgressTracker(
    {
      runId: "20260927T081530Z",
      trigger: "manual",
      startedAt: new Date().toISOString(),
      laneLimit: 1,
      lanes: initialLanes,
    },
    fakeWriter as any,
  );

  assert.equal(written.length, 1, "初始化时应写入初始快照");

  // markRunning
  tracker.markRunning(0, 0);
  assert.equal(written.length, 2);
  assert.equal(initialLanes[0]!.calls[0]!.state, "running");
  assert.ok(initialLanes[0]!.calls[0]!.startedAt !== null);

  // markDone
  const mockAttempt: Attempt = {
    targetId: "claude__model-a__high",
    promptId: "classic-v1",
    cli: "claude",
    model: "model-a",
    effort: "high",
    appliedEffort: "high",
    effortHonored: true,
    label: "Model A",
    status: "ok",
    svgFile: "test.svg",
    rawFile: "test.txt",
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    durationMs: 1500,
    svgBytes: 500,
    error: null,
    usage: null,
  };
  tracker.markDone(0, 0, mockAttempt);
  assert.equal(written.length, 3);
  assert.equal(initialLanes[0]!.calls[0]!.state, "done");
  assert.equal(initialLanes[0]!.calls[0]!.status, "ok");
  assert.equal(initialLanes[0]!.calls[0]!.durationMs, 1500);

  // markCancelling & markBudgetStop
  tracker.markCancelling("2026-09-27T08:16:00Z");
  tracker.markBudgetStop("Budget exceeded");

  // finish
  await tracker.finish();
});

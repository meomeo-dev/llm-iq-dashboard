/**
 * 同步流水线与导出函数的特征测试 (Characterization Tests)
 * 在重构前锁定无改动代码的输入输出行为。
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeLegacyRun, withoutUnpublishablePrompts } from "@/core/sync/export-run";
import { buildRunSummary } from "@/core/sync/data-repo-index";
import { sanitizeErrorReason } from "@/core/data-source/remote";
import type { PublicRunRecord } from "@/core/data-repo/contract";
import type { RunRecord } from "@/core/types";

describe("特征测试：export-run 纯逻辑规范化与过滤", () => {
  it("normalizeLegacyRun: 补全旧版缺失字段，保持默认 classic-v1 与 appliedEffort 映射", () => {
    const rawLegacy = {
      runId: "20260927T021708Z",
      promptId: "my-custom-prompt",
      promptText: "draw something",
      startedAt: "2026-09-27T02:17:08.000Z",
      finishedAt: "2026-09-27T02:18:00.000Z",
      durationMs: 52000,
      trigger: "manual" as const,
      attempts: [
        {
          targetId: "claude__m__high",
          cli: "claude" as const,
          model: "m",
          effort: "high" as const,
          label: "M",
          status: "ok" as const,
          svgFile: "test.svg",
          rawFile: null,
          startedAt: "2026-09-27T02:17:09.000Z",
          finishedAt: "2026-09-27T02:17:40.000Z",
          durationMs: 31000,
          svgBytes: 123,
          error: null,
          usage: null,
        },
      ],
    };

    const normalized = normalizeLegacyRun(rawLegacy);
    assert.equal(normalized.inProgress, false);
    assert.equal(normalized.prompts.length, 1);
    assert.equal(normalized.prompts[0]?.promptId, "my-custom-prompt");
    assert.equal(normalized.prompts[0]?.text, "draw something");
    assert.equal(normalized.attempts[0]?.promptId, "my-custom-prompt");
    assert.equal(normalized.attempts[0]?.appliedEffort, "high");
    assert.equal(normalized.attempts[0]?.effortHonored, true);
  });

  it("withoutUnpublishablePrompts: 若只包含 leijun-v1 则返回 null（整轮剔除）", () => {
    const run: RunRecord = {
      runId: "20260927T021708Z",
      prompts: [{ promptId: "leijun-v1", text: "leijun bike", bindings: {} }],
      startedAt: "2026-09-27T02:17:08.000Z",
      finishedAt: "2026-09-27T02:18:00.000Z",
      durationMs: 52000,
      trigger: "manual",
      inProgress: false,
      attempts: [
        {
          targetId: "claude__m__low",
          promptId: "leijun-v1",
          cli: "claude",
          model: "m",
          effort: "low",
          appliedEffort: "low",
          effortHonored: true,
          label: "M",
          status: "ok",
          svgFile: null,
          rawFile: null,
          startedAt: "2026-09-27T02:17:09.000Z",
          finishedAt: "2026-09-27T02:17:40.000Z",
          durationMs: 31000,
          svgBytes: null,
          error: null,
          usage: null,
        },
      ],
    };

    const res = withoutUnpublishablePrompts(run);
    assert.equal(res, null);
  });

  it("withoutUnpublishablePrompts: 混合题目时只保留允许发布的题目与对应 attempt", () => {
    const run: RunRecord = {
      runId: "20260927T021708Z",
      prompts: [
        { promptId: "classic-v1", text: "classic", bindings: {} },
        { promptId: "leijun-v1", text: "leijun", bindings: {} },
      ],
      startedAt: "2026-09-27T02:17:08.000Z",
      finishedAt: "2026-09-27T02:18:00.000Z",
      durationMs: 52000,
      trigger: "manual",
      inProgress: false,
      attempts: [
        {
          targetId: "t1",
          promptId: "classic-v1",
          cli: "claude",
          model: "m",
          effort: "low",
          appliedEffort: "low",
          effortHonored: true,
          label: "T1",
          status: "ok",
          svgFile: null,
          rawFile: null,
          startedAt: "2026-09-27T02:17:09.000Z",
          finishedAt: "2026-09-27T02:17:40.000Z",
          durationMs: 31000,
          svgBytes: null,
          error: null,
          usage: null,
        },
        {
          targetId: "t2",
          promptId: "leijun-v1",
          cli: "claude",
          model: "m",
          effort: "low",
          appliedEffort: "low",
          effortHonored: true,
          label: "T2",
          status: "ok",
          svgFile: null,
          rawFile: null,
          startedAt: "2026-09-27T02:17:09.000Z",
          finishedAt: "2026-09-27T02:17:40.000Z",
          durationMs: 31000,
          svgBytes: null,
          error: null,
          usage: null,
        },
      ],
    };

    const res = withoutUnpublishablePrompts(run);
    assert.ok(res !== null);
    assert.equal(res.prompts.length, 1);
    assert.equal(res.prompts[0]?.promptId, "classic-v1");
    assert.equal(res.attempts.length, 1);
    assert.equal(res.attempts[0]?.promptId, "classic-v1");
  });
});

describe("特征测试：data-repo-index 关键摘要提取", () => {
  it("buildRunSummary 非法 runId 抛出明确异常", () => {
    const invalidRecord: PublicRunRecord = {
      publicSchemaVersion: 1,
      runId: "invalid-not-iso",
      prompts: [{ promptId: "p1", text: "t", bindings: {} }],
      startedAt: "2026-09-27T02:17:08.000Z",
      finishedAt: "2026-09-27T02:18:00.000Z",
      durationMs: 52000,
      trigger: "schedule",
      inProgress: false,
      attempts: [],
      redactions: [],
    };

    assert.throws(
      () => buildRunSummary(invalidRecord),
      /非法的 runId，无法计算分区路径/,
    );
  });
});

describe("特征测试：remote 数据源错误信息脱敏", () => {
  it("sanitizeErrorReason: 过滤 macOS / Linux / Windows 绝对路径", () => {
    assert.equal(
      sanitizeErrorReason(new Error("ENOENT: /Users/alice/projects/data.json not found")),
      "ENOENT: [REDACTED_PATH] not found",
    );
    assert.equal(
      sanitizeErrorReason(new Error("Error at /home/bob/secret.txt")),
      "Error at [REDACTED_PATH]",
    );
    assert.equal(
      sanitizeErrorReason(new Error("Cannot read C:\\Users\\Administrator\\data.json")),
      "Cannot read [REDACTED_PATH]",
    );
    assert.equal(
      sanitizeErrorReason("Just a normal error message"),
      "Just a normal error message",
    );
    assert.equal(sanitizeErrorReason(""), "未知错误");
  });
});

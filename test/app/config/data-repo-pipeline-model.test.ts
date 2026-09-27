import test from "node:test";
import assert from "node:assert/strict";
import type {
  DataRepoStatus,
  SyncActionResult,
} from "@/core/sync/data-repo-panel-types";
import type { SyncReport } from "@/core/sync/sync-orchestrator";
import type { ConfirmPublishedReport } from "@/core/sync/confirm-published";
import {
  derivePipeline,
  type PipelineModel,
} from "@/app/config/data-repo-pipeline-model";
import { deriveActionResultSummary } from "@/app/config/data-repo-panel-model";

function createBaseStatus(): DataRepoStatus {
  return {
    configured: true,
    deploy: { readonly: false, externalRunner: false },
    repo: {
      path: "../llm-iq-data",
      reachable: true,
      isGitRepo: true,
      clean: true,
      branch: "main",
      upstream: "origin/main",
      ahead: 0,
      behind: 0,
      aheadCommits: [],
    },
    manifest: {
      totalRuns: 50,
      updatedAt: "2026-09-27T08:00:00Z",
      latestDay: "2026-09-27",
    },
    ledger: {
      exported: 0,
      published: 50,
      lastExportedAt: "2026-09-27T08:00:00Z",
      lastPublishedAt: "2026-09-26T08:00:00Z",
    },
    local: {
      totalRuns: 50,
      pending: [],
      incomplete: 0,
    },
    lastAction: null,
    notice: null,
    github: {
      state: "connected",
      login: "meomeo-dev",
      appSlug: "llm-iq-data-sync",
      appSettingsUrl: null,
    },
    pushCapability: "host-credentials",
  };
}

test("derivePipeline - 四种流水线状态推导", async (t) => {
  await t.test("状态 1：有待导出本地轮次 (local pending)", () => {
    const status: DataRepoStatus = {
      ...createBaseStatus(),
      local: {
        totalRuns: 52,
        pending: ["20260927T080000Z", "20260927T070000Z"],
        incomplete: 0,
      },
    };
    const pipeline: PipelineModel = derivePipeline(status);

    assert.strictEqual(pipeline.currentStage, "local");
    assert.strictEqual(pipeline.steps[0]?.status, "current");
    assert.strictEqual(pipeline.steps[1]?.status, "pending");
    assert.strictEqual(pipeline.steps[2]?.status, "pending");
    assert.strictEqual(pipeline.steps[0]?.countText, "待导出 2 轮");
    assert.strictEqual(
      pipeline.description,
      "有 2 轮本地结果尚未导出到数据仓",
    );
    assert.ok(pipeline.primaryAction);
    assert.strictEqual(pipeline.primaryAction.mode, "export");
    assert.strictEqual(pipeline.primaryAction.label, "导出 2 轮");
    assert.strictEqual(pipeline.primaryAction.enabled, true);
    assert.strictEqual(pipeline.primaryAction.disabledReason, null);
    assert.strictEqual(pipeline.secondaryAction.mode, "dry-run");
    assert.strictEqual(pipeline.secondaryAction.label, "预演（不写入）");
    assert.strictEqual(pipeline.secondaryAction.enabled, true);
  });

  await t.test("状态 2：有本地提交待推送 (repo ahead)", () => {
    const status: DataRepoStatus = {
      ...createBaseStatus(),
      repo: {
        ...createBaseStatus().repo!,
        ahead: 3,
        aheadCommits: ["c1", "c2", "c3"],
      },
      ledger: {
        ...createBaseStatus().ledger,
        exported: 2,
      },
    };
    const pipeline = derivePipeline(status);

    assert.strictEqual(pipeline.currentStage, "exported");
    assert.strictEqual(pipeline.steps[0]?.status, "completed");
    assert.strictEqual(pipeline.steps[1]?.status, "current");
    assert.strictEqual(pipeline.steps[2]?.status, "pending");
    assert.strictEqual(pipeline.steps[1]?.countText, "待推送 3 个提交（含 2 轮）");
    assert.strictEqual(
      pipeline.description,
      "3 个本地提交等待推送到 GitHub（含 2 轮）",
    );
    assert.ok(pipeline.primaryAction);
    assert.strictEqual(pipeline.primaryAction.mode, "push");
    assert.strictEqual(pipeline.primaryAction.label, "推送发布");
    assert.strictEqual(pipeline.primaryAction.enabled, true);
    assert.strictEqual(pipeline.primaryAction.disabledReason, null);
  });

  await t.test("状态 3：远端已包含但未登记为已发布 (ledger exported > 0)", () => {
    const status: DataRepoStatus = {
      ...createBaseStatus(),
      ledger: {
        ...createBaseStatus().ledger,
        exported: 4,
      },
    };
    const pipeline = derivePipeline(status);

    assert.strictEqual(pipeline.currentStage, "published");
    assert.strictEqual(pipeline.steps[0]?.status, "completed");
    assert.strictEqual(pipeline.steps[1]?.status, "completed");
    assert.strictEqual(pipeline.steps[2]?.status, "current");
    assert.strictEqual(pipeline.steps[2]?.countText, "已发布 50 轮");
    assert.strictEqual(
      pipeline.description,
      "4 轮已在远端，尚未登记为已发布",
    );
    assert.ok(pipeline.primaryAction);
    assert.strictEqual(pipeline.primaryAction.mode, "confirm");
    assert.strictEqual(pipeline.primaryAction.label, "确认发布");
    assert.strictEqual(pipeline.primaryAction.enabled, true);
    assert.strictEqual(pipeline.primaryAction.disabledReason, null);
  });

  await t.test("状态 4：全部轮次已发布且本地远端一致 (all published)", () => {
    const status = createBaseStatus();
    const pipeline = derivePipeline(status);

    assert.strictEqual(pipeline.currentStage, "all-published");
    assert.strictEqual(pipeline.steps[0]?.status, "completed");
    assert.strictEqual(pipeline.steps[1]?.status, "completed");
    assert.strictEqual(pipeline.steps[2]?.status, "completed");
    assert.strictEqual(
      pipeline.description,
      "全部 50 轮已发布，本地与远端一致",
    );
    assert.strictEqual(pipeline.primaryAction, null);
    assert.strictEqual(pipeline.secondaryAction.enabled, true);
  });
});

test("derivePipeline - 推送不可用的三种原因", async (t) => {
  await t.test("原因 1：分容器部署下未连接 GitHub", () => {
    const status: DataRepoStatus = {
      ...createBaseStatus(),
      deploy: { readonly: false, externalRunner: true },
      repo: {
        ...createBaseStatus().repo!,
        ahead: 1,
        aheadCommits: ["c1"],
      },
      pushCapability: "unavailable",
      github: {
        state: "disconnected",
        login: null,
        appSlug: null,
        appSettingsUrl: null,
      },
    };
    const pipeline = derivePipeline(status);

    assert.ok(pipeline.primaryAction);
    assert.strictEqual(pipeline.primaryAction.mode, "push");
    assert.strictEqual(pipeline.primaryAction.enabled, false);
    assert.match(pipeline.primaryAction.disabledReason ?? "", /执行器未连接 GitHub/);
    assert.strictEqual(pipeline.primaryAction.disabledLink, "#data-repo");
    assert.strictEqual(
      pipeline.staticNotice,
      "轮次结束后自动导出；推送需你在此确认。",
    );
  });

  await t.test("原因 2：工作区不干净 (dirty repo)", () => {
    const status: DataRepoStatus = {
      ...createBaseStatus(),
      repo: {
        ...createBaseStatus().repo!,
        clean: false,
        ahead: 1,
        aheadCommits: ["c1"],
      },
    };
    const pipeline = derivePipeline(status);

    assert.ok(pipeline.primaryAction);
    assert.strictEqual(pipeline.primaryAction.mode, "push");
    assert.strictEqual(pipeline.primaryAction.enabled, false);
    assert.strictEqual(
      pipeline.primaryAction.disabledReason,
      "工作区有未提交的改动，请先清理或提交",
    );
    assert.strictEqual(pipeline.primaryAction.disabledLink, null);
  });

  await t.test("原因 3：落后上游分支 (behind upstream)", () => {
    const status: DataRepoStatus = {
      ...createBaseStatus(),
      repo: {
        ...createBaseStatus().repo!,
        behind: 2,
        ahead: 1,
        aheadCommits: ["c1"],
      },
    };
    const pipeline = derivePipeline(status);

    assert.ok(pipeline.primaryAction);
    assert.strictEqual(pipeline.primaryAction.mode, "push");
    assert.strictEqual(pipeline.primaryAction.enabled, false);
    assert.strictEqual(
      pipeline.primaryAction.disabledReason,
      "落后上游分支 2 个提交，建议先拉取同步",
    );
  });
});

test("derivePipeline - 执行中状态响应", async (t) => {
  await t.test("导出执行中时主按钮显示动效且全操作锁定", () => {
    const status: DataRepoStatus = {
      ...createBaseStatus(),
      local: {
        totalRuns: 51,
        pending: ["20260927T080000Z"],
        incomplete: 0,
      },
    };
    const pipeline = derivePipeline(status, "export");

    assert.ok(pipeline.primaryAction);
    assert.strictEqual(pipeline.primaryAction.mode, "export");
    assert.strictEqual(pipeline.primaryAction.enabled, false);
    assert.strictEqual(pipeline.primaryAction.label, "正在导出提交…");
    assert.match(pipeline.primaryAction.disabledReason ?? "", /正在执行导出提交/);
    assert.strictEqual(pipeline.secondaryAction.enabled, false);
  });

  await t.test("预演执行中时次要按钮显示动效且主操作禁用", () => {
    const status: DataRepoStatus = {
      ...createBaseStatus(),
      repo: {
        ...createBaseStatus().repo!,
        ahead: 1,
        aheadCommits: ["c1"],
      },
    };
    const pipeline = derivePipeline(status, "dry-run");

    assert.ok(pipeline.primaryAction);
    assert.strictEqual(pipeline.primaryAction.enabled, false);
    assert.strictEqual(pipeline.secondaryAction.label, "正在预演…");
    assert.strictEqual(pipeline.secondaryAction.enabled, false);
  });
});

test("ActionResultSummary - 分组文案与各模式格式", async (t) => {
  await t.test("预演分组显示跳过原因", () => {
    const dryRunReport: SyncReport = {
      success: true,
      dryRun: true,
      totalCandidates: 15,
      exported: [],
      skipped: [
        ...Array.from({ length: 13 }, (_, i) => ({
          runId: `run-idem-${i}`,
          reason: "idempotent",
        })),
        { runId: "run-inc-1", reason: "incomplete" },
        { runId: "run-inc-2", reason: "incomplete" },
      ],
      conflicts: [],
      rejected: [],
      redactions: [],
      ledgerTransitions: { exported: [], published: [] },
      commit: null,
      pushed: false,
    };
    const result: SyncActionResult = {
      mode: "dry-run",
      startedAt: "2026-09-27T08:00:00Z",
      finishedAt: "2026-09-27T08:00:01Z",
      ok: true,
      report: dryRunReport,
      executedBy: "web",
      error: null,
    };
    const summary = deriveActionResultSummary(result);
    assert.ok(summary);
    assert.strictEqual(
      summary.text,
      "预演：可导出 0 轮；跳过 15 轮（已导出 13、未完成 2）",
    );
  });

  await t.test("push 模式显示登记发布轮次数", () => {
    const pushReport = {
      success: true,
      dryRun: false,
      totalCandidates: 3,
      exported: [],
      skipped: [],
      conflicts: [],
      rejected: [],
      redactions: [],
      ledgerTransitions: { exported: [], published: ["run-1", "run-2", "run-3"] },
      commit: "commit-sha",
      pushed: true,
    };
    const result: SyncActionResult = {
      mode: "push",
      startedAt: "2026-09-27T08:00:00Z",
      finishedAt: "2026-09-27T08:00:02Z",
      ok: true,
      report: pushReport as unknown as SyncReport,
      executedBy: "web",
      error: null,
    };
    const summary = deriveActionResultSummary(result);
    assert.ok(summary);
    assert.strictEqual(summary.text, "已推送，3 轮登记为已发布");
  });

  await t.test("confirm 模式有轮次确认与无轮次确认", () => {
    const reportWithRuns: ConfirmPublishedReport = {
      success: true,
      dryRun: false,
      upstream: "origin/main",
      confirmed: ["run-1", "run-2"],
      ledgerTransitions: { published: ["run-1", "run-2"] },
    };
    const result1: SyncActionResult = {
      mode: "confirm",
      startedAt: "2026-09-27T08:00:00Z",
      finishedAt: "2026-09-27T08:00:01Z",
      ok: true,
      report: reportWithRuns,
      executedBy: "web",
      error: null,
    };
    assert.strictEqual(
      deriveActionResultSummary(result1)?.text,
      "远端已包含 2 轮，登记为已发布",
    );

    const reportEmpty: ConfirmPublishedReport = {
      success: true,
      dryRun: false,
      upstream: "origin/main",
      confirmed: [],
      ledgerTransitions: { published: [] },
    };
    const result2: SyncActionResult = {
      ...result1,
      report: reportEmpty,
    };
    assert.strictEqual(
      deriveActionResultSummary(result2)?.text,
      "远端尚未包含任何待确认轮次",
    );
  });
});

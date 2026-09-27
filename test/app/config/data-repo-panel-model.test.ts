import test from "node:test";
import assert from "node:assert/strict";
import type {
  DataRepoStatus,
  SyncActionResult,
} from "@/core/sync/data-repo-panel-types";
import type { SyncReport } from "@/core/sync/sync-orchestrator";
import type { ConfirmPublishedReport } from "@/core/sync/confirm-published";
import {
  deriveActionStates,
  deriveActionResultSummary,
  deriveCountsSummary,
  deriveHealthStatus,
  derivePushConfirmation,
  extractReportIssues,
} from "@/app/config/data-repo-panel-model";

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
      ahead: 2,
      behind: 0,
      aheadCommits: ["a1b2c3d", "e4f5g6h"],
    },
    manifest: {
      totalRuns: 50,
      updatedAt: "2026-09-27T08:00:00Z",
      latestDay: "2026-09-27",
    },
    ledger: {
      exported: 2,
      published: 50,
      lastExportedAt: "2026-09-27T08:00:00Z",
      lastPublishedAt: "2026-09-26T08:00:00Z",
    },
    local: {
      totalRuns: 55,
      pending: ["20260927T080000Z"],
      incomplete: 0,
    },
    lastAction: null,
    notice: null,
  };
}

test("deriveHealthStatus - 健康等级推导", async (t) => {
  await t.test("正常状态", () => {
    const status = createBaseStatus();
    const health = deriveHealthStatus(status);
    assert.strictEqual(health.level, "healthy");
    assert.strictEqual(health.label, "正常");
    assert.match(health.reason, /健康/);
  });

  await t.test("未配置数据仓时为不可用", () => {
    const status = { ...createBaseStatus(), configured: false };
    const health = deriveHealthStatus(status);
    assert.strictEqual(health.level, "unavailable");
    assert.strictEqual(health.label, "不可用");
    assert.match(health.reason, /未配置数据仓/);
  });

  await t.test("只读部署时为不可用", () => {
    const status = createBaseStatus();
    status.deploy.readonly = true;
    const health = deriveHealthStatus(status);
    assert.strictEqual(health.level, "unavailable");
    assert.match(health.reason, /只读部署/);
  });

  await t.test("数据仓副本不可达或不是 Git 仓库时为不可用", () => {
    const statusNull = { ...createBaseStatus(), repo: null };
    assert.strictEqual(deriveHealthStatus(statusNull).level, "unavailable");

    const statusUnreachable = createBaseStatus();
    statusUnreachable.repo!.reachable = false;
    assert.strictEqual(deriveHealthStatus(statusUnreachable).level, "unavailable");

    const statusNotGit = createBaseStatus();
    statusNotGit.repo!.isGitRepo = false;
    assert.strictEqual(deriveHealthStatus(statusNotGit).level, "unavailable");
  });

  await t.test("工作区不干净或落后上游时为注意", () => {
    const statusDirty = createBaseStatus();
    statusDirty.repo!.clean = false;
    const dirtyHealth = deriveHealthStatus(statusDirty);
    assert.strictEqual(dirtyHealth.level, "warning");
    assert.match(dirtyHealth.reason, /未提交/);

    const statusBehind = createBaseStatus();
    statusBehind.repo!.behind = 3;
    const behindHealth = deriveHealthStatus(statusBehind);
    assert.strictEqual(behindHealth.level, "warning");
    assert.match(behindHealth.reason, /落后上游/);
  });

  await t.test("无上游或有 notice 或未完成轮次时为注意", () => {
    const statusNoUpstream = createBaseStatus();
    statusNoUpstream.repo!.upstream = null;
    assert.strictEqual(deriveHealthStatus(statusNoUpstream).level, "warning");

    const statusNotice = createBaseStatus();
    statusNotice.notice = "网络波动警告";
    assert.strictEqual(deriveHealthStatus(statusNotice).level, "warning");

    // 未完成的轮次不再算告警：执行中提示等待，中断的提示会被自动清理
    const statusRunning = createBaseStatus();
    statusRunning.local.incomplete = 1;
    statusRunning.local.running = 1;
    const running = deriveHealthStatus(statusRunning);
    assert.strictEqual(running.level, "healthy");
    assert.strictEqual(running.reason, "1 轮正在执行，结束后自动导出");

    const statusInterrupted = createBaseStatus();
    statusInterrupted.local.incomplete = 2;
    statusInterrupted.local.interrupted = 2;
    const interrupted = deriveHealthStatus(statusInterrupted);
    assert.strictEqual(interrupted.level, "healthy");
    assert.match(interrupted.reason, /2 轮中断未完成/);
    assert.match(deriveCountsSummary(statusInterrupted).localText, /中断 2 轮/);
  });
});

test("deriveActionStates - 动作可用状态与禁用原因", async (t) => {
  await t.test("有动作在执行时锁定全部动作", () => {
    const status = createBaseStatus();
    const states = deriveActionStates(status, "export");
    for (const key of ["dry-run", "export", "confirm", "push"] as const) {
      assert.strictEqual(states[key].enabled, false);
      assert.match(states[key].disabledReason ?? "", /正在执行导出提交/);
    }
  });

  await t.test("未配置或只读部署时全部禁用", () => {
    const unconfStates = deriveActionStates({ ...createBaseStatus(), configured: false });
    assert.strictEqual(unconfStates.export.enabled, false);
    assert.match(unconfStates.export.disabledReason ?? "", /未配置/);

    const readonlyStatus = createBaseStatus();
    readonlyStatus.deploy.readonly = true;
    const readonlyStates = deriveActionStates(readonlyStatus);
    assert.strictEqual(readonlyStates.export.enabled, false);
    assert.match(readonlyStates.export.disabledReason ?? "", /只读/);
  });

  await t.test("没有 pending 时导出仍可用但提示无新轮次", () => {
    const status = createBaseStatus();
    status.local.pending = [];
    const states = deriveActionStates(status);
    assert.strictEqual(states.export.enabled, true);
    assert.strictEqual(states.export.hint, "无新轮次");
    assert.strictEqual(states["dry-run"].enabled, true);
    assert.strictEqual(states["dry-run"].hint, "无待同步轮次");
  });

  await t.test("工作区不干净时导出和推送被禁用", () => {
    const status = createBaseStatus();
    status.repo!.clean = false;
    const states = deriveActionStates(status);
    assert.strictEqual(states.export.enabled, false);
    assert.strictEqual(states.push.enabled, false);
    assert.match(states.export.disabledReason ?? "", /未提交/);
  });

  await t.test("externalRunner 下推送禁用且原因明确", () => {
    const status = createBaseStatus();
    status.deploy.externalRunner = true;
    const states = deriveActionStates(status);
    assert.strictEqual(states.push.enabled, false);
    assert.match(states.push.disabledReason ?? "", /未连接 GitHub|容器内无推送凭据/);
  });

  await t.test("没有领先提交时推送禁用", () => {
    const status = createBaseStatus();
    status.repo!.ahead = 0;
    status.repo!.aheadCommits = [];
    const states = deriveActionStates(status);
    assert.strictEqual(states.push.enabled, false);
    assert.match(states.push.disabledReason ?? "", /没有领先/);
  });

  await t.test("正常具备领先提交时推送可用", () => {
    const status = createBaseStatus();
    const states = deriveActionStates(status);
    assert.strictEqual(states.push.enabled, true);
    assert.strictEqual(states.push.disabledReason, null);
  });
});

test("derivePushConfirmation - 推送二次确认模型", async (t) => {
  await t.test("正常展示领先提交与待发布轮次数", () => {
    const status = createBaseStatus();
    const conf = derivePushConfirmation(status);
    assert.deepStrictEqual(conf.aheadCommits, ["a1b2c3d", "e4f5g6h"]);
    assert.strictEqual(conf.pendingPublishCount, 2);
    assert.strictEqual(conf.canConfirm, true);
    assert.strictEqual(conf.disabledReason, null);
  });

  await t.test("externalRunner 且未连接 GitHub 时无法确认并提示先连接", () => {
    const status = createBaseStatus();
    status.deploy.externalRunner = true;
    status.pushCapability = "unavailable";
    const conf = derivePushConfirmation(status);
    assert.strictEqual(conf.canConfirm, false);
    assert.match(conf.disabledReason ?? "", /未连接 GitHub/);
  });

  await t.test("externalRunner 且执行器已连接 GitHub（github-app）时可确认", () => {
    const status = createBaseStatus();
    status.deploy.externalRunner = true;
    status.pushCapability = "github-app";
    const conf = derivePushConfirmation(status);
    assert.strictEqual(conf.canConfirm, true);
    assert.strictEqual(conf.disabledReason, null);
  });

  await t.test("无领先提交时无法确认", () => {
    const status = createBaseStatus();
    status.repo!.aheadCommits = [];
    const conf = derivePushConfirmation(status);
    assert.strictEqual(conf.canConfirm, false);
    assert.match(conf.disabledReason ?? "", /没有领先/);
  });
});

test("deriveActionResultSummary - 动作结果摘要与失败覆盖", async (t) => {
  await t.test("失败动作显示错误原因", () => {
    const failedResult: SyncActionResult = {
      mode: "export",
      startedAt: "2026-09-27T08:00:00Z",
      finishedAt: "2026-09-27T08:00:01Z",
      ok: false,
      report: null,
      executedBy: "web",
      error: "工作区有未跟踪文件",
    };
    const summary = deriveActionResultSummary(failedResult);
    assert.ok(summary);
    assert.strictEqual(summary.ok, false);
    assert.match(summary.text, /执行失败：工作区有未跟踪文件/);
    assert.strictEqual(summary.error, "工作区有未跟踪文件");
  });

  await t.test("confirm 模式显示已发布轮次", () => {
    const confirmReport: ConfirmPublishedReport = {
      success: true,
      dryRun: false,
      upstream: "origin/main",
      confirmed: ["run-1", "run-2"],
      ledgerTransitions: { published: ["run-1", "run-2"] },
    };
    const result: SyncActionResult = {
      mode: "confirm",
      startedAt: "2026-09-27T08:00:00Z",
      finishedAt: "2026-09-27T08:00:01Z",
      ok: true,
      report: confirmReport,
      executedBy: "web",
      error: null,
    };
    const summary = deriveActionResultSummary(result);
    assert.ok(summary);
    assert.strictEqual(summary.ok, true);
    assert.strictEqual(summary.publishedCount, 2);
    assert.match(summary.text, /已发布 2 轮/);
  });

  await t.test("export 模式显示导出、跳过、拒绝、脱敏、发布统计", () => {
    const syncReport: SyncReport = {
      success: true,
      dryRun: false,
      totalCandidates: 3,
      exported: ["run-1"],
      skipped: [{ runId: "run-2", reason: "内容无变化" }],
      conflicts: [],
      rejected: [
        {
          runId: "run-3",
          reasons: [{ file: "out.svg", reason: "local-path 泄漏" }],
        },
      ],
      redactions: [
        {
          runId: "run-1",
          redactions: [{ file: "raw.svg", reason: "secret-pattern 命中" }],
        },
      ],
      ledgerTransitions: { exported: ["run-1"], published: [] },
      commit: "commit123",
      pushed: false,
    };
    const result: SyncActionResult = {
      mode: "export",
      startedAt: "2026-09-27T08:00:00Z",
      finishedAt: "2026-09-27T08:00:01Z",
      ok: true,
      report: syncReport,
      executedBy: "web",
      error: null,
    };
    const summary = deriveActionResultSummary(result);
    assert.ok(summary);
    assert.strictEqual(summary.exportedCount, 1);
    assert.strictEqual(summary.skippedCount, 1);
    assert.strictEqual(summary.rejectedCount, 1);
    assert.strictEqual(summary.redactedCount, 1);
    assert.strictEqual(summary.publishedCount, 0);
    assert.strictEqual(
      summary.text,
      "导出 1 轮、跳过 1 轮、拒绝 1 轮、脱敏 1 处、已发布 0 轮",
    );

    const issues = extractReportIssues(syncReport);
    assert.strictEqual(issues.rejected.length, 1);
    assert.strictEqual(issues.rejected[0]?.runId, "run-3");
    assert.strictEqual(issues.rejected[0]?.file, "out.svg");
    assert.strictEqual(issues.skipped.length, 1);
    assert.strictEqual(issues.skipped[0]?.runId, "run-2");
  });
});

test("deriveCountsSummary - 计数文案汇总", () => {
  const status = createBaseStatus();
  const summary = deriveCountsSummary(status);
  assert.match(summary.localText, /总计 55 轮，待导出 1 轮/);
  assert.match(summary.ledgerText, /待发布 2 轮，已发布 50 轮/);
  assert.match(summary.manifestText, /总计 50 轮/);
  assert.match(summary.repoText, /分支 main/);
});

test("deriveActionResultSummary - 执行器推送结果（ConfirmPublishedReport 结构）不抛错并显示登记轮次", () => {
  const summary = deriveActionResultSummary({
    mode: "push",
    startedAt: "2026-09-27T17:14:52.345Z",
    finishedAt: "2026-09-27T17:14:55.239Z",
    ok: true,
    report: {
      success: true,
      dryRun: false,
      upstream: "origin/main",
      confirmed: ["20260927T161740Z"],
      ledgerTransitions: { published: ["20260927T161740Z"] },
    } as never,
    executedBy: "runner",
    error: null,
  });
  assert.ok(summary);
  assert.equal(summary.ok, true);
  assert.equal(summary.publishedCount, 1);
  assert.match(summary.text, /已推送，1 轮登记为已发布/);
});

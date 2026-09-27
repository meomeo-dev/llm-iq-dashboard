import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import React from "react";
(globalThis as unknown as { React: typeof React }).React = React;
import ReactDOMServer from "react-dom/server";
import { DataRepoPipeline } from "@/app/config/DataRepoPipeline";
import type { DataRepoStatus, SyncActionMode } from "@/core/sync/data-repo-panel-types";

const FIXTURES_DIR = path.resolve(__dirname, "../../fixtures/markup/wp-p");

/** UPDATE_MARKUP_FIXTURES=1 时把当前标记写回夹具，否则与夹具逐字比对 */
function assertFixture(html: string, filename: string): void {
  const filePath = path.join(FIXTURES_DIR, filename);
  if (process.env.UPDATE_MARKUP_FIXTURES === "1") {
    fs.mkdirSync(FIXTURES_DIR, { recursive: true });
    fs.writeFileSync(filePath, html, "utf-8");
    return;
  }
  assert.strictEqual(html, fs.readFileSync(filePath, "utf-8"));
}

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
    manifest: { totalRuns: 50, updatedAt: "2026-09-27T08:00:00Z", latestDay: "2026-09-27" },
    ledger: {
      exported: 0,
      published: 50,
      skipped: 0,
      skippedByReason: { "unpublishable-prompt": 0, rejected: 0, abandoned: 0 },
      lastExportedAt: "2026-09-27T07:00:00Z",
      lastPublishedAt: "2026-09-27T07:30:00Z",
    },
    local: { totalRuns: 50, pending: [], incomplete: 0, rejected: [] },
    pushCapability: "host-credentials",
    lastAction: null,
    notice: null,
  };
}

function render(status: DataRepoStatus, inFlightMode: SyncActionMode | null = null): string {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(DataRepoPipeline, {
      status,
      inFlightMode,
      onTriggerAction: () => undefined,
      onOpenPushDialog: () => undefined,
      onRefresh: () => undefined,
    }),
  );
}

test("DataRepoPipeline 静态标记：各阶段的步骤条与主按钮", async (t) => {
  await t.test("待导出：主按钮为导出 N 轮", () => {
    const status = createBaseStatus();
    status.local.pending = ["20260927T090000Z", "20260927T100000Z"];
    const html = render(status);
    assert.match(html, /导出 2 轮/);
    assert.match(html, /data-repo-pipeline-btn-export/);
    assertFixture(html, "pending.html");
  });

  await t.test("待推送：主按钮为推送发布，步骤一已完成", () => {
    const status = createBaseStatus();
    status.repo!.ahead = 1;
    status.repo!.aheadCommits = ["3f8a92b"];
    status.ledger.exported = 1;
    const html = render(status);
    assert.match(html, /推送发布/);
    assert.match(html, /data-repo-pipeline-step completed/);
    assertFixture(html, "ahead.html");
  });

  await t.test("远端已有、台账未登记：主按钮为确认发布", () => {
    const status = createBaseStatus();
    status.ledger.exported = 3;
    const html = render(status);
    assert.match(html, /确认发布/);
    assertFixture(html, "exported-unconfirmed.html");
  });

  await t.test("全部已发布：无主按钮，只有重新检查与预演", () => {
    const html = render(createBaseStatus());
    assert.match(html, /重新检查/);
    assert.match(html, /预演（不写入）/);
    assert.doesNotMatch(html, /data-repo-pipeline-btn-primary/);
    assertFixture(html, "all-published.html");
  });

  await t.test("分容器部署未连接 GitHub：推送禁用并链接到 GitHub 卡片", () => {
    const status = createBaseStatus();
    status.deploy.externalRunner = true;
    status.pushCapability = "unavailable";
    status.github = { state: "disconnected", login: null, appSlug: null, appSettingsUrl: null };
    status.repo!.ahead = 1;
    status.repo!.aheadCommits = ["3f8a92b"];
    const html = render(status);
    assert.match(html, /轮次结束后自动导出；推送需你在此确认。/);
    assert.match(html, /href="#data-repo"[^>]*>执行器未连接 GitHub/);
    assert.match(html, /data-repo-pipeline-btn-push" disabled/);
    assertFixture(html, "external-runner-disconnected.html");
  });

  await t.test("导出执行中：主按钮显示进行中且全部禁用", () => {
    const status = createBaseStatus();
    status.local.pending = ["20260927T090000Z"];
    const html = render(status, "export");
    assert.match(html, /正在/);
    assert.doesNotMatch(html, /<button type="button" class="data-repo-pipeline-btn[^"]*">/);
    assertFixture(html, "in-flight-export.html");
  });
});

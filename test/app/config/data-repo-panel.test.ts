import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import React from "react";
(globalThis as unknown as { React: typeof React }).React = React;
import ReactDOMServer from "react-dom/server";
import { DataRepoPanel } from "@/app/config/DataRepoPanel";
import type { DataRepoStatus } from "@/core/sync/data-repo-panel-types";

const FIXTURES_DIR = path.resolve(__dirname, "../../fixtures/markup/wp-l");

function readFixture(filename: string): string {
  const filePath = path.join(FIXTURES_DIR, filename);
  return fs.readFileSync(filePath, "utf-8");
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
      ahead: 1,
      behind: 0,
      aheadCommits: ["3f8a92b"],
    },
    manifest: {
      totalRuns: 50,
      updatedAt: "2026-09-27T08:00:00Z",
      latestDay: "2026-09-27",
    },
    ledger: {
      exported: 1,
      published: 50,
      lastExportedAt: "2026-09-27T08:00:00Z",
      lastPublishedAt: "2026-09-26T08:00:00Z",
    },
    local: {
      totalRuns: 51,
      pending: [],
      incomplete: 0,
    },
    lastAction: {
      mode: "export",
      startedAt: "2026-09-27T08:00:00Z",
      finishedAt: "2026-09-27T08:00:01Z",
      ok: true,
      report: {
        success: true,
        dryRun: false,
        totalCandidates: 1,
        exported: ["20260927T080000Z"],
        skipped: [],
        conflicts: [],
        rejected: [],
        redactions: [],
        ledgerTransitions: {
          exported: ["20260927T080000Z"],
          published: [],
        },
        commit: "3f8a92b",
        pushed: false,
      },
      executedBy: "web",
      error: null,
    },
    notice: null,
  };
}

test("DataRepoPanel 静态标记特征测试", async (t) => {
  await t.test("场景 1：未配置数据仓 (unconfigured)", () => {
    const status: DataRepoStatus = {
      ...createBaseStatus(),
      configured: false,
      repo: null,
    };
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(DataRepoPanel, {
        initialStatus: status,
        autoLoad: false,
      }),
    );
    const expected = readFixture("unconfigured.html");
    assert.strictEqual(html, expected);
    assert.match(html, /当前配置未启用数据仓/);
  });

  await t.test("场景 2：健康状态 (healthy)", () => {
    const status = createBaseStatus();
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(DataRepoPanel, {
        initialStatus: status,
        autoLoad: false,
      }),
    );
    const expected = readFixture("healthy.html");
    assert.strictEqual(html, expected);
    assert.match(html, /data-repo-health-badge healthy/);
    assert.match(html, /导出 1 轮、跳过 0 轮、拒绝 0 轮/);
  });

  await t.test("场景 3：有 pending 与被拒绝轮次 (pending-and-rejected)", () => {
    const status: DataRepoStatus = {
      ...createBaseStatus(),
      local: {
        totalRuns: 52,
        pending: ["20260927T080000Z", "20260927T070000Z"],
        incomplete: 0,
      },
      lastAction: {
        mode: "export",
        startedAt: "2026-09-27T08:00:00Z",
        finishedAt: "2026-09-27T08:00:02Z",
        ok: true,
        report: {
          success: true,
          dryRun: false,
          totalCandidates: 2,
          exported: ["20260927T070000Z"],
          skipped: [{ runId: "20260926T000000Z", reason: "内容无变化" }],
          conflicts: [],
          rejected: [
            {
              runId: "20260927T080000Z",
              reasons: [{ file: "output.svg", reason: "local-path 泄漏" }],
            },
          ],
          redactions: [],
          ledgerTransitions: {
            exported: ["20260927T070000Z"],
            published: [],
          },
          commit: "4c1d2e3",
          pushed: false,
        },
        executedBy: "web",
        error: null,
      },
    };
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(DataRepoPanel, {
        initialStatus: status,
        autoLoad: false,
      }),
    );
    const expected = readFixture("pending-and-rejected.html");
    assert.strictEqual(html, expected);
    assert.match(html, /local-path 泄漏/);
    assert.match(html, /内容无变化/);
  });

  await t.test("场景 4：分容器部署 externalRunner (external-runner)", () => {
    const status: DataRepoStatus = {
      ...createBaseStatus(),
      deploy: { readonly: false, externalRunner: true },
    };
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(DataRepoPanel, {
        initialStatus: status,
        autoLoad: false,
      }),
    );
    const expected = readFixture("external-runner.html");
    assert.strictEqual(html, expected);
    assert.match(html, /执行器未连接 GitHub，请先在上方连接后再推送/);
  });

  await t.test("场景 5：动作进行中锁定全部按钮 (in-flight)", () => {
    const status = createBaseStatus();
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(DataRepoPanel, {
        initialStatus: status,
        initialInFlightMode: "export",
        autoLoad: false,
      }),
    );
    const expected = readFixture("in-flight.html");
    assert.strictEqual(html, expected);
    assert.match(html, /正在执行导出提交，请稍候/);
    assert.match(html, /正在导出提交…/);
  });

  await t.test("场景 6：推送确认对话框打开 (push-confirm-open)", () => {
    const status = createBaseStatus();
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(DataRepoPanel, {
        initialStatus: status,
        initialShowPushDialog: true,
        autoLoad: false,
      }),
    );
    const expected = readFixture("push-confirm-open.html");
    assert.strictEqual(html, expected);
    assert.match(html, /确认推送到远程数据仓/);
    assert.match(html, /3f8a92b/);
  });
});

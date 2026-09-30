/**
 * 待导出轮次清单：每轮一行带勾选框、时刻、题目、成功数与上游；未勾选的行标 unselected；空清单不渲染。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DataRepoPendingList, formatRunIdTime } from "@/app/config/DataRepoPendingList";
import { derivePipeline } from "@/app/config/data-repo-pipeline-model";
import type { DataRepoStatus, PendingRun } from "@/core/sync/data-repo-panel-types";
import { initialSelection, selectAll, toggleRun } from "@/app/config/pending-selection-model";

(globalThis as unknown as { React: typeof React }).React = React;

const ITEM = { promptId: "animated-pelican-v1", cli: "codex", model: "gpt-5.5", effort: "low", status: "ok" };
const RUNS: PendingRun[] = [
  {
    runId: "20260929T150913Z", promptIds: ["animated-pelican-v1"], attempts: 3, ok: 3, profiles: ["relay-a", "relay-b"],
    items: [
      { ...ITEM, key: "a@animated-pelican-v1", profile: "relay-a", svgFile: "a.svg" },
      { ...ITEM, key: "b@animated-pelican-v1", profile: "relay-b", svgFile: "b.svg" },
    ],
  },
  { runId: "20260929T140327Z", promptIds: ["classic-v1", "xiyou-v1"], attempts: 4, ok: 1, profiles: [] },
];

test("formatRunIdTime：runId 显示为 UTC 时刻，非 runId 原样返回", () => {
  assert.equal(formatRunIdTime("20260929T150913Z"), "2026-09-29 15:09 UTC");
  assert.equal(formatRunIdTime("nope"), "nope");
});

test("清单渲染：勾选计数、每行内容、未勾选标记；空清单为空", () => {
  const noop = () => {};
  const state = toggleRun(initialSelection(RUNS), RUNS[1]!);
  const html = renderToStaticMarkup(
    React.createElement(DataRepoPendingList, {
      runs: RUNS, state, disabled: false, onToggleRun: noop, onToggleAttempt: noop, onSetAll: noop, onDiscard: noop,
    }),
  );
  assert.match(html, /待导出 2 轮，已勾选 1 轮/);
  assert.match(html, /2026-09-29 15:09 UTC/);
  assert.match(html, /animated-pelican-v1/);
  assert.match(html, /成功 3\/3/);
  assert.match(html, /上游 relay-a、relay-b/);
  assert.match(html, /<li class="unselected">/);
  assert.equal((html.match(/checked=""/g) ?? []).length, 1);
  assert.match(html, /预览 2 次调用/);
  assert.match(html, /href="\/\?day=2026-09-29"/);
  assert.match(html, /丢弃未勾选的 1 轮/);
  assert.equal((html.match(/>丢弃</g) ?? []).length, 2);
  const empty: PendingRun[] = [];
  assert.equal(
    renderToStaticMarkup(React.createElement(DataRepoPendingList, {
      runs: empty, state: selectAll(empty, true), disabled: false,
      onToggleRun: noop, onToggleAttempt: noop, onSetAll: noop, onDiscard: noop,
    })),
    "",
  );
});

test("derivePipeline：勾选数进导出按钮文案，勾选为零时按钮禁用并给出原因", () => {
  const status = {
    configured: true,
    deploy: { readonly: false, externalRunner: false },
    repo: { path: "x", reachable: true, isGitRepo: true, clean: true, branch: "main", upstream: "origin/main", ahead: 0, behind: 0, aheadCommits: [] },
    manifest: null,
    ledger: { exported: 0, published: 0, lastExportedAt: null, lastPublishedAt: null },
    local: { totalRuns: 2, pending: RUNS.map((run) => run.runId), pendingRuns: RUNS, incomplete: 0 },
    lastAction: null,
    notice: null,
  } as unknown as DataRepoStatus;
  assert.equal(derivePipeline(status, null, 1).primaryAction?.label, "导出 1 轮");
  assert.equal(derivePipeline(status, null, null).primaryAction?.label, "导出 2 轮");
  const none = derivePipeline(status, null, 0).primaryAction;
  assert.equal(none?.enabled, false);
  assert.match(none?.disabledReason ?? "", /先在下方勾选/);
});

test("derivePipeline：分容器部署时按 autoSync 说明导出方式，不假定自动导出", () => {
  const base = {
    configured: true,
    deploy: { readonly: false, externalRunner: true },
    repo: null, manifest: null,
    ledger: { exported: 0, published: 0, lastExportedAt: null, lastPublishedAt: null },
    local: { totalRuns: 0, pending: [], incomplete: 0 },
    lastAction: null, notice: null,
  };
  const off = derivePipeline({ ...base, autoSync: false } as unknown as DataRepoStatus).staticNotice ?? "";
  const on = derivePipeline({ ...base, autoSync: true } as unknown as DataRepoStatus).staticNotice ?? "";
  assert.match(off, /不自动导出/);
  assert.match(on, /轮次结束后自动导出/);
});

import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, test } from "node:test";
import { JSDOM } from "jsdom";
import React, { act, useRef } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";

(globalThis as unknown as { React: typeof React }).React = React;

import { PelicanCard } from "@/app/components/card/PelicanCard";
import { summarize } from "@/app/components/dashboard/dashboard-calc";
import { mergeLiveProgress } from "@/app/components/dashboard/merge-live-progress";
import { useDashboardSync } from "@/app/components/dashboard/use-dashboard-sync";
import { resetLiveStoreForTests } from "@/app/components/live-state/live-store";
import { folderCell, planSlots } from "@/app/components/timeline/effort-slots";
import { FolderTile } from "@/app/components/timeline/FolderTile";
import { groupMoments, listEfforts, momentHealth } from "@/app/components/timeline/moments";
import { rowPassRate } from "@/app/components/timeline/pass-rate";
import { listRows } from "@/app/components/timeline/rows";
import { Thumb } from "@/app/components/timeline/Thumb";
import type { ProgressView } from "@/core/progress";
import { computeRunsRevision } from "@/core/runs-revision";
import type { DashboardCard } from "@/core/types";

function makeCard(overrides: Partial<DashboardCard> = {}): DashboardCard {
  return {
    runId: "20261114T051410Z",
    runStartedAt: "2026-11-14T05:14:10.000Z",
    trigger: "manual",
    runInProgress: false,
    targetId: "agy__gemini-3-pro__high",
    cli: "agy",
    model: "gemini-3-pro",
    effort: "high",
    appliedEffort: "high",
    effortHonored: true,
    promptId: "animated-pelican-v1",
    promptText: "",
    label: "动态鹈鹕车",
    bindings: {},
    status: "ok",
    svgFile: "agy-high.svg",
    rawFile: "agy-high.raw.txt",
    svgBytes: 2048,
    error: null,
    durationMs: 12000,
    startedAt: "2026-11-14T05:14:10.000Z",
    finishedAt: "2026-11-14T05:14:22.000Z",
    usage: null,
    cost: {
      status: "unpriced",
      usd: null,
      modelId: null,
      channelId: null,
      serviceTier: "standard",
      catalogTag: null,
      lines: [],
      note: null,
    },
    judge: null,
    judgeCost: null,
    ...overrides,
  };
}

function makeLiveRun(overrides: Partial<ProgressView> = {}): ProgressView {
  return {
    runId: "20261114T051410Z",
    trigger: "manual",
    startedAt: "2026-11-14T05:14:10.000Z",
    updatedAt: "2026-11-14T05:14:15.000Z",
    finishedAt: null,
    cancelledAt: null,
    budgetStop: null,
    pid: process.pid,
    laneLimit: 1,
    alive: true,
    lanes: [
      {
        cli: "agy",
        model: "gemini-3-pro",
        calls: [
          {
            targetId: "agy__gemini-3-pro__low",
            promptId: "animated-pelican-v1",
            effort: "low",
            state: "running",
            startedAt: "2026-11-14T05:14:11.000Z",
            timeoutMs: 120000,
            status: null,
            durationMs: null,
          },
          {
            targetId: "agy__gemini-3-pro__high",
            promptId: "animated-pelican-v1",
            effort: "high",
            state: "queued",
            startedAt: null,
            timeoutMs: 120000,
            status: null,
            durationMs: null,
          },
        ],
      },
    ],
    ...overrides,
  };
}

function createFakeEventSource() {
  const streams: FakeSource[] = [];
  class FakeSource extends EventTarget {
    static readonly CLOSED = 2;
    readyState = 1;
    constructor(readonly url: string) {
      super();
      streams.push(this);
    }
    close() {
      this.readyState = FakeSource.CLOSED;
    }
  }
  return { FakeSource, streams };
}

function setupSyncTestDom() {
  const dom = new JSDOM("<main></main>");
  const { FakeSource, streams } = createFakeEventSource();
  Object.defineProperty(dom.window.document, "visibilityState", { get: () => "visible" });
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    EventSource: FakeSource,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  return { dom, streams, container: dom.window.document.querySelector("main")! };
}

describe("live timeline progress & incremental sync", () => {
  test("执行中尚无 run.json 时也能在时间线泳道合成四宫格占位并跳过指纹作业", () => {
    const fpJob = makeLiveRun({ runId: "fp-1", jobKind: "fill" });
    const deadRun = makeLiveRun({ runId: "20261114T040000Z", alive: false });
    const liveRun = makeLiveRun();

    const merged = mergeLiveProgress({
      cards: [],
      runStarts: [],
      progress: [fpJob, deadRun, liveRun],
      promptLabels: { "animated-pelican-v1": "动态鹈鹕车" },
    });

    assert.deepEqual(merged.runStarts, ["2026-11-14T05:14:10.000Z"]);
    assert.equal(merged.cards.length, 2);
    assert.equal(merged.cards.find((c) => c.effort === "low")?.liveState, "running");
    assert.equal(merged.cards.find((c) => c.effort === "high")?.liveState, "queued");

    const moments = groupMoments(merged.cards, "UTC");
    assert.equal(moments.length, 1);
    assert.equal(momentHealth(moments[0]!), "running");

    const rows = listRows(merged.cards);
    assert.equal(rows.length, 1);
    const efforts = listEfforts(merged.cards);
    const cell = folderCell(moments[0]!, rows[0]!, [], efforts, []);
    assert.ok(cell !== null);
    assert.equal(cell.cards.length, 2);
    assert.deepEqual(summarize(merged.cards), { runs: 1, works: 0, rate: 0 });
    assert.equal(rowPassRate("animated-pelican-v1", merged.cards)?.total.total, 0);
  });

  test("真实卡片落盘后立即覆盖同目标的实时占位", () => {
    const completedLow = makeCard({
      targetId: "agy__gemini-3-pro__low",
      effort: "low",
      svgFile: "agy-low.svg",
    });
    const merged = mergeLiveProgress({
      cards: [completedLow],
      runStarts: ["2026-11-14T05:14:10.000Z"],
      progress: [makeLiveRun()],
      promptLabels: { "animated-pelican-v1": "动态鹈鹕车" },
    });

    assert.equal(merged.cards.length, 2);
    const low = merged.cards.find((c) => c.effort === "low")!;
    const high = merged.cards.find((c) => c.effort === "high")!;
    assert.equal(low.liveState, undefined);
    assert.equal(low.svgFile, "agy-low.svg");
    assert.equal(high.liveState, "queued");
  });

  test("Thumb / FolderTile / PelicanCard 为 running 与 queued 渲染专属状态而非失败或脱敏", () => {
    const runningCard = makeCard({ effort: "low", svgFile: null, liveState: "running" });
    const queuedCard = makeCard({ effort: "high", svgFile: null, liveState: "queued" });

    assert.ok(renderToStaticMarkup(React.createElement(Thumb, { card: runningCard })).includes("thumb-running"));
    assert.ok(renderToStaticMarkup(React.createElement(Thumb, { card: queuedCard })).includes("thumb-queued"));

    const moment = groupMoments([runningCard, queuedCard], "UTC")[0]!;
    const row = listRows([runningCard, queuedCard])[0]!;
    const efforts = ["low", "high"];
    const slots = planSlots(efforts);
    const cell = folderCell(moment, row, slots, efforts, [])!;
    const tileHtml = renderToStaticMarkup(
      React.createElement(FolderTile, { row, cell, slots, x: 100, onOpen: () => {} }),
    );
    assert.ok(tileHtml.includes("folder-live"));
    assert.ok(tileHtml.includes("status-running"));
    assert.ok(tileHtml.includes("status-queued"));

    const modalCardHtml = renderToStaticMarkup(React.createElement(PelicanCard, { card: runningCard, timeZone: "UTC" }));
    assert.ok(modalCardHtml.includes("frame-live"));
    assert.ok(!modalCardHtml.includes("已脱敏"));
  });

  test("computeRunsRevision 随 run.json 与 .judge.json 落盘变化", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "pelican-rev-"));
    const prev = process.env.PELICAN_DATA_DIR;
    process.env.PELICAN_DATA_DIR = root;
    try {
      const rev0 = await computeRunsRevision();
      const dir = path.join(root, "runs", "20261114T051410Z");
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, "progress.json"), "{}\n");
      const revDir = await computeRunsRevision();
      assert.notEqual(revDir, rev0);

      await writeFile(path.join(dir, "run.json"), '{"runId":"20261114T051410Z"}\n');
      const revRun = await computeRunsRevision();
      assert.notEqual(revRun, revDir);

      await writeFile(path.join(dir, "a.judge.json"), '{"ok":true}\n');
      const revJudge = await computeRunsRevision();
      assert.notEqual(revJudge, revRun);
    } finally {
      if (prev === undefined) delete process.env.PELICAN_DATA_DIR;
      else process.env.PELICAN_DATA_DIR = prev;
      await rm(root, { recursive: true, force: true });
    }
  });

  test("useDashboardSync 收到 runs-revision 变化时仅增量请求 /api/dashboard 并就地更新", async (t) => {
    const { dom, streams, container } = setupSyncTestDom();
    const dashboardUrls: string[] = [];
    const doneCard = makeCard({ svgFile: "finished.svg" });
    t.mock.method(globalThis, "fetch", async (url: string) => {
      const target = String(url);
      if (target.startsWith("/api/dashboard")) dashboardUrls.push(target);
      return new Response(
        JSON.stringify(
          target.startsWith("/api/dashboard")
            ? {
                cards: [doneCard],
                runStarts: ["2026-11-14T05:14:10.000Z"],
                scheduleTimeZone: "UTC",
                promptLabels: { "animated-pelican-v1": "动态鹈鹕车" },
                promptStandards: {},
                profiles: [],
                runsRevision: "rev-2",
              }
            : null,
        ),
        { status: target.startsWith("/api/dashboard") ? 200 : 503, headers: { "content-type": "application/json" } },
      );
    });

    function Probe() {
      const dayRef = useRef<string | null>("2026-11-14");
      const synced = useDashboardSync({
        cards: [],
        runStarts: [],
        promptLabels: {},
        promptStandards: {},
        profiles: [],
        initialRunsRevision: "rev-1",
        pickedDayRef: dayRef,
      });
      return React.createElement("output", null, synced.cards.map((c) => `${c.svgFile ?? c.liveState}`).join(","));
    }

    const root = createRoot(container);
    try {
      await act(() => root.render(React.createElement(Probe)));
      const stream = streams[0]!;
      await act(() => stream.dispatchEvent(new MessageEvent("runs-revision", { data: '"rev-1"' })));
      assert.equal(dashboardUrls.length, 0);

      await act(() => stream.dispatchEvent(new MessageEvent("runs-revision", { data: '"rev-2"' })));
      assert.deepEqual(dashboardUrls, ["/api/dashboard?day=2026-11-14"]);
      assert.equal(container.textContent, "finished.svg");
    } finally {
      await act(() => root.unmount());
      resetLiveStoreForTests();
      dom.window.close();
    }
  });
});

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

(globalThis as unknown as { React: typeof React }).React = React;

import { FolderTile } from "@/app/components/timeline/FolderTile";
import type { Moment } from "@/app/components/timeline/moments";
import { Thumb } from "@/app/components/timeline/Thumb";
import { TimelineAxis } from "@/app/components/timeline/TimelineAxis";
import type { Column } from "@/app/components/timeline/track-layout";
import type { DashboardCard } from "@/core/types";

const FIXTURES_DIR = path.resolve("test/fixtures/markup/wp-f");

function loadFixture(name: string): string {
  return fs.readFileSync(path.join(FIXTURES_DIR, name), "utf-8");
}

const noop = () => {};

const mockCardOk: DashboardCard = {
  runId: "20260927T020000Z",
  runStartedAt: "2026-09-27T02:00:00Z",
  runInProgress: false,
  judge: null,
  targetId: "claude/claude-3-7-sonnet/high",
  cli: "claude",
  model: "claude-3-7-sonnet",
  effort: "high",
  appliedEffort: "high",
  effortHonored: true,
  promptId: "animated-pelican-v1",
  promptText: "动态鹈鹕车",
  label: "动态鹈鹕车",
  status: "ok",
  svgFile: "claude-3-7-sonnet-high.svg",
  rawFile: "claude-3-7-sonnet-high.raw.txt",
  svgBytes: 12345,
  durationMs: 45000,
  startedAt: "2026-09-27T02:00:00Z",
  finishedAt: "2026-09-27T02:00:45Z",
  cost: {
    status: "priced",
    usd: 0.12,
    modelId: "claude-3-7-sonnet",
    channelId: "anthropic",
    serviceTier: "standard",
    catalogTag: "2026-03",
    lines: [
      { meter: "output", tokens: 1000, unitPrice: 15, usd: 0.015 },
    ],
    note: null,
  },
  usage: null,
  bindings: { animal: "pelican" },
  trigger: "manual",
  error: null,
};

const mockCardFailed: DashboardCard = {
  ...mockCardOk,
  status: "timeout",
  svgFile: null,
  svgBytes: null,
  error: "执行超时 (120s)",
};

const mockMoment: Moment = {
  runId: "20260927T020000Z",
  dayKey: "2026-09-27",
  clock: "02:00",
  fraction: 0.0833,
  startedAt: "2026-09-27T02:00:00Z",
  okCount: 1,
  cards: [mockCardOk, mockCardFailed],
};

const mockRow = {
  key: "claude__claude-3-7-sonnet__animated-pelican-v1",
  cli: "claude",
  model: "claude-3-7-sonnet",
  promptId: "animated-pelican-v1",
  label: "动态鹈鹕车",
};

const mockColumns: readonly Column[] = [
  {
    moment: mockMoment,
    exactX: 200,
    x: 200,
  },
];

const mockCell = {
  cards: [mockCardOk],
  slotCards: [mockCardOk],
  overflow: 0,
};

describe("Timeline Components Markup Characterization", () => {
  describe("FolderTile", () => {
    test("normal 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(FolderTile, {
          row: mockRow,
          cell: mockCell,
          slots: ["high"],
          x: 100,
          onOpen: noop,
        }),
      );
      assert.equal(actual, loadFixture("FolderTile-normal.html"));
    });

    test("overflow 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(FolderTile, {
          row: mockRow,
          cell: { cards: [mockCardOk, mockCardOk], slotCards: [mockCardOk], overflow: 2 },
          slots: ["high", "more"],
          x: 100,
          onOpen: noop,
        }),
      );
      assert.equal(actual, loadFixture("FolderTile-overflow.html"));
    });
  });

  describe("Thumb", () => {
    test("ok 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(Thumb, { card: mockCardOk }),
      );
      assert.equal(actual, loadFixture("Thumb-ok.html"));
    });

    test("failed 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(Thumb, { card: mockCardFailed }),
      );
      assert.equal(actual, loadFixture("Thumb-failed.html"));
    });
  });

  describe("TimelineAxis", () => {
    test("normal 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(TimelineAxis, { columns: mockColumns, width: 7920, now: null }),
      );
      assert.equal(actual, loadFixture("TimelineAxis-normal.html"));
    });

    test("with-now 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(TimelineAxis, {
          columns: mockColumns,
          width: 7920,
          now: { fraction: 0.5, clock: "12:00" },
        }),
      );
      assert.equal(actual, loadFixture("TimelineAxis-with-now.html"));
    });
  });
});

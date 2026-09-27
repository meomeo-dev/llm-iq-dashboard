import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

(globalThis as unknown as { React: typeof React }).React = React;

import { PelicanCard } from "@/app/components/card/PelicanCard";
import type { DashboardCard } from "@/core/types";

const FIXTURES_DIR = path.resolve("test/fixtures/markup/wp-f");

function loadFixture(name: string): string {
  return fs.readFileSync(path.join(FIXTURES_DIR, name), "utf-8");
}

const mockCardOk: DashboardCard = {
  runId: "20260927T020000Z",
  runStartedAt: "2026-09-27T02:00:00Z",
  runInProgress: false,
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
  error: null,
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
};

const mockCardFailed: DashboardCard = {
  ...mockCardOk,
  status: "timeout",
  svgFile: null,
  svgBytes: null,
  error: "执行超时 (120s)",
};

const mockCardRedacted: DashboardCard = {
  ...mockCardOk,
  svgFile: null,
};

const mockCardFolded: DashboardCard = {
  ...mockCardOk,
  effort: "high",
  appliedEffort: "low",
  effortHonored: true,
};

describe("Card Components Markup Characterization", () => {
  describe("PelicanCard", () => {
    test("ok 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(PelicanCard, { card: mockCardOk, timeZone: "Asia/Shanghai" }),
      );
      assert.equal(actual, loadFixture("PelicanCard-ok.html"));
    });

    test("failed 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(PelicanCard, { card: mockCardFailed, timeZone: "Asia/Shanghai" }),
      );
      assert.equal(actual, loadFixture("PelicanCard-failed.html"));
    });

    test("redacted 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(PelicanCard, { card: mockCardRedacted, timeZone: "Asia/Shanghai" }),
      );
      assert.equal(actual, loadFixture("PelicanCard-redacted.html"));
    });

    test("folded 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(PelicanCard, { card: mockCardFolded, timeZone: "Asia/Shanghai" }),
      );
      assert.equal(actual, loadFixture("PelicanCard-folded.html"));
    });
  });
});

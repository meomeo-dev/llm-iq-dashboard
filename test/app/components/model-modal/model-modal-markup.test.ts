import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

(globalThis as unknown as { React: typeof React }).React = React;

import { ModelModal } from "@/app/components/model-modal/ModelModal";
import type { Moment } from "@/app/components/timeline/moments";
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

const mockMoment: Moment = {
  runId: "20260927T020000Z",
  dayKey: "2026-09-27",
  clock: "02:00",
  fraction: 0.0833,
  startedAt: "2026-09-27T02:00:00Z",
  okCount: 1,
  cards: [mockCardOk],
};

const mockRow = {
  key: "claude__claude-3-7-sonnet__animated-pelican-v1",
  cli: "claude",
  model: "claude-3-7-sonnet",
  promptId: "animated-pelican-v1",
  label: "动态鹈鹕车",
};

describe("ModelModal Markup Characterization", () => {
  test("带标准与卡片场景逐字节一致", () => {
    const actual = renderToStaticMarkup(
      React.createElement(ModelModal, {
        moment: mockMoment,
        row: mockRow,
        efforts: ["high"],
        timeZone: "Asia/Shanghai",
        standard: {
          coreKey: "FE-1",
          groundTruth: "正确生成动画鹈鹕与旋转车轮",
          evaluationCriteria: "SVG 根节点包含 viewBox，有轮子转动动画",
          referenceSource: "https://example.com/spec",
        },
        onClose: noop,
      }),
    );
    assert.equal(actual, loadFixture("ModelModal-with-standard.html"));
  });

  test("空卡片且无标准场景逐字节一致", () => {
    const actual = renderToStaticMarkup(
      React.createElement(ModelModal, {
        moment: { ...mockMoment, cards: [], okCount: 0 },
        row: mockRow,
        efforts: ["high"],
        timeZone: "Asia/Shanghai",
        onClose: noop,
      }),
    );
    assert.equal(actual, loadFixture("ModelModal-empty.html"));
  });
});

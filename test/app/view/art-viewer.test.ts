import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ArtViewer } from "@/app/view/ArtViewer";
import type { DashboardCard } from "@/core/types";
import type { PromptStandard } from "@/core/prompt";

(globalThis as unknown as { React: unknown }).React = React;

const fixture = (name: string): string => {
  const filePath = path.resolve(process.cwd(), "test/fixtures/markup/wp-h", `${name}.html`);
  return fs.readFileSync(filePath, "utf-8");
};

describe("ArtViewer 特征测试", () => {
  test("极简卡片：成功状态，无抽屉与标准", () => {
    const card: DashboardCard = {
      runId: "20260927T021708Z",
      runStartedAt: "2026-09-27T02:17:08.000Z",
      trigger: "manual",
      runInProgress: false,
      judge: null,
      targetId: "claude__claude-3-5-sonnet__high",
      cli: "claude",
      model: "claude-3-5-sonnet",
      effort: "high",
      appliedEffort: "high",
      effortHonored: true,
      promptId: "pelican-bicycle",
      label: "鹈鹕骑自行车",
      startedAt: "2026-09-27T02:17:08.000Z",
      finishedAt: "2026-09-27T02:17:53.000Z",
      durationMs: 45000,
      status: "ok",
      svgFile: null,
      rawFile: null,
      svgBytes: null,
      error: null,
      cost: {
        usd: 0.05,
        status: "priced",
        lines: [],
        note: null,
        channelId: "anthropic",
        modelId: "claude-3-5-sonnet-20241022",
        serviceTier: "standard",
        catalogTag: "2026-09-26",
      },
      usage: null,
      bindings: {},
      promptText: "",
    };

    const html = renderToStaticMarkup(
      React.createElement(ArtViewer, { card, svg: "<svg></svg>" })
    );
    assert.equal(html, fixture("art-viewer-minimal"));
  });

  test("全量卡片：含绑定、SVG 下载链接、提示词抽屉与客观标准抽屉", () => {
    const card: DashboardCard = {
      runId: "20260927T021708Z",
      runStartedAt: "2026-09-27T02:17:08.000Z",
      trigger: "schedule",
      runInProgress: false,
      judge: null,
      targetId: "agy__gemini-2-5-pro__high",
      cli: "agy",
      model: "gemini-2.5-pro",
      effort: "high",
      appliedEffort: "high",
      effortHonored: true,
      promptId: "physics-pendulum",
      label: "双摆混沌摆动",
      startedAt: "2026-09-27T03:00:00.000Z",
      finishedAt: "2026-09-27T03:00:12.345Z",
      durationMs: 12345,
      status: "ok",
      svgFile: "double-pendulum.svg",
      rawFile: null,
      svgBytes: 4096,
      error: null,
      cost: {
        usd: 0.1234,
        status: "priced",
        lines: [
          { meter: "input", tokens: 1000, unitPrice: 1.25, usd: 0.00125 },
          { meter: "output", tokens: 5000, unitPrice: 5.0, usd: 0.025 },
        ],
        note: "计价完成",
        channelId: "google",
        modelId: "gemini-2.5-pro",
        serviceTier: "standard",
        catalogTag: "2026-09-26",
      },
      usage: {
        tokens: { input: 1000, output: 5000 },
        reasoningTokens: 500,
        serviceTier: "standard",
        reportedCostUsd: 0.12,
      },
      bindings: { 回目: "第一回", candidate: "double-pendulum" },
      promptText: "请绘制双摆混沌运动轨迹矢量图",
    };

    const standard: PromptStandard = {
      coreKey: "double-pendulum-chaotic",
      groundTruth: "双摆在非线性小扰动下呈现敏感依赖初值的混沌轨迹",
      evaluationCriteria: "必须呈现两个质点连杆，且运动轨迹出现自相交或多重折叠特征",
      referenceSource: "Phys. Rev. E 58, 4528 (1998), doi: 10.1103/PhysRevE.58.4528",
    };

    const html = renderToStaticMarkup(
      React.createElement(ArtViewer, {
        card,
        svg: "<svg><circle cx='10' cy='10' r='5'/></svg>",
        standard,
      })
    );
    assert.equal(html, fixture("art-viewer-full"));
  });

  test("失败卡片：effort 降级（low → high），无标准", () => {
    const card: DashboardCard = {
      runId: "20260927T021708Z",
      runStartedAt: "2026-09-27T02:17:08.000Z",
      trigger: "manual",
      runInProgress: false,
      judge: null,
      targetId: "codex__o3-mini__low",
      cli: "codex",
      model: "o3-mini",
      effort: "low",
      appliedEffort: "high",
      effortHonored: false,
      promptId: "pelican-bicycle",
      label: "鹈鹕自行车",
      startedAt: "2026-09-27T04:00:00.000Z",
      finishedAt: "2026-09-27T04:01:05.000Z",
      durationMs: 65000,
      status: "error",
      svgFile: null,
      rawFile: null,
      svgBytes: null,
      error: "Command timed out",
      cost: {
        usd: 0.08,
        status: "partial",
        lines: [],
        note: "部分计费",
        channelId: "openai",
        modelId: "o3-mini",
        serviceTier: "standard",
        catalogTag: null,
      },
      usage: null,
      bindings: { seed: "42" },
      promptText: "画一只鹈鹕骑自行车",
    };

    const html = renderToStaticMarkup(
      React.createElement(ArtViewer, { card, svg: "<svg></svg>" })
    );
    assert.equal(html, fixture("art-viewer-failed-card"));
  });
});

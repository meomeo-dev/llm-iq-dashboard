import assert from "node:assert/strict";
import path from "node:path";
import { describe, test } from "node:test";
import { expectFixture } from "../../../support/fixtures";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

(globalThis as unknown as { React: typeof React }).React = React;

import { PelicanCard } from "@/app/components/card/PelicanCard";
import type { DashboardCard } from "@/core/types";

const FIXTURES_DIR = path.resolve("test/fixtures/markup/wp-f");

const fixture = (name: string) => path.join(FIXTURES_DIR, name);

const mockCardOk: DashboardCard = {
  runId: "20260927T020000Z",
  runStartedAt: "2026-09-27T02:00:00Z",
  runInProgress: false,
  judge: null,
  judgeCost: null,
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
      expectFixture(actual, fixture("PelicanCard-ok.html"));
    });

    test("failed 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(PelicanCard, { card: mockCardFailed, timeZone: "Asia/Shanghai" }),
      );
      expectFixture(actual, fixture("PelicanCard-failed.html"));
    });

    test("redacted 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(PelicanCard, { card: mockCardRedacted, timeZone: "Asia/Shanghai" }),
      );
      expectFixture(actual, fixture("PelicanCard-redacted.html"));
    });

    test("folded 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(PelicanCard, { card: mockCardFolded, timeZone: "Asia/Shanghai" }),
      );
      expectFixture(actual, fixture("PelicanCard-folded.html"));
    });
  });
});

describe("PelicanCard 评审标签（ACR-019）", () => {
  const judged: DashboardCard = {
    ...mockCardOk,
    judge: {
      schemaVersion: 1,
      subject: { runId: mockCardOk.runId, attemptKey: "k", promptId: "animated-pelican-v1", cli: "claude", model: "m", effort: "high", svgFile: "k.svg" },
      rubric: { id: "animated-pelican-v1", version: 1, passThreshold: 60 },
      judges: [{ kind: "code", id: "static-judge@1", judgedAt: "2026-09-27T02:01:00Z" }],
      gates: [{ id: "G1", source: "static", title: "XML 合法", standard: "解析零错误", passed: true, evidence: "无错误" }],
      criteria: [{ id: "C1", source: "static", title: "车轮绕轴心旋转", standard: "同心", maxScore: 20, score: 20, reason: "偏差 0" }],
      total: { score: 20, maxScore: 100, verdict: "pending", judgedAt: "2026-09-27T02:01:00Z" },
    },
  };

  test("有评审记录时页脚出现标签与总分，悬停说明含逐条理由", () => {
    const html = renderToStaticMarkup(React.createElement(PelicanCard, { card: judged, timeZone: "UTC" }));
    assert.match(html, /judge-tag judge-pending/);
    assert.match(html, /待复核 20/);
    assert.match(html, /C1 20\/20 车轮绕轴心旋转：偏差 0/);
    assert.doesNotMatch(html, /judge-cost/);
  });

  test("有裁判成本时在评审标签后单独列出，悬停说明含裁判与问答次数", () => {
    const card: DashboardCard = { ...judged, judgeCost: { judgeId: "claude/claude-sonnet-5-5@high", usage: { tokens: { input: 120_000, output: 27_048 }, reasoningTokens: 0, serviceTier: "standard", reportedCostUsd: null }, asks: 3, cost: { status: "priced", usd: 0.021, modelId: "m", channelId: "c", serviceTier: "standard", catalogTag: "t", lines: [], note: null } } };
    const html = renderToStaticMarkup(React.createElement(PelicanCard, { card, timeZone: "UTC" }));
    assert.match(html, /footer-row judge-cost" title="AI 层裁判 claude\/claude-sonnet-5-5@high · 3 次问答\nAPI 等价成本[^"]*\nc · m · standard\n价格目录 t">裁判 \$0.021 · 3 次问答 · 147.0K</, "token 数与体积同写法");
    assert.match(html, /status-ok">成功<\/span><span class="judge-tag judge-pending"/, "评审标签紧跟状态");
  });

  test("没有评审记录时不渲染标签", () => {
    const html = renderToStaticMarkup(React.createElement(PelicanCard, { card: mockCardOk, timeZone: "UTC" }));
    assert.doesNotMatch(html, /judge-tag/);
  });
});

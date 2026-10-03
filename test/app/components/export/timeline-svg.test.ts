/**
 * 时间线导出图：行标签与看板同形——CLI · 模型之下画鹈鹕通过率（合计与按强度分列），
 * 没有评分标准的题目不画。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { renderTimelineSvg, type Palette, type TimelineExport } from "@/app/components/export/timeline-svg";
import type { Moment } from "@/app/components/timeline/moments";
import type { DashboardCard } from "@/core/types";

const palette: Palette = {
  bg: "#0b0f17", surface: "#10161f", surfaceHi: "#182030", border: "#232d3d", text: "#e6e8ee",
  textDim: "#9aa2b1", textFaint: "#6b7385", accent: "#4f8df7", ok: "#4ade80", warn: "#fbbf24", err: "#f87171",
};

function card(promptId: string, effort: string, verdict: "online" | "degraded" | null): DashboardCard {
  return {
    runId: "r1", runStartedAt: "2026-10-02T13:00:00Z", runInProgress: false,
    targetId: `agy__gemini-3.8-flash__${effort}`, cli: "agy", model: "gemini-3.8-flash",
    effort, appliedEffort: effort, effortHonored: true, promptId, promptText: "p", label: "x", status: "ok",
    svgFile: "a.svg", rawFile: "a.raw.txt", svgBytes: 5120, durationMs: 1000,
    startedAt: "2026-10-02T13:00:00Z", finishedAt: "2026-10-02T13:00:01Z",
    cost: null, usage: null, bindings: {}, trigger: "schedule", error: null,
    judge: verdict === null ? null : { total: { verdict, score: verdict === "online" ? 90 : 40 } },
    judgeCost: null,
  } as unknown as DashboardCard;
}

function moment(cards: DashboardCard[]): Moment {
  return { runId: "r1", startedAt: "2026-10-02T13:00:00Z", dayKey: "2026-10-02", fraction: 13 / 24, clock: "13:00", cards, okCount: cards.length };
}

function input(cards: DashboardCard[], efforts: string[]): TimelineExport {
  return { title: "t", subtitle: "s", moments: [moment(cards)], efforts, now: null, thumbnails: new Map(), palette };
}

test("带评分标准的题目：行标签画合计与按强度分列的通过率", () => {
  const cards = [card("animated-pelican-v1", "low", "degraded"), card("animated-pelican-v1", "high", "online"), card("animated-pelican-v1", "high", null)];
  const { svg } = renderTimelineSvg(input(cards, ["low", "high"]));
  assert.match(svg, />合计 1\/3</);
  assert.match(svg, />├<\/text><text[^>]*>low 0\/1</);
  assert.match(svg, />└<\/text><text[^>]*>high 1\/2</);
});

test("没有评分标准的题目不画通过率，名称仍在行中央", () => {
  const { svg } = renderTimelineSvg(input([card("classic-v1", "high", null)], ["high"]));
  assert.doesNotMatch(svg, /合计/);
  // 行顶 = 32 + 72 + 56 + 30 + 36 = 226，单行 18px 居中后基线在 226 + 109 + 13
  assert.match(svg, /<text x="32" y="348" [^>]*>agy · gemini-3.8-flash</);
});

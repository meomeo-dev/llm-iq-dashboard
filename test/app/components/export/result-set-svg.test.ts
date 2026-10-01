/**
 * 结果集导出图：矩阵与单行两种布局、尺寸、作品嵌入、失败框、文字截断与折行、XML 转义。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { clip, estimateWidth, renderResultSetSvg, wrap, type ResultSetExport } from "@/app/components/export/result-set-svg";
import type { Palette } from "@/app/components/export/timeline-svg";
import type { DashboardCard } from "@/core/types";

const palette: Palette = {
  bg: "#0b0f17", surface: "#10161f", surfaceHi: "#182030", border: "#232d3d", text: "#e6e8ee",
  textDim: "#9aa2b1", textFaint: "#6b7385", accent: "#4f8df7", ok: "#4ade80", warn: "#fbbf24", err: "#f87171",
};

function card(effort: string, profile: string | undefined, status: DashboardCard["status"] = "ok"): DashboardCard {
  return {
    runId: "r1", runStartedAt: "2026-09-29T04:18:34Z", runInProgress: false,
    targetId: `codex__gpt-6-astra__${effort}${profile === undefined ? "" : `__${profile}`}`,
    cli: "codex", model: "gpt-6-astra", effort, appliedEffort: effort, effortHonored: true,
    promptId: "animated-pelican-v1", promptText: "p", label: "x", status,
    svgFile: status === "ok" ? "a.svg" : null, rawFile: "a.raw.txt", svgBytes: status === "ok" ? 5120 : null,
    durationMs: 229_000, startedAt: "2026-09-29T04:18:34Z", finishedAt: "2026-09-29T04:22:23Z",
    cost: { status: "priced", usd: 0.17, modelId: "m", channelId: "c", serviceTier: "standard", catalogTag: "t", lines: [], note: null },
    usage: null, bindings: {}, trigger: "manual",
    error: status === "error" ? "unexpected status 503 <Service> Unavailable & retry later ".repeat(4) : null,
    judge: status === "ok" ? { total: { verdict: effort === "xhigh" ? "degraded" : "online", score: effort === "xhigh" ? 45 : 94 } } : null,
    judgeCost: status === "ok" && effort === "medium" ? { judgeId: "claude/claude-sonnet-5-5@high", usage: null, asks: 3, cost: { status: "priced", usd: 0.021, modelId: "m", channelId: "c", serviceTier: "standard", catalogTag: "t", lines: [], note: null } } : null,
    ...(profile === undefined ? {} : { profile }),
  } as unknown as DashboardCard;
}

function input(overrides: Partial<ResultSetExport>): ResultSetExport {
  return {
    title: "codex · gpt-6-astra",
    subtitle: "09/29 周二 12:18 这一轮 · animated-pelican-v1 · 2 个上游 · 成功 2",
    cards: [card("medium", undefined), card("medium", "relay-a", "error"), card("xhigh", "relay-a")],
    columns: [{ name: "default", label: "登录态", color: null }, { name: "relay-a", label: "甲 <稳定> 0.07", color: "#f28b5b" }],
    efforts: ["low", "medium", "xhigh"],
    timeZone: "Asia/Shanghai",
    thumbnails: new Map([["r1/codex__gpt-6-astra__medium/animated-pelican-v1", "data:image/svg+xml;charset=utf-8,%3Csvg%3E"]]),
    palette,
    ...overrides,
  };
}

test("矩阵布局：列 = 上游、行 = 有结果的强度；尺寸按列行算；空格画虚线框", () => {
  const { svg, width, height } = renderResultSetSvg(input({}));
  // 32 + 56 + 2×(300+16) − 16 + 32
  assert.equal(width, 736);
  // 32 + 72 + 28 + 16 + 2×(373+16) − 16 + 32
  assert.equal(height, 942);
  assert.equal((svg.match(/<image /g) ?? []).length, 1);
  assert.equal((svg.match(/stroke-dasharray="4 4"/g) ?? []).length, 1);
  assert.match(svg, /甲 &lt;稳定&gt; 0.07/);
  assert.match(svg, /fill="#f28b5b"/);
  assert.match(svg, /调用失败/);
  assert.match(svg, /&lt;Service&gt; Unavailable &amp; retry/);
  assert.match(svg, /官价 \$0.170/);
  assert.match(svg, /裁判 \$0.021/);
  assert.doesNotMatch(svg, /NaN|undefined/);
  assert.match(svg, new RegExp(`<rect width="${width}" height="${height}" fill="#0b0f17"/>`));
});

test("单上游：按强度排成一行，没有列标题与行标签", () => {
  const cards = [card("xhigh", undefined), card("low", undefined), card("medium", undefined)];
  const { svg, width } = renderResultSetSvg(input({ cards, columns: [{ name: "default", label: "登录态", color: null }] }));
  assert.equal(width, 32 + 3 * 316 - 16 + 32);
  assert.doesNotMatch(svg, /登录态/);
  assert.ok(svg.indexOf("effort: low") < svg.indexOf("effort: medium"));
  assert.ok(svg.indexOf("effort: medium") < svg.indexOf("effort: xhigh"));
  assert.doesNotMatch(svg, /gpt-6-astra · low/, "与看板卡片一样不画副标题");
});

test("卡片与看板同形：上游徽章带色点、评审结论靠右染色、页脚有触发方式", () => {
  const { svg } = renderResultSetSvg(input({}));
  assert.match(svg, /<circle cx="[\d.]+" cy="[\d.]+" r="4" fill="#f28b5b"\/>/, "上游徽章的色点");
  assert.match(svg, /fill="#e6e8ee" font-size="11.5" >甲 &lt;稳定&gt; 0.07</, "上游徽章文字");
  assert.match(svg, /fill="#4ade80" font-size="12" text-anchor="end" font-weight="600">智商在线 94</);
  assert.match(svg, /fill="#f87171" font-size="12" text-anchor="end" font-weight="600">降智 45</);
  assert.equal((svg.match(/手动/g) ?? []).length, 3);
  const folded = renderResultSetSvg(input({ cards: [{ ...card("xhigh", undefined), appliedEffort: "high" } as DashboardCard], columns: [{ name: "default", label: "登录态", color: null }] }));
  assert.match(folded.svg, /fill="#fbbf24" font-size="11.5" >effort: xhigh → high</);
});

test("estimateWidth / clip / wrap：中文按 1 em，超宽截断加省略号，折行不超过行数", () => {
  assert.equal(estimateWidth("中文", 10), 20);
  assert.equal(estimateWidth("ab", 10), 11.6);
  assert.equal(clip("一二三四五", 30, 10), "一二…");
  assert.equal(clip("短", 30, 10), "短");
  assert.deepEqual(wrap("一二三四五六七", 30, 10, 2), ["一二三", "四五…"]);
  assert.deepEqual(wrap("一二", 30, 10, 2), ["一二"]);
});

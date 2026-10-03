/**
 * 行标签里的鹈鹕通过率：只统计带评分标准的题目；分母是这一行可见的全部卡片，
 * 分子只认评审结论「智商在线」；按思考强度从低到高分列。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

(globalThis as unknown as { React: typeof React }).React = React;

import { rowPassRate } from "@/app/components/timeline/pass-rate";
import { RowPassRate } from "@/app/components/timeline/RowPassRate";
import type { Verdict } from "@/core/judge/schema";
import type { DashboardCard } from "@/core/types";

function card(effort: string, status: string, verdict: Verdict | null = null): DashboardCard {
  return {
    cli: "codex", model: "gpt-6-sol", promptId: "animated-pelican-v1", effort, status,
    judge: verdict === null ? null : { total: { verdict, score: 80, maxScore: 100 } },
  } as unknown as DashboardCard;
}

const cards = [
  card("high", "ok", "online"), card("low", "ok", "degraded"), card("high", "timeout"),
  card("low", "ok", "online"), card("max", "ok", "pending"), card("low", "ok"),
];

test("rowPassRate：分子只认智商在线，分母含失败、待复核与未评审；强度从低到高分列", () => {
  const rate = rowPassRate("animated-pelican-v1", cards);
  assert.deepEqual(rate, {
    total: { online: 2, total: 6 },
    byEffort: [
      { effort: "low", online: 1, total: 3 },
      { effort: "high", online: 1, total: 2 },
      { effort: "max", online: 0, total: 1 },
    ],
  });
});

test("rowPassRate：题目没有评分标准时不统计", () => {
  assert.equal(rowPassRate("classic-v1", cards), null);
  assert.deepEqual(rowPassRate("animated-pelican-v1", []), { total: { online: 0, total: 0 }, byEffort: [] });
});

test("RowPassRate：合计一行加按强度的树状分列，最后一行用 └；无评分标准的题目不渲染", () => {
  const html = renderToStaticMarkup(React.createElement(RowPassRate, { promptId: "animated-pelican-v1", cards }));
  assert.match(html, /合计 2\/6/);
  assert.match(html, /├<\/span>low 1\/3/);
  assert.match(html, /├<\/span>high 1\/2/);
  assert.match(html, /└<\/span>max 0\/1/);
  assert.equal(renderToStaticMarkup(React.createElement(RowPassRate, { promptId: "classic-v1", cards })), "");
});

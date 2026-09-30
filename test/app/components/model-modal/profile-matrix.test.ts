/**
 * 对比矩阵：列 = 上游（登录态在前）、行 = 有结果的强度；空格画"—"；卡片副标题不带上游名；
 * 弹窗副标题按上游计数。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ModelModal } from "@/app/components/model-modal/ModelModal";
import { matrixEfforts, ProfileMatrix } from "@/app/components/model-modal/ProfileMatrix";
import type { Moment } from "@/app/components/timeline/moments";
import type { DashboardCard } from "@/core/types";

(globalThis as unknown as { React: typeof React }).React = React;

function card(effort: string, profile?: string): DashboardCard {
  return {
    runId: "20260929T100000Z", runStartedAt: "2026-09-29T10:00:00Z", runInProgress: false, judge: null,
    targetId: `codex__gpt-6-sol__${effort}${profile === undefined ? "" : `__${profile}`}`,
    cli: "codex", model: "gpt-6-sol", effort, appliedEffort: effort, effortHonored: true,
    promptId: "animated-pelican-v1", promptText: "p", label: `gpt-6-sol · ${effort} · ${profile ?? "登录态"}`,
    status: "ok", svgFile: null, rawFile: "x.raw.txt", svgBytes: null, durationMs: 1000,
    startedAt: "2026-09-29T10:00:00Z", finishedAt: "2026-09-29T10:00:01Z",
    cost: { status: "unpriced", usd: null, modelId: null, channelId: null, serviceTier: "standard", catalogTag: null, lines: [], note: null },
    usage: null, bindings: {}, trigger: "manual", error: null,
    ...(profile === undefined ? {} : { profile }),
  } as unknown as DashboardCard;
}

const cards = [card("high"), card("high", "relay-a"), card("low", "relay-a")];

test("matrixEfforts：只留有结果的档位，按给定顺序", () => {
  assert.deepEqual(matrixEfforts(cards, ["low", "medium", "high"]), ["low", "high"]);
});

test("ProfileMatrix：列标题登录态不可点、上游名可点开信息卡；空格为 —；副标题只留 model · effort", () => {
  const html = renderToStaticMarkup(
    React.createElement(ProfileMatrix, { cards, upstreams: ["default", "relay-a"], efforts: ["low", "high"], timeZone: "UTC" }),
  );
  assert.match(html, /style="--upstream-count:2"/);
  assert.match(html, /<span class="profile-matrix-login">登录态<\/span>/);
  assert.match(html, /<button[^>]*class="profile-name"[^>]*aria-haspopup="dialog"[^>]*>.*relay-a/);
  assert.equal((html.match(/profile-matrix-empty/g) ?? []).length, 1);
  assert.equal((html.match(/<article class="card">/g) ?? []).length, 3);
  assert.match(html, /class="subject" title="gpt-6-sol · high">gpt-6-sol · high</);
  assert.doesNotMatch(html, /· 登录态</);
  assert.match(html, /官价 —/);
});

test("ModelModal：多上游时走矩阵并按上游计数；单上游时仍是卡片网格", () => {
  const moment = { runId: "20260929T100000Z", dayKey: "2026-09-29", clock: "10:00", fraction: 0.4, startedAt: "2026-09-29T10:00:00Z", okCount: 3, cards } as Moment;
  const row = { key: "codex/gpt-6-sol/animated-pelican-v1", cli: "codex", model: "gpt-6-sol", promptId: "animated-pelican-v1" };
  const multi = renderToStaticMarkup(React.createElement(ModelModal, { moment, row, efforts: ["low", "high"], timeZone: "UTC", onClose: () => {} }));
  assert.match(multi, /2 个上游 · 成功 3/);
  assert.match(multi, /class="profile-matrix"/);
  const single = renderToStaticMarkup(
    React.createElement(ModelModal, { moment: { ...moment, cards: [cards[0]!] }, row, efforts: ["low", "high"], timeZone: "UTC", onClose: () => {} }),
  );
  assert.match(single, /1 个强度 · 成功 1/);
  assert.match(single, /class="card-grid"/);
  assert.doesNotMatch(single, /profile-matrix/);
});

/**
 * 多上游落角：同一角的代表作品取登录态、否则配置顺序第一个；每角计数；行标题的上游清单。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { cellUpstreams, folderCell, slotCount, slotMarks } from "@/app/components/timeline/effort-slots";
import type { Moment } from "@/app/components/timeline/moments";
import type { ProfileView } from "@/core/profile-view";
import type { DashboardCard } from "@/core/types";

function card(effort: string, profile?: string): DashboardCard {
  return {
    cli: "codex", model: "gpt-6-sol", promptId: "animated-pelican-v1", effort, status: "ok",
    targetId: `codex__gpt-6-sol__${effort}${profile === undefined ? "" : `__${profile}`}`,
    ...(profile === undefined ? {} : { profile }),
  } as unknown as DashboardCard;
}

const profiles: ProfileView[] = [
  { name: "relay-a", label: "甲", cli: "codex", upstreamType: "t", group: null, website: null, multiplier: 1, enabled: true },
  { name: "relay-b", label: "乙", cli: "codex", upstreamType: "t", group: null, website: null, multiplier: 1, enabled: true },
];
const row = { key: "codex/gpt-6-sol/animated-pelican-v1", cli: "codex", model: "gpt-6-sol", promptId: "animated-pelican-v1" };
const moment = {
  runId: "r1", cards: [card("high", "relay-b"), card("low", "relay-b"), card("high", "relay-a"), card("high")],
} as unknown as Moment;

test("folderCell：同档位内登录态在前、其余按配置顺序；代表作品取登录态，没有登录态取配置顺序第一个", () => {
  const cell = folderCell(moment, row, ["low", "high"], ["low", "high"], profiles);
  assert.ok(cell);
  assert.deepEqual(cell.cards.map((item) => item.targetId), [
    "codex__gpt-6-sol__low__relay-b",
    "codex__gpt-6-sol__high",
    "codex__gpt-6-sol__high__relay-a",
    "codex__gpt-6-sol__high__relay-b",
  ]);
  assert.equal(cell.slotCards[0]?.targetId, "codex__gpt-6-sol__low__relay-b");
  assert.equal(cell.slotCards[1]?.targetId, "codex__gpt-6-sol__high");
  assert.equal(slotCount(cell, "high"), 3);
  assert.equal(slotCount(cell, "low"), 1);
});

test("folderCell：没有配置清单时也把登录态排在前面，其余按名字", () => {
  const cell = folderCell(moment, row, ["high"], ["low", "high"]);
  assert.ok(cell);
  assert.equal(cell.slotCards[0]?.targetId, "codex__gpt-6-sol__high");
  assert.deepEqual(cell.cards.slice(2, 4).map((item) => item.profile), ["relay-a", "relay-b"]);
});

test("cellUpstreams：去掉登录态，按配置顺序", () => {
  assert.deepEqual(cellUpstreams(moment.cards, profiles), ["relay-a", "relay-b"]);
  assert.deepEqual(cellUpstreams([card("high")], profiles), []);
});

function judged(effort: string, profile: string | undefined, verdict: "online" | "degraded" | "pending" | null): DashboardCard {
  return { ...card(effort, profile), judge: verdict === null ? null : { total: { verdict } } } as unknown as DashboardCard;
}

test("slotMarks：三件以内按弹窗列序逐件列，缺评审记录的占位为待复核；超过三件按结论计数且 0 的不列；整角无记录不出图标", () => {
  const crowded = {
    runId: "r2", cards: [judged("high", undefined, "online"), judged("high", "relay-a", null), judged("high", "relay-b", "degraded"), judged("high", "relay-c", "online")],
  } as unknown as Moment;
  const many = [...profiles, { ...profiles[0]!, name: "relay-c", label: "丙" }];
  const cell = folderCell(crowded, row, ["high"], ["high"], many);
  assert.ok(cell);
  assert.deepEqual(slotMarks(cell, "high"), { kind: "summary", counts: [{ verdict: "online", count: 2 }, { verdict: "degraded", count: 1 }, { verdict: "pending", count: 1 }] });
  const three = folderCell({ runId: "r4", cards: crowded.cards.slice(0, 3) } as unknown as Moment, row, ["high"], ["high"], many);
  assert.ok(three);
  assert.deepEqual(slotMarks(three, "high"), { kind: "list", verdicts: ["online", "pending", "degraded"] });
  const noPending = folderCell({ runId: "r5", cards: [judged("high", undefined, "online"), judged("high", "relay-a", "online"), judged("high", "relay-b", "online"), judged("high", "relay-c", "degraded")] } as unknown as Moment, row, ["high"], ["high"], many);
  assert.ok(noPending);
  assert.deepEqual(slotMarks(noPending, "high"), { kind: "summary", counts: [{ verdict: "online", count: 3 }, { verdict: "degraded", count: 1 }] }, "为 0 的结论不列");
  const unjudged = folderCell({ runId: "r3", cards: [judged("high", undefined, null), judged("high", "relay-a", null)] } as unknown as Moment, row, ["high"], ["high"], profiles);
  assert.ok(unjudged);
  assert.deepEqual(slotMarks(unjudged, "high"), { kind: "list", verdicts: [] });
  assert.deepEqual(slotMarks(cell, "low"), { kind: "list", verdicts: [] }, "没跑的角没有图标");
});

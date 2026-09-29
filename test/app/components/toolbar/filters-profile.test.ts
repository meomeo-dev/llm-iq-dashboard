/**
 * 上游筛选：登录态记为 default；"上游"一节只在有第三方上游结果时出现，标签取显示名。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { cardFilterValue, FILTER_KEYS, isCardShown, NO_FILTERS } from "@/app/components/toolbar/filters";
import { buildFilterGroups } from "@/app/components/toolbar/toolbar-filter-groups";
import type { ProfileView } from "@/core/profile-view";
import type { DashboardCard } from "@/core/types";

function card(profile?: string): DashboardCard {
  return { cli: "codex", model: "gpt-6-sol", effort: "high", promptId: "p", ...(profile === undefined ? {} : { profile }) } as DashboardCard;
}

const profiles: ProfileView[] = [
  { name: "relay-a", label: "甲", cli: "codex", upstreamType: "t", group: null, website: null, multiplier: 1, enabled: true },
];

test("cardFilterValue / isCardShown：登录态记为 default，隐藏某上游只影响它的卡片", () => {
  assert.ok(FILTER_KEYS.includes("profile"));
  assert.equal(cardFilterValue(card(), "profile"), "default");
  assert.equal(cardFilterValue(card("relay-a"), "profile"), "relay-a");
  const hidden = { ...NO_FILTERS, profile: new Set(["relay-a"]) };
  assert.equal(isCardShown(card(), hidden), true);
  assert.equal(isCardShown(card("relay-a"), hidden), false);
});

test("buildFilterGroups：有第三方上游时在 CLI 后加“上游”一节；只有登录态时没有", () => {
  const without = buildFilterGroups([card()], {}, profiles);
  assert.deepEqual(without.map((group) => group.key), ["cli", "model", "effort", "promptId"]);
  const groups = buildFilterGroups([card(), card("relay-a"), card("gone")], {}, profiles);
  assert.deepEqual(groups.map((group) => group.key), ["cli", "profile", "model", "effort", "promptId"]);
  const upstream = groups[1]!;
  assert.equal(upstream.label, "上游");
  assert.deepEqual(upstream.items.map((item) => [item.value, item.label, item.count]), [
    ["default", "登录态", 1], ["gone", "gone", 1], ["relay-a", "甲", 1],
  ]);
  assert.equal(upstream.items[0]!.marker, undefined);
  assert.match(renderToStaticMarkup(React.createElement(React.Fragment, null, upstream.items[2]!.marker)), /profile-dot/);
});

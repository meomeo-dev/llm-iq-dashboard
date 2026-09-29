/**
 * 上游公开视图：只下发白名单字段，接口地址、查询参数与 key 不出现；排序与显示名。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import type { ProfileConfig } from "@/core/config/types";
import { orderProfileNames, PROFILE_VIEW_FIELDS, profileLabel, toProfileView, toProfileViews } from "@/core/profile-view";

const relay: ProfileConfig = {
  name: "relay-a",
  label: "甲 0.07",
  cli: "codex",
  upstreamType: "chatgpt-plus",
  group: "稳定分组",
  website: "https://relay.example",
  baseUrl: "https://api.relay.example/v1",
  queryParams: { "api-version": "2026-01-01" },
  models: ["gpt-6-sol"],
  pricing: { multiplier: 0.07, overrides: {} },
  enabled: true,
};

test("toProfileView：字段恰为白名单，不含 baseUrl / queryParams / models", () => {
  const view = toProfileView(relay);
  assert.deepEqual(Object.keys(view).sort(), [...PROFILE_VIEW_FIELDS].sort());
  const text = JSON.stringify(view);
  assert.doesNotMatch(text, /api\.relay\.example|api-version|baseUrl|queryParams|models/);
  assert.equal(view.label, "甲 0.07");
  assert.equal(view.multiplier, 0.07);
  assert.equal(toProfileView({ ...relay, label: null }).label, "relay-a");
});

test("orderProfileNames / profileLabel：登录态在前、配置顺序、已删除的在最后", () => {
  const views = toProfileViews([relay, { ...relay, name: "relay-b", label: null }]);
  assert.deepEqual(orderProfileNames(["gone", "relay-b", "default", "relay-a", "relay-b"], views), [
    "default", "relay-a", "relay-b", "gone",
  ]);
  assert.equal(profileLabel("default", views), "登录态");
  assert.equal(profileLabel("relay-b", views), "relay-b");
  assert.equal(profileLabel("gone", views), "gone");
});

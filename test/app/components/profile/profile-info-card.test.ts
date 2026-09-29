/**
 * 上游信息卡：只显示公开字段，配对设备才有编辑链接，已删除的上游写明"配置中已不存在"。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProfileInfoCard } from "@/app/components/profile/ProfileInfoCard";
import { profileColor } from "@/app/components/profile/profile-color";
import type { ProfileView } from "@/core/profile-view";
import type { DashboardCard } from "@/core/types";

(globalThis as unknown as { React: typeof React }).React = React;

const view: ProfileView = {
  name: "relay-a",
  label: "甲 稳定分组 0.07",
  cli: "codex",
  upstreamType: "chatgpt-plus",
  group: "稳定分组",
  website: "https://relay.example/pricing",
  multiplier: 0.07,
  enabled: true,
};

const card = {
  runId: "20260929T100000Z",
  targetId: "codex__gpt-6-sol__high__relay-a",
  promptId: "animated-pelican-v1",
  effort: "high",
  durationMs: 130_000,
  cost: { status: "priced", usd: 0.012, modelId: "gpt-6-sol", channelId: "openai", serviceTier: "standard", catalogTag: "t", lines: [], note: null },
} as unknown as DashboardCard;

function render(props: Partial<Parameters<typeof ProfileInfoCard>[0]>): string {
  return renderToStaticMarkup(
    React.createElement(ProfileInfoCard, {
      name: "relay-a", profile: view, cards: [card], owner: false, closeRef: { current: null }, onClose: () => {}, ...props,
    }),
  );
}

test("显示名、标识与类型、分组、倍率、官网域名、本件耗时与折算成本；不含接口地址", () => {
  const html = render({});
  assert.match(html, /role="dialog"/);
  assert.match(html, /甲 稳定分组 0.07/);
  assert.match(html, /relay-a · chatgpt-plus/);
  assert.match(html, /稳定分组/);
  assert.match(html, /× 0.07（官价 × 倍率）/);
  assert.match(html, /relay.example ↗/);
  assert.match(html, /本件 耗时 2m10s · 官价 \$0.012 · 折算 &lt;\$0.001/);
  assert.doesNotMatch(html, /在配置页编辑/);
  assert.doesNotMatch(html, /api\.|baseUrl|key/);
});

test("配对设备才有编辑链接；已删除的上游只显示标识与提示", () => {
  assert.match(render({ owner: true }), /href="\/config#profiles"[^>]*>在配置页编辑/);
  const gone = render({ profile: null, name: "old-relay" });
  assert.match(gone, /old-relay · <span class="profile-card-gone">配置中已不存在/);
  assert.doesNotMatch(gone, /折算/);
});

test("profileColor：同名同色，落在调色板内", () => {
  assert.equal(profileColor("relay-a"), profileColor("relay-a"));
  assert.match(profileColor("relay-a"), /^#[0-9a-f]{6}$/);
});

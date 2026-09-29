/**
 * 跑一次的上游选择：可用上游与原因、调用数、按钮三态、勾选记忆与模态标记。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { RunOptionsView } from "@/app/api/run/route";
import { RunOnceProfileModal } from "@/app/components/run-control/RunOnceProfileModal";
import {
  countCalls,
  describeRound,
  profileChoices,
  resolvePickedProfiles,
  startMode,
} from "@/app/components/run-control/run-once-profiles";

(globalThis as unknown as { React: typeof React }).React = React;

function options(overrides: Partial<RunOptionsView> = {}): RunOptionsView {
  return {
    targets: [
      { id: "codex__gpt-6-sol__high", label: "gpt-6-sol · high", cli: "codex", model: "gpt-6-sol", effort: "high", defaultSelected: true },
      { id: "codex__gpt-5.5__low", label: "gpt-5.5 · low", cli: "codex", model: "gpt-5.5", effort: "low", defaultSelected: true },
      { id: "claude__sonnet__medium", label: "sonnet · medium", cli: "claude", model: "sonnet", effort: "medium", defaultSelected: true },
    ],
    unavailable: [],
    profiles: [
      { name: "relay-a", label: "甲 0.07", cli: "codex", enabled: true, hasKey: true, models: ["gpt-6-sol", "gpt-5.5"] },
      { name: "relay-b", label: "乙 0.16", cli: "codex", enabled: true, hasKey: true, models: [] },
      { name: "relay-off", label: "停用的", cli: "codex", enabled: false, hasKey: true, models: [] },
      { name: "relay-nokey", label: "没 key 的", cli: "codex", enabled: true, hasKey: false, models: [] },
      { name: "relay-narrow", label: "只有 5.5", cli: "codex", enabled: true, hasKey: true, models: ["gpt-5.5"] },
    ],
    loginUnavailable: [],
    prompts: [
      { id: "animated-pelican-v1", label: "动态鹈鹕车", defaultSelected: true },
      { id: "classic-v1", label: "经典版", defaultSelected: false },
    ],
    activeRunId: null,
    costs: { expected: {}, spentLastDayUsd: 0, budget: { perRoundUsd: null, perDayUsd: null } },
    ...overrides,
  };
}

const SOL_HIGH = new Set(["codex__gpt-6-sol__high"]);

test("profileChoices：登录态在前；停用、缺 key、模型不在清单各有原因；未选 codex 时为空", () => {
  const choices = profileChoices(options(), SOL_HIGH);
  assert.deepEqual(
    choices.map(({ id, available, reason }) => ({ id, available, reason })),
    [
      { id: "default", available: true, reason: null },
      { id: "relay-a", available: true, reason: null },
      { id: "relay-b", available: true, reason: null },
      { id: "relay-off", available: false, reason: "已停用" },
      { id: "relay-nokey", available: false, reason: "未填 key" },
      { id: "relay-narrow", available: false, reason: "没有 gpt-6-sol" },
    ],
  );
  assert.deepEqual(profileChoices(options(), new Set(["claude__sonnet__medium"])), []);
  const blocked = profileChoices(options({ loginUnavailable: ["codex"] }), SOL_HIGH);
  assert.deepEqual(blocked[0], { id: "default", label: "登录态", available: false, reason: "未登录" });
});

test("countCalls：支持上游的组合乘以上游数，其余算一次，再乘题数", () => {
  const picked = new Set(["codex__gpt-6-sol__high", "claude__sonnet__medium"]);
  assert.equal(countCalls(options(), picked, 2, ["relay-a", "relay-b", "default"]), (3 + 1) * 2);
  assert.equal(countCalls(options(), SOL_HIGH, 1, []), 0);
});

test("resolvePickedProfiles：没有记忆时全选可用项；有记忆时取交集", () => {
  const choices = profileChoices(options(), SOL_HIGH);
  assert.deepEqual(resolvePickedProfiles(choices, null), ["default", "relay-a", "relay-b"]);
  assert.deepEqual(resolvePickedProfiles(choices, ["relay-b", "relay-off", "gone"]), ["relay-b"]);
});

test("startMode：不涉及上游直接开始且不带 profiles；只有一个可用直接开始；多个先选；零个置灰", () => {
  const claudeOnly = new Set(["claude__sonnet__medium"]);
  assert.deepEqual(startMode(options(), claudeOnly, 2), { kind: "direct", profiles: undefined, calls: 2 });
  assert.deepEqual(startMode(null, claudeOnly, 2), { kind: "direct", profiles: undefined, calls: 2 });
  assert.deepEqual(startMode(options(), SOL_HIGH, 1), { kind: "choose" });

  const single = options({ profiles: [], loginUnavailable: [] });
  assert.deepEqual(startMode(single, SOL_HIGH, 1), { kind: "direct", profiles: ["default"], calls: 1 });
  const onlyRelay = options({ profiles: options().profiles.slice(0, 1), loginUnavailable: ["codex"] });
  assert.deepEqual(startMode(onlyRelay, SOL_HIGH, 2), { kind: "direct", profiles: ["relay-a"], calls: 2 });
  const none = options({ profiles: [], loginUnavailable: ["codex"] });
  assert.deepEqual(startMode(none, SOL_HIGH, 1), { kind: "none", reason: "没有可用的上游" });
});

test("describeRound：复述组合与题目，超过三个收成“等 N 个”", () => {
  assert.equal(describeRound(options(), SOL_HIGH, new Set(["animated-pelican-v1"])), "gpt-6-sol · high × 动态鹈鹕车");
  const many = options({
    targets: ["a", "b", "c", "d"].map((model) => ({
      id: `codex__${model}__low`, label: model, cli: "codex", model, effort: "low", defaultSelected: true,
    })),
  });
  const all = new Set(many.targets.map((target) => target.id));
  assert.equal(describeRound(many, all, new Set(["classic-v1"])), "a · low、b · low、c · low 等 4 个 × 经典版");
});

test("RunOnceProfileModal：不可用项置灰并写原因，按钮显示 Profile 数与调用数", () => {
  const html = renderToStaticMarkup(
    React.createElement(RunOnceProfileModal, {
      round: "gpt-6-sol · high × 动态鹈鹕车",
      choices: profileChoices(options(), SOL_HIGH),
      picked: new Set(["relay-a", "relay-b"]),
      calls: 2,
      loginOnlyNote: null,
      busy: false,
      onPick: () => {},
      onStart: () => {},
      onCancel: () => {},
    }),
  );
  assert.match(html, /role="dialog"/);
  assert.match(html, /gpt-6-sol · high × 动态鹈鹕车/);
  assert.match(html, /开始（2 个 Profile，共 2 次调用）/);
  assert.match(html, /profile-choice-off[^>]*><input type="checkbox" disabled=""/);
  assert.match(html, /没有 gpt-6-sol/);
  assert.equal((html.match(/checked=""/g) ?? []).length, 2);
});

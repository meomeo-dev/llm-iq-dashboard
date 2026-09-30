/**
 * 预检拦截分两级：CLI 没装时整家拦；只是没登录时只拦登录态调用，
 * 经 profile 的调用用 API key 鉴权照常放行，但仍受 profile 自身的拦截约束。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { callBlocker, splitPreflight, type CallBlockers } from "@/core/run/prepare";

const signedOut = { cli: "codex" as const, state: "signed-out" as const, detail: "codex 未登录" };
const missing = { cli: "claude" as const, state: "missing" as const, detail: "claude 未安装" };
const unverified = { cli: "agy" as const, state: "unverified" as const, detail: "网络失败" };

function blockersFrom(profile: Record<string, string> = {}): CallBlockers {
  return { ...splitPreflight([signedOut, missing, unverified]), profile: new Map(Object.entries(profile)) };
}

test("未登录只进登录态表，未安装进整家表，unverified 不拦", () => {
  const { cli, login } = splitPreflight([signedOut, missing, unverified]);
  assert.deepEqual([...cli.keys()], ["claude"]);
  assert.deepEqual([...login.keys()], ["codex"]);
});

test("codex 未登录：登录态调用被拦，profile 调用放行", () => {
  const blockers = blockersFrom();
  assert.match(callBlocker(blockers, { cli: "codex" }) ?? "", /未登录/);
  assert.equal(callBlocker(blockers, { cli: "codex", profile: "relay-a" }), undefined);
});

test("profile 自身的拦截仍生效；CLI 未安装时 profile 调用也拦", () => {
  const blockers = blockersFrom({ "relay-b": "profile relay-b 还没有填 API key，未发起调用" });
  assert.match(callBlocker(blockers, { cli: "codex", profile: "relay-b" }) ?? "", /API key/);
  assert.match(callBlocker(blockers, { cli: "claude", profile: "relay-c" }) ?? "", /未安装/);
  assert.equal(callBlocker(blockers, { cli: "agy" }), undefined);
});

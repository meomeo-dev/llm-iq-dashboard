/** 配置页 profile 段的纯函数 */

import assert from "node:assert/strict";
import { test } from "node:test";
import type { CapabilitySnapshot } from "@/capabilities/types";
import type { ProfileConfig } from "@/core/config";
import type { Target } from "@/core/types";
import {
  addUpstreamType,
  createProfile,
  modelAfterProfileChange,
  parseModelList,
  profileUsage,
  renameProfile,
  upstreamTypeInUse,
} from "@/app/config/profile-panel-model";

const profile = (name: string, models: string[] = ["gpt-5.5"]): ProfileConfig => ({
  name,
  cli: "codex",
  upstreamType: "compatible",
  group: null,
  website: null,
  baseUrl: "https://api.example.com/v1",
  queryParams: {},
  models,
  pricing: { multiplier: 1, overrides: {} },
  enabled: true,
});

const target = (profileName?: string): Target => ({
  id: "t",
  cli: "codex",
  ...(profileName === undefined ? {} : { profile: profileName }),
  model: "gpt-5.5",
  effort: "low",
  label: "",
  timeoutMs: 1000,
  extraArgs: [],
  enabled: true,
});

test("createProfile: 占位名跳过已占用的序号，上游类型取清单第一个", () => {
  const created = createProfile([profile("profile-2")], ["chatgpt-plus", "compatible"]);
  assert.equal(created.name, "profile-3");
  assert.equal(created.upstreamType, "chatgpt-plus");
  assert.equal(created.enabled, true);
});

test("renameProfile: 引用旧名的目标跟着改，其他目标不动", () => {
  const { profiles, targets } = renameProfile([profile("a")], [target("a"), target()], 0, "b");
  assert.equal(profiles[0]!.name, "b");
  assert.deepEqual(targets.map((item) => item.profile), ["b", undefined]);
});

test("profileUsage 与 upstreamTypeInUse: 被引用时计数与守卫", () => {
  assert.equal(profileUsage([target("a"), target("a"), target()], profile("a")), 2);
  assert.equal(upstreamTypeInUse([profile("a")], "compatible"), true);
  assert.equal(upstreamTypeInUse([profile("a")], "azure"), false);
});

test("parseModelList: 逗号与空白分隔，去空去重", () => {
  assert.deepEqual(parseModelList("gpt-5.5, gpt-6-mini  gpt-5.5,\n,"), ["gpt-5.5", "gpt-6-mini"]);
});

test("addUpstreamType: kebab-case 且不重复", () => {
  assert.deepEqual(addUpstreamType(["a"], " chatgpt-pro-10x "), { next: ["a", "chatgpt-pro-10x"] });
  assert.ok("error" in addUpstreamType(["a"], "a"));
  assert.ok("error" in addUpstreamType(["a"], "Pro 10x"));
});

test("modelAfterProfileChange: 当前模型不在新清单里时换成清单第一个", () => {
  const catalog = {
    clis: [{ cli: "codex", models: [{ id: "gpt-6-luna" }] }],
  } as unknown as CapabilitySnapshot;
  assert.equal(modelAfterProfileChange(catalog, profile("a", ["gpt-5.5"]), "codex", "gpt-5.5"), "gpt-5.5");
  assert.equal(modelAfterProfileChange(catalog, profile("a", ["m2"]), "codex", "gpt-5.5"), "m2");
  assert.equal(modelAfterProfileChange(catalog, undefined, "codex", "gpt-5.5"), "gpt-6-luna");
});

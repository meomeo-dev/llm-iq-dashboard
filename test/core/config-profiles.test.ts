/**
 * profiles 解析、targets[].profile 引用与写回。
 * 默认 profile 的目标 id、显示名与文件内容必须与引入 profile 之前逐字相同。
 */

import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { DEFAULT_UPSTREAM_TYPES, loadConfig } from "@/core/config";
import { applyConfigPatch } from "@/core/config-writer";
import { buildTargetId } from "@/core/types";

async function withConfig<T>(yaml: string, body: (path: string) => Promise<T>): Promise<T> {
  const workdir = await mkdtemp(join(tmpdir(), "llm-iq-profiles-"));
  const path = join(workdir, "pelican.config.yaml");
  await writeFile(path, yaml, "utf8");
  try {
    return await body(path);
  } finally {
    await rm(workdir, { recursive: true, force: true });
  }
}

const PROFILE_YAML = `run:
  promptIds: [classic-v1]
upstreamTypes: [chatgpt-pro-5x, reseller-pool]
profiles:
  - name: kedaya-group-a
    cli: codex
    upstreamType: chatgpt-pro-5x
    group: group-a
    website: https://kedaya.ai/
    baseUrl: https://api.kedaya.ai/v1
    queryParams: { api-version: "2025-04-01" }
    models: [gpt-5.5]
    pricing:
      multiplier: 0.08
      overrides:
        gpt-5.5: { input: 0.1, output: 0.8 }
targets:
  - cli: codex
    model: gpt-5.5
    effort: high
  - cli: codex
    profile: kedaya-group-a
    model: gpt-5.5
    effort: high
`;

test("buildTargetId: 默认 profile 不带第四段，非默认追加并折叠不安全字符", () => {
  assert.equal(buildTargetId("codex", "gpt-5.5", "high"), "codex__gpt-5.5__high");
  assert.equal(buildTargetId("codex", "gpt-5.5", "high", "default"), "codex__gpt-5.5__high");
  assert.equal(buildTargetId("codex", "gpt-5.5", "high", "kedaya-a"), "codex__gpt-5.5__high__kedaya-a");
});

test("loadConfig: 解析 profiles，同模型同强度的两个 profile 是两个目标", async () => {
  await withConfig(PROFILE_YAML, async (path) => {
    const config = loadConfig(path);

    assert.deepEqual(config.upstreamTypes, ["chatgpt-pro-5x", "reseller-pool"]);
    assert.equal(config.profiles.length, 1);
    const profile = config.profiles[0]!;
    assert.equal(profile.name, "kedaya-group-a");
    assert.equal(profile.upstreamType, "chatgpt-pro-5x");
    assert.equal(profile.enabled, true);
    assert.equal(profile.baseUrl, "https://api.kedaya.ai/v1");
    assert.deepEqual(profile.queryParams, { "api-version": "2025-04-01" });
    assert.deepEqual(profile.models, ["gpt-5.5"]);
    assert.equal(profile.pricing.multiplier, 0.08);
    assert.deepEqual(profile.pricing.overrides, { "gpt-5.5": { input: 0.1, output: 0.8 } });

    const [byLogin, byProfile] = config.targets;
    assert.equal(byLogin!.profile, undefined, "默认 profile 不写字段");
    assert.equal(byLogin!.id, "codex__gpt-5.5__high");
    assert.equal(byLogin!.label, "gpt-5.5 · high");
    assert.equal(byProfile!.profile, "kedaya-group-a");
    assert.equal(byProfile!.id, "codex__gpt-5.5__high__kedaya-group-a");
    assert.equal(byProfile!.label, "gpt-5.5 · high · kedaya-group-a");
  });
});

test("loadConfig: 没写 profiles 时为空数组、上游类型取起步清单，目标全部落在默认 profile", async () => {
  const yaml = `run:\n  promptIds: [classic-v1]\ntargets:\n  - cli: claude\n    model: m\n    effort: low\n`;
  await withConfig(yaml, async (path) => {
    const config = loadConfig(path);
    assert.deepEqual(config.profiles, []);
    assert.deepEqual(config.upstreamTypes, DEFAULT_UPSTREAM_TYPES);
    assert.equal(config.targets[0]!.profile, undefined);
  });
});

const INVALID_PROFILES = `run:
  promptIds: [classic-v1]
upstreamTypes: [chatgpt-plus, Bad Type, chatgpt-plus]
profiles:
  - name: default
    cli: codex
    upstreamType: chatgpt-plus
    baseUrl: https://x.example/v1
    models: [m]
  - name: Bad_Name
    cli: codex
    upstreamType: chatgpt-plus
    baseUrl: https://x.example/v1
    models: [m]
  - name: not-codex
    cli: claude
    upstreamType: chatgpt-plus
    baseUrl: https://x.example/v1
    models: [m]
  - name: no-url
    cli: codex
    upstreamType: chatgpt-plus
    models: [m]
  - name: plain-http
    cli: codex
    upstreamType: chatgpt-plus
    baseUrl: http://x.example/v1
    models: [m]
  - name: no-models
    cli: codex
    upstreamType: chatgpt-plus
    baseUrl: https://x.example/v1
  - name: bad-type
    cli: codex
    upstreamType: reseller
    baseUrl: https://x.example/v1
    models: [m]
  - name: bad-price
    cli: codex
    upstreamType: chatgpt-plus
    baseUrl: https://x.example/v1
    models: [m]
    pricing: { multiplier: 0 }
  - name: bad-enabled
    cli: codex
    upstreamType: chatgpt-plus
    baseUrl: https://x.example/v1
    models: [m]
    enabled: "no"
  - name: dup
    cli: codex
    upstreamType: chatgpt-plus
    baseUrl: https://x.example/v1
    models: [m]
  - name: dup
    cli: codex
    upstreamType: chatgpt-plus
    baseUrl: https://x.example/v1
    models: [m]
targets:
  - cli: codex
    profile: missing
    model: m
    effort: low
`;

test("loadConfig: profiles 的每类错误都被报出，目标引用不存在的 profile 报错", async () => {
  await withConfig(INVALID_PROFILES, async (path) => {
    let message = "";
    try {
      loadConfig(path);
    } catch (cause) {
      message = (cause as Error).message;
    }
    for (const expected of [
      "upstreamTypes[1] 必须是 kebab-case",
      "upstreamTypes[2] 与前面的条目重复：chatgpt-plus",
      "profiles[0].name 不能是 default",
      "profiles[1].name 必须是 kebab-case",
      "profiles[2].cli 目前只支持 codex",
      "profiles[3].baseUrl 缺失",
      "profiles[4].baseUrl 必须是 https 地址",
      "profiles[5].models 缺失",
      "profiles[6].upstreamType 必须是 chatgpt-plus，当前为 reseller",
      "profiles[7].pricing.multiplier 必须是大于 0 的数",
      "profiles[8].enabled 必须是布尔值",
      "profiles[10].name 与前面的条目重复：dup",
      "targets[0].profile 引用了 profiles 里没有的 codex profile：missing",
    ]) {
      assert.match(message, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
  });
});

test("applyConfigPatch: profile 只在非默认时写出，同模型两个 profile 各认领自己的节点", async () => {
  await withConfig(PROFILE_YAML, async (path) => {
    const loaded = loadConfig(path);
    // 界面上把登录态那条取消定时，profile 那条保留；顺手停用 profile
    const flipped = loaded.targets.map((target) =>
      target.profile === undefined ? { ...target, enabled: false } : target,
    );
    const profiles = loaded.profiles.map((profile) => ({ ...profile, enabled: false }));
    const saved = await applyConfigPatch(path, {
      upstreamTypes: [...loaded.upstreamTypes, "added-later"],
      profiles,
      targets: flipped,
    });
    assert.equal(saved.profiles[0]!.enabled, false);
    assert.deepEqual(saved.upstreamTypes, ["chatgpt-pro-5x", "reseller-pool", "added-later"]);
    assert.deepEqual(
      saved.targets.map((target) => [target.profile, target.enabled]),
      [[undefined, false], ["kedaya-group-a", true]],
    );

    const text = await readFile(path, "utf8");
    const targetsSection = text.slice(text.indexOf("targets:"));
    assert.equal(targetsSection.match(/profile: kedaya-group-a/g)?.length, 1, "只有一条带 profile");
    assert.equal(targetsSection.match(/profile: default/g), null, "默认 profile 不写出");
    assert.match(targetsSection, /effort: high\n\s+label: .*\n\s+enabled: false\n/);
    assert.match(text, /multiplier: 0.08/);
    assert.doesNotMatch(text, /apiKey|secret/i);
  });
});

test("applyConfigPatch: 删掉 profile 后引用它的目标校验失败，原文件不动", async () => {
  await withConfig(PROFILE_YAML, async (path) => {
    const before = await readFile(path, "utf8");
    const loaded = loadConfig(path);
    await assert.rejects(
      applyConfigPatch(path, { profiles: [], targets: loaded.targets }),
      /引用了 profiles 里没有的 codex profile：kedaya-group-a/,
    );
    assert.equal(await readFile(path, "utf8"), before);
  });
});

test("profile 显示名：可含中文与标点，目标默认显示名用它；写回时原样保留", async () => {
  const yaml = `run:
  promptIds: [classic-v1]
profiles:
  - name: kedaya-tehui-005
    label: kedaya-我又来了特惠0.05
    cli: codex
    upstreamType: compatible
    group: 我又来了特惠0.05
    baseUrl: https://api.example.com/v1
    models: [gpt-5.5]
targets:
  - cli: codex
    profile: kedaya-tehui-005
    model: gpt-5.5
    effort: low
`;
  await withConfig(yaml, async (path) => {
    const config = loadConfig(path);
    assert.equal(config.profiles[0]!.label, "kedaya-我又来了特惠0.05");
    assert.equal(config.targets[0]!.id, "codex__gpt-5.5__low__kedaya-tehui-005");
    assert.equal(config.targets[0]!.label, "gpt-5.5 · low · kedaya-我又来了特惠0.05");

    const saved = await applyConfigPatch(path, { profiles: config.profiles, targets: config.targets });
    assert.equal(saved.profiles[0]!.label, "kedaya-我又来了特惠0.05");
    assert.equal(saved.profiles[0]!.group, "我又来了特惠0.05");
  });
});

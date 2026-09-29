/** 跑一次的可选范围：组合去重、上游清单的公开字段与 key 状态、登录态被拦时的补列 */

import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { dedupeCombos, keepProfileCapable, listProfileOptions } from "@/app/api/run/run-options";
import { loadConfig, type AppConfig } from "@/core/config";

const YAML = `run:
  promptIds: [classic-v1]
profiles:
  - { name: relay-a, cli: codex, upstreamType: compatible, baseUrl: "https://a.example/v1", queryParams: { k: v } }
  - { name: relay-b, cli: codex, upstreamType: compatible, baseUrl: "https://b.example/v1", label: 乙, enabled: false }
targets:
  - { cli: codex, model: m, effort: low, profile: relay-a }
  - { cli: codex, model: m, effort: low, label: 登录态 m, enabled: false }
  - { cli: codex, model: n, effort: high, profile: relay-a }
  - { cli: claude, model: c, effort: low }
`;

let workdir: string;
let config: AppConfig;

before(async () => {
  workdir = await mkdtemp(join(tmpdir(), "llm-iq-run-options-"));
  const path = join(workdir, "pelican.config.yaml");
  await writeFile(path, YAML, "utf8");
  config = loadConfig(path);
});

after(async () => {
  await rm(workdir, { recursive: true, force: true });
});

test("dedupeCombos：同组合合并为一项，显示名取登录态目标的，任一启用即默认勾选", () => {
  const combos = dedupeCombos(config.targets, config.profiles);
  assert.deepEqual(
    combos.map(({ id, label, defaultSelected }) => ({ id, label, defaultSelected })),
    [
      { id: "codex__m__low", label: "登录态 m", defaultSelected: true },
      { id: "codex__n__high", label: "n · high", defaultSelected: true },
      { id: "claude__c__low", label: "c · low", defaultSelected: true },
    ],
  );
});

test("listProfileOptions：只含公开字段与是否已填 key，不含接口地址与查询参数", () => {
  const options = listProfileOptions(config, { "codex:relay-a": { updatedAt: "2026-09-29T00:00:00Z" } });
  assert.deepEqual(options, [
    { name: "relay-a", label: "relay-a", cli: "codex", enabled: true, hasKey: true, models: [] },
    { name: "relay-b", label: "乙", cli: "codex", enabled: false, hasKey: false, models: [] },
  ]);
  assert.equal(JSON.stringify(options).includes("example"), false);
});

test("keepProfileCapable：codex 登录态被拦但有可用上游时，其组合仍列出并标记登录态不可用", () => {
  const profiles = listProfileOptions(config, { "codex:relay-a": { updatedAt: "x" } });
  const blocked = [{ cli: "codex" as const, state: "signed-out" as const, targets: 3, detail: "未登录" }];
  const callable = config.targets.filter((target) => target.cli === "claude");
  const kept = keepProfileCapable(config, callable, blocked, profiles);
  assert.deepEqual(kept.callable.map((target) => target.id), config.targets.map((target) => target.id));
  assert.deepEqual(kept.unavailable, []);
  assert.deepEqual(kept.loginUnavailable, ["codex"]);

  // 没有可用上游（都没填 key）时照旧隐藏
  const none = keepProfileCapable(config, callable, blocked, listProfileOptions(config, {}));
  assert.deepEqual(none.callable.map((target) => target.id), ["claude__c__low"]);
  assert.deepEqual(none.unavailable, blocked);
  assert.deepEqual(none.loginUnavailable, []);
});

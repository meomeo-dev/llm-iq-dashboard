/** 单次执行的选择只能收窄配置，不能选出配置中没有的目标或题目 */

import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { loadConfig, type AppConfig } from "@/core/config";
import { narrowConfig, scheduledRound } from "@/core/run-selection";

const CONFIG_YAML = `
run:
  promptIds: [xiyou-v1]
targets:
  - { cli: claude, model: m-a, effort: low }
  - { cli: claude, model: m-a, effort: high }
  - { cli: codex, model: m-b, effort: max }
  - { cli: claude, model: m-a, effort: medium, enabled: false }
`;

let workdir: string;
let config: AppConfig;

before(async () => {
  workdir = await mkdtemp(join(tmpdir(), "llm-iq-selection-"));
  const path = join(workdir, "pelican.config.yaml");
  await writeFile(path, CONFIG_YAML, "utf8");
  config = loadConfig(path);
});

after(async () => {
  await rm(workdir, { recursive: true, force: true });
});

test("按选择收窄目标与题目，目标保持配置顺序，其余配置不变", () => {
  const [first, , third] = config.targets.map((target) => target.id);
  const narrowed = narrowConfig(config, { targetIds: [third!, first!, first!], promptIds: ["classic-v1"] });

  assert.deepEqual(narrowed.targets.map((target) => target.id), [first, third]);
  assert.deepEqual(narrowed.run.promptIds, ["classic-v1"]);
  assert.equal(narrowed.run.concurrency, config.run.concurrency);
  assert.deepEqual(config.run.promptIds, ["xiyou-v1"], "原配置不被改动");
});

test("拒绝空选择与未知 id", () => {
  const anyTarget = config.targets[0]!.id;
  assert.throws(() => narrowConfig(config, { targetIds: [], promptIds: ["classic-v1"] }), /至少选择一个目标/);
  assert.throws(() => narrowConfig(config, { targetIds: [anyTarget], promptIds: [] }), /至少选择一道题目/);
  assert.throws(
    () => narrowConfig(config, { targetIds: ["claude__nope__low"], promptIds: ["no-such-prompt"] }),
    /目标 claude__nope__low、题目 no-such-prompt/,
  );
});

test("enabled: false 的目标仍在矩阵里：跑一次可以选，定时任务不跑", () => {
  const unscheduled = config.targets.find((target) => !target.enabled);
  assert.ok(unscheduled, "未启用的目标不应在解析时丢弃");
  assert.equal(unscheduled.id, "claude__m-a__medium");

  const round = scheduledRound(config);
  assert.deepEqual(round.targets.map((target) => target.effort), ["low", "high", "max"]);
  assert.equal(config.targets.length, 4, "原配置不被改动");

  const picked = narrowConfig(config, { targetIds: [unscheduled.id], promptIds: ["classic-v1"] });
  assert.deepEqual(picked.targets.map((target) => target.id), [unscheduled.id]);
});

test("没有任何 enabled 的目标时配置无效：定时任务至少要有一项", async () => {
  const path = join(workdir, "all-disabled.yaml");
  await writeFile(path, CONFIG_YAML.replace(/effort: (low|high|max) \}/g, "effort: $1, enabled: false }"), "utf8");
  assert.throws(() => loadConfig(path), /没有任何已启用的条目/);
});

test("停用的 profile：定时轮次与跑一次都剔除其目标，全被剔除时拒绝", async () => {
  const path = join(workdir, "profiles.yaml");
  await writeFile(
    path,
    `run:
  promptIds: [classic-v1]
profiles:
  - { name: relay-on, cli: codex, upstreamType: compatible, baseUrl: "https://a.example/v1" }
  - { name: relay-off, cli: codex, upstreamType: compatible, baseUrl: "https://b.example/v1", enabled: false }
targets:
  - { cli: codex, model: m, effort: low }
  - { cli: codex, model: m, effort: low, profile: relay-on }
  - { cli: codex, model: m, effort: low, profile: relay-off }
`,
    "utf8",
  );
  const withProfiles = loadConfig(path);
  const [login, on, off] = withProfiles.targets.map((target) => target.id);

  assert.deepEqual(scheduledRound(withProfiles).targets.map((target) => target.id), [login, on]);
  const picked = narrowConfig(withProfiles, { targetIds: [off!, on!], promptIds: ["classic-v1"] });
  assert.deepEqual(picked.targets.map((target) => target.id), [on]);
  assert.throws(
    () => narrowConfig(withProfiles, { targetIds: [off!], promptIds: ["classic-v1"] }),
    /profile 均已停用/,
  );
});

const PROFILE_MATRIX_YAML = `run:
  promptIds: [classic-v1]
profiles:
  - { name: relay-a, cli: codex, upstreamType: compatible, baseUrl: "https://a.example/v1", models: [m, n] }
  - { name: relay-b, cli: codex, upstreamType: compatible, baseUrl: "https://b.example/v1" }
  - { name: relay-off, cli: codex, upstreamType: compatible, baseUrl: "https://c.example/v1", enabled: false }
  - { name: relay-narrow, cli: codex, upstreamType: compatible, baseUrl: "https://d.example/v1", models: [other] }
targets:
  - { cli: codex, model: m, effort: low, label: 自定义名 }
  - { cli: codex, model: m, effort: low, profile: relay-a, timeoutMs: 5000 }
  - { cli: codex, model: n, effort: high, profile: relay-b }
  - { cli: claude, model: c, effort: low }
`;

test("profiles：组合 × 上游展开，矩阵已有的沿用、没有的按模板合成，登录态在前", async () => {
  const path = join(workdir, "profile-matrix.yaml");
  await writeFile(path, PROFILE_MATRIX_YAML, "utf8");
  const matrix = loadConfig(path);

  const round = narrowConfig(matrix, {
    targetIds: ["codex__m__low", "codex__n__high", "claude__c__low"],
    promptIds: ["classic-v1"],
    profiles: ["relay-b", "relay-a", "default"],
  });
  assert.deepEqual(
    round.targets.map((target) => target.id),
    [
      "codex__m__low",
      "codex__m__low__relay-a",
      "codex__m__low__relay-b",
      "codex__n__high",
      "codex__n__high__relay-a",
      "codex__n__high__relay-b",
      "claude__c__low",
    ],
  );
  const byId = new Map(round.targets.map((target) => [target.id, target]));
  // 矩阵里登记过的目标原样沿用（含它自己的超时与显示名）
  assert.equal(byId.get("codex__m__low__relay-a")?.timeoutMs, 5000);
  assert.equal(byId.get("codex__m__low")?.label, "自定义名");
  // 合成的目标：显示名按默认规则，登录态目标没有 profile 字段
  assert.equal(byId.get("codex__m__low__relay-b")?.label, "m · low · relay-b");
  assert.equal(byId.get("codex__m__low__relay-b")?.profile, "relay-b");
  assert.equal(byId.get("codex__n__high")?.profile, undefined);
  assert.equal(byId.get("codex__n__high")?.label, "n · high");
  // claude 不支持上游：只跑登录态一次
  assert.equal(round.targets.filter((target) => target.cli === "claude").length, 1);
  assert.equal(matrix.targets.length, 4, "原配置不被改动");
});

test("profiles：停用、模型不在清单、未登记、未选上游都拒绝；组合 id 须是矩阵里的组合", async () => {
  const path = join(workdir, "profile-matrix.yaml");
  await writeFile(path, PROFILE_MATRIX_YAML, "utf8");
  const matrix = loadConfig(path);
  const base = { targetIds: ["codex__m__low"], promptIds: ["classic-v1"] };

  assert.throws(() => narrowConfig(matrix, { ...base, profiles: ["relay-off"] }), /relay-off 已停用/);
  assert.throws(() => narrowConfig(matrix, { ...base, profiles: ["relay-narrow"] }), /relay-narrow 的模型清单里没有 m/);
  assert.throws(() => narrowConfig(matrix, { ...base, profiles: ["nope"] }), /没有 codex 的上游 nope/);
  assert.throws(() => narrowConfig(matrix, { ...base, profiles: [] }), /至少选择一个上游/);
  assert.throws(
    () => narrowConfig(matrix, { targetIds: ["codex__m__low__relay-a"], promptIds: ["classic-v1"], profiles: ["default"] }),
    /配置里没有：目标 codex__m__low__relay-a/,
  );
  // 不带 profiles 时目标 id 仍按字面对应，矩阵里的 profile 目标可直接选
  const literal = narrowConfig(matrix, { targetIds: ["codex__m__low__relay-a"], promptIds: ["classic-v1"] });
  assert.deepEqual(literal.targets.map((target) => target.id), ["codex__m__low__relay-a"]);
});

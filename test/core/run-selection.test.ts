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

/** 单次执行的选择只能收窄配置，不能选出配置中没有的目标或题目 */

import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { loadConfig, type AppConfig } from "@/core/config";
import { narrowConfig } from "@/core/run-selection";

const CONFIG_YAML = `
schedule:
  enabled: false
run:
  promptIds: [xiyou-v1]
targets:
  - { cli: claude, model: m-a, effort: low }
  - { cli: claude, model: m-a, effort: high }
  - { cli: codex, model: m-b, effort: max }
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

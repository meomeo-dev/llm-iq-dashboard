/** 配置写回：目标的定时勾选（enabled）随界面往返，注释与手写字段跟着正确的条目走 */

import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { loadConfig } from "@/core/config";
import { applyConfigPatch } from "@/core/config-writer";

const CONFIG_YAML = `run:
  promptIds: [classic-v1]
targets:
  # 低档
  - cli: claude
    model: m-a
    effort: low
  # 高档，暂不进定时任务
  - cli: claude
    model: m-a
    effort: high
    enabled: false
`;

let workdir: string;
let path: string;

before(async () => {
  workdir = await mkdtemp(join(tmpdir(), "llm-iq-writer-"));
  path = join(workdir, "pelican.config.yaml");
  await writeFile(path, CONFIG_YAML, "utf8");
});

after(async () => {
  await rm(workdir, { recursive: true, force: true });
});

test("未进定时任务的目标会进入界面，勾回后删掉 enabled: false，取消后写出 enabled: false", async () => {
  const loaded = loadConfig(path);
  assert.deepEqual(loaded.targets.map((target) => [target.effort, target.enabled]), [["low", true], ["high", false]]);

  // 界面上把高档勾回、低档取消
  const flipped = loaded.targets.map((target) => ({ ...target, enabled: !target.enabled }));
  const saved = await applyConfigPatch(path, { targets: flipped });
  assert.deepEqual(saved.targets.map((target) => [target.effort, target.enabled]), [["low", false], ["high", true]]);

  const text = await readFile(path, "utf8");
  const targetsSection = text.slice(text.indexOf("targets:"));
  assert.equal(targetsSection.match(/enabled: false/g)?.length, 1, "只有低档带 enabled: false");
  assert.match(targetsSection, /effort: low\n\s+label: .*\n\s+enabled: false/);
  assert.match(text, /# 低档/);
  assert.match(text, /# 高档，暂不进定时任务/);
});

const SIBLINGS_YAML = `run:
  promptIds: [classic-v1]
targets:
  # 低档，单独放宽超时
  - cli: claude
    model: m-a
    effort: low
    timeoutMs: 120000
  # 高档
  - cli: claude
    model: m-a
    effort: high
`;

test("删掉一个强度后，同模型的其他强度不继承它的手写 timeoutMs 与注释", async () => {
  const siblings = join(workdir, "siblings.yaml");
  await writeFile(siblings, SIBLINGS_YAML, "utf8");
  const loaded = loadConfig(siblings);
  const saved = await applyConfigPatch(siblings, { targets: loaded.targets.filter((target) => target.effort !== "low") });

  const high = saved.targets.find((target) => target.effort === "high");
  assert.notEqual(high?.timeoutMs, 120_000);
  const text = await readFile(siblings, "utf8");
  assert.doesNotMatch(text, /timeoutMs|低档/);
  assert.match(text, /# 高档/);
});

test("只改一项的强度时复用原节点，保留注释与手写字段", async () => {
  const renamed = join(workdir, "renamed.yaml");
  await writeFile(renamed, SIBLINGS_YAML, "utf8");
  const loaded = loadConfig(renamed);
  const changed = loaded.targets.map((target) =>
    target.effort === "low" ? { ...target, effort: "medium" as const, id: "claude__m-a__medium" } : target,
  );
  const saved = await applyConfigPatch(renamed, { targets: changed });

  assert.equal(saved.targets.find((target) => target.effort === "medium")?.timeoutMs, 120_000);
  assert.match(await readFile(renamed, "utf8"), /# 低档，单独放宽超时\n\s+- cli: claude\n\s+model: m-a\n\s+effort: medium/);
});

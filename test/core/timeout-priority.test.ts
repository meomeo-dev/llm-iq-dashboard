/**
 * 必测矩阵 #5：超时优先级。
 * targets[].timeoutMs > run.timeoutByEffort[effort] > run.timeoutByCli[cli] > run.defaultTimeoutMs。
 * 优先级错位时 max 档会被 CLI 默认值截断，表现为"随机超时"。
 */

import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { loadConfig } from "@/core/config";

const CONFIG_YAML = `
run:
  promptIds: [classic-v1]
  defaultTimeoutMs: 300000
  timeoutByCli:
    codex: 600000
  timeoutByEffort:
    max: 2700000
targets:
  - { cli: claude, model: m-default, effort: low }
  - { cli: codex, model: m-cli, effort: low }
  - { cli: codex, model: m-effort, effort: max }
  - { cli: codex, model: m-target, effort: max, timeoutMs: 120000 }
`;

let workdir: string;

before(async () => {
  workdir = await mkdtemp(join(tmpdir(), "llm-iq-config-"));
});

after(async () => {
  await rm(workdir, { recursive: true, force: true });
});

test("四层超时逐层覆盖", async () => {
  const configPath = join(workdir, "pelican.config.yaml");
  await writeFile(configPath, CONFIG_YAML, "utf8");
  const timeouts = Object.fromEntries(
    loadConfig(configPath).targets.map((target) => [target.model, target.timeoutMs]),
  );
  assert.deepEqual(timeouts, {
    "m-default": 300000,
    "m-cli": 600000,
    "m-effort": 2700000,
    "m-target": 120000,
  });
});

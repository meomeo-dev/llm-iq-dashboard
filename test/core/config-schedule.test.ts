/**
 * schedule 只描述节奏：没有启用开关（开关在看板上），不写节奏即不定时；
 * cron 写坏在加载时就报错，不留到调度器重建定时器时。
 */

import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { hasRhythm, loadConfig } from "@/core/config";

const TARGETS = `run:
  promptIds: [classic-v1]
targets:
  - { cli: claude, model: m-a, effort: low }
`;

let workdir: string;

before(async () => {
  workdir = await mkdtemp(join(tmpdir(), "llm-iq-schedule-"));
});

after(async () => {
  await rm(workdir, { recursive: true, force: true });
});

async function load(schedule: string): Promise<ReturnType<typeof loadConfig>> {
  const path = join(workdir, `c-${Math.random().toString(36).slice(2)}.yaml`);
  await writeFile(path, `${schedule}${TARGETS}`, "utf8");
  return loadConfig(path);
}

test("不写 schedule 即不定时", async () => {
  const config = await load("");
  assert.equal(hasRhythm(config.schedule), false);
  assert.equal(config.schedule.runOnStart, false);
});

test("写了 cron 即定时", async () => {
  const config = await load('schedule:\n  cron: "0 9 * * *"\n  timezone: UTC\n');
  assert.equal(hasRhythm(config.schedule), true);
  assert.equal(config.schedule.cron, "0 9 * * *");
});

test("schedule.enabled 不是配置项，写了即报错并说明开关在看板上", async () => {
  await assert.rejects(load('schedule:\n  enabled: true\n  cron: "0 9 * * *"\n'), /schedule\.enabled 不是配置项.*自动任务/);
});

test("写坏的 cron 与时区在加载时报错", async () => {
  await assert.rejects(load('schedule:\n  cron: "every morning"\n'), /schedule\.cron 或 timezone 无效/);
  await assert.rejects(load('schedule:\n  cron: "0 9 * * *"\n  timezone: Mars/Olympus\n'), /schedule\.cron 或 timezone 无效/);
});

test("runOnStart 须同时设置节奏", async () => {
  await assert.rejects(load("schedule:\n  runOnStart: true\n"), /runOnStart 需要同时设置/);
});

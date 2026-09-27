/**
 * 自动任务默认关闭：它会消耗三家 CLI 的配额，须手动开启。
 * 测试在临时 PELICAN_DATA_DIR 下运行，不触及仓库的运行态文件。
 */

import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { readAutoRunSwitch, readLiveScheduler, recordSchedulerProcess, writeAutoRunSwitch } from "@/core/auto-run";
import type { AppConfig } from "@/core/config";
import { startScheduler } from "@/core/scheduler";

const ENV_DATA_DIR = "PELICAN_DATA_DIR";
let dataDir: string;
let previousDataDir: string | undefined;

before(async () => {
  dataDir = await mkdtemp(join(tmpdir(), "llm-iq-auto-run-"));
  previousDataDir = process.env[ENV_DATA_DIR];
  process.env[ENV_DATA_DIR] = dataDir;
});

after(async () => {
  if (previousDataDir === undefined) delete process.env[ENV_DATA_DIR];
  else process.env[ENV_DATA_DIR] = previousDataDir;
  await rm(dataDir, { recursive: true, force: true });
});

test("开关文件不存在或被写坏时视为关闭", async () => {
  assert.equal((await readAutoRunSwitch()).enabled, false);
  await writeFile(join(dataDir, "auto-run.json"), '{"enabled":"yes"}', "utf8");
  assert.equal((await readAutoRunSwitch()).enabled, false);
});

test("开关写入后持久化，可再关上", async () => {
  await writeAutoRunSwitch(true, new Date("2026-09-25T00:00:00Z"));
  assert.deepEqual(await readAutoRunSwitch(), { enabled: true, updatedAt: "2026-09-25T00:00:00.000Z" });
  await writeAutoRunSwitch(false);
  assert.equal((await readAutoRunSwitch()).enabled, false);
});

test("调度器登记只在进程活着时算数", async () => {
  await recordSchedulerProcess(process.pid);
  assert.equal((await readLiveScheduler())?.pid, process.pid);
  // 2^22 以上的 pid 在 macOS / Linux 默认配置下不会被分配
  await recordSchedulerProcess(99_999_999);
  assert.equal(await readLiveScheduler(), null);
});

test("开关关着时，到点的触发被跳过、不发起执行", async () => {
  await writeAutoRunSwitch(false);
  const config = {
    schedule: { enabled: true, cron: null, intervalMinutes: 600, timezone: null, runOnStart: true },
  } as AppConfig;
  const logs: string[] = [];
  const skipped = new Promise<void>((resolve) => {
    const handle = startScheduler(config, (message) => {
      logs.push(message);
      if (message.includes("跳过")) {
        handle.stop();
        resolve();
      }
    });
  });
  await skipped;
  assert.ok(logs.some((message) => message.includes("自动任务已关闭")));
});

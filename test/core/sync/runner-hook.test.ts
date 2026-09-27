/**
 * Runner 自动同步挂钩与失败隔离测试。
 */

import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import type { AppConfig } from "@/core/config";
import { executeRun } from "@/core/runner";

const ENV_DATA_DIR = "PELICAN_DATA_DIR";
let dataDir: string;
let previousDataDir: string | undefined;

before(async () => {
  dataDir = await mkdtemp(join(tmpdir(), "llm-iq-runner-sync-"));
  previousDataDir = process.env[ENV_DATA_DIR];
  process.env[ENV_DATA_DIR] = dataDir;
});

after(async () => {
  if (previousDataDir === undefined) delete process.env[ENV_DATA_DIR];
  else process.env[ENV_DATA_DIR] = previousDataDir;
  await rm(dataDir, { recursive: true, force: true });
});

describe("runner 自动同步挂钩与失败隔离", () => {
  it("autoSync 失败时仅记录日志，不影响本轮结果与返回值", async () => {
    const logs: string[] = [];

    const config: AppConfig = {
      schedule: { cron: null, intervalMinutes: null, timezone: null, runOnStart: false },
      run: {
        promptIds: ["classic-v1"],
        concurrency: 1,
        defaultTimeoutMs: 1000,
        timeoutByCli: {},
        timeoutByEffort: {},
        rotation: { period: "day", timeZone: "UTC" },
      },
      retention: { days: null },
      budget: { perRoundUsd: null, perDayUsd: null },
      targets: [
        {
          id: "claude__test-model__low",
          cli: "claude",
          model: "test-model",
          effort: "low",
          label: "Test",
          timeoutMs: 1000,
          extraArgs: [],
          enabled: true,
        },
      ],
      customPrompts: [],
      customModels: {},
      dataRepo: {
        // 指向一个不存在的仓库路径，使同步抛错
        path: join(dataDir, "invalid-repo-dir"),
        autoSync: true,
        push: false,
      },
    };

    const record = await executeRun(config, {
      trigger: "manual",
      log: (msg) => logs.push(msg),
    });

    assert.ok(record !== null);
    assert.equal(record.inProgress, false);
    assert.ok(logs.some((msg) => msg.includes("数据仓自动同步失败")));
    assert.ok(logs.some((msg) => msg.includes("完成") || msg.includes("已停止")));
  });
});

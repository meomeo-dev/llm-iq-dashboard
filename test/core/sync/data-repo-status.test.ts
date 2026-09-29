/**
 * 数据仓面板状态聚合测试（data-repo-status.test.ts）。
 *
 * 覆盖：未配置、路径不可达、清单缺失、台账计数、pending 计算、lastAction 回读、执行器代答。
 */

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { promisify } from "node:util";
import type { AppConfig } from "@/core/config";
import {
  collectDataRepoStatus,
  saveLastAction,
} from "@/core/sync/data-repo-status";
import type { SyncActionResult } from "@/core/sync/data-repo-panel-types";
import { saveSyncLedger } from "@/core/sync/sync-ledger";

const execAsync = promisify(execFile);

function mockBaseConfig(): AppConfig {
  return {
    schedule: { cron: null, intervalMinutes: null, timezone: null, runOnStart: false },
    run: {
      promptIds: ["classic-v1"],
      concurrency: 1,
      defaultTimeoutMs: 10000,
      timeoutByCli: {},
      timeoutByEffort: {},
      rotation: { period: "day", timeZone: "UTC" },
    },
    retention: { days: null },
    budget: { perRoundUsd: null, perDayUsd: null },
    upstreamTypes: [],
    profiles: [],
    targets: [],
    customPrompts: [],
    customModels: {},
    dataRepo: null,
  };
}

describe("data-repo-status 状态聚合", () => {
  let rootDir: string;
  let testDataDir: string;
  let testRepoDir: string;

  before(async () => {
    rootDir = await mkdtemp(join(tmpdir(), "data-repo-status-test-"));
    testDataDir = join(rootDir, "data");
    testRepoDir = join(rootDir, "repo");
    await mkdir(testDataDir, { recursive: true });
    await mkdir(testRepoDir, { recursive: true });

    // 初始化测试 Git 仓库
    await execAsync("git", ["-C", testRepoDir, "init", "--initial-branch=main"]);
    await execAsync("git", ["-C", testRepoDir, "config", "user.name", "Tester"]);
    await execAsync("git", ["-C", testRepoDir, "config", "user.email", "tester@example.com"]);
    await writeFile(join(testRepoDir, "README.md"), "# Data Repo", "utf8");
    await execAsync("git", ["-C", testRepoDir, "add", "README.md"]);
    await execAsync("git", ["-C", testRepoDir, "commit", "-m", "chore: init"]);
  });

  after(async () => {
    await rm(rootDir, { recursive: true, force: true });
  });

  it("未配置 dataRepo 时返回 configured=false 与 repo=null", async () => {
    const config = mockBaseConfig();
    const status = await collectDataRepoStatus(config, { dataDir: testDataDir });
    assert.strictEqual(status.configured, false);
    assert.strictEqual(status.repo, null);
    assert.strictEqual(status.manifest, null);
    assert.strictEqual(status.ledger.exported, 0);
    assert.strictEqual(status.ledger.published, 0);
    assert.strictEqual(status.local.totalRuns, 0);
  });

  it("配置了路径但路径不可达时，标注 reachable=false 且 notice 说明原因", async () => {
    const config = mockBaseConfig();
    const missingPath = join(rootDir, "non-existent-repo");
    config.dataRepo = { path: missingPath, autoSync: true, push: false };

    const status = await collectDataRepoStatus(config, {
      dataDir: testDataDir,
      rawPath: "../non-existent-repo",
    });
    assert.strictEqual(status.configured, true);
    assert.notStrictEqual(status.repo, null);
    assert.strictEqual(status.repo?.reachable, false);
    assert.strictEqual(status.repo?.path, "../non-existent-repo");
    assert.strictEqual(status.manifest, null);
    assert.ok(status.notice?.includes("数据仓路径不可达"));
  });

  it("数据仓目录有效但缺 index.json 时 manifest 为 null", async () => {
    const config = mockBaseConfig();
    config.dataRepo = { path: testRepoDir, autoSync: true, push: false };

    const status = await collectDataRepoStatus(config, {
      dataDir: testDataDir,
      rawPath: "repo",
    });
    assert.strictEqual(status.configured, true);
    assert.notStrictEqual(status.repo, null);
    assert.strictEqual(status.repo?.reachable, true);
    assert.strictEqual(status.repo?.isGitRepo, true);
    assert.strictEqual(status.manifest, null);
  });

  it("数据仓包含有效 index.json 时解析出 manifest 摘要", async () => {
    const manifestContent = {
      schemaVersion: 1,
      name: "llm-iq-data",
      description: "benchmark data",
      repository: "xumetide-dev/llm-iq-data",
      updatedAt: "2026-09-27T08:00:00.000Z",
      totalRuns: 42,
      days: [
        { date: "2026-09-27", runs: 2, path: "runs/2026/09/27" },
        { date: "2026-09-26", runs: 5, path: "runs/2026/09/26" },
      ],
    };
    await writeFile(join(testRepoDir, "index.json"), JSON.stringify(manifestContent), "utf8");

    const config = mockBaseConfig();
    config.dataRepo = { path: testRepoDir, autoSync: true, push: false };

    const status = await collectDataRepoStatus(config, {
      dataDir: testDataDir,
      rawPath: "repo",
    });
    assert.deepStrictEqual(status.manifest, {
      totalRuns: 42,
      updatedAt: "2026-09-27T08:00:00.000Z",
      latestDay: "2026-09-27",
    });
  });

  it("正确统计台账 exported / published 数量与最新时间", async () => {
    await saveSyncLedger(
      {
        "20260927T010000Z": {
          status: "exported",
          exportedAt: "2026-09-27T01:10:00.000Z",
          commit: "abc1234",
          redactions: [],
        },
        "20260927T020000Z": {
          status: "published",
          exportedAt: "2026-09-27T02:10:00.000Z",
          publishedAt: "2026-09-27T02:20:00.000Z",
          commit: "def5678",
          redactions: [],
        },
      },
      testDataDir,
    );

    const config = mockBaseConfig();
    const status = await collectDataRepoStatus(config, { dataDir: testDataDir });
    assert.strictEqual(status.ledger.exported, 1);
    assert.strictEqual(status.ledger.published, 1);
    assert.strictEqual(status.ledger.lastExportedAt, "2026-09-27T02:10:00.000Z");
    assert.strictEqual(status.ledger.lastPublishedAt, "2026-09-27T02:20:00.000Z");
  });

  it("正确识别本地 runs 目录的 pending 轮次与 incomplete 数量", async () => {
    const runsDir = join(testDataDir, "runs");
    await mkdir(runsDir, { recursive: true });

    // 1. 已完成且在台账中 (20260927T010000Z)
    const run1Dir = join(runsDir, "20260927T010000Z");
    await mkdir(run1Dir, { recursive: true });
    await writeFile(join(run1Dir, "run.json"), JSON.stringify({ inProgress: false }), "utf8");

    // 2. 已完成但不在台账中 -> pending (20260927T030000Z)
    const run2Dir = join(runsDir, "20260927T030000Z");
    await mkdir(run2Dir, { recursive: true });
    await writeFile(join(run2Dir, "run.json"), JSON.stringify({ inProgress: false }), "utf8");

    // 3. 早已开始却仍标 inProgress -> interrupted
    const runInProgDir = join(runsDir, "20260927T040000Z");
    await mkdir(runInProgDir, { recursive: true });
    await writeFile(join(runInProgDir, "run.json"), JSON.stringify({ inProgress: true }), "utf8");

    // 4. 早已开始却缺 run.json -> interrupted
    const runMissingDir = join(runsDir, "20260927T050000Z");
    await mkdir(runMissingDir, { recursive: true });

    // 5. 刚开始、只有过程文件 -> running
    const runFreshId = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    await mkdir(join(runsDir, runFreshId), { recursive: true });

    const config = mockBaseConfig();
    const status = await collectDataRepoStatus(config, { dataDir: testDataDir });

    assert.strictEqual(status.local.totalRuns, 5);
    assert.strictEqual(status.local.incomplete, 3);
    assert.strictEqual(status.local.running, 1);
    assert.strictEqual(status.local.interrupted, 2);
    assert.deepStrictEqual(status.local.pending, ["20260927T030000Z"]);
  });

  it("成功写入与回读 lastAction", async () => {
    const mockAction: SyncActionResult = {
      mode: "export",
      startedAt: "2026-09-27T07:00:00.000Z",
      finishedAt: "2026-09-27T07:01:00.000Z",
      ok: true,
      report: null,
      executedBy: "web",
      error: null,
    };
    await saveLastAction(mockAction, testDataDir);

    const config = mockBaseConfig();
    const status = await collectDataRepoStatus(config, { dataDir: testDataDir });
    assert.deepStrictEqual(status.lastAction, mockAction);
  });
});

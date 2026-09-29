/**
 * Runner 自动同步挂钩与失败隔离测试。
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import type { AppConfig } from "@/core/config";
import { executeRun } from "@/core/runner";
import { commitSync, pushCurrentBranch } from "@/core/sync/data-repo-git";
import { saveSyncLedger, type SyncLedger } from "@/core/sync/sync-ledger";

const ENV_DATA_DIR = "PELICAN_DATA_DIR";

describe("runner 自动同步挂钩与失败隔离", () => {
  let tempBase: string;
  let dataDir: string;
  let previousDataDir: string | undefined;
  let prevHome: string | undefined;

  beforeEach(async () => {
    tempBase = await mkdtemp(join(tmpdir(), "llm-iq-runner-sync-"));
    dataDir = join(tempBase, "data");
    await mkdir(dataDir, { recursive: true });

    previousDataDir = process.env[ENV_DATA_DIR];
    process.env[ENV_DATA_DIR] = dataDir;

    prevHome = process.env.HOME;
    process.env.HOME = tempBase;
  });

  afterEach(async () => {
    if (previousDataDir === undefined) delete process.env[ENV_DATA_DIR];
    else process.env[ENV_DATA_DIR] = previousDataDir;

    if (prevHome !== undefined) process.env.HOME = prevHome;
    else delete process.env.HOME;

    await rm(tempBase, { recursive: true, force: true });
  });

  function createBaseConfig(repoPath: string, push = false): AppConfig {
    return {
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
      upstreamTypes: [],
      profiles: [],
      targets: [
        {
          id: "claude__test-model__low",
          cli: "claude",
          model: "test-model",
          effort: "low",
          label: "Test",
          timeoutMs: 1000,
          profile: "default",
          extraArgs: [],
          enabled: true,
        },
      ],
      customPrompts: [],
      customModels: {},
      dataRepo: {
        path: repoPath,
        autoSync: true,
        push,
      },
    };
  }

  it("数据仓目录未挂载或不是 Git 仓库时仅记一行清晰日志，不影响评测轮次", async () => {
    const logs: string[] = [];
    const config = createBaseConfig(join(dataDir, "unmounted-repo"));

    const record = await executeRun(config, {
      trigger: "manual",
      log: (msg) => logs.push(msg),
    });

    assert.ok(record !== null);
    assert.equal(record.inProgress, false);
    assert.ok(logs.some((msg) => msg.includes("数据仓目录未挂载或不是 Git 仓库")));
    assert.ok(logs.some((msg) => msg.includes("完成") || msg.includes("已停止")));
  });

  it("autoSync 失败时（如仓库脏）仅记录日志，不影响本轮结果与返回值", async () => {
    const logs: string[] = [];
    const gitRepoDir = join(tempBase, "dirty-repo");
    execFileSync("git", ["init", gitRepoDir]);
    execFileSync("git", ["-C", gitRepoDir, "config", "user.name", "Tester"]);
    execFileSync("git", ["-C", gitRepoDir, "config", "user.email", "tester@example.com"]);
    // 写入一个未暂存提交的文件使工作区不干净
    await writeFile(join(gitRepoDir, "dirty.txt"), "dirty\n");

    const config = createBaseConfig(gitRepoDir);

    const record = await executeRun(config, {
      trigger: "manual",
      log: (msg) => logs.push(msg),
    });

    assert.ok(record !== null);
    assert.equal(record.inProgress, false);
    assert.ok(logs.some((msg) => msg.includes("数据仓自动同步失败")));
    assert.ok(logs.some((msg) => msg.includes("完成") || msg.includes("已停止")));
  });

  it("push=false 时触发发布确认，确认失败仅记日志不影响评测轮次（失败隔离）", async () => {
    const logs: string[] = [];
    const gitRepoDir = join(tempBase, "no-upstream-repo");
    execFileSync("git", ["init", gitRepoDir]);
    execFileSync("git", ["-C", gitRepoDir, "config", "user.name", "Tester"]);
    execFileSync("git", ["-C", gitRepoDir, "config", "user.email", "tester@example.com"]);
    await writeFile(join(gitRepoDir, "README.md"), "# Init\n");
    execFileSync("git", ["-C", gitRepoDir, "add", "."]);
    execFileSync("git", ["-C", gitRepoDir, "commit", "-m", "init"]);

    const config = createBaseConfig(gitRepoDir, false);

    const record = await executeRun(config, {
      trigger: "manual",
      log: (msg) => logs.push(msg),
    });

    assert.ok(record !== null);
    assert.equal(record.inProgress, false);
    // 无上游追踪分支时，confirmPublished 会失败，runner 捕获并记录日志
    assert.ok(logs.some((msg) => msg.includes("数据仓发布确认失败")));
    assert.ok(logs.some((msg) => msg.includes("完成") || msg.includes("已停止")));
  });

  it("push=false 时触发发布确认，确认成功记录已发布轮次", async () => {
    const logs: string[] = [];
    const remoteDir = join(tempBase, "remote.git");
    const repoDir = join(tempBase, "valid-repo");

    execFileSync("git", ["init", "--bare", remoteDir]);
    execFileSync("git", ["--git-dir", remoteDir, "symbolic-ref", "HEAD", "refs/heads/main"]);
    execFileSync("git", ["clone", remoteDir, repoDir]);
    execFileSync("git", ["-C", repoDir, "config", "user.name", "Tester"]);
    execFileSync("git", ["-C", repoDir, "config", "user.email", "tester@example.com"]);

    await writeFile(join(repoDir, "README.md"), "# Init\n");
    execFileSync("git", ["-C", repoDir, "checkout", "-B", "main"]);
    execFileSync("git", ["-C", repoDir, "add", "."]);
    execFileSync("git", ["-C", repoDir, "commit", "-m", "init"]);
    execFileSync("git", ["-C", repoDir, "push", "-u", "origin", "main"]);

    // 预先准备一个已推送到远端的轮次并在本地台账标为 exported
    const oldRunId = "20260927T010000Z";
    await writeFile(join(repoDir, "old.txt"), "old\n");
    const oldCommit = await commitSync(repoDir, [oldRunId]);
    await pushCurrentBranch(repoDir);

    const ledger: SyncLedger = {
      [oldRunId]: {
        status: "exported",
        exportedAt: "2026-09-27T01:00:00.000Z",
        commit: oldCommit!,
        redactions: [],
      },
    };
    await saveSyncLedger(ledger, dataDir);

    const config = createBaseConfig(repoDir, false);

    const record = await executeRun(config, {
      trigger: "manual",
      log: (msg) => logs.push(msg),
    });

    assert.ok(record !== null);
    assert.equal(record.inProgress, false);
    assert.ok(
      logs.some(
        (msg) =>
          msg.includes("数据仓发布确认") &&
          msg.includes(oldRunId),
      ),
    );
  });
});

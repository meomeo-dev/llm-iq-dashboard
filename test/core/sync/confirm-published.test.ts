/**
 * 发布确认（confirmPublished）单元测试。
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { commitSync, pushCurrentBranch } from "@/core/sync/data-repo-git";
import { confirmPublished } from "@/core/sync/confirm-published";
import {
  loadSyncLedger,
  saveSyncLedger,
  syncLedgerPath,
  type SyncLedger,
} from "@/core/sync/sync-ledger";

describe("confirmPublished 发布确认", () => {
  let tempBase: string;
  let remoteGitDir: string;
  let repoDir: string;
  let dataDir: string;
  let prevHome: string | undefined;

  beforeEach(async () => {
    tempBase = await mkdtemp(join(tmpdir(), "llm-iq-confirm-test-"));
    remoteGitDir = join(tempBase, "remote.git");
    repoDir = join(tempBase, "repo");
    dataDir = join(tempBase, "data");
    await mkdir(dataDir, { recursive: true });

    prevHome = process.env.HOME;
    process.env.HOME = tempBase;

    // 初始化远端 bare 仓与本地克隆仓
    execFileSync("git", ["init", "--bare", remoteGitDir]);
    execFileSync("git", [
      "--git-dir",
      remoteGitDir,
      "symbolic-ref",
      "HEAD",
      "refs/heads/main",
    ]);
    execFileSync("git", ["clone", remoteGitDir, repoDir]);
    execFileSync("git", ["-C", repoDir, "config", "user.name", "Tester"]);
    execFileSync("git", [
      "-C",
      repoDir,
      "config",
      "user.email",
      "tester@example.com",
    ]);

    // 初始提交使分支存在并建立 upstream 追踪
    await writeFile(join(repoDir, "README.md"), "# Data Repo\n");
    execFileSync("git", ["-C", repoDir, "checkout", "-B", "main"]);
    execFileSync("git", ["-C", repoDir, "add", "."]);
    execFileSync("git", ["-C", repoDir, "commit", "-m", "chore: init repo"]);
    execFileSync("git", ["-C", repoDir, "push", "-u", "origin", "main"]);
  });

  afterEach(async () => {
    if (prevHome !== undefined) process.env.HOME = prevHome;
    else delete process.env.HOME;
    await rm(tempBase, { recursive: true, force: true });
  });

  it("有上游且包含：成功将 exported 轮次转为 published，并记录 publishedAt", async () => {
    const runId = "20260927T021708Z";
    await writeFile(join(repoDir, "run1.json"), "{}\n");
    const commitSha = await commitSync(repoDir, [runId]);
    assert.ok(commitSha !== null);

    // 宿主机或外部推送到了远端
    await pushCurrentBranch(repoDir);

    // 准备本地台账，状态为 exported
    const ledger: SyncLedger = {
      [runId]: {
        status: "exported",
        exportedAt: "2026-09-27T02:18:00.000Z",
        commit: commitSha,
        redactions: [],
      },
    };
    await saveSyncLedger(ledger, dataDir);

    const report = await confirmPublished({
      repoPath: repoDir,
      dataDir,
    });

    assert.equal(report.success, true);
    assert.equal(report.dryRun, false);
    assert.deepEqual(report.confirmed, [runId]);
    assert.deepEqual(report.ledgerTransitions.published, [runId]);

    const updatedLedger = await loadSyncLedger(dataDir);
    assert.equal(updatedLedger[runId]?.status, "published");
    assert.ok(updatedLedger[runId]?.publishedAt !== undefined);
  });

  it("有上游但未包含：保留 exported 状态，confirmed 为空，台账不变", async () => {
    const runId = "20260927T030000Z";
    await writeFile(join(repoDir, "run2.json"), "{}\n");
    const commitSha = await commitSync(repoDir, [runId]);
    assert.ok(commitSha !== null);

    // 故意不推送到远端（commit 仅在本地分支）

    const ledger: SyncLedger = {
      [runId]: {
        status: "exported",
        exportedAt: "2026-09-27T03:01:00.000Z",
        commit: commitSha,
        redactions: [],
      },
    };
    await saveSyncLedger(ledger, dataDir);

    const report = await confirmPublished({
      repoPath: repoDir,
      dataDir,
    });

    assert.equal(report.success, true);
    assert.deepEqual(report.confirmed, []);
    assert.deepEqual(report.ledgerTransitions.published, []);

    const updatedLedger = await loadSyncLedger(dataDir);
    assert.equal(updatedLedger[runId]?.status, "exported");
    assert.equal(updatedLedger[runId]?.publishedAt, undefined);
  });

  it("无上游分支：抛错中止且台账不变", async () => {
    // 创建一个没有任何 remote 和 upstream 的独立仓库
    const noUpstreamRepo = join(tempBase, "no-upstream-repo");
    execFileSync("git", ["init", noUpstreamRepo]);
    execFileSync("git", ["-C", noUpstreamRepo, "config", "user.name", "Tester"]);
    execFileSync("git", ["-C", noUpstreamRepo, "config", "user.email", "tester@example.com"]);
    await writeFile(join(noUpstreamRepo, "init.txt"), "hello\n");
    execFileSync("git", ["-C", noUpstreamRepo, "add", "."]);
    execFileSync("git", ["-C", noUpstreamRepo, "commit", "-m", "init"]);

    const runId = "20260927T040000Z";
    const ledger: SyncLedger = {
      [runId]: {
        status: "exported",
        exportedAt: "2026-09-27T04:01:00.000Z",
        commit: "deadbeef",
        redactions: [],
      },
    };
    await saveSyncLedger(ledger, dataDir);

    await assert.rejects(
      () => confirmPublished({ repoPath: noUpstreamRepo, dataDir }),
      /未配置上游追踪分支/,
    );

    const checkLedger = await loadSyncLedger(dataDir);
    assert.equal(checkLedger[runId]?.status, "exported");
  });

  it("fetch 失败：抛错中止且台账不变", async () => {
    // 制造 fetch 失败：指向不存在的远端地址
    execFileSync("git", [
      "-C",
      repoDir,
      "remote",
      "set-url",
      "origin",
      "/nonexistent/path/to/repo.git",
    ]);

    const runId = "20260927T050000Z";
    const ledger: SyncLedger = {
      [runId]: {
        status: "exported",
        exportedAt: "2026-09-27T05:01:00.000Z",
        commit: "deadbeef",
        redactions: [],
      },
    };
    await saveSyncLedger(ledger, dataDir);

    await assert.rejects(
      () => confirmPublished({ repoPath: repoDir, dataDir }),
      /fetch 失败/,
    );

    const checkLedger = await loadSyncLedger(dataDir);
    assert.equal(checkLedger[runId]?.status, "exported");
  });

  it("dry-run: 零写入保证，只报告将被确认的 runId，台账不变", async () => {
    const runId = "20260927T060000Z";
    await writeFile(join(repoDir, "run6.json"), "{}\n");
    const commitSha = await commitSync(repoDir, [runId]);
    assert.ok(commitSha !== null);
    await pushCurrentBranch(repoDir);

    const ledger: SyncLedger = {
      [runId]: {
        status: "exported",
        exportedAt: "2026-09-27T06:01:00.000Z",
        commit: commitSha,
        redactions: [],
      },
    };
    await saveSyncLedger(ledger, dataDir);

    const report = await confirmPublished({
      repoPath: repoDir,
      dataDir,
      dryRun: true,
    });

    assert.equal(report.dryRun, true);
    assert.deepEqual(report.confirmed, [runId]);
    assert.deepEqual(report.ledgerTransitions.published, [runId]);

    // 检查台账文件未被修改
    const checkLedger = await loadSyncLedger(dataDir);
    assert.equal(checkLedger[runId]?.status, "exported");
    assert.equal(checkLedger[runId]?.publishedAt, undefined);
  });

  it("支持 runIds 过滤只确认指定轮次", async () => {
    const runIdA = "20260927T070000Z";
    const runIdB = "20260927T080000Z";
    await writeFile(join(repoDir, "runA.json"), "{}\n");
    const shaA = await commitSync(repoDir, [runIdA]);
    await writeFile(join(repoDir, "runB.json"), "{}\n");
    const shaB = await commitSync(repoDir, [runIdB]);
    await pushCurrentBranch(repoDir);

    const ledger: SyncLedger = {
      [runIdA]: {
        status: "exported",
        exportedAt: "2026-09-27T07:01:00.000Z",
        commit: shaA!,
        redactions: [],
      },
      [runIdB]: {
        status: "exported",
        exportedAt: "2026-09-27T08:01:00.000Z",
        commit: shaB!,
        redactions: [],
      },
    };
    await saveSyncLedger(ledger, dataDir);

    const report = await confirmPublished({
      repoPath: repoDir,
      dataDir,
      runIds: [runIdB],
    });

    assert.deepEqual(report.confirmed, [runIdB]);

    const checkLedger = await loadSyncLedger(dataDir);
    assert.equal(checkLedger[runIdA]?.status, "exported");
    assert.equal(checkLedger[runIdB]?.status, "published");
  });

  it("目标目录不存在或不是 git 仓库时报错", async () => {
    await assert.rejects(
      () =>
        confirmPublished({
          repoPath: join(tempBase, "not-a-repo"),
          dataDir,
        }),
      /不存在或不是 Git 仓库/,
    );
  });
});

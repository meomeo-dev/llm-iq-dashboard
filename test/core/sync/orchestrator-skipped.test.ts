/**
 * 同步编排器 skipped 状态生命周期测试。
 * 覆盖：
 * 1. unpublishable-prompt 与 rejected 结果写入台账（非预演）；
 * 2. 预演模式（dryRun=true）不写台账；
 * 3. 已是 exported / published 的记录不得被覆盖为 skipped；
 * 4. skipped 轮次在条件修正后下次同步可重新导出并覆盖为 exported；
 * 5. details 中仅含文件与规则名，不含泄漏命中原文。
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { syncDataRepo } from "@/core/sync/sync-orchestrator";
import { loadSyncLedger, saveSyncLedger, type SyncLedger } from "@/core/sync/sync-ledger";

describe("sync-orchestrator skipped 轮次台账维护与生命周期", () => {
  let tempBase: string;
  let remoteGitDir: string;
  let repoDir: string;
  let dataDir: string;
  let runsDir: string;
  let prevHome: string | undefined;

  beforeEach(async () => {
    tempBase = await mkdtemp(join(tmpdir(), "llm-iq-orchestrator-skipped-"));
    remoteGitDir = join(tempBase, "remote.git");
    repoDir = join(tempBase, "repo");
    dataDir = join(tempBase, "data");
    runsDir = join(dataDir, "runs");

    await mkdir(runsDir, { recursive: true });
    prevHome = process.env.HOME;
    process.env.HOME = tempBase;

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

  function createRunData(runId: string, promptId: string, leakedKey?: string) {
    return {
      runId,
      prompts: [{ promptId, text: "draw something", bindings: {} }],
      startedAt: "2026-09-27T02:17:08.000Z",
      finishedAt: "2026-09-27T02:18:00.000Z",
      durationMs: 52000,
      trigger: "schedule" as const,
      inProgress: false,
      attempts: [
        {
          targetId: "claude__model__low",
          promptId,
          cli: "claude" as const,
          model: "model",
          effort: "low" as const,
          appliedEffort: "low" as const,
          effortHonored: true,
          label: "Claude",
          status: "ok" as const,
          svgFile: "test.svg",
          rawFile: null,
          startedAt: "2026-09-27T02:17:09.000Z",
          finishedAt: "2026-09-27T02:17:40.000Z",
          durationMs: 31000,
          svgBytes: 50,
          error: leakedKey ?? null,
          usage: null,
        },
      ],
    };
  }

  it("非预演时 unpublishable 与 rejected 写入台账，details 不含命中原文", async () => {
    const unpubRunId = "20260927T021708Z";
    const unpubDir = join(runsDir, unpubRunId);
    await mkdir(unpubDir, { recursive: true });
    await writeFile(
      join(unpubDir, "run.json"),
      JSON.stringify(createRunData(unpubRunId, "leijun-v1")),
    );
    await writeFile(join(unpubDir, "test.svg"), "<svg></svg>");

    const leakRunId = "20260927T031708Z";
    const leakDir = join(runsDir, leakRunId);
    const rawSecret = "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0\n-----END RSA PRIVATE KEY-----";
    await mkdir(leakDir, { recursive: true });
    await writeFile(
      join(leakDir, "run.json"),
      JSON.stringify(createRunData(leakRunId, "classic-v1", rawSecret)),
    );
    await writeFile(join(leakDir, "test.svg"), "<svg></svg>");

    const report = await syncDataRepo({
      repoPath: repoDir,
      dataDir,
      dryRun: false,
      push: false,
    });

    assert.equal(report.success, true);
    assert.equal(report.skipped.length, 1);
    assert.equal(report.skipped[0]?.runId, unpubRunId);
    assert.equal(report.rejected.length, 1);
    assert.equal(report.rejected[0]?.runId, leakRunId);

    const ledger = await loadSyncLedger(dataDir);
    const unpubRecord = ledger[unpubRunId];
    assert.ok(unpubRecord && unpubRecord.status === "skipped");
    assert.equal(unpubRecord.reason, "unpublishable-prompt");
    assert.ok(unpubRecord.skippedAt);

    const leakRecord = ledger[leakRunId];
    assert.ok(leakRecord && leakRecord.status === "skipped");
    assert.equal(leakRecord.reason, "rejected");
    assert.ok(leakRecord.skippedAt);
    assert.ok(Array.isArray(leakRecord.details));
    assert.equal(leakRecord.details[0]?.file, "run.json");
    assert.equal(leakRecord.details[0]?.reason, "private-key");

    // 验证 details 绝不含命中原文
    const ledgerRawText = JSON.stringify(ledger);
    assert.ok(!ledgerRawText.includes("BEGIN RSA PRIVATE KEY"));
  });

  it("预演模式（dryRun=true）不写台账", async () => {
    const unpubRunId = "20260927T021708Z";
    const unpubDir = join(runsDir, unpubRunId);
    await mkdir(unpubDir, { recursive: true });
    await writeFile(
      join(unpubDir, "run.json"),
      JSON.stringify(createRunData(unpubRunId, "leijun-v1")),
    );
    await writeFile(join(unpubDir, "test.svg"), "<svg></svg>");

    const report = await syncDataRepo({
      repoPath: repoDir,
      dataDir,
      dryRun: true,
      push: false,
    });

    assert.equal(report.dryRun, true);
    assert.equal(report.skipped.length, 1);

    const ledger = await loadSyncLedger(dataDir);
    assert.equal(Object.keys(ledger).length, 0);
  });

  it("已是 exported 或 published 的记录不得被覆盖为 skipped", async () => {
    const runId = "20260927T021708Z";
    const initialLedger: SyncLedger = {
      [runId]: {
        status: "published",
        exportedAt: "2026-09-27T02:20:00Z",
        publishedAt: "2026-09-27T02:25:00Z",
        commit: "abc1234",
        redactions: [],
      },
    };
    await saveSyncLedger(initialLedger, dataDir);

    const runDir = join(runsDir, runId);
    await mkdir(runDir, { recursive: true });
    await writeFile(
      join(runDir, "run.json"),
      JSON.stringify(createRunData(runId, "leijun-v1")),
    );
    await writeFile(join(runDir, "test.svg"), "<svg></svg>");

    await syncDataRepo({
      repoPath: repoDir,
      dataDir,
      dryRun: false,
      push: false,
    });

    const ledger = await loadSyncLedger(dataDir);
    assert.equal(ledger[runId]?.status, "published");
  });

  it("skipped 轮次在问题修正后下次同步可重新导出并覆盖为 exported", async () => {
    const runId = "20260927T021708Z";
    const initialLedger: SyncLedger = {
      [runId]: {
        status: "skipped",
        reason: "rejected",
        skippedAt: "2026-09-27T02:19:00Z",
        details: [{ file: "run.json", reason: "local-path" }],
      },
    };
    await saveSyncLedger(initialLedger, dataDir);

    // 本次文件已修复，是干净可导出的合法题目
    const runDir = join(runsDir, runId);
    await mkdir(runDir, { recursive: true });
    await writeFile(
      join(runDir, "run.json"),
      JSON.stringify(createRunData(runId, "classic-v1")),
    );
    await writeFile(
      join(runDir, "test.svg"),
      '<svg viewBox="0 0 10 10"><rect/></svg>',
    );

    const report = await syncDataRepo({
      repoPath: repoDir,
      dataDir,
      dryRun: false,
      push: false,
    });

    assert.equal(report.success, true);
    assert.deepEqual(report.exported, [runId]);

    const ledger = await loadSyncLedger(dataDir);
    assert.equal(ledger[runId]?.status, "exported");
    assert.ok(ledger[runId]?.commit);
  });
});

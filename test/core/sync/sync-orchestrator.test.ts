/**
 * 数据仓同步编排器（sync-orchestrator）测试。
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { syncDataRepo } from "@/core/sync/sync-orchestrator";
import {
  loadSyncLedger,
  syncLedgerPath,
} from "@/core/sync/sync-ledger";

describe("sync-orchestrator 同步流水线编排", () => {
  let tempBase: string;
  let remoteGitDir: string;
  let repoDir: string;
  let dataDir: string;
  let runsDir: string;
  let prevHome: string | undefined;

  beforeEach(async () => {
    tempBase = await mkdtemp(join(tmpdir(), "llm-iq-orchestrator-test-"));
    remoteGitDir = join(tempBase, "remote.git");
    repoDir = join(tempBase, "repo");
    dataDir = join(tempBase, "data");
    runsDir = join(dataDir, "runs");

    await mkdir(runsDir, { recursive: true });

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

    // 初始提交使分支存在
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

  function createSampleRun(runId: string, svgFileName = "test.svg") {
    return {
      runId,
      prompts: [{ promptId: "classic-v1", text: "draw", bindings: {} }],
      startedAt: "2026-09-27T02:17:08.000Z",
      finishedAt: "2026-09-27T02:18:00.000Z",
      durationMs: 52000,
      trigger: "schedule" as const,
      inProgress: false,
      attempts: [
        {
          targetId: "claude__model__low",
          promptId: "classic-v1",
          cli: "claude" as const,
          model: "model",
          effort: "low" as const,
          appliedEffort: "low" as const,
          effortHonored: true,
          label: "Claude",
          status: "ok" as const,
          svgFile: svgFileName,
          rawFile: null,
          startedAt: "2026-09-27T02:17:09.000Z",
          finishedAt: "2026-09-27T02:17:40.000Z",
          durationMs: 31000,
          svgBytes: 50,
          error: null,
          usage: null,
        },
      ],
    };
  }

  it("完整同步：导出有效轮次、写入数据仓、维护日索引与清单、提交并记账 exported", async () => {
    const runId = "20260927T021708Z";
    const runDir = join(runsDir, runId);
    await mkdir(runDir, { recursive: true });

    await writeFile(
      join(runDir, "run.json"),
      JSON.stringify(createSampleRun(runId)),
    );
    await writeFile(
      join(runDir, "test.svg"),
      '<svg viewBox="0 0 10 10"><rect/></svg>',
    );

    const report = await syncDataRepo({
      repoPath: repoDir,
      dataDir,
      push: false,
    });

    assert.equal(report.success, true);
    assert.deepEqual(report.exported, [runId]);
    assert.ok(report.commit !== null);
    assert.deepEqual(report.ledgerTransitions.exported, [runId]);
    assert.deepEqual(report.ledgerTransitions.published, []);

    // 检查目标文件已生成
    const targetRunJson = join(
      repoDir,
      "runs",
      "2026",
      "09",
      "27",
      runId,
      "run.json",
    );
    assert.ok(existsSync(targetRunJson));
    const targetSvg = join(repoDir, "runs", "2026", "09", "27", runId, "test.svg");
    assert.ok(existsSync(targetSvg));

    // 检查清单与日索引
    const manifest = JSON.parse(
      await readFile(join(repoDir, "index.json"), "utf8"),
    );
    assert.equal(manifest.totalRuns, 1);
    assert.equal(manifest.days[0].date, "2026-09-27");

    // 检查台账
    const ledger = await loadSyncLedger(dataDir);
    assert.equal(ledger[runId]?.status, "exported");
    assert.equal(ledger[runId]?.commit, report.commit);
  });

  it("支持 push：推送并经 merge-base 祖先校验确认，台账转为 published", async () => {
    const runId = "20260927T021708Z";
    const runDir = join(runsDir, runId);
    await mkdir(runDir, { recursive: true });

    await writeFile(
      join(runDir, "run.json"),
      JSON.stringify(createSampleRun(runId)),
    );
    await writeFile(
      join(runDir, "test.svg"),
      '<svg viewBox="0 0 10 10"><rect/></svg>',
    );

    const report = await syncDataRepo({
      repoPath: repoDir,
      dataDir,
      push: true,
    });

    assert.equal(report.success, true);
    assert.equal(report.pushed, true);
    assert.deepEqual(report.ledgerTransitions.published, [runId]);

    const ledger = await loadSyncLedger(dataDir);
    assert.equal(ledger[runId]?.status, "published");
    assert.ok(ledger[runId]?.publishedAt !== undefined);
  });

  it("无新导出时 --push 仍推送并把既有 exported 标为 published", async () => {
    const runId = "20260927T021708Z";
    const runDir = join(runsDir, runId);
    await mkdir(runDir, { recursive: true });
    await writeFile(
      join(runDir, "run.json"),
      JSON.stringify(createSampleRun(runId)),
    );
    await writeFile(
      join(runDir, "test.svg"),
      '<svg viewBox="0 0 10 10"><rect/></svg>',
    );

    // 1. 首次导出（不推送到远程，状态为 exported）
    const r1 = await syncDataRepo({ repoPath: repoDir, dataDir, push: false });
    assert.equal(r1.exported.length, 1);

    const l1 = await loadSyncLedger(dataDir);
    assert.equal(l1[runId]?.status, "exported");

    // 2. 第二次同步：没有新轮次，但是传了 --push
    const r2 = await syncDataRepo({ repoPath: repoDir, dataDir, push: true });
    assert.equal(r2.exported.length, 0);
    assert.equal(r2.pushed, true);
    assert.deepEqual(r2.ledgerTransitions.published, [runId]);

    const l2 = await loadSyncLedger(dataDir);
    assert.equal(l2[runId]?.status, "published");
    assert.ok(l2[runId]?.publishedAt !== undefined);
  });

  it("幂等补记：台账缺记录但已有目录时补记为 exported，随后 --push 标 published", async () => {
    const runId = "20260927T021708Z";
    const runDir = join(runsDir, runId);
    await mkdir(runDir, { recursive: true });
    await writeFile(
      join(runDir, "run.json"),
      JSON.stringify(createSampleRun(runId)),
    );
    await writeFile(
      join(runDir, "test.svg"),
      '<svg viewBox="0 0 10 10"><rect/></svg>',
    );

    // 首次同步生成提交
    const r1 = await syncDataRepo({ repoPath: repoDir, dataDir, push: false });
    const initialCommit = r1.commit;
    assert.ok(initialCommit !== null);

    // 人工删除台账文件，模拟台账缺失但数据仓已包含内容
    await rm(syncLedgerPath(dataDir));
    const ledgerEmpty = await loadSyncLedger(dataDir);
    assert.equal(ledgerEmpty[runId], undefined);

    // 再次同步：检测到已有内容一致，幂等跳过，并补记到台账
    const r2 = await syncDataRepo({ repoPath: repoDir, dataDir, push: false });
    assert.equal(r2.exported.length, 0);
    assert.ok(r2.skipped.some((s) => s.runId === runId && s.reason === "idempotent"));
    assert.deepEqual(r2.ledgerTransitions.exported, [runId]);

    const l2 = await loadSyncLedger(dataDir);
    assert.equal(l2[runId]?.status, "exported");
    assert.equal(l2[runId]?.commit, initialCommit);

    // 后续 --push 应当将其标记为 published
    const r3 = await syncDataRepo({ repoPath: repoDir, dataDir, push: true });
    assert.deepEqual(r3.ledgerTransitions.published, [runId]);
    const l3 = await loadSyncLedger(dataDir);
    assert.equal(l3[runId]?.status, "published");
  });

  it("--push 时在导出前先 fetch 并 merge --ff-only；不能快进时中止且不做写入", async () => {
    // 制造远程与本地分叉
    const otherClone = join(tempBase, "other");
    execFileSync("git", ["clone", remoteGitDir, otherClone]);
    execFileSync("git", ["-C", otherClone, "config", "user.name", "Tester"]);
    execFileSync("git", [
      "-C",
      otherClone,
      "config",
      "user.email",
      "tester@example.com",
    ]);
    await writeFile(join(otherClone, "remote-note.txt"), "remote\n");
    execFileSync("git", ["-C", otherClone, "add", "."]);
    execFileSync("git", ["-C", otherClone, "commit", "-m", "remote commit"]);
    execFileSync("git", ["-C", otherClone, "push", "origin", "main"]);

    // 本地仓库也提交一个不同内容使分叉
    await writeFile(join(repoDir, "local-note.txt"), "local\n");
    execFileSync("git", ["-C", repoDir, "add", "."]);
    execFileSync("git", ["-C", repoDir, "commit", "-m", "local commit"]);

    // 准备一个新轮次
    const runId = "20260927T050000Z";
    const runDir = join(runsDir, runId);
    await mkdir(runDir, { recursive: true });
    await writeFile(
      join(runDir, "run.json"),
      JSON.stringify(createSampleRun(runId)),
    );

    // 执行带 push 的同步：应在导出前快进失败并抛错
    await assert.rejects(
      () => syncDataRepo({ repoPath: repoDir, dataDir, push: true }),
      /远程分支无法快进合并/,
    );

    // 验证数据仓没有写入该轮次目录，未做任何修改
    const targetDir = join(repoDir, "runs", "2026", "09", "27", runId);
    assert.ok(!existsSync(targetDir));
  });

  it("脱敏拦截报告：列出文件名与原因，台账记录脱敏项", async () => {
    const runId = "20260927T021708Z";
    const runDir = join(runsDir, runId);
    await mkdir(runDir, { recursive: true });
    await writeFile(
      join(runDir, "run.json"),
      JSON.stringify(createSampleRun(runId, "leak.svg")),
    );
    // 包含本机绝对路径的 SVG
    await writeFile(
      join(runDir, "leak.svg"),
      '<svg><text>/Users/alice/my-file.txt</text></svg>',
    );

    const report = await syncDataRepo({
      repoPath: repoDir,
      dataDir,
      push: false,
    });

    assert.equal(report.exported.length, 1);
    assert.equal(report.redactions.length, 1);
    assert.equal(report.redactions[0]?.runId, runId);
    assert.deepEqual(report.redactions[0]?.redactions, [
      { file: "leak.svg", reason: "local-path" },
    ]);

    const ledger = await loadSyncLedger(dataDir);
    assert.deepEqual(ledger[runId]?.redactions, [
      { file: "leak.svg", reason: "local-path" },
    ]);
  });

  it("幂等跳过与冲突拒绝覆盖", async () => {
    const runId = "20260927T021708Z";
    const runDir = join(runsDir, runId);
    await mkdir(runDir, { recursive: true });

    await writeFile(
      join(runDir, "run.json"),
      JSON.stringify(createSampleRun(runId)),
    );
    await writeFile(
      join(runDir, "test.svg"),
      '<svg viewBox="0 0 10 10"><rect/></svg>',
    );

    // 首次同步
    await syncDataRepo({ repoPath: repoDir, dataDir, push: false });

    // 再次同步相同内容：视为幂等跳过
    const report2 = await syncDataRepo({ repoPath: repoDir, dataDir, push: false });
    assert.equal(report2.exported.length, 0);
    assert.ok(
      report2.skipped.some((s) => s.runId === runId && s.reason === "idempotent"),
    );

    // 修改本地 run.json 使其产生差异
    const modifiedRun = createSampleRun(runId);
    modifiedRun.durationMs = 99999;
    await writeFile(join(runDir, "run.json"), JSON.stringify(modifiedRun));

    // 再次同步：检测到内容不一致，判定为冲突并拒绝覆盖
    const reportConflict = await syncDataRepo({
      repoPath: repoDir,
      dataDir,
      push: false,
    });
    assert.ok(reportConflict.conflicts.includes(runId));
    assert.equal(reportConflict.exported.length, 0);
  });

  it("dryRun: 零写入保证（不写数据仓、不写台账、不生成 git commit）", async () => {
    const runId = "20260927T021708Z";
    const runDir = join(runsDir, runId);
    await mkdir(runDir, { recursive: true });

    await writeFile(
      join(runDir, "run.json"),
      JSON.stringify(createSampleRun(runId)),
    );
    await writeFile(
      join(runDir, "test.svg"),
      '<svg viewBox="0 0 10 10"><rect/></svg>',
    );

    const report = await syncDataRepo({
      repoPath: repoDir,
      dataDir,
      dryRun: true,
    });

    assert.equal(report.dryRun, true);
    assert.deepEqual(report.exported, [runId]);
    assert.equal(report.commit, null);

    // 验证目标仓无 runs/ 目录
    assert.ok(!existsSync(join(repoDir, "runs")));
    // 验证无台账文件
    assert.ok(!existsSync(syncLedgerPath(dataDir)));
  });
});

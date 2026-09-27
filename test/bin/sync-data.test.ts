/**
 * sync-data CLI 命令行工具测试。
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { parseCliArgs, runSyncCli } from "@/bin/sync-data";
import { commitSync, pushCurrentBranch } from "@/core/sync/data-repo-git";
import {
  loadSyncLedger,
  saveSyncLedger,
  type SyncLedger,
} from "@/core/sync/sync-ledger";

describe("sync-data CLI", () => {
  let tempBase: string;
  let remoteGitDir: string;
  let repoDir: string;
  let dataDir: string;
  let runsDir: string;
  let previousDataDir: string | undefined;
  let prevHome: string | undefined;
  let prevConfig: string | undefined;

  beforeEach(async () => {
    tempBase = await mkdtemp(join(tmpdir(), "llm-iq-cli-test-"));
    remoteGitDir = join(tempBase, "remote.git");
    repoDir = join(tempBase, "repo");
    dataDir = join(tempBase, "data");
    runsDir = join(dataDir, "runs");
    await mkdir(runsDir, { recursive: true });

    previousDataDir = process.env.PELICAN_DATA_DIR;
    process.env.PELICAN_DATA_DIR = dataDir;

    prevHome = process.env.HOME;
    process.env.HOME = tempBase;

    // 不读取本机真实配置：指向一个不存在的配置文件，使 dataRepo 视为未配置
    prevConfig = process.env.PELICAN_CONFIG;
    process.env.PELICAN_CONFIG = join(tempBase, "absent.config.yaml");

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
    await writeFile(join(repoDir, "README.md"), "# Data\n");
    execFileSync("git", ["-C", repoDir, "checkout", "-B", "main"]);
    execFileSync("git", ["-C", repoDir, "add", "."]);
    execFileSync("git", ["-C", repoDir, "commit", "-m", "chore: init"]);
    execFileSync("git", ["-C", repoDir, "push", "-u", "origin", "main"]);
  });

  afterEach(async () => {
    if (previousDataDir === undefined) delete process.env.PELICAN_DATA_DIR;
    else process.env.PELICAN_DATA_DIR = previousDataDir;

    if (prevHome !== undefined) process.env.HOME = prevHome;
    else delete process.env.HOME;

    if (prevConfig === undefined) delete process.env.PELICAN_CONFIG;
    else process.env.PELICAN_CONFIG = prevConfig;

    await rm(tempBase, { recursive: true, force: true });
  });

  it("parseCliArgs 正确解析各选项", () => {
    const args = [
      "--repo",
      "/my/repo",
      "--dry-run",
      "--push",
      "--confirm-published",
      "--json",
      "--run",
      "20260927T010000Z",
      "--run",
      "20260927T020000Z",
    ];
    const parsed = parseCliArgs(args);
    assert.equal(parsed.repoPath, "/my/repo");
    assert.equal(parsed.dryRun, true);
    assert.equal(parsed.push, true);
    assert.equal(parsed.confirmPublished, true);
    assert.equal(parsed.json, true);
    assert.deepEqual(parsed.runIds, ["20260927T010000Z", "20260927T020000Z"]);
  });

  it("缺少 repo 参数且未配置时退出码为 1", async () => {
    const errors: string[] = [];
    const code = await runSyncCli(
      [],
      () => {},
      (msg) => errors.push(msg),
    );
    assert.equal(code, 1);
    assert.ok(errors.some((e) => e.includes("未指定 --repo")));
  });

  it("正常同步并输出中文报告（包含脱敏与台账变化），退出码为 0", async () => {
    const runId = "20260927T021708Z";
    const dir = join(runsDir, runId);
    await mkdir(dir, { recursive: true });
    await writeFile(
      join(dir, "run.json"),
      JSON.stringify({
        runId,
        prompts: [{ promptId: "classic-v1", text: "draw", bindings: {} }],
        startedAt: "2026-09-27T02:17:08.000Z",
        finishedAt: "2026-09-27T02:18:00.000Z",
        durationMs: 52000,
        trigger: "schedule",
        inProgress: false,
        attempts: [
          {
            targetId: "claude__model__low",
            promptId: "classic-v1",
            cli: "claude",
            model: "model",
            effort: "low",
            appliedEffort: "low",
            effortHonored: true,
            label: "Claude",
            status: "ok",
            svgFile: "test.svg",
            rawFile: null,
            startedAt: "2026-09-27T02:17:09.000Z",
            finishedAt: "2026-09-27T02:17:40.000Z",
            durationMs: 31000,
            svgBytes: 11,
            error: null,
            usage: null,
          },
        ],
      }),
    );
    await writeFile(join(dir, "test.svg"), "<svg></svg>");

    const outputs: string[] = [];
    const code = await runSyncCli(
      ["--repo", repoDir, "--run", runId],
      (msg) => outputs.push(msg),
      () => {},
    );

    assert.equal(code, 0);
    assert.ok(outputs.some((o) => o.includes("数据仓同步报告")));
    assert.ok(outputs.some((o) => o.includes("[成功导出] 1 轮")));
    assert.ok(outputs.some((o) => o.includes("[脱敏拦截]")));
    assert.ok(outputs.some((o) => o.includes("[台账状态变化]")));
    assert.ok(outputs.some((o) => o.includes("新标为 exported: 1 轮")));
  });

  it("使用 --json 输出合法的 JSON 报告（包含 redactions 与 ledgerTransitions）", async () => {
    const outputs: string[] = [];
    const code = await runSyncCli(
      ["--repo", repoDir, "--dry-run", "--json"],
      (msg) => outputs.push(msg),
      () => {},
    );

    assert.equal(code, 0);
    const parsed = JSON.parse(outputs.join("\n"));
    assert.equal(parsed.dryRun, true);
    assert.equal(parsed.success, true);
    assert.ok(Array.isArray(parsed.redactions));
    assert.ok(parsed.ledgerTransitions !== undefined);
    assert.ok(Array.isArray(parsed.ledgerTransitions.exported));
    assert.ok(Array.isArray(parsed.ledgerTransitions.published));
  });

  it("存在被拒绝发布的轮次时退出码为 2", async () => {
    const runId = "20260927T021708Z";
    const dir = join(runsDir, runId);
    await mkdir(dir, { recursive: true });
    // 写入包含私钥的 run.json，使整轮拒绝发布
    await writeFile(
      join(dir, "run.json"),
      JSON.stringify({
        runId,
        prompts: [{ promptId: "classic-v1", text: "draw", bindings: {} }],
        startedAt: "2026-09-27T02:17:08.000Z",
        finishedAt: "2026-09-27T02:18:00.000Z",
        durationMs: 52000,
        trigger: "schedule",
        inProgress: false,
        attempts: [
          {
            targetId: "claude__model__low",
            promptId: "classic-v1",
            cli: "claude",
            model: "model",
            effort: "low",
            appliedEffort: "low",
            effortHonored: true,
            label: "Claude",
            status: "error",
            svgFile: null,
            rawFile: null,
            startedAt: "2026-09-27T02:17:09.000Z",
            finishedAt: "2026-09-27T02:17:40.000Z",
            durationMs: 31000,
            svgBytes: null,
            error: "-----BEGIN RSA PRIVATE KEY-----",
            usage: null,
          },
        ],
      }),
    );

    const outputs: string[] = [];
    const code = await runSyncCli(
      ["--repo", repoDir, "--run", runId],
      (msg) => outputs.push(msg),
      () => {},
    );

    assert.equal(code, 2);
    assert.ok(outputs.some((o) => o.includes("[拒绝发布] 1 轮")));
  });

  it("--confirm-published 与 --push 互斥时输出参数错误且退出码为 1", async () => {
    const errors: string[] = [];
    const code = await runSyncCli(
      ["--repo", repoDir, "--push", "--confirm-published"],
      () => {},
      (msg) => errors.push(msg),
    );
    assert.equal(code, 1);
    assert.ok(errors.some((e) => e.includes("互斥，不能同时使用")));
  });

  it("--confirm-published 正常运行输出人类可读报告且退出码为 0", async () => {
    const runId = "20260927T021708Z";
    await writeFile(join(repoDir, "run_confirm.json"), "{}\n");
    const commitSha = await commitSync(repoDir, [runId]);
    assert.ok(commitSha !== null);
    await pushCurrentBranch(repoDir);

    const ledger: SyncLedger = {
      [runId]: {
        status: "exported",
        exportedAt: "2026-09-27T02:18:00.000Z",
        commit: commitSha,
        redactions: [],
      },
    };
    await saveSyncLedger(ledger, dataDir);

    const outputs: string[] = [];
    const code = await runSyncCli(
      ["--repo", repoDir, "--confirm-published"],
      (msg) => outputs.push(msg),
      () => {},
    );

    assert.equal(code, 0);
    assert.ok(outputs.some((o) => o.includes("数据仓发布确认报告")));
    assert.ok(outputs.some((o) => o.includes("[发布确认] 新确认为 published: 1 轮")));
    assert.ok(outputs.some((o) => o.includes(runId)));

    const updatedLedger = await loadSyncLedger(dataDir);
    assert.equal(updatedLedger[runId]?.status, "published");
  });

  it("--confirm-published 配合 --json 输出合法 JSON 报告", async () => {
    const runId = "20260927T030000Z";
    await writeFile(join(repoDir, "run_json.json"), "{}\n");
    const commitSha = await commitSync(repoDir, [runId]);
    assert.ok(commitSha !== null);
    await pushCurrentBranch(repoDir);

    const ledger: SyncLedger = {
      [runId]: {
        status: "exported",
        exportedAt: "2026-09-27T03:01:00.000Z",
        commit: commitSha,
        redactions: [],
      },
    };
    await saveSyncLedger(ledger, dataDir);

    const outputs: string[] = [];
    const code = await runSyncCli(
      ["--repo", repoDir, "--confirm-published", "--json"],
      (msg) => outputs.push(msg),
      () => {},
    );

    assert.equal(code, 0);
    const parsed = JSON.parse(outputs.join("\n"));
    assert.equal(parsed.success, true);
    assert.deepEqual(parsed.confirmed, [runId]);
    assert.deepEqual(parsed.ledgerTransitions.published, [runId]);
  });

  it("--confirm-published 配合 --dry-run 零写入台账", async () => {
    const runId = "20260927T040000Z";
    await writeFile(join(repoDir, "run_dry.json"), "{}\n");
    const commitSha = await commitSync(repoDir, [runId]);
    assert.ok(commitSha !== null);
    await pushCurrentBranch(repoDir);

    const ledger: SyncLedger = {
      [runId]: {
        status: "exported",
        exportedAt: "2026-09-27T04:01:00.000Z",
        commit: commitSha,
        redactions: [],
      },
    };
    await saveSyncLedger(ledger, dataDir);

    const outputs: string[] = [];
    const code = await runSyncCli(
      ["--repo", repoDir, "--confirm-published", "--dry-run"],
      (msg) => outputs.push(msg),
      () => {},
    );

    assert.equal(code, 0);
    assert.ok(outputs.some((o) => o.includes("将被确认: 1 轮")));

    const checkLedger = await loadSyncLedger(dataDir);
    assert.equal(checkLedger[runId]?.status, "exported");
    assert.equal(checkLedger[runId]?.publishedAt, undefined);
  });

  it("--confirm-published 在 fetch 失败时输出错误原因且退出码为 1，台账不变", async () => {
    execFileSync("git", [
      "-C",
      repoDir,
      "remote",
      "set-url",
      "origin",
      "/nonexistent/remote.git",
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

    const errors: string[] = [];
    const code = await runSyncCli(
      ["--repo", repoDir, "--confirm-published"],
      () => {},
      (msg) => errors.push(msg),
    );

    assert.equal(code, 1);
    assert.ok(errors.some((e) => e.includes("发布确认失败") || e.includes("fetch 失败")));

    const checkLedger = await loadSyncLedger(dataDir);
    assert.equal(checkLedger[runId]?.status, "exported");
  });
});

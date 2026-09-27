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

describe("sync-data CLI", () => {
  let tempBase: string;
  let remoteGitDir: string;
  let repoDir: string;
  let dataDir: string;
  let runsDir: string;
  let previousDataDir: string | undefined;
  let prevHome: string | undefined;

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

    await rm(tempBase, { recursive: true, force: true });
  });

  it("parseCliArgs 正确解析各选项", () => {
    const args = [
      "--repo",
      "/my/repo",
      "--dry-run",
      "--push",
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
        attempts: [],
      }),
    );

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
});

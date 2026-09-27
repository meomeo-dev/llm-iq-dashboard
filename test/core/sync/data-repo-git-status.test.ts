/**
 * 数据仓 Git 只读查询测试：覆盖无上游、领先 N、落后 N、脏工作区与非 Git 目录。
 */

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { promisify } from "node:util";
import {
  getCurrentBranch,
  getAheadBehind,
  getAheadCommits,
  inspectGitRepo,
  isGitRepository,
  isWorkingTreeClean,
} from "@/core/sync/data-repo-git";

const execAsync = promisify(execFile);

async function runGit(cwd: string, args: string[]): Promise<string> {
  const { stdout } = await execAsync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
  });
  return stdout.trim();
}

describe("data-repo-git 只读状态查询", () => {
  let rootDir: string;
  let remoteDir: string;
  let localDir: string;

  before(async () => {
    rootDir = await mkdtemp(join(tmpdir(), "data-repo-git-test-"));
    remoteDir = join(rootDir, "remote.git");
    localDir = join(rootDir, "local");

    await mkdir(remoteDir, { recursive: true });
    await mkdir(localDir, { recursive: true });

    // 初始化 bare 远端仓库
    await runGit(remoteDir, ["init", "--bare", "--initial-branch=main"]);

    // 初始化本地仓库并设置本地级提交者身份（不碰全局配置）
    await runGit(localDir, ["init", "--initial-branch=main"]);
    await runGit(localDir, ["config", "user.name", "Test User"]);
    await runGit(localDir, ["config", "user.email", "test@example.com"]);
  });

  after(async () => {
    await rm(rootDir, { recursive: true, force: true });
  });

  it("非 Git 目录或不存在目录返回安全结果，不抛出异常", async () => {
    const nonExistent = join(rootDir, "does-not-exist");
    const inspectMissing = await inspectGitRepo(nonExistent);
    assert.strictEqual(inspectMissing.reachable, false);
    assert.strictEqual(inspectMissing.isGitRepo, false);

    const normalDir = join(rootDir, "plain-dir");
    await mkdir(normalDir, { recursive: true });
    const inspectPlain = await inspectGitRepo(normalDir);
    assert.strictEqual(inspectPlain.reachable, true);
    assert.strictEqual(inspectPlain.isGitRepo, false);
    assert.strictEqual(inspectPlain.clean, false);
    assert.strictEqual(await isGitRepository(normalDir), false);
  });

  it("无上游分支时：ahead/behind 为 null，aheadCommits 为空", async () => {
    // 首次提交
    await writeFile(join(localDir, "init.txt"), "hello", "utf8");
    await runGit(localDir, ["add", "init.txt"]);
    await runGit(localDir, ["commit", "-m", "init commit"]);

    assert.strictEqual(await isGitRepository(localDir), true);
    assert.strictEqual(await isWorkingTreeClean(localDir), true);
    assert.strictEqual(await getCurrentBranch(localDir), "main");
    assert.strictEqual(await getAheadBehind(localDir), null);
    assert.deepStrictEqual(await getAheadCommits(localDir), []);

    const inspection = await inspectGitRepo(localDir);
    assert.strictEqual(inspection.isGitRepo, true);
    assert.strictEqual(inspection.clean, true);
    assert.strictEqual(inspection.branch, "main");
    assert.strictEqual(inspection.upstream, null);
    assert.strictEqual(inspection.ahead, null);
    assert.strictEqual(inspection.behind, null);
    assert.deepStrictEqual(inspection.aheadCommits, []);
  });

  it("配置上游并领先 N 个提交时：正确返回 ahead 计数与短哈希清单（新在先）", async () => {
    // 推送到远端并建立追踪分支
    await runGit(localDir, ["remote", "add", "origin", remoteDir]);
    await runGit(localDir, ["push", "-u", "origin", "main"]);

    // 此时与上游同步
    const synced = await inspectGitRepo(localDir);
    assert.strictEqual(synced.upstream, "origin/main");
    assert.strictEqual(synced.ahead, 0);
    assert.strictEqual(synced.behind, 0);
    assert.deepStrictEqual(synced.aheadCommits, []);

    // 本地产生 2 个新提交
    await writeFile(join(localDir, "file1.txt"), "c1", "utf8");
    await runGit(localDir, ["add", "file1.txt"]);
    await runGit(localDir, ["commit", "-m", "commit 1"]);
    const sha1 = await runGit(localDir, ["rev-parse", "--short", "HEAD"]);

    await writeFile(join(localDir, "file2.txt"), "c2", "utf8");
    await runGit(localDir, ["add", "file2.txt"]);
    await runGit(localDir, ["commit", "-m", "commit 2"]);
    const sha2 = await runGit(localDir, ["rev-parse", "--short", "HEAD"]);

    const inspection = await inspectGitRepo(localDir);
    assert.strictEqual(inspection.ahead, 2);
    assert.strictEqual(inspection.behind, 0);
    // 新的在前面
    assert.deepStrictEqual(inspection.aheadCommits, [sha2, sha1]);
  });

  it("落后 N 个提交时：正确计算 behind 计数", async () => {
    // 把当前 HEAD 推送至远端，再将本地 HEAD 重置回 2 个提交之前
    await runGit(localDir, ["push", "origin", "main"]);
    await runGit(localDir, ["reset", "--hard", "HEAD~2"]);

    const counts = await getAheadBehind(localDir);
    assert.notStrictEqual(counts, null);
    assert.strictEqual(counts?.ahead, 0);
    assert.strictEqual(counts?.behind, 2);

    const inspection = await inspectGitRepo(localDir);
    assert.strictEqual(inspection.ahead, 0);
    assert.strictEqual(inspection.behind, 2);
    assert.deepStrictEqual(inspection.aheadCommits, []);
  });

  it("工作区包含未暂存或未跟踪文件时 clean 为 false", async () => {
    assert.strictEqual(await isWorkingTreeClean(localDir), true);
    await writeFile(join(localDir, "dirty.txt"), "untracked", "utf8");
    assert.strictEqual(await isWorkingTreeClean(localDir), false);

    const inspection = await inspectGitRepo(localDir);
    assert.strictEqual(inspection.clean, false);

    // 清理脏文件恢复干净状态
    await rm(join(localDir, "dirty.txt"));
    assert.strictEqual(await isWorkingTreeClean(localDir), true);
  });
});

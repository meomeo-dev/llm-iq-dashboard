/**
 * 数据仓 Git 操作适配器（data-repo-git）测试。
 * 使用临时 bare 仓作为远端。
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  assertRepoClean,
  commitSync,
  fetchAndFastForward,
  getDirectoryLatestCommit,
  gitExec,
  isCommitInUpstream,
  pushAndVerify,
  pushCurrentBranch,
} from "@/core/sync/data-repo-git";

describe("data-repo-git Git 操作适配", () => {
  let tempBase: string;
  let remoteDir: string;
  let localDir: string;
  let prevHome: string | undefined;

  beforeEach(async () => {
    tempBase = await mkdtemp(join(tmpdir(), "llm-iq-git-test-"));
    remoteDir = join(tempBase, "remote.git");
    localDir = join(tempBase, "local");

    prevHome = process.env.HOME;
    process.env.HOME = tempBase;

    // 初始化 bare 远端并在本地克隆
    execFileSync("git", ["init", "--bare", remoteDir]);
    execFileSync("git", [
      "--git-dir",
      remoteDir,
      "symbolic-ref",
      "HEAD",
      "refs/heads/main",
    ]);
    execFileSync("git", ["clone", remoteDir, localDir]);
    execFileSync("git", ["-C", localDir, "config", "user.name", "Tester"]);
    execFileSync("git", [
      "-C",
      localDir,
      "config",
      "user.email",
      "tester@example.com",
    ]);

    // 初始提交使分支存在
    await writeFile(join(localDir, "README.md"), "# Data Repo\n");
    execFileSync("git", ["-C", localDir, "checkout", "-B", "main"]);
    execFileSync("git", ["-C", localDir, "add", "."]);
    execFileSync("git", ["-C", localDir, "commit", "-m", "chore: init repo"]);
    execFileSync("git", ["-C", localDir, "push", "-u", "origin", "main"]);
  });

  afterEach(async () => {
    if (prevHome !== undefined) process.env.HOME = prevHome;
    else delete process.env.HOME;
    await rm(tempBase, { recursive: true, force: true });
  });

  it("assertRepoClean: 干净时通过，有未提交文件时抛错中止", async () => {
    await assert.doesNotReject(() => assertRepoClean(localDir));

    await writeFile(join(localDir, "dirty.txt"), "dirty content\n");
    await assert.rejects(
      () => assertRepoClean(localDir),
      /数据仓工作区不干净，请先提交或清理未提交的修改后再同步/,
    );
  });

  it("用全局身份的临时 HOME 下 commit 成功", async () => {
    // 建立临时用户 HOME 并在其中配置全局 .gitconfig
    const globalHome = await mkdtemp(join(tmpdir(), "llm-iq-global-home-"));
    const globalGitConfig = `[user]
  name = Global Tester
  email = global@example.com
`;
    await writeFile(join(globalHome, ".gitconfig"), globalGitConfig, "utf8");

    // 克隆一个没有本地 user.name / user.email 配置的仓库
    const noConfigRepo = join(tempBase, "no-config-repo");
    execFileSync("git", ["clone", remoteDir, noConfigRepo]);

    const oldHome = process.env.HOME;
    process.env.HOME = globalHome;

    try {
      await writeFile(join(noConfigRepo, "global-test.txt"), "from global identity\n");
      const sha = await commitSync(noConfigRepo, ["20260927T010000Z"]);
      assert.ok(sha !== null);

      const author = await gitExec(noConfigRepo, [
        "log",
        "-1",
        "--pretty=format:%an <%ae>",
      ]);
      assert.equal(author.trim(), "Global Tester <global@example.com>");
    } finally {
      process.env.HOME = oldHome;
      await rm(globalHome, { recursive: true, force: true });
    }
  });

  it("gitExec 超时视为失败并给出中文原因", async () => {
    await assert.rejects(
      () => gitExec(localDir, ["status"], 1),
      (err: Error) => {
        return (
          err.message.includes("Git 命令执行超时") &&
          err.message.includes("git status")
        );
      },
    );
  });

  it("commitSync: 正常生成 chore(data) 提交，正文列出 runIds", async () => {
    await writeFile(join(localDir, "test.json"), '{"hello":"world"}\n');
    const runIds = ["20260927T010000Z", "20260927T020000Z"];

    const sha = await commitSync(localDir, runIds);
    assert.ok(sha !== null && sha.length >= 7);

    const log = await gitExec(localDir, ["log", "-1", "--pretty=format:%B"]);
    assert.ok(log.includes("chore(data): sync 2 run(s)"));
    assert.ok(log.includes("- 20260927T010000Z"));
    assert.ok(log.includes("- 20260927T020000Z"));
  });

  it("commitSync: 无变更时不产生提交并返回 null", async () => {
    const sha = await commitSync(localDir, ["20260927T010000Z"]);
    assert.equal(sha, null);
  });

  it("fetchAndFastForward: 无上游时跳过，无法快进时报错中止", async () => {
    // 1. 无上游分支的分支：跳过不报错
    const noUpstreamDir = join(tempBase, "no-upstream");
    execFileSync("git", ["init", noUpstreamDir]);
    await writeFile(join(noUpstreamDir, "file.txt"), "hello");
    execFileSync("git", ["-C", noUpstreamDir, "config", "user.name", "Tester"]);
    execFileSync("git", [
      "-C",
      noUpstreamDir,
      "config",
      "user.email",
      "tester@example.com",
    ]);
    execFileSync("git", ["-C", noUpstreamDir, "add", "."]);
    execFileSync("git", ["-C", noUpstreamDir, "commit", "-m", "init"]);
    await assert.doesNotReject(() => fetchAndFastForward(noUpstreamDir));

    // 2. 有上游且可快进：正常完成
    await assert.doesNotReject(() => fetchAndFastForward(localDir));

    // 3. 产生分叉导致无法快进：抛错中止
    // 在另一个克隆推送到远端
    const otherClone = join(tempBase, "other-clone");
    execFileSync("git", ["clone", remoteDir, otherClone]);
    execFileSync("git", ["-C", otherClone, "config", "user.name", "Tester"]);
    execFileSync("git", [
      "-C",
      otherClone,
      "config",
      "user.email",
      "tester@example.com",
    ]);
    await writeFile(join(otherClone, "remote-change.txt"), "remote\n");
    execFileSync("git", ["-C", otherClone, "add", "."]);
    execFileSync("git", ["-C", otherClone, "commit", "-m", "remote commit"]);
    execFileSync("git", ["-C", otherClone, "push", "origin", "main"]);

    // 在 local 提交不同的内容导致分叉
    await writeFile(join(localDir, "local-change.txt"), "local\n");
    await commitSync(localDir, ["20260927T030000Z"]);

    await assert.rejects(
      () => fetchAndFastForward(localDir),
      /远程分支无法快进合并/,
    );
  });

  it("getDirectoryLatestCommit 与 isCommitInUpstream 正确工作", async () => {
    const dirPath = "runs/2026/09/27/sample";
    await writeFile(join(localDir, "file1.txt"), "first\n");
    const sha1 = await commitSync(localDir, ["run1"]);
    assert.ok(sha1 !== null);

    // 未推送前，isCommitInUpstream 应为 false
    const inUpstreamBefore = await isCommitInUpstream(localDir, sha1);
    assert.equal(inUpstreamBefore, false);

    await pushCurrentBranch(localDir);

    // 推送后，isCommitInUpstream 应为 true
    const inUpstreamAfter = await isCommitInUpstream(localDir, sha1);
    assert.equal(inUpstreamAfter, true);

    // 测试 getDirectoryLatestCommit
    const emptyCheck = await getDirectoryLatestCommit(localDir, dirPath);
    assert.equal(emptyCheck, null);

    execFileSync("mkdir", ["-p", join(localDir, dirPath)]);
    await writeFile(join(localDir, dirPath, "run.json"), "{}\n");
    const sha2 = await commitSync(localDir, ["sample"]);
    assert.ok(sha2 !== null);

    const dirCommit = await getDirectoryLatestCommit(localDir, dirPath);
    assert.equal(dirCommit, sha2);
  });

  it("pushAndVerify: 推送后经 merge-base 祖先校验确认远端包含", async () => {
    await writeFile(join(localDir, "data.txt"), "some data\n");
    const sha = await commitSync(localDir, ["20260927T010000Z"]);
    assert.ok(sha !== null);

    await assert.doesNotReject(() => pushAndVerify(localDir, sha));

    const remoteLog = execFileSync(
      "git",
      ["--git-dir", remoteDir, "rev-parse", "HEAD"],
      { encoding: "utf8" },
    );
    assert.equal(remoteLog.trim(), sha);
  });
});

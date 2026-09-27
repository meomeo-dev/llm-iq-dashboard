/**
 * 执行器 runner push 认领与二次校验测试。
 *
 * 覆盖：
 * 1. 待推送提交清单比对（aheadCommits 不一致时拒绝推送并报错）；
 * 2. 未连接 GitHub App 时拒绝推送；
 * 3. web 进程持锁转交的推送不被锁拒绝。
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import { handle } from "@/bin/runner";
import {
  writeAccessToken,
  writeGithubApp,
  writeGithubUser,
} from "@/core/github-auth";
import { enqueueRequest, readRequest } from "@/core/requests";
import { acquireDataRepoSyncLock } from "@/core/sync/data-repo-action-lock";
import { getAheadCommits } from "@/core/sync/data-repo-git";

describe("runner push 认领与二次校验", () => {
  let rootDir: string;
  let testDataDir: string;
  let testSecretsDir: string;
  let remoteGitDir: string;
  let repoDir: string;
  let configPath: string;

  const originalEnv = { ...process.env };

  before(async () => {
    rootDir = await mkdtemp(join(tmpdir(), "runner-push-test-"));
    testDataDir = join(rootDir, "data");
    testSecretsDir = join(rootDir, "secrets");
    remoteGitDir = join(rootDir, "remote.git");
    repoDir = join(rootDir, "repo");
    configPath = join(rootDir, "pelican.config.yaml");

    await mkdir(testDataDir, { recursive: true });
    await mkdir(testSecretsDir, { recursive: true });

    // 初始化 bare 远程与本地 Git 仓库
    execFileSync("git", ["init", "--bare", remoteGitDir]);
    execFileSync("git", ["--git-dir", remoteGitDir, "symbolic-ref", "HEAD", "refs/heads/main"]);
    execFileSync("git", ["clone", remoteGitDir, repoDir]);
    execFileSync("git", ["-C", repoDir, "config", "user.name", "Tester"]);
    execFileSync("git", ["-C", repoDir, "config", "user.email", "tester@example.com"]);
    await writeFile(join(repoDir, "README.md"), "# Initial\n", "utf8");
    execFileSync("git", ["-C", repoDir, "checkout", "-B", "main"]);
    execFileSync("git", ["-C", repoDir, "add", "."]);
    execFileSync("git", ["-C", repoDir, "commit", "-m", "chore: init"]);
    execFileSync("git", ["-C", repoDir, "push", "-u", "origin", "main"]);

    process.env.PELICAN_DATA_DIR = testDataDir;
    process.env.PELICAN_SECRETS_DIR = testSecretsDir;
    process.env.PELICAN_CONFIG = configPath;

    const configYaml = `
schedule:
  cron: null
  intervalMinutes: null
run:
  promptIds: [classic-v1]
targets:
  - id: t1
    cli: claude
    model: claude-sonnet-5
    effort: low
dataRepo:
  path: ${repoDir}
  autoSync: true
  push: false
`;
    await writeFile(configPath, configYaml, "utf8");
  });

  after(async () => {
    process.env = { ...originalEnv };
    await rm(rootDir, { recursive: true, force: true });
  });

  async function mockConnectedCredentials(fullName: string = "meomeo-dev/llm-iq-data"): Promise<void> {
    await writeGithubApp(
      {
        id: 1,
        slug: "test-app",
        client_id: "test-cid",
        client_secret: "test-csec",
        createdAt: new Date().toISOString(),
      },
      testSecretsDir,
    );
    await writeGithubUser(
      {
        login: "meomeo-dev",
        refresh_token: "ref-tok",
        expiresAt: new Date(Date.now() + 3600_000).toISOString(),
        refreshExpiresAt: new Date(Date.now() + 86400_000).toISOString(),
        repositoryFullName: fullName,
      },
      testSecretsDir,
    );
    await writeAccessToken("ghu_mock_token_12345", testSecretsDir);
  }

  it("aheadCommits 二次校验：确认后产生新提交时，runner 拒绝推送", async () => {
    await mockConnectedCredentials();

    // 产生第一个提交
    await writeFile(join(repoDir, "file1.txt"), "content 1", "utf8");
    execFileSync("git", ["-C", repoDir, "add", "file1.txt"]);
    execFileSync("git", ["-C", repoDir, "commit", "-m", "feat: commit 1"]);
    const commitsAfterFirst = await getAheadCommits(repoDir);
    assert.equal(commitsAfterFirst.length, 1);
    const confirmedSha = commitsAfterFirst[0];
    assert.ok(confirmedSha, "应存在领先提交");

    // 产生第二个提交（模拟确认后、执行前有新提交产生）
    await writeFile(join(repoDir, "file2.txt"), "content 2", "utf8");
    execFileSync("git", ["-C", repoDir, "add", "file2.txt"]);
    execFileSync("git", ["-C", repoDir, "commit", "-m", "feat: commit 2"]);
    const actualAheadCommits = await getAheadCommits(repoDir);
    assert.equal(actualAheadCommits.length, 2);

    // 请求中只带确认过的第一个 sha
    const req = await enqueueRequest("sync-data", {
      syncAction: {
        mode: "push",
        confirmation: { aheadCommits: [confirmedSha] },
      },
    });

    await handle(req);

    const settled = await readRequest(req.id);
    assert.equal(settled?.state, "done");
    assert.equal(settled?.result?.syncResult?.ok, false);
    assert.ok(settled?.result?.syncResult?.error?.includes("待推送提交清单已发生变化"));

    // 验证远端依然没有这些提交
    const remoteRevList = execFileSync("git", [
      "--git-dir",
      remoteGitDir,
      "rev-list",
      "HEAD",
    ]).toString();
    assert.ok(!remoteRevList.includes(confirmedSha));
  });

  it("未连接 GitHub App 时 runner 拒绝 push", async () => {
    await rm(testSecretsDir, { recursive: true, force: true });
    await mkdir(testSecretsDir, { recursive: true });

    const req = await enqueueRequest("sync-data", {
      syncAction: {
        mode: "push",
        confirmation: { aheadCommits: ["dummy-sha"] },
      },
    });

    await handle(req);

    const settled = await readRequest(req.id);
    assert.equal(settled?.state, "done");
    assert.equal(settled?.result?.syncResult?.ok, false);
    assert.ok(settled?.result?.syncResult?.error?.includes("容器内无推送凭据"));
  });

  it("web 进程持有互斥锁转交的 push，runner 不因锁被占用而拒绝", async () => {
    await mockConnectedCredentials();
    const lock = await acquireDataRepoSyncLock();
    assert.equal(lock.acquired, true);

    try {
      const req = await enqueueRequest("sync-data", {
        syncAction: {
          mode: "push",
          confirmation: { aheadCommits: [] },
        },
      });

      await handle(req);

      const settled = await readRequest(req.id);
      assert.equal(settled?.state, "done");
      const error = settled?.result?.syncResult?.error ?? "";
      assert.ok(!error.includes("已有一个数据仓动作正在执行"), `不应因锁拒绝：${error}`);
    } finally {
      await lock.release();
    }
  });
});

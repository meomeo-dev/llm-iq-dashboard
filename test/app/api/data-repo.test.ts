/**
 * 数据仓所有者接口单测（GET /api/data-repo 与 POST /api/data-repo/sync）。
 *
 * 覆盖：非所有者 401/403、只读 403、未配置 409、请求体非法 400、
 * push 确认清单不一致 409、externalRunner 下 push 409、并发 409。
 */

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import { promisify } from "node:util";
import { GET } from "@/app/api/data-repo/route";
import { POST } from "@/app/api/data-repo/sync/route";
import { ACTION_HEADER } from "@/core/auth/guard";
import { issueSession, SESSION_COOKIE } from "@/core/auth/session";
import { acquireDataRepoSyncLock } from "@/core/sync/data-repo-action-lock";

const execAsync = promisify(execFile);

describe("数据仓 API 路由守卫与动作处理", () => {
  let rootDir: string;
  let testDataDir: string;
  let testRepoDir: string;
  let configPath: string;
  let sessionCookie: string;

  const originalEnv = { ...process.env };

  before(async () => {
    rootDir = await mkdtemp(join(tmpdir(), "api-data-repo-test-"));
    testDataDir = join(rootDir, "data");
    testRepoDir = join(rootDir, "repo");
    configPath = join(rootDir, "pelican.config.yaml");

    await mkdir(testDataDir, { recursive: true });
    await mkdir(testRepoDir, { recursive: true });

    // 初始化 Git 仓库
    await execAsync("git", ["-C", testRepoDir, "init", "--initial-branch=main"]);
    await execAsync("git", ["-C", testRepoDir, "config", "user.name", "Tester"]);
    await execAsync("git", ["-C", testRepoDir, "config", "user.email", "tester@example.com"]);
    await writeFile(join(testRepoDir, "README.md"), "# Repo", "utf8");
    await execAsync("git", ["-C", testRepoDir, "add", "README.md"]);
    await execAsync("git", ["-C", testRepoDir, "commit", "-m", "chore: init"]);

    process.env.PELICAN_DATA_DIR = testDataDir;
    process.env.PELICAN_CONFIG = configPath;

    const { cookie } = await issueSession("test-owner-device");
    sessionCookie = cookie;
  });

  after(async () => {
    process.env = { ...originalEnv };
    await rm(rootDir, { recursive: true, force: true });
  });

  beforeEach(async () => {
    delete process.env.PELICAN_READONLY;
    delete process.env.PELICAN_DATA_SOURCE;
    delete process.env.PELICAN_RUNNER;
  });

  async function writeConfigFile(includeDataRepo: boolean): Promise<void> {
    const yaml = `
schedule:
  cron: null
  intervalMinutes: null
run:
  promptIds:
    - classic-v1
targets:
  - id: target-1
    label: Target 1
    cli: claude
    model: claude-sonnet-5
    effort: low
${
  includeDataRepo
    ? `dataRepo:
  path: ${testRepoDir}
  autoSync: true
  push: false
`
    : ""
}`;
    await writeFile(configPath, yaml, "utf8");
  }

  it("GET /api/data-repo：非所有者返回 401", async () => {
    await writeConfigFile(true);
    const req = new Request("http://127.0.0.1:3000/api/data-repo");
    const res = await GET(req);
    assert.strictEqual(res.status, 401);
  });

  it("GET /api/data-repo：只读部署一律 403", async () => {
    await writeConfigFile(true);
    process.env.PELICAN_READONLY = "1";
    const req = new Request("http://127.0.0.1:3000/api/data-repo", {
      headers: { cookie: `${SESSION_COOKIE}=${sessionCookie}` },
    });
    const res = await GET(req);
    assert.strictEqual(res.status, 403);
    const body = await res.json();
    assert.strictEqual(body.error, "只读部署");
  });

  it("GET /api/data-repo：未配置时返回 200 且 configured=false", async () => {
    await writeConfigFile(false);
    const req = new Request("http://127.0.0.1:3000/api/data-repo", {
      headers: { cookie: `${SESSION_COOKIE}=${sessionCookie}` },
    });
    const res = await GET(req);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.configured, false);
    assert.strictEqual(body.repo, null);
  });

  it("POST /api/data-repo/sync：非所有者 401，缺少操作头 403", async () => {
    await writeConfigFile(true);
    // 无 cookie
    const reqNoAuth = new Request("http://127.0.0.1:3000/api/data-repo/sync", {
      method: "POST",
      body: JSON.stringify({ mode: "dry-run" }),
    });
    const resNoAuth = await POST(reqNoAuth);
    assert.strictEqual(resNoAuth.status, 401);

    // 有 cookie 但无 x-pelican-action 头
    const reqNoHeader = new Request("http://127.0.0.1:3000/api/data-repo/sync", {
      method: "POST",
      headers: { cookie: `${SESSION_COOKIE}=${sessionCookie}` },
      body: JSON.stringify({ mode: "dry-run" }),
    });
    const resNoHeader = await POST(reqNoHeader);
    assert.strictEqual(resNoHeader.status, 403);
  });

  it("POST /api/data-repo/sync：只读部署一律 403", async () => {
    await writeConfigFile(true);
    process.env.PELICAN_READONLY = "1";
    const req = new Request("http://127.0.0.1:3000/api/data-repo/sync", {
      method: "POST",
      headers: {
        cookie: `${SESSION_COOKIE}=${sessionCookie}`,
        [ACTION_HEADER]: "1",
      },
      body: JSON.stringify({ mode: "dry-run" }),
    });
    const res = await POST(req);
    assert.strictEqual(res.status, 403);
  });

  it("POST /api/data-repo/sync：未配置 dataRepo 返回 409", async () => {
    await writeConfigFile(false);
    const req = new Request("http://127.0.0.1:3000/api/data-repo/sync", {
      method: "POST",
      headers: {
        cookie: `${SESSION_COOKIE}=${sessionCookie}`,
        [ACTION_HEADER]: "1",
      },
      body: JSON.stringify({ mode: "dry-run" }),
    });
    const res = await POST(req);
    assert.strictEqual(res.status, 409);
    const body = await res.json();
    assert.match(body.error, /未配置数据仓/);
  });

  it("POST /api/data-repo/sync：请求体非法返回 400", async () => {
    await writeConfigFile(true);
    const send = async (body: string) =>
      POST(
        new Request("http://127.0.0.1:3000/api/data-repo/sync", {
          method: "POST",
          headers: {
            cookie: `${SESSION_COOKIE}=${sessionCookie}`,
            [ACTION_HEADER]: "1",
          },
          body,
        }),
      );

    assert.strictEqual((await send("")).status, 400);
    assert.strictEqual((await send("not json")).status, 400);
    assert.strictEqual((await send(JSON.stringify({ mode: "invalid-mode" }))).status, 400);
    // push 缺 confirmation
    assert.strictEqual((await send(JSON.stringify({ mode: "push" }))).status, 400);
    assert.strictEqual(
      (await send(JSON.stringify({ mode: "push", confirmation: {} }))).status,
      400,
    );
  });

  it("POST /api/data-repo/sync：externalRunner 下 push 返回 409", async () => {
    await writeConfigFile(true);
    process.env.PELICAN_RUNNER = "external";
    const req = new Request("http://127.0.0.1:3000/api/data-repo/sync", {
      method: "POST",
      headers: {
        cookie: `${SESSION_COOKIE}=${sessionCookie}`,
        [ACTION_HEADER]: "1",
      },
      body: JSON.stringify({
        mode: "push",
        confirmation: { aheadCommits: [] },
      }),
    });
    const res = await POST(req);
    assert.strictEqual(res.status, 409);
    const body = await res.json();
    assert.match(body.error, /容器内无推送凭据/);
  });

  it("POST /api/data-repo/sync：push 提交清单与当下不一致返回 409", async () => {
    await writeConfigFile(true);
    // 当下 repo 并没有领先 upstream 的提交（aheadCommits 是空），客户端传入 ["fake-sha"]
    const req = new Request("http://127.0.0.1:3000/api/data-repo/sync", {
      method: "POST",
      headers: {
        cookie: `${SESSION_COOKIE}=${sessionCookie}`,
        [ACTION_HEADER]: "1",
      },
      body: JSON.stringify({
        mode: "push",
        confirmation: { aheadCommits: ["fake1234"] },
      }),
    });
    const res = await POST(req);
    assert.strictEqual(res.status, 409);
    const body = await res.json();
    assert.match(body.error, /待推送提交清单已发生变化/);
  });

  it("POST /api/data-repo/sync：动作互斥并发返回 409", async () => {
    await writeConfigFile(true);
    // 先手动占住互斥锁
    const lock = await acquireDataRepoSyncLock(testDataDir);
    assert.strictEqual(lock.acquired, true);

    try {
      const req = new Request("http://127.0.0.1:3000/api/data-repo/sync", {
        method: "POST",
        headers: {
          cookie: `${SESSION_COOKIE}=${sessionCookie}`,
          [ACTION_HEADER]: "1",
        },
        body: JSON.stringify({ mode: "dry-run" }),
      });
      const res = await POST(req);
      assert.strictEqual(res.status, 409);
      const body = await res.json();
      assert.match(body.error, /已有一个数据仓动作正在执行/);
    } finally {
      await lock.release();
    }
  });

  it("POST /api/data-repo/sync：合法的 dry-run 动作执行成功并写回 lastAction", async () => {
    await writeConfigFile(true);
    const req = new Request("http://127.0.0.1:3000/api/data-repo/sync", {
      method: "POST",
      headers: {
        cookie: `${SESSION_COOKIE}=${sessionCookie}`,
        [ACTION_HEADER]: "1",
      },
      body: JSON.stringify({ mode: "dry-run" }),
    });
    const res = await POST(req);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.mode, "dry-run");
    assert.strictEqual(body.ok, true);
    assert.strictEqual(body.executedBy, "web");
    assert.notStrictEqual(body.report, null);
  });
});

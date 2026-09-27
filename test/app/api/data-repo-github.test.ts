/**
 * GitHub 授权与推送路由接口单测。
 *
 * 覆盖：
 * 1. 守卫校验：非所有者 401/403、只读部署 403；
 * 2. connect 路由：自动提交表单、清单 URL 继承请求 origin、已有应用时直接跳转安装页；
 * 3. app-created 与 callback 路由：缺 cookie 跳板、state 校验、重定向；
 * 4. disconnect 路由：所有者撤销并清空凭据；
 * 5. sync 路由：分容器下有 github-app 能力放行 push，无则 409；
 * 6. 请求文件敏感 code 擦除与过期清理。
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import { GET as connectGET } from "@/app/api/data-repo/github/connect/route";
import { GET as appCreatedGET } from "@/app/api/data-repo/github/app-created/route";
import { GET as callbackGET } from "@/app/api/data-repo/github/callback/route";
import { POST as disconnectPOST } from "@/app/api/data-repo/github/disconnect/route";
import { POST as syncPOST } from "@/app/api/data-repo/sync/route";
import { GITHUB_STATE_COOKIE } from "@/app/api/data-repo/github/github-helpers";
import { ACTION_HEADER } from "@/core/auth/guard";
import { issueSession, SESSION_COOKIE } from "@/core/auth/session";
import {
  clearGithubCredentials,
  createState,
  writeAccessToken,
  writeGithubApp,
} from "@/core/github-auth";
import {
  claimNextRequest,
  cleanStaleGithubRequestCodes,
  completeRequest,
  enqueueRequest,
  readRequest,
  type RunnerRequest,
} from "@/core/requests";

describe("GitHub 授权路由 API 集成测试", () => {
  let rootDir: string;
  let testDataDir: string;
  let testSecretsDir: string;
  let configPath: string;
  let sessionCookie: string;

  const originalEnv = { ...process.env };

  before(async () => {
    rootDir = await mkdtemp(join(tmpdir(), "api-github-test-"));
    testDataDir = join(rootDir, "data");
    testSecretsDir = join(rootDir, "secrets");
    configPath = join(rootDir, "pelican.config.yaml");

    await mkdir(testDataDir, { recursive: true });
    await mkdir(testSecretsDir, { recursive: true });

    process.env.PELICAN_DATA_DIR = testDataDir;
    process.env.PELICAN_SECRETS_DIR = testSecretsDir;
    process.env.PELICAN_CONFIG = configPath;

    const { cookie } = await issueSession("test-owner-device");
    sessionCookie = cookie;

    const configContent = `
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
  path: ${join(rootDir, "data-repo")}
  autoSync: true
  push: false
`;
    await writeFile(configPath, configContent, "utf8");
  });

  after(async () => {
    process.env = { ...originalEnv };
    await rm(rootDir, { recursive: true, force: true });
  });

  beforeEach(async () => {
    delete process.env.PELICAN_READONLY;
    delete process.env.PELICAN_RUNNER;
    await clearGithubCredentials(testSecretsDir);
  });

  async function mockRunnerRespondSequence(
    responses: Array<{
      matcher: (req: RunnerRequest) => boolean;
      result: NonNullable<RunnerRequest["result"]>;
    }>,
  ): Promise<void> {
    let idx = 0;
    for (let i = 0; i < 100; i++) {
      if (idx >= responses.length) return;
      const req = await claimNextRequest();
      if (req) {
        const current = responses[idx];
        if (current && current.matcher(req)) {
          await completeRequest(req.id, current.result);
          idx++;
        }
      }
      await new Promise((r) => setTimeout(r, 20));
    }
  }

  describe("权限与只读守卫", () => {
    it("非所有者访问各路由被阻断（未登录或凭据无效）", async () => {
      const resConnect = await connectGET(new Request("http://localhost:3000/api/data-repo/github/connect"));
      assert.equal(resConnect.status, 401);

      const invalidHeaders = { cookie: `${SESSION_COOKIE}=invalid_cookie_token` };
      const resCreated = await appCreatedGET(new Request("http://localhost:3000/api/data-repo/github/app-created", { headers: invalidHeaders }));
      assert.equal(resCreated.status, 401);

      const resCallback = await callbackGET(new Request("http://localhost:3000/api/data-repo/github/callback", { headers: invalidHeaders }));
      assert.equal(resCallback.status, 401);

      const resDisconnect = await disconnectPOST(new Request("http://localhost:3000/api/data-repo/github/disconnect", { method: "POST" }));
      assert.equal(resDisconnect.status, 401);
    });

    it("app-created 与 callback 缺会话 cookie 时返回跳板 HTML 页面且不产生副作用", async () => {
      const resCreated = await appCreatedGET(new Request("http://localhost:3000/api/data-repo/github/app-created?code=abc&state=xyz"));
      assert.equal(resCreated.status, 200);
      assert.equal(resCreated.headers.get("cache-control"), "no-store");
      assert.equal(resCreated.headers.get("referrer-policy"), "no-referrer");
      const htmlCreated = await resCreated.text();
      assert.ok(htmlCreated.includes('<meta http-equiv="refresh"'));
      assert.ok(htmlCreated.includes('/api/data-repo/github/app-created'));

      const resCallback = await callbackGET(new Request("http://localhost:3000/api/data-repo/github/callback?code=abc&state=xyz"));
      assert.equal(resCallback.status, 200);
      assert.equal(resCallback.headers.get("cache-control"), "no-store");
      assert.equal(resCallback.headers.get("referrer-policy"), "no-referrer");
      const htmlCallback = await resCallback.text();
      assert.ok(htmlCallback.includes('<meta http-equiv="refresh"'));
      assert.ok(htmlCallback.includes('/api/data-repo/github/callback'));
    });

    it("只读部署下所有接口返回 403", async () => {
      process.env.PELICAN_READONLY = "1";
      const headers = { cookie: `${SESSION_COOKIE}=${sessionCookie}`, [ACTION_HEADER]: "1" };

      const res1 = await connectGET(new Request("http://localhost:3000/api/data-repo/github/connect", { headers }));
      assert.equal(res1.status, 403);

      const res2 = await appCreatedGET(new Request("http://localhost:3000/api/data-repo/github/app-created", { headers }));
      assert.equal(res2.status, 403);

      const res3 = await callbackGET(new Request("http://localhost:3000/api/data-repo/github/callback", { headers }));
      assert.equal(res3.status, 403);

      const res4 = await disconnectPOST(new Request("http://localhost:3000/api/data-repo/github/disconnect", { method: "POST", headers }));
      assert.equal(res4.status, 403);
    });
  });

  describe("GET /api/data-repo/github/connect", () => {
    it("未创建应用时返回自动提交表单且清单 URL 继承请求 origin", async () => {
      const origin = "http://my-dashboard.local:8080";
      const req = new Request(`${origin}/api/data-repo/github/connect`, {
        headers: { cookie: `${SESSION_COOKIE}=${sessionCookie}` },
      });
      const res = await connectGET(req);
      assert.equal(res.status, 200);

      const html = await res.text();
      assert.ok(html.includes("https://github.com/settings/apps/new?state="));
      assert.ok(html.includes(`${origin}/api/data-repo/github/app-created`));
      assert.ok(html.includes(`${origin}/api/data-repo/github/callback`));

      const setCookie = res.headers.get("set-cookie") ?? "";
      assert.ok(setCookie.includes(GITHUB_STATE_COOKIE));
      assert.ok(setCookie.includes("HttpOnly"));
      assert.ok(setCookie.includes("Path=/api/data-repo/github"));
    });

    it("清单回跳地址以 Host 头为准，而非服务监听地址", async () => {
      const req = new Request("http://0.0.0.0:3000/api/data-repo/github/connect", {
        headers: { cookie: `${SESSION_COOKIE}=${sessionCookie}`, host: "localhost:3000" },
      });
      const res = await connectGET(req);
      assert.equal(res.status, 200);

      const html = await res.text();
      assert.ok(html.includes("http://localhost:3000/api/data-repo/github/app-created"));
      assert.ok(!html.includes("0.0.0.0"));
    });

    it("已有应用时直接 302 重定向至安装页", async () => {
      await writeGithubApp(
        {
          id: 100,
          slug: "existing-app-slug",
          client_id: "cid",
          client_secret: "csec",
          createdAt: new Date().toISOString(),
        },
        testSecretsDir,
      );

      const req = new Request("http://localhost:3000/api/data-repo/github/connect", {
        headers: { cookie: `${SESSION_COOKIE}=${sessionCookie}` },
      });
      const res = await connectGET(req);
      assert.equal(res.status, 302);
      assert.equal(
        res.headers.get("location"),
        "https://github.com/apps/existing-app-slug/installations/new",
      );
    });
  });

  describe("GET /api/data-repo/github/app-created", () => {
    it("state 不匹配或缺失返回 400", async () => {
      const state = createState();
      const req = new Request(
        `http://localhost:3000/api/data-repo/github/app-created?code=abc&state=wrong-state`,
        {
          headers: {
            cookie: `${SESSION_COOKIE}=${sessionCookie}; ${GITHUB_STATE_COOKIE}=${state}`,
          },
        },
      );
      const res = await appCreatedGET(req);
      assert.equal(res.status, 400);
      const json = await res.json();
      assert.ok(json.error.includes("OAuth state 校验失败"));
    });
  });

  describe("GET /api/data-repo/github/callback", () => {
    it("state 不匹配重定向至错误页并携带机器码 reason", async () => {
      const state = createState();
      const req = new Request(
        "http://localhost:3000/api/data-repo/github/callback?code=abc&state=wrong-state",
        {
          headers: {
            cookie: `${SESSION_COOKIE}=${sessionCookie}; ${GITHUB_STATE_COOKIE}=${state}`,
          },
        },
      );
      const res = await callbackGET(req);
      assert.equal(res.status, 302);
      const loc = res.headers.get("location") ?? "";
      assert.ok(loc.includes("/config?github=error&reason=state_mismatch"));
    });

    it("缺 state 且无应用凭据时重定向至 invalid_session 错误", async () => {
      const req = new Request(
        "http://localhost:3000/api/data-repo/github/callback?code=abc",
        {
          headers: {
            cookie: `${SESSION_COOKIE}=${sessionCookie}`,
          },
        },
      );
      const res = await callbackGET(req);
      assert.equal(res.status, 302);
      const loc = res.headers.get("location") ?? "";
      assert.ok(loc.includes("/config?github=error&reason=invalid_session"));
    });

    it("缺 code 时重定向至 missing_code 错误", async () => {
      const state = createState();
      const req = new Request(
        `http://localhost:3000/api/data-repo/github/callback?state=${state}`,
        {
          headers: {
            cookie: `${SESSION_COOKIE}=${sessionCookie}; ${GITHUB_STATE_COOKIE}=${state}`,
          },
        },
      );
      const res = await callbackGET(req);
      assert.equal(res.status, 302);
      const loc = res.headers.get("location") ?? "";
      assert.ok(loc.includes("/config?github=error&reason=missing_code"));
    });
  });

  describe("POST /api/data-repo/github/disconnect", () => {
    it("所有者可成功调用断开并清除本地凭据", async () => {
      await writeGithubApp(
        {
          id: 1,
          slug: "test-slug",
          client_id: "cid",
          client_secret: "csec",
          createdAt: new Date().toISOString(),
        },
        testSecretsDir,
      );
      await writeAccessToken("token123", testSecretsDir);

      const req = new Request("http://localhost:3000/api/data-repo/github/disconnect", {
        method: "POST",
        headers: {
          cookie: `${SESSION_COOKIE}=${sessionCookie}`,
          [ACTION_HEADER]: "1",
        },
      });

      const res = await disconnectPOST(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.ok, true);
      assert.equal(json.github.state, "disconnected");
    });
  });

  describe("POST /api/data-repo/sync push 能力放行与阻断", () => {
    it("分容器部署下无 github-app 能力时阻断 push 为 409", async () => {
      process.env.PELICAN_RUNNER = "external";

      const mockRunnerPromise = mockRunnerRespondSequence([
        {
          matcher: (r) => r.kind === "data-repo-status",
          result: {
            statusResult: {
              repo: null,
              manifest: null,
              github: { state: "disconnected", login: null, appSlug: null, appSettingsUrl: null },
              pushCapability: "unavailable",
            },
          },
        },
      ]);

      const req = new Request("http://localhost:3000/api/data-repo/sync", {
        method: "POST",
        headers: {
          cookie: `${SESSION_COOKIE}=${sessionCookie}`,
          [ACTION_HEADER]: "1",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          mode: "push",
          confirmation: { aheadCommits: ["a1b2c3d"] },
        }),
      });

      const [res] = await Promise.all([syncPOST(req), mockRunnerPromise]);
      assert.equal(res.status, 409);
      const json = await res.json();
      assert.ok(json.error.includes("容器内无推送凭据"));
    });

    it("分容器部署下具有 github-app 能力且确认清单有效时放行 push", async () => {
      process.env.PELICAN_RUNNER = "external";

      const mockRunnerPromise = mockRunnerRespondSequence([
        {
          matcher: (r) => r.kind === "data-repo-status",
          result: {
            statusResult: {
              repo: null,
              manifest: null,
              github: { state: "connected", login: "meomeo-dev", appSlug: "slug", appSettingsUrl: null },
              pushCapability: "github-app",
            },
          },
        },
        {
          matcher: (r) => r.kind === "sync-data",
          result: {
            syncResult: {
              mode: "push",
              startedAt: new Date().toISOString(),
              finishedAt: new Date().toISOString(),
              ok: true,
              report: null,
              executedBy: "runner",
              error: null,
            },
          },
        },
      ]);

      const req = new Request("http://localhost:3000/api/data-repo/sync", {
        method: "POST",
        headers: {
          cookie: `${SESSION_COOKIE}=${sessionCookie}`,
          [ACTION_HEADER]: "1",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          mode: "push",
          confirmation: { aheadCommits: ["a1b2c3d"] },
        }),
      });

      const [res] = await Promise.all([syncPOST(req), mockRunnerPromise]);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.ok, true);
      assert.equal(json.executedBy, "runner");
    });
  });

  describe("请求授权码擦除与过期清理", () => {
    it("settle 后请求体中的 code 字段被覆盖为 null", async () => {
      const req = await enqueueRequest("github-token-exchange", {
        githubAction: { code: "super-secret-oauth-code" },
      });
      assert.equal(req.githubAction?.code, "super-secret-oauth-code");

      await completeRequest(req.id, {
        githubConnection: { state: "connected", login: "user", appSlug: "slug", appSettingsUrl: null },
      });

      const settled = await readRequest(req.id);
      assert.equal(settled?.githubAction?.code, null);
    });

    it("cleanStaleGithubRequestCodes 清理超过 1 小时的未完成请求中的 code", async () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000);
      const staleReq = await enqueueRequest(
        "github-app-convert",
        { githubAction: { code: "stale-code" } },
        twoHoursAgo,
      );

      const cleanedCount = await cleanStaleGithubRequestCodes();
      assert.ok(cleanedCount >= 1);

      const updated = await readRequest(staleReq.id);
      assert.equal(updated?.githubAction?.code, null);
    });
  });
});

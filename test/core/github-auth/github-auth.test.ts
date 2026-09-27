/**
 * GitHub 认证核心逻辑单测（manifest、github-api、credential-store、push-env、status）。
 */

import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import {
  buildManifest,
  buildPushEnv,
  clearGithubCredentials,
  convertManifest,
  createState,
  exchangeCode,
  parseGitHubRemote,
  readAccessToken,
  readGithubApp,
  readGithubConnection,
  readGithubUser,
  refreshToken,
  revokeGrant,
  sanitizeApiError,
  secretsDir,
  tokenFilePath,
  verifyState,
  writeAccessToken,
  writeGithubApp,
  writeGithubUser,
} from "@/core/github-auth";

describe("GitHub Auth 核心模块", () => {
  let testRoot: string;
  let testSecrets: string;
  const originalEnv = { ...process.env };

  before(async () => {
    testRoot = await mkdtemp(join(tmpdir(), "github-auth-test-"));
    testSecrets = join(testRoot, "secrets");
    process.env.PELICAN_SECRETS_DIR = testSecrets;
  });

  after(async () => {
    process.env = { ...originalEnv };
    await rm(testRoot, { recursive: true, force: true });
  });

  beforeEach(async () => {
    await clearGithubCredentials(testSecrets);
  });

  describe("清单字段与 origin 校验", () => {
    it("合法 origin 正常生成符合 ACR-011 的清单字段", () => {
      const manifest = buildManifest("http://localhost:3000", "https://github.com/org/repo");
      assert.ok(manifest.name.startsWith("llm-iq-data-publisher-"));
      assert.equal(manifest.url, "https://github.com/org/repo");
      assert.equal(manifest.hook_attributes.active, false);
      assert.equal(manifest.hook_attributes.url, manifest.url);
      assert.equal(manifest.public, false);
      assert.equal(manifest.default_permissions.contents, "write");
      assert.equal(manifest.default_permissions.metadata, "read");
      assert.equal(manifest.redirect_url, "http://localhost:3000/api/data-repo/github/app-created");
      assert.deepEqual(manifest.callback_urls, [
        "http://localhost:3000/api/data-repo/github/callback",
      ]);
      assert.equal(manifest.request_oauth_on_install, true);
    });

    it("origin 携带路径、查询参数或非法协议时抛错", () => {
      assert.throws(() => buildManifest("http://localhost:3000/foo", "https://github.com/org/repo"));
      assert.throws(() => buildManifest("http://localhost:3000?a=1", "https://github.com/org/repo"));
      assert.throws(() => buildManifest("ftp://localhost:3000", "https://github.com/org/repo"));
      assert.throws(() => buildManifest("not-a-url", "https://github.com/org/repo"));
    });

    it("state 生成与 timingSafeEqual 校验", () => {
      const s1 = createState();
      const s2 = createState();
      assert.equal(typeof s1, "string");
      assert.notEqual(s1, s2);
      assert.equal(verifyState(s1, s1), true);
      assert.equal(verifyState(s1, s2), false);
      assert.equal(verifyState(s1, null), false);
      assert.equal(verifyState("", ""), false);
    });
  });

  describe("GitHub API 调用与错误脱敏", () => {
    it("convertManifest：成功转换并丢弃 pem", async () => {
      const fakeFetch: typeof fetch = async () =>
        new Response(
          JSON.stringify({
            id: 12345,
            slug: "test-app",
            client_id: "Iv1.test",
            client_secret: "secret-abc",
            pem: "-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----",
            webhook_secret: "whsec_123",
          }),
          { status: 201 },
        );

      const res = await convertManifest("code-123", fakeFetch);
      assert.equal(res.id, 12345);
      assert.equal(res.slug, "test-app");
      assert.equal(res.client_id, "Iv1.test");
      assert.equal(res.client_secret, "secret-abc");
      assert.equal((res as unknown as Record<string, unknown>).pem, undefined);
      assert.equal((res as unknown as Record<string, unknown>).webhook_secret, undefined);
    });

    it("convertManifest：200 + error 形态识别为失败且错误信息不含 code", async () => {
      const sensitiveCode = "sensitive-code-xyz987";
      const fakeFetch: typeof fetch = async () =>
        new Response(
          JSON.stringify({
            error: "bad_code",
            error_description: `The code ${sensitiveCode} is invalid`,
          }),
          { status: 200 },
        );

      await assert.rejects(
        () => convertManifest(sensitiveCode, fakeFetch),
        (err: Error) => {
          assert.ok(!err.message.includes(sensitiveCode));
          assert.ok(err.message.includes("[REDACTED]"));
          return true;
        },
      );
    });

    it("API 调用超时测试", async () => {
      const fakeFetch: typeof fetch = async () => {
        const error = new Error("This operation was aborted");
        error.name = "AbortError";
        throw error;
      };

      await assert.rejects(
        () => convertManifest("code-123", fakeFetch),
        /aborted/i,
      );
    });

    it("exchangeCode 与 refreshToken 脱敏：错误信息不含令牌与 client_secret", async () => {
      const secret = "ghs_SecretKeySuperSensitive999";
      const token = "ghu_1234567890abcdefghijklmnopqrstuvwxyz";
      const fakeFetch: typeof fetch = async () =>
        new Response(
          JSON.stringify({
            error: "invalid_grant",
            error_description: `Failed with token ${token} and secret ${secret}`,
          }),
          { status: 200 },
        );

      await assert.rejects(
        () =>
          exchangeCode(
            { client_id: "id", client_secret: secret },
            "some-code",
            null,
            fakeFetch,
          ),
        (err: Error) => {
          assert.ok(!err.message.includes(secret));
          assert.ok(!err.message.includes(token));
          return true;
        },
      );

      await assert.rejects(
        () =>
          refreshToken(
            { client_id: "id", client_secret: secret },
            token,
            fakeFetch,
          ),
        (err: Error) => {
          assert.ok(!err.message.includes(secret));
          assert.ok(!err.message.includes(token));
          return true;
        },
      );
    });

    it("revokeGrant：成功发送 basic auth 请求", async () => {
      let called = false;
      const fakeFetch: typeof fetch = async (url, init) => {
        called = true;
        assert.equal(init?.method, "DELETE");
        return new Response(null, { status: 204 });
      };
      await revokeGrant({ client_id: "cid", client_secret: "csec" }, "token123", fakeFetch);
      assert.equal(called, true);
    });
  });

  describe("凭据安全存储与权限", () => {
    it("目录 0o700 与文件 0o600 权限保障", async () => {
      await writeGithubApp(
        {
          id: 1,
          slug: "slug",
          client_id: "cid",
          client_secret: "csec",
          createdAt: new Date().toISOString(),
        },
        testSecrets,
      );
      await writeAccessToken("ghu_token_123456789", testSecrets);

      const dirStat = await stat(testSecrets);
      const appFileStat = await stat(join(testSecrets, "github-app.json"));
      const tokenFileStat = await stat(tokenFilePath(testSecrets));

      // 验证权限掩码低 9 位
      assert.equal(dirStat.mode & 0o777, 0o700);
      assert.equal(appFileStat.mode & 0o777, 0o600);
      assert.equal(tokenFileStat.mode & 0o777, 0o600);
    });

    it("清除凭据只删已知文件，不影响其他文件", async () => {
      await writeAccessToken("token", testSecrets);
      const customFile = join(testSecrets, "do-not-delete.txt");
      await writeFile(customFile, "important user data", "utf8");

      await clearGithubCredentials(testSecrets);

      assert.equal(await readAccessToken(testSecrets), null);
      assert.equal(await readFile(customFile, "utf8"), "important user data");
    });
  });

  describe("推送环境构建与刷新", () => {
    it("parseGitHubRemote：正确解析常见形式", () => {
      assert.equal(
        parseGitHubRemote("https://github.com/owner/repo.git"),
        "owner/repo",
      );
      assert.equal(
        parseGitHubRemote("https://github.com/Owner/Repo/"),
        "Owner/Repo",
      );
      assert.equal(parseGitHubRemote("git@github.com:owner/repo.git"), null);
      assert.equal(parseGitHubRemote("https://gitlab.com/owner/repo"), null);
    });

    it("远程仓库与已授权仓库不符时抛错", async () => {
      await writeGithubUser(
        {
          login: "test-user",
          refresh_token: "ref-1",
          expiresAt: new Date(Date.now() + 3600_000).toISOString(),
          refreshExpiresAt: new Date(Date.now() + 86400_000).toISOString(),
          repositoryFullName: "meomeo-dev/llm-iq-data",
        },
        testSecrets,
      );
      await writeAccessToken("ghu_valid_token", testSecrets);

      await assert.rejects(
        () => buildPushEnv("https://github.com/attacker/malicious-repo", testSecrets),
        /不匹配/,
      );
    });

    it("大小写不敏感匹配成功，且 env 不含令牌本身", async () => {
      await writeGithubUser(
        {
          login: "test-user",
          refresh_token: "ref-1",
          expiresAt: new Date(Date.now() + 3600_000).toISOString(),
          refreshExpiresAt: new Date(Date.now() + 86400_000).toISOString(),
          repositoryFullName: "meomeo-dev/llm-iq-data",
        },
        testSecrets,
      );
      const secretToken = "ghu_SecretTokenNotToLeak_9999999";
      await writeAccessToken(secretToken, testSecrets);

      const res = await buildPushEnv(
        "https://github.com/MeoMeo-Dev/LLM-IQ-DATA.git",
        testSecrets,
      );
      assert.ok(res.env.GIT_ASKPASS.endsWith("git-askpass.sh"));
      assert.equal(res.env.GIT_TERMINAL_PROMPT, "0");
      assert.equal(res.env.PELICAN_GIT_TOKEN_FILE, tokenFilePath(testSecrets));
      assert.deepEqual(res.gitArgs, ["-c", "credential.helper="]);

      // 绝对不含令牌
      const envStr = JSON.stringify(res.env);
      assert.ok(!envStr.includes(secretToken));
    });

    it("临期（不足 10 分钟）自动触发刷新并写回", async () => {
      await writeGithubApp(
        {
          id: 1,
          slug: "test-app",
          client_id: "cid",
          client_secret: "csec",
          createdAt: new Date().toISOString(),
        },
        testSecrets,
      );

      // 还有 5 分钟过期
      await writeGithubUser(
        {
          login: "test-user",
          refresh_token: "old-refresh",
          expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          refreshExpiresAt: new Date(Date.now() + 86400_000).toISOString(),
          repositoryFullName: "org/data",
        },
        testSecrets,
      );
      await writeAccessToken("old-access", testSecrets);

      let refreshed = false;
      const fakeFetch: typeof fetch = async () => {
        refreshed = true;
        return new Response(
          JSON.stringify({
            access_token: "new-access-token",
            refresh_token: "new-refresh-token",
            expires_in: 28800,
            refresh_token_expires_in: 15778800,
          }),
          { status: 200 },
        );
      };

      await buildPushEnv("https://github.com/org/data", {
        customSecretsDir: testSecrets,
        fetchFn: fakeFetch,
      });

      assert.equal(refreshed, true);
      assert.equal(await readAccessToken(testSecrets), "new-access-token");
      const user = await readGithubUser(testSecrets);
      assert.equal(user?.refresh_token, "new-refresh-token");
    });
  });

  describe("readGithubConnection 状态映射", () => {
    it("无应用凭据为 disconnected", async () => {
      const conn = await readGithubConnection(testSecrets);
      assert.equal(conn.state, "disconnected");
      assert.equal(conn.login, null);
    });

    it("有应用无用户为 app-created", async () => {
      await writeGithubApp(
        {
          id: 1,
          slug: "my-app",
          client_id: "cid",
          client_secret: "csec",
          createdAt: new Date().toISOString(),
        },
        testSecrets,
      );
      const conn = await readGithubConnection(testSecrets);
      assert.equal(conn.state, "app-created");
      assert.equal(conn.appSlug, "my-app");
      assert.equal(conn.login, null);
    });

    it("有用户且刷新令牌未过期为 connected", async () => {
      await writeGithubApp(
        {
          id: 1,
          slug: "my-app",
          client_id: "cid",
          client_secret: "csec",
          createdAt: new Date().toISOString(),
        },
        testSecrets,
      );
      await writeGithubUser(
        {
          login: "meomeo-dev",
          refresh_token: "ref",
          expiresAt: new Date(Date.now() + 3600_000).toISOString(),
          refreshExpiresAt: new Date(Date.now() + 86400_000).toISOString(),
          repositoryFullName: "meomeo-dev/llm-iq-data",
        },
        testSecrets,
      );
      const conn = await readGithubConnection(testSecrets);
      assert.equal(conn.state, "connected");
      assert.equal(conn.login, "meomeo-dev");
    });

    it("readGithubConnection 返回 clientId", async () => {
      await writeGithubApp(
        {
          id: 1,
          slug: "my-app",
          client_id: "Iv1.myclientid",
          client_secret: "csec",
          createdAt: new Date().toISOString(),
        },
        testSecrets,
      );
      const conn = await readGithubConnection(testSecrets);
      assert.equal(conn.clientId, "Iv1.myclientid");
    });

    it("secureWriteFile 在指定自定义目录时正确使用其父目录并设置 0o600 权限", async () => {
      const customSubdir = join(testRoot, "custom-subdir");
      await writeGithubApp(
        {
          id: 2,
          slug: "custom-app",
          client_id: "custom-cid",
          client_secret: "custom-csec",
          createdAt: new Date().toISOString(),
        },
        customSubdir,
      );
      const appStat = await stat(join(customSubdir, "github-app.json"));
      assert.equal(appStat.mode & 0o777, 0o600);
      const loaded = await readGithubApp(customSubdir);
      assert.equal(loaded?.slug, "custom-app");
    });

    it("无 refresh_token 的令牌被视为不过期，buildPushEnv 不执行刷新", async () => {
      await writeGithubUser(
        {
          login: "test-user-no-refresh",
          refresh_token: null,
          expiresAt: null,
          refreshExpiresAt: null,
          repositoryFullName: "org/static-token-repo",
        },
        testSecrets,
      );
      await writeAccessToken("static-token-12345", testSecrets);

      let fetchCalled = false;
      const fakeFetch: typeof fetch = async () => {
        fetchCalled = true;
        return new Response("{}", { status: 200 });
      };

      const res = await buildPushEnv("https://github.com/org/static-token-repo", {
        customSecretsDir: testSecrets,
        fetchFn: fakeFetch,
      });

      assert.equal(fetchCalled, false);
      assert.ok(res.env.PELICAN_GIT_TOKEN_FILE);
    });

    it("刷新失败时标记 reconnectRequired，下次读取连接状态返回 reconnect-required", async () => {
      await writeGithubApp(
        {
          id: 1,
          slug: "test-app",
          client_id: "cid",
          client_secret: "csec",
          createdAt: new Date().toISOString(),
        },
        testSecrets,
      );
      await writeGithubUser(
        {
          login: "test-user",
          refresh_token: "bad-refresh",
          expiresAt: new Date(Date.now() + 120_000).toISOString(),
          refreshExpiresAt: new Date(Date.now() + 86400_000).toISOString(),
          repositoryFullName: "org/repo",
        },
        testSecrets,
      );
      await writeAccessToken("expiring-access", testSecrets);

      const fakeFetch: typeof fetch = async () =>
        new Response(
          JSON.stringify({ error: "bad_refresh_token", error_description: "The refresh token is invalid" }),
          { status: 200 },
        );

      await assert.rejects(
        () =>
          buildPushEnv("https://github.com/org/repo", {
            customSecretsDir: testSecrets,
            fetchFn: fakeFetch,
          }),
        /刷新令牌失败/,
      );

      const user = await readGithubUser(testSecrets);
      assert.equal(user?.reconnectRequired, true);

      const conn = await readGithubConnection(testSecrets);
      assert.equal(conn.state, "reconnect-required");
    });
  });
});

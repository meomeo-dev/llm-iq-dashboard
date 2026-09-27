/** 输出泄漏拦截：凭据令牌的滑窗指纹命中、未命中与短串不计 */

import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, test } from "node:test";
import { buildLeakGuard, credentialFiles, leakGuardFromText, WINDOW } from "@/core/leak-guard";

const TOKEN = "sk-test-0123456789abcdefghijklmnopqrstuvwxyz";
const CREDENTIALS = JSON.stringify({ claudeAiOauth: { accessToken: TOKEN, expiresAt: 1790000000000 } });

describe("leakGuardFromText", () => {
  test("令牌整段、嵌在更长字符串里或只露出一段都命中", () => {
    const guard = leakGuardFromText([CREDENTIALS]);
    assert.ok(guard.size > 0);
    assert.equal(guard.hits(`<svg><text>${TOKEN}</text></svg>`), true);
    assert.equal(guard.hits(`token=${TOKEN}&x=1`), true);
    assert.equal(guard.hits(TOKEN.slice(5, 5 + WINDOW + 3)), true);
  });

  test("正常作品与短于窗口的片段不命中；没有凭据时永不命中", () => {
    const guard = leakGuardFromText([CREDENTIALS]);
    assert.equal(guard.hits('<svg viewBox="0 0 400 300"><circle cx="200" cy="150" r="40" fill="#fdb"/></svg>'), false);
    assert.equal(guard.hits(TOKEN.slice(0, WINDOW - 1)), false);
    assert.equal(leakGuardFromText([]).hits(TOKEN), false);
  });
});

describe("buildLeakGuard", () => {
  test("读取存在的凭据文件，忽略不存在的", async () => {
    const dir = await mkdtemp(join(tmpdir(), "leak-guard-"));
    const present = join(dir, "auth.json");
    await writeFile(present, CREDENTIALS, "utf8");
    const guard = await buildLeakGuard([present, join(dir, "missing")]);
    assert.equal(guard.hits(TOKEN), true);
  });

  test("凭据文件位置遵循各 CLI 的目录环境变量", () => {
    const files = credentialFiles({ CLAUDE_CONFIG_DIR: "/cfg/claude", CODEX_HOME: "/cfg/codex" }, "/home/u");
    assert.deepEqual(files, [
      "/cfg/claude/.credentials.json",
      "/cfg/codex/auth.json",
      "/home/u/.gemini/antigravity-cli/antigravity-oauth-token",
    ]);
  });
});

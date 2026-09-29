/**
 * profile 的 codex 运行目录：生成的 config.toml、目录隔离与清理、key 只进子进程环境；
 * 会话池按 CLI × profile 分开且不回落到登录态。不启动 codex。
 */

import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import {
  createProfileHome,
  PROFILE_KEY_ENV,
  renderProfileConfig,
} from "../../src/adapters/codex-profile-home";
import { spawnDetached } from "../../src/adapters/exec";
import { openSessionPool } from "../../src/adapters/index";
import type { ProfileLaunch } from "../../src/adapters/types";

const KEY = "sk-profile-home-test-0123456789";
const LAUNCH: ProfileLaunch = {
  name: "relay-a",
  baseUrl: "https://relay.example.com/v1",
  queryParams: { "api-version": "2025-04-01" },
  apiKey: KEY,
};

test("renderProfileConfig: 唯一 provider 指向上游、从环境读 key、走 responses、不落历史", () => {
  const toml = renderProfileConfig(LAUNCH);
  assert.match(toml, /^model_provider = "pelican"$/m);
  assert.match(toml, /^\[model_providers\.pelican\]$/m);
  assert.match(toml, /^base_url = "https:\/\/relay\.example\.com\/v1"$/m);
  assert.match(toml, new RegExp(`^env_key = "${PROFILE_KEY_ENV}"$`, "m"));
  assert.match(toml, /^wire_api = "responses"$/m);
  assert.match(toml, /^requires_openai_auth = false$/m);
  assert.match(toml, /^query_params = \{ "api-version" = "2025-04-01" \}$/m);
  assert.match(toml, /^\[history\]\npersistence = "none"$/m);
  assert.equal(toml.includes(KEY), false);
});

test("renderProfileConfig: 没有查询参数时不写 query_params；引号与反斜杠被转义", () => {
  const toml = renderProfileConfig({ ...LAUNCH, name: 'a"b\\c', queryParams: {} });
  assert.equal(toml.includes("query_params"), false);
  assert.match(toml, /^name = "a\\"b\\\\c"$/m);
});

test("createProfileHome: 目录仅属主可读，只有 config.toml，key 只在环境里；dispose 删除目录", async () => {
  const home = await createProfileHome(LAUNCH);
  try {
    assert.equal((await stat(home.dir)).mode & 0o777, 0o700);
    assert.deepEqual(await readdir(home.dir), ["config.toml"]);
    const written = await readFile(join(home.dir, "config.toml"), "utf8");
    assert.equal(written, renderProfileConfig(LAUNCH));
    assert.deepEqual(home.env, { CODEX_HOME: home.dir, HOME: home.dir, [PROFILE_KEY_ENV]: KEY });
  } finally {
    await home.dispose();
  }
  await assert.rejects(stat(home.dir), { code: "ENOENT" });
  await home.dispose();
});

test("createProfileHome: 两个 profile 的目录互不相同", async () => {
  const [a, b] = await Promise.all([createProfileHome(LAUNCH), createProfileHome({ ...LAUNCH, name: "b" })]);
  try {
    assert.notEqual(a.dir, b.dir);
  } finally {
    await Promise.all([a.dispose(), b.dispose()]);
  }
});

test("spawnDetached: 额外环境只进子进程，不改本进程环境", async () => {
  const child = spawnDetached(
    { binary: process.execPath, args: ["-e", `process.stdout.write(process.env.${PROFILE_KEY_ENV} ?? "")`] },
    process.cwd(),
    { [PROFILE_KEY_ENV]: KEY },
  );
  child.stdin.end();
  let out = "";
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk: string) => (out += chunk));
  await new Promise((resolve) => child.once("close", resolve));
  assert.equal(out, KEY);
  assert.equal(process.env[PROFILE_KEY_ENV], undefined);
});

test("openSessionPool: 按 CLI × profile 分会话；缺启动参数或 CLI 不支持时抛错", async () => {
  const pool = openSessionPool(new Map([["relay-a", LAUNCH]]));
  const login = pool.sessionFor("codex");
  assert.equal(pool.sessionFor("codex", "default"), login);
  const relay = pool.sessionFor("codex", "relay-a");
  assert.notEqual(relay, login);
  assert.equal(pool.sessionFor("codex", "relay-a"), relay);
  assert.throws(() => pool.sessionFor("codex", "relay-b"), /没有启动参数/);
  assert.throws(() => pool.sessionFor("claude", "relay-a"), /不支持 profile/);
  // 未发起调用的会话没有进程，关闭即返回
  await pool.closeAll();
});

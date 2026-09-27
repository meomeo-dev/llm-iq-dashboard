/**
 * CLI 就绪预检：只拦截确定的问题（未安装、明确未登录），其余放行。
 * 输出样本取自各 CLI 的真实输出，测试不调用 CLI。
 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { CommandOutput } from "@/capabilities/probe-command";
import { agyHasRefreshToken, blocksCalls, classifyReadiness } from "@/capabilities/readiness";

const output = (stdout: string, extra: Partial<CommandOutput> = {}): CommandOutput => ({
  ok: stdout.trim() !== "", stdout, error: null, notFound: false, ...extra,
});
const NO_ENV = {};

describe("classifyReadiness", () => {
  test("不在 PATH 中为 missing，并给出安装命令", () => {
    const result = classifyReadiness("claude", output("", { ok: false, notFound: true, error: "claude 不在 PATH 中" }), NO_ENV);
    assert.equal(result.state, "missing");
    assert.match(result.detail ?? "", /npm install -g @anthropic-ai\/claude-code/);
    assert.equal(blocksCalls(result), true);
  });

  test("claude auth status 的 loggedIn 决定登录态", () => {
    const signedOut = classifyReadiness("claude", output('{"loggedIn": false, "authMethod": "none"}'), NO_ENV);
    assert.equal(signedOut.state, "signed-out");
    assert.match(signedOut.detail ?? "", /pnpm onboard claude/);
    assert.equal(classifyReadiness("claude", output('{"loggedIn": true}'), NO_ENV).state, "ready");
  });

  test("未登录但设置了 API 密钥环境变量时放行", () => {
    const result = classifyReadiness("claude", output('{"loggedIn": false}'), { ANTHROPIC_API_KEY: "sk-test" });
    assert.equal(result.state, "ready");
    assert.match(result.detail ?? "", /ANTHROPIC_API_KEY/);
  });

  test("agy models 提示 sign in 即未登录；列出模型即已登录", () => {
    const signedOut = output("Error: Please sign in to view available models. Launch the CLI without arguments to sign in.");
    assert.equal(classifyReadiness("agy", signedOut, NO_ENV).state, "signed-out");
    assert.equal(classifyReadiness("agy", output("gemini-3.8-flash-high\tGemini 3.8 Flash (High)"), NO_ENV).state, "ready");
  });

  test("codex login status 区分已登录与未登录", () => {
    assert.equal(classifyReadiness("codex", output("Logged in using ChatGPT"), NO_ENV).state, "ready");
    assert.equal(classifyReadiness("codex", output("Not logged in", { error: "exit 1" }), NO_ENV).state, "signed-out");
  });

  test("容器部署时提示宿主机上的命令：登录与安装都经 docker exec", () => {
    const container = { PELICAN_COMMAND_PREFIX: "docker exec -it llm-iq-dashboard" };
    const signedOut = classifyReadiness("agy", output("Please sign in to view available models."), container);
    assert.equal(signedOut.detail, "agy 未登录。登录：docker exec -it llm-iq-dashboard pnpm onboard agy");
    const missing = classifyReadiness("codex", output("", { ok: false, notFound: true }), container);
    assert.equal(missing.detail, "codex 未安装。安装：docker exec -it llm-iq-dashboard sh docker/install-clis.sh");
  });

  test("本机留有可续期凭据时，状态命令报未登录按网络波动放行，不拦调用", () => {
    const signedOut = output("Error: Please sign in to view available models.");
    const result = classifyReadiness("agy", signedOut, NO_ENV, true);
    assert.equal(result.state, "unverified");
    assert.equal(blocksCalls(result), false);
    assert.match(result.detail ?? "", /仍有可续期的登录凭据/);
    // 没有凭据时仍是明确的未登录
    assert.equal(classifyReadiness("agy", signedOut, NO_ENV, false).state, "signed-out");
  });

  test("检查本身失败（超时、输出无法识别）时放行", () => {
    const result = classifyReadiness("agy", output("", { ok: false, error: "agy 探测超时" }), NO_ENV);
    assert.equal(result.state, "unverified");
    assert.equal(blocksCalls(result), false);
    assert.equal(classifyReadiness("claude", output("not json"), NO_ENV).state, "unverified");
  });
});

describe("agyHasRefreshToken", () => {
  test("凭据文件带非空 refresh_token 才算有本机凭据；缺文件、坏文件、空值都不算", async () => {
    const dir = await mkdtemp(join(tmpdir(), "llm-iq-agy-token-"));
    const withToken = join(dir, "with-token");
    await writeFile(withToken, JSON.stringify({ token: { refresh_token: "r", expiry: "2026-09-27T18:52:24Z" } }));
    assert.equal(await agyHasRefreshToken(withToken), true);

    const emptyToken = join(dir, "empty-token");
    await writeFile(emptyToken, JSON.stringify({ token: { refresh_token: "" } }));
    assert.equal(await agyHasRefreshToken(emptyToken), false);

    const broken = join(dir, "broken");
    await writeFile(broken, "{not json");
    assert.equal(await agyHasRefreshToken(broken), false);
    assert.equal(await agyHasRefreshToken(join(dir, "missing")), false);
  });
});

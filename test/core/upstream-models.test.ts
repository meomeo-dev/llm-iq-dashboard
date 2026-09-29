/**
 * 上游模型清单：URL 拼接、响应解析，以及 key 只进请求头、不进 URL 与错误信息。
 * 用本地替身替换全局 fetch，不访问网络。
 */

import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, afterEach, before, test } from "node:test";
import { loadConfig } from "@/core/config";
import { writeProfileKey } from "@/core/profile-credentials";
import { fetchUpstreamModels, modelsUrl, parseModelIds } from "@/core/upstream-models";

const KEY = "sk-test-upstream-0123456789abcdef";
const CONFIG_YAML = `run:
  promptIds: [classic-v1]
profiles:
  - name: relay
    cli: codex
    upstreamType: compatible
    baseUrl: https://api.example.com/v1/
    queryParams: { api-version: "2025-04-01" }
    models: [placeholder]
targets:
  - cli: codex
    model: m
    effort: low
`;

const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;
let workdir: string;
let configFile: string;

before(async () => {
  workdir = await mkdtemp(join(tmpdir(), "llm-iq-upstream-models-"));
  process.env.PELICAN_DATA_DIR = join(workdir, "data");
  process.env.PELICAN_SECRETS_DIR = join(workdir, "secrets");
  configFile = join(workdir, "pelican.config.yaml");
  await writeFile(configFile, CONFIG_YAML, "utf8");
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

after(async () => {
  process.env = { ...originalEnv };
  await rm(workdir, { recursive: true, force: true });
});

test("modelsUrl: 去掉末尾斜杠后接 /models，并带上查询参数", () => {
  assert.equal(modelsUrl("https://a.example/v1/", {}), "https://a.example/v1/models");
  assert.equal(modelsUrl("https://a.example/v1", { "api-version": "x" }), "https://a.example/v1/models?api-version=x");
});

test("parseModelIds: OpenAI 形状、models 数组与字符串数组都认，去重排序", () => {
  assert.deepEqual(parseModelIds({ data: [{ id: "b" }, { id: "a" }, { id: "b" }] }), ["a", "b"]);
  assert.deepEqual(parseModelIds({ models: ["x", " y "] }), ["x", "y"]);
  assert.deepEqual(parseModelIds(["m"]), ["m"]);
  assert.deepEqual(parseModelIds({ nothing: true }), []);
});

test("fetchUpstreamModels: 没填 key 时不发请求", async () => {
  let called = false;
  globalThis.fetch = (async () => {
    called = true;
    return new Response("{}");
  }) as typeof fetch;
  const outcome = await fetchUpstreamModels("codex", "relay", loadConfig(configFile));
  assert.deepEqual(outcome, { ok: false, error: "还没有填 API key" });
  assert.equal(called, false);
});

test("fetchUpstreamModels: key 只在请求头里；失败时错误信息不含 key", async () => {
  await writeProfileKey("codex", "relay", KEY);
  const seen: { url: string; auth: string | null }[] = [];
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    seen.push({ url: String(input), auth: new Headers(init?.headers).get("authorization") });
    return new Response(JSON.stringify({ data: [{ id: "gpt-5.5" }, { id: "gpt-6-mini" }] }));
  }) as typeof fetch;

  const outcome = await fetchUpstreamModels("codex", "relay", loadConfig(configFile));
  assert.deepEqual(outcome, { ok: true, models: ["gpt-5.5", "gpt-6-mini"] });
  assert.equal(seen[0]!.url, "https://api.example.com/v1/models?api-version=2025-04-01");
  assert.equal(seen[0]!.url.includes(KEY), false);
  assert.equal(seen[0]!.auth, `Bearer ${KEY}`);

  globalThis.fetch = (async () => new Response("<html>", { status: 401 })) as typeof fetch;
  const failed = await fetchUpstreamModels("codex", "relay", loadConfig(configFile));
  assert.equal(failed.ok, false);
  assert.equal(JSON.stringify(failed).includes(KEY), false);
});

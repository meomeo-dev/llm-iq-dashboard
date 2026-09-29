/**
 * profile 的 API key：写入凭据目录（0600）、状态表不含 key、只接受已登记的 profile、
 * 请求文件里的 key 在处理后被抹掉。
 */

import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { loadConfig } from "@/core/config";
import { applyProfileCredential, handleProfileCredential } from "@/core/profile-credential-request";
import {
  profileKeyPath,
  readCredentialStatus,
  readProfileKey,
  validateApiKey,
} from "@/core/profile-credentials";
import { claimNextRequest, enqueueRequest, readRequest } from "@/core/requests";

const KEY = "sk-test-0123456789abcdefghijklmnop";
const CONFIG_YAML = `run:
  promptIds: [classic-v1]
profiles:
  - name: kedaya-group-a
    cli: codex
    upstreamType: compatible
    baseUrl: https://api.example.com/v1
    models: [gpt-5.5]
targets:
  - cli: codex
    model: gpt-5.5
    effort: low
`;

const originalEnv = { ...process.env };
let workdir: string;
let configFile: string;

before(async () => {
  workdir = await mkdtemp(join(tmpdir(), "llm-iq-profile-key-"));
  process.env.PELICAN_DATA_DIR = join(workdir, "data");
  process.env.PELICAN_SECRETS_DIR = join(workdir, "secrets");
  configFile = join(workdir, "pelican.config.yaml");
  await writeFile(configFile, CONFIG_YAML, "utf8");
});

after(async () => {
  process.env = { ...originalEnv };
  await rm(workdir, { recursive: true, force: true });
});

test("validateApiKey: 去首尾空白，拒绝空、含空白与超长", () => {
  assert.deepEqual(validateApiKey(`  ${KEY}\n`), { ok: true, key: KEY });
  assert.equal(validateApiKey("").ok, false);
  assert.equal(validateApiKey("a b").ok, false);
  assert.equal(validateApiKey("x".repeat(5000)).ok, false);
  assert.equal(validateApiKey(42).ok, false);
});

test("applyProfileCredential: 写入 0600 文件，状态表只有时刻；删除后两者都没了", async () => {
  const config = loadConfig(configFile);
  const set = await applyProfileCredential({ op: "set", cli: "codex", name: "kedaya-group-a", apiKey: KEY }, config);
  assert.deepEqual(set, { ok: true });

  const path = profileKeyPath("codex", "kedaya-group-a");
  assert.equal((await stat(path)).mode & 0o777, 0o600);
  assert.equal(await readProfileKey("codex", "kedaya-group-a"), KEY);

  const status = await readCredentialStatus();
  assert.ok(status["codex:kedaya-group-a"]?.updatedAt);
  const statusText = await readFile(join(process.env.PELICAN_DATA_DIR!, "profile-credentials.json"), "utf8");
  assert.equal(statusText.includes(KEY), false, "状态表不含 key");

  await applyProfileCredential({ op: "delete", cli: "codex", name: "kedaya-group-a", apiKey: null }, config);
  assert.equal(await readProfileKey("codex", "kedaya-group-a"), null);
  assert.equal((await readCredentialStatus())["codex:kedaya-group-a"], undefined);
});

test("applyProfileCredential: 未登记的 profile 名一律拒绝，不写任何文件", async () => {
  const config = loadConfig(configFile);
  const outcome = await applyProfileCredential(
    { op: "set", cli: "codex", name: "../../escape", apiKey: KEY },
    config,
  );
  assert.equal(outcome.ok, false);
  assert.equal(await readProfileKey("codex", "../../escape"), null);
});

test("handleProfileCredential: 执行器处理后请求文件里的 key 被抹掉", async () => {
  const config = loadConfig(configFile);
  const queued = await enqueueRequest("profile-credential", {
    profileCredential: { op: "set", cli: "codex", name: "kedaya-group-a", apiKey: KEY },
  });
  const claimed = await claimNextRequest();
  assert.equal(claimed?.id, queued.id);
  await handleProfileCredential(claimed!, config);

  const settled = await readRequest(queued.id);
  assert.equal(settled?.state, "done");
  assert.equal(settled?.profileCredential?.apiKey, null);
  const raw = await readFile(join(process.env.PELICAN_DATA_DIR!, "requests", `${queued.id}.json`), "utf8");
  assert.equal(raw.includes(KEY), false, "请求文件不留 key");
  assert.equal(await readProfileKey("codex", "kedaya-group-a"), KEY);
});

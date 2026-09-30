/**
 * 同步阶段的泄漏指纹覆盖配置里全部 profile 的 key：作品里混入 key 时该作品被拦下；
 * 不传 profiles 时 profile 调用整体扣下、指纹只含登录凭据（与引入 profile 之前相同）。
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import type { ProfileConfig } from "@/core/config/profiles";
import { syncDataRepo } from "@/core/sync/sync-orchestrator";

const RUN_ID = "20260930T020000Z";
// 不是 sk- 等固定前缀样式：只能靠指纹比对拦下，而不是 secret-pattern 规则
const KEY = "relay-key-0123456789abcdefghijklmnopqrstuvwxyz";
const RELAY_A: ProfileConfig = {
  name: "relay-a", label: "甲", cli: "codex", upstreamType: "chatgpt-pro-5x", group: null, website: null,
  baseUrl: "https://api.a.example/v1", queryParams: {}, models: ["gpt-5.5"],
  pricing: { multiplier: 0.07, overrides: {} }, enabled: true,
};

let tempBase: string;
let repoDir: string;
let dataDir: string;
const savedEnv = { HOME: process.env.HOME, PELICAN_SECRETS_DIR: process.env.PELICAN_SECRETS_DIR };

beforeEach(async () => {
  tempBase = await mkdtemp(join(tmpdir(), "llm-iq-profile-guard-"));
  repoDir = join(tempBase, "repo");
  dataDir = join(tempBase, "data");
  process.env.HOME = tempBase;
  process.env.PELICAN_SECRETS_DIR = join(tempBase, "secrets");
  await mkdir(join(tempBase, "secrets", "profiles", "codex"), { recursive: true });
  await writeFile(join(tempBase, "secrets", "profiles", "codex", "relay-a.key"), KEY);

  execFileSync("git", ["init", "--initial-branch=main", repoDir]);
  execFileSync("git", ["-C", repoDir, "config", "user.name", "Tester"]);
  execFileSync("git", ["-C", repoDir, "config", "user.email", "tester@example.com"]);
  await writeFile(join(repoDir, "README.md"), "# Data Repo\n");
  execFileSync("git", ["-C", repoDir, "add", "."]);
  execFileSync("git", ["-C", repoDir, "commit", "-m", "chore: init repo"]);

  const runDir = join(dataDir, "runs", RUN_ID);
  await mkdir(runDir, { recursive: true });
  const svgFile = "codex__gpt-5.5__low__relay-a__classic-v1.svg";
  await writeFile(join(runDir, svgFile), `<svg viewBox="0 0 10 10"><text>${KEY}</text></svg>`);
  await writeFile(join(runDir, "run.json"), JSON.stringify({
    runId: RUN_ID,
    prompts: [{ promptId: "classic-v1", text: "draw", bindings: {} }],
    startedAt: "2026-09-30T02:00:00.000Z", finishedAt: "2026-09-30T02:00:03.000Z", durationMs: 3000,
    trigger: "manual", inProgress: false,
    attempts: [{
      targetId: "codex__gpt-5.5__low__relay-a", promptId: "classic-v1", cli: "codex", profile: "relay-a",
      model: "gpt-5.5", effort: "low", appliedEffort: "low", effortHonored: true, label: "GPT-5.5 · 甲",
      status: "ok", svgFile, rawFile: null, startedAt: "2026-09-30T02:00:01.000Z",
      finishedAt: "2026-09-30T02:00:02.000Z", durationMs: 1000, svgBytes: 60, error: null, usage: null,
    }],
  }));
});

afterEach(async () => {
  for (const [name, value] of Object.entries(savedEnv)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
  await rm(tempBase, { recursive: true, force: true });
});

test("传入 profiles：作品里的 profile key 被指纹拦下，记录本身照常导出", async () => {
  const report = await syncDataRepo({ repoPath: repoDir, dataDir, dryRun: true, profiles: [RELAY_A] });
  assert.deepEqual(report.exported, [RUN_ID]);
  assert.equal(report.redactions.length, 1);
  assert.deepEqual(report.redactions[0]?.redactions.map((r) => r.reason), ["leak-guard"]);
});

test("不传 profiles：profile 调用整体扣下，轮次按空轮次跳过", async () => {
  const report = await syncDataRepo({ repoPath: repoDir, dataDir, dryRun: true });
  assert.deepEqual(report.exported, []);
  assert.deepEqual(report.skipped.map((s) => s.reason), ["empty"]);
});

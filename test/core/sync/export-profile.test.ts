/**
 * profile 调用的导出：导出时配置里登记的随记录发布并附公开视图，未登记的扣下并计数；
 * 记录里的 profile 视图只有八个公开字段，只有登录态的记录不带 profiles 字段。
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { PROFILE_VIEW_FIELDS, type ProfileView } from "@/core/profile-view";
import { exportRun } from "@/core/sync/export-run";

const RELAY_A: ProfileView = {
  name: "relay-a", label: "甲", cli: "codex", upstreamType: "chatgpt-pro-5x",
  group: null, website: "https://a.example", multiplier: 0.07, enabled: true,
};
const RELAY_B: ProfileView = { ...RELAY_A, name: "relay-b", label: "乙", multiplier: 0.16 };

const RUN_ID = "20260929T130000Z";

function attempt(profile?: string) {
  const suffix = profile === undefined ? "" : `__${profile}`;
  return {
    targetId: `codex__gpt-5.5__low${suffix}`,
    promptId: "classic-v1",
    cli: "codex",
    ...(profile === undefined ? {} : { profile }),
    model: "gpt-5.5",
    effort: "low",
    appliedEffort: "low",
    effortHonored: true,
    label: "GPT-5.5",
    status: "error",
    svgFile: null,
    rawFile: null,
    startedAt: "2026-09-29T13:00:01.000Z",
    finishedAt: "2026-09-29T13:00:02.000Z",
    durationMs: 1000,
    svgBytes: null,
    error: "boom",
    usage: null,
  };
}

let runsDir: string;

beforeEach(async () => {
  runsDir = await mkdtemp(join(tmpdir(), "llm-iq-export-profile-"));
});

afterEach(async () => {
  await rm(runsDir, { recursive: true, force: true });
});

async function writeRun(attempts: object[]): Promise<void> {
  await mkdir(join(runsDir, RUN_ID), { recursive: true });
  await writeFile(
    join(runsDir, RUN_ID, "run.json"),
    JSON.stringify({
      runId: RUN_ID,
      prompts: [{ promptId: "classic-v1", text: "draw", bindings: {} }],
      startedAt: "2026-09-29T13:00:00.000Z",
      finishedAt: "2026-09-29T13:00:03.000Z",
      durationMs: 3000,
      trigger: "manual",
      inProgress: false,
      attempts,
    }),
  );
}

test("没有登记任何 profile 时只导出登录态调用，profile 调用计入 withheldProfileAttempts", async () => {
  await writeRun([attempt(), attempt("relay-a"), attempt("relay-b")]);
  const result = await exportRun(RUN_ID, { runsDir });
  assert.equal(result.status, "ready");
  if (result.status !== "ready") return;
  assert.deepEqual(result.publicRecord.attempts.map((item) => item.targetId), ["codex__gpt-5.5__low"]);
  assert.equal(result.withheldProfileAttempts, 2);
  assert.equal(result.jsonText.includes("relay-a"), false);
  assert.equal("profiles" in result.publicRecord, false);
});

test("登记的 profile 调用随记录发布并附公开视图，未登记的扣下；视图按配置顺序只含用到的", async () => {
  await writeRun([attempt("relay-b"), attempt(), attempt("relay-a"), attempt("relay-c")]);
  const result = await exportRun(RUN_ID, { runsDir, profiles: [RELAY_A, RELAY_B] });
  assert.equal(result.status, "ready");
  if (result.status !== "ready") return;
  assert.deepEqual(
    result.publicRecord.attempts.map((item) => item.profile ?? "default"),
    ["relay-b", "default", "relay-a"],
  );
  assert.equal(result.withheldProfileAttempts, 1);
  assert.deepEqual(result.publicRecord.profiles, [RELAY_A, RELAY_B]);
  for (const view of result.publicRecord.profiles ?? []) {
    assert.deepEqual(Object.keys(view).sort(), [...PROFILE_VIEW_FIELDS].sort());
  }
  const parsed = JSON.parse(result.jsonText) as { profiles: ProfileView[] };
  assert.equal(parsed.profiles.length, 2);
  assert.equal(result.jsonText.includes("relay-c"), false);
});

test("全是未登记 profile 调用的轮次按空轮次跳过", async () => {
  await writeRun([attempt("relay-a")]);
  const result = await exportRun(RUN_ID, { runsDir });
  assert.equal(result.status, "skipped");
  if (result.status === "skipped") assert.equal(result.reason, "empty");
});

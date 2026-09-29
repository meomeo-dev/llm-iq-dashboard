/**
 * 非默认 profile 的调用不进公开数据仓：契约落地前一律留在本机，并在导出结果里计数。
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { exportRun } from "@/core/sync/export-run";

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

test("混合轮次只导出登录态调用，profile 调用计入 withheldProfileAttempts", async () => {
  await writeRun([attempt(), attempt("relay-a"), attempt("relay-b")]);
  const result = await exportRun(RUN_ID, { runsDir });
  assert.equal(result.status, "ready");
  if (result.status !== "ready") return;
  assert.deepEqual(result.publicRecord.attempts.map((item) => item.targetId), ["codex__gpt-5.5__low"]);
  assert.equal(result.withheldProfileAttempts, 2);
  assert.equal(result.jsonText.includes("relay-a"), false);
});

test("全是 profile 调用的轮次按空轮次跳过", async () => {
  await writeRun([attempt("relay-a")]);
  const result = await exportRun(RUN_ID, { runsDir });
  assert.equal(result.status, "skipped");
  if (result.status === "skipped") assert.equal(result.reason, "empty");
});

/**
 * 题目白名单：publishPrompts 之外的题目连同其调用一并剔除；没剩下题目时整轮跳过；null 为全部。
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { exportRun, withoutUnpublishablePrompts } from "@/core/sync/export-run";
import type { RunRecord } from "@/core/types";

const RUN_ID = "20260930T010000Z";

function attempt(promptId: string) {
  return {
    targetId: "codex__gpt-5.5__low", promptId, cli: "codex", model: "gpt-5.5", effort: "low",
    appliedEffort: "low", effortHonored: true, label: "GPT-5.5", status: "error", svgFile: null,
    rawFile: null, startedAt: "2026-09-30T01:00:01.000Z", finishedAt: "2026-09-30T01:00:02.000Z",
    durationMs: 1000, svgBytes: null, error: "boom", usage: null,
  };
}

function run(promptIds: string[]): RunRecord {
  return {
    runId: RUN_ID,
    prompts: promptIds.map((promptId) => ({ promptId, text: "draw", bindings: {} })),
    startedAt: "2026-09-30T01:00:00.000Z",
    finishedAt: "2026-09-30T01:00:03.000Z",
    durationMs: 3000,
    trigger: "manual",
    inProgress: false,
    attempts: promptIds.map(attempt),
  } as unknown as RunRecord;
}

let runsDir: string;

beforeEach(async () => {
  runsDir = await mkdtemp(join(tmpdir(), "llm-iq-export-prompts-"));
  await mkdir(join(runsDir, RUN_ID), { recursive: true });
  await writeFile(join(runsDir, RUN_ID, "run.json"), JSON.stringify(run(["classic-v1", "animated-pelican-v1", "leijun-v1"])));
});

afterEach(async () => {
  await rm(runsDir, { recursive: true, force: true });
});

test("withoutUnpublishablePrompts：白名单与永不发布清单叠加；null 只剔永不发布的；剩空返回 null", () => {
  const source = run(["classic-v1", "animated-pelican-v1", "leijun-v1"]);
  const all = withoutUnpublishablePrompts(source, null);
  assert.deepEqual(all?.prompts.map((p) => p.promptId), ["classic-v1", "animated-pelican-v1"]);
  const only = withoutUnpublishablePrompts(source, ["animated-pelican-v1", "leijun-v1"]);
  assert.deepEqual(only?.prompts.map((p) => p.promptId), ["animated-pelican-v1"]);
  assert.deepEqual(only?.attempts.map((a) => a.promptId), ["animated-pelican-v1"]);
  assert.equal(withoutUnpublishablePrompts(source, ["xiyou-v1"]), null);
  assert.equal(withoutUnpublishablePrompts(source, []), null);
});

test("exportRun：按白名单导出，只剩题面与调用都在清单里的", async () => {
  const result = await exportRun(RUN_ID, { runsDir, publishPrompts: ["animated-pelican-v1"] });
  assert.equal(result.status, "ready");
  if (result.status !== "ready") return;
  assert.deepEqual(result.publicRecord.prompts.map((p) => p.promptId), ["animated-pelican-v1"]);
  assert.deepEqual(result.publicRecord.attempts.map((a) => a.promptId), ["animated-pelican-v1"]);
});

test("exportRun：白名单里没有本轮任何题目时按 unpublishable-prompt 跳过", async () => {
  const result = await exportRun(RUN_ID, { runsDir, publishPrompts: ["xiyou-v1"] });
  assert.equal(result.status, "skipped");
  if (result.status === "skipped") assert.equal(result.reason, "unpublishable-prompt");
});

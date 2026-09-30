/**
 * 按调用挑子集导出与丢弃：
 * - 子集导出只发布勾选的调用与其题目，台账记下子集；之后不带清单的整批同步沿用子集，判为幂等而不是冲突；
 * - 丢弃的轮次任何同步都不导出，状态里列为已丢弃；恢复后回到待导出并能导出；
 * - 已导出的轮次不能丢弃。
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { discardRuns, restoreRuns } from "@/core/sync/ledger-decisions";
import { loadSyncLedger } from "@/core/sync/sync-ledger";
import { syncDataRepo } from "@/core/sync/sync-orchestrator";

const RUN_A = "20260930T030000Z";
const RUN_B = "20260930T040000Z";

let tempBase: string;
let repoDir: string;
let dataDir: string;

function attempt(targetId: string, promptId: string) {
  return {
    targetId, promptId, cli: "claude", model: "claude-opus-5-5", effort: "low", appliedEffort: "low",
    effortHonored: true, label: targetId, status: "ok", svgFile: `${targetId}__${promptId}.svg`, rawFile: null,
    startedAt: "2026-09-30T03:00:01.000Z", finishedAt: "2026-09-30T03:00:02.000Z", durationMs: 1000,
    svgBytes: 40, error: null, usage: null,
  };
}

async function writeRun(runId: string, attempts: ReturnType<typeof attempt>[]): Promise<void> {
  const dir = join(dataDir, "runs", runId);
  await mkdir(dir, { recursive: true });
  for (const item of attempts) await writeFile(join(dir, item.svgFile), `<svg viewBox="0 0 1 1"><rect/></svg>`);
  const promptIds = [...new Set(attempts.map((item) => item.promptId))];
  await writeFile(join(dir, "run.json"), JSON.stringify({
    runId, prompts: promptIds.map((promptId) => ({ promptId, text: "draw", bindings: {} })),
    startedAt: "2026-09-30T03:00:00.000Z", finishedAt: "2026-09-30T03:00:03.000Z", durationMs: 3000,
    trigger: "manual", inProgress: false, attempts,
  }));
}

async function publicRun(runId: string): Promise<{ attempts: Array<{ targetId: string }>; prompts: Array<{ promptId: string }> }> {
  const day = `${runId.slice(0, 4)}/${runId.slice(4, 6)}/${runId.slice(6, 8)}`;
  return JSON.parse(await readFile(join(repoDir, "runs", day, runId, "run.json"), "utf8"));
}

beforeEach(async () => {
  tempBase = await mkdtemp(join(tmpdir(), "llm-iq-selection-"));
  repoDir = join(tempBase, "repo");
  dataDir = join(tempBase, "data");
  execFileSync("git", ["init", "--initial-branch=main", repoDir]);
  execFileSync("git", ["-C", repoDir, "config", "user.name", "Tester"]);
  execFileSync("git", ["-C", repoDir, "config", "user.email", "tester@example.com"]);
  await writeFile(join(repoDir, "README.md"), "# Data Repo\n");
  execFileSync("git", ["-C", repoDir, "add", "."]);
  execFileSync("git", ["-C", repoDir, "commit", "-m", "chore: init repo"]);
  await writeRun(RUN_A, [attempt("claude__opus__low", "classic-v1"), attempt("claude__opus__high", "xiyou-v1")]);
  await writeRun(RUN_B, [attempt("claude__opus__low", "classic-v1")]);
});

afterEach(async () => {
  await rm(tempBase, { recursive: true, force: true });
});

test("子集导出只发布勾选的调用，之后整批同步沿用子集且不报冲突", async () => {
  const first = await syncDataRepo({
    repoPath: repoDir, dataDir, runIds: [RUN_A],
    attemptSelection: { [RUN_A]: ["claude__opus__high@xiyou-v1"] },
  });
  assert.deepEqual(first.exported, [RUN_A]);
  const record = await publicRun(RUN_A);
  assert.deepEqual(record.attempts.map((item) => item.targetId), ["claude__opus__high"]);
  assert.deepEqual(record.prompts.map((item) => item.promptId), ["xiyou-v1"]);
  const ledger = await loadSyncLedger(dataDir);
  assert.deepEqual(ledger[RUN_A]?.status !== "skipped" && ledger[RUN_A]?.attempts, ["claude__opus__high@xiyou-v1"]);

  const again = await syncDataRepo({ repoPath: repoDir, dataDir });
  assert.deepEqual(again.conflicts, []);
  assert.ok(again.skipped.some((item) => item.runId === RUN_A && item.reason === "idempotent"));
  assert.deepEqual(again.exported, [RUN_B]);
});

test("丢弃的轮次整批同步也不导出，恢复后可以导出；已导出的不能丢弃", async () => {
  const discarded = await discardRuns([RUN_B], dataDir);
  assert.deepEqual(discarded.changed, [RUN_B]);
  const sync = await syncDataRepo({ repoPath: repoDir, dataDir });
  assert.deepEqual(sync.exported, [RUN_A]);
  const named = await syncDataRepo({ repoPath: repoDir, dataDir, runIds: [RUN_B], dryRun: true });
  assert.deepEqual(named.exported, []);

  const refused = await discardRuns([RUN_A], dataDir);
  assert.deepEqual(refused.changed, []);
  assert.match(refused.unchanged[0]?.reason ?? "", /已导出/);

  const restored = await restoreRuns([RUN_B, RUN_A], dataDir);
  assert.deepEqual(restored.changed, [RUN_B]);
  assert.deepEqual(restored.unchanged.map((item) => item.runId), [RUN_A]);
  const after = await syncDataRepo({ repoPath: repoDir, dataDir });
  assert.deepEqual(after.exported, [RUN_B]);
});

test("子集一个都对不上时跳过且不记台账，这一轮留在待导出", async () => {
  const report = await syncDataRepo({
    repoPath: repoDir, dataDir, runIds: [RUN_B], attemptSelection: { [RUN_B]: ["gone@classic-v1"] },
  });
  assert.deepEqual(report.exported, []);
  assert.deepEqual(report.skipped, [{ runId: RUN_B, reason: "no-selected-attempts" }]);
  assert.equal((await loadSyncLedger(dataDir))[RUN_B], undefined);
});

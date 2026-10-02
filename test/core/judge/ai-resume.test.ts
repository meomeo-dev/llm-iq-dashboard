/**
 * 续评中断的评审队列：执行进程退出后 judging 段停在半途，下一个进程接手收尾。
 * 不调用裁判 CLI：AI 层关闭时标未评，磁盘上已有结论的直接标结论，进程还在的轮次不碰。
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import type { AppConfig } from "@/core/config";
import { resumeInterruptedJudging } from "@/core/judge/ai-round";
import type { RunProgress } from "@/core/progress";

let dataDir: string;
let previousDataDir: string | undefined;

before(async () => {
  dataDir = await mkdtemp(join(tmpdir(), "llm-iq-resume-"));
  previousDataDir = process.env.PELICAN_DATA_DIR;
  process.env.PELICAN_DATA_DIR = dataDir;
});

after(async () => {
  if (previousDataDir === undefined) delete process.env.PELICAN_DATA_DIR;
  else process.env.PELICAN_DATA_DIR = previousDataDir;
  await rm(dataDir, { recursive: true, force: true });
});

/** 只有评审开关有意义的最小配置 */
function config(aiEnabled: boolean): AppConfig {
  return {
    schedule: { cron: null, intervalMinutes: null, timezone: null, runOnStart: false },
    run: {
      promptIds: ["animated-pelican-v1"], concurrency: 1, profileConcurrency: 5, defaultTimeoutMs: 10000,
      timeoutByCli: {}, timeoutByEffort: {}, rotation: { period: "day", timeZone: "UTC" },
    },
    retention: { days: null },
    judge: { enabled: true, ai: { enabled: aiEnabled, judges: [], timeoutMs: 300000, concurrency: 5 } },
    budget: { perRoundUsd: null, perDayUsd: null },
    upstreamTypes: [], profiles: [], targets: [], customPrompts: [], customModels: {}, dataRepo: null,
  };
}

const item = (attemptKey: string, state: "queued" | "running" | "done") => ({
  attemptKey, targetId: "codex__m__high", promptId: "animated-pelican-v1", state,
  startedAt: state === "queued" ? null : "2026-10-02T13:35:00Z", durationMs: null, verdict: null, score: null, note: null,
});

async function writeRun(runId: string, pid: number, items: ReturnType<typeof item>[], judged: Record<string, string>): Promise<void> {
  const dir = join(dataDir, "runs", runId);
  await mkdir(dir, { recursive: true });
  const progress = {
    runId, trigger: "manual", startedAt: "2026-10-02T13:17:00Z", updatedAt: "2026-10-02T13:35:00Z", finishedAt: "2026-10-02T13:25:00Z",
    cancelledAt: null, budgetStop: null, pid, pidStart: null, laneLimit: 1, lanes: [],
    judging: { startedAt: "2026-10-02T13:25:00Z", finishedAt: null, items },
  };
  await writeFile(join(dir, "progress.json"), JSON.stringify(progress), "utf8");
  await writeFile(join(dir, "run.json"), JSON.stringify({ runId, inProgress: false, prompts: [], attempts: [] }), "utf8");
  for (const [attemptKey, verdict] of Object.entries(judged)) {
    const judgement = {
      schemaVersion: 1, subject: { runId, attemptKey }, rubric: { id: "animated-pelican-v1", version: 1, passThreshold: 78 },
      judges: [], gates: [], criteria: [], total: { score: verdict === "online" ? 90 : 0, maxScore: 100, verdict, judgedAt: "2026-10-02T13:30:00Z" },
    };
    await writeFile(join(dir, `${attemptKey}.judge.json`), JSON.stringify(judgement), "utf8");
  }
}

async function readProgressFile(runId: string): Promise<RunProgress> {
  return JSON.parse(await readFile(join(dataDir, "runs", runId, "progress.json"), "utf8")) as RunProgress;
}

/** 肯定不存在的 pid：上个进程已退出 */
const DEAD_PID = 2 ** 22 - 1;

test("进程已不在：已落盘结论的标结论，AI 层关闭的标未评，队列收尾且 pid 换成本进程", async () => {
  const runId = "20261002T131734Z";
  await writeRun(runId, DEAD_PID, [item("a", "done"), item("b", "running"), item("c", "queued")], { b: "online", c: "pending" });
  const logs: string[] = [];
  await resumeInterruptedJudging(config(false), runId, (line) => logs.push(line));
  const progress = await readProgressFile(runId);
  assert.equal(progress.pid, process.pid);
  assert.ok(progress.judging?.finishedAt);
  assert.deepEqual(progress.judging?.items.map((entry) => [entry.attemptKey, entry.state, entry.verdict, entry.note]), [
    ["a", "done", null, null], ["b", "done", "online", null], ["c", "failed", null, "续评时 AI 层已关闭"],
  ]);
  assert.ok(logs.some((line) => line.includes("续评 1/2 幅")));
});

test("评审记录不存在的作品标未评", async () => {
  const runId = "20261002T140000Z";
  await writeRun(runId, DEAD_PID, [item("x", "queued")], {});
  await resumeInterruptedJudging(config(true), runId, () => {});
  const progress = await readProgressFile(runId);
  assert.deepEqual(progress.judging?.items.map((entry) => [entry.state, entry.note]), [["failed", "评审记录不存在"]]);
  assert.ok(progress.judging?.finishedAt);
});

test("评审进程还在的轮次不碰", async () => {
  const runId = "20261002T150000Z";
  await writeRun(runId, process.pid, [item("y", "running")], {});
  await resumeInterruptedJudging(config(false), runId, () => {});
  const progress = await readProgressFile(runId);
  assert.equal(progress.judging?.finishedAt, null);
  assert.equal(progress.judging?.items[0]?.state, "running");
});

test("已收尾或没有评审段的轮次直接返回", async () => {
  const runId = "20261002T160000Z";
  await writeRun(runId, DEAD_PID, [], {});
  const before = await readProgressFile(runId);
  before.judging!.finishedAt = "2026-10-02T16:10:00Z";
  await writeFile(join(dataDir, "runs", runId, "progress.json"), JSON.stringify(before), "utf8");
  await resumeInterruptedJudging(config(true), runId, () => {});
  assert.equal((await readProgressFile(runId)).pid, DEAD_PID, "没接手就不改 pid");
});

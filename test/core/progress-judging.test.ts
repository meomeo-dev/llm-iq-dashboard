/** 进度文件的 AI 层评审段：登记队列、逐件标记、收尾，全部经串行写入落盘 */

import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { createProgressTracker, isJudging, type RunProgress } from "@/core/progress";
import { createSerialWriter } from "@/core/serial-writes";

let dataDir: string;
const RUN_ID = "20260930T120000Z";

before(async () => {
  dataDir = await mkdtemp(join(tmpdir(), "llm-iq-progress-"));
  process.env.PELICAN_DATA_DIR = dataDir;
});

after(async () => {
  delete process.env.PELICAN_DATA_DIR;
  await rm(dataDir, { recursive: true, force: true });
});

async function readProgress(): Promise<RunProgress> {
  return JSON.parse(await readFile(join(dataDir, "runs", RUN_ID, "progress.json"), "utf8")) as RunProgress;
}

test("评审队列从排队到收尾逐步落盘，isJudging 只在收尾前为真", async () => {
  const { mkdir } = await import("node:fs/promises");
  await mkdir(join(dataDir, "runs", RUN_ID), { recursive: true });
  const writer = createSerialWriter(() => {});
  const tracker = createProgressTracker({ runId: RUN_ID, trigger: "manual", startedAt: "2026-09-30T12:00:00Z", laneLimit: 1, lanes: [] }, writer);
  await tracker.finish();
  assert.equal(isJudging(await readProgress()), false, "没开 AI 层的轮次没有评审段");

  tracker.judging.start([{ attemptKey: "a", targetId: "codex__m__high", promptId: "animated-pelican-v1" }, { attemptKey: "b", targetId: "codex__m__low", promptId: "animated-pelican-v1" }]);
  tracker.judging.markRunning("a");
  await writer.drain();
  let progress = await readProgress();
  assert.equal(isJudging(progress), true);
  assert.deepEqual(progress.judging?.items.map((item) => item.state), ["running", "queued"]);

  tracker.judging.markDone("a", { verdict: "online", score: 88 });
  tracker.judging.markRunning("b");
  tracker.judging.markFailed("b", "裁判未登录");
  await tracker.judging.finish();
  progress = await readProgress();
  assert.equal(isJudging(progress), false);
  assert.deepEqual(progress.judging?.items.map((item) => [item.state, item.verdict, item.score, item.note]), [
    ["done", "online", 88, null], ["failed", null, null, "裁判未登录"],
  ]);
  assert.ok(progress.judging?.items.every((item) => typeof item.durationMs === "number"));
  assert.throws(() => tracker.judging.markRunning("zzz"), /评审队列里没有/);
});

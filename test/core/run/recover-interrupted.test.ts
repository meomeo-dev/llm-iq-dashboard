/**
 * 执行进程启动时收尾中断轮次：
 *   - inProgress 的 run.json 置为已停止，保留已完成的调用，progress.json 同步收尾；
 *   - 只有 progress.json 的目录删除；
 *   - 已完成的轮次与没有 run.json 但有产物的目录不动。
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import type { AppConfig } from "@/core/config";
import { recoverInterruptedRuns } from "@/core/run/recover-interrupted";

const ENV_DATA_DIR = "PELICAN_DATA_DIR";
let dataDir: string;
let previousDataDir: string | undefined;

before(async () => {
  dataDir = await mkdtemp(join(tmpdir(), "llm-iq-recover-"));
  previousDataDir = process.env[ENV_DATA_DIR];
  process.env[ENV_DATA_DIR] = dataDir;
});

after(async () => {
  if (previousDataDir === undefined) delete process.env[ENV_DATA_DIR];
  else process.env[ENV_DATA_DIR] = previousDataDir;
  await rm(dataDir, { recursive: true, force: true });
});

function config(): AppConfig {
  return {
    schedule: { cron: null, intervalMinutes: null, timezone: null, runOnStart: false },
    run: {
      promptIds: ["classic-v1"],
      concurrency: 1,
      defaultTimeoutMs: 10000,
      timeoutByCli: {},
      timeoutByEffort: {},
      rotation: { period: "day", timeZone: "UTC" },
    },
    retention: { days: null },
    budget: { perRoundUsd: null, perDayUsd: null },
    targets: [],
    customPrompts: [],
    customModels: {},
    dataRepo: null,
  };
}

async function writeRunDir(runId: string, files: Record<string, unknown>): Promise<void> {
  const dir = join(dataDir, "runs", runId);
  await mkdir(dir, { recursive: true });
  for (const [name, value] of Object.entries(files)) {
    const text = typeof value === "string" ? value : JSON.stringify(value);
    await writeFile(join(dir, name), text, "utf8");
  }
}

async function readJson(runId: string, name: string): Promise<Record<string, unknown>> {
  return JSON.parse(await readFile(join(dataDir, "runs", runId, name), "utf8")) as Record<string, unknown>;
}

const attempt = { targetId: "claude__m__low", promptId: "classic-v1", status: "ok", svgFile: "a.svg" };

describe("recoverInterruptedRuns", () => {
  it("中断的轮次按已停止收尾，保留已完成的调用，进度里未完成的调用标 cancelled", async () => {
    await writeRunDir("20260926T041323Z", {
      "run.json": {
        runId: "20260926T041323Z",
        startedAt: "2026-09-26T04:13:23.615Z",
        finishedAt: "2026-09-26T04:23:17.256Z",
        inProgress: true,
        attempts: [attempt, attempt],
      },
      "progress.json": {
        runId: "20260926T041323Z",
        finishedAt: null,
        cancelledAt: null,
        lanes: [
          { calls: [{ state: "done" }, { state: "running" }] },
          { calls: [{ state: "queued" }] },
        ],
      },
      "a.svg": "<svg/>",
    });
    await writeRunDir("20260926T035418Z", { "progress.json": { runId: "20260926T035418Z" } });
    await writeRunDir("20260926T050000Z", {
      "run.json": { runId: "20260926T050000Z", inProgress: false, attempts: [attempt] },
    });
    await writeRunDir("20260926T060000Z", { "b.svg": "<svg/>" });

    const logs: string[] = [];
    const report = await recoverInterruptedRuns(config(), (message) => logs.push(message));

    assert.deepEqual(report, { finalized: ["20260926T041323Z"], discarded: ["20260926T035418Z"] });

    const run = await readJson("20260926T041323Z", "run.json");
    assert.equal(run.inProgress, false);
    assert.equal(run.cancelledAt, "2026-09-26T04:23:17.256Z");
    assert.equal((run.attempts as unknown[]).length, 2);
    const progress = await readJson("20260926T041323Z", "progress.json");
    assert.equal(progress.finishedAt, "2026-09-26T04:23:17.256Z");
    assert.equal(progress.cancelledAt, "2026-09-26T04:23:17.256Z");
    const lanes = progress.lanes as Array<{ calls: Array<{ state: string }> }>;
    assert.deepEqual(lanes.flatMap((lane) => lane.calls.map((call) => call.state)), ["done", "cancelled", "cancelled"]);

    const dirs = (await readdir(join(dataDir, "runs"))).sort();
    assert.deepEqual(dirs, ["20260926T041323Z", "20260926T050000Z", "20260926T060000Z"]);
    const completed = await readJson("20260926T050000Z", "run.json");
    assert.equal("cancelledAt" in completed, false);
    assert.ok(logs.some((line) => line.includes("保留 2 次已完成的调用")));
  });

  it("再次启动时已收尾的轮次不再处理", async () => {
    const report = await recoverInterruptedRuns(config(), () => undefined);
    assert.deepEqual(report, { finalized: [], discarded: [] });
  });
});

/** 同轮次原地重跑（In-Place Run Retry）规划、产物清理、请求解析与实时进度合并测试 */

import assert from "node:assert/strict";
import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, test } from "node:test";
import { parseRunRequestBody } from "@/app/api/run/run-request";
import { mergeLiveProgress } from "@/app/components/dashboard/merge-live-progress";
import { parseRunOnceArgs } from "@/bin/run-once";
import { loadConfig, type AppConfig } from "@/core/config";
import type { ProgressView } from "@/core/progress";
import { planRunRetry } from "@/core/run/retry";
import { cleanAttemptArtifacts, ensureRunDir, saveRun } from "@/core/store";
import type { Attempt, DashboardCard, RunRecord } from "@/core/types";

const RUN_ID = "20260419T120000Z";

function makeBaseConfig(): AppConfig {
  const base = loadConfig("config/pelican.example.yaml");
  return {
    ...base,
    targets: [
      {
        id: "claude-opus-low",
        label: "Claude Opus Low",
        cli: "claude",
        model: "claude-opus-4-6",
        effort: "low",
        timeoutMs: 60_000,
        extraArgs: [],
        enabled: true,
      },
      {
        id: "claude-opus-high",
        label: "Claude Opus High",
        cli: "claude",
        model: "claude-opus-4-6",
        effort: "high",
        timeoutMs: 120_000,
        extraArgs: [],
        enabled: true,
      },
      {
        id: "codex-gpt-low",
        label: "Codex GPT Low",
        cli: "codex",
        model: "gpt-5.4",
        effort: "low",
        timeoutMs: 60_000,
        extraArgs: [],
        enabled: true,
      },
    ],
  };
}

function makeAttempt(
  targetId: string,
  cli: "claude" | "codex",
  model: string,
  effort: "low" | "high",
  status: Attempt["status"],
): Attempt {
  return {
    targetId,
    promptId: "classic-v1",
    cli,
    model,
    effort,
    appliedEffort: effort,
    effortHonored: true,
    label: targetId,
    status,
    svgFile: status === "ok" ? `${targetId}__classic-v1.svg` : null,
    rawFile: `${targetId}__classic-v1.txt`,
    startedAt: "2026-04-19T12:00:01.000Z",
    finishedAt: "2026-04-19T12:00:10.000Z",
    durationMs: 9_000,
    svgBytes: status === "ok" ? 1024 : null,
    error: status === "ok" ? null : `failed with ${status}`,
    usage: null,
  };
}

describe("planRunRetry & cleanAttemptArtifacts", () => {
  let tempDataDir = "";
  const prevDataDir = process.env.PELICAN_DATA_DIR;

  beforeEach(async () => {
    tempDataDir = await mkdtemp(join(tmpdir(), "pelican-retry-test-"));
    process.env.PELICAN_DATA_DIR = tempDataDir;
    await writeFile(
      join(tempDataDir, "capabilities.json"),
      JSON.stringify({
        probedAt: new Date().toISOString(),
        clis: {
          claude: { available: true, version: "1.0", models: ["claude-opus-4-6"], efforts: ["low", "high"], effortAdjustable: true },
          codex: { available: true, version: "1.0", models: ["gpt-5.4"], efforts: ["low", "high"], effortAdjustable: true },
          agy: { available: false, version: null, models: [], efforts: [], effortAdjustable: false },
        },
      }),
      "utf8",
    );
  });

  afterEach(async () => {
    if (prevDataDir === undefined) delete process.env.PELICAN_DATA_DIR;
    else process.env.PELICAN_DATA_DIR = prevDataDir;
    if (tempDataDir) await rm(tempDataDir, { recursive: true, force: true });
  });

  test("整轮重跑默认仅选 error/timeout，开启 includeNoSvg 时包含 no-svg，并保持 keptAttempts 与 slots 偏移", async () => {
    const record: RunRecord = {
      runId: RUN_ID,
      prompts: [{ promptId: "classic-v1", text: "LOCKED_PROMPT_TEXT", bindings: { candidate: "cand-1" } }],
      startedAt: "2026-04-19T12:00:00.000Z",
      finishedAt: "2026-04-19T12:01:00.000Z",
      durationMs: 60_000,
      trigger: "manual",
      inProgress: false,
      harnessGuard: "LOCKED_GUARD",
      attempts: [
        makeAttempt("claude-opus-low", "claude", "claude-opus-4-6", "low", "ok"),
        makeAttempt("claude-opus-high", "claude", "claude-opus-4-6", "high", "timeout"),
        makeAttempt("codex-gpt-low", "codex", "gpt-5.4", "low", "no-svg"),
      ],
    };
    await saveRun(record);

    const defaultPlan = await planRunRetry(makeBaseConfig(), {
      retryRunId: RUN_ID,
      targetIds: [],
      promptIds: [],
    });
    assert.equal(defaultPlan.keptAttempts.length, 2);
    assert.equal(defaultPlan.jobs.length, 1);
    assert.equal(defaultPlan.jobs[0]!.target.id, "claude-opus-high");
    assert.equal(defaultPlan.jobs[0]!.prompt.text, "LOCKED_PROMPT_TEXT");
    assert.equal(defaultPlan.lanes[0]![0]!.index, 2);

    const withNoSvgPlan = await planRunRetry(makeBaseConfig(), {
      retryRunId: RUN_ID,
      targetIds: [],
      promptIds: [],
      includeNoSvg: true,
    });
    assert.equal(withNoSvgPlan.keptAttempts.length, 1);
    assert.equal(withNoSvgPlan.jobs.length, 2);
    const slotIndices = withNoSvgPlan.lanes.flatMap((lane) => lane.map((item) => item.index)).sort();
    assert.deepEqual(slotIndices, [1, 2]);
  });

  test("单卡精确重跑仅重跑指定的 targetId + promptId，其余失败项保留在 keptAttempts", async () => {
    const record: RunRecord = {
      runId: RUN_ID,
      prompts: [{ promptId: "classic-v1", text: "LOCKED_PROMPT_TEXT", bindings: {} }],
      startedAt: "2026-04-19T12:00:00.000Z",
      finishedAt: "2026-04-19T12:01:00.000Z",
      durationMs: 60_000,
      trigger: "manual",
      inProgress: false,
      attempts: [
        makeAttempt("claude-opus-low", "claude", "claude-opus-4-6", "low", "ok"),
        makeAttempt("claude-opus-high", "claude", "claude-opus-4-6", "high", "error"),
        makeAttempt("codex-gpt-low", "codex", "gpt-5.4", "low", "no-svg"),
      ],
    };
    await saveRun(record);

    const singlePlan = await planRunRetry(makeBaseConfig(), {
      retryRunId: RUN_ID,
      targetIds: ["codex-gpt-low"],
      promptIds: ["classic-v1"],
      includeNoSvg: true,
    });
    assert.equal(singlePlan.keptAttempts.length, 2);
    assert.equal(singlePlan.jobs.length, 1);
    assert.equal(singlePlan.jobs[0]!.target.id, "codex-gpt-low");
  });

  test("cleanAttemptArtifacts 仅删除待重跑调用的旧产物文件，不影响同轮其他调用与 run.json", async () => {
    const dir = await ensureRunDir(RUN_ID);
    await writeFile(join(dir, "run.json"), "{}", "utf8");
    await writeFile(join(dir, "progress.json"), "{}", "utf8");
    await writeFile(join(dir, "codex-gpt-low__classic-v1.svg"), "<svg/>", "utf8");
    await writeFile(join(dir, "codex-gpt-low__classic-v1.txt"), "log", "utf8");
    await writeFile(join(dir, "codex-gpt-low__classic-v1.judge.json"), "{}", "utf8");
    await writeFile(join(dir, "codex-gpt-low__classic-v1.sheet.png"), "png", "utf8");
    await writeFile(join(dir, "claude-opus-low__classic-v1.svg"), "<svg/>", "utf8");

    await cleanAttemptArtifacts(RUN_ID, "codex-gpt-low", "classic-v1");
    const remaining = (await readdir(dir)).sort();
    assert.deepEqual(remaining, [
      "claude-opus-low__classic-v1.svg",
      "progress.json",
      "run.json",
    ]);
  });
});

describe("parseRunRequestBody & parseRunOnceArgs 重试参数解析", () => {
  test("parseRunRequestBody 支持整轮重试与单卡重试请求体", () => {
    const batch = parseRunRequestBody(JSON.stringify({ retryRunId: RUN_ID }));
    assert.deepEqual(batch, {
      retryRunId: RUN_ID,
      targetIds: [],
      promptIds: [],
    });

    const single = parseRunRequestBody(
      JSON.stringify({
        retryRunId: RUN_ID,
        targetIds: ["codex-gpt-low"],
        promptIds: ["classic-v1"],
        includeNoSvg: true,
      }),
    );
    assert.deepEqual(single, {
      retryRunId: RUN_ID,
      targetIds: ["codex-gpt-low"],
      promptIds: ["classic-v1"],
      includeNoSvg: true,
    });
  });

  test("parseRunOnceArgs 支持 --retry 与 --include-no-svg", () => {
    const parsed = parseRunOnceArgs([
      "--retry",
      RUN_ID,
      "--include-no-svg",
      "--target",
      "codex-gpt-low",
      "--dry-run",
    ]);
    assert.equal(parsed.retryRunId, RUN_ID);
    assert.equal(parsed.includeNoSvg, true);
    assert.deepEqual(parsed.targetIds, ["codex-gpt-low"]);
    assert.equal(parsed.dryRun, true);
  });
});

function makeCard(attempt: Attempt): DashboardCard {
  return {
    ...attempt,
    runId: RUN_ID,
    runStartedAt: "2026-04-19T12:00:00.000Z",
    trigger: "manual",
    runInProgress: false,
    promptText: "Pelican",
    bindings: {},
    usage: null,
    cost: {
      status: "unpriced",
      usd: null,
      modelId: null,
      channelId: null,
      serviceTier: "standard",
      catalogTag: null,
      lines: [],
      note: null,
    },
    judge: null,
    judgeCost: null,
  };
}

describe("mergeLiveProgress 原地重跑实时状态覆盖", () => {
  test("同轮次原地重跑期间，既有成功卡片保持 ok，正在重跑的卡片被覆盖为 running/queued", () => {
    const baseOkCard = makeCard(makeAttempt("claude-opus-low", "claude", "claude-opus-4-6", "low", "ok"));
    const existingFailedCard = makeCard(makeAttempt("claude-opus-high", "claude", "claude-opus-4-6", "high", "timeout"));

    const progress: ProgressView[] = [
      {
        runId: RUN_ID,
        trigger: "manual",
        startedAt: "2026-04-19T12:00:00.000Z",
        updatedAt: "2026-04-19T12:05:00.000Z",
        finishedAt: null,
        pid: process.pid,
        pidStart: null,
        laneLimit: 2,
        alive: true,
        lanes: [
          {
            cli: "claude",
            model: "claude-opus-4-6",
            calls: [
              {
                targetId: "claude-opus-high",
                promptId: "classic-v1",
                effort: "high",
                state: "running",
                startedAt: "2026-04-19T12:05:00.000Z",
                timeoutMs: 120_000,
                status: null,
                durationMs: null,
              },
            ],
          },
        ],
      },
    ];

    const merged = mergeLiveProgress({
      cards: [baseOkCard, existingFailedCard],
      runStarts: ["2026-04-19T12:00:00.000Z"],
      progress,
      promptLabels: { "classic-v1": "Classic Pelican" },
    });
    assert.equal(merged.cards.length, 2);
    const okCard = merged.cards.find((c) => c.targetId === "claude-opus-low")!;
    const retryingCard = merged.cards.find((c) => c.targetId === "claude-opus-high")!;
    assert.equal(okCard.status, "ok");
    assert.equal(okCard.liveState, undefined);
    assert.equal(okCard.runInProgress, true);
    assert.equal(retryingCard.liveState, "running");
    assert.equal(retryingCard.runInProgress, true);
  });
});

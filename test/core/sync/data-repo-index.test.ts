/**
 * 数据仓索引与清单维护（data-repo-index）测试。
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  buildRunSummary,
  manifestMetaFromRemote,
  updateDayIndex,
  updateManifest,
} from "@/core/sync/data-repo-index";
import type { PublicRunRecord } from "@/core/data-repo/contract";

describe("data-repo-index 索引与清单维护", () => {
  let repoDir: string;

  beforeEach(async () => {
    repoDir = await mkdtemp(join(tmpdir(), "llm-iq-repo-"));
  });

  afterEach(async () => {
    await rm(repoDir, { recursive: true, force: true });
  });

  it("DayIndex: runs 按 runId 升序，支持增量追加与去重更新", async () => {
    const summary1 = {
      runId: "20260927T030000Z",
      startedAt: "2026-09-27T03:00:00Z",
      finishedAt: "2026-09-27T03:01:00Z",
      trigger: "schedule" as const,
      promptIds: ["classic-v1"],
      attempts: 1,
      ok: 1,
      path: "runs/2026/09/27/20260927T030000Z",
    };
    const summary2 = {
      runId: "20260927T010000Z",
      startedAt: "2026-09-27T01:00:00Z",
      finishedAt: "2026-09-27T01:01:00Z",
      trigger: "manual" as const,
      promptIds: ["classic-v1"],
      attempts: 2,
      ok: 2,
      path: "runs/2026/09/27/20260927T010000Z",
    };

    // 乱序传入
    const dayIndex = await updateDayIndex(repoDir, "2026-09-27", [
      summary1,
      summary2,
    ]);
    assert.equal(dayIndex.schemaVersion, 1);
    assert.equal(dayIndex.date, "2026-09-27");
    assert.equal(dayIndex.runs.length, 2);
    // 按 runId 升序排列
    assert.equal(dayIndex.runs[0]?.runId, "20260927T010000Z");
    assert.equal(dayIndex.runs[1]?.runId, "20260927T030000Z");

    // 增量更新同日的另一个 run
    const summary3 = {
      runId: "20260927T020000Z",
      startedAt: "2026-09-27T02:00:00Z",
      finishedAt: "2026-09-27T02:01:00Z",
      trigger: "schedule" as const,
      promptIds: ["classic-v1"],
      attempts: 1,
      ok: 1,
      path: "runs/2026/09/27/20260927T020000Z",
    };
    const updated = await updateDayIndex(repoDir, "2026-09-27", [summary3]);
    assert.equal(updated.runs.length, 3);
    assert.deepEqual(
      updated.runs.map((r) => r.runId),
      ["20260927T010000Z", "20260927T020000Z", "20260927T030000Z"],
    );
  });

  it("DataRepoManifest: 汇总各日索引，days 降序排列，totalRuns 正确汇总", async () => {
    // 写入两天
    await updateDayIndex(repoDir, "2026-09-25", [
      {
        runId: "20260925T100000Z",
        startedAt: "2026-09-25T10:00:00Z",
        finishedAt: "2026-09-25T10:01:00Z",
        trigger: "schedule",
        promptIds: ["classic-v1"],
        attempts: 1,
        ok: 1,
        path: "runs/2026/09/25/20260925T100000Z",
      },
    ]);
    await updateDayIndex(repoDir, "2026-09-27", [
      {
        runId: "20260927T100000Z",
        startedAt: "2026-09-27T10:00:00Z",
        finishedAt: "2026-09-27T10:01:00Z",
        trigger: "schedule",
        promptIds: ["classic-v1"],
        attempts: 1,
        ok: 1,
        path: "runs/2026/09/27/20260927T100000Z",
      },
      {
        runId: "20260927T120000Z",
        startedAt: "2026-09-27T12:00:00Z",
        finishedAt: "2026-09-27T12:01:00Z",
        trigger: "schedule",
        promptIds: ["classic-v1"],
        attempts: 1,
        ok: 1,
        path: "runs/2026/09/27/20260927T120000Z",
      },
    ]);

    const manifest = await updateManifest(repoDir);
    assert.equal(manifest.schemaVersion, 1);
    assert.equal(manifest.totalRuns, 3);
    assert.equal(manifest.days.length, 2);
    // 新的日期在前
    assert.equal(manifest.days[0]?.date, "2026-09-27");
    assert.equal(manifest.days[0]?.runs, 2);
    assert.equal(manifest.days[1]?.date, "2026-09-25");
    assert.equal(manifest.days[1]?.runs, 1);
  });

  it("DataRepoManifest: updatedAt 确定性（取最新日索引的最大 finishedAt，多轮保持字节一致）", async () => {
    await updateDayIndex(repoDir, "2026-09-26", [
      {
        runId: "20260926T080000Z",
        startedAt: "2026-09-26T08:00:00.000Z",
        finishedAt: "2026-09-26T08:05:00.000Z",
        trigger: "schedule",
        promptIds: ["p1"],
        attempts: 1,
        ok: 1,
        path: "runs/2026/09/26/20260926T080000Z",
      },
    ]);
    await updateDayIndex(repoDir, "2026-09-27", [
      {
        runId: "20260927T010000Z",
        startedAt: "2026-09-27T01:00:00.000Z",
        finishedAt: "2026-09-27T01:02:00.000Z",
        trigger: "schedule",
        promptIds: ["p1"],
        attempts: 1,
        ok: 1,
        path: "runs/2026/09/27/20260927T010000Z",
      },
      {
        runId: "20260927T020000Z",
        startedAt: "2026-09-27T02:00:00.000Z",
        finishedAt: "2026-09-27T02:08:30.000Z",
        trigger: "manual",
        promptIds: ["p1"],
        attempts: 1,
        ok: 1,
        path: "runs/2026/09/27/20260927T020000Z",
      },
    ]);

    const m1 = await updateManifest(repoDir);
    assert.equal(m1.updatedAt, "2026-09-27T02:08:30.000Z");

    const content1 = await readFile(join(repoDir, "index.json"), "utf8");

    // 再次调用，updatedAt 与整个清单内容必须字节一致
    const m2 = await updateManifest(repoDir);
    const content2 = await readFile(join(repoDir, "index.json"), "utf8");
    assert.equal(m2.updatedAt, "2026-09-27T02:08:30.000Z");
    assert.equal(content1, content2);
  });

  it("DataRepoManifest: 空仓时沿用已有 index.json 的 updatedAt，若无则使用当前时刻", async () => {
    // 1. 无已有 index.json 且空仓：使用传入时刻
    const testTime = new Date("2026-01-01T00:00:00.000Z");
    const m1 = await updateManifest(repoDir, testTime);
    assert.equal(m1.updatedAt, testTime.toISOString());
    assert.equal(m1.totalRuns, 0);

    // 2. 有已有 index.json 且空仓：沿用已有 updatedAt
    const existing = {
      schemaVersion: 1,
      name: "test",
      description: "desc",
      repository: "https://example.com",
      updatedAt: "2025-12-31T23:59:59.000Z",
      totalRuns: 0,
      days: [],
    };
    await writeFile(join(repoDir, "index.json"), JSON.stringify(existing, null, 2));

    const m2 = await updateManifest(repoDir, new Date("2026-05-01T00:00:00.000Z"));
    assert.equal(m2.updatedAt, "2025-12-31T23:59:59.000Z");
  });

  it("DataRepoManifest: 读取已有 index.json 损坏或形状错误时抛错中止", async () => {
    // 1. JSON 损坏
    await writeFile(join(repoDir, "index.json"), "{ invalid json");
    await assert.rejects(
      () => updateManifest(repoDir),
      /数据仓清单 .* JSON 损坏/,
    );

    // 2. 形状错误：不是对象
    await writeFile(join(repoDir, "index.json"), '"a string"');
    await assert.rejects(
      () => updateManifest(repoDir),
      /数据仓清单 .* 格式错误，期望 JSON 对象/,
    );

    // 3. 形状错误：缺少 schemaVersion 或 version
    await writeFile(join(repoDir, "index.json"), '{"hello":"world"}');
    await assert.rejects(
      () => updateManifest(repoDir),
      /数据仓清单 .* 缺少 schemaVersion 或 version 字段/,
    );
  });

  it("DayIndex: 读取已有日索引损坏或形状错误时抛错中止", async () => {
    const dayDir = join(repoDir, "runs", "2026", "09", "27");
    await updateDayIndex(repoDir, "2026-09-27", []);

    // 1. 损坏的日索引
    await writeFile(join(dayDir, "index.json"), "{ broken json");
    await assert.rejects(
      () => updateDayIndex(repoDir, "2026-09-27", []),
      /日索引 .* JSON 损坏/,
    );

    // 2. 缺少 runs 数组
    await writeFile(join(dayDir, "index.json"), '{"schemaVersion":1}');
    await assert.rejects(
      () => updateDayIndex(repoDir, "2026-09-27", []),
      /日索引 .* 格式错误，缺少 runs 数组/,
    );
  });

  it("兼容并迁移旧版形状（{version, totalRuns:0, runs:[]}）并保留原有元信息", async () => {
    const legacyContent = {
      version: "0.1.0",
      name: "custom-repo",
      description: "Custom Description",
      repository: "https://github.com/my-org/my-data",
      totalRuns: 0,
      runs: [],
    };
    await writeFile(
      join(repoDir, "index.json"),
      JSON.stringify(legacyContent, null, 2),
    );

    await updateDayIndex(repoDir, "2026-09-27", [
      {
        runId: "20260927T100000Z",
        startedAt: "2026-09-27T10:00:00Z",
        finishedAt: "2026-09-27T10:01:00Z",
        trigger: "schedule",
        promptIds: ["classic-v1"],
        attempts: 1,
        ok: 1,
        path: "runs/2026/09/27/20260927T100000Z",
      },
    ]);

    const migrated = await updateManifest(repoDir);
    assert.equal(migrated.schemaVersion, 1);
    assert.equal(migrated.name, "custom-repo");
    assert.equal(migrated.description, "Custom Description");
    assert.equal(migrated.repository, "https://github.com/my-org/my-data");
    assert.equal(migrated.totalRuns, 1);
    assert.equal(migrated.days.length, 1);
  });

  it("buildRunSummary 正确从 PublicRunRecord 提取关键字段", () => {
    const record: PublicRunRecord = {
      publicSchemaVersion: 1,
      runId: "20260927T021708Z",
      prompts: [
        { promptId: "classic-v1", text: "t1", bindings: {} },
        { promptId: "classic-v1", text: "t1", bindings: {} },
      ],
      startedAt: "2026-09-27T02:17:08.000Z",
      finishedAt: "2026-09-27T02:18:00.000Z",
      durationMs: 52000,
      trigger: "manual",
      inProgress: false,
      attempts: [
        {
          targetId: "t1",
          promptId: "classic-v1",
          cli: "claude",
          model: "claude-sonnet-5",
          effort: "low",
          appliedEffort: "low",
          effortHonored: true,
          label: "label",
          status: "ok",
          svgFile: "1.svg",
          rawFile: null,
          startedAt: "2026-09-27T02:17:09.000Z",
          finishedAt: "2026-09-27T02:17:40.000Z",
          durationMs: 31000,
          svgBytes: 10,
          error: null,
          usage: null,
        },
      ],
      redactions: [],
    };

    const summary = buildRunSummary(record);
    assert.equal(summary.runId, "20260927T021708Z");
    assert.equal(summary.path, "runs/2026/09/27/20260927T021708Z");
    assert.equal(summary.attempts, 1);
    assert.equal(summary.ok, 1);
    assert.deepEqual(summary.promptIds, ["classic-v1"]);
  });
});

describe("data-repo-index 清单来源推导", () => {
  let repoDir: string;

  beforeEach(async () => {
    repoDir = await mkdtemp(join(tmpdir(), "llm-iq-repo-remote-"));
  });

  afterEach(async () => {
    await rm(repoDir, { recursive: true, force: true });
  });

  const git = (...args: string[]): void => {
    execFileSync("git", ["-C", repoDir, ...args], { stdio: "ignore" });
  };

  it("没有 index.json 时 name 与 repository 从 origin 远程推导，https 与 ssh 写法都认", async () => {
    git("init", "-q");
    git("remote", "add", "origin", "https://github.com/acme/my-iq-data.git");
    const manifest = await updateManifest(repoDir);
    assert.equal(manifest.name, "my-iq-data");
    assert.equal(manifest.repository, "https://github.com/acme/my-iq-data");

    git("remote", "set-url", "origin", "git@github.com:acme/other-data.git");
    assert.deepEqual(await manifestMetaFromRemote(repoDir), {
      name: "other-data", repository: "https://github.com/acme/other-data",
    });
  });

  it("不是 git 仓或远程不是 GitHub 时用缺省值；已有 index.json 里的 name / repository 优先", async () => {
    assert.deepEqual(await manifestMetaFromRemote(repoDir), {
      name: "llm-iq-data", repository: "https://github.com/meomeo-dev/llm-iq-data",
    });
    git("init", "-q");
    git("remote", "add", "origin", "https://gitlab.example.com/acme/data.git");
    assert.equal((await manifestMetaFromRemote(repoDir)).repository, "https://github.com/meomeo-dev/llm-iq-data");

    git("remote", "set-url", "origin", "https://github.com/acme/my-iq-data.git");
    await writeFile(join(repoDir, "index.json"), JSON.stringify({
      schemaVersion: 1, name: "custom", description: "d", repository: "https://example.com/x", days: [],
    }));
    const manifest = await updateManifest(repoDir);
    assert.equal(manifest.name, "custom");
    assert.equal(manifest.repository, "https://example.com/x");
  });
});

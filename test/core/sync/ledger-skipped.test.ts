/**
 * 台账 skipped 状态读写与兼容测试。
 * 覆盖：
 * 1. 新状态（skipped 及三种原因）读写往返；
 * 2. 旧两态台账兼容（缺少 reason/skippedAt 仍正常读取）；
 * 3. 未知 status 或损坏记录报错中止。
 */

import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import {
  loadSyncLedger,
  saveSyncLedger,
  type SyncLedger,
} from "@/core/sync/sync-ledger";
import {
  recordSkippedRejected,
  recordSkippedUnpublishable,
} from "@/core/sync/ledger-skip";

const ENV_DATA_DIR = "PELICAN_DATA_DIR";
let tempDir: string;
let previousDataDir: string | undefined;

before(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "llm-iq-ledger-skipped-"));
  previousDataDir = process.env[ENV_DATA_DIR];
  process.env[ENV_DATA_DIR] = tempDir;
});

after(async () => {
  if (previousDataDir === undefined) delete process.env[ENV_DATA_DIR];
  else process.env[ENV_DATA_DIR] = previousDataDir;
  await rm(tempDir, { recursive: true, force: true });
});

describe("sync-ledger skipped 状态与兼容性", () => {
  let dataDir: string;

  beforeEach(async () => {
    dataDir = await mkdtemp(join(tempDir, "case-"));
  });

  it("新状态读写往返：三种 reason 与 details 完整保持", async () => {
    const originalLedger: SyncLedger = {
      "20260901T010000Z": {
        status: "exported",
        exportedAt: "2026-09-01T01:05:00Z",
        commit: "abc1234",
        redactions: [],
      },
      "20260901T020000Z": {
        status: "published",
        exportedAt: "2026-09-01T02:05:00Z",
        publishedAt: "2026-09-01T02:10:00Z",
        commit: "def5678",
        redactions: [{ file: "sample.svg", reason: "local-path" }],
      },
      "20260901T030000Z": {
        status: "skipped",
        reason: "unpublishable-prompt",
        skippedAt: "2026-09-01T03:01:00Z",
      },
      "20260901T040000Z": {
        status: "skipped",
        reason: "rejected",
        skippedAt: "2026-09-01T04:01:00Z",
        details: [
          { file: "run.json", reason: "local-path" },
          { file: "art.svg", reason: "secret-pattern" },
        ],
      },
      "20260901T050000Z": {
        status: "skipped",
        reason: "abandoned",
        skippedAt: "2026-09-01T05:01:00Z",
      },
    };

    await saveSyncLedger(originalLedger, dataDir);
    const loaded = await loadSyncLedger(dataDir);
    assert.deepEqual(loaded, originalLedger);
  });

  it("旧两态台账兼容读取：无 skipped 字段的旧台账照常读取", async () => {
    const oldLedgerJson = {
      "20260801T000000Z": {
        status: "published",
        exportedAt: "2026-08-01T00:01:00Z",
        publishedAt: "2026-08-01T00:02:00Z",
        redactions: [],
      },
      "20260802T000000Z": {
        status: "exported",
        exportedAt: "2026-08-02T00:01:00Z",
        redactions: [],
      },
    };

    await writeFile(
      join(dataDir, "sync-state.json"),
      JSON.stringify(oldLedgerJson, null, 2),
      "utf8",
    );

    const loaded = await loadSyncLedger(dataDir);
    assert.equal(loaded["20260801T000000Z"]?.status, "published");
    assert.equal(loaded["20260802T000000Z"]?.status, "exported");
    assert.equal(Object.keys(loaded).length, 2);
  });

  it("未知 status 报错中止", async () => {
    const invalidLedger = {
      "20260901T010000Z": {
        status: "unknown-status",
        exportedAt: "2026-09-01T01:05:00Z",
      },
    };

    await writeFile(
      join(dataDir, "sync-state.json"),
      JSON.stringify(invalidLedger, null, 2),
      "utf8",
    );

    await assert.rejects(
      async () => loadSyncLedger(dataDir),
      /格式错误.*未知的 status "unknown-status"/,
    );
  });

  it("skipped 记录缺少有效 reason 或 skippedAt 时报错中止", async () => {
    const invalidReason = {
      "20260901T010000Z": {
        status: "skipped",
        reason: "invalid-reason",
        skippedAt: "2026-09-01T01:05:00Z",
      },
    };

    await writeFile(
      join(dataDir, "sync-state.json"),
      JSON.stringify(invalidReason, null, 2),
      "utf8",
    );

    await assert.rejects(
      async () => loadSyncLedger(dataDir),
      /格式错误.*缺少有效 reason/,
    );
  });

  it("ledger-skip：原因相同的已有 skipped 记录保留原 skippedAt，返回 false", () => {
    const runId = "20260901T010000Z";
    const initialSkippedAt = "2026-09-01T01:05:00.000Z";
    const ledger: SyncLedger = {
      [runId]: {
        status: "skipped",
        reason: "unpublishable-prompt",
        skippedAt: initialSkippedAt,
      },
    };

    // 再次记录相同原因：应返回 false，且 skippedAt 不变
    const changed1 = recordSkippedUnpublishable(
      ledger,
      runId,
      "2026-09-02T01:05:00.000Z",
    );
    assert.equal(changed1, false);
    const rec1 = ledger[runId];
    assert.ok(rec1 && rec1.status === "skipped");
    assert.equal(rec1.skippedAt, initialSkippedAt);

    // rejected 相同原因：应返回 false，且 skippedAt 不变
    const rejRunId = "20260901T020000Z";
    const rejSkippedAt = "2026-09-01T02:05:00.000Z";
    ledger[rejRunId] = {
      status: "skipped",
      reason: "rejected",
      skippedAt: rejSkippedAt,
      details: [{ file: "art.svg", reason: "local-path" }],
    };

    const changed2 = recordSkippedRejected(
      ledger,
      rejRunId,
      [{ file: "art.svg", reason: "local-path" }],
      "2026-09-02T02:05:00.000Z",
    );
    assert.equal(changed2, false);
    const rec2 = ledger[rejRunId];
    assert.ok(rec2 && rec2.status === "skipped");
    assert.equal(rec2.skippedAt, rejSkippedAt);

    // 已是 exported/published 的记录：返回 false 且不得被覆盖
    ledger["20260901T030000Z"] = {
      status: "exported",
      exportedAt: "2026-09-01T03:05:00.000Z",
      redactions: [],
    };
    const changed3 = recordSkippedUnpublishable(ledger, "20260901T030000Z");
    assert.equal(changed3, false);
    assert.equal(ledger["20260901T030000Z"]?.status, "exported");
  });
});

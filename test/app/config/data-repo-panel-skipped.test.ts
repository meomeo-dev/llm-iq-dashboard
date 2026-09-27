/**
 * 面板展示模型 skipped / rejected 指标与文案测试（data-repo-panel-skipped）。
 * 覆盖：
 * 1. deriveCountsSummary 计数与文案映射；
 * 2. 0 计数时不显示对应行（为 null）；
 * 3. pending 排除台账中任何状态的记录（含 skipped）；
 * 4. rejected 清单仅包含本地存在的 skipped/rejected 轮次，新的在前。
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import {
  deriveCountsSummary,
} from "@/app/config/data-repo-panel-model";
import {
  collectDataRepoStatus,
} from "@/core/sync/data-repo-status";
import { saveSyncLedger, type SyncLedger } from "@/core/sync/sync-ledger";
import type { DataRepoStatus } from "@/core/sync/data-repo-panel-types";

describe("data-repo-panel-skipped 展示模型文案与状态过滤", () => {
  it("deriveCountsSummary：计数与文案映射，0 时不显示对应行", () => {
    // 场景 1：不可发布 2 轮，被拒绝 1 轮
    const statusBoth: DataRepoStatus = {
      configured: true,
      deploy: { readonly: false, externalRunner: false },
      repo: null,
      manifest: null,
      ledger: {
        exported: 3,
        published: 2,
        skipped: 3, // 3 轮 skipped，其中 1 轮 rejected，2 轮 unpublishable
        skippedByReason: {
          "unpublishable-prompt": 2,
          rejected: 1,
          abandoned: 0,
        },
        lastExportedAt: null,
        lastPublishedAt: null,
      },
      local: {
        totalRuns: 6,
        pending: ["20260927T060000Z"],
        incomplete: 0,
        rejected: ["20260927T040000Z"],
      },
      lastAction: null,
      notice: null,
    };

    const countsBoth = deriveCountsSummary(statusBoth);
    assert.equal(countsBoth.unpublishableText, "不可发布 2 轮");
    assert.equal(countsBoth.rejectedText, "被拒绝 1 轮（需人工处理）");

    // 场景 2：不可发布 0 轮，被拒绝 0 轮
    const statusZero: DataRepoStatus = {
      ...statusBoth,
      ledger: {
        ...statusBoth.ledger,
        skipped: 0,
        skippedByReason: {
          "unpublishable-prompt": 0,
          rejected: 0,
          abandoned: 0,
        },
      },
      local: {
        ...statusBoth.local,
        rejected: [],
      },
    };

    const countsZero = deriveCountsSummary(statusZero);
    assert.equal(countsZero.unpublishableText, null);
    assert.equal(countsZero.rejectedText, null);

    // 场景 3：不可发布 3 轮，被拒绝 0 轮
    const statusUnpubOnly: DataRepoStatus = {
      ...statusBoth,
      ledger: {
        ...statusBoth.ledger,
        skipped: 3,
        skippedByReason: {
          "unpublishable-prompt": 3,
          rejected: 0,
          abandoned: 0,
        },
      },
      local: {
        ...statusBoth.local,
        rejected: [],
      },
    };

    const countsUnpubOnly = deriveCountsSummary(statusUnpubOnly);
    assert.equal(countsUnpubOnly.unpublishableText, "不可发布 3 轮");
    assert.equal(countsUnpubOnly.rejectedText, null);

    // 场景 4：口径测试——本地目录已删（local.rejected 为空），但台账中记录了 rejected 与 abandoned
    const statusDeletedLocal: DataRepoStatus = {
      ...statusBoth,
      ledger: {
        ...statusBoth.ledger,
        skipped: 4,
        skippedByReason: {
          "unpublishable-prompt": 1,
          rejected: 2,
          abandoned: 1,
        },
      },
      local: {
        ...statusBoth.local,
        rejected: [], // 本地目录已经删除或不存在
      },
    };
    const countsDeletedLocal = deriveCountsSummary(statusDeletedLocal);
    // 不可发布 = 1 (unpublishable-prompt) + 1 (abandoned) = 2
    assert.equal(countsDeletedLocal.unpublishableText, "不可发布 2 轮");
    // 被拒绝 = 2（按台账 rejected 计数，本地目录已删的也计入）
    assert.equal(countsDeletedLocal.rejectedText, "被拒绝 2 轮（需人工处理）");

    // 场景 5：status 为 null
    const countsNull = deriveCountsSummary(null);
    assert.equal(countsNull.unpublishableText, null);
    assert.equal(countsNull.rejectedText, null);
  });

  describe("collectDataRepoStatus 状态聚合集成", () => {
    let tempDir: string;
    let dataDir: string;
    let runsDir: string;
    let prevDataDir: string | undefined;

    before(async () => {
      tempDir = await mkdtemp(join(tmpdir(), "llm-iq-panel-skipped-"));
      dataDir = join(tempDir, "data");
      runsDir = join(dataDir, "runs");
      prevDataDir = process.env.PELICAN_DATA_DIR;
      process.env.PELICAN_DATA_DIR = dataDir;
    });

    after(async () => {
      if (prevDataDir !== undefined) process.env.PELICAN_DATA_DIR = prevDataDir;
      else delete process.env.PELICAN_DATA_DIR;
      await rm(tempDir, { recursive: true, force: true });
    });

    beforeEach(async () => {
      await rm(runsDir, { recursive: true, force: true });
      await mkdir(runsDir, { recursive: true });
      await rm(join(dataDir, "sync-state.json"), { force: true });
    });

    it("pending 排除台账中任何状态的记录（含 skipped），rejected 收集本地目录存在且新的在前", async () => {
      const runPending = "20260927T010000Z";
      const runExported = "20260927T020000Z";
      const runUnpublishable = "20260927T030000Z";
      const runRejectedOlder = "20260927T040000Z";
      const runRejectedNewer = "20260927T050000Z";

      for (const id of [
        runPending,
        runExported,
        runUnpublishable,
        runRejectedOlder,
        runRejectedNewer,
      ]) {
        const d = join(runsDir, id);
        await mkdir(d, { recursive: true });
        await writeFile(join(d, "run.json"), JSON.stringify({ runId: id, inProgress: false }));
      }

      const ledger: SyncLedger = {
        [runExported]: {
          status: "exported",
          exportedAt: "2026-09-27T02:01:00Z",
          redactions: [],
        },
        [runUnpublishable]: {
          status: "skipped",
          reason: "unpublishable-prompt",
          skippedAt: "2026-09-27T03:01:00Z",
        },
        [runRejectedOlder]: {
          status: "skipped",
          reason: "rejected",
          skippedAt: "2026-09-27T04:01:00Z",
          details: [{ file: "run.json", reason: "local-path" }],
        },
        [runRejectedNewer]: {
          status: "skipped",
          reason: "rejected",
          skippedAt: "2026-09-27T05:01:00Z",
          details: [{ file: "art.svg", reason: "secret-pattern" }],
        },
      };
      await saveSyncLedger(ledger, dataDir);

      const status = await collectDataRepoStatus(
        { dataRepo: null } as any,
        { dataDir },
      );

      // pending 应只有未在台账中的 runPending
      assert.deepEqual(status.local.pending, [runPending]);

      // rejected 包含 runRejectedNewer 与 runRejectedOlder，且新的在前
      assert.deepEqual(status.local.rejected, [runRejectedNewer, runRejectedOlder]);

      // ledger.skipped 计数为 3，且按原因细分正确
      assert.equal(status.ledger.skipped, 3);
      assert.deepEqual(status.ledger.skippedByReason, {
        "unpublishable-prompt": 1,
        rejected: 2,
        abandoned: 0,
      });

      // deriveCountsSummary 应给出正确的文案
      const counts = deriveCountsSummary(status);
      assert.equal(counts.unpublishableText, "不可发布 1 轮");
      assert.equal(counts.rejectedText, "被拒绝 2 轮（需人工处理）");
    });
  });
});

/**
 * 修剪分级与 skipped 状态生命周期测试（retention-skipped）。
 * 覆盖：
 * 1. 五种状态的修剪分级；
 * 2. 残轮两倍阈值两侧（<= 2x 保留，> 2x 写 abandoned 并删除）；
 * 3. rejected 永不自动删除，并有专项人工处理提示日志；
 * 4. 持锁时修剪跳过并记日志；
 * 5. 竞争保护：外部写入 exported 记录在修剪后仍保留；
 * 6. 残轮细化判定：损坏 run.json 保留，受保护记录不走 abandoned，完整 run.json 的 abandoned 轮次保留。
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import { pruneExpiredRuns } from "@/core/retention";
import {
  loadSyncLedger,
  saveSyncLedger,
  type SyncLedger,
} from "@/core/sync/sync-ledger";
import { acquireDataRepoSyncLock } from "@/core/sync/data-repo-action-lock";

const ENV_DATA_DIR = "PELICAN_DATA_DIR";
let dataDir: string;
let previousDataDir: string | undefined;

before(async () => {
  dataDir = await mkdtemp(join(tmpdir(), "llm-iq-retention-skipped-"));
  previousDataDir = process.env[ENV_DATA_DIR];
  process.env[ENV_DATA_DIR] = dataDir;
});

after(async () => {
  if (previousDataDir === undefined) delete process.env[ENV_DATA_DIR];
  else process.env[ENV_DATA_DIR] = previousDataDir;
  await rm(dataDir, { recursive: true, force: true });
});

describe("retention-skipped 修剪分级测试", () => {
  let runsDir: string;

  beforeEach(async () => {
    runsDir = join(dataDir, "runs");
    await rm(runsDir, { recursive: true, force: true });
    await mkdir(runsDir, { recursive: true });
    await rm(join(dataDir, "sync-state.json"), { force: true });
  });

  it("六种状态修剪分级与 rejected 永不删除", async () => {
    const refNow = new Date("2026-09-27T00:00:00Z");

    const expPublished = "20260901T010000Z";
    const expUnpublishable = "20260901T020000Z";
    const expRejected = "20260901T030000Z";
    const expExported = "20260901T040000Z";
    const expUnrecorded = "20260901T050000Z";
    const expEmpty = "20260901T060000Z";
    const expDiscarded = "20260901T070000Z";

    for (const id of [
      expDiscarded,
      expPublished,
      expUnpublishable,
      expRejected,
      expExported,
      expUnrecorded,
      expEmpty,
    ]) {
      const d = join(runsDir, id);
      await mkdir(d, { recursive: true });
      await writeFile(join(d, "run.json"), JSON.stringify({ runId: id }));
    }

    const ledger: SyncLedger = {
      [expPublished]: {
        status: "published",
        exportedAt: "2026-09-01T01:05:00Z",
        publishedAt: "2026-09-01T01:10:00Z",
        redactions: [],
      },
      [expUnpublishable]: {
        status: "skipped",
        reason: "unpublishable-prompt",
        skippedAt: "2026-09-01T02:05:00Z",
      },
      [expRejected]: {
        status: "skipped",
        reason: "rejected",
        skippedAt: "2026-09-01T03:05:00Z",
        details: [{ file: "run.json", reason: "local-path" }],
      },
      [expExported]: {
        status: "exported",
        exportedAt: "2026-09-01T04:05:00Z",
        redactions: [],
      },
      [expEmpty]: {
        status: "skipped",
        reason: "empty",
        skippedAt: "2026-09-01T06:05:00Z",
      },
      [expDiscarded]: {
        status: "skipped",
        reason: "discarded",
        skippedAt: "2026-09-01T07:05:00Z",
      },
    };
    await saveSyncLedger(ledger, dataDir);

    const logs: string[] = [];
    await pruneExpiredRuns(10, (msg) => logs.push(msg), refNow);

    const remaining = await readdir(runsDir);
    assert.ok(!remaining.includes(expPublished));
    assert.ok(!remaining.includes(expUnpublishable));
    assert.ok(!remaining.includes(expEmpty));
    assert.ok(!remaining.includes(expDiscarded));
    assert.ok(remaining.includes(expRejected));
    assert.ok(remaining.includes(expExported));
    assert.ok(remaining.includes(expUnrecorded));

    assert.ok(
      logs.some((msg) => msg.includes("保留 1 个被拒绝的过期轮次（需人工处理）")),
    );
    assert.ok(logs.some((msg) => msg.includes("保留 2 个未发布的过期轮次")));
    assert.ok(logs.some((msg) => msg.includes("清理了 4 个过期轮次")));
  });

  it("残轮两倍阈值两侧判定：未超两倍保留，超两倍写 abandoned 并删除", async () => {
    const refNow = new Date("2026-09-27T00:00:00Z");

    const residualRecentMissingJson = "20260912T000000Z";
    const residualRecentInProgress = "20260912T010000Z";
    const residualOldMissingJson = "20260902T000000Z";
    const residualOldInProgress = "20260902T010000Z";
    const oldRejected = "20260902T020000Z";

    await mkdir(join(runsDir, residualRecentMissingJson), { recursive: true });
    await writeFile(
      join(runsDir, residualRecentMissingJson, "progress.json"),
      JSON.stringify({ inProgress: true }),
    );

    await mkdir(join(runsDir, residualRecentInProgress), { recursive: true });
    await writeFile(
      join(runsDir, residualRecentInProgress, "run.json"),
      JSON.stringify({ runId: residualRecentInProgress, inProgress: true }),
    );

    await mkdir(join(runsDir, residualOldMissingJson), { recursive: true });
    await writeFile(
      join(runsDir, residualOldMissingJson, "progress.json"),
      JSON.stringify({ inProgress: true }),
    );

    await mkdir(join(runsDir, residualOldInProgress), { recursive: true });
    await writeFile(
      join(runsDir, residualOldInProgress, "run.json"),
      JSON.stringify({ runId: residualOldInProgress, inProgress: true }),
    );

    await mkdir(join(runsDir, oldRejected), { recursive: true });
    await writeFile(
      join(runsDir, oldRejected, "run.json"),
      JSON.stringify({ runId: oldRejected, inProgress: false }),
    );

    const initialLedger: SyncLedger = {
      [oldRejected]: {
        status: "skipped",
        reason: "rejected",
        skippedAt: "2026-09-02T02:05:00Z",
        details: [{ file: "run.json", reason: "secret-pattern" }],
      },
    };
    await saveSyncLedger(initialLedger, dataDir);

    const logs: string[] = [];
    await pruneExpiredRuns(10, (msg) => logs.push(msg), refNow);

    const remaining = await readdir(runsDir);
    assert.ok(remaining.includes(residualRecentMissingJson));
    assert.ok(remaining.includes(residualRecentInProgress));
    assert.ok(!remaining.includes(residualOldMissingJson));
    assert.ok(!remaining.includes(residualOldInProgress));
    assert.ok(remaining.includes(oldRejected));

    const ledger = await loadSyncLedger(dataDir);
    assert.equal(ledger[residualOldMissingJson]?.status, "skipped");
    assert.equal(ledger[residualOldMissingJson]?.reason, "abandoned");
    assert.equal(ledger[residualOldInProgress]?.status, "skipped");
    assert.equal(ledger[residualOldInProgress]?.reason, "abandoned");

    assert.equal(ledger[residualRecentMissingJson], undefined);
    assert.equal(ledger[residualRecentInProgress], undefined);
  });

  it("持锁时修剪跳过并记录日志，不等待且不删除任何目录", async () => {
    const refNow = new Date("2026-09-27T00:00:00Z");
    const expPub = "20260901T010000Z";
    const dir = join(runsDir, expPub);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "run.json"), JSON.stringify({ runId: expPub }));

    const ledger: SyncLedger = {
      [expPub]: {
        status: "published",
        exportedAt: "2026-09-01T01:05:00Z",
        publishedAt: "2026-09-01T01:10:00Z",
        redactions: [],
      },
    };
    await saveSyncLedger(ledger, dataDir);

    // 预先获取动作锁
    const lock = await acquireDataRepoSyncLock(dataDir);
    assert.equal(lock.acquired, true);

    const logs: string[] = [];
    try {
      await pruneExpiredRuns(10, (msg) => logs.push(msg), refNow);
    } finally {
      await lock.release();
    }

    // 应当跳过修剪并记录日志
    assert.ok(logs.some((msg) => msg.includes("获取同步锁失败，跳过本轮修剪")));

    // 目录未被删除
    const remaining = await readdir(runsDir);
    assert.ok(remaining.includes(expPub));
  });

  it("台账写回竞争防护：修剪过程中外部写入 exported 记录仍完整保留", async () => {
    const refNow = new Date("2026-09-27T00:00:00Z");
    const oldResidual = "20260901T010000Z";
    const dir = join(runsDir, oldResidual);
    await mkdir(dir, { recursive: true });
    // 只有 progress.json，超期两倍以上
    await writeFile(
      join(dir, "progress.json"),
      JSON.stringify({ inProgress: true }),
    );

    // 初始台账包含一个其他轮次
    const initialLedger: SyncLedger = {
      "20260920T000000Z": {
        status: "exported",
        exportedAt: "2026-09-20T00:01:00Z",
        redactions: [],
      },
    };
    await saveSyncLedger(initialLedger, dataDir);

    const logs: string[] = [];
    await pruneExpiredRuns(10, (msg) => logs.push(msg), refNow);

    // 残轮被清理，并记入台账
    const remaining = await readdir(runsDir);
    assert.ok(!remaining.includes(oldResidual));

    const finalLedger = await loadSyncLedger(dataDir);
    // 外部写入的 exported 记录绝不丢失
    assert.equal(finalLedger["20260920T000000Z"]?.status, "exported");
    assert.equal(finalLedger[oldResidual]?.status, "skipped");
    assert.equal(finalLedger[oldResidual]?.reason, "abandoned");
  });

  it("残轮细化判定：损坏 run.json 保留，受保护记录不走 abandoned，完整 run.json 的 abandoned 轮次保留", async () => {
    const refNow = new Date("2026-09-27T00:00:00Z");

    // 1. JSON 损坏的超期残轮（超期两倍以上），必须保留并记日志
    const corruptedRun = "20260901T010000Z";
    const corruptedDir = join(runsDir, corruptedRun);
    await mkdir(corruptedDir, { recursive: true });
    await writeFile(join(corruptedDir, "run.json"), "{ invalid-json-corrupted");

    // 2. 超期两倍但台账已有 exported 的轮次（虽缺失 run.json），不得改写为 abandoned
    const protectedExported = "20260901T020000Z";
    const protExpDir = join(runsDir, protectedExported);
    await mkdir(protExpDir, { recursive: true });
    await writeFile(
      join(protExpDir, "progress.json"),
      JSON.stringify({ inProgress: true }),
    );

    // 3. 超期两倍但台账已有 rejected 的轮次（虽缺失 run.json），不得改写为 abandoned
    const protectedRejected = "20260901T030000Z";
    const protRejDir = join(runsDir, protectedRejected);
    await mkdir(protRejDir, { recursive: true });
    await writeFile(join(protRejDir, "art.svg"), "<svg></svg>");

    // 4. 台账中为 skipped/abandoned 但 run.json 完整且非 inProgress 的轮次，超期时不删除
    const abandonedCompleted = "20260901T040000Z";
    const abanDir = join(runsDir, abandonedCompleted);
    await mkdir(abanDir, { recursive: true });
    await writeFile(
      join(abanDir, "run.json"),
      JSON.stringify({ runId: abandonedCompleted, inProgress: false }),
    );

    const ledger: SyncLedger = {
      [protectedExported]: {
        status: "exported",
        exportedAt: "2026-09-01T02:05:00Z",
        redactions: [],
      },
      [protectedRejected]: {
        status: "skipped",
        reason: "rejected",
        skippedAt: "2026-09-01T03:05:00Z",
        details: [{ file: "art.svg", reason: "local-path" }],
      },
      [abandonedCompleted]: {
        status: "skipped",
        reason: "abandoned",
        skippedAt: "2026-09-01T04:05:00Z",
      },
    };
    await saveSyncLedger(ledger, dataDir);

    const logs: string[] = [];
    await pruneExpiredRuns(10, (msg) => logs.push(msg), refNow);

    const remaining = await readdir(runsDir);
    // 全部保留，不被删除
    assert.ok(remaining.includes(corruptedRun));
    assert.ok(remaining.includes(protectedExported));
    assert.ok(remaining.includes(protectedRejected));
    assert.ok(remaining.includes(abandonedCompleted));

    // 台账中 protectedExported 仍是 exported，protectedRejected 仍是 rejected
    const finalLedger = await loadSyncLedger(dataDir);
    assert.equal(finalLedger[protectedExported]?.status, "exported");
    assert.equal(finalLedger[protectedRejected]?.status, "skipped");
    assert.equal(finalLedger[protectedRejected]?.reason, "rejected");
    assert.equal(finalLedger[corruptedRun], undefined);

    // 校验日志包含损坏提示
    assert.ok(logs.some((msg) => msg.includes("run.json 损坏")));
    // 校验汇总日志包含保留未发布与被拒绝
    assert.ok(logs.some((msg) => msg.includes("保留 1 个被拒绝的过期轮次")));
    assert.ok(logs.some((msg) => msg.includes("保留 2 个未发布的过期轮次")));
  });
});

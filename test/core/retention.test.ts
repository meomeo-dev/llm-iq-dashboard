/**
 * 必测矩阵 #11：修剪守卫（retention guard）测试。
 * 覆盖：
 * 1. 过期且台账为 published 才删除；
 * 2. 未发布的过期轮次保留，并汇总记一行日志；
 * 3. 过期且目录为空的可以删除；
 * 4. 只有 progress.json 等过程文件、没有 run.json 的过期目录保留；
 * 5. 台账读不到（文件不存在）等价于“全部未发布”。
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import { pruneExpiredRuns } from "@/core/retention";
import { saveSyncLedger, type SyncLedger } from "@/core/sync/sync-ledger";

const ENV_DATA_DIR = "PELICAN_DATA_DIR";
let dataDir: string;
let previousDataDir: string | undefined;

before(async () => {
  dataDir = await mkdtemp(join(tmpdir(), "llm-iq-retention-"));
  previousDataDir = process.env[ENV_DATA_DIR];
  process.env[ENV_DATA_DIR] = dataDir;
});

after(async () => {
  if (previousDataDir === undefined) delete process.env[ENV_DATA_DIR];
  else process.env[ENV_DATA_DIR] = previousDataDir;
  await rm(dataDir, { recursive: true, force: true });
});

describe("retention guard 修剪守卫", () => {
  let runsDir: string;

  beforeEach(async () => {
    runsDir = join(dataDir, "runs");
    await rm(runsDir, { recursive: true, force: true });
    await mkdir(runsDir, { recursive: true });
    // 清除可能存在的 sync-state.json
    await rm(join(dataDir, "sync-state.json"), { force: true });
  });

  it("过期且 published 才删；未发布的保留并记日志；空目录删；仅过程文件保留", async () => {
    const expiredPublished = "20260801T000000Z";
    const expiredExported = "20260802T000000Z";
    const expiredUnrecorded = "20260803T000000Z";
    const expiredEmpty = "20260804T000000Z";
    const expiredProgressOnly = "20260805T000000Z";
    const keptRecent = "20260920T120000Z";
    const foreignDir = "manual-notes";

    // 创建各目录
    for (const name of [
      expiredPublished,
      expiredExported,
      expiredUnrecorded,
      expiredEmpty,
      expiredProgressOnly,
      keptRecent,
      foreignDir,
    ]) {
      await mkdir(join(runsDir, name), { recursive: true });
    }

    // 填充文件
    await writeFile(
      join(runsDir, expiredPublished, "run.json"),
      JSON.stringify({ runId: expiredPublished }),
    );
    await writeFile(
      join(runsDir, expiredExported, "run.json"),
      JSON.stringify({ runId: expiredExported }),
    );
    await writeFile(
      join(runsDir, expiredUnrecorded, "run.json"),
      JSON.stringify({ runId: expiredUnrecorded }),
    );
    // expiredEmpty 保持为空
    await writeFile(
      join(runsDir, expiredProgressOnly, "progress.json"),
      JSON.stringify({ inProgress: true }),
    );
    await writeFile(
      join(runsDir, keptRecent, "run.json"),
      JSON.stringify({ runId: keptRecent }),
    );

    // 设置台账
    const ledger: SyncLedger = {
      [expiredPublished]: {
        status: "published",
        exportedAt: "2026-08-01T00:01:00Z",
        publishedAt: "2026-08-01T00:02:00Z",
        redactions: [],
      },
      [expiredExported]: {
        status: "exported",
        exportedAt: "2026-08-02T00:01:00Z",
        redactions: [],
      },
    };
    await saveSyncLedger(ledger, dataDir);

    const logs: string[] = [];
    await pruneExpiredRuns(
      30,
      (msg) => logs.push(msg),
      new Date("2026-09-24T00:00:00Z"),
    );

    const remaining = await readdir(runsDir);
    // 应该被删除的：expiredPublished、expiredEmpty
    assert.ok(!remaining.includes(expiredPublished));
    assert.ok(!remaining.includes(expiredEmpty));

    // 应该被保留的：
    // - expiredExported（台账为 exported 未 published）
    // - expiredUnrecorded（不在台账中）
    // - expiredProgressOnly（只有 progress.json 没有 run.json）
    // - keptRecent（保留期内）
    // - foreignDir（非 runId）
    assert.ok(remaining.includes(expiredExported));
    assert.ok(remaining.includes(expiredUnrecorded));
    assert.ok(remaining.includes(expiredProgressOnly));
    assert.ok(remaining.includes(keptRecent));
    assert.ok(remaining.includes(foreignDir));

    // 校验汇总日志：
    // 2 个未发布的（expiredExported, expiredUnrecorded）
    // 2 个清理的（expiredPublished, expiredEmpty）
    assert.ok(logs.some((msg) => msg.includes("保留 2 个未发布的过期轮次")));
    assert.ok(logs.some((msg) => msg.includes("清理了 2 个过期轮次")));
  });

  it("台账读不到（文件不存在）时等价于全部未发布", async () => {
    const expired = "20260801T000000Z";
    await mkdir(join(runsDir, expired), { recursive: true });
    await writeFile(
      join(runsDir, expired, "run.json"),
      JSON.stringify({ runId: expired }),
    );

    const logs: string[] = [];
    await pruneExpiredRuns(
      30,
      (msg) => logs.push(msg),
      new Date("2026-09-24T00:00:00Z"),
    );

    const remaining = await readdir(runsDir);
    assert.ok(remaining.includes(expired));
    assert.ok(logs.some((msg) => msg.includes("保留 1 个未发布的过期轮次")));
  });
});

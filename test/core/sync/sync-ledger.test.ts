/**
 * 同步台账（sync-ledger）测试。
 */

import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  loadSyncLedger,
  saveSyncLedger,
  SYNC_LEDGER_FILE,
  type SyncLedger,
} from "@/core/sync/sync-ledger";

describe("sync-ledger 同步台账", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "llm-iq-ledger-"));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it("文件不存在时返回空对象（等价于全部未发布）", async () => {
    const ledger = await loadSyncLedger(tempDir);
    assert.deepEqual(ledger, {});
  });

  it("JSON 损坏或格式错误时抛错中止", async () => {
    // 1. JSON 损坏
    await writeFile(join(tempDir, SYNC_LEDGER_FILE), "{ broken json");
    await assert.rejects(
      () => loadSyncLedger(tempDir),
      /同步台账 .* JSON 损坏/,
    );

    // 2. 格式错误：不是对象（如数组）
    await writeFile(join(tempDir, SYNC_LEDGER_FILE), "[]");
    await assert.rejects(
      () => loadSyncLedger(tempDir),
      /同步台账 .* 格式错误，期望 JSON 对象/,
    );
  });

  it("原子写并能完整读取", async () => {
    const data: SyncLedger = {
      "20260927T021708Z": {
        status: "exported",
        exportedAt: "2026-09-27T02:18:00.000Z",
        commit: "abc1234",
        redactions: [{ file: "sample.svg", reason: "local-path" }],
      },
      "20260927T031708Z": {
        status: "published",
        exportedAt: "2026-09-27T03:18:00.000Z",
        publishedAt: "2026-09-27T03:19:00.000Z",
        commit: "def5678",
        redactions: [],
      },
    };

    await saveSyncLedger(data, tempDir);
    const loaded = await loadSyncLedger(tempDir);
    assert.deepEqual(loaded, data);

    const raw = await readFile(join(tempDir, SYNC_LEDGER_FILE), "utf8");
    assert.ok(raw.endsWith("\n"));
  });
});

/**
 * requests.ts 针对 sync-data 与 data-repo-status 请求类型的往返测试。
 */

import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import {
  claimNextRequest,
  completeRequest,
  enqueueRequest,
  failRequest,
  readRequest,
  waitForRequest,
} from "@/core/requests";
import type { SyncActionResult } from "@/core/sync/data-repo-panel-types";

describe("requests 同步请求与状态代答通道", () => {
  let tempDir: string;
  const originalDataDir = process.env.PELICAN_DATA_DIR;

  before(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "requests-sync-data-test-"));
    process.env.PELICAN_DATA_DIR = tempDir;
  });

  after(async () => {
    process.env.PELICAN_DATA_DIR = originalDataDir;
    await rm(tempDir, { recursive: true, force: true });
  });

  it("sync-data 请求：入队、认领并成功写回结果", async () => {
    const enqueued = await enqueueRequest("sync-data", {
      syncAction: { mode: "dry-run" },
    });
    assert.strictEqual(enqueued.kind, "sync-data");
    assert.strictEqual(enqueued.state, "pending");
    assert.strictEqual(enqueued.syncAction?.mode, "dry-run");

    const claimed = await claimNextRequest();
    assert.notStrictEqual(claimed, null);
    assert.strictEqual(claimed?.id, enqueued.id);
    assert.strictEqual(claimed?.state, "claimed");

    const mockResult: SyncActionResult = {
      mode: "dry-run",
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      ok: true,
      report: null,
      executedBy: "runner",
      error: null,
    };
    await completeRequest(claimed.id, { syncResult: mockResult });

    const settled = await waitForRequest(enqueued.id, 2000);
    assert.notStrictEqual(settled, null);
    assert.strictEqual(settled?.state, "done");
    assert.deepStrictEqual(settled?.result?.syncResult, mockResult);
  });

  it("data-repo-status 请求：入队、认领并写回代答状态", async () => {
    const enqueued = await enqueueRequest("data-repo-status");
    assert.strictEqual(enqueued.kind, "data-repo-status");

    const claimed = await claimNextRequest();
    assert.notStrictEqual(claimed, null);
    assert.strictEqual(claimed?.id, enqueued.id);

    const mockStatusResult = {
      repo: {
        path: "../llm-iq-data",
        reachable: true,
        isGitRepo: true,
        clean: true,
        branch: "main",
        upstream: "origin/main",
        ahead: 0,
        behind: 0,
        aheadCommits: [],
      },
      manifest: {
        totalRuns: 10,
        updatedAt: "2026-09-27T08:00:00Z",
        latestDay: "2026-09-27",
      },
    };
    await completeRequest(claimed.id, { statusResult: mockStatusResult });

    const settled = await readRequest(enqueued.id);
    assert.notStrictEqual(settled, null);
    assert.strictEqual(settled?.state, "done");
    assert.deepStrictEqual(settled?.result?.statusResult, mockStatusResult);
  });

  it("sync-data 请求失败：failRequest 记录错误原因", async () => {
    const enqueued = await enqueueRequest("sync-data", {
      syncAction: { mode: "export" },
    });
    const claimed = await claimNextRequest();
    assert.ok(claimed !== null);

    await failRequest(claimed.id, "执行器内部错误");

    const settled = await readRequest(enqueued.id);
    assert.strictEqual(settled?.state, "failed");
    assert.strictEqual(settled?.result?.error, "执行器内部错误");
  });
});

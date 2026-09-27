/** 看板与执行器之间的请求文件：写入、认领、完成、等待与清理 */

import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { before, describe, test } from "node:test";
import {
  claimNextRequest,
  completeRequest,
  enqueueRequest,
  failRequest,
  pruneRequests,
  readRequest,
  waitForRequest,
} from "@/core/requests";
import { heartbeatCovers, readFreshHeartbeat, writeHeartbeat } from "@/core/runner-link";

const NOW = new Date("2026-09-26T10:00:00Z");

before(async () => {
  process.env.PELICAN_DATA_DIR = await mkdtemp(join(tmpdir(), "requests-"));
});

describe("请求文件", () => {
  test("按请求时刻先后认领；完成后带结果，等待方能读到", async () => {
    const first = await enqueueRequest("check-readiness", null, NOW);
    const second = await enqueueRequest("run", { targetIds: ["a"], promptIds: ["classic-v1"] }, new Date(NOW.getTime() + 1000));
    const claimed = await claimNextRequest(NOW);
    assert.equal(claimed?.id, first.id);
    assert.equal(claimed?.state, "claimed");
    await completeRequest(first.id, {}, NOW);
    assert.equal((await readRequest(first.id))?.state, "done");

    const next = await claimNextRequest(NOW);
    assert.equal(next?.id, second.id);
    assert.deepEqual(next?.selection, { targetIds: ["a"], promptIds: ["classic-v1"] });
    setTimeout(() => void completeRequest(second.id, { runId: "r1", calls: 2 }), 300);
    const settled = await waitForRequest(second.id, 5000);
    assert.equal(settled?.state, "done");
    assert.deepEqual(settled?.result, { runId: "r1", calls: 2 });
    assert.equal(await claimNextRequest(NOW), null);
  });

  test("失败带原因；等待超时返回最后状态；清理只删处理完超过一小时的", async () => {
    const request = await enqueueRequest("probe-capabilities", null, NOW);
    assert.equal((await waitForRequest(request.id, 400))?.state, "pending");
    await claimNextRequest(NOW);
    await failRequest(request.id, "探测失败", NOW);
    assert.deepEqual((await readRequest(request.id))?.result, { error: "探测失败" });
    assert.equal(await pruneRequests(new Date(NOW.getTime() + 30 * 60 * 1000)), 0);
    assert.ok((await pruneRequests(new Date(NOW.getTime() + 2 * 60 * 60 * 1000))) >= 1);
    assert.equal(await readRequest(request.id), null);
  });
});

describe("执行器心跳", () => {
  test("新鲜的心跳覆盖同一 pid；过期或 pid 不同不覆盖", async () => {
    await writeHeartbeat(NOW, NOW);
    const fresh = await readFreshHeartbeat(new Date(NOW.getTime() + 10_000));
    assert.equal(fresh?.pid, process.pid);
    assert.equal(heartbeatCovers(fresh, process.pid, fresh?.pidStart ?? null), true);
    assert.equal(heartbeatCovers(fresh, process.pid + 1, null), false);
    assert.equal(await readFreshHeartbeat(new Date(NOW.getTime() + 60_000)), null);
    assert.equal(heartbeatCovers(null, process.pid, null), false);
  });
});

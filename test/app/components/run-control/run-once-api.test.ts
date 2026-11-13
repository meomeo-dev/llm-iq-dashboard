import assert from "node:assert/strict";
import test from "node:test";
import { postRun, submitRun } from "@/app/components/run-control/run-once-api";

test("等待发起确认超时时提示核对执行状态，且不自动重发", async (t) => {
  const fetchMock = t.mock.method(
    globalThis,
    "fetch",
    async (url: string, init: RequestInit) => {
      assert.equal(url, "/api/run");
      assert.equal(init.method, "POST");
      assert.ok(init.signal instanceof AbortSignal);
      assert.equal(new Headers(init.headers).get("x-pelican-action"), "1");
      assert.deepEqual(JSON.parse(String(init.body)), {
        targetIds: ["test-target"], promptIds: ["classic-v1"],
      });
      throw new DOMException("timed out", "TimeoutError");
    },
  );

  assert.deepEqual(await postRun(["test-target"], ["classic-v1"]), {
    error: "未收到发起确认，请先查看执行状态，再决定是否重新发起。",
  });
  assert.equal(fetchMock.mock.callCount(), 1);
});

test("配置页按已保存的配置发起，请求不带选择请求体", async (t) => {
  t.mock.method(globalThis, "fetch", async (_url: string, init: RequestInit) => {
    assert.equal(init.body, undefined);
    return Response.json({ runId: "sample-run", calls: 2 }, { status: 202 });
  });

  assert.deepEqual(await submitRun("en"), { runId: "sample-run", calls: 2 });
});

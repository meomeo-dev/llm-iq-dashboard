import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import type {
  DataRepoStatus,
  SyncActionResult,
} from "@/core/sync/data-repo-panel-types";
import {
  postRepoAction,
  requestRepoStatus,
  useDataRepoActions,
  type FetchFn,
  type UseDataRepoActionsReturn,
} from "@/app/config/use-data-repo-actions";

function setupDom() {
  const dom = new JSDOM("<!doctype html><html><body></body></html>");
  (globalThis as unknown as { window: unknown }).window = dom.window;
  (globalThis as unknown as { document: unknown }).document = dom.window.document;
  (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  return dom;
}

function createFakeStatus(): DataRepoStatus {
  return {
    configured: true,
    deploy: { readonly: false, externalRunner: false },
    repo: {
      path: "../llm-iq-data",
      reachable: true,
      isGitRepo: true,
      clean: true,
      branch: "main",
      upstream: "origin/main",
      ahead: 1,
      behind: 0,
      aheadCommits: ["c0ffee1"],
    },
    manifest: {
      totalRuns: 10,
      updatedAt: "2026-09-27T00:00:00Z",
      latestDay: "2026-09-27",
    },
    ledger: {
      exported: 11,
      published: 10,
      lastExportedAt: "2026-09-27T00:00:00Z",
      lastPublishedAt: "2026-09-26T00:00:00Z",
    },
    local: { totalRuns: 11, pending: [], incomplete: 0 },
    lastAction: null,
    notice: null,
  };
}

function createFakeActionResult(mode = "export"): SyncActionResult {
  return {
    mode: mode as SyncActionResult["mode"],
    startedAt: "2026-09-27T08:00:00Z",
    finishedAt: "2026-09-27T08:00:01Z",
    ok: true,
    report: {
      success: true,
      dryRun: false,
      totalCandidates: 1,
      exported: ["20260927T080000Z"],
      skipped: [],
      conflicts: [],
      rejected: [],
      redactions: [],
      ledgerTransitions: { exported: ["20260927T080000Z"], published: [] },
      commit: "c0ffee1",
      pushed: false,
    },
    executedBy: "web",
    error: null,
  };
}

test("requestRepoStatus & postRepoAction 请求函数覆盖", async (t) => {
  await t.test("requestRepoStatus 成功与异常路径", async () => {
    const fakeStatus = createFakeStatus();
    const okFetch: FetchFn = async () =>
      new Response(JSON.stringify(fakeStatus), { status: 200 });
    const okRes = await requestRepoStatus(okFetch);
    assert.deepStrictEqual(okRes.data, fakeStatus);
    assert.strictEqual(okRes.error, null);

    const failFetch: FetchFn = async () =>
      new Response(JSON.stringify({ error: "权限不足" }), { status: 403 });
    const failRes = await requestRepoStatus(failFetch);
    assert.strictEqual(failRes.data, null);
    assert.strictEqual(failRes.error, "权限不足");

    const throwFetch: FetchFn = async () => {
      throw new Error("网络断开");
    };
    const throwRes = await requestRepoStatus(throwFetch);
    assert.strictEqual(throwRes.data, null);
    assert.strictEqual(throwRes.error, "网络断开");
  });

  await t.test("postRepoAction 成功与错误响应", async () => {
    const actionResult = createFakeActionResult();
    const okFetch: FetchFn = async () =>
      new Response(JSON.stringify(actionResult), { status: 200 });
    const okRes = await postRepoAction(okFetch, "export");
    assert.deepStrictEqual(okRes.result, actionResult);
    assert.strictEqual(okRes.error, null);

    const conflictFetch: FetchFn = async () =>
      new Response(JSON.stringify({ error: "已有一项操作在运行" }), { status: 409 });
    const conflictRes = await postRepoAction(conflictFetch, "export");
    assert.strictEqual(conflictRes.result, null);
    assert.strictEqual(conflictRes.error, "已有一项操作在运行");
  });

  await t.test("postRepoAction：勾选的 runIds 随请求体发出，空清单不发", async () => {
    const bodies: string[] = [];
    const recordingFetch: FetchFn = async (_input, init) => {
      bodies.push(String(init?.body));
      return new Response(JSON.stringify(createFakeActionResult()), { status: 200 });
    };
    await postRepoAction(recordingFetch, "export", undefined, { runIds: ["20260929T150913Z"] });
    await postRepoAction(recordingFetch, "dry-run", undefined, { runIds: [] });
    await postRepoAction(recordingFetch, "export");
    assert.deepStrictEqual(JSON.parse(bodies[0]!), { mode: "export", runIds: ["20260929T150913Z"] });
    assert.equal("runIds" in JSON.parse(bodies[1]!), false);
    assert.equal("runIds" in JSON.parse(bodies[2]!), false);
    await postRepoAction(recordingFetch, "export", undefined, {
      runIds: ["20260929T150913Z"], attempts: { "20260929T150913Z": ["a@p"] },
    });
    await postRepoAction(recordingFetch, "export", undefined, { runIds: ["20260929T150913Z"], attempts: {} });
    assert.deepStrictEqual(JSON.parse(bodies[3]!).attempts, { "20260929T150913Z": ["a@p"] });
    assert.equal("attempts" in JSON.parse(bodies[4]!), false);
  });
});

test("useDataRepoActions Hook 生命周期与操作互斥测试", async (t) => {
  const dom = setupDom();

  await t.test("注入 fake fetch：自动加载与手动刷新", async () => {
    const container = dom.window.document.createElement("div");
    dom.window.document.body.appendChild(container);
    let hookState: UseDataRepoActionsReturn =
      undefined as unknown as UseDataRepoActionsReturn;
    const fakeStatus = createFakeStatus();

    const fakeFetch: FetchFn = async (url) => {
      if (String(url).includes("/api/data-repo")) {
        return new Response(JSON.stringify(fakeStatus), { status: 200 });
      }
      return new Response("{}", { status: 404 });
    };

    function TestComponent() {
      hookState = useDataRepoActions({ fetchFn: fakeFetch, autoLoad: true });
      return null;
    }

    const root = createRoot(container);
    await act(async () => {
      root.render(React.createElement(TestComponent));
    });

    assert.ok(hookState);
    assert.strictEqual(hookState.loading, false);
    assert.deepStrictEqual(hookState.status, fakeStatus);
    assert.strictEqual(hookState.error, null);

    await act(async () => {
      await hookState!.refresh();
    });
    assert.deepStrictEqual(hookState.status, fakeStatus);
    root.unmount();
  });

  await t.test("executeAction 动作互斥与状态更新", async () => {
    const container = dom.window.document.createElement("div");
    dom.window.document.body.appendChild(container);
    let hookState: UseDataRepoActionsReturn =
      undefined as unknown as UseDataRepoActionsReturn;
    const fakeStatus = createFakeStatus();
    const actionResult = createFakeActionResult("export");
    let syncCallCount = 0;

    const fakeFetch: FetchFn = async (url) => {
      const urlStr = String(url);
      if (urlStr.includes("/api/data-repo/sync")) {
        syncCallCount++;
        await new Promise((r) => setTimeout(r, 10));
        return new Response(JSON.stringify(actionResult), { status: 200 });
      }
      if (urlStr.includes("/api/data-repo")) {
        return new Response(JSON.stringify(fakeStatus), { status: 200 });
      }
      return new Response("{}", { status: 404 });
    };

    function TestComponent() {
      hookState = useDataRepoActions({
        fetchFn: fakeFetch,
        initialStatus: fakeStatus,
        autoLoad: false,
      });
      return null;
    }

    const root = createRoot(container);
    await act(async () => {
      root.render(React.createElement(TestComponent));
    });

    assert.ok(hookState);

    let res1: SyncActionResult | null = null;
    let res2: SyncActionResult | null = null;

    await act(async () => {
      const p1 = hookState!.executeAction("export");
      const p2 = hookState!.executeAction("push");
      [res1, res2] = await Promise.all([p1, p2]);
    });

    assert.deepStrictEqual(res1, actionResult);
    assert.strictEqual(res2, null);
    assert.strictEqual(syncCallCount, 1);
    assert.strictEqual(hookState!.inFlightMode, null);
    assert.deepStrictEqual(hookState!.actionResult, actionResult);

    root.unmount();
  });

  await t.test("executeAction 失败时记录错误并保留提示", async () => {
    const container = dom.window.document.createElement("div");
    dom.window.document.body.appendChild(container);
    let hookState: UseDataRepoActionsReturn =
      undefined as unknown as UseDataRepoActionsReturn;
    const fakeStatus = createFakeStatus();

    const fakeFetch: FetchFn = async (url) => {
      const urlStr = String(url);
      if (urlStr.includes("/api/data-repo/sync")) {
        return new Response(
          JSON.stringify({ error: "容器内无推送凭据，请在宿主机推送" }),
          { status: 409 },
        );
      }
      return new Response(JSON.stringify(fakeStatus), { status: 200 });
    };

    function TestComponent() {
      hookState = useDataRepoActions({
        fetchFn: fakeFetch,
        initialStatus: fakeStatus,
        autoLoad: false,
      });
      return null;
    }

    const root = createRoot(container);
    await act(async () => {
      root.render(React.createElement(TestComponent));
    });

    let result: SyncActionResult | null = null;
    await act(async () => {
      result = await hookState!.executeAction("push");
    });

    assert.strictEqual(result, null);
    assert.strictEqual(hookState!.error, "容器内无推送凭据，请在宿主机推送");

    act(() => {
      hookState!.dismissError();
    });
    assert.strictEqual(hookState!.error, null);

    root.unmount();
  });
});

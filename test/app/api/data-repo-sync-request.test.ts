/**
 * POST /api/data-repo/sync 请求体解析：模式枚举、push 的确认清单、勾选的 runIds、调用子集，
 * 以及丢弃与恢复必须点名轮次。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { parseSyncActionRequest } from "@/app/api/data-repo/sync/sync-request";

test("runIds：缺省不带；合法数组去重后原样带出；空数组与非 runId 形式拒绝", () => {
  assert.deepEqual(parseSyncActionRequest(JSON.stringify({ mode: "export" })), { mode: "export" });
  assert.deepEqual(
    parseSyncActionRequest(JSON.stringify({ mode: "dry-run", runIds: ["20260929T150913Z", "20260929T150913Z", "20260929T140327Z"] })),
    { mode: "dry-run", runIds: ["20260929T150913Z", "20260929T140327Z"] },
  );
  assert.throws(() => parseSyncActionRequest(JSON.stringify({ mode: "export", runIds: [] })), /非空的 runId 数组/);
  assert.throws(() => parseSyncActionRequest(JSON.stringify({ mode: "export", runIds: ["../etc"] })), /非法的 runId/);
  assert.throws(() => parseSyncActionRequest(JSON.stringify({ mode: "export", runIds: "20260929T150913Z" })), /非空的 runId 数组/);
});

test("模式与 push 确认：未知模式拒绝；push 缺确认拒绝；确认清单原样带出", () => {
  assert.throws(() => parseSyncActionRequest(JSON.stringify({ mode: "publish" })), /未知的同步模式/);
  assert.throws(() => parseSyncActionRequest(JSON.stringify({ mode: "push" })), /confirmation/);
  assert.deepEqual(
    parseSyncActionRequest(JSON.stringify({ mode: "push", confirmation: { aheadCommits: ["abc"] }, runIds: ["20260929T150913Z"] })),
    { mode: "push", runIds: ["20260929T150913Z"], confirmation: { aheadCommits: ["abc"] } },
  );
});

test("attempts：键须在 runIds 里、值为非空调用标识数组，去重后带出；缺省不带", () => {
  const runId = "20260929T150913Z";
  assert.deepEqual(
    parseSyncActionRequest(JSON.stringify({ mode: "export", runIds: [runId], attempts: { [runId]: ["a@p", "a@p", "b@p"] } })),
    { mode: "export", runIds: [runId], attempts: { [runId]: ["a@p", "b@p"] } },
  );
  assert.throws(
    () => parseSyncActionRequest(JSON.stringify({ mode: "export", attempts: { [runId]: ["a@p"] } })),
    /不在 runIds 中/,
  );
  assert.throws(
    () => parseSyncActionRequest(JSON.stringify({ mode: "export", runIds: [runId], attempts: { [runId]: [] } })),
    /非空的调用标识数组/,
  );
  assert.throws(
    () => parseSyncActionRequest(JSON.stringify({ mode: "export", runIds: [runId], attempts: [] })),
    /以 runId 为键/,
  );
});

test("discard 与 restore 必须点名轮次", () => {
  assert.throws(() => parseSyncActionRequest(JSON.stringify({ mode: "discard" })), /必须用 runIds 点名/);
  assert.deepEqual(
    parseSyncActionRequest(JSON.stringify({ mode: "restore", runIds: ["20260929T150913Z"] })),
    { mode: "restore", runIds: ["20260929T150913Z"] },
  );
});

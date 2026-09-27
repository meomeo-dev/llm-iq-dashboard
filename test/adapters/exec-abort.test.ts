/** signal 触发后立即终止整个进程组，不等超时上限；用 sleep 模拟长时间运行的 CLI */

import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { test } from "node:test";
import { execStreaming } from "@/adapters/exec";

const LONG_TIMEOUT_MS = 60_000;
const ABORT_AFTER_MS = 100;
/** sleep 收到 SIGTERM 即退出；此上限含余量，仍远小于超时上限 */
const STOP_BUDGET_MS = 3_000;

test("signal 触发后在超时之前终止子进程", async () => {
  const controller = new AbortController();
  const started = Date.now();
  setTimeout(() => controller.abort(), ABORT_AFTER_MS);

  const outcome = await execStreaming(
    { binary: "sleep", args: ["30"] },
    { cwd: tmpdir(), timeoutMs: LONG_TIMEOUT_MS, signal: controller.signal, onLine: () => {} },
  );

  assert.ok(Date.now() - started < STOP_BUDGET_MS, `用了 ${Date.now() - started}ms 才停下`);
  assert.equal(outcome.timedOut, false);
});

test("signal 已触发时刚启动就终止", async () => {
  const controller = new AbortController();
  controller.abort();
  const started = Date.now();

  await execStreaming(
    { binary: "sleep", args: ["30"] },
    { cwd: tmpdir(), timeoutMs: LONG_TIMEOUT_MS, signal: controller.signal, onLine: () => {} },
  );

  assert.ok(Date.now() - started < STOP_BUDGET_MS, `用了 ${Date.now() - started}ms 才停下`);
});

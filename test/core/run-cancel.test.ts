/**
 * 停止一轮执行：看板写入停止请求，执行方的监视器读到后触发 abort。
 * 测试在临时 PELICAN_DATA_DIR 下运行，不触及仓库的运行数据。
 */

import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { requestCancel, watchCancel } from "@/core/run-cancel";

const ENV_DATA_DIR = "PELICAN_DATA_DIR";
const RUN_ID = "20260925T054153Z";
const FAST_CHECK_MS = 20;
let dataDir: string;
let previousDataDir: string | undefined;

before(async () => {
  dataDir = await mkdtemp(join(tmpdir(), "llm-iq-run-cancel-"));
  previousDataDir = process.env[ENV_DATA_DIR];
  process.env[ENV_DATA_DIR] = dataDir;
});

after(async () => {
  if (previousDataDir === undefined) delete process.env[ENV_DATA_DIR];
  else process.env[ENV_DATA_DIR] = previousDataDir;
  await rm(dataDir, { recursive: true, force: true });
});

function abortedWithin(signal: AbortSignal, ms: number): Promise<boolean> {
  if (signal.aborted) return Promise.resolve(true);
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      resolve(true);
    });
  });
}

test("没有停止请求时不触发", async () => {
  const watch = watchCancel(RUN_ID, FAST_CHECK_MS);
  try {
    assert.equal(await abortedWithin(watch.signal, FAST_CHECK_MS * 5), false);
  } finally {
    watch.stop();
  }
});

test("写下停止请求后监视器触发 abort", async () => {
  const watch = watchCancel(RUN_ID, FAST_CHECK_MS);
  try {
    const request = await requestCancel(RUN_ID, new Date("2026-09-25T05:45:00Z"));
    assert.equal(request.requestedAt, "2026-09-25T05:45:00.000Z");
    assert.equal(await abortedWithin(watch.signal, 1_000), true);
  } finally {
    watch.stop();
  }
});

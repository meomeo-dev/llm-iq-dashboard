/**
 * 看板推送的监听范围：只放行会改变看板状态的文件。卡片产物与临时目录写入频繁、
 * 过旧轮次不再变化，均不监听。
 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { isWatchedPath } from "@/app/api/events/live-hub";

const OLDEST_WATCHED = "20260920T000000Z";
const RECENT_RUN = "20260925T040000Z";
const OLD_RUN = "20260101T000000Z";

describe("isWatchedPath", () => {
  test("放行顶层运行态文件与 runs 目录", () => {
    assert.equal(isWatchedPath("auto-run.json", OLDEST_WATCHED), true);
    assert.equal(isWatchedPath("scheduler.json", OLDEST_WATCHED), true);
    assert.equal(isWatchedPath("runs", OLDEST_WATCHED), true);
  });

  test("放行较新轮次目录与其中的 progress.json", () => {
    assert.equal(isWatchedPath(`runs/${RECENT_RUN}`, OLDEST_WATCHED), true);
    assert.equal(isWatchedPath(`runs/${RECENT_RUN}/progress.json`, OLDEST_WATCHED), true);
  });

  test("忽略卡片产物、临时目录与其它顶层文件", () => {
    assert.equal(isWatchedPath(`runs/${RECENT_RUN}/codex-a.svg`, OLDEST_WATCHED), false);
    assert.equal(isWatchedPath(`runs/${RECENT_RUN}/run.json`, OLDEST_WATCHED), false);
    assert.equal(isWatchedPath("scratch", OLDEST_WATCHED), false);
    assert.equal(isWatchedPath("variable-state.json", OLDEST_WATCHED), false);
  });

  test("忽略比监听下限更早的轮次", () => {
    assert.equal(isWatchedPath(`runs/${OLD_RUN}`, OLDEST_WATCHED), false);
    assert.equal(isWatchedPath(`runs/${OLD_RUN}/progress.json`, OLDEST_WATCHED), false);
  });

  test("监听下限为空（尚无轮次）时放行新建轮次", () => {
    assert.equal(isWatchedPath(`runs/${OLD_RUN}/progress.json`, ""), true);
  });
});

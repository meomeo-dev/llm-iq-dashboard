/**
 * 定时轮次的排队：到点时有轮次在跑就排队、空下来立即开跑；队列只容一轮；
 * 排队期间开关关掉即作废；进程内自己的上一轮没收尾同样排队。全部用注入的依赖，不碰文件与 CLI。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import type { PendingScheduledRun } from "@/core/auto-run";
import type { AppConfig } from "@/core/config";
import { startScheduler, type SchedulerDeps } from "@/core/scheduler";

const CHECK_MS = 10;
const POLL_MS = 10;
const config = { schedule: { cron: null, intervalMinutes: null, timezone: null, runOnStart: true }, run: { promptIds: [] }, targets: [], profiles: [] } as unknown as AppConfig;

function settle(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface Harness {
  deps: SchedulerDeps;
  active: { runId: string } | null;
  enabled: boolean;
  executed: number;
  pendingWrites: Array<PendingScheduledRun | null>;
  logs: string[];
  /** 当前正在跑的 execute 的放行函数 */
  release: (() => void) | null;
}

function harness(): Harness {
  const h: Harness = {
    active: null, enabled: true, executed: 0, pendingWrites: [], logs: [], release: null,
    deps: {
      activeRun: async () => h.active,
      autoRunEnabled: async () => h.enabled,
      execute: () => new Promise<void>((resolve) => {
        h.executed += 1;
        h.release = resolve;
      }),
      setPending: async (pending) => { h.pendingWrites.push(pending); },
      pollMs: POLL_MS,
    },
  };
  return h;
}

// runOnStart: true 让 startScheduler 立刻 tick 一次，省得等 cron
test("到点时别的轮次在跑：排队并记下在等谁，它结束后立即开跑", async () => {
  const h = harness();
  h.active = { runId: "20261002T130000Z" };
  const handle = startScheduler(() => config, (m) => h.logs.push(m), CHECK_MS, h.deps);
  try {
    await settle(POLL_MS * 2);
    assert.equal(h.executed, 0);
    assert.equal(h.pendingWrites[0]?.waitingFor, "20261002T130000Z");
    assert.ok(h.logs.some((m) => m.includes("排队等它结束")));

    h.active = null;
    await settle(POLL_MS * 4);
    assert.equal(h.executed, 1, "空下来就开跑");
    assert.equal(h.pendingWrites.at(-1), null, "开跑前清掉排队状态");
    h.release?.();
  } finally {
    handle.stop();
  }
});

test("排队期间关掉开关：排队作废，不再开跑", async () => {
  const h = harness();
  h.active = { runId: "20261002T130000Z" };
  const handle = startScheduler(() => config, (m) => h.logs.push(m), CHECK_MS, h.deps);
  try {
    await settle(POLL_MS * 2);
    h.enabled = false;
    h.active = null;
    await settle(POLL_MS * 4);
    assert.equal(h.executed, 0);
    assert.equal(h.pendingWrites.at(-1), null);
    assert.ok(h.logs.some((m) => m.includes("排队的定时轮次作废")));
  } finally {
    handle.stop();
  }
});

test("没有阻挡时直接开跑；开关关闭时跳过且不排队", async () => {
  const h = harness();
  const handle = startScheduler(() => config, (m) => h.logs.push(m), CHECK_MS, h.deps);
  try {
    await settle(POLL_MS);
    assert.equal(h.executed, 1);
    assert.deepEqual(h.pendingWrites, []);
    h.release?.();
  } finally {
    handle.stop();
  }
  const off = harness();
  off.enabled = false;
  const handle2 = startScheduler(() => config, (m) => off.logs.push(m), CHECK_MS, off.deps);
  try {
    await settle(POLL_MS);
    assert.equal(off.executed, 0);
    assert.deepEqual(off.pendingWrites, []);
    assert.ok(off.logs.some((m) => m.includes("跳过本次触发")));
  } finally {
    handle2.stop();
  }
});

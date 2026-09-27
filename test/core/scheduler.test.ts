/**
 * 调度器随配置热更新节奏：改 cron、从不定时改为定时都无需重启；
 * 重读失败时沿用已生效的节奏，同一错误只记一次。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import type { AppConfig, ScheduleConfig } from "@/core/config";
import { startScheduler } from "@/core/scheduler";

const CHECK_MS = 10;
const NONE: ScheduleConfig = { cron: null, intervalMinutes: null, timezone: null, runOnStart: false };

function configWith(schedule: ScheduleConfig): AppConfig {
  return { schedule } as AppConfig;
}

function settle(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("不定时启动后补上 cron，调度器自行接上，无需重启", async () => {
  let current = configWith(NONE);
  const logs: string[] = [];
  const handle = startScheduler(() => current, (message) => logs.push(message), CHECK_MS);
  try {
    assert.equal(handle.nextRun(), null);
    assert.ok(logs.some((message) => message.includes("没有定时节奏")));

    current = configWith({ ...NONE, cron: "0 9 * * *", timezone: "UTC" });
    await settle(CHECK_MS * 5);
    assert.equal(handle.nextRun()?.getUTCHours(), 9);
    assert.ok(logs.some((message) => message.includes("重建定时器")));
  } finally {
    handle.stop();
  }
});

test("改 cron 后下一次触发随之改变；节奏没变时不重建", async () => {
  let current = configWith({ ...NONE, cron: "0 9 * * *", timezone: "UTC" });
  const logs: string[] = [];
  const handle = startScheduler(() => current, (message) => logs.push(message), CHECK_MS);
  try {
    await settle(CHECK_MS * 5);
    assert.equal(logs.filter((message) => message.includes("重建定时器")).length, 0);

    current = configWith({ ...NONE, cron: "30 21 * * *", timezone: "UTC" });
    await settle(CHECK_MS * 5);
    const next = handle.nextRun();
    assert.deepEqual([next?.getUTCHours(), next?.getUTCMinutes()], [21, 30]);
    assert.equal(logs.filter((message) => message.includes("重建定时器")).length, 1);
  } finally {
    handle.stop();
  }
});

test("重读配置失败时沿用当前节奏，同一错误只记一次", async () => {
  let broken = false;
  const good = configWith({ ...NONE, cron: "0 9 * * *", timezone: "UTC" });
  const logs: string[] = [];
  const handle = startScheduler(
    () => {
      if (broken) throw new Error("配置写坏了");
      return good;
    },
    (message) => logs.push(message),
    CHECK_MS,
  );
  try {
    broken = true;
    await settle(CHECK_MS * 6);
    assert.equal(handle.nextRun()?.getUTCHours(), 9);
    assert.equal(logs.filter((message) => message.includes("配置写坏了")).length, 1);
  } finally {
    handle.stop();
  }
});

test("启动时读不到配置直接抛错", () => {
  assert.throws(
    () =>
      startScheduler(
        () => {
          throw new Error("缺少配置文件");
        },
        () => {},
        CHECK_MS,
      ),
    /缺少配置文件/,
  );
});

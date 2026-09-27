import test from "node:test";
import assert from "node:assert/strict";
import {
  getScheduleMode,
  switchScheduleMode,
  resolveTimeZone,
  getScheduleNotice,
  type ScheduleDraft,
} from "@/app/config/schedule-form-model";

test("schedule-form-model: getScheduleMode", async (t) => {
  await t.test("cron mode when cron is not null", () => {
    const draft: ScheduleDraft = {
      cron: "0 */6 * * *",
      intervalMinutes: null,
      timezone: null,
      runOnStart: false,
    };
    assert.strictEqual(getScheduleMode(draft), "cron");
  });

  await t.test("interval mode when cron is null and interval is set", () => {
    const draft: ScheduleDraft = {
      cron: null,
      intervalMinutes: 120,
      timezone: null,
      runOnStart: false,
    };
    assert.strictEqual(getScheduleMode(draft), "interval");
  });

  await t.test("none mode when both are null", () => {
    const draft: ScheduleDraft = {
      cron: null,
      intervalMinutes: null,
      timezone: null,
      runOnStart: false,
    };
    assert.strictEqual(getScheduleMode(draft), "none");
  });
});

test("schedule-form-model: switchScheduleMode", async (t) => {
  await t.test("switch to none resets cron, interval, and runOnStart", () => {
    const initial: ScheduleDraft = {
      cron: "0 9 * * *",
      intervalMinutes: null,
      timezone: "UTC",
      runOnStart: true,
    };
    const next = switchScheduleMode(initial, "none");
    assert.strictEqual(next.cron, null);
    assert.strictEqual(next.intervalMinutes, null);
    assert.strictEqual(next.runOnStart, false);
    assert.strictEqual(next.timezone, "UTC");
  });

  await t.test("switch to cron sets default cron if none existed and clears interval", () => {
    const initial: ScheduleDraft = {
      cron: null,
      intervalMinutes: 60,
      timezone: null,
      runOnStart: false,
    };
    const next = switchScheduleMode(initial, "cron");
    assert.strictEqual(next.cron, "0 */6 * * *");
    assert.strictEqual(next.intervalMinutes, null);
  });

  await t.test("switch to cron preserves existing cron if present", () => {
    const initial: ScheduleDraft = {
      cron: "*/15 * * * *",
      intervalMinutes: null,
      timezone: null,
      runOnStart: true,
    };
    const next = switchScheduleMode(initial, "cron");
    assert.strictEqual(next.cron, "*/15 * * * *");
    assert.strictEqual(next.intervalMinutes, null);
  });

  await t.test("switch to interval sets default 360 if none existed and clears cron", () => {
    const initial: ScheduleDraft = {
      cron: "0 0 * * *",
      intervalMinutes: null,
      timezone: null,
      runOnStart: true,
    };
    const next = switchScheduleMode(initial, "interval");
    assert.strictEqual(next.cron, null);
    assert.strictEqual(next.intervalMinutes, 360);
  });

  await t.test("switch to interval preserves existing interval if present", () => {
    const initial: ScheduleDraft = {
      cron: null,
      intervalMinutes: 180,
      timezone: null,
      runOnStart: true,
    };
    const next = switchScheduleMode(initial, "interval");
    assert.strictEqual(next.cron, null);
    assert.strictEqual(next.intervalMinutes, 180);
  });
});

test("schedule-form-model: resolveTimeZone", async (t) => {
  await t.test("returns given timezone if not null", () => {
    assert.strictEqual(resolveTimeZone("America/New_York"), "America/New_York");
  });

  await t.test("falls back when timezone is null", () => {
    const resolved = resolveTimeZone(null);
    assert.strictEqual(typeof resolved, "string");
    assert.ok(resolved.length > 0);
  });
});

test("schedule-form-model: getScheduleNotice", async (t) => {
  await t.test("warn notice when scheduled but master disabled", () => {
    const notice = getScheduleNotice(true, false, null, "UTC");
    assert.strictEqual(notice.kind, "warn");
    assert.strictEqual(notice.showActivateButton, true);
    assert.match(notice.message, /已暂停/);
  });

  await t.test("ok notice when scheduled and master enabled with next run time", () => {
    const notice = getScheduleNotice(
      true,
      true,
      {
        enabled: true,
        schedulerPid: 1234,
        nextRunAt: "2026-09-27T12:00:00.000Z",
        updatedAt: "2026-09-27T00:00:00.000Z",
        schedule: { cron: null, intervalMinutes: null, timezone: null },
      },
      "UTC"
    );
    assert.strictEqual(notice.kind, "ok");
    assert.strictEqual(notice.showActivateButton, false);
    assert.match(notice.message, /正常运行中/);
  });

  await t.test("ok notice when scheduled and master enabled without next run time", () => {
    const notice = getScheduleNotice(
      true,
      true,
      {
        enabled: true,
        schedulerPid: 1234,
        nextRunAt: null,
        updatedAt: "2026-09-27T00:00:00.000Z",
        schedule: { cron: null, intervalMinutes: null, timezone: null },
      },
      "UTC"
    );
    assert.strictEqual(notice.kind, "ok");
    assert.match(notice.message, /按设定间隔自动发起评测/);
  });

  await t.test("muted notice when not scheduled", () => {
    const notice = getScheduleNotice(false, true, null, "UTC");
    assert.strictEqual(notice.kind, "muted");
    assert.strictEqual(notice.showActivateButton, false);
    assert.match(notice.message, /不定时/);
  });
});

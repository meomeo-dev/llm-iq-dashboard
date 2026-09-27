import test from "node:test";
import assert from "node:assert/strict";
import { formatDeviceTime } from "@/app/config/device-panel-model";

test("device-panel-model: formatDeviceTime", async (t) => {
  await t.test("formats ISO timestamp to date and minute", () => {
    assert.strictEqual(formatDeviceTime("2026-09-27T12:34:56.789Z"), "2026-09-27 12:34");
  });

  await t.test("handles standard ISO date string", () => {
    assert.strictEqual(formatDeviceTime("2024-01-01T00:00:00Z"), "2024-01-01 00:00");
  });
});

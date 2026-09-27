import test from "node:test";
import assert from "node:assert/strict";
import {
  updateCliTimeout,
  updateEffortTimeout,
  applyRecommendedPresets,
  formatSeconds,
  type RunDraft,
} from "@/app/config/timeout-form-model";

test("timeout-form-model: updateCliTimeout", async (t) => {
  const initial: RunDraft = {
    promptIds: ["p1"],
    concurrency: 2,
    defaultTimeoutMs: 600000,
    timeoutByCli: { codex: 300000, claude: 900000 },
  };

  await t.test("updates existing cli timeout in ms", () => {
    const next = updateCliTimeout(initial, "codex", 450);
    assert.strictEqual(next.timeoutByCli.codex, 450000);
    assert.strictEqual(next.timeoutByCli.claude, 900000);
  });

  await t.test("adds new cli timeout", () => {
    const next = updateCliTimeout(initial, "agy", 120);
    assert.strictEqual(next.timeoutByCli.agy, 120000);
  });

  await t.test("deletes cli key when seconds is null", () => {
    const next = updateCliTimeout(initial, "codex", null);
    assert.strictEqual("codex" in next.timeoutByCli, false);
    assert.strictEqual(next.timeoutByCli.claude, 900000);
  });
});

test("timeout-form-model: updateEffortTimeout", async (t) => {
  const initial: RunDraft = {
    promptIds: ["p1"],
    concurrency: 2,
    defaultTimeoutMs: 600000,
    timeoutByCli: {},
    timeoutByEffort: { low: 300000 },
  };

  await t.test("sets effort timeout in ms", () => {
    const next = updateEffortTimeout(initial, "high", 800);
    assert.strictEqual(next.timeoutByEffort?.high, 800000);
    assert.strictEqual(next.timeoutByEffort?.low, 300000);
  });

  await t.test("deletes effort key when seconds is null", () => {
    const next = updateEffortTimeout(initial, "low", null);
    assert.strictEqual("low" in (next.timeoutByEffort ?? {}), false);
  });
});

test("timeout-form-model: applyRecommendedPresets", async (t) => {
  const initial: RunDraft = {
    promptIds: ["p1"],
    concurrency: 1,
    defaultTimeoutMs: 600000,
    timeoutByCli: {},
    timeoutByEffort: {},
  };

  const next = applyRecommendedPresets(initial);
  assert.strictEqual(next.defaultTimeoutMs, 1800000);
  assert.strictEqual(next.timeoutByEffort?.low, 600000);
  assert.strictEqual(next.timeoutByEffort?.medium, 600000);
  assert.strictEqual(next.timeoutByEffort?.high, 600000);
  assert.strictEqual(next.timeoutByEffort?.xhigh, 1800000);
  assert.strictEqual(next.timeoutByEffort?.max, 1800000);
  assert.strictEqual(next.timeoutByEffort?.ultra, 1800000);
});

test("timeout-form-model: formatSeconds", async (t) => {
  await t.test("returns empty string when undefined", () => {
    assert.strictEqual(formatSeconds(undefined), "");
  });

  await t.test("rounds ms to seconds", () => {
    assert.strictEqual(formatSeconds(600000), 600);
    assert.strictEqual(formatSeconds(1500), 2);
  });
});

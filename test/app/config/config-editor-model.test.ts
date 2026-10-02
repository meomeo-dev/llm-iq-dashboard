import test from "node:test";
import assert from "node:assert/strict";
import {
  describeError,
  buildConfigPatchBody,
  type EditableConfig,
} from "@/app/config/config-editor-model";

test("config-editor-model: describeError", async (t) => {
  await t.test("extracts message from Error instance", () => {
    assert.strictEqual(describeError(new Error("network failure")), "network failure");
  });

  await t.test("converts non-Error cause to string", () => {
    assert.strictEqual(describeError("something went wrong"), "something went wrong");
    assert.strictEqual(describeError(404), "404");
  });
});

test("config-editor-model: buildConfigPatchBody", async (t) => {
  const draft: EditableConfig = {
    schedule: {
      cron: "0 */6 * * *",
      intervalMinutes: null,
      timezone: "UTC",
      runOnStart: false,
    },
    run: {
      promptIds: ["p1"],
      concurrency: 2,
      defaultTimeoutMs: 600000,
      timeoutByCli: {},
      rotation: { period: "day", timeZone: "UTC" },
      harnessGuard: { enabled: false, text: "" },
    },
    upstreamTypes: ["compatible"],
    profiles: [],
    targets: [],
    customPrompts: [],
    customModels: { claude: ["m1"] },
    judge: { enabled: false, ai: { enabled: false, judges: [], timeoutMs: 300000, concurrency: 5 } },
  };

  const json = buildConfigPatchBody(draft);
  const parsed = JSON.parse(json);
  assert.deepStrictEqual(parsed.schedule, draft.schedule);
  assert.deepStrictEqual(parsed.run, draft.run);
  assert.deepStrictEqual(parsed.targets, draft.targets);
  assert.deepStrictEqual(parsed.upstreamTypes, draft.upstreamTypes);
  assert.deepStrictEqual(parsed.profiles, draft.profiles);
  assert.deepStrictEqual(parsed.prompts, draft.customPrompts);
  assert.deepStrictEqual(parsed.customModels, draft.customModels);
});

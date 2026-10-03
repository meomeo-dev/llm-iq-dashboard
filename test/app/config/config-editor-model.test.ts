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
    dataRepo: { path: " ../llm-iq-data ", repository: "  ", autoSync: true, push: false },
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
  // 地址留空写成 null（写回时删键），路径去掉首尾空白
  assert.deepStrictEqual(parsed.dataRepo, { path: "../llm-iq-data", repository: null, autoSync: true, push: false });

  await t.test("不启用数据仓时补丁体里 dataRepo 为 null，写回删整段", () => {
    const parsed = JSON.parse(buildConfigPatchBody({ ...draft, dataRepo: null }));
    assert.strictEqual(parsed.dataRepo, null);
  });
  await t.test("填了地址时原样带上", () => {
    const parsed = JSON.parse(buildConfigPatchBody({
      ...draft, dataRepo: { path: "/data-repo", repository: "https://github.com/acme/pelican-data ", autoSync: false, push: false },
    }));
    assert.strictEqual(parsed.dataRepo.repository, "https://github.com/acme/pelican-data");
  });
});

import test from "node:test";
import assert from "node:assert/strict";
import {
  findCapability,
  mergeModelChoices,
  effortChoices,
  firstModelId,
  withIdentity,
  createDefaultTarget,
  updateTargetList,
  removeTargetFromList,
  appendCustomModel,
} from "@/app/config/target-table-model";
import type { CapabilitySnapshot } from "@/capabilities/types";
import type { Target } from "@/core/types";

const mockCatalog: CapabilitySnapshot = {
  schemaVersion: 1,
  probedAt: "2026-09-27T00:00:00.000Z",
  clis: [
    {
      cli: "claude",
      available: true,
      models: [
        {
          id: "claude-3-opus",
          displayName: "Claude 3 Opus",
          cli: "claude",
          sources: ["probe"],
          efforts: ["high", "medium"],
          description: null,
        },
      ],
      efforts: ["high", "medium", "low"],
      notes: [],
    },
    {
      cli: "agy",
      available: true,
      models: [
        {
          id: "gemini-2.5",
          displayName: "Gemini 2.5",
          cli: "agy",
          sources: ["probe"],
          efforts: [],
          description: null,
        },
      ],
      efforts: [],
      notes: [],
    },
  ],
};

test("target-table-model: findCapability & firstModelId", async (t) => {
  await t.test("finds capability by cli", () => {
    const cap = findCapability(mockCatalog, "claude");
    assert.strictEqual(cap?.cli, "claude");
    assert.strictEqual(cap?.models.length, 1);
  });

  await t.test("returns first model id for cli", () => {
    assert.strictEqual(firstModelId(mockCatalog, "claude"), "claude-3-opus");
  });

  await t.test("returns empty string if cli not found", () => {
    assert.strictEqual(firstModelId(mockCatalog, "codex"), "");
  });
});

test("target-table-model: mergeModelChoices", async (t) => {
  const cap = findCapability(mockCatalog, "claude");

  await t.test("merges custom models and current model with capability models without duplicates", () => {
    const choices = mergeModelChoices(cap, ["custom-model-1", "claude-3-opus"], "custom-model-2");
    const ids = choices.map((c) => c.id);
    assert.deepStrictEqual(ids, ["claude-3-opus", "custom-model-1", "custom-model-2"]);
    assert.strictEqual(choices[1]?.sources[0], "custom");
  });

  await t.test("handles undefined capability", () => {
    const choices = mergeModelChoices(undefined, ["custom-1"], "current-1");
    assert.deepStrictEqual(choices.map((c) => c.id), ["custom-1", "current-1"]);
  });
});

test("target-table-model: effortChoices", async (t) => {
  const claudeCap = findCapability(mockCatalog, "claude");
  const agyCap = findCapability(mockCatalog, "agy");

  await t.test("uses model specific efforts if defined", () => {
    const efforts = effortChoices(claudeCap, "claude-3-opus");
    assert.deepStrictEqual(efforts, ["medium", "high"]);
  });

  await t.test("returns empty array when model efforts are empty array", () => {
    const efforts = effortChoices(agyCap, "gemini-2.5");
    assert.deepStrictEqual(efforts, []);
  });

  await t.test("falls back to cli efforts if model not found", () => {
    const efforts = effortChoices(claudeCap, "unknown-model");
    assert.deepStrictEqual(efforts, ["low", "medium", "high"]);
  });

  await t.test("falls back to all effort levels if capability efforts undefined", () => {
    const efforts = effortChoices(undefined, "unknown-model");
    assert.ok(efforts.length > 0);
  });
});

test("target-table-model: withIdentity & createDefaultTarget", async (t) => {
  const target: Target = {
    id: "old-id",
    cli: "claude",
    model: "claude-3-opus",
    effort: "high",
    label: "My Target",
    timeoutMs: 900000,
    extraArgs: [],
    enabled: true,
  };
  const updated = withIdentity(target);
  assert.strictEqual(updated.id, "claude__claude-3-opus__high");

  const def = createDefaultTarget(mockCatalog);
  assert.strictEqual(def.cli, "claude");
  assert.strictEqual(def.model, "claude-3-opus");
  assert.strictEqual(def.id, "claude__claude-3-opus__medium");
});

test("target-table-model: target list operations", async (t) => {
  const t1: Target = {
    id: "claude__m1__high",
    cli: "claude",
    model: "m1",
    effort: "high",
    label: "T1",
    timeoutMs: 900000,
    extraArgs: [],
    enabled: true,
  };
  const t2: Target = { ...t1, id: "claude__m2__medium", model: "m2", effort: "medium" };

  await t.test("updateTargetList recomputes id on change", () => {
    const updated = updateTargetList([t1, t2], 0, { effort: "low" });
    assert.strictEqual(updated[0]?.effort, "low");
    assert.strictEqual(updated[0]?.id, "claude__m1__low");
  });

  await t.test("removeTargetFromList", () => {
    const removed = removeTargetFromList([t1, t2], 0);
    assert.strictEqual(removed.length, 1);
    assert.strictEqual(removed[0]?.id, t2.id);
  });
});

test("target-table-model: appendCustomModel", async (t) => {
  await t.test("adds new model if not blank and not duplicate", () => {
    const res = appendCustomModel({ claude: ["existing"] }, "claude", "new-model");
    assert.strictEqual(res.added, true);
    assert.deepStrictEqual(res.next.claude, ["existing", "new-model"]);
  });

  await t.test("ignores blank string", () => {
    const res = appendCustomModel({}, "claude", "   ");
    assert.strictEqual(res.added, false);
  });

  await t.test("ignores duplicate model", () => {
    const res = appendCustomModel({ claude: ["existing"] }, "claude", "existing");
    assert.strictEqual(res.added, false);
  });
});

import test from "node:test";
import assert from "node:assert/strict";
import {
  uniquePromptId,
  togglePromptId,
  createCustomPrompt,
  updateCustomPromptAtIndex,
  removeCustomPromptAtIndex,
  updateVariableAtIndex,
  removeVariableAtIndex,
  createEmptyVariable,
  parseVariableValues,
} from "@/app/config/prompt-picker-model";
import type { PromptSpec } from "@/core/prompt";

test("prompt-picker-model: uniquePromptId", async (t) => {
  await t.test("generates custom-1 if none taken", () => {
    assert.strictEqual(uniquePromptId([]), "custom-1");
  });

  await t.test("skips already taken ids", () => {
    assert.strictEqual(uniquePromptId(["custom-1", "custom-2"]), "custom-3");
  });
});

test("prompt-picker-model: togglePromptId", async (t) => {
  await t.test("adds id if not in enabled", () => {
    const res = togglePromptId(["p1"], "p2");
    assert.deepStrictEqual(res, ["p1", "p2"]);
  });

  await t.test("removes id if in enabled and more than 1 item", () => {
    const res = togglePromptId(["p1", "p2"], "p1");
    assert.deepStrictEqual(res, ["p2"]);
  });

  await t.test("does not remove id if it is the only one enabled", () => {
    const res = togglePromptId(["p1"], "p1");
    assert.deepStrictEqual(res, ["p1"]);
  });
});

test("prompt-picker-model: createCustomPrompt", async (t) => {
  const prompt = createCustomPrompt(["custom-1"]);
  assert.strictEqual(prompt.id, "custom-2");
  assert.strictEqual(prompt.label, "自定义提示词");
  assert.strictEqual(prompt.immutable, false);
  assert.strictEqual(prompt.variables.length, 1);
});

test("prompt-picker-model: update and remove custom prompts", async (t) => {
  const p1: PromptSpec = {
    id: "p1",
    label: "Prompt 1",
    template: "T1",
    variables: [],
    candidates: [],
    source: null,
    verified: false,
    immutable: false,
  };
  const p2: PromptSpec = { ...p1, id: "p2", label: "Prompt 2" };

  await t.test("updateCustomPromptAtIndex", () => {
    const updated = updateCustomPromptAtIndex([p1, p2], 0, { ...p1, label: "Updated P1" });
    assert.strictEqual(updated[0]?.label, "Updated P1");
    assert.strictEqual(updated[1]?.label, "Prompt 2");
  });

  await t.test("removeCustomPromptAtIndex", () => {
    const removed = removeCustomPromptAtIndex([p1, p2], 0);
    assert.strictEqual(removed.length, 1);
    assert.strictEqual(removed[0]?.id, "p2");
  });
});

test("prompt-picker-model: variable operations", async (t) => {
  const v1 = { name: "v1", mode: "sequence" as const, values: ["a", "b"] };
  const v2 = { name: "v2", mode: "random" as const, values: ["c"] };

  await t.test("updateVariableAtIndex", () => {
    const updated = updateVariableAtIndex([v1, v2], 1, { ...v2, name: "v2-updated" });
    assert.strictEqual(updated[1]?.name, "v2-updated");
  });

  await t.test("removeVariableAtIndex", () => {
    const removed = removeVariableAtIndex([v1, v2], 0);
    assert.strictEqual(removed.length, 1);
    assert.strictEqual(removed[0]?.name, "v2");
  });

  await t.test("createEmptyVariable", () => {
    const empty = createEmptyVariable();
    assert.strictEqual(empty.name, "");
    assert.strictEqual(empty.mode, "sequence");
    assert.deepStrictEqual(empty.values, []);
  });

  await t.test("parseVariableValues splits by comma and trims", () => {
    const parsed = parseVariableValues("  pelican , capybara ,  , cat  ");
    assert.deepStrictEqual(parsed, ["pelican", "capybara", "cat"]);
  });
});

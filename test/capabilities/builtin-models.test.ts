/**
 * 内置候选模型：三家 CLI 各有清单；档位都在合法强度内、id 不重复。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { builtinModels } from "@/capabilities/builtin-models";
import { EFFORT_LEVELS } from "@/core/types";

test("三家 CLI 都带当前模型", () => {
  assert.ok(builtinModels("claude").some((model) => model.id === "claude-sonnet-5-5"));
  const codex = builtinModels("codex").map((model) => model.id);
  for (const id of ["gpt-6.1-sol", "gpt-6-sol", "gpt-6-astra", "gpt-6-luna"]) assert.ok(codex.includes(id), id);
  const agy = builtinModels("agy").map((model) => model.id);
  for (const id of ["gemini-3.8-flash", "gemini-3.1-pro", "claude-sonnet-4-6"]) assert.ok(agy.includes(id), id);
});

test("内置档位只用合法强度，id 在各自 CLI 内唯一", () => {
  for (const cli of ["claude", "codex", "agy"] as const) {
    const models = builtinModels(cli);
    assert.equal(new Set(models.map((model) => model.id)).size, models.length);
    for (const model of models) {
      // 空数组表示不可调强度，但不能是 null：内置清单要替缺席的探测给出确定档位
      assert.ok(Array.isArray(model.efforts), model.id);
      for (const effort of model.efforts ?? []) assert.ok(EFFORT_LEVELS.includes(effort), `${model.id} ${effort}`);
    }
  }
  const luna = builtinModels("codex").find((model) => model.id === "gpt-6-luna");
  assert.equal(luna?.efforts?.includes("ultra"), false);
});

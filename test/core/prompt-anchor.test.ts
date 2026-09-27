/**
 * 必测矩阵 #1：锚点提示词逐字不变。改一个字就作废全部历史结果，且看板上看不出来。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { CLASSIC_PROMPT, UPGRADED_PROMPT } from "@/core/prompt";

test("classic-v1 与 Simon Willison 原文逐字相等且不可变", () => {
  assert.equal(CLASSIC_PROMPT.id, "classic-v1");
  assert.equal(CLASSIC_PROMPT.template, "Generate an SVG of a pelican riding a bicycle");
  assert.equal(CLASSIC_PROMPT.immutable, true);
  assert.deepEqual(CLASSIC_PROMPT.variables, []);
  assert.deepEqual(CLASSIC_PROMPT.candidates, []);
});

test("upgraded-v2 与作者 2025-11-18 博文原文逐字相等且不可变", () => {
  assert.equal(UPGRADED_PROMPT.id, "upgraded-v2");
  assert.equal(
    UPGRADED_PROMPT.template,
    "Generate an SVG of a California brown pelican riding a bicycle. " +
      "The bicycle must have spokes and a correctly shaped bicycle frame. " +
      "The pelican must have its characteristic large pouch, and there should be a clear indication of feathers. " +
      "The pelican must be clearly pedaling the bicycle. " +
      "The image should show the full breeding plumage of the California brown pelican.",
  );
  assert.equal(UPGRADED_PROMPT.verified, true);
  assert.equal(UPGRADED_PROMPT.immutable, true);
  assert.deepEqual(UPGRADED_PROMPT.variables, []);
});

/**
 * 必测矩阵 #9：考场规则三份一致。某家读到的规则不同，该家结果就不再是同一道题。
 */

import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { HOUSE_RULES, installHouseRules } from "@/core/house-rules";

test("AGENTS.md / CLAUDE.md / GEMINI.md 三份逐字等于 HOUSE_RULES", async (t) => {
  const workdir = await mkdtemp(join(tmpdir(), "llm-iq-house-rules-"));
  t.after(() => rm(workdir, { recursive: true, force: true }));

  await installHouseRules(workdir);
  for (const name of ["AGENTS.md", "CLAUDE.md", "GEMINI.md"]) {
    assert.equal(await readFile(join(workdir, name), "utf8"), HOUSE_RULES, name);
  }
});

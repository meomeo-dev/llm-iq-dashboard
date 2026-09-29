/**
 * 题库体检 CLI 专项测试（Validate Prompts CLI Tests）
 */

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { join } from "node:path";
import { promisify } from "node:util";
import { test } from "node:test";

const execFileAsync = promisify(execFile);

test("validate-prompts CLI 执行成功且包含三大校验步骤", async () => {
  const binPath = join(process.cwd(), "src/bin/validate-prompts.ts");
  const tsxPath = join(process.cwd(), "node_modules/.bin/tsx");

  const { stdout, stderr } = await execFileAsync(tsxPath, [binPath], {
    cwd: process.cwd(),
    timeout: 30000,
  });

  assert.equal(stderr, "");
  assert.ok(stdout.includes("[1/3] 校验内置核心题库 (BUILTIN_PROMPTS)..."));
  assert.ok(stdout.includes("43 道内置题目通过严格校验"));
  assert.ok(stdout.includes("[2/3] 校验 14 领域全量 140 道独立前沿题目..."));
  assert.ok(stdout.includes("140 道前沿单题通过严格校验"));
  assert.ok(stdout.includes("[3/3] 校验 15 套带候选集的套题 candidate 级特异性标准..."));
  assert.ok(stdout.includes("15 套题共 160 个候选条目均具备独立针对性标准"));
  assert.ok(stdout.includes("[PASS] 题库全量体检通过！"));
});

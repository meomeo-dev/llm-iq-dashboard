#!/usr/bin/env tsx
/**
 * 题库数据结构与完整性体检 CLI：`pnpm validate:prompts`
 *
 * 全量扫描题库中的单题、套题与候选集，基于 PromptSchema 校验数据完整性与约束规范，
 * 避免因手写录入漏填属性（如 standard, coreKey, groundTruth, originDate 等）导致失真。
 */

import {
  BUILTIN_PROMPTS,
  FRONTIER_INDIVIDUAL_PROMPT_MAP,
  resolvePrompt,
} from "../core/prompt";
import {
  validatePromptRegistry,
  validatePromptSpec,
  type PromptValidationError,
} from "../core/prompt-schema";

function formatErrors(errors: readonly PromptValidationError[]): string {
  return errors
    .map((e) => `  \x1b[31m✖\x1b[0m \x1b[1m[${e.path}]\x1b[0m: ${e.message}`)
    .join("\n");
}

async function run(): Promise<void> {
  console.log("\x1b[1;36m=======================================================\x1b[0m");
  console.log("\x1b[1;36m       LLM-IQ Benchmark Prompt Schema Validation       \x1b[0m");
  console.log("\x1b[1;36m=======================================================\x1b[0m\n");

  let totalPrompts = 0;
  let totalErrors = 0;

  // 1. 校验 BUILTIN_PROMPTS（单题 + 名著套题 + 前沿套题）
  console.log("\x1b[1m[1/3] 校验内置核心题库 (BUILTIN_PROMPTS)...\x1b[0m");
  const builtinResult = validatePromptRegistry(BUILTIN_PROMPTS, {
    requireStandard: true,
    requireLifecycleDates: true,
    requireSvgRequirement: true,
  });
  totalPrompts += BUILTIN_PROMPTS.length;

  if (builtinResult.valid) {
    console.log(`  \x1b[32m✔\x1b[0m ${BUILTIN_PROMPTS.length} 道内置题目通过严格校验\n`);
  } else {
    console.log(`  \x1b[31m✖ 发现 ${builtinResult.errors.length} 项违规：\x1b[0m`);
    console.log(formatErrors(builtinResult.errors) + "\n");
    totalErrors += builtinResult.errors.length;
  }

  // 2. 校验 140 道前沿单题映射 (FRONTIER_INDIVIDUAL_PROMPT_MAP)
  console.log("\x1b[1m[2/3] 校验 14 领域全量 140 道独立前沿题目...\x1b[0m");
  const individualList = [...FRONTIER_INDIVIDUAL_PROMPT_MAP.values()];
  const individualResult = validatePromptRegistry(individualList, {
    requireStandard: true,
    requireLifecycleDates: true,
    requireSvgRequirement: true,
  });
  totalPrompts += individualList.length;

  if (individualResult.valid) {
    console.log(`  \x1b[32m✔\x1b[0m ${individualList.length} 道前沿单题通过严格校验\n`);
  } else {
    console.log(`  \x1b[31m✖ 发现 ${individualResult.errors.length} 项违规：\x1b[0m`);
    console.log(formatErrors(individualResult.errors) + "\n");
    totalErrors += individualResult.errors.length;
  }

  // 3. 深度校验 14 个前沿套题的 140 个候选集条目 (requireCandidateStandard: true)
  console.log("\x1b[1m[3/3] 校验 14 套前沿套题 candidate 级特异性标准...\x1b[0m");
  const frontierSuiteIds = [
    "fe-ai-v1",
    "fe-semi-v1",
    "fe-quantum-v1",
    "fe-bio-v1",
    "fe-energy-v1",
    "fe-aero-v1",
    "fe-meta-v1",
    "fe-neuro-v1",
    "vfx-sim-v1",
    "vfx-optics-v1",
    "vfx-geom-v1",
    "vfx-scivis-v1",
    "vfx-motion-v1",
    "vfx-sys-v1",
  ];

  let candidateErrors: PromptValidationError[] = [];
  let candidateCount = 0;

  for (const sid of frontierSuiteIds) {
    const suite = resolvePrompt(sid);
    candidateCount += suite.candidates.length;
    const res = validatePromptSpec(suite, {
      requireStandard: true,
      requireCandidateStandard: true,
      requireLifecycleDates: true,
    });
    if (!res.valid) {
      candidateErrors.push(...res.errors);
    }
  }

  if (candidateErrors.length === 0) {
    console.log(`  \x1b[32m✔\x1b[0m 14 套题共 ${candidateCount} 个候选条目均具备独立针对性标准\n`);
  } else {
    console.log(`  \x1b[31m✖ 候选标准发现 ${candidateErrors.length} 项违规：\x1b[0m`);
    console.log(formatErrors(candidateErrors) + "\n");
    totalErrors += candidateErrors.length;
  }

  // 汇总
  console.log("\x1b[1;36m=======================================================\x1b[0m");
  if (totalErrors === 0) {
    console.log(`\x1b[1;32m[PASS] 题库全量体检通过！共扫描 ${totalPrompts} 项提示词与候选，0 项属性缺失。\x1b[0m`);
    console.log("\x1b[1;36m=======================================================\x1b[0m\n");
    process.exit(0);
  } else {
    console.log(`\x1b[1;31m[FAIL] 题库体检未通过！累计发现 ${totalErrors} 处属性缺失或约束违规。\x1b[0m`);
    console.log("\x1b[1;36m=======================================================\x1b[0m\n");
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

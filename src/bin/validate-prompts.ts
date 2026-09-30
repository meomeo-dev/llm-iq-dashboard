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

/** 候选集逐条带独立 standard 的套题：14 套前沿领域套题 + 城市地标静态与动态两套 */
const CANDIDATE_STANDARD_SUITE_IDS = [
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
  "landmarks-v1",
  "landmarks-anim-v1",
];

function formatErrors(errors: readonly PromptValidationError[]): string {
  return errors
    .map((e) => `  \x1b[31m✖\x1b[0m \x1b[1m[${e.path}]\x1b[0m: ${e.message}`)
    .join("\n");
}

function validateBuiltinStep(): { count: number; errorCount: number } {
  console.log("\x1b[1m[1/3] 校验内置核心题库 (BUILTIN_PROMPTS)...\x1b[0m");
  const result = validatePromptRegistry(BUILTIN_PROMPTS, {
    requireStandard: true,
    requireLifecycleDates: true,
    requireSvgRequirement: true,
  });

  if (result.valid) {
    console.log(`  \x1b[32m✔\x1b[0m ${BUILTIN_PROMPTS.length} 道内置题目通过严格校验\n`);
    return { count: BUILTIN_PROMPTS.length, errorCount: 0 };
  }
  console.log(`  \x1b[31m✖ 发现 ${result.errors.length} 项违规：\x1b[0m`);
  console.log(formatErrors(result.errors) + "\n");
  return { count: BUILTIN_PROMPTS.length, errorCount: result.errors.length };
}

function validateIndividualStep(): { count: number; errorCount: number } {
  console.log("\x1b[1m[2/3] 校验 14 领域全量 140 道独立前沿题目...\x1b[0m");
  const individualList = [...FRONTIER_INDIVIDUAL_PROMPT_MAP.values()];
  const result = validatePromptRegistry(individualList, {
    requireStandard: true,
    requireLifecycleDates: true,
    requireSvgRequirement: true,
  });

  if (result.valid) {
    console.log(`  \x1b[32m✔\x1b[0m ${individualList.length} 道前沿单题通过严格校验\n`);
    return { count: individualList.length, errorCount: 0 };
  }
  console.log(`  \x1b[31m✖ 发现 ${result.errors.length} 项违规：\x1b[0m`);
  console.log(formatErrors(result.errors) + "\n");
  return { count: individualList.length, errorCount: result.errors.length };
}

function validateCandidateStep(): { count: number; errorCount: number } {
  const suiteCount = CANDIDATE_STANDARD_SUITE_IDS.length;
  console.log(`\x1b[1m[3/3] 校验 ${suiteCount} 套带候选集的套题 candidate 级特异性标准...\x1b[0m`);
  const candidateErrors: PromptValidationError[] = [];
  let candidateCount = 0;

  for (const sid of CANDIDATE_STANDARD_SUITE_IDS) {
    const suite = resolvePrompt(sid);
    candidateCount += suite.candidates.length;
    const res = validatePromptSpec(suite, {
      requireStandard: true,
      requireCandidateStandard: true,
      requireLifecycleDates: true,
    });
    if (!res.valid) candidateErrors.push(...res.errors);
  }

  if (candidateErrors.length === 0) {
    console.log(
      `  \x1b[32m✔\x1b[0m ${suiteCount} 套题共 ${candidateCount} 个候选条目均具备独立针对性标准\n`,
    );
    return { count: 0, errorCount: 0 };
  }
  console.log(`  \x1b[31m✖ 候选标准发现 ${candidateErrors.length} 项违规：\x1b[0m`);
  console.log(formatErrors(candidateErrors) + "\n");
  return { count: 0, errorCount: candidateErrors.length };
}

function reportSummary(totalPrompts: number, totalErrors: number): void {
  console.log("\x1b[1;36m=======================================================\x1b[0m");
  if (totalErrors === 0) {
    console.log(`\x1b[1;32m[PASS] 题库全量体检通过！共扫描 ${totalPrompts} 项提示词与候选，0 项属性缺失。\x1b[0m`);
    console.log("\x1b[1;36m=======================================================\x1b[0m\n");
    process.exit(0);
  }
  console.log(`\x1b[1;31m[FAIL] 题库体检未通过！累计发现 ${totalErrors} 处属性缺失或约束违规。\x1b[0m`);
  console.log("\x1b[1;36m=======================================================\x1b[0m\n");
  process.exit(1);
}

async function run(): Promise<void> {
  console.log("\x1b[1;36m=======================================================\x1b[0m");
  console.log("\x1b[1;36m       LLM-IQ Benchmark Prompt Schema Validation       \x1b[0m");
  console.log("\x1b[1;36m=======================================================\x1b[0m\n");

  const s1 = validateBuiltinStep();
  const s2 = validateIndividualStep();
  const s3 = validateCandidateStep();

  const totalPrompts = s1.count + s2.count + s3.count;
  const totalErrors = s1.errorCount + s2.errorCount + s3.errorCount;
  reportSummary(totalPrompts, totalErrors);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

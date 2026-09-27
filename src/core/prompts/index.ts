/**
 * 2026 前沿工程与前沿视觉特效评测题库聚合导出
 * 
 * 按照用户 UX 体验规范：
 * - 每个领域为一个分组套题（例如 fe-ai-v1, fe-meta-v1, vfx-optics-v1, vfx-motion-v1 等），提供 10 个候选场景下拉选择
 * - 避免在面板中平铺 140 道题目导致列表过长
 */

import type { PromptSpec } from "../prompt";
import { FE_AI_SUITE_PROMPT, FE_AI_INDIVIDUAL_PROMPTS } from "./fe-ai";
import { FE_SEMI_SUITE_PROMPT, FE_SEMI_INDIVIDUAL_PROMPTS } from "./fe-semi";
import { FE_QUANTUM_SUITE_PROMPT, FE_QUANTUM_INDIVIDUAL_PROMPTS } from "./fe-quantum";
import { FE_BIO_SUITE_PROMPT, FE_BIO_INDIVIDUAL_PROMPTS } from "./fe-bio";
import { FE_ENERGY_SUITE_PROMPT, FE_ENERGY_INDIVIDUAL_PROMPTS } from "./fe-energy";
import { FE_AERO_SUITE_PROMPT, FE_AERO_INDIVIDUAL_PROMPTS } from "./fe-aero";
import { FE_META_SUITE_PROMPT, FE_META_INDIVIDUAL_PROMPTS } from "./fe-meta";
import { FE_NEURO_SUITE_PROMPT, FE_NEURO_INDIVIDUAL_PROMPTS } from "./fe-neuro";
import { VFX_SIM_SUITE_PROMPT, VFX_SIM_INDIVIDUAL_PROMPTS } from "./vfx-sim";
import { VFX_OPTICS_SUITE_PROMPT, VFX_OPTICS_INDIVIDUAL_PROMPTS } from "./vfx-optics";
import { VFX_GEOM_SUITE_PROMPT, VFX_GEOM_INDIVIDUAL_PROMPTS } from "./vfx-geom";
import { VFX_SCIVIS_SUITE_PROMPT, VFX_SCIVIS_INDIVIDUAL_PROMPTS } from "./vfx-scivis";
import { VFX_MOTION_SUITE_PROMPT, VFX_MOTION_INDIVIDUAL_PROMPTS } from "./vfx-motion";
import { VFX_SYS_SUITE_PROMPT, VFX_SYS_INDIVIDUAL_PROMPTS } from "./vfx-sys";

export * from "./fe-ai";
export * from "./fe-semi";
export * from "./fe-quantum";
export * from "./fe-bio";
export * from "./fe-energy";
export * from "./fe-aero";
export * from "./fe-meta";
export * from "./fe-neuro";
export * from "./vfx-sim";
export * from "./vfx-optics";
export * from "./vfx-geom";
export * from "./vfx-scivis";
export * from "./vfx-motion";
export * from "./vfx-sys";

/** 领域分组聚合套题（挂载到 BUILTIN_PROMPTS，在 RunOnceMenu 界面展示，类似四大名著，全 14 领域） */
export const FRONTIER_SUITE_PROMPTS: readonly PromptSpec[] = [
  FE_AI_SUITE_PROMPT,
  FE_SEMI_SUITE_PROMPT,
  FE_QUANTUM_SUITE_PROMPT,
  FE_BIO_SUITE_PROMPT,
  FE_ENERGY_SUITE_PROMPT,
  FE_AERO_SUITE_PROMPT,
  FE_META_SUITE_PROMPT,
  FE_NEURO_SUITE_PROMPT,
  VFX_SIM_SUITE_PROMPT,
  VFX_OPTICS_SUITE_PROMPT,
  VFX_GEOM_SUITE_PROMPT,
  VFX_SCIVIS_SUITE_PROMPT,
  VFX_MOTION_SUITE_PROMPT,
  VFX_SYS_SUITE_PROMPT,
];

/** 所有具体单题的原始 PromptSpec（14 领域 140 题全量落地） */
export const ALL_FRONTIER_INDIVIDUAL_PROMPTS: readonly PromptSpec[] = [
  ...FE_AI_INDIVIDUAL_PROMPTS,
  ...FE_SEMI_INDIVIDUAL_PROMPTS,
  ...FE_QUANTUM_INDIVIDUAL_PROMPTS,
  ...FE_BIO_INDIVIDUAL_PROMPTS,
  ...FE_ENERGY_INDIVIDUAL_PROMPTS,
  ...FE_AERO_INDIVIDUAL_PROMPTS,
  ...FE_META_INDIVIDUAL_PROMPTS,
  ...FE_NEURO_INDIVIDUAL_PROMPTS,
  ...VFX_SIM_INDIVIDUAL_PROMPTS,
  ...VFX_OPTICS_INDIVIDUAL_PROMPTS,
  ...VFX_GEOM_INDIVIDUAL_PROMPTS,
  ...VFX_SCIVIS_INDIVIDUAL_PROMPTS,
  ...VFX_MOTION_INDIVIDUAL_PROMPTS,
  ...VFX_SYS_INDIVIDUAL_PROMPTS,
];

/**
 * 快速查找字典：根据题目 ID (如 VFX-SYS-01, FE-AI-01) 快速查找对应的完整 PromptSpec
 */
export const FRONTIER_INDIVIDUAL_PROMPT_MAP: ReadonlyMap<string, PromptSpec> = new Map(
  ALL_FRONTIER_INDIVIDUAL_PROMPTS.map((spec) => [spec.id, spec]),
);

/** 默认挂载到 BUILTIN_PROMPTS 的领域套题（避免 140 道题平铺在选择菜单中） */
export const ALL_FRONTIER_PROMPTS: readonly PromptSpec[] = FRONTIER_SUITE_PROMPTS;

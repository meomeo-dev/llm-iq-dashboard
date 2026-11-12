/** 已归档的前沿工程与视觉特效套题及单题索引。 */

import type { PromptSpec } from "../types";
import { FE_AI_SUITE_PROMPT, FE_AI_INDIVIDUAL_PROMPTS } from "./engineering/fe-ai";
import { FE_SEMI_SUITE_PROMPT, FE_SEMI_INDIVIDUAL_PROMPTS } from "./engineering/fe-semi";
import { FE_QUANTUM_SUITE_PROMPT, FE_QUANTUM_INDIVIDUAL_PROMPTS } from "./engineering/fe-quantum";
import { FE_BIO_SUITE_PROMPT, FE_BIO_INDIVIDUAL_PROMPTS } from "./engineering/fe-bio";
import { FE_ENERGY_SUITE_PROMPT, FE_ENERGY_INDIVIDUAL_PROMPTS } from "./engineering/fe-energy";
import { FE_AERO_SUITE_PROMPT, FE_AERO_INDIVIDUAL_PROMPTS } from "./engineering/fe-aero";
import { FE_META_SUITE_PROMPT, FE_META_INDIVIDUAL_PROMPTS } from "./engineering/fe-meta";
import { FE_NEURO_SUITE_PROMPT, FE_NEURO_INDIVIDUAL_PROMPTS } from "./engineering/fe-neuro";
import { VFX_SIM_SUITE_PROMPT, VFX_SIM_INDIVIDUAL_PROMPTS } from "./visual-effects/vfx-sim";
import { VFX_OPTICS_SUITE_PROMPT, VFX_OPTICS_INDIVIDUAL_PROMPTS } from "./visual-effects/vfx-optics";
import { VFX_GEOM_SUITE_PROMPT, VFX_GEOM_INDIVIDUAL_PROMPTS } from "./visual-effects/vfx-geom";
import { VFX_SCIVIS_SUITE_PROMPT, VFX_SCIVIS_INDIVIDUAL_PROMPTS } from "./visual-effects/vfx-scivis";
import { VFX_MOTION_SUITE_PROMPT, VFX_MOTION_INDIVIDUAL_PROMPTS } from "./visual-effects/vfx-motion";
import { VFX_SYS_SUITE_PROMPT, VFX_SYS_INDIVIDUAL_PROMPTS } from "./visual-effects/vfx-sys";

export * from "./engineering/fe-ai";
export * from "./engineering/fe-semi";
export * from "./engineering/fe-quantum";
export * from "./engineering/fe-bio";
export * from "./engineering/fe-energy";
export * from "./engineering/fe-aero";
export * from "./engineering/fe-meta";
export * from "./engineering/fe-neuro";
export * from "./visual-effects/vfx-sim";
export * from "./visual-effects/vfx-optics";
export * from "./visual-effects/vfx-geom";
export * from "./visual-effects/vfx-scivis";
export * from "./visual-effects/vfx-motion";
export * from "./visual-effects/vfx-sys";

/** 领域分组聚合套题（14 个领域） */
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

/** 登记到归档清单的领域套题 */
export const ALL_FRONTIER_PROMPTS: readonly PromptSpec[] = FRONTIER_SUITE_PROMPTS;

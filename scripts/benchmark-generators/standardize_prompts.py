#!/usr/bin/env python3
import re, os

domains = [
    ("fe-ai", "FE_AI", "fe-ai-v1", "FE-1: 智能计算底座与物理AI（十题组）", "FE-1: 智能计算底座、自主智能体与物理 AI 工程"),
    ("fe-semi", "FE_SEMI", "fe-semi-v1", "FE-2: 先进微电子与次埃米半导体（十题组）", "FE-2: 先进微电子、次埃米半导体与光电互连工程"),
    ("fe-quantum", "FE_QUANTUM", "fe-quantum-v1", "FE-3: 容错量子信息与后量子系统（十题组）", "FE-3: 容错量子信息、模拟与后量子系统工程"),
    ("fe-bio", "FE_BIO", "fe-bio-v1", "FE-4: 工程生物学与先进生物制造（十题组）", "FE-4: 工程生物学、合成基因组与先进生物制造"),
    ("fe-energy", "FE_ENERGY", "fe-energy-v1", "FE-5: 零碳新型能源与清洁核聚变（十题组）", "FE-5: 零碳新型能源系统、极端储能与气候工程"),
    ("fe-aero", "FE_AERO", "fe-aero-v1", "FE-6: 极端环境装备与商业航天（十题组）", "FE-6: 极端环境装备、商业航天与高超声速工程"),
    ("fe-meta", "FE_META", "fe-meta-v1", "FE-7: 超材料与微纳制造（十题组）", "FE-7: 超材料、原子级制造与微纳结构工程"),
    ("fe-neuro", "FE_NEURO", "fe-neuro-v1", "FE-8: 神经电子工程与脑机感知（十题组）", "FE-8: 神经电子工程、高带宽脑机接口与仿生微感知"),
    ("vfx-sim", "VFX_SIM", "vfx-sim-v1", "VFX-1: 连续介质物理仿真（十题组）", "VFX-1: 连续介质物理仿真与无穿模接触动力学"),
]

for filename, prefix, suite_id, suite_label, cat_name in domains:
    filepath = f"src/core/prompts/{filename}.ts"
    with open(filepath) as f:
        content = f.read()
    
    # Check if suite already exists
    if f"{prefix}_SUITE_PROMPT" in content:
        # Check if individual alias exists
        if f"{prefix}_INDIVIDUAL_PROMPTS" not in content and f"{prefix}_PROMPTS" in content:
            content += f"\nexport const {prefix}_INDIVIDUAL_PROMPTS = {prefix}_PROMPTS;\n"
            with open(filepath, "w") as f:
                f.write(content)
        elif f"{prefix}_PROMPTS" not in content and f"{prefix}_INDIVIDUAL_PROMPTS" in content:
            content += f"\nexport const {prefix}_PROMPTS = {prefix}_INDIVIDUAL_PROMPTS;\n"
            with open(filepath, "w") as f:
                f.write(content)
        continue
        
    # Extract candidate IDs, labels, and templates
    prompts = re.findall(r"export const (" + prefix + r"_\d+_PROMPT): PromptSpec = (\{.*?\n\};)", content, re.DOTALL)
    candidates = []
    for pvar, body in prompts:
        m_id = re.search(r'id:\s*"([^"]+)"', body)
        m_label = re.search(r'label:\s*"([^"]+)"', body)
        m_tpl = re.search(r'template:\s*"(.*?)"(?=,\s*variables:)', body, re.DOTALL)
        if m_id and m_label and m_tpl:
            clean_label = m_label.group(1).split(" (")[0]
            candidates.append((m_id.group(1), clean_label, m_tpl.group(1)))
            
    suite_code = f"""
/**
 * {cat_name} 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）
 */
export const {prefix}_SUITE_PROMPT: PromptSpec = {{
  id: "{suite_id}",
  label: "{suite_label}",
  template: "{cat_name} 前沿工程十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",
  variables: [],
  candidates: [
"""
    for cid, clabel, ctext in candidates:
        safe_text = ctext.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
        suite_code += f"""    {{
      id: "{cid}",
      label: "{clabel}",
      text: "{safe_text}",
    }},
"""
    suite_code += f"""  ],
  source: null,
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
}};

export const {prefix}_INDIVIDUAL_PROMPTS = {prefix}_PROMPTS;
"""
    content = content + "\n" + suite_code
    with open(filepath, "w") as f:
        f.write(content)
    print(f"Appended suite to {filepath}")

# Update src/core/prompts/index.ts
index_ts = """/**
 * 2026 前沿工程与前沿视觉特效评测题库聚合导出
 * 
 * 按照用户 UX 体验规范：
 * - 每个领域为一个分组套题（例如 fe-ai-v1, fe-meta-v1 等），提供 10 个候选场景下拉选择
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

export * from "./fe-ai";
export * from "./fe-semi";
export * from "./fe-quantum";
export * from "./fe-bio";
export * from "./fe-energy";
export * from "./fe-aero";
export * from "./fe-meta";
export * from "./fe-neuro";
export * from "./vfx-sim";

/** 领域分组聚合套题（挂载到 BUILTIN_PROMPTS，在 RunOnceMenu 界面展示，类似四大名著） */
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
];

/** 所有具体单题的原始 PromptSpec（90题已落地） */
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
];

/**
 * 快速查找字典：根据题目 ID (如 FE-META-01) 快速查找对应的完整 PromptSpec
 */
export const FRONTIER_INDIVIDUAL_PROMPT_MAP: ReadonlyMap<string, PromptSpec> = new Map(
  ALL_FRONTIER_INDIVIDUAL_PROMPTS.map((spec) => [spec.id, spec]),
);

/** 默认挂载到 BUILTIN_PROMPTS 的领域套题（避免 90~140 道题平铺在选择菜单中） */
export const ALL_FRONTIER_PROMPTS: readonly PromptSpec[] = FRONTIER_SUITE_PROMPTS;
"""

with open("src/core/prompts/index.ts", "w") as f:
    f.write(index_ts)
print("Updated src/core/prompts/index.ts successfully.")

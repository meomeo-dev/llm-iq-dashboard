#!/usr/bin/env python3
"""
build_frontier_prompts.py
Parses reports for FE-1 through FE-8 and VFX-1 (Batch 1, 2, and 3, 90 questions total)
and generates clean, modular TypeScript PromptSpec files in src/core/prompts/.

UX Discipline:
- Aligned with the Four Great Classics (shuihu-v1, xiyou-v1):
  Each domain produces a Domain Suite PromptSpec (e.g. fe-ai-v1, fe-meta-v1) with 10 candidates.
  The top-level BUILTIN_PROMPTS only mounts these Suites (avoiding a 140-item flat list).
  Individual prompt specs (FE_AI_01_PROMPT, etc.) are exported and indexed in a lookup table
  so that resolvePrompt("FE-AI-01") can immediately resolve single items with full standards.
"""

import os
import re
import json

def clean_text(text: str) -> str:
    lines = [l.strip() for l in text.strip().splitlines() if l.strip()]
    return " ".join(lines)

def escape_ts_string(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")

def parse_report_generic(filepath: str, id_prefix: str, suite_id: str, suite_label: str, domain: str):
    if not os.path.exists(filepath):
        print(f"Warning: {filepath} not found!")
        return []
    with open(filepath) as f:
        text = f.read()
    items = []
    for i in range(1, 11):
        target = f"{id_prefix}-{i:02d}"
        
        # Look for target header
        pattern = rf'(?:###\s*(?:题目\s*\d+[：:])?\s*\[?{target}\]?[^\n]*)(.*?)(?=(?:###\s*(?:题目\s*\d+[：:])?\s*\[?{id_prefix}-|\Z|##\s*三|##\s*第三))'
        match = re.search(pattern, text, re.DOTALL)
        if not match:
            # Fallback simple search
            start_pos = text.find(target)
            if start_pos == -1:
                continue
            next_target = f"{id_prefix}-{i+1:02d}" if i < 10 else "## 三"
            end_pos = text.find(next_target, start_pos + 1)
            if end_pos == -1:
                end_pos = len(text)
            block = text[start_pos:end_pos]
        else:
            block = match.group(1)
            
        cn = re.search(r'-\s*\*\*中文名(?:称)?\*\*[:：]\s*([^\n]+)', block)
        en = re.search(r'-\s*\*\*英文名(?:称)?\*\*[:：]\s*([^\n]+)', block)
        form = re.search(r'-\s*\*\*(?:题目表现)?形式\*\*[:：]\s*([^\n]+)', block)
        bg = re.search(r'-\s*\*\*2026 前沿技术背景\*\*[:：]\s*([^\n]+(?:\n[^\n-]+)*)', block)
        gt = re.search(r'-\s*\*\*客观黄金基准[^\*]*\*\*[:：]?(.*?)(?=-\s*\*\*机器与视觉客观比对判据\*\*)', block, re.DOTALL)
        eval_c = re.search(r'-\s*\*\*机器与视觉客观比对判据\*\*[:：]?(.*?)(?=-\s*\*\*权威学术出处\*\*)', block, re.DOTALL)
        cite = re.search(r'-\s*\*\*权威学术出处\*\*[:：]?(.*?)(?=-\s*\*\*净室设计理念说明\*\*|\Z)', block, re.DOTALL)
        
        cn_val = cn.group(1).strip() if cn else target
        en_val = en.group(1).strip() if en else ""
        form_val = form.group(1).strip() if form else "静态"
        bg_val = clean_text(bg.group(1)) if bg else ""
        gt_val = clean_text(gt.group(1)) if gt else ""
        eval_val = clean_text(eval_c.group(1)) if eval_c else ""
        cite_val = clean_text(cite.group(1)) if cite else ""
        
        items.append({
            "id": target,
            "suite_id": suite_id,
            "suite_label": suite_label,
            "domain": domain,
            "cn": cn_val,
            "en": en_val,
            "form": form_val,
            "bg": bg_val,
            "gt": gt_val,
            "eval": eval_val,
            "cite": cite_val,
        })
    print(f"Parsed {len(items)} items from {filepath}")
    return items

def generate_ts_module(filename, domain_prefix, suite_id, suite_label, category_name, items):
    out = []
    out.append("/**")
    out.append(f" * {category_name} 前沿评测题库。")
    out.append(" * 包含 10 道独立题目规格，以及 1 套领域分组聚合套题（UX 交互与轮换结构对齐四大名著 candidates 规范）。")
    out.append(" */\n")
    out.append('import type { PromptSpec } from "../prompt";\n')
    
    prompt_var_names = []
    candidates_list = []
    
    for it in items:
        pid = it["id"]
        safe_id = pid.replace("-", "_")
        pvar = f"{safe_id}_PROMPT"
        prompt_var_names.append(pvar)
        
        is_anim = "动画" in it["form"] or "动效" in it["form"] or "SMIL" in it["form"] or "Dynamic" in it["form"]
        anim_instruction = "using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners)" if is_anim else "as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners)"
        
        en_title = it["en"] if it["en"] else it["cn"]
        prompt_lines = [
            f'Generate an SVG technical visualization of {en_title} {anim_instruction}.',
            f'Context & Engineering Background: {it["bg"]}',
            f'Physical & Mathematical Ground Truth: {it["gt"]}',
            f'Visual Inspection Criteria: {it["eval"]}',
            'Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens \'--\' inside comments, avoid duplicate attributes on tags, and self-contain all elements.',
        ]
        
        template_str = " ".join(prompt_lines)
        label_str = f"{it['cn']} ({it['en']})" if it["en"] else it["cn"]
        
        candidates_list.append({
            "id": it["id"],
            "label": it["cn"],
            "text": template_str,
        })
        
        out.append(f"/**")
        out.append(f" * {it['id']}: {it['cn']}")
        out.append(f" */")
        out.append(f"export const {pvar}: PromptSpec = {{")
        out.append(f'  id: "{it["id"]}",')
        out.append(f'  label: "{escape_ts_string(label_str)}",')
        out.append(f'  template: "{escape_ts_string(template_str)}",')
        out.append(f"  variables: [],")
        out.append(f"  candidates: [],")
        out.append(f'  source: "{escape_ts_string(it["cite"][:200])}",')
        out.append(f"  verified: true,")
        out.append(f"  immutable: true,")
        out.append(f'  originDate: "2026-09",')
        out.append(f'  registeredAt: "2026-09-27",')
        out.append(f"  standard: {{")
        out.append(f'    coreKey: "{escape_ts_string(it["cn"])}",')
        out.append(f'    groundTruth: "{escape_ts_string(it["gt"][:400])}",')
        out.append(f'    evaluationCriteria: "{escape_ts_string(it["eval"][:400])}",')
        out.append(f'    referenceSource: "{escape_ts_string(it["cite"][:300])}",')
        out.append(f"  }},")
        out.append(f"}};\n")
        
    out.append(f"export const {domain_prefix}_INDIVIDUAL_PROMPTS: readonly PromptSpec[] = [")
    for pv in prompt_var_names:
        out.append(f"  {pv},")
    out.append("];\n")
    
    # Generate the domain suite prompt spec
    suite_var = f"{domain_prefix}_SUITE_PROMPT"
    out.append(f"/**")
    out.append(f" * {category_name} 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）")
    out.append(f" */")
    out.append(f"export const {suite_var}: PromptSpec = {{")
    out.append(f'  id: "{suite_id}",')
    out.append(f'  label: "{suite_label}",')
    out.append(f'  template: "{category_name} 前沿工程十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",')
    out.append(f"  variables: [],")
    out.append(f"  candidates: [")
    for c in candidates_list:
        out.append(f"    {{")
        out.append(f'      id: "{c["id"]}",')
        out.append(f'      label: "{escape_ts_string(c["label"])}",')
        out.append(f'      text: "{escape_ts_string(c["text"])}",')
        out.append(f"    }},")
    out.append(f"  ],")
    out.append(f'  source: "{escape_ts_string(items[0]["cite"][:200]) if items else ""}",')
    out.append(f"  verified: true,")
    out.append(f"  immutable: true,")
    out.append(f'  originDate: "2026-09",')
    out.append(f'  registeredAt: "2026-09-27",')
    out.append(f"}};\n")
    
    with open(filename, "w") as f:
        f.write("\n".join(out))
    print(f"Written {filename} with suite {suite_id} and {len(items)} individual prompts.")

def main():
    os.makedirs("src/core/prompts", exist_ok=True)
    
    # Batch 1
    fe1 = parse_report_generic("scratch_fe1_report.md", "FE-AI", "fe-ai-v1", "FE-1: 智能计算底座与物理AI（十题组）", "fe-ai")
    fe2 = parse_report_generic("scratch_fe2_report.md", "FE-SEMI", "fe-semi-v1", "FE-2: 先进微电子与次埃米半导体（十题组）", "fe-semi")
    fe3 = parse_report_generic("scratch_fe3_report.md", "FE-QUANTUM", "fe-quantum-v1", "FE-3: 容错量子信息与后量子系统（十题组）", "fe-quantum")
    
    # Batch 2
    fe4 = parse_report_generic("scratch_fe4_report.md", "FE-BIO", "fe-bio-v1", "FE-4: 工程生物学与先进生物制造（十题组）", "fe-bio")
    fe5 = parse_report_generic("scratch_fe5_report.md", "FE-ENERGY", "fe-energy-v1", "FE-5: 零碳新型能源与清洁核聚变（十题组）", "fe-energy")
    fe6 = parse_report_generic("scratch_fe6_report.md", "FE-AERO", "fe-aero-v1", "FE-6: 极端环境装备与商业航天（十题组）", "fe-aero")
    
    # Batch 3
    fe7 = parse_report_generic("scratch_fe7_report.md", "FE-META", "fe-meta-v1", "FE-7: 超材料与微纳制造（十题组）", "fe-meta")
    fe8 = parse_report_generic("scratch_fe8_report.md", "FE-NEURO", "fe-neuro-v1", "FE-8: 神经电子工程与脑机感知（十题组）", "fe-neuro")
    vfx1 = parse_report_generic("scratch_vfx1_report.md", "VFX-SIM", "vfx-sim-v1", "VFX-1: 连续介质物理仿真（十题组）", "vfx-sim")
    
    if fe1: generate_ts_module("src/core/prompts/fe-ai.ts", "FE_AI", "fe-ai-v1", "FE-1: 智能计算底座与物理AI（十题组）", "FE-1: 智能计算底座、自主智能体与物理 AI 工程", fe1)
    if fe2: generate_ts_module("src/core/prompts/fe-semi.ts", "FE_SEMI", "fe-semi-v1", "FE-2: 先进微电子与次埃米半导体（十题组）", "FE-2: 先进微电子、次埃米半导体与光电互连工程", fe2)
    if fe3: generate_ts_module("src/core/prompts/fe-quantum.ts", "FE_QUANTUM", "fe-quantum-v1", "FE-3: 容错量子信息与后量子系统（十题组）", "FE-3: 容错量子信息、模拟与后量子系统工程", fe3)
    if fe4: generate_ts_module("src/core/prompts/fe-bio.ts", "FE_BIO", "fe-bio-v1", "FE-4: 工程生物学与先进生物制造（十题组）", "FE-4: 工程生物学、合成基因组与先进生物制造", fe4)
    if fe5: generate_ts_module("src/core/prompts/fe-energy.ts", "FE_ENERGY", "fe-energy-v1", "FE-5: 零碳新型能源与清洁核聚变（十题组）", "FE-5: 零碳新型能源系统、极端储能与气候工程", fe5)
    if fe6: generate_ts_module("src/core/prompts/fe-aero.ts", "FE_AERO", "fe-aero-v1", "FE-6: 极端环境装备与商业航天（十题组）", "FE-6: 极端环境装备、商业航天与高超声速工程", fe6)
    if fe7: generate_ts_module("src/core/prompts/fe-meta.ts", "FE_META", "fe-meta-v1", "FE-7: 超材料与微纳制造（十题组）", "FE-7: 超材料、原子级制造与微纳结构工程", fe7)
    if fe8: generate_ts_module("src/core/prompts/fe-neuro.ts", "FE_NEURO", "fe-neuro-v1", "FE-8: 神经电子工程与脑机感知（十题组）", "FE-8: 神经电子工程、高带宽脑机接口与仿生微感知", fe8)
    if vfx1: generate_ts_module("src/core/prompts/vfx-sim.ts", "VFX_SIM", "vfx-sim-v1", "VFX-1: 连续介质物理仿真（十题组）", "VFX-1: 连续介质物理仿真与无穿模接触动力学", vfx1)
    
    # Generate index.ts
    index_content = """/**
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

/** 领域分组聚合套题（在 RunOnceMenu 界面展示，类似四大名著） */
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
        f.write(index_content)
    print("Written src/core/prompts/index.ts")

if __name__ == "__main__":
    main()

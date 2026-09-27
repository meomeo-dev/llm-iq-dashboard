#!/usr/bin/env python3
"""
build_batch5_prompts.py
Parses reports for VFX-5 (Physics-Based Character Dynamics) and VFX-6 (Virtual Production & Systems)
and generates clean, modular TypeScript PromptSpec files in src/core/prompts/.
"""

import os
import re

def clean_text(text: str) -> str:
    lines = [l.strip() for l in text.strip().splitlines() if l.strip()]
    return " ".join(lines)

def escape_ts_string(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")

def parse_vfx5():
    with open("scratch_vfx5_report.md", "r", encoding="utf-8") as f:
        text = f.read()

    results = []
    for i in range(1, 11):
        target = f"VFX-MOTION-{i:02d}"
        pat = rf"###\s*【{target}】\s*([^\n]+)(.*?)(?=###\s*【VFX-MOTION-|\Z|##\s*四)"
        m = re.search(pat, text, re.DOTALL)
        if not m:
            print(f"Warning: {target} not matched in scratch_vfx5_report.md")
            continue
        title_cn = m.group(1).strip()
        block = m.group(2)

        cn_m = re.search(r'[-*]\s*\*\*中文名(?:称)?\*\*[:：]\s*([^\n]+)', block)
        en_m = re.search(r'[-*]\s*\*\*英文名(?:称)?\*\*[:：]\s*([^\n]+)', block)
        form_m = re.search(r'[-*]\s*\*\*(?:题目表现)?形式\*\*[:：]\s*([^\n]+)', block)
        bg_m = re.search(r'[-*]\s*\*\*202[4-6][^\*]*前沿(?:技术)?背景\*\*[:：]\s*(.*?)(?=[-*]\s*\*\*(?:客观黄金基准|Ground Truth)\*\*)', block, re.DOTALL)
        gt_m = re.search(r'[-*]\s*\*\*(?:客观黄金基准|Ground Truth)[^\*]*\*\*[:：]?(.*?)(?=[-*]\s*\*\*(?:机器与视觉客观比对判据|客观判定|权威学术出处)\*\*)', block, re.DOTALL)
        eval_m = re.search(r'[-*]\s*\*\*(?:机器与视觉客观比对判据|客观判定)\*\*[:：]?(.*?)(?=[-*]\s*\*\*(?:权威学术出处|权威学术与行业出处|净室设计理念说明|\Z))', block, re.DOTALL)
        cite_m = re.search(r'[-*]\s*\*\*(?:权威学术出处|权威学术与行业出处)\*\*[:：]?(.*?)(?=[-*]\s*\*\*净室设计理念说明\*\*|\Z)', block, re.DOTALL)

        cn = cn_m.group(1).strip() if cn_m else title_cn
        en = en_m.group(1).strip() if en_m else target
        form = form_m.group(1).strip() if form_m else "静态高精度矢量 SVG"
        bg = clean_text(bg_m.group(1)) if bg_m else ""
        gt = clean_text(gt_m.group(1)) if gt_m else ""
        ev = clean_text(eval_m.group(1)) if eval_m else ""
        ci = clean_text(cite_m.group(1)) if cite_m else ""

        results.append({
            "id": target,
            "cn": cn,
            "en": en,
            "form": form,
            "bg": bg,
            "gt": gt,
            "eval": ev,
            "cite": ci,
        })
    print(f"Parsed {len(results)} items for VFX-MOTION")
    return results

def parse_vfx6():
    with open("scratch_vfx6_report.md", "r", encoding="utf-8") as f:
        text = f.read()

    sec_idx = text.find("## 第二部分")
    body = text[sec_idx:] if sec_idx != -1 else text

    results = []
    for i in range(1, 11):
        target = f"VFX-SYS-{i:02d}"
        pat = rf"###\s*{target}[:：]\s*([^\n]+)(.*?)(?=###\s*VFX-SYS-|\Z|##\s*第三)"
        m = re.search(pat, body, re.DOTALL)
        if not m:
            print(f"Warning: {target} not matched in scratch_vfx6_report.md")
            continue
        title_cn = m.group(1).strip()
        block = m.group(2)

        cn_m = re.search(r'[-*]\s*\*\*中文名(?:称)?\*\*[:：]\s*([^\n]+)', block)
        en_m = re.search(r'[-*]\s*\*\*(?:题目)?英文名(?:称)?\*\*[:：]\s*([^\n]+)', block)
        form_m = re.search(r'[-*]\s*\*\*(?:题目表现)?形式\*\*[:：]\s*([^\n]+)', block)
        bg_m = re.search(r'[-*]\s*\*\*202[4-6][^\*]*前沿(?:技术)?背景\*\*[:：]\s*(.*?)(?=[-*]\s*\*\*(?:客观黄金基准|Ground Truth)\*\*)', block, re.DOTALL)
        gt_m = re.search(r'[-*]\s*\*\*(?:客观黄金基准|Ground Truth)[^\*]*\*\*[:：]?(.*?)(?=[-*]\s*\*\*(?:机器与视觉客观比对判据|客观判定|权威学术出处)\*\*)', block, re.DOTALL)
        eval_m = re.search(r'[-*]\s*\*\*(?:机器与视觉客观比对判据|客观判定)\*\*[:：]?(.*?)(?=[-*]\s*\*\*(?:权威学术出处|权威学术与行业出处|净室设计理念说明|\Z))', block, re.DOTALL)
        cite_m = re.search(r'[-*]\s*\*\*(?:权威学术出处|权威学术与行业出处)\*\*[:：]?(.*?)(?=[-*]\s*\*\*净室设计理念说明\*\*|\Z)', block, re.DOTALL)

        cn = cn_m.group(1).strip() if cn_m else title_cn
        en = en_m.group(1).strip() if en_m else target
        form = form_m.group(1).strip() if form_m else "静态高精度矢量 SVG"
        bg = clean_text(bg_m.group(1)) if bg_m else ""
        gt = clean_text(gt_m.group(1)) if gt_m else ""
        ev = clean_text(eval_m.group(1)) if eval_m else ""
        ci = clean_text(cite_m.group(1)) if cite_m else ""

        results.append({
            "id": target,
            "cn": cn,
            "en": en,
            "form": form,
            "bg": bg,
            "gt": gt,
            "eval": ev,
            "cite": ci,
        })
    print(f"Parsed {len(results)} items for VFX-SYS")
    return results

def generate_ts_module(filename: str, domain_prefix: str, suite_id: str, suite_label: str, category_name: str, items: list):
    out = []
    out.append("/**")
    out.append(f" * {category_name} 前沿评测题库。")
    out.append(f" * 包含 10 道独立题目规格，以及 1 套领域分组聚合套题（UX 交互与轮换结构对齐四大名著 candidates 规范）。")
    out.append(" */\n")
    out.append('import type { PromptSpec } from "../prompt";\n')
    
    candidates_list = []
    
    for item in items:
        pid = item["id"]
        var_name = pid.replace("-", "_") + "_PROMPT"
        cn = item["cn"]
        en = item["en"]
        label = f"{cn} ({en})"
        
        is_anim = "动画" in item["form"] or "SMIL" in item["form"] or "CSS" in item["form"] or "动态" in item["form"]
        anim_instruction = "using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners)" if is_anim else "as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners)"
        
        template = f"Generate an SVG technical visualization of {en} {anim_instruction}. "
        if item["bg"]:
            template += f"Context & Engineering Background: {item['bg']} "
        if item["gt"]:
            template += f"Physical & Mathematical Ground Truth: {item['gt']} "
        if item["eval"]:
            template += f"Visual Inspection Criteria: {item['eval']} "
        template += "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements."
        
        candidates_list.append({
            "id": pid,
            "label": cn,
            "text": template
        })
        
        out.append(f"/**")
        out.append(f" * {pid}: {cn}")
        out.append(f" */")
        out.append(f"export const {var_name}: PromptSpec = {{")
        out.append(f'  id: "{pid}",')
        out.append(f'  label: "{escape_ts_string(label)}",')
        out.append(f'  template: "{escape_ts_string(template)}",')
        out.append(f"  variables: [],")
        out.append(f"  candidates: [],")
        out.append(f'  source: "{escape_ts_string(item["cite"][:200])}",')
        out.append(f"  verified: true,")
        out.append(f"  immutable: true,")
        out.append(f'  originDate: "2026-09",')
        out.append(f'  registeredAt: "2026-09-27",')
        out.append(f"  standard: {{")
        out.append(f'    coreKey: "{escape_ts_string(cn)}",')
        out.append(f'    groundTruth: "{escape_ts_string(item["gt"][:300])}",')
        out.append(f'    evaluationCriteria: "{escape_ts_string(item["eval"][:300])}",')
        out.append(f'    referenceSource: "{escape_ts_string(item["cite"][:200])}",')
        out.append(f"  }},")
        out.append(f"}};\n")
        
    array_var = f"{domain_prefix}_INDIVIDUAL_PROMPTS"
    out.append(f"export const {array_var}: readonly PromptSpec[] = [")
    for item in items:
        pid = item["id"]
        var_name = pid.replace("-", "_") + "_PROMPT"
        out.append(f"  {var_name},")
    out.append(f"];\n")
    
    suite_var = f"{domain_prefix}_SUITE_PROMPT"
    out.append(f"/**")
    out.append(f" * {category_name} 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）")
    out.append(f" */")
    out.append(f"export const {suite_var}: PromptSpec = {{")
    out.append(f'  id: "{suite_id}",')
    out.append(f'  label: "{suite_label}",')
    out.append(f'  template: "{category_name} 前沿视觉特效十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",')
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
    out.append(f"export const {domain_prefix}_PROMPTS = {array_var};\n")
    
    with open(filename, "w", encoding="utf-8") as f:
        f.write("\n".join(out))
    print(f"Written {filename} with suite {suite_id} and {len(items)} individual prompts.")

def main():
    vfx5 = parse_vfx5()
    vfx6 = parse_vfx6()
    
    generate_ts_module(
        "src/core/prompts/vfx-motion.ts",
        "VFX_MOTION",
        "vfx-motion-v1",
        "VFX-5: 物理驱动运动控制与生物解剖CFX（十题组）",
        "VFX-5: 物理驱动运动控制、具身动力学与生物解剖 CFX",
        vfx5
    )
    generate_ts_module(
        "src/core/prompts/vfx-sys.ts",
        "VFX_SYS",
        "vfx-sys-v1",
        "VFX-6: 实时虚拟制片与异构并行图形系统（十题组）",
        "VFX-6: 实时虚拟制片、深度合成与异构并行图形系统",
        vfx6
    )

if __name__ == "__main__":
    main()

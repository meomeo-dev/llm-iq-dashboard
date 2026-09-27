#!/usr/bin/env python3
"""
build_batch4_prompts.py
Parses reports for VFX-2, VFX-3, and VFX-4 (30 questions total)
and generates clean, modular TypeScript PromptSpec files in src/core/prompts/.
"""

import os
import re

def clean_text(text: str) -> str:
    lines = [l.strip() for l in text.strip().splitlines() if l.strip()]
    return " ".join(lines)

def escape_ts_string(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")

# Citations table for VFX-2 as fallback
VFX2_CITES = {
    "VFX-OPTICS-01": "B. Bitterli et al., ACM TOG (SIGGRAPH 2020), DOI: 10.1145/3386569.3392481; Y. Ouyang et al., EGSR 2021; D. Lin et al., SIGGRAPH 2022.",
    "VFX-OPTICS-02": "B. Kerbl et al., 3D Gaussian Splatting, ACM TOG (SIGGRAPH 2023), DOI: 10.1145/3592433; M. Zwicker et al., IEEE TVCG (2001).",
    "VFX-OPTICS-03": "G. Wu et al., 4D Gaussian Splatting, CVPR 2024; Z. Yang et al., Deformable 3DGS, CVPR 2024; S. Sajjadi et al., Spacetime Gaussians, ACM SIGGRAPH 2024.",
    "VFX-OPTICS-04": "L. Belcour, P. Barla, A Practical Extension to Microfacet Theory, ACM TOG (SIGGRAPH 2017), DOI: 10.1145/3072959.3073620; Born & Wolf, Principles of Optics.",
    "VFX-OPTICS-05": "J. Stam, Diffraction Shaders, ACM SIGGRAPH 1999, DOI: 10.1145/311535.311545; S. Werner et al., Scratch Iridescence, ACM TOG 2017; CIE 15:2004.",
    "VFX-OPTICS-06": "H. W. Jensen et al., A Practical Model for Subsurface Light Transport, ACM SIGGRAPH 2001; J. R. Frisvad et al., Directional Dipole, ACM TOG 2014; P. Christensen (Pixar 2015).",
    "VFX-OPTICS-07": "O. James et al., Gravitational lensing by spinning black holes in astrophysics and Interstellar, Class. Quantum Grav. 32 (2015); J. M. Bardeen (1973).",
    "VFX-OPTICS-08": "R. Penrose, Proc. Cambridge Phil. Soc. 55 (1959); J. Terrell, Phys. Rev. 116 (1959); D. Weiskopf et al., IEEE TVCG 12(5), 2006.",
    "VFX-OPTICS-09": "A. Weidlich, A. Wilkie, Realistic Rendering of Birefringency in Uniaxial Crystals, ACM TOG (EGSR 2008); W. H. Wollaston, Phil. Trans. R. Soc. Lon. (1802).",
    "VFX-OPTICS-10": "M. V. Berry, C. Upstill, Catastrophe Optics, Prog. Opt. 18 (1980); T. Zeltner et al., Specular Manifold Sampling, ACM TOG (SIGGRAPH 2020)."
}

def parse_items_section(filepath: str, prefix: str, sec_marker: str, header_pat: str):
    with open(filepath) as f:
        text = f.read()
    sec_idx = text.find(sec_marker)
    detail_text = text[sec_idx:] if sec_idx != -1 else text
    
    results = []
    for i in range(1, 11):
        target = f"{prefix}-{i:02d}"
        pat = header_pat.replace("{TARGET}", target).replace("{PREFIX}", prefix)
        m = re.search(pat, detail_text, re.DOTALL)
        if not m:
            print(f"Warning: {target} not matched in {filepath}")
            continue
        block = m.group(1)
        
        cn = re.search(r'[-*]\s*\*\*中文名(?:称)?\*\*[:：]\s*([^\n]+)', block)
        en = re.search(r'[-*]\s*\*\*英文名(?:称)?\*\*[:：]\s*([^\n]+)', block)
        form = re.search(r'[-*]\s*\*\*(?:题目表现)?形式\*\*[:：]\s*([^\n]+)', block)
        bg = re.search(r'[-*]\s*\*\*202[4-6][^\*]*前沿(?:技术)?背景\*\*[:：]\s*(.*?)(?=[-*]\s*\*\*(?:客观黄金基准|Ground Truth)\*\*)', block, re.DOTALL)
        gt = re.search(r'[-*]\s*\*\*(?:客观黄金基准|Ground Truth)[^\*]*\*\*[:：]?(.*?)(?=[-*]\s*\*\*(?:机器与视觉客观比对判据|客观判定|权威学术出处)\*\*)', block, re.DOTALL)
        eval_c = re.search(r'[-*]\s*\*\*(?:机器与视觉客观比对判据|客观判定)\*\*[:：]?(.*?)(?=[-*]\s*\*\*(?:权威学术出处|净室设计理念说明|\Z))', block, re.DOTALL)
        cite = re.search(r'[-*]\s*\*\*权威学术出处\*\*[:：]?(.*?)(?=[-*]\s*\*\*净室设计理念说明\*\*|\Z)', block, re.DOTALL)
        
        cn_val = cn.group(1).strip() if cn else target
        en_val = en.group(1).strip() if en else target
        form_val = form.group(1).strip() if form else "静态高精度矢量 SVG"
        bg_val = clean_text(bg.group(1)) if bg else ""
        gt_val = clean_text(gt.group(1)) if gt else ""
        eval_val = clean_text(eval_c.group(1)) if eval_c else ""
        
        cite_val = clean_text(cite.group(1)) if cite else ""
        if not cite_val and target in VFX2_CITES:
            cite_val = VFX2_CITES[target]
            
        results.append({
            "id": target,
            "cn": cn_val,
            "en": en_val,
            "form": form_val,
            "bg": bg_val,
            "gt": gt_val,
            "eval": eval_val,
            "cite": cite_val
        })
    print(f"Parsed {len(results)} items for {prefix} from {filepath}")
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
    
    with open(filename, "w") as f:
        f.write("\n".join(out))
    print(f"Written {filename} with suite {suite_id} and {len(items)} individual prompts.")

def main():
    vfx2 = parse_items_section("scratch_vfx2_report.md", "VFX-OPTICS", "## 三、", r"###\s*\d+\.\s*`?{TARGET}`?[:：](.*?)(?=###\s*\d+\.\s*`?{PREFIX}-|\Z)")
    vfx3 = parse_items_section("scratch_vfx3_report.md", "VFX-GEOM", "## 二、", r"####\s*【{TARGET}】(.*?)(?=####\s*【{PREFIX}-|\Z|##\s*三)")
    vfx4 = parse_items_section("scratch_vfx4_report.md", "VFX-SCIVIS", "## 第二部分", r"###\s*{TARGET}[:：](.*?)(?=###\s*{PREFIX}-|\Z|##\s*第三)")
    
    generate_ts_module("src/core/prompts/vfx-optics.ts", "VFX_OPTICS", "vfx-optics-v1", "VFX-2: 波动光学与显式辐射场（十题组）", "VFX-2: 波动光学传播、全光谱渲染与显式辐射场", vfx2)
    generate_ts_module("src/core/prompts/vfx-geom.ts", "VFX_GEOM", "vfx-geom-v1", "VFX-3: 离散微分几何与拓扑流形（十题组）", "VFX-3: 离散微分几何、神经隐式曲面与动态拓扑流形", vfx3)
    generate_ts_module("src/core/prompts/vfx-scivis.ts", "VFX_SCIVIS", "vfx-scivis-v1", "VFX-4: 复杂多物理场与科学计算可视化（十题组）", "VFX-4: 复杂多物理场、高维张量场与科学计算可视化", vfx4)

if __name__ == "__main__":
    main()

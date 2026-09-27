#!/usr/bin/env python3
"""
update_provenance_batch4.py
Appends Batch 4 (VFX-2, VFX-3, VFX-4) 30 items into docs/benchmark-provenance.md:
- Table entries 120 through 149
- Detailed Sections XIX, XX, XXI
- Renumbering trailing lifecycle & reference sections to XXII, XXIII
"""

import re
from build_batch4_prompts import parse_items_section

def main():
    doc_path = "docs/benchmark-provenance.md"
    with open(doc_path, "r", encoding="utf-8") as f:
        content = f.read()

    vfx2 = parse_items_section("scratch_vfx2_report.md", "VFX-OPTICS", "## 三、", r"###\s*\d+\.\s*`?{TARGET}`?[:：](.*?)(?=###\s*\d+\.\s*`?{PREFIX}-|\Z)")
    vfx3 = parse_items_section("scratch_vfx3_report.md", "VFX-GEOM", "## 二、", r"####\s*【{TARGET}】(.*?)(?=####\s*【{PREFIX}-|\Z|##\s*三)")
    vfx4 = parse_items_section("scratch_vfx4_report.md", "VFX-SCIVIS", "## 第二部分", r"###\s*{TARGET}[:：](.*?)(?=###\s*{PREFIX}-|\Z|##\s*第三)")

    # 1. Prepare table entries (indices 120 to 149)
    table_rows = []
    idx = 120
    
    for item in vfx2:
        domain_name = "波动光学与显式辐射场"
        is_anim = "动画" in item["form"] or "SMIL" in item["form"] or "CSS" in item["form"] or "动态" in item["form"]
        form_name = "纯内联动画" if is_anim else "静态"
        cite = item["cite"].split(";")[0].split(",")[0]
        table_rows.append(f"| {idx} | `{item['id']}` | {item['cn']} | {domain_name} | {form_name} | 2026-09 | 2026-09-27 | {cite} |")
        idx += 1

    for item in vfx3:
        domain_name = "微分几何与拓扑流形"
        is_anim = "动画" in item["form"] or "SMIL" in item["form"] or "CSS" in item["form"] or "动态" in item["form"]
        form_name = "纯内联动画" if is_anim else "静态"
        cite = item["cite"].split(";")[0].split(",")[0]
        table_rows.append(f"| {idx} | `{item['id']}` | {item['cn']} | {domain_name} | {form_name} | 2026-09 | 2026-09-27 | {cite} |")
        idx += 1

    for item in vfx4:
        domain_name = "多物理场与科学计算可视化"
        is_anim = "动画" in item["form"] or "SMIL" in item["form"] or "CSS" in item["form"] or "动态" in item["form"]
        form_name = "纯内联动画" if is_anim else "静态"
        cite = item["cite"].split(";")[0].split(",")[0]
        table_rows.append(f"| {idx} | `{item['id']}` | {item['cn']} | {domain_name} | {form_name} | 2026-09 | 2026-09-27 | {cite} |")
        idx += 1

    # Insert table rows right after 119 | `VFX-SIM-10`
    table_marker = "| 119 | `VFX-SIM-10`"
    t_pos = content.find(table_marker)
    if t_pos == -1:
        raise ValueError("Could not find table marker for VFX-SIM-10")
    t_end = content.find("\n", t_pos)
    
    new_table_content = "\n" + "\n".join(table_rows)
    content = content[:t_end] + new_table_content + content[t_end:]

    # 2. Prepare detailed sections
    detail_blocks = []
    
    # Section XIX: VFX-2
    detail_blocks.append("\n## 十九、 VFX-2: 波动光学传播、全光谱渲染与显式辐射场（2026 前沿视效九十一至一百）\n")
    q_num = 91
    for item in vfx2:
        is_anim = "动画" in item["form"] or "SMIL" in item["form"] or "CSS" in item["form"] or "动态" in item["form"]
        form_text = "纯内联动画矢量 SVG（SMIL / CSS3）" if is_anim else "静态高精度矢量 SVG"
        detail_blocks.append(f"### {q_num}. {item['cn']} (`{item['id']}`)")
        detail_blocks.append(f"* **呈现形式**：{form_text}")
        detail_blocks.append(f"* **出处**：{item['cite']}")
        detail_blocks.append(f"* **物理机制与黄金基准**：")
        detail_blocks.append(f"  * **背景与机理**：{item['bg']}")
        detail_blocks.append(f"  * **核心基准 Ground Truth**：{item['gt']}")
        detail_blocks.append(f"  * **视觉判据**：{item['eval']}\n")
        q_num += 1

    # Section XX: VFX-3
    detail_blocks.append("## 二十、 VFX-3: 离散微分几何、神经隐式曲面与动态拓扑流形（2026 前沿视效一百零一至一百一十）\n")
    for item in vfx3:
        is_anim = "动画" in item["form"] or "SMIL" in item["form"] or "CSS" in item["form"] or "动态" in item["form"]
        form_text = "纯内联动画矢量 SVG（SMIL / CSS3）" if is_anim else "静态高精度矢量 SVG"
        detail_blocks.append(f"### {q_num}. {item['cn']} (`{item['id']}`)")
        detail_blocks.append(f"* **呈现形式**：{form_text}")
        detail_blocks.append(f"* **出处**：{item['cite']}")
        detail_blocks.append(f"* **物理机制与黄金基准**：")
        detail_blocks.append(f"  * **背景与机理**：{item['bg']}")
        detail_blocks.append(f"  * **核心基准 Ground Truth**：{item['gt']}")
        detail_blocks.append(f"  * **视觉判据**：{item['eval']}\n")
        q_num += 1

    # Section XXI: VFX-4
    detail_blocks.append("## 二十一、 VFX-4: 复杂多物理场、高维张量场与科学计算可视化（2026 前沿视效一百一十一至一百二十）\n")
    for item in vfx4:
        is_anim = "动画" in item["form"] or "SMIL" in item["form"] or "CSS" in item["form"] or "动态" in item["form"]
        form_text = "纯内联动画矢量 SVG（SMIL / CSS3）" if is_anim else "静态高精度矢量 SVG"
        detail_blocks.append(f"### {q_num}. {item['cn']} (`{item['id']}`)")
        detail_blocks.append(f"* **呈现形式**：{form_text}")
        detail_blocks.append(f"* **出处**：{item['cite']}")
        detail_blocks.append(f"* **物理机制与黄金基准**：")
        detail_blocks.append(f"  * **背景与机理**：{item['bg']}")
        detail_blocks.append(f"  * **核心基准 Ground Truth**：{item['gt']}")
        detail_blocks.append(f"  * **视觉判据**：{item['eval']}\n")
        q_num += 1

    # Insert detailed sections right before ## 十九、 题目生命周期与淘汰机制
    lifecycle_marker = "## 十九、 题目生命周期与淘汰机制"
    l_pos = content.find(lifecycle_marker)
    if l_pos == -1:
        raise ValueError("Could not find lifecycle marker")

    details_str = "\n".join(detail_blocks) + "\n"
    content = content[:l_pos] + details_str + content[l_pos:]

    # Renumber the trailing sections
    content = content.replace("## 十九、 题目生命周期与淘汰机制", "## 二十二、 题目生命周期与淘汰机制")
    content = content.replace("## 二十、 参考资料与上游链接", "## 二十三、 参考资料与上游链接")

    with open(doc_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Successfully updated {doc_path} with Batch 4 (30 prompts, total 120 frontier prompts).")

if __name__ == "__main__":
    main()

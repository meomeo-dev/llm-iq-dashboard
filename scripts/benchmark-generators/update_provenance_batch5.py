#!/usr/bin/env python3
"""
update_provenance_batch5.py
Appends Batch 5 (VFX-5, VFX-6) 20 items into docs/benchmark-provenance.md:
- Table entries 150 through 169
- Detailed Sections XXII, XXIII
- Renumbering trailing lifecycle & reference sections to XXIV, XXV
"""

import re
from build_batch5_prompts import parse_vfx5, parse_vfx6

def main():
    doc_path = "docs/benchmark-provenance.md"
    with open(doc_path, "r", encoding="utf-8") as f:
        content = f.read()

    vfx5 = parse_vfx5()
    vfx6 = parse_vfx6()

    # 1. Prepare table entries (indices 150 to 169)
    table_rows = []
    idx = 150
    
    for item in vfx5:
        domain_name = "物理驱动运动与生物解剖CFX"
        is_anim = "动画" in item["form"] or "SMIL" in item["form"] or "CSS" in item["form"] or "动态" in item["form"]
        form_name = "纯内联动画" if is_anim else "静态"
        cite = item["cite"].split(";")[0].split(",")[0]
        table_rows.append(f"| {idx} | `{item['id']}` | {item['cn']} | {domain_name} | {form_name} | 2026-09 | 2026-09-27 | {cite} |")
        idx += 1

    for item in vfx6:
        domain_name = "虚拟制片与异构图形系统"
        is_anim = "动画" in item["form"] or "SMIL" in item["form"] or "CSS" in item["form"] or "动态" in item["form"]
        form_name = "纯内联动画" if is_anim else "静态"
        cite = item["cite"].split(";")[0].split(",")[0]
        table_rows.append(f"| {idx} | `{item['id']}` | {item['cn']} | {domain_name} | {form_name} | 2026-09 | 2026-09-27 | {cite} |")
        idx += 1

    # Insert table rows right after | 149 | `VFX-SCIVIS-10`
    table_marker = "| 149 | `VFX-SCIVIS-10`"
    t_pos = content.find(table_marker)
    if t_pos == -1:
        raise ValueError("Could not find table marker for VFX-SCIVIS-10")
    t_end = content.find("\n", t_pos)
    
    new_table_content = "\n" + "\n".join(table_rows)
    content = content[:t_end] + new_table_content + content[t_end:]

    # 2. Prepare detailed sections
    detail_blocks = []
    
    # Section XXII: VFX-5
    detail_blocks.append("\n## 二十二、 VFX-5: 物理驱动运动控制、具身动力学与生物解剖 CFX（2026 前沿视效一百二十一至一百三十）\n")
    q_num = 121
    for item in vfx5:
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

    # Section XXIII: VFX-6
    detail_blocks.append("## 二十三、 VFX-6: 实时虚拟制片、深度合成与异构并行图形系统（2026 前沿视效一百三十一至一百四十）\n")
    for item in vfx6:
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

    # Insert detailed sections right before ## 二十二、 题目生命周期与淘汰机制
    lifecycle_marker = "## 二十二、 题目生命周期与淘汰机制"
    l_pos = content.find(lifecycle_marker)
    if l_pos == -1:
        raise ValueError("Could not find lifecycle marker: ## 二十二、 题目生命周期与淘汰机制")

    details_str = "\n".join(detail_blocks) + "\n"
    content = content[:l_pos] + details_str + content[l_pos:]

    # Renumber the trailing sections
    content = content.replace("## 二十二、 题目生命周期与淘汰机制", "## 二十四、 题目生命周期与淘汰机制")
    content = content.replace("## 二十三、 参考资料与上游链接", "## 二十五、 参考资料与上游链接")

    with open(doc_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Successfully updated {doc_path} with Batch 5 (20 prompts, total 140 frontier prompts, 170 overall items).")

if __name__ == "__main__":
    main()

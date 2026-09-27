#!/usr/bin/env python3
"""
update_provenance_batch2.py
Appends Batch 2 (FE-4, FE-5, FE-6) into docs/benchmark-provenance.md:
- Updates Master Table with rows 60~89
- Adds Chapters XIII (FE-4), XIV (FE-5), XV (FE-6)
- Renumbers subsequent chapters
"""

import re

def main():
    with open("docs/benchmark-provenance.md") as f:
        doc = f.read()

    # Load parsed data from scripts/build_frontier_prompts.py
    from build_frontier_prompts import parse_fe4, parse_fe5, parse_fe6

    fe4 = parse_fe4()
    fe5 = parse_fe5()
    fe6 = parse_fe6()

    # 1. Prepare master table rows
    master_rows = []
    # Current max index is 59 (row for FE-QUANTUM-10 is number 59)
    # Next is 60
    current_idx = 60
    
    for it in fe4:
        cite_brief = it["cite"].split(".")[0].strip() if it["cite"] else "Nat Biotechnol / PDB"
        if len(cite_brief) > 40:
            cite_brief = cite_brief[:37] + "..."
        form_brief = "纯内联动画" if ("动画" in it["form"] or "动效" in it["form"] or "SMIL" in it["form"]) else "静态"
        master_rows.append(f"| {current_idx} | `{it['id']}` | {it['cn']} | 工程生物与合成生物学 | {form_brief} | 2026-09 | 2026-09-27 | {cite_brief} |")
        current_idx += 1

    for it in fe5:
        cite_brief = it["cite"].split(".")[0].strip() if it["cite"] else "Nuclear Fusion / Nat Energy"
        if len(cite_brief) > 40:
            cite_brief = cite_brief[:37] + "..."
        form_brief = "纯内联动画" if ("动画" in it["form"] or "动效" in it["form"] or "SMIL" in it["form"]) else "静态"
        master_rows.append(f"| {current_idx} | `{it['id']}` | {it['cn']} | 零碳能源与核聚变工程 | {form_brief} | 2026-09 | 2026-09-27 | {cite_brief} |")
        current_idx += 1

    for it in fe6:
        cite_brief = it["cite"].split(".")[0].strip() if it["cite"] else "AIAA / NASA / ASME"
        if len(cite_brief) > 40:
            cite_brief = cite_brief[:37] + "..."
        form_brief = "纯内联动画" if ("动画" in it["form"] or "动效" in it["form"] or "SMIL" in it["form"]) else "静态"
        master_rows.append(f"| {current_idx} | `{it['id']}` | {it['cn']} | 极端环境与商业航天 | {form_brief} | 2026-09 | 2026-09-27 | {cite_brief} |")
        current_idx += 1

    master_block = "\n".join(master_rows)

    # Insert after row 59 in master table
    pos_59 = doc.find("| 59 | `FE-QUANTUM-10`")
    if pos_59 == -1:
        raise ValueError("Could not find row 59 in master table")
    end_of_line_59 = doc.find("\n", pos_59)
    doc = doc[:end_of_line_59 + 1] + master_block + "\n" + doc[end_of_line_59 + 1:]

    # 2. Build detailed markdown chapters for FE-4, FE-5, FE-6
    def build_chapter(num_cn, code_name, title, items, start_item_num):
        lines = []
        lines.append(f"## {num_cn}、 {code_name}: {title}（10 题）\n")
        item_counter = start_item_num
        for it in items:
            form_text = "纯内联 CSS/SMIL 连续动画矢量 SVG（零外部 JS，无交互）" if ("动画" in it["form"] or "动效" in it["form"] or "SMIL" in it["form"]) else "静态高精度剖面/拓扑矢量 SVG（零外部 JS，无交互）"
            lines.append(f"### {item_counter}. {it['cn']} (`{it['id']}`)")
            lines.append(f"* **呈现形式**：{form_text}")
            lines.append(f"* **出处**：{it['cite']}")
            lines.append(f"* **物理机制与黄金基准**：")
            lines.append(f"  * **背景与机制**：{it['bg']}")
            lines.append(f"  * **理论与参数依据**：{it['gt']}")
            lines.append(f"  * **视觉判据**：{it['eval']}\n")
            item_counter += 1
        return "\n".join(lines)

    ch_fe4 = build_chapter("十三", "FE-4", "工程生物学、合成基因组与先进生物制造", fe4, 31)
    ch_fe5 = build_chapter("十四", "FE-5", "零碳新型能源系统、极端储能与气候工程", fe5, 41)
    ch_fe6 = build_chapter("十五", "FE-6", "极端环境装备、商业航天与高超声速工程", fe6, 51)

    batch2_chapters = f"---\n\n{ch_fe4}\n---\n\n{ch_fe5}\n---\n\n{ch_fe6}\n---\n\n"

    # Find the insertion point before "## 十三、 题目生命周期与淘汰机制"
    pos_life = doc.find("## 十三、 题目生命周期与淘汰机制")
    if pos_life == -1:
        raise ValueError("Could not find lifecycle heading")

    doc = doc[:pos_life] + batch2_chapters + doc[pos_life:]

    # Update lifecycle heading to 十六 and references to 十七
    doc = doc.replace("## 十三、 题目生命周期与淘汰机制", "## 十六、 题目生命周期与淘汰机制")
    doc = doc.replace("## 十一、 参考资料与上游链接", "## 十七、 参考资料与上游链接")

    with open("docs/benchmark-provenance.md", "w") as f:
        f.write(doc)
    print("Successfully updated docs/benchmark-provenance.md with Batch 2 (FE-4, FE-5, FE-6).")

if __name__ == "__main__":
    main()

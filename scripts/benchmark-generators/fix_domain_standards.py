#!/usr/bin/env python3
"""
fix_domain_standards.py
1. Fixes FE-BIO (FE-4): replaces ID placeholders with genuine Chinese domain names in
   src/core/prompts/fe-bio.ts and docs/benchmark-provenance.md.
2. Fixes VFX-OPTICS (VFX-2): populates missing evaluationCriteria in
   src/core/prompts/vfx-optics.ts and docs/benchmark-provenance.md.
"""

BIO_NAMES = {
    "FE-BIO-01": "epegRNA 3' evoPreQ1 假结与 PEmax 逆转录复合体",
    "FE-BIO-02": "TadA-NW1 活性空腔位阻限制与避免旁观者误突变",
    "FE-BIO-03": "从头设计机械拓扑联锁 D8-C4 旋转纳米马达",
    "FE-BIO-04": "SORT-LNP 靶向递送与内吞体倒六角相 ($H_{II}$) 破壁",
    "FE-BIO-05": "T-DXd 组织蛋白酶 B 裂解与 DXd 旁观者跨膜扩散",
    "FE-BIO-06": "刚性蜂窝 DNA 折纸双重适配体 AND-gate 铰链展开",
    "FE-BIO-07": "八重对称 NPC 支架与 FG-Nup 相分离分子筛瞬态渗流",
    "FE-BIO-08": "驱动蛋白 Kinesin-1 手把手 16.4/8.2nm 微管步进",
    "FE-BIO-09": "ATP 合酶 $c_8$ 环质子旋转与不对称 $\\gamma$ 轴扭矩传递",
    "FE-BIO-10": "Cas12a 靶标激活 RuvC 盖板打开与 ssDNA 附带切割",
}

VFX2_EVALS = {
    "VFX-OPTICS-01": "雅可比行列式绝对公差 $\\le 0.05$，立体角微分比值绝对误差 $< 1.5\\%$，重连路径光强无偏估计偏差 $< 1.0\\%$。",
    "VFX-OPTICS-02": "中心投影坐标绝对公差 $\\le 0.5\\text{ px}$，半轴长相对误差 $< 1.2\\%$，主轴倾斜角偏差 $< 0.8^\\circ$；球谐函数 0~3 阶瓣型对称度公差 $< 1.0\\%$。",
    "VFX-OPTICS-03": "关键帧时刻粒子间距形变误差率 $< 1.8\\%$，切片协方差拟合优度 $R^2 \\ge 0.985$，局部旋转等距能量损耗 $< 0.5\\%$。",
    "VFX-OPTICS-04": "黑斑厚度阈值在 $d \\le 30\\text{ nm}$ 内，各色级极值波长峰位偏差 $< 1.5\\%$，色差 $\\Delta E_{00} \\le 1.8$。",
    "VFX-OPTICS-05": "出射折射角度绝对误差 $< 0.15^\\circ$，CIE 1931 色度坐标 $(x, y)$ 误差 $\\le 0.005$。",
    "VFX-OPTICS-06": "半高宽 FWHM 匹配误差 $< 1.0\\%$，渐近衰减斜率误差 $< 0.8\\%$，次表面透射能量守恒残差 $\\le 0.5\\%$。",
    "VFX-OPTICS-07": "黑洞阴影边界吻合度 $\\ge 98.5\\%$，左右盘面辐射亮度比在 $12.0 \\sim 15.0$ 之间，光子环半径绝对公差 $< 0.02 R_g$。",
    "VFX-OPTICS-08": "$90^\\circ$ 压缩半角严格处于 $18.2^\\circ \\pm 0.3^\\circ$，视在旋转角误差 $< 1.0^\\circ$，头灯效应蓝移通量积分比吻合度 $> 99\\%$。",
    "VFX-OPTICS-09": "寻常光与非常光总分离张角误差 $< 0.1^\\circ$，折射率比值计算误差 $< 0.2\\%$，正交偏振矢量方向误差 $0^\\circ$。",
    "VFX-OPTICS-10": "三尖点对称轴夹角误差 $< 0.5^\\circ$，尖点奇点辐照度峰值标度律误差 $< 2.0\\%$，焦散折叠双曲线曲率匹配度 $> 98\\%$。",
}

def fix_fe_bio_ts():
    path = "src/core/prompts/fe-bio.ts"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    for pid, cn in BIO_NAMES.items():
        # 1. 替换 export const FE_BIO_XX_PROMPT 中的 label: "FE-BIO-XX (English Name)" -> "${cn} (English Name)"
        old_label_prefix = f'label: "{pid} ('
        new_label_prefix = f'label: "{cn} ('
        content = content.replace(old_label_prefix, new_label_prefix)

        # 2. 替换 coreKey: "FE-BIO-XX" -> coreKey: "${cn}"
        old_core_key = f'coreKey: "{pid}"'
        new_core_key = f'coreKey: "{cn}"'
        content = content.replace(old_core_key, new_core_key)

        # 3. 替换 candidates 列表中的 label: "FE-BIO-XX" -> label: "${cn}"
        old_candidate_block = f'id: "{pid}",\n      label: "{pid}",'
        new_candidate_block = f'id: "{pid}",\n      label: "{cn}",'
        content = content.replace(old_candidate_block, new_candidate_block)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed src/core/prompts/fe-bio.ts")

def fix_vfx_optics_ts():
    path = "src/core/prompts/vfx-optics.ts"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    for pid, ev in VFX2_EVALS.items():
        # 查找对应 prompt
        var_name = pid.replace("-", "_") + "_PROMPT"
        p_idx = content.find(f"export const {var_name}")
        if p_idx != -1:
            p_end = content.find("};\n", p_idx)
            block = content[p_idx:p_end]
            if 'evaluationCriteria: "",' in block:
                escaped_ev = ev.replace('\\', '\\\\').replace('"', '\\"')
                new_block = block.replace('evaluationCriteria: "",', f'evaluationCriteria: "{escaped_ev}",')
                content = content[:p_idx] + new_block + content[p_end:]

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed src/core/prompts/vfx-optics.ts")

def fix_provenance_md():
    path = "docs/benchmark-provenance.md"
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    new_lines = []
    for line in lines:
        # 1. 替换表格中的行: | 60 | `FE-BIO-01` | FE-BIO-01 |
        matched_table = False
        for pid, cn in BIO_NAMES.items():
            needle = f"`{pid}` | {pid} |"
            if needle in line:
                line = line.replace(needle, f"`{pid}` | {cn} |")
                matched_table = True
                break
        
        # 2. 替换小节标题: ### 31. FE-BIO-01 (`FE-BIO-01`)
        if not matched_table:
            for pid, cn in BIO_NAMES.items():
                needle_sec = f". {pid} (`{pid}`)"
                if needle_sec in line:
                    line = line.replace(needle_sec, f". {cn} (`{pid}`)")
                    break

        new_lines.append(line)

    content = "".join(new_lines)

    # 3. 修复 VFX-OPTICS 在小节中的视觉判据
    for pid, ev in VFX2_EVALS.items():
        marker = f"(`{pid}`)"
        p_idx = content.find(marker)
        if p_idx != -1:
            p_end = content.find("### ", p_idx + len(marker))
            if p_end == -1:
                p_end = content.find("## ", p_idx + len(marker))
            block = content[p_idx:p_end] if p_end != -1 else content[p_idx:]
            if "* **视觉判据**：\n" in block or "* **视觉判据**： \n" in block:
                new_block = block.replace("* **视觉判据**：\n", f"* **视觉判据**：{ev}\n").replace("* **视觉判据**： \n", f"* **视觉判据**：{ev}\n")
                if p_end != -1:
                    content = content[:p_idx] + new_block + content[p_end:]
                else:
                    content = content[:p_idx] + new_block

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed docs/benchmark-provenance.md")

def main():
    fix_fe_bio_ts()
    fix_vfx_optics_ts()
    fix_provenance_md()

if __name__ == "__main__":
    main()

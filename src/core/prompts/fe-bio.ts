/**
 * FE-4: 工程生物学、合成基因组与先进生物制造 前沿评测题库。
 * 全量采用纯直观可视自闭合矢量 SVG（零外部 JS，无交互式事件，支持并排直接肉眼对比）。
 */

import type { PromptSpec } from "../prompt";

/**
 * FE-BIO-01: FE-BIO-01
 */
export const FE_BIO_01_PROMPT: PromptSpec = {
  id: "FE-BIO-01",
  label: "epegRNA 3' evoPreQ1 假结与 PEmax 逆转录复合体 (Prime Editing PEmax-epegRNA Complex with 3' evoPreQ1 Pseudoknot & Reverse Transcriptase Elongation Core)",
  template: "Generate an SVG technical visualization of Prime Editing PEmax-epegRNA Complex with 3' evoPreQ1 Pseudoknot & Reverse Transcriptase Elongation Core as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 先导编辑（Prime Editing）代表了精准基因组写入的前沿。工程化 epegRNA 通过在 3' 末端融合由 8-nt 柔性连接子与 34-nt evoPreQ1（进化型 prequeosine1 核糖开关适配体）构成的 H-type 经典假结，彻底抵抗细胞内核酸外切酶 TREX1 降解，使哺乳动物细胞编辑效率提升 3–4 倍。配合 2024 年解出的 PE 催化延伸态高分辨冷冻电镜结构，可精确呈现逆转录酶核心与 Cas9 R-loop 之间跨越 18.5 Å 的异源双链导引空间几何。 Physical & Mathematical Ground Truth: * **权威结构**: PDB 8WUV (SpCas9-M-MLV RT-pegRNA-DNA 16-nt 延伸态，2.90 Å, *Nature* 2024); PDB 6E1W (preQ1 riboswitch Class I 假结，1.69 Å)。 * **关键催化残基与位阻公差**: M-MLV RT 活性中心 Asp524, Asp525, Glu562 配位两颗 $Mg^{2+}$ 催化离子（$Mg^{2+}$-O 键长 $2.08 \\pm 0.12\\ \\text{Å}$）；SpCas9 D10A 缺口催化失活突变保留 H840 催化非靶标链单链切断。 * **假结拓扑与热力学**: evoPreQ1 形成包含 Stem 1 (5 bp) 与 Stem 2 (6 bp) 的 H-type 假结，其核心包含 G15:C30 Watson-Crick 配对及 A14:G11:C28 碱基三联体共平面堆积（空间距离 $3.4 \\pm 0.2\\ \\text{Å}$），折叠自由能 $\\Delta G^\\circ = -14.6\\ \\text{kcal/mol}$。破坏性突变 G15C 使假结完全去折叠。 Visual Inspection Criteria: * **DOM 结构审查**: SVG 必须包含 5 个明确分组 `<g id=\"...\">`：`cas9-core`、`rt-domain`、`r-loop-heteroduplex`、`linker-8nt`、`evopreq1-pseudoknot`。 * **视觉拓扑特征**: SpCas9 呈特征性双叶片（REC 与 NUC），M-MLV RT 呈右手掌状（Finger, Palm, Thumb），3' 端清晰绘出 8-nt 单链悬垂与其后紧接的由交叉环连结的两根双螺旋柱构成的 H-type 假结拓扑。 * **色彩标准**: 严格遵循生物大分子规范（Cas9 采用板岩蓝 `#475569` / 青色 `#06b6d4`，RT 结构域采用深紫 `#7c3aed`，pegRNA 采用琥珀金 `#f59e0b`，evoPreQ1 假结采用祖母绿 `#10b981`，新合成单链 DNA 采用荧光玫红 `#ec4899`）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "Shuto, Y. et al. Nature 627, 431–439 (2024); Nelson, J.W. et al. Nat. Biotechnol. 40, 402–410 (2022); PDB 8WUV / 6E1W",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "epegRNA 3' evoPreQ1 假结与 PEmax 逆转录复合体",
    groundTruth: "* **权威结构**: PDB 8WUV (SpCas9-M-MLV RT-pegRNA-DNA 16-nt 延伸态，2.90 Å, *Nature* 2024); PDB 6E1W (preQ1 riboswitch Class I 假结，1.69 Å)。 * **关键催化残基与位阻公差**: M-MLV RT 活性中心 Asp524, Asp525, Glu562 配位两颗 $Mg^{2+}$ 催化离子（$Mg^{2+}$-O 键长 $2.08 \\pm 0.12\\ \\text{Å}$）；SpCas9 D10A 缺口催化失活突变保留 H840 催化非靶标链单链切断。 * **假结拓扑与热力学**: evoPreQ1 形成包含 Stem 1 (5 bp) 与 Stem 2 (6 bp) 的 H-type 假结，其核心包含 G15:C30 Watson-Crick 配对及 A14:G11:C",
    evaluationCriteria: "* **DOM 结构审查**: SVG 必须包含 5 个明确分组 `<g id=\"...\">`：`cas9-core`、`rt-domain`、`r-loop-heteroduplex`、`linker-8nt`、`evopreq1-pseudoknot`。 * **视觉拓扑特征**: SpCas9 呈特征性双叶片（REC 与 NUC），M-MLV RT 呈右手掌状（Finger, Palm, Thumb），3' 端清晰绘出 8-nt 单链悬垂与其后紧接的由交叉环连结的两根双螺旋柱构成的 H-type 假结拓扑。 * **色彩标准**: 严格遵循生物大分子规范（Cas9 采用板岩蓝 `#475569` / 青色 `#06b6d4`，RT 结构域采用深紫 `#7c3aed`，pegRNA 采用琥珀金 `#f59e0b`，evoPreQ1 假结采用祖母绿 `#10b981`，新合成单链 DNA",
    referenceSource: "https://doi.org/10.1038/s41586-024-07259-2",
  },
};

/**
 * FE-BIO-02: FE-BIO-02
 */
export const FE_BIO_02_PROMPT: PromptSpec = {
  id: "FE-BIO-02",
  label: "TadA-NW1 活性空腔位阻限制与避免旁观者误突变 (Narrow-Window Adenine Base Editor TadA-8e/NW1 Active-Site Steric Constriction & Bystander Suppression)",
  template: "Generate an SVG technical visualization of Narrow-Window Adenine Base Editor TadA-8e/NW1 Active-Site Steric Constriction & Bystander Suppression using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 腺嘌呤单碱基编辑器（ABE8e）具备高达 $1000\\times$ 的脱氨催化速率，但在原间隔序列（Protospacer）4–8 位窗口内存在多个相邻腺嘌呤（A）时会引发严重的“旁观者误突变”（Bystander Editing）。2023–2025 年新开发的窄窗口突变体（如 TadA-NW1 / ABE9）在脱氨酶活性裂口入口引入空间位阻残基，将活性窗口严格压缩至 3–4 个核苷酸，实现单一位点 A-to-I 的外科手术级修改。 Physical & Mathematical Ground Truth: * **权威结构**: PDB 6VPC (ABE8e-Cas9-sgRNA-DNA 复合体，3.20 Å, *Science* 2020)。 * **催化中心几何**: 核心催化锌离子 $\\text{Zn}^{2+}$ 由 His57、Cys87、Cys90 形成四面体配位几何（Zn-S 键长 $2.32 \\pm 0.10\\ \\text{Å}$，Zn-N 键长 $2.05 \\pm 0.10\\ \\text{Å}$）；催化广义酸碱 Glu59 距离底物脱氨基位点（C6 氨基）$3.8 \\pm 0.3\\ \\text{Å}$；通过水分子过渡桥接 Leu84 主链。 * **窄窗口位阻参数**: 宽窗口 ABE8e 允许 A3–A8 自由翻转进入空腔；TadA-NW1 改造空腔外围关键残基（引入空间位阻侧链），将自由出入通道截面从 $14.2\\ \\text{Å} \\times 9.8\\ \\text{Å}$ 收窄至 $7.5\\ \\text{Å} \\times 6.2\\ \\text{Å}$，使旁观者位点 A3 与 A8 遭遇空间位阻碰撞（范德华重叠排斥能 $\\Delta G_{\\text{steric}} > +18\\ \\text{kcal/mol}$），仅保留靶标 A6 的稳定进入。 Visual Inspection Criteria: * **动画时序验证**: 0.0s–3.0s 旁观者 A3 尝试进入催化空腔，碰撞位阻凸起红光警示并回弹（排斥）；3.5s–6.5s 靶向 A6 顺畅滑入空腔，完成 $\\text{Zn}^{2+}-\\text{Glu59}$ 稳定捕获；6.5s–8.0s 脱氨产物肌苷（I/Inosine）解离并复位。 * **无 JS 纯 SVG 验证**: 必须通过 `<animateTransform>` 或 `<animate>` 驱动变形，无任何 `<script>` 或事件监听。 * **几何特征比对**: 活性空腔必须清晰标出四面体 $\\text{Zn}^{2+}$ 配位十字形几何轴线与 Glu59 羧基侧链。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "Lapinaite, A. et al. Science 369, 566–571 (2020); Richter, M.F. et al. Nat. Biotechnol. 38, 885–891 (2020); PDB 6VPC",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "TadA-NW1 活性空腔位阻限制与避免旁观者误突变",
    groundTruth: "* **权威结构**: PDB 6VPC (ABE8e-Cas9-sgRNA-DNA 复合体，3.20 Å, *Science* 2020)。 * **催化中心几何**: 核心催化锌离子 $\\text{Zn}^{2+}$ 由 His57、Cys87、Cys90 形成四面体配位几何（Zn-S 键长 $2.32 \\pm 0.10\\ \\text{Å}$，Zn-N 键长 $2.05 \\pm 0.10\\ \\text{Å}$）；催化广义酸碱 Glu59 距离底物脱氨基位点（C6 氨基）$3.8 \\pm 0.3\\ \\text{Å}$；通过水分子过渡桥接 Leu84 主链。 * **窄窗口位阻参数**: 宽窗口 ABE8e 允许 A3–A8 自由翻转进入空腔；TadA-NW1 改造空腔外围关键残基（引入空间位阻侧链），将自由出入通道截面从 $14.2\\ \\text{Å} \\times 9.8\\ \\text",
    evaluationCriteria: "* **动画时序验证**: 0.0s–3.0s 旁观者 A3 尝试进入催化空腔，碰撞位阻凸起红光警示并回弹（排斥）；3.5s–6.5s 靶向 A6 顺畅滑入空腔，完成 $\\text{Zn}^{2+}-\\text{Glu59}$ 稳定捕获；6.5s–8.0s 脱氨产物肌苷（I/Inosine）解离并复位。 * **无 JS 纯 SVG 验证**: 必须通过 `<animateTransform>` 或 `<animate>` 驱动变形，无任何 `<script>` 或事件监听。 * **几何特征比对**: 活性空腔必须清晰标出四面体 $\\text{Zn}^{2+}$ 配位十字形几何轴线与 Glu59 羧基侧链。",
    referenceSource: "https://doi.org/10.1126/science.abb7629",
  },
};

/**
 * FE-BIO-03: FE-BIO-03
 */
export const FE_BIO_03_PROMPT: PromptSpec = {
  id: "FE-BIO-03",
  label: "从头设计机械拓扑联锁 D8-C4 旋转纳米马达 (De Novo Designed Axle-Rotor Mechanically Coupled Nanomachine)",
  template: "Generate an SVG technical visualization of De Novo Designed Axle-Rotor Mechanically Coupled Nanomachine using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 华盛顿大学 David Baker 实验室开创了通过纯计算方法（Rosetta / RFdiffusion）从头设计具备内部自由度的机械联锁人工蛋白质分子机器。该设计由中心 D8 对称转轴（Axle）与外围 C4 对称转子（Rotor）环构成，两个蛋白质组件之间不存在共价键，完全依赖机械拓扑空间锁合（Topological Interlocking），在热涨落或质子梯度下实现准一维定向相对旋转。 Physical & Mathematical Ground Truth: * **权威结构**: PDB 8GA9 (C4HR1_4r 冷冻电镜结构，3.10 Å, *Science* 2022); PDB 8EOV (C2HR1_4r 晶体结构，2.40 Å); EMDB-25575 (D8-C4 旋转总装体)。 * **机械物理尺寸**: 转子环外径 $115 \\pm 5\\ \\text{Å}$，内孔直径 $42.0 \\pm 1.5\\ \\text{Å}$；中心转轴外径 $38.0 \\pm 1.0\\ \\text{Å}$，轴-孔界面径向机械间隙（Steric Clearance）严格保持在 $2.0 \\pm 0.5\\ \\text{Å}$。 * **能量曲面与旋转常数**: 轴与转子界面由规则排列的亮氨酸/缬氨酸（Leu/Val）疏水滑动面构成，消除了深能量阱静电陷阱；离散旋转步进能垒 $\\Delta G^\\ddagger \\approx 12.5\\ \\text{kcal/mol}$，对应 90° 步进旋转周期，自由旋转扩散系数 $D_{\\text{rot}} \\approx 1.8 \\times 10^5\\ \\text{rad}^2/\\text{s}$。 Visual Inspection Criteria: * **视觉几何对称性**: 俯视图必须准确展现外圈 4 重旋转对称（C4, 每 90° 重复）与内芯 8 重两面体对称（D8, 每 45° 重复）的齿轮状拓扑轮廓。 * **动画连续性**: 使用 `<animateTransform type=\"rotate\" from=\"0\" to=\"360\" dur=\"6s\" repeatCount=\"indefinite\"/>` 驱动外环 C4 相对内轴持续同心转动，同时内轴保持锚定基座不动。 * **界面无干涉校验**: 静态与动态任意时刻，外环内壁矢量轮廓与内轴外壁矢量轮廓之间的径向空隙均 $> 0$（严格无图形穿插碰撞破绽）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "Courbet, A., Hansen, J. et al., Baker, D. Science 376, 383–390 (2022); PDB 8GA9 / 8EOV; DOI: 10.1126/science.abm1183",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "从头设计机械拓扑联锁 D8-C4 旋转纳米马达",
    groundTruth: "* **权威结构**: PDB 8GA9 (C4HR1_4r 冷冻电镜结构，3.10 Å, *Science* 2022); PDB 8EOV (C2HR1_4r 晶体结构，2.40 Å); EMDB-25575 (D8-C4 旋转总装体)。 * **机械物理尺寸**: 转子环外径 $115 \\pm 5\\ \\text{Å}$，内孔直径 $42.0 \\pm 1.5\\ \\text{Å}$；中心转轴外径 $38.0 \\pm 1.0\\ \\text{Å}$，轴-孔界面径向机械间隙（Steric Clearance）严格保持在 $2.0 \\pm 0.5\\ \\text{Å}$。 * **能量曲面与旋转常数**: 轴与转子界面由规则排列的亮氨酸/缬氨酸（Leu/Val）疏水滑动面构成，消除了深能量阱静电陷阱；离散旋转步进能垒 $\\Delta G^\\ddagger \\approx 12.5\\ \\text{k",
    evaluationCriteria: "* **视觉几何对称性**: 俯视图必须准确展现外圈 4 重旋转对称（C4, 每 90° 重复）与内芯 8 重两面体对称（D8, 每 45° 重复）的齿轮状拓扑轮廓。 * **动画连续性**: 使用 `<animateTransform type=\"rotate\" from=\"0\" to=\"360\" dur=\"6s\" repeatCount=\"indefinite\"/>` 驱动外环 C4 相对内轴持续同心转动，同时内轴保持锚定基座不动。 * **界面无干涉校验**: 静态与动态任意时刻，外环内壁矢量轮廓与内轴外壁矢量轮廓之间的径向空隙均 $> 0$（严格无图形穿插碰撞破绽）。",
    referenceSource: "https://doi.org/10.1126/science.abm1183",
  },
};

/**
 * FE-BIO-04: FE-BIO-04
 */
export const FE_BIO_04_PROMPT: PromptSpec = {
  id: "FE-BIO-04",
  label: "SORT-LNP 靶向递送与内吞体倒六角相 ($H_{II}$) 破壁 (Organ-Specific SORT-LNP & Endosomal Escape via Acid-Triggered Inverted Hexagonal ($H_{II}$) Phase Transition)",
  template: "Generate an SVG technical visualization of Organ-Specific SORT-LNP & Endosomal Escape via Acid-Triggered Inverted Hexagonal ($H_{II}$) Phase Transition as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 传统四组分脂质纳米颗粒（LNP）绝大多数被肝脏摄取。Daniel Siegwart 团队开发的“选择性器官靶向”（SORT）技术通过引入第 5 种脂质分子（如 50% 阳离子脂质 DOTAP 实现肺靶向，或 10–20% 阴离子脂质 18PA 实现脾靶向）重塑蛋白冠。进入靶细胞后，在晚期内吞体酸性微环境（pH 5.0）下，可电离阳离子脂质质子化并与内吞体膜阴离子脂质配对，诱发层状双分子层（$L_\\alpha$ 相）向倒六角相（$H_{II}$ 相）突变，破坏膜完整性并完成 mRNA 胞浆释放。 Physical & Mathematical Ground Truth: * **权威文献**: Cheng, Q. et al., Siegwart, D.J. *Nat. Nanotechnol.* 15, 313–320 (2020); Cullis, P.R. et al. *PNAS* 118, e2020401118 (2021). * **配方热力学比率**: * 肺靶向 Lung-SORT: 50 mol% DOTAP 调配基准（50% DOTAP / 25% MC3 / 15% Chol / 8% DOPE / 2% DMG-PEG）； * 脾靶向 Spleen-SORT: 15 mol% 18PA 调配基准。 * **分子堆积参数与相变几何**: * 脂质无量纲堆积参数 $S = \\frac{v}{a_0 \\cdot l_c}$。生理 pH 7.4 时 $S \\approx 0.8 < 1$（圆柱形，稳定层状双分子囊泡 $L_\\alpha$）； * 内吞体内 pH 5.0 时，叔胺质子化电荷中和内吞体磷脂酰丝氨酸（PS），亲水头部有效截面积 $a_0$ 骤缩 45%，使 $S > 1.2$（倒锥形），瞬间自组装为倒六角相 $H_{II}$； * $H_{II}$ 相圆柱中心水相通道直径 $d_w = 2.4 \\pm 0.3\\ \\text{nm}$，柱心间距 $d = 6.5 \\pm 0.5\\ \\text{nm}$，内部包裹 mRNA 单链。 Visual Inspection Criteria: * **双面板严格对照**: 左屏为【pH 7.4 稳定球状 LNP 截面】，包含多层脂质双分子层同心环与中心规整 mRNA 核心；右屏为【pH 5.0 内吞体破壁瞬态】，展现蜂窝状倒六角 $H_{II}$ 圆柱聚集体融合进入宿主内吞体脂双层并形成漏斗形融合孔。 * **脂质分子构型辨识**: 放大图层中清晰呈现脂质“头极小、双尾展开”的倒锥形几何形态，并配以极性头相互排斥、疏水尾向外辐射的柱状截面。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "Cheng, Q. et al. Nat. Nanotechnol. 15, 313–320 (2020); Cullis, P.R. et al. PNAS 118, e2020401118 (2021); DOI: 10.1038/s41565-020-0669-6",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "SORT-LNP 靶向递送与内吞体倒六角相 ($H_{II}$) 破壁",
    groundTruth: "* **权威文献**: Cheng, Q. et al., Siegwart, D.J. *Nat. Nanotechnol.* 15, 313–320 (2020); Cullis, P.R. et al. *PNAS* 118, e2020401118 (2021). * **配方热力学比率**: * 肺靶向 Lung-SORT: 50 mol% DOTAP 调配基准（50% DOTAP / 25% MC3 / 15% Chol / 8% DOPE / 2% DMG-PEG）； * 脾靶向 Spleen-SORT: 15 mol% 18PA 调配基准。 * **分子堆积参数与相变几何**: * 脂质无量纲堆积参数 $S = \\frac{v}{a_0 \\cdot l_c}$。生理 pH 7.4 时 $S \\approx 0.8 < 1$（圆柱形，稳定层状双分子囊泡 $L_\\alpha$）",
    evaluationCriteria: "* **双面板严格对照**: 左屏为【pH 7.4 稳定球状 LNP 截面】，包含多层脂质双分子层同心环与中心规整 mRNA 核心；右屏为【pH 5.0 内吞体破壁瞬态】，展现蜂窝状倒六角 $H_{II}$ 圆柱聚集体融合进入宿主内吞体脂双层并形成漏斗形融合孔。 * **脂质分子构型辨识**: 放大图层中清晰呈现脂质“头极小、双尾展开”的倒锥形几何形态，并配以极性头相互排斥、疏水尾向外辐射的柱状截面。",
    referenceSource: "https://doi.org/10.1038/s41565-020-0669-6",
  },
};

/**
 * FE-BIO-05: FE-BIO-05
 */
export const FE_BIO_05_PROMPT: PromptSpec = {
  id: "FE-BIO-05",
  label: "T-DXd 组织蛋白酶 B 裂解与 DXd 旁观者跨膜扩散 (Next-Gen ADC Trastuzumab Deruxtecan (T-DXd): Cathepsin B Cleavable GGFG Linker & Bystander Membrane Permeation)",
  template: "Generate an SVG technical visualization of Next-Gen ADC Trastuzumab Deruxtecan (T-DXd): Cathepsin B Cleavable GGFG Linker & Bystander Membrane Permeation using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 德曲妥珠单抗（Enhertu, T-DXd）创造了晚期 HER2-low 乳腺癌的临床突破。其成功归功于四大仿生分子工程突破：高达 8:1 的极高载药量（DAR≈8）、血液中绝对稳定的亲水四肽连接子（Gly-Gly-Phe-Gly）、溶酶体特异性组织蛋白酶 B（Cathepsin B）高效裂解释放活化载荷、以及游离 DXd 具备适度脂溶性（膜通透性），能扩散穿透细胞膜杀伤周围原本抗原阴性的肿瘤细胞（旁观者效应 Bystander Killing）。 Physical & Mathematical Ground Truth: * **权威结构**: PDB 1N8Z (Trastuzumab Fab-HER2 复合体，2.52 Å, *Nature* 2003); PDB 1HUC (Cathepsin B 活性中心半胱氨酸蛋白酶，2.15 Å)。 * **生化与动力学常数**: * 药物抗体比: $\\text{DAR} = 7.7 \\pm 0.3 \\approx 8$； * 组织蛋白酶 B 裂解动力学: 识别四肽 GGFG，在 Gly-DXd 酰胺键处精准水解，$k_{\\text{cat}}/K_m \\approx 4.2 \\times 10^4\\ \\text{M}^{-1}\\text{s}^{-1}$（pH 5.0，37℃）；在血浆（pH 7.4）中 21 天降解率 $<1.5\\%$； * DXd 物理化学参数: 分子量 $\\text{MW} = 429.4\\ \\text{Da}$，油水分配系数 $\\text{cLog}P = 1.82$（兼具水溶扩散与脂双层跨膜通透性，极性表面积 $\\text{tPSA} = 92.4\\ \\text{Å}^2$）。 Visual Inspection Criteria: * **四阶段动画闭环**: 1. 0.0–2.5s: 携带 8 个载荷分子的 Y 形抗体特异结合 HER2 受体胞外区 IV； 2. 2.5–5.0s: 受体介导内吞至溶酶体，Cathepsin B（含 Cys29-His199 催化二联体）剪切 GGFG 剪刀位点； 3. 5.0–7.5s: 绿色发光的游离 DXd 穿透溶酶体膜及母细胞膜（跨膜浓度梯度扩散）； 4. 7.5–10.0s: DXd 穿入邻近 HER2 阴性肿瘤细胞胞核，造成拓扑异构酶 I 抑制与 DNA 断裂（细胞核显影深红凋亡）。 * **机器断言**: SVG DOM 中必须包含独立标记的 `<path id=\"ggfg-cleavage-site\">` 与 `<circle class=\"dxd-payload\">` 元素，并使用 CSS keyframes 或 SMIL `values` 属性实现精确跨膜坐标位移。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "Cho, H.S. et al. Nature 421, 756–760 (2003); Ogitani, Y. et al. Clin. Cancer Res. 22, 5097–5108 (2016); PDB 1N8Z / 1HUC",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "T-DXd 组织蛋白酶 B 裂解与 DXd 旁观者跨膜扩散",
    groundTruth: "* **权威结构**: PDB 1N8Z (Trastuzumab Fab-HER2 复合体，2.52 Å, *Nature* 2003); PDB 1HUC (Cathepsin B 活性中心半胱氨酸蛋白酶，2.15 Å)。 * **生化与动力学常数**: * 药物抗体比: $\\text{DAR} = 7.7 \\pm 0.3 \\approx 8$； * 组织蛋白酶 B 裂解动力学: 识别四肽 GGFG，在 Gly-DXd 酰胺键处精准水解，$k_{\\text{cat}}/K_m \\approx 4.2 \\times 10^4\\ \\text{M}^{-1}\\text{s}^{-1}$（pH 5.0，37℃）；在血浆（pH 7.4）中 21 天降解率 $<1.5\\%$； * DXd 物理化学参数: 分子量 $\\text{MW} = 429.4\\ \\text{Da}$，油水分配系数 $\\tex",
    evaluationCriteria: "* **四阶段动画闭环**: 1. 0.0–2.5s: 携带 8 个载荷分子的 Y 形抗体特异结合 HER2 受体胞外区 IV； 2. 2.5–5.0s: 受体介导内吞至溶酶体，Cathepsin B（含 Cys29-His199 催化二联体）剪切 GGFG 剪刀位点； 3. 5.0–7.5s: 绿色发光的游离 DXd 穿透溶酶体膜及母细胞膜（跨膜浓度梯度扩散）； 4. 7.5–10.0s: DXd 穿入邻近 HER2 阴性肿瘤细胞胞核，造成拓扑异构酶 I 抑制与 DNA 断裂（细胞核显影深红凋亡）。 * **机器断言**: SVG DOM 中必须包含独立标记的 `<path id=\"ggfg-cleavage-site\">` 与 `<circle class=\"dxd-payload\">` 元素，并使用 CSS keyframes 或 SMIL `values` 属性实现精确跨膜坐标位移",
    referenceSource: "https://doi.org/10.1038/nature01392",
  },
};

/**
 * FE-BIO-06: FE-BIO-06
 */
export const FE_BIO_06_PROMPT: PromptSpec = {
  id: "FE-BIO-06",
  label: "刚性蜂窝 DNA 折纸双重适配体 AND-gate 铰链展开 (3D Honeycomb DNA Origami Nanorobot with Dual-Aptamer AND-Gate & Hinge Spring Actuation)",
  template: "Generate an SVG technical visualization of 3D Honeycomb DNA Origami Nanorobot with Dual-Aptamer AND-Gate & Hinge Spring Actuation using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 2012 年由 George Church 实验室开创的自主 DNA 纳米机器人是智能生物制造的里程碑。机器人由两半中空六角蜂窝状折叠桶通过后部的单链支架 DNA 铰链连接，前部由两条双链 DNA 适配体门锁（如分别响应 PDGF 与 VEGF，或 CD19 与 CD33）锁闭。唯有当靶细胞表面【同时】出现两种抗原配体时，通过无酶竞争性链置换（Toehold-mediated Strand Displacement）同时解开两个门锁，纳米机器人利用折纸骨架储存的弹性张力以 120° 弹开，精确暴露内部包裹的抗体或金纳米颗粒载荷。 Physical & Mathematical Ground Truth: * **物理几何规格**: * 闭合态尺寸: 长 $45.0 \\pm 1.0\\ \\text{nm}$，截面六边形外接圆直径 $35.0 \\pm 1.0\\ \\text{nm}$； * 晶格形式: 紧密平行排布的 24 根 B-DNA 双螺旋构成的刚性蜂窝晶格（Honeycomb Lattice，相邻螺旋轴心间距 $2.5\\ \\text{nm}$）； * 铰链结构: 后部由 2 束 12-nt 非杂交单链 M13mp18 支架链形成的柔性关节； * 逻辑门热力学: 包含 6-nt 趾状突起（Toehold），链置换驱动自由能 $\\Delta G^\\circ = -18.2\\ \\text{kcal/mol}$，双与门（AND-gate）逻辑在单一抗原刺激下泄漏率 $<2\\%$。 Visual Inspection Criteria: * **动画逻辑严谨性**: * 0.0–2.0s: 闭合桶体静止，双门锁锁定； * 2.0–4.0s: 两种不同形状标记的抗原（圆形与方形分子）同时结合左锁与右锁，触发链剥离置换； * 4.0–6.0s: 左右双锁同时解离，双半桶以铰链为支点旋转张开 $\\theta = 120^\\circ$，内部红色彩球载荷完全袒露； * 6.0–8.0s: 释放载荷并缓慢归位重置。 * **拓扑合规性**: 展开时两半桶的蜂窝横截面各具 12 根六边形排列的 DNA 螺旋管，严格满足 Church 原始设计拓扑。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "Douglas, S.M., Bachelet, I. & Church, G.M. Science 335, 831–834 (2012); DOI: 10.1126/science.1214081",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "刚性蜂窝 DNA 折纸双重适配体 AND-gate 铰链展开",
    groundTruth: "* **物理几何规格**: * 闭合态尺寸: 长 $45.0 \\pm 1.0\\ \\text{nm}$，截面六边形外接圆直径 $35.0 \\pm 1.0\\ \\text{nm}$； * 晶格形式: 紧密平行排布的 24 根 B-DNA 双螺旋构成的刚性蜂窝晶格（Honeycomb Lattice，相邻螺旋轴心间距 $2.5\\ \\text{nm}$）； * 铰链结构: 后部由 2 束 12-nt 非杂交单链 M13mp18 支架链形成的柔性关节； * 逻辑门热力学: 包含 6-nt 趾状突起（Toehold），链置换驱动自由能 $\\Delta G^\\circ = -18.2\\ \\text{kcal/mol}$，双与门（AND-gate）逻辑在单一抗原刺激下泄漏率 $<2\\%$。",
    evaluationCriteria: "* **动画逻辑严谨性**: * 0.0–2.0s: 闭合桶体静止，双门锁锁定； * 2.0–4.0s: 两种不同形状标记的抗原（圆形与方形分子）同时结合左锁与右锁，触发链剥离置换； * 4.0–6.0s: 左右双锁同时解离，双半桶以铰链为支点旋转张开 $\\theta = 120^\\circ$，内部红色彩球载荷完全袒露； * 6.0–8.0s: 释放载荷并缓慢归位重置。 * **拓扑合规性**: 展开时两半桶的蜂窝横截面各具 12 根六边形排列的 DNA 螺旋管，严格满足 Church 原始设计拓扑。",
    referenceSource: "https://doi.org/10.1126/science.1214081",
  },
};

/**
 * FE-BIO-07: FE-BIO-07
 */
export const FE_BIO_07_PROMPT: PromptSpec = {
  id: "FE-BIO-07",
  label: "八重对称 NPC 支架与 FG-Nup 相分离分子筛瞬态渗流 (Octagonal Nuclear Pore Complex (NPC C8 Scaffold & Central FG-Nup Condensate Sieve Percolation))",
  template: "Generate an SVG technical visualization of Octagonal Nuclear Pore Complex (NPC C8 Scaffold & Central FG-Nup Condensate Sieve Percolation) as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 核孔复合体（NPC, ~120 MDa）是真核生物最大的分子运输枢纽。2022 年 Science 同期发表多篇结构，揭示了其具有完美的八重旋转对称性（C8）外环与内环骨架。核孔中央通道充满由内源性无序蛋白（FG-Nups，如 Nup98）组成的相分离生物分子凝聚体（Hydrogel/Condensate）。该网络通过苯丙氨酸-甘氨酸（FG/GLFG）之间的疏水与 $\\pi-\\pi$ 相互作用形成有效孔径约 4–5 nm 的分子筛，阻挡绝大多数巨量蛋白，而结合了核转运受体（Importin-$\\beta$）的大分子则能瞬时“熔解”局部接触网，以几毫秒的速度瞬态渗流穿过。 Physical & Mathematical Ground Truth: * **权威结构**: PDB 7R5J / 7PEQ (原位核孔对称核心结构，12 Å 整合模型，*Science* 2022); PDB 3ND2 (Importin-$\\beta$ 与 FG 重复肽复合体，2.80 Å)。 * **空间几何与对称性**: * 整体对称性: 严格的 $C_8$ 八重轴对称，外径 $120 \\pm 5\\ \\text{nm}$，中央转运通道直径 $48 \\pm 2\\ \\text{nm}$，通道纵向深度 $80 \\pm 5\\ \\text{nm}$； * Y-复合体组装: 胞质环（CR）与核质环（NR）各含 16 个 Y 形复合体（双环同心错位排布，每象限 2 个）。 * **相分离微观物理常数**: * 通道内 FG 重复片段局部有效浓度高达 $40\\text{–}50\\ \\text{mM}$； * 凝胶疏水网格平均孔径 $\\xi = 4.2 \\pm 0.5\\ \\text{nm}$，被动扩散截留阈值 $40\\ \\text{kDa}$； * 转运受体单个 FG 结合口袋结合自由能 $\\Delta G \\approx -3.5\\ \\text{kcal/mol}$，促使特异载荷穿孔时间仅需 $5\\text{–}10\\ \\text{ms}$。 Visual Inspection Criteria: * **宏观俯视几何**: 必须精准绘制由 8 组呈 45° 放射对称分布的立柱支架与 Y-complex 框架组成的八角花环。 * **微观剖面透视图**: 中央通道中心绘出密集的交联云雾状多肽网格，并重点放大显示两个穿透状态对比： 1. 非特异大分子（直径 $>5\\ \\text{nm}$）被外围排斥网格拦截反弹； 2. 带有 Importin-$\\beta$（新月形螺线管蛋白）的核定位信号（NLS）复合物与 FG 侧链发生特异性亲和瞬态置换，穿入网络中央通道。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "Mosalaganti, S. et al., Kosinski, J., Beck, M. Science 376, eabm9506 (2022); Frey, S. & Görlich, D. Cell 130, 512–523 (2007); PDB 7R5J / 3ND2",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "八重对称 NPC 支架与 FG-Nup 相分离分子筛瞬态渗流",
    groundTruth: "* **权威结构**: PDB 7R5J / 7PEQ (原位核孔对称核心结构，12 Å 整合模型，*Science* 2022); PDB 3ND2 (Importin-$\\beta$ 与 FG 重复肽复合体，2.80 Å)。 * **空间几何与对称性**: * 整体对称性: 严格的 $C_8$ 八重轴对称，外径 $120 \\pm 5\\ \\text{nm}$，中央转运通道直径 $48 \\pm 2\\ \\text{nm}$，通道纵向深度 $80 \\pm 5\\ \\text{nm}$； * Y-复合体组装: 胞质环（CR）与核质环（NR）各含 16 个 Y 形复合体（双环同心错位排布，每象限 2 个）。 * **相分离微观物理常数**: * 通道内 FG 重复片段局部有效浓度高达 $40\\text{–}50\\ \\text{mM}$； * 凝胶疏水网格平均孔径 $\\xi = 4.2 \\pm 0.5",
    evaluationCriteria: "* **宏观俯视几何**: 必须精准绘制由 8 组呈 45° 放射对称分布的立柱支架与 Y-complex 框架组成的八角花环。 * **微观剖面透视图**: 中央通道中心绘出密集的交联云雾状多肽网格，并重点放大显示两个穿透状态对比： 1. 非特异大分子（直径 $>5\\ \\text{nm}$）被外围排斥网格拦截反弹； 2. 带有 Importin-$\\beta$（新月形螺线管蛋白）的核定位信号（NLS）复合物与 FG 侧链发生特异性亲和瞬态置换，穿入网络中央通道。",
    referenceSource: "https://doi.org/10.1126/science.abm9506",
  },
};

/**
 * FE-BIO-08: FE-BIO-08
 */
export const FE_BIO_08_PROMPT: PromptSpec = {
  id: "FE-BIO-08",
  label: "驱动蛋白 Kinesin-1 手把手 16.4/8.2nm 微管步进 (Kinesin-1 Dimeric Hand-Over-Hand Stepping & Neck Linker Tension Coordination (16.4 nm / 8.2 nm Cycle))",
  template: "Generate an SVG technical visualization of Kinesin-1 Dimeric Hand-Over-Hand Stepping & Neck Linker Tension Coordination (16.4 nm / 8.2 nm Cycle) using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 驱动蛋白（Kinesin-1）是细胞内沿微管极性运载囊泡的纳米分子马达。其二聚体马达通过严密的“手把手”（Hand-over-hand）步进机制沿微管原丝行走：前导头结合 ATP 促使其 14 个氨基酸的“颈联结区”（Neck Linker）发生对接并拉紧，向前甩出后滞头达 16.4 nm，质心前移 8.2 nm（刚好对应一个 $\\alpha/\\beta$-微管蛋白二聚体轴向重复间距）。两头之间的分子内张力反向抑制前头的 ATP 结合与水解，实现高达 $>100$ 步的超高连续行进性（Processivity）。 Physical & Mathematical Ground Truth: * **权威结构**: PDB 3KIN (大鼠驱动蛋白二聚体，3.0 Å); PDB 1MKJ (颈联结区对接态，1.80 Å); EMDB-8546 (微管结合双头锁合态冷冻电镜密度)。 * **力学与几何硬参数**: * 微管晶格周期: 单根微管原丝（Protofilament）轴向结合位点间距严格为 $8.2 \\pm 0.1\\ \\text{nm}$； * 跨步距离: 游离后头单步向前平移翻转位移 $16.4 \\pm 0.2\\ \\text{nm}$； * 失速力（Stall Force）: $F_{\\text{stall}} = 6.5 \\pm 0.5\\ \\text{pN}$； * 颈联结区拉紧自由能: 伴随 ATP 结合，Neck Linker 顺向拉链式结合于马达核心，提供机械驱动功 $\\Delta G_{\\text{dock}} \\approx -4.2\\ \\text{kcal/mol}$。 Visual Inspection Criteria: * **步进相位严格检验**: 6.0s 循环划分为 4 个离散力化相（每相 1.5s）： 1. Phase 1 (0.0–1.5s): 前头结合微管处于无核苷酸态，后头结合 ADP 处于拖拽态； 2. Phase 2 (1.5–3.0s): 前头结合 ATP，其黄色颈联结区如拉链般贴合（Docked），产生向前杠杆力矩，后头脱离微管并弹射向前； 3. Phase 3 (3.0–4.5s): 原后头飞越 16.4 nm 落脚于 $+8.2\\ \\text{nm}$ 处新微管蛋白位点，释放 ADP 锁定； 4. Phase 4 (4.5–6.0s): 变为后头的马达水解 ATP 为 ADP+Pi，颈联结区松弛，分子间恢复张力门控基态。 * **矢量尺标**: 背景必须严格绘制带有 8.2 nm 刻度线的 $\\alpha/\\beta$ 微管蛋白交替单体（明暗相间的蓝紫色椭圆）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "Shang, Z. et al., Sindelar, C.V. eLife 6, e28909 (2017); Vale, R.D. et al. Nature 408, 850–857 (2000); PDB 3KIN / 1MKJ / EMDB-8546",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "驱动蛋白 Kinesin-1 手把手 16.4/8.2nm 微管步进",
    groundTruth: "* **权威结构**: PDB 3KIN (大鼠驱动蛋白二聚体，3.0 Å); PDB 1MKJ (颈联结区对接态，1.80 Å); EMDB-8546 (微管结合双头锁合态冷冻电镜密度)。 * **力学与几何硬参数**: * 微管晶格周期: 单根微管原丝（Protofilament）轴向结合位点间距严格为 $8.2 \\pm 0.1\\ \\text{nm}$； * 跨步距离: 游离后头单步向前平移翻转位移 $16.4 \\pm 0.2\\ \\text{nm}$； * 失速力（Stall Force）: $F_{\\text{stall}} = 6.5 \\pm 0.5\\ \\text{pN}$； * 颈联结区拉紧自由能: 伴随 ATP 结合，Neck Linker 顺向拉链式结合于马达核心，提供机械驱动功 $\\Delta G_{\\text{dock}} \\approx -4.2\\ \\text{kcal",
    evaluationCriteria: "* **步进相位严格检验**: 6.0s 循环划分为 4 个离散力化相（每相 1.5s）： 1. Phase 1 (0.0–1.5s): 前头结合微管处于无核苷酸态，后头结合 ADP 处于拖拽态； 2. Phase 2 (1.5–3.0s): 前头结合 ATP，其黄色颈联结区如拉链般贴合（Docked），产生向前杠杆力矩，后头脱离微管并弹射向前； 3. Phase 3 (3.0–4.5s): 原后头飞越 16.4 nm 落脚于 $+8.2\\ \\text{nm}$ 处新微管蛋白位点，释放 ADP 锁定； 4. Phase 4 (4.5–6.0s): 变为后头的马达水解 ATP 为 ADP+Pi，颈联结区松弛，分子间恢复张力门控基态。 * **矢量尺标**: 背景必须严格绘制带有 8.2 nm 刻度线的 $\\alpha/\\beta$ 微管蛋白交替单体（明暗相间的蓝紫色椭圆）。",
    referenceSource: "https://doi.org/10.7554/eLife.28909",
  },
};

/**
 * FE-BIO-09: FE-BIO-09
 */
export const FE_BIO_09_PROMPT: PromptSpec = {
  id: "FE-BIO-09",
  label: "ATP 合酶 $c_8$ 环质子旋转与不对称 $\gamma$ 轴扭矩传递 (Mitochondrial ATP Synthase ($F_oF_1$) Rotary Engine: Proton-Motive Translocation & Asymmetric $\\gamma$-Shaft Torque)",
  template: "Generate an SVG technical visualization of Mitochondrial ATP Synthase ($F_oF_1$) Rotary Engine: Proton-Motive Translocation & Asymmetric $\\gamma$-Shaft Torque using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: ATP 合酶是生命界最高效的旋转分子发动机（接近 100% 机械能转化效率）。在线粒体内膜两侧质子动力势（$\\Delta p \\approx 200\\ \\text{mV}$）驱动下，质子通过定子 $a$ 亚基半通道进入转子 $c_8$ 环，质子化关键酸性残基，消除静电排斥并驱动 $c$ 环单向旋转。$c$ 环刚性带动不对称中央偏心轴 $\\gamma$ 亚基高速旋转（每分钟达数千转），强行扭曲 $(\\alpha\\beta)_3$ 催化头部三个反应腔，交替完成结合、催化合成与释放（Boyer 结合变化机制），转满 360° 生成 3 分子 ATP。 Physical & Mathematical Ground Truth: * **权威结构**: PDB 6TT7 (哺乳动物线粒体 $F_oF_1$ ATP 合酶全复合体，3.20 Å, *Nat. Struct. Mol. Biol.* 2020); PDB 6CP6 (酵母 $F_oF_1$ 完整单体结构，*Science* 2018)。 * **化学计量比与力矩参数**: * 亚基组成: 定子基座 $(\\alpha\\beta)_3$、定子柄 $b_2-d-\\text{OSCP}$、膜定子 $a$、转子 $c_8$ 环与中央偏心旋转轴 $\\gamma\\delta\\epsilon$； * 质子-ATP 转换比: $c_8$ 环转一圈消耗 8 个质子，合成 3 个 ATP，比率为 $8/3 \\approx 2.67\\ \\text{H}^+/\\text{ATP}$； * 机械扭矩: 产生约 $40\\text{–}45\\ \\text{pN}\\cdot\\text{nm}$ 的高扭矩； * 定子静电中继残基: $a$ 亚基保守精氨酸 $a\\text{Arg210}$ 与 $c$ 亚基质子结合位点 $c\\text{Glu58}$。 Visual Inspection Criteria: * **双重机械联动同步性**: * 下方膜内 $c_8$ 环沿轴心做平滑连续逆时针旋转； * 中央插入催化头的曲棍状 $\\gamma$ 偏心轴同步联动旋转； * 上方外围 $(\\alpha\\beta)_3$ 六聚体头部通过定子外侧连杆 $b_2\\text{-OSCP}$ 紧紧固定在膜上，保持绝对不转动，但三个 $\\beta$ 亚基外表面依次呈现微小的呼吸式构象舒缩变色（对应 Open 开放态 `#94a3b8` ➜ Loose 疏松态 `#38bdf8` ➜ Tight 紧密催化态 `#fbbf24`）。 * **质子流动标示**: 质子从膜间隙侧（IMS, 上方高电位）进入 $a$ 亚基上半通道，随 $c$ 环旋转近 300° 后，从下半通道排入线粒体基质（Matrix）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "Pinke, G., Zhou, L. & Sazanov, L.A. Nat. Struct. Mol. Biol. 27, 1077–1085 (2020); Boyer, P.D. Annu. Rev. Biochem. 66, 717–749 (1997); PDB 6TT7 / 6CP6",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "ATP 合酶 $c_8$ 环质子旋转与不对称 $\gamma$ 轴扭矩传递",
    groundTruth: "* **权威结构**: PDB 6TT7 (哺乳动物线粒体 $F_oF_1$ ATP 合酶全复合体，3.20 Å, *Nat. Struct. Mol. Biol.* 2020); PDB 6CP6 (酵母 $F_oF_1$ 完整单体结构，*Science* 2018)。 * **化学计量比与力矩参数**: * 亚基组成: 定子基座 $(\\alpha\\beta)_3$、定子柄 $b_2-d-\\text{OSCP}$、膜定子 $a$、转子 $c_8$ 环与中央偏心旋转轴 $\\gamma\\delta\\epsilon$； * 质子-ATP 转换比: $c_8$ 环转一圈消耗 8 个质子，合成 3 个 ATP，比率为 $8/3 \\approx 2.67\\ \\text{H}^+/\\text{ATP}$； * 机械扭矩: 产生约 $40\\text{–}45\\ \\text{pN}\\cdot\\text{n",
    evaluationCriteria: "* **双重机械联动同步性**: * 下方膜内 $c_8$ 环沿轴心做平滑连续逆时针旋转； * 中央插入催化头的曲棍状 $\\gamma$ 偏心轴同步联动旋转； * 上方外围 $(\\alpha\\beta)_3$ 六聚体头部通过定子外侧连杆 $b_2\\text{-OSCP}$ 紧紧固定在膜上，保持绝对不转动，但三个 $\\beta$ 亚基外表面依次呈现微小的呼吸式构象舒缩变色（对应 Open 开放态 `#94a3b8` ➜ Loose 疏松态 `#38bdf8` ➜ Tight 紧密催化态 `#fbbf24`）。 * **质子流动标示**: 质子从膜间隙侧（IMS, 上方高电位）进入 $a$ 亚基上半通道，随 $c$ 环旋转近 300° 后，从下半通道排入线粒体基质（Matrix）。",
    referenceSource: "https://doi.org/10.1038/s41594-020-0503-8",
  },
};

/**
 * FE-BIO-10: FE-BIO-10
 */
export const FE_BIO_10_PROMPT: PromptSpec = {
  id: "FE-BIO-10",
  label: "Cas12a 靶标激活 RuvC 盖板打开与 ssDNA 附带切割 (CRISPR-Cas12a Target-Activated Collateral Trans-Cleavage Biosensor: RuvC Lid Opening & ssDNA Reporter Cleavage)",
  template: "Generate an SVG technical visualization of CRISPR-Cas12a Target-Activated Collateral Trans-Cleavage Biosensor: RuvC Lid Opening & ssDNA Reporter Cleavage using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: CRISPR-Cas12a (Cpf1) 彻底变革了体外核酸快检诊断（如 DETECTR 平台）。不同于 Cas9 的定点双链断裂，Cas12a 在 crRNA 导向下特异识别靶标双链 DNA 并形成完整 R-loop 后，会引发 REC 叶片达 15 Å 的全构象翻转，强行拉开盖在 RuvC 催化活性中心上的蛋白质柔性盖板（Lid Loop）。暴露的活性口袋释放出极其狂暴的非特异单链脱氧核糖核酸酶活性（反式附带切割 Trans-cleavage，每分钟切割高达数千次），迅速嚼碎体液环境中的双标记（荧光团-猝灭团 F-Q）单链 DNA 探针，释放高强度荧光信号。 Physical & Mathematical Ground Truth: * **权威结构**: PDB 5XUS (LbCas12a-crRNA-target DNA 三元复合物，2.38 Å, *Cell* 2017); PDB 6GTC (过渡态三元复合物，*Cell* 2018)。 * **催化中心几何与动力学参数**: * 催化核心: RuvC 结构域保守催化三联体 Asp998、Glu1006、Asp1263 共同螯合两个水合催化二价镁离子（$Mg^{2+}_{\\text{A}}$ 与 $Mg^{2+}_{\\text{B}}$，离子间距 $3.8 \\pm 0.2\\ \\text{Å}$）； * 构象盖板位移: 盖板残基环（Lid Loop, aa 1010–1025）在非结合态下遮蔽催化口袋；靶标结合后位移达 $14.8 \\pm 1.2\\ \\text{Å}$； * 动力学常数: 反式附带切割米氏常数 $k_{\\text{cat}} \\approx 1500\\text{–}2500\\ \\text{min}^{-1}$，底物亲和力 $K_m \\approx 1.2\\ \\mu\\text{M}$；单分子检测灵敏度可达阿托摩尔（$10^{-18}\\ \\text{M}$ 级别）。 Visual Inspection Criteria: * **动画三幕式进阶演进**: 1. Act 1 (0.0–2.5s): Cas12a-crRNA 二元复合体扫描 DNA，RuvC 口袋被深色 Lid 盖板封闭； 2. Act 2 (2.5–5.0s): PAM 匹配并拉开 R-loop，黄色 REC 结构域外翻，红色 Lid 盖板向上弹开 15 Å，闪烁耀眼的双镁催化电位星光； 3. Act 3 (5.0–8.0s): 周围漂浮的多条绿色暗淡无光探针（FAM-TTTTT-IBFQ）相继被吸入暴露的 RuvC 裂口并被剪断，荧光团 FAM 与猝灭基团分离，瞬间迸发出强烈的翠绿色明亮光芒（`fill-opacity` 从 0.2 飙升至 1.0）。 * **纯 SVG 无 JS 验证**: 探针断裂与荧光爆发全部由 `<animate>` 的 `values` 属性线性插值控制，无外部依赖。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "Chen, J.S. et al., Doudna, J.A. Science 360, 436–439 (2018); Swarts, D.C. et al. Mol. Cell 66, 221–233 (2017); Stella, S. et al. Cell 175, 1856–1871 (2018); PDB 5XUS / 6GTC",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "Cas12a 靶标激活 RuvC 盖板打开与 ssDNA 附带切割",
    groundTruth: "* **权威结构**: PDB 5XUS (LbCas12a-crRNA-target DNA 三元复合物，2.38 Å, *Cell* 2017); PDB 6GTC (过渡态三元复合物，*Cell* 2018)。 * **催化中心几何与动力学参数**: * 催化核心: RuvC 结构域保守催化三联体 Asp998、Glu1006、Asp1263 共同螯合两个水合催化二价镁离子（$Mg^{2+}_{\\text{A}}$ 与 $Mg^{2+}_{\\text{B}}$，离子间距 $3.8 \\pm 0.2\\ \\text{Å}$）； * 构象盖板位移: 盖板残基环（Lid Loop, aa 1010–1025）在非结合态下遮蔽催化口袋；靶标结合后位移达 $14.8 \\pm 1.2\\ \\text{Å}$； * 动力学常数: 反式附带切割米氏常数 $k_{\\text{cat}} \\approx 15",
    evaluationCriteria: "* **动画三幕式进阶演进**: 1. Act 1 (0.0–2.5s): Cas12a-crRNA 二元复合体扫描 DNA，RuvC 口袋被深色 Lid 盖板封闭； 2. Act 2 (2.5–5.0s): PAM 匹配并拉开 R-loop，黄色 REC 结构域外翻，红色 Lid 盖板向上弹开 15 Å，闪烁耀眼的双镁催化电位星光； 3. Act 3 (5.0–8.0s): 周围漂浮的多条绿色暗淡无光探针（FAM-TTTTT-IBFQ）相继被吸入暴露的 RuvC 裂口并被剪断，荧光团 FAM 与猝灭基团分离，瞬间迸发出强烈的翠绿色明亮光芒（`fill-opacity` 从 0.2 飙升至 1.0）。 * **纯 SVG 无 JS 验证**: 探针断裂与荧光爆发全部由 `<animate>` 的 `values` 属性线性插值控制，无外部依赖。",
    referenceSource: "https://doi.org/10.1126/science.aar6245",
  },
};

export const FE_BIO_PROMPTS: readonly PromptSpec[] = [
  FE_BIO_01_PROMPT,
  FE_BIO_02_PROMPT,
  FE_BIO_03_PROMPT,
  FE_BIO_04_PROMPT,
  FE_BIO_05_PROMPT,
  FE_BIO_06_PROMPT,
  FE_BIO_07_PROMPT,
  FE_BIO_08_PROMPT,
  FE_BIO_09_PROMPT,
  FE_BIO_10_PROMPT,
];


/**
 * FE-4: 工程生物学、合成基因组与先进生物制造 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）
 */
export const FE_BIO_SUITE_PROMPT: PromptSpec = {
  id: "fe-bio-v1",
  label: "FE-4: 工程生物学与先进生物制造（十题组）",
  template: "FE-4: 工程生物学、合成基因组与先进生物制造 前沿工程十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",
  variables: [],
    candidates: [
    {
      id: FE_BIO_01_PROMPT.id,
      label: "epegRNA 3' evoPreQ1 假结与 PEmax 逆转录复合体",
      text: FE_BIO_01_PROMPT.template,
      standard: FE_BIO_01_PROMPT.standard,
    },
    {
      id: FE_BIO_02_PROMPT.id,
      label: "TadA-NW1 活性空腔位阻限制与避免旁观者误突变",
      text: FE_BIO_02_PROMPT.template,
      standard: FE_BIO_02_PROMPT.standard,
    },
    {
      id: FE_BIO_03_PROMPT.id,
      label: "从头设计机械拓扑联锁 D8-C4 旋转纳米马达",
      text: FE_BIO_03_PROMPT.template,
      standard: FE_BIO_03_PROMPT.standard,
    },
    {
      id: FE_BIO_04_PROMPT.id,
      label: "SORT-LNP 靶向递送与内吞体倒六角相 ($H_{II}$) 破壁",
      text: FE_BIO_04_PROMPT.template,
      standard: FE_BIO_04_PROMPT.standard,
    },
    {
      id: FE_BIO_05_PROMPT.id,
      label: "T-DXd 组织蛋白酶 B 裂解与 DXd 旁观者跨膜扩散",
      text: FE_BIO_05_PROMPT.template,
      standard: FE_BIO_05_PROMPT.standard,
    },
    {
      id: FE_BIO_06_PROMPT.id,
      label: "刚性蜂窝 DNA 折纸双重适配体 AND-gate 铰链展开",
      text: FE_BIO_06_PROMPT.template,
      standard: FE_BIO_06_PROMPT.standard,
    },
    {
      id: FE_BIO_07_PROMPT.id,
      label: "八重对称 NPC 支架与 FG-Nup 相分离分子筛瞬态渗流",
      text: FE_BIO_07_PROMPT.template,
      standard: FE_BIO_07_PROMPT.standard,
    },
    {
      id: FE_BIO_08_PROMPT.id,
      label: "驱动蛋白 Kinesin-1 手把手 16.4/8.2nm 微管步进",
      text: FE_BIO_08_PROMPT.template,
      standard: FE_BIO_08_PROMPT.standard,
    },
    {
      id: FE_BIO_09_PROMPT.id,
      label: "ATP 合酶 $c_8$ 环质子旋转与不对称 $\\gamma$ 轴扭矩传递",
      text: FE_BIO_09_PROMPT.template,
      standard: FE_BIO_09_PROMPT.standard,
    },
    {
      id: FE_BIO_10_PROMPT.id,
      label: "Cas12a 靶标激活 RuvC 盖板打开与 ssDNA 附带切割",
      text: FE_BIO_10_PROMPT.template,
      standard: FE_BIO_10_PROMPT.standard,
    },
  ],
  source: null,
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "工程生物学核心催化机制、大分子构型与仿生纳米机器",
    groundTruth: "以 PDB 实验冷冻电镜结构（8WUV、6VPC、8GA9、7R5J等）为基准，准确刻画催化中心离子配位、空间位阻、拓扑联锁与非欧几何。",
    evaluationCriteria: "1. 分子拓扑：准确还原双叶片/手掌状结构域与纳米间隙（<3Å 位阻）；2. 动态相变：严格遵守力化循环与相分离渗流过程；3. 语法规范：XML 严格合法，无交互 JS。",
    referenceSource: "https://www.rcsb.org",
  },
};

export const FE_BIO_INDIVIDUAL_PROMPTS = FE_BIO_PROMPTS;

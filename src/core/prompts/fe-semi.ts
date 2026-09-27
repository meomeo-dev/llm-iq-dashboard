/**
 * FE-2: 先进微电子、次埃米半导体与光电互连工程 前沿评测题库。
 * 全量采用纯直观可视自闭合矢量 SVG（零外部 JS，无交互式事件，支持并排直接肉眼对比）。
 */

import type { PromptSpec } from "../prompt";

/**
 * FE-SEMI-01: A16 埃米级全环绕栅极纳米片（GAA Nanosheet）立体截面与能带弯曲剖面
 */
export const FE_SEMI_01_PROMPT: PromptSpec = {
  id: "FE-SEMI-01",
  label: "A16 埃米级全环绕栅极纳米片（GAA Nanosheet）立体截面与能带弯曲剖面 (Sub-2nm Angstrom-Class GAA Nanosheet Cross-Section & HKMG Band Diagram)",
  template: "Generate an SVG technical visualization of Sub-2nm Angstrom-Class GAA Nanosheet Cross-Section & HKMG Band Diagram as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 进入 A16（1.6nm 埃米节点）后，传统 FinFET 彻底退场，GAA 纳米片（Nanosheet FET / RibbonFET）成为绝对主力。器件采用多层水平单晶硅纳米片，被原子层沉积（ALD）形成的超薄 High-k 栅介质层（$HfO_2$）和功函数金属层（TiN/TaN）360° 全方位物理环绕，以获得近乎理想的亚阈值摆幅（SS $\\sim 65\\,\\text{mV/dec}$）和漏极诱导势垒降低（DIBL $< 40\\,\\text{mV/V}$）。 Physical & Mathematical Ground Truth: 1. **纳米片沟道几何尺寸**：三层垂直平行排列的单晶硅纳米片（Channel 1/2/3），片厚度 $T_{ns} = 5.0\\,\\text{nm} \\pm 0.5\\,\\text{nm}$，片宽度 $W_{ns} = 22.0\\,\\text{nm} \\pm 1.0\\,\\text{nm}$，片间垂直间距（Sheet-to-Sheet Pitch）$S_{gap} = 10.0\\,\\text{nm} \\pm 1.0\\,\\text{nm}$。 2. **栅堆叠（Gate Stack）**： - 界面化学氧化层（IL $\\text{SiO}_x$）：厚度 $0.6\\,\\text{nm}$。 - 高介电常数绝缘层（ALD $\\text{HfO}_2$, $k \\approx 22$）：物理厚度 $1.4\\,\\text{nm}$，等效氧化层厚度 $\\text{EOT} = 0.65\\,\\text{nm}$。 - 功函数调节金属层（WFM，如 TiN / TiAlC）：厚度 $2.0\\,\\text{nm}$。 - 低阻金属填充栅极（ALD W 或 Ru 填充芯）：填满纳米片之间剩余的微缝空间。 3. **内部侧墙（Inner Spacer）**：低介电常数 SiBCN/SiOCN 内部隔离柱，厚度 $T_{isp} = 6.0\\,\\text{nm}$，精确隔离源/漏外延层与金属栅极。 4. **源/漏外延区（S/D Epitaxy）**：nFET 采用原位磷掺杂硅碳（Si:P/Si:CP，$N_D \\ge 3\\times 10^{20}\\,\\text{cm}^{-3}$），侧向呈特征性菱形/六角外延截面。 5. **能带剖面示意（Band Diagram Side-Plot）**：右侧联动展示沿沟道截面法向的导带底 $E_c$、价带顶 $E_v$ 与费米能级 $E_F$。在栅压 $V_G > V_{th}$ 下，沟道表面呈现平滑下弯，形成量子阱限制态态密度与电子积累层。 Visual Inspection Criteria: - **几何拓扑与层序**：必须清晰呈现严格平行的 3 层独立纳米片，每层纳米片四周被 IL、$\\text{HfO}_2$、WFM 闭环全包覆（Gate-All-Around），无断开与交叉。 - **尺寸比率对准**：纳米片宽厚比 $W_{ns}/T_{ns}$ 必须在 $4.0\\text{–}4.8$ 之间；片间距与片厚比必须在 $1.8\\text{–}2.2$ 之间。 - **颜色分层与色标**：Si沟道（暗蓝灰色）、$\\text{HfO}_2$（高亮浅蓝/青色细轮廓）、WFM（金色/琥珀色）、Inner Spacer（浅灰色钝化块）、S/D外延（翡翠绿色），各材料层必须具备独立语义标签与标注线。 - **能带对准准确性**：禁带宽度 $E_g \\approx 1.12\\,\\text{eV}$，界面带阶（Band Offset）正确，栅电压偏置下能带弯曲曲率方向正确无误。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- IEDM 2024 / VLSI 2025: TSMC & imec GAA Nanosheet Platform. - IEEE Trans. Electron Devices: Multi-VT HKMG Engineering for Sub-2nm Nanosheets.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "A16 埃米级全环绕栅极纳米片（GAA Nanosheet）立体截面与能带弯曲剖面",
    groundTruth: "1. **纳米片沟道几何尺寸**：三层垂直平行排列的单晶硅纳米片（Channel 1/2/3），片厚度 $T_{ns} = 5.0\\,\\text{nm} \\pm 0.5\\,\\text{nm}$，片宽度 $W_{ns} = 22.0\\,\\text{nm} \\pm 1.0\\,\\text{nm}$，片间垂直间距（Sheet-to-Sheet Pitch）$S_{gap} = 10.0\\,\\text{nm} \\pm 1.0\\,\\text{nm}$。 2. **栅堆叠（Gate Stack）**： - 界面化学氧化层（IL $\\text{SiO}_x$）：厚度 $0.6\\,\\text{nm}$。 - 高介电常数绝缘层（ALD $\\text{HfO}_2$, $k \\approx 22$）：物理厚度 $1.4\\,\\text{nm}$，等效氧化层厚度 $\\text{EOT} = 0.65\\,\\text{",
    evaluationCriteria: "- **几何拓扑与层序**：必须清晰呈现严格平行的 3 层独立纳米片，每层纳米片四周被 IL、$\\text{HfO}_2$、WFM 闭环全包覆（Gate-All-Around），无断开与交叉。 - **尺寸比率对准**：纳米片宽厚比 $W_{ns}/T_{ns}$ 必须在 $4.0\\text{–}4.8$ 之间；片间距与片厚比必须在 $1.8\\text{–}2.2$ 之间。 - **颜色分层与色标**：Si沟道（暗蓝灰色）、$\\text{HfO}_2$（高亮浅蓝/青色细轮廓）、WFM（金色/琥珀色）、Inner Spacer（浅灰色钝化块）、S/D外延（翡翠绿色），各材料层必须具备独立语义标签与标注线。 - **能带对准准确性**：禁带宽度 $E_g \\approx 1.12\\,\\text{eV}$，界面带阶（Band Offset）正确，栅电压偏置下能带弯曲曲率方向正确无误。",
    referenceSource: "- IEDM 2024 / VLSI 2025: TSMC & imec GAA Nanosheet Platform. - IEEE Trans. Electron Devices: Multi-VT HKMG Engineering for Sub-2nm Nanosheets.",
  },
};

/**
 * FE-SEMI-02: 背面供电网络（BSPDN）Super Power Rail 与纳米硅通孔（nTSV）双面互联架构
 */
export const FE_SEMI_02_PROMPT: PromptSpec = {
  id: "FE-SEMI-02",
  label: "背面供电网络（BSPDN）Super Power Rail 与纳米硅通孔（nTSV）双面互联架构 (Backside Power Delivery Network (BSPDN) Super Power Rail & nTSV Interconnect)",
  template: "Generate an SVG technical visualization of Backside Power Delivery Network (BSPDN) Super Power Rail & nTSV Interconnect as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 在亚 2nm 时代，正面互连层（BEOL）的 RC 延迟和 IR Drop（电源电压降）已成为芯片主频提升的头号瓶颈。TSMC A16 的 Super Power Rail（SPR）与 Intel 18A 的 PowerVia 将电源网络（$V_{DD}$ 与 $V_{SS}$）完全剥离并转移至晶圆背面，正面仅保留高密度信号布线（M0-M15）。通过在晶圆减薄后制造深宽比极高、直接打入晶体管源/漏区的垂直纳米硅通孔（nTSV），使动态压降降低达 30% 以上，标准单元面积缩减 10% 以上。 Physical & Mathematical Ground Truth: 1. **垂直双面分层堆叠架构**： - **正面互连区（Frontside BEOL）**：M0 信号金属线（间距放宽至 $36\\,\\text{nm}$），M1/M2 紧凑铜布线，低介电常数 Low-k 介质包覆。 - **晶体管活性层（Device Active Layer）**：厚度仅 $15\\text{–}25\\,\\text{nm}$ 的超薄单晶硅外延片层，包含 GAA 纳米片及其源漏外延区。 - **超薄减薄硅衬底**：残留硅基底厚度通过高精度 CMP 抛光至 $d_{sub} \\le 100\\,\\text{nm}$。 - **背面供电网络（Backside PDN）**：背面厚铜金属层（BM0, BM1, BM2），金属线厚度达 $100\\text{–}300\\,\\text{nm}$ 以实现超低内阻（$R_{\\square} < 0.1\\,\\Omega/\\text{sq}$）。 2. **纳米硅通孔（nTSV / Backside Contact）**： - 底部纳米级通孔直径 $D_{nTSV} = 20\\,\\text{nm} \\pm 3\\,\\text{nm}$。 - 高度 $H_{nTSV} = 80\\text{–}120\\,\\text{nm}$（深宽比 $\\text{AR} \\approx 4:1\\text{–}6:1$）。 - 顶部直接终止并冶金键合于晶体管源极/漏极硅化物界面（如 Ti-silicide，接触电阻率 $\\rho_c < 1.5\\times 10^{-9}\\,\\Omega\\cdot\\text{cm}^2$），完全绕开正面 M0 拥堵区。 3. **钝化与介质隔离（Backside Dielectric Isolation, BDI）**：nTSV 侧壁配备 $2\\,\\text{nm}$ 厚度的 ALD $\\text{SiN}_x$ 阻挡层以防止 Cu 原子向硅沟道热扩散。 Visual Inspection Criteria: - **上下镜像分流视觉流线**：必须肉眼一眼分清“上方为正面密密麻麻的细线条信号布线，中央为微型晶体管，下方为宽粗的背面供电厚金属层”。 - **nTSV 垂直贯穿性**：nTSV 必须自背面厚金属轨道垂直向上穿透减薄基底，精准对接晶体管底部的接触区，绝不能与门极（Gate）发生几何粘连或重叠。 - **等势线与 IR 压降分布伪彩**：图例中必须嵌入对比热力图（传统正面供电中 Vdd 凹陷红斑 vs BSPDN 中扁平稳态浅绿色梯度）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- W. Hafez et al. (Intel), \"Intel PowerVia Technology: Backside Power Delivery for High Density and High-Performance Computing\", 2023 IEEE Symp. on VLSI Tech. and Circuits. - TSMC A16 Technology White",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "背面供电网络（BSPDN）Super Power Rail 与纳米硅通孔（nTSV）双面互联架构",
    groundTruth: "1. **垂直双面分层堆叠架构**： - **正面互连区（Frontside BEOL）**：M0 信号金属线（间距放宽至 $36\\,\\text{nm}$），M1/M2 紧凑铜布线，低介电常数 Low-k 介质包覆。 - **晶体管活性层（Device Active Layer）**：厚度仅 $15\\text{–}25\\,\\text{nm}$ 的超薄单晶硅外延片层，包含 GAA 纳米片及其源漏外延区。 - **超薄减薄硅衬底**：残留硅基底厚度通过高精度 CMP 抛光至 $d_{sub} \\le 100\\,\\text{nm}$。 - **背面供电网络（Backside PDN）**：背面厚铜金属层（BM0, BM1, BM2），金属线厚度达 $100\\text{–}300\\,\\text{nm}$ 以实现超低内阻（$R_{\\square} < 0.1\\,\\Omega/\\text{sq}$）。",
    evaluationCriteria: "- **上下镜像分流视觉流线**：必须肉眼一眼分清“上方为正面密密麻麻的细线条信号布线，中央为微型晶体管，下方为宽粗的背面供电厚金属层”。 - **nTSV 垂直贯穿性**：nTSV 必须自背面厚金属轨道垂直向上穿透减薄基底，精准对接晶体管底部的接触区，绝不能与门极（Gate）发生几何粘连或重叠。 - **等势线与 IR 压降分布伪彩**：图例中必须嵌入对比热力图（传统正面供电中 Vdd 凹陷红斑 vs BSPDN 中扁平稳态浅绿色梯度）。",
    referenceSource: "- W. Hafez et al. (Intel), \"Intel PowerVia Technology: Backside Power Delivery for High Density and High-Performance Computing\", 2023 IEEE Symp. on VLSI Tech. and Circuits. - TSMC A16 Technology Whitepaper (April 2024 / 2026).",
  },
};

/**
 * FE-SEMI-03: 单片垂直三维互补场效应晶体管（mCFET）中间介质隔离（MDI）与垂直触点架构
 */
export const FE_SEMI_03_PROMPT: PromptSpec = {
  id: "FE-SEMI-03",
  label: "单片垂直三维互补场效应晶体管（mCFET）中间介质隔离（MDI）与垂直触点架构 (Monolithic 3D Complementary FET (mCFET) with Middle Dielectric Isolation)",
  template: "Generate an SVG technical visualization of Monolithic 3D Complementary FET (mCFET) with Middle Dielectric Isolation as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 在 A7（0.7nm 级）未来逻辑演进中，水平并排的 CMOS 标准单元（nFET 与 pFET 并立）已达到光刻与物理缩放的极限。单片互补场效应晶体管（mCFET）通过在同一晶圆表面垂直自底向上单片堆叠（如底部 pFET，顶部 nFET），消除了 n-p 边界隔离区（n-to-p spacing），使得逻辑单元面积直接缩减 50%。其核心工程瓶颈在于上下两个晶体管之间的“中间介质隔离层（MDI）”，以及穿透顶层引出底层器件的垂直自对准触点。 Physical & Mathematical Ground Truth: 1. **垂直单片双层堆叠结构**： - **底部器件（Bottom Device，如 pFET）**：2 层单晶 SiGe 或 Si 纳米片，配备 p 型 SiGe:B 菱形外延源漏区。 - **顶部器件（Top Device，如 nFET）**：2 层单晶 Si 纳米片，配备 n 型 Si:P 外延源漏区。 - **垂直中心间距**：顶部沟道中心线到底部沟道中心线的垂直距离为 $50.0\\,\\text{nm} \\pm 5.0\\,\\text{nm}$。 2. **中间介质隔离层（MDI, Middle Dielectric Isolation）**： - 材料：ALD 填充的高热稳定性 $\\text{SiO}_2$ / $\\text{SiN}_x$ 双层纳米电介质。 - 物理厚度：$H_{MDI} = 30.0\\,\\text{nm} \\pm 3.0\\,\\text{nm}$（工艺极限下限为 $30\\,\\text{nm}$）。 - 隔离电阻率：击穿电场强度 $> 8\\,\\text{MV/cm}$，漏电流密度 $< 10^{-10}\\,\\text{A/cm}^2$。 3. **双重功函数金属栅分离（Split Gate Dual-WFM）**：顶部 nFET 栅极填充低功函数金属（$\\Phi_{m,n} \\approx 4.1\\text{–}4.3\\,\\text{eV}$），底部 pFET 栅极填充高功函数金属（$\\Phi_{m,p} \\approx 4.9\\text{–}5.1\\,\\text{eV}$），两栅极在中部 MDI 处完全电绝缘截断，实现独立的阈值电压调节（Independent $V_t$ Tuning）。 4. **触点方案（Contact Scheme）**：顶部源漏触点从正面引出至 M0；底部源漏触点自背面通过 Direct Backside Contact 垂直引出，上下触点物理分离，消除侧向桥接短路风险。 Visual Inspection Criteria: - **上下两级晶体管的严格镜像对齐**：必须在同一垂轴上线对齐显示顶层 2 片与底层 2 片纳米片，MDI 介质层平整横贯其中。 - **功函数金属分色标定**：顶层栅与底层栅必须呈现不同的色彩标定，并在两者交界处的 MDI 边界呈现明确的物理介质绝缘隔离带。 - **S/D 掺杂极性几何对比**：清晰分辨顶部 nFET 截面外延与底部 pFET 截面外延的晶相生长形态差异。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- imec, \"Monolithic-CFET with Direct Backside Contact to Source/Drain and Backside Dielectric Isolation\", IEDM 2024, DOI: 10.1109/IEDM50854.2024.10873520. - imec, \"Scaling monolithic CFET across multi",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "单片垂直三维互补场效应晶体管（mCFET）中间介质隔离（MDI）与垂直触点架构",
    groundTruth: "1. **垂直单片双层堆叠结构**： - **底部器件（Bottom Device，如 pFET）**：2 层单晶 SiGe 或 Si 纳米片，配备 p 型 SiGe:B 菱形外延源漏区。 - **顶部器件（Top Device，如 nFET）**：2 层单晶 Si 纳米片，配备 n 型 Si:P 外延源漏区。 - **垂直中心间距**：顶部沟道中心线到底部沟道中心线的垂直距离为 $50.0\\,\\text{nm} \\pm 5.0\\,\\text{nm}$。 2. **中间介质隔离层（MDI, Middle Dielectric Isolation）**： - 材料：ALD 填充的高热稳定性 $\\text{SiO}_2$ / $\\text{SiN}_x$ 双层纳米电介质。 - 物理厚度：$H_{MDI} = 30.0\\,\\text{nm} \\pm 3.0\\,\\text{nm}$（工艺极限下限为",
    evaluationCriteria: "- **上下两级晶体管的严格镜像对齐**：必须在同一垂轴上线对齐显示顶层 2 片与底层 2 片纳米片，MDI 介质层平整横贯其中。 - **功函数金属分色标定**：顶层栅与底层栅必须呈现不同的色彩标定，并在两者交界处的 MDI 边界呈现明确的物理介质绝缘隔离带。 - **S/D 掺杂极性几何对比**：清晰分辨顶部 nFET 截面外延与底部 pFET 截面外延的晶相生长形态差异。",
    referenceSource: "- imec, \"Monolithic-CFET with Direct Backside Contact to Source/Drain and Backside Dielectric Isolation\", IEDM 2024, DOI: 10.1109/IEDM50854.2024.10873520. - imec, \"Scaling monolithic CFET across multiple logic technology nodes\", IEDM 2024.",
  },
};

/**
 * FE-SEMI-04: High-NA 0.55 EUV 8 面变形反射镜光学投影光路与光瞳中心遮挡动力学
 */
export const FE_SEMI_04_PROMPT: PromptSpec = {
  id: "FE-SEMI-04",
  label: "High-NA 0.55 EUV 8 面变形反射镜光学投影光路与光瞳中心遮挡动力学 (High-NA 0.55 EUV Anamorphic 8-Mirror Projection Optics & Central Pupil Obscuration)",
  template: "Generate an SVG technical visualization of High-NA 0.55 EUV Anamorphic 8-Mirror Projection Optics & Central Pupil Obscuration using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: ASML TWINSCAN EXE:5000 / 5200 采用了高数值孔径（High-NA = 0.55）EUV 系统，其核心为卡尔·蔡司（ZEISS SMT）研发的 8 面全反射投影物镜系统（POB, M1至M8）。为解决 0.55 NA 下掩模反射角过大导致的布拉格多层膜反射率衰减与阴影效应，系统首次采用变形光学（Anamorphic Magnification）：横向（X 方向，Slit）为 $4\\times$ 缩小倍率，纵向（Y 方向，Scan）为 $8\\times$ 缩小倍率，曝光视场减半为 $26\\,\\text{mm}\\times 16.5\\,\\text{mm}$。同时，由于反射镜空间排布避让，光瞳处产生约 20% 面积比的“中心遮挡（Central Obscuration）”。 Physical & Mathematical Ground Truth: 1. **反射镜序列与曲面拓扑**：8 面精确钼/硅（Mo/Si 周期厚度 $d \\approx 6.9\\,\\text{nm}$）多层膜高次非球面反射镜，标定为 M1、M2、M3、M4、M5、M6、M7、M8。光线从 6 英寸 EUV 光掩模（Reticle，入射主光线角 $CRAO = 5.3^\\circ$ 或 $8.8^\\circ$）发射，经物镜折叠投射到硅片表面（Wafer）。 2. **变形放大率差异（Anamorphic Factor）**： - $M_x = 0.25$（$4\\times$ 缩小，光锥半角 $\\theta_x = \\arcsin(0.55) \\approx 33.37^\\circ$）。 - $M_y = 0.125$（$8\\times$ 缩小，掩模侧角度放宽）。 3. **光瞳中心遮挡（Central Obscuration）**：在出射光瞳面（Exit Pupil），正中心存在一个无光线通过的环形/椭圆形阴影区，遮挡半径比约为 $r_{obs}/r_{pupil} \\approx 0.20$（面积遮挡率约为 $20\\%$）。 4. **SMIL 连续动态光子波前推进**： - 波长 $\\lambda = 13.5\\,\\text{nm}$ 的 EUV 脉冲以正弦光束/离散光子包形式，从 Reticle 表面沿 M1 $\\to$ M2 $\\to$ M3 $\\to$ M4 $\\to$ M5 $\\to$ M6 $\\to$ M7 $\\to$ M8 连续反弹，在 $4.0\\,\\text{s}$ 循环周期内匀速汇聚至 Wafer 聚焦点（直径 $< 8\\,\\text{nm}$ 点斑）。 Visual Inspection Criteria: - **8面反射镜拓扑完整性**：必须包含编号 M1 至 M8 的 8 块独立反射镜实体，每块镜面具有符合近轴光学的凸凹曲率几何。 - **光路不重叠自交性**：动态光束在两两镜面之间的反射角必须精确等于入射角（标量公差 $< 3^\\circ$）。 - **光瞳面中心空心环**：光束在经过中间光瞳位置时，中心必须呈现纯黑透空圆环，且外环光线无缝绕过中心遮挡区。 - **无 JS 纯 SMIL 动画合规**：仅采用 `<animate>`, `<animateTransform>` 或 CSS `@keyframes` 驱动光线沿 `<path>` 推进，严禁 `<script>`。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- J. van Schoot et al., \"Next step in Moore's law: high NA EUV system overview and first imaging and overlay performance\", J. Micro/Nanopatterning, Mater. Metrol. 24(1), 011009 (2024), DOI: 10.1117/1.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "High-NA 0.55 EUV 8 面变形反射镜光学投影光路与光瞳中心遮挡动力学",
    groundTruth: "1. **反射镜序列与曲面拓扑**：8 面精确钼/硅（Mo/Si 周期厚度 $d \\approx 6.9\\,\\text{nm}$）多层膜高次非球面反射镜，标定为 M1、M2、M3、M4、M5、M6、M7、M8。光线从 6 英寸 EUV 光掩模（Reticle，入射主光线角 $CRAO = 5.3^\\circ$ 或 $8.8^\\circ$）发射，经物镜折叠投射到硅片表面（Wafer）。 2. **变形放大率差异（Anamorphic Factor）**： - $M_x = 0.25$（$4\\times$ 缩小，光锥半角 $\\theta_x = \\arcsin(0.55) \\approx 33.37^\\circ$）。 - $M_y = 0.125$（$8\\times$ 缩小，掩模侧角度放宽）。 3. **光瞳中心遮挡（Central Obscuration）**：在出射光瞳面（Exit Pup",
    evaluationCriteria: "- **8面反射镜拓扑完整性**：必须包含编号 M1 至 M8 的 8 块独立反射镜实体，每块镜面具有符合近轴光学的凸凹曲率几何。 - **光路不重叠自交性**：动态光束在两两镜面之间的反射角必须精确等于入射角（标量公差 $< 3^\\circ$）。 - **光瞳面中心空心环**：光束在经过中间光瞳位置时，中心必须呈现纯黑透空圆环，且外环光线无缝绕过中心遮挡区。 - **无 JS 纯 SMIL 动画合规**：仅采用 `<animate>`, `<animateTransform>` 或 CSS `@keyframes` 驱动光线沿 `<path>` 推进，严禁 `<script>`。",
    referenceSource: "- J. van Schoot et al., \"Next step in Moore's law: high NA EUV system overview and first imaging and overlay performance\", J. Micro/Nanopatterning, Mater. Metrol. 24(1), 011009 (2024), DOI: 10.1117/1.JMM.24.1.011009. - SPIE Advanced Lithography & Patterning Proceedings 2024/2025.",
  },
};

/**
 * FE-SEMI-05: 共封装光学（CPO）硅光子微环谐振器（MRR）热光相移与倏逝波共振滤波动力学
 */
export const FE_SEMI_05_PROMPT: PromptSpec = {
  id: "FE-SEMI-05",
  label: "共封装光学（CPO）硅光子微环谐振器（MRR）热光相移与倏逝波共振滤波动力学 (CPO Silicon Photonic Micro-ring Resonator Evanescent Coupling & Thermo-optic Tuning)",
  template: "Generate an SVG technical visualization of CPO Silicon Photonic Micro-ring Resonator Evanescent Coupling & Thermo-optic Tuning using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 在 AI 超算集群 3.2T / 6.4T 共封装光学（CPO）交换机中，微环谐振器（MRR）因其占地极小（半径 $R \\le 10\\,\\mu\\text{m}$）和高能效（$< 50\\,\\text{fJ/bit}$）成为高密度波分复用（WDM）光互连的核心收发器件。然而硅材料具有巨大的热光系数（$dn/dT \\approx 1.86\\times 10^{-4}\\,\\text{K}^{-1}$），工作温度微小漂移便会导致共振波长偏离。通过微型集成金属加热器（Micro-heater）对微环施加毫瓦级热功率，可以精确调整微环内有效折射率，实现波长锁定与倏逝波高效滤波下载（Drop Port）。 Physical & Mathematical Ground Truth: 1. **波导物理几何**： - 直总线波导（Bus Waveguide）与环形波导（Ring Waveguide）：截面均为脊形硅单模波导，宽度 $w = 450\\,\\text{nm} \\pm 10\\,\\text{nm}$，高度 $h = 220\\,\\text{nm}$。 - 微环外半径：$R = 5.0\\,\\mu\\text{m} \\pm 0.2\\,\\mu\\text{m}$。 - 耦合间隙（Coupling Gap）：$G_{coup} = 150\\,\\text{nm} \\pm 15\\,\\text{nm}$。 2. **热光调节参数与方程**： - 硅热光系数：$dn/dT = 1.86\\times 10^{-4}\\,\\text{K}^{-1}$。 - 谐振波长公式：$m \\lambda_{res} = 2 \\pi R n_{eff}$（在 $\\lambda = 1550\\,\\text{nm}$ 附近，模式阶数 $m \\approx 45$）。 - 热调灵敏度：$d\\lambda/dT \\approx 70\\text{–}80\\,\\text{pm/}^\\circ\\text{C}$，热调效率约 $0.25\\,\\text{nm/mW}$。 3. **倏逝波耦合场强衰减**：波导外电磁场衰减因子 $\\gamma = \\frac{2\\pi}{\\lambda}\\sqrt{n_{eff}^2 - n_{clad}^2}$，在间隙中呈现指数衰减 $E(x) = E_0 e^{-\\gamma x}$。 4. **动力学动画表现**： - **非共振态（加热器关闭，$\\Delta T = 0$）**：Input 端输入多波长光波直接从 Through 端穿出，微环内部无光场积聚。 - **共振锁定态（加热器开启，周期性热波扩散）**：微环内光场强度由于相干叠加发生强烈共振增强（Q-Factor $> 20,000$），光强经倏逝波耦合从 Drop 端强力输出，波前以 $3.0\\,\\text{s}$ 循环平滑在圆环内旋转流动。 Visual Inspection Criteria: - **驻波波节数准确性**：环形波导内部的光波节点相位必须在 $2\\pi$ 周长上闭合自洽（节点数为整数）。 - **耦合区指数场强渗入**：在 $150\\,\\text{nm}$ 空隙内必须清晰可视化横向渗出的高斯/指数光晕衰减渐变（Gradient Fill）。 - **热扩散云图与折射率伪彩**：顶部微加热器下方伴随微秒级热传导椭圆温度场（从红色中心向外渐变扩散至暗青色基底）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- IEEE J. Sel. Top. Quantum Electron.: \"High-Performance Silicon Photonics Using Heterogeneous Integration\", DOI: 10.1109/JSTQE.2021.3126124. - ISSCC 2024: Low-Power Closed-Loop Thermal Tuning of Sili",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "共封装光学（CPO）硅光子微环谐振器（MRR）热光相移与倏逝波共振滤波动力学",
    groundTruth: "1. **波导物理几何**： - 直总线波导（Bus Waveguide）与环形波导（Ring Waveguide）：截面均为脊形硅单模波导，宽度 $w = 450\\,\\text{nm} \\pm 10\\,\\text{nm}$，高度 $h = 220\\,\\text{nm}$。 - 微环外半径：$R = 5.0\\,\\mu\\text{m} \\pm 0.2\\,\\mu\\text{m}$。 - 耦合间隙（Coupling Gap）：$G_{coup} = 150\\,\\text{nm} \\pm 15\\,\\text{nm}$。 2. **热光调节参数与方程**： - 硅热光系数：$dn/dT = 1.86\\times 10^{-4}\\,\\text{K}^{-1}$。 - 谐振波长公式：$m \\lambda_{res} = 2 \\pi R n_{eff}$（在 $\\lambda = 1550\\,\\text{",
    evaluationCriteria: "- **驻波波节数准确性**：环形波导内部的光波节点相位必须在 $2\\pi$ 周长上闭合自洽（节点数为整数）。 - **耦合区指数场强渗入**：在 $150\\,\\text{nm}$ 空隙内必须清晰可视化横向渗出的高斯/指数光晕衰减渐变（Gradient Fill）。 - **热扩散云图与折射率伪彩**：顶部微加热器下方伴随微秒级热传导椭圆温度场（从红色中心向外渐变扩散至暗青色基底）。",
    referenceSource: "- IEEE J. Sel. Top. Quantum Electron.: \"High-Performance Silicon Photonics Using Heterogeneous Integration\", DOI: 10.1109/JSTQE.2021.3126124. - ISSCC 2024: Low-Power Closed-Loop Thermal Tuning of Silicon Microring Links.",
  },
};

/**
 * FE-SEMI-06: 玻璃核心基板（Glass Core Substrate）高深宽比 TGV 微通孔与热机应力集中分布剖面
 */
export const FE_SEMI_06_PROMPT: PromptSpec = {
  id: "FE-SEMI-06",
  label: "玻璃核心基板（Glass Core Substrate）高深宽比 TGV 微通孔与热机应力集中分布剖面 (Glass Core Substrate High-Aspect-Ratio TGV & Von Mises Thermal Stress Profile)",
  template: "Generate an SVG technical visualization of Glass Core Substrate High-Aspect-Ratio TGV & Von Mises Thermal Stress Profile as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 随着 AI 算力芯片封装面积突破 $100\\,\\text{mm}\\times 100\\,\\text{mm}$，传统有机基板（Organic Substrate / ABF）面临翘曲失控（Warpage）、刚度不足和细间距瓶颈。以 Intel 和 Absolics 为代表的“玻璃基板（Glass Core）”凭借超低翘曲、与硅相近的热膨胀系数（$\\text{CTE}_{glass} \\approx 3.2\\times 10^{-6}\\,\\text{K}^{-1}$）和优异的高频电介质常数，成为下一代超大芯片封装的基石。然而，填充于穿玻璃通孔（TGV, Through-Glass Via）内的电镀铜（$\\text{CTE}_{Cu} \\approx 16.7\\times 10^{-6}\\,\\text{K}^{-1}$）与玻璃之间存在高达 5 倍的 CTE 失配，在制造降温和工作发热过程中通孔边缘会产生数以百兆帕（MPa）的巨大 Von Mises 应力集中，易引发玻璃微裂纹。 Physical & Mathematical Ground Truth: 1. **基板与通孔微观几何**： - 超薄无碱硼硅酸盐玻璃基板厚度：$H_{glass} = 400\\,\\mu\\text{m} \\pm 20\\,\\mu\\text{m}$。 - 激光诱导深度刻蚀（LIDE, Laser Induced Deep Etching）制成的双曲沙漏型（Hourglass/X-shape）通孔：孔口直径 $D_{top} = 30\\,\\mu\\text{m}$，腰部最窄直径 $D_{waist} = 18\\,\\mu\\text{m}$，深宽比 $\\text{AR} \\approx 15:1$。 - 通孔中心间距（Pitch）：$P = 70\\,\\mu\\text{m}$。 2. **界面冶金与阻挡层**： - 玻璃孔壁粘附/阻挡层：PVD 溅射 Ti / TiN（厚度 $30\\text{–}50\\,\\text{nm}$）。 - 填充导电介质：无空洞（Void-free）电镀高纯铜芯。 3. **有限元热机应力场（Von Mises Stress Distribution）标定**： - 载荷条件：由退火温度 $260^\\circ\\text{C}$ 冷却至室温 $25^\\circ\\text{C}$（$\\Delta T = -235\\,\\text{K}$）。 - 峰值应力区（应力奇异点）：集中在通孔两端与表面再分布层（RDL）接触的拐角边缘以及腰部曲率拐点，Von Mises 应力达到峰值 $\\sigma_{vm} \\ge 350\\,\\text{MPa}$（标定为深红色）。 - 内部及远场基板：应力快速衰减至 $< 50\\,\\text{MPa}$（标定为深青色/紫色安全区）。 Visual Inspection Criteria: - **TGV 经典沙漏型双曲外形还原**：通孔侧壁必须为向内平滑凹陷的对称双曲线，孔口平滑倒圆角（Fillet radius $r \\approx 3\\,\\mu\\text{m}$），绝不能简单画成直筒圆柱。 - **应力彩虹伪彩等值线图（Isostress Contours）**：必须具备标准的应力伪彩条（Colorbar，从 0 到 400 MPa），并在通孔拐角处呈现高密度的同心弧形闭合应力等值线。 - **微裂纹潜在起始矢量指示**：在最大主拉应力垂直方向清晰标注裂纹萌生（Crack Initiation）危险箭头。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- IEEE ECTC 2024 / 2025: Thermomechanical Reliability of Through-Glass Vias in Advanced Packaging. - LPKF Laser & Electronics Technical Report: Precision LIDE processing for panel-level glass cores.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "玻璃核心基板（Glass Core Substrate）高深宽比 TGV 微通孔与热机应力集中分布剖面",
    groundTruth: "1. **基板与通孔微观几何**： - 超薄无碱硼硅酸盐玻璃基板厚度：$H_{glass} = 400\\,\\mu\\text{m} \\pm 20\\,\\mu\\text{m}$。 - 激光诱导深度刻蚀（LIDE, Laser Induced Deep Etching）制成的双曲沙漏型（Hourglass/X-shape）通孔：孔口直径 $D_{top} = 30\\,\\mu\\text{m}$，腰部最窄直径 $D_{waist} = 18\\,\\mu\\text{m}$，深宽比 $\\text{AR} \\approx 15:1$。 - 通孔中心间距（Pitch）：$P = 70\\,\\mu\\text{m}$。 2. **界面冶金与阻挡层**： - 玻璃孔壁粘附/阻挡层：PVD 溅射 Ti / TiN（厚度 $30\\text{–}50\\,\\text{nm}$）。 - 填充导电介质：无空洞（Void-free）",
    evaluationCriteria: "- **TGV 经典沙漏型双曲外形还原**：通孔侧壁必须为向内平滑凹陷的对称双曲线，孔口平滑倒圆角（Fillet radius $r \\approx 3\\,\\mu\\text{m}$），绝不能简单画成直筒圆柱。 - **应力彩虹伪彩等值线图（Isostress Contours）**：必须具备标准的应力伪彩条（Colorbar，从 0 到 400 MPa），并在通孔拐角处呈现高密度的同心弧形闭合应力等值线。 - **微裂纹潜在起始矢量指示**：在最大主拉应力垂直方向清晰标注裂纹萌生（Crack Initiation）危险箭头。",
    referenceSource: "- IEEE ECTC 2024 / 2025: Thermomechanical Reliability of Through-Glass Vias in Advanced Packaging. - LPKF Laser & Electronics Technical Report: Precision LIDE processing for panel-level glass cores.",
  },
};

/**
 * FE-SEMI-07: 16-High HBM4 超薄 DRAM 无凸块直接铜-铜混合键合（Cu-Cu Hybrid Bonding）原子级界面切片
 */
export const FE_SEMI_07_PROMPT: PromptSpec = {
  id: "FE-SEMI-07",
  label: "16-High HBM4 超薄 DRAM 无凸块直接铜-铜混合键合（Cu-Cu Hybrid Bonding）原子级界面切片 (16-High HBM4 Bumpless Direct Cu-Cu Hybrid Bonding Interface & Thermomechanical Profile)",
  template: "Generate an SVG technical visualization of 16-High HBM4 Bumpless Direct Cu-Cu Hybrid Bonding Interface & Thermomechanical Profile as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 16 层堆叠的高带宽内存（16-High HBM4 / HBM4E）单颗总容量达到 64GB 以上，接口位宽翻倍至 2048-bit。传统基于微凸块（Microbump，间距 $\\ge 25\\,\\mu\\text{m}$，高度 $\\sim 10\\,\\mu\\text{m}$）的回流焊工艺已达到物理极限，会导致总厚度突破 JEDEC 限制（$775\\,\\mu\\text{m}$）并引发热阻飙升。采用直接铜-铜无凸块混合键合（Direct Cu-Cu Hybrid Bonding / DBI）技术，将铜电极直接埋入超平坦无定形 SiCN / $\\text{SiO}_2$ 介电介质中，使层间键合间距缩减至 $\\le 1.0\\,\\mu\\text{m}$，界面总厚度降为零，热阻降低 40% 以上。 Physical & Mathematical Ground Truth: 1. **多层超薄 DRAM 垂直宏观级联**： - 底层逻辑基础芯片（Logic Base Die，采用先进 4nm/5nm 工艺制备）。 - 上层垂直紧密压合的 16 层超薄 DRAM 晶粒，每片 DRAM 经超精密 CMP 减薄至 $t_{die} = 30.0\\,\\mu\\text{m} \\pm 1.5\\,\\mu\\text{m}$。 - 贯穿微 TSV（Micro-TSV）：直径 $D = 1.5\\,\\mu\\text{m}$，高度 $30\\,\\mu\\text{m}$。 2. **混合键合纳米级界面切片（放大图）**： - 键合电极间距（Pad Pitch）：$P_{pad} = 1.0\\,\\mu\\text{m} \\pm 0.1\\,\\mu\\text{m}$。 - 铜电极垫直径：$D_{pad} = 0.5\\,\\mu\\text{m}$。 - CMP 纳米碟形凹陷（Cu Dishing / Recess）：预键合状态下铜垫表面微凹陷深度必须控制在 $h_{recess} = 2.0\\text{–}3.5\\,\\text{nm}$。 - 退火再结晶（Annealing at $200\\text{–}300^\\circ\\text{C}$）：由于铜热膨胀率大于介质，铜垫受热膨胀填满纳米凹隙，铜原子跨界面相互扩散生长出跨晶界晶粒（Grain boundary migration），接触界面完全无缝闭合（Void-free）。 3. **介电粘附层**：等离子体活化的高密度 SiCN 绝缘膜，通过 Si-O-Si 或 Si-N-Si 共价键在室温预键合时实现瞬间自发贴合。 Visual Inspection Criteria: - **16层层级完整数数判定**：宏观透视图中必须准确包含且仅包含 16 层紧凑排布的 DRAM 芯片条带和 1 层基底逻辑芯片。 - **微观界面三段论对比**：微观放大窗口中必须清晰展示“预键合（带有 3nm 微凹痕与界线）”与“退火后（铜晶界穿透接缝熔合一体、无空洞）”的状态对比。 - **对准公差（Overlay Misalignment）指示**：标注侧向对准偏差容限 $\\Delta x \\le 100\\,\\text{nm}$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- IEEE ECTC 2024 / 2025: Sub-micron Cu-Cu Hybrid Bonding for High-Stack Memory. - Samsung / SK Hynix HBM4 Advanced Packaging Technical Symposia 2024/2026.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "16-High HBM4 超薄 DRAM 无凸块直接铜-铜混合键合（Cu-Cu Hybrid Bonding）原子级界面切片",
    groundTruth: "1. **多层超薄 DRAM 垂直宏观级联**： - 底层逻辑基础芯片（Logic Base Die，采用先进 4nm/5nm 工艺制备）。 - 上层垂直紧密压合的 16 层超薄 DRAM 晶粒，每片 DRAM 经超精密 CMP 减薄至 $t_{die} = 30.0\\,\\mu\\text{m} \\pm 1.5\\,\\mu\\text{m}$。 - 贯穿微 TSV（Micro-TSV）：直径 $D = 1.5\\,\\mu\\text{m}$，高度 $30\\,\\mu\\text{m}$。 2. **混合键合纳米级界面切片（放大图）**： - 键合电极间距（Pad Pitch）：$P_{pad} = 1.0\\,\\mu\\text{m} \\pm 0.1\\,\\mu\\text{m}$。 - 铜电极垫直径：$D_{pad} = 0.5\\,\\mu\\text{m}$。 - CMP 纳米碟形凹陷（Cu Dishing /",
    evaluationCriteria: "- **16层层级完整数数判定**：宏观透视图中必须准确包含且仅包含 16 层紧凑排布的 DRAM 芯片条带和 1 层基底逻辑芯片。 - **微观界面三段论对比**：微观放大窗口中必须清晰展示“预键合（带有 3nm 微凹痕与界线）”与“退火后（铜晶界穿透接缝熔合一体、无空洞）”的状态对比。 - **对准公差（Overlay Misalignment）指示**：标注侧向对准偏差容限 $\\Delta x \\le 100\\,\\text{nm}$。",
    referenceSource: "- IEEE ECTC 2024 / 2025: Sub-micron Cu-Cu Hybrid Bonding for High-Stack Memory. - Samsung / SK Hynix HBM4 Advanced Packaging Technical Symposia 2024/2026.",
  },
};

/**
 * FE-SEMI-08: 原子层沉积（ALD）TMA/H2O 四阶段自限性化学吸附与表面羟基饱和动力学循环
 */
export const FE_SEMI_08_PROMPT: PromptSpec = {
  id: "FE-SEMI-08",
  label: "原子层沉积（ALD）TMA/H2O 四阶段自限性化学吸附与表面羟基饱和动力学循环 (ALD 4-Phase Self-Limiting Chemisorption & Monolayer Saturation Kinetics Cycle)",
  template: "Generate an SVG technical visualization of ALD 4-Phase Self-Limiting Chemisorption & Monolayer Saturation Kinetics Cycle using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 在亚 2nm 晶体管的 GAA 360° 环绕栅极、超高深宽比 3D NAND 通孔和 DRAM 电容器电介质制造中，原子层沉积（ALD）是唯一能够实现原子级厚度精度（$< 0.1\\,\\text{nm}$）和 100% 共形台阶覆盖率的薄膜沉积工艺。经典三甲基铝（$\\text{Al(CH}_3)_3$, TMA）与水蒸气（$\\text{H}_2\\text{O}$）沉积氧化铝（$\\text{Al}_2\\text{O}_3$）是 ALD 领域最标杆的自限性（Self-limiting）表面反应过程，其每一循环均由严格有序的四个脉冲/吹扫工步构成。 Physical & Mathematical Ground Truth: 1. **反应四阶段时序（Four Reaction Phases）**： - **阶段 A（TMA 前驱体脉冲，Duration $t_1 = 1.0\\,\\text{s}$）**：TMA 分子气相扩散至表面，与基底表面活性羟基（$-\\text{OH}$）发生剧烈自限化学吸附： $$\\text{Al-OH}^* + \\text{Al(CH}_3)_3(g) \\to \\text{Al-O-Al(CH}_3)_2^* + \\text{CH}_4(g)\\uparrow$$ 释放甲烷气体并自终止，表面转变为被甲基（$-\\text{CH}_3$）覆盖钝化态（饱和覆盖度 $\\theta \\to 1$）。 - **阶段 B（惰性气体吹扫，Duration $t_2 = 1.0\\,\\text{s}$）**：高纯 $N_2$ 气流席卷反应腔室，迅速吹除多余未反应 TMA 分子及副产物 $\\text{CH}_4$。 - **阶段 C（氧化剂 $\\text{H}_2\\text{O}$ 脉冲，Duration $t_3 = 1.0\\,\\text{s}$）**：引入水蒸气分子，与表面甲基发生配体置换反应： $$\\text{Al-CH}_3^* + \\text{H}_2\\text{O}(g) \\to \\text{Al-OH}^* + \\text{CH}_4(g)\\uparrow$$ 生成坚固的 $\\text{Al-O-Al}$ 氧化层网格并重新使表面羟基化（Regenerated $-\\text{OH}$）。 - **阶段 D（二次惰性气体吹扫，Duration $t_4 = 1.0\\,\\text{s}$）**：二次 $N_2$ 吹扫排空残留水汽与甲烷，完成一整个沉积闭环。 2. **物理生长常数与方程**： - 反应温度窗口（ALD Window）：$150^\\circ\\text{C}\\text{–}300^\\circ\\text{C}$。 - 单循环生长厚度（Growth Per Cycle, GPC）：严格恒定为 $1.1\\,\\text{Å/cycle} = 0.11\\,\\text{nm/cycle}$。 - 朗缪尔自限吸附动力学：$\\frac{d\\theta}{dt} = k_{ads} P_{TMA}(1-\\theta) - k_{des}\\theta$（强化学吸附下 $k_{des} \\approx 0$）。 Visual Inspection Criteria: - **四阶段连续时间轴状态机**：底栏带有平滑移动的发光时间轴指示条，精准在 Phase A $\\to$ B $\\to$ C $\\to$ D 之间切换标签与颜色。 - **分子化学构型精准性**：TMA 分子（中心铝球 Al 键合 3 个对称甲基团 $\\text{CH}_3$）、水分子（弯曲型 $\\text{H}_2\\text{O}$，键角 $104.5^\\circ$）、副产物甲烷（四面体型 $\\text{CH}_4$ 向上飘逸挥发）。 - **原子层爬升可测量性**：经过完整一个四拍循环，底部固体薄膜的厚度刻度必须产生肉眼可见的微小增量（精确提升 $1.1\\,\\text{Å}$ 对应像素高度）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- R. L. Puurunen, \"Surface chemistry of atomic layer deposition: A case study for the trimethylaluminum/water process\", Journal of Applied Physics 97, 121301 (2005), DOI: 10.1063/1.1940727.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "原子层沉积（ALD）TMA/H2O 四阶段自限性化学吸附与表面羟基饱和动力学循环",
    groundTruth: "1. **反应四阶段时序（Four Reaction Phases）**： - **阶段 A（TMA 前驱体脉冲，Duration $t_1 = 1.0\\,\\text{s}$）**：TMA 分子气相扩散至表面，与基底表面活性羟基（$-\\text{OH}$）发生剧烈自限化学吸附： $$\\text{Al-OH}^* + \\text{Al(CH}_3)_3(g) \\to \\text{Al-O-Al(CH}_3)_2^* + \\text{CH}_4(g)\\uparrow$$ 释放甲烷气体并自终止，表面转变为被甲基（$-\\text{CH}_3$）覆盖钝化态（饱和覆盖度 $\\theta \\to 1$）。 - **阶段 B（惰性气体吹扫，Duration $t_2 = 1.0\\,\\text{s}$）**：高纯 $N_2$ 气流席卷反应腔室，迅速吹除多余未反应 TMA 分子及副产物 $\\text{CH}_",
    evaluationCriteria: "- **四阶段连续时间轴状态机**：底栏带有平滑移动的发光时间轴指示条，精准在 Phase A $\\to$ B $\\to$ C $\\to$ D 之间切换标签与颜色。 - **分子化学构型精准性**：TMA 分子（中心铝球 Al 键合 3 个对称甲基团 $\\text{CH}_3$）、水分子（弯曲型 $\\text{H}_2\\text{O}$，键角 $104.5^\\circ$）、副产物甲烷（四面体型 $\\text{CH}_4$ 向上飘逸挥发）。 - **原子层爬升可测量性**：经过完整一个四拍循环，底部固体薄膜的厚度刻度必须产生肉眼可见的微小增量（精确提升 $1.1\\,\\text{Å}$ 对应像素高度）。",
    referenceSource: "- R. L. Puurunen, \"Surface chemistry of atomic layer deposition: A case study for the trimethylaluminum/water process\", Journal of Applied Physics 97, 121301 (2005), DOI: 10.1063/1.1940727.",
  },
};

/**
 * FE-SEMI-09: 亚埃级单层二硫化钼（1L-MoS2）2D 半导体晶体管超低肖特基势垒半金属铋接触能带剖面
 */
export const FE_SEMI_09_PROMPT: PromptSpec = {
  id: "FE-SEMI-09",
  label: "亚埃级单层二硫化钼（1L-MoS2）2D 半导体晶体管超低肖特基势垒半金属铋接触能带剖面 (Monolayer MoS2 2D FET with Semimetallic Bismuth Ohmic Contact & Band Alignment)",
  template: "Generate an SVG technical visualization of Monolayer MoS2 2D FET with Semimetallic Bismuth Ohmic Contact & Band Alignment as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 硅材料在沟道厚度缩减至 $3\\,\\text{nm}$ 以下时将遭遇剧烈的量子限域与表面粗糙度散射，迁移率急剧崩塌。过渡金属二硫族化合物（TMDs，如单层 $\\text{MoS}_2$）因具有仅 $0.65\\,\\text{nm}$ 的超薄物理单原子层厚度、无表面悬挂键和 $1.8\\,\\text{eV}$ 的理想直接带隙，被 IEEE ITRS 与台积电列为 1nm 及亚埃米节点（Sub-1nm）的终极沟道材料。然而，传统金属与 2D 材料接触时普遍存在强烈的费米能级钉扎（Fermi-level Pinning）和高肖特基势垒（$> 0.3\\,\\text{eV}$）。采用半金属铋（Bi(0001)）作为接触电极，由于其零带隙态密度极低，成功抑制了金属诱导间隙态（MIGS），首次实现了近乎为零的肖特基势垒欧姆接触与高达 $1135\\,\\mu\\text{A}/\\mu\\text{m}$ 的饱和开态电流。 Physical & Mathematical Ground Truth: 1. **二维半导体沟道微观尺度**： - 单层 $\\text{MoS}_2$ 晶格（三明治结构 S-Mo-S）：物理单层厚度 $t = 0.65\\,\\text{nm}$。 - 电子亲和能 $\\chi = 4.2\\,\\text{eV}$，直接禁带宽度 $E_g = 1.80\\,\\text{eV} \\pm 0.05\\,\\text{eV}$。 - 电子有效质量 $m_e^* = 0.45\\,m_0$。 2. **半金属铋接触极界面（Bi Semimetal Contact）**： - 铋电极层（厚度 $20\\,\\text{nm}$），上方包覆 TiN/W 保护阻挡层。 - 界面肖特基势垒高度（Schottky Barrier Height, SBH）：$\\Phi_{Bn} \\le 0.02\\,\\text{eV} \\approx 0\\,\\text{eV}$（完美实现欧姆导电通路）。 - 接触电阻率：$R_c = 123\\,\\Omega\\cdot\\mu\\text{m}$（逼近量子极限）。 3. **栅控堆叠（Top-Gate Stack）**： - 顶栅介质层：ALD $\\text{HfO}_2$ 或 $\\text{Y}_2\\text{O}_3$（厚度 $3.0\\,\\text{nm}$）。 - 顶栅金属电极：$\\text{Au/Ti}$。 4. **全互联能带对准图（Energy Band Alignment Plot）**： - 铋半金属的费米能级 $E_F$ 与单层 $\\text{MoS}_2$ 的导带底 $E_c$ 精确水平对齐（Zero Band Mismatch）。 - 对比插图：展示传统金/钛（Au/Ti）接触中因 MIGS 钉扎产生的宽大耗尽区势垒与能带严重上弯。 Visual Inspection Criteria: - **六角蜂窝原子级晶格切片清晰度**：黄色硫原子（S）与青色钼原子（Mo）必须呈现三明治（S-Mo-S）共价键立体排布，基底为无原子交联的范德华间隙（vdW Gap $\\sim 0.3\\,\\text{nm}$）。 - **能带对准零阶跃精准度**：能带图中的导带线自半金属 Bi 的费米能级向 $\\text{MoS}_2$ 沟道延伸时，界面处完全平滑，无向上突起的肖特基钉扎尖峰。 - **电荷注入波包流向图**：绿色发光箭头清晰标注电子无障碍量子隧穿注入沟道的路径。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- P.-C. Shen et al. (MIT & TSMC), \"Ultralow contact resistance between semimetal and monolayer semiconductors\", Nature 593, 211–217 (2021), DOI: 10.1038/s41586-021-03472-9. - IEDM 2024: 2D Channel FET",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "亚埃级单层二硫化钼（1L-MoS2）2D 半导体晶体管超低肖特基势垒半金属铋接触能带剖面",
    groundTruth: "1. **二维半导体沟道微观尺度**： - 单层 $\\text{MoS}_2$ 晶格（三明治结构 S-Mo-S）：物理单层厚度 $t = 0.65\\,\\text{nm}$。 - 电子亲和能 $\\chi = 4.2\\,\\text{eV}$，直接禁带宽度 $E_g = 1.80\\,\\text{eV} \\pm 0.05\\,\\text{eV}$。 - 电子有效质量 $m_e^* = 0.45\\,m_0$。 2. **半金属铋接触极界面（Bi Semimetal Contact）**： - 铋电极层（厚度 $20\\,\\text{nm}$），上方包覆 TiN/W 保护阻挡层。 - 界面肖特基势垒高度（Schottky Barrier Height, SBH）：$\\Phi_{Bn} \\le 0.02\\,\\text{eV} \\approx 0\\,\\text{eV}$（完美实现欧姆导电通路）。 - 接触电阻",
    evaluationCriteria: "- **六角蜂窝原子级晶格切片清晰度**：黄色硫原子（S）与青色钼原子（Mo）必须呈现三明治（S-Mo-S）共价键立体排布，基底为无原子交联的范德华间隙（vdW Gap $\\sim 0.3\\,\\text{nm}$）。 - **能带对准零阶跃精准度**：能带图中的导带线自半金属 Bi 的费米能级向 $\\text{MoS}_2$ 沟道延伸时，界面处完全平滑，无向上突起的肖特基钉扎尖峰。 - **电荷注入波包流向图**：绿色发光箭头清晰标注电子无障碍量子隧穿注入沟道的路径。",
    referenceSource: "- P.-C. Shen et al. (MIT & TSMC), \"Ultralow contact resistance between semimetal and monolayer semiconductors\", Nature 593, 211–217 (2021), DOI: 10.1038/s41586-021-03472-9. - IEDM 2024: 2D Channel FETs for Sub-1nm Logic Roadmap.",
  },
};

/**
 * FE-SEMI-10: 铁电铪锆氧化物（HZO）正交极化相（Pca21）畴壁成核与极化反转动力学
 */
export const FE_SEMI_10_PROMPT: PromptSpec = {
  id: "FE-SEMI-10",
  label: "铁电铪锆氧化物（HZO）正交极化相（Pca21）畴壁成核与极化反转动力学 (Ferroelectric HZO (Hf0.5Zr0.5O2) Orthorhombic Pca21 Domain Wall Nucleation Dynamics)",
  template: "Generate an SVG technical visualization of Ferroelectric HZO (Hf0.5Zr0.5O2) Orthorhombic Pca21 Domain Wall Nucleation Dynamics using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 传统钙钛矿铁电材料（如 PZT）由于含有铅元素且在纳秒级超薄膜下铁电性严重退化，无法兼容现代 CMOS 后道工序。自 2011 年发现掺杂氧化铪（尤其是 $\\text{Hf}_{0.5}\\text{Zr}_{0.5}\\text{O}_2$, HZO）具有非中心对称的正交晶相（Orthorhombic $Pca2_1$ 空间群）以来，HZO 已成为铁电场效应晶体管（FeFET）、铁电存储器（FeRAM）和存内计算（In-Memory Computing）的革命性材料。在外加交变电场下，电偶极子通过成核限制反转机制（Nucleation-Limited Switching, NLS）驱动 180° 畴壁（Domain Wall）高速移动，实现超快（$< 5\\,\\text{ns}$）、低功耗非易失信息存储。 Physical & Mathematical Ground Truth: 1. **晶胞原子尺度与铁电相（$Pca2_1$ 空间群）**： - 薄膜厚度：$H_{HZO} = 10.0\\,\\text{nm} \\pm 0.5\\,\\text{nm}$，上下夹层为 TiN/TaN 金属电极。 - 晶胞常数：$a \\approx 0.507\\,\\text{nm}$, $b \\approx 0.526\\,\\text{nm}$, $c \\approx 0.508\\,\\text{nm}$。 - 氧原子偏离（Oxygen Displacement）：极性轴（c 轴）方向氧离子相对铪/锆阳离子骨架产生约 $0.02\\text{–}0.04\\,\\text{nm}$ 的非对称自发位移，构成永恒净自发极化电荷。 2. **铁电电学常数与极化滞后方程（P-E Hysteresis Loop）**： - 剩余极化强度（Remanent Polarization）：$P_r \\approx 18\\text{–}22\\,\\mu\\text{C/cm}^2$。 - 矫顽电场（Coercive Field）：$E_c = 1.5\\,\\text{MV/cm} \\pm 0.2\\,\\text{MV/cm}$。 - NLS 畴反转动力学方程： $$P(t) = 2 P_r \\left[ 1 - \\exp\\left( -\\left(\\frac{t}{\\tau}\\right)^\\beta \\right) \\right], \\quad \\beta \\approx 2$$ 其中特征成核时间 $\\tau$ 服从 Merz 定律：$\\tau = \\tau_0 \\exp(E_a / E)$。 3. **连续动力学循环表现**： - **正向极化饱和（$P = +P_r$）**：所有氧原子向上位移，内部形成朝下的自发极化箭头 $\\vec{P}$。 - **反向电场施加（$E = -E_c$）**：薄膜内部首先随机萌生多个逆向反转核（Nuclei），随后形成纵向 $180^\\circ$ 畴壁，畴壁以横向速度 $v_{DW}$ 快速向两侧扫荡推进，直至整膜完全转入反向极化态（$P = -P_r$）。 - **右侧伴随 P-E 滞回曲线同步绘制点**：一个闪烁的发光圆点在完整的 S 型滞回曲线上平滑同步循回游走，实时对应微观晶胞极化状态。 Visual Inspection Criteria: - **Pca21 正交极化原子结构准确性**：Hf/Zr 阳离子与氧阴离子必须清晰区分半径和颜色，且能看出非对称自发偶极矩位移。 - **NLS 畴壁扩展动力学真实感**：反转绝非死板的全屏瞬间突变，必须肉眼观察到“孤立小核萌生 $\\to$ 畴壁横向推移扩展 $\\to$ 相位完全闭合”的经典相变物理过程。 - **P-E 曲线严格闭合**：右侧矢量 P-E 回线必须严格具有中心反对称性，截距精确标定在 $\\pm P_r$ 与 $\\pm E_c$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- IEDM 2023 / 2024: Advanced Characterization of Domain Wall Dynamics in Ultraminiaturized HZO Capacitors. - IEEE Trans. Electron Devices: Nucleation-Limited Switching Modeling for Polycrystalline Fer",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "铁电铪锆氧化物（HZO）正交极化相（Pca21）畴壁成核与极化反转动力学",
    groundTruth: "1. **晶胞原子尺度与铁电相（$Pca2_1$ 空间群）**： - 薄膜厚度：$H_{HZO} = 10.0\\,\\text{nm} \\pm 0.5\\,\\text{nm}$，上下夹层为 TiN/TaN 金属电极。 - 晶胞常数：$a \\approx 0.507\\,\\text{nm}$, $b \\approx 0.526\\,\\text{nm}$, $c \\approx 0.508\\,\\text{nm}$。 - 氧原子偏离（Oxygen Displacement）：极性轴（c 轴）方向氧离子相对铪/锆阳离子骨架产生约 $0.02\\text{–}0.04\\,\\text{nm}$ 的非对称自发位移，构成永恒净自发极化电荷。 2. **铁电电学常数与极化滞后方程（P-E Hysteresis Loop）**： - 剩余极化强度（Remanent Polarization）：$P_r \\approx ",
    evaluationCriteria: "- **Pca21 正交极化原子结构准确性**：Hf/Zr 阳离子与氧阴离子必须清晰区分半径和颜色，且能看出非对称自发偶极矩位移。 - **NLS 畴壁扩展动力学真实感**：反转绝非死板的全屏瞬间突变，必须肉眼观察到“孤立小核萌生 $\\to$ 畴壁横向推移扩展 $\\to$ 相位完全闭合”的经典相变物理过程。 - **P-E 曲线严格闭合**：右侧矢量 P-E 回线必须严格具有中心反对称性，截距精确标定在 $\\pm P_r$ 与 $\\pm E_c$。",
    referenceSource: "- IEDM 2023 / 2024: Advanced Characterization of Domain Wall Dynamics in Ultraminiaturized HZO Capacitors. - IEEE Trans. Electron Devices: Nucleation-Limited Switching Modeling for Polycrystalline Ferroelectrics.",
  },
};

export const FE_SEMI_PROMPTS: readonly PromptSpec[] = [
  FE_SEMI_01_PROMPT,
  FE_SEMI_02_PROMPT,
  FE_SEMI_03_PROMPT,
  FE_SEMI_04_PROMPT,
  FE_SEMI_05_PROMPT,
  FE_SEMI_06_PROMPT,
  FE_SEMI_07_PROMPT,
  FE_SEMI_08_PROMPT,
  FE_SEMI_09_PROMPT,
  FE_SEMI_10_PROMPT,
];


/**
 * FE-2: 先进微电子、次埃米半导体与光电互连工程 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）
 */
export const FE_SEMI_SUITE_PROMPT: PromptSpec = {
  id: "fe-semi-v1",
  label: "FE-2: 先进微电子与次埃米半导体（十题组）",
  template: "FE-2: 先进微电子、次埃米半导体与光电互连工程 前沿工程十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",
  variables: [],
    candidates: [
    {
      id: FE_SEMI_01_PROMPT.id,
      label: "A16 埃米级全环绕栅极纳米片（GAA Nanosheet）立体截面与能带弯曲剖面",
      text: FE_SEMI_01_PROMPT.template,
      standard: FE_SEMI_01_PROMPT.standard,
    },
    {
      id: FE_SEMI_02_PROMPT.id,
      label: "背面供电网络（BSPDN）Super Power Rail 与纳米硅通孔（nTSV）双面互联架构",
      text: FE_SEMI_02_PROMPT.template,
      standard: FE_SEMI_02_PROMPT.standard,
    },
    {
      id: FE_SEMI_03_PROMPT.id,
      label: "单片垂直三维互补场效应晶体管（mCFET）中间介质隔离（MDI）与垂直触点架构",
      text: FE_SEMI_03_PROMPT.template,
      standard: FE_SEMI_03_PROMPT.standard,
    },
    {
      id: FE_SEMI_04_PROMPT.id,
      label: "High-NA 0.55 EUV 8 面变形反射镜光学投影光路与光瞳中心遮挡动力学",
      text: FE_SEMI_04_PROMPT.template,
      standard: FE_SEMI_04_PROMPT.standard,
    },
    {
      id: FE_SEMI_05_PROMPT.id,
      label: "共封装光学（CPO）硅光子微环谐振器（MRR）热光相移与倏逝波共振滤波动力学",
      text: FE_SEMI_05_PROMPT.template,
      standard: FE_SEMI_05_PROMPT.standard,
    },
    {
      id: FE_SEMI_06_PROMPT.id,
      label: "玻璃核心基板（Glass Core Substrate）高深宽比 TGV 微通孔与热机应力集中分布剖面",
      text: FE_SEMI_06_PROMPT.template,
      standard: FE_SEMI_06_PROMPT.standard,
    },
    {
      id: FE_SEMI_07_PROMPT.id,
      label: "16-High HBM4 超薄 DRAM 无凸块直接铜-铜混合键合（Cu-Cu Hybrid Bonding）原子级界面切片",
      text: FE_SEMI_07_PROMPT.template,
      standard: FE_SEMI_07_PROMPT.standard,
    },
    {
      id: FE_SEMI_08_PROMPT.id,
      label: "原子层沉积（ALD）TMA/H2O 四阶段自限性化学吸附与表面羟基饱和动力学循环",
      text: FE_SEMI_08_PROMPT.template,
      standard: FE_SEMI_08_PROMPT.standard,
    },
    {
      id: FE_SEMI_09_PROMPT.id,
      label: "亚埃级单层二硫化钼（1L-MoS2）2D 半导体晶体管超低肖特基势垒半金属铋接触能带剖面",
      text: FE_SEMI_09_PROMPT.template,
      standard: FE_SEMI_09_PROMPT.standard,
    },
    {
      id: FE_SEMI_10_PROMPT.id,
      label: "铁电铪锆氧化物（HZO）正交极化相（Pca21）畴壁成核与极化反转动力学",
      text: FE_SEMI_10_PROMPT.template,
      standard: FE_SEMI_10_PROMPT.standard,
    },
  ],
  source: null,
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "次埃米半导体器件微观拓扑、背面供电与 High-NA EUV 光学系统",
    groundTruth: "以 A16 埃米级全环绕栅极纳米片（GAA Nanosheet）、背面供电网络（BSPDN）、CFET 单片垂直互补堆叠与 High-NA 0.55EU 反射光学变形光路为基准，保持埃米级尺寸公差与能带界面自洽。",
    evaluationCriteria: "1. 截面拓扑：纳米片、金属栅极与通孔层级关系准确；2. 物理光路：异性放大与入射角校正严格自洽；3. 语法规范：XML 严格合法，无交互 JS。",
    referenceSource: "https://www.ieee.org",
  },
};

export const FE_SEMI_INDIVIDUAL_PROMPTS = FE_SEMI_PROMPTS;

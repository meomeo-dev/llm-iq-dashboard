/**
 * FE-7: 超材料、原子级制造与微纳结构工程 前沿评测题库。
 * 包含 10 道独立题目规格，以及 1 套领域分组聚合套题（UX 交互与轮换结构对齐四大名著 candidates 规范）。
 */

import type { PromptSpec } from "../prompt";

/**
 * FE-META-01: Grima-Evans 铰接刚性方块负泊松比微结构拉胀运动学动力学
 */
export const FE_META_01_PROMPT: PromptSpec = {
  id: "FE-META-01",
  label: "Grima-Evans 铰接刚性方块负泊松比微结构拉胀运动学动力学 (Grima-Evans Rotating Squares Auxetic Mechanical Metamaterial Kinematics)",
  template: "Generate an SVG technical visualization of Grima-Evans Rotating Squares Auxetic Mechanical Metamaterial Kinematics using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 负泊松比（Auxetic）拉胀超材料在拉伸时发生横向膨胀、压缩时发生横向收缩，具有极高的抗冲击韧性、压痕阻抗与声学吸能特性。Grima 与 Evans 提出的铰接刚性方块是微机械力学超材料的奠基石。 Physical & Mathematical Ground Truth: 4x4 刚性正方形铰接阵列，理想平面泊松比严格恒等于各向同性 nu = -1。瞬时尺寸 Lx(theta) = Ly(theta) = 2*sqrt(2)*a*cos(theta/2 - pi/4)。角度在 10 度至 80 度之间平滑周期性呼吸式旋转展开与收缩。基元边长 a = 40px，铰接公差 <= 0.5px。 Visual Inspection Criteria: 相邻方块围绕公共顶点反向等角同步旋转（一顺一逆），中心菱形气孔呈周期性胀缩；横纵位移应变比恒为 +1；各边长度形变误差 < 0.1%。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "J. N. Grima, K. E. Evans, Auxetic behavior from rotating squares, Journal of Materials Science Letters 19(17), 1563-1565 (2000). DOI: 10.1023/A:1006781224057.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "Grima-Evans 铰接刚性方块负泊松比微结构拉胀运动学动力学",
    groundTruth: "4x4 刚性正方形铰接阵列，理想平面泊松比严格恒等于各向同性 nu = -1。瞬时尺寸 Lx(theta) = Ly(theta) = 2*sqrt(2)*a*cos(theta/2 - pi/4)。角度在 10 度至 80 度之间平滑周期性呼吸式旋转展开与收缩。基元边长 a = 40px，铰接公差 <= 0.5px。",
    evaluationCriteria: "相邻方块围绕公共顶点反向等角同步旋转（一顺一逆），中心菱形气孔呈周期性胀缩；横纵位移应变比恒为 +1；各边长度形变误差 < 0.1%。",
    referenceSource: "J. N. Grima, K. E. Evans, Auxetic behavior from rotating squares, Journal of Materials Science Letters 19(17), 1563-1565 (2000). DOI: 10.1023/A:1006781224057.",
  },
};

/**
 * FE-META-02: 声子晶体谷霍尔效应拓扑边缘态抗散射单向波动传输
 */
export const FE_META_02_PROMPT: PromptSpec = {
  id: "FE-META-02",
  label: "声子晶体谷霍尔效应拓扑边缘态抗散射单向波动传输 (Acoustic Topological Valley Hall Edge State Backscattering-Immune Waveguide)",
  template: "Generate an SVG technical visualization of Acoustic Topological Valley Hall Edge State Backscattering-Immune Waveguide using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 拓扑谷声子晶体通过在蜂窝晶格中打破空间反演对称性（如旋转正三角形声学散射柱），在布里渊区 K 和 K' 谷打开拓扑能隙，在异相畴壁界面支持手性锁定的单向鲁棒声传输。 Physical & Mathematical Ground Truth: 三角晶格常数 a = 60px，上半畴柱体旋转 +30 度，下半畴柱体旋转 -30 度，谷陈数差 |Delta C_V| = 1。形成带两个 120 度锐角弯折的 Z 字形畴壁。动态声压波包平滑通过两个锐角弯折，反射系数 R 接近 0，透射率 T > 98%。 Visual Inspection Criteria: 等相位波前沿 Z 形畴壁平滑流淌，120 度拐弯处无驻波条纹，出射能量通量与入射能量比偏差 < 2%。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "J. Lu et al., Observation of topological valley transport of sound in sonic crystals, Nature Physics 13, 369-374 (2017). DOI: 10.1038/nphys3999.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "声子晶体谷霍尔效应拓扑边缘态抗散射单向波动传输",
    groundTruth: "三角晶格常数 a = 60px，上半畴柱体旋转 +30 度，下半畴柱体旋转 -30 度，谷陈数差 |Delta C_V| = 1。形成带两个 120 度锐角弯折的 Z 字形畴壁。动态声压波包平滑通过两个锐角弯折，反射系数 R 接近 0，透射率 T > 98%。",
    evaluationCriteria: "等相位波前沿 Z 形畴壁平滑流淌，120 度拐弯处无驻波条纹，出射能量通量与入射能量比偏差 < 2%。",
    referenceSource: "J. Lu et al., Observation of topological valley transport of sound in sonic crystals, Nature Physics 13, 369-374 (2017). DOI: 10.1038/nphys3999.",
  },
};

/**
 * FE-META-03: 双重自旋解耦电介质超构表面超强圆二色性与几何相阶跃
 */
export const FE_META_03_PROMPT: PromptSpec = {
  id: "FE-META-03",
  label: "双重自旋解耦电介质超构表面超强圆二色性与几何相阶跃 (Spin-Decoupled Dielectric Chiral Metasurface with Giant Circular Dichroism)",
  template: "Generate an SVG technical visualization of Spin-Decoupled Dielectric Chiral Metasurface with Giant Circular Dichroism as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 利用高折射率介质（如 TiO2）矩形纳米柱的传播相位与几何相位（PB 相位）正交联合调制，在同一亚波长物理平面实现自旋完全解耦与高灵敏手性分子传感。 Physical & Mathematical Ground Truth: 空间 Jones 矩阵解耦方程，波长 633nm，周期 350nm，TiO2 纳米柱高度 600nm。LCP 入射光聚焦透射率 >= 90% 并会聚于中心 Airy 斑；RCP 入射光聚焦透射率 <= 5%；圆二色性对比度 CD >= 0.89。 Visual Inspection Criteria: LCP 焦平面呈现锐利 Airy 亮斑，RCP 焦平面完全暗淡无斑；焦斑半高全宽符合 0.51*lambda/NA +- 5%。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "J. P. B. Mueller et al., Metasurface Polarization Optics: Independent Phase Control, PRL 118, 113901 (2017). DOI: 10.1103/PhysRevLett.118.113901.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "双重自旋解耦电介质超构表面超强圆二色性与几何相阶跃",
    groundTruth: "空间 Jones 矩阵解耦方程，波长 633nm，周期 350nm，TiO2 纳米柱高度 600nm。LCP 入射光聚焦透射率 >= 90% 并会聚于中心 Airy 斑；RCP 入射光聚焦透射率 <= 5%；圆二色性对比度 CD >= 0.89。",
    evaluationCriteria: "LCP 焦平面呈现锐利 Airy 亮斑，RCP 焦平面完全暗淡无斑；焦斑半高全宽符合 0.51*lambda/NA +- 5%。",
    referenceSource: "J. P. B. Mueller et al., Metasurface Polarization Optics: Independent Phase Control, PRL 118, 113901 (2017). DOI: 10.1103/PhysRevLett.118.113901.",
  },
};

/**
 * FE-META-04: 零折射率 (ENZ) 亚波长弯折波导超耦合全透射相位隧穿
 */
export const FE_META_04_PROMPT: PromptSpec = {
  id: "FE-META-04",
  label: "零折射率 (ENZ) 亚波长弯折波导超耦合全透射相位隧穿 (Epsilon-Near-Zero (ENZ) Subwavelength Waveguide Supercoupling and Phase Invariance)",
  template: "Generate an SVG technical visualization of Epsilon-Near-Zero (ENZ) Subwavelength Waveguide Supercoupling and Phase Invariance using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 介电常数逼近于零（ENZ）时相速度趋向无穷大，等效波长无限长，电磁场在收缩通道内表现为空间准静电场，实现无相移、无几何损耗的全透射超耦合。 Physical & Mathematical Ground Truth: Maxwell-Ampere 极限方程，相位累积趋向 0。宽波导宽度 Win = 120px，中间超窄弯折通道 w_ch = 15px（收缩比 1:8），通道内电场按截面反比挤压 8 倍。透射率 >= 98%，反射率 <= 2%。 Visual Inspection Criteria: 通道内无论弯折如何剧烈，电场色彩全局同步均匀闪烁（无空间波长条纹）；出射端波前平直重建，与入射波前严格同频同相；出射等相位线曲率误差 <= 0.005px^-1。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "M. G. Silveirinha, N. Engheta, Tunneling of electromagnetic energy through subwavelength channels and bends, PRL 97, 157403 (2006). DOI: 10.1103/PhysRevLett.97.157403.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "零折射率 (ENZ) 亚波长弯折波导超耦合全透射相位隧穿",
    groundTruth: "Maxwell-Ampere 极限方程，相位累积趋向 0。宽波导宽度 Win = 120px，中间超窄弯折通道 w_ch = 15px（收缩比 1:8），通道内电场按截面反比挤压 8 倍。透射率 >= 98%，反射率 <= 2%。",
    evaluationCriteria: "通道内无论弯折如何剧烈，电场色彩全局同步均匀闪烁（无空间波长条纹）；出射端波前平直重建，与入射波前严格同频同相；出射等相位线曲率误差 <= 0.005px^-1。",
    referenceSource: "M. G. Silveirinha, N. Engheta, Tunneling of electromagnetic energy through subwavelength channels and bends, PRL 97, 157403 (2006). DOI: 10.1103/PhysRevLett.97.157403.",
  },
};

/**
 * FE-META-05: 二维 BBH 四极矩拓扑绝缘体零能角态局域场
 */
export const FE_META_05_PROMPT: PromptSpec = {
  id: "FE-META-05",
  label: "二维 BBH 四极矩拓扑绝缘体零能角态局域场 (2D BBH Quantized Quadrupole Topological Insulator Zero-Energy Corner States)",
  template: "Generate an SVG technical visualization of 2D BBH Quantized Quadrupole Topological Insulator Zero-Energy Corner States as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 高阶拓扑绝缘体打破传统体-边对应，二维晶体体内与一维边缘均有能隙，但在零维四个对角点产生受正交反射与手性对称性保护的拓扑四极矩零能角态。 Physical & Mathematical Ground Truth: BBH 紧束缚模型，每格点回路相移为 pi。胞内/胞间跃迁比 gamma/lambda = 0.2 < 1，量子化四极矩 q_xy = e/2。波函数呈双指数向体内衰减，衰减长度 xi = 0.62a。四个角点能量严格位于中隙中性点 E = 0。 Visual Inspection Criteria: 8x8 方阵体区和四条边缘呈现冷色暗背景，仅四个角点爆发出强烈热点光斑；向中心 2 个晶格常数内能量密度衰减 > 95%；四角点对称性均方差 <= 0.5%。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "W. A. Benalcazar et al., Quantized electric multipole insulators, Science 357(6346), 61-66 (2017). DOI: 10.1126/science.aah6442.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "二维 BBH 四极矩拓扑绝缘体零能角态局域场",
    groundTruth: "BBH 紧束缚模型，每格点回路相移为 pi。胞内/胞间跃迁比 gamma/lambda = 0.2 < 1，量子化四极矩 q_xy = e/2。波函数呈双指数向体内衰减，衰减长度 xi = 0.62a。四个角点能量严格位于中隙中性点 E = 0。",
    evaluationCriteria: "8x8 方阵体区和四条边缘呈现冷色暗背景，仅四个角点爆发出强烈热点光斑；向中心 2 个晶格常数内能量密度衰减 > 95%；四角点对称性均方差 <= 0.5%。",
    referenceSource: "W. A. Benalcazar et al., Quantized electric multipole insulators, Science 357(6346), 61-66 (2017). DOI: 10.1126/science.aah6442.",
  },
};

/**
 * FE-META-06: 扫描隧道显微镜氢解吸光刻与单原子晶体管掺杂通道构建
 */
export const FE_META_06_PROMPT: PromptSpec = {
  id: "FE-META-06",
  label: "扫描隧道显微镜氢解吸光刻与单原子晶体管掺杂通道构建 (STM Hydrogen Depassivation Lithography (HDL) and Single Phosphorus Atom Placement)",
  template: "Generate an SVG technical visualization of STM Hydrogen Depassivation Lithography (HDL) and Single Phosphorus Atom Placement as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 澳大利亚 Michelle Simmons 团队创立的原子级精准制造技术，利用低温 STM 针尖在单氢钝化硅表面精准剥离特定数量氢原子，露出的硅悬键刚好吸附磷化氢分子并替换硅原子，制成单原子晶体管。 Physical & Mathematical Ground Truth: Si(001)-2x1 重构表面，二聚体行间距 0.768nm，行内二聚体周期 0.384nm。在低偏压 +2.5V、电流 2.0nA 下非弹性多电子振动加热激发 Si-H 伸缩模。连续剥离单行上恰好 3 个相邻二聚体（共 6 个氢原子），窗口长 1.15nm、宽 0.4nm。 Visual Inspection Criteria: 条纹状二聚体行背景上，中央窗口暴露高亮悬键椭圆突起，相邻二聚体完好无损无溢出；窗口长宽比严格在 2.8~3.2 之间；针尖定位公差 <= 0.05nm。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "M. Fuechsle et al., A single-atom transistor, Nature Nanotechnology 7(4), 242-246 (2012). DOI: 10.1038/nnano.2012.21.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "扫描隧道显微镜氢解吸光刻与单原子晶体管掺杂通道构建",
    groundTruth: "Si(001)-2x1 重构表面，二聚体行间距 0.768nm，行内二聚体周期 0.384nm。在低偏压 +2.5V、电流 2.0nA 下非弹性多电子振动加热激发 Si-H 伸缩模。连续剥离单行上恰好 3 个相邻二聚体（共 6 个氢原子），窗口长 1.15nm、宽 0.4nm。",
    evaluationCriteria: "条纹状二聚体行背景上，中央窗口暴露高亮悬键椭圆突起，相邻二聚体完好无损无溢出；窗口长宽比严格在 2.8~3.2 之间；针尖定位公差 <= 0.05nm。",
    referenceSource: "M. Fuechsle et al., A single-atom transistor, Nature Nanotechnology 7(4), 242-246 (2012). DOI: 10.1038/nnano.2012.21.",
  },
};

/**
 * FE-META-07: 魔角扭转双层石墨烯亚埃级莫尔超晶格原子重构与应变孤子网络
 */
export const FE_META_07_PROMPT: PromptSpec = {
  id: "FE-META-07",
  label: "魔角扭转双层石墨烯亚埃级莫尔超晶格原子重构与应变孤子网络 (Twisted Bilayer Graphene (TBG) Magic-Angle Moiré Superlattice Atomic Reconstruction)",
  template: "Generate an SVG technical visualization of Twisted Bilayer Graphene (TBG) Magic-Angle Moiré Superlattice Atomic Reconstruction as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 双层石墨烯扭转角逼近第一魔角 1.08 度时产生费米能级平带。范德华力使晶格自发弛豫，低能量 AB/BA 堆垛极大扩张，高能量 AA 堆垛收缩为微小圆节点，两相交界演化出网状拓扑剪切应变孤子网络。 Physical & Mathematical Ground Truth: 魔角 theta = 1.08 度下莫尔超晶格周期 L_M = 13.06nm。AA 核心半径收缩至 3.2nm，AA 节点占超晶胞面积从刚性的 33% 弛豫收缩至 <= 12%。AB/BA 畴壁宽度 1.8nm，局域伯格斯矢量 b = a0/sqrt(3)。 Visual Inspection Criteria: AA 区域为周期性致密亮点，AA 节点间距严格为 13.06nm +- 0.5nm；中间为三叉星状细窄暗条纹分割的 AB 和 BA 均匀铺展区；局部六边形中心严格吻合。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "H. Yoo et al., Atomic and electronic reconstruction at the van der Waals interface, Nature Materials 18(5), 448-453 (2019). DOI: 10.1038/s41563-019-0346-z.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "魔角扭转双层石墨烯亚埃级莫尔超晶格原子重构与应变孤子网络",
    groundTruth: "魔角 theta = 1.08 度下莫尔超晶格周期 L_M = 13.06nm。AA 核心半径收缩至 3.2nm，AA 节点占超晶胞面积从刚性的 33% 弛豫收缩至 <= 12%。AB/BA 畴壁宽度 1.8nm，局域伯格斯矢量 b = a0/sqrt(3)。",
    evaluationCriteria: "AA 区域为周期性致密亮点，AA 节点间距严格为 13.06nm +- 0.5nm；中间为三叉星状细窄暗条纹分割的 AB 和 BA 均匀铺展区；局部六边形中心严格吻合。",
    referenceSource: "H. Yoo et al., Atomic and electronic reconstruction at the van der Waals interface, Nature Materials 18(5), 448-453 (2019). DOI: 10.1038/s41563-019-0346-z.",
  },
};

/**
 * FE-META-08: 超轻超刚度微纳力学微网格屈曲变形与比能量吸收极限环
 */
export const FE_META_08_PROMPT: PromptSpec = {
  id: "FE-META-08",
  label: "超轻超刚度微纳力学微网格屈曲变形与比能量吸收极限环 (Ultralight High-Stiffness Octet-Truss Nanolattice Post-Buckling Energy Absorption)",
  template: "Generate an SVG technical visualization of Ultralight High-Stiffness Octet-Truss Nanolattice Post-Buckling Energy Absorption using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 遵循麦克斯韦拓扑刚性判据的 Octet-Truss（八面体-四面体杂化点阵）纳米微网格超材料，在保持接近空气的超低密度同时达到理论比刚度极限，在极限载荷下展现协同弹性欧拉屈曲吸能循环。 Physical & Mathematical Ground Truth: 空间框架拓扑判据 M = b - 3j + 6 = 36 - 3*14 + 6 = 0，处于拉伸主导刚性平衡点。刚度定标律 E/Es 正比于 rho^1。单轴压缩应变 epsilon 从 0 到 15% 再到 0 往复循环，杆件产生正弦半波屈曲挠度，卸载后 100% 弹性恢复。 Visual Inspection Criteria: 向下受压时所有斜向杆件协同向外发生微小对称弧形屈曲，关节铰节点无脱开；最大变形处严格满足 C4 旋转对称；受压杆件轴线偏移与正弦半波拟合 R^2 >= 0.99。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "X. Zheng et al., Ultralight, ultrastiff mechanical metamaterials, Science 344(6190), 1373-1377 (2014). DOI: 10.1126/science.1252291.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "超轻超刚度微纳力学微网格屈曲变形与比能量吸收极限环",
    groundTruth: "空间框架拓扑判据 M = b - 3j + 6 = 36 - 3*14 + 6 = 0，处于拉伸主导刚性平衡点。刚度定标律 E/Es 正比于 rho^1。单轴压缩应变 epsilon 从 0 到 15% 再到 0 往复循环，杆件产生正弦半波屈曲挠度，卸载后 100% 弹性恢复。",
    evaluationCriteria: "向下受压时所有斜向杆件协同向外发生微小对称弧形屈曲，关节铰节点无脱开；最大变形处严格满足 C4 旋转对称；受压杆件轴线偏移与正弦半波拟合 R^2 >= 0.99。",
    referenceSource: "X. Zheng et al., Ultralight, ultrastiff mechanical metamaterials, Science 344(6190), 1373-1377 (2014). DOI: 10.1126/science.1252291.",
  },
};

/**
 * FE-META-09: 波动计算超构表面全光实时空间拉普拉斯微分与边缘提取干涉场
 */
export const FE_META_09_PROMPT: PromptSpec = {
  id: "FE-META-09",
  label: "波动计算超构表面全光实时空间拉普拉斯微分与边缘提取干涉场 (Wave-Based Analog Computing Metasurface for Optical Spatial Laplace Differentiation)",
  template: "Generate an SVG technical visualization of Wave-Based Analog Computing Metasurface for Optical Spatial Laplace Differentiation as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 基于格林函数设计的波动计算超构表面与光子晶体平板，在光束透射飞秒瞬间完成各向同性拉普拉斯微分运算 (-nabla^2)，实现零功耗全光边缘轮廓实时提取。 Physical & Mathematical Ground Truth: 傅里叶空间频率传递函数 H(kx, ky) 正比于 -(kx^2 + ky^2)，透射面出射光场严格对应输入光场的空间二阶拉普拉斯导数。波长 850nm，平板厚度 320nm。阶跃边缘输入下内部平坦区透射衰减 > 99.5%，仅在物理轮廓上输出极窄干涉双峰。 Visual Inspection Criteria: 物体内部与外部均质背景完全暗黑沉寂，仅在物理边缘上浮现出极细连续高亮轮廓；中央平坦区漏光强度 < 0.005 I_edge；各方向边缘峰值强度偏差 <= 3%。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "A. Silva et al., Performing mathematical operations with metamaterials, Science 343(6167), 160-163 (2014). DOI: 10.1126/science.1242818; C. Guo et al., Optica 5(3), 251-256 (2018).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "波动计算超构表面全光实时空间拉普拉斯微分与边缘提取干涉场",
    groundTruth: "傅里叶空间频率传递函数 H(kx, ky) 正比于 -(kx^2 + ky^2)，透射面出射光场严格对应输入光场的空间二阶拉普拉斯导数。波长 850nm，平板厚度 320nm。阶跃边缘输入下内部平坦区透射衰减 > 99.5%，仅在物理轮廓上输出极窄干涉双峰。",
    evaluationCriteria: "物体内部与外部均质背景完全暗黑沉寂，仅在物理边缘上浮现出极细连续高亮轮廓；中央平坦区漏光强度 < 0.005 I_edge；各方向边缘峰值强度偏差 <= 3%。",
    referenceSource: "A. Silva et al., Performing mathematical operations with metamaterials, Science 343(6167), 160-163 (2014). DOI: 10.1126/science.1242818; C. Guo et al., Optica 5(3), 251-256 (2018).",
  },
};

/**
 * FE-META-10: 超导微波超构材料 (SQUID 阵列) 磁通可调非线性色散与克尔调制
 */
export const FE_META_10_PROMPT: PromptSpec = {
  id: "FE-META-10",
  label: "超导微波超构材料 (SQUID 阵列) 磁通可调非线性色散与克尔调制 (Superconducting SQUID Metamaterial Microwave Dispersion and Flux-Tunable Kerr Nonlinearity)",
  template: "Generate an SVG technical visualization of Superconducting SQUID Metamaterial Microwave Dispersion and Flux-Tunable Kerr Nonlinearity using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 在超导量子芯片中，将射频 SQUID 作为非线性超构原子密集阵列嵌入微波波导，利用外加磁通调制约瑟夫森电感，实现微波色散与单光子克尔非线性相位调制。 Physical & Mathematical Ground Truth: 约瑟夫森电感磁通调谐本构方程 L_J(Phi) = Phi_0 / (2*pi*I_c * cos(pi*Phi/Phi_0))。外部磁通从 0 到 0.45 扫描时，共振吸收透射谷平滑左移数个 GHz；大功率下透射谷向左倾斜出现 Duffing 双稳态分叉与迟滞突跳。 Visual Inspection Criteria: 透射谱响应曲线上深锐 V 形吸收谷平滑左移；接近半整数磁通时出现克尔迟滞跳跃；以磁通量子 Phi_0 为严格周期对称振荡；共振谷 Q 值 >= 5000。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "P. Jung et al., Multistability and switching in a superconducting metamaterial, APL 102, 062601 (2013). DOI: 10.1063/1.4792727; S. M. Anlage, Journal of Optics 13(2), 024001 (2011).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "超导微波超构材料 (SQUID 阵列) 磁通可调非线性色散与克尔调制",
    groundTruth: "约瑟夫森电感磁通调谐本构方程 L_J(Phi) = Phi_0 / (2*pi*I_c * cos(pi*Phi/Phi_0))。外部磁通从 0 到 0.45 扫描时，共振吸收透射谷平滑左移数个 GHz；大功率下透射谷向左倾斜出现 Duffing 双稳态分叉与迟滞突跳。",
    evaluationCriteria: "透射谱响应曲线上深锐 V 形吸收谷平滑左移；接近半整数磁通时出现克尔迟滞跳跃；以磁通量子 Phi_0 为严格周期对称振荡；共振谷 Q 值 >= 5000。",
    referenceSource: "P. Jung et al., Multistability and switching in a superconducting metamaterial, APL 102, 062601 (2013). DOI: 10.1063/1.4792727; S. M. Anlage, Journal of Optics 13(2), 024001 (2011).",
  },
};

export const FE_META_INDIVIDUAL_PROMPTS: readonly PromptSpec[] = [
  FE_META_01_PROMPT,
  FE_META_02_PROMPT,
  FE_META_03_PROMPT,
  FE_META_04_PROMPT,
  FE_META_05_PROMPT,
  FE_META_06_PROMPT,
  FE_META_07_PROMPT,
  FE_META_08_PROMPT,
  FE_META_09_PROMPT,
  FE_META_10_PROMPT,
];

/**
 * FE-7: 超材料、原子级制造与微纳结构工程 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）
 */
export const FE_META_SUITE_PROMPT: PromptSpec = {
  id: "fe-meta-v1",
  label: "FE-7: 超材料与微纳制造（十题组）",
  template: "FE-7: 超材料、原子级制造与微纳结构工程 前沿工程十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",
  variables: [],
    candidates: [
    {
      id: FE_META_01_PROMPT.id,
      label: "Grima-Evans 铰接刚性方块负泊松比微结构拉胀运动学动力学",
      text: FE_META_01_PROMPT.template,
      standard: FE_META_01_PROMPT.standard,
    },
    {
      id: FE_META_02_PROMPT.id,
      label: "声子晶体谷霍尔效应拓扑边缘态抗散射单向波动传输",
      text: FE_META_02_PROMPT.template,
      standard: FE_META_02_PROMPT.standard,
    },
    {
      id: FE_META_03_PROMPT.id,
      label: "双重自旋解耦电介质超构表面超强圆二色性与几何相阶跃",
      text: FE_META_03_PROMPT.template,
      standard: FE_META_03_PROMPT.standard,
    },
    {
      id: FE_META_04_PROMPT.id,
      label: "零折射率 (ENZ) 亚波长弯折波导超耦合全透射相位隧穿",
      text: FE_META_04_PROMPT.template,
      standard: FE_META_04_PROMPT.standard,
    },
    {
      id: FE_META_05_PROMPT.id,
      label: "二维 BBH 四极矩拓扑绝缘体零能角态局域场",
      text: FE_META_05_PROMPT.template,
      standard: FE_META_05_PROMPT.standard,
    },
    {
      id: FE_META_06_PROMPT.id,
      label: "扫描隧道显微镜氢解吸光刻与单原子晶体管掺杂通道构建",
      text: FE_META_06_PROMPT.template,
      standard: FE_META_06_PROMPT.standard,
    },
    {
      id: FE_META_07_PROMPT.id,
      label: "魔角扭转双层石墨烯亚埃级莫尔超晶格原子重构与应变孤子网络",
      text: FE_META_07_PROMPT.template,
      standard: FE_META_07_PROMPT.standard,
    },
    {
      id: FE_META_08_PROMPT.id,
      label: "超轻超刚度微纳力学微网格屈曲变形与比能量吸收极限环",
      text: FE_META_08_PROMPT.template,
      standard: FE_META_08_PROMPT.standard,
    },
    {
      id: FE_META_09_PROMPT.id,
      label: "波动计算超构表面全光实时空间拉普拉斯微分与边缘提取干涉场",
      text: FE_META_09_PROMPT.template,
      standard: FE_META_09_PROMPT.standard,
    },
    {
      id: FE_META_10_PROMPT.id,
      label: "超导微波超构材料 (SQUID 阵列) 磁通可调非线性色散与克尔调制",
      text: FE_META_10_PROMPT.template,
      standard: FE_META_10_PROMPT.standard,
    },
  ],
  source: "J. N. Grima, K. E. Evans, Auxetic behavior from rotating squares, Journal of Materials Science Letters 19(17), 1563-1565 (2000). DOI: 10.1023/A:1006781224057.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "拉胀力学超材料、拓扑声子绝缘体与莫尔超晶格范德华相变",
    groundTruth: "以负泊松比（Auxetic）多孔晶格相变、光学手性超构表面 PB 几何相位阶跃、魔角石墨烯莫尔超晶格弛豫与零折射率相位隧穿为基准，满足广义本构方程与麦克斯韦方程组。",
    evaluationCriteria: "1. 晶格对称性：正交/旋转对称单元周期性严谨；2. 波动传播：拓扑边缘态单向传播无背向散射；3. 语法规范：XML 严格合法，无交互 JS。",
    referenceSource: "https://www.nature.com/nmat",
  },
};

export const FE_META_PROMPTS = FE_META_INDIVIDUAL_PROMPTS;

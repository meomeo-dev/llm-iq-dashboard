/**
 * VFX-1: 连续介质物理仿真与无穿模接触动力学 前沿评测题库。
 * 包含 10 道独立题目规格，以及 1 套领域分组聚合套题（UX 交互与轮换结构对齐四大名著 candidates 规范）。
 */

import type { PromptSpec } from "../prompt";

/**
 * VFX-SIM-01: 增量势接触双环极限制动与对数势垒无穿模高能剪切解析场
 */
export const VFX_SIM_01_PROMPT: PromptSpec = {
  id: "VFX-SIM-01",
  label: "增量势接触双环极限制动与对数势垒无穿模高能剪切解析场 (IPC Extreme Torsional Ring Squeeze & Intersection-Free Log-Barrier Potential Field)",
  template: "Generate an SVG technical visualization of IPC Extreme Torsional Ring Squeeze & Intersection-Free Log-Barrier Potential Field as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 工业级影视特效与柔性抓取中，穿模是毁灭性灾难。Li et al. (SIGGRAPH 2020) 与 C-IPC (SIGGRAPH 2021) 奠定了新一代非光滑接触动力学基础。GPU 加速微步极限制动与对数势垒力学场成为生产级精度黄金分水岭。 Physical & Mathematical Ground Truth: 连续介质变分优化泛函与 C2 平滑对数势垒函数，CCD 极限界标 d_min >= 1e-4 * L0，全域闭包交集为空。正交穿插超弹性圆环在轴向压扁至间隙极限并施加 180 度扭转剪切，接触斑长宽比 a/b = 2.45 +- 0.05。 Visual Inspection Criteria: 穿透深度严格为 0；接触斑中心法向间隙维持在 0.05*d_hat +- 0.005*d_hat；von Mises 应力峰值相对误差 < 2.0%。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "M. Li et al., Incremental Potential Contact, ACM TOG (SIGGRAPH 2020), DOI: 10.1145/3386569.3392425; C-IPC (SIGGRAPH 2021).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "增量势接触双环极限制动与对数势垒无穿模高能剪切解析场",
    groundTruth: "连续介质变分优化泛函与 C2 平滑对数势垒函数，CCD 极限界标 d_min >= 1e-4 * L0，全域闭包交集为空。正交穿插超弹性圆环在轴向压扁至间隙极限并施加 180 度扭转剪切，接触斑长宽比 a/b = 2.45 +- 0.05。",
    evaluationCriteria: "穿透深度严格为 0；接触斑中心法向间隙维持在 0.05*d_hat +- 0.005*d_hat；von Mises 应力峰值相对误差 < 2.0%。",
    referenceSource: "M. Li et al., Incremental Potential Contact, ACM TOG (SIGGRAPH 2020), DOI: 10.1145/3386569.3392425; C-IPC (SIGGRAPH 2021).",
  },
};

/**
 * VFX-SIM-02: 物质点法弹塑性沙柱塌落相变与 Drucker-Prager 剪切带滑移剖面
 */
export const VFX_SIM_02_PROMPT: PromptSpec = {
  id: "VFX-SIM-02",
  label: "物质点法弹塑性沙柱塌落相变与 Drucker-Prager 剪切带滑移剖面 (MPM Granular Column Collapse with Drucker-Prager Elastoplastic Yield & Slip Surface)",
  template: "Generate an SVG technical visualization of MPM Granular Column Collapse with Drucker-Prager Elastoplastic Yield & Slip Surface as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: MPM 在处理特大变形相变上具有绝对优势。结合 B-spline 插值与 Poly-PIC 能量守恒的 MPM 求解器能准确模拟从静止固态到流态化沙流的相变，复现经典剪切带与死区核。 Physical & Mathematical Ground Truth: Drucker-Prager 屈服准则，干沙内摩擦角 phi = 30.0 度，内聚力 c = 0。初始柱高宽比 a = 2.0。最终无量纲跑动距离 X/L0 = 3.98 +- 0.08，残余死区楔形剪切带倾角 60.0 +- 1.0 度，堆积休止角 28.5 +- 1.0 度。 Visual Inspection Criteria: 塌落包络外边界 Hausdorff 距离 / L0 < 2.5%；滑移带斜率测定值严格在 59~61 度区间；全域颗粒总体积守恒误差 < 0.3%。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "G. Klár et al., Drucker-Prager Elastoplasticity for Sand Animation, ACM TOG (SIGGRAPH 2016), DOI: 10.1145/2897824.2925901; G. Lube et al., JFM 508, 253-269 (2004).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "物质点法弹塑性沙柱塌落相变与 Drucker-Prager 剪切带滑移剖面",
    groundTruth: "Drucker-Prager 屈服准则，干沙内摩擦角 phi = 30.0 度，内聚力 c = 0。初始柱高宽比 a = 2.0。最终无量纲跑动距离 X/L0 = 3.98 +- 0.08，残余死区楔形剪切带倾角 60.0 +- 1.0 度，堆积休止角 28.5 +- 1.0 度。",
    evaluationCriteria: "塌落包络外边界 Hausdorff 距离 / L0 < 2.5%；滑移带斜率测定值严格在 59~61 度区间；全域颗粒总体积守恒误差 < 0.3%。",
    referenceSource: "G. Klár et al., Drucker-Prager Elastoplasticity for Sand Animation, ACM TOG (SIGGRAPH 2016), DOI: 10.1145/2897824.2925901; G. Lube et al., JFM 508, 253-269 (2004).",
  },
};

/**
 * VFX-SIM-03: 表面张力驱动皇冠飞溅毛细失稳与沃辛顿射流超高速回弹动力学
 */
export const VFX_SIM_03_PROMPT: PromptSpec = {
  id: "VFX-SIM-03",
  label: "表面张力驱动皇冠飞溅毛细失稳与沃辛顿射流超高速回弹动力学 (Surface-Tension-Driven Crown Splash Rim Instability & Worthington Jet Pinch-Off Dynamics)",
  template: "Generate an SVG technical visualization of Surface-Tension-Driven Crown Splash Rim Instability & Worthington Jet Pinch-Off Dynamics using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 液滴高速撞击薄液膜是 SPH、FLIP 与边界追踪算法验证表面张力模型的最高难度用例。皇冠薄壁锯齿分离与中心沃辛顿射流极速回弹伴随剧烈拓扑改变。 Physical & Mathematical Ground Truth: Young-Laplace 自由表面边界 Navier-Stokes 方程，We = 450, Re = 2200, Oh = 0.0096, h* = 0.20。皇冠边缘周向齿尖数 m = 20 +- 2 个，中心射流最高无量纲喷射高度 z_max / D0 = 3.65 +- 0.15，首枚卫星液滴剥离无量纲时间 t* = 8.4 +- 0.3。 Visual Inspection Criteria: 皇冠齿尖极值点计数精准在 18~22 区间；射流中心线倾斜角 < 0.8 度；卫星液滴直径比 0.14 +- 0.02。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "S. T. Thoroddsen, J. Sakakibara, JFM 484, 299-308 (2003); S. Wang et al., Implicit Surface Tension Formulation, ACM SIGGRAPH 2024.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "表面张力驱动皇冠飞溅毛细失稳与沃辛顿射流超高速回弹动力学",
    groundTruth: "Young-Laplace 自由表面边界 Navier-Stokes 方程，We = 450, Re = 2200, Oh = 0.0096, h* = 0.20。皇冠边缘周向齿尖数 m = 20 +- 2 个，中心射流最高无量纲喷射高度 z_max / D0 = 3.65 +- 0.15，首枚卫星液滴剥离无量纲时间 t* = 8.4 +- 0.3。",
    evaluationCriteria: "皇冠齿尖极值点计数精准在 18~22 区间；射流中心线倾斜角 < 0.8 度；卫星液滴直径比 0.14 +- 0.02。",
    referenceSource: "S. T. Thoroddsen, J. Sakakibara, JFM 484, 299-308 (2003); S. Wang et al., Implicit Surface Tension Formulation, ACM SIGGRAPH 2024.",
  },
};

/**
 * VFX-SIM-04: 粘弹性非牛顿流体 Giesekus 模头膨胀与第一法向应力差跃变场
 */
export const VFX_SIM_04_PROMPT: PromptSpec = {
  id: "VFX-SIM-04",
  label: "粘弹性非牛顿流体 Giesekus 模头膨胀与第一法向应力差跃变场 (Viscoelastic Non-Newtonian Barus Die-Swell & Kaye Effect with Giesekus Constitutive Stress Field)",
  template: "Generate an SVG technical visualization of Viscoelastic Non-Newtonian Barus Die-Swell & Kaye Effect with Giesekus Constitutive Stress Field as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 高分子聚合物展现强烈记忆效应与弹性回弹。图形学通过对数构型张量（Log-Conformation）稳定求解 Giesekus 模型，在狭缝约束消失后诱发模头截面膨胀（Die Swell）。 Physical & Mathematical Ground Truth: Giesekus 本构模型与上对流导数，各向异性迁移因子 alpha = 0.2。Wi = 2.5, Re = 0.05, beta = 0.1。Tanner 弹性恢复模头膨胀比 B_swell = [1 + 0.5*(N1/(2*tau_w))^2]^(1/6) = 1.58 +- 0.04。 Visual Inspection Criteria: 出口下游自由表面轮廓与标定样条 RMSE < 1.8%；出口角唇口奇点应力集中衰减斜率吻合度 >= 95%；轴向中心线速度减速比 0.40 +- 0.02。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "R. I. Tanner, Journal of Polymer Science (1970); R. Fattal, R. Kupferman, JNNFM (2005); C. Batty, R. Bridson, ACM TOG (SIGGRAPH 2008).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "粘弹性非牛顿流体 Giesekus 模头膨胀与第一法向应力差跃变场",
    groundTruth: "Giesekus 本构模型与上对流导数，各向异性迁移因子 alpha = 0.2。Wi = 2.5, Re = 0.05, beta = 0.1。Tanner 弹性恢复模头膨胀比 B_swell = [1 + 0.5*(N1/(2*tau_w))^2]^(1/6) = 1.58 +- 0.04。",
    evaluationCriteria: "出口下游自由表面轮廓与标定样条 RMSE < 1.8%；出口角唇口奇点应力集中衰减斜率吻合度 >= 95%；轴向中心线速度减速比 0.40 +- 0.02。",
    referenceSource: "R. I. Tanner, Journal of Polymer Science (1970); R. Fattal, R. Kupferman, JNNFM (2005); C. Batty, R. Bridson, ACM TOG (SIGGRAPH 2008).",
  },
};

/**
 * VFX-SIM-05: 极薄弹性壳体非线性点压后屈曲起皱层级与张力场分形折痕图谱
 */
export const VFX_SIM_05_PROMPT: PromptSpec = {
  id: "VFX-SIM-05",
  label: "极薄弹性壳体非线性点压后屈曲起皱层级与张力场分形折痕图谱 (Discrete Elastic Shells (DES) Post-Buckling Wrinkling Cascade & Indentation Crease Fractal)",
  template: "Generate an SVG technical visualization of Discrete Elastic Shells (DES) Post-Buckling Wrinkling Cascade & Indentation Crease Fractal as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 超薄壳体在局部受拉时在垂直方向自发出现密集起皱以消除压应力。SIGGRAPH 2026 Better Bending 基准将超薄壳体起皱列为评测最高等级。 Physical & Mathematical Ground Truth: Föppl-von Kármán 非线性大变形方程，厚度 h = 50 微米，E = 1.0GPa，nu = 0.35。外固定半径 R = 0.1m，压深 2.0mm。在 r = 0.5R 处环向特征皱褶波数 m = 32 +- 2 个波峰，临界半径 rc/R = 0.68 +- 0.02。 Visual Inspection Criteria: r = 0.5R 截线上挠度 FFT 功率谱主频峰值精确位于 k = 32（+-1）；波幅径向衰减曲线与理论曲线相关系数 R^2 >= 0.95；总弯曲能与拉伸能之比在 5.0e-4 附近。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "E. Cerda, L. Mahadevan, PRL 90, 074302 (2003); E. Grinspun et al., Discrete Shells, SCA 2003; ACM TOG (SIGGRAPH 2026).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "极薄弹性壳体非线性点压后屈曲起皱层级与张力场分形折痕图谱",
    groundTruth: "Föppl-von Kármán 非线性大变形方程，厚度 h = 50 微米，E = 1.0GPa，nu = 0.35。外固定半径 R = 0.1m，压深 2.0mm。在 r = 0.5R 处环向特征皱褶波数 m = 32 +- 2 个波峰，临界半径 rc/R = 0.68 +- 0.02。",
    evaluationCriteria: "r = 0.5R 截线上挠度 FFT 功率谱主频峰值精确位于 k = 32（+-1）；波幅径向衰减曲线与理论曲线相关系数 R^2 >= 0.95；总弯曲能与拉伸能之比在 5.0e-4 附近。",
    referenceSource: "E. Cerda, L. Mahadevan, PRL 90, 074302 (2003); E. Grinspun et al., Discrete Shells, SCA 2003; ACM TOG (SIGGRAPH 2026).",
  },
};

/**
 * VFX-SIM-06: 多相可压缩激波折射 RMI 涡核重卷与斜压涡度场
 */
export const VFX_SIM_06_PROMPT: PromptSpec = {
  id: "VFX-SIM-06",
  label: "多相可压缩激波折射 RMI 涡核重卷与斜压涡度场 (Multiphase Compressible Shock-Bubble Richtmyer-Meshkov Instability (RMI) with Baroclinic Vorticity Roll-Up)",
  template: "Generate an SVG technical visualization of Multiphase Compressible Shock-Bubble Richtmyer-Meshkov Instability (RMI) with Baroclinic Vorticity Roll-Up using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 激波扫过多相介质时，压力梯度与密度梯度不共线（nabla rho x nabla p != 0）产生斜压涡度，驱动界面重卷形成分形蘑菇状结构。 Physical & Mathematical Ground Truth: 空气与 SF6 重气泡，阿特伍德数 A = 0.667，平面入射激波 Mach = 1.22。Samtaney-Zabusky 沉积总环量 Gamma = 14.8 +- 0.5 m^2/s。无量纲时间 tau = 3.5 时，双主涡核间距 Sv/D0 = 1.15 +- 0.04，蘑菇卷头最大展宽 Wmax/D0 = 1.62 +- 0.05。 Visual Inspection Criteria: 上下涡核涡量绝对值对称度偏差 < 1.0%；内凹射流前锋坐标 Xjet/D0 = 2.10 +- 0.06；重卷界面与 Ground Truth 掩膜 Dice 系数 >= 0.94。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "J. F. Haas, B. Sturtevant, JFM 181, 41-76 (1987); R. Samtaney, N. J. Zabusky, JFM 269, 45-78 (1994).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "多相可压缩激波折射 RMI 涡核重卷与斜压涡度场",
    groundTruth: "空气与 SF6 重气泡，阿特伍德数 A = 0.667，平面入射激波 Mach = 1.22。Samtaney-Zabusky 沉积总环量 Gamma = 14.8 +- 0.5 m^2/s。无量纲时间 tau = 3.5 时，双主涡核间距 Sv/D0 = 1.15 +- 0.04，蘑菇卷头最大展宽 Wmax/D0 = 1.62 +- 0.05。",
    evaluationCriteria: "上下涡核涡量绝对值对称度偏差 < 1.0%；内凹射流前锋坐标 Xjet/D0 = 2.10 +- 0.06；重卷界面与 Ground Truth 掩膜 Dice 系数 >= 0.94。",
    referenceSource: "J. F. Haas, B. Sturtevant, JFM 181, 41-76 (1987); R. Samtaney, N. J. Zabusky, JFM 269, 45-78 (1994).",
  },
};

/**
 * VFX-SIM-07: 开尔文-亥姆霍兹剪切失稳波卷与次级涡对合并动力学
 */
export const VFX_SIM_07_PROMPT: PromptSpec = {
  id: "VFX-SIM-07",
  label: "开尔文-亥姆霍兹剪切失稳波卷与次级涡对合并动力学 (Kelvin-Helmholtz Shear Instability Billow Roll-Up, Secondary Vortex Pairing & Vorticity Cascade)",
  template: "Generate an SVG technical visualization of Kelvin-Helmholtz Shear Instability Billow Roll-Up, Secondary Vortex Pairing & Vorticity Cascade as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: KH 失稳是检验流体模拟数值粘性与涡度保持技术的经典用例。评估能否维持 Miles-Howard 稳定性界限（Ri < 0.25）并无虚假耗散再现次级涡对合并（Vortex Pairing）。 Physical & Mathematical Ground Truth: 剪切基流 U(y) = U0 * tanh(2y/delta_omega)，Re_delta = 1000。线性稳定性最快增长波数 alpha*delta = 0.444，理论主波长 lambda_KH = 14.15 * delta_omega。次谐波涡对合并后特征波长倍增为 2*lambda_KH。 Visual Inspection Criteria: 主涡中心间距实测误差 < 2.0%；两主涡间 Braid 鞍点涡度与中心比值 <= 0.12；合并中程双涡核连线与水平轴夹角达到 45.0 +- 3.0 度。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "P. G. Drazin, W. H. Reid, Hydrodynamic Stability (2004); C. D. Winant, F. K. Browand, JFM 63, 237-255 (1974); J. Selle et al., ACM TOG (SIGGRAPH 2005).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "开尔文-亥姆霍兹剪切失稳波卷与次级涡对合并动力学",
    groundTruth: "剪切基流 U(y) = U0 * tanh(2y/delta_omega)，Re_delta = 1000。线性稳定性最快增长波数 alpha*delta = 0.444，理论主波长 lambda_KH = 14.15 * delta_omega。次谐波涡对合并后特征波长倍增为 2*lambda_KH。",
    evaluationCriteria: "主涡中心间距实测误差 < 2.0%；两主涡间 Braid 鞍点涡度与中心比值 <= 0.12；合并中程双涡核连线与水平轴夹角达到 45.0 +- 3.0 度。",
    referenceSource: "P. G. Drazin, W. H. Reid, Hydrodynamic Stability (2004); C. D. Winant, F. K. Browand, JFM 63, 237-255 (1974); J. Selle et al., ACM TOG (SIGGRAPH 2005).",
  },
};

/**
 * VFX-SIM-08: 铁磁流体 Rosensweig 正常场失稳六边形圆锥尖刺阵列相变
 */
export const VFX_SIM_08_PROMPT: PromptSpec = {
  id: "VFX-SIM-08",
  label: "铁磁流体 Rosensweig 正常场失稳六边形圆锥尖刺阵列相变 (Ferrofluid Rosensweig Normal-Field Instability Hexagonal Conical Spike Array & Magnetostatic Transition)",
  template: "Generate an SVG technical visualization of Ferrofluid Rosensweig Normal-Field Instability Hexagonal Conical Spike Array & Magnetostatic Transition as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 铁磁流体垂直磁场超过临界阈值 Hc 时，表面自发发生一阶相变，形成规则的蜂窝六边形圆锥尖刺阵列。ACM TOG 2024 IoB 静磁解算器与 SIGGRAPH 边界元技术将其推向影视前沿。 Physical & Mathematical Ground Truth: Cowley-Rosensweig 临界毛细波数 kc = sqrt(rho*g/sigma)，临界晶格特征间距 lambda_c = 2*pi*sqrt(sigma/(rho*g))。水基 EMG 901 铁磁流体理论波长 9.38mm。正六边形晶格，相邻夹角 60.0 度，尖刺高宽比 0.72 +- 0.03。 Visual Inspection Criteria: 相邻 6 个最近邻尖刺夹角在 58.5~61.5 度区间；峰峰间距相对偏差 < 2.0%；尖端圆角半径在 0.15~0.25mm 之间杜绝网格奇异。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "M. D. Cowley, R. E. Rosensweig, JFM 30, 671-688 (1967); B. Ni et al., ACM TOG (2024); L. Huang, D. L. Michels, ACM TOG (SIGGRAPH Asia 2020).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "铁磁流体 Rosensweig 正常场失稳六边形圆锥尖刺阵列相变",
    groundTruth: "Cowley-Rosensweig 临界毛细波数 kc = sqrt(rho*g/sigma)，临界晶格特征间距 lambda_c = 2*pi*sqrt(sigma/(rho*g))。水基 EMG 901 铁磁流体理论波长 9.38mm。正六边形晶格，相邻夹角 60.0 度，尖刺高宽比 0.72 +- 0.03。",
    evaluationCriteria: "相邻 6 个最近邻尖刺夹角在 58.5~61.5 度区间；峰峰间距相对偏差 < 2.0%；尖端圆角半径在 0.15~0.25mm 之间杜绝网格奇异。",
    referenceSource: "M. D. Cowley, R. E. Rosensweig, JFM 30, 671-688 (1967); B. Ni et al., ACM TOG (2024); L. Huang, D. L. Michels, ACM TOG (SIGGRAPH Asia 2020).",
  },
};

/**
 * VFX-SIM-09: 撕裂流体涡丝变分拓扑重联与螺旋度跃变动力学
 */
export const VFX_SIM_09_PROMPT: PromptSpec = {
  id: "VFX-SIM-09",
  label: "撕裂流体涡丝变分拓扑重联与螺旋度跃变动力学 (Vortex Filament Variational Reconnection, Bridge Rupture & Helicity Jump Dynamics)",
  template: "Generate an SVG technical visualization of Vortex Filament Variational Reconnection, Bridge Rupture & Helicity Jump Dynamics using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 真实粘性流体中，反向涡丝极度逼近时粘性交叉扩散发生桥接断开重联，全场螺旋度不可逆突变。SIGGRAPH 2010 Weißmann-Pinkall 的变分重联与 Clebsch 标架保存是前沿方向。 Physical & Mathematical Ground Truth: 两根正交反向涡管，经历对流逼近、反平行扁平化、桥接断裂、发夹涡垂直喷射回弹四步演化。重联时间尺度 t_rec = 0.85 * d0^2 / Gamma0 +- 0.05。全场拓扑螺旋度阶跃突变 Delta H / H0 = -(38% +- 3%)。 Visual Inspection Criteria: 回弹射流轴线与初始逼近轴向严格正交，角度误差 <= 1.5 度；连通域欧拉示性数瞬间跳变；发夹回弹顶点曲率半径 kappa = 2.4/sigma0 +- 0.2。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "S. Kida, M. Takaoka, Ann. Rev. Fluid Mech. 26, 169-189 (1994); M. V. Melander, F. Hussain, PRL 62, 2497-2500 (1989); S. Weißmann, U. Pinkall, ACM TOG (SIGGRAPH 2010).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "撕裂流体涡丝变分拓扑重联与螺旋度跃变动力学",
    groundTruth: "两根正交反向涡管，经历对流逼近、反平行扁平化、桥接断裂、发夹涡垂直喷射回弹四步演化。重联时间尺度 t_rec = 0.85 * d0^2 / Gamma0 +- 0.05。全场拓扑螺旋度阶跃突变 Delta H / H0 = -(38% +- 3%)。",
    evaluationCriteria: "回弹射流轴线与初始逼近轴向严格正交，角度误差 <= 1.5 度；连通域欧拉示性数瞬间跳变；发夹回弹顶点曲率半径 kappa = 2.4/sigma0 +- 0.2。",
    referenceSource: "S. Kida, M. Takaoka, Ann. Rev. Fluid Mech. 26, 169-189 (1994); M. V. Melander, F. Hussain, PRL 62, 2497-2500 (1989); S. Weißmann, U. Pinkall, ACM TOG (SIGGRAPH 2010).",
  },
};

/**
 * VFX-SIM-10: 动态断裂相场模型超声速裂纹分叉动力学与应力波干涉图谱
 */
export const VFX_SIM_10_PROMPT: PromptSpec = {
  id: "VFX-SIM-10",
  label: "动态断裂相场模型超声速裂纹分叉动力学与应力波干涉图谱 (Dynamic Phase-Field Brittle Fracture Crack Branching & Dilatational Stress Wave Interference)",
  template: "Generate an SVG technical visualization of Dynamic Phase-Field Brittle Fracture Crack Branching & Dilatational Stress Wave Interference as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 高速撞击下微秒级裂纹扩展存在物理极限速度（约 0.6 v_R）。裂尖能量释放率超临界时发生动力学失稳，分叉为人字形裂纹。SIGGRAPH 2019 CD-MPM 与相场断裂模型避免显式网格切割拓扑奇异。 Physical & Mathematical Ground Truth: Ginzburg-Landau 裂纹相场演化方程与 PMMA 参数。纵波波速 1788m/s，瑞利波速 949m/s。Yoffe 临界分叉极限速度 v_crit = 0.60 * v_R = 570m/s。对称分支夹角 2*theta_branch = 58.5 +- 2.0 度。在板长 x/L = 0.42 +- 0.02 处分叉。 Visual Inspection Criteria: 实测两分支裂纹夹角与标定值 58.5 度绝对偏差 <= 1.5 度；分叉点坐标误差 <= 1.5%；裂尖损伤场剖面符合解析理论 d(r) = exp(-|r|/l0)，拟合 R^2 >= 0.96。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "E. H. Yoffe, Phil. Mag. 42, 739-750 (1951); B. Bourdin et al., J. Elasticity 91, 5-148 (2008); J. Wolper et al., CD-MPM, ACM TOG (SIGGRAPH 2019).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "动态断裂相场模型超声速裂纹分叉动力学与应力波干涉图谱",
    groundTruth: "Ginzburg-Landau 裂纹相场演化方程与 PMMA 参数。纵波波速 1788m/s，瑞利波速 949m/s。Yoffe 临界分叉极限速度 v_crit = 0.60 * v_R = 570m/s。对称分支夹角 2*theta_branch = 58.5 +- 2.0 度。在板长 x/L = 0.42 +- 0.02 处分叉。",
    evaluationCriteria: "实测两分支裂纹夹角与标定值 58.5 度绝对偏差 <= 1.5 度；分叉点坐标误差 <= 1.5%；裂尖损伤场剖面符合解析理论 d(r) = exp(-|r|/l0)，拟合 R^2 >= 0.96。",
    referenceSource: "E. H. Yoffe, Phil. Mag. 42, 739-750 (1951); B. Bourdin et al., J. Elasticity 91, 5-148 (2008); J. Wolper et al., CD-MPM, ACM TOG (SIGGRAPH 2019).",
  },
};

export const VFX_SIM_INDIVIDUAL_PROMPTS: readonly PromptSpec[] = [
  VFX_SIM_01_PROMPT,
  VFX_SIM_02_PROMPT,
  VFX_SIM_03_PROMPT,
  VFX_SIM_04_PROMPT,
  VFX_SIM_05_PROMPT,
  VFX_SIM_06_PROMPT,
  VFX_SIM_07_PROMPT,
  VFX_SIM_08_PROMPT,
  VFX_SIM_09_PROMPT,
  VFX_SIM_10_PROMPT,
];

/**
 * VFX-1: 连续介质物理仿真与无穿模接触动力学 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）
 */
export const VFX_SIM_SUITE_PROMPT: PromptSpec = {
  id: "vfx-sim-v1",
  label: "VFX-1: 连续介质物理仿真（十题组）",
  template: "VFX-1: 连续介质物理仿真与无穿模接触动力学 前沿工程十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",
  variables: [],
    candidates: [
    {
      id: VFX_SIM_01_PROMPT.id,
      label: "增量势接触双环极限制动与对数势垒无穿模高能剪切解析场",
      text: VFX_SIM_01_PROMPT.template,
      standard: VFX_SIM_01_PROMPT.standard,
    },
    {
      id: VFX_SIM_02_PROMPT.id,
      label: "物质点法弹塑性沙柱塌落相变与 Drucker-Prager 剪切带滑移剖面",
      text: VFX_SIM_02_PROMPT.template,
      standard: VFX_SIM_02_PROMPT.standard,
    },
    {
      id: VFX_SIM_03_PROMPT.id,
      label: "表面张力驱动皇冠飞溅毛细失稳与沃辛顿射流超高速回弹动力学",
      text: VFX_SIM_03_PROMPT.template,
      standard: VFX_SIM_03_PROMPT.standard,
    },
    {
      id: VFX_SIM_04_PROMPT.id,
      label: "粘弹性非牛顿流体 Giesekus 模头膨胀与第一法向应力差跃变场",
      text: VFX_SIM_04_PROMPT.template,
      standard: VFX_SIM_04_PROMPT.standard,
    },
    {
      id: VFX_SIM_05_PROMPT.id,
      label: "极薄弹性壳体非线性点压后屈曲起皱层级与张力场分形折痕图谱",
      text: VFX_SIM_05_PROMPT.template,
      standard: VFX_SIM_05_PROMPT.standard,
    },
    {
      id: VFX_SIM_06_PROMPT.id,
      label: "多相可压缩激波折射 RMI 涡核重卷与斜压涡度场",
      text: VFX_SIM_06_PROMPT.template,
      standard: VFX_SIM_06_PROMPT.standard,
    },
    {
      id: VFX_SIM_07_PROMPT.id,
      label: "开尔文-亥姆霍兹剪切失稳波卷与次级涡对合并动力学",
      text: VFX_SIM_07_PROMPT.template,
      standard: VFX_SIM_07_PROMPT.standard,
    },
    {
      id: VFX_SIM_08_PROMPT.id,
      label: "铁磁流体 Rosensweig 正常场失稳六边形圆锥尖刺阵列相变",
      text: VFX_SIM_08_PROMPT.template,
      standard: VFX_SIM_08_PROMPT.standard,
    },
    {
      id: VFX_SIM_09_PROMPT.id,
      label: "撕裂流体涡丝变分拓扑重联与螺旋度跃变动力学",
      text: VFX_SIM_09_PROMPT.template,
      standard: VFX_SIM_09_PROMPT.standard,
    },
    {
      id: VFX_SIM_10_PROMPT.id,
      label: "动态断裂相场模型超声速裂纹分叉动力学与应力波干涉图谱",
      text: VFX_SIM_10_PROMPT.template,
      standard: VFX_SIM_10_PROMPT.standard,
    },
  ],
  source: "M. Li et al., Incremental Potential Contact, ACM TOG (SIGGRAPH 2020), DOI: 10.1145/3386569.3392425; C-IPC (SIGGRAPH 2021).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "增量势无穿模接触动力学（IPC）、时空 FLIP 表面张力飞溅与磁流体尖刺",
    groundTruth: "以 IPC 无穿模对数势垒函数、时空 FLIP 表面张力微流体破碎皇冠飞溅、铁磁流体 Rosensweig 六边形圆锥尖刺阵列与 Kelvin-Helmholtz 剪切卷曲为基准，满足 Navier-Stokes 与变分弹性本构方程。",
    evaluationCriteria: "1. 无穿模保证：接触界面间隙严格正定，无几何穿透；2. 流体拓扑：涡度卷曲与表面张力滴落形态符合流体物理；3. 语法规范：XML 严格合法，无交互 JS。",
    referenceSource: "https://dl.acm.org/journal/tog",
  },
};

export const VFX_SIM_PROMPTS = VFX_SIM_INDIVIDUAL_PROMPTS;

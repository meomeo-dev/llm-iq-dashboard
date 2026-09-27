/**
 * FE-1: 智能计算底座、自主智能体与物理 AI 工程 前沿评测题库。
 * 全量采用纯直观可视自闭合矢量 SVG（零外部 JS，无交互式事件，支持并排直接肉眼对比）。
 */

import type { PromptSpec } from "../prompt";

/**
 * FE-AI-01: 刚体多体斜碰撞与弹性恢复冲量相图
 */
export const FE_AI_01_PROMPT: PromptSpec = {
  id: "FE-AI-01",
  label: "刚体多体斜碰撞与弹性恢复冲量相图 (Rigid Body Oblique Multi-Impact & Restitution Impulse Phase Dynamics)",
  template: "Generate an SVG technical visualization of Rigid Body Oblique Multi-Impact & Restitution Impulse Phase Dynamics using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 物理世界模型（World Models，如 Sora-2、Genesis-Physics、Cosmos-World）的核心难题之一在于对多体刚体接触、冲击瞬态突变以及角动量非弹性耦合的因果准确推演。传统大模型视觉生成常出现反弹方向违反库仑摩擦定律、碰撞瞬间物体“穿模”或转速与线动量不守恒的幻觉。 Physical & Mathematical Ground Truth: 1. **冲量-动量守恒方程**: $$J = \\int_{t_0}^{t_1} F \\, dt = m(v^+ - v^-), \\quad J_\\tau = \\int_{t_0}^{t_1} (r \\times F) \\, dt = I(\\omega^+ - \\omega^-)$$ 2. **泊松/牛顿恢复系数与库仑干摩擦锥**: $$v_{rel, n}^+ = -e \\cdot v_{rel, n}^- \\quad (0 \\le e \\le 1)$$ $$|J_t| \\le \\mu J_n \\quad (\\text{黏着贴合}) \\quad \\text{或} \\quad J_t = -\\mu \\operatorname{sgn}(v_{rel, t}) J_n \\quad (\\text{滑动摩擦})$$ 3. **拓扑与状态参数**: 质心质量 $m=2.0\\,\\text{kg}$、转动惯量 $I=\\frac{1}{6}m L^2$ 的非对称多边形刚体以初速度 $v_0 = (4.0, -6.0)\\,\\text{m/s}$、角速度 $\\omega_0 = 2.5\\,\\text{rad/s}$ 撞击倾角 $15^\\circ$ 的刚性基座；恢复系数 $e=0.65$、静动摩擦系数 $\\mu=0.35$。 Visual Inspection Criteria: - **几何与动量自洽性**: 碰撞瞬时（$t_{contact}$），冲量矢量箭头垂直于局部碰撞法线与摩擦锥投影； - **反弹轨迹曲率**: 反弹后质心抛物线 $y(x)$ 严格符合重力加速度 $g=-9.8\\,\\text{m/s}^2$ 的二次曲线； - **角动量旋向突变**: 接触点相对质心的偏心力臂 $r \\times J$ 诱发的角速度跳变 $\\Delta \\omega$ 正负号与线动量损失在视觉上严格同步。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Whittaker, E. T. *A Treatise on the Analytical Dynamics of Particles and Rigid Bodies*. Cambridge University Press. - Stewart, D. E. (2000). *Rigid-Body Dynamics with Friction and Impact*. SIAM Revi",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "刚体多体斜碰撞与弹性恢复冲量相图",
    groundTruth: "1. **冲量-动量守恒方程**: $$J = \\int_{t_0}^{t_1} F \\, dt = m(v^+ - v^-), \\quad J_\\tau = \\int_{t_0}^{t_1} (r \\times F) \\, dt = I(\\omega^+ - \\omega^-)$$ 2. **泊松/牛顿恢复系数与库仑干摩擦锥**: $$v_{rel, n}^+ = -e \\cdot v_{rel, n}^- \\quad (0 \\le e \\le 1)$$ $$|J_t| \\le \\mu J_n \\quad (\\text{黏着贴合}) \\quad \\text{或} \\quad J_t = -\\mu \\operatorname{sgn}(v_{rel, t}) J_n \\quad (\\text{滑动摩擦})$$ 3. **拓扑与状态参数**: 质心质量 $m=2.0\\,\\text{kg}$、",
    evaluationCriteria: "- **几何与动量自洽性**: 碰撞瞬时（$t_{contact}$），冲量矢量箭头垂直于局部碰撞法线与摩擦锥投影； - **反弹轨迹曲率**: 反弹后质心抛物线 $y(x)$ 严格符合重力加速度 $g=-9.8\\,\\text{m/s}^2$ 的二次曲线； - **角动量旋向突变**: 接触点相对质心的偏心力臂 $r \\times J$ 诱发的角速度跳变 $\\Delta \\omega$ 正负号与线动量损失在视觉上严格同步。",
    referenceSource: "- Whittaker, E. T. *A Treatise on the Analytical Dynamics of Particles and Rigid Bodies*. Cambridge University Press. - Stewart, D. E. (2000). *Rigid-Body Dynamics with Friction and Impact*. SIAM Review, 42(1), 3-39. DOI: `10.1137/S003614459936011X`.",
  },
};

/**
 * FE-AI-02: SPH 溃坝流体前锋非静压激波剖面
 */
export const FE_AI_02_PROMPT: PromptSpec = {
  id: "FE-AI-02",
  label: "SPH 溃坝流体前锋非静压激波剖面 (SPH Dam-Break Free-Surface Surge & Dynamic Vorticity)",
  template: "Generate an SVG technical visualization of SPH Dam-Break Free-Surface Surge & Dynamic Vorticity as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 连续介质物理世界模型（Continuous Fluid Foundation Models）评估流体生成保真度的金标准是溃坝（Dam Break）基准。纯图像扩散模型往往只能生成“水流质感”，但会在自由表面前锋波速、底部无滑移边界层诱发的反向涡度分离处严重失真。 Physical & Mathematical Ground Truth: 1. **弱可压缩 SPH (WCSPH) 动量与连续性方程**: $$\\frac{D\\mathbf{v}_i}{Dt} = -\\sum_j m_j \\left( \\frac{P_i}{\\rho_i^2} + \\frac{P_j}{\\rho_j^2} + \\Pi_{ij} \\right) \\nabla_i W_{ij} + \\mathbf{g}$$ $$\\frac{D\\rho_i}{Dt} = \\sum_j m_j (\\mathbf{v}_i - \\mathbf{v}_j) \\cdot \\nabla_i W_{ij}$$ 2. **状态方程与非量纲基准**: $$P = B \\left[ \\left(\\frac{\\rho}{\\rho_0}\\right)^\\gamma - 1 \\right], \\quad \\gamma=7, \\quad B = \\frac{c_0^2 \\rho_0}{\\gamma}$$ 无量纲归一化时间 $T = t \\sqrt{g/H_0}$，初始液柱尺寸 $W_0 \\times H_0$ ($H_0 = 2 W_0$)。 3. **关键剖面时步**: $T = 1.0, 2.0, 3.2$ 时自由液面外轮廓 $Z(X)$、激波前锋到达位置 $X_f(T) = x_{front}/H_0$（对比 Ritter 理论无摩擦解 $X_f = 2 T$ 与真实粘性壁面减速解 $X_f \\approx 1.6 T^{0.9}$）。 Visual Inspection Criteria: - **前锋形态对比**: 前锋头部不是尖锐三角形，而必须呈现非静水压隆起的钝圆舌状（Snout Wave）； - **涡度矢量场分布**: 底部固体壁面附近必须呈现由无滑移剪切生成的反向涡度核（Vorticity $\\omega = \\nabla \\times \\mathbf{v} < 0$）； - **粒子速度流线**: 上游自由坍塌区垂直下沉与底部水平射流之间保持无旋到有旋的平滑流线曲率。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Monaghan, J. J. (1994). *Simulating Free Surface Flows with SPH*. Journal of Computational Physics, 110(2), 399-406. DOI: `10.1006/jcph.1994.1034`. - Crespo, A. J. C., et al. (2015). *DualSPHysics: ",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "SPH 溃坝流体前锋非静压激波剖面",
    groundTruth: "1. **弱可压缩 SPH (WCSPH) 动量与连续性方程**: $$\\frac{D\\mathbf{v}_i}{Dt} = -\\sum_j m_j \\left( \\frac{P_i}{\\rho_i^2} + \\frac{P_j}{\\rho_j^2} + \\Pi_{ij} \\right) \\nabla_i W_{ij} + \\mathbf{g}$$ $$\\frac{D\\rho_i}{Dt} = \\sum_j m_j (\\mathbf{v}_i - \\mathbf{v}_j) \\cdot \\nabla_i W_{ij}$$ 2. **状态方程与非量纲基准**: $$P = B \\left[ \\left(\\frac{\\rho}{\\rho_0}\\right)^\\gamma - 1 \\right], \\quad \\gamma=7, \\quad B = \\frac{c_0^2 \\rho_0}{\\ga",
    evaluationCriteria: "- **前锋形态对比**: 前锋头部不是尖锐三角形，而必须呈现非静水压隆起的钝圆舌状（Snout Wave）； - **涡度矢量场分布**: 底部固体壁面附近必须呈现由无滑移剪切生成的反向涡度核（Vorticity $\\omega = \\nabla \\times \\mathbf{v} < 0$）； - **粒子速度流线**: 上游自由坍塌区垂直下沉与底部水平射流之间保持无旋到有旋的平滑流线曲率。",
    referenceSource: "- Monaghan, J. J. (1994). *Simulating Free Surface Flows with SPH*. Journal of Computational Physics, 110(2), 399-406. DOI: `10.1006/jcph.1994.1034`. - Crespo, A. J. C., et al. (2015). *DualSPHysics: Open-source parallel SPH physics engine*. Computer Physics Communications, 187, 204-216. DOI: `10.10",
  },
};

/**
 * FE-AI-03: GelSight 弹性体光度立体微结构触觉力学场
 */
export const FE_AI_03_PROMPT: PromptSpec = {
  id: "FE-AI-03",
  label: "GelSight 弹性体光度立体微结构触觉力学场 (GelSight Tactile Elastomeric Indentation & Hertzian Stress Tensor)",
  template: "Generate an SVG technical visualization of GelSight Tactile Elastomeric Indentation & Hertzian Stress Tensor as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 在具身智能物理系统（Physical AI）与灵巧手操作中，视触觉传感器（Vision-based Tactile Sensors 如 GelSight、DIGIT、Tac3D）是感知接触几何与微观三维法向/切向力分布的关键。大模型必须理解弹性硅胶涂层表面在被刚体球头压入时的接触应力场与光度三色着色机理。 Physical & Mathematical Ground Truth: 1. **弹性半空间赫兹正向压痕接触力学**: $$P(r) = P_0 \\sqrt{1 - \\left(\\frac{r}{a}\\right)^2} \\quad (r \\le a), \\quad P_0 = \\frac{3 F_z}{2 \\pi a^2}, \\quad a = \\left(\\frac{3 F_z R}{4 E^*}\\right)^{1/3}$$ $$\\frac{1}{E^*} = \\frac{1 - \\nu_1^2}{E_1} + \\frac{1 - \\nu_2^2}{E_2}$$ 2. **多向三色光度立体方程**: $$I_k(x, y) = \\rho_0 \\frac{-p L_{k,x} - q L_{k,y} + L_{k,z}}{\\sqrt{p^2 + q^2 + 1}}, \\quad k \\in \\{R, G, B\\}$$ 其中表面梯度 $p = \\partial z/\\partial x, q = \\partial z/\\partial y$，光源向量 $\\mathbf{L}_R, \\mathbf{L}_G, \\mathbf{L}_B$ 成 $120^\\circ$ 空间方位角分布。 3. **微标记位移场 (Marker Displacement)**: 切向力 $F_t$ 引起的剪切位移矢量 $\\Delta \\vec{u}(x, y)$ 在滑动临界边界发生库仑饱和。 Visual Inspection Criteria: - **微观深度重建**: 压痕等高线严格呈现半球形压头印迹的抛物曲率断面； - **RGB 光度梯度色彩**: 对应各照明角度的红、绿、蓝伪彩色阴影边界严格与曲面法向量点积 $(\\mathbf{N} \\cdot \\mathbf{L}_k)$ 几何对齐； - **剪切位移场**: 表面标记阵列（Marker Grid）在偏心受力侧发生同向位移汇聚，且中心发散度 $\\nabla \\cdot \\vec{u}$ 匹配赫兹压强梯度。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Johnson, E., & Adelson, E. H. (2009). *Retrographic Sensing for the Measurement of Surface Texture and Shape*. IEEE CVPR. - Yuan, W., Dong, S., & Adelson, E. H. (2017). *GelSight: High-Resolution Ro",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "GelSight 弹性体光度立体微结构触觉力学场",
    groundTruth: "1. **弹性半空间赫兹正向压痕接触力学**: $$P(r) = P_0 \\sqrt{1 - \\left(\\frac{r}{a}\\right)^2} \\quad (r \\le a), \\quad P_0 = \\frac{3 F_z}{2 \\pi a^2}, \\quad a = \\left(\\frac{3 F_z R}{4 E^*}\\right)^{1/3}$$ $$\\frac{1}{E^*} = \\frac{1 - \\nu_1^2}{E_1} + \\frac{1 - \\nu_2^2}{E_2}$$ 2. **多向三色光度立体方程**: $$I_k(x, y) = \\rho_0 \\frac{-p L_{k,x} - q L_{k,y} + L_{k,z}}{\\sqrt{p^2 + q^2 + 1}}, \\quad k \\in \\{R, G, B\\}$$ 其中表面梯度 $p = \\partia",
    evaluationCriteria: "- **微观深度重建**: 压痕等高线严格呈现半球形压头印迹的抛物曲率断面； - **RGB 光度梯度色彩**: 对应各照明角度的红、绿、蓝伪彩色阴影边界严格与曲面法向量点积 $(\\mathbf{N} \\cdot \\mathbf{L}_k)$ 几何对齐； - **剪切位移场**: 表面标记阵列（Marker Grid）在偏心受力侧发生同向位移汇聚，且中心发散度 $\\nabla \\cdot \\vec{u}$ 匹配赫兹压强梯度。",
    referenceSource: "- Johnson, E., & Adelson, E. H. (2009). *Retrographic Sensing for the Measurement of Surface Texture and Shape*. IEEE CVPR. - Yuan, W., Dong, S., & Adelson, E. H. (2017). *GelSight: High-Resolution Robot Tactile System for Measuring Contact Properties*. Sensors, 17(12), 2762. DOI: `10.3390/s17122762",
  },
};

/**
 * FE-AI-04: 双足机器人 LIPM 零力矩点 (ZMP) 步态极限环相图
 */
export const FE_AI_04_PROMPT: PromptSpec = {
  id: "FE-AI-04",
  label: "双足机器人 LIPM 零力矩点 (ZMP) 步态极限环相图 (Bipedal LIPM Zero Moment Point & Limit Cycle Phase Plane)",
  template: "Generate an SVG technical visualization of Bipedal LIPM Zero Moment Point & Limit Cycle Phase Plane using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 具身智能人形机器人在离散步态生成与动态平衡控制中，普遍使用线性倒立摆模型（LIPM）与零力矩点（ZMP）理论。物理 AI 必须推演机器人在连续支撑域切换下的相平面流形（Phase Plane Flow），确保质心轨迹在鞍点发散特性下依然形成稳定的周期性极限环（Limit Cycle）。 Physical & Mathematical Ground Truth: 1. **LIPM 动力学微分方程与固有角频率**: $$\\ddot{x}_c = \\frac{g}{z_c} (x_c - x_{zmp}) = \\omega_0^2 (x_c - x_{zmp}), \\quad \\omega_0 = \\sqrt{\\frac{g}{z_c}}$$ 2. **相空间特征分解与通解形式**: $$x_c(t) - x_{zmp} = \\frac{x_0 - x_{zmp} + \\dot{x}_0/\\omega_0}{2} e^{\\omega_0 t} + \\frac{x_0 - x_{zmp} - \\dot{x}_0/\\omega_0}{2} e^{-\\omega_0 t}$$ 3. **稳定极限环判定与支撑切换**: 步频周期 $T_{step}$，步长 $L$。在单脚支撑期向双脚过渡时，$x_{zmp}$ 从左脚中心瞬态或斜坡跳变至右脚中心，相轨迹 $(x_c, \\dot{x}_c/\\omega_0)$ 跨越分界线（Separatrix）并精准闭合： $$\\oint (\\dot{x}_c \\, dx_c - \\ddot{x}_c \\, d\\dot{x}_c) = 0 \\quad (\\text{闭合轨道})$$ Visual Inspection Criteria: - **相图双曲渐近线**: 相平面上的轨迹在每个支撑阶段必须严格沿特征方向向外发散（双曲鞍点动力学），严禁出现椭圆简谐振荡曲线； - **ZMP 步进跳变与支撑多边形约束**: ZMP 标线必须严格限制在双脚物理几何轮廓内部，无越界冲击； - **周期闭合度**: 动画中运行的相点在完成一步（左脚）与下一步（右脚）的完整循环后，轨迹完全重合，无相漂移（Phase Drift）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Kajita, S., et al. (2003). *Biped walking pattern generation by using preview control of zero-moment point*. IEEE ICRA. DOI: `10.1109/ROBOT.2003.1241826`. - Vukobratović, M., & Borovac, B. (2004). *",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "双足机器人 LIPM 零力矩点 (ZMP) 步态极限环相图",
    groundTruth: "1. **LIPM 动力学微分方程与固有角频率**: $$\\ddot{x}_c = \\frac{g}{z_c} (x_c - x_{zmp}) = \\omega_0^2 (x_c - x_{zmp}), \\quad \\omega_0 = \\sqrt{\\frac{g}{z_c}}$$ 2. **相空间特征分解与通解形式**: $$x_c(t) - x_{zmp} = \\frac{x_0 - x_{zmp} + \\dot{x}_0/\\omega_0}{2} e^{\\omega_0 t} + \\frac{x_0 - x_{zmp} - \\dot{x}_0/\\omega_0}{2} e^{-\\omega_0 t}$$ 3. **稳定极限环判定与支撑切换**: 步频周期 $T_{step}$，步长 $L$。在单脚支撑期向双脚过渡时，$x_{zmp}$ 从左脚中心瞬态或斜坡跳变至右脚中心，相轨迹 $(",
    evaluationCriteria: "- **相图双曲渐近线**: 相平面上的轨迹在每个支撑阶段必须严格沿特征方向向外发散（双曲鞍点动力学），严禁出现椭圆简谐振荡曲线； - **ZMP 步进跳变与支撑多边形约束**: ZMP 标线必须严格限制在双脚物理几何轮廓内部，无越界冲击； - **周期闭合度**: 动画中运行的相点在完成一步（左脚）与下一步（右脚）的完整循环后，轨迹完全重合，无相漂移（Phase Drift）。",
    referenceSource: "- Kajita, S., et al. (2003). *Biped walking pattern generation by using preview control of zero-moment point*. IEEE ICRA. DOI: `10.1109/ROBOT.2003.1241826`. - Vukobratović, M., & Borovac, B. (2004). *Zero-moment point—thirty five years of its life*. International Journal of Humanoid Robotics, 1(1), ",
  },
};

/**
 * FE-AI-05: 二层 Transformer 诱导头 (Induction Head) 因果解耦拓扑
 */
export const FE_AI_05_PROMPT: PromptSpec = {
  id: "FE-AI-05",
  label: "二层 Transformer 诱导头 (Induction Head) 因果解耦拓扑 (Induction Head Two-Layer QK/OV Causal Circuit Decomposition)",
  template: "Generate an SVG technical visualization of Induction Head Two-Layer QK/OV Causal Circuit Decomposition as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 机制可解释性（Mechanistic Interpretability）是解密大模型黑盒核心原理的科学基础。Anthropic 发现的“诱导头（Induction Head）”是解释大语言模型在无微调情况下具备上下文学习（In-Context Learning）能力的最核心极小机制子图。评测模型能否在机制层面将高维权重矩阵清晰解耦为独立的 QK（选址）与 OV（搬运）因果回路。 Physical & Mathematical Ground Truth: 1. **无注意力交互解耦公式 (Elhage et al.)**: $$A^{h} = \\text{softmax}\\left(\\frac{x^T W_E^T W_Q^h (W_K^h)^T W_E x}{\\sqrt{d_k}}\\right) \\quad (\\text{QK-Circuit})$$ $$T^{h} = W_E W_V^h (W_O^h)^T W_U \\quad (\\text{OV-Circuit})$$ 2. **跨层两头复合因果链**: - **第 0 层前向头 (Previous-Token Head, L0H1)**: 具备对角次移注意力矩阵 $A_{i, i-1} \\approx 1.0$，将位置 $i-1$ 的 token $A$ 写入位置 $i$ 的残差流； - **第 1 层诱导头 (Induction Head, L1H4)**: 其 $W_Q^1$ 关注当前 token $A$，而 $W_K^1$ 读取由 L0H1 写入的键向量，使得注意力强聚焦在先前出现过的 $A$ 之后的 token $B$；其 $W_{OV}^1$ 将 $B$ 的特征复制到当前位置输出。 3. **因果干预消歧 (Causal Scrubbing / Activation Patching)**: 对 L0H1 输出实施均值替换干预，诱导头后验几率降至随机基线。 Visual Inspection Criteria: - **残差流主干与旁路拓扑**: 图中必须有贯穿层间的水平“残差主干（Residual Stream Line）”，注意力头作为读取-写入旁路清晰挂接； - **双层电路因果跨接箭头**: 必须有由第 0 层 OV 输出直接喂入第 1 层 QK 输入的跨层前向虚线回路； - **注意力热力图模式对比**: 附带的 Attention 矩阵必须明确区分 L0H1（紧邻主对角线的带状次对角线偏移）与 L1H4（稀疏的重复序列跳跃关注斑点）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Elhage, N., Nanda, N., Olsson, C., et al. (2021). *A Mathematical Framework for Transformer Circuits*. Anthropic Transformer Circuits Thread. - Olsson, C., et al. (2022). *In-context Learning and In",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "二层 Transformer 诱导头 (Induction Head) 因果解耦拓扑",
    groundTruth: "1. **无注意力交互解耦公式 (Elhage et al.)**: $$A^{h} = \\text{softmax}\\left(\\frac{x^T W_E^T W_Q^h (W_K^h)^T W_E x}{\\sqrt{d_k}}\\right) \\quad (\\text{QK-Circuit})$$ $$T^{h} = W_E W_V^h (W_O^h)^T W_U \\quad (\\text{OV-Circuit})$$ 2. **跨层两头复合因果链**: - **第 0 层前向头 (Previous-Token Head, L0H1)**: 具备对角次移注意力矩阵 $A_{i, i-1} \\approx 1.0$，将位置 $i-1$ 的 token $A$ 写入位置 $i$ 的残差流； - **第 1 层诱导头 (Induction Head, L1H4)**: 其 $W_Q^1$ 关注",
    evaluationCriteria: "- **残差流主干与旁路拓扑**: 图中必须有贯穿层间的水平“残差主干（Residual Stream Line）”，注意力头作为读取-写入旁路清晰挂接； - **双层电路因果跨接箭头**: 必须有由第 0 层 OV 输出直接喂入第 1 层 QK 输入的跨层前向虚线回路； - **注意力热力图模式对比**: 附带的 Attention 矩阵必须明确区分 L0H1（紧邻主对角线的带状次对角线偏移）与 L1H4（稀疏的重复序列跳跃关注斑点）。",
    referenceSource: "- Elhage, N., Nanda, N., Olsson, C., et al. (2021). *A Mathematical Framework for Transformer Circuits*. Anthropic Transformer Circuits Thread. - Olsson, C., et al. (2022). *In-context Learning and Induction Heads*. arXiv: `2209.11895`.",
  },
};

/**
 * FE-AI-06: 稀疏自编码器 (SAE) 多义性解缠与多胞体特征几何
 */
export const FE_AI_06_PROMPT: PromptSpec = {
  id: "FE-AI-06",
  label: "稀疏自编码器 (SAE) 多义性解缠与多胞体特征几何 (Sparse Autoencoder Monosemantic Disentanglement & Polytope Geometry)",
  template: "Generate an SVG technical visualization of Sparse Autoencoder Monosemantic Disentanglement & Polytope Geometry as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 神经网络内部的“多义性叠加（Superposition）”使单一神经元响应多个风马牛不相及的概念。2024-2026 年机制可解释性最前沿突破是利用超完备稀疏自编码器（SAE）将隐藏层解离为高维单义性（Monosemantic）特征方向，并在特征空间中发现由 L1 正则化自然约束出的多胞体（Polytope）对称几何结构。 Physical & Mathematical Ground Truth: 1. **SAE 字典学习网络结构与优化目标**: $$f(x) = \\operatorname{ReLU}(W_e (x - b_d) + b_e), \\quad \\hat{x} = W_d f(x) + b_d$$ $$\\min_{W_e, W_d, b_e, b_d} \\mathbb{E}_{x} \\left[ \\|x - \\hat{x}\\|_2^2 + \\lambda \\sum_{i=1}^{M} |f_i(x)| \\right] \\quad (M \\gg D)$$ 2. **叠加态几何定理 (Toy Models of Superposition)**: 当特征数量 $M$ 超过隐层维度 $D$ 时，特征向量 $d_i$ 自动自发排列为高维多胞体（如二维平面五边形、三维正二十面体，或对拓对 Antipodal Pairs $d_i \\approx -d_j$）。 3. **特征干涉阻尼与余弦相似度矩阵**: $$|d_i^T d_j| \\le \\epsilon \\quad (i \\ne j), \\quad \\text{当对拓排列时 } d_i^T d_j = -1$$ Visual Inspection Criteria: - **混叠 vs 单义双区比对**: 左侧展示多义神经元混叠云团，右侧展示经 SAE 投影解纠缠后的离散单义性特征轴； - **多胞体顶点几何投影**: 超球面上的特征射线严格呈现高对称性正多边形/多胞体顶点分布，并清晰标出对拓对（Antipodal Pair）的反向共线矢量； - **稀疏激活火花条形码 (Sparsity Heatmap)**: 特征激活条形码上 99% 的槽位严格置零（灰度），仅有几个语义相关特征激活点亮（高亮彩条）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Bricken, T., Templeton, A., et al. (2023). *Towards Monosemanticity: Decomposing Language Models With Dictionary Learning*. Anthropic. - Elhage, N., Hume, T., et al. (2022). *Toy Models of Superposi",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "稀疏自编码器 (SAE) 多义性解缠与多胞体特征几何",
    groundTruth: "1. **SAE 字典学习网络结构与优化目标**: $$f(x) = \\operatorname{ReLU}(W_e (x - b_d) + b_e), \\quad \\hat{x} = W_d f(x) + b_d$$ $$\\min_{W_e, W_d, b_e, b_d} \\mathbb{E}_{x} \\left[ \\|x - \\hat{x}\\|_2^2 + \\lambda \\sum_{i=1}^{M} |f_i(x)| \\right] \\quad (M \\gg D)$$ 2. **叠加态几何定理 (Toy Models of Superposition)**: 当特征数量 $M$ 超过隐层维度 $D$ 时，特征向量 $d_i$ 自动自发排列为高维多胞体（如二维平面五边形、三维正二十面体，或对拓对 Antipodal Pairs $d_i \\approx -d_j$）。 3. **特征干",
    evaluationCriteria: "- **混叠 vs 单义双区比对**: 左侧展示多义神经元混叠云团，右侧展示经 SAE 投影解纠缠后的离散单义性特征轴； - **多胞体顶点几何投影**: 超球面上的特征射线严格呈现高对称性正多边形/多胞体顶点分布，并清晰标出对拓对（Antipodal Pair）的反向共线矢量； - **稀疏激活火花条形码 (Sparsity Heatmap)**: 特征激活条形码上 99% 的槽位严格置零（灰度），仅有几个语义相关特征激活点亮（高亮彩条）。",
    referenceSource: "- Bricken, T., Templeton, A., et al. (2023). *Towards Monosemanticity: Decomposing Language Models With Dictionary Learning*. Anthropic. - Elhage, N., Hume, T., et al. (2022). *Toy Models of Superposition*. arXiv: `2209.10652`.",
  },
};

/**
 * FE-AI-07: 微通道双相冷板气泡成核与临界热通量 (CHF) 沸腾拓扑
 */
export const FE_AI_07_PROMPT: PromptSpec = {
  id: "FE-AI-07",
  label: "微通道双相冷板气泡成核与临界热通量 (CHF) 沸腾拓扑 (Two-Phase Microchannel Cold Plate Boiling & Critical Heat Flux)",
  template: "Generate an SVG technical visualization of Two-Phase Microchannel Cold Plate Boiling & Critical Heat Flux using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 随着百兆瓦级智算中心与超高热流密度（>1500 W/cm²）AI 加速芯片（如 B200/GB200 及下一代硅光集成算力模组）的普及，单相水冷已逼近导热物理极限，微通道直接芯片两相相变冷却（Direct-to-Chip Two-Phase Cooling）成为行业攻坚高地。关键评测点在于 AI 能否准确建模气泡成核、流动沸腾流型转化及临界热通量（CHF）干涸飞温界限。 Physical & Mathematical Ground Truth: 1. **饱和相变克劳修斯-克拉珀龙方程与换热通量**: $$\\frac{dP_{sat}}{dT} = \\frac{h_{fg}}{T_{sat} (v_g - v_f)}, \\quad q'' = h_{tp} (T_{wall} - T_{sat})$$ 2. **微通道流动沸腾流型演化拓扑 (Flow Regimes)**: - **入口欠热段**: 单相对流液体； - **泡状流 (Bubbly Flow)**: 壁面粗糙空穴点状异相成核，微气泡离壁滑移； - **段塞流 (Slug Flow)**: 气泡受微通道约束聚合为 Taylor 汽弹，在壁面留下微米级超薄液膜； - **环状流与干涸点 (Annular Flow & Dryout CHF)**: 中心高速汽芯包裹周边液膜，当热流密度超过 $q''_{CHF}$ 时，壁面液膜破裂蒸干，换热系数 $h$ 陡降 1~2 个数量级，壁面温度 $T_{wall}$ 发生飞温突跃。 3. **水力摩擦与加速度压降**: $$\\left(-\\frac{dP}{dz}\\right) = \\left(-\\frac{dP}{dz}\\right)_F \\Phi_{lo}^2 + G^2 \\frac{d}{dz}\\left[\\frac{x^2}{\\rho_g \\alpha} + \\frac{(1-x)^2}{\\rho_f (1-\\alpha)}\\right]$$ Visual Inspection Criteria: - **两相界面流动演进**: 沿流动方向（从左至右），气相形态必须严格经历“细小圆泡 $\\to$ 椭圆汽弹 $\\to$ 贯穿型中心汽柱”的几何相变序列； - **液膜破裂局部红移**: 在干涸点（Dryout Point）下游，冷板壁面颜色必须从安全的蓝色/低温绿突变为警示的橙红高温飞温带； - **沿程压力梯度曲率**: 伴随干度 $x$ 增加，汽液加速造成的沿程压降曲线斜率 $|dP/dz|$ 逐渐变陡。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Kandlikar, S. G. (2002). *Fundamental issues related to flow boiling in minichannels and microchannels*. Experimental Thermal and Fluid Science, 25(5), 389-407. DOI: `10.1016/S0894-1777(02)00150-4`.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "微通道双相冷板气泡成核与临界热通量 (CHF) 沸腾拓扑",
    groundTruth: "1. **饱和相变克劳修斯-克拉珀龙方程与换热通量**: $$\\frac{dP_{sat}}{dT} = \\frac{h_{fg}}{T_{sat} (v_g - v_f)}, \\quad q'' = h_{tp} (T_{wall} - T_{sat})$$ 2. **微通道流动沸腾流型演化拓扑 (Flow Regimes)**: - **入口欠热段**: 单相对流液体； - **泡状流 (Bubbly Flow)**: 壁面粗糙空穴点状异相成核，微气泡离壁滑移； - **段塞流 (Slug Flow)**: 气泡受微通道约束聚合为 Taylor 汽弹，在壁面留下微米级超薄液膜； - **环状流与干涸点 (Annular Flow & Dryout CHF)**: 中心高速汽芯包裹周边液膜，当热流密度超过 $q''_{CHF}$ 时，壁面液膜破裂蒸干，换热系数 $h$ 陡降 1~2 个数",
    evaluationCriteria: "- **两相界面流动演进**: 沿流动方向（从左至右），气相形态必须严格经历“细小圆泡 $\\to$ 椭圆汽弹 $\\to$ 贯穿型中心汽柱”的几何相变序列； - **液膜破裂局部红移**: 在干涸点（Dryout Point）下游，冷板壁面颜色必须从安全的蓝色/低温绿突变为警示的橙红高温飞温带； - **沿程压力梯度曲率**: 伴随干度 $x$ 增加，汽液加速造成的沿程压降曲线斜率 $|dP/dz|$ 逐渐变陡。",
    referenceSource: "- Kandlikar, S. G. (2002). *Fundamental issues related to flow boiling in minichannels and microchannels*. Experimental Thermal and Fluid Science, 25(5), 389-407. DOI: `10.1016/S0894-1777(02)00150-4`. - Mudawar, I. (2001). *Assessment of high-heat-flux thermal management schemes*. IEEE Trans. Compon",
  },
};

/**
 * FE-AI-08: CDU 次级回路分形歧管水力分配网与阻力平衡
 */
export const FE_AI_08_PROMPT: PromptSpec = {
  id: "FE-AI-08",
  label: "CDU 次级回路分形歧管水力分配网与阻力平衡 (Fractal Manifold Hydraulic Network & Darcy-Weisbach Balance)",
  template: "Generate an SVG technical visualization of Fractal Manifold Hydraulic Network & Darcy-Weisbach Balance as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 智算中心冷却分发单元（Coolant Distribution Unit, CDU）负责向高密度机柜及数十个加速模组提供精准且均衡的冷却剂流量。流体分配歧管的微观失衡会导致个别芯片过热或局部“饥饿”。本题考察 AI 对树状分形歧管流体管网的压力降与达西阻力平衡计算。 Physical & Mathematical Ground Truth: 1. **沿程阻力达西-威斯巴哈方程与局部阻力**: $$\\Delta P_f = f \\frac{L}{D_h} \\frac{\\rho v^2}{2}, \\quad \\Delta P_m = K \\frac{\\rho v^2}{2}$$ 2. **仿生最小功分枝定律 (Murray's Law)**: $$D_{parent}^3 = \\sum_{k=1}^{N} D_{daughter, k}^3$$ 在对称二叉分枝下，$D_k = D_0 \\cdot 2^{-k/3}$，使各级流体壁面剪切应力保持恒定，将管网总水力能耗压至理论最低。 3. **分流一致性基尔霍夫方程组**: $$\\sum Q_{in} = \\sum Q_{out}, \\quad \\Delta P_{supply}(x) + \\Delta P_{channel, i} - \\Delta P_{return}(x) = \\Delta P_{CDU}$$ 要求各并联冷板支路流量偏差率 $\\sigma_Q / \\bar{Q} \\le 3\\%$。 Visual Inspection Criteria: - **管径层级缩放真实度**: 进液总管至各分歧管的直径粗细严格按 $2^{-1/3} \\approx 0.7937$ 的比例递减； - **压降瀑布流阶梯图 (Pressure Waterfall)**: 图示下方附带的水力势能图清晰显示“供液管静压恢复 $\\to$ 喷嘴节流加速 $\\to$ 回液管沿程减压”的闭合阶梯； - **对称阻力平衡标示**: 标注了平衡阀或锥形集箱在远端支路与近端支路维持阻力对齐的结构设计。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Murray, C. D. (1926). *The Physiological Principle of Minimum Work*. PNAS, 12(3), 207-214. DOI: `10.1073/pnas.12.3.207`. - Webb, R. L., & Kim, N. H. (2005). *Principles of Enhanced Heat Transfer*. T",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "CDU 次级回路分形歧管水力分配网与阻力平衡",
    groundTruth: "1. **沿程阻力达西-威斯巴哈方程与局部阻力**: $$\\Delta P_f = f \\frac{L}{D_h} \\frac{\\rho v^2}{2}, \\quad \\Delta P_m = K \\frac{\\rho v^2}{2}$$ 2. **仿生最小功分枝定律 (Murray's Law)**: $$D_{parent}^3 = \\sum_{k=1}^{N} D_{daughter, k}^3$$ 在对称二叉分枝下，$D_k = D_0 \\cdot 2^{-k/3}$，使各级流体壁面剪切应力保持恒定，将管网总水力能耗压至理论最低。 3. **分流一致性基尔霍夫方程组**: $$\\sum Q_{in} = \\sum Q_{out}, \\quad \\Delta P_{supply}(x) + \\Delta P_{channel, i} - \\Delta P_{return}(x) = ",
    evaluationCriteria: "- **管径层级缩放真实度**: 进液总管至各分歧管的直径粗细严格按 $2^{-1/3} \\approx 0.7937$ 的比例递减； - **压降瀑布流阶梯图 (Pressure Waterfall)**: 图示下方附带的水力势能图清晰显示“供液管静压恢复 $\\to$ 喷嘴节流加速 $\\to$ 回液管沿程减压”的闭合阶梯； - **对称阻力平衡标示**: 标注了平衡阀或锥形集箱在远端支路与近端支路维持阻力对齐的结构设计。",
    referenceSource: "- Murray, C. D. (1926). *The Physiological Principle of Minimum Work*. PNAS, 12(3), 207-214. DOI: `10.1073/pnas.12.3.207`. - Webb, R. L., & Kim, N. H. (2005). *Principles of Enhanced Heat Transfer*. Taylor & Francis. DOI: `10.1201/9781482279764`.",
  },
};

/**
 * FE-AI-09: 线性时序逻辑 (LTL) 运行时屏蔽防护与 MDP 安全包线
 */
export const FE_AI_09_PROMPT: PromptSpec = {
  id: "FE-AI-09",
  label: "线性时序逻辑 (LTL) 运行时屏蔽防护与 MDP 安全包线 (LTL Runtime Shielding & Safe MDP Reachability Envelope)",
  template: "Generate an SVG technical visualization of LTL Runtime Shielding & Safe MDP Reachability Envelope using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 自主智能体（Autonomous Agents）在物理世界执行任务时，单纯依赖强化学习奖惩容易产生不可控的“灾难性试探动作”。2025-2026 年自主系统安全工程的核心前沿是引入基于形式化方法（Formal Methods）的“LTL 运行时屏蔽（Runtime Shield）”，在底层马尔可夫决策过程（MDP）上构建不可穿越的安全可达性控制包线。 Physical & Mathematical Ground Truth: 1. **LTL 安全规约与确定性波奇自动机 (DBA)**: $$\\phi = \\square (\\neg \\text{Hazard}) \\wedge \\square (\\text{Goal} \\to \\lozenge \\text{SafeHaven})$$ 自动机元组 $\\mathcal{A}_{\\phi} = (Q, \\Sigma, \\delta, q_0, F)$。 2. **积自动机状态合成与前向 $k$ 步前瞻可达集**: $$s^\\otimes = (s_{env}, q_{ltl}) \\in S \\times Q$$ $$R_k(s) = \\{ s' \\mid \\exists a_0 \\dots a_{k-1}, P(s_{t+k}=s' \\mid s_t=s) > 0 \\}$$ 3. **最小干预屏蔽算子 (Minimal-Interference Shield Operator)**: $$\\Pi(s, a) = \\begin{cases} a & \\text{若 } \\forall s' \\in \\text{Post}(s, a), \\text{WinSafe}(s') = \\text{True} \\\\ \\arg\\min_{a' \\in \\text{SafeActions}(s)} \\|a' - a\\| & \\text{若 } a \\text{ 导致 } \\text{Hazard} \\end{cases}$$ Visual Inspection Criteria: - **探索轨迹拦截变轨**: 动画中智能体生成的试探动作箭头（黄色高亮轨迹）在逼近红色禁行区边界的刹那，被屏蔽层外框瞬间折射/纠偏为沿切线规避的安全轨迹（绿色实线）； - **自动机状态同步切分**: 右上角内嵌的 4 状态时序机节点图在拦截发生时，伴随高亮光斑的合法转移跳步，严格禁止进入陷阱死锁状态（Absorbing Error State）； - **安全屏障包线 (Safety Barrier)**: 状态空间中明确渲染出李雅普诺夫式控制屏障函数（CBF）零水平面等值线。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Alshiekh, M., Bloem, R., Ehlers, R., et al. (2018). *Safe Reinforcement Learning via Shielding*. AAAI. DOI: `10.1609/aaai.v32i1.11797`. - Baier, C., & Katoen, J.-P. (2008). *Principles of Model Chec",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "线性时序逻辑 (LTL) 运行时屏蔽防护与 MDP 安全包线",
    groundTruth: "1. **LTL 安全规约与确定性波奇自动机 (DBA)**: $$\\phi = \\square (\\neg \\text{Hazard}) \\wedge \\square (\\text{Goal} \\to \\lozenge \\text{SafeHaven})$$ 自动机元组 $\\mathcal{A}_{\\phi} = (Q, \\Sigma, \\delta, q_0, F)$。 2. **积自动机状态合成与前向 $k$ 步前瞻可达集**: $$s^\\otimes = (s_{env}, q_{ltl}) \\in S \\times Q$$ $$R_k(s) = \\{ s' \\mid \\exists a_0 \\dots a_{k-1}, P(s_{t+k}=s' \\mid s_t=s) > 0 \\}$$ 3. **最小干预屏蔽算子 (Minimal-Interference Shield Oper",
    evaluationCriteria: "- **探索轨迹拦截变轨**: 动画中智能体生成的试探动作箭头（黄色高亮轨迹）在逼近红色禁行区边界的刹那，被屏蔽层外框瞬间折射/纠偏为沿切线规避的安全轨迹（绿色实线）； - **自动机状态同步切分**: 右上角内嵌的 4 状态时序机节点图在拦截发生时，伴随高亮光斑的合法转移跳步，严格禁止进入陷阱死锁状态（Absorbing Error State）； - **安全屏障包线 (Safety Barrier)**: 状态空间中明确渲染出李雅普诺夫式控制屏障函数（CBF）零水平面等值线。",
    referenceSource: "- Alshiekh, M., Bloem, R., Ehlers, R., et al. (2018). *Safe Reinforcement Learning via Shielding*. AAAI. DOI: `10.1609/aaai.v32i1.11797`. - Baier, C., & Katoen, J.-P. (2008). *Principles of Model Checking*. MIT Press. ISBN: `978-0262026499`.",
  },
};

/**
 * FE-AI-10: 分层任务网络 (HTN) 递归分解树与 MCTS 帕累托剪枝前沿
 */
export const FE_AI_10_PROMPT: PromptSpec = {
  id: "FE-AI-10",
  label: "分层任务网络 (HTN) 递归分解树与 MCTS 帕累托剪枝前沿 (HTN Recursive Goal Tree & MCTS Pareto Pruning Frontier)",
  template: "Generate an SVG technical visualization of HTN Recursive Goal Tree & MCTS Pareto Pruning Frontier as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 在长程复杂智能体工作流（Agentic Workflows，如自动科研代理、自主运维智能体）中，单纯依靠线性思维链（CoT）极易出现发散与死循环。前沿工程已演进至分层任务网络（HTN）递归目标分解与蒙特卡洛树搜索（MCTS）相结合的架构。评测关注模型能否清晰刻画任务分解分支、前置条件门禁及推理 Token 消耗与成功率的帕累托最优边界。 Physical & Mathematical Ground Truth: 1. **HTN 任务递归分解体系**: $$\\text{Task} = \\begin{cases} \\text{Primitive} & (\\text{直接执行原子动作 } \\text{Act}(a)) \\\\ \\text{Compound} & (\\text{经由候选方法 } M_k \\text{ 分解为子任务序列 } [T_{k,1}, \\dots, T_{k,n}]) \\end{cases}$$ 每个分解方法 $M_k$ 携带显式前置断言 $\\text{Pre}(M_k) \\subseteq \\mathcal{S}$。 2. **PUCT 树搜索探索-利用折偏与剪枝准则**: $$\\text{PUCT}(s, a) = \\frac{Q(s, a)}{N(s, a)} + c_{puct} P(s, a) \\frac{\\sqrt{\\sum_b N(s, b)}}{1 + N(s, a)}$$ 当节点访问下界估计 $Q_{upper}(s) < \\max_{s'} Q_{lower}(s')$ 时，触发绝对剪枝（Pruning）。 3. **计算预算与效用帕累托前沿**: $$\\mathcal{P}^* = \\{(C_i, U_i) \\mid \\nexists j, C_j \\le C_i \\wedge U_j \\ge U_i \\text{ 且至少一个严格不等}\\}$$ 以 Token 预算为横轴、任务成功率/效用为纵轴的凹函数包络。 Visual Inspection Criteria: - **递归树结构层级感**: 左侧 HTN 目标树清晰展现根任务（Root Goal）到复合任务（Compound）、再到基元动作（Primitive Nodes）的三级矩形卡片分布； - **剪枝与因果门禁标示**: 被修剪的低价值路径带有明显的红色虚线与剪刀/阻止符号，成功通向叶子节点的可行路径带有绿色流向箭头与通过的校验标识（Checkmarks）； - **右侧 Pareto 前沿双轴点阵**: 准确绘制离散搜索点群及其外围凸包包络线，并标注“思考收益递减转折点（Diminishing Returns Knee Point）”。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Erol, K., Hendler, J., & Nau, D. S. (1994). *UMCP: A Systematic Approach to Hierarchical Task-Network Planning*. Artificial Intelligence Planning Systems (AIPS). - Yao, S., Yu, D., et al. (2023). *T",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "分层任务网络 (HTN) 递归分解树与 MCTS 帕累托剪枝前沿",
    groundTruth: "1. **HTN 任务递归分解体系**: $$\\text{Task} = \\begin{cases} \\text{Primitive} & (\\text{直接执行原子动作 } \\text{Act}(a)) \\\\ \\text{Compound} & (\\text{经由候选方法 } M_k \\text{ 分解为子任务序列 } [T_{k,1}, \\dots, T_{k,n}]) \\end{cases}$$ 每个分解方法 $M_k$ 携带显式前置断言 $\\text{Pre}(M_k) \\subseteq \\mathcal{S}$。 2. **PUCT 树搜索探索-利用折偏与剪枝准则**: $$\\text{PUCT}(s, a) = \\frac{Q(s, a)}{N(s, a)} + c_{puct} P(s, a) \\frac{\\sqrt{\\sum_b N(s, b)}}{1 + N(s, a)",
    evaluationCriteria: "- **递归树结构层级感**: 左侧 HTN 目标树清晰展现根任务（Root Goal）到复合任务（Compound）、再到基元动作（Primitive Nodes）的三级矩形卡片分布； - **剪枝与因果门禁标示**: 被修剪的低价值路径带有明显的红色虚线与剪刀/阻止符号，成功通向叶子节点的可行路径带有绿色流向箭头与通过的校验标识（Checkmarks）； - **右侧 Pareto 前沿双轴点阵**: 准确绘制离散搜索点群及其外围凸包包络线，并标注“思考收益递减转折点（Diminishing Returns Knee Point）”。",
    referenceSource: "- Erol, K., Hendler, J., & Nau, D. S. (1994). *UMCP: A Systematic Approach to Hierarchical Task-Network Planning*. Artificial Intelligence Planning Systems (AIPS). - Yao, S., Yu, D., et al. (2023). *Tree of Thoughts: Deliberate Problem Solving with Large Language Models*. NeurIPS. - Silver, D., et a",
  },
};

export const FE_AI_PROMPTS: readonly PromptSpec[] = [
  FE_AI_01_PROMPT,
  FE_AI_02_PROMPT,
  FE_AI_03_PROMPT,
  FE_AI_04_PROMPT,
  FE_AI_05_PROMPT,
  FE_AI_06_PROMPT,
  FE_AI_07_PROMPT,
  FE_AI_08_PROMPT,
  FE_AI_09_PROMPT,
  FE_AI_10_PROMPT,
];


/**
 * FE-1: 智能计算底座、自主智能体与物理 AI 工程 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）
 */
export const FE_AI_SUITE_PROMPT: PromptSpec = {
  id: "fe-ai-v1",
  label: "FE-1: 智能计算底座与物理AI（十题组）",
  template: "FE-1: 智能计算底座、自主智能体与物理 AI 工程 前沿工程十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",
  variables: [],
      candidates: [
    {
      id: FE_AI_01_PROMPT.id,
      label: "刚体多体斜碰撞与弹性恢复冲量相图",
      text: FE_AI_01_PROMPT.template,
      standard: FE_AI_01_PROMPT.standard,
    },
    {
      id: FE_AI_02_PROMPT.id,
      label: "SPH 溃坝流体前锋非静压激波剖面",
      text: FE_AI_02_PROMPT.template,
      standard: FE_AI_02_PROMPT.standard,
    },
    {
      id: FE_AI_03_PROMPT.id,
      label: "GelSight 弹性体光度立体微结构触觉力学场",
      text: FE_AI_03_PROMPT.template,
      standard: FE_AI_03_PROMPT.standard,
    },
    {
      id: FE_AI_04_PROMPT.id,
      label: "双足机器人 LIPM 零力矩点 (ZMP) 步态极限环",
      text: FE_AI_04_PROMPT.template,
      standard: FE_AI_04_PROMPT.standard,
    },
    {
      id: FE_AI_05_PROMPT.id,
      label: "二层 Transformer 诱导头因果解耦拓扑",
      text: FE_AI_05_PROMPT.template,
      standard: FE_AI_05_PROMPT.standard,
    },
    {
      id: FE_AI_06_PROMPT.id,
      label: "稀疏自编码器 (SAE) 多义性解缠与多胞体特征几何",
      text: FE_AI_06_PROMPT.template,
      standard: FE_AI_06_PROMPT.standard,
    },
    {
      id: FE_AI_07_PROMPT.id,
      label: "微通道双相冷板气泡成核与临界热通量沸腾拓扑",
      text: FE_AI_07_PROMPT.template,
      standard: FE_AI_07_PROMPT.standard,
    },
    {
      id: FE_AI_08_PROMPT.id,
      label: "CDU 次级回路分形歧管水力分配网与阻力平衡",
      text: FE_AI_08_PROMPT.template,
      standard: FE_AI_08_PROMPT.standard,
    },
    {
      id: FE_AI_09_PROMPT.id,
      label: "线性时序逻辑 (LTL) 运行时屏蔽防护与 MDP 安全包线",
      text: FE_AI_09_PROMPT.template,
      standard: FE_AI_09_PROMPT.standard,
    },
    {
      id: FE_AI_10_PROMPT.id,
      label: "分层任务网络 (HTN) 递归分解树与 MCTS 帕累托剪枝前沿",
      text: FE_AI_10_PROMPT.template,
      standard: FE_AI_10_PROMPT.standard,
    },
  ],
  source: null,
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "物理AI空间因果推演、具身动力学与大模型机制可解释性",
    groundTruth: "以刚体多体接触碰撞冲量方程、弱可压缩 SPH 连续流体、LIPM 双足平衡极限环与 Transformer 机制回路（诱导头 QK/OV 解耦、SAE 多胞体几何）为基准，严格遵循物理守恒律与数学定理。",
    evaluationCriteria: "1. 物理真实性：冲量守恒、相空间发散渐近线与流型演进符合真实动力学；2. 机制解耦：残差流与因果跨接拓扑自洽；3. 语法规范：XML 严格合法，无交互 JS。",
    referenceSource: "https://github.com/simonw/pelican-bicycle",
  },
};

export const FE_AI_INDIVIDUAL_PROMPTS = FE_AI_PROMPTS;

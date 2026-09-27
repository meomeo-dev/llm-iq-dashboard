/**
 * VFX-5: 物理驱动运动控制、具身动力学与生物解剖 CFX 前沿评测题库。
 * 包含 10 道独立题目规格，以及 1 套领域分组聚合套题（UX 交互与轮换结构对齐四大名著 candidates 规范）。
 */

import type { PromptSpec } from "../prompt";

/**
 * VFX-MOTION-01: 弹簧加载倒立摆（SLIP）奔跑步态极限环与质心相图
 */
export const VFX_MOTION_01_PROMPT: PromptSpec = {
  id: "VFX-MOTION-01",
  label: "弹簧加载倒立摆（SLIP）奔跑步态极限环与质心相图 (Spring-Loaded Inverted Pendulum (SLIP) Running Limit Cycle & Phase Portrait)",
  template: "Generate an SVG technical visualization of Spring-Loaded Inverted Pendulum (SLIP) Running Limit Cycle & Phase Portrait as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **支撑相非线性常微分方程（以着地点为原点的极坐标系 $(r, \\theta)$，$\\theta$ 为摆杆与地面夹角）**： $$m\\ddot{r} = m r \\dot{\\theta}^2 + k(\\ell_0 - r) - mg\\sin\\theta$$ $$m r^2 \\ddot{\\theta} + 2m r \\dot{r}\\dot{\\theta} - mg r \\cos\\theta = 0$$ 2. **腾空相抛物线轨道（笛卡尔坐标系 $(x, z)$）**： $$\\ddot{x} = 0, \\quad \\ddot{z} = -g$$ 3. **标准无量纲步态基准参数**： - 系统质量 $m = 80\\,\\text{kg}$，重力加速度 $g = 9.81\\,\\text{m/s}^2$，腿自然原长 $\\ell_0 = 1.0\\,\\text{m}$。 - 腿线弹性刚度 $k = 20\\,\\text{kN/m}$（无量纲刚度 $\\tilde{k} = \\frac{k\\ell_0}{mg} \\approx 25.48$）。 - 触地角 $\\theta_{td} = 68.5^\\circ$（法向夹角 $\\alpha_{td} = 21.5^\\circ$）。 - 顶点速度 $v_{apex} = 4.0\\,\\text{m/s}$，顶点高度 $z_{apex} = 1.05\\,\\text{m}$。 - 极限环周期 $T_{stride} \\approx 0.385\\,\\text{s}$，支撑期最大压缩量 $\\Delta r_{\\max} \\approx 0.162\\,\\text{m}$。 4. **相平面闭合条件**： 在 $(z - \\ell_0, \\dot{z})$ 垂直相平面上，轨道必须呈现光滑、左右反对称、严格自闭合之椭圆变形环。机械能守恒偏差 $\\frac{|E(t) - E_0|}{E_0} < 0.5\\%$。 Visual Inspection Criteria: - **视觉肉眼判据**：左侧小球在地面跳跃时，触地时刻弹簧压缩并变色高亮（由松弛蓝过渡至压缩红），弹簧反弹推离地面时速度矢量方向平滑翻转；右侧相平面上的白光追踪点严格沿着深青色闭合极限环运转，无发散螺旋线或内缩衰减，两相交接点无折角间断。 - **机器自动化比对判据**： - 提取 SVG `<path>` 轨迹点，计算相平面闭合残差：$\\|\\mathbf{x}(T) - \\mathbf{x}(0)\\| / \\ell_0 < 0.008$（公差 $< 0.8\\%$）。 - 垂直振荡峰谷比：$z_{\\max} / z_{\\min} \\in [1.24, 1.28]$。 - 腾空与支撑时间占比（Duty Factor $\\beta = T_{stance}/T_{stride}$）：$\\beta = 0.39 \\pm 0.02$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Blickhan, R. (1989). *The spring-mass model for running and hopping*. **Journal of Biomechanics**, 22(11-12), 1217-1227. DOI: 10.1016/0021-9290(89)90224-8. - Geyer, H., Seyfarth, A., & Blickhan, R. ",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "弹簧加载倒立摆（SLIP）奔跑步态极限环与质心相图",
    groundTruth: "1. **支撑相非线性常微分方程（以着地点为原点的极坐标系 $(r, \\theta)$，$\\theta$ 为摆杆与地面夹角）**： $$m\\ddot{r} = m r \\dot{\\theta}^2 + k(\\ell_0 - r) - mg\\sin\\theta$$ $$m r^2 \\ddot{\\theta} + 2m r \\dot{r}\\dot{\\theta} - mg r \\cos\\theta = 0$$ 2. **腾空相抛物线轨道（笛卡尔坐标系 $(x, z)$）**： $$\\ddot{x} = 0, \\quad \\ddot{z} = -g$$ 3. **标准无量纲步态基准参数**： - 系",
    evaluationCriteria: "- **视觉肉眼判据**：左侧小球在地面跳跃时，触地时刻弹簧压缩并变色高亮（由松弛蓝过渡至压缩红），弹簧反弹推离地面时速度矢量方向平滑翻转；右侧相平面上的白光追踪点严格沿着深青色闭合极限环运转，无发散螺旋线或内缩衰减，两相交接点无折角间断。 - **机器自动化比对判据**： - 提取 SVG `<path>` 轨迹点，计算相平面闭合残差：$\\|\\mathbf{x}(T) - \\mathbf{x}(0)\\| / \\ell_0 < 0.008$（公差 $< 0.8\\%$）。 - 垂直振荡峰谷比：$z_{\\max} / z_{\\min} \\in [1.24, 1.28]$。 - 腾空与支撑时间占比（",
    referenceSource: "- Blickhan, R. (1989). *The spring-mass model for running and hopping*. **Journal of Biomechanics**, 22(11-12), 1217-1227. DOI: 10.1016/0021-9290(89)90224-8. - Geyer, H., Seyfarth, A., & Blickhan, R. ",
  },
};

/**
 * VFX-MOTION-02: 希尔型三元素肌肉力学张力-长度-速度三维流形
 */
export const VFX_MOTION_02_PROMPT: PromptSpec = {
  id: "VFX-MOTION-02",
  label: "希尔型三元素肌肉力学张力-长度-速度三维流形 (Hill-Type Musculotendon Tension-Length-Velocity Manifold)",
  template: "Generate an SVG technical visualization of Hill-Type Musculotendon Tension-Length-Velocity Manifold as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **肌肉-肌腱复合体平衡微分方程**： $$F_{MT} = F_T = F_M \\cos\\alpha$$ $$F_M = F_{CE} + F_{PEE} = \\left[ a(t) \\cdot f_L(\\tilde{l}_{CE}) \\cdot f_V(\\tilde{v}_{CE}) + f_{PE}(\\tilde{l}_{CE}) \\right] F_0^M$$ 其中 $\\tilde{l}_{CE} = l_{CE}/l_0^M$ 为归一化肌纤维长度，$\\tilde{v}_{CE} = v_{CE}/v_{\\max}$ 为归一化收缩速度，$a(t) \\in [0, 1]$ 为神经激活度，$\\alpha$ 为羽状角（Pennation angle）。 2. **力-长特性 $f_L(\\tilde{l}_{CE})$（主动高斯钟形曲线）**： $$f_L(\\tilde{l}_{CE}) = \\exp\\left( - \\frac{(\\tilde{l}_{CE} - 1)^2}{\\gamma} \\right), \\quad \\gamma = 0.45$$ 3. **力-速特性 $f_V(\\tilde{v}_{CE})$（双曲向心与对数饱和离心）**： $$\\text{当 } \\tilde{v}_{CE} \\le 0 \\text{ (向心收缩)}: \\quad f_V = \\frac{1 + \\tilde{v}_{CE}}{1 - \\tilde{v}_{CE}/k_c}, \\quad k_c \\approx 0.25$$ $$\\text{当 } \\tilde{v}_{CE} > 0 \\text{ (离心拉伸)}: \\quad f_V = \\frac{f_{max} \\tilde{v}_{CE} + c_e}{\\tilde{v}_{CE} + c_e}, \\quad f_{max} = 1.4, \\; c_e \\approx 0.05$$ 4. **被动并联弹性 $f_{PE}(\\tilde{l}_{CE})$（指数硬化）**： $$f_{PE}(\\tilde{l}_{CE}) = \\frac{\\exp\\left( k_{pe}(\\tilde{l}_{CE} - 1)/\\epsilon_0^M \\right) - 1}{\\exp(k_{pe}) - 1} \\quad (\\tilde{l}_{CE} > 1)$$ Visual Inspection Criteria: - **视觉肉眼判据**：SVG 剖面图须清晰区分 CE、SEE、PEE 的拓扑并串联节点；下方三条投影曲线必须呈现典型生物力学特征：(1) 主动力在 $\\tilde{l}_{CE}=1.0$ 处达极值 $1.0$；(2) 离心力平台平滑渐进于 $1.4 F_0^M$，向心力在截断速度 $-1.0 v_{\\max}$ 处降为 $0$；(3) 串联肌腱拉伸应变在 $>4\\%$ 时呈现明显的线性弹性过渡区。 - **机器自动化比对判据**： - 主动力峰值横坐标位置：$\\tilde{l}_{CE}^* = 1.00 \\pm 0.01$。 - 离心渐近线比值：$\\lim_{\\tilde{v} \\to \\infty} f_V / f_V(0) = 1.40 \\pm 0.03$。 - 曲线切线连续性：二阶导数连续性检验 $C^1$ 连续，转折点无跳变奇异点。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Zajac, F. E. (1989). *Muscle and tendon: properties, models, scaling, and application to biomechanics and motor control*. **CRC Critical Reviews in Biomedical Engineering**, 17(4), 359-411. - Millar",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "希尔型三元素肌肉力学张力-长度-速度三维流形",
    groundTruth: "1. **肌肉-肌腱复合体平衡微分方程**： $$F_{MT} = F_T = F_M \\cos\\alpha$$ $$F_M = F_{CE} + F_{PEE} = \\left[ a(t) \\cdot f_L(\\tilde{l}_{CE}) \\cdot f_V(\\tilde{v}_{CE}) + f_{PE}(\\tilde{l}_{CE}) \\right] F_0^M$$ 其中 $\\tilde{l}_{CE} = l_{CE}/l_0^M$ 为归一化肌纤维长度，$\\tilde{v}_{CE} = v_{CE}/v_{\\max}$ 为归一化收缩速度，$a(t) \\in [0, 1]$ 为神经激",
    evaluationCriteria: "- **视觉肉眼判据**：SVG 剖面图须清晰区分 CE、SEE、PEE 的拓扑并串联节点；下方三条投影曲线必须呈现典型生物力学特征：(1) 主动力在 $\\tilde{l}_{CE}=1.0$ 处达极值 $1.0$；(2) 离心力平台平滑渐进于 $1.4 F_0^M$，向心力在截断速度 $-1.0 v_{\\max}$ 处降为 $0$；(3) 串联肌腱拉伸应变在 $>4\\%$ 时呈现明显的线性弹性过渡区。 - **机器自动化比对判据**： - 主动力峰值横坐标位置：$\\tilde{l}_{CE}^* = 1.00 \\pm 0.01$。 - 离心渐近线比值：$\\lim_{\\tilde{v} \\to",
    referenceSource: "- Zajac, F. E. (1989). *Muscle and tendon: properties, models, scaling, and application to biomechanics and motor control*. **CRC Critical Reviews in Biomedical Engineering**, 17(4), 359-411. - Millar",
  },
};

/**
 * VFX-MOTION-03: 连续介质表皮-筋膜滑移与二头肌屈曲充血横向膨胀
 */
export const VFX_MOTION_03_PROMPT: PromptSpec = {
  id: "VFX-MOTION-03",
  label: "连续介质表皮-筋膜滑移与二头肌屈曲充血横向膨胀 (Tissue-CFX: Fascia-Muscle Sliding & Bicep Bulging FEM)",
  template: "Generate an SVG technical visualization of Tissue-CFX: Fascia-Muscle Sliding & Bicep Bulging FEM as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **稳定新胡克超弹性应变能密度函数（Smith et al., SIGGRAPH 2018）**： $$\\Psi_{\\text{SNH}}(\\mathbf{F}) = \\frac{\\mu}{2}(I_1 - 3) - \\mu(J - 1) + \\frac{\\lambda + \\mu}{2}(J - 1)^2$$ 其中 $\\mathbf{F} = \\frac{\\partial \\mathbf{x}}{\\partial \\mathbf{X}}$ 为变形梯度张量，$J = \\det(\\mathbf{F})$ 为体积比率，$I_1 = \\mathrm{tr}(\\mathbf{F}^T\\mathbf{F})$ 为第一变形不变量。 2. **各向异性肌纤维主动收缩第一 Piola-Kirchhoff 应力**： $$\\mathbf{P}_{\\text{total}} = \\frac{\\partial \\Psi_{\\text{SNH}}}{\\partial \\mathbf{F}} + \\sigma_{act}(t) \\cdot (\\mathbf{F}\\mathbf{a}_0 \\otimes \\mathbf{a}_0)$$ 其中 $\\mathbf{a}_0$ 为静息肌纤维主朝向矢量，$\\sigma_{act}(t)$ 为主动肌张力。 3. **筋膜滑移边界接触约束（Signorini-Coulomb 无摩擦滑移条件）**： $$g_n = (\\mathbf{x}_{\\text{skin}} - \\mathbf{x}_{\\text{muscle}}) \\cdot \\mathbf{n} \\ge 0, \\quad \\lambda_n \\ge 0, \\quad g_n \\lambda_n = 0$$ $$\\mathbf{f}_{\\text{tangential}} = \\mathbf{0} \\quad (\\text{界面允许切向滑移自由位移 } \\Delta u_\\tau)$$ 4. **宏观膨胀准则（近不可压缩性 $J \\approx 1$）**： 当二头肌轴向缩短率 $\\lambda_z = 0.70$ 时，径向必须等体积膨胀： $$\\lambda_x = \\lambda_y = \\frac{1}{\\sqrt{\\lambda_z}} = \\frac{1}{\\sqrt{0.70}} \\approx 1.195 \\quad (+19.5\\% \\text{ 截面横向扩张})$$ Visual Inspection Criteria: - **视觉肉眼判据**：屈肘过程中，二头肌腹部网格呈饱满马鞍形隆起，肌肉边界向外顶推筋膜，筋膜轮廓滑移拉伸；内联动画中肌肉纤维呈现色彩明度随 $\\sigma_{act}$ 提升而加深（充血变红）；最关键的解剖视觉特征：肌腹隆起峰值与骨骼转轴非线性脱耦，筋膜在肌肉隆起侧滑移最大，而在腱止点牢固锚定。 - **机器自动化比对判据**： - 体积恒定性约束：四面体剖面总面积误差 $\\frac{|\\Delta A|}{A_0} < 1.5\\%$。 - 径向扩张比例：在轴向缩短 $30\\%$ 处，肌腹横截面宽度必须达到基线宽度的 $1.19 \\pm 0.02$ 倍。 - 滑移位移场梯度：筋膜与肌表面节点间切向相对位移 $\\Delta u_\\tau \\ge 0.12 L_{bicep}$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Smith, B., De Goes, F., & Kim, T. (2018). *Stable neo-hookean flesh simulation*. **ACM Transactions on Graphics (TOG)**, 37(2), Article 12. DOI: 10.1145/3180491. - Romeo, M., et al. (2020). *Muscle ",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "连续介质表皮-筋膜滑移与二头肌屈曲充血横向膨胀",
    groundTruth: "1. **稳定新胡克超弹性应变能密度函数（Smith et al., SIGGRAPH 2018）**： $$\\Psi_{\\text{SNH}}(\\mathbf{F}) = \\frac{\\mu}{2}(I_1 - 3) - \\mu(J - 1) + \\frac{\\lambda + \\mu}{2}(J - 1)^2$$ 其中 $\\mathbf{F} = \\frac{\\partial \\mathbf{x}}{\\partial \\mathbf{X}}$ 为变形梯度张量，$J = \\det(\\mathbf{F})$ 为体积比率，$I_1 = \\mathrm{tr}(\\mathbf{F}^T\\mathb",
    evaluationCriteria: "- **视觉肉眼判据**：屈肘过程中，二头肌腹部网格呈饱满马鞍形隆起，肌肉边界向外顶推筋膜，筋膜轮廓滑移拉伸；内联动画中肌肉纤维呈现色彩明度随 $\\sigma_{act}$ 提升而加深（充血变红）；最关键的解剖视觉特征：肌腹隆起峰值与骨骼转轴非线性脱耦，筋膜在肌肉隆起侧滑移最大，而在腱止点牢固锚定。 - **机器自动化比对判据**： - 体积恒定性约束：四面体剖面总面积误差 $\\frac{|\\Delta A|}{A_0} < 1.5\\%$。 - 径向扩张比例：在轴向缩短 $30\\%$ 处，肌腹横截面宽度必须达到基线宽度的 $1.19 \\pm 0.02$ 倍。 - 滑移位移场梯度：筋膜与肌表面节",
    referenceSource: "- Smith, B., De Goes, F., & Kim, T. (2018). *Stable neo-hookean flesh simulation*. **ACM Transactions on Graphics (TOG)**, 37(2), Article 12. DOI: 10.1145/3180491. - Romeo, M., et al. (2020). *Muscle ",
  },
};

/**
 * VFX-MOTION-04: 鸟类飞羽微结构层叠滑移与极端各向异性气动扭转
 */
export const VFX_MOTION_04_PROMPT: PromptSpec = {
  id: "VFX-MOTION-04",
  label: "鸟类飞羽微结构层叠滑移与极端各向异性气动扭转 (Avian Feather CFX: Barbule Interlocking & Anisotropic Aero-Torsion)",
  template: "Generate an SVG technical visualization of Avian Feather CFX: Barbule Interlocking & Anisotropic Aero-Torsion as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **三参数强各向异性正交各向异性弹性能面密度（Jouve et al., SIGGRAPH 2024）**： $$W(\\mathbf{E}) = \\frac{1}{2} E_{11} C_{1111} E_{11} + \\frac{1}{2} E_{22} C_{2222} E_{22} + 2 E_{12} C_{1212} E_{12}$$ 刚度各向异性比： $$\\frac{C_{1111} (\\text{沿羽枝方向})}{C_{2222} (\\text{跨羽枝横向})} \\sim 10^4$$ 2. **微观羽小枝单向咬合接触力学（Asymmetric Micro-Frictional Interlocking）**： $$F_{\\text{slip}}(\\Delta x) = \\begin{cases} \\mu_0 N + k_{\\text{hook}} \\Delta x, & \\text{正向分离受阻（钩锁锚定）} \\\\ \\mu_{\\text{low}} N, & \\text{反向滑动（羽毛平滑复位）} \\end{cases}$$ 3. **气动弯扭耦合微分方程（沿展长 $s$ 的梁-壳耦合）**： $$EI_y \\frac{d^2 w}{ds^2} = M_y(s) = \\int_s^L L_{\\text{aero}}(s') (s' - s) ds'$$ $$GJ \\frac{d\\theta}{ds} = T_{\\text{aero}}(s) = \\int_s^L L_{\\text{aero}}(s') e(s') ds'$$ 其中气动力偏心距 $e(s) \\approx 0.25 c(s)$，导致升力直接激发扭转角 $\\theta(s)$，使翼尖冲角自动减小（Washout 效应），防止翼尖失速。 Visual Inspection Criteria: - **视觉肉眼判据**：微观剖面须清晰绘制羽轴主干、斜向羽枝、远端微小钩状羽小枝（Hooklets）与相邻羽小枝边缘法兰扣合的微观构型；宏观羽毛受压图须呈现明显的翼梢扭转下俯角（Twist-down $\\Delta \\theta \\approx -8^\\circ \\sim -12^\\circ$），并在羽片开缝处呈现微观单向互锁限制位移的层叠光影。 - **机器自动化比对判据**： - 微观钩锁几何特征：羽小枝钩间距与倾角满足 $\\alpha_{\\text{hook}} \\in [40^\\circ, 50^\\circ]$。 - 宏观弯扭变形比：翼尖垂向挠度与扭转角之比 $\\frac{w(L)}{\\theta(L)} \\in [0.15\\,\\text{m/rad}, 0.22\\,\\text{m/rad}]$。 - 弹性模量标注严格符合 $\\ge 10^3$ 阶梯量级差异。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Jouve, J., Romero, V., Narain, R., Boissieux, L., Kim, T., & Bertails-Descoubes, F. (2024). *Modelling a Feather as a Strongly Anisotropic Elastic Shell*. **ACM Transactions on Graphics (TOG)** (SIG",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "鸟类飞羽微结构层叠滑移与极端各向异性气动扭转",
    groundTruth: "1. **三参数强各向异性正交各向异性弹性能面密度（Jouve et al., SIGGRAPH 2024）**： $$W(\\mathbf{E}) = \\frac{1}{2} E_{11} C_{1111} E_{11} + \\frac{1}{2} E_{22} C_{2222} E_{22} + 2 E_{12} C_{1212} E_{12}$$ 刚度各向异性比： $$\\frac{C_{1111} (\\text{沿羽枝方向})}{C_{2222} (\\text{跨羽枝横向})} \\sim 10^4$$ 2. **微观羽小枝单向咬合接触力学（Asymmetric Micro-Friction",
    evaluationCriteria: "- **视觉肉眼判据**：微观剖面须清晰绘制羽轴主干、斜向羽枝、远端微小钩状羽小枝（Hooklets）与相邻羽小枝边缘法兰扣合的微观构型；宏观羽毛受压图须呈现明显的翼梢扭转下俯角（Twist-down $\\Delta \\theta \\approx -8^\\circ \\sim -12^\\circ$），并在羽片开缝处呈现微观单向互锁限制位移的层叠光影。 - **机器自动化比对判据**： - 微观钩锁几何特征：羽小枝钩间距与倾角满足 $\\alpha_{\\text{hook}} \\in [40^\\circ, 50^\\circ]$。 - 宏观弯扭变形比：翼尖垂向挠度与扭转角之比 $\\frac{w(L)}",
    referenceSource: "- Jouve, J., Romero, V., Narain, R., Boissieux, L., Kim, T., & Bertails-Descoubes, F. (2024). *Modelling a Feather as a Strongly Anisotropic Elastic Shell*. **ACM Transactions on Graphics (TOG)** (SIG",
  },
};

/**
 * VFX-MOTION-05: 哺乳动物四足步态弗鲁德数相变图谱
 */
export const VFX_MOTION_05_PROMPT: PromptSpec = {
  id: "VFX-MOTION-05",
  label: "哺乳动物四足步态弗鲁德数相变图谱 (Mammalian Quadruped Gait Phase Transitions across Froude Spectrum)",
  template: "Generate an SVG technical visualization of Mammalian Quadruped Gait Phase Transitions across Froude Spectrum as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **无量纲弗鲁德数定义**： $$Fr = \\frac{v^2}{g L_{\\text{leg}}}$$ 其中 $v$ 为质心巡航速度，$g = 9.81\\,\\text{m/s}^2$，$L_{\\text{leg}}$ 为四足站立有效腿长（以猎豹/犬科典型值 $L_{\\text{leg}} = 0.8\\,\\text{m}$ 为基准）。 2. **步态相变临界阈值表（Hildebrand 步态特征参数）**： - **常步（Walk, $Fr < 0.5$, 速度 $v < 2.0\\,\\text{m/s}$）**： 占空比 $\\beta > 0.5$（典型值 $0.65$）；触地相位滞后（左前落后左后）$\\phi_{lh-lf} = 0.25$；始终保持 $\\ge 2$ 足着地，重力势能与动能反相位转化（倒立摆模式）。 - **快步/小跑（Trot, $0.5 < Fr < 2.0$, 速度 $2.0 \\le v \\le 4.0\\,\\text{m/s}$）**： 占空比 $\\beta \\approx 0.40 - 0.50$；对角同相：$\\phi(LF) = \\phi(RH)$，$\\phi(RF) = \\phi(LH)$，相位差 $\\Delta \\phi = 0.50$；动能与弹性势能同相位振荡（弹簧质量模式）。 - **疾驰/袭步（Transverse / Rotary Gallop, $Fr > 2.5$, 速度 $v > 4.5\\,\\text{m/s}$）**： 占空比 $\\beta < 0.35$（高速时 $\\beta \\approx 0.22$）；对角对称性完全破缺，出现单足-单足-双足撞击与全腾空（Gathered & Extended Flight Suspensions）双腾空期。 3. **足端触地布尔指示函数**： $$S_i(t) = \\begin{cases} 1, & (t \\bmod T) / T \\in [\\phi_i, \\phi_i + \\beta] \\\\ 0, & \\text{otherwise} \\end{cases}, \\quad i \\in \\{LF, RF, LH, RH\\}$$ Visual Inspection Criteria: - **视觉肉眼判据**：中央动态甘特图（Gait Diagram）有四条平行的足迹色带（LF, RF, LH, RH），色块在水平滚动时光标指示触地期；随着上方 $Fr$ 仪表盘从 $0.2 \\to 1.0 \\to 3.0$ 切换，色带由交错的 Walk 模式平滑重组为成对并行的 Trot 模式，最后转变成不对称聚集的 Gallop 模式，且在 Gallop 模式下清晰可见两处四足全空的水平空白区间。 - **机器自动化比对判据**： - Trot 模式下对角双足相位差判定：$|\\phi_{LF} - \\phi_{RH}| < 0.02$。 - Gallop 悬空率判定：单个步态周期内 $S_{LF}+S_{RF}+S_{LH}+S_{RH} = 0$ 的时间占比 $> 15\\%$。 - $Fr$ 转换临界线标记位置：$Fr = 0.5 \\pm 0.05$ 与 $Fr = 2.2 \\pm 0.2$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Alexander, R. M. (1989). *Optimization and gaits in the locomotion of vertebrates*. **Physiological Reviews**, 69(4), 1199-1227. DOI: 10.1152/physrev.1989.69.4.1199. - Hildebrand, M. (1965). *Symmet",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "哺乳动物四足步态弗鲁德数相变图谱",
    groundTruth: "1. **无量纲弗鲁德数定义**： $$Fr = \\frac{v^2}{g L_{\\text{leg}}}$$ 其中 $v$ 为质心巡航速度，$g = 9.81\\,\\text{m/s}^2$，$L_{\\text{leg}}$ 为四足站立有效腿长（以猎豹/犬科典型值 $L_{\\text{leg}} = 0.8\\,\\text{m}$ 为基准）。 2. **步态相变临界阈值表（Hildebrand 步态特征参数）**： - **常步（Walk, $Fr < 0.5$, 速度 $v < 2.0\\,\\text{m/s}$）**： 占空比 $\\beta > 0.5$（典型值 $0.65$）；触地相位滞后（",
    evaluationCriteria: "- **视觉肉眼判据**：中央动态甘特图（Gait Diagram）有四条平行的足迹色带（LF, RF, LH, RH），色块在水平滚动时光标指示触地期；随着上方 $Fr$ 仪表盘从 $0.2 \\to 1.0 \\to 3.0$ 切换，色带由交错的 Walk 模式平滑重组为成对并行的 Trot 模式，最后转变成不对称聚集的 Gallop 模式，且在 Gallop 模式下清晰可见两处四足全空的水平空白区间。 - **机器自动化比对判据**： - Trot 模式下对角双足相位差判定：$|\\phi_{LF} - \\phi_{RH}| < 0.02$。 - Gallop 悬空率判定：单个步态周期内 $S",
    referenceSource: "- Alexander, R. M. (1989). *Optimization and gaits in the locomotion of vertebrates*. **Physiological Reviews**, 69(4), 1199-1227. DOI: 10.1152/physrev.1989.69.4.1199. - Hildebrand, M. (1965). *Symmet",
  },
};

/**
 * VFX-MOTION-06: 稠密毛发离散弹性棒（DER）超螺旋弯曲失稳与回弹松弛
 */
export const VFX_MOTION_06_PROMPT: PromptSpec = {
  id: "VFX-MOTION-06",
  label: "稠密毛发离散弹性棒（DER）超螺旋弯曲失稳与回弹松弛 (Discrete Elastic Rods: Hair Strand Superhelical Buckling & Plectoneme Formation)",
  template: "Generate an SVG technical visualization of Discrete Elastic Rods: Hair Strand Superhelical Buckling & Plectoneme Formation as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **离散弹性棒（DER）两级运动学框架（Bergou et al., 2008）**： - 中心线离散折线顶点 $\\mathbf{x}_0, \\mathbf{x}_1, \\dots, \\mathbf{x}_N$，边向量 $\\mathbf{e}^i = \\mathbf{x}_{i+1} - \\mathbf{x}_i$。 - 无扭转 Bishop 平行转运标架 $\\{\\mathbf{u}^i, \\mathbf{v}^i, \\mathbf{t}^i\\}$。 - 材料标架（Material Frame）由标量扭转角 $\\theta^i$ 确定： $$\\mathbf{m}_1^i = \\cos\\theta^i \\mathbf{u}^i + \\sin\\theta^i \\mathbf{v}^i, \\quad \\mathbf{m}_2^i = -\\sin\\theta^i \\mathbf{u}^i + \\cos\\theta^i \\mathbf{v}^i$$ 2. **总离散弹性应变能**： $$E_{\\text{total}} = E_{\\text{bend}} + E_{\\text{twist}} = \\frac{1}{2} \\sum_{k=1}^{N-1} \\frac{\\alpha (\\kappa_k - \\kappa_k^0)^2}{\\bar{l}_k} + \\frac{1}{2} \\sum_{k=1}^{N-1} \\frac{\\beta (\\Delta m_k)^2}{\\bar{l}_k}$$ 其中 $\\kappa_k = 2 \\frac{\\mathbf{e}^{k-1} \\times \\mathbf{e}^k}{\\|\\mathbf{e}^{k-1}\\|\\|\\mathbf{e}^k\\| + \\mathbf{e}^{k-1}\\cdot\\mathbf{e}^k}$ 为离散曲率双法向矢量，$\\alpha$ 为抗弯刚度，$\\beta$ 为抗扭刚度。 3. **Călugăreanu-White-Fuller 拓扑恒等式**： $$Lk = Tw + Wr$$ - 环绕数（Linking number $Lk$）在闭合或两端受约束时为常数。 - 扭转数 $Tw = \\frac{1}{2\\pi} \\int \\tau(s) ds$。 - 缠绕数（Writhe $Wr$）表征中心线几何自缠绕空间积分。 4. **临界失稳失稳判据（Michell Instability Criterion）**： 在轴向张力 $T$ 下，发生超螺旋屈曲的临界扭矩： $$\\tau_c = 2 \\sqrt{\\alpha T}$$ 一旦扭转过量，系统瞬态通过自碰撞形成半径为 $R_{\\text{loop}} \\approx \\left(\\frac{\\alpha}{2T}\\right)^{1/2}$ 的稳定 Plectoneme 螺旋纽结。 Visual Inspection Criteria: - **视觉肉眼判据**：动画中弹性细棒最初在两端旋转下仅表现为表面斑马纹条带的密集扭转；当扭角越过临界点，细棒中间猛烈突跃弯折成环，随后中心自接触螺旋缠绕形成“麻花状”Plectoneme 回环，同时两端外间距自发收缩；回弹过程带有高频欠阻尼衰减震荡。 - **机器自动化比对判据**： - 拓扑守恒度量：整个屈曲全过程中 $|Lk - (Tw + Wr)| < 0.005$。 - 临界分岔突跃时刻：屈曲发生时刻的扭矩误差满足 $|\\tau - 2\\sqrt{\\alpha T}| / \\tau_c < 3\\%$。 - 纽结自接触防穿透：中心线重叠区最近距离不得小于物理截面直径 $2r_{\\text{hair}}$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Bergou, M., Wardetzky, M., Robinson, S., Audoly, B., & Grinspun, E. (2008). *Discrete elastic rods*. **ACM Transactions on Graphics (TOG)** (SIGGRAPH 2008), 27(3), Article 63. DOI: 10.1145/1360612.1",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "稠密毛发离散弹性棒（DER）超螺旋弯曲失稳与回弹松弛",
    groundTruth: "1. **离散弹性棒（DER）两级运动学框架（Bergou et al., 2008）**： - 中心线离散折线顶点 $\\mathbf{x}_0, \\mathbf{x}_1, \\dots, \\mathbf{x}_N$，边向量 $\\mathbf{e}^i = \\mathbf{x}_{i+1} - \\mathbf{x}_i$。 - 无扭转 Bishop 平行转运标架 $\\{\\mathbf{u}^i, \\mathbf{v}^i, \\mathbf{t}^i\\}$。 - 材料标架（Material Frame）由标量扭转角 $\\theta^i$ 确定： $$\\mathbf{m}_1^i = \\cos\\t",
    evaluationCriteria: "- **视觉肉眼判据**：动画中弹性细棒最初在两端旋转下仅表现为表面斑马纹条带的密集扭转；当扭角越过临界点，细棒中间猛烈突跃弯折成环，随后中心自接触螺旋缠绕形成“麻花状”Plectoneme 回环，同时两端外间距自发收缩；回弹过程带有高频欠阻尼衰减震荡。 - **机器自动化比对判据**： - 拓扑守恒度量：整个屈曲全过程中 $|Lk - (Tw + Wr)| < 0.005$。 - 临界分岔突跃时刻：屈曲发生时刻的扭矩误差满足 $|\\tau - 2\\sqrt{\\alpha T}| / \\tau_c < 3\\%$。 - 纽结自接触防穿透：中心线重叠区最近距离不得小于物理截面直径 $2r_{\\te",
    referenceSource: "- Bergou, M., Wardetzky, M., Robinson, S., Audoly, B., & Grinspun, E. (2008). *Discrete elastic rods*. **ACM Transactions on Graphics (TOG)** (SIGGRAPH 2008), 27(3), Article 63. DOI: 10.1145/1360612.1",
  },
};

/**
 * VFX-MOTION-07: 群智自组织涌现极化序参量相变与超密规避流线
 */
export const VFX_MOTION_07_PROMPT: PromptSpec = {
  id: "VFX-MOTION-07",
  label: "群智自组织涌现极化序参量相变与超密规避流线 (Boids/Vicsek Flocking: Polarization Phase Transition & Streamline Bifurcation)",
  template: "Generate an SVG technical visualization of Boids/Vicsek Flocking: Polarization Phase Transition & Streamline Bifurcation as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **具有拓扑近邻选择的更新微分方程**： $$\\mathbf{x}_i(t + \\Delta t) = \\mathbf{x}_i(t) + \\mathbf{v}_i(t) \\Delta t$$ $$\\theta_i(t + \\Delta t) = \\operatorname{Arg}\\left( \\sum_{j \\in \\mathcal{N}_k(i)} \\mathbf{v}_j(t) + \\mathbf{F}_{\\text{repel}}(i) \\right) + \\eta \\xi_i(t)$$ 其中 $\\mathcal{N}_k(i)$ 为基于 $k$-最近邻（Topological metric-free, $k = 7$）拓扑集，$\\xi_i \\in [-\\pi, \\pi]$ 为均匀白噪声，$\\eta$ 为环境噪声强度。 2. **Reynolds 矢量力学合成三原则**： $$\\mathbf{F}_{\\text{steer}} = w_s \\frac{\\mathbf{v}_{\\text{des, sep}}}{\\|\\mathbf{v}_{\\text{des, sep}}\\|} + w_a \\frac{\\mathbf{v}_{\\text{des, align}}}{\\|\\mathbf{v}_{\\text{des, align}}\\|} + w_c \\frac{\\mathbf{v}_{\\text{des, coh}}}{\\|\\mathbf{v}_{\\text{des, coh}}\\|}$$ 3. **全局极化序参量（Polarization Order Parameter $\\varphi$）**： $$\\varphi(t) = \\frac{1}{N v_0} \\left\\| \\sum_{i=1}^N \\mathbf{v}_i(t) \\right\\| \\in [0, 1]$$ - 无序气态相（Disordered phase, $\\eta > \\eta_c$）：$\\varphi \\approx \\frac{1}{\\sqrt{N}} \\ll 1$（各向同性，宏观动量抵消）。 - 极化凝相（Ordered flocking phase, $\\eta < \\eta_c$）：$\\varphi \\to 1.0$（自发破缺，产生单一主航向）。 4. **障碍物无碰撞势流（Potential Flow Streamline Bifurcation）**： 粒子在半径为 $R$ 的圆柱障碍物前的速度修正受偶极子位势诱导： $$\\mathbf{v}_{\\text{mod}} = \\mathbf{v}_\\infty - \\frac{R^2}{r^2} [ 2(\\mathbf{v}_\\infty \\cdot \\hat{\\mathbf{r}})\\hat{\\mathbf{r}} - \\mathbf{v}_\\infty ]$$ Visual Inspection Criteria: - **视觉肉眼判据**：左侧实时曲线显示 $\\varphi(t)$ 从 $0.05$ 突变跃迁至 $0.92$ 以上的阶跃相变响应；右侧粒子场中，原本杂乱乱撞的三角形粒子在 $1.5$ 秒内自发对齐成顺时针大旋涡流；遇前方中央障碍球时，流群平滑裂解为左右两支对称流束，绕过障碍后尾部 $2R$ 距离内迅速闭合重组，无单粒子卡死在驻点（Stagnation Point）。 - **机器自动化比对判据**： - 稳定相变序参量：低温稳态时 $\\varphi_{\\text{steady}} \\ge 0.88$。 - 粒子间最小距离：所有时间步长下 $\\min_{i \\ne j} \\|\\mathbf{x}_i - \\mathbf{x}_j\\| \\ge d_{\\text{safe}}$（零重叠穿透率）。 - 尾流愈合长度：分流后重新达到局部极化 $\\varphi_{\\text{local}} > 0.8$ 的距离 $L_{\\text{heal}} \\le 2.5 R_{\\text{obs}}$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Vicsek, T., et al. (1995). *Novel type of phase transition in a system of self-driven particles*. **Physical Review Letters**, 75(6), 1226-1229. - Cavagna, A., et al. (2010). *Scale-free correlation",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "群智自组织涌现极化序参量相变与超密规避流线",
    groundTruth: "1. **具有拓扑近邻选择的更新微分方程**： $$\\mathbf{x}_i(t + \\Delta t) = \\mathbf{x}_i(t) + \\mathbf{v}_i(t) \\Delta t$$ $$\\theta_i(t + \\Delta t) = \\operatorname{Arg}\\left( \\sum_{j \\in \\mathcal{N}_k(i)} \\mathbf{v}_j(t) + \\mathbf{F}_{\\text{repel}}(i) \\right) + \\eta \\xi_i(t)$$ 其中 $\\mathcal{N}_k(i)$ 为基于 $k$-最近邻（Topological",
    evaluationCriteria: "- **视觉肉眼判据**：左侧实时曲线显示 $\\varphi(t)$ 从 $0.05$ 突变跃迁至 $0.92$ 以上的阶跃相变响应；右侧粒子场中，原本杂乱乱撞的三角形粒子在 $1.5$ 秒内自发对齐成顺时针大旋涡流；遇前方中央障碍球时，流群平滑裂解为左右两支对称流束，绕过障碍后尾部 $2R$ 距离内迅速闭合重组，无单粒子卡死在驻点（Stagnation Point）。 - **机器自动化比对判据**： - 稳定相变序参量：低温稳态时 $\\varphi_{\\text{steady}} \\ge 0.88$。 - 粒子间最小距离：所有时间步长下 $\\min_{i \\ne j} \\|\\mathbf{",
    referenceSource: "- Vicsek, T., et al. (1995). *Novel type of phase transition in a system of self-driven particles*. **Physical Review Letters**, 75(6), 1226-1229. - Cavagna, A., et al. (2010). *Scale-free correlation",
  },
};

/**
 * VFX-MOTION-08: 四足崎岖地形接触反作用力摩擦金字塔与捕获点（Capture Point）平衡恢复
 */
export const VFX_MOTION_08_PROMPT: PromptSpec = {
  id: "VFX-MOTION-08",
  label: "四足崎岖地形接触反作用力摩擦金字塔与捕获点（Capture Point）平衡恢复 (Quadruped Rough Terrain GRF Friction Pyramid & Capture Point Recovery)",
  template: "Generate an SVG technical visualization of Quadruped Rough Terrain GRF Friction Pyramid & Capture Point Recovery as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **三维质心（CoM）发散动力学与瞬时捕获点（ICP, Pratt et al. 2006）**： $$\\ddot{\\mathbf{x}}_{\\text{CoM}} = \\omega_0^2 (\\mathbf{x}_{\\text{CoM}} - \\mathbf{p}_{\\text{CoP}}), \\quad \\omega_0 = \\sqrt{\\frac{g}{z_0}}$$ 瞬时捕获点定义为： $$\\mathbf{\\xi} = \\mathbf{x}_{\\text{CoM}} + \\frac{\\dot{\\mathbf{x}}_{\\text{CoM}}}{\\omega_0}$$ 若要使角色在有限步内完全停止，下一落足点必须覆盖 $\\mathbf{\\xi}$。 2. **非平整局部接触坐标系下的线性化摩擦金字塔（Friction Pyramid）**： 对于斜面法向 $\\mathbf{n}_i$ 与切向基底 $\\{\\mathbf{t}_{1i}, \\mathbf{t}_{2i}\\}$，单足地面反作用力 $\\mathbf{f}_i$ 必须严格内接于摩擦锥： $$f_{i,n} = \\mathbf{f}_i \\cdot \\mathbf{n}_i \\ge 0 \\quad (\\text{单向受压，地表无粘聚力})$$ $$|f_{i,t1}| = |\\mathbf{f}_i \\cdot \\mathbf{t}_{1i}| \\le \\frac{\\mu}{\\sqrt{2}} f_{i,n}, \\quad |f_{i,t2}| = |\\mathbf{f}_i \\cdot \\mathbf{t}_{2i}| \\le \\frac{\\mu}{\\sqrt{2}} f_{i,n}$$ 3. **四足支撑多面体（Support Polygon）包络准则**： 全系统合力旋量（Wrench）在 CoM 处产生的等效压力中心（CoP）必须严格处于当前四足支撑脚凸包 $\\mathcal{CH}(\\{\\mathbf{p}_1, \\mathbf{p}_2, \\mathbf{p}_3, \\mathbf{p}_4\\})$ 内部，且到多面体边界的有符号距离 $d_{\\text{margin}} > 0$。 Visual Inspection Criteria: - **视觉肉眼判据**：SVG 中各个接触点画出半透明青色金字塔摩擦锥，反作用力合力矢量箭头（粗红线）必须严格位于锥体实体内部；若遭受外界冲量冲击，动态画出一条指向前方的点划线，终点标记为发光的十字标星（Capture Point $\\mathbf{\\xi}$），该点落在当前预规划的踏步阴影多边形内。 - **机器自动化比对判据**： - 摩擦力锥合规率：所有足端计算力矢量满足 $\\max\\left(\\frac{|f_{t1}|}{f_n}, \\frac{|f_{t2}|}{f_n}\\right) \\le \\frac{\\mu}{\\sqrt{2}}$（相对误差 $0\\%$ 突破容忍）。 - 捕获点坐标闭合验证：$\\|\\mathbf{\\xi} - (\\mathbf{x} + \\dot{\\mathbf{x}}\\sqrt{z_0/g})\\| / L_{\\text{leg}} < 0.005$。 - 凸多边形内外判定：CoP 距离凸包边缘裕度 $d \\ge 0.03\\,\\text{m}$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Pratt, J., Carff, J., Drakunov, S., & Goswami, A. (2006). *Capture point: A step towards humanoid push recovery*. **2006 IEEE-RAS International Conference on Humanoid Robots**, 200-207. DOI: 10.1109",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "四足崎岖地形接触反作用力摩擦金字塔与捕获点（Capture Point）平衡恢复",
    groundTruth: "1. **三维质心（CoM）发散动力学与瞬时捕获点（ICP, Pratt et al. 2006）**： $$\\ddot{\\mathbf{x}}_{\\text{CoM}} = \\omega_0^2 (\\mathbf{x}_{\\text{CoM}} - \\mathbf{p}_{\\text{CoP}}), \\quad \\omega_0 = \\sqrt{\\frac{g}{z_0}}$$ 瞬时捕获点定义为： $$\\mathbf{\\xi} = \\mathbf{x}_{\\text{CoM}} + \\frac{\\dot{\\mathbf{x}}_{\\text{CoM}}}{\\omega_0}$$ 若要使角色在",
    evaluationCriteria: "- **视觉肉眼判据**：SVG 中各个接触点画出半透明青色金字塔摩擦锥，反作用力合力矢量箭头（粗红线）必须严格位于锥体实体内部；若遭受外界冲量冲击，动态画出一条指向前方的点划线，终点标记为发光的十字标星（Capture Point $\\mathbf{\\xi}$），该点落在当前预规划的踏步阴影多边形内。 - **机器自动化比对判据**： - 摩擦力锥合规率：所有足端计算力矢量满足 $\\max\\left(\\frac{|f_{t1}|}{f_n}, \\frac{|f_{t2}|}{f_n}\\right) \\le \\frac{\\mu}{\\sqrt{2}}$（相对误差 $0\\%$ 突破容忍）。 - 捕",
    referenceSource: "- Pratt, J., Carff, J., Drakunov, S., & Goswami, A. (2006). *Capture point: A step towards humanoid push recovery*. **2006 IEEE-RAS International Conference on Humanoid Robots**, 200-207. DOI: 10.1109",
  },
};

/**
 * VFX-MOTION-09: 鱼类尾鳍逆卡门涡街反推力推进与波动应变包络
 */
export const VFX_MOTION_09_PROMPT: PromptSpec = {
  id: "VFX-MOTION-09",
  label: "鱼类尾鳍逆卡门涡街反推力推进与波动应变包络 (Carangiform Undulation & Reverse von Kármán Vortex Street Propulsion)",
  template: "Generate an SVG technical visualization of Carangiform Undulation & Reverse von Kármán Vortex Street Propulsion as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **Lighthill 细长体行波运动学包络方程**： $$y(x, t) = a(x) \\sin(k x - \\omega t)$$ 振幅包络函数 $a(x)$ 满足非线性二次多项式增长： $$a(x) = c_0 + c_1 \\left(\\frac{x}{L}\\right) + c_2 \\left(\\frac{x}{L}\\right)^2, \\quad x \\in [0, L]$$ 标准水动力学参数：$c_0 = 0.02 L$（头部微弱偏航），$c_1 = -0.08 L$，$c_2 = 0.16 L$（尾柄处大幅摆动），波数 $k = \\frac{2\\pi}{\\lambda}$，波长 $\\lambda \\approx 0.95 L$（体内存在约一个完整波长）。 2. **斯特劳哈尔数（Strouhal Number $St$）准则**： $$St = \\frac{f \\cdot A_{\\text{tail}}}{U_{\\infty}} \\in [0.25, 0.35]$$ 其中 $f = \\frac{\\omega}{2\\pi}$ 为摆尾频率，$A_{\\text{tail}} = 2 a(L)$ 为尾尖峰-峰摆动全幅值，$U_{\\infty}$ 为巡航前进速度。 3. **Lighthill 大振幅理论时间平均推力（Mean Thrust）**： $$\\bar{T} = \\frac{1}{2} m_a \\left[ \\overline{\\left(\\frac{\\partial y}{\\partial t}\\right)^2} - U_{\\infty}^2 \\overline{\\left(\\frac{\\partial y}{\\partial x}\\right)^2} \\right]_{x=L} > 0$$ 其中 $m_a = \\frac{1}{4} \\pi \\rho s_T^2$ 为尾鳍端部虚拟附加质量（$s_T$ 为尾鳍展长）。当相速度 $c = \\frac{\\omega}{k} > U_{\\infty}$ 时，推力为正。 4. **逆卡门涡街拓扑特征**： 上脱落涡为顺时针（负环量 $-\\Gamma$），下脱落涡为逆时针（正环量 $+\\Gamma$），两涡诱导出的中心轴线诱导流速度矢量 $u_{\\text{induced}} > 0$（指向后方射流），与阻力型卡门涡街严格相反。 Visual Inspection Criteria: - **视觉肉眼判据**：鱼身骨干由一条柔韧正弦样条驱动，头部摆动小、尾部摆动剧烈；在鱼尾每一次变向到达摆动极值点时，平滑释放一个带有渐变淡出效果的同心圆双色涡环，且上方涡旋顺时针旋转，下方涡旋逆时针旋转；在尾流对称线上绘制青色速度矢量箭头，箭头长且直指后方，直观展现反冲射流。 - **机器自动化比对判据**： - 行波包络单调性：$\\frac{da}{dx} > 0$ 在后半段 $x > 0.5 L$ 严格成立。 - 斯特劳哈尔数精确落位：$St = \\frac{f A}{U} = 0.28 \\pm 0.03$。 - 涡旋空间分离波长比：脱落涡中心间距 $\\Delta x_{\\text{vortex}} / \\lambda_{\\text{wave}} \\in [0.85, 1.05]$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Lighthill, M. J. (1971). *Large-amplitude elongated-body theory of fish locomotion*. **Proceedings of the Royal Society of London. Series B. Biological Sciences**, 179(1055), 125-138. DOI: 10.1098/r",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "鱼类尾鳍逆卡门涡街反推力推进与波动应变包络",
    groundTruth: "1. **Lighthill 细长体行波运动学包络方程**： $$y(x, t) = a(x) \\sin(k x - \\omega t)$$ 振幅包络函数 $a(x)$ 满足非线性二次多项式增长： $$a(x) = c_0 + c_1 \\left(\\frac{x}{L}\\right) + c_2 \\left(\\frac{x}{L}\\right)^2, \\quad x \\in [0, L]$$ 标准水动力学参数：$c_0 = 0.02 L$（头部微弱偏航），$c_1 = -0.08 L$，$c_2 = 0.16 L$（尾柄处大幅摆动），波数 $k = \\frac{2\\pi}{\\lambda}$，",
    evaluationCriteria: "- **视觉肉眼判据**：鱼身骨干由一条柔韧正弦样条驱动，头部摆动小、尾部摆动剧烈；在鱼尾每一次变向到达摆动极值点时，平滑释放一个带有渐变淡出效果的同心圆双色涡环，且上方涡旋顺时针旋转，下方涡旋逆时针旋转；在尾流对称线上绘制青色速度矢量箭头，箭头长且直指后方，直观展现反冲射流。 - **机器自动化比对判据**： - 行波包络单调性：$\\frac{da}{dx} > 0$ 在后半段 $x > 0.5 L$ 严格成立。 - 斯特劳哈尔数精确落位：$St = \\frac{f A}{U} = 0.28 \\pm 0.03$。 - 涡旋空间分离波长比：脱落涡中心间距 $\\Delta x_{\\text{vo",
    referenceSource: "- Lighthill, M. J. (1971). *Large-amplitude elongated-body theory of fish locomotion*. **Proceedings of the Royal Society of London. Series B. Biological Sciences**, 179(1055), 125-138. DOI: 10.1098/r",
  },
};

/**
 * VFX-MOTION-10: 灵巧手面接触摩擦极限椭球与滑动分岔判据
 */
export const VFX_MOTION_10_PROMPT: PromptSpec = {
  id: "VFX-MOTION-10",
  label: "灵巧手面接触摩擦极限椭球与滑动分岔判据 (Dexterous Manipulation Soft-Finger Limit Surface & Slip Bifurcation)",
  template: "Generate an SVG technical visualization of Dexterous Manipulation Soft-Finger Limit Surface & Slip Bifurcation as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **Howe-Cutkosky 极限曲面椭球解析逼近模型**： $$\\Phi(\\mathbf{w}_c) = \\frac{f_x^2 + f_y^2}{f_{\\max}^2} + \\frac{m_z^2}{m_{\\max}^2} \\le 1$$ 其中 $\\mathbf{w}_c = [f_x, f_y, m_z]^T$ 为接触摩擦旋量，$f_{\\max} = \\mu f_n$ 为纯平移最大滑动摩擦力，$m_{\\max} = c_m \\mu f_n r_c$ 为纯扭转最大抗扭力矩（$r_c$ 为接触圆斑有效接触半径，$c_m \\approx \\frac{3\\pi}{16} \\approx 0.589$ 为赫兹接触压力分布常数）。 2. **相关流动法则（Associated Flow Rule - 极值法向滑动准则）**： 当载荷处于极限曲面边界 $\\Phi(\\mathbf{w}_c) = 1$ 时，产生临界滑动。滑移相对广义速度（Twist $\\mathbf{v}_{\\text{slip}} = [v_x, v_y, \\omega_z]^T$）必须与极限曲面梯度的外法向平行： $$\\mathbf{v}_{\\text{slip}} = \\dot{\\lambda} \\nabla_{\\mathbf{w}_c} \\Phi(\\mathbf{w}_c) = \\dot{\\lambda} \\left[ \\frac{2 f_x}{f_{\\max}^2}, \\frac{2 f_y}{f_{\\max}^2}, \\frac{2 m_z}{m_{\\max}^2} \\right]^T, \\quad \\dot{\\lambda} \\ge 0$$ 3. **粘滞-滑动分岔（Stick-Slip Transition）微观剪切分界线**： 在接触圆斑 $r \\le r_c$ 上，法向应力呈抛物线分布 $\\sigma_n(r) = \\sigma_0 \\sqrt{1 - (r/r_c)^2}$。粘滞核（Stick core）半径 $r_a$ 随切向载荷 $f_t = \\sqrt{f_x^2+f_y^2}$ 增加而向内收缩： $$\\frac{r_a}{r_c} = \\left( 1 - \\frac{f_t}{\\mu f_n} \\right)^{1/3}$$ Visual Inspection Criteria: - **视觉肉眼判据**：右侧载荷空间清楚绘制三维椭球体（水平轴 $f_x, f_y$ 为主轴，垂直轴 $m_z$ 缩短），载荷工作点落在椭球内表示静摩擦锁定（Stick），落在椭球表面时从接触点引出垂直法向量，标明滑动速度分量 $\\mathbf{v}$ 与旋转速度 $\\omega$；左侧圆形接触斑用同心圆精准展现外部粉红色的滑动区（Slip annulus）与内部深蓝色的粘滞核心（Stick core）。 - **机器自动化比对判据**： - 椭球轴长比验证：长短轴比例严格满足 $\\frac{m_{\\max} / r_c}{f_{\\max}} = c_m = 0.59 \\pm 0.02$。 - 滑动流动法向正交性：计算滑移矢量与切平面的点积，判定正交误差 $|\\mathbf{v}_{\\text{slip}} \\times \\nabla \\Phi| \\approx 0$（夹角偏差 $< 1.5^\\circ$）。 - 粘滞核半径比例：当 $f_t = 0.5 \\mu f_n$ 时，内层核心半径比必须为 $r_a / r_c = (0.5)^{1/3} \\approx 0.793 \\pm 0.015$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Goyal, S., Ruina, A., & Papadopoulos, J. (1991). *Planar sliding with dry friction. Part 1. Limit surface and moment function*. **Wear**, 143(2), 307-330. DOI: 10.1016/0043-1648(91)90102-Q. - Howe, ",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "灵巧手面接触摩擦极限椭球与滑动分岔判据",
    groundTruth: "1. **Howe-Cutkosky 极限曲面椭球解析逼近模型**： $$\\Phi(\\mathbf{w}_c) = \\frac{f_x^2 + f_y^2}{f_{\\max}^2} + \\frac{m_z^2}{m_{\\max}^2} \\le 1$$ 其中 $\\mathbf{w}_c = [f_x, f_y, m_z]^T$ 为接触摩擦旋量，$f_{\\max} = \\mu f_n$ 为纯平移最大滑动摩擦力，$m_{\\max} = c_m \\mu f_n r_c$ 为纯扭转最大抗扭力矩（$r_c$ 为接触圆斑有效接触半径，$c_m \\approx \\frac{3\\pi}{16} \\approx ",
    evaluationCriteria: "- **视觉肉眼判据**：右侧载荷空间清楚绘制三维椭球体（水平轴 $f_x, f_y$ 为主轴，垂直轴 $m_z$ 缩短），载荷工作点落在椭球内表示静摩擦锁定（Stick），落在椭球表面时从接触点引出垂直法向量，标明滑动速度分量 $\\mathbf{v}$ 与旋转速度 $\\omega$；左侧圆形接触斑用同心圆精准展现外部粉红色的滑动区（Slip annulus）与内部深蓝色的粘滞核心（Stick core）。 - **机器自动化比对判据**： - 椭球轴长比验证：长短轴比例严格满足 $\\frac{m_{\\max} / r_c}{f_{\\max}} = c_m = 0.59 \\pm 0.02$。 ",
    referenceSource: "- Goyal, S., Ruina, A., & Papadopoulos, J. (1991). *Planar sliding with dry friction. Part 1. Limit surface and moment function*. **Wear**, 143(2), 307-330. DOI: 10.1016/0043-1648(91)90102-Q. - Howe, ",
  },
};

export const VFX_MOTION_INDIVIDUAL_PROMPTS: readonly PromptSpec[] = [
  VFX_MOTION_01_PROMPT,
  VFX_MOTION_02_PROMPT,
  VFX_MOTION_03_PROMPT,
  VFX_MOTION_04_PROMPT,
  VFX_MOTION_05_PROMPT,
  VFX_MOTION_06_PROMPT,
  VFX_MOTION_07_PROMPT,
  VFX_MOTION_08_PROMPT,
  VFX_MOTION_09_PROMPT,
  VFX_MOTION_10_PROMPT,
];

/**
 * VFX-5: 物理驱动运动控制、具身动力学与生物解剖 CFX 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）
 */
export const VFX_MOTION_SUITE_PROMPT: PromptSpec = {
  id: "vfx-motion-v1",
  label: "VFX-5: 物理驱动运动控制与生物解剖CFX（十题组）",
  template: "VFX-5: 物理驱动运动控制、具身动力学与生物解剖 CFX 前沿视觉特效十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",
  variables: [],
    candidates: [
    {
      id: VFX_MOTION_01_PROMPT.id,
      label: "弹簧加载倒立摆（SLIP）奔跑步态极限环与质心相图",
      text: VFX_MOTION_01_PROMPT.template,
      standard: VFX_MOTION_01_PROMPT.standard,
    },
    {
      id: VFX_MOTION_02_PROMPT.id,
      label: "希尔型三元素肌肉力学张力-长度-速度三维流形",
      text: VFX_MOTION_02_PROMPT.template,
      standard: VFX_MOTION_02_PROMPT.standard,
    },
    {
      id: VFX_MOTION_03_PROMPT.id,
      label: "连续介质表皮-筋膜滑移与二头肌屈曲充血横向膨胀",
      text: VFX_MOTION_03_PROMPT.template,
      standard: VFX_MOTION_03_PROMPT.standard,
    },
    {
      id: VFX_MOTION_04_PROMPT.id,
      label: "鸟类飞羽微结构层叠滑移与极端各向异性气动扭转",
      text: VFX_MOTION_04_PROMPT.template,
      standard: VFX_MOTION_04_PROMPT.standard,
    },
    {
      id: VFX_MOTION_05_PROMPT.id,
      label: "哺乳动物四足步态弗鲁德数相变图谱",
      text: VFX_MOTION_05_PROMPT.template,
      standard: VFX_MOTION_05_PROMPT.standard,
    },
    {
      id: VFX_MOTION_06_PROMPT.id,
      label: "稠密毛发离散弹性棒（DER）超螺旋弯曲失稳与回弹松弛",
      text: VFX_MOTION_06_PROMPT.template,
      standard: VFX_MOTION_06_PROMPT.standard,
    },
    {
      id: VFX_MOTION_07_PROMPT.id,
      label: "群智自组织涌现极化序参量相变与超密规避流线",
      text: VFX_MOTION_07_PROMPT.template,
      standard: VFX_MOTION_07_PROMPT.standard,
    },
    {
      id: VFX_MOTION_08_PROMPT.id,
      label: "四足崎岖地形接触反作用力摩擦金字塔与捕获点（Capture Point）平衡恢复",
      text: VFX_MOTION_08_PROMPT.template,
      standard: VFX_MOTION_08_PROMPT.standard,
    },
    {
      id: VFX_MOTION_09_PROMPT.id,
      label: "鱼类尾鳍逆卡门涡街反推力推进与波动应变包络",
      text: VFX_MOTION_09_PROMPT.template,
      standard: VFX_MOTION_09_PROMPT.standard,
    },
    {
      id: VFX_MOTION_10_PROMPT.id,
      label: "灵巧手面接触摩擦极限椭球与滑动分岔判据",
      text: VFX_MOTION_10_PROMPT.template,
      standard: VFX_MOTION_10_PROMPT.standard,
    },
  ],
  source: "- Blickhan, R. (1989). *The spring-mass model for running and hopping*. **Journal of Biomechanics**, 22(11-12), 1217-1227. DOI: 10.1016/0021-9290(89)90224-8. - Geyer, H., Seyfarth, A., & Blickhan, R. ",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "倒立摆 SLIP 步态极限环、希尔型肌肉力学本构与生物解剖 Tissue-CFX",
    groundTruth: "以弹簧加载倒立摆（SLIP）步态相图、希尔型（Hill-Type）三元素肌肉张力曲线、四足动物步态相变弗鲁德数与鱼类逆卡门涡街反推力推进为基准，满足生物力学欧拉-拉格朗日方程。",
    evaluationCriteria: "1. 动力学周期性：相图质心轨道平滑闭合无发散；2. 解剖形变：肌肉膨胀体积守恒与筋膜滑移真实自然；3. 语法规范：XML 严格合法，无交互 JS。",
    referenceSource: "https://www.journals.elsevier.com/journal-of-biomechanics",
  },
};

export const VFX_MOTION_PROMPTS = VFX_MOTION_INDIVIDUAL_PROMPTS;

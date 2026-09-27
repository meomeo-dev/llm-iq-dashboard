/**
 * VFX-4: 复杂多物理场、高维张量场与科学计算可视化 前沿评测题库。
 * 包含 10 道独立题目规格，以及 1 套领域分组聚合套题（UX 交互与轮换结构对齐四大名著 candidates 规范）。
 */

import type { PromptSpec } from "../prompt";

/**
 * VFX-SCIVIS-01: 非定常双旋涡流有限时间李雅普诺夫指数 (FTLE) 传输阻隔脊线与拉格朗日相干结构 (LCS)
 */
export const VFX_SCIVIS_01_PROMPT: PromptSpec = {
  id: "VFX-SCIVIS-01",
  label: "非定常双旋涡流有限时间李雅普诺夫指数 (FTLE) 传输阻隔脊线与拉格朗日相干结构 (LCS) (Unsteady Double-Gyre FTLE Transport Barrier Ridges and Lagrangian Coherent Structures)",
  template: "Generate an SVG technical visualization of Unsteady Double-Gyre FTLE Transport Barrier Ridges and Lagrangian Coherent Structures as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **流动域与解析速度场**: 定义域 $\\Omega = [0, 2] \\times [0, 1]$。流函数 $\\psi(x, y, t) = A \\sin(\\pi f(x, t)) \\sin(\\pi y)$。 其中 $f(x, t) = a(t) x^2 + b(t) x$，$a(t) = \\epsilon \\sin(\\omega t)$，$b(t) = 1 - 2\\epsilon \\sin(\\omega t)$。 解析速度场分量： $$u(x, y, t) = -\\frac{\\partial \\psi}{\\partial y} = -\\pi A \\sin(\\pi f(x, t)) \\cos(\\pi y)$$ $$v(x, y, t) = \\frac{\\partial \\psi}{\\partial x} = \\pi A \\cos(\\pi f(x, t)) \\sin(\\pi y) \\frac{\\partial f}{\\partial x} = \\pi A \\cos(\\pi f(x, t)) \\sin(\\pi y) (2 a(t) x + b(t))$$ 2. **基准参数**: $A = 0.1$，$\\epsilon = 0.25$，$\\omega = 2\\pi / 10 = 0.2\\pi$（振荡周期 $T_{period} = 10\\text{ s}$）。 3. **FTLE 解析积分与相干脊线 (Ground Truth 几何)**: - 初始时刻 $t_0 = 0$，前向积分时长 $T = 15\\text{ s}$。 - 排斥 LCS（Repelling LCS）表现为从中央鞍点 $(x \\approx 1.0, y \\approx 0.5)$ 向两侧上下边界卷吸的蛇形高陡峭度山脊线（FTLE $\\sigma_{t_0}^T \\ge 0.35$）。 - 吸引 LCS（后向积分 $T = -15\\text{ s}$）与排斥脊线在中央形成双曲横截相交（Lobes 结构），支配左右两涡之间的流体混沌对流输运。 Visual Inspection Criteria: - **拓扑不变量**: 左右两主涡核必须严格对称分布于 $x \\approx 0.5$ 与 $x \\approx 1.5$ 附近，中央鞍点流形必须贯穿上下边界 $y=0$ 与 $y=1$。 - **脊线几何位置公差**: 主排斥脊线在 $y=0.5$ 处的截距坐标误差 $\\Delta x \\le \\pm 0.03$。 - **色带连续性与标度**: 采用标准 Viridis 或 Turbo 色图，FTLE 值从 0（深蓝/紫）平滑过渡到 0.45（亮黄），脊线梯度 $\\|\\nabla \\sigma\\| > 1.5$ 区域形成清晰的单像素级骨架。 - **粒子动画保真度**: 示踪粒子沿流线动画周期必须与 $\\omega = 0.2\\pi$ 保持同步，严格体现出在脊线两侧相互背离发散的排斥动力学行为。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Shadden, S. C., Lekien, F., & Marsden, J. E. (2005). Definition and properties of Lagrangian coherent structures from finite-time Lyapunov exponents in two-dimensional aperiodic flows. *Physica D: N",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "非定常双旋涡流有限时间李雅普诺夫指数 (FTLE) 传输阻隔脊线与拉格朗日相干结构 (LCS)",
    groundTruth: "1. **流动域与解析速度场**: 定义域 $\\Omega = [0, 2] \\times [0, 1]$。流函数 $\\psi(x, y, t) = A \\sin(\\pi f(x, t)) \\sin(\\pi y)$。 其中 $f(x, t) = a(t) x^2 + b(t) x$，$a(t) = \\epsilon \\sin(\\omega t)$，$b(t) = 1 - 2\\epsilon \\sin(\\omega t)$。 解析速度场分量： $$u(x, y, t) = -\\frac{\\partial \\psi}{\\partial y} = -\\pi A \\sin(\\pi f(x, t)) \\",
    evaluationCriteria: "- **拓扑不变量**: 左右两主涡核必须严格对称分布于 $x \\approx 0.5$ 与 $x \\approx 1.5$ 附近，中央鞍点流形必须贯穿上下边界 $y=0$ 与 $y=1$。 - **脊线几何位置公差**: 主排斥脊线在 $y=0.5$ 处的截距坐标误差 $\\Delta x \\le \\pm 0.03$。 - **色带连续性与标度**: 采用标准 Viridis 或 Turbo 色图，FTLE 值从 0（深蓝/紫）平滑过渡到 0.45（亮黄），脊线梯度 $\\|\\nabla \\sigma\\| > 1.5$ 区域形成清晰的单像素级骨架。 - **粒子动画保真度**: 示踪粒子沿流线动",
    referenceSource: "- Shadden, S. C., Lekien, F., & Marsden, J. E. (2005). Definition and properties of Lagrangian coherent structures from finite-time Lyapunov exponents in two-dimensional aperiodic flows. *Physica D: N",
  },
};

/**
 * VFX-SCIVIS-02: 二维标量场莫尔斯-斯梅尔复形临界点拓扑分水岭与持续同调简化
 */
export const VFX_SCIVIS_02_PROMPT: PromptSpec = {
  id: "VFX-SCIVIS-02",
  label: "二维标量场莫尔斯-斯梅尔复形临界点拓扑分水岭与持续同调简化 (2D Scalar Morse-Smale Complex Critical Point Watershed Topology and Persistence Simplification)",
  template: "Generate an SVG technical visualization of 2D Scalar Morse-Smale Complex Critical Point Watershed Topology and Persistence Simplification as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **解析标量场定义**: 定义域 $(x, y) \\in [-2.5, 2.5] \\times [-2.5, 2.5]$。基准标量位势方程： $$f(x, y) = 1.2 e^{-((x-1)^2 + y^2)} + 1.5 e^{-((x+1)^2 + y^2)} + 1.0 e^{-(x^2 + (y-1.2)^2)} - 0.7 e^{-(x^2 + y^2)/0.6} - 0.08(x^2 + y^2)$$ 2. **临界点空间分布与分类 (Hessian 矩阵特征值分类)**: - **局部极大点 $M_i$ (Index 2)**: 3 个主峰，坐标精确位于 $M_1(1.08, 0.00)$ [$f \\approx 1.04$]、$M_2(-1.08, 0.00)$ [$f \\approx 1.35$]、$M_3(0.00, 1.25)$ [$f \\approx 0.92$]。 - **局部极小点 $m_j$ (Index 0)**: 1 个中央深坑 $m_0(0.00, 0.00)$ [$f \\approx -0.68$]，外围域边界流向无穷小。 - **鞍点 $S_k$ (Index 1)**: 3 个一阶双曲鞍点，分别连接各峰与中央凹坑：$S_{12}(0.00, -0.42)$、$S_{13}(0.62, 0.71)$、$S_{23}(-0.62, 0.71)$。 3. **莫尔斯拓扑流形与欧拉示性数约束**: - 满足 Poincaré-Hopf 定理：$\\#(\\text{Minima}) - \\#(\\text{Saddles}) + \\#(\\text{Maxima}) = 1 - 3 + 3 = 1 = \\chi(\\text{Disk})$。 - 降流形（Descending Manifold，极大点流域）与升流形（Ascending Manifold，极小点流域）正交横截，将平面精确分割为 6 个四边形晶胞（MS Cells）。 Visual Inspection Criteria: - **临界点精确定位**: 所有 7 个临界点的坐标误差必须落在欧氏距离 $L_2 \\le 0.05$ 像素当量内。 - **拓扑连接关系图 (MS Graph)**: 鞍点 $S_{13}$ 必须且仅能引出 2 条梯度上升积分线通往 $M_1$ 和 $M_3$，以及 2 条梯度下降积分线通往 $m_0$ 和无穷远边界；严禁出现非物理跨区交叉。 - **四边形晶胞着色**: 每一个 2-Cell 内部颜色需反映其归属的 $(m_j, M_i)$ 对应对，边界线粗细遵循持续同调值（Persistence Lifetime $\\Delta f$）编码。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Gyulassy, A., Bremer, P. T., Hamann, B., & Pascucci, V. (2008). A practical approach to Morse-Smale complex computation: Scalability and generality. *IEEE TVCG*, 14(6), 1619-1626. - Kissi, M., Pont,",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "二维标量场莫尔斯-斯梅尔复形临界点拓扑分水岭与持续同调简化",
    groundTruth: "1. **解析标量场定义**: 定义域 $(x, y) \\in [-2.5, 2.5] \\times [-2.5, 2.5]$。基准标量位势方程： $$f(x, y) = 1.2 e^{-((x-1)^2 + y^2)} + 1.5 e^{-((x+1)^2 + y^2)} + 1.0 e^{-(x^2 + (y-1.2)^2)} - 0.7 e^{-(x^2 + y^2)/0.6} - 0.08(x^2 + y^2)$$ 2. **临界点空间分布与分类 (Hessian 矩阵特征值分类)**: - **局部极大点 $M_i$ (Index 2)**: 3 个主峰，坐标精确位于 $M_1(1.",
    evaluationCriteria: "- **临界点精确定位**: 所有 7 个临界点的坐标误差必须落在欧氏距离 $L_2 \\le 0.05$ 像素当量内。 - **拓扑连接关系图 (MS Graph)**: 鞍点 $S_{13}$ 必须且仅能引出 2 条梯度上升积分线通往 $M_1$ 和 $M_3$，以及 2 条梯度下降积分线通往 $m_0$ 和无穷远边界；严禁出现非物理跨区交叉。 - **四边形晶胞着色**: 每一个 2-Cell 内部颜色需反映其归属的 $(m_j, M_i)$ 对应对，边界线粗细遵循持续同调值（Persistence Lifetime $\\Delta f$）编码。",
    referenceSource: "- Gyulassy, A., Bremer, P. T., Hamann, B., & Pascucci, V. (2008). A practical approach to Morse-Smale complex computation: Scalability and generality. *IEEE TVCG*, 14(6), 1619-1626. - Kissi, M., Pont,",
  },
};

/**
 * VFX-SCIVIS-03: 二阶对称张量场退化点拓扑（楔形点/三向点）与主特征超流线分界线
 */
export const VFX_SCIVIS_03_PROMPT: PromptSpec = {
  id: "VFX-SCIVIS-03",
  label: "二阶对称张量场退化点拓扑（楔形点/三向点）与主特征超流线分界线 (2D Symmetric Tensor Field Topology: Trisector/Wedge Degenerate Points and Hyperstreamline Separatrices)",
  template: "Generate an SVG technical visualization of 2D Symmetric Tensor Field Topology: Trisector/Wedge Degenerate Points and Hyperstreamline Separatrices as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **无迹无旋对称张量场解析模型**: 定义域 $(x, y) \\in [-1.5, 1.5] \\times [-1.5, 1.5]$。张量场矩阵： $$T(x, y) = \\begin{pmatrix} f(x, y) & g(x, y) \\\\ g(x, y) & -f(x, y) \\end{pmatrix}$$ 其中： $$f(x, y) = x^2 - y^2 - d^2, \\quad g(x, y) = 2 x y - c$$ 设置参数 $d = 0.6$，$c = 0$。则退化点条件为特征值差 $\\Delta \\lambda = 2 \\sqrt{f^2 + g^2} = 0$，即 $f(x, y) = 0$ 且 $g(x, y) = 0$。 2. **奇异点位置与判别式分类 (Delmarcelle-Hesselink 准则)**: - 求解得到 2 个退化奇异点：$P_1(0.6, 0)$ 与 $P_2(-0.6, 0)$。 - 计算雅可比行列式 $\\delta = \\frac{\\partial f}{\\partial x} \\frac{\\partial g}{\\partial y} - \\frac{\\partial f}{\\partial y} \\frac{\\partial g}{\\partial x}$： 在 $P_1(0.6, 0)$ 处，$\\frac{\\partial f}{\\partial x} = 1.2, \\frac{\\partial f}{\\partial y} = 0, \\frac{\\partial g}{\\partial x} = 0, \\frac{\\partial g}{\\partial y} = 1.2$，$\\delta_1 = 1.44 > 0 \\implies$ **楔形点 (Wedge Point)**，张量指数 $I_1 = +1/2$。 引出 1 条或 2 条特征分离线（Separatrices）。 - 叠加上线性剪切场 $f_{ext} = \\alpha x, g_{ext} = -\\beta y$ 后可激发出 $\\delta < 0$ 的 **三向点 (Trisector Point)**，张量指数 $I_2 = -1/2$，必须放射出 3 条夹角为 $120^\\circ$ 的主分离线。 3. **特征向量场方向角**: 主应变特征线方向满足 $\\theta(x, y) = \\frac{1}{2} \\operatorname{atan2}(g(x, y), f(x, y))$。 Visual Inspection Criteria: - **拓扑不变量判定**: 全局封闭回路环绕 $P_1$ 与 $P_2$ 的 Poincaré 指数积分必须精确为 $\\oint d\\theta = \\pi (+1/2)$ 或 $2\\pi$。 - **三向点 3 支分离线对称性**: Trisector 奇异点周围必须展现出明显的三角扇形区（Trisector sectors），3 条主积分线射出角度误差 $\\le \\pm 5^\\circ$。 - **双正交超流线（Hyperstreamlines）网格**: 最大主应变特征线（主拉应力，红线）与最小主应变特征线（主压应力，蓝线）在全域任意非退化点必须保持 $90^\\circ$ 严格正交。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Delmarcelle, T., & Hesselink, L. (1994). The topology of symmetric, second-order tensor fields. *Proceedings IEEE Visualization '94*, 140-147. - Hung, S. H., Zhang, Y., & Zhang, E. (2024). Global to",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "二阶对称张量场退化点拓扑（楔形点/三向点）与主特征超流线分界线",
    groundTruth: "1. **无迹无旋对称张量场解析模型**: 定义域 $(x, y) \\in [-1.5, 1.5] \\times [-1.5, 1.5]$。张量场矩阵： $$T(x, y) = \\begin{pmatrix} f(x, y) & g(x, y) \\\\ g(x, y) & -f(x, y) \\end{pmatrix}$$ 其中： $$f(x, y) = x^2 - y^2 - d^2, \\quad g(x, y) = 2 x y - c$$ 设置参数 $d = 0.6$，$c = 0$。则退化点条件为特征值差 $\\Delta \\lambda = 2 \\sqrt{f^2 + g^2} = 0$，即",
    evaluationCriteria: "- **拓扑不变量判定**: 全局封闭回路环绕 $P_1$ 与 $P_2$ 的 Poincaré 指数积分必须精确为 $\\oint d\\theta = \\pi (+1/2)$ 或 $2\\pi$。 - **三向点 3 支分离线对称性**: Trisector 奇异点周围必须展现出明显的三角扇形区（Trisector sectors），3 条主积分线射出角度误差 $\\le \\pm 5^\\circ$。 - **双正交超流线（Hyperstreamlines）网格**: 最大主应变特征线（主拉应力，红线）与最小主应变特征线（主压应力，蓝线）在全域任意非退化点必须保持 $90^\\circ$ 严格正交。",
    referenceSource: "- Delmarcelle, T., & Hesselink, L. (1994). The topology of symmetric, second-order tensor fields. *Proceedings IEEE Visualization '94*, 140-147. - Hung, S. H., Zhang, Y., & Zhang, E. (2024). Global to",
  },
};

/**
 * VFX-SCIVIS-04: 超音速欠膨胀射流激波钻石、马赫盘与普朗特-迈耶膨胀波束网格
 */
export const VFX_SCIVIS_04_PROMPT: PromptSpec = {
  id: "VFX-SCIVIS-04",
  label: "超音速欠膨胀射流激波钻石、马赫盘与普朗特-迈耶膨胀波束网格 (Supersonic Underexpanded Jet Shock Diamonds, Mach Disks, and Prandtl-Meyer Expansion Fans)",
  template: "Generate an SVG technical visualization of Supersonic Underexpanded Jet Shock Diamonds, Mach Disks, and Prandtl-Meyer Expansion Fans as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **喷管流动状态参数**: 气体比热比 $\\gamma = 1.4$（空气），喷管出口直径 $D = 1.0$。 喷管出口马赫数 $M_e = 1.5$，总压与背压比（NPR）配置使得完全膨胀等效马赫数 $M_j = 2.0$。 根据气体动力学等温/等熵声速关系计算超音速马赫角 $\\mu = \\arcsin(1/M_j) = 30^\\circ$。 2. **Pack (1950) 经典激波晶胞波长解析闭式解**: 激波单元特征重复波长 $L_s$： $$L_s = \\frac{\\pi D \\sqrt{M_j^2 - 1}}{\\mu_1} \\approx \\frac{3.14159 \\times 1.0 \\times \\sqrt{3}}{2.40483} \\approx 2.262 D$$ 其中 $\\mu_1 \\approx 2.4048$ 为零阶第一类贝塞尔函数 $J_0(x)$ 的首个正根。 3. **特征激波拓扑构型**: - **喷管唇口 ($x=0, y=\\pm 0.5$)**: 产生普朗特-迈耶膨胀扇（扇形张角由 $\\nu(M_j) - \\nu(M_e)$ 决定），边界压力恒等于 $P_a$。 - **自由边界反射**: 膨胀波在自由边界反射为会聚压缩波，并在下游交织形成斜激波。 - **中心轴线马赫盘 (Mach Disk)**: 在高度欠膨胀下，第一单元中心轴出现正激波（马赫盘），其位置在 $x \\approx 0.67 D \\sqrt{P_0 / P_a}$。 - **三相点 (Triple Point)**: 斜激波、正激波马赫盘与反射激波交汇于三相点，并从中下游引出接触间断滑流线（Slipstream line）。 Visual Inspection Criteria: - **激波单元周期性间距误差**: 测定前 3 个钻石激波单元中心交叉点位置 $x_1, x_2, x_3$，相邻间距与理论值 $L_s$ 的相对误差 $|\\Delta L_s| / L_s \\le 3.5\\%$。 - **特征菱形包络角度**: 斜激波反射夹角必须严格吻合朗肯-雨果尼奥（Rankine-Hugoniot）激波极线（Shock Polar）解，激波角 $\\beta \\approx 42^\\circ \\pm 1.5^\\circ$。 - **滑流线与剪切层发散角**: 喷管出口初期的自由边界外倾角与轴线夹角需符合普朗特-迈耶偏转角 $\\theta \\approx 10.2^\\circ$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Pack, D. C. (1950). A note on Prandtl's formula for the wave-length of a supersonic gas jet. *The Quarterly Journal of Mechanics and Applied Mathematics*, 3(2), 173-181. - Adamson, T. C., & Nicholls",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "超音速欠膨胀射流激波钻石、马赫盘与普朗特-迈耶膨胀波束网格",
    groundTruth: "1. **喷管流动状态参数**: 气体比热比 $\\gamma = 1.4$（空气），喷管出口直径 $D = 1.0$。 喷管出口马赫数 $M_e = 1.5$，总压与背压比（NPR）配置使得完全膨胀等效马赫数 $M_j = 2.0$。 根据气体动力学等温/等熵声速关系计算超音速马赫角 $\\mu = \\arcsin(1/M_j) = 30^\\circ$。 2. **Pack (1950) 经典激波晶胞波长解析闭式解**: 激波单元特征重复波长 $L_s$： $$L_s = \\frac{\\pi D \\sqrt{M_j^2 - 1}}{\\mu_1} \\approx \\frac{3.14159 \\ti",
    evaluationCriteria: "- **激波单元周期性间距误差**: 测定前 3 个钻石激波单元中心交叉点位置 $x_1, x_2, x_3$，相邻间距与理论值 $L_s$ 的相对误差 $|\\Delta L_s| / L_s \\le 3.5\\%$。 - **特征菱形包络角度**: 斜激波反射夹角必须严格吻合朗肯-雨果尼奥（Rankine-Hugoniot）激波极线（Shock Polar）解，激波角 $\\beta \\approx 42^\\circ \\pm 1.5^\\circ$。 - **滑流线与剪切层发散角**: 喷管出口初期的自由边界外倾角与轴线夹角需符合普朗特-迈耶偏转角 $\\theta \\approx 10.2^\\ci",
    referenceSource: "- Pack, D. C. (1950). A note on Prandtl's formula for the wave-length of a supersonic gas jet. *The Quarterly Journal of Mechanics and Applied Mathematics*, 3(2), 173-181. - Adamson, T. C., & Nicholls",
  },
};

/**
 * VFX-SCIVIS-05: 太阳耀斑磁重联 Petschek/Sweet-Parker 扩散区 X 点拓扑撕裂与高能阿尔芬喷流
 */
export const VFX_SCIVIS_05_PROMPT: PromptSpec = {
  id: "VFX-SCIVIS-05",
  label: "太阳耀斑磁重联 Petschek/Sweet-Parker 扩散区 X 点拓扑撕裂与高能阿尔芬喷流 (Solar Flare Magnetic Reconnection: Petschek/Sweet-Parker X-point Tearing and Alfvenic Exhaust Jets)",
  template: "Generate an SVG technical visualization of Solar Flare Magnetic Reconnection: Petschek/Sweet-Parker X-point Tearing and Alfvenic Exhaust Jets as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **磁通量势函数 $\\Psi(x, z)$ 解析模型**: 定义坐标系：$x$ 为流出方向（Outflow），$z$ 为流入方向（Inflow）。经典 Harris 磁片叠加撕裂模微扰： $$\\Psi(x, z) = B_0 \\delta \\ln\\left[\\cosh\\left(\\frac{z}{\\delta}\\right)\\right] + \\epsilon B_0 \\cos(k x) e^{-z^2 / (2 \\delta^2)}$$ 其中 $B_0$ 为渐近磁场强度，$\\delta$ 为电流片半厚度，$\\epsilon$ 为无量纲重联微扰振幅，波矢 $k = 2\\pi / \\lambda_x$。 2. **磁场矢量分量与 X 点奇异性**: $$B_x(x, z) = \\frac{\\partial \\Psi}{\\partial z} = B_0 \\tanh\\left(\\frac{z}{\\delta}\\right) - \\epsilon B_0 \\frac{z}{\\delta^2} \\cos(k x) e^{-z^2 / (2 \\delta^2)}$$ $$B_z(x, z) = -\\frac{\\partial \\Psi}{\\partial x} = \\epsilon k B_0 \\sin(k x) e^{-z^2 / (2 \\delta^2)}$$ - **X 型零磁点 (X-point Null)**: 精确位于 $(x, z) = (\\pi/k, 0)$，此处 $\\|\\mathbf{B}\\| = 0$。 - **分界线 (Separatrix)**: 过 X 点的等势线 $\\Psi(x, z) = \\Psi(\\pi/k, 0) = -\\epsilon B_0$ 将空间划分为 4 个因果互不相连的磁通量拓扑区。 3. **电流密度与慢激波面**: 面外电流密度 $j_y = -\\nabla^2 \\Psi$。在 Petschek 模型中，从微小扩散区向四周扩展出 4 道慢模冲击波（Slow-mode shocks），流入等离子体在此处被急剧压缩并偏折加速至阿尔芬流速 $v_{out} \\approx v_A = B_0 / \\sqrt{\\mu_0 \\rho}$。 Visual Inspection Criteria: - **分界线渐近夹角**: 扩散区四周分界线构成的张角在 X 点处由 Petschek 快重联率决定，流入/流出纵横比 $\\tan\\theta \\sim R_{rec} \\approx 0.1 \\pm 0.02$。 - **磁力线动态拓扑跳变 (SMIL)**: 粒子或磁力线从上下边界对称以低速流入（$v_{in} \\sim 0.1 v_A$），在 X 点处拓扑解耦并断裂，以 10 倍高速（$v_{out} \\sim 1.0 v_A$）向左右两侧飞逸，动画速率比必须严格反映流速守恒。 - **电流密度峰值同心度**: 强电流片 $j_y$ 的几何极大值必须严格重合于 X 点坐标，半高宽（FWHM）在 $z$ 方向不超过 $2\\delta$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Petschek, H. E. (1964). Magnetic field annihilation. *AAS-NASA Symposium on the Physics of Solar Flares*, NASA-SP 50, 425. - Yamada, M., Kulsrud, R., & Ji, H. (2010). Magnetic reconnection. *Reviews",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "太阳耀斑磁重联 Petschek/Sweet-Parker 扩散区 X 点拓扑撕裂与高能阿尔芬喷流",
    groundTruth: "1. **磁通量势函数 $\\Psi(x, z)$ 解析模型**: 定义坐标系：$x$ 为流出方向（Outflow），$z$ 为流入方向（Inflow）。经典 Harris 磁片叠加撕裂模微扰： $$\\Psi(x, z) = B_0 \\delta \\ln\\left[\\cosh\\left(\\frac{z}{\\delta}\\right)\\right] + \\epsilon B_0 \\cos(k x) e^{-z^2 / (2 \\delta^2)}$$ 其中 $B_0$ 为渐近磁场强度，$\\delta$ 为电流片半厚度，$\\epsilon$ 为无量纲重联微扰振幅，波矢 $k = 2\\pi / \\lam",
    evaluationCriteria: "- **分界线渐近夹角**: 扩散区四周分界线构成的张角在 X 点处由 Petschek 快重联率决定，流入/流出纵横比 $\\tan\\theta \\sim R_{rec} \\approx 0.1 \\pm 0.02$。 - **磁力线动态拓扑跳变 (SMIL)**: 粒子或磁力线从上下边界对称以低速流入（$v_{in} \\sim 0.1 v_A$），在 X 点处拓扑解耦并断裂，以 10 倍高速（$v_{out} \\sim 1.0 v_A$）向左右两侧飞逸，动画速率比必须严格反映流速守恒。 - **电流密度峰值同心度**: 强电流片 $j_y$ 的几何极大值必须严格重合于 X 点坐标，半高宽（FW",
    referenceSource: "- Petschek, H. E. (1964). Magnetic field annihilation. *AAS-NASA Symposium on the Physics of Solar Flares*, NASA-SP 50, 425. - Yamada, M., Kulsrud, R., & Ji, H. (2010). Magnetic reconnection. *Reviews",
  },
};

/**
 * VFX-SCIVIS-06: 铁磁流体 Rosensweig 正常场不稳定性在临界磁场下正六边形圆锥尖刺阵列自组织
 */
export const VFX_SCIVIS_06_PROMPT: PromptSpec = {
  id: "VFX-SCIVIS-06",
  label: "铁磁流体 Rosensweig 正常场不稳定性在临界磁场下正六边形圆锥尖刺阵列自组织 (Ferrofluid Rosensweig Normal-Field Instability and Conical Hexagonal Spike Lattice Formation)",
  template: "Generate an SVG technical visualization of Ferrofluid Rosensweig Normal-Field Instability and Conical Hexagonal Spike Lattice Formation as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **临界物理参数与色散关系**: 流体密度差 $\\Delta \\rho = \\rho_{fluid} - \\rho_{air}$，表面张力系数 $\\sigma$，重力加速度 $g$。 特征毛细长度 $l_c = \\sqrt{\\sigma / (\\Delta \\rho g)}$。 Cowley-Rosensweig 临界失稳波数闭式解： $$k_c = \\frac{1}{l_c} = \\sqrt{\\frac{\\Delta \\rho g}{\\sigma}}$$ 对应特征临界晶格波长 $\\lambda_c = 2\\pi / k_c = 2\\pi \\sqrt{\\sigma / (\\Delta \\rho g)}$。 2. **正六边形自组织表面高度函数 $\\zeta(x, y)$**: 表面形变由互成 $120^\\circ$ 的三个简谐共振主波矢叠加并包含二阶非线性谐波构成： $$\\zeta(x, y) = A_1 \\sum_{i=1}^3 \\cos(\\mathbf{k}_i \\cdot \\mathbf{r}) + A_2 \\sum_{i=1}^3 \\cos(2 \\mathbf{k}_i \\cdot \\mathbf{r}) + \\dots$$ 其中主波矢定义： $$\\mathbf{k}_1 = k_c (1, 0), \\quad \\mathbf{k}_2 = k_c \\left(-\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right), \\quad \\mathbf{k}_3 = k_c \\left(-\\frac{1}{2}, -\\frac{\\sqrt{3}}{2}\\right)$$ 满足三波共振封闭条件 $\\mathbf{k}_1 + \\mathbf{k}_2 + \\mathbf{k}_3 = 0$。 3. **六边形晶胞几何参量**: 相邻尖刺顶点之间的中心距 $a = \\frac{4\\pi}{\\sqrt{3} k_c} = \\frac{2}{\\sqrt{3}} \\lambda_c$。每个峰顶周围精确包围 6 个对称等距邻居。 Visual Inspection Criteria: - **六重旋转对称性不变量**: 提取所有高度极大值点坐标，做 2D 快速傅里叶变换（FFT）或狄洛尼三角剖分，其谱空间必须展现出完美的六重对称布里渊区（Brillouin zone）六边形亮斑，夹角为 $60.0^\\circ \\pm 1.0^\\circ$。 - **尖刺间距一致性**: 测定视场内所有近邻峰值间距均值 $\\bar{a}$，其标准差 $\\sigma_a / \\bar{a} \\le 2.0\\%$。 - **圆锥尖端曲率梯度**: 在每个尖刺中心 $r \\to 0$ 处，法向矢量高度陡峭集中，等高线在峰顶必须呈同心近圆形向外平滑演进为六边形截面。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Cowley, M. D., & Rosensweig, R. E. (1967). The interfacial stability of a ferromagnetic fluid. *Journal of Fluid Mechanics*, 30(4), 671-688. - Gailitis, A. (1977). Formation of the hexagonal pattern",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "铁磁流体 Rosensweig 正常场不稳定性在临界磁场下正六边形圆锥尖刺阵列自组织",
    groundTruth: "1. **临界物理参数与色散关系**: 流体密度差 $\\Delta \\rho = \\rho_{fluid} - \\rho_{air}$，表面张力系数 $\\sigma$，重力加速度 $g$。 特征毛细长度 $l_c = \\sqrt{\\sigma / (\\Delta \\rho g)}$。 Cowley-Rosensweig 临界失稳波数闭式解： $$k_c = \\frac{1}{l_c} = \\sqrt{\\frac{\\Delta \\rho g}{\\sigma}}$$ 对应特征临界晶格波长 $\\lambda_c = 2\\pi / k_c = 2\\pi \\sqrt{\\sigma / (\\Delta \\",
    evaluationCriteria: "- **六重旋转对称性不变量**: 提取所有高度极大值点坐标，做 2D 快速傅里叶变换（FFT）或狄洛尼三角剖分，其谱空间必须展现出完美的六重对称布里渊区（Brillouin zone）六边形亮斑，夹角为 $60.0^\\circ \\pm 1.0^\\circ$。 - **尖刺间距一致性**: 测定视场内所有近邻峰值间距均值 $\\bar{a}$，其标准差 $\\sigma_a / \\bar{a} \\le 2.0\\%$。 - **圆锥尖端曲率梯度**: 在每个尖刺中心 $r \\to 0$ 处，法向矢量高度陡峭集中，等高线在峰顶必须呈同心近圆形向外平滑演进为六边形截面。",
    referenceSource: "- Cowley, M. D., & Rosensweig, R. E. (1967). The interfacial stability of a ferromagnetic fluid. *Journal of Fluid Mechanics*, 30(4), 671-688. - Gailitis, A. (1977). Formation of the hexagonal pattern",
  },
};

/**
 * VFX-SCIVIS-07: 地磁偶极场阿尔芬波加速电子与高低层氧原子禁戒跃迁发光极光双色帷幔
 */
export const VFX_SCIVIS_07_PROMPT: PromptSpec = {
  id: "VFX-SCIVIS-07",
  label: "地磁偶极场阿尔芬波加速电子与高低层氧原子禁戒跃迁发光极光双色帷幔 (3D Geomagnetic Dipole Field and Altitude-Stratified Two-Color Auroral Curtains (557.7nm / 630.0nm))",
  template: "Generate an SVG technical visualization of 3D Geomagnetic Dipole Field and Altitude-Stratified Two-Color Auroral Curtains (557.7nm / 630.0nm) as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **地球偶极磁场与 McIlwain $L$-shell 解析方程**: 在极坐标 $(r, \\theta)$ 下（$r$ 为地心距离，$\\theta$ 为磁余纬）： $$r(\\theta) = R_E L \\sin^2\\theta$$ 其中 $R_E \\approx 6371\\text{ km}$ 为地球半径，$L$ 为无量纲漂移壳层参数。对于典型极光带纬度（$65^\\circ \\sim 70^\\circ$），$L \\in [5.6, 8.5]$。 磁力线切向角：$\\tan\\alpha = \\frac{1}{2} \\tan\\theta$。 2. **大气禁戒跃迁垂直发光强度廓线 (Chapman-like 剖面)**: - **绿光主带 (557.7 nm)**: 激发态 $O(^1S) \\to O(^1D)$。由于低空猝灭与高空稀薄，发光峰值严格位于海拔高度 **$z = 105 \\sim 130\\text{ km}$**，呈垂直半高宽较窄（$\\sim 25\\text{ km}$）的锐利带状。 - **红光顶冠 (630.0 nm)**: 激发态 $O(^1D) \\to O(^3P)$。由于亚稳态寿命长（$\\tau \\approx 110\\text{ s}$），在海拔 $z < 200\\text{ km}$ 区域被 $N_2$ 碰撞无辐射猝灭；其发光仅存在于高空 **$z = 200 \\sim 400\\text{ km}$**，呈弥散柔和的深红顶晕。 3. **极光帘幔螺旋射线 (Rayed Curtains) 折叠波形**: 平面投影为带开尔文-亥姆霍兹剪切卷吸的蛇形折叠：$y(x) = Y_0 + A_c \\sin(k_c x) + B_c \\sin(3 k_c x)$，光线严格沿着倾斜的地磁倾角方向延伸。 Visual Inspection Criteria: - **高度分层色谱准确性**: 垂直剖面中，海拔 100-150 km 区域必须呈现纯荧光绿（#00FF66 / #22EE44，波长 557.7nm 等效值）；海拔 220 km 以上必须平滑渐变为深紫红/品红（#CC1133 / #EE2244，波长 630.0nm 等效值）；在 160-200 km 交界区存在自然的物理混合过渡。 - **磁力线共面倾角公差**: 极光射线束的延伸倾斜角度与偶极场解析斜率误差 $\\le \\pm 2.0^\\circ$。 - **褶皱折叠周期性**: 极光帷幔波浪褶皱必须具备自相似的二级谐波折叠，模拟磁流体剪切流动形态。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Chamberlain, J. W. (1961). *Physics of the Aurora and Airglow*. Academic Press. - Akasofu, S. I. (1981). Energy coupling between the solar wind and the magnetosphere. *Space Science Reviews*, 28(2),",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "地磁偶极场阿尔芬波加速电子与高低层氧原子禁戒跃迁发光极光双色帷幔",
    groundTruth: "1. **地球偶极磁场与 McIlwain $L$-shell 解析方程**: 在极坐标 $(r, \\theta)$ 下（$r$ 为地心距离，$\\theta$ 为磁余纬）： $$r(\\theta) = R_E L \\sin^2\\theta$$ 其中 $R_E \\approx 6371\\text{ km}$ 为地球半径，$L$ 为无量纲漂移壳层参数。对于典型极光带纬度（$65^\\circ \\sim 70^\\circ$），$L \\in [5.6, 8.5]$。 磁力线切向角：$\\tan\\alpha = \\frac{1}{2} \\tan\\theta$。 2. **大气禁戒跃迁垂直发光强度廓线 (Ch",
    evaluationCriteria: "- **高度分层色谱准确性**: 垂直剖面中，海拔 100-150 km 区域必须呈现纯荧光绿（#00FF66 / #22EE44，波长 557.7nm 等效值）；海拔 220 km 以上必须平滑渐变为深紫红/品红（#CC1133 / #EE2244，波长 630.0nm 等效值）；在 160-200 km 交界区存在自然的物理混合过渡。 - **磁力线共面倾角公差**: 极光射线束的延伸倾斜角度与偶极场解析斜率误差 $\\le \\pm 2.0^\\circ$。 - **褶皱折叠周期性**: 极光帷幔波浪褶皱必须具备自相似的二级谐波折叠，模拟磁流体剪切流动形态。",
    referenceSource: "- Chamberlain, J. W. (1961). *Physics of the Aurora and Airglow*. Academic Press. - Akasofu, S. I. (1981). Energy coupling between the solar wind and the magnetosphere. *Space Science Reviews*, 28(2),",
  },
};

/**
 * VFX-SCIVIS-08: 三叶结涡丝拓扑纠缠、毕奥-萨伐尔诱导自演化与螺旋度转换
 */
export const VFX_SCIVIS_08_PROMPT: PromptSpec = {
  id: "VFX-SCIVIS-08",
  label: "三叶结涡丝拓扑纠缠、毕奥-萨伐尔诱导自演化与螺旋度转换 (Trefoil Vortex Knot Dynamics, Biot-Savart Self-Advection, and Helicity Invariant Transfer)",
  template: "Generate an SVG technical visualization of Trefoil Vortex Knot Dynamics, Biot-Savart Self-Advection, and Helicity Invariant Transfer as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **标准三叶结 $(3, 1)$ 空间中心线参数曲线**: 参数 $s \\in [0, 2\\pi)$。柱坐标与笛卡尔闭式方程： $$x(s) = (R_0 + r_0 \\cos(3 s)) \\cos(2 s)$$ $$y(s) = (R_0 + r_0 \\cos(3 s)) \\sin(2 s)$$ $$z(s) = -r_0 \\sin(3 s)$$ 基准几何比率设为 $R_0 = 1.0$，$r_0 = 0.4$。该曲线是一条无自相交的非平凡三叶纽结（Trefoil Knot $3_1$）。 2. **拓扑不变量分解与守恒律**: - 循环量（Circulation）为 $\\Gamma$。总动力学螺旋度： $$H = \\Gamma^2 (Wr(\\mathcal{C}) + Tw(\\mathcal{C}))$$ - **自绞拧数 (Writhe)** 由高斯双重环绕积分给出： $$Wr = \\frac{1}{4\\pi} \\oint_{\\mathcal{C}} \\oint_{\\mathcal{C}} \\frac{(\\mathbf{r}_1 - \\mathbf{r}_2) \\cdot (d\\mathbf{r}_1 \\times d\\mathbf{r}_2)}{\\|\\mathbf{r}_1 - \\mathbf{r}_2\\|^3} \\approx +2.016 \\quad (\\text{对于右手里手性三叶结})$$ 3. **毕奥-萨伐尔局部诱导近似 (LIA)**: 涡丝各点在流体中的自诱导行进速度分量正比于该点的局部曲率 $\\kappa(s)$，且方向沿双法向矢量 $\\mathbf{b}(s) = \\mathbf{t}(s) \\times \\mathbf{n}(s)$： $$\\mathbf{v}_{LIA}(s) \\approx \\frac{\\Gamma}{4\\pi} \\ln\\left(\\frac{L}{\\sigma_{core}}\\right) \\kappa(s) \\mathbf{b}(s)$$ 三叶结由于曲率不均匀，在空间中一边整体向前平动，一边伴随非刚体自翻转旋转变形。 Visual Inspection Criteria: - **结拓扑完整性（无假交点）**: 三维透视投影下必须精确呈现 3 处交叠跨越（Over-crossings 与 Under-crossings 遮挡顺序必须严格符合右手里性 $3_1$ 拓扑）。 - **曲率与双法向着色精度**: 涡管表面色彩需编码局部曲率 $\\kappa(s)$，曲率极大值处（尖角弯折区 $\\kappa \\approx 3.2$）与极小值处（平直过渡区 $\\kappa \\approx 0.8$）的色差对比度明显。 - **涡核截面正交性**: 沿中心线铺设的圆形或椭圆形涡管截面法向必须处处严格与切线 $\\mathbf{t}(s)$ 重合，管道无非物理自交挤压瘪缩。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Moffatt, H. K. (1969). The degree of knottedness of tangled vortex lines. *Journal of Fluid Mechanics*, 35(1), 117-129. - Kleckner, D., & Irvine, W. T. (2013). Creation and dynamics of knotted vorti",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "三叶结涡丝拓扑纠缠、毕奥-萨伐尔诱导自演化与螺旋度转换",
    groundTruth: "1. **标准三叶结 $(3, 1)$ 空间中心线参数曲线**: 参数 $s \\in [0, 2\\pi)$。柱坐标与笛卡尔闭式方程： $$x(s) = (R_0 + r_0 \\cos(3 s)) \\cos(2 s)$$ $$y(s) = (R_0 + r_0 \\cos(3 s)) \\sin(2 s)$$ $$z(s) = -r_0 \\sin(3 s)$$ 基准几何比率设为 $R_0 = 1.0$，$r_0 = 0.4$。该曲线是一条无自相交的非平凡三叶纽结（Trefoil Knot $3_1$）。 2. **拓扑不变量分解与守恒律**: - 循环量（Circulation）为 $\\Gamma$",
    evaluationCriteria: "- **结拓扑完整性（无假交点）**: 三维透视投影下必须精确呈现 3 处交叠跨越（Over-crossings 与 Under-crossings 遮挡顺序必须严格符合右手里性 $3_1$ 拓扑）。 - **曲率与双法向着色精度**: 涡管表面色彩需编码局部曲率 $\\kappa(s)$，曲率极大值处（尖角弯折区 $\\kappa \\approx 3.2$）与极小值处（平直过渡区 $\\kappa \\approx 0.8$）的色差对比度明显。 - **涡核截面正交性**: 沿中心线铺设的圆形或椭圆形涡管截面法向必须处处严格与切线 $\\mathbf{t}(s)$ 重合，管道无非物理自交挤压瘪缩。",
    referenceSource: "- Moffatt, H. K. (1969). The degree of knottedness of tangled vortex lines. *Journal of Fluid Mechanics*, 35(1), 117-129. - Kleckner, D., & Irvine, W. T. (2013). Creation and dynamics of knotted vorti",
  },
};

/**
 * VFX-SCIVIS-09: 动脉血管分叉管壁面剪切应力 (WSS) 拓扑奇异点骨架与脉动涡流三维螺旋度
 */
export const VFX_SCIVIS_09_PROMPT: PromptSpec = {
  id: "VFX-SCIVIS-09",
  label: "动脉血管分叉管壁面剪切应力 (WSS) 拓扑奇异点骨架与脉动涡流三维螺旋度 (Arterial Bifurcation Wall Shear Stress (WSS) Topology Singularities and Helicity Density Evolution)",
  template: "Generate an SVG technical visualization of Arterial Bifurcation Wall Shear Stress (WSS) Topology Singularities and Helicity Density Evolution as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **Y 型对称血管分叉解析几何模型**: 主管半径 $R_0 = 1.0$，分叉半角 $\\alpha = 35^\\circ$，分支管半径 $R_1 = R_0 / \\sqrt{2} \\approx 0.707$（满足 Murray 血管分支最小做功定律）。 2. **壁面剪切应力矢量场 $\\mathbf{\\tau}_w$ 拓扑特征**: 在分叉隆凸处（Bifurcation Apex / Carina）与外侧扩张壁： - **驻点/鞍点 (Saddle)**: 位于分叉顶点鞍部 $(x_{apex}, 0)$，血流正向冲击导致 $\\mathbf{\\tau}_w = 0$，流线呈双曲分离。 - **结点源 (Nodal Source)**: 冲击滞止点，流线发散。 - **结点汇 (Nodal Sink)**: 位于外壁回流低剪切分离区边缘。 - **拓扑分离线 (Separation Line)**: 沿管壁延伸，满足 $\\nabla \\cdot \\mathbf{\\tau}_w < 0$ 且沿主剪切方向收敛。 3. **腔内脉动涡流螺旋度密度 (Helicity Density)**: 流场速度 $\\mathbf{u}$ 与涡量 $\\mathbf{\\omega} = \\nabla \\times \\mathbf{u}$。三维物理标量场： $$h_d(x, y, z, t) = \\mathbf{u} \\cdot \\mathbf{\\omega}$$ 在搏动收缩晚期，分支外侧壁产生明显的脱体涡旋对（Dean 涡对），呈现正负交替的高绝对值双螺旋管状特征线。 Visual Inspection Criteria: - **Poincaré-Hopf 指数和定理**: 分叉展平壁面所有孤立临界点指数总和必须满足闭合流形约束 $\\sum I_i = 1 - 2 = -1$（分叉连通域拓扑亏格）。 - **Carina 滞止鞍点坐标对齐**: 鞍点几何位置必须严格贴合分叉尖点曲率极值处，法向剪切应力模长 $\\|\\mathbf{\\tau}_w\\| \\to 0$ 误差半径 $\\le 0.02 R_0$。 - **分离区低 WSS 区域重合度**: 外壁低剪切（Low WSS, $\\|\\mathbf{\\tau}_w\\| < 0.2 \\bar{\\tau}_0$）区域形态与回流分离涡脚印重合度（IoU）必须 $\\ge 90\\%$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Arzani, A., & Shadden, S. C. (2016). Lagrangian wall shear stress structures and near-wall transport in high-Schmidt-number aneurysmal flows. *Journal of Fluid Mechanics*, 790, 158-172. - Arzani, A.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "动脉血管分叉管壁面剪切应力 (WSS) 拓扑奇异点骨架与脉动涡流三维螺旋度",
    groundTruth: "1. **Y 型对称血管分叉解析几何模型**: 主管半径 $R_0 = 1.0$，分叉半角 $\\alpha = 35^\\circ$，分支管半径 $R_1 = R_0 / \\sqrt{2} \\approx 0.707$（满足 Murray 血管分支最小做功定律）。 2. **壁面剪切应力矢量场 $\\mathbf{\\tau}_w$ 拓扑特征**: 在分叉隆凸处（Bifurcation Apex / Carina）与外侧扩张壁： - **驻点/鞍点 (Saddle)**: 位于分叉顶点鞍部 $(x_{apex}, 0)$，血流正向冲击导致 $\\mathbf{\\tau}_w = 0$，流线呈双曲分离。",
    evaluationCriteria: "- **Poincaré-Hopf 指数和定理**: 分叉展平壁面所有孤立临界点指数总和必须满足闭合流形约束 $\\sum I_i = 1 - 2 = -1$（分叉连通域拓扑亏格）。 - **Carina 滞止鞍点坐标对齐**: 鞍点几何位置必须严格贴合分叉尖点曲率极值处，法向剪切应力模长 $\\|\\mathbf{\\tau}_w\\| \\to 0$ 误差半径 $\\le 0.02 R_0$。 - **分离区低 WSS 区域重合度**: 外壁低剪切（Low WSS, $\\|\\mathbf{\\tau}_w\\| < 0.2 \\bar{\\tau}_0$）区域形态与回流分离涡脚印重合度（IoU）必须 $\\ge ",
    referenceSource: "- Arzani, A., & Shadden, S. C. (2016). Lagrangian wall shear stress structures and near-wall transport in high-Schmidt-number aneurysmal flows. *Journal of Fluid Mechanics*, 790, 158-172. - Arzani, A.",
  },
};

/**
 * VFX-SCIVIS-10: 第二类超导体阿布里科索夫量子磁通线规则正三角点阵与相位奇异性
 */
export const VFX_SCIVIS_10_PROMPT: PromptSpec = {
  id: "VFX-SCIVIS-10",
  label: "第二类超导体阿布里科索夫量子磁通线规则正三角点阵与相位奇异性 (Type-II Superconductor Abrikosov Quantum Vortex Lattice and Phase Singularities)",
  template: "Generate an SVG technical visualization of Type-II Superconductor Abrikosov Quantum Vortex Lattice and Phase Singularities as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **金兹堡-朗道（Ginzburg-Landau）复序参量场**: 序参量 $\\psi(x, y) = |\\psi(x, y)| e^{i \\theta(x, y)}$。 在涡旋中心位置 $\\mathbf{r}_k = (x_k, y_k)$ 处，超导态完全被破坏，发生相位奇异性： $$|\\psi(\\mathbf{r}_k)| = 0, \\quad \\oint_{\\mathcal{C}_k} \\nabla \\theta \\cdot d\\mathbf{l} = 2\\pi$$ 序参量恢复长度由相干长度 $\\xi$（Coherence Length）控制：$|\\psi(r)| \\approx \\psi_0 \\tanh(r / (\\sqrt{2}\\xi))$。 2. **正三角点阵晶格常数解析解**: 设宏观均匀平均磁感应强度为 $B$。每个晶胞面积包含 1 个磁通量子 $\\Phi_0 = 2.0678 \\times 10^{-15}\\text{ Wb}$。 三角晶胞几何面积 $A_{cell} = \\frac{\\sqrt{3}}{2} a^2$。根据磁通守恒 $B \\cdot A_{cell} = \\Phi_0$，晶格常数 $a$ 的严格解析解为： $$a = \\left(\\frac{4}{3}\\right)^{1/4} \\sqrt{\\frac{\\Phi_0}{B}} \\approx 1.07457 \\sqrt{\\frac{\\Phi_0}{B}}$$ 3. **局部穿透磁场分布 $B_z(x, y)$**: 由修正贝塞尔函数与伦敦穿透深度 $\\lambda$ 控制： $$B_z(\\mathbf{r}) = \\sum_{k} \\frac{\\Phi_0}{2\\pi \\lambda^2} K_0\\left(\\frac{\\|\\mathbf{r} - \\mathbf{r}_k\\|}{\\lambda}\\right)$$ 磁场在各涡核中心达到局部尖峰峰值，并在相邻三涡交汇的晶格中心降至局部极小值。 Visual Inspection Criteria: - **严格 $60^\\circ$ 三角点阵几何公差**: 测定视场内所有内禀涡核点坐标，计算任意邻近三元组构成的三角形内角，各角绝对偏差 $|\\Delta \\theta| \\le 1.0^\\circ$。 - **相位环绕数（Winding Number）**: 围绕任意单个孤立涡核进行逆时针环绕相位积分，复平面色环（如标准 HSV 循环色环：红-黄-绿-青-蓝-洋红）必须完整循环转动一周（$2\\pi$），无分支截断裂缝。 - **六配位数配位多边形完整度**: 内部非边界涡核的配位数必须 100% 严格等于 6（Wigner-Seitz 原胞必须为正六边形）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Abrikosov, A. A. (1957). On the magnetic properties of superconductors of the second group. *Soviet Physics JETP*, 5(6), 1174-1182. - Brandt, E. H. (1997). The flux-line lattice in superconductors. ",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "第二类超导体阿布里科索夫量子磁通线规则正三角点阵与相位奇异性",
    groundTruth: "1. **金兹堡-朗道（Ginzburg-Landau）复序参量场**: 序参量 $\\psi(x, y) = |\\psi(x, y)| e^{i \\theta(x, y)}$。 在涡旋中心位置 $\\mathbf{r}_k = (x_k, y_k)$ 处，超导态完全被破坏，发生相位奇异性： $$|\\psi(\\mathbf{r}_k)| = 0, \\quad \\oint_{\\mathcal{C}_k} \\nabla \\theta \\cdot d\\mathbf{l} = 2\\pi$$ 序参量恢复长度由相干长度 $\\xi$（Coherence Length）控制：$|\\psi(r)| \\approx ",
    evaluationCriteria: "- **严格 $60^\\circ$ 三角点阵几何公差**: 测定视场内所有内禀涡核点坐标，计算任意邻近三元组构成的三角形内角，各角绝对偏差 $|\\Delta \\theta| \\le 1.0^\\circ$。 - **相位环绕数（Winding Number）**: 围绕任意单个孤立涡核进行逆时针环绕相位积分，复平面色环（如标准 HSV 循环色环：红-黄-绿-青-蓝-洋红）必须完整循环转动一周（$2\\pi$），无分支截断裂缝。 - **六配位数配位多边形完整度**: 内部非边界涡核的配位数必须 100% 严格等于 6（Wigner-Seitz 原胞必须为正六边形）。",
    referenceSource: "- Abrikosov, A. A. (1957). On the magnetic properties of superconductors of the second group. *Soviet Physics JETP*, 5(6), 1174-1182. - Brandt, E. H. (1997). The flux-line lattice in superconductors. ",
  },
};

export const VFX_SCIVIS_INDIVIDUAL_PROMPTS: readonly PromptSpec[] = [
  VFX_SCIVIS_01_PROMPT,
  VFX_SCIVIS_02_PROMPT,
  VFX_SCIVIS_03_PROMPT,
  VFX_SCIVIS_04_PROMPT,
  VFX_SCIVIS_05_PROMPT,
  VFX_SCIVIS_06_PROMPT,
  VFX_SCIVIS_07_PROMPT,
  VFX_SCIVIS_08_PROMPT,
  VFX_SCIVIS_09_PROMPT,
  VFX_SCIVIS_10_PROMPT,
];

/**
 * VFX-4: 复杂多物理场、高维张量场与科学计算可视化 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）
 */
export const VFX_SCIVIS_SUITE_PROMPT: PromptSpec = {
  id: "vfx-scivis-v1",
  label: "VFX-4: 复杂多物理场与科学计算可视化（十题组）",
  template: "VFX-4: 复杂多物理场、高维张量场与科学计算可视化 前沿视觉特效十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",
  variables: [],
    candidates: [
    {
      id: VFX_SCIVIS_01_PROMPT.id,
      label: "非定常双旋涡流有限时间李雅普诺夫指数 (FTLE) 传输阻隔脊线与拉格朗日相干结构 (LCS)",
      text: VFX_SCIVIS_01_PROMPT.template,
      standard: VFX_SCIVIS_01_PROMPT.standard,
    },
    {
      id: VFX_SCIVIS_02_PROMPT.id,
      label: "二维标量场莫尔斯-斯梅尔复形临界点拓扑分水岭与持续同调简化",
      text: VFX_SCIVIS_02_PROMPT.template,
      standard: VFX_SCIVIS_02_PROMPT.standard,
    },
    {
      id: VFX_SCIVIS_03_PROMPT.id,
      label: "二阶对称张量场退化点拓扑（楔形点/三向点）与主特征超流线分界线",
      text: VFX_SCIVIS_03_PROMPT.template,
      standard: VFX_SCIVIS_03_PROMPT.standard,
    },
    {
      id: VFX_SCIVIS_04_PROMPT.id,
      label: "超音速欠膨胀射流激波钻石、马赫盘与普朗特-迈耶膨胀波束网格",
      text: VFX_SCIVIS_04_PROMPT.template,
      standard: VFX_SCIVIS_04_PROMPT.standard,
    },
    {
      id: VFX_SCIVIS_05_PROMPT.id,
      label: "太阳耀斑磁重联 Petschek/Sweet-Parker 扩散区 X 点拓扑撕裂与高能阿尔芬喷流",
      text: VFX_SCIVIS_05_PROMPT.template,
      standard: VFX_SCIVIS_05_PROMPT.standard,
    },
    {
      id: VFX_SCIVIS_06_PROMPT.id,
      label: "铁磁流体 Rosensweig 正常场不稳定性在临界磁场下正六边形圆锥尖刺阵列自组织",
      text: VFX_SCIVIS_06_PROMPT.template,
      standard: VFX_SCIVIS_06_PROMPT.standard,
    },
    {
      id: VFX_SCIVIS_07_PROMPT.id,
      label: "地磁偶极场阿尔芬波加速电子与高低层氧原子禁戒跃迁发光极光双色帷幔",
      text: VFX_SCIVIS_07_PROMPT.template,
      standard: VFX_SCIVIS_07_PROMPT.standard,
    },
    {
      id: VFX_SCIVIS_08_PROMPT.id,
      label: "三叶结涡丝拓扑纠缠、毕奥-萨伐尔诱导自演化与螺旋度转换",
      text: VFX_SCIVIS_08_PROMPT.template,
      standard: VFX_SCIVIS_08_PROMPT.standard,
    },
    {
      id: VFX_SCIVIS_09_PROMPT.id,
      label: "动脉血管分叉管壁面剪切应力 (WSS) 拓扑奇异点骨架与脉动涡流三维螺旋度",
      text: VFX_SCIVIS_09_PROMPT.template,
      standard: VFX_SCIVIS_09_PROMPT.standard,
    },
    {
      id: VFX_SCIVIS_10_PROMPT.id,
      label: "第二类超导体阿布里科索夫量子磁通线规则正三角点阵与相位奇异性",
      text: VFX_SCIVIS_10_PROMPT.template,
      standard: VFX_SCIVIS_10_PROMPT.standard,
    },
  ],
  source: "- Shadden, S. C., Lekien, F., & Marsden, J. E. (2005). Definition and properties of Lagrangian coherent structures from finite-time Lyapunov exponents in two-dimensional aperiodic flows. *Physica D: N",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "二阶张量场特征超流线、FTLE 拉格朗日相干结构与磁重联 X 点拓扑",
    groundTruth: "以二阶对称张量场三向点/楔形点退化拓扑、FTLE 输运阻隔脊线、超音速激波钻石斜反射网格与太阳耀斑磁重联 X-point 扩散区为基准，满足连续介质张量分析与磁流体力学守恒律。",
    evaluationCriteria: "1. 拓扑奇点：楔形点与三向点分支流线指数准确；2. 物理激波：普朗特-迈耶波与激波盘反射几何闭合；3. 语法规范：XML 严格合法，无交互 JS。",
    referenceSource: "https://ieeevis.org",
  },
};

export const VFX_SCIVIS_PROMPTS = VFX_SCIVIS_INDIVIDUAL_PROMPTS;

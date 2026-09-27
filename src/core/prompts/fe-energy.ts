/**
 * FE-5: 零碳新型能源系统、极端储能与气候工程 前沿评测题库。
 * 全量采用纯直观可视自闭合矢量 SVG（零外部 JS，无交互式事件，支持并排直接肉眼对比）。
 */

import type { PromptSpec } from "../prompt";

/**
 * FE-ENERGY-01: 高温超导紧凑型托卡马克 D-T 聚变堆芯截面与 $\nabla B$ 漂移平衡
 */
export const FE_ENERGY_01_PROMPT: PromptSpec = {
  id: "FE-ENERGY-01",
  label: "高温超导紧凑型托卡马克 D-T 聚变堆芯截面与 $\\nabla B$ 漂移平衡 (SPARC 20T REBCO Tokamak Poloidal Cross-Section & $\\nabla B$ Drift Equilibrium)",
  template: "Generate an SVG technical visualization of SPARC 20T REBCO Tokamak Poloidal Cross-Section & $\\nabla B$ Drift Equilibrium as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 基于麻省理工学院（MIT）与 CFS 研发的 SPARC 紧凑型高磁场托卡马克主参考放电（Primary Reference Discharge, PRD）。利用 REBCO 高温超导磁体在 20 Tesla 峰值场下，实现等离子体轴上磁场 12.2 T、电流 8.7 MA、净能量增益 $Q \\approx 11$。高磁场梯度与强拉长比给边缘局域模控制与粒子漂移平衡提出了极致挑战。 Physical & Mathematical Ground Truth: 1. **等离子体边界几何**：基于 Grad-Shafranov 平衡解，大半径 $R_0 = 1.85\\text{ m}$，小半径 $a = 0.57\\text{ m}$（环径比 $A = R_0/a \\approx 3.25$），拉长比 $\\kappa = 1.97$，三角形变 $\\delta = 0.54$，下单零（Single-Null）X 点清晰形成。 2. **磁场与漂移物理**：梯度磁场 $\\mathbf{B}(R) = B_0 \\frac{R_0}{R} \\hat{\\mathbf{e}}_\\phi$（内侧强磁场侧高达 18-20 T，外侧弱磁场侧衰减至 8-9 T）；粒子导心漂移速度公式： $$\\mathbf{v}_D = \\mathbf{v}_{\\nabla B} + \\mathbf{v}_{\\kappa} = \\frac{m (v_\\perp^2 / 2 + v_\\parallel^2)}{q B^3} (\\mathbf{B} \\times \\nabla B)$$ 标定离子与电子在垂直方向的反向电荷分离漂移矢量（离子沿 $-\\hat{\\mathbf{e}}_z$ 向下偏滤器漂移）。 3. **结构层叠**：从内向外严格同心嵌套——中央螺线管（CS）、内侧 REBCO D 形环向场（TF）超导线圈铠装、超高真空室（VV）、钨基偏滤器打击板（Divertor Strike Plates）、最后封闭磁通面（LCFS）及多层嵌套同心磁通面 $\\psi(R,Z)$。 Visual Inspection Criteria: - **几何与形状精度**：D 形等离子体截面的长轴与短轴比例严格符合 $\\kappa = 1.97 \\pm 0.05$；外侧不对称性满足 $\\delta = 0.54 \\pm 0.05$。 - **拓扑连通性**：下偏滤器区域两条分离面打线（Strike Lines）必须精确落在倾斜的内/外偏滤器钨靶板上，靶区夹角必须为锐角以增强杂质中性化屏蔽。 - **场强色阶映射**：由内侧（$R < 1.85\\text{ m}$，洋红色/高亮紫，18T-20T）向外侧（$R > 1.85\\text{ m}$，深蓝/墨绿，8T）平滑过渡的 $1/R$ 伪彩色等高线图。 - **漂移极性矢量**：正电荷离子（氘/氚）垂直向下指向下偏滤器靶板，负电荷电子垂直向上的双向彩色箭头标注明确。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Creely, A. J., et al. \"Overview of the SPARC physics basis.\" *Journal of Plasma Physics*, Vol. 86, No. 5 (2020), 865860502. DOI: `10.1017/S0022377820001211`.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "高温超导紧凑型托卡马克 D-T 聚变堆芯截面与 $\\nabla B$ 漂移平衡",
    groundTruth: "1. **等离子体边界几何**：基于 Grad-Shafranov 平衡解，大半径 $R_0 = 1.85\\text{ m}$，小半径 $a = 0.57\\text{ m}$（环径比 $A = R_0/a \\approx 3.25$），拉长比 $\\kappa = 1.97$，三角形变 $\\delta = 0.54$，下单零（Single-Null）X 点清晰形成。 2. **磁场与漂移物理**：梯度磁场 $\\mathbf{B}(R) = B_0 \\frac{R_0}{R} \\hat{\\mathbf{e}}_\\phi$（内侧强磁场侧高达 18-20 T，外侧弱磁场侧衰减至 8-9 T）；粒子导心漂移速度公式： $$\\mathbf{v}_D = \\mathbf{v}_{\\nabla B} + \\mathbf{v}_{\\kappa} = \\frac{m (v_\\perp^2 / 2 + v_\\p",
    evaluationCriteria: "- **几何与形状精度**：D 形等离子体截面的长轴与短轴比例严格符合 $\\kappa = 1.97 \\pm 0.05$；外侧不对称性满足 $\\delta = 0.54 \\pm 0.05$。 - **拓扑连通性**：下偏滤器区域两条分离面打线（Strike Lines）必须精确落在倾斜的内/外偏滤器钨靶板上，靶区夹角必须为锐角以增强杂质中性化屏蔽。 - **场强色阶映射**：由内侧（$R < 1.85\\text{ m}$，洋红色/高亮紫，18T-20T）向外侧（$R > 1.85\\text{ m}$，深蓝/墨绿，8T）平滑过渡的 $1/R$ 伪彩色等高线图。 - **漂移极性矢量**：正电荷离子（氘/氚）垂直向下指向下偏滤器靶板，负电荷电子垂直向上的双向彩色箭头标注明确。",
    referenceSource: "- Creely, A. J., et al. \"Overview of the SPARC physics basis.\" *Journal of Plasma Physics*, Vol. 86, No. 5 (2020), 865860502. DOI: `10.1017/S0022377820001211`.",
  },
};

/**
 * FE-ENERGY-02: 仿星器三维非平面扭曲超导线圈与 $\iota=5/5$ 磁岛链偏滤器拓扑
 */
export const FE_ENERGY_02_PROMPT: PromptSpec = {
  id: "FE-ENERGY-02",
  label: "仿星器三维非平面扭曲超导线圈与 $\\iota=5/5$ 磁岛链偏滤器拓扑 (Wendelstein 7-X 3D Modular Coils & $\\iota=5/5$ Resonant Magnetic Island Divertor)",
  template: "Generate an SVG technical visualization of Wendelstein 7-X 3D Modular Coils & $\\iota=5/5$ Resonant Magnetic Island Divertor as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 马克斯·普朗克等离子体物理研究所的 Wendelstein 7-X 是全球最先进的准等动力学（Quasi-Isodynamic）优化的先进仿星器。它抛弃了托卡马克破坏性的等离子体感应大电流，完全由 50 个三维高度扭曲的非平面超导线圈建立旋转变换，利用边缘 $\\iota=n/m=5/5$ 自然形成的五瓣共振磁岛链排热排灰。 Physical & Mathematical Ground Truth: 1. **旋转变换与共振条件**：边缘磁面旋转变换严格取 $\\iota = 1.0 = 5/5$；磁岛宽度由低磁剪切条件控制： $$w = 4 \\sqrt{\\frac{r B_{mn}}{m B_\\theta (d\\iota/dr)}}$$ 2. **双特征环向截面对比**：在同一矢量画布上并列绘制两个对称截面： - **$\\phi = 0^\\circ$ 截面**：高度竖直拉伸的“豆形”（Bean-shaped）磁截面，边缘显现清晰的上下两个与侧边共 5 个分离磁岛截面。 - **$\\phi = 36^\\circ$ 截面**（五对称周期半周期）：旋转 $180^\\circ$ 拓扑变异形成的“倒三角形”（Triangular）截面，外凸角受局部强曲率挤压。 3. **庞加莱映射（Poincaré Points）**：闭合磁面内部展现数千个离散但连续的同心嵌套流线打点；磁岛内部围绕局部 O 点（Elliptic Point）闭合转动，相邻磁岛间由双曲 X 点（Hyperbolic Point）相连，磁岛外侧开边界磁力线直连偏滤器靶板。 Visual Inspection Criteria: - **五重对称性拓扑**：边缘磁岛计数必须严格为 5 个，禁止出现 4 个或 6 个的错误阶数。 - **双截面几何形态差分**：左图豆形纵横比 $\\ge 2.2$，内凹外凸边界；右图三角形具备锐利的三顶角，且两图截面面积严格守恒。 - **X 点与 O 点拓扑完整性**：机器视觉可检测到 5 组局域极小/极大封闭环（O点）与跨越不同磁面的交叉鞍点（X点）。 - **偏滤器靶板拦截**：10 组三维扭曲靶板在二维截面上的投影刀口必须精确穿入磁岛外侧排气通道。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Pedersen, T. S., et al. \"Confirmation of the topology of the Wendelstein 7-X magnetic field to better than 1:100,000.\" *Nature Communications*, 7:13493 (2016). DOI: `10.1038/ncomms13493`. - Wolf, R.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "仿星器三维非平面扭曲超导线圈与 $\\iota=5/5$ 磁岛链偏滤器拓扑",
    groundTruth: "1. **旋转变换与共振条件**：边缘磁面旋转变换严格取 $\\iota = 1.0 = 5/5$；磁岛宽度由低磁剪切条件控制： $$w = 4 \\sqrt{\\frac{r B_{mn}}{m B_\\theta (d\\iota/dr)}}$$ 2. **双特征环向截面对比**：在同一矢量画布上并列绘制两个对称截面： - **$\\phi = 0^\\circ$ 截面**：高度竖直拉伸的“豆形”（Bean-shaped）磁截面，边缘显现清晰的上下两个与侧边共 5 个分离磁岛截面。 - **$\\phi = 36^\\circ$ 截面**（五对称周期半周期）：旋转 $180^\\circ$ 拓扑变异形成的“倒三角形”（Triangular）截面，外凸角受局部强曲率挤压。 3. **庞加莱映射（Poincaré Points）**：闭合磁面内部展现数千个离散但连续的同心嵌套流线打点；磁岛内部围绕局部 O 点",
    evaluationCriteria: "- **五重对称性拓扑**：边缘磁岛计数必须严格为 5 个，禁止出现 4 个或 6 个的错误阶数。 - **双截面几何形态差分**：左图豆形纵横比 $\\ge 2.2$，内凹外凸边界；右图三角形具备锐利的三顶角，且两图截面面积严格守恒。 - **X 点与 O 点拓扑完整性**：机器视觉可检测到 5 组局域极小/极大封闭环（O点）与跨越不同磁面的交叉鞍点（X点）。 - **偏滤器靶板拦截**：10 组三维扭曲靶板在二维截面上的投影刀口必须精确穿入磁岛外侧排气通道。",
    referenceSource: "- Pedersen, T. S., et al. \"Confirmation of the topology of the Wendelstein 7-X magnetic field to better than 1:100,000.\" *Nature Communications*, 7:13493 (2016). DOI: `10.1038/ncomms13493`. - Wolf, R. C., et al. \"Major results from the first plasma campaign of the Wendelstein 7-X stellarator.\" *Nucl",
  },
};

/**
 * FE-ENERGY-03: 惯性约束聚变金刚石微球内爆烧蚀与瑞利-泰勒不稳定性动力学
 */
export const FE_ENERGY_03_PROMPT: PromptSpec = {
  id: "FE-ENERGY-03",
  label: "惯性约束聚变金刚石微球内爆烧蚀与瑞利-泰勒不稳定性动力学 (NIF W-Doped Diamond Capsule Implosion & Ablative Rayleigh-Taylor Instability)",
  template: "Generate an SVG technical visualization of NIF W-Doped Diamond Capsule Implosion & Ablative Rayleigh-Taylor Instability using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 美国劳伦斯利弗莫尔国家实验室（LLNL）的国家点火装置（NIF）在 2022-2024 年连续实现靶能量增益 $G > 1$ 的历史性点火。其核心是在圆柱形贫铀/金黑腔内，利用 192 束高能激光转换为 300 eV 软 X 射线，驱动内层掺钨渐变高密度碳（HDC/金刚石）烧蚀微球以超 380 km/s 高速内爆，同时必须依靠烧蚀面平滑效应压制瑞利-泰勒（RT）流体不稳定性。 Physical & Mathematical Ground Truth: 1. **层状微球几何尺寸**：初始外径 $R_0 = 1050\\text{ }\\mu\\text{m}$。同心层结构依次为： - 外层：纯高密度金刚石烧蚀层（HDC, $\\rho = 3.52\\text{ g/cm}^3$, 厚度 $\\sim 40\\text{ }\\mu\\text{m}$）； - 中间层：钨渐变掺杂金刚石层（W-doped HDC, 原子比 0.2-0.4% W，厚度 $\\sim 20\\text{ }\\mu\\text{m}$，用于屏蔽软 X 射线 M 带光子预热）； - 内壳层：固态超低温氘氚冰层（Cryogenic DT Ice, 厚度 $\\sim 55\\text{ }\\mu\\text{m}$）； - 中心腔：低密度 DT 饱和蒸气核。 2. **内爆收缩动力学与 Takabe 致稳公式**：收缩比 $C_r = R_0 / R_{\\text{hot-spot}} \\approx 30$。烧蚀外界面向外以超音速膨胀喷射，内界面向中心极速塌缩；烧蚀界面 RT 扰动线性增长率遵循 Takabe 修正方程： $$\\gamma(k) = \\alpha \\sqrt{\\frac{k g}{1 + k L}} - \\beta k v_a$$ 其中 $v_a = \\dot{m}/\\rho$ 为质量烧蚀速度，对高模数扰动起到决定性平滑致稳作用。 Visual Inspection Criteria: - **连续内爆动画时序**：SVG SMIL/CSS 动画模拟 $t=0\\text{ ns}$ 到 $t_{\\text{peak}} \\approx 8-10\\text{ ns}$ 的压缩全过程；初始外半径 $R_0$ 连续收缩至 $1/30$ 核心热斑，中心温度跃迁为白炽色阶（>10 keV）。 - **反向喷射与烧蚀风暴**：外层显示微细半透明粒子/流线向外呈放射状反冲喷射（火箭效应）；反作用力推动内壳层向内聚心加速。 - **RT 不稳定性波纹演化**：外层波长微扰随着内爆进行，逐渐演化为指状冷物质尖峰（Spike）向内插、热气泡（Bubble）向外浮的周期性非线性羽流，随后高模态被烧蚀效应平滑。 - **渐变掺杂指示**：钨掺杂层显示特定的半透明琥珀色渐变吸收带，在 X 射线照射下阻止光子穿透至 DT 冰层。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Abu-Shawareb, H., et al. (Indirect Drive ICF Collaboration). \"Achievement of Target Gain Larger than Unity in an Inertial Fusion Experiment.\" *Physical Review Letters*, 132, 065102 (2024). DOI: `10.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "惯性约束聚变金刚石微球内爆烧蚀与瑞利-泰勒不稳定性动力学",
    groundTruth: "1. **层状微球几何尺寸**：初始外径 $R_0 = 1050\\text{ }\\mu\\text{m}$。同心层结构依次为： - 外层：纯高密度金刚石烧蚀层（HDC, $\\rho = 3.52\\text{ g/cm}^3$, 厚度 $\\sim 40\\text{ }\\mu\\text{m}$）； - 中间层：钨渐变掺杂金刚石层（W-doped HDC, 原子比 0.2-0.4% W，厚度 $\\sim 20\\text{ }\\mu\\text{m}$，用于屏蔽软 X 射线 M 带光子预热）； - 内壳层：固态超低温氘氚冰层（Cryogenic DT Ice, 厚度 $\\sim 55\\text{ }\\mu\\text{m}$）； - 中心腔：低密度 DT 饱和蒸气核。 2. **内爆收缩动力学与 Takabe 致稳公式**：收缩比 $C_r = R_0 / R_{\\text{hot-spot}} \\ap",
    evaluationCriteria: "- **连续内爆动画时序**：SVG SMIL/CSS 动画模拟 $t=0\\text{ ns}$ 到 $t_{\\text{peak}} \\approx 8-10\\text{ ns}$ 的压缩全过程；初始外半径 $R_0$ 连续收缩至 $1/30$ 核心热斑，中心温度跃迁为白炽色阶（>10 keV）。 - **反向喷射与烧蚀风暴**：外层显示微细半透明粒子/流线向外呈放射状反冲喷射（火箭效应）；反作用力推动内壳层向内聚心加速。 - **RT 不稳定性波纹演化**：外层波长微扰随着内爆进行，逐渐演化为指状冷物质尖峰（Spike）向内插、热气泡（Bubble）向外浮的周期性非线性羽流，随后高模态被烧蚀效应平滑。 - **渐变掺杂指示**：钨掺杂层显示特定的半透明琥珀色渐变吸收带，在 X 射线照射下阻止光子穿透至 DT 冰层。",
    referenceSource: "- Abu-Shawareb, H., et al. (Indirect Drive ICF Collaboration). \"Achievement of Target Gain Larger than Unity in an Inertial Fusion Experiment.\" *Physical Review Letters*, 132, 065102 (2024). DOI: `10.1103/PhysRevLett.132.065102`. - Betti, R., and Hurricane, O. A. \"Inertial-confinement fusion with la",
  },
};

/**
 * FE-ENERGY-04: 场反转构型等离子体碰撞压缩与法拉第感应直接电能转换回路
 */
export const FE_ENERGY_04_PROMPT: PromptSpec = {
  id: "FE-ENERGY-04",
  label: "场反转构型等离子体碰撞压缩与法拉第感应直接电能转换回路 (Helion FRC Plasmoid Collision & Inductive Direct Energy Recovery Circuit)",
  template: "Generate an SVG technical visualization of Helion FRC Plasmoid Collision & Inductive Direct Energy Recovery Circuit using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 商业聚变领军企业 Helion Energy 的 Polaris 脉冲非点火聚变路线。该技术在两端磁枪中形成两个高 $\\beta$ 场反转构型（FRC）等离子体团，以超音速（>100 万公里/小时）对撞于中室合并，随后由高磁场线圈瞬间绝热压缩至 1 亿度；核反应产生的能量使等离子体急剧膨胀，逆向做功反推磁通量，直接通过法拉第感应定律在外部线圈中回生高压直流电，省去蒸汽轮机。 Physical & Mathematical Ground Truth: 1. **FRC 磁拓扑几何**：细长闭合螺线管腔体内，两侧 FRC 为闭合圆环状磁面（类似烟圈），内部磁力线闭合反向，外部为开放通量线。分离面（Separatrix）半径 $r_s$，两端存在磁力线重联的 X 点。 2. **绝热压缩与温度标度**：对撞合并后，压缩线圈通入兆安级电流，磁场由 $B_0 \\sim 0.2\\text{ T}$ 跃升至 $B_{\\text{max}} \\sim 10\\text{ T}$；细长 FRC 绝热压缩满足第一性原理标度律： $$T \\propto B^{4/5}, \\quad n \\propto B^{6/5}, \\quad r_s \\propto B^{-2/5}$$ 3. **法拉第感应能量回收**：聚变释放带电粒子（D-$^3\\text{He}$ 反应生成高能 $\\alpha$ 粒子与质子）导致等离子体压力 $p$ 暴增并向外膨胀： $$\\mathcal{E} = -\\frac{d\\Phi_B}{dt} = -\\frac{d}{dt} \\iint_{S} \\mathbf{B}_{\\text{external}} \\cdot d\\mathbf{A}$$ 膨胀等离子体将磁场向外挤压回线圈，驱动线圈电流反向注入外部电容储能阵列，往返回收效率 $>95\\%$。 Visual Inspection Criteria: - **四阶段连续循环动画**： 1. *加速对撞相*（Acceleration）：两侧青蓝色环形 FRC 等离子体团沿中心轴向相对高速飞行； 2. *碰撞合并相*（Merging & Stagnation）：中心碰撞激波增亮，合并为单个细长 FRC 团； 3. *磁场猛烈压缩相*（Compression）：外部黄色螺线管线圈高频闪烁加压，中心等离子体急剧收缩变细，色温瞬间由蓝紫跃升为亮白粉红（聚变工况）； 4. *膨胀直接发电相*（Expansion & Direct Recovery）：等离子体如气缸活塞般急剧外扩推挤磁力线，线圈回路外接电路出现高亮电荷光点沿导线高速回流至电容阵列（电容器两端电量图元动态充盈）。 - **磁力线反转方向严格性**：中心磁轴处磁力线方向必须与最外侧导向场完全反向。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Slough, J., et al. \"Creation of a high-temperature, high-density field-reversed configuration by the translation, collision, and merging of two high-velocity plasmoids.\" *Physics of Plasmas*, Vol. 1",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "场反转构型等离子体碰撞压缩与法拉第感应直接电能转换回路",
    groundTruth: "1. **FRC 磁拓扑几何**：细长闭合螺线管腔体内，两侧 FRC 为闭合圆环状磁面（类似烟圈），内部磁力线闭合反向，外部为开放通量线。分离面（Separatrix）半径 $r_s$，两端存在磁力线重联的 X 点。 2. **绝热压缩与温度标度**：对撞合并后，压缩线圈通入兆安级电流，磁场由 $B_0 \\sim 0.2\\text{ T}$ 跃升至 $B_{\\text{max}} \\sim 10\\text{ T}$；细长 FRC 绝热压缩满足第一性原理标度律： $$T \\propto B^{4/5}, \\quad n \\propto B^{6/5}, \\quad r_s \\propto B^{-2/5}$$ 3. **法拉第感应能量回收**：聚变释放带电粒子（D-$^3\\text{He}$ 反应生成高能 $\\alpha$ 粒子与质子）导致等离子体压力 $p$ 暴增并向外膨胀： $$\\mat",
    evaluationCriteria: "- **四阶段连续循环动画**： 1. *加速对撞相*（Acceleration）：两侧青蓝色环形 FRC 等离子体团沿中心轴向相对高速飞行； 2. *碰撞合并相*（Merging & Stagnation）：中心碰撞激波增亮，合并为单个细长 FRC 团； 3. *磁场猛烈压缩相*（Compression）：外部黄色螺线管线圈高频闪烁加压，中心等离子体急剧收缩变细，色温瞬间由蓝紫跃升为亮白粉红（聚变工况）； 4. *膨胀直接发电相*（Expansion & Direct Recovery）：等离子体如气缸活塞般急剧外扩推挤磁力线，线圈回路外接电路出现高亮电荷光点沿导线高速回流至电容阵列（电容器两端电量图元动态充盈）。 - **磁力线反转方向严格性**：中心磁轴处磁力线方向必须与最外侧导向场完全反向。",
    referenceSource: "- Slough, J., et al. \"Creation of a high-temperature, high-density field-reversed configuration by the translation, collision, and merging of two high-velocity plasmoids.\" *Physics of Plasmas*, Vol. 18, 056104 (2011). DOI: `10.1063/1.3562944`. - Kirtley, D., et al. \"Inductive direct energy conversio",
  },
};

/**
 * FE-ENERGY-05: 第四代钍基熔盐堆失电自熔冷冻塞相变重力排料安全回路
 */
export const FE_ENERGY_05_PROMPT: PromptSpec = {
  id: "FE-ENERGY-05",
  label: "第四代钍基熔盐堆失电自熔冷冻塞相变重力排料安全回路 (TMSR-LF1 Passive Freeze Plug Phase-Change & Gravity Drain Dynamics)",
  template: "Generate an SVG technical visualization of TMSR-LF1 Passive Freeze Plug Phase-Change & Gravity Drain Dynamics using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 中国科学院在甘肃武威成功运行的 2 MWt 液态燃料钍基熔盐实验堆（TMSR-LF1）。熔盐堆常压运行（无蒸汽爆炸危险），采用无水冷却与 FLiBe 载体盐。其核心固有安全屏障是堆底的“冷冻塞”（Freeze Plug）：正常运行时用风冷将其维持为固态盐栓；在全厂断电（Station Blackout, SBO）极限事故下，风冷失电中断，堆芯余热自发熔化固态盐栓，堆芯液态燃料依靠重力完全排入地下次临界安全储罐。 Physical & Mathematical Ground Truth: 1. **热物理与物性参数**： - 载体盐：$\\text{LiF-BeF}_2$（66-34 mol%，FLiBe）； - 熔点：$T_{\\text{melt}} = 459^\\circ\\text{C}$（732 K）； - 堆芯运行温度：$650^\\circ\\text{C}-700^\\circ\\text{C}$； - 密度：$\\rho \\approx 1940\\text{ kg/m}^3$；比热：$C_p \\approx 2414\\text{ J/(kg}\\cdot\\text{K)}$；动力粘度：$\\mu \\approx 7.0\\text{ mPa}\\cdot\\text{s}$。 2. **Stefan 移动边界相变控制方程**： 冷冻塞固液相变前沿 $s(t)$ 沿管道径向/轴向的推进遵从一维 Stefan 守恒律： $$\\rho L \\frac{ds(t)}{dt} = -k_{\\text{solid}} \\left. \\frac{\\partial T}{\\partial z} \\right|_{z=s(t)^-} + k_{\\text{liquid}} \\left. \\frac{\\partial T}{\\partial z} \\right|_{z=s(t)^+}$$ 熔化开启时间窗口精准处于失去主动冷却后的 300 到 600 秒（5-10 分钟）。 3. **重力排液与次临界几何**： 打通后流速遵循伯努利-托里拆利重力排料方程（含管道阻力）： $$v(t) = \\sqrt{\\frac{2 g H(t)}{1 + f \\frac{L}{D} + \\sum K_L}}$$ 排料地下储罐呈扁平或分隔式深井蜂窝阵列（Subcritical Geometry），中子增殖因子 $k_{\\text{eff}} < 0.95$ 绝对停堆，外壁配备被动自然对流空气烟囱循环散热。 Visual Inspection Criteria: - **时序状态演变（动画分幕）**： - *正常运行态*：下方风机吹出浅蓝冷风，管道中央凝固一段深灰蓝色固态盐栓，上方为鲜红色 650 °C 高温流动熔盐； - *失电事故触发*：冷风流线瞬间停滞消失，红色热量传导蔓延进入冷冻塞； - *相变开栓过程*：深灰蓝盐栓边缘开始泛红熔化，相变界面向中心收缩，直至中心彻底贯通形成穿孔通道； - *重力排空与余热排出*：堆芯红液如瀑布般顺重力管完全排入下方蜂窝状隔离储罐，堆芯变为空腔安全态；储罐两侧自然循环空气烟囱产生向上漂移的白色热对流气流箭头。 - **液位与物理连贯性**：堆芯反应堆容器液位平滑下降与下方地下储罐液位平滑上升严格保持容积守恒比率。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Rosenthal, M. W., et al. \"Recent progress in the molten-salt reactor program.\" *Nuclear Applications and Technology*, Vol. 8, No. 2 (1970), 107–117. - Jiang, D., et al. \"Thermal-hydraulic analysis o",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "第四代钍基熔盐堆失电自熔冷冻塞相变重力排料安全回路",
    groundTruth: "1. **热物理与物性参数**： - 载体盐：$\\text{LiF-BeF}_2$（66-34 mol%，FLiBe）； - 熔点：$T_{\\text{melt}} = 459^\\circ\\text{C}$（732 K）； - 堆芯运行温度：$650^\\circ\\text{C}-700^\\circ\\text{C}$； - 密度：$\\rho \\approx 1940\\text{ kg/m}^3$；比热：$C_p \\approx 2414\\text{ J/(kg}\\cdot\\text{K)}$；动力粘度：$\\mu \\approx 7.0\\text{ mPa}\\cdot\\text{s}$。 2. **Stefan 移动边界相变控制方程**： 冷冻塞固液相变前沿 $s(t)$ 沿管道径向/轴向的推进遵从一维 Stefan 守恒律： $$\\rho L \\frac{ds(t)}{dt} = -k_{\\",
    evaluationCriteria: "- **时序状态演变（动画分幕）**： - *正常运行态*：下方风机吹出浅蓝冷风，管道中央凝固一段深灰蓝色固态盐栓，上方为鲜红色 650 °C 高温流动熔盐； - *失电事故触发*：冷风流线瞬间停滞消失，红色热量传导蔓延进入冷冻塞； - *相变开栓过程*：深灰蓝盐栓边缘开始泛红熔化，相变界面向中心收缩，直至中心彻底贯通形成穿孔通道； - *重力排空与余热排出*：堆芯红液如瀑布般顺重力管完全排入下方蜂窝状隔离储罐，堆芯变为空腔安全态；储罐两侧自然循环空气烟囱产生向上漂移的白色热对流气流箭头。 - **液位与物理连贯性**：堆芯反应堆容器液位平滑下降与下方地下储罐液位平滑上升严格保持容积守恒比率。",
    referenceSource: "- Rosenthal, M. W., et al. \"Recent progress in the molten-salt reactor program.\" *Nuclear Applications and Technology*, Vol. 8, No. 2 (1970), 107–117. - Jiang, D., et al. \"Thermal-hydraulic analysis of passive decay heat removal system for TMSR.\" *Annals of Nuclear Energy*, 135, 106972 (2020). DOI: ",
  },
};

/**
 * FE-ENERGY-06: 硫化物全固态锂金属电池微观固固界相（SEI）电化学应力演变与晶界枝晶穿透抑制准则
 */
export const FE_ENERGY_06_PROMPT: PromptSpec = {
  id: "FE-ENERGY-06",
  label: "硫化物全固态锂金属电池微观固固界相（SEI）电化学应力演变与晶界枝晶穿透抑制准则 (Sulfide Solid Electrolyte Grain Boundary Lithium Dendrite Chemo-Mechanical Penetration)",
  template: "Generate an SVG technical visualization of Sulfide Solid Electrolyte Grain Boundary Lithium Dendrite Chemo-Mechanical Penetration as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 硫化物全固态锂电池（如 $\\text{Li}_6\\text{PS}_5\\text{Cl}$ 硫银锗矿或 $\\text{Li}_{10}\\text{GeP}_2\\text{S}_{12}$ LGPS）拥有媲美液态电解质的高离子电导率（$>10^{-2}\\text{ S/cm}$），但其实用化面临“Monroe-Newman 剪切模量悖论”——即便固体电解质模量远大于金属锂的两倍，锂枝晶依然沿多晶界相（Grain Boundaries, GB）与孔隙快速穿透并引发软短路。这源于局部电子漏电与应力-电化学耦合驱动的微观裂纹扩展。 Physical & Mathematical Ground Truth: 1. **应力耦合化学势与电化学动力学**： 锂离子在金属锂/固态电解质界面的局域过电位受静水应力 $\\sigma_h = \\frac{1}{3}\\text{Tr}(\\boldsymbol{\\sigma})$ 调制： $$\\mu_{\\text{Li}} = \\mu_{\\text{Li}}^0 - F \\eta - \\Omega \\sigma_h$$ 其中 $\\Omega$ 为锂的摩尔体积。压应力（$\\sigma_h < 0$）提高化学势、阻碍锂析出；拉应力集中（$\\sigma_h > 0$）剧烈加速局部锂沉积。 2. **格里菲斯（Griffith）断裂力学穿透准则**： 锂枝晶在晶界三叉晶界点（Triple Junction）尖端产生的楔形推力诱发模式-I 型张开裂纹： $$K_I = \\sigma_{\\text{tip}} \\sqrt{\\pi a} \\ge K_{Ic}^{\\text{GB}}$$ 其中 $K_{Ic}^{\\text{GB}}$ 为晶界断裂韧度（通常仅为单晶本体韧度的 $30-50\\%$）。 3. **外加装配面压窗口**：维持微观保形接触抑制剥离空洞与抑制晶界张开的临界外加面压阈值区间为 $5\\text{ MPa} \\le P_{\\text{stack}} \\le 10\\text{ MPa}$。 Visual Inspection Criteria: - **三层微观拓扑结构**： - 顶部：金属锂阳极（浅灰金属光泽，显示受挤压的蠕变滑移线）； - 中部：非原位/原位形成的纳米界相层（SEI/中间层，如 $\\text{Li}_3\\text{N}/\\text{Li}_2\\text{S}$ 复合层）； - 底部：多晶硫化物电解质（多边形 Voronoi 晶粒拼合网络，清晰标注晶界线与三叉晶界点）。 - **应力集中彩虹色阶**：在侵入晶界的锂枝晶尖端，呈现高精度的 Von Mises 等效应力集中椭圆云图（尖端为深红高拉应力区，两侧为深蓝压应力屏蔽区）。 - **空洞与剥离失稳区**：在金属锂剥离侧标绘由于锂扩散通量不匹配形成的纳米级 Kirkendall 类似微孔洞（Voids）。 - **断裂力学向量**：标明裂纹张开位移（COD）矢量与锂原子电迁移通量 $J_{\\text{Li}^+}$ 箭头。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Porz, L., et al. \"Mechanism of lithium metal penetration through inorganic solid electrolytes.\" *Advanced Energy Materials*, Vol. 7, 1701003 (2017). DOI: `10.1002/aenm.201701003`. - Monroe, C., and ",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "硫化物全固态锂金属电池微观固固界相（SEI）电化学应力演变与晶界枝晶穿透抑制准则",
    groundTruth: "1. **应力耦合化学势与电化学动力学**： 锂离子在金属锂/固态电解质界面的局域过电位受静水应力 $\\sigma_h = \\frac{1}{3}\\text{Tr}(\\boldsymbol{\\sigma})$ 调制： $$\\mu_{\\text{Li}} = \\mu_{\\text{Li}}^0 - F \\eta - \\Omega \\sigma_h$$ 其中 $\\Omega$ 为锂的摩尔体积。压应力（$\\sigma_h < 0$）提高化学势、阻碍锂析出；拉应力集中（$\\sigma_h > 0$）剧烈加速局部锂沉积。 2. **格里菲斯（Griffith）断裂力学穿透准则**： 锂枝晶在晶界三叉晶界点（Triple Junction）尖端产生的楔形推力诱发模式-I 型张开裂纹： $$K_I = \\sigma_{\\text{tip}} \\sqrt{\\pi a} \\ge K_{Ic}^{\\text{",
    evaluationCriteria: "- **三层微观拓扑结构**： - 顶部：金属锂阳极（浅灰金属光泽，显示受挤压的蠕变滑移线）； - 中部：非原位/原位形成的纳米界相层（SEI/中间层，如 $\\text{Li}_3\\text{N}/\\text{Li}_2\\text{S}$ 复合层）； - 底部：多晶硫化物电解质（多边形 Voronoi 晶粒拼合网络，清晰标注晶界线与三叉晶界点）。 - **应力集中彩虹色阶**：在侵入晶界的锂枝晶尖端，呈现高精度的 Von Mises 等效应力集中椭圆云图（尖端为深红高拉应力区，两侧为深蓝压应力屏蔽区）。 - **空洞与剥离失稳区**：在金属锂剥离侧标绘由于锂扩散通量不匹配形成的纳米级 Kirkendall 类似微孔洞（Voids）。 - **断裂力学向量**：标明裂纹张开位移（COD）矢量与锂原子电迁移通量 $J_{\\text{Li}^+}$ 箭头。",
    referenceSource: "- Porz, L., et al. \"Mechanism of lithium metal penetration through inorganic solid electrolytes.\" *Advanced Energy Materials*, Vol. 7, 1701003 (2017). DOI: `10.1002/aenm.201701003`. - Monroe, C., and Newman, J. \"The impact of elastic deformation on deposition kinetics at lithium/polymer interfaces.\"",
  },
};

/**
 * FE-ENERGY-07: 钠离子电池普鲁士白正极三维晶格膨胀与相变应变通道
 */
export const FE_ENERGY_07_PROMPT: PromptSpec = {
  id: "FE-ENERGY-07",
  label: "钠离子电池普鲁士白正极三维晶格膨胀与相变应变通道 (Prussian White Cathode 3D Open-Framework Lattice Strain & Phase Transitions)",
  template: "Generate an SVG technical visualization of Prussian White Cathode 3D Open-Framework Lattice Strain & Phase Transitions as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 在追求低成本长时储能的钠离子电池技术中，普鲁士白（Prussian White, $\\text{Na}_{2-x}\\text{Fe}[\\text{Fe}(\\text{CN})_6]$）由于具备双电子 Fe(II)/Fe(III) 氧化还原对，理论容量高达 $170\\text{ mAh/g}$。然而高钠状态下的单斜晶系（Monoclinic, $P2_1/n$）在脱钠循环过程中会连续滑移转变至菱方晶系（Rhombohedral, $R\\bar{3}m$）与立方晶系（Cubic, $Fm\\bar{3}m$），伴生高达 $16\\%$ 的各向异性晶格体积骤变与配位结晶水空位缺陷，导致晶格内部微观开裂。 Physical & Mathematical Ground Truth: 1. **晶体对称性与空间群转变**： $$\\text{单斜相 } P2_1/n \\xrightarrow{\\text{脱钠 } x \\sim 0.5} \\text{菱方相 } R\\bar{3}m \\xrightarrow{\\text{完全脱钠 } x \\sim 2.0} \\text{面心立方相 } Fm\\bar{3}m$$ 单斜相中 $\\beta$ 夹角偏离 $90^\\circ$（约 $92.5^\\circ$），立方相则恢复至完美 $90^\\circ$。 2. **开放通道与活化能能垒**： 三维刚性由八面体配位的 $\\text{Fe}^{2+}-\\text{C}\\equiv\\text{N}-\\text{Fe}^{3+}$ 桥连框架构成；间隙提供三维相通的 $\\text{Na}^+$ 迁移“瓶颈”（Neck radius $\\sim 1.6\\text{ \\AA}$），钠离子扩散活化能极低： $$D_{\\text{Na}} = D_0 \\exp\\left(-\\frac{E_a}{k_B T}\\right), \\quad E_a \\approx 0.28-0.35\\text{ eV}$$ 3. **晶格收缩与缺陷畸变**：完全脱钠状态下单位晶胞体积收缩 $\\Delta V / V_0 \\approx 16.2\\%$；未脱除的配位水分子（$\\text{H}_2\\text{O}$）占据 $\\text{[Fe(CN)}_6\\text{]}$ 空位产生局域畸变偶极场。 Visual Inspection Criteria: - **三维晶格透视骨架**：交替排列的浅蓝 $\\text{Fe}^{2+}\\text{C}_6$ 八面体与深紫 $\\text{Fe}^{3+}\\text{N}_6$ 八面体，由深灰线段与三线键标记的 $-\\text{C}\\equiv\\text{N}-$ 刚性桥连接。 - **钠离子通道与位点占据**：大粒径黄色球体（$\\text{Na}^+$）填充于八面体间隙的四面体/八面体间隙空腔中，带有表示 3D 扩散路径的曲折三维虚线流动箭头。 - **相变剪切应变对比**：画布左侧为带倾角 $\\beta=92.5^\\circ$ 的单斜晶胞（带有扭曲形变应变张量指示器），右侧为正交 $\\beta=90^\\circ$ 的立方晶胞，用红绿相间的双向箭头标出各向异性收缩率 $\\Delta a, \\Delta b, \\Delta c$。 - **空位水缺陷微区**：清晰标出一处 $\\text{[Fe(CN)}_6\\text{]}$ 缺失造成的八面体空缺，内部被红白两色的 $\\text{H}_2\\text{O}$ 分子填充，四周形成张力畸变圈。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Song, J., et al. \"Removal of interstitial water in hexacyanometallates for high-rate electrochemical energy storage.\" *Journal of the American Chemical Society*, 137(7), 2658–2664 (2015). DOI: `10.1",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "钠离子电池普鲁士白正极三维晶格膨胀与相变应变通道",
    groundTruth: "1. **晶体对称性与空间群转变**： $$\\text{单斜相 } P2_1/n \\xrightarrow{\\text{脱钠 } x \\sim 0.5} \\text{菱方相 } R\\bar{3}m \\xrightarrow{\\text{完全脱钠 } x \\sim 2.0} \\text{面心立方相 } Fm\\bar{3}m$$ 单斜相中 $\\beta$ 夹角偏离 $90^\\circ$（约 $92.5^\\circ$），立方相则恢复至完美 $90^\\circ$。 2. **开放通道与活化能能垒**： 三维刚性由八面体配位的 $\\text{Fe}^{2+}-\\text{C}\\equiv\\text{N}-\\text{Fe}^{3+}$ 桥连框架构成；间隙提供三维相通的 $\\text{Na}^+$ 迁移“瓶颈”（Neck radius $\\sim 1.6\\text{ \\AA}$），钠离子扩散活化能极低",
    evaluationCriteria: "- **三维晶格透视骨架**：交替排列的浅蓝 $\\text{Fe}^{2+}\\text{C}_6$ 八面体与深紫 $\\text{Fe}^{3+}\\text{N}_6$ 八面体，由深灰线段与三线键标记的 $-\\text{C}\\equiv\\text{N}-$ 刚性桥连接。 - **钠离子通道与位点占据**：大粒径黄色球体（$\\text{Na}^+$）填充于八面体间隙的四面体/八面体间隙空腔中，带有表示 3D 扩散路径的曲折三维虚线流动箭头。 - **相变剪切应变对比**：画布左侧为带倾角 $\\beta=92.5^\\circ$ 的单斜晶胞（带有扭曲形变应变张量指示器），右侧为正交 $\\beta=90^\\circ$ 的立方晶胞，用红绿相间的双向箭头标出各向异性收缩率 $\\Delta a, \\Delta b, \\Delta c$。 - **空位水缺陷微区**：清晰标出一处 $\\text{[Fe(CN",
    referenceSource: "- Song, J., et al. \"Removal of interstitial water in hexacyanometallates for high-rate electrochemical energy storage.\" *Journal of the American Chemical Society*, 137(7), 2658–2664 (2015). DOI: `10.1021/ja512383b`. - Wang, L., et al. \"A superior low-cost cathode for a Na-ion battery.\" *Angewandte C",
  },
};

/**
 * FE-ENERGY-08: 兆瓦级质子交换膜（PEM）水电解槽双极板微孔多孔传输层气液逆向流动与两相压降
 */
export const FE_ENERGY_08_PROMPT: PromptSpec = {
  id: "FE-ENERGY-08",
  label: "兆瓦级质子交换膜（PEM）水电解槽双极板微孔多孔传输层气液逆向流动与两相压降 (MW-Scale PEM Electrolyzer Ti-PTL Counter-Flow Two-Phase Capillary Transport)",
  template: "Generate an SVG technical visualization of MW-Scale PEM Electrolyzer Ti-PTL Counter-Flow Two-Phase Capillary Transport using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 绿氢规模化制备核心装备——兆瓦级 PEM 电解槽。在大于 $2.5\\text{ A/cm}^2$ 的高电流密度工况下，阳极析氧反应（OER）产生剧烈的氧气气泡暴发。阳极微孔多孔传输层（PTL，常为微米级烧结钛纤维毡）内部发生极端的气液逆向流动（Counter-flow）：液态水在毛细力与对流驱动下向膜催化层渗流，氧气气泡则逆向穿过钛毡向双极板流道排出，气泡堵塞微孔会诱发显著的传质过电位与局部膜干涸。 Physical & Mathematical Ground Truth: 1. **多相多孔介质流体力学控制方程**： 气液两相宏观渗流分别遵从两相广义达西定律： $$\\mathbf{u}_l = -\\frac{K k_{rl}(S_l)}{\\mu_l} \\nabla P_l, \\quad \\mathbf{u}_g = -\\frac{K k_{rg}(S_g)}{\\mu_g} \\nabla P_g$$ 毛细压强差由 Leverett J-函数闭合： $$P_c(S_l) = P_g - P_l = \\sigma \\cos\\theta_c \\sqrt{\\frac{\\varepsilon}{K}} J(S_l)$$ 2. **几何微结构尺度**： - 钛纤维直径：$d_f \\approx 20\\text{ }\\mu\\text{m}$，PTL 厚度：$300\\text{ }\\mu\\text{m}$，体孔隙率：$\\varepsilon \\approx 65\\%$； - 双极板（Bipolar Plate）流道：肋条（Rib）与流道（Channel）宽度各为 $1.0\\text{ mm}$。 3. **过电位响应**：局部气体饱和度 $S_g > 0.4$ 时，催化层有效活性位点被气体隔离，传质浓差过电位急剧上升： $$\\eta_{\\text{conc}} = \\frac{R T}{4 F} \\ln\\left( \\frac{1}{1 - S_{g,\\text{interface}}} \\right)$$ Visual Inspection Criteria: - **连续流动动力学动画**： - 顶部流道板注入的深蓝水滴/连续液流自上而下通过多孔钛纤维网络向底部催化层流动； - 底部催化层（阳极薄层，深红/金黄色）连续析出细小的亮红/透明圆形 $\\text{O}_2$ 气泡，气泡聚并为大泡后逆向自下而上指进（Fingering）突破钛纤维缝隙，最终逸入流道； - 在双极板金属“肋条”（Rib）遮挡区域，清晰展现气泡滞留聚集（Bubble Stagnation）与局部贫水现象。 - **饱和度梯度彩色谱条**：右侧同步显示伴随气液逆流形成的沿厚度方向液态水饱和度 $S_l(z)$ 曲线与色阶图（流道侧 $S_l \\approx 0.9$ 渐变至催化层侧 $S_l \\approx 0.5$）。 - **接触角与弯液面形态**：水气界面在亲水性氧化钛表面展现凹液面接触角 $\\theta_c < 90^\\circ$ 的微观弯月面。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Majasan, J. O., et al. \"Two-phase flow operando studies of proton exchange membrane water electrolyzers.\" *Applied Energy*, Vol. 231, 1072–1085 (2018). DOI: `10.1016/j.apenergy.2018.09.117`. - Lopat",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "兆瓦级质子交换膜（PEM）水电解槽双极板微孔多孔传输层气液逆向流动与两相压降",
    groundTruth: "1. **多相多孔介质流体力学控制方程**： 气液两相宏观渗流分别遵从两相广义达西定律： $$\\mathbf{u}_l = -\\frac{K k_{rl}(S_l)}{\\mu_l} \\nabla P_l, \\quad \\mathbf{u}_g = -\\frac{K k_{rg}(S_g)}{\\mu_g} \\nabla P_g$$ 毛细压强差由 Leverett J-函数闭合： $$P_c(S_l) = P_g - P_l = \\sigma \\cos\\theta_c \\sqrt{\\frac{\\varepsilon}{K}} J(S_l)$$ 2. **几何微结构尺度**： - 钛纤维直径：$d_f \\approx 20\\text{ }\\mu\\text{m}$，PTL 厚度：$300\\text{ }\\mu\\text{m}$，体孔隙率：$\\varepsilon \\approx 65\\%$； - ",
    evaluationCriteria: "- **连续流动动力学动画**： - 顶部流道板注入的深蓝水滴/连续液流自上而下通过多孔钛纤维网络向底部催化层流动； - 底部催化层（阳极薄层，深红/金黄色）连续析出细小的亮红/透明圆形 $\\text{O}_2$ 气泡，气泡聚并为大泡后逆向自下而上指进（Fingering）突破钛纤维缝隙，最终逸入流道； - 在双极板金属“肋条”（Rib）遮挡区域，清晰展现气泡滞留聚集（Bubble Stagnation）与局部贫水现象。 - **饱和度梯度彩色谱条**：右侧同步显示伴随气液逆流形成的沿厚度方向液态水饱和度 $S_l(z)$ 曲线与色阶图（流道侧 $S_l \\approx 0.9$ 渐变至催化层侧 $S_l \\approx 0.5$）。 - **接触角与弯液面形态**：水气界面在亲水性氧化钛表面展现凹液面接触角 $\\theta_c < 90^\\circ$ 的微观弯月面。",
    referenceSource: "- Majasan, J. O., et al. \"Two-phase flow operando studies of proton exchange membrane water electrolyzers.\" *Applied Energy*, Vol. 231, 1072–1085 (2018). DOI: `10.1016/j.apenergy.2018.09.117`. - Lopata, J., et al. \"Porous transport layers in PEM water electrolysers: A review of fluid transport, degr",
  },
};

/**
 * FE-ENERGY-09: 无源被动日间辐射制冷超材料在 8-13 微米大气透明窗口的高发射率与太阳光谱超高反射率光子拓扑
 */
export const FE_ENERGY_09_PROMPT: PromptSpec = {
  id: "FE-ENERGY-09",
  label: "无源被动日间辐射制冷超材料在 8-13 微米大气透明窗口的高发射率与太阳光谱超高反射率光子拓扑 (Passive Radiative Cooling Metamaterial Atmospheric Window Spectral & Photonic Heat Balance)",
  template: "Generate an SVG technical visualization of Passive Radiative Cooling Metamaterial Atmospheric Window Spectral & Photonic Heat Balance as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 零能耗气候工程与极端节能建筑的核心突破——全天候被动日间辐射制冷（Passive Daytime Radiative Cooling, PDRC）。基于分级多孔聚合物/微球超材料（如嵌入 $\\text{SiO}_2$ 微球的微孔聚合物），在太阳光谱波段（0.3-2.5 $\\mu\\text{m}$）通过多尺度 Mie 散射实现超过 $96-98\\%$ 的极高太阳反射率；同时利用极性键振动在地球大气透明窗口（8-13 $\\mu\\text{m}$）实现接近理想黑体（$>95\\%$）的热发射率，直接将热量以电磁波形式辐射至 3K 的宇宙冷阱，在直射日光下实现 5-10 °C 的亚环境降温。 Physical & Mathematical Ground Truth: 1. **地表净辐射制冷功率热力学第一定律**： $$P_{\\text{net}}(T) = P_{\\text{rad}}(T) - P_{\\text{atm}}(T_{\\text{amb}}) - P_{\\text{sun}} - P_{\\text{cond+conv}}$$ 其中各分项严格定义为： - 材料自发热辐射：$P_{\\text{rad}}(T) = 2\\pi \\int_0^{\\pi/2} \\sin\\theta\\cos\\theta d\\theta \\int_0^\\infty I_{\\text{BB}}(\\lambda, T) \\varepsilon(\\lambda, \\theta) d\\lambda$； - 吸收大气下行热辐射：$P_{\\text{atm}}(T_{\\text{amb}}) = 2\\pi \\int_0^{\\pi/2} \\sin\\theta\\cos\\theta d\\theta \\int_0^\\infty I_{\\text{BB}}(\\lambda, T_{\\text{amb}}) \\varepsilon(\\lambda, \\theta) \\varepsilon_{\\text{atm}}(\\lambda, \\theta) d\\lambda$； - 吸收日光直射功率：$P_{\\text{sun}} = \\int_0^\\infty I_{\\text{AM1.5}}(\\lambda) \\alpha(\\lambda) d\\lambda$（其中 $\\alpha(\\lambda) = 1 - R(\\lambda) \\le 0.04$）； - 非辐射对流与传导寄生漏热：$P_{\\text{cond+conv}} = h_c (T_{\\text{amb}} - T)$（对流换热系数 $h_c \\approx 6-10\\text{ W/(m}^2\\cdot\\text{K)}$）。 2. **理想光谱响应函数**： - 在 $\\lambda \\in [0.3, 2.5]\\text{ }\\mu\\text{m}$（太阳波段）：反射率 $R \\approx 0.98$，发射率 $\\varepsilon \\approx 0.02$； - 在 $\\lambda \\in [8, 13]\\text{ }\\mu\\text{m}$（大气窗口）：发射率 $\\varepsilon \\ge 0.95$；其余红外波段保持低吸收以阻隔温室气体逆向辐射。 Visual Inspection Criteria: - **三层垂直热力学拓扑系统**： - 顶层：外太空冷阱（标注深空温度 $3\\text{ K}$，深邃星空底色）； - 中层：地球大气层与吸收谱带图示（清晰用虚线高亮标注 8-13 $\\mu\\text{m}$ 的透明大气窗口，并标注两侧水汽与 $\\text{CO}_2$ 的不透明阻挡带）； - 底层：具有微纳微球/分级多孔结构的辐射制冷超材料薄膜截面与下方的被制冷基底。 - **分波段光子通量能量平衡矢量**： - 入射的黄色太阳光束（0.3-2.5 $\\mu\\text{m}$）在超材料多孔微球表面发生密集多次 Mie 散射后，绝大部分以粗粗的黄色箭头 $98\\%$ 完全反射回天空； - 细窄的青色大气逆向热辐射部分被阻隔； - 最关键：粗大醒目的红外高能洋红色光子流（8-13 $\\mu\\text{m}$）无衰减地直接射穿大气窗口直达宇宙冷阱。 - **能量收支与温度梯标**：右侧配有定量柱状图，清晰反映 $P_{\\text{net}} \\approx 100\\text{ W/m}^2 > 0$ 时，表面温度 $T_{\\text{surface}}$ 跌破环境基准线 $T_{\\text{amb}}$ 达 $\\Delta T = -8.5^\\circ\\text{C}$ 的精确温降负色阶刻度尺。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Raman, A. P., Anoma, M. A., Zhu, L., Rephaeli, E., and Fan, S. \"Passive radiative cooling below ambient air temperature under direct sunlight.\" *Nature*, 515, 540–544 (2014). DOI: `10.1038/nature138",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "无源被动日间辐射制冷超材料在 8-13 微米大气透明窗口的高发射率与太阳光谱超高反射率光子拓扑",
    groundTruth: "1. **地表净辐射制冷功率热力学第一定律**： $$P_{\\text{net}}(T) = P_{\\text{rad}}(T) - P_{\\text{atm}}(T_{\\text{amb}}) - P_{\\text{sun}} - P_{\\text{cond+conv}}$$ 其中各分项严格定义为： - 材料自发热辐射：$P_{\\text{rad}}(T) = 2\\pi \\int_0^{\\pi/2} \\sin\\theta\\cos\\theta d\\theta \\int_0^\\infty I_{\\text{BB}}(\\lambda, T) \\varepsilon(\\lambda, \\theta) d\\lambda$； - 吸收大气下行热辐射：$P_{\\text{atm}}(T_{\\text{amb}}) = 2\\pi \\int_0^{\\pi/2} \\sin\\theta\\cos\\theta d",
    evaluationCriteria: "- **三层垂直热力学拓扑系统**： - 顶层：外太空冷阱（标注深空温度 $3\\text{ K}$，深邃星空底色）； - 中层：地球大气层与吸收谱带图示（清晰用虚线高亮标注 8-13 $\\mu\\text{m}$ 的透明大气窗口，并标注两侧水汽与 $\\text{CO}_2$ 的不透明阻挡带）； - 底层：具有微纳微球/分级多孔结构的辐射制冷超材料薄膜截面与下方的被制冷基底。 - **分波段光子通量能量平衡矢量**： - 入射的黄色太阳光束（0.3-2.5 $\\mu\\text{m}$）在超材料多孔微球表面发生密集多次 Mie 散射后，绝大部分以粗粗的黄色箭头 $98\\%$ 完全反射回天空； - 细窄的青色大气逆向热辐射部分被阻隔； - 最关键：粗大醒目的红外高能洋红色光子流（8-13 $\\mu\\text{m}$）无衰减地直接射穿大气窗口直达宇宙冷阱。 - **能量收支与温度梯标**：右侧配有定",
    referenceSource: "- Raman, A. P., Anoma, M. A., Zhu, L., Rephaeli, E., and Fan, S. \"Passive radiative cooling below ambient air temperature under direct sunlight.\" *Nature*, 515, 540–544 (2014). DOI: `10.1038/nature13883`. - Zhai, Y., Ma, Y., David, S. N., Zhao, D., Lou, R., Tan, G., Yang, R., and Yin, X. \"Scalable-m",
  },
};

/**
 * FE-ENERGY-10: 直接提锂技术（DLE）钛酸/锰酸型离子筛微孔选择性配位与传质浓差极化边界层
 */
export const FE_ENERGY_10_PROMPT: PromptSpec = {
  id: "FE-ENERGY-10",
  label: "直接提锂技术（DLE）钛酸/锰酸型离子筛微孔选择性配位与传质浓差极化边界层 (Direct Lithium Extraction LIS Molecular Tunnel Selective Coordination & Boundary Layer)",
  template: "Generate an SVG technical visualization of Direct Lithium Extraction LIS Molecular Tunnel Selective Coordination & Boundary Layer as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 全球绿色能源转型的核心瓶颈是锂资源供应链。高镁锂比（$\\text{Mg/Li} > 20-60$）盐湖卤水是提锂最大难点。第四代直接提锂技术（Direct Lithium Extraction, DLE）利用无机离子筛（Lithium-Ion Sieve, LIS，如尖晶石型 $\\lambda\\text{-MnO}_2$ 或层状/尖晶石复合 $\\text{H}_2\\text{TiO}_3$）实现极致特异性选择分离。由于 $\\text{Mg}^{2+}$ 水合能高达 $1922\\text{ kJ/mol}$（约为 $\\text{Li}^+$ 的 3.7 倍），离子筛入口的立体位阻与脱水能垒将 $\\text{Mg}^{2+}$ 彻底拒之门外，而 $\\text{Li}^+$ 脱去水化壳后精准嵌入晶格氧原子构成的配位势阱中。 Physical & Mathematical Ground Truth: 1. **离子热力学脱水能与有效晶体离子半径**： - $\\text{Li}^+$：结晶离子半径 $r = 0.76\\text{ \\AA}$，第一水合能 $\\Delta G_{\\text{hyd}} \\approx -515\\text{ kJ/mol}$，脱水能垒低； - $\\text{Mg}^{2+}$：结晶离子半径 $r = 0.72\\text{ \\AA}$（极度接近锂！），但因二价高电荷密度，第一水合能高达 $\\Delta G_{\\text{hyd}} \\approx -1922\\text{ kJ/mol}$，六水合离子 $[\\text{Mg}(\\text{H}_2\\text{O})_6]^{2+}$ 水动力学外径达 $8.6\\text{ \\AA}$； - 离子筛通道瓶颈尺寸：$d_{\\text{pore}} \\approx 1.5-2.0\\text{ \\AA}$，形成强烈的立体尺寸+脱水协同位阻闸门。 2. **能斯特-普朗克多组分扩散与浓差极化边界层**： 在卤水/固体颗粒外表面存在传质停滞流体边界层（厚度 $\\delta_b \\sim 10-50\\text{ }\\mu\\text{m}$），锂通量受到扩散极化限制： $$J_{\\text{Li}} = -D_{\\text{eff}} \\frac{\\partial C_{\\text{Li}}}{\\partial x} - \\frac{z_{\\text{Li}} F D_{\\text{eff}}}{R T} C_{\\text{Li}} \\frac{\\partial \\phi}{\\partial x}$$ 膜表面界面分离因子 $\\beta_{\\text{Li/Mg}} = \\frac{(C_{\\text{Li}}/C_{\\text{Mg}})_{\\text{solid}}}{(C_{\\text{Li}}/C_{\\text{Mg}})_{\\text{brine}}} > 1000$。 Visual Inspection Criteria: - **三段式多尺度剖面结构**： - *左侧：宏观盐湖卤水主体相（Bulk Brine）*，呈现大量随机分布的绿色高水合六角八面体 $[\\text{Mg}(\\text{H}_2\\text{O})_6]^{2+}$、蓝色 $[\\text{Na}(\\text{H}_2\\text{O})_6]^+$ 与紫色水合锂离子； - *中部：流体停滞扩散边界层（Boundary Layer）*，显示随距离 $x$ 逼近固体界面，$\\text{Li}^+$ 浓度急剧下降、形成明显的浓差极化非线性斜坡曲线； - *右侧：固体离子筛表面微观晶体隧道（LIS Crystal Lattice）*。 - **筛分瓶颈与脱水配位微观机理**： - 大体积的水合镁离子试图挤入狭窄孔口时，因极其高昂的脱水能量惩罚（红色警告闪电/位阻排斥箭头）被无情弹回； - 紫色水合锂离子在孔口表面脱除外层四面体水分子（标明水分子脱附飞溅矢量），裸露的紫色小球（$0.76\\text{ \\AA}$）顺畅穿透 $1.8\\text{ \\AA}$ 瓶颈，落入由 6 个红色晶格氧原子八面体包围的低自由能势阱配位中心。 - **能量坐标势阱图**：底部并联绘出 $\\text{Li}^+$ 与 $\\text{Mg}^{2+}$ 穿越界面的自由能景观曲面 $\\Delta G(x)$，清晰标示 $\\Delta G_{\\text{barrier}}^{\\text{Mg}} \\gg \\Delta G_{\\text{barrier}}^{\\text{Li}}$ 的客观数值落差。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Xu, X., et al. \"Direct lithium extraction from low-grade brine using titanium-based lithium-ion sieves: Synthesis, mechanism, and industrial application.\" *Environmental Science & Technology*, 55(14",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "直接提锂技术（DLE）钛酸/锰酸型离子筛微孔选择性配位与传质浓差极化边界层",
    groundTruth: "1. **离子热力学脱水能与有效晶体离子半径**： - $\\text{Li}^+$：结晶离子半径 $r = 0.76\\text{ \\AA}$，第一水合能 $\\Delta G_{\\text{hyd}} \\approx -515\\text{ kJ/mol}$，脱水能垒低； - $\\text{Mg}^{2+}$：结晶离子半径 $r = 0.72\\text{ \\AA}$（极度接近锂！），但因二价高电荷密度，第一水合能高达 $\\Delta G_{\\text{hyd}} \\approx -1922\\text{ kJ/mol}$，六水合离子 $[\\text{Mg}(\\text{H}_2\\text{O})_6]^{2+}$ 水动力学外径达 $8.6\\text{ \\AA}$； - 离子筛通道瓶颈尺寸：$d_{\\text{pore}} \\approx 1.5-2.0\\text{ \\AA}$，形成强烈的立体尺寸",
    evaluationCriteria: "- **三段式多尺度剖面结构**： - *左侧：宏观盐湖卤水主体相（Bulk Brine）*，呈现大量随机分布的绿色高水合六角八面体 $[\\text{Mg}(\\text{H}_2\\text{O})_6]^{2+}$、蓝色 $[\\text{Na}(\\text{H}_2\\text{O})_6]^+$ 与紫色水合锂离子； - *中部：流体停滞扩散边界层（Boundary Layer）*，显示随距离 $x$ 逼近固体界面，$\\text{Li}^+$ 浓度急剧下降、形成明显的浓差极化非线性斜坡曲线； - *右侧：固体离子筛表面微观晶体隧道（LIS Crystal Lattice）*。 - **筛分瓶颈与脱水配位微观机理**： - 大体积的水合镁离子试图挤入狭窄孔口时，因极其高昂的脱水能量惩罚（红色警告闪电/位阻排斥箭头）被无情弹回； - 紫色水合锂离子在孔口表面脱除外层四面体水分子（标明水分子脱附飞",
    referenceSource: "- Xu, X., et al. \"Direct lithium extraction from low-grade brine using titanium-based lithium-ion sieves: Synthesis, mechanism, and industrial application.\" *Environmental Science & Technology*, 55(14), 9825–9834 (2021). DOI: `10.1021/acs.est.1c01529`. - Snydacker, D. H., et al. \"Computational disco",
  },
};

export const FE_ENERGY_PROMPTS: readonly PromptSpec[] = [
  FE_ENERGY_01_PROMPT,
  FE_ENERGY_02_PROMPT,
  FE_ENERGY_03_PROMPT,
  FE_ENERGY_04_PROMPT,
  FE_ENERGY_05_PROMPT,
  FE_ENERGY_06_PROMPT,
  FE_ENERGY_07_PROMPT,
  FE_ENERGY_08_PROMPT,
  FE_ENERGY_09_PROMPT,
  FE_ENERGY_10_PROMPT,
];


/**
 * FE-5: 零碳新型能源系统、极端储能与气候工程 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）
 */
export const FE_ENERGY_SUITE_PROMPT: PromptSpec = {
  id: "fe-energy-v1",
  label: "FE-5: 零碳新型能源与清洁核聚变（十题组）",
  template: "FE-5: 零碳新型能源系统、极端储能与气候工程 前沿工程十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",
  variables: [],
    candidates: [
    {
      id: FE_ENERGY_01_PROMPT.id,
      label: "高温超导紧凑型托卡马克 D-T 聚变堆芯截面与 $\\\\nabla B$ 漂移平衡",
      text: FE_ENERGY_01_PROMPT.template,
      standard: FE_ENERGY_01_PROMPT.standard,
    },
    {
      id: FE_ENERGY_02_PROMPT.id,
      label: "仿星器三维非平面扭曲超导线圈与 $\\\\iota=5/5$ 磁岛链偏滤器拓扑",
      text: FE_ENERGY_02_PROMPT.template,
      standard: FE_ENERGY_02_PROMPT.standard,
    },
    {
      id: FE_ENERGY_03_PROMPT.id,
      label: "惯性约束聚变金刚石微球内爆烧蚀与瑞利-泰勒不稳定性动力学",
      text: FE_ENERGY_03_PROMPT.template,
      standard: FE_ENERGY_03_PROMPT.standard,
    },
    {
      id: FE_ENERGY_04_PROMPT.id,
      label: "场反转构型等离子体碰撞压缩与法拉第感应直接电能转换回路",
      text: FE_ENERGY_04_PROMPT.template,
      standard: FE_ENERGY_04_PROMPT.standard,
    },
    {
      id: FE_ENERGY_05_PROMPT.id,
      label: "第四代钍基熔盐堆失电自熔冷冻塞相变重力排料安全回路",
      text: FE_ENERGY_05_PROMPT.template,
      standard: FE_ENERGY_05_PROMPT.standard,
    },
    {
      id: FE_ENERGY_06_PROMPT.id,
      label: "硫化物全固态锂金属电池微观固固界相（SEI）电化学应力演变与晶界枝晶穿透抑制准则",
      text: FE_ENERGY_06_PROMPT.template,
      standard: FE_ENERGY_06_PROMPT.standard,
    },
    {
      id: FE_ENERGY_07_PROMPT.id,
      label: "钠离子电池普鲁士白正极三维晶格膨胀与相变应变通道",
      text: FE_ENERGY_07_PROMPT.template,
      standard: FE_ENERGY_07_PROMPT.standard,
    },
    {
      id: FE_ENERGY_08_PROMPT.id,
      label: "兆瓦级质子交换膜（PEM）水电解槽双极板微孔多孔传输层气液逆向流动与两相压降",
      text: FE_ENERGY_08_PROMPT.template,
      standard: FE_ENERGY_08_PROMPT.standard,
    },
    {
      id: FE_ENERGY_09_PROMPT.id,
      label: "无源被动日间辐射制冷超材料在 8-13 微米大气透明窗口的高发射率与太阳光谱超高反射率光子拓扑",
      text: FE_ENERGY_09_PROMPT.template,
      standard: FE_ENERGY_09_PROMPT.standard,
    },
    {
      id: FE_ENERGY_10_PROMPT.id,
      label: "直接提锂技术（DLE）钛酸/锰酸型离子筛微孔选择性配位与传质浓差极化边界层",
      text: FE_ENERGY_10_PROMPT.template,
      standard: FE_ENERGY_10_PROMPT.standard,
    },
  ],
  source: null,
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "极端聚变等离子体磁约束、固态电化学界面相变与被动辐射制冷",
    groundTruth: "以托卡马克 HTS 强磁场梯度、仿星器准对称磁流面、惯性约束 ICF 内爆动力学与硫化物固态电池 SEI 枝晶抑制准则为基准，满足磁流体力学（MHD）与能量平衡方程。",
    evaluationCriteria: "1. 磁面自洽：磁力线闭合与磁岛拓扑无畸变；2. 界面传输：电化学浓度梯度与热通量阶梯符合物性定律；3. 语法规范：XML 严格合法，无交互 JS。",
    referenceSource: "https://www.nature.com/nenergy",
  },
};

export const FE_ENERGY_INDIVIDUAL_PROMPTS = FE_ENERGY_PROMPTS;

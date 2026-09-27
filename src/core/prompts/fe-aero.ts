/**
 * FE-AERO_PROMPTS 前沿评测题库。
 * 全量采用纯直观可视自闭合矢量 SVG（零外部 JS，无交互式事件，支持并排直接肉眼对比）。
 */

import type { PromptSpec } from "../prompt";

/**
 * FE-AERO-01: 重型运载火箭发射塔机械臂“筷子”高空悬停捕获动力学
 */
export const FE_AERO_01_PROMPT: PromptSpec = {
  id: "FE-AERO-01",
  label: "重型运载火箭发射塔机械臂“筷子”高空悬停捕获动力学 (SpaceX Starship Mechazilla Chopstick Catch Dynamics & Hydraulic Damping)",
  template: "Generate an SVG technical visualization of SpaceX Starship Mechazilla Chopstick Catch Dynamics & Hydraulic Damping using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 2024 年底 SpaceX Starship Flight 5（IFT-5）首次实现 71 米高、约 250 吨重的 Super Heavy 助推器直接由 145 米高的 Mechazilla 发射塔“筷子”机械臂在空中软悬停捕获。该技术彻底淘汰了传统着陆支腿，省去几十吨死重。捕获瞬间，助推器利用多台深节流 Raptor 发动机推力矢量（TVC）实现亚米级横移微调与垂直下落缓速（$<1.2\\text{ m/s}$），机械臂导轨上的捕获销（Catch Pins）接触液压缓冲系统，通过可变阻尼快速耗散剩余动能，且姿态控制系统与塔架机械刚度必须完全解耦。 Physical & Mathematical Ground Truth: 1. **捕获瞬态动力学方程**: $$M_{dry} \\ddot{z}(t) + C_d(t) \\dot{z}(t) + K_s z(t) = \\sum T_{Raptor} \\cos(\\theta_{TVC}) - M_{dry} g$$ 其中助推器净重 $M_{dry} = 2.50 \\times 10^5 \\text{ kg}$，重力加速度 $g = 9.806 \\text{ m/s}^2$。 2. **初始捕获切入条件**: - 接触前垂直下落速度 $v_{z0} = -1.15 \\text{ m/s}$，捕获接触点距地面高度 $h_{catch} = 78.5 \\text{ m}$； - Raptor 发动机 3 台点火悬停，单台推力 $T = 8.50 \\times 10^5 \\text{ N}$，TVC 万向节回正角 $\\theta_{TVC} = 2.8^\\circ \\to 0^\\circ$； - 液压导轨等效阻尼系数 $C_d = 8.20 \\times 10^5 \\text{ N}\\cdot\\text{s/m}$，主缓冲行程 $\\Delta z_{stroke} = 0.45 \\text{ m}$； - 接触碰撞至完全静止耗时 $t_{arrest} = 0.62 \\text{ s}$，最大过载不超 $1.65\\text{ g}$。 Visual Inspection Criteria: - **机器自动化比对 (VLM / DOM)**: - SVG 内部必须包含独立的 `<path>` 构图表示 Mechazilla 桁架塔身（高程刻度 0-140m）、双铰接机械臂（两臂中心距 9.0m）、助推器壳体（外径 9.0m）及专用捕获销（对称凸出 0.35m）； - 动画必须采用 `<animateTransform>` 驱动助推器垂直位移：在 $0 \\le t \\le 0.62\\text{ s}$ 内呈现清晰的欠阻尼/临界阻尼衰减指数曲线（位移从 $0$ 压缩至 $-0.45\\text{ m}$，绝无物理发散振荡）； - 矢量羽流 `<polygon>` 随 TVC 倾角变化，羽流膨胀角度与推力关闭帧精确同步。 - **肉眼视觉对比**: - 助推器下降到机械臂槽口的几何对中对齐过程平滑，捕获销切入导轨槽底，两侧液压阻尼活塞杆出现可见缩进； - 画面右侧或底部附带动力学状态曲线（下落速度 $v_z(t)$ 与阻尼吸收力 $F_{damp}(t)$），曲线顶点 $F_{max} \\approx 2.85 \\times 10^6\\text{ N}$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- AIAA 2024-2114: *Kinematics and Divert Guidance for Heavy Booster Tower-Catch Recovery*; - NASA-CR-2023-220412: *Vertical Landing Dynamics and Energy Dissipation for Reusable Launch Vehicles*; - Spa",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "重型运载火箭发射塔机械臂“筷子”高空悬停捕获动力学",
    groundTruth: "1. **捕获瞬态动力学方程**: $$M_{dry} \\ddot{z}(t) + C_d(t) \\dot{z}(t) + K_s z(t) = \\sum T_{Raptor} \\cos(\\theta_{TVC}) - M_{dry} g$$ 其中助推器净重 $M_{dry} = 2.50 \\times 10^5 \\text{ kg}$，重力加速度 $g = 9.806 \\text{ m/s}^2$。 2. **初始捕获切入条件**: - 接触前垂直下落速度 $v_{z0} = -1.15 \\text{ m/s}$，捕获接触点距地面高度 $h_{catch} = 78.5 \\text{ m}$； - Raptor 发动机 3 台点火悬停，单台推力 $T = 8.50 \\times 10^5 \\text{ N}$，TVC 万向节回正角 $\\theta_{TVC} = 2.8^\\circ \\t",
    evaluationCriteria: "- **机器自动化比对 (VLM / DOM)**: - SVG 内部必须包含独立的 `<path>` 构图表示 Mechazilla 桁架塔身（高程刻度 0-140m）、双铰接机械臂（两臂中心距 9.0m）、助推器壳体（外径 9.0m）及专用捕获销（对称凸出 0.35m）； - 动画必须采用 `<animateTransform>` 驱动助推器垂直位移：在 $0 \\le t \\le 0.62\\text{ s}$ 内呈现清晰的欠阻尼/临界阻尼衰减指数曲线（位移从 $0$ 压缩至 $-0.45\\text{ m}$，绝无物理发散振荡）； - 矢量羽流 `<polygon>` 随 TVC 倾角变化，羽流膨胀角度与推力关闭帧精确同步。 - **肉眼视觉对比**: - 助推器下降到机械臂槽口的几何对中对齐过程平滑，捕获销切入导轨槽底，两侧液压阻尼活塞杆出现可见缩进； - 画面右侧或底部附带动力学状态",
    referenceSource: "- AIAA 2024-2114: *Kinematics and Divert Guidance for Heavy Booster Tower-Catch Recovery*; - NASA-CR-2023-220412: *Vertical Landing Dynamics and Energy Dissipation for Reusable Launch Vehicles*; - SpaceX Starship IFT-5 Telemetry & Video Records (Oct 2024).",
  },
};

/**
 * FE-AERO-02: 旋转爆震火箭发动机（RDRE）环形燃烧室连续超音速爆震波动力学与激波反射结构
 */
export const FE_AERO_02_PROMPT: PromptSpec = {
  id: "FE-AERO-02",
  label: "旋转爆震火箭发动机（RDRE）环形燃烧室连续超音速爆震波动力学与激波反射结构 (RDRE Annular Combustor Continuous Supersonic Detonation Wave & Shock Reflection Topology)",
  template: "Generate an SVG technical visualization of RDRE Annular Combustor Continuous Supersonic Detonation Wave & Shock Reflection Topology as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 旋转爆震火箭发动机（Rotating Detonation Rocket Engine, RDRE）是下一代高超声速飞行与深空运载的革命性动力。利用连续沿环形燃烧室单向或双向传播的爆震波，实现接近恒容燃烧（ZND模型）的压力提升燃烧（PIC），相比传统等压燃烧可将理论比冲提升 10%-15%。NASA Marshall 与空军研究实验室（AFRL）已成功完成 3D 打印 GRCop-42 合金数吨级 RDRE 持续热试车。核心物理难点在于超音速爆震前沿与未燃预混气层的相互作用、尾随斜激波反射、滑移线剪切开尔文-亥姆霍兹不稳定性及膨胀波系的精细拓扑。 Physical & Mathematical Ground Truth: 1. **推进剂与理论 CJ 爆震参数** (液氧/气态甲烷，当量比 $\\Phi = 1.15$): - 理论 Chapman-Jouguet 爆震波速 $D_{CJ} = 2390 \\text{ m/s}$； - 实验观测波速（考虑未完全混合与壁面粘性损失，亏损率 25.5%）: $D_{exp} = 1780 \\text{ m/s}$； - 冯·诺依曼（von Neumann）尖峰压力 $P_{vN} = 8.45 \\text{ MPa}$；CJ 燃烧后状态压力 $P_{CJ} = 4.25 \\text{ MPa}$。 2. **环形流场展开几何与波系拓扑参数** (燃烧室周长 $L = 280\\text{ mm}$，轴向高度 $H = 90\\text{ mm}$): - 推进剂新鲜充填层高度（Refill Wedge Height）: $h_{fill} = 19.2 \\text{ mm}$，未燃气喷注流速 $u_{inj} = 185 \\text{ m/s}$； - 尾随斜激波（Trailing Oblique Shock）角: $\\beta = 34.6^\\circ$； - 接触面（Contact Surface / Slip Line）倾角: $\\theta_{slip} = 28.2^\\circ$； - 普朗特-迈耶膨胀波束（Prandtl-Meyer Expansion Fan）发散角: $\\Delta \\theta_{fan} = 16.5^\\circ$。 Visual Inspection Criteria: - **机器自动化比对 (VLM / DOM)**: - SVG 包含 2D 展开坐标系 ($x \\in [0, 280]\\text{ mm}, y \\in [0, 90]\\text{ mm}$)，主爆震波前沿必须为垂直/微前倾强间断面； - 必须有区分明确的三大物理区域：未燃充填新鲜气区（斜向三角楔区）、高压爆震燃烧产物区、低压膨胀外排区； - 滑移线上必须带有连续的周期性开尔文-亥姆霍兹（K-H）涡卷矢量微结构 `<path class=\"kh-vortex\">`； - 壁面反压反射斜激波与中心塞式喷管边界的相交几何满足 Rankine-Hugoniot 激波极线约束。 - **肉眼视觉对比**: - 流场压力色谱（Pressure Isocontours）从深红（$P > 8\\text{ MPa}$）骤降至橙黄（$P_{CJ} \\approx 4\\text{ MPa}$），尾部外排膨胀降至青蓝色（$P < 0.8\\text{ MPa}$）； - 标注有清晰的特征物理量文本：$D_{exp} = 1780\\text{ m/s}$、$\\beta = 34.6^\\circ$、三重波相交点（Triple Point）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- AIAA Journal, Vol. 61, No. 4: *Flowfield Characteristics and Wave Dynamics in a Rotating Detonation Rocket Engine*; - Combustion and Flame (2023), DOI: 10.1016/j.combustflame.2023.112845; - NASA/TM-",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "旋转爆震火箭发动机（RDRE）环形燃烧室连续超音速爆震波动力学与激波反射结构",
    groundTruth: "1. **推进剂与理论 CJ 爆震参数** (液氧/气态甲烷，当量比 $\\Phi = 1.15$): - 理论 Chapman-Jouguet 爆震波速 $D_{CJ} = 2390 \\text{ m/s}$； - 实验观测波速（考虑未完全混合与壁面粘性损失，亏损率 25.5%）: $D_{exp} = 1780 \\text{ m/s}$； - 冯·诺依曼（von Neumann）尖峰压力 $P_{vN} = 8.45 \\text{ MPa}$；CJ 燃烧后状态压力 $P_{CJ} = 4.25 \\text{ MPa}$。 2. **环形流场展开几何与波系拓扑参数** (燃烧室周长 $L = 280\\text{ mm}$，轴向高度 $H = 90\\text{ mm}$): - 推进剂新鲜充填层高度（Refill Wedge Height）: $h_{fill} = 19.2 \\text{ ",
    evaluationCriteria: "- **机器自动化比对 (VLM / DOM)**: - SVG 包含 2D 展开坐标系 ($x \\in [0, 280]\\text{ mm}, y \\in [0, 90]\\text{ mm}$)，主爆震波前沿必须为垂直/微前倾强间断面； - 必须有区分明确的三大物理区域：未燃充填新鲜气区（斜向三角楔区）、高压爆震燃烧产物区、低压膨胀外排区； - 滑移线上必须带有连续的周期性开尔文-亥姆霍兹（K-H）涡卷矢量微结构 `<path class=\"kh-vortex\">`； - 壁面反压反射斜激波与中心塞式喷管边界的相交几何满足 Rankine-Hugoniot 激波极线约束。 - **肉眼视觉对比**: - 流场压力色谱（Pressure Isocontours）从深红（$P > 8\\text{ MPa}$）骤降至橙黄（$P_{CJ} \\approx 4\\text{ MPa}$），尾部外排膨",
    referenceSource: "- AIAA Journal, Vol. 61, No. 4: *Flowfield Characteristics and Wave Dynamics in a Rotating Detonation Rocket Engine*; - Combustion and Flame (2023), DOI: 10.1016/j.combustflame.2023.112845; - NASA/TM-20220014298: *Hot-Fire Testing of Additively Manufactured Liquid Oxygen/Methane Rotating Detonation ",
  },
};

/**
 * FE-AERO-03: 深空返回跳跃式双脉冲大气层再入升阻比调节与走廊边界
 */
export const FE_AERO_03_PROMPT: PromptSpec = {
  id: "FE-AERO-03",
  label: "深空返回跳跃式双脉冲大气层再入升阻比调节与走廊边界 (Deep Space Lunar/Mars Return Skip Reentry Trajectory & Corridor Aerodynamic Modulation)",
  template: "Generate an SVG technical visualization of Deep Space Lunar/Mars Return Skip Reentry Trajectory & Corridor Aerodynamic Modulation using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 月球采样返回（如我国嫦娥五号/六号）以及载人登月中美新一代飞船（新一代载人飞船试飞船、Artemis Orion）从地月转移轨道返回地球时，速度高达第二宇宙速度（$10.9-11.2\\text{ km/s}$）。若采用单次直接弹道再入，最大气动过载将超过 $16\\text{ g}$ 且热流峰值超出防热极限。因此必须采用“跳跃式再入”（Skip Reentry）：飞船初次钻入大气层（约 60km 近地点）减速至第一宇宙速度（约 $7.6\\text{ km/s}$），随后利用升力跳出大气层飞入开普勒椭圆弹道，降温并滑行数千公里后进行二次再入并着陆。 Physical & Mathematical Ground Truth: 1. **再入运动方程** (平面地球气动运动方程): $$\\frac{dv}{dt} = -\\frac{D}{m} - g \\sin\\gamma, \\quad v \\frac{d\\gamma}{dt} = \\frac{L \\cos\\sigma}{m} - \\left(g - \\frac{v^2}{R_E + h}\\right) \\cos\\gamma, \\quad \\frac{dh}{dt} = v \\sin\\gamma$$ 其中升阻比 $L/D = 0.36$，飞船气动阻力面积质量比 $m/(C_D A) = 850 \\text{ kg/m}^2$。 2. **关键轨道与再入走廊参数**: - 再入大气界面（Entry Interface）: $h_{EI} = 120.0 \\text{ km}$，初速 $v_0 = 10.95 \\text{ km/s}$； - 理论安全再入走廊角: $\\gamma_{EI} \\in [-5.20^\\circ, -6.50^\\circ]$；名义基准进入角 $\\gamma_0 = -5.85^\\circ$（若 $\\gamma > -5.2^\\circ$ 发生逃逸跳出无法着陆；若 $\\gamma < -6.5^\\circ$ 过载超 $12\\text{ g}$ 烧毁）； - 第一跳谷底近地点: $h_{p1} = 61.2 \\text{ km}$，此时最大减速过载 $n_{max1} = 4.8 \\text{ g}$，热流峰值 $\\dot{q}_{max} = 4.85 \\text{ MW/m}^2$； - 倾侧角反转调节: 在 $h = 65\\text{ km}$ 处由 $\\sigma = 45^\\circ$ 翻转至 $135^\\circ$ 抑制跳起过高； - 跳出大气层远地点: $h_{apo2} = 118.5 \\text{ km}$，速度降为 $v_{apo} = 7.58 \\text{ km/s}$（开普勒无动力滑行 $2800\\text{ km}$）； - 第二次再入主着陆: $h_2 = 120 \\to 0\\text{ km}$，开伞高度 $10.5\\text{ km}$。 Visual Inspection Criteria: - **机器自动化比对 (VLM / DOM)**: - SVG 坐标系绘制地表大圆弧（$R_E = 6371\\text{ km}$，按比例缩放）、卡门线（$100\\text{ km}$ 虚线）、再入界面（$120\\text{ km}$ 点划线）； - 再入走廊以半透明带状区域 `<polygon class=\"reentry-corridor\">` 标出上限（浅界限）与下限（陡界限）； - 动画 `<animateMotion>` 驱动飞船模型沿着“双波谷”样条路径移动，历时包含：初次俯冲 $\\to$ 谷底提拉升阻角反转 $\\to$ 跳出大气层最高点 $\\to$ 二次平缓滑降； - 飞船附带动态气动力矢量 `<line id=\"lift-vector\">`，其空间法向夹角随倾侧角 $\\sigma(t)$ 的翻转精确同步改变指向。 - **肉眼视觉对比**: - 轨迹在 60km 高度处清晰呈现弧形回弹，弹道颜色随热流强度从浅蓝（冷）到鲜红（第一跳峰值热流）再恢复冷色，二次再入呈现橙色中等热流； - 侧边附带 $h-v$（高度-速度）相平面图，直观展现再入走廊边界。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Journal of Guidance, Control, and Dynamics, Vol. 44, No. 6: *Adaptive Skip Entry Guidance for Lunar Return Missions*; - Acta Astronautica, Vol. 177: *Trajectory Analysis and Aerodynamic Modulation f",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "深空返回跳跃式双脉冲大气层再入升阻比调节与走廊边界",
    groundTruth: "1. **再入运动方程** (平面地球气动运动方程): $$\\frac{dv}{dt} = -\\frac{D}{m} - g \\sin\\gamma, \\quad v \\frac{d\\gamma}{dt} = \\frac{L \\cos\\sigma}{m} - \\left(g - \\frac{v^2}{R_E + h}\\right) \\cos\\gamma, \\quad \\frac{dh}{dt} = v \\sin\\gamma$$ 其中升阻比 $L/D = 0.36$，飞船气动阻力面积质量比 $m/(C_D A) = 850 \\text{ kg/m}^2$。 2. **关键轨道与再入走廊参数**: - 再入大气界面（Entry Interface）: $h_{EI} = 120.0 \\text{ km}$，初速 $v_0 = 10.95 \\text{ km/s}$； - 理论安全再入走廊角: $",
    evaluationCriteria: "- **机器自动化比对 (VLM / DOM)**: - SVG 坐标系绘制地表大圆弧（$R_E = 6371\\text{ km}$，按比例缩放）、卡门线（$100\\text{ km}$ 虚线）、再入界面（$120\\text{ km}$ 点划线）； - 再入走廊以半透明带状区域 `<polygon class=\"reentry-corridor\">` 标出上限（浅界限）与下限（陡界限）； - 动画 `<animateMotion>` 驱动飞船模型沿着“双波谷”样条路径移动，历时包含：初次俯冲 $\\to$ 谷底提拉升阻角反转 $\\to$ 跳出大气层最高点 $\\to$ 二次平缓滑降； - 飞船附带动态气动力矢量 `<line id=\"lift-vector\">`，其空间法向夹角随倾侧角 $\\sigma(t)$ 的翻转精确同步改变指向。 - **肉眼视觉对比**: - 轨迹在 60km 高度处清",
    referenceSource: "- Journal of Guidance, Control, and Dynamics, Vol. 44, No. 6: *Adaptive Skip Entry Guidance for Lunar Return Missions*; - Acta Astronautica, Vol. 177: *Trajectory Analysis and Aerodynamic Modulation for Chang'e-5 Lunar Return*; - NASA SP-8009: *Space Vehicle Design Criteria - Entry Trajectories*.",
  },
};

/**
 * FE-AERO-04: 高超声速飞行器超燃冲压发动机隔离段内激波串/马赫杆与边界层分离
 */
export const FE_AERO_04_PROMPT: PromptSpec = {
  id: "FE-AERO-04",
  label: "高超声速飞行器超燃冲压发动机隔离段内激波串/马赫杆与边界层分离 (Hypersonic Scramjet Isolator Shock Train, Mach Stem & SWBLI Flow Separation)",
  template: "Generate an SVG technical visualization of Hypersonic Scramjet Isolator Shock Train, Mach Stem & SWBLI Flow Separation as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 在高超声速吸气式冲压发动机（Mach 5-8）中，隔离段（Isolator）是连接超音速进气道与超燃燃烧室的核心关键部件。其核心使命是利用激波串（Shock Train）承受并缓冲燃烧室高压放热所带来的逆压梯度，防止高压前传导致进气道突发“不启动”（Unstart）。当燃烧室反压达到临界值时，隔离段内部交替反射的斜激波将在中心汇聚成正激波结构——马赫杆（Mach Stem），并在上下壁面诱发严重的激波-边界层干扰（SWBLI）和低频自激振荡分离泡，直接决定了发动机的推力裕度与飞行包线安全。 Physical & Mathematical Ground Truth: 1. **隔离段入口超声速来流参数**: - 来流马赫数 $M_1 = 2.50$，静压 $P_1 = 45.0 \\text{ kPa}$，静温 $T_1 = 280 \\text{ K}$； - 隔离段横截面高度 $H = 50.0 \\text{ mm}$，长高比 $L/H = 10.0$（总长 $500\\text{ mm}$）； - 燃烧室反压比 $P_b / P_1 = 4.85$。 2. **激波串与分叉马赫杆几何流场特征**: - 首道斜激波激波角 $\\beta_1 = 32.4^\\circ$，气流折角 $\\theta_1 = 7.8^\\circ$； - 马赫杆（Mach Stem）中心高度: $h_{stem} = 16.5 \\text{ mm}$（占风道高度 $33\\%$）； - 三相点（Triple Point）坐标: $(x_{tp}, y_{tp}) = (128.5\\text{ mm}, 33.5\\text{ mm})$； - 壁面分离泡（Separation Bubble）轴向跨度: $L_{sep} = 68.0 \\text{ mm}$，起始分离点位于 $x_{sep} = 102.0 \\text{ mm}$； - 隔离段出口平均马赫数（经激波串减速压缩后）: $M_2 = 1.35$，出口平均静压 $P_2 = 212.0 \\text{ kPa}$； - 临界不启动极限（Kantrowitz Limit 裕度）: 当前反压距激波串吐出进气道喉道剩余安全裕度 $\\Delta x_{margin} = 42.0 \\text{ mm}$。 Visual Inspection Criteria: - **机器自动化比对 (VLM / DOM)**: - SVG 包含平直隔离段上下壁面矩形轮廓，严格标注 $x=0$（入口）至 $x=500\\text{ mm}$ 刻度； - 必须精确展现由斜激波相交形成的中心垂直正激波马赫杆，两端连接三相点并向后延伸出滑移线（Slip Line / Shear Layer）； - 上下壁面内侧包含封闭的分离流流动矢量弧线（回流逆向矢量箭标），展现分离泡几何轮廓； - 图形下半部分必须联动绘制沿程壁面静压分布曲线 $P_w(x)/P_1$，曲线在分离点处出现初始起跳陡升，在再附点后形成平台阶跃。 - **肉眼视觉对比**: - 马赫数彩色填色云图（Contour）：从入口亮红（$M=2.5$）经过斜激波变为黄色（$M \\approx 1.8$），在马赫杆后方瞬间断裂变为深蓝色亚音速区（$M=0.72$），随后恢复绿色低超音速（$M=1.35$）； - 激波线清晰锐利，无模糊伪影，三相点分叉结构几何交角准确。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Progress in Aerospace Sciences, Vol. 106: *Shock Wave/Boundary Layer Interactions in Hypersonic Inlets*; - AIAA Journal, Vol. 58, No. 2: *Experimental and Numerical Investigation of Shock Trains in ",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "高超声速飞行器超燃冲压发动机隔离段内激波串/马赫杆与边界层分离",
    groundTruth: "1. **隔离段入口超声速来流参数**: - 来流马赫数 $M_1 = 2.50$，静压 $P_1 = 45.0 \\text{ kPa}$，静温 $T_1 = 280 \\text{ K}$； - 隔离段横截面高度 $H = 50.0 \\text{ mm}$，长高比 $L/H = 10.0$（总长 $500\\text{ mm}$）； - 燃烧室反压比 $P_b / P_1 = 4.85$。 2. **激波串与分叉马赫杆几何流场特征**: - 首道斜激波激波角 $\\beta_1 = 32.4^\\circ$，气流折角 $\\theta_1 = 7.8^\\circ$； - 马赫杆（Mach Stem）中心高度: $h_{stem} = 16.5 \\text{ mm}$（占风道高度 $33\\%$）； - 三相点（Triple Point）坐标: $(x_{tp}, y_{tp}) = (128.5\\t",
    evaluationCriteria: "- **机器自动化比对 (VLM / DOM)**: - SVG 包含平直隔离段上下壁面矩形轮廓，严格标注 $x=0$（入口）至 $x=500\\text{ mm}$ 刻度； - 必须精确展现由斜激波相交形成的中心垂直正激波马赫杆，两端连接三相点并向后延伸出滑移线（Slip Line / Shear Layer）； - 上下壁面内侧包含封闭的分离流流动矢量弧线（回流逆向矢量箭标），展现分离泡几何轮廓； - 图形下半部分必须联动绘制沿程壁面静压分布曲线 $P_w(x)/P_1$，曲线在分离点处出现初始起跳陡升，在再附点后形成平台阶跃。 - **肉眼视觉对比**: - 马赫数彩色填色云图（Contour）：从入口亮红（$M=2.5$）经过斜激波变为黄色（$M \\approx 1.8$），在马赫杆后方瞬间断裂变为深蓝色亚音速区（$M=0.72$），随后恢复绿色低超音速（$M=1.35$）； - 激",
    referenceSource: "- Progress in Aerospace Sciences, Vol. 106: *Shock Wave/Boundary Layer Interactions in Hypersonic Inlets*; - AIAA Journal, Vol. 58, No. 2: *Experimental and Numerical Investigation of Shock Trains in a Diverging Isolator*; - NASA/CR-2018-220084: *Unstart Dynamics and Shock Train Motion in Dual-Mode ",
  },
};

/**
 * FE-AERO-05: 超高温陶瓷（ZrB2-SiC）高超声速驻点烧蚀与多层热传导梯级
 */
export const FE_AERO_05_PROMPT: PromptSpec = {
  id: "FE-AERO-05",
  label: "超高温陶瓷（ZrB2-SiC）高超声速驻点烧蚀与多层热传导梯级 (UHTC ZrB2-SiC Hypersonic Stagnation Point Ablation & Multi-Tier Thermal Gradient)",
  template: "Generate an SVG technical visualization of UHTC ZrB2-SiC Hypersonic Stagnation Point Ablation & Multi-Tier Thermal Gradient as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 在 Mach 8-10 高超声速滑翔飞行器（HGV）与乘波体尖锐前缘设计中，为追求极致的升阻比，翼前缘与机头驻点半径通常设计得极其尖锐（$R_N < 20\\text{ mm}$）。但尖锐前缘会导致驻点气动热通量急剧攀升至数兆瓦甚至数十兆瓦每平方米。超高温陶瓷（UHTC，典型配比 $ZrB_2-20\\text{vol}\\%SiC$）通过原位自生成液态硼硅酸盐玻璃相（$SiO_2-B_2O_3$）形成致密自愈合氧化防护层，将氧扩散阻隔在外部。然而在极高温度（$>2000^\\circ\\text{C}$）与低氧分压下，材料将发生由“被动氧化”（自保护）向“主动氧化”（剧烈气化挥发剥蚀）的不可逆转变。 Physical & Mathematical Ground Truth: 1. **Fay-Riddell 离解气动热平衡方程计算驻点热流**: $$\\dot{q}_{w} = 0.763 \\text{ Pr}^{-0.6} (\\rho_e \\mu_e)^{0.4} (\\rho_w \\mu_w)^{0.1} \\sqrt{\\left(\\frac{du_e}{dx}\\right)_s} (h_{0e} - h_w) \\left[ 1 + (Le^{0.52} - 1)\\frac{h_D}{h_{0e}} \\right]$$ 在 Mach 8.0、飞行高度 $h = 32\\text{ km}$、前缘半径 $R_N = 15.0 \\text{ mm}$ 下： - 驻点热流理论值: $\\dot{q}_w = 6.45 \\text{ MW/m}^2$； - 辐射平衡稳态表面温度: $T_{surf} = 2280 \\text{ K} \\ (2007^\\circ\\text{C})$（取发射率 $\\varepsilon = 0.85$）。 2. **微观多层氧化反应烧蚀梯级拓扑** (从外表面向内深度的四层微结构): - **第一层 (Outer Scale, 厚度 $\\delta_1 = 35 \\ \\mu\\text{m}$)**: 多孔二氧化锆（$t\\text{-}ZrO_2$ 柱状骨架）填充液态 $SiO_2\\text{-}B_2O_3$ 玻璃相封孔层； - **第二层 (SiC-Depleted Layer, 厚度 $\\delta_2 = 80 \\ \\mu\\text{m}$)**: 贫 SiC 多孔 $ZrB_2$ 反应过渡骨架，伴随气态 $B_2O_3(g)$ 与 $SiO(g)$ 微细气孔逸出； - **第三层 (Virgin UHTC Bulk, 厚度 $\\delta_3 = 8.0 \\text{ mm}$)**: 未氧化的致密 $ZrB_2\\text{-}SiC$ 基体（导热系数 $k = 55.0 \\text{ W/(m}\\cdot\\text{K)}$）； - **第四层 (Insulative C/C Substrate, 厚度 $\\delta_4 = 15.0 \\text{ mm}$)**: 隔热碳/碳复合材料垫层（$k_{ins} = 1.25 \\text{ W/(m}\\cdot\\text{K)}$）； - 梯级稳态导热温度剖面: 表面 $2280\\text{ K} \\to$ 第二层交界面 $1920\\text{ K} \\to$ 基体背面 $1150\\text{ K} \\to$ 冷壁内衬结构温 $420\\text{ K}$。 Visual Inspection Criteria: - **机器自动化比对 (VLM / DOM)**: - SVG 展示飞行器前缘剖面圆弧及微观深度放大展开图； - 展开图中必须精确分层定义四层物理结构，且每一层具备专有矢量图案纹理（例如第一层为玻璃相浸润的柱状晶图样，第二层为包含气孔泡的多孔网状，第三层为致密颗粒晶粒）； - 叠加热传导等温线（Isotherms: $2000\\text{ K}, 1500\\text{ K}, 1000\\text{ K}, 500\\text{ K}$），等温线在金属陶瓷基体与隔热垫层交界面出现明显的温度斜率转折点（由傅里叶热传导通量连续性 $k_1 \\frac{dT}{dz}|_1 = k_2 \\frac{dT}{dz}|_2$ 驱动）。 - **肉眼视觉对比**: - 色温梯度从表层的灼热亮白/柠檬黄迅速过渡到深红、橙色、基体背部的灰黑冷态； - 图像配有清晰的物理标注，包含相界转变线（Passive $\\leftrightarrow$ Active Oxidation Boundary, 标注氧分压分界 $P_{O2} = 125\\text{ Pa}$）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Journal of the American Ceramic Society, Vol. 104, No. 8: *Oxidation Kinetics and Microstructure Evolution of ZrB2-SiC in Hypersonic Stagnation Environments*; - Carbon, Vol. 172: *Thermal Response a",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "超高温陶瓷（ZrB2-SiC）高超声速驻点烧蚀与多层热传导梯级",
    groundTruth: "1. **Fay-Riddell 离解气动热平衡方程计算驻点热流**: $$\\dot{q}_{w} = 0.763 \\text{ Pr}^{-0.6} (\\rho_e \\mu_e)^{0.4} (\\rho_w \\mu_w)^{0.1} \\sqrt{\\left(\\frac{du_e}{dx}\\right)_s} (h_{0e} - h_w) \\left[ 1 + (Le^{0.52} - 1)\\frac{h_D}{h_{0e}} \\right]$$ 在 Mach 8.0、飞行高度 $h = 32\\text{ km}$、前缘半径 $R_N = 15.0 \\text{ mm}$ 下： - 驻点热流理论值: $\\dot{q}_w = 6.45 \\text{ MW/m}^2$； - 辐射平衡稳态表面温度: $T_{surf} = 2280 \\text{ K} \\ (2007^\\circ\\text{C",
    evaluationCriteria: "- **机器自动化比对 (VLM / DOM)**: - SVG 展示飞行器前缘剖面圆弧及微观深度放大展开图； - 展开图中必须精确分层定义四层物理结构，且每一层具备专有矢量图案纹理（例如第一层为玻璃相浸润的柱状晶图样，第二层为包含气孔泡的多孔网状，第三层为致密颗粒晶粒）； - 叠加热传导等温线（Isotherms: $2000\\text{ K}, 1500\\text{ K}, 1000\\text{ K}, 500\\text{ K}$），等温线在金属陶瓷基体与隔热垫层交界面出现明显的温度斜率转折点（由傅里叶热传导通量连续性 $k_1 \\frac{dT}{dz}|_1 = k_2 \\frac{dT}{dz}|_2$ 驱动）。 - **肉眼视觉对比**: - 色温梯度从表层的灼热亮白/柠檬黄迅速过渡到深红、橙色、基体背部的灰黑冷态； - 图像配有清晰的物理标注，包含相界转变线（Passive ",
    referenceSource: "- Journal of the American Ceramic Society, Vol. 104, No. 8: *Oxidation Kinetics and Microstructure Evolution of ZrB2-SiC in Hypersonic Stagnation Environments*; - Carbon, Vol. 172: *Thermal Response and Recession Mechanisms of UHTC Leading Edges*; - NASA/TM-20210023412: *Ablation Modeling and Arc-Je",
  },
};

/**
 * FE-AERO-06: 深空超薄大面积太阳光子帆辐射压动量交换与帆面褶皱扭矩解耦
 */
export const FE_AERO_06_PROMPT: PromptSpec = {
  id: "FE-AERO-06",
  label: "深空超薄大面积太阳光子帆辐射压动量交换与帆面褶皱扭矩解耦 (Deep Space Solar Photon Sail Radiation Pressure Momentum Exchange & Billow Curvature Decoupling)",
  template: "Generate an SVG technical visualization of Deep Space Solar Photon Sail Radiation Pressure Momentum Exchange & Billow Curvature Decoupling using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 深空光子帆（Solar Photon Sail，如 NASA 2024 年部署的 ACS3 任务、日本 IKAROS 及未来日边探测计划）无需消耗任何化学燃料，纯粹利用太阳光子与超薄铝化聚酰亚胺薄膜发生动量交换产生推力。但在真实空间极端温差与空间辐射压下，数十至数百平米、微米级厚度的薄膜不可能维持理想平面，会发生鼓胀弯曲（Billow Curvature）与局部起皱（Wrinkling）。这种非平整性导致实际推力矢量偏离理想法向，更致命的是会导致气动压心（Center of Pressure, CP）与全星质心（Center of Mass, CM）产生动态偏置，产生持续寄生干扰力矩，导致反作用飞轮快速饱和失控。 Physical & Mathematical Ground Truth: 1. **非理想光学反射面光压推力综合方程**: $$\\vec{F}_{SRP} = P_0 \\left(\\frac{R_0}{R}\\right)^2 A \\cos\\theta \\left[ (1 - \\rho_s) \\hat{u}_i + 2 \\left(\\rho_s \\cos\\theta + \\frac{1}{3}\\rho_d\\right) \\hat{n}_{eff} + \\varepsilon_f B_f \\hat{n}_{eff} \\right]$$ 在日地距 1 AU 处光压常数 $P_0 = 4.56 \\times 10^{-6} \\text{ N/m}^2$； - 帆面面积 $A = 80.0 \\text{ m}^2$（四象限正方形，边长 $8.94\\text{ m}$）； - 镜面反射率 $\\rho_s = 0.88$，漫反射率 $\\rho_d = 0.05$，吸收发射率常数项匹配铝化表面。 2. **薄膜起伏鼓胀曲率与偏置扰动力矩参数**: - 鼓胀最大几何中心挠度: $w_{max} = 0.38 \\text{ m}$，薄膜曲率变形方程 $w(r) = w_{max}(1 - (r/R_{quad})^2)$； - 有效法向推力损失因子: $\\eta_{billow} = \\cos^2(\\alpha_{avg}) = 0.932$； - 压心质心静态偏置矢量: $\\Delta \\vec{r}_{CP-CM} = [0.065, -0.042, 0.015]\\text{ m}$； - 太阳光入射角 $\\theta = 35.0^\\circ$ 下，全帆光压合力大小: $|\\vec{F}_{SRP}| = 5.24 \\times 10^{-4} \\text{ N}$； - 稳态寄生干扰力矩: $\\vec{\\tau}_{dist} = \\vec{F}_{SRP} \\times \\Delta \\vec{r} \\Rightarrow |\\vec{\\tau}| = 4.05 \\times 10^{-5} \\text{ N}\\cdot\\text{m}$； - 三轴反作用飞轮转速积累率与配平控制质量块（Active Mass Translator, AMT）位移补偿量 $\\Delta x_{AMT} = 18.2 \\text{ mm}$。 Visual Inspection Criteria: - **机器自动化比对 (VLM / DOM)**: - SVG 展现 3D 轴测投影的大面积正方形光帆结构，由 4 根主碳纤维复合材料桁梁分割为四个象限； - 薄膜表面绘制代表鼓包褶皱的等高变形线网格 `<path class=\"billow-contour\">`； - 动画驱动太阳光子流动虚线箭头持续射向帆面并发生镜面与漫反射折射； - 动态标示出质心 CM 点（星号标记）与压心 CP 点（圆圈标记），两者之间的红色连线显示力臂，实时显示扰动力矩旋向箭头； - 飞轮动量饱和状态条以 `<rect>` 宽度百分比动态展示从 0% 向 85% 的充填过程，随后 AMT 质量块滑动，力矩清零，飞轮平稳解耦。 - **肉眼视觉对比**: - 光帆在阳光照射下的微曲面金属光泽反光层次分明； - 力的分解矢量直观：入射向量 $\\vec{S}$、有效推力向量 $\\vec{F}_{tot}$、力矩旋向 $\\vec{\\tau}$ 均带标准航空航天符号标注。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- AIAA Journal of Spacecraft and Rockets, Vol. 59, No. 3: *Solar Radiation Pressure Force and Torque Modeling for Billowed Membranes*; - IEEE Aerospace Conference (2024): *NASA’s Advanced Composite So",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "深空超薄大面积太阳光子帆辐射压动量交换与帆面褶皱扭矩解耦",
    groundTruth: "1. **非理想光学反射面光压推力综合方程**: $$\\vec{F}_{SRP} = P_0 \\left(\\frac{R_0}{R}\\right)^2 A \\cos\\theta \\left[ (1 - \\rho_s) \\hat{u}_i + 2 \\left(\\rho_s \\cos\\theta + \\frac{1}{3}\\rho_d\\right) \\hat{n}_{eff} + \\varepsilon_f B_f \\hat{n}_{eff} \\right]$$ 在日地距 1 AU 处光压常数 $P_0 = 4.56 \\times 10^{-6} \\text{ N/m}^2$； - 帆面面积 $A = 80.0 \\text{ m}^2$（四象限正方形，边长 $8.94\\text{ m}$）； - 镜面反射率 $\\rho_s = 0.88$，漫反射率 $\\rho_d = 0.05$，吸收发射率常",
    evaluationCriteria: "- **机器自动化比对 (VLM / DOM)**: - SVG 展现 3D 轴测投影的大面积正方形光帆结构，由 4 根主碳纤维复合材料桁梁分割为四个象限； - 薄膜表面绘制代表鼓包褶皱的等高变形线网格 `<path class=\"billow-contour\">`； - 动画驱动太阳光子流动虚线箭头持续射向帆面并发生镜面与漫反射折射； - 动态标示出质心 CM 点（星号标记）与压心 CP 点（圆圈标记），两者之间的红色连线显示力臂，实时显示扰动力矩旋向箭头； - 飞轮动量饱和状态条以 `<rect>` 宽度百分比动态展示从 0% 向 85% 的充填过程，随后 AMT 质量块滑动，力矩清零，飞轮平稳解耦。 - **肉眼视觉对比**: - 光帆在阳光照射下的微曲面金属光泽反光层次分明； - 力的分解矢量直观：入射向量 $\\vec{S}$、有效推力向量 $\\vec{F}_{tot}$、力矩旋向",
    referenceSource: "- AIAA Journal of Spacecraft and Rockets, Vol. 59, No. 3: *Solar Radiation Pressure Force and Torque Modeling for Billowed Membranes*; - IEEE Aerospace Conference (2024): *NASA’s Advanced Composite Solar Sail System (ACS3): Flight Dynamics and Attitude Control*; - Advances in Space Research, Vol. 67",
  },
};

/**
 * FE-AERO-07: 兆瓦级外加磁场磁等离子体动态推力器（AF-MPDT）等离子体同轴加速与双极扩散羽流发散角
 */
export const FE_AERO_07_PROMPT: PromptSpec = {
  id: "FE-AERO-07",
  label: "兆瓦级外加磁场磁等离子体动态推力器（AF-MPDT）等离子体同轴加速与双极扩散羽流发散角 (MW-Class Applied-Field MPD Thruster Lorentz Acceleration & Ambipolar Expansion Plume)",
  template: "Generate an SVG technical visualization of MW-Class Applied-Field MPD Thruster Lorentz Acceleration & Ambipolar Expansion Plume as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 对于未来载人火星往返与大型深空货运飞船，兆瓦级（MW-class）大功率电推进是兼具高比冲（$>4000\\text{ s}$）与高推力（$>50\\text{ N}$）的核心路线。外加磁场磁等离子体动态推力器（Applied-Field MPDT）通过中心阴极与环形阳极之间数十千安培的强烈电弧电离工质（氩或锂），利用外加螺线管磁场与放电电流耦合产生的洛伦兹力实现宏观加速。核心电磁流体物理难点在于：放电电流产生的自感磁场与外加磁场耦合引起的等离子体旋转角动量向轴向动能转化（磁喷管扩张效应），以及出口处由电子-离子双极扩散（Ambipolar Diffusion）所决定的羽流发散损失。 Physical & Mathematical Ground Truth: 1. **三维洛伦兹加速力密度矢量分解**: $$\\vec{f}_L = \\vec{j} \\times \\vec{B} = \\underbrace{(j_\\theta B_z - j_z B_\\theta)\\hat{r}}_{\\text{径向电磁自捏力}} + \\underbrace{(j_z B_r - j_r B_z)\\hat{\\theta}}_{\\text{角向强旋转驱动力}} + \\underbrace{(j_r B_\\theta - j_\\theta B_r)\\hat{z}}_{\\text{轴向霍尔加速主推力}}$$ 2. **1.5 MW 级工况运行物理数值基准** (工作介质: 氩气 Argon): - 供电主放电电流 $J = 3500 \\text{ A}$，放电电压 $V_d = 430 \\text{ V}$（总输入电功率 $P_e = 1.505 \\text{ MW}$）； - 质量流量 $\\dot{m} = 0.82 \\text{ g/s}$； - 外加磁场线圈中心轴向磁感应强度 $B_z0 = 0.48 \\text{ T}$； - 理论出口平均离子喷流速度: $v_{ex} = 46.5 \\text{ km/s}$； - 等效真空比冲: $I_{sp} = 4740 \\text{ s}$；总轴向有效推力 $F = 38.13 \\text{ N}$； - 双极电场强度极限: $E_r = -\\frac{k_B T_e}{e n_e} \\frac{\\partial n_e}{\\partial r}$，其中电子温度 $T_e = 4.2 \\text{ eV}$，等离子体中心密度 $n_e = 2.5 \\times 10^{20} \\text{ m}^{-3}$； - 羽流质点半发散角: $\\theta_{div} = 21.8^\\circ$（导致轴向推力余弦效率损失因子 $\\eta_{div} = \\frac{1+\\cos\\theta_{div}}{2} = 0.964$）。 Visual Inspection Criteria: - **机器自动化比对 (VLM / DOM)**: - SVG 展现同轴对称推力器半剖面（包含中心钨棒阴极、环形水冷铜阳极、外绕螺线管线圈截面）； - 绘制空间发散的磁力线组（虚线带有磁通密度标签 $B$），构成发散磁喷管几何拓扑； - 叠加电荷流动矢量线 $\\vec{j}$（从阳极向阴极汇聚）与等离子体喷射速度矢量箭标网格 $\\vec{u}$； - 明确绘制由双极电场主导的羽流外边界半发散角锥线（明确标注 $\\theta_{div} = 21.8^\\circ$ 角度标弧）。 - **肉眼视觉对比**: - 等离子体密度与电势分布呈现双重伪彩色渲染：通道内部为高温高密度的白紫色核区，喷出后沿磁喷管迅速扩散为宝蓝与青绿色羽流； - 矢量场清晰，展示等离子体由于角向受力 $\\vec{j} \\times \\vec{B}$ 产生剧烈螺旋，随后在磁喷管扩张区解耦并加速沿轴向平动喷出的全过程。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Journal of Propulsion and Power, Vol. 39, No. 2: *Performance Scaling and Plume Characteristics of High-Power Applied-Field MPD Thrusters*; - Plasma Sources Science and Technology, Vol. 31: *Ambipol",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "兆瓦级外加磁场磁等离子体动态推力器（AF-MPDT）等离子体同轴加速与双极扩散羽流发散角",
    groundTruth: "1. **三维洛伦兹加速力密度矢量分解**: $$\\vec{f}_L = \\vec{j} \\times \\vec{B} = \\underbrace{(j_\\theta B_z - j_z B_\\theta)\\hat{r}}_{\\text{径向电磁自捏力}} + \\underbrace{(j_z B_r - j_r B_z)\\hat{\\theta}}_{\\text{角向强旋转驱动力}} + \\underbrace{(j_r B_\\theta - j_\\theta B_r)\\hat{z}}_{\\text{轴向霍尔加速主推力}}$$ 2. **1.5 MW 级工况运行物理数值基准** (工作介质: 氩气 Argon): - 供电主放电电流 $J = 3500 \\text{ A}$，放电电压 $V_d = 430 \\text{ V}$（总输入电功率 $P_e = 1.505 \\text{ MW}$",
    evaluationCriteria: "- **机器自动化比对 (VLM / DOM)**: - SVG 展现同轴对称推力器半剖面（包含中心钨棒阴极、环形水冷铜阳极、外绕螺线管线圈截面）； - 绘制空间发散的磁力线组（虚线带有磁通密度标签 $B$），构成发散磁喷管几何拓扑； - 叠加电荷流动矢量线 $\\vec{j}$（从阳极向阴极汇聚）与等离子体喷射速度矢量箭标网格 $\\vec{u}$； - 明确绘制由双极电场主导的羽流外边界半发散角锥线（明确标注 $\\theta_{div} = 21.8^\\circ$ 角度标弧）。 - **肉眼视觉对比**: - 等离子体密度与电势分布呈现双重伪彩色渲染：通道内部为高温高密度的白紫色核区，喷出后沿磁喷管迅速扩散为宝蓝与青绿色羽流； - 矢量场清晰，展示等离子体由于角向受力 $\\vec{j} \\times \\vec{B}$ 产生剧烈螺旋，随后在磁喷管扩张区解耦并加速沿轴向平动喷出的全过程。",
    referenceSource: "- Journal of Propulsion and Power, Vol. 39, No. 2: *Performance Scaling and Plume Characteristics of High-Power Applied-Field MPD Thrusters*; - Plasma Sources Science and Technology, Vol. 31: *Ambipolar Expansion and Ion Acceleration in Diverging Magnetic Nozzles*; - AIAA 2023-1488: *Multi-Megawatt ",
  },
};

/**
 * FE-AERO-08: 深地超万米（12,000米）超深井超高温高压钻柱正弦-螺旋屈曲相变与粘滑振动谐波
 */
export const FE_AERO_08_PROMPT: PromptSpec = {
  id: "FE-AERO-08",
  label: "深地超万米（12,000米）超深井超高温高压钻柱正弦-螺旋屈曲相变与粘滑振动谐波 (Ultra-Deep 12,000m HPHT Wellbore Drill String Sinusoidal-to-Helical Buckling & Stick-Slip Resonance)",
  template: "Generate an SVG technical visualization of Ultra-Deep 12,000m HPHT Wellbore Drill String Sinusoidal-to-Helical Buckling & Stick-Slip Resonance using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 向深地极端环境进军（如我国塔里木盆地“深地一号”跃进 3-3XC 井、科探 1 井突破 10,000-12,000 米）是能源勘探与地壳科学的前沿挑战。在井深 $>10,000\\text{ m}$、井底超高温（$>220^\\circ\\text{C}$）、超高压（$>140\\text{ MPa}$）环境下，万米细长钻柱（细长比达 $50000:1$）在重力、钻压（WOB）与井眼摩擦约束下，表现出极强的几何非线性。随着钻压增大，钻柱从无屈曲直棒首先转变为沿下井壁蜿蜒的“正弦屈曲”（Sinusoidal Buckling），进一步增大越过临界相变点直接“突弹跳”成全接触螺旋屈曲（Helical Buckling），导致锁死（Lock-up）。同时由于地层岩石剪切破坏阻力，钻柱底部发生毁灭性的高振幅“粘滑振动”（Stick-Slip），地面恒速旋转但钻头周期性滞死卡顿后剧烈超速飞旋。 Physical & Mathematical Ground Truth: 1. **Dawson-Paslay 与 Chen-Cheatham 屈曲临界载荷判据**: - 井深 $H_{well} = 12,000 \\text{ m}$，井眼倾角 $\\theta = 15.0^\\circ$（稳斜井段），井眼直径 $D_h = 215.9 \\text{ mm} \\ (8.5\\text{ in})$； - 钻杆规格: 5 英寸 S-135 钢钻杆（外径 $127\\text{ mm}$，抗弯刚度 $E I = 4.85 \\times 10^6 \\text{ N}\\cdot\\text{m}^2$），浮重线密度 $\\omega = 285.0 \\text{ N/m}$； - 径向间隙 $r = (D_h - D_p)/2 = 44.45 \\text{ mm}$； - **第一临界正弦屈曲载荷**: $$F_{sin} = 2 \\sqrt{\\frac{E I \\omega \\sin\\theta}{r}} = 2 \\sqrt{\\frac{4.85\\times 10^6 \\times 285 \\times \\sin(15^\\circ)}{0.04445}} = 179.8 \\text{ kN}$$ - **第二临界螺旋屈曲载荷**: $$F_{hel} = 2 \\sqrt{2} F_{sin} = 508.6 \\text{ kN}$$ - 井底实际加压 $WOB = 580.0 \\text{ kN} > F_{hel}$，下部 $1100\\text{ m}$ 钻柱完全进入螺旋屈曲状态。 2. **底部粘滑振动动力学极限环参数**: - 地表转盘/顶驱恒定输入转速: $\\Omega_{top} = 80.0 \\text{ rpm}$； - 钻柱一阶扭转固有谐振周期: $T_{tors} = 2 L / \\sqrt{G/\\rho} = 2 \\times 12000 / 3180 \\approx 7.55 \\text{ s}$（固有频率 $f_0 = 0.132 \\text{ Hz}$）； - 钻头卡阻期（Stick Phase）: 钻头角速度 $\\omega_{bit} = 0 \\text{ rpm}$，持续时间 $t_{stick} = 3.20 \\text{ s}$，扭矩线性蓄积攀升至最大静摩擦极限 $\\tau_{max} = 38.5 \\text{ kN}\\cdot\\text{m}$； - 钻头释放期（Slip Phase）: 弹性能骤然释放，钻头在 $0.8\\text{ s}$ 内超速飞旋至峰值转速 $\\omega_{bit,max} = 265.0 \\text{ rpm}$（达到地面转速的 $3.3$ 倍），诱发剧烈横向高频冲击。 Visual Inspection Criteria: - **机器自动化比对 (VLM / DOM)**: - SVG 包含整体井深尺度条（$0-12000\\text{ m}$）及底部 $200\\text{ m}$ BHA 局域高精度 3D 井眼剖面透视图； - 动画分为两个联动部分： 1. 左侧展现长柱状井壁内钻杆的螺旋贴壁立体曲线 `<path id=\"helical-coil\">`，随着轴向力加大，节距变短； 2. 右侧展示时间历程仪表盘：钻头转速表针动态卡死归零（Stick 阶段，指示灯红亮），随后猛烈回弹顺时针突破刻度上限（Slip 阶段，指示灯绿亮），与钻柱扭矩曲线 $\\tau(t)$ 呈严格的张弛振荡锯齿波闭环对应。 - **肉眼视觉对比**: - 螺旋屈曲的弹簧线圈形态逼真，与井壁接触点的挤压正应力以深红接触斑块点亮； - 转速与扭矩相平面图（Phase Portrait: $\\tau$ vs $\\omega_{bit}$）形成典型的极限环（Limit Cycle）动态描点轨迹。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- SPE Journal (Society of Petroleum Engineers), Vol. 28, No. 4: *Buckling Behavior and Contact Force Modeling of Drillstrings in Ultra-Deep HPHT Wells*; - Journal of Sound and Vibration, Vol. 488: *No",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "深地超万米（12,000米）超深井超高温高压钻柱正弦-螺旋屈曲相变与粘滑振动谐波",
    groundTruth: "1. **Dawson-Paslay 与 Chen-Cheatham 屈曲临界载荷判据**: - 井深 $H_{well} = 12,000 \\text{ m}$，井眼倾角 $\\theta = 15.0^\\circ$（稳斜井段），井眼直径 $D_h = 215.9 \\text{ mm} \\ (8.5\\text{ in})$； - 钻杆规格: 5 英寸 S-135 钢钻杆（外径 $127\\text{ mm}$，抗弯刚度 $E I = 4.85 \\times 10^6 \\text{ N}\\cdot\\text{m}^2$），浮重线密度 $\\omega = 285.0 \\text{ N/m}$； - 径向间隙 $r = (D_h - D_p)/2 = 44.45 \\text{ mm}$； - **第一临界正弦屈曲载荷**: $$F_{sin} = 2 \\sqrt{\\frac{E I \\omega ",
    evaluationCriteria: "- **机器自动化比对 (VLM / DOM)**: - SVG 包含整体井深尺度条（$0-12000\\text{ m}$）及底部 $200\\text{ m}$ BHA 局域高精度 3D 井眼剖面透视图； - 动画分为两个联动部分： 1. 左侧展现长柱状井壁内钻杆的螺旋贴壁立体曲线 `<path id=\"helical-coil\">`，随着轴向力加大，节距变短； 2. 右侧展示时间历程仪表盘：钻头转速表针动态卡死归零（Stick 阶段，指示灯红亮），随后猛烈回弹顺时针突破刻度上限（Slip 阶段，指示灯绿亮），与钻柱扭矩曲线 $\\tau(t)$ 呈严格的张弛振荡锯齿波闭环对应。 - **肉眼视觉对比**: - 螺旋屈曲的弹簧线圈形态逼真，与井壁接触点的挤压正应力以深红接触斑块点亮； - 转速与扭矩相平面图（Phase Portrait: $\\tau$ vs $\\omega_{bit}$）形",
    referenceSource: "- SPE Journal (Society of Petroleum Engineers), Vol. 28, No. 4: *Buckling Behavior and Contact Force Modeling of Drillstrings in Ultra-Deep HPHT Wells*; - Journal of Sound and Vibration, Vol. 488: *Nonlinear Stick-Slip and Torsional Resonance Modeling of 10,000m Ultra-Deep Drillstrings*; - ASME Jour",
  },
};

/**
 * FE-AERO-09: 全海深万米（11,000米）载人潜水器全钛合金球壳（Ti-6Al-4V ELI）非线性弹塑性屈曲与观察窗加厚拓扑
 */
export const FE_AERO_09_PROMPT: PromptSpec = {
  id: "FE-AERO-09",
  label: "全海深万米（11,000米）载人潜水器全钛合金球壳（Ti-6Al-4V ELI）非线性弹塑性屈曲与观察窗加厚拓扑 (Full-Ocean-Depth 11,000m Manned Submersible Ti-6Al-4V ELI Spherical Pressure Hull Buckling & Viewport Topology)",
  template: "Generate an SVG technical visualization of Full-Ocean-Depth 11,000m Manned Submersible Ti-6Al-4V ELI Spherical Pressure Hull Buckling & Viewport Topology as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 马里亚纳海沟挑战者深渊（最大深度达 10,909-11,000 米）是地球上最极端的超高静水压环境，海水外部静水压高达 110-115 MPa（相当于每平方米承受 1.1 万吨重物挤压）。万米级载人深潜器（如我国“奋斗者”号、美国 Limiting Factor）的核心生命保障舱为钛合金（Ti-6Al-4V ELI，超低间隙元素高韧性特种钛）整体铸锻冲压拼焊球壳。球形壳体承受全向三向等静压，设计核心是防止发生灾难性“弹性-塑性失稳内爆屈曲”。同时，载人球壳必须开设主驾驶观察窗、电气穿舱件及人员出入舱口，国际潜水器安全规范（ASME PVHO-1）严格禁止任何外部拼接贴板补强，必须在开孔周边采用整体流线型渐变增厚拓扑，消除边缘应力集中。 Physical & Mathematical Ground Truth: 1. **材料物性与经典 Zoelly 弹性/弹塑性临界失稳压力计算**: - 壳体材料: Ti-6Al-4V ELI（杨氏模量 $E = 114.0 \\text{ GPa}$，泊松比 $\\nu = 0.33$，屈服极限 $\\sigma_y = 825.0 \\text{ MPa}$）； - 球壳几何: 内半径 $R_i = 1050 \\text{ mm}$，公称均布壁厚 $t = 52.0 \\text{ mm}$（外径 $R_o = 1102 \\text{ mm}$）； - 设计服役水深静水外压: $P_{ext} = 115.0 \\text{ MPa}$（对应海水密度 $1035\\text{ kg/m}^3$）； - **完美球壳 Zoelly 弹性屈曲压力**: $$P_{cr,el} = \\frac{2 E}{\\sqrt{3(1-\\nu^2)}} \\left(\\frac{t}{R_{mid}}\\right)^2 = \\frac{2 \\times 114000}{\\sqrt{3(1-0.33^2)}} \\left(\\frac{52}{1076}\\right)^2 = 328.6 \\text{ MPa}$$ - 考虑实际真球度几何缺陷（Sphericity Imperfection, 制造公差 $\\delta_{imp} \\le 1.5\\text{ mm}$）与弹塑性屈服切线模量修正（Krenzke-Kiernan 弹塑性折减因子 $\\eta_p \\approx 0.43$）: $$P_{cr,real} = \\eta_p P_{cr,el} = 141.3 \\text{ MPa}$$ - 临界失效储备安全系数: $SF = P_{cr,real} / P_{ext} = 141.3 / 115.0 = 1.229$（符合全海深极限载人准则）。 2. **ASME PVHO-1 观察窗开口增厚补强几何拓扑**: - 观察窗透光孔径角: 半顶角 $\\alpha = 45.0^\\circ$（锥形截面窗口）； - 开孔边缘局部增厚凸缘（Integral Boss）峰值厚度: $t_{boss} = 88.0 \\text{ mm}$（相比基体加厚 $69.2\\%$）； - 双曲流线型平滑过渡圆角半径: $R_{fillet} = 125.0 \\text{ mm}$，过渡带跨度角 $\\beta = 18.0^\\circ$； - 115 MPa 静压下，增厚过渡根部最大 von Mises 等效应力: $\\sigma_{vM,max} = 712.0 \\text{ MPa} < \\sigma_y$（完全处于弹性安全裕度区间）。 Visual Inspection Criteria: - **机器自动化比对 (VLM / DOM)**: - SVG 精确绘制载人球壳截面（包括观察窗 PMMA 锥形有机玻璃装配体、锥座金属坡口与球壳母体）； - 具有有限元应力等高线云图填充（FEA Mesh & Contour），用色带严格对应 von Mises 应力值（从深蓝 $200\\text{ MPa}$ 到亮红 $750\\text{ MPa}$）； - 开孔区域外缘标注精确的局部增厚尺寸线（$t_{boss} = 88\\text{ mm}$，过渡圆角 $R = 125\\text{ mm}$）； - 外部海水静压施加层使用密集的同向径向聚合压力矢量箭头（标注 $P_{ext} = 115\\text{ MPa}$）。 - **肉眼视觉对比**: - 壳体受力均匀的膜应力区呈中度青绿色（$\\sigma \\approx 550-600\\text{ MPa}$）；观察窗开孔补强区应力过渡极其均匀平滑，无突变亮红尖锐奇异点； - 图角附带理论屈曲临界压力随真球度误差 $\\Delta R/t$ 的敏感性曲线图（Imperfection Sensitivity Curve）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- ASME PVHO-1-2023: *Safety Standard for Pressure Vessels for Human Occupancy*; - Marine Structures, Vol. 84: *Ultimate Strength and Elastoplastic Buckling of Deep-Sea Spherical Pressure Hulls Made of",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "全海深万米（11,000米）载人潜水器全钛合金球壳（Ti-6Al-4V ELI）非线性弹塑性屈曲与观察窗加厚拓扑",
    groundTruth: "1. **材料物性与经典 Zoelly 弹性/弹塑性临界失稳压力计算**: - 壳体材料: Ti-6Al-4V ELI（杨氏模量 $E = 114.0 \\text{ GPa}$，泊松比 $\\nu = 0.33$，屈服极限 $\\sigma_y = 825.0 \\text{ MPa}$）； - 球壳几何: 内半径 $R_i = 1050 \\text{ mm}$，公称均布壁厚 $t = 52.0 \\text{ mm}$（外径 $R_o = 1102 \\text{ mm}$）； - 设计服役水深静水外压: $P_{ext} = 115.0 \\text{ MPa}$（对应海水密度 $1035\\text{ kg/m}^3$）； - **完美球壳 Zoelly 弹性屈曲压力**: $$P_{cr,el} = \\frac{2 E}{\\sqrt{3(1-\\nu^2)}} \\left(\\frac{t}{R_{",
    evaluationCriteria: "- **机器自动化比对 (VLM / DOM)**: - SVG 精确绘制载人球壳截面（包括观察窗 PMMA 锥形有机玻璃装配体、锥座金属坡口与球壳母体）； - 具有有限元应力等高线云图填充（FEA Mesh & Contour），用色带严格对应 von Mises 应力值（从深蓝 $200\\text{ MPa}$ 到亮红 $750\\text{ MPa}$）； - 开孔区域外缘标注精确的局部增厚尺寸线（$t_{boss} = 88\\text{ mm}$，过渡圆角 $R = 125\\text{ mm}$）； - 外部海水静压施加层使用密集的同向径向聚合压力矢量箭头（标注 $P_{ext} = 115\\text{ MPa}$）。 - **肉眼视觉对比**: - 壳体受力均匀的膜应力区呈中度青绿色（$\\sigma \\approx 550-600\\text{ MPa}$）；观察窗开孔补强区应力过渡",
    referenceSource: "- ASME PVHO-1-2023: *Safety Standard for Pressure Vessels for Human Occupancy*; - Marine Structures, Vol. 84: *Ultimate Strength and Elastoplastic Buckling of Deep-Sea Spherical Pressure Hulls Made of Ti-6Al-4V ELI*; - Thin-Walled Structures, Vol. 161: *Imperfection Sensitivity and Reinforcement Opt",
  },
};

/**
 * FE-AERO-10: 行星际空间站大型7自由度空间机械臂两端换位蠕虫爬行步态与碰撞抓捕对接
 */
export const FE_AERO_10_PROMPT: PromptSpec = {
  id: "FE-AERO-10",
  label: "行星际空间站大型7自由度空间机械臂两端换位蠕虫爬行步态与碰撞抓捕对接 (Interplanetary Space Station 7-DOF Relocatable Manipulator Inchworm Walking Gait & Dynamic Capture Docking)",
  template: "Generate an SVG technical visualization of Interplanetary Space Station 7-DOF Relocatable Manipulator Inchworm Walking Gait & Dynamic Capture Docking using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 在空间站（如天宫空间站核心舱机械臂、国际空间站 Canadarm2 及阿尔忒弥斯月球门户 Gateway 空间站）的长期轨道在轨维护中，空间机械臂必须具备“全站转移蠕虫爬行”（Inchworm Walking）能力。机械臂构型通常为两端对称的 7 自由度结构（肩部 3 自由度 + 肘部 1 自由度 + 腕部 3 自由度，末端均配置相同的数据力矩抓捕锁紧机构 LEE）。机械臂通过一端锁紧在舱体目标适配器（PDGF）上作为基座，另一端大范围运动至下一个 PDGF 目标进行抓捕，两端交替锁紧-解锁实现“头尾倒换翻转步态”。核心难点在于：在 15 米长大臂伸展与大质量姿态机动中，必须自主规避肘部伸直与腕部轴共线奇异点（Singularity Avoidance），并严格抑制末端碰撞冲击冲量向空间站核心舱传递，防止导致全站姿态失控（自由漂移 Free Drift 协议）。 Physical & Mathematical Ground Truth: 1. **7-DOF 冗余机械臂运动学与雅可比行列式奇异性指标**: - 机械臂构型: 对称冗余 7 自由度，总展开长度 $L = 14.80 \\text{ m}$，结构全重 $M_{arm} = 1750 \\text{ kg}$； - 两个固定底座（PDGF-A 与 PDGF-B）表面欧氏距离: $D_{base} = 11.50 \\text{ m}$； - 速度雅可比矩阵 $\\dot{\\vec{x}} = J(\\vec{\\theta}) \\dot{\\vec{\\theta}}$（其中 $\\vec{x} \\in \\mathbb{R}^6, \\vec{\\theta} \\in \\mathbb{R}^7$）； - 自运动冗余角定义（Arm Angle）: $\\psi(t)$，通过零空间投影保证全局灵巧度测度 $w = \\sqrt{\\det(J J^T)} \\ge 0.082$（彻底规避 $w \\to 0$ 奇异区）； - 肘部俯仰角安全运行范围: $\\theta_{elbow} \\in [15.0^\\circ, 162.0^\\circ]$，严禁完全锁死伸直至 $180^\\circ$。 2. **步态换位轨迹与末端接触冲量解耦参数**: - 换位爬行动作历时: $t_{cycle} = 30.0 \\text{ s}$（动画循环周期）； - 运动分为四大相位: 1. **Phase 1: LEE-2 释放与展臂 ($0 \\le t < 10\\text{ s}$)**: 末端以五次多项式无冲击速度曲线提升离开 PDGF-B； 2. **Phase 2: 空间倒头大翻转 ($10 \\le t < 22\\text{ s}$)**: 肘关节俯仰与臂体偏航联动，主臂越过垂直拱门形态，末端平滑逼近 PDGF-A； 3. **Phase 3: 视觉闭环精密对准抓捕 ($22 \\le t < 27\\text{ s}$)**: 进入接触引导锥，对中容差 $\\Delta r_{align} \\le 15.0 \\text{ mm}, \\Delta \\phi \\le 1.2^\\circ$； 4. **Phase 4: 钢缆收紧锁死与基座交接 ($27 \\le t \\le 30\\text{ s}$)**: 三根导向钢缆收紧，吸收动能，空间站角速度扰动阈值限制 $\\Delta \\omega_{ISS} < 0.015^\\circ/\\text{s}$。 Visual Inspection Criteria: - **机器自动化比对 (VLM / DOM)**: - SVG 包含空间站外壁板桁架、太阳能帆板背景及两个明确标注的基座卡座 PDGF-A 与 PDGF-B； - 动画利用 `<animateTransform>` 驱动 7 个关节层次嵌套 `<g id=\"joint-1\">` 至 `<joint-7>` 的多级连杆层级运动（Forward Kinematics 层次图元树）； - 运动轨迹末端带有一条半透明的青色空间运动样条曲线 `<path class=\"end-effector-trajectory\">`； - 状态栏实时显示当前基座状态（Base Switch: A $\\to$ B）、各关节实时角度仪表盘及雅可比行列式灵巧度指示标（全量程位于安全绿区）。 - **肉眼视觉对比**: - 机械臂运动极具机械美感与物理真实感，两臂平滑拱起、翻转、降落，绝无瞬态抖动或关节穿模穿透； - 末端抓捕对准时，引导销平滑滑入锁紧座，三根锁紧卡爪闭合动作分明。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- IEEE Transactions on Robotics, Vol. 38, No. 5: *Locomotion and Manipulation Planning for Space Relocatable Robots on Orbit*; - Acta Astronautica, Vol. 195: *Contact Dynamics and Base Disturbance Min",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "行星际空间站大型7自由度空间机械臂两端换位蠕虫爬行步态与碰撞抓捕对接",
    groundTruth: "1. **7-DOF 冗余机械臂运动学与雅可比行列式奇异性指标**: - 机械臂构型: 对称冗余 7 自由度，总展开长度 $L = 14.80 \\text{ m}$，结构全重 $M_{arm} = 1750 \\text{ kg}$； - 两个固定底座（PDGF-A 与 PDGF-B）表面欧氏距离: $D_{base} = 11.50 \\text{ m}$； - 速度雅可比矩阵 $\\dot{\\vec{x}} = J(\\vec{\\theta}) \\dot{\\vec{\\theta}}$（其中 $\\vec{x} \\in \\mathbb{R}^6, \\vec{\\theta} \\in \\mathbb{R}^7$）； - 自运动冗余角定义（Arm Angle）: $\\psi(t)$，通过零空间投影保证全局灵巧度测度 $w = \\sqrt{\\det(J J^T)} \\ge 0.082$（彻底规避 $w \\",
    evaluationCriteria: "- **机器自动化比对 (VLM / DOM)**: - SVG 包含空间站外壁板桁架、太阳能帆板背景及两个明确标注的基座卡座 PDGF-A 与 PDGF-B； - 动画利用 `<animateTransform>` 驱动 7 个关节层次嵌套 `<g id=\"joint-1\">` 至 `<joint-7>` 的多级连杆层级运动（Forward Kinematics 层次图元树）； - 运动轨迹末端带有一条半透明的青色空间运动样条曲线 `<path class=\"end-effector-trajectory\">`； - 状态栏实时显示当前基座状态（Base Switch: A $\\to$ B）、各关节实时角度仪表盘及雅可比行列式灵巧度指示标（全量程位于安全绿区）。 - **肉眼视觉对比**: - 机械臂运动极具机械美感与物理真实感，两臂平滑拱起、翻转、降落，绝无瞬态抖动或关节穿模穿透； -",
    referenceSource: "- IEEE Transactions on Robotics, Vol. 38, No. 5: *Locomotion and Manipulation Planning for Space Relocatable Robots on Orbit*; - Acta Astronautica, Vol. 195: *Contact Dynamics and Base Disturbance Minimization of the Space Station Manipulator During Inchworm Relocation*; - NASA/SP-20205008743: *Robo",
  },
};

export const FE_AERO_PROMPTS: readonly PromptSpec[] = [
  FE_AERO_01_PROMPT,
  FE_AERO_02_PROMPT,
  FE_AERO_03_PROMPT,
  FE_AERO_04_PROMPT,
  FE_AERO_05_PROMPT,
  FE_AERO_06_PROMPT,
  FE_AERO_07_PROMPT,
  FE_AERO_08_PROMPT,
  FE_AERO_09_PROMPT,
  FE_AERO_10_PROMPT,
];


/**
 * FE-6: 极端环境装备、商业航天与高超声速工程 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）
 */
export const FE_AERO_SUITE_PROMPT: PromptSpec = {
  id: "fe-aero-v1",
  label: "FE-6: 极端环境装备与商业航天（十题组）",
  template: "FE-6: 极端环境装备、商业航天与高超声速工程 前沿工程十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",
  variables: [],
    candidates: [
    {
      id: FE_AERO_01_PROMPT.id,
      label: "重型运载火箭发射塔机械臂“筷子”高空悬停捕获动力学",
      text: FE_AERO_01_PROMPT.template,
      standard: FE_AERO_01_PROMPT.standard,
    },
    {
      id: FE_AERO_02_PROMPT.id,
      label: "旋转爆震火箭发动机（RDRE）环形燃烧室连续超音速爆震波动力学与激波反射结构",
      text: FE_AERO_02_PROMPT.template,
      standard: FE_AERO_02_PROMPT.standard,
    },
    {
      id: FE_AERO_03_PROMPT.id,
      label: "深空返回跳跃式双脉冲大气层再入升阻比调节与走廊边界",
      text: FE_AERO_03_PROMPT.template,
      standard: FE_AERO_03_PROMPT.standard,
    },
    {
      id: FE_AERO_04_PROMPT.id,
      label: "高超声速飞行器超燃冲压发动机隔离段内激波串/马赫杆与边界层分离",
      text: FE_AERO_04_PROMPT.template,
      standard: FE_AERO_04_PROMPT.standard,
    },
    {
      id: FE_AERO_05_PROMPT.id,
      label: "超高温陶瓷（ZrB2-SiC）高超声速驻点烧蚀与多层热传导梯级",
      text: FE_AERO_05_PROMPT.template,
      standard: FE_AERO_05_PROMPT.standard,
    },
    {
      id: FE_AERO_06_PROMPT.id,
      label: "深空超薄大面积太阳光子帆辐射压动量交换与帆面褶皱扭矩解耦",
      text: FE_AERO_06_PROMPT.template,
      standard: FE_AERO_06_PROMPT.standard,
    },
    {
      id: FE_AERO_07_PROMPT.id,
      label: "兆瓦级外加磁场磁等离子体动态推力器（AF-MPDT）等离子体同轴加速与双极扩散羽流发散角",
      text: FE_AERO_07_PROMPT.template,
      standard: FE_AERO_07_PROMPT.standard,
    },
    {
      id: FE_AERO_08_PROMPT.id,
      label: "深地超万米（12,000米）超深井超高温高压钻柱正弦-螺旋屈曲相变与粘滑振动谐波",
      text: FE_AERO_08_PROMPT.template,
      standard: FE_AERO_08_PROMPT.standard,
    },
    {
      id: FE_AERO_09_PROMPT.id,
      label: "全海深万米（11,000米）载人潜水器全钛合金球壳（Ti-6Al-4V ELI）非线性弹塑性屈曲与观察窗加厚拓扑",
      text: FE_AERO_09_PROMPT.template,
      standard: FE_AERO_09_PROMPT.standard,
    },
    {
      id: FE_AERO_10_PROMPT.id,
      label: "行星际空间站大型7自由度空间机械臂两端换位蠕虫爬行步态与碰撞抓捕对接",
      text: FE_AERO_10_PROMPT.template,
      standard: FE_AERO_10_PROMPT.standard,
    },
  ],
  source: null,
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "火箭高空精准捕获动力学、超声速爆震燃烧与高超声速再入激波",
    groundTruth: "以重型运载火箭发射塔机械臂悬停捕获动力学、旋转爆震发动机（RDRE）超音速激波反射、跳跃式双脉冲大气层再入升阻比包线为基准，满足牛顿力学、气体动力学与有限元应力方程。",
    evaluationCriteria: "1. 轨道与气动：再入走廊与抛物线轨迹曲率符合空气动力学；2. 机械受力：万向节姿态解耦与冲量阻尼平衡；3. 语法规范：XML 严格合法，无交互 JS。",
    referenceSource: "https://arc.aiaa.org",
  },
};

export const FE_AERO_INDIVIDUAL_PROMPTS = FE_AERO_PROMPTS;

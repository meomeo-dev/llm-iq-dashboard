/**
 * 机械工程、非欧拓扑与视效前沿提示词数据
 */

import type { PromptSpec } from "./types";

/**
 * 四冲程单缸活塞发动机（纯内联 SVG 动画）。
 * 考察多部件相位精确同步（曲轴、活塞、气门、点火）、连杆回转几何与机械剖面图层。
 */
export const FOUR_STROKE_ENGINE_PROMPT: PromptSpec = {
  id: "four-stroke-engine-v1",
  label: "四冲程发动机（Four-Stroke Engine）",
  template: [
    "Generate an animated SVG demonstrating a cross-section cutaway of a single-cylinder four-stroke internal combustion engine using pure inline SVG animation (SMIL or CSS keyframes).",
    "The engine structure must clearly feature a cylinder bore, a reciprocating piston with wrist pin, a connecting rod, a counterweighted crankshaft revolving around a fixed main bearing, intake and exhaust ports with poppet valves, and a spark plug at the cylinder head.",
    "The animation must run continuously and strictly adhere to the four-stroke thermodynamic cycle phase synchronization:",
    "1. Intake stroke: Piston travels downwards from Top Dead Center (TDC) to Bottom Dead Center (BDC); the intake valve opens downward while the exhaust valve remains closed.",
    "2. Compression stroke: Piston travels upwards from BDC to TDC; both intake and exhaust valves remain firmly closed.",
    "3. Power / Combustion stroke: Exactly as the piston reaches TDC, the spark plug flashes with a bright yellow-red ignition burst; hot expanding combustion drives the piston forcefully downwards from TDC to BDC; both valves remain closed.",
    "4. Exhaust stroke: Piston travels upwards from BDC to TDC; the exhaust valve opens to vent burnt exhaust gases while the intake valve remains closed.",
    "The connecting rod must smoothly pivot at both the piston wrist pin and the crank journal, following the circular rotation of the crankshaft.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Four-stroke_engine",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "四冲程内燃机循环相位同步与曲柄连杆运动学",
    groundTruth: "四冲程循环严格对齐：1. 进气（活塞下行+进气门开）；2. 压缩（活塞上行+双门紧闭）；3. 做功（上止点火花塞瞬间爆燃高亮+活塞受压强力下推）；4. 排气（活塞上行+排气门开）；连杆两端分别铰接活塞销与曲轴颈并遵循刚体几何自转与公转；曲轴转动 2 圈对应完整四冲程循环。",
    evaluationCriteria: "1. 相位时序同步（黄金指标）：点火爆发必须发生在压缩冲程结束时的上止点（TDC），气门开闭与活塞运动方向严格对应；2. 机械连杆刚体几何：连杆无脱开或拉伸变形，曲轴绕主轴中心定点旋转；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Four-stroke_engine",
  },
};

/**
 * 莫比乌斯环拓扑巡航小车（纯内联 SVG 动画）。
 * 考察非欧空间单侧表面拓扑连续性、720° 双圈回归与空间扭转透视遮挡。
 */
export const MOBIUS_STRIP_PROMPT: PromptSpec = {
  id: "mobius-strip-v1",
  label: "莫比乌斯小车（Möbius Strip Track）",
  template: [
    "Generate an animated SVG depicting a stylized vehicle (or rover) continuously cruising along an impossible-looking 3D Möbius strip track using pure inline SVG animation (SMIL or CSS keyframes).",
    "The Möbius strip ribbon must be rendered with dimensional shading, gradients, and perspective depth showing its continuous single-sided half-twist topology.",
    "The vehicle must travel at a steady speed along the centerline ribbon path and strictly demonstrate true non-orientable topological navigation:",
    "1. In the first 360° circuit, the vehicle drives along what appears to be the 'outer' surface, passes smoothly through the half-twist region, and emerges on the 'inner' inverted surface (upside down).",
    "2. In the second 360° circuit (completing a full 720° topological traversal), the inverted vehicle traverses the ribbon, passes through the twist once more, and smoothly flips back right-side up to its initial orientation.",
    "3. The vehicle and track must exhibit correct foreground-versus-background layer occlusion as it moves across overlapping ribbon segments.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/M%C3%B6bius_strip",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "非欧空间单侧表面拓扑连续性与 720° 双圈回归",
    groundTruth: "莫比乌斯带是仅有单侧与单一边界的非定向曲面；小车必须跑完整整 720° 拓扑周长才能经历一次正立-倒立-正立的完整周期；扭转过渡区呈现清晰的空间扭结明暗着色与前后图层遮挡。",
    evaluationCriteria: "1. 拓扑连续性（黄金指标）：必须连续跨越正反两面完成 720° 双圈巡航；仅在单侧 360° 生硬循环瞬移判定为拓扑理解失误；2. 空间遮挡与视错觉深度：前后层级遮挡关系自然流畅；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/M%C3%B6bius_strip",
  },
};

/**
 * 倒立摆小车自平衡控制（纯内联 SVG 动画）。
 * 考察经典控制理论物理因果律、反向加速度推力恢复与微平衡阻尼。
 */
export const CART_POLE_PROMPT: PromptSpec = {
  id: "cart-pole-v1",
  label: "倒立摆平衡小车（Cart-Pole Balance）",
  template: [
    "Generate an animated SVG simulating the classic Cart-Pole inverted pendulum self-balancing dynamical system using pure inline SVG animation (SMIL or CSS keyframes).",
    "The scene must feature a horizontal linear track, a motorized wheeled cart moving horizontally left and right, and an unactuated slender pole hinged via a frictionless pivot at the top center of the cart.",
    "The animation must clearly and faithfully demonstrate closed-loop feedback stabilization and physical causality:",
    "1. When the pole tilts slightly to the left, the cart rapidly accelerates to the LEFT underneath the pivot to generate a restoring torque that pushes the upright pole back toward vertical equilibrium.",
    "2. When the pole tilts slightly to the right, the cart rapidly accelerates to the RIGHT to catch and correct it.",
    "3. The cart wheels must rotate in accordance with the direction and speed of the horizontal translation.",
    "4. The system exhibits realistic continuous micro-adjustments with smooth natural damping, maintaining dynamic balance without the pole collapsing.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Inverted_pendulum",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "经典倒立摆控制理论闭环因果律与微平衡阻尼",
    groundTruth: "物理因果闭环：摆杆向哪侧倾斜失衡，小车必须同向加速平移以在支点下方提供向上托举恢复力矩（杆左倾则车左冲，杆右倾则车右冲）；车轮转动方向与水平位移方向严格一致；平衡振荡幅度收敛于平衡垂直轴。",
    evaluationCriteria: "1. 控制因果逻辑（核心）：因果倒置（杆左倒车向右开，导致直接倒地）判定为零分；正确同向加速度推力响应为满分；2. 机械耦合：摆杆固定铰接在车顶中心，随车运动无脱节；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Inverted_pendulum",
  },
};

/**
 * 三维等轴测赛博悬浮魔方（纯内联 SVG 动画）。
 * 考察 2D SVG 空间的三维仿射投影、欧拉角复合自转、爆炸分解与动态图层深度遮挡（Z-ordering）。
 */
export const CYBER_CUBE_PROMPT: PromptSpec = {
  id: "cyber-cube-v1",
  label: "三维赛博魔方（Isometric Cyber-Cube）",
  template: [
    "Generate an animated SVG depicting a futuristic 3D isometric cyber-cube (holographic exploded Rubik-style cube structure) floating in dark space using pure inline SVG animation (SMIL or CSS keyframes).",
    "The structure consists of multiple isometric cubelets rendered with glowing cyan and magenta wireframes, translucent geometric faces, and subtle gradients.",
    "The animation must continuously and smoothly demonstrate:",
    "1. Continuous 3D rotation with correct isometric affine projection, where face angles remain true to isometric geometry (30°/150°/270° axes).",
    "2. A periodic breathing/exploded-view cycle where outer cube segments smoothly expand outward along their 3D normal vectors, revealing a glowing inner core, then smoothly re-converge into a unified cube.",
    "3. Correct dynamic Z-ordering and depth occlusion, ensuring that rear cubelets and faces are properly occluded by foreground faces as they rotate.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Isometric_projection",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "三维等轴测仿射投影、欧拉角自转与动态前后图层遮挡（Z-ordering）",
    groundTruth: "等轴测三维轴系（30°/150°/270°）投影几何准确；立方体在三维空间匀速复合自转；向外爆炸分解（Exploded view）时各子方块沿各自法向量位移并平滑回缩复原；旋转时前后表面遮挡关系自然翻转，背光面暗度与投影网格协同。",
    evaluationCriteria: "1. 3D 投影与遮挡（黄金指标）：必须呈现真正的三维自转遮挡，背面多边形翻转到前面时正确覆盖后方，不得退化为 2D 扁平拉伸；2. 机械爆炸分解节奏：向外展开与归位具有弹性阻尼动效；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Isometric_projection",
  },
};

/**
 * 80年代合成波落日赛道巡航（纯内联 SVG 动画）。
 * 考察非线性透视网格伪 3D 速度感、落日百叶窗切片蒙版与车体横滚运动学。
 */
export const SYNTHWAVE_DRIVE_PROMPT: PromptSpec = {
  id: "synthwave-drive-v1",
  label: "合成波赛道巡航（Synthwave Roadster）",
  template: [
    "Generate an animated SVG capturing an iconic 1980s retro Synthwave / Outrun arcade driving scene using pure inline SVG animation (SMIL or CSS keyframes).",
    "The visual composition features:",
    "1. A glowing neon wireframe horizon ground grid in cyan/violet extending into the distance, with horizontal perspective lines continuously scrolling rapidly downward toward the viewer (spacing increasing logarithmically to create pseudo-3D velocity).",
    "2. A huge retro sunset on the distant horizon rendered with vibrant magenta-to-orange vertical gradient and horizontal segmented blinds/stripes.",
    "3. A sleek, stylized 80s futuristic cyber-roadster viewed from rear chase perspective in the lower-center foreground, with glowing red taillights and neon cyan underglow, smoothly swaying left and right as if cruising across lanes, accompanied by subtle body roll and pulsating exhaust thruster particles.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Synthwave",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "非线性透视网格伪 3D 速度感、落日切片蒙版与车体横滚运动学",
    groundTruth: "伪 3D 透视网格：横线向镜头高速平移且间距对数递增产生逼真的透视纵深速度感；落日水平百叶窗切片清晰带紫橙渐变；赛博跑车左右变道时带有微悬挂侧倾角（Roll angle）与对应地面动态投影。",
    evaluationCriteria: "1. 运动速度透视一致性（黄金指标）：网格移动必须远慢近快、线距符合透视投影，不得做成匀速垂直下移的梯子；2. 车体动力学质感：车辆漂移转向时伴随重力侧倾与尾灯粒子光效；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Synthwave",
  },
};

/**
 * 赛博朋克战术全息雷达 HUD 终端（纯内联 SVG 动画）。
 * 考察复合多轴差速自转对齐、雷达扫描荧光余辉与精密高密度矢量排版。
 */
export const CYBER_HUD_PROMPT: PromptSpec = {
  id: "cyber-hud-v1",
  label: "赛博全息战术 HUD（Cyberpunk Holographic HUD）",
  template: [
    "Generate an animated SVG depicting a cinematic, high-density cyberpunk holographic tactical HUD / radar targeting terminal using pure inline SVG animation (SMIL or CSS keyframes).",
    "The display interface features:",
    "1. A central circular tactical radar with a 360° sweeping beam in glowing neon green/cyan, leaving a soft trailing phosphorescent decay as it illuminates detected blips/targets on the grid.",
    "2. Concentric outer telemetry rings with ultra-fine angular tick marks and compass degrees, rotating smoothly in counter-opposing directions.",
    "3. Auxiliary telemetry modules around the perimeter: an oscillating real-time sine-wave / audio-frequency oscilloscope waveform, dynamic digital readout meters with pulsing hexagonal energy bars, and scrolling hex telemetry streams.",
    "Use dark background, glowing strokes with SVG glow filters (feGaussianBlur), and sharp geometric hierarchy.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Head-up_display",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "复合多轴自转对齐、雷达扫描荧光余辉与精密高密度矢量排版",
    groundTruth: "中心雷达波束以圆心为 transform-origin 顺时针旋转，扫过目标时触发局部高光与渐隐衰减余辉；同心刻度环正反向差速旋转；示波器正弦波形平滑连续流动；整体布局具备严密的对称性与视网膜级微型刻度对齐。",
    evaluationCriteria: "1. 旋转中心与余辉（黄金指标）：所有旋转刻度环与雷达波束必须精确共用中心点，无离心抖动；2. 信息层级：高密度线条利落分明，发光滤镜（feGaussianBlur）与半透明层叠自然；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Head-up_display",
  },
};

/**
 * 超大质量黑洞引力透镜吸积盘（纯内联 SVG 动画）。
 * 考察爱因斯坦广义相对论时空弯曲双重环投影与相对论多普勒辐射不对称。
 */
export const BLACK_HOLE_LENSING_PROMPT: PromptSpec = {
  id: "black-hole-lensing-v1",
  label: "黑洞引力透镜（Black Hole Gravitational Lensing）",
  template: [
    "Generate an animated SVG illustrating a spinning supermassive black hole with an accretion disk and strong gravitational lensing in deep space using pure inline SVG animation (SMIL or CSS keyframes).",
    "The astrophysical scene must faithfully represent:",
    "1. The central pitch-black shadow of the event horizon and photon sphere.",
    "2. A radiant, high-temperature plasma accretion disk orbiting the black hole; due to extreme spacetime curvature (Einstein general relativity), light from the back of the accretion disk is bent upwards and downwards over the shadow, forming the iconic double-ring gravitational lensing crown.",
    "3. Relativistic Doppler beaming: the side of the accretion disk rotating toward the observer is noticeably brighter, more energetic, and shifted toward white-blue, while the receding side is dimmer and shifted toward deep red-orange.",
    "4. Accretion matter streams and spiral vortices continuously flowing into the event horizon, with swirling orbital motion faster near the inner edge (Keplerian differential rotation).",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Gravitational_lens",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "广义相对论引力透镜时空弯曲双重环与相对论多普勒辐射不对称",
    groundTruth: "中心为绝对纯黑事件视界与光子球；背景吸积盘在强引力场下被扭曲弯折至黑洞上下两侧形成双重光晕冠；相对论多普勒频移：迎向观察者旋转侧辐射显著增强且偏高能蓝白，远离侧暗淡红移；开普勒差动旋转（内圈流速高于外圈）。",
    evaluationCriteria: "1. 相对论物理（黄金指标）：光线引力弯曲双重环与多普勒辐射迎背侧非对称明暗必须准确呈现，画成对称普通圆环判定为物理认知失误；2. 差动旋转与流线动效：吸积盘等离子体流线向内螺旋加速；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Gravitational_lens",
  },
};

/**
 * 经典基准与空间几何/物理基础提示词数据
 */

import type { PromptSpec } from "./types";

/** Simon Willison 的经典提示词，本仓库的基准锚点 */
export const CLASSIC_PROMPT: PromptSpec = {
  id: "classic-v1",
  label: "经典版（Classic）",
  template: "Generate an SVG of a pelican riding a bicycle",
  variables: [],
  candidates: [],
  source: "https://github.com/simonw/pelican-bicycle",
  verified: true,
  immutable: true,
  originDate: "2024-07",
  registeredAt: "2026-09-22",
  standard: {
    coreKey: "非训练集分布（OOD）构图与主体部件关联",
    groundTruth: "加州鹈鹕（长喙、典型大喉囊、鸟类羽毛）骑坐在经典自行车上；自行车包含前后双轮、车架、车把、脚踏与车座。",
    evaluationCriteria: "1. 语法完整：输出合法自闭合 SVG，无截断或 XML 解析错误；2. 人车拓扑：鹈鹕躯干与自行车比例协调，脚踏与臀部分别对应踏板与车座；3. 部件辨识：前后双轮与车架几何清晰。",
    referenceSource: "https://github.com/simonw/pelican-bicycle",
  },
};

/**
 * 作者 2025-11-18 发布的升级版，对车架、辐条、喉囊、羽毛、踩踏动作与繁殖羽提出要求。
 */
export const UPGRADED_PROMPT: PromptSpec = {
  id: "upgraded-v2",
  label: "升级版（Upgraded, 2025-11）",
  template: [
    "Generate an SVG of a California brown pelican riding a bicycle.",
    "The bicycle must have spokes and a correctly shaped bicycle frame.",
    "The pelican must have its characteristic large pouch, and there should be a clear indication of feathers.",
    "The pelican must be clearly pedaling the bicycle.",
    "The image should show the full breeding plumage of the California brown pelican.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://simonwillison.net/2025/Nov/18/gemini-3/",
  verified: true,
  immutable: true,
  originDate: "2025-11-18",
  registeredAt: "2026-09-22",
  standard: {
    coreKey: "高密度解剖与机械细节遵从（辐条、繁殖羽、踩踏动态）",
    groundTruth: "加州褐鹈鹕全身繁殖羽（头顶白/黄，颈部深棕/黑，体羽灰褐质感）；大喉囊与羽毛分层；双轮具备明确辐条（spokes）；车架结构合规；鹈鹕处于踩踏动作中（clearly pedaling）。",
    evaluationCriteria: "1. 辐条与车架：双轮内必须具有辐条射线结构，车架符合自行车三角力学；2. 繁殖羽与喉囊：呈现加州褐鹈鹕繁殖羽特征色彩与丰满喉囊；3. 踩踏动态：腿部有明确蹬车屈伸动态且双脚踩在踏板上。",
    referenceSource: "https://simonwillison.net/2025/Nov/18/gemini-3/",
  },
};

/**
 * 钟表时针几何空间逻辑（3:45 时钟）。
 * 考察时间到角度的非线性空间映射能力：45 分钟时时针应偏向 4（112.5°）而非直指 3（90°）。
 */
export const CLOCK_PROMPT: PromptSpec = {
  id: "clock-v1",
  label: "时钟空间几何（Clock 3:45）",
  template: [
    "Generate an SVG of a classic analog wall clock clearly displaying the time 3:45.",
    "The clock face must feature a circular dial with distinct hour numerals (1 to 12) and perimeter tick marks.",
    "The minute hand must point directly at 9 (an angle of 270° from the 12 o'clock top).",
    "Geometrically, because 45 minutes have elapsed in the hour, the hour hand must NOT point horizontally at 3 (90°);",
    "instead, it must be positioned precisely three-quarters of the way between 3 and 4 (an angle of 112.5° from the 12 o'clock top).",
    "Include a central mounting pin, distinct lengths and widths for the hour and minute hands, and a thin red second hand pointing at 12 (0°).",
    "Ensure all text, lines, and hands are geometrically aligned and self-contained in the SVG.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://x.com/search?q=clock+3%3A45+SVG+LLM",
  verified: true,
  immutable: true,
  originDate: "2026-07",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "时间到角度的非线性机械连续空间映射（CDT 测验）",
    groundTruth: "表盘 1~12 数字均匀排布；分针直指 9 点刻度（绝对角度 270°，以正上方 12 点为 0°）；时针由于 45 分钟流逝，顺时针偏转 30° × (45/60) = 22.5°，绝对角度必须精确落于 90° + 22.5° = 112.5°（即 3 与 4 之间靠近 4 的 3/4 处）。",
    evaluationCriteria: "1. 时针角度（黄金考点）：水平直指 3 点（90°）判定为时钟物理连续性认知失误；精确指向 112.5° 为满分；2. 指针比例：分针长于时针，具备中心固定轴销，秒针清晰。",
    referenceSource: "https://en.wikipedia.org/wiki/Clock-drawing_test",
  },
};

/**
 * 动态鹈鹕自行车（纯内联 SVG 动画）。
 * 考察模型编写内联 SMIL 或 CSS keyframes 动画、坐标系旋转中心及周期性运动学能力。
 */
export const ANIMATED_PELICAN_PROMPT: PromptSpec = {
  id: "animated-pelican-v1",
  label: "动态鹈鹕车（Animated Pelican）",
  template: [
    "Generate an SVG of a California brown pelican riding a bicycle featuring pure inline SVG animation (using SMIL <animateTransform> or inline CSS @keyframes).",
    "The bicycle must have a correctly shaped frame, handlebar, saddle, spoked wheels, pedals, and crank arms.",
    "The pelican must be seated and pedaling the bicycle with its feet on the pedals.",
    "Animations must run smoothly and continuously in a modern browser:",
    "1. Both front and rear wheels must continuously rotate around their respective axle center points (transform-origin).",
    "2. The crank arms and pedals must smoothly revolve around the bottom bracket spindle.",
    "3. The pelican's legs must smoothly animate up and down in synchrony with the pedaling motion.",
    "The entire output must be completely self-contained within a single valid SVG element (ensure strictly well-formed XML: if using <style>, wrap CSS inside <![CDATA[ ... ]]> or avoid raw unescaped '&' and '<'), requiring no external scripts or stylesheets.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://simonwillison.net/tags/pelican-riding-a-bicycle/",
  verified: true,
  immutable: true,
  originDate: "2026-08",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "纯内联 SVG 运动学、自转中心点与踩踏周期动画",
    groundTruth: "前后车轮必须以各自独立轮毂轴心点 (cx, cy) 为中心进行 transform-origin 旋转；曲柄牙盘旋转且脚踏呈 180° 对称相位；鹈鹕双腿随曲柄做上下伸缩连贯踩踏；纯内联 SMIL 或 CSS @keyframes 驱动，样式块含 CDATA 保护。",
    evaluationCriteria: "1. 旋转中心：以全局 (0,0) 旋转导致车身飞离判定为零分；前后车轮各绕自身轴心平稳自转为及格；2. 踩踏联动：双腿与脚踏形成连贯周期性伸缩踩踏运动为满分；3. 语法规范：XML 解析零错误，不含未转义裸字符。",
    referenceSource: "https://simonwillison.net/tags/pelican-riding-a-bicycle/",
  },
};

/**
 * 彭罗斯不可能三角（埃舍尔矛盾空间）。
 * 考察等轴测三维投影、空间几何拓扑一致性与矛盾面光影着色。
 */
export const PENROSE_PROMPT: PromptSpec = {
  id: "penrose-v1",
  label: "彭罗斯三角（Penrose Triangle）",
  template: [
    "Generate an SVG of an impossible 3D Penrose Triangle (Escher-style impossible tribar in isometric perspective).",
    "The three interconnected square-section beams must form a clean optical illusion of an impossible closed loop in three-dimensional space.",
    "Use distinct tonal shading on the three visible face orientations (for example, light highlight on top faces, medium tone on right-facing faces, and dark shadow on bottom/left faces)",
    "so that each corner joint displays crisp geometric depth while maintaining the impossible visual paradox.",
    "Ensure precise vertex alignments and seamless path joins.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Penrose_triangle",
  verified: true,
  immutable: true,
  originDate: "2026-08",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "三维等轴测投影与不可能拓扑视错觉闭环",
    groundTruth: "三个互相垂直的方梁在等轴测平面投影中形成不可能闭环覆盖循环（A 压 B、B 压 C、C 压 A）；每根方梁展示三个可见面（顶面、内侧面、外侧面），全局光照方向统一（高光面、中间调面、阴影暗面）。",
    evaluationCriteria: "1. 拓扑错觉：必须呈现埃舍尔式不可能循环遮挡；退化为普通正三棱锥或在转角处破损断裂判定为失误；2. 分面光影：三组面朝向明暗对比分明，棱角倒角利落。",
    referenceSource: "https://en.wikipedia.org/wiki/Penrose_triangle",
  },
};

/**
 * 半杯浮冰水（阿基米德浮力与折射半透明）。
 * 考察物理浮力直觉（冰水密度比约 0.9，90% 浸没）、透明图层层叠与液面折射渲染。
 */
export const ICE_WATER_PROMPT: PromptSpec = {
  id: "ice-water-v1",
  label: "半杯浮冰水（Glass with Ice）",
  template: [
    "Generate an SVG illustration of a transparent cylindrical drinking glass half-filled with clear water and three floating ice cubes.",
    "Strictly follow Archimedes' buoyancy principle for ice in water: because ice density is roughly 917 kg/m³ relative to liquid water (~1000 kg/m³),",
    "approximately 90% of each floating ice cube's volume must be submerged below the water meniscus, with only about 10% exposed above the liquid surface.",
    "Depict realistic transparency and reflections: the glass walls, the elliptical water surface line (meniscus),",
    "subtle water volume coloring (light translucent cyan/blue), and semi-transparent ice cubes with crisp highlights and depth.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Archimedes%27_principle",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "阿基米德浮力定律（90% 浸没）与玻璃液面透明折射",
    groundTruth: "冰块与水密度比为 917/1000 ≈ 0.917，因此每块浮冰约 90% 体积浸没在水面下方，仅约 10% 露出液面；圆柱形透明玻璃杯身与椭圆形水面弯月面（meniscus）；半透明水体与冰块折射光泽。",
    evaluationCriteria: "1. 浮力物理（核心）：冰块完全浮在水面上（0% 浸没）或完全沉底判定为严重物理违背；约 90% 浸没在水面下为满分；2. 材质渲染：半透明水色与折射分界线清晰。",
    referenceSource: "https://en.wikipedia.org/wiki/Archimedes%27_principle",
  },
};

/**
 * 动态火星网袜犰狳步态基准。
 * 考察四足对角相交步态、曲面适形菱形网袜、背甲俯仰与尾部波动节律。
 */
export const ANIMATED_ARMADILLO_FISHNET_MARS_PROMPT: PromptSpec = {
  id: "animated-armadillo-fishnet-mars-v1",
  label: "动态火星网袜犰狳步态 (Animated Armadillo in Fishnets on Mars)",
  template: [
    "Generate an animated SVG of a nine-banded armadillo wearing tight fishnet tights jaywalking across the red Martian surface featuring pure inline SVG animation (SMIL <animateTransform>/<animate> or inline CSS @keyframes).",
    "The armadillo must feature its characteristic banded armor carapace, pointed snout, tapered tail, and four legs clad in a distinct cross-hatched diamond grid (fishnet pattern).",
    "Animations must run smoothly and continuously in a modern browser with zero JavaScript:",
    "1. The armadillo's four legs must smoothly animate in an anatomically coordinated quadrupedal walking gait cycle (alternating diagonal limb pairs), with claws making clean, non-slipping contact with the Martian ground.",
    "2. The diamond mesh of the fishnet tights must remain tightly conformed to the contours of the flexing legs and thighs throughout the walking motion.",
    "3. The segmented dorsal carapace and arched back must gently bob vertically and pitch rhythmically in synchrony with the stride cadence.",
    "4. The tail must undulate in a rhythmic kinematic wave trailing behind the walking body.",
    "5. The entire walking gait cycle must loop seamlessly with zero seam jump: visual states at t = 0s and t = T must be mathematically identical.",
    "The entire output must be completely self-contained within a single valid SVG element (ensure strictly well-formed XML: if using <style>, wrap CSS inside <![CDATA[ ... ]]> or avoid raw unescaped '&' and '<'), requiring no external scripts or stylesheets (absolutely NO JavaScript / 0 <script> tags).",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://news.ycombinator.com/item?id=49982139",
  verified: true,
  immutable: true,
  originDate: "2026-10",
  registeredAt: "2026-10-10",
  standard: {
    coreKey: "四足步行对角步态、曲面贴体网袜变形、甲壳俯仰节律与无缝循环",
    groundTruth: "四足对角相交步态（无溜冰滑步）；网袜菱形网格紧密适形贴合四肢屈伸；甲壳多节重叠随步频上下起伏；火星氧化铁红沙地貌；步态周期无缝对接 MAE ≡ 0 且 max MAE >= 0.015；严禁任何 script 脚本。",
    evaluationCriteria: "Pass: 四足对角协调步行且着地真实，网袜钻石纹随腿部连续贴体运动，背壳起伏连贯，火星地貌鲜明，首尾无缝对接 MAE ≡ 0 且有效动量 max MAE >= 0.015，0 script 且 XML 零错误；Partial: 动物形态与火星环境存在但四腿平移溜冰、网袜退化为散乱杂点或背景为地球马路；Fail: 纯静态死图（max MAE < 0.015）、含 script、画成自行车/鹈鹕等陈旧先验、肢体脱离身体或 XML 语法错误。",
    referenceSource: "https://news.ycombinator.com/item?id=49982139",
  },
};

/**
 * 动态环尾狐猴骑电动滑板车正视图基准。
 * 考察 100% 正交对称视角、单腿蹬地推进动力学、前后轮同轴投影与环尾摆动平衡。
 */
export const ANIMATED_LEMUR_SCOOTER_FRONT_PROMPT: PromptSpec = {
  id: "animated-lemur-scooter-front-v1",
  label: "动态环尾狐猴骑电动滑板车正视图 (Animated Lemur on Electric Scooter Front View)",
  template: [
    "Generate an animated SVG of a ring-tailed lemur riding an electric kick scooter strictly from a direct HEAD-ON FRONT VIEW (orthographic/central front perspective) featuring pure inline SVG animation (SMIL <animateTransform>/<animate> or inline CSS @keyframes).",
    "The composition must be strictly front-facing: the horizontal handlebar faces directly forward, the front tire is seen head-on (occluding the rear tire behind it), and the lemur's face and upright body display clear bilateral symmetry.",
    "Animations must run smoothly and continuously in a modern browser with zero JavaScript:",
    "1. Ground-kick propulsion cycle: While one foot remains planted on the front-facing scooter deck and hands grip the horizontal handlebar, the other leg must execute a rhythmic, continuous kicking stroke (swinging forward, touching down to push backward against the ground, and lifting back up).",
    "2. Vertical suspension bounce: The scooter deck and handlebar stem must demonstrate subtle vertical oscillation and slight lateral roll tilt synchronized with the kick cadence.",
    "3. Tail counter-balance: The lemur's characteristic black-and-white banded tail, held high in an arch, must gently sway left-to-right in balanced counter-motion, with its alternating bands maintaining clean cylindrical perspective.",
    "4. Front wheel rolling: The front tire (viewed head-on) must display continuous vertical tread pattern rolling animation.",
    "5. The entire propulsion cycle must loop seamlessly with zero seam jump: visual states at t = 0s and t = T must be mathematically identical.",
    "The entire output must be completely self-contained within a single valid SVG element (ensure strictly well-formed XML: if using <style>, wrap CSS inside <![CDATA[ ... ]]> or avoid raw unescaped '&' and '<'), requiring no external scripts or stylesheets (absolutely NO JavaScript / 0 <script> tags).",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://news.ycombinator.com/item?id=49578488",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-10-10",
  standard: {
    coreKey: "正交对称正视图、单腿后蹬推进动力学、前后轮同轴投影与环尾摆动",
    groundTruth: "严格正面视角（侧视一票否决）；车体对称性 RMSE <= 2.0%；单腿向前摆动-触地蹬推-抬腿连贯运动；前轮同轴遮挡后轮并呈现滚动纹理；无缝循环 MAE ≡ 0 且 max MAE >= 0.015；严禁任何 script 脚本。",
    evaluationCriteria: "Pass: 100% 正视视角（车把水平展开无侧向偏斜），单腿周期蹬地推进真实，车把踏板微幅减震，黑白环尾摆动，首尾闭合 MAE ≡ 0 且有效动量 max MAE >= 0.015，0 script 且 XML 零错误；Partial: 大体正视但蹬地机械抽动、尾环画成杂乱横线或车体严重水平晃动；Fail: 直接退化为侧视图（一票否决零分）、纯静态死图（max MAE < 0.015）、含 script 或 XML 语法错误。",
    referenceSource: "https://news.ycombinator.com/item?id=49578488",
  },
};

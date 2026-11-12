/** 评测提示词数据。 */

import type { PromptSpec } from "../../../types";


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

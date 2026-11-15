import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-iso-layered-console-v1",
  label: "等轴测分层音频遥测调音台动效 (Animated Isometric Layered Audio-Telemetry Console)",
  template: [
    "Generate one self-contained animated SVG of an isometric layered modular field-audio and signal-telemetry mixing console on a studio dark slate background (#0f141e). No text, no brand logos, no external assets, no audio, no script.",
    'Technical contract: SMIL (<animate>, <animateTransform>) or inline CSS @keyframes only. 0 <script>, 0 event handlers. viewBox="0 0 800 540". Any <style> goes inside CDATA. Well-formed XML.',
    "Isometric geometry: strict 30-degree isometric projection (2:1 / cos 30 deg axis grid) with consistent 3-value surface shading (top-lit light, left mid-tone, right dark shadow) and clean vertical corner alignment pins.",
    [
      "Assemble three distinct vector elevation sublayers along the vertical stack axis:",
      "1. Lower layer: chamfered brushed-aluminum chassis base with side heatsink fins.",
      "2. Middle layer: modular control deck featuring 5 recessed fader tracks aligned strictly along the 30-degree isometric axis, circular rotary encoder dials projected in isometric ellipses, and tactile glowing pad buttons.",
      "3. Upper layer: angled translucent glass telemetry visor hood enclosing a multi-bar LED meter array and dual-VU spectrum traces.",
    ].join("\n"),
    [
      "Closed kinematic loop T = 6s (states at t = 0s and t = 6s must be pixel-identical, MAE === 0, with clear in-loop motion max(MAE) >= 0.015):",
      "- 0.0s to 1.2s: The three layers start cleanly separated along the vertical stack axis with dotted cyan alignment drop-lines visible, then glide smoothly down and dock flush together with zero inter-layer edge misalignment.",
      "- 1.2s to 4.6s: While docked, 5 motorized fader caps glide smoothly up and down strictly inside their 30-degree isometric channel rails in staggered phases, rotary encoder indicator arcs sweep cleanly inside their dial ellipses, multi-bar LED meters pulse, and dual spectrum/VU traces animate cleanly inside the glass visor without clipping panel bezels.",
      "- 4.6s to 6.0s: The three layers cleanly undock and rise back along the vertical alignment pins to their exact initial exploded elevation (t = 6s matches t = 0s).",
    ].join("\n"),
    "Output only the <svg>.",
  ].join("\n\n"),
  variables: [],
  candidates: [],
  source: "https://x.com/BreejeAnadkat/status/2120115744168091921",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey:
      "严格 30 度等轴测三层调音台爆炸对接闭环、斜轴五通道推子分相联动与玻璃罩内裁切频谱遥测",
    groundTruth:
      "800x540 深灰蓝底（#0f141e）纯内联 SVG 呈现三层模块化野战音频遥测调音台：底层倒角铝制机身与散热鳍片、中层沿 30 度等轴测轴线排列的 5 条凹槽推子轨道与椭圆投影旋钮及发光按键、顶层斜置半透明玻璃双 VU 频谱遮光罩；全图严格遵循 30 度等轴测（2:1/cos30 网格）与顶亮/左中/右暗三阶受光；T=6s 闭环中 0.0-1.2s 沿青色虚线定位销平稳降落齐平对接，1.2-4.6s 五路推子严格沿 30 度斜轨分相往复、旋钮弧线在椭圆内旋转、LED 与双 VU 频谱在玻璃罩边界内脉冲扫掠且不越界，4.6-6.0s 沿导向销精准升回初始分离位置；t=0s 与 t=6s 像素 MAE === 0，周期内 max(MAE) >= 0.015，0 <script>。",
    evaluationCriteria:
      "Pass: 严格 30 度等轴测与三阶明暗一致，三层硬件结构齐全且对接零错位，5 路推子严格沿 30 度斜轴分相滑动、旋钮/LED/频谱在各自轮廓与玻璃罩内裁切不溢出，t=0 与 t=6 完全重合（MAE === 0），max(MAE) >= 0.015，0 <script> 且无品牌或外部依赖；Partial: 三层形态与 6s 闭环成立，但推子略偏斜轴、对接有轻微错缝或频谱轻度溢出边框；Fail: 静态无运动（max(MAE) < 0.015）、透视非等轴测或错位严重、首尾帧未对齐（MAE > 0）、含 <script> 或 XML 语法错误。",
    referenceSource: "https://x.com/BreejeAnadkat/status/2120115744168091921",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "Strict 30-Deg Isometric 3-Layer Console Docking Loop, Axis-Locked 5-Fader Phased Motion & Clipped Glass Telemetry Visor",
  groundTruth:
    "800x540 dark slate (#0f141e) self-contained inline SVG depicting a 3-layer modular field-audio telemetry console: chamfered aluminum base chassis with heatsink fins, mid control deck with 5 recessed fader tracks aligned along the 30-deg isometric axis plus isometric-ellipse rotary dials and glowing pads, and upper angled translucent glass dual-VU spectrum visor; consistent 30-deg isometric grid (2:1 / cos 30 deg) with top-lit, left-mid, right-dark 3-value shading; closed T=6s loop where 0.0-1.2s docks separated layers along dotted cyan pins flush with zero edge mismatch, 1.2-4.6s drives 5 staggered fader caps strictly along 30-deg rails with rotary arcs, LED meters, and dual-VU traces clipped cleanly inside the visor, and 4.6-6.0s undocks back to exact initial elevation; t=0s and t=6s pixel MAE === 0, max(MAE) >= 0.015, and 0 <script>.",
  evaluationCriteria:
    "Pass: Strict 30-deg isometric projection and 3-value shading, all 3 elevation sublayers flush-docked with zero edge misalignment, 5 fader caps strictly axis-locked in staggered phases, rotary arcs/LEDs/dual-VU traces cleanly clipped inside dials and visor, t=0s and t=6s pixel-identical (MAE === 0), max(MAE) >= 0.015, 0 <script>, and zero brand marks or external assets; Partial: Correct 3-layer silhouette and 6s loop but slight fader track drift, minor docking seam offset, or minor visor clipping overflow; Fail: Static output (max(MAE) < 0.015), broken perspective, non-matching loop endpoints (MAE > 0), any <script> or event handler, or invalid XML.",
};

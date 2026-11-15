import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-pendulum-wave-reunion-v1",
  label: "十五摆归相 (Animated Pendulum Wave Reunion)",
  template: [
    "Generate one self-contained animated SVG of a pendulum wave. No text, no brand, no audio, no script.",
    'Technical contract: SMIL or inline CSS only. 0 <script>. viewBox="0 0 900 360". Any <style> goes in CDATA. Well-formed XML.',
    "Nine pendulums, index i = 0..8, pivots at x = 90 + i * 90, y = 70. Each rod length may differ, but the swing angle is the scored quantity. Released together from +16 degrees.",
    "Closed loop T = 6s. Pendulum i completes exactly n_i = 4 + i full oscillations in 6s. Angle in degrees, clockwise positive, zero is straight down:",
    "theta_i(t) = 16 * cos(2 * pi * n_i * t / 6)",
    "Sample this formula at t = 0, 0.25, 0.5, ..., 6.0. At the sample instants the rendered angle must match the formula within 1.5 degrees. Between samples use the formula, not a sine keyword and not an ease-in-out that changes the zeros.",
    "At t = 0 and t = 6 every pendulum is at +16 degrees and the pixels match. At t = 3, pendulums with odd n_i are at -16 degrees and pendulums with even n_i are at +16 degrees. Rods are separate groups so each angle can be measured. Bobs do not pass through the support bar.",
    "Output only the <svg>.",
  ].join("\n\n"),
  variables: [],
  candidates: [],
  source: "https://x.com/MiaAI_lab/status/2119930229661503893",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey: "9 摆可公度周期同相归零、theta_i(t)=16*cos(2*pi*(4+i)*t/6) 解析相位与 t=3s 奇偶反相",
    groundTruth:
      "9 根摆锤索引 i=0..8，支点 (90+i*90, 70)，在 T=6s 内分别完成 n_i=4+i 次完整振荡，瞬时摆角 theta_i(t)=16*cos(2*pi*n_i*t/6)（顺时针为正，0 度竖直向下）；t=0 与 t=6 全员归相至 +16 度且像素 MAE === 0；t=3 时奇数 n_i 在 -16 度、偶数 n_i 在 +16 度；0.25s 采样点角误差 <= 1.5 度；摆杆独立分组且摆锤不穿模横梁；周期内 max(MAE) >= 0.015；0 <script>。",
    evaluationCriteria:
      "Pass: 9 摆独立成组且支点精确，t=0 与 t=6 归相且 MAE === 0，t=3 奇偶反相成立，每 0.25s 采样摆角误差 <= 1.5 度（未用破坏零点的 ease-in-out），摆锤不穿横梁，max(MAE) >= 0.015 且 0 <script>；Partial: 摆数与闭环正确但归相时刻错位、振幅不足或 t=3 奇偶反相不严格；Fail: 静态无动画（max(MAE) < 0.015）、全摆同周期无行波、缓动毁坏过零点、含 <script> 或 XML 语法错误。",
    referenceSource: "https://x.com/MiaAI_lab/status/2119930229661503893",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "9-Pendulum Commensurate Period Reunion, Exact Cosine Phase theta_i(t)=16*cos(2*pi*(4+i)*t/6) & t=3s Odd-Even Antiphase",
  groundTruth:
    "9 pendulums indexed i=0..8 with pivots at (90+i*90, 70) completing n_i=4+i full oscillations in T=6s; instantaneous angle theta_i(t)=16*cos(2*pi*n_i*t/6) degrees (clockwise positive, 0 straight down); exact unison reunion at +16 deg at t=0 and t=6 with pixel MAE === 0; odd n_i at -16 deg and even n_i at +16 deg at t=3; angular error <= 1.5 deg across 0.25s samples; separate rod groups and no support-bar clipping; max(MAE) >= 0.015; strictly 0 <script>.",
  evaluationCriteria:
    "Pass: 9 separately grouped pendulums at exact pivots, exact reunion at t=0 and t=6 with MAE === 0, odd-even antiphase at t=3, angular error <= 1.5 deg across 0.25s samples without zero-shifting easing, no bar clipping, max(MAE) >= 0.015, and 0 <script>; Partial: Correct pendulum count and loop but mistimed reunion, reduced amplitude, or imprecise t=3 antiphase; Fail: Static image (max(MAE) < 0.015), identical periods with no wave split, easing distorting zero-crossings, any <script>, or invalid XML.",
};

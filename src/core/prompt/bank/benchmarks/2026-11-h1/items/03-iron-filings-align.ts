import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

/**
 * 铁屑指向移动磁极基准。
 * 考察 24 根 6x4 网格铁屑绕各自中心原地定轴旋转，并按 atan2 实时追踪简谐移动圆磁极。
 */
export const PROMPT_SPEC: PromptSpec = {
  id: "animated-iron-filings-align-v1",
  label: "铁屑指向移动磁极 (Animated Iron Filings Magnetic Alignment)",
  template: [
    "Generate one self-contained animated SVG of iron filings on a sheet, with one round magnet moving underneath. No text, no script, no hands.",
    'Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 640 400". CDATA around any <style>.',
    "24 filings, a 6 by 4 grid, centers at x = 80 + c * 96, y = 70 + r * 80, c = 0..5, r = 0..3. Each filing is a 28 px line in its own group, pivoted at its center.",
    "The magnet center moves on x(t) = 320 + 160 * sin(2 * pi * t / 8), y(t) = 200 with T = 8s. At t = 0 and t = 8 the magnet is at (320,200) and every pixel matches.",
    "At every instant each filing's angle is atan2(y_magnet - y_filing, x_magnet - x_filing) measured from the +x axis. Tolerance at t = 0, 2, 4, 6, 8 is 2 degrees. Filings do not translate. Only the magnet translates, and only the filings rotate.",
    "Output only the <svg>.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://x.com/MiaAI_lab/status/2119930229661503893",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey: "6x4 网格 24 根铁屑原地定轴旋转、atan2 向心角度追踪与 T=8s 横向简谐磁极闭环",
    groundTruth:
      "viewBox 为 0 0 640 400；24 根长 28 px 铁屑位于 x=80+96c、y=70+80r（c=0..5, r=0..3）且全周期不平移；圆磁极按 x(t)=320+160*sin(2*pi*t/8)、y(t)=200 往复运动；在 t=0,2,4,6,8s 时各铁屑转角符合 atan2(y_magnet-y_filing, x_magnet-x_filing) 误差 <= 2°；首尾帧闭合 MAE === 0 且 max(MAE) >= 0.015；严格 0 <script>。",
    evaluationCriteria:
      "Pass: 24 根铁屑按 6x4 网格分布且仅绕各自中心旋转不平移，磁极简谐运动与 5 个采样时刻朝向误差均 <= 2°，首尾闭合 MAE === 0 且 max(MAE) >= 0.015，0 <script>；Partial: 磁极在移动但铁屑转角与磁极脱节、仅少数旋转或采样误差 > 2°；Fail: 铁屑随磁铁平移、随机抖动、含 <script>、静态死图（max(MAE) < 0.015）或 XML 语法错误。",
    referenceSource: "https://x.com/MiaAI_lab/status/2119930229661503893",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey: "6x4 Grid of 24 In-Place Pivoting Iron Filings, Real-Time atan2 Pole Tracking & T=8s Harmonic Magnet Loop",
  groundTruth:
    "viewBox is 0 0 640 400; 24 line filings of length 28 px centered at x=80+96c, y=70+80r (c=0..5, r=0..3) rotate in place without translating; round magnet translates along x(t)=320+160*sin(2*pi*t/8), y(t)=200 over T=8s; at t=0,2,4,6,8s every filing aligns with atan2(y_magnet-y_filing, x_magnet-x_filing) within 2 degrees; seamless loop closure MAE === 0 with max(MAE) >= 0.015; strictly 0 <script> tags.",
  evaluationCriteria:
    "Pass: All 24 filings remain fixed on the 6x4 grid and pivot around their centers within 2 degrees of atan2 at t=0,2,4,6,8s while the magnet oscillates smoothly, seamless loop MAE === 0 and max(MAE) >= 0.015, 0 <script>; Partial: Magnet moves but filings decouple, only a subset rotates, or angle error exceeds 2 degrees; Fail: Filings translate or jitter randomly, <script> present, static image (max(MAE) < 0.015), or malformed XML.",
};

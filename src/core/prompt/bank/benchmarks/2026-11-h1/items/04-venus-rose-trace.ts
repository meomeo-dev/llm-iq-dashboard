import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-venus-rose-trace-v1",
  label: "金星五瓣相对轨道 (Animated Venus Five-Petal Relative Orbit)",
  template: [
    "Generate one self-contained animated SVG of the geocentric relative orbit of Venus under an exact 13:8 period ratio. No labels, no planets as illustrations, no script.",
    'Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 640 640". CDATA around any <style>.',
    "Earth is fixed at (320,320). Use circular coplanar orbits and an exact ratio, so the curve closes:",
    "E(t) = (cos(2*pi*t/16), sin(2*pi*t/16))",
    "V(t) = 0.723 * (cos(13*2*pi*t/16), sin(13*2*pi*t/16))",
    "R(t) = V(t) - E(t)",
    "Screen point = (320,320) + 150 * R(t)",
    "t runs from 0 to 16 seconds, standing for 8 years.",
    "A pen of radius 3 follows that point. A polyline or path stroke reveals the curve as the pen moves, using stroke-dashoffset only. At t = 0 and t = 16 the pen is at the same coordinate, the stroke state matches, and pixel MAE is 0.",
    "The finished curve has exactly five inner loops. The five closest approaches of the pen to Earth are 72 degrees apart around (320,320), tolerance 2 degrees. Do not draw a logarithmic spiral. Do not add a sixth petal.",
    "Output only the <svg>.",
  ].join("\n"),
  variables: [],
  candidates: [],
  source: "https://x.com/MiaAI_lab/status/2119930229661503893",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey: "13:8 轨道共振地心矢量差、五内环拓扑与 72° 等分近地点、笔尖与 stroke-dashoffset 同步闭环",
    groundTruth:
      "在 viewBox=\"0 0 640 640\" 中固定地球于 (320,320)，按 R(t)=V(t)-E(t) 映射 (320,320)+150*R(t) 在 T=16s 内封闭绘出恰好 5 个内环；5 次近地点绕中心间距 72°±2°；半径 3 笔尖随动并用 stroke-dashoffset 揭露轨迹；t=0 与 t=16 像素 MAE === 0 且周期内 max(MAE) >= 0.015；0 <script>。",
    evaluationCriteria:
      "Pass: 恰好 5 个内环，5 次近地点间距 72°±2°，笔尖与 stroke-dashoffset 同步，t=0 与 t=16 闭合 MAE === 0 且 max(MAE) >= 0.015，0 <script>；Partial: 瓣数或近地点角距偏差超 ±2°，或笔尖与描边轻微脱节；Fail: 对数螺线/椭圆/六瓣误绘、静态无笔尖运动（max(MAE) < 0.015）、含 <script> 或 XML 语法错误。",
    referenceSource: "https://x.com/MiaAI_lab/status/2119930229661503893",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey: "13:8 Orbital Resonance Geocentric Vector Difference, Five Inner Loops at 72 deg Spacing, and Pen Stroke-Dashoffset Closure",
  groundTruth:
    'Within viewBox="0 0 640 640", Earth is fixed at (320,320) and screen point (320,320)+150*R(t) with R(t)=V(t)-E(t) traces a closed curve over T=16s with exactly 5 inner loops and 5 closest approaches spaced 72 deg (+/-2 deg) apart; a radius-3 pen follows the point as stroke-dashoffset reveals the curve; t=0 and t=16 match with MAE === 0 and max(MAE) >= 0.015; strictly 0 <script> tags.',
  evaluationCriteria:
    "Pass: Exactly 5 inner loops with 5 closest approaches spaced 72 deg (+/-2 deg), pen synced with stroke-dashoffset reveal, loop closure MAE === 0 and max(MAE) >= 0.015, 0 <script>; Partial: Wrong loop count, closest-approach spacing error > 2 deg, or slight pen-to-stroke desync; Fail: Logarithmic spiral, ellipse, or 6-petal figure, static image with max(MAE) < 0.015, <script> tag, or XML syntax error.",
};

import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-moire-ring-drift-v1",
  label: "同心环莫尔漂移 (Animated Concentric-Ring Moire Drift)",
  template: [
    "Generate one self-contained animated SVG of a moiré interference disk. Black and white only. No text, no script.",
    'Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 640 640". CDATA around any <style>.',
    "Two groups, each 48 concentric circles, center (320,320), radii 12, 20, 28, ... px (8 px pitch), stroke 1.5, no fill. Group A is fixed. Group B rotates about (320,320).",
    "Loop T = 8s, angles linear in each half:",
    "t = 0 and t = 8: group B rotation = 0 degrees, pixels match.",
    "t = 4: group B rotation = +8 degrees exactly.",
    "The return half is the same motion reversed. Do not rotate group A. Do not fade the strokes in and out. The only moving parameter is group B's angle.",
    'The moiré must stay visible as hyperbolic light and dark bands. Optional feBlend mode="difference" is allowed. It must not be required for the angle test: group B remains a measurable transform.',
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
    coreKey: "双组 48 层同心圆环、8 px 等距步长、+8° 线性往返相对旋转与双曲莫尔拍频",
    groundTruth:
      "两组各 48 个同心圆环围绕 (320,320) 绘制，半径 12, 20, 28, ... px（步长 8 px），线宽 1.5、无填充、纯黑白；组 A 固定，组 B 在 8s 周期内由 0° 线性转至 t=4s 的 +8° 再线性返归 t=8s 的 0°；允许可选 feBlend difference 但组 B 必须保留可测变换；双曲莫尔干涉条纹清晰可见；首尾闭合 MAE === 0 且 max(MAE) >= 0.015；0 <script> 与零外部资源。",
    evaluationCriteria:
      "Pass: 两组各 48 环与 8 px 间距准确，纯黑白无填充，组 A 固定且组 B 在 t=4s 达 +8° 并线性往返，双曲莫尔条纹清晰，首尾闭合 MAE === 0 且 max(MAE) >= 0.015，0 <script>；Partial: 存在双层莫尔干涉但峰值角非 +8°、环数或间距偏差，或两组同转导致相对角不可测；Fail: 仅单层旋转、用透明度闪烁伪装干涉、静止图像（max(MAE) < 0.015）、含 <script> 或 XML 语法错误。",
    referenceSource: "https://x.com/MiaAI_lab/status/2119930229661503893",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "Dual 48-Ring Concentric Disks, 8 px Pitch, Linear +8 deg Relative Rotation & Hyperbolic Moire Beats",
  groundTruth:
    "Two groups of 48 concentric circles centered at (320,320) with radii 12, 20, 28, ... px (8 px pitch), stroke-width 1.5, fill none, black and white only; Group A stays fixed while Group B rotates linearly from 0 deg at t=0 to +8 deg at t=4s and back to 0 deg at t=8s; optional feBlend difference is permitted while Group B retains a measurable transform; hyperbolic moire interference bands remain visible; seamless loop closure MAE === 0 with max(MAE) >= 0.015; strictly 0 <script> and zero external assets.",
  evaluationCriteria:
    "Pass: Both groups contain 48 circles at 8 px pitch in black and white with no fill, Group A is stationary, Group B reaches +8 deg at t=4s and reverses linearly, hyperbolic moire bands are visible, seamless closure MAE === 0 and max(MAE) >= 0.015, 0 <script>; Partial: Two-layer moire interference appears but peak rotation is not +8 deg, ring count/pitch deviates, or both layers rotate; Fail: Single rotating circle set, opacity-fade fake interference, static output (max(MAE) < 0.015), <script> tag present, or invalid XML.",
};

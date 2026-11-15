import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-lava-blob-convection-v1",
  label: "熔蜡对流颈缩与合并 (Animated Lava Blob Convection)",
  template: [
    "Generate one self-contained animated SVG of a generic lava lamp. No logo, no text, no glass brand, no script.",
    'Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 360 640". CDATA around any <style>. One bottle silhouette, liquid, and exactly two wax blobs as separate paths.',
    [
      "Loop T = 10s. Blob A starts as one body at the bottom.",
      "0.0–3.0s: it rises. Its vertical velocity changes sign only once, at the apex.",
      "3.0–4.5s: a neck forms. The waist width falls to at most 30% of the body's maximum width, then the path splits into two subpaths.",
      "4.5–7.0s: the upper piece stays near the top; the lower piece falls.",
      "7.0–10.0s: the lower piece merges back, and at t = 10 the shape, position, and pixel values match t = 0.",
    ].join("\n"),
    "Do not teleport the split. Do not fade one blob out and another in. The waist must be geometrically narrow before the split frame.",
    "Output only the <svg>.",
  ].join("\n\n"),
  variables: [],
  candidates: [],
  source: "https://x.com/aitrendz_xyz/status/2120148925445521699",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey: "熔岩灯蜡块浮力上升单次竖向速度反号、分裂前几何颈缩（腰宽 <= 30% 最大宽）与 T=10s 无缝合并闭环",
    groundTruth:
      "纯内联动态 SVG（viewBox 0 0 360 640，SMIL 或 CDATA 内联 CSS，0 <script>，无商标/文字）；含单一瓶身轮廓、液体与两个独立路径蜡块；T=10s 闭环中 Blob A 自底部单体出发，0.0-3.0s 上升且竖向速度仅在顶点反号一次，3.0-4.5s 形成颈缩（腰宽 <= 本体最大宽度的 30%）后再裂分为双子路径，4.5-7.0s 上块滞留高位而下块回落，7.0-10.0s 下块合并复原；t=0 与 t=10s 像素 MAE === 0，周期内 max(MAE) >= 0.015，禁止透明度淡入淡出伪装。",
    evaluationCriteria:
      "Pass: 瓶身、液体与双路径蜡块完整且无品牌文字，0-3s 上升仅一次竖向反号，3-4.5s 分裂前腰宽 <= 30% 最大宽再真实裂分，4.5-7s 上留下降，7-10s 无缝合并使首尾帧 MAE === 0，max(MAE) >= 0.015，0 <script> 且无透明度伪装；Partial: 具升降过程但用透明度切换代替几何颈缩、腰宽 > 30% 或合并后位置/形态漂移；Fail: 双球各自独立上下弹跳、静态死图（max(MAE) < 0.015）、含 <script>/事件处理器或 XML 语法错误。",
    referenceSource: "https://x.com/aitrendz_xyz/status/2120148925445521699",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "Buoyant lava blob rise with single vertical velocity reversal, pre-split geometric necking (waist <= 30% max width), and seamless T=10s merge loop",
  groundTruth:
    "Pure inline animated SVG (viewBox 0 0 360 640, SMIL or CDATA inline CSS, 0 <script>, no brand/logo/text); one bottle silhouette, liquid, and exactly two wax blobs as separate paths; in a T=10s closed loop, Blob A starts as one body at the bottom, rises during 0.0-3.0s with vertical velocity changing sign only once at the apex, forms a neck during 3.0-4.5s with waist width <= 30% of max body width before splitting into two subpaths, holds the upper piece near the top while the lower piece falls during 4.5-7.0s, and merges cleanly back during 7.0-10.0s; pixel MAE === 0 between t=0 and t=10s, max(MAE) >= 0.015, and no opacity-fade faking.",
  evaluationCriteria:
    "Pass: Bottle, liquid, and separate blob paths present without text or brands, single vertical velocity sign reversal at the apex during 0-3s, pre-split geometric necking <= 30% max width before real split in 3-4.5s, upper-hold/lower-fall in 4.5-7s, seamless merge with MAE === 0 at t=10s, max(MAE) >= 0.015, 0 <script>, and no opacity-fade substitution; Partial: Shows rise and fall but uses opacity fades instead of geometric necking, waist > 30%, or drifts after merge; Fail: Two separate blobs bouncing independently, static output (max(MAE) < 0.015), any <script> or event handler, or invalid XML.",
};

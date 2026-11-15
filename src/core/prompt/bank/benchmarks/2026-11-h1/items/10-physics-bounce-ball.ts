import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-physics-bounce-ball-v1",
  label: "物理重量感纯CSS弹跳球 (Animated Physics Squash-and-Stretch Bouncing Ball)",
  template: [
    'Generate one self-contained animated SVG (viewBox="0 0 360 320") of a heavy ball bouncing vertically in place. No text, no brand, no prose, no script.',
    "Technical contract: inline CSS @keyframes wrapped in <style><![CDATA[...]]></style> only (no <script>, no event handlers, no external assets or libraries). Well-formed XML.",
    "Geometry: a horizontal floor datum line at y = 260, a dynamic elliptical contact shadow centered at x = 180 on y = 260, and a 44 px solid circular ball (r = 22) centered at x = 180. The ball drops 150 px vertically from apex (center y = 88) to floor contact (center y = 238, bottom edge y = 260).",
    "Seamless closed loop T = 1.1s: at t = 0 and t = 1.1s the ball is at apex (y = 88, undeformed circle) and pixels match identically (MAE === 0). The ball must feel heavy. Apply squash and stretch ONLY during floor contact: widen 25-30% and flatten 25-30% while preserving approximate 2D cross-sectional area, with zero mid-air distortion during descent or ascent. Anchor transform-origin at the bottom floor contact point (180px 260px) so the squashed ball stays flush on y = 260 without sinking below the floor.",
    "The contact shadow tightens in width and darkens in opacity on impact, and widens and softens as the ball rises to apex.",
    "Easing discipline: strictly DO NOT use ease, ease-in, ease-out, or ease-in-out keywords anywhere in @keyframes or CSS. Assign explicit physics-derived cubic-bezier(...) curves per descent and rebound segment to model gravitational acceleration and deceleration.",
    "Output only the <svg>.",
  ].join("\n\n"),
  variables: [],
  candidates: [],
  source: "https://productwithattitude.com/articles/claude-fable-5-2-design-motion-tests-prompts",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey: "纯CSS @keyframes 物理重力分段 cubic-bezier(...)、触地面积守恒挤压锚定与阴影反向耦合的 1.1s 弹跳闭环",
    groundTruth:
      "纯内联动态 SVG（viewBox 0 0 360 320，仅使用 <style><![CDATA[...]]></style> 内联 CSS @keyframes，0 <script>）；y=260 水平地面线、居中于 (180,260) 的动态椭圆接触阴影与直径 44 px 实心圆球（r=22，x=180）；球体从最高点 y=88 垂直下落 150 px 至触地点 y=238（下沿贴合 y=260）；T=1.1s 无缝闭环，仅在触地阶段横向加宽 25-30%、纵向压扁 25-30%（近似保持二维截面积），transform-origin 锚定于地面接触点 (180px 260px) 而不穿地，半空中零形变；接触阴影在撞击时收窄变深、在最高点展宽变淡；严格禁用 ease/ease-in/ease-out/ease-in-out 关键字而分段使用物理推导的 cubic-bezier(...)；t=0 与 t=1.1s 像素 MAE === 0 且周期内 max(MAE) >= 0.015。",
    evaluationCriteria:
      "Pass: 几何尺寸与 150 px 落差准确，T=1.1s 闭环，仅触地挤压 25-30% 且底部锚定于 y=260 不穿模、半空无拉伸，阴影触地收窄加深、高点展宽变淡，全程无 ease* 关键字而使用分段 cubic-bezier(...)，首尾帧 MAE === 0 且 max(MAE) >= 0.015，0 <script>；Partial: 弹跳闭环与阴影联动成立，但存在轻微半空形变、挤压比例或锚定轻微越界，或仅单段使用 cubic-bezier(...)；Fail: 含 <script> 或事件属性，使用 ease/ease-in/ease-out/ease-in-out 关键字，静止死图（max(MAE) < 0.015），首尾帧不重合（MAE > 0），无挤压或无接触阴影，或含非 SVG 文本/XML 错误。",
    referenceSource: "https://productwithattitude.com/articles/claude-fable-5-2-design-motion-tests-prompts",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "Pure CSS @keyframes physics-derived cubic-bezier(...) segments, floor-anchored area-preserving squash, and coupled shadow in a 1.1s bounce loop",
  groundTruth:
    "Self-contained inline animated SVG (viewBox 0 0 360 320, inline CSS @keyframes inside <style><![CDATA[...]]></style> only, 0 <script>); horizontal floor datum at y=260, dynamic elliptical contact shadow centered at (180, 260), and solid 44 px ball (r=22, x=180) dropping 150 px from apex center y=88 to floor contact center y=238 (bottom edge y=260); exact T=1.1s closed loop where squash and stretch occur ONLY on floor contact (widening 25-30% and flattening 25-30% to preserve approximate 2D cross-sectional area) with transform-origin anchored at the floor contact point (180px 260px) so the ball never sinks below y=260 and shows zero mid-air distortion; contact shadow tightens and darkens on impact and widens and softens at apex; strictly zero ease/ease-in/ease-out/ease-in-out keywords with explicit physics-derived cubic-bezier(...) per segment; pixel MAE === 0 between t=0 and t=1.1s and max(MAE) >= 0.015.",
  evaluationCriteria:
    "Pass: Accurate 44 px ball and 150 px drop to y=260 floor, T=1.1s loop, 25-30% squash anchored flush on y=260 only during floor contact with zero mid-air distortion, shadow tightens/darkens on impact and widens/softens at apex, explicit per-segment cubic-bezier(...) with zero ease* keywords, t=0 and t=1.1s pixel MAE === 0 with max(MAE) >= 0.015, and 0 <script>; Partial: Looping bounce and shadow coupling work but show slight mid-air distortion, inaccurate squash ratio or anchor drift, or incomplete segmented cubic-bezier(...) easing; Fail: Contains <script> or event handlers, uses ease/ease-in/ease-out/ease-in-out keywords, static output (max(MAE) < 0.015), non-zero loop seam (MAE > 0), missing squash or contact shadow, non-SVG prose, or invalid XML.",
};

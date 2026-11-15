import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-sailboat-wake-waves-v1",
  label: "帆船乘浪俯仰与开尔文尾迹动效 (Animated Sailing Sloop, Wave Heave & Kelvin Wake)",
  template: [
    "Generate one self-contained animated SVG of a sailing sloop riding ocean waves at golden hour with a Kelvin V-wake. No text, no brand, no audio, no script, no event handlers, no external assets.",
    'Technical contract: Pure inline SVG with SMIL (<animate>, <animateTransform>) or CSS @keyframes inside <style><![CDATA[...]]></style> only. 0 <script>. viewBox="0 0 820 500". Well-formed XML. Closed loop T = 6s: the frame at t = 6s must be pixel-identical to t = 0s (MAE === 0), with clear continuous motion inside the loop (max(MAE) >= 0.018).',
    "Scene and hydrodynamics:",
    "1. Atmosphere & Horizon: A twilight/golden-hour marine sky linearGradient fading smoothly into a deep sea horizon line at y = 265.",
    "2. Tiled Periodic Trochoidal Wave Trains: At least 3 depth-layered ocean wave bands from y = 265 down to y = 500. Each wave band must be drawn as a periodic repeating profile that translates horizontally by an exact integer number of wave periods over T = 6s (or an integer divisor of 6s) so t = 6s overlays t = 0s with zero phase seam. Accent foreground wave facets with animated broken sunlit reflection shimmer dashes (#fde68a and #38bdf8).",
    "3. Coupled Sailing Sloop: A single-masted Bermuda sloop in 3/4 oblique view with an angled hull, tapered mast, horizontal boom, taut forestay and backstay, and convex wind-billowed mainsail and triangular jib with subtle internal batten lines. Group the entire boat so it executes smooth vertical heave and +/-4 deg pitch around a transform-origin at the mid-hull waterline, phase-locked to the passing wave crest so the hull waterline never floats in mid-air above wave troughs and all sails stay attached to the mast, boom, and stays.",
    "4. Kelvin V-Wake & Bow Spray: Feathered translucent white-cyan foam wake chevron ribbons trailing diagonally aft from the stern across the water surface, plus subtle bow spray, expanding and fading periodically in strict sync with the T = 6s cycle.",
    "Output only the <svg>.",
  ].join("\n\n"),
  variables: [],
  candidates: [],
  source: "https://www.aifire.co/p/gemini-4-carbon-takes-on-coding-3d-and-agent-swarm-tests",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey:
      "y=265 暮色海天渐变地平线、>=3 层整数周期次摆线海浪无缝平铺、水线耦合升沉与 +/-4 度波峰锁相俯仰及 T=6s 开尔文 V 形尾迹闭环",
    groundTruth:
      '纯内联动态 SVG（viewBox="0 0 820 500"），0 <script> 与零外部资源；y=265 海天渐变地平线下方含 >=3 层整数周期平移的次摆线海浪带及 #fde68a/#38bdf8 碎波高光；3/4 斜视角百慕大帆船含船体、渐细桅杆、横桁、前后支索与带帆骨线的鼓风主帆/前帆，整船围绕水线中点做与波峰锁相的垂直升沉与 +/-4 度俯仰，船底不悬空且帆索不脱节；船尾斜后方展开随 T=6s 同步脉动消退的半透明白青色开尔文 V 形尾迹与船首浪花；t=0s 与 t=6s 像素 MAE === 0，周期内 max(MAE) >= 0.018。',
    evaluationCriteria:
      "Pass: 满足 y=265 地平线、>=3 层无缝平铺海浪带与碎波高光、帆船索具完整连结且水线锁相升沉与 +/-4 度俯仰不悬空、开尔文 V 形尾迹同步舒展消退、t=0s 与 t=6s 首尾帧 MAE === 0、max(MAE) >= 0.018 且 0 <script>；Partial: 造型与闭环基本成立但海浪平铺接缝跳变、船体水线偶有浮空、缺少波峰锁相或尾迹无明显周期性扩展；Fail: 静态无运动（max(MAE) < 0.018）、首尾帧严重错位、帆船部件脱节、含 <script>/外部资产或 XML 无效。",
    referenceSource:
      "https://www.aifire.co/p/gemini-4-carbon-takes-on-coding-3d-and-agent-swarm-tests",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "Golden-Hour Marine Horizon at y=265, >=3 Seamlessly Tiled Trochoidal Wave Trains, Wave-Locked Sloop Heave & +/-4 deg Pitch, and T=6s Kelvin V-Wake Loop",
  groundTruth:
    'Pure inline animated SVG (viewBox="0 0 820 500") with 0 <script> and zero external assets; twilight/golden-hour sky linearGradient meeting the deep sea horizon at y=265; >=3 depth-layered periodic trochoidal wave bands translating horizontally by an exact integer number of wavelengths over T=6s (or an integer divisor of 6s) with animated #fde68a and #38bdf8 sunlit water shimmer dashes; 3/4 oblique single-masted Bermuda sloop with angled hull, tapered mast, horizontal boom, taut forestay/backstay, and convex billowed mainsail and triangular jib with internal battens executing smooth vertical heave and +/-4 deg pitch around mid-hull waterline transform-origin phase-locked to passing wave crests without mid-air hull floating or rigging detachment; feathered translucent white-cyan Kelvin V-wake chevrons and bow spray pulsing in sync with T=6s; pixel-identical t=0s and t=6s frames (MAE === 0) and max(MAE) >= 0.018.',
  evaluationCriteria:
    "Pass: y=265 marine horizon gradient present, >=3 seamlessly tiled periodic wave trains with #fde68a/#38bdf8 shimmer, complete sloop rigging with wave-crest-locked heave and +/-4 deg pitch keeping the waterline seated and sails attached, periodic Kelvin V-wake expansion/fade, exact t=0s/t=6s loop match (MAE === 0), max(MAE) >= 0.018, and 0 <script>; Partial: Recognizable sloop and layered waves within a 6s loop but visible tiling phase seam, occasional hull float above troughs, uncoupled pitch, or static wake lines; Fail: Static output (max(MAE) < 0.018), broken t=0s/t=6s loop continuity, detached hull/sails, any <script>/external dependency, or malformed XML.",
};

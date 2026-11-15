import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-viennese-piano-action-v1",
  label: "18世纪维也纳拨弦式钢琴击弦机剖面动效 (Animated 18th-Century Viennese Piano Action Cutaway)",
  template: [
    "Generate one self-contained animated 2D mechanical cutaway SVG of an 18th-century Viennese Prellmechanik grand piano single-key escapement action. No maker name, no brand, no audio, no script.",
    'Technical contract: SMIL (<animate>, <animateTransform>) or inline <style><![CDATA[...]]></style> CSS @keyframes only. Strictly 0 <script> and 0 event handlers. viewBox="0 0 820 460". Well-formed XML.',
    "Visual style: warm mechanical schematic on dark slate #11161d, brass #d97706, pearwood/maple tones #e5b887 and #b45309, tensioned steel treble string #e2e8f0, crisp exploded pivot pins, and dashed arc guides.",
    "Authentic Viennese Prellmechanik topology:",
    "1. Fixed keybed and balance-rail fulcrum pin supporting a horizontal key lever (front key head on the left, key tail extending right).",
    "2. Brass/wood fork bracket (Kapsel) mounted directly onto the rear section of the key lever, carrying a backward-facing pivoted hammer shank whose tapered felt-tipped hammer head points forward/left above the balance rail (NOT mounted on a separate hammer rail).",
    "3. Fixed rear escapement rail and spring-loaded escapement hopper/beak (Auslosezunge) positioned so its upper ledge engages the rear hammer tail (Schnabel) until key elevation trips the beak backward.",
    "4. Overhead damper arm with felt pad resting on a fixed horizontal steel string strung cleanly between a left pin block and a right bridge pin, plus a backcheck lip catching hammer rebound.",
    "Closed kinematic loop T = 4s (t = 0s and t = 4s pixel-identical):",
    "- 0.0s-0.7s: front key depresses smoothly downward about the balance pin (~5-7 deg); key tail and fork rise, pushing the hammer tail under the escapement beak so the hammer head swings rapidly upward toward the string while the damper lifts cleanly off the string.",
    "- 0.7s-1.0s: hammer crown strikes the string cleanly at t ~= 0.85s with a brief impact ring; escapement beak snaps free so the hammer rebounds slightly below the string even while the key remains momentarily held down (escapement check phase, zero clipping through the string).",
    "- 1.0s-1.8s: horizontal string oscillates in a clear fundamental standing-wave envelope anchored at both bridge endpoints, decaying smoothly.",
    "- 1.8s-4.0s: front key rises back to rest, spring beak resets under the hammer butt, and damper settles cleanly onto the stationary string so t = 4.0s matches t = 0.0s identically.",
    "Output only the <svg>.",
  ].join("\n\n"),
  variables: [],
  candidates: [],
  source: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey:
      "18世纪维也纳 Prellmechanik 键载音叉托架拓扑、弹簧擒纵喙脱开回落、零穿模击弦与 T=4s 闭环驻波",
    groundTruth:
      "viewBox=\"0 0 820 460\" 纯内联动态 SVG：键尾直接固定音叉托架（Kapsel）而非独立槌档，朝左前方指出的锥形毡槌柄枢接于音叉上；后部固定擒纵档带弹簧擒纵喙（Auslosezunge）啮合槌尾喙（Schnabel）；顶部制音臂压在左右端锚定的水平钢弦上，辅以托木接槌唇。T=4s 闭环：0-0.7s 键前下压 5-7 度带动槌头上甩与制音抬起；0.7-1.0s 约 0.85s 击弦且擒纵喙脱开使槌头在键仍按住时微幅回落至弦下（零穿模）；1.0-1.8s 琴弦两端固定作基频驻波衰减；1.8-4.0s 复位至 t=0s 完全一致（MAE === 0），周期内 max(MAE) >= 0.015；0 <script>；不含任何制琴师或品牌名称。",
    evaluationCriteria:
      "Pass: 严格符合键载音叉与朝左槌头等维也纳 Prellmechanik 拓扑，0.85s 击弦无穿模且具擒纵脱开回落阶段，琴弦两端锚定驻波衰减，t=0s 与 t=4s 像素 MAE === 0 且 max(MAE) >= 0.015，0 <script> 且无制琴师/品牌词汇；Partial: 闭环与连杆可动但错用独立槌档、缺少擒纵回落或琴弦未锚定两端；Fail: 静态（max(MAE) < 0.015）、槌头穿弦、拓扑严重缺失、含 <script> 或出现品牌/人名。",
    referenceSource:
      "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "18th-Century Viennese Prellmechanik Key-Mounted Kapsel Topology, Escapement Beak Release, Zero-Clip Strike & T=4s Standing-Wave Loop",
  groundTruth:
    "Pure inline animated SVG (viewBox=\"0 0 820 460\"): horizontal key lever on a balance pin carrying a rear-mounted fork bracket (Kapsel, NOT an independent hammer rail) with a backward-pivoted shank whose tapered felt hammer points forward/left; fixed rear escapement rail with spring-loaded beak (Auslosezunge) engaging the hammer tail (Schnabel); overhead damper arm on a horizontal steel string anchored at left pin block and right bridge pin, plus backcheck lip. Closed T=4s loop: 0.0-0.7s front key depresses 5-7 deg lifting tail/fork and damper as hammer swings up; 0.7-1.0s hammer strikes string near t=0.85s and escapement trips so hammer rebounds cleanly below string while key stays down (zero clipping); 1.0-1.8s string oscillates in decaying fundamental standing wave anchored at both ends; 1.8-4.0s full reset so t=4.0s equals t=0.0s (pixel MAE === 0), max(MAE) >= 0.015, 0 <script>, and zero maker or brand names.",
  evaluationCriteria:
    "Pass: Authentic key-mounted Prellmechanik topology with left-pointing hammer, clean t=0.85s strike with zero string clipping and escapement rebound check, anchored standing-wave string decay, pixel MAE === 0 between t=0s and t=4s, max(MAE) >= 0.015, 0 <script>, and zero maker/brand names; Partial: Closed-loop motion works but places hammer on a separate rail, omits escapement rebound, or translates string unanchored; Fail: Static output (max(MAE) < 0.015), hammer clips through string, missing key topology parts, any <script>, or any maker/brand text.",
};

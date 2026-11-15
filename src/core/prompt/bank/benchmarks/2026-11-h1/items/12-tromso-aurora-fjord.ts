import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-tromso-aurora-fjord-v1",
  label: "特罗姆瑟峡湾极光闭环动效 (Animated 69°N Fjord Aurora Curtains)",
  template: [
    "Generate one self-contained animated SVG of a 69°N polar fjord night scene with layered aurora borealis curtains and calm water reflections. No text, no brand, no real people, no audio, no script.",
    'Technical contract: SMIL (<animate>, <animateTransform>) or inline CSS @keyframes inside <style><![CDATA[...]]></style> only. 0 <script>, 0 event handlers, 0 Canvas/WebGL, 0 external assets or fonts. viewBox="0 0 800 500". Well-formed XML.',
    "Scene layers and coordinates:",
    "1. Polar night sky: vertical dark gradient from #070b14 at zenith to #0d1829 near horizon y = 330, with a crisp sub-pixel starfield across the upper sky using staggered subtle twinkle phase offsets.",
    "2. Static fjord terrain: jagged snow-capped polar mountain silhouettes flanking the left and right edges, converging at horizon y = 330 to frame a central fjord channel, plus 3 to 5 tiny static warm amber (#fbbf24) cabin or harbor windows anchored just above y = 330. Mountains, horizon, and shore lights must remain strictly static (0 drift).",
    "3. Aurora curtains: at least 3 layered luminous aurora borealis curtains—emerald (#34f5a3), cyan (#38bdf8), and an upper violet-magenta (#a855f7) veil—built with vertical ray striations and soft SVG gradient masks whose undulating wave ribbons, horizontal drift, and opacity breathe smoothly.",
    "4. Fjord water reflection: calm dark water below y = 330 displaying vertically mirrored, horizontally rippled green-cyan aurora reflections and dark shoreline reflections.",
    "Closed loop T = 8s: every animation must use an 8s period (or integer divisor such as 4s/8s) with periodic phase so t = 0s and t = 8s are pixel-identical (MAE === 0), while mid-cycle motion produces clear curtain undulation and shimmer (max(MAE) >= 0.015).",
    "Output only the <svg>.",
  ].join("\n\n"),
  variables: [],
  candidates: [],
  source: "https://x.com/MichaelGannotti/status/2119922137011982652",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey: "三层以上极光射线帷幕、y=330 静止峡湾山体与镜像水波倒影及 T=8s 无缝闭环",
    groundTruth:
      "viewBox=\"0 0 800 500\" 纯内联声明式 SVG；极夜天幕由 #070b14 渐变至 #0d1829 并带错相微星；左右积雪峡湾山体收敛于 y=330 水平线且零漂移，岸线正上方有 3-5 个静止暖琥珀 #fbbf24 窗灯；至少 3 层极光帷幕（翠绿 #34f5a3、青色 #38bdf8、高空紫红 #a855f7）具备纵向射线纹理与渐变遮罩；y=330 以下峡湾水面呈垂直镜像且带横向涟漪的绿青极光及岸线倒影；闭环周期 T=8s，t=0s 与 t=8s 像素 MAE === 0，周期内 max(MAE) >= 0.015，0 <script>。",
    evaluationCriteria:
      "Pass: 0 <script> 且 XML 合法，满足 800x500 构图、错相星空、静止积雪峡湾山体与 3-5 处静止 #fbbf24 岸灯，至少 3 层带纵向射线纹理的 #34f5a3/#38bdf8/#a855f7 极光帷幕与 y=330 以下镜像涟漪倒影，t=0s 与 t=8s MAE === 0 且 max(MAE) >= 0.015；Partial: 具备峡湾构图与极光闭环但不足 3 层、缺纵向射线或倒影涟漪，或首尾存在轻微接缝；Fail: 静态无波动（max(MAE) < 0.015）、山体岸灯漂移、无水面反射、含 <script>/Canvas/WebGL/外链/品牌或真实人物，或 XML 语法错误。",
    referenceSource: "https://x.com/MichaelGannotti/status/2119922137011982652",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "3+ Layered Aurora Ray Curtains, Static y=330 Fjord Silhouettes, Mirrored Water Ripples & Seamless T=8s Closed Loop",
  groundTruth:
    'Self-contained declarative SVG with viewBox="0 0 800 500"; polar night sky gradient (#070b14 to #0d1829) with staggered twinkling sub-pixel starfield; static snow-capped fjord mountains flanking left/right and meeting at horizon y=330 (0 drift), anchored with 3-5 static warm amber (#fbbf24) cabin/harbor lights above y=330; at least 3 layered aurora curtains (emerald #34f5a3, cyan #38bdf8, upper violet-magenta #a855f7) with vertical ray striations and soft gradient masks; fjord water below y=330 showing vertically mirrored, horizontally rippled green-cyan aurora and shoreline reflections; exact T=8s loop with t=0s and t=8s pixel MAE === 0, mid-cycle max(MAE) >= 0.015, and strictly 0 <script>.',
  evaluationCriteria:
    "Pass: Valid XML with 0 <script> and viewBox 800x500, polar sky and staggered star twinkle, strictly static mountains and 3-5 #fbbf24 shore windows above y=330, >= 3 striated #34f5a3/#38bdf8/#a855f7 aurora curtains with mirrored rippled water reflections below y=330, t=0s/t=8s MAE === 0, and max(MAE) >= 0.015; Partial: Fjord terrain and loop present but fewer than 3 aurora layers, missing vertical rays or rippled reflection, or minor loop seam; Fail: Static scene (max(MAE) < 0.015), drifting mountains/lights, missing water reflection, any <script>/Canvas/WebGL/external assets/brands/real people, or invalid XML.",
};

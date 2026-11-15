import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-mech-nyc-stomps-hud-v1",
  label: "等轴测网格机甲踩踏与冲击波HUD (Animated Isometric Mech Stomp Traversal & Shockwave HUD)",
  template: [
    "Generate one self-contained animated SVG of an isometric heavy mech stomping across a steel-arch bridge into a street-grid intersection with a telemetry HUD. No external APIs, no OSM tiles, no Three.js, no WebGL, no Canvas, no audio, no brands, no real people, no script, and no inline event handlers.",
    'Technical contract: SMIL (<animate>, <animateTransform>) or inline CSS only. 0 <script>. viewBox="0 0 840 520". Any <style> goes in CDATA. Well-formed XML. Only concise HUD telemetry text ("STRIDE CADENCE", "L-FOOT", "R-FOOT", "A"-"D") is allowed.',
    "1. 30-degree Isometric Borough-Bridge Street Grid: render crisp isometric avenue blocks (sectors A-D), stepped prism towers 20-75 px tall, an isometric river channel, and a steel-arch suspension bridge with cables spanning from the north shore into the midtown intersection grid using pure SVG polygons and paths.",
    "2. Heavy Articulated Mech Patrol (Closed Loop T = 6s): render an articulated bipedal mech striding across the bridge apron into the intersection and returning smoothly along a forward-back or figure-eight patrol loop. Pixel states at t = 0s and t = 6s must be identical (MAE === 0), with clear motion amplitude inside the loop (max(MAE) >= 0.020). Left foot plants firmly at t = 1.5s and right foot plants firmly at t = 4.5s, with synchronized hip/knee/ankle leg articulation and torso bob.",
    "3. Concentric Shockwave Rings & Structural Sway: on each planted footfall (t = 1.5s and t = 4.5s), emit 2 concentric dashed or solid elliptical shockwave rings aligned to the 30-degree isometric ground plane that expand from the planted foot and fade to opacity 0 before loop wrap, paired with subtle 1-2 px elastic recoil on adjacent bridge cables and towers.",
    '4. Vector Telemetry HUD Panel: dock a dark-slate corner bezel (opacity <= 0.92, zero occlusion of the intersection stomp zone) displaying "STRIDE CADENCE", an animated dual-bar step impact meter ("L-FOOT" peaking at t = 1.5s, "R-FOOT" peaking at t = 4.5s), and an active sector dot tracking the mech inside a mini isometric radar inset purely via SMIL or CSS.',
    "Output only the <svg>.",
  ].join("\n\n"),
  variables: [],
  candidates: [],
  source: "https://simonwillison.net/2026/Nov/10/llm-gemini/",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey: "30度等轴测街区桥梁、T=6s双足机甲踩踏闭环、等轴测椭圆冲击波与同步遥测HUD",
    groundTruth:
      "viewBox='0 0 840 520'纯内联动态SVG且0<script>与零外链；30度等轴测街区含A-D分区街块、20-75px阶梯棱柱楼宇、河道与钢拱悬索桥；双足关节机甲在T=6s闭环内沿桥面往返或8字巡逻至十字路口，t=0s与t=6s像素完全一致（MAE === 0），周期内max(MAE) >= 0.020；左足t=1.5s、右足t=4.5s落地各触发2道贴合等轴测地面的同心椭圆冲击波并淡出，邻近桥索与塔楼伴随1-2px弹性回弹；角落暗石板HUD（opacity <= 0.92）无遮挡显示STRIDE CADENCE、同步峰值L-FOOT/R-FOOT冲击条及迷你雷达追踪光点。",
    evaluationCriteria:
      "Pass: 30度等轴测街区与悬索桥结构清晰，机甲T=6s闭环巡逻且t=0s/6s MAE === 0、max(MAE) >= 0.020，t=1.5s与t=4.5s落足各触发2道等轴测椭圆冲击波及1-2px桥索/塔楼回弹，非遮挡HUD双柱与雷达点相位同步且0 <script>；Partial: 街区与闭环运动成立，但冲击波呈正圆、桥梁无回弹或HUD未同步脚步相位；Fail: 静态图（max(MAE) < 0.020）、首尾跳变、无关节硬平移、HUD遮挡主区、含<script>/外链资源或XML无效。",
    referenceSource: "https://simonwillison.net/2026/Nov/10/llm-gemini/",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "30-Degree Isometric Bridge-Grid, T=6s Bipedal Mech Stomp Loop, Elliptical Ground Shockwaves & Synced Telemetry HUD",
  groundTruth:
    "Pure inline animated SVG (viewBox='0 0 840 520') with 0 <script>, zero external assets/OSM/Three.js, and SMIL or CDATA CSS keyframes only; 30-degree isometric avenue grid (sectors A-D), 20-75 px stepped prism towers, isometric river channel, and steel-arch suspension bridge; articulated bipedal mech completes a closed T=6s bridge-to-intersection patrol loop with identical states at t=0s and t=6s (pixel MAE === 0) and max(MAE) >= 0.020; left foot plants at t=1.5s and right foot plants at t=4.5s, each emitting 2 concentric isometric ground-plane elliptical shockwaves fading to opacity 0 alongside 1-2 px elastic cable/tower recoil; docked dark-slate corner HUD (opacity <= 0.92, zero stomp-zone occlusion) displays STRIDE CADENCE, phase-synced L-FOOT/R-FOOT impact bars, and an active radar dot.",
  evaluationCriteria:
    "Pass: Crisp 30-degree isometric grid and suspension bridge, closed T=6s articulated mech patrol with MAE === 0 at loop wrap and max(MAE) >= 0.020, 2 isometric elliptical shockwaves plus 1-2 px cable/tower recoil on each footfall (t=1.5s and t=4.5s), non-occluding HUD with synced dual impact bars and radar dot, and 0 <script>; Partial: Correct grid and patrol loop but circular non-isometric shockwaves, missing structural recoil, or desynchronized HUD meters; Fail: Static output (max(MAE) < 0.020), loop-wrap jump, unarticulated rigid translation, HUD occluding the stomp zone, any <script>/external dependency, or malformed XML.",
};

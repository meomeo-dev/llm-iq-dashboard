import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-mech-nyc-atomos-typo-v1",
  label: "北郊机甲起立与港湾步态SVG (Animated Articulated Mech Stand-Up & Harbor Gait)",
  template: [
    "Generate one self-contained animated SVG of a giant bipedal sci-fi mech rising and marching across a stylized metropolitan harbor map. No external assets, no map tile requests, no WebGL, no audio, no script.",
    'Technical contract: Pure inline SVG with SMIL (<animate>, <animateTransform>) or CSS @keyframes inside <style><![CDATA[...]]></style>. Strictly 0 <script> tags and 0 event handlers. viewBox="0 0 800 540". Well-formed XML.',
    "Self-contained vector harbor geography (oblique top-down / orthographic elevation backdrop):",
    '- Deep blue Hudson and East River channels separating four vector land districts: north mainland bank labeled "Yonkers" centered near (180, 140), elongated central island spine labeled "Manhattan", and east shore districts labeled "Queens" and "Brooklyn".',
    "- Include minimalist vector suspension bridge spans across the channels and extruded architectural skyline blocks on the island spine and shore districts.",
    "Articulated giant bipedal mech (foreground/midground, grouped cleanly by joint):",
    "- Distinct hierarchical groups for pelvis, torso with glowing cyan chest core, head visor, left/right multi-segment arms (shoulder, elbow, wrist), and left/right multi-segment legs (hip, knee, ankle, armored feet).",
    '- Display a crisp fictional reactor HUD badge labeled "ATOMOS-CORE" and a vertical height/posture HUD gauge ("0m" to "120m") whose indicator bar rises and lowers in exact phase with the mech.',
    "Closed kinematic loop T = 8s (t=0s and t=8s pixel-identical, MAE === 0, peak motion max(MAE) >= 0.020):",
    "- t=0s: crouch-ready stance anchored on the north Yonkers bank, HUD bar at 0m.",
    "- t=0s to t=2.5s: knees extend, pelvis lifts, torso straightens to towering upright stance (HUD bar climbs to 120m), cyan chest reactor pulses and dorsal stabilizer vents flare.",
    "- t=2.5s to t=5.5s: alternating left-right heavy-footed harbor march cadence (coordinated hip/knee bend, firm ankle foot-plant, counter-rotating torso and arm swing balance).",
    "- t=5.5s to t=8s: smoothly reverses back into the exact t=0s crouch-ready stance and 0m HUD level so t=8s matches t=0s with zero jump.",
    "Output only the <svg>.",
  ].join("\n\n"),
  variables: [],
  candidates: [],
  source: "https://simonwillison.net/2026/Nov/10/yonkers-rises/",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey:
      "自包含港湾岛屿矢量拓扑、多关节双足机甲起立-踏步闭环运动学与 ATOMOS-CORE 高度 HUD 同相联动",
    groundTruth:
      "viewBox='0 0 800 540' 纯内联声明式动态 SVG（0 <script>、0 外部地图/脚本请求）；斜俯视港湾矢量地图包含北岸 Yonkers（(180,140) 附近）、中央岛脊 Manhattan、东岸 Queens 与 Brooklyn、深蓝双河道、悬索桥与挤出建筑体块；多连杆机甲独立分层（躯干+青色核心、头镜、双臂肩/肘/腕、骨盆、双腿髋/膝/踝/装甲足）；含 ATOMOS-CORE 标识与 0m-120m 高度 HUD 柱；T=8s 闭环完成蹲伏起立、核心脉动/喷口点火、左右交替踏步并平滑回蹲，t=0 与 t=8 首尾像素 MAE === 0，周期内 max(MAE) >= 0.020。",
    evaluationCriteria:
      "Pass: 港湾四区与双河道桥跨建筑完整且纯矢量自包含，机甲四肢与躯干按关节分层清晰，HUD 含 ATOMOS-CORE 与 0m-120m 同相高度条，T=8s 完整演绎蹲伏-起立-交替重步-回蹲且首尾 MAE === 0、max(MAE) >= 0.020、0 <script>；Partial: 场景与机甲大致成立且有循环动画，但关节未分节耦合、HUD 不同相或首尾轻微跳变；Fail: 静态（max(MAE) < 0.020）、含 <script> 或外部资源请求、首尾不闭合或 XML 无效。",
    referenceSource: "https://simonwillison.net/2026/Nov/10/yonkers-rises/",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "Self-Contained Harbor Island Vector Topology, Articulated Bipedal Mech Stand-Up & Gait Kinematics, and Phase-Locked ATOMOS-CORE HUD",
  groundTruth:
    "viewBox='0 0 800 540' pure inline declarative animated SVG with 0 <script> and 0 external map/API requests; oblique orthographic harbor vector map featuring north bank Yonkers near (180,140), central spine Manhattan, east shore Queens and Brooklyn, deep blue Hudson and East River channels, suspension bridge spans, and extruded skyline blocks; articulated mech with hierarchical torso, glowing cyan core, head visor, shoulder-elbow-wrist arms, pelvis, and hip-knee-ankle-foot legs; fictional ATOMOS-CORE HUD badge and 0m-120m vertical height bar oscillating in phase; closed T=8s loop from crouch-ready (t=0) through upright rise, reactor pulse/vent flare, alternating heavy-footed march, and smooth return to t=0 posture with pixel MAE === 0 and max(MAE) >= 0.020.",
  evaluationCriteria:
    "Pass: Self-contained vector harbor districts, channels, bridges, and skyline blocks; multi-segment articulated mech joints with coordinated stand-up and alternating gait; ATOMOS-CORE label and phase-locked 0m-120m height bar; T=8s loop with t=0 and t=8 MAE === 0, max(MAE) >= 0.020, and 0 <script>; Partial: Harbor and mech present with periodic motion, but rigid limbs, unsynced HUD gauge, or slight end-frame seam; Fail: Static image (max(MAE) < 0.020), any <script> or external tile/WebGL dependency, non-closed loop, or malformed XML.",
};

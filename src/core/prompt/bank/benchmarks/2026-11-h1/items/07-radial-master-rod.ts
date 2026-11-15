import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-radial-master-rod-v1",
  label: "九缸星形发动机主副连杆 (Animated Nine-Cylinder Radial Master Rod)",
  template: [
    "Generate one self-contained animated SVG cutaway of a nine-cylinder radial engine, front view. No title, no brand, no script, no CDN.",
    'Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 640 640". CDATA around any <style>. Navy background, flat technical colors.',
    "Nine cylinders at 0, 40, 80, ..., 320 degrees. Cylinder 1 is at the top. One crank pin. The master rod of cylinder 1 is pinned to that crank pin. The other eight rods are pinned to the master rod's big end, not to the crank pin. Do not animate the eight pistons with the same sine shifted by 40 degrees.",
    "Loop T = 8s = two crank revolutions = 720 degrees of crank, linear. Each cylinder fires once per 720 degrees. Firing order is 1, 3, 5, 7, 9, 2, 4, 6, 8, which is an 80 degree crank step. A firing is a 0.15s flash in that cylinder only. At t = 0 and t = 8 the crank angle is 0 and every rod matches. Piston motion must reverse at the two ends of the stroke, not slide through the head.",
    "Output only the <svg>.",
  ].join("\n\n"),
  variables: [],
  candidates: [],
  source: "https://x.com/danieldwalton/status/2116649200339599487",
  verified: true,
  immutable: true,
  originDate: "2026-10",
  registeredAt: "2026-11-14",
  standard: {
    coreKey:
      "1 号主连杆与 8 根副连杆非对称铰接拓扑、非等移相正弦活塞行程及 720 度闭环 1-3-5-7-9-2-4-6-8 隔缸发火序",
    groundTruth:
      "纯内联动态 SVG 前视剖视图（viewBox 0 0 640 640，深蓝底色与平面工程配色，0 <script>，无标题/品牌/CDN）；九缸沿 0, 40, ..., 320 度均布且 1 号缸居中朝上；单曲柄销仅连接 1 号主连杆大端，其余 8 根副连杆分别铰接在主连杆大端耳孔而非曲柄销；各活塞于上下止点平滑换向且不穿出缸盖，不以同相移位正弦敷衍；T=8s 周期对应曲轴线性旋转 720 度（两圈），每 80 度曲柄角按 1-3-5-7-9-2-4-6-8 依次在对应气缸内闪光 0.15s；t=0 与 t=8 曲轴归零且像素 MAE === 0，周期内多连杆总成 max(MAE) >= 0.020。",
    evaluationCriteria:
      "Pass: 九缸 40 度均布且 1 号缸在顶，仅 1 号主连杆接曲柄销、8 根副连杆均接于主连杆大端，活塞不穿缸盖且非简单等幅移相正弦，T=8s 线性完成 720 度双转并按 1-3-5-7-9-2-4-6-8 每 80 度单缸闪光 0.15s，首尾帧 MAE === 0 且 max(MAE) >= 0.020，0 <script> 且无标题/品牌/CDN；Partial: 九缸布局与曲轴旋转成立，但 8 根副连杆误直连曲柄销，或发火序按 1-2-3 连续顺序 / 360 度重复；Fail: 含 <script> 或外部 CDN、九活塞套用同一移相正弦或穿模缸盖、静止无动画（max(MAE) < 0.020）、首尾不闭合或 XML 语法错误。",
    referenceSource: "https://x.com/danieldwalton/status/2116649200339599487",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "Asymmetric master-and-articulated rod linkage topology, non-identical-sine piston kinematics, and 720-deg 1-3-5-7-9-2-4-6-8 firing order",
  groundTruth:
    "Pure inline animated SVG front-view cutaway (viewBox 0 0 640 640, navy background with flat technical colors, 0 <script>, no title, brand, or CDN); nine cylinders evenly spaced at 0, 40, ..., 320 deg with Cylinder 1 at top; single crank pin drives Cylinder 1 master rod only, while the eight articulated rods pin to the master rod big end rather than the crank pin; pistons reverse cleanly at top and bottom dead centers without clipping cylinder heads and are not animated as identical 40-deg phase-shifted sines; T=8s closed loop equals two linear crank revolutions (720 deg) with a single 0.15s cylinder firing flash every 80 deg crank step in order 1-3-5-7-9-2-4-6-8; pixel MAE === 0 between t=0 and t=8 with multi-bar assembly max(MAE) >= 0.020.",
  evaluationCriteria:
    "Pass: Nine cylinders at 40-deg intervals with Cylinder 1 at top, only the master rod pinned to the crank pin and all eight articulated rods pinned to the master rod big end, pistons reversing without head clipping or identical-sine shortcut, T=8s linear 720-deg double revolution with 0.15s flashes every 80 deg in order 1-3-5-7-9-2-4-6-8, seamless loop MAE === 0 with max(MAE) >= 0.020, 0 <script>, and no title/brand/CDN; Partial: Nine-cylinder layout and crank rotation work, but the eight articulated rods pin directly to the crank pin or firing runs sequentially 1-2-3 / repeats every 360 deg; Fail: Contains <script> or external CDN, uses identical phase-shifted sines or clips cylinder heads, static output (max(MAE) < 0.020), broken loop closure, or invalid XML.",
};

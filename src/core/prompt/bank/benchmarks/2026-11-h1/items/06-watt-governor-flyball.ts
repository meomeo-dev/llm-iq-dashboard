import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-watt-governor-flyball-v1",
  label: "瓦特飞球调速器 (Animated Watt Flyball Governor)",
  template: [
    "Generate one self-contained animated SVG of a generic Watt flyball governor. Side view. No text, no brand, no steam engine illustration beyond the linkage, no script.",
    'Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 480 640". CDATA around any <style>.',
    "Parts as separate groups: vertical spindle, two flyballs on arms hinged at (240,160), a sliding sleeve, and a valve plug. Arm angle alpha is measured from straight down.",
    "Loop T = 8s, linear in the sine argument:\nalpha(t) = 20 + 25 * sin(pi * t / 8) degrees\nalpha(0) = alpha(8) = 20, alpha(4) = 45. Both balls share alpha and mirror across x = 240. Sleeve height rises 48 px as alpha goes from 20 to 45, and returns. Valve plug moves the opposite way by 36 px. The spindle may spin, but spin does not replace the scored arm angle.",
    "At t = 8 every part matches t = 0. Balls do not detach. Arms do not change length.",
    "Output only the <svg>.",
  ].join("\n\n"),
  variables: [],
  candidates: [],
  source: "https://x.com/thebuggeddev/status/2120201759305998343",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey: "飞球张角 alpha(t)=20+25*sin(pi*t/8) 度镜像展开、滑套上升 48 px 与节流阀塞反向移动 36 px 的三元连杆耦合",
    groundTruth:
      "纯内联动态 SVG（viewBox 0 0 480 640，0 <script>，独立分组含垂直主轴、铰接于 (240,160) 的双飞球臂、滑套及节流阀塞）；T=8s 闭环内两摆臂与竖直向下方向夹角遵循 alpha(t)=20+25*sin(pi*t/8) 度并关于 x=240 镜像（t=0/8 为 20°、t=4 为 45°），臂长恒定且飞球不脱节；滑套随张角增大上移 48 px 并归位，节流阀塞同步反向移动 36 px；首尾帧像素 MAE === 0 且周期内 max(MAE) >= 0.015。",
    evaluationCriteria:
      "Pass: 四大部件独立成组且臂长恒定无脱节，t=4s 飞球张角达 45°±1.5°、t=0/8s 为 20°±1.5° 并关于 x=240 镜像，滑套上升 48 px 且节流阀塞反向移动 36 px，首尾帧 MAE === 0 且 max(MAE) >= 0.015，0 <script>；Partial: 飞球能开合摆动且无脚本，但滑套不跟随、阀塞未反向移动或左右张角不对称；Fail: 含 <script> 或事件属性、只画主轴旋转而飞球张角静止、飞球脱臂或臂长伸缩、静止死图（max(MAE) < 0.015）、出现文字/品牌或 XML 错误。",
    referenceSource: "https://x.com/thebuggeddev/status/2120201759305998343",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "Mirrored flyball arm angle alpha(t)=20+25*sin(pi*t/8) deg coupled with 48 px sleeve rise and opposite 36 px valve plug travel",
  groundTruth:
    "Pure inline animated SVG (viewBox 0 0 480 640, 0 <script>, separate groups for vertical spindle, two flyballs on arms hinged at (240,160), sliding sleeve, and valve plug); over T=8s loop both arms follow alpha(t)=20+25*sin(pi*t/8) deg from straight down mirrored across x=240 (20 deg at t=0/8, 45 deg at t=4) with constant arm length and attached balls; sleeve rises 48 px and returns while valve plug moves 36 px in the opposite direction; pixel MAE === 0 between t=0 and t=8 with max(MAE) >= 0.015.",
  evaluationCriteria:
    "Pass: All four groups separated with rigid arm lengths and attached flyballs, arm angle reaches 45+/-1.5 deg at t=4s and 20+/-1.5 deg at t=0/8s mirrored across x=240, sleeve rises 48 px while valve plug moves opposite 36 px, seamless loop MAE === 0 with max(MAE) >= 0.015, and 0 <script>; Partial: Flyballs swing without script but sleeve fails to follow, valve plug moves in the wrong direction, or left-right symmetry breaks; Fail: Contains <script> or event handlers, only spindle spins while arm angle stays static, detached balls or stretching arms, static output (max(MAE) < 0.015), text/brand labels, or invalid XML.",
};

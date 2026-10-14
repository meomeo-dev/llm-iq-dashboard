/**
 * English display translations for deterministic static/render judge evidence (`gate.evidence`)
 * and criterion reasons (`criterion.reason`).
 */

const GATE_EVIDENCE_PATTERNS: ReadonlyArray<readonly [RegExp, string]> = [
  [/根元素是 <([^>]+)> 而非 <svg>/g, "root element is <$1> instead of <svg>"],
  [/XML 解析无错误/g, "XML parsed without errors"],
  [/XML 解析失败：(.*)$/, "XML parse failed: $1"],
  [/XML 未解析，未检查/g, "XML not parsed, skipped"],
  [/SMIL 动画 (\d+) 个，CSS 动画 (\d+) 个/g, "SMIL animations: $1, CSS animations: $2"],
  [/无脚本、外部引用与位图/g, "No scripts, external references, or bitmaps"],
  [/含 <script>/g, "contains <script>"],
  [/含 <foreignObject>/g, "contains <foreignObject>"],
  [/含 <image>/g, "contains <image>"],
  [/外部引用 (\d+) 处/g, "$1 external reference(s)"],
  [/静态层不认识闸门 (.*)$/, "Unknown static gate $1"],
  [/渲染层不认识闸门 (.*)$/, "Unknown render gate $1"],
  [/没有截到帧/g, "No frames captured"],
  [/(\d+) 帧里 (\d+) 帧与首帧不同/g, "$2 of $1 frames differ from frame 0"],
  [/最大帧差 MAE ([0-9.]+ >= [0-9.]+)/g, "max frame diff MAE $1"],
  [/旋转\/变换节点 (\d+) 个/g, "rotation/transform nodes: $1"],
  [/没有可跟踪的车轮或曲柄，按通过/g, "No trackable wheels or crank; treated as pass"],
  [/(\d+) 个部件全程在画布内/g, "All $1 tracked parts stayed within viewBox"],
  [/^(.*) 有帧跑出画布$/, "$1 moved outside viewBox"],
];

const CRITERION_REASON_PATTERNS: ReadonlyArray<readonly [RegExp, string]> = [
  [/；渲染：/g, "; Render: "],
  [/没有截到帧/g, "No frames captured"],
  [/^闸门 (\S+) 未通过，不计分$/, "Gate $1 failed, scored 0"],
  [/渲染闸门未通过/g, "Render gate failed"],
  [/未找到含圆且带旋转动画的车轮/g, "No rotating wheel with a circle found"],
  [/只找到一个车轮/g, "Only one wheel found"],
  [/车轮之外没有旋转动画，未找到曲柄/g, "No rotating element outside wheels; crank not found"],
  [/(\S+) 的 animateTransform 未加 additive="sum"，动画会覆盖自身 transform/g, '$1 animateTransform lacks additive="sum", overriding its own transform'],
  [/animateTransform 未加 additive="sum"，动画会覆盖自身 transform，轮子会飞离/g, 'animateTransform lacks additive="sum", overriding transform and detaching wheel'],
  [/(\S+) 的 SMIL rotate 已写中心点，元素又带 CSS transform-origin，两者叠加会飞离/g, "$1 has both SMIL rotate center and CSS transform-origin, causing off-center drift"],
  [/SMIL rotate 已写中心点，元素又带 CSS transform-origin，两者叠加会绕两倍处旋转飞离/g, "Both SMIL rotate center and CSS transform-origin set, doubling pivot offset"],
  [/transform-box: fill-box 且原点居中/g, "transform-box: fill-box with centered origin"],
  [/旋转中心无法静态判定/g, "Rotation center cannot be determined statically"],
  [/（路径含非平移变换，量测不精确）/g, " (path includes non-translation transform, approximate)"],
  [/旋转中心偏离圆心 ([0-9.]+)，半径 ([0-9.]+)/g, "Pivot offset $1 from circle center, radius $2"],
  [/车轮不足两个，无法核对五通位置/g, "Fewer than two wheels, cannot verify bottom bracket position"],
  [/旋转中心无法静态定位/g, "Rotation center cannot be located statically"],
  [/五通 \(([-\d.]+), ([-\d.]+)\) 在两轮之间/g, "Bottom bracket ($1, $2) is between the two wheels"],
  [/五通 \(([-\d.]+), ([-\d.]+)\) 不在两轮之间（轮心 \(([-\d.]+), ([-\d.]+)\) 与 \(([-\d.]+), ([-\d.]+)\)）/g, "Bottom bracket ($1, $2) is not between wheel centers ($3, $4) and ($5, $6)"],
  [/组内的圆偏在曲柄末端，视为脚踏，按位置判/g, "Circle in group is at crank tip (pedal); scored by position"],
  [/曲柄组内无圆，按位置判/g, "No circle in crank group; scored by position"],
  [/没有车轮或曲柄动画/g, "No wheel or crank animations"],
  [/(\d+) 个旋转动画都是 indefinite \/ infinite/g, "All $1 rotation animations are indefinite / infinite"],
  [/(\d+) 个旋转动画不是无限循环：(.*)/g, "$1 rotation animation(s) do not loop indefinitely: $2"],
  [/车轮与曲柄之外没有带时长的动画，未找到腿部运动/g, "No timed animations outside wheels and crank; leg motion not found"],
  [/找到腿部动画 (\S+)，但曲柄周期未知/g, "Found leg animation $1, but crank period is unknown"],
  [/曲柄周期未知且没有命名为腿的动画/g, "Crank period unknown and no leg-named animation found"],
  [/(\S+) 周期 (\d+ms) 与曲柄 (\d+ms) 同步（未命名为腿，是否为腿待渲染层核对）/g, "$1 period $2 synced with crank $3 (unnamed, verified in render layer)"],
  [/(\S+) 周期 (\d+ms) 与曲柄 (\d+ms) 同步/g, "$1 period $2 synced with crank $3"],
  [/(\S+) 周期 (\d+ms) 与曲柄 (\d+ms) 不成整数比/g, "$1 period $2 is not an integer ratio of crank $3"],
  [/(\d+) 个其他动画的周期都与曲柄 (\d+ms) 无关/g, "$1 other animation period(s) unrelated to crank $2"],
  [/无可跟踪的车轮或曲柄/g, "No trackable wheels or crank"],
  [/无可跟踪的车轮/g, "No trackable wheels"],
  [/无可跟踪的曲柄/g, "No trackable crank"],
  [/曲柄未量到/g, "Crank not measured"],
  [/(\S+) 未量到/g, "$1 not measured"],
  [/(\S+) 轮心漂移 ([0-9.]+)/g, "$1 hub drift $2"],
  [/曲柄量测点漂移 ([0-9.]+)（包围盒对角线 ([0-9.]+)）/g, "Crank point drift $1 (bbox diagonal $2)"],
  [/t=(\d+ms) 各部件回到首帧位置，循环闭合/g, "Parts return to frame 0 at t=$1, loop closed"],
  [/t=(\d+ms) 部件与首帧位置差 ([0-9.]+)，循环未闭合/g, "Position gap $2 from frame 0 at t=$1, loop not closed"],
  [/（量不到脚或曲柄，未核对脚踏）/g, " (feet or crank unmeasurable, pedal contact unchecked)"],
  [/(\d+) 条候选腿的脚尖没有一帧碰到脚踏（曲柄伸出 ([0-9.]+)）/g, "None of $1 candidate legs touched pedals across frames (crank reach $2)"],
  [/(\S+) 脚踏点离腿的距离最多变了 ([0-9.]+)/g, "$1 pedal-to-leg distance varied by at most $2"],
  [/（曲柄伸出 ([0-9.]+)，脚始终跟着脚踏）/g, " (crank reach $1, feet consistently track pedals)"],
  [/（曲柄伸出 ([0-9.]+)，脚基本跟着脚踏）/g, " (crank reach $1, feet mostly track pedals)"],
  [/（曲柄伸出 ([0-9.]+)，脚与脚踏不同步）/g, " (crank reach $1, feet out of sync with pedals)"],
  [/无其他可跟踪元素/g, "No other trackable elements"],
  [/其他动画元素都量不到（不在渲染树上）/g, "Other animated elements unmeasurable (not in render tree)"],
  [/(\d+)\/(\d+) 个其他元素有位移/g, "$1/$2 other element(s) moved"],
  [/车轮曲柄之外的元素逐帧没有位移/g, "Elements outside wheels and crank did not move across frames"],
  [/（盲描述未认出鹈鹕，上限减半为 (\d+)）/g, " (blind description did not recognize pelican; capped at $1)"],
  [/（低于门槛 (\d+) 分：不计入总分，直接判降智）/g, " (below minimum threshold of $1 pts: excluded from total, marked degraded)"],
];

export function localizeGateEvidenceEn(evidence: string): string {
  let out = evidence;
  for (const [pattern, replacement] of GATE_EVIDENCE_PATTERNS) {
    out = out.replace(pattern, replacement);
  }
  return out.replace(/，/g, ", ").replace(/、/g, ", ");
}

export function localizeCriterionReasonEn(reason: string | null): string | null {
  if (reason === null) return null;
  let out = reason;
  for (const [pattern, replacement] of CRITERION_REASON_PATTERNS) {
    out = out.replace(pattern, replacement);
  }
  return out.replace(/；/g, "; ").replace(/，/g, ", ").replace(/、/g, ", ");
}

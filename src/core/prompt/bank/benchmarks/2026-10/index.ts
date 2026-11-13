/**
 * 2026 年 10 月社区流行前沿评测提示词数据（2026-10 分组）
 * 包含多自由度机械机构、行波节肢步态、差速器齿轮啮合、流体与自相似几何评测
 */

import type { PromptSpec } from "../../../types";

/**
 * 简森步行机构基准。
 * 考察 11 杆定长连杆、圆圆交点刚性约束、155° 平地相与反相双腿协调。
 */
export const ANIMATED_JANSEN_WALKER_PROMPT: PromptSpec = {
  id: "animated-jansen-walker-v1",
  label: "简森步行机构 (Animated Jansen Walking Linkage)",
  template: [
    "Generate one self-contained animated SVG of a planar Jansen walking linkage, side view, on a sand-colored ground line.",
    "Use only SMIL <animate>, <animateTransform>, or one inline <style> with @keyframes. No <script>, no external file, no font, no bitmap.",
    'Geometry, in the same arbitrary unit, then scale to fit viewBox "0 0 900 520":',
    "fixed span a=38; vertical offset l=7.8; crank m=15;",
    "rod lengths b=41.5, c=39.3, d=40.1, e=55.8, f=39.4, g=36.7, h=65.7, i=49, j=50, k=61.9.",
    "Draw two fixed pivots, one crank, and two legs 180 degrees out of phase. Each leg is a closed chain of those rods.",
    "Joints are small circles. Rods are round-capped strokes. The foot is a larger joint.",
    "Motion, one 4-second seamless loop:",
    "1. The crank rotates at constant speed about its fixed pivot.",
    "2. Every other joint is the rigid-circle intersection of its two rod lengths. Stroke length must not change during the cycle.",
    "3. The foot path has a long lower stance of about 155 degrees of crank angle, nearly horizontal, then a shorter lift.",
    "4. While one foot is in stance, the other is in lift.",
    "5. At t=0 and t=4s the pose is identical. Peak motion must be visible.",
    "6. Do not draw a brand name, a beach-beast mascot, or explanatory text.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://x.com/elvar_official/status/2116192984299344372",
  verified: true,
  immutable: true,
  originDate: "2026-10",
  registeredAt: "2026-11-12",
  standard: {
    coreKey: "11 杆平面定长连杆、圆圆交点刚性约束、155° 平地支撑相与反相双腿协调",
    groundTruth:
      "固定跨距 a=38，偏置 l=7.8，曲柄 m=15，连杆 b~k 严格定长（杆长变化 < 3%）；足端轨迹下沿约 140°~170° 近似水平平地相；双腿反相 180°；首尾闭合 MAE ≡ 0 且有效动量 max MAE >= 0.015；0 <script>。",
    evaluationCriteria:
      "Pass: 11 杆定长装配且无伸缩漂移，足端平地相支撑真实，双腿反相交替，首尾无缝闭合 MAE ≡ 0 且 max MAE >= 0.015，0 script；Partial: 杆长轻微弹性拉伸或平地相较短；Fail: 静态死图（max MAE < 0.015）、含 script、杆件断开或 XML 语法错误。",
    referenceSource: "https://x.com/elvar_official/status/2116192984299344372",
  },
};

/**
 * 跳蛛四足交替起跳基准。
 * 考察 8 足两组交替、液压蓄力下蹲、0.12s 极速伸直爆发与眼列深度对焦。
 */
export const ANIMATED_JUMPING_SPIDER_LEAP_PROMPT: PromptSpec = {
  id: "animated-jumping-spider-leap-v1",
  label: "跳蛛四足交替起跳 (Animated Jumping Spider Leap)",
  template: [
    "Generate one self-contained animated SVG of a generic mechanical jumping spider in side view.",
    "Use SMIL or one inline CSS <style>. No <script>, no external asset, no text labels.",
    "Body: one cephalothorax, one abdomen, exactly 8 legs, and exactly 2 large forward eyes.",
    "Each leg has three visible segments and a foot. Legs are divided into set A (legs 1,3,5,7) and set B (legs 2,4,6,8).",
    "One 2.4-second seamless loop, timed from the start:",
    "1. 0.00–0.80s: tetrapod walk. Set A and set B alternate. At every moment at least one full set is planted. Planted feet do not slide along the ground.",
    "2. 0.80–1.10s: crouch. Body lowers, all knees bend, both irises stay open.",
    "3. 1.10–1.22s: launch. Legs straighten, body rises, both irises contract to about half their open diameter.",
    "4. 1.22–1.90s: airborne arc, then landing. Feet meet the ground again; body settles to the walk height.",
    "5. 1.90–2.40s: return to the exact first pose.",
    "The 0.12-second launch must be visibly faster than the crouch.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://x.com/elvar_official/status/2116618736371118544",
  verified: true,
  immutable: true,
  originDate: "2026-10",
  registeredAt: "2026-11-12",
  standard: {
    coreKey: "8 足分两组对角交替、液压蓄力下蹲、0.12s 极速伸直爆发与眼列深度对焦",
    groundTruth:
      "8 足严格分为交替支撑两组；跳跃前屈肢蓄力下蹲；起跳瞬间 0.12s 内后肢瞬间伸展爆发；头胸部前中眼（AME）对焦前视；首尾闭合 MAE ≡ 0 且 max MAE >= 0.020；0 <script>。",
    evaluationCriteria:
      "Pass: 8 腿分两组协调起落，起跳动作具备明显的蓄力慢相与爆发快相，首尾闭合 MAE ≡ 0 且 max MAE >= 0.020，0 script；Partial: 腿部动作机械匀速，缺乏液压弹射感；Fail: 静态死图、腿数非 8、含 script 或 XML 语法错误。",
    referenceSource: "https://x.com/elvar_official/status/2116618736371118544",
  },
};

/**
 * 蜈蚣行波步态基准。
 * 考察 16 对足后向行波传递、相邻节段相位差 0.11 与触地相足端零滑动。
 */
export const ANIMATED_CENTIPEDE_WAVE_GAIT_PROMPT: PromptSpec = {
  id: "animated-centipede-wave-gait-v1",
  label: "蜈蚣行波步态 (Animated Centipede Wave Gait)",
  template: [
    "Generate one self-contained animated SVG of a generic robotic centipede, side view, walking to the right.",
    "SMIL or inline CSS only. No <script>, no external asset, no text.",
    "Body: a chain of exactly 16 segments. Each segment has exactly one pair of legs, 32 legs total.",
    "Legs on the far side may be shorter and lighter, but every pair must be countable. Each leg has a hip and a foot.",
    "One 3.2-second seamless loop:",
    "1. Number pairs 0 through 15 from head to tail.",
    "2. Pair k steps at phase k * 0.11 of the cycle, so the wave travels from head toward tail.",
    "3. A stepping leg lifts and advances; a planted foot does not slide.",
    "4. The body is an S-shaped rest pose plus a sideways traveling wave whose peak moves tailward in step with the leg wave.",
    "5. At least 8 feet are planted at every instant.",
    "6. The first and last frame match exactly.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://x.com/Koan0x/status/2116967605294502345",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-12",
  standard: {
    coreKey: "16 对足后向行波传递、相邻节段恒定相位差 0.11 与触地相足端零滑动",
    groundTruth:
      "多肢节后向行波传递，相邻足对相位差保持约 0.11 周期；足端触地期间与地面无相对滑移；身体微幅横向波状起伏；首尾闭合 MAE ≡ 0 且 max MAE >= 0.015；0 <script>。",
    evaluationCriteria:
      "Pass: 多足连贯呈现由后向前的推进波，触地期稳固无溜冰滑步，首尾闭合且 max MAE >= 0.015，0 script；Partial: 行波杂乱或局部足端同频滑动；Fail: 静态死图、四肢整体平移、含 script 或 XML 语法错误。",
    referenceSource: "https://x.com/Koan0x/status/2116967605294502345",
  },
};

/**
 * 开放差速器过弯基准。
 * 考察行星伞齿轮公转与自转耦合、过弯时外侧半轴转速快于内侧与传动守恒。
 */
export const ANIMATED_OPEN_DIFFERENTIAL_PROMPT: PromptSpec = {
  id: "animated-open-differential-v1",
  label: "开放差速器过弯 (Animated Open Differential)",
  template: [
    "Generate one self-contained animated SVG of a generic open differential with the housing cut away on the near side.",
    'Use a 30-degree isometric projection: screenX = (x - y) * cos(30°), screenY = (x + y) * sin(30°) - z.',
    "Hairline technical style: near-black metal, 1px edges, one muted accent. SMIL or inline CSS only. No <script>, no brand, no words.",
    "Parts, back to front: input pinion, ring gear, carrier, two spider gears on a cross pin, two side gears, left axle, right axle, and two wheels. The housing outline stays closed.",
    "One 4-second seamless loop of a left turn:",
    "1. The pinion turns at constant speed and meshes with the ring.",
    "2. The carrier, cross pin, and ring share that average rotation.",
    "3. Spider gears spin about the cross pin.",
    "4. The right wheel, on the outside of the turn, rotates faster than the carrier. The left wheel rotates slower by the same amount. Their average equals the carrier speed.",
    "5. A short ground arc under the wheels shows the right arc longer than the left arc.",
    "6. No part drifts out of mesh. First and last frames match.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://skills.wheresryan.sh/anatomy/community/nader0913/open-differential",
  verified: true,
  immutable: true,
  originDate: "2026-10",
  registeredAt: "2026-11-12",
  standard: {
    coreKey: "行星伞齿轮公转与自转耦合、过弯时外侧半轴转速快于内侧与传动守恒",
    groundTruth:
      "输入轴带动主减速从动齿轮与差速器壳体旋转；过弯工况下两半轴转速满足 ω1 + ω2 = 2ωc，外侧轮转速显著快于内侧轮；行星齿轮绕十字轴自转；首尾闭合 MAE ≡ 0 且 max MAE >= 0.015；0 <script>。",
    evaluationCriteria:
      "Pass: 行星轮与左右半轴齿轮正确啮合，弯道中两半轴转速差清晰可见且外快内慢，首尾闭合且 max MAE >= 0.015，0 script；Partial: 齿轮转动但内外侧转速相等；Fail: 静态死图、齿轮脱啮错位、含 script 或 XML 语法错误。",
    referenceSource: "https://skills.wheresryan.sh/anatomy/community/nader0913/open-differential",
  },
};

/**
 * 摩天轮吊厢自水平基准。
 * 考察轮体定速大公转、重力/齿轮驱动吊厢反向等角自转与垂直姿态不翻转。
 */
export const ANIMATED_FERRIS_LEVELING_PROMPT: PromptSpec = {
  id: "animated-ferris-leveling-v1",
  label: "摩天轮吊厢自水平 (Animated Ferris Wheel Self-Leveling)",
  template: [
    "Generate one self-contained animated SVG of a generic Ferris wheel. SMIL or one inline <style> only. No <script>, no external asset, no text, no brand.",
    "Structure: an A-frame, one axle, one large wheel, 12 radial spokes, a toothed bull gear on the wheel, and a smaller drive pinion below it.",
    "Hang exactly 8 cabins at 45-degree spacing. Each cabin is a rectangle with a visible floor edge and one pivot.",
    "One 12-second seamless loop:",
    "1. The wheel and bull gear rotate clockwise at constant speed.",
    "2. The pinion rotates counterclockwise. Its angular speed is 4 times the wheel, matching a 4:1 tooth ratio. Teeth stay in mesh; do not phase-slide the pinion away from the bull gear.",
    "3. Each cabin translates with the rim but its floor stays horizontal. Implement this as an inner rotation equal and opposite to the wheel rotation, about that cabin's own pivot.",
    "4. Cabins never intersect the spokes or the frame.",
    "5. The pose at 0s and 12s is identical.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://youmind.com/prompts/svg-ferris-wheel-mechanical-animation-in-html-679",
  verified: true,
  immutable: true,
  originDate: "2026-10",
  registeredAt: "2026-11-12",
  standard: {
    coreKey: "轮体定速大公转、重力/齿轮驱动吊厢反向等角自转与垂直姿态不翻转",
    groundTruth:
      "摩天轮桁架以恒定角速度 ω 回转；外周各吊厢枢轴满足反向旋转 -ω，吊厢底部始终严格朝向正下方，绝不随大轮翻转倒置；首尾闭合 MAE ≡ 0 且 max MAE >= 0.015；0 <script>。",
    evaluationCriteria:
      "Pass: 大轮平稳旋转，所有吊厢在公转全程保持垂直水平且无倒置翻滚，首尾闭合且 max MAE >= 0.015，0 script；Partial: 吊厢轻度摇摆但在最高点未翻转；Fail: 吊厢随大轮倒立翻转、静态死图、含 script 或 XML 语法错误。",
    referenceSource: "https://youmind.com/prompts/svg-ferris-wheel-mechanical-animation-in-html-679",
  },
};

/**
 * 章鱼操作管风琴基准。
 * 考察 8 条腕足独立多任务协同、多层手键盘与脚踏板同时触击与气阀动态响应。
 */
export const ANIMATED_OCTOPUS_ORGAN_PROMPT: PromptSpec = {
  id: "animated-octopus-organ-v1",
  label: "章鱼操作管风琴 (Animated Octopus Playing Pipe Organ)",
  template: [
    "Generate one self-contained animated SVG of an octopus seated at a pipe organ, front three-quarter view.",
    "SMIL or inline CSS only. No <script>, no external asset, no text, no brand.",
    "The octopus has exactly 8 tentacles and 2 eyes, and faces the organ.",
    "The organ has 9 pipes in one rank, strictly increasing then decreasing in height so the longest pipe is near the middle, one manual of 12 white keys, and one pedalboard of 5 pedals.",
    "One 4-second seamless loop:",
    "1. Four tentacles stay on the manual. Two of them press keys: a pressed key moves down and returns. The other four tentacles divide as two on the pedalboard and two on the stop knobs beside the console.",
    "2. A pressed pedal tilts down and returns. Pedal motion is out of phase with the manual.",
    "3. No tentacle splits, merges, or disappears between frames.",
    "4. The body stays on the bench. Tentacles connect to the mantle at all times.",
    "5. First and last frames match, and at least one key is in motion during the cycle.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://news.ycombinator.com/item?id=49696402",
  verified: true,
  immutable: true,
  originDate: "2026-10",
  registeredAt: "2026-11-12",
  standard: {
    coreKey: "8 条腕足独立多任务协同、多层手键盘与脚踏板同时触击与气阀动态响应",
    groundTruth:
      "8 条软体腕足各司其职，同时按压多排手键盘（Manuals）与脚踏键盘（Pedalboard）；琴键下陷与对应音管发光/气流波动同步；首尾闭合 MAE ≡ 0 且 max MAE >= 0.015；0 <script>。",
    evaluationCriteria:
      "Pass: 8 条腕足解剖清晰且协调分工演奏多排键盘与脚踏，琴键下沉动作连贯，首尾闭合且 max MAE >= 0.015，0 script；Partial: 腕足少于 8 条或仅按压单层键盘；Fail: 静态死图、含 script、肢体脱节或 XML 语法错误。",
    referenceSource: "https://news.ycombinator.com/item?id=49696402",
  },
};

/**
 * 孔雀骑车尾屏基准。
 * 考察扇形尾屏规律扇动展开、12 个眼斑径向分布与双脚曲柄踏板相位闭合。
 */
export const ANIMATED_PEACOCK_BICYCLE_PROMPT: PromptSpec = {
  id: "animated-peacock-bicycle-v1",
  label: "孔雀骑车尾屏 (Animated Peacock Riding Bicycle)",
  template: [
    "Generate one self-contained animated SVG of a peacock riding a bicycle, side view, facing right.",
    "SMIL or inline CSS only. No <script>, no external asset, no signature, no text.",
    "The peacock has one crest, two legs, one beak, and a folded train of exactly 12 eye spots arranged in 3 rows of 4.",
    "The bicycle has two equal wheels, a frame, a saddle, handlebars, two pedals, and a crank.",
    "One 2-second seamless loop:",
    "1. Both wheels rotate at the same speed. The crank rotates with them: one wheel revolution equals one crank revolution.",
    "2. The two legs alternate and each foot stays on its pedal.",
    "3. The pelvis rocks with the pedals. The train hinges at the pelvis and lags the rock by a small angle. Eye spots stay attached to the train and do not change count.",
    "4. The crest bobs with the body. Beak and wings are present but do not become extra legs.",
    "5. The bird contacts the saddle throughout. First and last frames match.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://x.com/SahilPanhotra/status/2114802178212892744",
  verified: true,
  immutable: true,
  originDate: "2026-10",
  registeredAt: "2026-11-12",
  standard: {
    coreKey: "扇形尾屏规律扇动展开、12 个眼斑径向分布与双脚曲柄踏板相位闭合",
    groundTruth:
      "孔雀双脚立于两侧脚踏板伴随曲柄做 180° 相反圆周运动；车轮辐条定轴旋转；巨大尾屏呈扇形展开并伴随微小起伏扇动，羽毛上规则分布眼斑花纹；首尾闭合 MAE ≡ 0 且 max MAE >= 0.015；0 <script>。",
    evaluationCriteria:
      "Pass: 孔雀骑乘姿态真实，双脚与脚踏紧密贴合并旋转，车轮与尾屏协调联动展开，首尾闭合且 max MAE >= 0.015，0 script；Partial: 脚踏不转或尾屏退化为单一色块；Fail: 静态死图、含 script、车身解体或 XML 语法错误。",
    referenceSource: "https://x.com/SahilPanhotra/status/2114802178212892744",
  },
};

/**
 * 鹦鹉螺对数螺线基准。
 * 考察黄金比例对数螺线极坐标剖面、隔板连续自相似生长与中心水管贯穿。
 */
export const ANIMATED_NAUTILUS_SPIRAL_PROMPT: PromptSpec = {
  id: "animated-nautilus-spiral-v1",
  label: "鹦鹉螺对数螺线 (Animated Nautilus Logarithmic Spiral)",
  template: [
    "Generate one self-contained animated SVG of a chambered nautilus shell in side section.",
    "SMIL or inline CSS only. No <script>, no external asset, no text, no animal body.",
    "Shell: a logarithmic spiral of 1.5 turns. Use growth ratio phi = 1.618 per quarter turn: radius at theta+90° is 1.618 times the radius at theta.",
    "The center is hollow. Draw 12 chamber walls, each perpendicular to the spiral at its foot, with spacing growing by the same ratio. The aperture is open at the outer end.",
    "One 6-second seamless growth loop:",
    "1. At 0s show the inner 8 chambers.",
    "2. From 0s to 5s the spiral lengthens smoothly to all 12 chambers. Existing walls stay at the same radii; new walls appear only at the growing lip. Do not rotate the finished shell as a rigid body.",
    "3. From 5s to 6s crossfade back to the 8-chamber pose so the loop closes.",
    "4. Wall count in the full pose is exactly 12. Stroke widths stay constant in screen pixels.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://pyshine.com/Ollama-Local-Models-SVG-Comparison-Nautilus-Shell/",
  verified: true,
  immutable: true,
  originDate: "2026-10",
  registeredAt: "2026-11-12",
  standard: {
    coreKey: "黄金比例对数螺线极坐标剖面、隔板连续自相似生长与中心水管贯穿",
    groundTruth:
      "螺线满足极坐标公式 r(θ) = a e^(b θ)，相邻隔室面积呈几何级数自相似增长；中心体管（Siphuncle）连续穿透各隔壁中心；生长循环首尾无缝对接 MAE ≡ 0 且 max MAE >= 0.015；0 <script>。",
    evaluationCriteria:
      "Pass: 对数螺线几何严密，隔室比例自相似连续递增，中心水管贯通各室，生长动画平滑循环，首尾闭合且 max MAE >= 0.015，0 script；Partial: 螺线退化为简单同心圆弧或隔室间距不均；Fail: 静态死图、隔壁断裂、含 script 或 XML 语法错误。",
    referenceSource: "https://pyshine.com/Ollama-Local-Models-SVG-Comparison-Nautilus-Shell/",
  },
};

export const PROMPTS_2026_10: readonly PromptSpec[] = [
  ANIMATED_JANSEN_WALKER_PROMPT,
  ANIMATED_JUMPING_SPIDER_LEAP_PROMPT,
  ANIMATED_CENTIPEDE_WAVE_GAIT_PROMPT,
  ANIMATED_OPEN_DIFFERENTIAL_PROMPT,
  ANIMATED_FERRIS_LEVELING_PROMPT,
  ANIMATED_OCTOPUS_ORGAN_PROMPT,
  ANIMATED_PEACOCK_BICYCLE_PROMPT,
  ANIMATED_NAUTILUS_SPIRAL_PROMPT,
];

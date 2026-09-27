/**
 * 提示词登记表（prompt registry），出处见 docs/benchmark-provenance.md。
 *
 * 内置条目分两类，均为 `immutable: true`（不带变量、不可编辑、不可被自定义条目覆盖）：
 * 1. Simon Willison 原文（classic-v1、upgraded-v2）：逐字照录，与外部公开数据对齐。
 * 2. 四大名著候选集（shuihu / xiyou / sanguo / honglou）：每部十个回目的名场面，
 *    每条是完整提示词，按轮换周期洗牌抽取。画面描述为本仓库自撰。
 *
 * 抽中的候选 id 与最终文本写入运行记录，同一候选下的结果彼此可比。改动任何内置
 * 条目的文本都会使既有结果失去可比性。
 */

import type { VariableSpec } from "./variables";
import { HONGLOU_ANIM_PROMPT, HONGLOU_PROMPT } from "./classics/honglou";
import { SANGUO_ANIM_PROMPT, SANGUO_PROMPT } from "./classics/sanguo";
import { SHUIHU_ANIM_PROMPT, SHUIHU_PROMPT } from "./classics/shuihu";
import { XIYOU_ANIM_PROMPT, XIYOU_PROMPT } from "./classics/xiyou";
import { ALL_FRONTIER_PROMPTS, FRONTIER_INDIVIDUAL_PROMPT_MAP } from "./prompts";

/** 候选集里的一条：一个回目的名场面 */
export interface PromptCandidate {
  /** 稳定标识，如 `xiyou-027`（书名拼音 + 三位回数），写入运行记录 */
  readonly id: string;
  /** 看板徽章上显示的名字，如 “第27回 三打白骨精” */
  readonly label: string;
  /** 完整的提示词，逐字发送 */
  readonly text: string;
  /** 客观黄金参考标准与判断依据（单题特异标准） */
  readonly standard?: PromptStandard | null;
}

/**
 * 题目的客观参考标准（Ground Truth）与判断标准（Evaluation Criteria）。
 * 为评判大模型输出的正确性与空间/物理/文学理解深度提供不可妥协的客观对照依据。
 */
export interface PromptStandard {
  /** 核心考点与鉴别维度（如：非线性空间映射、阿基米德浮力定律、三维视错觉拓扑） */
  readonly coreKey: string;
  /** 客观黄金参考标准（Ground Truth）：具体的几何角度、物理定律、机械构型或出处原型 */
  readonly groundTruth: string;
  /** 判断与鉴别标准（Evaluation Criteria）：何为满分，何为空间推理或物理违背等扣分/失误 */
  readonly evaluationCriteria: string;
  /** 权威参考来源链接（维基百科、学术基准、原作者博文等） */
  readonly referenceSource?: string | null;
}

export interface PromptSpec {
  /** 稳定标识，写入每条运行记录 */
  readonly id: string;
  readonly label: string;
  /** 模板文本，`{{name}}` 为变量占位；无变量时即最终文本 */
  readonly template: string;
  readonly variables: readonly VariableSpec[];
  /** 候选集：非空时每个轮换周期抽一条作提示词，template 仅作说明；与 variables 互斥 */
  readonly candidates: readonly PromptCandidate[];
  readonly source: string | null;
  /** 出处是否已核对：原文条目对照作者公开发布，候选集对照原著回目 */
  readonly verified: boolean;
  /** 不可变条目：禁止带变量、禁止编辑、不能被自定义条目覆盖 */
  readonly immutable: boolean;
  /** 题目在社区、原作者或公开网络首次出现的时间（格式 YYYY-MM 或 YYYY-MM-DD） */
  readonly originDate?: string | null;
  /** 本基准仓库/看板正式收录该题目的日期（格式 YYYY-MM-DD） */
  readonly registeredAt?: string | null;
  /** 客观黄金参考标准与判断依据 */
  readonly standard?: PromptStandard | null;
}

/** 题目的生命周期与时间追踪信息 */
export interface PromptLifecycle {
  readonly originDate: string | null;
  readonly registeredAt: string | null;
  readonly originAgeText: string | null;
  readonly daysSinceCollected: number | null;
  readonly collectedAgeText: string | null;
  readonly status: "active" | "aging" | "legacy";
}

/** 计算提示词的题龄与生命周期状态，用于淘汰评估与题目迭代 */
export function promptLifecycle(spec: PromptSpec, now: Date = new Date()): PromptLifecycle {
  const originDate = spec.originDate ?? null;
  const registeredAt = spec.registeredAt ?? null;

  let originAgeText: string | null = null;
  if (originDate !== null) {
    const originTime = new Date(originDate.length === 7 ? `${originDate}-01` : originDate).getTime();
    if (!Number.isNaN(originTime)) {
      const diffMonths = Math.max(0, Math.floor((now.getTime() - originTime) / (1000 * 60 * 60 * 24 * 30.4375)));
      if (diffMonths >= 12) {
        const years = (diffMonths / 12).toFixed(1).replace(/\.0$/, "");
        originAgeText = `${years} 年前`;
      } else {
        originAgeText = `${Math.max(1, diffMonths)} 个月前`;
      }
    }
  }

  let daysSinceCollected: number | null = null;
  let collectedAgeText: string | null = null;
  if (registeredAt !== null) {
    const collectedTime = new Date(registeredAt).getTime();
    if (!Number.isNaN(collectedTime)) {
      daysSinceCollected = Math.max(0, Math.floor((now.getTime() - collectedTime) / (1000 * 60 * 60 * 24)));
      if (daysSinceCollected === 0) {
        collectedAgeText = "今天收录";
      } else if (daysSinceCollected < 30) {
        collectedAgeText = `${daysSinceCollected} 天前`;
      } else {
        const months = Math.floor(daysSinceCollected / 30.4375);
        collectedAgeText = `${months} 个月前`;
      }
    }
  }

  let status: "active" | "aging" | "legacy" = "active";
  if (spec.id === "classic-v1" || spec.id === "upgraded-v2") {
    status = "legacy";
  } else if (daysSinceCollected !== null && daysSinceCollected > 180) {
    status = "aging";
  }

  return {
    originDate,
    registeredAt,
    originAgeText,
    daysSinceCollected,
    collectedAgeText,
    status,
  };
}

/** Simon Willison 的经典提示词，本仓库的基准锚点 */
export const CLASSIC_PROMPT: PromptSpec = {
  id: "classic-v1",
  label: "经典版（Classic）",
  template: "Generate an SVG of a pelican riding a bicycle",
  variables: [],
  candidates: [],
  source: "https://github.com/simonw/pelican-bicycle",
  verified: true,
  immutable: true,
  originDate: "2024-07",
  registeredAt: "2026-09-22",
  standard: {
    coreKey: "非训练集分布（OOD）构图与主体部件关联",
    groundTruth: "加州鹈鹕（长喙、典型大喉囊、鸟类羽毛）骑坐在经典自行车上；自行车包含前后双轮、车架、车把、脚踏与车座。",
    evaluationCriteria: "1. 语法完整：输出合法自闭合 SVG，无截断或 XML 解析错误；2. 人车拓扑：鹈鹕躯干与自行车比例协调，脚踏与臀部分别对应踏板与车座；3. 部件辨识：前后双轮与车架几何清晰。",
    referenceSource: "https://github.com/simonw/pelican-bicycle",
  },
};

/**
 * 作者 2025-11-18 发布的升级版，对车架、辐条、喉囊、羽毛、踩踏动作与繁殖羽提出要求。
 */
export const UPGRADED_PROMPT: PromptSpec = {
  id: "upgraded-v2",
  label: "升级版（Upgraded, 2025-11）",
  template: [
    "Generate an SVG of a California brown pelican riding a bicycle.",
    "The bicycle must have spokes and a correctly shaped bicycle frame.",
    "The pelican must have its characteristic large pouch, and there should be a clear indication of feathers.",
    "The pelican must be clearly pedaling the bicycle.",
    "The image should show the full breeding plumage of the California brown pelican.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://simonwillison.net/2025/Nov/18/gemini-3/",
  verified: true,
  immutable: true,
  originDate: "2025-11-18",
  registeredAt: "2026-09-22",
  standard: {
    coreKey: "高密度解剖与机械细节遵从（辐条、繁殖羽、踩踏动态）",
    groundTruth: "加州褐鹈鹕全身繁殖羽（头顶白/黄，颈部深棕/黑，体羽灰褐质感）；大喉囊与羽毛分层；双轮具备明确辐条（spokes）；车架结构合规；鹈鹕处于踩踏动作中（clearly pedaling）。",
    evaluationCriteria: "1. 辐条与车架：双轮内必须具有辐条射线结构，车架符合自行车三角力学；2. 繁殖羽与喉囊：呈现加州褐鹈鹕繁殖羽特征色彩与丰满喉囊；3. 踩踏动态：腿部有明确蹬车屈伸动态且双脚踩在踏板上。",
    referenceSource: "https://simonwillison.net/2025/Nov/18/gemini-3/",
  },
};

/**
 * 雷军骑自行车（带输入参考图片的本地测试题）。
 * 原型为雷军清晨骑折叠自行车上班向镜头挥手致意、配字“早上好”的经典画面。
 * 提示词包含输入图片 URL 与 Markdown 嵌入，并规定人物神态、着装、折叠车身、晨光长影与标语等视觉还原要求。
 */
export const LEIJUN_PROMPT: PromptSpec = {
  id: "leijun-v1",
  label: "雷军骑自行车（Lei Jun on Bicycle）",
  template: [
    "请参考以下输入的图片，生成一幅雷军骑自行车的完整 SVG 插画：",
    "",
    "输入图片：",
    "![雷军骑自行车](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLDs8B3MO0pHXY583y51i9lQs0mvoKTcn5SiELphxvfw&s)",
    "",
    "画面需忠实还原输入图片中的核心视觉要素：",
    "1. 人物与姿态：雷军面带亲切温和的微笑，右手高高举起向前挥手致意，左手握把，单脚踩在脚踏板上骑行。",
    "2. 服装与色彩：身穿砖红色/暗红色短袖T恤、深色九分长裤、白色短袜配醒目的亮橙色运动鞋，左手腕佩戴手表。",
    "3. 自行车结构：一辆墨绿色小轮径折叠自行车（类似 Brompton 小布），车身折叠关节清晰，前后车轮带辐条与黄边黑胎，车头配有棕黄色车把置物小包。",
    "4. 场景与构图：现代商务写字楼园区清晨户外，地面留有朝阳斜射拉长的人物与自行车影子，背景有现代写字楼幕墙立柱与绿植树木。",
    "5. 画面文字：画面中醒目包含黄色“早上好”字样。",
    "",
    "请直接输出完整、自闭合、语法正确的 SVG 代码，无需多余说明。",
  ].join("\n"),
  variables: [],
  candidates: [],
  source: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLDs8B3MO0pHXY583y51i9lQs0mvoKTcn5SiELphxvfw&s",
  verified: true,
  immutable: true,
  originDate: "2024-05-18",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "Image-to-SVG 视觉要素与构图忠实还原",
    groundTruth: "短发温和微笑、右手高举单手向前挥手、单脚踩踏板；砖红短袖T恤、深色九分裤、白袜配亮橙色运动鞋；墨绿色小轮折叠车（车架铰链分明、车头棕黄置物包）；写字楼晨光长影、醒目包含黄色“早上好”中文字样。",
    evaluationCriteria: "1. 关键特征完整性：砖红T恤、亮橙鞋、墨绿折叠车、黄色“早上好”字样缺一扣分；2. 姿态神情：挥手致意微笑与单脚蹬车姿态还原输入图像；3. 矢量分层：光影朝向与长阴影投射准确。",
    referenceSource: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLDs8B3MO0pHXY583y51i9lQs0mvoKTcn5SiELphxvfw&s",
  },
};

/**
 * 钟表时针几何空间逻辑（3:45 时钟）。
 * 考察时间到角度的非线性空间映射能力：45 分钟时时针应偏向 4（112.5°）而非直指 3（90°）。
 */
export const CLOCK_PROMPT: PromptSpec = {
  id: "clock-v1",
  label: "时钟空间几何（Clock 3:45）",
  template: [
    "Generate an SVG of a classic analog wall clock clearly displaying the time 3:45.",
    "The clock face must feature a circular dial with distinct hour numerals (1 to 12) and perimeter tick marks.",
    "The minute hand must point directly at 9 (an angle of 270° from the 12 o'clock top).",
    "Geometrically, because 45 minutes have elapsed in the hour, the hour hand must NOT point horizontally at 3 (90°);",
    "instead, it must be positioned precisely three-quarters of the way between 3 and 4 (an angle of 112.5° from the 12 o'clock top).",
    "Include a central mounting pin, distinct lengths and widths for the hour and minute hands, and a thin red second hand pointing at 12 (0°).",
    "Ensure all text, lines, and hands are geometrically aligned and self-contained in the SVG.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://x.com/search?q=clock+3%3A45+SVG+LLM",
  verified: true,
  immutable: true,
  originDate: "2026-07",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "时间到角度的非线性机械连续空间映射（CDT 测验）",
    groundTruth: "表盘 1~12 数字均匀排布；分针直指 9 点刻度（绝对角度 270°，以正上方 12 点为 0°）；时针由于 45 分钟流逝，顺时针偏转 30° × (45/60) = 22.5°，绝对角度必须精确落于 90° + 22.5° = 112.5°（即 3 与 4 之间靠近 4 的 3/4 处）。",
    evaluationCriteria: "1. 时针角度（黄金考点）：水平直指 3 点（90°）判定为时钟物理连续性认知失误；精确指向 112.5° 为满分；2. 指针比例：分针长于时针，具备中心固定轴销，秒针清晰。",
    referenceSource: "https://en.wikipedia.org/wiki/Clock-drawing_test",
  },
};

/**
 * 动态鹈鹕自行车（纯内联 SVG 动画）。
 * 考察模型编写内联 SMIL 或 CSS keyframes 动画、坐标系旋转中心及周期性运动学能力。
 */
export const ANIMATED_PELICAN_PROMPT: PromptSpec = {
  id: "animated-pelican-v1",
  label: "动态鹈鹕车（Animated Pelican）",
  template: [
    "Generate an SVG of a California brown pelican riding a bicycle featuring pure inline SVG animation (using SMIL <animateTransform> or inline CSS @keyframes).",
    "The bicycle must have a correctly shaped frame, handlebar, saddle, spoked wheels, pedals, and crank arms.",
    "The pelican must be seated and pedaling the bicycle with its feet on the pedals.",
    "Animations must run smoothly and continuously in a modern browser:",
    "1. Both front and rear wheels must continuously rotate around their respective axle center points (transform-origin).",
    "2. The crank arms and pedals must smoothly revolve around the bottom bracket spindle.",
    "3. The pelican's legs must smoothly animate up and down in synchrony with the pedaling motion.",
    "The entire output must be completely self-contained within a single valid SVG element (ensure strictly well-formed XML: if using <style>, wrap CSS inside <![CDATA[ ... ]]> or avoid raw unescaped '&' and '<'), requiring no external scripts or stylesheets.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://simonwillison.net/tags/pelican-riding-a-bicycle/",
  verified: true,
  immutable: true,
  originDate: "2026-08",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "纯内联 SVG 运动学、自转中心点与踩踏周期动画",
    groundTruth: "前后车轮必须以各自独立轮毂轴心点 (cx, cy) 为中心进行 transform-origin 旋转；曲柄牙盘旋转且脚踏呈 180° 对称相位；鹈鹕双腿随曲柄做上下伸缩连贯踩踏；纯内联 SMIL 或 CSS @keyframes 驱动，样式块含 CDATA 保护。",
    evaluationCriteria: "1. 旋转中心：以全局 (0,0) 旋转导致车身飞离判定为零分；前后车轮各绕自身轴心平稳自转为及格；2. 踩踏联动：双腿与脚踏形成连贯周期性伸缩踩踏运动为满分；3. 语法规范：XML 解析零错误，不含未转义裸字符。",
    referenceSource: "https://simonwillison.net/tags/pelican-riding-a-bicycle/",
  },
};

/**
 * 彭罗斯不可能三角（埃舍尔矛盾空间）。
 * 考察等轴测三维投影、空间几何拓扑一致性与矛盾面光影着色。
 */
export const PENROSE_PROMPT: PromptSpec = {
  id: "penrose-v1",
  label: "彭罗斯三角（Penrose Triangle）",
  template: [
    "Generate an SVG of an impossible 3D Penrose Triangle (Escher-style impossible tribar in isometric perspective).",
    "The three interconnected square-section beams must form a clean optical illusion of an impossible closed loop in three-dimensional space.",
    "Use distinct tonal shading on the three visible face orientations (for example, light highlight on top faces, medium tone on right-facing faces, and dark shadow on bottom/left faces)",
    "so that each corner joint displays crisp geometric depth while maintaining the impossible visual paradox.",
    "Ensure precise vertex alignments and seamless path joins.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Penrose_triangle",
  verified: true,
  immutable: true,
  originDate: "2026-08",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "三维等轴测投影与不可能拓扑视错觉闭环",
    groundTruth: "三个互相垂直的方梁在等轴测平面投影中形成不可能闭环覆盖循环（A 压 B、B 压 C、C 压 A）；每根方梁展示三个可见面（顶面、内侧面、外侧面），全局光照方向统一（高光面、中间调面、阴影暗面）。",
    evaluationCriteria: "1. 拓扑错觉：必须呈现埃舍尔式不可能循环遮挡；退化为普通正三棱锥或在转角处破损断裂判定为失误；2. 分面光影：三组面朝向明暗对比分明，棱角倒角利落。",
    referenceSource: "https://en.wikipedia.org/wiki/Penrose_triangle",
  },
};

/**
 * 半杯浮冰水（阿基米德浮力与折射半透明）。
 * 考察物理浮力直觉（冰水密度比约 0.9，90% 浸没）、透明图层层叠与液面折射渲染。
 */
export const ICE_WATER_PROMPT: PromptSpec = {
  id: "ice-water-v1",
  label: "半杯浮冰水（Glass with Ice）",
  template: [
    "Generate an SVG illustration of a transparent cylindrical drinking glass half-filled with clear water and three floating ice cubes.",
    "Strictly follow Archimedes' buoyancy principle for ice in water: because ice density is roughly 917 kg/m³ relative to liquid water (~1000 kg/m³),",
    "approximately 90% of each floating ice cube's volume must be submerged below the water meniscus, with only about 10% exposed above the liquid surface.",
    "Depict realistic transparency and reflections: the glass walls, the elliptical water surface line (meniscus),",
    "subtle water volume coloring (light translucent cyan/blue), and semi-transparent ice cubes with crisp highlights and depth.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Archimedes%27_principle",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "阿基米德浮力定律（90% 浸没）与玻璃液面透明折射",
    groundTruth: "冰块与水密度比为 917/1000 ≈ 0.917，因此每块浮冰约 90% 体积浸没在水面下方，仅约 10% 露出液面；圆柱形透明玻璃杯身与椭圆形水面弯月面（meniscus）；半透明水体与冰块折射光泽。",
    evaluationCriteria: "1. 浮力物理（核心）：冰块完全浮在水面上（0% 浸没）或完全沉底判定为严重物理违背；约 90% 浸没在水面下为满分；2. 材质渲染：半透明水色与折射分界线清晰。",
    referenceSource: "https://en.wikipedia.org/wiki/Archimedes%27_principle",
  },
};

/**
 * 四冲程单缸活塞发动机（纯内联 SVG 动画）。
 * 考察多部件相位精确同步（曲轴、活塞、气门、点火）、连杆回转几何与机械剖面图层。
 */
export const FOUR_STROKE_ENGINE_PROMPT: PromptSpec = {
  id: "four-stroke-engine-v1",
  label: "四冲程发动机（Four-Stroke Engine）",
  template: [
    "Generate an animated SVG demonstrating a cross-section cutaway of a single-cylinder four-stroke internal combustion engine using pure inline SVG animation (SMIL or CSS keyframes).",
    "The engine structure must clearly feature a cylinder bore, a reciprocating piston with wrist pin, a connecting rod, a counterweighted crankshaft revolving around a fixed main bearing, intake and exhaust ports with poppet valves, and a spark plug at the cylinder head.",
    "The animation must run continuously and strictly adhere to the four-stroke thermodynamic cycle phase synchronization:",
    "1. Intake stroke: Piston travels downwards from Top Dead Center (TDC) to Bottom Dead Center (BDC); the intake valve opens downward while the exhaust valve remains closed.",
    "2. Compression stroke: Piston travels upwards from BDC to TDC; both intake and exhaust valves remain firmly closed.",
    "3. Power / Combustion stroke: Exactly as the piston reaches TDC, the spark plug flashes with a bright yellow-red ignition burst; hot expanding combustion drives the piston forcefully downwards from TDC to BDC; both valves remain closed.",
    "4. Exhaust stroke: Piston travels upwards from BDC to TDC; the exhaust valve opens to vent burnt exhaust gases while the intake valve remains closed.",
    "The connecting rod must smoothly pivot at both the piston wrist pin and the crank journal, following the circular rotation of the crankshaft.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Four-stroke_engine",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "四冲程内燃机循环相位同步与曲柄连杆运动学",
    groundTruth: "四冲程循环严格对齐：1. 进气（活塞下行+进气门开）；2. 压缩（活塞上行+双门紧闭）；3. 做功（上止点火花塞瞬间爆燃高亮+活塞受压强力下推）；4. 排气（活塞上行+排气门开）；连杆两端分别铰接活塞销与曲轴颈并遵循刚体几何自转与公转；曲轴转动 2 圈对应完整四冲程循环。",
    evaluationCriteria: "1. 相位时序同步（黄金指标）：点火爆发必须发生在压缩冲程结束时的上止点（TDC），气门开闭与活塞运动方向严格对应；2. 机械连杆刚体几何：连杆无脱开或拉伸变形，曲轴绕主轴中心定点旋转；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Four-stroke_engine",
  },
};

/**
 * 莫比乌斯环拓扑巡航小车（纯内联 SVG 动画）。
 * 考察非欧空间单侧表面拓扑连续性、720° 双圈回归与空间扭转透视遮挡。
 */
export const MOBIUS_STRIP_PROMPT: PromptSpec = {
  id: "mobius-strip-v1",
  label: "莫比乌斯小车（Möbius Strip Track）",
  template: [
    "Generate an animated SVG depicting a stylized vehicle (or rover) continuously cruising along an impossible-looking 3D Möbius strip track using pure inline SVG animation (SMIL or CSS keyframes).",
    "The Möbius strip ribbon must be rendered with dimensional shading, gradients, and perspective depth showing its continuous single-sided half-twist topology.",
    "The vehicle must travel at a steady speed along the centerline ribbon path and strictly demonstrate true non-orientable topological navigation:",
    "1. In the first 360° circuit, the vehicle drives along what appears to be the 'outer' surface, passes smoothly through the half-twist region, and emerges on the 'inner' inverted surface (upside down).",
    "2. In the second 360° circuit (completing a full 720° topological traversal), the inverted vehicle traverses the ribbon, passes through the twist once more, and smoothly flips back right-side up to its initial orientation.",
    "3. The vehicle and track must exhibit correct foreground-versus-background layer occlusion as it moves across overlapping ribbon segments.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/M%C3%B6bius_strip",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "非欧空间单侧表面拓扑连续性与 720° 双圈回归",
    groundTruth: "莫比乌斯带是仅有单侧与单一边界的非定向曲面；小车必须跑完整整 720° 拓扑周长才能经历一次正立-倒立-正立的完整周期；扭转过渡区呈现清晰的空间扭结明暗着色与前后图层遮挡。",
    evaluationCriteria: "1. 拓扑连续性（黄金指标）：必须连续跨越正反两面完成 720° 双圈巡航；仅在单侧 360° 生硬循环瞬移判定为拓扑理解失误；2. 空间遮挡与视错觉深度：前后层级遮挡关系自然流畅；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/M%C3%B6bius_strip",
  },
};

/**
 * 倒立摆小车自平衡控制（纯内联 SVG 动画）。
 * 考察经典控制理论物理因果律、反向加速度推力恢复与微平衡阻尼。
 */
export const CART_POLE_PROMPT: PromptSpec = {
  id: "cart-pole-v1",
  label: "倒立摆平衡小车（Cart-Pole Balance）",
  template: [
    "Generate an animated SVG simulating the classic Cart-Pole inverted pendulum self-balancing dynamical system using pure inline SVG animation (SMIL or CSS keyframes).",
    "The scene must feature a horizontal linear track, a motorized wheeled cart moving horizontally left and right, and an unactuated slender pole hinged via a frictionless pivot at the top center of the cart.",
    "The animation must clearly and faithfully demonstrate closed-loop feedback stabilization and physical causality:",
    "1. When the pole tilts slightly to the left, the cart rapidly accelerates to the LEFT underneath the pivot to generate a restoring torque that pushes the upright pole back toward vertical equilibrium.",
    "2. When the pole tilts slightly to the right, the cart rapidly accelerates to the RIGHT to catch and correct it.",
    "3. The cart wheels must rotate in accordance with the direction and speed of the horizontal translation.",
    "4. The system exhibits realistic continuous micro-adjustments with smooth natural damping, maintaining dynamic balance without the pole collapsing.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Inverted_pendulum",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "经典倒立摆控制理论闭环因果律与微平衡阻尼",
    groundTruth: "物理因果闭环：摆杆向哪侧倾斜失衡，小车必须同向加速平移以在支点下方提供向上托举恢复力矩（杆左倾则车左冲，杆右倾则车右冲）；车轮转动方向与水平位移方向严格一致；平衡振荡幅度收敛于平衡垂直轴。",
    evaluationCriteria: "1. 控制因果逻辑（核心）：因果倒置（杆左倒车向右开，导致直接倒地）判定为零分；正确同向加速度推力响应为满分；2. 机械耦合：摆杆固定铰接在车顶中心，随车运动无脱节；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Inverted_pendulum",
  },
};

/**
 * 三维等轴测赛博悬浮魔方（纯内联 SVG 动画）。
 * 考察 2D SVG 空间的三维仿射投影、欧拉角复合自转、爆炸分解与动态图层深度遮挡（Z-ordering）。
 */
export const CYBER_CUBE_PROMPT: PromptSpec = {
  id: "cyber-cube-v1",
  label: "三维赛博魔方（Isometric Cyber-Cube）",
  template: [
    "Generate an animated SVG depicting a futuristic 3D isometric cyber-cube (holographic exploded Rubik-style cube structure) floating in dark space using pure inline SVG animation (SMIL or CSS keyframes).",
    "The structure consists of multiple isometric cubelets rendered with glowing cyan and magenta wireframes, translucent geometric faces, and subtle gradients.",
    "The animation must continuously and smoothly demonstrate:",
    "1. Continuous 3D rotation with correct isometric affine projection, where face angles remain true to isometric geometry (30°/150°/270° axes).",
    "2. A periodic breathing/exploded-view cycle where outer cube segments smoothly expand outward along their 3D normal vectors, revealing a glowing inner core, then smoothly re-converge into a unified cube.",
    "3. Correct dynamic Z-ordering and depth occlusion, ensuring that rear cubelets and faces are properly occluded by foreground faces as they rotate.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Isometric_projection",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "三维等轴测仿射投影、欧拉角自转与动态前后图层遮挡（Z-ordering）",
    groundTruth: "等轴测三维轴系（30°/150°/270°）投影几何准确；立方体在三维空间匀速复合自转；向外爆炸分解（Exploded view）时各子方块沿各自法向量位移并平滑回缩复原；旋转时前后表面遮挡关系自然翻转，背光面暗度与投影网格协同。",
    evaluationCriteria: "1. 3D 投影与遮挡（黄金指标）：必须呈现真正的三维自转遮挡，背面多边形翻转到前面时正确覆盖后方，不得退化为 2D 扁平拉伸；2. 机械爆炸分解节奏：向外展开与归位具有弹性阻尼动效；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Isometric_projection",
  },
};

/**
 * 80年代合成波落日赛道巡航（纯内联 SVG 动画）。
 * 考察非线性透视网格伪 3D 速度感、落日百叶窗切片蒙版与车体横滚运动学。
 */
export const SYNTHWAVE_DRIVE_PROMPT: PromptSpec = {
  id: "synthwave-drive-v1",
  label: "合成波赛道巡航（Synthwave Roadster）",
  template: [
    "Generate an animated SVG capturing an iconic 1980s retro Synthwave / Outrun arcade driving scene using pure inline SVG animation (SMIL or CSS keyframes).",
    "The visual composition features:",
    "1. A glowing neon wireframe horizon ground grid in cyan/violet extending into the distance, with horizontal perspective lines continuously scrolling rapidly downward toward the viewer (spacing increasing logarithmically to create pseudo-3D velocity).",
    "2. A huge retro sunset on the distant horizon rendered with vibrant magenta-to-orange vertical gradient and horizontal segmented blinds/stripes.",
    "3. A sleek, stylized 80s futuristic cyber-roadster viewed from rear chase perspective in the lower-center foreground, with glowing red taillights and neon cyan underglow, smoothly swaying left and right as if cruising across lanes, accompanied by subtle body roll and pulsating exhaust thruster particles.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Synthwave",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "非线性透视网格伪 3D 速度感、落日切片蒙版与车体横滚运动学",
    groundTruth: "伪 3D 透视网格：横线向镜头高速平移且间距对数递增产生逼真的透视纵深速度感；落日水平百叶窗切片清晰带紫橙渐变；赛博跑车左右变道时带有微悬挂侧倾角（Roll angle）与对应地面动态投影。",
    evaluationCriteria: "1. 运动速度透视一致性（黄金指标）：网格移动必须远慢近快、线距符合透视投影，不得做成匀速垂直下移的梯子；2. 车体动力学质感：车辆漂移转向时伴随重力侧倾与尾灯粒子光效；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Synthwave",
  },
};

/**
 * 赛博朋克战术全息雷达 HUD 终端（纯内联 SVG 动画）。
 * 考察复合多轴差速自转对齐、雷达扫描荧光余辉与精密高密度矢量排版。
 */
export const CYBER_HUD_PROMPT: PromptSpec = {
  id: "cyber-hud-v1",
  label: "赛博全息战术 HUD（Cyberpunk Holographic HUD）",
  template: [
    "Generate an animated SVG depicting a cinematic, high-density cyberpunk holographic tactical HUD / radar targeting terminal using pure inline SVG animation (SMIL or CSS keyframes).",
    "The display interface features:",
    "1. A central circular tactical radar with a 360° sweeping beam in glowing neon green/cyan, leaving a soft trailing phosphorescent decay as it illuminates detected blips/targets on the grid.",
    "2. Concentric outer telemetry rings with ultra-fine angular tick marks and compass degrees, rotating smoothly in counter-opposing directions.",
    "3. Auxiliary telemetry modules around the perimeter: an oscillating real-time sine-wave / audio-frequency oscilloscope waveform, dynamic digital readout meters with pulsing hexagonal energy bars, and scrolling hex telemetry streams.",
    "Use dark background, glowing strokes with SVG glow filters (feGaussianBlur), and sharp geometric hierarchy.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Head-up_display",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "复合多轴自转对齐、雷达扫描荧光余辉与精密高密度矢量排版",
    groundTruth: "中心雷达波束以圆心为 transform-origin 顺时针旋转，扫过目标时触发局部高光与渐隐衰减余辉；同心刻度环正反向差速旋转；示波器正弦波形平滑连续流动；整体布局具备严密的对称性与视网膜级微型刻度对齐。",
    evaluationCriteria: "1. 旋转中心与余辉（黄金指标）：所有旋转刻度环与雷达波束必须精确共用中心点，无离心抖动；2. 信息层级：高密度线条利落分明，发光滤镜（feGaussianBlur）与半透明层叠自然；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Head-up_display",
  },
};

/**
 * 超大质量黑洞引力透镜吸积盘（纯内联 SVG 动画）。
 * 考察爱因斯坦广义相对论时空弯曲双重环投影与相对论多普勒辐射不对称。
 */
export const BLACK_HOLE_LENSING_PROMPT: PromptSpec = {
  id: "black-hole-lensing-v1",
  label: "黑洞引力透镜（Black Hole Gravitational Lensing）",
  template: [
    "Generate an animated SVG illustrating a spinning supermassive black hole with an accretion disk and strong gravitational lensing in deep space using pure inline SVG animation (SMIL or CSS keyframes).",
    "The astrophysical scene must faithfully represent:",
    "1. The central pitch-black shadow of the event horizon and photon sphere.",
    "2. A radiant, high-temperature plasma accretion disk orbiting the black hole; due to extreme spacetime curvature (Einstein general relativity), light from the back of the accretion disk is bent upwards and downwards over the shadow, forming the iconic double-ring gravitational lensing crown.",
    "3. Relativistic Doppler beaming: the side of the accretion disk rotating toward the observer is noticeably brighter, more energetic, and shifted toward white-blue, while the receding side is dimmer and shifted toward deep red-orange.",
    "4. Accretion matter streams and spiral vortices continuously flowing into the event horizon, with swirling orbital motion faster near the inner edge (Keplerian differential rotation).",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Gravitational_lens",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "广义相对论引力透镜时空弯曲双重环与相对论多普勒辐射不对称",
    groundTruth: "中心为绝对纯黑事件视界与光子球；背景吸积盘在强引力场下被扭曲弯折至黑洞上下两侧形成双重光晕冠；相对论多普勒频移：迎向观察者旋转侧辐射显著增强且偏高能蓝白，远离侧暗淡红移；开普勒差动旋转（内圈流速高于外圈）。",
    evaluationCriteria: "1. 相对论物理（黄金指标）：光线引力弯曲双重环与多普勒辐射迎背侧非对称明暗必须准确呈现，画成对称普通圆环判定为物理认知失误；2. 差动旋转与流线动效：吸积盘等离子体流线向内螺旋加速；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Gravitational_lens",
  },
};

/**
 * 量子双缝干涉与波粒二象性（纯内联 SVG 动画）。
 * 考察惠更斯-菲涅耳相干波前同心扩散、波程差空间交织与探测屏概率密度干涉条纹。
 */
export const QUANTUM_DOUBLE_SLIT_PROMPT: PromptSpec = {
  id: "quantum-double-slit-v1",
  label: "量子双缝干涉实验（Quantum Double-Slit Wave）",
  template: [
    "Generate an animated SVG demonstrating the classic quantum double-slit wave-particle duality and interference experiment using pure inline SVG animation (SMIL or CSS keyframes).",
    "The physical apparatus and dynamics must feature:",
    "1. An emitter on the far left continuously radiating coherent parallel wavefronts (moving linear plane waves) toward a central barrier.",
    "2. A central barrier with two closely spaced micro-slits.",
    "3. As the wavefront reaches the slits, Huygens-Fresnel wave diffraction creates two expanding concentric circular wave sources emerging from each slit.",
    "4. In the space between barrier and detector screen, the two circular wave trains overlap, creating dynamic wave interference: constructive interference where crests align (glowing peak lines) and destructive interference where crests cancel troughs (dark nodal lines).",
    "5. On the detector screen at the far right, show the resulting probability density curve and alternating bright and dark fringe bands dynamically building up intensity in direct alignment with the constructive interference angles.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Double-slit_experiment",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "惠更斯-菲涅耳相干波前同心扩散与明暗干涉条纹概率分布",
    groundTruth: "左侧入射连续平面行波；双狭缝各自产生同心扩散相干球面波（圆弧波阵面）；波程差满足整数倍波长处形成明亮辐射相长线，半整数倍处形成相消暗节线；最右侧探测屏上明暗相间的干涉条纹中心最亮且向两侧衰减，与理论概率密度函数高度吻合。",
    evaluationCriteria: "1. 波动光学几何（核心）：双缝出射必须为同心圆弧且波阵面同相位扩散，相长/相消干涉节点空间拓扑准确；2. 探测屏条纹对应：干涉条纹峰位与波干涉亮纹角度严格空间对齐；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Double-slit_experiment",
  },
};

/**
 * 磁流体尖刺脉动实验（纯内联 SVG 动画）。
 * 考察磁流体力学 Rosensweig 正常场不稳定性、圆锥尖刺阵列与金属镜面流体光泽。
 */
export const FERROFLUID_SPIKES_PROMPT: PromptSpec = {
  id: "ferrofluid-spikes-v1",
  label: "磁流体尖刺脉动实验（Ferrofluid Magnetic Spikes）",
  template: [
    "Generate an animated SVG visualizing the dynamic normal-field Rosensweig instability of a ferrofluid pool subjected to a pulsating magnetic field using pure inline SVG animation (SMIL or CSS keyframes).",
    "The scientific visualization features:",
    "1. A shallow circular dish containing an ultra-glossy, jet-black magnetic liquid (ferrofluid) with realistic specular highlights and ambient reflections.",
    "2. Beneath the dish, an active electromagnet pulses and rotates its magnetic field gradient.",
    "3. In response to the magnetic pulse, the liquid surface dynamically morphs from a calm, mirror-flat black surface into a dense hexagonal lattice of sharp, conical liquid spikes (spines) rising upward toward magnetic flux lines.",
    "4. As the magnetic field rotates and pulses in strength, the liquid spikes rhythmically grow, sharpen, divide, tilt toward rotating flux vectors, and then smoothly relax back into a rippling liquid pool.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Ferrofluid",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "磁流体力学 Rosensweig 正常场不稳定性、圆锥尖刺阵列与金属镜面流体光泽",
    groundTruth: "强垂直磁场下表面张力与磁化力竞争触发 Rosensweig 不稳定性，流体表面自组织凸起形成规则六边形点阵圆锥尖刺群；尖刺随磁场周期性耸立、扭动指向磁力线方向并平滑松弛；黑色高反射率金属镜面高光反射与微小涟漪。",
    evaluationCriteria: "1. 尖刺阵列形态（黄金指标）：呈现锐利圆锥尖端与流体自组织点阵，而非平庸的平面圆圈；2. 磁响应动态：尖刺拔高与倒回伴随流体吸聚与平滑变形；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Ferrofluid",
  },
};

/**
 * 韦伯空间望远镜主镜与遮阳帆空间展开架构（航天前沿）。
 * 考察 18 块六边形蜂窝镀金主镜、三脚副镜桁架与 5 层菱形隔热遮阳帆空间拓扑与冷热色温渲染。
 */
export const JWST_DEPLOYMENT_PROMPT: PromptSpec = {
  id: "jwst-deployment-v1",
  label: "韦伯太空望远镜（JWST Deployment）",
  template: [
    "Generate an SVG technical illustration of the James Webb Space Telescope (JWST) in deep space showcasing its iconic deployed architecture and thermal-optical engineering.",
    "The spacecraft structure must accurately feature:",
    "1. Primary Mirror Array: Exactly 18 hexagonal beryllium segments coated in vapor-deposited gold, arranged in a pristine, seamless honeycomb array with a central clearance hole for the aft optics subsystem; three slender deployable secondary mirror support struts extending forward to hold the secondary mirror assembly aiming directly back at the primary array.",
    "2. Five-Layer Sunshield: 5 distinct diamond/kite-shaped kapton sunshield membranes stacked beneath the telescope with clear separation gaps and tensioning spreader cables, visually isolating the hot spacecraft bus side from the cryogenic science instrument deck.",
    "3. Spacecraft Bus & Propulsion: On the warm sun-facing side beneath the sunshield, depict the spacecraft bus, solar power array, and gimbaled high-gain communications antenna pointing toward Earth.",
    "4. Deep Space Atmosphere & Lighting: Deep space backdrop with subtle starry field; dramatic, scientifically accurate lighting with warm golden-amber specular reflections across the primary mirrors on the cryogenic side, contrasted with intense solar glare along the silver-pink sunshield layers.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://webb.nasa.gov/content/observatory/sunshield.html",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "18 块六边形主镜蜂窝矩阵、三脚副镜桁架与五层菱形遮阳帆空间拓扑",
    groundTruth: "18 块正六边形蜂窝镀金主镜矩阵（中央留空）；向前伸出三脚铰接桁架汇聚于副镜；底部 5 层间距分明的菱形/风筝形遮阳帆阻隔冷热两端；向阳侧底部配备太阳能帆板与高增益天线；冷端（镜面与仪器舱）与热端（底盘与太阳帆）光照与色温严谨区分。",
    evaluationCriteria: "1. 六边形主镜阵列（黄金指标）：18 块六边形主镜必须排列为严密对称蜂窝，缺少六边形或错乱排列判定为空间结构失误；2. 副镜三脚桁架与五层遮阳帆：三脚架空间透视汇聚于副镜，5 层风筝帆层叠清晰；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://webb.nasa.gov/content/observatory/sunshield.html",
  },
};

/**
 * 托卡马克受控核聚变反应堆磁约束截面与等离子体芯部（核物理前沿，纯内联 SVG 动画）。
 * 考察 D 形真空室截面、环向/极向场线圈正交拓扑与螺旋磁力线发光等离子体。
 */
export const TOKAMAK_PLASMA_PROMPT: PromptSpec = {
  id: "tokamak-plasma-v1",
  label: "托卡马克核聚变反应堆（Tokamak Fusion Core）",
  template: [
    "Generate an animated SVG illustrating a high-tech cutaway cross-section and 3D perspective of a Tokamak magnetic confinement fusion reactor using pure inline SVG animation (SMIL or CSS keyframes).",
    "The nuclear fusion engineering system must accurately depict:",
    "1. Central Toroidal Vacuum Vessel: A clean D-shaped toroidal cross-section chamber with internal divertor plates at the bottom for helium exhaust.",
    "2. Magnetic Confinement System: Vertical D-shaped Toroidal Field Coils encircling the chamber, horizontal circular Poloidal Field Coils rings surrounding the perimeter, and a central solenoid pillar at the core axis.",
    "3. Plasma Core & Dynamics: A radiant, incandescent burning plasma torus inside the D-shaped vacuum chamber, featuring continuous swirling helical magnetic flux lines (twisting field lines representing the safety factor q-profile) in vivid neon cyan, electric violet, and scorching core white.",
    "4. Thermal & Structural Shielding: Cryostat exterior wall, blanket modules protecting the coils, and neutral beam injection ports.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://www.iter.org/mach/tokamak",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "托卡马克 D 形真空室截面、正交环向/极向磁场线圈拓扑与螺旋磁力线等离子体",
    groundTruth: "真空室呈严谨的 D 型截面（垂直平直内侧与外凸外侧）；底部具备偏转器（Divertor）；大 D 型环向场线圈与水平环绕的极向场线圈空间正交；中心为高耸圆柱形中心螺线管；芯部发光等离子体沿环向与极向双重扭曲螺旋缠绕（磁剪切与 q 分布）；外层包裹超导低温恒温器与包层屏蔽。",
    evaluationCriteria: "1. 聚变磁约束拓扑（黄金指标）：真空室必须呈 D 形而非普通圆管，线圈正交空间关系正确，等离子体具备螺旋磁力线拓扑；2. 等离子体发光动效：高能芯部白亮、边缘紫青色温渐变且具有流动螺旋感；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://www.iter.org/mach/tokamak",
  },
};

/**
 * 2nm 全环绕栅极纳米片晶体管与背面供电网络（半导体芯片微观前沿）。
 * 考察 3 层水平硅纳米片沟道、360° 全包裹高 K 金属栅极、源漏外延与背面供电轨（BSPDN）微观三维架构。
 */
export const GAA_NANOSHEET_PROMPT: PromptSpec = {
  id: "gaa-nanosheet-v1",
  label: "2nm 纳米片晶体管（2nm GAA Nanosheet & Backside Power）",
  template: [
    "Generate an SVG technical 3D cutaway diagram of a state-of-the-art 2nm Gate-All-Around (GAA) nanosheet field-effect transistor with Backside Power Delivery Network (BSPDN).",
    "The nano-architectural microelectronics structure features:",
    "1. Nanosheet Channel: Three vertically stacked, horizontally flat silicon (or SiGe) nanosheet ribbons forming the conduction channels, separated by uniform sub-nanometer vertical gaps.",
    "2. Gate-All-Around Stack: High-k dielectric and metallic gate completely wrapping 360° around every individual nanosheet channel ribbon, extending between and around all three sheets.",
    "3. Source/Drain Epitaxy: Faceted raised source and drain crystalline epitaxial blocks abutting both ends of the nanosheet ribbons, with inner dielectric spacers isolating gate from S/D.",
    "4. Frontside & Backside Interconnects: Top-side signal interconnect metal layers (M0/M1) routing out contacts, and bottom-side Backside Power Delivery Network (Super Power Rail) connected directly to source contacts via nano-through-silicon vias (nTSV).",
    "Use a modern high-contrast semiconductor cleanroom CAD aesthetic with crisp layer color coding (silicon blue, metal gate gold/copper, dielectric green/cyan, isolation gray).",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Nanosheet",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "3 层水平硅纳米片全包覆栅极（GAA）、源漏外延与背面供电网络（BSPDN）微观拓扑",
    groundTruth: "3 层水平平行堆叠的硅纳米片沟道，上下及层间被 High-k 金属栅极 360° 无死角包围（全环绕栅极，区别于 FinFET 的三面栅）；沟道两端为外延生长的多边形源极与漏极；内侧绝缘介质垫片（Inner Spacers）隔离栅极与源漏；晶圆正面有信号金属线，背面配备划时代的背面供电轨（BSPDN）与穿透通孔直接给源极供电。",
    evaluationCriteria: "1. GAA 拓扑（黄金指标）：栅极必须 360° 穿插包裹每片纳米片，若画成三面包裹的鳍状 FinFET 或实心方块判定为架构失误；2. 背面供电层次：清晰区分正面信号走线与晶圆背面独立供电网络；3. 标示与分层：纳米尺度结构比例协调、剖面颜色层次清晰。",
    referenceSource: "https://en.wikipedia.org/wiki/Nanosheet",
  },
};

/**
 * CRISPR-Cas9 基因剪刀与 DNA 双螺旋剪切复合体（生物医药与蛋白质前沿）。
 * 考察 Cas9 双叶蛋白结构、gRNA 发夹环引导、DNA 解旋形成的 R-环（R-Loop）与 PAM 双催化中心精确断裂。
 */
export const CRISPR_CAS9_PROMPT: PromptSpec = {
  id: "crispr-cas9-rloop-v1",
  label: "CRISPR-Cas9 基因剪刀（CRISPR-Cas9 & DNA R-Loop）",
  template: [
    "Generate an SVG scientific macromolecular visualization of the CRISPR-Cas9 genome-editing complex actively unwinding and cleaving target double-stranded DNA.",
    "The structural biology model must clearly depict:",
    "1. Cas9 Protein Scaffolding: Bi-lobed enzyme architecture consisting of the Recognition (REC) lobe and the Nuclease (NUC) lobe with distinct domains (including HNH and RuvC catalytic active cleavage centers indicated by glowing molecular scissor marks).",
    "2. Guide RNA (gRNA): A vibrant single guide RNA molecule winding through the central channel of Cas9, with a folded scaffold hairpin loop (tracrRNA handle) locked into the REC lobe and a 20-nucleotide guide spacer sequence.",
    "3. DNA Unwinding & R-Loop Formation: The target double-stranded DNA helix enters the enzyme; the DNA strands separate to form a distinct R-loop where the target DNA strand is base-paired with the guide RNA, while the non-target DNA strand is displaced into a single-stranded loop.",
    "4. Cleavage Sites & PAM: Highlight the Protospacer Adjacent Motif (PAM, 5'-NGG-3') recognition binding cleft, with HNH domain cleaving the target strand and RuvC domain cleaving the non-target strand precisely 3 base pairs upstream of the PAM site.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://www.rcsb.org/structure/4OO8",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "Cas9 双叶蛋白结构、gRNA 碱基互补、DNA 双链解旋 R-环（R-Loop）与 PAM 双活性中心剪切",
    groundTruth: "Cas9 蛋白分为识别叶（REC）与核酸酶叶（NUC）；包含两个催化结构域：HNH 负责剪切靶标链，RuvC 负责剪切非靶标链；单向导 gRNA（含发夹茎环）与解旋的靶标 DNA 链碱基配对，形成标志性 R-环（R-loop）；非靶标链被置换推开呈单链弧形；特异性识别 PAM（NGG）并在其上游 3 个碱基处完成双链精确断裂。",
    evaluationCriteria: "1. 分子生物学拓扑（核心）：必须呈现完整的 R-环（靶标链与 gRNA 配对，非靶标链解离），不可画成普通闭合双螺旋；2. 双核酸酶剪切中心：准确区分 HNH 与 RuvC 两个剪切位点与 PAM 序列；3. 视觉表现：蛋白包裹腔体、核酸链骨架与碱基阶梯分明。",
    referenceSource: "https://www.rcsb.org/structure/4OO8",
  },
};

/**
 * 脉冲星相对论高能喷流与风星云（前沿天体物理与纯视觉特效，纯内联 SVG 动画）。
 * 考察高速自转中子星磁偶极灯塔效应、相对论准直双向喷流激波节点与赤道风星云展开。
 */
export const PULSAR_JET_PROMPT: PromptSpec = {
  id: "pulsar-jet-v1",
  label: "脉冲星相对论喷流（Pulsar Relativistic Jet & Nebula）",
  template: [
    "Generate an animated SVG visualizing a rapidly spinning magnetized neutron star (pulsar) emitting relativistic particle jets and powering a pulsating synchrotron wind nebula using pure inline SVG animation (SMIL or CSS keyframes).",
    "The cosmic physics spectacle features:",
    "1. Central Neutron Star: An ultra-dense, blindingly bright spinning sphere at the core with extreme magnetic surface poles.",
    "2. Dual Relativistic Jets: Two blazing, collimated particle beams shooting outwards from opposite magnetic poles along the rotational axis, with helical shock nodes and glowing knots propagating away from the core at near light speed.",
    "3. Magnetic Dipole Lighthouse Beams: Sweeping cone beams of synchrotron radiation swinging through 360° space like an interstellar lighthouse beacon, producing rhythmic periodic flashes as the beams align with the viewer line of sight.",
    "4. Toroidal Pulsar Wind Nebula: Concentric equatorial shock rings and filamentary ion clouds glowing in electric turquoise, magenta, and solar amber, expanding dynamically outward from the magnetic termination shock.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Pulsar_wind_nebula",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "中子星磁偶极辐射灯塔效应、相对论准直双向喷流节点与赤道激波环星云",
    groundTruth: "中心为高速自转的高密度中子星；沿磁轴发射两道高度准直的相对论粒子喷流，喷流内部具有沿程传播的高亮激波节点（shock nodes）；磁倾角导致两束辐射光锥绕自转轴做圆锥形扫掠（脉冲星灯塔效应）；赤道平面展开同心圆弧或环状激波风星云（Pulsar Wind Nebula，类蟹状星云结构）。",
    evaluationCriteria: "1. 天体物理对称与灯塔效应（黄金指标）：双向极向喷流与赤道环面具备严格物理对称性，辐射束扫过周期性明暗闪烁；2. 粒子激波层次：星云灯丝纤维结构与向外扩散的动效层次分明；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Pulsar_wind_nebula",
  },
};

export const BUILTIN_PROMPTS: readonly PromptSpec[] = [
  CLASSIC_PROMPT,
  UPGRADED_PROMPT,
  ANIMATED_PELICAN_PROMPT,
  LEIJUN_PROMPT,
  CLOCK_PROMPT,
  PENROSE_PROMPT,
  ICE_WATER_PROMPT,
  FOUR_STROKE_ENGINE_PROMPT,
  MOBIUS_STRIP_PROMPT,
  CART_POLE_PROMPT,
  CYBER_CUBE_PROMPT,
  SYNTHWAVE_DRIVE_PROMPT,
  CYBER_HUD_PROMPT,
  BLACK_HOLE_LENSING_PROMPT,
  QUANTUM_DOUBLE_SLIT_PROMPT,
  FERROFLUID_SPIKES_PROMPT,
  JWST_DEPLOYMENT_PROMPT,
  TOKAMAK_PLASMA_PROMPT,
  GAA_NANOSHEET_PROMPT,
  CRISPR_CAS9_PROMPT,
  PULSAR_JET_PROMPT,
  SHUIHU_PROMPT,
  SHUIHU_ANIM_PROMPT,
  XIYOU_PROMPT,
  XIYOU_ANIM_PROMPT,
  SANGUO_PROMPT,
  SANGUO_ANIM_PROMPT,
  HONGLOU_PROMPT,
  HONGLOU_ANIM_PROMPT,
  ...ALL_FRONTIER_PROMPTS,
];

export * from "./prompts";
export * from "./prompt-schema";

import { assertValidPromptSpec } from "./prompt-schema";

/** 合并内置条目与自定义条目；自定义条目覆盖不可变条目时抛错 */
export function buildRegistry(
  custom: readonly PromptSpec[] = [],
): ReadonlyMap<string, PromptSpec> {
  const registry = new Map<string, PromptSpec>(
    BUILTIN_PROMPTS.map((spec) => [spec.id, spec]),
  );

  for (const spec of custom) {
    // 校验自定义题目数据结构合规性
    assertValidPromptSpec(spec, {
      requireStandard: false, // 自定义题目允许暂无黄金标准，但若有则必须合规
      requireLifecycleDates: false, // 自定义题目允许缺省日期
      requireSvgRequirement: false, // 允许灵活自定义
    });

    const existing = registry.get(spec.id);
    if (existing?.immutable === true) {
      throw new Error(
        `提示词 "${spec.id}" 是不可变的基准锚点，不能被自定义条目覆盖`,
      );
    }
    registry.set(spec.id, spec);
  }
  return registry;
}

export function listPrompts(custom: readonly PromptSpec[] = []): PromptSpec[] {
  return [...buildRegistry(custom).values()];
}

/** 查不到即抛错：未登记的 promptId 属于配置错误 */
export function resolvePrompt(
  id: string,
  custom: readonly PromptSpec[] = [],
): PromptSpec {
  const registry = buildRegistry(custom);
  const spec = registry.get(id);
  if (spec) return spec;

  // 1. 尝试从前沿单题映射表中检索
  const individual = FRONTIER_INDIVIDUAL_PROMPT_MAP.get(id);
  if (individual) return individual;

  // 2. 尝试从套题候选集（candidates）中检索并派生
  for (const parent of registry.values()) {
    if (parent.candidates && parent.candidates.length > 0) {
      const candidate = parent.candidates.find((c) => c.id === id);
      if (candidate) {
        return {
          id: candidate.id,
          label: candidate.label,
          template: candidate.text,
          variables: [],
          candidates: [],
          source: parent.source,
          verified: parent.verified,
          immutable: parent.immutable,
          originDate: parent.originDate,
          registeredAt: parent.registeredAt,
          standard: candidate.standard ?? parent.standard,
        };
      }
    }
  }

  const known = [...registry.keys(), ...FRONTIER_INDIVIDUAL_PROMPT_MAP.keys()].join(", ");
  throw new Error(`未知的 promptId "${id}"，已登记的提示词：${known}`);
}

/** 获取指定题目的客观参考标准（若未登记或无标准则返回 null） */
export function resolvePromptStandard(
  id: string,
  bindingsOrCustom?: Readonly<Record<string, string>> | readonly PromptSpec[] | null,
  custom: readonly PromptSpec[] = [],
): PromptStandard | null {
  const isCustomList = Array.isArray(bindingsOrCustom);
  const bindings = isCustomList ? null : (bindingsOrCustom as Readonly<Record<string, string>> | null | undefined);
  const actualCustom = isCustomList ? (bindingsOrCustom as readonly PromptSpec[]) : custom;
  try {
    const registry = buildRegistry(actualCustom);
    const spec = registry.get(id);

    // 1. 若提供了 bindings 且 spec 含有候选集，优先精准匹配具体子候选的标准
    const candidateKey = bindings?.["回目"] || bindings?.["candidate"];
    if (spec?.candidates && spec.candidates.length > 0 && candidateKey) {
      const matched = spec.candidates.find(
        (c) =>
          c.label === candidateKey ||
          c.id === candidateKey ||
          c.label.includes(candidateKey) ||
          candidateKey.includes(c.label),
      );
      if (matched) {
        if (matched.standard) return matched.standard;
        const indiv = FRONTIER_INDIVIDUAL_PROMPT_MAP.get(matched.id);
        if (indiv?.standard) return indiv.standard;
      }
    }

    // 2. 若存在顶层 spec 且有 standard，返回其 standard
    if (spec?.standard) return spec.standard;

    // 3. 尝试从前沿单题映射表中检索（按 candidateKey 或 id）
    if (candidateKey) {
      const byKey = FRONTIER_INDIVIDUAL_PROMPT_MAP.get(candidateKey);
      if (byKey?.standard) return byKey.standard;
      for (const indiv of FRONTIER_INDIVIDUAL_PROMPT_MAP.values()) {
        if (indiv.label.includes(candidateKey) || candidateKey.includes(indiv.label)) {
          if (indiv.standard) return indiv.standard;
        }
      }
    }

    const indiv = FRONTIER_INDIVIDUAL_PROMPT_MAP.get(id);
    if (indiv?.standard) return indiv.standard;

    // 4. 回退至 resolvePrompt 派生
    const resolved = resolvePrompt(id, actualCustom);
    return resolved.standard ?? null;
  } catch {
    return null;
  }
}

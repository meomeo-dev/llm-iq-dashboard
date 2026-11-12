/**
 * 城市地标候选集：四十座城市各一处地标，以微缩景观风格出题。
 *
 * 地标按 docs/research/landmarks/selection-rules.md 的七条准入规则筛选：版权已过期、
 * 外形无商标、不以真实人物为主体、所在国无文物图像权、政治中立、全程纯文字、宁缺毋滥。
 * 每座地标的事实表、准入判定与参考条目记录在同目录下的编号文件里。题面里关于地标本身的
 * 结构、比例与颜色只取自事实表；微缩场景的陈设、光影与色板建议值为本仓库自撰的渲染层
 * 指令，不借用任何条目原文或照片。
 *
 * 题面采用固定骨架：主体 → 结构 → 比例 → 材质与色彩 → 环境与微缩细节 → 优先级说明 →
 * 构图与镜头 → 光影与材质 → 远近层次 → 微缩细节 → 氛围 →（动态）→ 风格与绘制技法 → 禁止。前五段每景
 * 各异，其余由 composeLandmarkPrompt 统一拼接，各景逐字相同，只在「禁止」末尾追加该景特有的
 * 排除项。
 *
 * 四十景的数据只维护一份（LANDMARK_SCENES），从中派生两套题：
 * - `landmarks-v1` 静态版：候选 id 为 `landmark-<slug>`；
 * - `landmarks-anim-v1` 动态版：多注入一段【动态】，候选 id 为 `landmark-anim-<slug>`，
 *   评分标准在各景标准之后追加统一的动画判据。
 */

import type { PromptCandidate, PromptSpec } from "../../types";

import type { LandmarkPromptParts, LandmarkScene } from "./types";
import { SCENES_01_10 } from "./scenes-01-10";
import { SCENES_11_20 } from "./scenes-11-20";
import { SCENES_21_30 } from "./scenes-21-30";
import { SCENES_31_40 } from "./scenes-31-40";

/**
 * 统一的渲染层段落，四十条题面逐字相同。
 *
 * 这些段落只讲「怎么画」，不含任何地标事实，也不点名任何具体物件或材质：底座怎么搭、光从哪来、
 * 明暗怎么分、远近怎么拉开、陈设怎样才算是可以凑近看的小模型。画什么、什么颜色、什么质感、
 * 有哪些陈设，全部由各景的五段数据决定；渲染层开头的 PRECEDENCE 明确写出这条优先级，
 * 防止统一段落无中生有或与某一景的描述相抵触。
 */
const PRECEDENCE =
  "以下各段只规定画法。凡与【主体】【结构】【比例】【材质与色彩】【环境与微缩细节】五段有出入的，" +
  "一律以那五段为准；不添加那五段没有写到的任何物件、材质或效果。";
const COMPOSITION =
  "【构图与镜头】把整座模型放在一块厚度可见的圆形展示底座上，底座顶面就是【环境与微缩细节】" +
  "段描述的地面或水面，侧壁比顶面深一档，顶面外沿留一道细细的亮边；镜头取约 30° 俯视的四分之三" +
  "视角，带轻微透视，让主体的两个面同时可见，若【主体】段指定了观看方向则以它为准；主体居中，" +
  "最长的一边约占画面对应方向的 70%，底座占画面宽度约 80%。";
const LIGHTING =
  "【光影与材质】光源在左上方约 45°，是柔和的漫射顶光。每个体块都分出受光、中间、背光三档明度，" +
  "受光面顶边再提一道更亮的窄边，背光面底边压一道更暗的窄边。质感按【材质与色彩】段写的来，" +
  "本段只规定明暗的做法：硬而光滑的表面高光集中成一条窄边，粗糙的表面高光散成一片；透明或" +
  "反光的表面把上方物件的颜色压暗后映在下面；有砌缝、纹理、格纹这类表面细节时，只在受光面画出，" +
  "背光面并入暗部。凡是悬出、凹进和两个构件相接的地方，用半透明深色形状压一层环境光遮蔽。" +
  "主体按光源方向在地面上拖出一片柔和的投影，底座下方再画一个淡淡的椭圆投影。";
const DEPTH =
  "【远近层次】以主体所在的位置为基准分近、中、远：主体所在的那一层最实、对比最强；比主体更近的" +
  "陈设颜色略深、边缘清楚；比主体更远的东西整体提亮、降低饱和度、边缘变软、不描轮廓，像隔着" +
  "一层薄薄的空气。";
const DETAIL =
  "【微缩细节】只画【环境与微缩细节】段写到的陈设，不添加那里没有的东西；但写到的每一件都" +
  "按可以凑近看的小模型来画：会动的东西带上它运动留下的痕迹，立着的东西有自己的小投影，" +
  "有开口的东西在开口里留一点更深的暗部，成组的东西至少两种尺寸、散落而不排成阵。凡是" +
  "【结构】或【环境与微缩细节】段写成一排、一圈、一片的重复构件，就成排铺满，不能画三个代表" +
  "一排。尺寸上限以【比例】段为准。";
const ATMOSPHERE =
  "【氛围】时间、天气与季节以【主体】段为准，画面整体是一件放在安静陈列室里的模型：底座以外的" +
  "背景只画自上而下由浅到更浅的柔和渐变，不画任何景物；模型比底座与背景更实、对比更强，让" +
  "视线落在模型上；整体偏亮，最深的暗部也不发黑，而是带一点该处材质的颜色。";
const STYLE =
  "【风格与绘制技法】miniature diorama 微缩景观的玩具模型质感：体量来自明暗面而不是线描；" +
  "轮廓线细而干净或不画。细节要密而有序，结构与比例必须准确，宁可多分一档明度，不要省成" +
  "一块平色。用分层的简单形状堆叠建筑与地貌；渐变可用线性与径向；允许用 <filter> 做柔和" +
  "投影与远处的轻微模糊；重复构件放进 <defs>，用 <use> 或 <pattern> 复用；不使用位图与" +
  "外部引用。";
const FORBIDDEN_BASE = "【禁止】文字、旗帜、徽记、标语、真实人物、JavaScript 与交互事件";

/**
 * 动态版多出的一段。只给一个判断方法，不点名任何物件、类别或效果：到该景【环境与微缩细节】段里
 * 找现实中本来就会动的东西，让它按现实里的方式动；找不到就整幅静止。主体永远不动。这样结构与
 * 比例的判据在两套题里完全一致，也不会为了动画凭空多出一辆车、一棵树或一道光。
 */
const MOTION =
  "【动态】主体建筑或地貌本身静止不动。到【环境与微缩细节】段里找现实中本来就会动的东西，" +
  "只让这些东西动，动法就是它们在现实里的动法，幅度按微缩模型的尺度缩小；那一段没有写到的" +
  "东西一律不画，不为了动画添加任何物件、光效或天气变化。如果该景没有会动的东西，就整幅静止，" +
  "这不算缺陷。动画一律用 SMIL（<animate>、<animateTransform>、" +
  "<animateMotion>）或写在 <style> 里的 CSS @keyframes 实现，每个循环 4 到 12 秒，缓入缓出，" +
  "循环处不能有跳变；旋转与摇摆的中心必须落在该物件自身的轴点上，不能绕画布原点转；" +
  "动画元素总数不超过十二个，其余保持静止。若使用 <style>，把 CSS 包在 <![CDATA[ ]]> 里，" +
  "不出现未转义的 & 与 <。";

/** 静态与动态两套题的渲染层，差别只在有没有【动态】这一段 */
const STATIC_RENDER_LAYER =
  PRECEDENCE + COMPOSITION + LIGHTING + DEPTH + DETAIL + ATMOSPHERE + STYLE;
const ANIMATED_RENDER_LAYER =
  PRECEDENCE + COMPOSITION + LIGHTING + DEPTH + DETAIL + ATMOSPHERE + MOTION + STYLE;

function composeLandmarkPrompt(parts: LandmarkPromptParts, renderLayer: string): string {
  return (
    "生成一幅 SVG 插画。" +
    `【主体】${parts.subject}` +
    `【结构】${parts.structure}` +
    `【比例】${parts.proportion}` +
    `【材质与色彩】${parts.material}` +
    `【环境与微缩细节】${parts.environment}` +
    renderLayer +
    `${FORBIDDEN_BASE}、${parts.forbidden}。`
  );
}

/** 动态版在各景标准之后追加的统一动画判据 */
const MOTION_CORE_KEY = "陈设与环境的循环动画平滑、旋转中心落在物件自身轴点、主体保持静止";
const MOTION_CRITERIA =
  "动态部分：满分为环境段里现实中会动的陈设按其现实动法做平滑无跳变的循环，旋转与摇摆绕" +
  "自身轴点，主体静止，纯 SMIL 或内联 CSS 驱动；该景没有会动之物时整幅静止不扣分。扣分：" +
  "为了动画添加环境段没有的物件、光效或天气；主体建筑跟着动或变形；绕画布原点旋转导致物件" +
  "飞离；循环处明显跳变；使用 JavaScript；XML 解析出错。";

function toStaticCandidate(scene: LandmarkScene): PromptCandidate {
  return {
    id: `landmark-${scene.slug}`,
    label: scene.label,
    text: composeLandmarkPrompt(scene.parts, STATIC_RENDER_LAYER),
    standard: scene.standard,
  };
}

function toAnimatedCandidate(scene: LandmarkScene): PromptCandidate {
  return {
    id: `landmark-anim-${scene.slug}`,
    label: `${scene.label}（动态）`,
    text: composeLandmarkPrompt(scene.parts, ANIMATED_RENDER_LAYER),
    standard: {
      ...scene.standard,
      coreKey: `${scene.standard.coreKey}；${MOTION_CORE_KEY}`,
      evaluationCriteria: `${scene.standard.evaluationCriteria}${MOTION_CRITERIA}`,
    },
  };
}

/** 四十景数据，静态与动态两套题的唯一来源；改这里，两套题同时生效 */
const LANDMARK_SCENES: readonly LandmarkScene[] = [
  ...SCENES_01_10,
  ...SCENES_11_20,
  ...SCENES_21_30,
  ...SCENES_31_40,
];

const SUITE_SOURCE = "docs/research/landmarks/selection-rules.md";

export const LANDMARKS_PROMPT: PromptSpec = {
  id: "landmarks-v1",
  label: "城市地标·微缩景观四十景",
  template: "四十座城市各一处地标的微缩景观，每个轮换周期洗牌抽一条，逐字发送该条全文。",
  variables: [],
  candidates: LANDMARK_SCENES.map(toStaticCandidate),
  source: SUITE_SOURCE,
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-29",
  standard: {
    coreKey: "按文字描述还原世界地标的结构比例，并以微缩景观风格呈现",
    groundTruth:
      "每条候选附有独立的事实表：建成年代、高度与基底尺寸、层数与分段、材料与颜色、" +
      "周边环境，全部取自 Wikidata（CC0）与 Wikipedia 条目中的事实。",
    evaluationCriteria:
      "以候选各自的 standard 为准；共同要求：地标可被一眼认出、关键构件齐全、比例与" +
      "颜色符合事实表、呈现为展示底座上的俯视微缩模型、不含文字与旗帜。",
    referenceSource: SUITE_SOURCE,
  },
};

export const LANDMARKS_ANIM_PROMPT: PromptSpec = {
  id: "landmarks-anim-v1",
  label: "动态城市地标·微缩景观四十景",
  template:
    "与 landmarks-v1 同一份四十景数据，题面多一段【动态】：主体静止，陈设与环境做纯内联" +
    "循环动画。每个轮换周期洗牌抽一条，逐字发送该条全文。",
  variables: [],
  candidates: LANDMARK_SCENES.map(toAnimatedCandidate),
  source: SUITE_SOURCE,
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-29",
  standard: {
    coreKey: "在静态版的结构比例判据之上，考察陈设与环境的纯内联循环动画",
    groundTruth:
      "事实表与静态版完全相同；动画只作用于该景环境段里现实中会动的陈设，按其现实动法循环，" +
      "主体建筑或地貌静止，由 SMIL 或内联 CSS @keyframes 驱动，每个循环 4 到 12 秒；" +
      "没有会动之物的景整幅静止。",
    evaluationCriteria:
      "先按静态版判据评结构、比例与颜色，再看动态：只动环境段里现实中会动的陈设、循环平滑" +
      "无跳变、旋转与摇摆绕物件自身轴点、主体不动、不为动画添加任何物件或光效、无 JavaScript、" +
      "XML 合规。",
    referenceSource: SUITE_SOURCE,
  },
};

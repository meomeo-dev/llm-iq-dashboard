/** 评测提示词数据。 */

import type { PromptSpec } from "../../../types";


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

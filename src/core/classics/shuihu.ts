/**
 * 《水浒传》候选集：袁无涯刊百二十回本逐回名场面，每回一条静态题面、一条动态题面。
 *
 * 回数与回目对照维基文库百二十回本核对，逐回考证笔记在 docs/research/classics/shuihu/，题面与评判标准的
 * 写法见 docs/research/classics/README.md。画面描述为本仓库自撰：人物外貌取原著描写的要点、
 * 以今语转述，不照录原文；不用戏曲扮相与影视造型（如西门庆的折扇）。原文里的血腥与裸露细节不入画，
 * 打斗只取出手之前的一刻。
 *
 * 已考证的回目按每十二回一卷放在 shuihu/chNNN-MMM.ts，各带本回评判标准。
 */

import type { PromptSpec } from "../prompt";
import { SHUIHU_ANIM_CH001_012, SHUIHU_CH001_012 } from "./shuihu/ch001-012";
import { SHUIHU_ANIM_CH013_024, SHUIHU_CH013_024 } from "./shuihu/ch013-024";
import { SHUIHU_ANIM_CH025_036, SHUIHU_CH025_036 } from "./shuihu/ch025-036";
import { SHUIHU_ANIM_CH037_048, SHUIHU_CH037_048 } from "./shuihu/ch037-048";
import { SHUIHU_ANIM_CH049_060, SHUIHU_CH049_060 } from "./shuihu/ch049-060";
import { SHUIHU_ANIM_CH061_072, SHUIHU_CH061_072 } from "./shuihu/ch061-072";

export const SHUIHU_PROMPT: PromptSpec = {
  id: "shuihu-v1",
  label: "水浒传·逐回名场面",
  template: "《水浒传》逐回名场面，每回一条，每个轮换周期洗牌抽一条，逐字发送该条全文。",
  variables: [],
  candidates: [
    ...SHUIHU_CH001_012,
    ...SHUIHU_CH013_024,
    ...SHUIHU_CH025_036,
    ...SHUIHU_CH037_048,
    ...SHUIHU_CH049_060,
    ...SHUIHU_CH061_072,
  ],
  source: "https://zh.wikisource.org/wiki/水滸傳_(120回本)",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-24",
  standard: {
    coreKey: "中国古典文学水浒原著情节与人物标志性道具/姿态",
    groundTruth: "忠实还原抽中回目的原著核心情节（如拳打镇关西鲁达英武姿态、倒拔垂杨柳发力神态、林冲风雪山神庙雪夜长枪葫芦、景阳冈武松打虎等），不混入戏曲现代魔改造型。",
    evaluationCriteria: "1. 人物身份：标志性武器与服饰符合宋代背景与原著描写；2. 情节叙事：关键场景道具与动作合乎回目核心冲突。",
    referenceSource: "https://zh.wikisource.org/wiki/水滸傳_(120回本)",
  },
};

export const SHUIHU_ANIM_PROMPT: PromptSpec = {
  id: "shuihu-anim-v1",
  label: "水浒传·动态名场面",
  template:
    "《水浒传》逐回动态名场面（纯内联 SVG 动画），每回一条，每个轮换周期洗牌抽一条，逐字发送该条全文。",
  variables: [],
  candidates: [
    ...SHUIHU_ANIM_CH001_012,
    ...SHUIHU_ANIM_CH013_024,
    ...SHUIHU_ANIM_CH025_036,
    ...SHUIHU_ANIM_CH037_048,
    ...SHUIHU_ANIM_CH049_060,
    ...SHUIHU_ANIM_CH061_072,
  ],
  source: "https://zh.wikisource.org/wiki/水滸傳_(120回本)",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "水浒名场面叙事还原与纯内联动作动效",
    groundTruth: "忠实还原水浒经典回目动作张力，具备连续平滑的内联 SVG 动画（SMIL 或 CSS @keyframes），关节旋转与位移中心准确，XML 严格合法。",
    evaluationCriteria: "1. 动效质量：打击、拔树、风雪、奔马等核心动作流畅循环；2. 人物考据：宋代服饰兵刃与原著相符；3. 语法规范：XML 解析零错误、无重复属性与非法注释。",
    referenceSource: "https://zh.wikisource.org/wiki/水滸傳_(120回本)",
  },
};


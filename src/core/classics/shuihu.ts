/**
 * 《水浒传》候选集：袁无涯刊百二十回本逐回名场面，每回一条静态题面、一条动态题面。
 *
 * 回数与回目对照维基文库百二十回本核对，逐回考证笔记在 docs/research/classics/shuihu/，题面与评判标准的
 * 写法见 docs/research/classics/README.md。画面描述为本仓库自撰：人物外貌取原著描写的要点、
 * 以今语转述，不照录原文；不用戏曲扮相与影视造型（如西门庆的折扇）。原文里的血腥与裸露细节不入画，
 * 打斗只取出手之前的一刻。
 *
 * 逐回题面按每十二回一卷放在 shuihu/chNNN-MMM.ts，各带本回评判标准。
 */

import type { PromptSpec } from "../prompt";
import { SHUIHU_ANIM_CH001_012, SHUIHU_CH001_012 } from "./shuihu/ch001-012";
import { SHUIHU_ANIM_CH013_024, SHUIHU_CH013_024 } from "./shuihu/ch013-024";
import { SHUIHU_ANIM_CH025_036, SHUIHU_CH025_036 } from "./shuihu/ch025-036";
import { SHUIHU_ANIM_CH037_048, SHUIHU_CH037_048 } from "./shuihu/ch037-048";
import { SHUIHU_ANIM_CH049_060, SHUIHU_CH049_060 } from "./shuihu/ch049-060";
import { SHUIHU_ANIM_CH061_072, SHUIHU_CH061_072 } from "./shuihu/ch061-072";
import { SHUIHU_ANIM_CH073_084, SHUIHU_CH073_084 } from "./shuihu/ch073-084";
import { SHUIHU_ANIM_CH085_096, SHUIHU_CH085_096 } from "./shuihu/ch085-096";
import { SHUIHU_ANIM_CH097_108, SHUIHU_CH097_108 } from "./shuihu/ch097-108";
import { SHUIHU_ANIM_CH109_120, SHUIHU_CH109_120 } from "./shuihu/ch109-120";

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
    ...SHUIHU_CH073_084,
    ...SHUIHU_CH085_096,
    ...SHUIHU_CH097_108,
    ...SHUIHU_CH109_120,
  ],
  source: "https://zh.wikisource.org/wiki/水滸傳_(120回本)",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-24",
  standard: {
    coreKey: "水浒传原著场面与人物衣冠还原",
    groundTruth:
      "忠实还原抽中回目的原著场面（如倒拔垂杨柳、风雪山神庙、智取生辰纲、景阳冈打虎、江州劫法场、六和寺听潮等），" +
      "人物样貌衣冠按本回阶段的原著描写，不借用后世戏曲、影视造型；打斗只取出手之前的一刻，不画血腥与裸露。",
    evaluationCriteria:
      "1. 情节时刻与器物：所画为本回原文那一刻，器物准确（如山神庙门边大石、景阳冈半截断棒与白毡笠、发配者脸上" +
      "刺字）；2. 人物身份：样貌衣冠符合宋代背景与本回描写，具名人物可辨。",
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
    ...SHUIHU_ANIM_CH073_084,
    ...SHUIHU_ANIM_CH085_096,
    ...SHUIHU_ANIM_CH097_108,
    ...SHUIHU_ANIM_CH109_120,
  ],
  source: "https://zh.wikisource.org/wiki/水滸傳_(120回本)",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "水浒原著名场面与纯内联环境动效",
    groundTruth:
      "忠实还原抽中回目的原著场面，具备连续平滑的内联 SVG 动画（风雪、火光烟尘、水波芦苇、旌旗、灯烛、柳枝等" +
      "现实中会动的物件），一次性动作取定格，人物不整体漂移，XML 严格合法。",
    evaluationCriteria:
      "1. 环境动效：所列动效循环流畅自然，由 SMIL 或内联 CSS 驱动；2. 人物考据：宋代衣冠兵刃与本回原著描写相符；" +
      "3. 语法规范：XML 解析零错误、无重复属性与非法注释。",
    referenceSource: "https://zh.wikisource.org/wiki/水滸傳_(120回本)",
  },
};


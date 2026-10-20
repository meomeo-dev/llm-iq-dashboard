/**
 * 《三国演义》候选集：毛宗岗评本 120 回逐回名场面，每回一条静态题面、一条动态题面。
 *
 * 回数与回目对照维基文库毛本核对，逐回考证笔记在 docs/research/classics/sanguo/，题面与评判标准的
 * 写法见 docs/research/classics/README.md。画面描述为本仓库自撰：人物外貌取原著描写的要点、
 * 以今语转述，不照录原文；不用后世影视、戏曲、游戏的独有造型（如赵云白袍白马、京剧脸谱）。
 *
 * 逐回题面按每十二回一卷放在 sanguo/chNNN-MMM.ts，各带本回评判标准。
 */

import type { PromptSpec } from "../prompt";
import { SANGUO_ANIM_CH001_012, SANGUO_CH001_012 } from "./sanguo/ch001-012";
import { SANGUO_ANIM_CH013_024, SANGUO_CH013_024 } from "./sanguo/ch013-024";
import { SANGUO_ANIM_CH025_036, SANGUO_CH025_036 } from "./sanguo/ch025-036";
import { SANGUO_ANIM_CH037_048, SANGUO_CH037_048 } from "./sanguo/ch037-048";
import { SANGUO_ANIM_CH049_060, SANGUO_CH049_060 } from "./sanguo/ch049-060";
import { SANGUO_ANIM_CH061_072, SANGUO_CH061_072 } from "./sanguo/ch061-072";
import { SANGUO_ANIM_CH073_084, SANGUO_CH073_084 } from "./sanguo/ch073-084";
import { SANGUO_ANIM_CH085_096, SANGUO_CH085_096 } from "./sanguo/ch085-096";
import { SANGUO_ANIM_CH097_108, SANGUO_CH097_108 } from "./sanguo/ch097-108";
import { SANGUO_ANIM_CH109_120, SANGUO_CH109_120 } from "./sanguo/ch109-120";

export const SANGUO_PROMPT: PromptSpec = {
  id: "sanguo-v1",
  label: "三国演义·逐回名场面",
  template: "《三国演义》逐回名场面，每回一条，每个轮换周期洗牌抽一条，逐字发送该条全文。",
  variables: [],
  candidates: [
    ...SANGUO_CH001_012,
    ...SANGUO_CH013_024,
    ...SANGUO_CH025_036,
    ...SANGUO_CH037_048,
    ...SANGUO_CH049_060,
    ...SANGUO_CH061_072,
    ...SANGUO_CH073_084,
    ...SANGUO_CH085_096,
    ...SANGUO_CH097_108,
    ...SANGUO_CH109_120,
  ],
  source: "https://zh.wikisource.org/wiki/三國演義",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-24",
  standard: {
    coreKey: "三国演义原著典故与人物衣冠还原",
    groundTruth:
      "忠实还原抽中回目的原著场面（如桃园结义乌牛白马、煮酒论英雄、长坂坡赵云怀护阿斗、草船借箭、空城计凭栏抚琴等），" +
      "人物样貌衣冠按原著所写，不借用后世戏曲、影视造型，不画血腥。",
    evaluationCriteria:
      "1. 典故标志物：本回原文写到的器物准确（如乌牛白马、青釭剑、受箭草把、焚香抚琴）；" +
      "2. 阵营与氛围：人物神态、阵营旗号与历史厚重感符合本回描写。",
    referenceSource: "https://zh.wikisource.org/wiki/三國演義",
  },
};

export const SANGUO_ANIM_PROMPT: PromptSpec = {
  id: "sanguo-anim-v1",
  label: "三国演义·动态名场面",
  template:
    "《三国演义》逐回动态名场面（纯内联 SVG 动画），每回一条，每个轮换周期洗牌抽一条，逐字发送该条全文。",
  variables: [],
  candidates: [
    ...SANGUO_ANIM_CH001_012,
    ...SANGUO_ANIM_CH013_024,
    ...SANGUO_ANIM_CH025_036,
    ...SANGUO_ANIM_CH037_048,
    ...SANGUO_ANIM_CH049_060,
    ...SANGUO_ANIM_CH061_072,
    ...SANGUO_ANIM_CH073_084,
    ...SANGUO_ANIM_CH085_096,
    ...SANGUO_ANIM_CH097_108,
    ...SANGUO_ANIM_CH109_120,
  ],
  source: "https://zh.wikisource.org/wiki/三國演義",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "三国原著名场面与纯内联旌旗/自然动效",
    groundTruth:
      "忠实还原抽中回目的原著场面与战阵氛围，具备连续平滑的内联 SVG 动画（旌旗翻卷、战马鬃尾与蹄下扬尘、" +
      "火焰烟尘、江雾水波等），一次性动作取定格，XML 严格合法。",
    evaluationCriteria:
      "1. 环境动效：旌旗、鬃尾、火焰烟尘、江雾水波循环流畅自然，人物不整体漂移；" +
      "2. 历史厚重感：汉末魏晋甲胄与器械考据；3. 语法规范：XML 解析零错误。",
    referenceSource: "https://zh.wikisource.org/wiki/三國演義",
  },
};


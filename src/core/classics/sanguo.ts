/**
 * 《三国演义》候选集：毛宗岗评本 120 回逐回名场面，每回一条静态题面、一条动态题面。
 *
 * 回数与回目对照维基文库毛本核对，逐回考证笔记在 docs/research/classics/sanguo/，题面与评判标准的
 * 写法见 docs/research/classics/README.md。画面描述为本仓库自撰：人物外貌取原著描写的要点、
 * 以今语转述，不照录原文；不用后世影视、戏曲、游戏的独有造型（如赵云白袍白马、京剧脸谱）。
 *
 * 已考证的回目按每十二回一卷放在 sanguo/chNNN-MMM.ts，各带本回评判标准；其余回目暂留本文件。
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
    coreKey: "三国历史演义典故与名将英姿还原",
    groundTruth: "忠实还原抽中回目的历史典故（如桃园结义乌牛白马、煮酒论英雄青梅盘、长坂坡单骑救主阿斗与青釭剑、草船借箭万箭束草等）。",
    evaluationCriteria: "1. 典故标志物：核心物象准确（如青梅、羽扇、青龙偃月刀）；2. 阵营与氛围：历史厚重感与人物气魄传达。",
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
    coreKey: "三国战阵交锋与纯内联兵刃/自然动效",
    groundTruth: "忠实还原三国历史战役与英雄决断氛围，具备连续平滑的内联 SVG 动画（箭雨破空、青龙刀寒芒、战马奔腾、狂风旌旗等），XML 严格合法。",
    evaluationCriteria: "1. 战阵动效：兵刃碰撞火花、箭雨密集落点、风云变幻流畅自然；2. 历史厚重感：汉末魏晋甲胄与器械考据；3. 语法规范：XML 解析零错误。",
    referenceSource: "https://zh.wikisource.org/wiki/三國演義",
  },
};


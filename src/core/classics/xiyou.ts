/**
 * 《西游记》候选集：通行百回本逐回名场面，每回一条静态题面、一条动态题面。
 *
 * 回数与回目对照维基文库原著全文核对，逐回考证笔记在 docs/research/classics/xiyou/，
 * 题面与评判标准的写法见 docs/research/classics/README.md。画面描述为本仓库自撰，只取原著
 * 描写的要点、以今语转述，不借用 1986 版电视剧等改编作品的造型。悟空的样貌按原著分阶段：
 * 第 14 回之前没有金箍与虎皮裙，第 14 回之后才围虎皮裙、戴金箍；“定海神针”“八戒背媳妇”
 * 属后世流传，不入题面。
 *
 * 已考证的回目按每十回一卷放在 xiyou/chNNN-MMM.ts，各带本回评判标准；其余回目暂列本文件，
 * 只有套题级标准。
 */

import type { PromptSpec } from "../prompt";
import { XIYOU_ANIM_CH001_010, XIYOU_CH001_010 } from "./xiyou/ch001-010";
import { XIYOU_ANIM_CH011_020, XIYOU_CH011_020 } from "./xiyou/ch011-020";
import { XIYOU_ANIM_CH021_030, XIYOU_CH021_030 } from "./xiyou/ch021-030";
import { XIYOU_ANIM_CH031_040, XIYOU_CH031_040 } from "./xiyou/ch031-040";
import { XIYOU_ANIM_CH041_050, XIYOU_CH041_050 } from "./xiyou/ch041-050";
import { XIYOU_ANIM_CH051_060, XIYOU_CH051_060 } from "./xiyou/ch051-060";
import { XIYOU_ANIM_CH061_070, XIYOU_CH061_070 } from "./xiyou/ch061-070";
import { XIYOU_ANIM_CH071_080, XIYOU_CH071_080 } from "./xiyou/ch071-080";

export const XIYOU_PROMPT: PromptSpec = {
  id: "xiyou-v1",
  label: "西游记·逐回名场面",
  template: "《西游记》逐回名场面，每回一条，每个轮换周期洗牌抽一条，逐字发送该条全文。",
  variables: [],
  candidates: [
    ...XIYOU_CH001_010,
    ...XIYOU_CH011_020,
    ...XIYOU_CH021_030,
    ...XIYOU_CH031_040,
    ...XIYOU_CH041_050,
    ...XIYOU_CH051_060,
    ...XIYOU_CH061_070,
    ...XIYOU_CH071_080,
  ],
  source: "https://zh.wikisource.org/wiki/西遊記",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-24",
  standard: {
    coreKey: "西游原著神魔构图与经典角色法宝表现力",
    groundTruth: "忠实还原抽中回目的神话场景（如石猴出世水帘洞、龙宫取金箍棒、如来掌中五指山、三打白骨精、火焰山芭蕉扇等），角色神态与环境气氛生动。",
    evaluationCriteria: "1. 法宝道具：金箍棒、芭蕉扇等法宝表征准确；2. 场景辨识度：环境符合原著描写。",
    referenceSource: "https://zh.wikisource.org/wiki/西遊記",
  },
};

export const XIYOU_ANIM_PROMPT: PromptSpec = {
  id: "xiyou-anim-v1",
  label: "西游记·动态名场面",
  template:
    "《西游记》逐回动态名场面（纯内联 SVG 动画），每回一条，每个轮换周期洗牌抽一条，逐字发送该条全文。",
  variables: [],
  candidates: [
    ...XIYOU_ANIM_CH001_010,
    ...XIYOU_ANIM_CH011_020,
    ...XIYOU_ANIM_CH021_030,
    ...XIYOU_ANIM_CH031_040,
    ...XIYOU_ANIM_CH041_050,
    ...XIYOU_ANIM_CH051_060,
    ...XIYOU_ANIM_CH061_070,
    ...XIYOU_ANIM_CH071_080,
  ],
  source: "https://zh.wikisource.org/wiki/西遊記",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "西游神话法宝光影与纯内联形变/位移动效",
    groundTruth: "忠实还原西游神话经典法宝与神通特效，具备连续平滑的内联 SVG 动画（金箍棒缩放、三昧真火喷吐、芭蕉扇狂风等），XML 严格合法。",
    evaluationCriteria: "1. 法宝动效：神光流转、烈焰翻滚、法宝旋转等动效生动；2. 角色特征：美猴王、神魔形象考究；3. 语法规范：XML 解析零错误。",
    referenceSource: "https://zh.wikisource.org/wiki/西遊記",
  },
};


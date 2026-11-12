/**
 * 《红楼梦》候选集：维基文库 120 回汇校本逐回名场面，每回一条静态题面、一条动态题面。
 *
 * 底本前八十回为庚辰本、后四十回为程甲本，第十七、十八回分立两回；逐回考证笔记在
 * docs/research/classics/honglou/，题面与评判标准的写法见 docs/research/classics/README.md。
 * 画面描述为本仓库自撰：人物外貌取原著描写的要点、以今语转述，不照录原文；不借用 1987 版
 * 电视剧、越剧与戏曲造型，原著没写的衣着与季节不强加。不画死亡、血与床帏，少年少女衣着端正。
 *
 * 已考证的回目按每十二回一卷放在 chNNN-MMM.ts，各带本回评判标准。
 */

import type { PromptSpec } from "../../../types";
import { HONGLOU_ANIM_CH001_012, HONGLOU_CH001_012 } from "./ch001-012";
import { HONGLOU_ANIM_CH013_024, HONGLOU_CH013_024 } from "./ch013-024";
import { HONGLOU_ANIM_CH025_036, HONGLOU_CH025_036 } from "./ch025-036";
import { HONGLOU_ANIM_CH037_048, HONGLOU_CH037_048 } from "./ch037-048";
import { HONGLOU_ANIM_CH049_060, HONGLOU_CH049_060 } from "./ch049-060";
import { HONGLOU_ANIM_CH061_072, HONGLOU_CH061_072 } from "./ch061-072";
import { HONGLOU_ANIM_CH073_084, HONGLOU_CH073_084 } from "./ch073-084";
import { HONGLOU_ANIM_CH085_096, HONGLOU_CH085_096 } from "./ch085-096";
import { HONGLOU_ANIM_CH097_108, HONGLOU_CH097_108 } from "./ch097-108";
import { HONGLOU_ANIM_CH109_120, HONGLOU_CH109_120 } from "./ch109-120";

export const HONGLOU_PROMPT: PromptSpec = {
  id: "honglou-v1",
  label: "红楼梦·逐回名场面",
  template: "《红楼梦》逐回名场面，每回一条，每个轮换周期洗牌抽一条，逐字发送该条全文。",
  variables: [],
  candidates: [
    ...HONGLOU_CH001_012,
    ...HONGLOU_CH013_024,
    ...HONGLOU_CH025_036,
    ...HONGLOU_CH037_048,
    ...HONGLOU_CH049_060,
    ...HONGLOU_CH061_072,
    ...HONGLOU_CH073_084,
    ...HONGLOU_CH085_096,
    ...HONGLOU_CH097_108,
    ...HONGLOU_CH109_120,
  ],
  source: "https://zh.wikisource.org/wiki/紅樓夢",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-24",
  standard: {
    coreKey: "红楼梦诗意古典场景与细腻人物服饰意境",
    groundTruth: "忠实还原抽中回目的经典诗意场景（如黛玉进府仪态万方、黛玉葬花花锄花囊花冢、晴雯撕扇傲骨娇憨、刘姥姥游大观园等），色彩典雅优美。",
    evaluationCriteria: "1. 意境传达：诗意细节（花冢、折扇、大观园雪景等）精准；2. 人物气质：符合金陵十二钗服饰与性格刻画。",
    referenceSource: "https://zh.wikisource.org/wiki/紅樓夢",
  },
};

export const HONGLOU_ANIM_PROMPT: PromptSpec = {
  id: "honglou-anim-v1",
  label: "红楼梦·动态名场面",
  template:
    "《红楼梦》逐回动态名场面（纯内联 SVG 动画），每回一条，每个轮换周期洗牌抽一条，逐字发送该条全文。",
  variables: [],
  candidates: [
    ...HONGLOU_ANIM_CH001_012,
    ...HONGLOU_ANIM_CH013_024,
    ...HONGLOU_ANIM_CH025_036,
    ...HONGLOU_ANIM_CH037_048,
    ...HONGLOU_ANIM_CH049_060,
    ...HONGLOU_ANIM_CH061_072,
    ...HONGLOU_ANIM_CH073_084,
    ...HONGLOU_ANIM_CH085_096,
    ...HONGLOU_ANIM_CH097_108,
    ...HONGLOU_ANIM_CH109_120,
  ],
  source: "https://zh.wikisource.org/wiki/紅樓夢",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "红楼古典意境与纯内联落花/飞雪/微风诗意动效",
    groundTruth: "忠实还原红楼梦大观园诗性空间与人物神韵，具备连续平滑的内联 SVG 动画（落花飞舞、游蝶盘旋、烛影摇曳、风筝升空等），XML 严格合法。",
    evaluationCriteria: "1. 诗意动效：微粒漂浮（花瓣、柳絮、雪花）轻盈自然；2. 人物服饰：清代工笔画雅致美学；3. 语法规范：XML 解析零错误。",
    referenceSource: "https://zh.wikisource.org/wiki/紅樓夢",
  },
};


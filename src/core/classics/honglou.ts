/**
 * 《红楼梦》候选集：维基文库 120 回汇校本逐回名场面，每回一条静态题面、一条动态题面。
 *
 * 底本前八十回为庚辰本、后四十回为程甲本，第十七、十八回分立两回；逐回考证笔记在
 * docs/research/classics/honglou/，题面与评判标准的写法见 docs/research/classics/README.md。
 * 画面描述为本仓库自撰：人物外貌取原著描写的要点、以今语转述，不照录原文；不借用 1987 版
 * 电视剧、越剧与戏曲造型，原著没写的衣着与季节不强加。不画死亡、血与床帏，少年少女衣着端正。
 *
 * 已考证的回目按每十二回一卷放在 honglou/chNNN-MMM.ts，各带本回评判标准；其余回目暂留本文件。
 */

import type { PromptSpec } from "../prompt";
import { HONGLOU_ANIM_CH001_012, HONGLOU_CH001_012 } from "./honglou/ch001-012";
import { HONGLOU_ANIM_CH013_024, HONGLOU_CH013_024 } from "./honglou/ch013-024";
import { HONGLOU_ANIM_CH025_036, HONGLOU_CH025_036 } from "./honglou/ch025-036";
import { HONGLOU_ANIM_CH037_048, HONGLOU_CH037_048 } from "./honglou/ch037-048";
import { HONGLOU_ANIM_CH049_060, HONGLOU_CH049_060 } from "./honglou/ch049-060";
import { HONGLOU_ANIM_CH061_072, HONGLOU_CH061_072 } from "./honglou/ch061-072";
import { HONGLOU_ANIM_CH073_084, HONGLOU_CH073_084 } from "./honglou/ch073-084";
import { HONGLOU_ANIM_CH085_096, HONGLOU_CH085_096 } from "./honglou/ch085-096";

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
    {
      id: "honglou-097",
      label: "第97回 黛玉焚稿",
      text:
        "生成一幅 SVG 插画，描绘《红楼梦》第九十七回“林黛玉焚稿断痴情”的场面：潇湘馆内室，窗外竹影摇曳，" +
        "天气寒冷。病骨支离的黛玉被扶着靠坐在炕上，把一卷诗稿和一方题过诗的旧手帕投进炕上的火盆，火苗窜起。" +
        "丫鬟紫鹃伸手想抢又不敢，另一个小丫鬟从火里抢出残稿扔在地上踩灭。一盏孤灯照着满室凄清。",
    },
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
    {
      id: "honglou-anim-097",
      label: "第97回 黛玉焚稿（动态）",
      text:
        "生成一幅带纯内联 SVG 动画（使用 SMIL 或内联 CSS @keyframes）的矢量插画，描绘《红楼梦》第九十七回“林黛玉焚稿断痴情”的动态场面：潇湘馆内病弱黛玉靠坐炕上，将诗稿与题诗旧帕投进火盆火苗窜起，紫鹃惊呼伸手欲夺，丫鬟抢出残稿踩灭，孤灯照着凄清。" +
        "动效要求：1. 炕上炭火盆中通红火舌窜起吞噬诗稿、黑烟与灰烬盘旋升空；2. 窗外潇湘馆修竹在寒风中剧烈摇曳投下颤动竹影；3. 桌头孤灯如豆火苗惨然摇晃。严格遵守合法 XML 规范。",
    },
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


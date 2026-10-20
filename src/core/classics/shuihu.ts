/**
 * 《水浒传》候选集：袁无涯刊百二十回本逐回名场面，每回一条静态题面、一条动态题面。
 *
 * 回数与回目对照维基文库百二十回本核对，逐回考证笔记在 docs/research/classics/shuihu/，题面与评判标准的
 * 写法见 docs/research/classics/README.md。画面描述为本仓库自撰：人物外貌取原著描写的要点、
 * 以今语转述，不照录原文；不用戏曲扮相与影视造型（如西门庆的折扇）。原文里的血腥与裸露细节不入画，
 * 打斗只取出手之前的一刻。
 *
 * 已考证的回目按每十二回一卷放在 shuihu/chNNN-MMM.ts，各带本回评判标准；其余回目暂留本文件。
 */

import type { PromptSpec } from "../prompt";
import { SHUIHU_ANIM_CH001_012, SHUIHU_CH001_012 } from "./shuihu/ch001-012";
import { SHUIHU_ANIM_CH013_024, SHUIHU_CH013_024 } from "./shuihu/ch013-024";
import { SHUIHU_ANIM_CH025_036, SHUIHU_CH025_036 } from "./shuihu/ch025-036";
import { SHUIHU_ANIM_CH037_048, SHUIHU_CH037_048 } from "./shuihu/ch037-048";

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
    {
      id: "shuihu-056",
      label: "第56回 时迁盗甲",
      text:
        "生成一幅 SVG 插画，描绘《水浒传》第五十六回“吴用使时迁盗甲”的场面：深夜，一户人家的卧房里，" +
        "主人夫妇在床帐后熟睡，桌上一盏残灯昏黄。身材瘦小、一身黑衣的时迁像壁虎一样伏在房梁上，" +
        "伸手去解悬挂在梁上的一只红色皮匣，匣里装着一副珍贵的宝甲。窗外月色清冷。",
    },
    {
      id: "shuihu-071",
      label: "第71回 石碣受天文",
      text:
        "生成一幅 SVG 插画，描绘《水浒传》第七十一回“忠义堂石碣受天文”的场面：夜里三更，" +
        "梁山忠义堂前的高坛上烛火通明、香烟缭绕，一团火球从裂开的夜空中直落坛前。身穿红袍、手持笏板的" +
        "宋江居中，一位身披鹤氅的道士在旁作法，众多头领分列两旁，仰头惊呼或跪拜。" +
        "坛前地上露出一块刻满古怪文字的石碑，远处一面杏黄大旗上写着“替天行道”。",
    },
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
    {
      id: "shuihu-anim-056",
      label: "第56回 时迁盗甲（动态）",
      text:
        "生成一幅带纯内联 SVG 动画（使用 SMIL 或内联 CSS @keyframes）的矢量插画，描绘《水浒传》第五十六回“吴用使时迁盗甲”的动态场面：深夜卧房中残灯昏黄，一身黑衣的时迁轻如灵燕伏在房梁上，伸手去解悬挂梁上的红色宝甲皮匣；窗外月色清冷。" +
        "动效要求：1. 时迁在房梁上身体轻盈倒悬起伏探身潜行；2. 红皮匣内珍贵宝甲缝隙暗泛流动微光；3. 房内残灯与窗外月影微颤。严格遵守合法 XML 规范。",
    },
    {
      id: "shuihu-anim-071",
      label: "第71回 石碣受天文（动态）",
      text:
        "生成一幅带纯内联 SVG 动画（使用 SMIL 或内联 CSS @keyframes）的矢量插画，描绘《水浒传》第七十一回“忠义堂石碣受天文”的动态场面：夜里三更梁山忠义堂高坛烛火通明、香烟缭绕，一团火球从裂开的夜空直落坛前；宋江跪拜，地上一块刻满天书的石碑，大旗写着“替天行道”。" +
        "动效要求：1. 苍穹裂隙处神异火球带着光晕缓缓旋转下坠；2. 高坛烛光与三炷香烟袅袅盘旋升腾；3. “替天行道”杏黄大旗迎风飞扬卷动。严格遵守合法 XML 规范。",
    },
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


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
    {
      id: "xiyou-054",
      label: "第54回 西梁女国",
      text:
        "生成一幅 SVG 插画，描绘《西游记》第五十四回西梁女国的场面：女儿国城门外，" +
        "宫女和女官的仪仗排成长列，一辆装饰着龙凤的华丽车驾停在路中。女王发髻盘金凤、簪满珠翠，" +
        "披着红纱，含笑拉住唐僧的手请他同乘；唐僧身披锦襕袈裟、头戴毗卢帽，满脸窘迫。" +
        "悟空、八戒与沙僧站在一旁，神情各异。",
    },
    {
      id: "xiyou-058",
      label: "第58回 真假美猴王",
      text:
        "生成一幅 SVG 插画，描绘《西游记》第五十八回“真假美猴王”的场面：灵山雷音寺前的云头上，" +
        "两个一模一样的孙悟空——同样的金箍、虎皮裙和铁棒——正在缠斗，谁也分不出真假。" +
        "下方莲台上端坐着如来，诸佛与罗汉分列两旁，如来手中托着一只金色的钵盂。",
    },
    {
      id: "xiyou-061",
      label: "第61回 扇灭火焰山",
      text:
        "生成一幅 SVG 插画，描绘《西游记》第六十一回扇灭火焰山的场面：八百里火焰山烈焰冲天、寸草不生。" +
        "头戴金箍、腰围虎皮裙的孙悟空站在山前，双手抡动一柄比人还高的巨大芭蕉扇；" +
        "扇过之处火焰熄灭，乌云翻滚、大雨倾盆，一半画面仍是火海，一半已被雨水浇灭。",
    },
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
    {
      id: "xiyou-anim-054",
      label: "第54回 西梁女国（动态）",
      text:
        "生成一幅带纯内联 SVG 动画（使用 SMIL 或内联 CSS @keyframes）的矢量插画，描绘《西游记》第五十四回西梁女国的动态场面：女儿国城门外龙凤车驾华美，女王盘凤髻披红纱含笑牵住唐僧双手邀其同乘，唐僧锦襕袈裟毗卢帽满脸窘迫，悟空八戒沙僧站在旁边神态各异。" +
        "动效要求：1. 龙凤车驾四角挂着的金铃流苏在微风中轻柔摇晃晃动；2. 女王身上轻薄红纱曼妙飘拂；3. 唐僧窘迫低头合十手中念珠轻转。严格遵守合法 XML 规范。",
    },
    {
      id: "xiyou-anim-058",
      label: "第58回 真假美猴王（动态）",
      text:
        "生成一幅带纯内联 SVG 动画（使用 SMIL 或内联 CSS @keyframes）的矢量插画，描绘《西游记》第五十八回“真假美猴王”的动态场面：灵山大雷音寺云头上，两个一模一样戴金箍、围虎皮裙的孙悟空挥舞铁棒激烈缠斗，下方莲台如来端坐托着金钵，诸佛罗汉分列观战。" +
        "动效要求：1. 两个美猴王在半空中交错对攻、铁棒碰撞交锋火花迸射；2. 如来掌中金钵散发出一道道旋转扩散的金色佛光光晕；3. 脚底祥云飞卷。严格遵守合法 XML 规范。",
    },
    {
      id: "xiyou-anim-061",
      label: "第61回 扇灭火焰山（动态）",
      text:
        "生成一幅带纯内联 SVG 动画（使用 SMIL 或内联 CSS @keyframes）的矢量插画，描绘《西游记》第六十一回扇灭火焰山的动态场面：八百里火焰山烈焰滔天。戴金箍围虎皮裙的悟空站在山前双手抡动比人还高的巨大芭蕉扇，扇过之处暴风呼啸、黑云泼雨浇灭熊熊火海。" +
        "动效要求：1. 孙悟空挥舞芭蕉扇画弧扇动，扇面掀起螺旋形狂暴风暴；2. 八百里火焰山千丈火海在狂风暴雨中被大幅压制翻腾；3. 泼盆大雨急促倾泻。严格遵守合法 XML 规范。",
    },
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


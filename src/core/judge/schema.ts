/**
 * 评审记录（judgement）的类型与各题的评分标准（rubric）。
 * 记录落盘为 data/runs/<runId>/<attemptKey>.judge.json，结构与
 * docs/research/judge/judge.schema.json 一致；代码层先写，AI 层随后填分。
 */

import type { TokenUsage } from "../../pricing/types";

export type JudgeSource = "static" | "render" | "ai";
export type Verdict = "online" | "degraded" | "pending";

export interface JudgeSubject {
  runId: string;
  /** SVG 文件名去掉扩展名 */
  attemptKey: string;
  promptId: string;
  cli: string;
  model: string;
  effort: string;
  svgFile: string;
  svgSha256?: string;
}

export interface JudgeRubricRef {
  id: string;
  version: number;
  passThreshold: number;
}

export interface JudgeActor {
  kind: "code" | "ai";
  /** 代码层写打分器名与版本，AI 层写 cli/model */
  id: string;
  promptVersion?: number;
  judgedAt: string;
  durationMs?: number;
  rawFile?: string;
  /** AI 层：本次评审全部问答（含重试）的 token 用量，从裁判转录解析；成本读取时按价格目录折算 */
  usage?: TokenUsage | null;
  /** AI 层：问答次数 */
  asks?: number;
}

/** 细节联系表的类别：每类一张表，与帧序联系表同帧号、同取样时刻 */
export type DetailKind = "pelican" | "head" | "crank" | "saddle" | "handlebar" | "wheel-left" | "wheel-right";

/** 一类关键部位的放大联系表：8 帧共用同一取景框 */
export interface ContactSheetDetail {
  kind: DetailKind;
  /** 给读图者看的部位名，如「脚踏与脚」 */
  subject: string;
  file: string;
  /** 取景框（viewBox 单位） */
  region: { x: number; y: number; width: number; height: number };
  /** 相对整幅画面的放大倍数 */
  zoom: number;
  /** 这张表主要服务哪些标准 */
  criteria: string[];
  /** 取景框由谁定：代码层几何推断，或裁判看首帧给的框（ACR-021）；旧记录没有此字段即 code */
  locatedBy?: "code" | "ai";
}

/** 给 AI 层的图件清单：帧序联系表加各类细节联系表 */
export interface ContactSheet {
  /** 帧序联系表：一行 8 帧整幅画面 */
  file: string;
  layout: "row";
  frameCount: 8;
  frameSize: number;
  periodMs: number;
  sampleTimesMs: number[];
  details: ContactSheetDetail[];
}

export interface GateResult {
  id: string;
  source: "static" | "render";
  title: string;
  standard: string;
  passed: boolean;
  evidence: string;
}

export interface CriterionResult {
  id: string;
  source: JudgeSource;
  title: string;
  standard: string;
  maxScore: number;
  /** 未判定时为 null */
  score: number | null;
  reason: string | null;
}

export interface JudgeTotal {
  score: number;
  maxScore: 100;
  verdict: Verdict;
  judgedAt: string;
}

export interface Judgement {
  schemaVersion: 1;
  subject: JudgeSubject;
  rubric: JudgeRubricRef;
  judges: JudgeActor[];
  contactSheet?: ContactSheet;
  blindDescription?: string;
  gates: GateResult[];
  criteria: CriterionResult[];
  total: JudgeTotal;
}

export interface GateSpec {
  id: string;
  source: "static" | "render";
  title: string;
  standard: string;
}

export interface CriterionSpec {
  id: string;
  /** 该标准最终由哪一层给分；static 与 render 同管的标准写 render，渲染层缺席时静态层代填 */
  source: JudgeSource;
  title: string;
  standard: string;
  maxScore: number;
}

export interface RubricSpec {
  id: string;
  version: number;
  passThreshold: number;
  gates: readonly GateSpec[];
  criteria: readonly CriterionSpec[];
}

/**
 * 动态鹈鹕车的评分标准，口径来自题目自带的 standard.evaluationCriteria。
 * 代码层（C1–C4）合计 30 分只做机械核对，AI 层（C5–C9）合计 70 分看语义；及格线 78 意味着
 * 没有 AI 层的记录只能是「待复核」，AI 层五项合计至少要拿 48 分。
 * C6 只管「认得出是鹈鹕」，骑姿与接触点各归 C7（座垫、脚踏）与 C9（车把），不混进身份判断。
 * version 只随标准与权重变，且从首次发布起算：发布前改口径不升版本，已发布的版本上改口径才升。
 * 及格线只定「在线 / 降智」的标签、不改分数，调它不升 version，
 * 旧记录展示时按当前及格线重定结论（见 withCurrentThreshold）。
 */
export const ANIMATED_PELICAN_RUBRIC: RubricSpec = {
  id: "animated-pelican-v1",
  version: 1,
  passThreshold: 78,
  gates: [
    { id: "G1", source: "static", title: "XML 合法", standard: "XML 解析零错误" },
    { id: "G2", source: "static", title: "写了动画", standard: "存在 <animate*>，或 <style> 内同时有 @keyframes 与 animation" },
    { id: "G3", source: "static", title: "自包含且无脚本", standard: "无 <script>、<foreignObject>、外部引用、内嵌位图" },
    { id: "G4", source: "render", title: "确实在动", standard: "8 帧两两像素差的最大值超过阈值" },
    { id: "G5", source: "render", title: "不出画布", standard: "每一帧的内容包围盒都在 viewBox 内" },
  ],
  criteria: [
    { id: "C1", source: "render", title: "车轮绕轴心旋转", maxScore: 10,
      standard: "前后车轮各绕自身轴心旋转：旋转中心与轮子圆心一致，逐帧位置不漂移；绕全局 (0,0) 或其他点旋转为零分" },
    { id: "C2", source: "render", title: "曲柄绕五通旋转", maxScore: 8,
      standard: "曲柄与脚踏绕五通中心旋转，两脚踏相位相差 180°；曲柄不转或绕错中心为零分" },
    { id: "C3", source: "render", title: "循环播放", maxScore: 4,
      standard: "repeatCount=\"indefinite\" 或 infinite，首帧与末帧接近；只播放一次或末帧跳变为零分" },
    { id: "C4", source: "render", title: "腿与曲柄同步", maxScore: 8,
      standard: "腿部动画周期与曲柄周期相等或成整数倍，且渲染后脚（腿的末端）每帧都落在脚踏上；腿不动、周期无关或脚离开脚踏一段曲柄臂为零分" },
    { id: "C5", source: "ai", title: "自行车结构完整", maxScore: 15,
      standard: "车架、车把、座垫、辐条轮、脚踏、曲柄齐全且形状正确；只有轮子或缺少主要部件为零分" },
    { id: "C6", source: "ai", title: "主体是鹈鹕", maxScore: 15,
      standard: "盲描述能认出鹈鹕（长喙、喉囊）；认成其他鸟或无法辨认为零分" },
    { id: "C7", source: "ai", title: "坐在座垫上、脚在脚踏上", maxScore: 15,
      standard: "鹈鹕坐在座垫上，双脚落在脚踏上；悬空、脱离车身或脚不在脚踏上为零分" },
    { id: "C8", source: "ai", title: "踩踏动作可信", maxScore: 15,
      standard: "8 帧连看，腿的伸缩与脚踏位置对应；腿与脚踏各动各的为零分" },
    { id: "C9", source: "ai", title: "翅膀扶住车把", maxScore: 10,
      standard: "鹈鹕的翅膀（前肢）搭在车把上，像在扶着车把骑行；翅膀收在身侧、够不着车把或没有车把可扶为零分" },
  ],
};

const RUBRICS: ReadonlyMap<string, RubricSpec> = new Map([
  [ANIMATED_PELICAN_RUBRIC.id, ANIMATED_PELICAN_RUBRIC],
]);

/** 有评分标准的题目才评审；其余题目返回 null */
export function rubricFor(promptId: string): RubricSpec | null {
  return RUBRICS.get(promptId) ?? null;
}

/**
 * 按当前及格线重定结论：同一标准同一版本下分数可比，只是及格线调过；落盘记录原样不动，
 * 展示时统一按当前及格线判，免得同一分数在新旧记录上贴不同标签。待复核与闸门不过的不受影响。
 */
export function withCurrentThreshold(judgement: Judgement): Judgement {
  const current = RUBRICS.get(judgement.rubric.id);
  if (!current || current.version !== judgement.rubric.version || current.passThreshold === judgement.rubric.passThreshold) {
    return judgement;
  }
  const rubric = { ...judgement.rubric, passThreshold: current.passThreshold };
  return { ...judgement, rubric, total: summarizeTotal(judgement.gates, judgement.criteria, rubric, judgement.total.judgedAt) };
}

/** 闸门任一不过即 0 分降智；有标准未判定为 pending；否则按阈值判 */
export function summarizeTotal(
  gates: readonly GateResult[],
  criteria: readonly CriterionResult[],
  rubric: JudgeRubricRef,
  judgedAt: string,
): JudgeTotal {
  if (gates.some((g) => !g.passed)) return { score: 0, maxScore: 100, verdict: "degraded", judgedAt };
  const score = criteria.reduce((sum, c) => sum + (c.score ?? 0), 0);
  if (criteria.some((c) => c.score === null)) return { score, maxScore: 100, verdict: "pending", judgedAt };
  return { score, maxScore: 100, verdict: score >= rubric.passThreshold ? "online" : "degraded", judgedAt };
}

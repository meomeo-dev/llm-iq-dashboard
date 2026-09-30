/**
 * 评审记录（judgement）的类型与各题的评分标准（rubric）。
 * 记录落盘为 data/runs/<runId>/<attemptKey>.judge.json，结构与
 * docs/research/judge/judge.schema.json 一致；代码层先写，AI 层随后填分。
 */

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
}

export interface ContactSheet {
  file: string;
  layout: "row";
  frameCount: 8;
  frameSize: number;
  periodMs: number;
  sampleTimesMs: number[];
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

/** 动态鹈鹕车的评分标准，口径来自题目自带的 standard.evaluationCriteria */
export const ANIMATED_PELICAN_RUBRIC: RubricSpec = {
  id: "animated-pelican-v1",
  version: 1,
  passThreshold: 60,
  gates: [
    { id: "G1", source: "static", title: "XML 合法", standard: "XML 解析零错误" },
    { id: "G2", source: "static", title: "写了动画", standard: "存在 <animate*>，或 <style> 内同时有 @keyframes 与 animation" },
    { id: "G3", source: "static", title: "自包含且无脚本", standard: "无 <script>、<foreignObject>、外部引用、内嵌位图" },
    { id: "G4", source: "render", title: "确实在动", standard: "8 帧两两像素差的最大值超过阈值" },
    { id: "G5", source: "render", title: "不出画布", standard: "每一帧的内容包围盒都在 viewBox 内" },
  ],
  criteria: [
    { id: "C1", source: "render", title: "车轮绕轴心旋转", maxScore: 20,
      standard: "前后车轮各绕自身轴心旋转：旋转中心与轮子圆心一致，逐帧位置不漂移；绕全局 (0,0) 或其他点旋转为零分" },
    { id: "C2", source: "render", title: "曲柄绕五通旋转", maxScore: 15,
      standard: "曲柄与脚踏绕五通中心旋转，两脚踏相位相差 180°；曲柄不转或绕错中心为零分" },
    { id: "C3", source: "render", title: "循环播放", maxScore: 10,
      standard: "repeatCount=\"indefinite\" 或 infinite，首帧与末帧接近；只播放一次或末帧跳变为零分" },
    { id: "C4", source: "render", title: "腿与曲柄同步", maxScore: 15,
      standard: "腿部动画周期与曲柄周期相等或成整数倍，腿部有周期性位移；腿不动或周期无关为零分" },
    { id: "C5", source: "ai", title: "自行车结构完整", maxScore: 10,
      standard: "车架、车把、座垫、辐条轮、脚踏、曲柄齐全且形状正确；只有轮子或缺少主要部件为零分" },
    { id: "C6", source: "ai", title: "主体是鹈鹕", maxScore: 10,
      standard: "盲描述能认出鹈鹕（长喙、喉囊）；认成其他鸟或无法辨认为零分" },
    { id: "C7", source: "ai", title: "坐在座垫上、脚在脚踏上", maxScore: 12,
      standard: "鹈鹕坐在座垫上，双脚落在脚踏上；悬空、脱离车身或脚不在脚踏上为零分" },
    { id: "C8", source: "ai", title: "踩踏动作可信", maxScore: 8,
      standard: "8 帧连看，腿的伸缩与脚踏位置对应；腿与脚踏各动各的为零分" },
  ],
};

const RUBRICS: ReadonlyMap<string, RubricSpec> = new Map([
  [ANIMATED_PELICAN_RUBRIC.id, ANIMATED_PELICAN_RUBRIC],
]);

/** 有评分标准的题目才评审；其余题目返回 null */
export function rubricFor(promptId: string): RubricSpec | null {
  return RUBRICS.get(promptId) ?? null;
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

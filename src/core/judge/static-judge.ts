/**
 * 代码层静态评审：只读 SVG 源码，不渲染、不调用 CLI。产出一份完整的评审记录，
 * 静态能判的标准直接给分，AI 层的标准留空（score 为 null）待后续填写。
 */

import { createHash } from "node:crypto";
import { summarizeTotal, type CriterionResult, type GateResult, type JudgeSubject, type Judgement, type RubricSpec } from "./schema";
import { identifyParts, scoreCrank, scoreLegs, scoreLoop, scoreWheels, type BikeParts } from "./static-criteria";
import { parseSvgModel, type SvgModel } from "./svg-model";

export const STATIC_JUDGE_ID = "static-judge@1";

export interface StaticJudgeInput {
  source: string;
  subject: Omit<JudgeSubject, "svgSha256">;
  rubric: RubricSpec;
  now?: Date;
}

export function judgeStatic(input: StaticJudgeInput): Judgement {
  const started = Date.now();
  const judgedAt = (input.now ?? new Date()).toISOString();
  const parsed = parseSvgModel(input.source);
  const model = parsed.ok ? parsed.model : null;
  const gates = staticGates(input.rubric, parsed.ok ? null : parsed.error, model);
  const gateFailed = gates.find((g) => !g.passed);
  const criteria = staticCriteria(input.rubric, model, gateFailed);
  const rubric = { id: input.rubric.id, version: input.rubric.version, passThreshold: input.rubric.passThreshold };
  return {
    schemaVersion: 1,
    subject: { ...input.subject, svgSha256: createHash("sha256").update(input.source).digest("hex") },
    rubric,
    judges: [{ kind: "code", id: STATIC_JUDGE_ID, judgedAt, durationMs: Date.now() - started }],
    gates,
    criteria,
    total: summarizeTotal(gates, criteria, rubric, judgedAt),
  };
}

function staticGates(rubric: RubricSpec, parseError: string | null, model: SvgModel | null): GateResult[] {
  const out: GateResult[] = [];
  for (const spec of rubric.gates) {
    if (spec.source !== "static") continue;
    const outcome = model ? gateOutcome(spec.id, model) : parseFailureOutcome(spec.id, parseError ?? "");
    out.push({ id: spec.id, source: "static", title: spec.title, standard: spec.standard, ...outcome });
  }
  return out;
}

function parseFailureOutcome(id: string, error: string): { passed: boolean; evidence: string } {
  if (id === "G1") return { passed: false, evidence: `XML 解析失败：${error}` };
  return { passed: false, evidence: "XML 未解析，未检查" };
}

function gateOutcome(id: string, model: SvgModel): { passed: boolean; evidence: string } {
  switch (id) {
    case "G1":
      return { passed: true, evidence: "XML 解析无错误" };
    case "G2": {
      const smil = model.animations.filter((a) => a.kind.startsWith("smil")).length;
      const css = model.animations.length - smil;
      return { passed: model.animations.length > 0, evidence: `SMIL 动画 ${smil} 个，CSS 动画 ${css} 个` };
    }
    case "G3": {
      const problems = [
        model.hasScript ? "含 <script>" : null,
        model.hasForeignObject ? "含 <foreignObject>" : null,
        model.hasRasterImage ? "含 <image>" : null,
        model.externalRefs.length > 0 ? `外部引用 ${model.externalRefs.length} 处` : null,
      ].filter((p): p is string => p !== null);
      return { passed: problems.length === 0, evidence: problems.length === 0 ? "无脚本、外部引用与位图" : problems.join("，") };
    }
    default:
      return { passed: false, evidence: `静态层不认识闸门 ${id}` };
  }
}

function staticCriteria(rubric: RubricSpec, model: SvgModel | null, gateFailed: GateResult | undefined): CriterionResult[] {
  const parts = model ? identifyParts(model) : null;
  return rubric.criteria.map((spec) => {
    if (spec.source === "ai") {
      return { id: spec.id, source: "ai", title: spec.title, standard: spec.standard, maxScore: spec.maxScore, score: null, reason: null };
    }
    if (!model || !parts || gateFailed) {
      const reason = `闸门 ${gateFailed?.id ?? "G1"} 未通过，不计分`;
      return { id: spec.id, source: "static", title: spec.title, standard: spec.standard, maxScore: spec.maxScore, score: 0, reason };
    }
    return scoreCriterion(spec.id, parts, model, spec);
  });
}

function scoreCriterion(id: string, parts: BikeParts, model: SvgModel, spec: RubricSpec["criteria"][number]): CriterionResult {
  switch (id) {
    case "C1":
      return scoreWheels(parts, model, spec);
    case "C2":
      return scoreCrank(parts, model, spec);
    case "C3":
      return scoreLoop(parts, spec);
    case "C4":
      return scoreLegs(parts, spec);
    default:
      return { id, source: "static", title: spec.title, standard: spec.standard, maxScore: spec.maxScore, score: null, reason: null };
  }
}

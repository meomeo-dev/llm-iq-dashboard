/**
 * 一次调用的评审流水线：静态解析 → 渲染量测（有浏览器时）→ 落盘。
 * runner 与回填脚本共用；任何一步失败都不抛错，只写日志。
 */

import { saveJudgement } from "./judge-store";
import { renderJudge } from "./render-judge";
import { rubricFor, type JudgeSubject, type Judgement } from "./schema";
import { judgeStatic } from "./static-judge";

export interface JudgeArtifactInput {
  subject: Omit<JudgeSubject, "svgSha256">;
  source: string;
  /** 允许渲染层；浏览器不可用时自动退回只出静态分 */
  render: boolean;
  log?: (line: string) => void;
}

/** 没有评分标准的题目返回 null；其余返回已落盘的评审记录 */
export async function judgeArtifact(input: JudgeArtifactInput): Promise<Judgement | null> {
  const rubric = rubricFor(input.subject.promptId);
  if (!rubric) return null;
  const log = input.log ?? (() => {});
  let judgement = judgeStatic({ source: input.source, subject: input.subject, rubric });
  if (input.render && judgement.gates.every((g) => g.passed)) {
    const outcome = await renderJudge({ source: input.source, judgement, rubric });
    if (outcome.ok) judgement = outcome.judgement;
    else log(`[judge] ${input.subject.attemptKey} 渲染层跳过：${outcome.reason}`);
  }
  await saveJudgement(judgement);
  log(`[judge] ${input.subject.attemptKey} ${judgement.total.score} 分 ${judgement.total.verdict}`);
  return judgement;
}

/** runner 用的形态：调用结束后拿 Attempt 与 SVG 源码评审，失败只记日志 */
export type AttemptJudge = (
  runId: string,
  attempt: { promptId: string; cli: string; model: string; effort: string; svgFile: string },
  source: string,
) => Promise<void>;

export function createAttemptJudge(enabled: boolean, log: (line: string) => void): AttemptJudge | undefined {
  if (!enabled) return undefined;
  return async (runId, attempt, source) => {
    const attemptKey = attempt.svgFile.endsWith(".svg") ? attempt.svgFile.slice(0, -4) : attempt.svgFile;
    try {
      await judgeArtifact({
        subject: { runId, attemptKey, promptId: attempt.promptId, cli: attempt.cli, model: attempt.model, effort: attempt.effort, svgFile: attempt.svgFile },
        source,
        render: true,
        log,
      });
    } catch (cause) {
      log(`[judge] ${attemptKey} 评审失败：${cause instanceof Error ? cause.message : String(cause)}`);
    }
  };
}

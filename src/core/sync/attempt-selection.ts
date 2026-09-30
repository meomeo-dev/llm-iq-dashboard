/**
 * 一轮之内按调用挑选导出的子集。
 *
 * 调用的身份是 `targetId@promptId`：同一轮里一个目标对一道题只调用一次，作品文件名也由这两段组成。
 * 子集随导出记进台账，之后再评估这一轮时沿用同一子集，数据仓里的记录因此保持幂等。
 */

import type { RunRecord } from "../types";

export function attemptKey(attempt: { targetId: string; promptId: string }): string {
  return `${attempt.targetId}@${attempt.promptId}`;
}

/**
 * 只留下子集里的调用，题目只留还有调用的；子集为 null 表示整轮。
 * 子集一个都对不上时返回 null（调用方不应把这种轮次记成空轮次，否则它会从待导出清单里消失）。
 */
export function withSelectedAttempts(run: RunRecord, keys: ReadonlySet<string> | null): RunRecord | null {
  if (keys === null) return run;
  const attempts = run.attempts.filter((attempt) => keys.has(attemptKey(attempt)));
  if (attempts.length === 0) return null;
  const promptIds = new Set(attempts.map((attempt) => attempt.promptId));
  const prompts = run.prompts.filter((prompt) => promptIds.has(prompt.promptId));
  return { ...run, prompts, attempts };
}

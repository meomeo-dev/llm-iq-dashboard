/**
 * 一轮结束后的 AI 评审队列（ACR-020）：对本轮抽出 SVG、代码层判「待复核」的作品逐件请裁判打分。
 * 串行执行，与基准调用不重叠；单件失败只记日志。
 */

import type { AppConfig } from "../config";
import type { RunRecord } from "../types";
import { aiEligible, judgeWithAi } from "./ai-judge";
import { attemptKeyOf, loadJudgement } from "./judge-store";

export async function judgeRoundWithAi(config: AppConfig, record: RunRecord, log: (line: string) => void): Promise<void> {
  if (!config.judge.enabled || !config.judge.ai.enabled) return;
  const prompts = new Map(record.prompts.map((p) => [p.promptId, p.text]));
  let judged = 0;
  for (const attempt of record.attempts) {
    if (attempt.status !== "ok" || attempt.svgFile === null) continue;
    const judgement = await loadJudgement(record.runId, attemptKeyOf(attempt.svgFile));
    if (!judgement || aiEligible(judgement) !== null) continue;
    const outcome = await judgeWithAi({ config: config.judge.ai, judgement, promptText: prompts.get(attempt.promptId) ?? "", log });
    if (outcome.ok) judged += 1;
    else log(`[judge-ai] ${judgement.subject.attemptKey} 未评：${outcome.reason}`);
  }
  if (judged > 0) log(`[${record.runId}] AI 层评审 ${judged} 幅`);
}

/**
 * 一轮结束后的 AI 评审队列（ACR-020）：对本轮抽出 SVG、代码层判「待复核」的作品逐件请裁判打分。
 * 串行执行，与基准调用不重叠；单件失败只记日志。进度经 progress.json 的 judging 段推给看板。
 */

import type { AppConfig } from "../config";
import type { JudgeProgressReporter } from "../progress";
import type { RunRecord } from "../types";
import { aiEligible, judgeWithAi } from "./ai-judge";
import { attemptKeyOf, loadJudgement } from "./judge-store";
import type { Judgement } from "./schema";

interface QueueItem {
  attemptKey: string;
  targetId: string;
  promptId: string;
  judgement: Judgement;
}

export async function judgeRoundWithAi(
  config: AppConfig, record: RunRecord, log: (line: string) => void, progress?: JudgeProgressReporter,
): Promise<void> {
  if (!config.judge.enabled || !config.judge.ai.enabled) return;
  const queue = await eligibleQueue(record);
  if (queue.length === 0) return;
  const prompts = new Map(record.prompts.map((p) => [p.promptId, p.text]));
  progress?.start(queue.map(({ attemptKey, targetId, promptId }) => ({ attemptKey, targetId, promptId })));
  let judged = 0;
  for (const item of queue) {
    progress?.markRunning(item.attemptKey);
    const outcome = await judgeWithAi({ config: config.judge.ai, judgement: item.judgement, promptText: prompts.get(item.promptId) ?? "", log });
    if (outcome.ok) {
      judged += 1;
      progress?.markDone(item.attemptKey, { verdict: outcome.judgement.total.verdict, score: outcome.judgement.total.score });
    } else {
      log(`[judge-ai] ${item.attemptKey} 未评：${outcome.reason}`);
      progress?.markFailed(item.attemptKey, outcome.reason);
    }
  }
  await progress?.finish();
  log(`[${record.runId}] AI 层评审 ${judged}/${queue.length} 幅`);
}

/** 本轮里通过全部闸门、仍待复核且有联系表的作品，按调用顺序 */
async function eligibleQueue(record: RunRecord): Promise<QueueItem[]> {
  const queue: QueueItem[] = [];
  for (const attempt of record.attempts) {
    if (attempt.status !== "ok" || attempt.svgFile === null) continue;
    const attemptKey = attemptKeyOf(attempt.svgFile);
    const judgement = await loadJudgement(record.runId, attemptKey);
    if (!judgement || aiEligible(judgement) !== null) continue;
    queue.push({ attemptKey, targetId: attempt.targetId, promptId: attempt.promptId, judgement });
  }
  return queue;
}

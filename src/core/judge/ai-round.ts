/**
 * 一轮结束后的 AI 评审队列（ACR-020）：对本轮抽出 SVG、代码层判「待复核」的作品逐件请裁判打分。
 * 串行执行，与基准调用不重叠；单件失败只记日志。进度经 progress.json 的 judging 段推给看板。
 * 执行进程中途退出时队列停在半途（judging.finishedAt 为空、有作品仍是排队 / 评审中），
 * 下一个执行进程启动时由 resumeInterruptedJudging 接手：没出结论的作品重新请裁判，队列照常收尾。
 */

import type { AppConfig } from "../config";
import { isJudging, progressAlive, readProgress, reopenProgressTracker, type JudgeProgressReporter } from "../progress";
import { createSerialWriter } from "../serial-writes";
import { loadRun } from "../store";
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
    if (await judgeQueueItem(config, item, prompts, log, progress)) judged += 1;
  }
  await progress?.finish();
  log(`[${record.runId}] AI 层评审 ${judged}/${queue.length} 幅`);
}

/** 队列里的一件：标评审中 → 请裁判 → 标结论或未评；评成返回 true */
async function judgeQueueItem(
  config: AppConfig, item: QueueItem, prompts: ReadonlyMap<string, string>, log: (line: string) => void, progress?: JudgeProgressReporter,
): Promise<boolean> {
  progress?.markRunning(item.attemptKey);
  const outcome = await judgeWithAi({ config: config.judge.ai, judgement: item.judgement, promptText: prompts.get(item.promptId) ?? "", log });
  if (outcome.ok) {
    progress?.markDone(item.attemptKey, { verdict: outcome.judgement.total.verdict, score: outcome.judgement.total.score });
    return true;
  }
  log(`[judge-ai] ${item.attemptKey} 未评：${outcome.reason}`);
  progress?.markFailed(item.attemptKey, outcome.reason);
  return false;
}

/**
 * 续评上一个进程退出前没评完的队列。只接手执行进程已不在的轮次（还在评的不碰）；
 * 上个进程已落盘结论但没来得及标记的作品直接标结论，AI 层已关闭时标未评，其余重新请裁判。
 * 队列最终总会收尾，看板不再停在「评审中」。
 */
export async function resumeInterruptedJudging(config: AppConfig, runId: string, log: (line: string) => void): Promise<void> {
  const stored = await readProgress(runId);
  if (stored === null || !isJudging(stored) || (await progressAlive(stored))) return;
  const pending = stored.judging!.items.filter((item) => item.state === "queued" || item.state === "running");
  const record = await loadRun(runId);
  const prompts = new Map((record?.prompts ?? []).map((p) => [p.promptId, p.text]));
  const tracker = reopenProgressTracker(stored, createSerialWriter(log));
  log(`[${runId}] 上次进程退出前评审队列没评完，续评 ${pending.length} 幅`);
  let judged = 0;
  for (const item of pending) {
    const judgement = await loadJudgement(runId, item.attemptKey);
    if (judgement === null) {
      tracker.judging.markFailed(item.attemptKey, "评审记录不存在");
    } else if (judgement.total.verdict !== "pending") {
      tracker.judging.markDone(item.attemptKey, { verdict: judgement.total.verdict, score: judgement.total.score });
      judged += 1;
    } else if (!config.judge.enabled || !config.judge.ai.enabled) {
      tracker.judging.markFailed(item.attemptKey, "续评时 AI 层已关闭");
    } else {
      const queued = { attemptKey: item.attemptKey, targetId: item.targetId, promptId: item.promptId, judgement };
      if (await judgeQueueItem(config, queued, prompts, log, tracker.judging)) judged += 1;
    }
  }
  await tracker.judging.finish();
  log(`[${runId}] 续评 ${judged}/${pending.length} 幅`);
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

/**
 * 一轮结束后的 AI 评审队列（ACR-020）：对本轮抽出 SVG、代码层判「待复核」的作品请裁判打分。
 * 在轮次记录定稿之后跑，与基准调用不重叠；作品之间并行，并行度按裁判分配
 * （`judge.ai.concurrency`：每个裁判同时评的件数，不同裁判各算各的），同一轮共用一个会话池。
 * 单件失败只记日志、不影响其余。进度经 progress.json 的 judging 段推给看板：
 * 排队 → 评审中（拿到裁判槽位那一刻）→ 结论 / 未评，队列在全部作品落定后收尾。
 * 执行进程中途退出时队列停在半途（judging.finishedAt 为空、有作品仍是排队 / 评审中），
 * 下一个执行进程启动时由 resumeInterruptedJudging 接手：没出结论的作品重新请裁判，队列照常收尾。
 */

import { openSessionPool } from "../../adapters/index";
import { createKeyedSemaphores, mapWithConcurrency } from "../concurrency";
import type { AppConfig } from "../config";
import { isJudging, progressAlive, readProgress, reopenProgressTracker, type JudgeProgressReporter } from "../progress";
import { createSerialWriter } from "../serial-writes";
import { loadRun } from "../store";
import type { RunRecord } from "../types";
import { aiEligible, judgeKey, judgeWithAi, type JudgeSlots } from "./ai-judge";
import { attemptKeyOf, loadJudgement } from "./judge-store";
import type { Judgement } from "./schema";

interface QueueItem {
  attemptKey: string;
  targetId: string;
  promptId: string;
  judgement: Judgement;
}

type Logger = (line: string) => void;

export async function judgeRoundWithAi(
  config: AppConfig, record: RunRecord, log: Logger, progress?: JudgeProgressReporter,
): Promise<void> {
  if (!config.judge.enabled || !config.judge.ai.enabled) return;
  const queue = await eligibleQueue(record);
  if (queue.length === 0) return;
  const prompts = new Map(record.prompts.map((p) => [p.promptId, p.text]));
  progress?.start(queue.map(({ attemptKey, targetId, promptId }) => ({ attemptKey, targetId, promptId })));
  const judged = await judgeQueue(config, queue, prompts, log, progress);
  await progress?.finish();
  log(`[${record.runId}] AI 层评审 ${judged}/${queue.length} 幅`);
}

/**
 * 并行跑完一批作品，返回评成的件数。同时在跑的作品数不超过「并行度 × 裁判数」；
 * 每件作品只在拿到裁判槽位时才标评审中，排队等槽的仍显示排队。任一件抛错只算那一件未评。
 */
async function judgeQueue(
  config: AppConfig, queue: readonly QueueItem[], prompts: ReadonlyMap<string, string>, log: Logger, progress?: JudgeProgressReporter,
): Promise<number> {
  const { concurrency, judges } = config.judge.ai;
  const slotsOf = createKeyedSemaphores(concurrency);
  const pool = openSessionPool();
  try {
    const outcomes = await mapWithConcurrency(queue, concurrency * Math.max(1, judges.length), async (item) => {
      try {
        return await judgeQueueItem(config, item, prompts, log, progress, slotsOf, pool);
      } catch (cause) {
        const reason = cause instanceof Error ? cause.message : String(cause);
        log(`[judge-ai] ${item.attemptKey} 未评：${reason}`);
        progress?.markFailed(item.attemptKey, reason);
        return false;
      }
    });
    return outcomes.filter(Boolean).length;
  } finally {
    await pool.closeAll();
  }
}

/** 队列里的一件：拿到裁判槽位即标评审中 → 请裁判 → 标结论或未评；评成返回 true */
async function judgeQueueItem(
  config: AppConfig, item: QueueItem, prompts: ReadonlyMap<string, string>, log: Logger,
  progress: JudgeProgressReporter | undefined, slotsOf: ReturnType<typeof createKeyedSemaphores>, pool: ReturnType<typeof openSessionPool>,
): Promise<boolean> {
  let started = false;
  const slots: JudgeSlots = {
    acquire: async (judge) => {
      const release = await slotsOf(judgeKey(judge)).acquire();
      // 换下一个裁判重试时作品早已是评审中，不再重置起始时刻
      if (!started) {
        started = true;
        progress?.markRunning(item.attemptKey);
      }
      return release;
    },
  };
  const outcome = await judgeWithAi({
    config: config.judge.ai, judgement: item.judgement, promptText: prompts.get(item.promptId) ?? "", log, pool, slots,
  });
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
 * 上个进程已落盘结论但没来得及标记的作品直接标结论，AI 层已关闭时标未评，其余重新请裁判，
 * 并行规则与整轮评审相同。队列最终总会收尾，看板不再停在「评审中」。
 */
export async function resumeInterruptedJudging(config: AppConfig, runId: string, log: Logger): Promise<void> {
  const stored = await readProgress(runId);
  if (stored === null || !isJudging(stored) || (await progressAlive(stored))) return;
  const pending = stored.judging!.items.filter((item) => item.state === "queued" || item.state === "running");
  const record = await loadRun(runId);
  const prompts = new Map((record?.prompts ?? []).map((p) => [p.promptId, p.text]));
  const tracker = reopenProgressTracker(stored, createSerialWriter(log));
  log(`[${runId}] 上次进程退出前评审队列没评完，续评 ${pending.length} 幅`);
  const aiOn = config.judge.enabled && config.judge.ai.enabled;
  const queue: QueueItem[] = [];
  let judged = 0;
  for (const item of pending) {
    const judgement = await loadJudgement(runId, item.attemptKey);
    if (judgement === null) {
      tracker.judging.markFailed(item.attemptKey, "评审记录不存在");
    } else if (judgement.total.verdict !== "pending") {
      tracker.judging.markDone(item.attemptKey, { verdict: judgement.total.verdict, score: judgement.total.score });
      judged += 1;
    } else if (!aiOn) {
      tracker.judging.markFailed(item.attemptKey, "续评时 AI 层已关闭");
    } else {
      queue.push({ attemptKey: item.attemptKey, targetId: item.targetId, promptId: item.promptId, judgement });
    }
  }
  if (queue.length > 0) judged += await judgeQueue(config, queue, prompts, log, tracker.judging);
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

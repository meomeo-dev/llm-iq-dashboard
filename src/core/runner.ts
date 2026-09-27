/**
 * 一轮鹈鹕基准的编排：工作量为 `提示词 × 目标`，只依赖适配器与存储契约。
 *
 * 单个目标失败收敛为一条失败记录，不影响同批其他目标。并发按 CLI × 模型分道（lane）：
 * 不同模型并行；同一模型的调用在道内串行，避免挤占该模型的限速并保持耗时可比。
 */


import type { AppConfig } from "./config";
import { mapWithConcurrency } from "./concurrency";
import { createProgressTracker } from "./progress";
import { createSerialWriter } from "./serial-writes";
import { pruneExpiredRuns } from "./retention";
import { watchCancel } from "./run-cancel";
import { ensureRunDir, saveRun } from "./store";
import type { Attempt, CliKind, RunRecord } from "./types";
import { openSessionPool } from "../adapters/index";
import { blocksCalls } from "../capabilities/readiness";
import { checkAndRecord } from "../capabilities/readiness-cache";
import { estimateCost } from "../pricing/catalog";
import { loadPriceCatalog } from "../pricing/catalog-files";
import { dayBudgetExhausted, openBudgetGate, type BudgetConfig, type BudgetGate } from "./budget";
import { loadCostHistory } from "./cost-history";
import { buildLeakGuard } from "./leak-guard";
import { buildAttempt, runAttempt, type AttemptContext } from "./run-attempt";
import {
  buildJobs,
  describeProgress,
  groupIntoLanes,
  laneIdentity,
  loadCatalog,
  renderAll,
  type Job,
  type LaneItem,
} from "./run-plan";
import { discardScratch, pruneOrphanScratch } from "./scratch-cleanup";

/** 进度日志出口，便于调度器与一次性命令行各自决定怎么打印 */
export type Logger = (message: string) => void;

export interface ExecuteOptions {
  trigger: RunRecord["trigger"];
  log?: Logger;
  /** 强制重新探测能力目录，不读缓存 */
  refreshCapabilities?: boolean;
  /** 进度文件首次落盘后回调，此后读取进度必能读到这一轮（见 app/api/run/route.ts） */
  onStarted?: (runId: string) => void;
  /** 单次执行时手动指定候选题目的映射（promptId -> candidateId） */
  candidateOverrides?: Readonly<Record<string, string>>;
}

export async function executeRun(
  config: AppConfig,
  options: ExecuteOptions,
): Promise<RunRecord> {
  const log = options.log ?? (() => {});
  const startedAt = new Date();
  const runId = formatRunId(startedAt);
  // 先查预算再建目录：额度用尽时不在时间线上留下空轮次
  const budget = await openBudget(config.budget, startedAt);

  await ensureRunDir(runId);
  await pruneOrphanScratch(log);
  if (config.retention.days !== null) await pruneExpiredRuns(config.retention.days, log, startedAt);

  const catalog = await loadCatalog(config, options.refreshCapabilities === true, log);
  const prompts = await renderAll(config, startedAt, log, options.candidateOverrides);
  const jobs = buildJobs(config, prompts, catalog, log);

  const lanes = groupIntoLanes(jobs);
  log(
    `[${runId}] 开始，${prompts.length} 条提示词 × ${config.targets.length} 个目标 = ${jobs.length} 次调用，` +
      `${lanes.length} 个模型分道，同时最多 ${config.run.concurrency} 道`,
  );

  // 按原下标回填，记录顺序保持 `提示词 × 目标`，不随各道完成先后变化
  const slots = new Array<Attempt | undefined>(jobs.length);
  // 停止时刻；未停止时记录里不含此字段
  let cancelledAt: string | undefined;
  // 首次因预算未发起调用的原因；无则记录里不含此字段
  let budgetStop: string | undefined;
  const snapshot = (inProgress: boolean): RunRecord => ({
    runId,
    prompts,
    startedAt: startedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt.getTime(),
    trigger: options.trigger,
    inProgress,
    ...(cancelledAt !== undefined ? { cancelledAt } : {}),
    ...(budgetStop !== undefined ? { budgetStop } : {}),
    attempts: slots.filter((attempt): attempt is Attempt => attempt !== undefined),
  });
  // run.json 与 progress.json 共用一条写入链，快照顺序与事件顺序一致
  const writer = createSerialWriter(log);
  const progress = createProgressTracker(
    describeProgress(runId, options.trigger, startedAt, config.run.concurrency, lanes),
    writer,
  );
  // 初始进度（全部排队中）落盘后再通知，通知后读取进度必能读到
  await writer.drain();
  options.onStarted?.(runId);
  // 预检在通知之后：agy 登录检查要联网，不应推迟看板显示这一轮
  const blockers = await preflight(lanes, log);

  // 凭据指纹每轮重建：登录态刷新后令牌会变
  const leakGuard = await buildLeakGuard();
  if (leakGuard.size === 0) log(`[${runId}] 未读到任何凭据文件，本轮不做输出泄漏比对`);

  // 看板把停止请求写入本轮目录（见 run-cancel.ts）
  const cancel = watchCancel(runId);
  cancel.signal.addEventListener(
    "abort",
    () => {
      cancelledAt = new Date().toISOString();
      log(`[${runId}] 收到停止请求：不再发起排队中的调用，终止执行中的调用`);
      progress.markCancelling(cancelledAt);
    },
    { once: true },
  );
  try {
    await executeLanes(lanes, config.run.concurrency, { runId, signal: cancel.signal, leakGuard }, {
      admit: (job) => {
        const blocker = blockers.get(job.target.cli);
        if (blocker !== undefined) return { kind: "fail", error: blocker };
        const refusal = budget?.admit(job.target.id) ?? null;
        return refusal === null ? null : { kind: "skip", reason: refusal };
      },
      onSkipped: (lane, call, { job }, reason) => {
        log(`[${runId}] ${job.target.id} @${job.prompt.promptId} 未发起：${reason}`);
        if (budgetStop === undefined) {
          budgetStop = reason;
          progress.markBudgetStop(reason);
        }
        progress.markCancelled(lane, call);
      },
      onStart: (lane, call) => progress.markRunning(lane, call),
      onDone: (lane, call, { job, index }, attempt) => {
        log(`[${runId}] ${attempt.targetId} @${job.prompt.promptId} → ${attempt.status} (${attempt.durationMs}ms)`);
        // 预检拦下的调用未经预算放行，没有占位可结算
        if (!blockers.has(attempt.cli)) budget?.settle(attempt.targetId, costOf(attempt));
        slots[index] = attempt;
        progress.markDone(lane, call, attempt);
        writer.enqueue(() => saveRun(snapshot(true)));
      },
      onCancelled: (lane, call) => progress.markCancelled(lane, call),
    });
  } finally {
    cancel.stop();
  }

  // 等中途快照写完再写终稿，避免旧快照覆盖终稿
  await progress.finish();
  const record = snapshot(false);
  await saveRun(record);
  await discardScratch(runId);
  const outcome = cancelledAt !== undefined ? "已停止" : "完成";
  log(`[${runId}] ${outcome}，成功 ${countOk(record.attempts)}/${record.attempts.length}`);
  return record;
}

/**
 * 发起前的放行判断：null 放行；fail 不发起并记一条 error（预检未过）；
 * skip 不发起也不留结果（超出预算）。
 */
type Admission = null | { kind: "fail"; error: string } | { kind: "skip"; reason: string };

interface LaneHooks {
  admit: (job: Job) => Admission;
  onSkipped: (lane: number, call: number, item: LaneItem, reason: string) => void;
  onStart: (lane: number, call: number) => void;
  onDone: (lane: number, call: number, item: LaneItem, attempt: Attempt) => void;
  /** 停止后没有结果的调用：未发起的排队项或执行中被终止的调用 */
  onCancelled: (lane: number, call: number) => void;
}

/** 配置了预算上限才读取历史成本；近 24 小时已达每日上限时抛错 */
async function openBudget(config: BudgetConfig, now: Date): Promise<BudgetGate | null> {
  if (config.perRoundUsd === null && config.perDayUsd === null) return null;
  const history = await loadCostHistory(now);
  const exhausted = dayBudgetExhausted(config, history);
  if (exhausted !== null) throw new Error(exhausted);
  return openBudgetGate(config, history);
}

/** 结算用的实际成本：无法计价的按 0 计，partial 只含有价格的部分 */
function costOf(attempt: Attempt): number {
  return estimateCost(loadPriceCatalog(), attempt, attempt.usage ?? null).usd ?? 0;
}

/**
 * 预检本轮用到的 CLI，返回被拦下的 CLI → 原因（含安装或登录命令）。
 * 结果同时写入看板读取的缓存；只拦确定的问题，见 capabilities/readiness.ts。
 */
async function preflight(lanes: readonly LaneItem[][], log: Logger): Promise<ReadonlyMap<CliKind, string>> {
  const clis = [...new Set(lanes.map((lane) => laneIdentity(lane).cli))];
  const results = await checkAndRecord(clis);
  const blockers = new Map<CliKind, string>();
  for (const readiness of results) {
    if (readiness.detail !== null) log(`预检 ${readiness.cli}：${readiness.detail}`);
    if (blocksCalls(readiness)) blockers.set(readiness.cli, `预检未通过，未发起调用：${readiness.detail}`);
  }
  return blockers;
}

/**
 * 各道并行、道内串行地跑完全部调用，每次发起前经 hooks.admit 放行；
 * signal 触发后余下的调用全部取消。
 */
async function executeLanes(
  lanes: readonly LaneItem[][],
  laneLimit: number,
  round: Omit<AttemptContext, "sessions">,
  hooks: LaneHooks,
): Promise<void> {
  const { signal } = round;
  // codex 的 app-server 是长驻进程，无论本轮成败都要关闭
  const sessions = openSessionPool();
  const context: AttemptContext = { ...round, sessions };
  try {
    await mapWithConcurrency(lanes, laneLimit, async (lane, laneIndex) => {
      for (const [callIndex, item] of lane.entries()) {
        if (signal.aborted) {
          hooks.onCancelled(laneIndex, callIndex);
          continue;
        }
        const admission = hooks.admit(item.job);
        if (admission?.kind === "skip") {
          hooks.onSkipped(laneIndex, callIndex, item, admission.reason);
          continue;
        }
        hooks.onStart(laneIndex, callIndex);
        const attempt =
          admission === null
            ? await runAttempt(item.job, context)
            : buildAttempt(item.job, new Date(), { status: "error", error: admission.error });
        // 被终止的调用只有半截输出，不计入结果；停止前已交出作品的保留
        if (signal.aborted && attempt.status !== "ok") {
          hooks.onCancelled(laneIndex, callIndex);
          continue;
        }
        hooks.onDone(laneIndex, callIndex, item, attempt);
      }
    });
  } finally {
    await sessions.closeAll();
  }
}

function countOk(attempts: readonly Attempt[]): number {
  return attempts.filter((attempt) => attempt.status === "ok").length;
}

/** runId 取 UTC 紧凑时刻，字典序即时间序，无需索引文件 */
export function formatRunId(at: Date): string {
  const iso = at.toISOString();
  const compact = [...iso].filter((ch) => ch !== "-" && ch !== ":").join("");
  return compact.slice(0, compact.indexOf(".")).concat("Z");
}

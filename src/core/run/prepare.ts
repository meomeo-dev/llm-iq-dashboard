/**
 * 运行前环境准备、预检与任务规划
 */

import type { AppConfig } from "../config";
import type { Attempt, CliKind } from "../types";
import { pruneExpiredRuns } from "../retention";
import { ensureRunDir } from "../store";
import { blocksCalls } from "../../capabilities/readiness";
import { checkAndRecord } from "../../capabilities/readiness-cache";
import { estimateCost } from "../../pricing/catalog";
import { loadPriceCatalog } from "../../pricing/catalog-files";
import { dayBudgetExhausted, openBudgetGate, type BudgetConfig, type BudgetGate } from "../budget";
import { loadCostHistory } from "../cost-history";
import type { RenderedPrompt } from "../variables";
import {
  buildJobs,
  groupIntoLanes,
  laneIdentity,
  loadCatalog,
  renderAll,
  type Job,
  type LaneItem,
} from "../run-plan";
import { pruneOrphanScratch } from "../scratch-cleanup";

export type Logger = (message: string) => void;

/** 配置了预算上限才读取历史成本；近 24 小时已达每日上限时抛错 */
export async function openBudget(config: BudgetConfig, now: Date): Promise<BudgetGate | null> {
  if (config.perRoundUsd === null && config.perDayUsd === null) return null;
  const history = await loadCostHistory(now);
  const exhausted = dayBudgetExhausted(config, history);
  if (exhausted !== null) throw new Error(exhausted);
  return openBudgetGate(config, history);
}

export async function prepareRunStorage(
  config: AppConfig,
  runId: string,
  startedAt: Date,
  log: Logger,
): Promise<void> {
  await ensureRunDir(runId);
  await pruneOrphanScratch(log);
  if (config.retention.days !== null) {
    await pruneExpiredRuns(config.retention.days, log, startedAt);
  }
}

export interface PreparedPlan {
  prompts: RenderedPrompt[];
  jobs: Job[];
  lanes: LaneItem[][];
}

export async function prepareRunPlan(
  config: AppConfig,
  startedAt: Date,
  options: { trigger: "schedule" | "manual"; refreshCapabilities?: boolean; candidateOverrides?: Readonly<Record<string, string>> },
  log: Logger,
): Promise<PreparedPlan> {
  const catalog = await loadCatalog(config, options.refreshCapabilities === true, log);
  const prompts = await renderAll(config, startedAt, log, {
    trigger: options.trigger,
    candidateOverrides: options.candidateOverrides,
  });
  const jobs = buildJobs(config, prompts, catalog, log);
  const lanes = groupIntoLanes(jobs);
  return { prompts, jobs, lanes };
}

/** 结算用的实际成本：无法计价的按 0 计，partial 只含有价格的部分 */
export function costOf(attempt: Attempt): number {
  return estimateCost(loadPriceCatalog(), attempt, attempt.usage ?? null).usd ?? 0;
}

/**
 * 预检本轮用到的 CLI，返回被拦下的 CLI → 原因（含安装或登录命令）。
 * 结果同时写入看板读取的缓存；只拦确定的问题，见 capabilities/readiness.ts。
 */
export async function preflight(lanes: readonly LaneItem[][], log: Logger): Promise<ReadonlyMap<CliKind, string>> {
  const clis = [...new Set(lanes.map((lane) => laneIdentity(lane).cli))];
  const results = await checkAndRecord(clis);
  const blockers = new Map<CliKind, string>();
  for (const readiness of results) {
    if (readiness.detail !== null) log(`预检 ${readiness.cli}：${readiness.detail}`);
    if (blocksCalls(readiness)) blockers.set(readiness.cli, `预检未通过，未发起调用：${readiness.detail}`);
  }
  return blockers;
}

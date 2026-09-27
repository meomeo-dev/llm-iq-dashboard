/**
 * 从历史记录汇总成本，供预算放行（runner）与预测面板（/api/run）使用。
 * 计算规则在 budget.ts；这里只负责把最近一周的调用读成成本样本。
 */

import { DAY_MS, FORECAST_LOOKBACK_DAYS, summarizeHistory, type CostHistory, type CostSample } from "./budget";
import { loadCardsBetween } from "./store";

let cachedHistory: { history: CostHistory; cachedAt: number } | null = null;
const CACHE_TTL_MS = 30_000;

export async function loadCostHistory(now: Date = new Date()): Promise<CostHistory> {
  const currentTime = now.getTime();
  if (cachedHistory !== null && currentTime - cachedHistory.cachedAt < CACHE_TTL_MS) {
    return cachedHistory.history;
  }
  const since = new Date(currentTime - FORECAST_LOOKBACK_DAYS * DAY_MS);
  const cards = await loadCardsBetween(since, now);
  const samples: CostSample[] = [];
  for (const card of cards) {
    if (card.cost.usd !== null) samples.push({ targetId: card.targetId, startedAt: card.startedAt, usd: card.cost.usd });
  }
  const history = summarizeHistory(samples, now);
  cachedHistory = { history, cachedAt: currentTime };
  return history;
}

export function invalidateCostHistoryCache(): void {
  cachedHistory = null;
}

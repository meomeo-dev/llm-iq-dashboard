/**
 * 成本预算：按 API 等价成本（见 pricing/）给每轮与每天设上限。纯计算，读历史见
 * cost-history.ts。
 *
 * 预测为同一目标最近几次可计价调用的平均成本；无历史或无法计价的目标按 0 计，
 * 即上限只约束算得出成本的部分。
 *
 * 发起调用前按预测占位，结束后按实际结算。已发起的调用不因超支中止（半截调用照样
 * 花钱），实际花费可能超出上限，超出量不大于单次调用的实际与预测之差。
 */


export interface BudgetConfig {
  /** 单轮上限（美元）；null 为不限 */
  perRoundUsd: number | null;
  /** 滚动 24 小时上限（美元），不按自然日切分以避开时区歧义；null 为不限 */
  perDayUsd: number | null;
}

/** 一次已完成调用的成本；unpriced 的调用不在其列 */
export interface CostSample {
  targetId: string;
  startedAt: string;
  usd: number;
}

export interface CostHistory {
  /** 各目标的预测单次成本；没有可计价历史的目标不在表里 */
  expected: ReadonlyMap<string, number>;
  /** 近 24 小时已花费 */
  spentLastDayUsd: number;
}

export interface RoundForecast {
  usd: number;
  calls: number;
  /** 没有可计价历史、预测为 0 的调用数 */
  unpricedCalls: number;
}

/** 预测回看天数与每目标样本数：平滑单次波动，同时能跟上模型改价 */
export const FORECAST_LOOKBACK_DAYS = 7;
const FORECAST_SAMPLES = 10;
export const DAY_MS = 24 * 60 * 60 * 1000;

export function summarizeHistory(samples: readonly CostSample[], now: Date): CostHistory {
  const newestFirst = [...samples].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  const byTarget = new Map<string, number[]>();
  for (const sample of newestFirst) {
    const costs = byTarget.get(sample.targetId) ?? [];
    if (costs.length < FORECAST_SAMPLES) costs.push(sample.usd);
    byTarget.set(sample.targetId, costs);
  }
  const expected = new Map([...byTarget].map(([id, costs]) => [id, average(costs)]));

  const dayStart = now.getTime() - DAY_MS;
  const spentLastDayUsd = samples
    .filter((sample) => Date.parse(sample.startedAt) >= dayStart)
    .reduce((sum, sample) => sum + sample.usd, 0);
  return { expected, spentLastDayUsd };
}

/** 一轮 = 每条提示词 × 每个目标 */
export function forecastRound(
  targetIds: readonly string[],
  promptCount: number,
  expected: ReadonlyMap<string, number>,
): RoundForecast {
  const perPrompt = targetIds.reduce((sum, id) => sum + (expected.get(id) ?? 0), 0);
  const unpriced = targetIds.filter((id) => !expected.has(id)).length;
  return { usd: perPrompt * promptCount, calls: targetIds.length * promptCount, unpricedCalls: unpriced * promptCount };
}

/** 近 24 小时已达每日上限时返回原因，本轮不应开始 */
export function dayBudgetExhausted(budget: BudgetConfig, history: CostHistory): string | null {
  if (budget.perDayUsd === null || history.spentLastDayUsd < budget.perDayUsd) return null;
  return (
    `近 24 小时 API 等价成本 ${usd(history.spentLastDayUsd)} 已达每日上限 ${usd(budget.perDayUsd)}，` +
    "本轮不执行（上限见配置 budget.perDayUsd）"
  );
}

export interface BudgetGate {
  /** 发起调用前询问：放行返回 null 并按预测占位，拒绝返回原因 */
  admit(targetId: string): string | null;
  /** 调用结束后以实际成本结算，释放占位 */
  settle(targetId: string, actualUsd: number): void;
}

export function openBudgetGate(budget: BudgetConfig, history: CostHistory): BudgetGate {
  let spent = 0;
  let reserved = 0;
  const predict = (targetId: string): number => history.expected.get(targetId) ?? 0;
  // 已到顶时预测为 0 的调用也拒绝，否则无历史的目标会绕过上限
  const exceeds = (committed: number, cost: number, cap: number | null): boolean =>
    cap !== null && (committed >= cap || committed + cost > cap);

  return {
    admit(targetId) {
      const cost = predict(targetId);
      const round = spent + reserved;
      if (exceeds(round, cost, budget.perRoundUsd)) {
        return `预计超出每轮上限 ${usd(budget.perRoundUsd ?? 0)}（本轮已计 ${usd(round)}，该调用预计 ${usd(cost)}）`;
      }
      if (exceeds(history.spentLastDayUsd + round, cost, budget.perDayUsd)) {
        return `预计超出每日上限 ${usd(budget.perDayUsd ?? 0)}（近 24 小时已计 ${usd(history.spentLastDayUsd + round)}）`;
      }
      reserved += cost;
      return null;
    },
    settle(targetId, actualUsd) {
      reserved = Math.max(0, reserved - predict(targetId));
      spent += actualUsd;
    },
  };
}

function average(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function usd(value: number): string {
  return `$${value.toFixed(value < 1 ? 3 : 2)}`;
}

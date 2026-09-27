"use client";

import { forecastRound, usd } from "@/core/budget";
import type { RunOptionsView } from "@/app/api/run/route";

interface RunForecastProps {
  costs: RunOptionsView["costs"];
  targetIds: readonly string[];
  promptCount: number;
}

/**
 * 发起前的成本预测：按所选范围 × 题目与各目标的历史单次成本估算本轮 API 等价成本，
 * 并与配置上限对照。超出时不禁用按钮：执行方按上限逐次放行，超出的调用不会发起。
 */
export function RunForecast({ costs, targetIds, promptCount }: RunForecastProps) {
  const expected = new Map(Object.entries(costs.expected));
  const forecast = forecastRound(targetIds, promptCount, expected);
  if (forecast.calls === 0) return null;

  const { perRoundUsd, perDayUsd } = costs.budget;
  const overRound = perRoundUsd !== null && forecast.usd > perRoundUsd;
  const overDay = perDayUsd !== null && costs.spentLastDayUsd + forecast.usd > perDayUsd;
  const caps = [
    perRoundUsd !== null ? `每轮上限 ${usd(perRoundUsd)}` : null,
    perDayUsd !== null ? `24 小时内已用 ${usd(costs.spentLastDayUsd)} / 上限 ${usd(perDayUsd)}` : null,
  ].filter((text) => text !== null);

  return (
    <p className={overRound || overDay ? "run-once-forecast over" : "run-once-forecast"}>
      <span title="按各目标最近几次调用的平均 API 等价成本估算">预计 ≈ {usd(forecast.usd)}</span>
      {forecast.unpricedCalls > 0 && <span>另有 {forecast.unpricedCalls} 次暂无价格参考</span>}
      {caps.length > 0 ? caps.map((text) => <span key={text}>{text}</span>) : <span>未设预算上限</span>}
      {(overRound || overDay) && <span>超出上限的调用不会发起</span>}
    </p>
  );
}

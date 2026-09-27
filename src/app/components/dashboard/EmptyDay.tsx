import React from "react";
import { formatDayLabel } from "../timeline/zoned-time";
import { FIRST_RUN_HINT } from "./dashboard-calc";

export interface EmptyDayProps {
  hasRuns: boolean;
  /** 这一天有结果、只是全被筛掉了 */
  dayHasRuns: boolean;
  isToday: boolean;
  /** 除这一天外最近有运行的一天 */
  latestDay: string | null;
  onPickDay: (dayKey: string) => void;
}

/** 时间线为空时的说明；所选日无运行时指出最近有运行的一天并可跳转 */
export function EmptyDay({ hasRuns, dayHasRuns, isToday, latestDay, onPickDay }: EmptyDayProps) {
  if (!hasRuns) return FIRST_RUN_HINT;
  if (dayHasRuns || latestDay === null) return "没有符合筛选的结果";
  return (
    <>
      {isToday ? "今天" : "这一天"}还没有运行。最近一次在 {formatDayLabel(latestDay)}，
      <button type="button" className="matrix-empty-link" onClick={() => onPickDay(latestDay)}>
        查看
      </button>
    </>
  );
}

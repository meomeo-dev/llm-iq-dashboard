import React from "react";
import { useI18n } from "@/i18n";
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
  const { locale } = useI18n();
  const isEn = locale === "en";
  if (!hasRuns) {
    return isEn ? "No benchmark runs yet. Sign in as owner and click “▶ Run Once” to start." : FIRST_RUN_HINT;
  }
  if (dayHasRuns || latestDay === null) {
    return isEn ? "No results match the active filters" : "没有符合筛选的结果";
  }
  if (isEn) {
    return (
      <>
        No runs {isToday ? "today" : "on this day"}. Latest run on {formatDayLabel(latestDay, locale)} —{" "}
        <button type="button" className="matrix-empty-link" onClick={() => onPickDay(latestDay)}>
          View
        </button>
      </>
    );
  }
  return (
    <>
      {isToday ? "今天" : "这一天"}还没有运行。最近一次在 {formatDayLabel(latestDay, locale)}，
      <button type="button" className="matrix-empty-link" onClick={() => onPickDay(latestDay)}>
        查看
      </button>
    </>
  );
}

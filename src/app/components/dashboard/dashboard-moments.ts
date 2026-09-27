import { isCardShown, type HiddenFilters } from "../toolbar/filters";
import { filterMoment, type Moment } from "../timeline/moments";
import type { NowMark } from "../timeline/TimelineAxis";
import { formatZonedClock, zonedDayFraction } from "../timeline/zoned-time";

/**
 * 筛选出当天可见的时刻点，并剔除被全部筛空的时刻。
 */
export function filterVisibleMoments(moments: readonly Moment[], hidden: HiddenFilters): Moment[] {
  return moments
    .map((moment) => filterMoment(moment, (card) => isCardShown(card, hidden)))
    .filter((moment) => moment.cards.length > 0);
}

/**
 * 提取指定日期的时刻点，并按起始时刻升序排列。
 */
export function groupDayMoments(moments: readonly Moment[], dayKey: string): Moment[] {
  return moments
    .filter((m) => m.dayKey === dayKey)
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt));
}

/**
 * 计算“现在线”标记；仅在所选日与今日重合且就绪时提供。
 */
export function computeNowMark(
  now: Date | null,
  timeZone: string | null,
  dayKey: string,
  todayKey: string,
): NowMark | null {
  if (now === null || timeZone === null || dayKey !== todayKey) return null;
  return {
    fraction: zonedDayFraction(now, timeZone),
    clock: formatZonedClock(now, timeZone),
  };
}

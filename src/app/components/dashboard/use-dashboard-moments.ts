"use client";

import { useMemo, useState } from "react";
import type { DashboardCard } from "@/core/types";
import { groupMoments, listDays, listEfforts } from "../timeline/moments";
import { zonedDayKey } from "../timeline/zoned-time";
import type { HiddenFilters } from "../toolbar/filters";
import { resolveDashboardDayKey } from "./dashboard-calc";
import {
  computeNowMark,
  filterVisibleMoments,
  groupDayMoments,
} from "./dashboard-moments";

interface UseDashboardMomentsOptions {
  cards: DashboardCard[];
  runStarts: readonly string[];
  timeZone: string | null;
  now: Date | null;
  initialDay: string | null;
  isShowcase: boolean;
  hidden: HiddenFilters;
}

/**
 * 聚合看板在所选时区与日期下的时刻、卡片筛选与可见性计算。
 */
export function useDashboardMoments(options: UseDashboardMomentsOptions) {
  const { cards, runStarts, timeZone, now, initialDay, isShowcase, hidden } = options;
  const [pickedDay, setPickedDay] = useState<string | null>(initialDay);
  const ready = timeZone !== null && now !== null;
  const moments = useMemo(() => (timeZone === null ? [] : groupMoments(cards, timeZone)), [cards, timeZone]);
  const days = useMemo(() => (timeZone === null ? [] : listDays(runStarts, timeZone)), [runStarts, timeZone]);
  const todayKey = ready ? zonedDayKey(now, timeZone) : null;
  const todayHasRuns = ready && todayKey !== null && days.some((d) => d.dayKey === todayKey && d.momentCount > 0);
  const defaultShowcaseDay = isShowcase && !todayHasRuns && days.length > 0 ? days[0]?.dayKey ?? null : null;
  const dayKey = resolveDashboardDayKey({ pickedDay, defaultShowcaseDay, todayKey });
  const nowMark = computeNowMark(now, timeZone, dayKey ?? "", todayKey ?? "");
  const dayMoments = useMemo(() => (dayKey === null ? [] : groupDayMoments(moments, dayKey)), [moments, dayKey]);
  const visible = useMemo(() => filterVisibleMoments(dayMoments, hidden), [dayMoments, hidden]);
  const efforts = useMemo(() => listEfforts(visible.flatMap((moment) => moment.cards)), [visible]);

  return { ready, days, todayKey, todayHasRuns, dayKey, nowMark, dayMoments, visible, efforts, pickedDay, setPickedDay };
}

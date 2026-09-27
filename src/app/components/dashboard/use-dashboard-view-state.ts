import { useMemo, useState } from "react";
import type { DashboardProps } from "../Dashboard";
import { NO_FILTERS, type FilterKey, type HiddenFilters } from "../toolbar/filters";
import type { OpenCell } from "../timeline/RunGrid";
import { useStoredTimeZone } from "../timeline/use-stored-time-zone";
import { listTimeZones } from "../timeline/zoned-time";
import { useDayInUrl, useNow } from "./use-dashboard-time";
import { useDashboardMoments } from "./use-dashboard-moments";

/** 汇聚看板外壳的交互状态：筛选、单元格展开、时区、时间跳转与日期切换 */
export function useDashboardViewState(props: DashboardProps) {
  const { readonly = false, remote = false, cards, runStarts, initialDay, scheduleTimeZone } = props;
  const [hidden, setHidden] = useState<HiddenFilters>(NO_FILTERS);
  const [openCell, setOpenCell] = useState<OpenCell | null>(null);
  const [jumpCount, setJumpCount] = useState(0);
  const [timeZone, pickTimeZone] = useStoredTimeZone();
  const isShowcase = readonly || remote;

  const data = useDashboardMoments({ cards, runStarts, timeZone, now: useNow(), initialDay, isShowcase, hidden });
  useDayInUrl(data.pickedDay);

  const timeZones = useMemo(() => (timeZone === null ? [] : listTimeZones(scheduleTimeZone)), [timeZone, scheduleTimeZone]);
  const dayCards = useMemo(() => data.dayMoments.flatMap((m) => m.cards), [data.dayMoments]);

  const onHidden = (k: FilterKey, v: ReadonlySet<string>) => setHidden((c) => ({ ...c, [k]: v }));
  const onPickTimeZone = (tz: string) => { pickTimeZone(tz); data.setPickedDay(null); };
  const onJumpToNow = () => {
    data.setPickedDay(isShowcase && !data.todayHasRuns ? data.todayKey : null);
    setJumpCount((c) => c + 1);
  };
  const onPickDay = (next: string) => data.setPickedDay(isShowcase ? next : next === data.todayKey ? null : next);

  return {
    readonly, remote, hidden, onHidden, openCell, setOpenCell, jumpCount,
    timeZone, timeZones, dayCards, data, onPickTimeZone, onJumpToNow, onPickDay,
  };
}

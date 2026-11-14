import { useMemo, useRef, useState } from "react";
import type { ProfileView } from "@/core/profile-view";
import type { PromptStandard } from "@/core/prompt";
import type { DashboardProps } from "../Dashboard";
import { NO_FILTERS, type FilterKey, type HiddenFilters } from "../toolbar/filters";
import type { OpenCell } from "../timeline/RunGrid";
import { useStoredTimeZone } from "../timeline/use-stored-time-zone";
import { listTimeZones } from "../timeline/zoned-time";
import { useI18n } from "@/i18n";
import { useDayInUrl, useNow } from "./use-dashboard-time";
import { useDashboardMoments } from "./use-dashboard-moments";
import { useDashboardSync } from "./use-dashboard-sync";

const EMPTY_LABELS: Readonly<Record<string, string>> = {};
const EMPTY_STANDARDS: Readonly<Record<string, PromptStandard>> = {};
const EMPTY_PROFILES: readonly ProfileView[] = [];

/** 汇聚看板外壳的交互状态：筛选、单元格展开、时区、时间跳转与日期切换 */
export function useDashboardViewState(props: DashboardProps) {
  const { readonly = false, remote = false, initialDay, scheduleTimeZone } = props;
  const { locale } = useI18n();
  const [hidden, setHidden] = useState<HiddenFilters>(NO_FILTERS);
  const [openCell, setOpenCell] = useState<OpenCell | null>(null);
  const [jumpCount, setJumpCount] = useState(0);
  const [timeZone, pickTimeZone] = useStoredTimeZone();
  const isShowcase = readonly || remote;
  const pickedDayRef = useRef<string | null>(initialDay);

  const synced = useDashboardSync({
    cards: props.cards,
    runStarts: props.runStarts,
    promptLabels: props.promptLabels ?? EMPTY_LABELS,
    promptStandards: props.promptStandards ?? EMPTY_STANDARDS,
    profiles: props.profiles ?? EMPTY_PROFILES,
    initialDay,
    initialRunsRevision: props.initialRunsRevision,
    pickedDayRef,
  });
  const data = useDashboardMoments({
    cards: synced.cards,
    runStarts: synced.runStarts,
    timeZone,
    now: useNow(),
    initialDay,
    isShowcase,
    hidden,
  });
  pickedDayRef.current = data.pickedDay;
  useDayInUrl(data.pickedDay);

  const timeZones = useMemo(() => (timeZone === null ? [] : listTimeZones(scheduleTimeZone, locale)), [timeZone, scheduleTimeZone, locale]);
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
    timeZone, timeZones, dayCards, data, synced, onPickTimeZone, onJumpToNow, onPickDay,
  };
}

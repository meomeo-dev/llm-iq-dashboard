import React from "react";
import type { DashboardCard } from "@/core/types";
import { Toolbar } from "../toolbar/Toolbar";
import type { FilterKey, HiddenFilters } from "../toolbar/filters";
import type { TimeZoneOption } from "../timeline/zoned-time";
import type { DayOption } from "../timeline/moments";
import { summarize } from "./dashboard-calc";

interface DashboardToolbarProps {
  owner: boolean;
  readonly: boolean;
  remote: boolean;
  cards: readonly DashboardCard[];
  promptLabels: Readonly<Record<string, string>>;
  days: readonly DayOption[];
  dayKey: string;
  todayKey: string;
  timeZone: string;
  timeZones: readonly TimeZoneOption[];
  hidden: HiddenFilters;
  onHidden: (key: FilterKey, values: ReadonlySet<string>) => void;
  onPickTimeZone: (tz: string) => void;
  onJumpToNow: () => void;
  onPickDay: (next: string) => void;
}

/** 看板顶部工具栏包装器：计算汇总统计并绑定事件 */
export function DashboardToolbar(props: DashboardToolbarProps) {
  const { cards, ...rest } = props;
  return (
    <Toolbar
      {...rest}
      cards={cards}
      stats={summarize(cards)}
    />
  );
}

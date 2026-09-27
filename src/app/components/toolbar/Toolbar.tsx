"use client";

import { useMemo, useState } from "react";
import type { DashboardCard } from "@/core/types";
import type { FilterKey, HiddenFilters } from "./filters";
import { ToolbarBrand } from "./ToolbarIcons";
import { ToolbarCenter } from "./ToolbarCenter";
import { ToolbarMenus } from "./ToolbarMenus";
import { ToolbarUtils } from "./ToolbarUtils";
import { buildFilterGroups } from "./toolbar-filter-groups";
import type { TimeZoneOption } from "../timeline/zoned-time";
import type { DayOption } from "../timeline/moments";

export interface ToolbarProps {
  /** 所有者视角：显示跑一次、自动任务开关与配置入口；公开视角只看结果 */
  owner: boolean;
  /** 只读部署模式：不显示钥匙入口，显示只读展台徽章 */
  readonly?: boolean;
  /** 是否使用远程数据源 */
  remote?: boolean;
  /** 当天全部卡片（未筛选），用于计数 */
  cards: readonly DashboardCard[];
  /** 提示词 id → 显示名；查不到的（如已删除的自定义条目）直接显示 id */
  promptLabels: Readonly<Record<string, string>>;
  days: readonly DayOption[];
  dayKey: string | null;
  /** 所选时区下的今天，月历里始终可点 */
  todayKey: string;
  timeZone: string;
  timeZones: readonly TimeZoneOption[];
  onPickTimeZone: (timeZone: string) => void;
  /** 点时钟：回到今天并把时间线滚到现在 */
  onJumpToNow: () => void;
  hidden: HiddenFilters;
  onHidden: (key: FilterKey, values: ReadonlySet<string>) => void;
  onPickDay: (dayKey: string) => void;
  stats: { runs: number; works: number; rate: number };
}

/**
 * 顶部单行工具栏（不换行）：品牌、日期月历、筛选菜单；右端为当天总计、执行控制与状态、
 * 时钟与时区、配置入口。
 */
export function Toolbar(props: ToolbarProps) {
  const {
    owner,
    readonly = false,
    remote = false,
    cards,
    promptLabels,
    days,
    dayKey,
    stats,
    timeZone,
  } = props;
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const filterGroups = useMemo(() => buildFilterGroups(cards, promptLabels), [cards, promptLabels]);
  const toggleMenu = (id: string): void => setOpenMenu((current) => (current === id ? null : id));
  const closeMenus = (): void => setOpenMenu(null);

  return (
    <header className="toolbar">
      <div className="toolbar-top-row">
        <ToolbarBrand />
        <ToolbarMenus
          dayKey={dayKey}
          days={days}
          todayKey={props.todayKey}
          onPickDay={props.onPickDay}
          filterGroups={filterGroups}
          hidden={props.hidden}
          onHidden={props.onHidden}
          openMenu={openMenu}
          onToggleMenu={toggleMenu}
          onCloseMenus={closeMenus}
        />
        <ToolbarUtils
          owner={owner}
          readonly={readonly}
          timeZone={timeZone}
          timeZones={props.timeZones}
          onPickTimeZone={props.onPickTimeZone}
          onJumpToNow={props.onJumpToNow}
          openMenu={openMenu}
          onToggleMenu={toggleMenu}
          onCloseMenus={closeMenus}
        />
      </div>
      <ToolbarCenter
        owner={owner}
        remote={remote}
        timeZone={timeZone}
        stats={stats}
        openMenu={openMenu}
        onToggleMenu={toggleMenu}
        onCloseMenus={closeMenus}
      />
    </header>
  );
}

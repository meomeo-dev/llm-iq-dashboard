import React from "react";
import type { DayOption } from "../timeline/moments";
import { formatDayLabel } from "../timeline/zoned-time";
import { Menu } from "../menu/Menu";
import { Calendar } from "./Calendar";
import { FilterMenu, type FilterGroup } from "./FilterMenu";
import type { FilterKey, HiddenFilters } from "./filters";

interface ToolbarMenusProps {
  readonly dayKey: string | null;
  readonly days: readonly DayOption[];
  readonly todayKey: string;
  readonly onPickDay: (day: string) => void;
  readonly filterGroups: readonly FilterGroup[];
  readonly hidden: HiddenFilters;
  readonly onHidden: (key: FilterKey, values: ReadonlySet<string>) => void;
  readonly openMenu: string | null;
  readonly onToggleMenu: (id: string) => void;
  readonly onCloseMenus: () => void;
}

/** 工具栏左侧导航区：日期下拉日历与卡片属性筛选菜单 */
export function ToolbarMenus({
  dayKey,
  days,
  todayKey,
  onPickDay,
  filterGroups,
  hidden,
  onHidden,
  openMenu,
  onToggleMenu,
  onCloseMenus,
}: ToolbarMenusProps) {
  return (
    <nav className="menus" aria-label="日期与筛选">
      <Menu
        label={dayKey === null ? "日期" : formatDayLabel(dayKey)}
        panelClassName="day-panel"
        open={openMenu === "day"}
        onToggle={() => onToggleMenu("day")}
        onClose={onCloseMenus}
      >
        <div className="day-panel-head-bar">
          <span className="day-panel-title">选择日期</span>
          <button type="button" className="day-panel-close-btn" onClick={onCloseMenus} aria-label="关闭">
            ✕
          </button>
        </div>
        <Calendar
          days={days}
          dayKey={dayKey}
          todayKey={todayKey}
          onPick={(next) => {
            onPickDay(next);
            onCloseMenus();
          }}
        />
      </Menu>
      <FilterMenu
        groups={filterGroups}
        hidden={hidden}
        onHidden={onHidden}
        open={openMenu === "filter"}
        onToggle={() => onToggleMenu("filter")}
        onClose={onCloseMenus}
      />
    </nav>
  );
}

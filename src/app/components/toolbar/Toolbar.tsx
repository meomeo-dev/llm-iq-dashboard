"use client";

import { useEffect, useState } from "react";
import type { DashboardCard } from "@/core/types";
import { Calendar } from "./Calendar";
import type { CheckItem } from "./CheckList";
import { FilterMenu, type FilterGroup } from "./FilterMenu";
import type { FilterKey, HiddenFilters } from "./filters";
import { Menu } from "../menu/Menu";
import { AutoRunToggle } from "../run-control/AutoRunToggle";
import { RunOnceMenu } from "../run-control/RunOnceMenu";
import { RunStatus } from "../run-status/RunStatus";
import { listEfforts, type DayOption } from "../timeline/moments";
import {
  formatDayLabel,
  formatZonedClockWithSeconds,
  offsetLabel,
  type TimeZoneOption,
} from "../timeline/zoned-time";

export interface ToolbarProps {
  /** 所有者视角：显示跑一次、自动任务开关与配置入口；公开视角只看结果 */
  owner: boolean;
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
  const { owner, cards, promptLabels, days, dayKey, stats, timeZone } = props;
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const clis = tally(cards.map((card) => card.cli)).map((item) => ({
    ...item,
    marker: <span className={`cli-mark cli-${item.value}`} aria-hidden="true" />,
  }));
  const models = tally(cards.map((card) => card.model));
  // 强度按档位高低排序，与泳道顺序一致
  const efforts = listEfforts(cards).map((effort) => ({
    value: effort,
    label: effort,
    count: cards.filter((card) => card.effort === effort).length,
  }));
  // 按当天数据列出，配置里已停用的提示词仍可筛选
  const prompts = tally(cards.map((card) => card.promptId)).map((item) => ({
    ...item,
    label: promptLabels[item.value] ?? item.value,
  }));
  const filterGroups: FilterGroup[] = [
    { key: "cli", label: "CLI", items: clis },
    { key: "model", label: "模型", items: models },
    { key: "effort", label: "强度", items: efforts },
    { key: "promptId", label: "提示词", items: prompts },
  ];
  const menuProps = (id: string) => ({ open: openMenu === id, onToggle: () => setOpenMenu(openMenu === id ? null : id) });
  const closeMenus = (): void => setOpenMenu(null);

  return (
    <header className="toolbar">
      <div className="toolbar-top-row">
        <div className="brand" title="鹈鹕自行车基准">
          <span className="brand-mark" aria-hidden="true">
            &gt;_
          </span>
          <h1 className="brand-title">鹈鹕自行车基准</h1>
        </div>

        <nav className="menus" aria-label="日期与筛选">
          <Menu label={dayKey === null ? "日期" : formatDayLabel(dayKey)} panelClassName="day-panel" {...menuProps("day")} onClose={closeMenus}>
            <div className="day-panel-head-bar">
              <span className="day-panel-title">选择日期</span>
              <button type="button" className="day-panel-close-btn" onClick={closeMenus} aria-label="关闭">
                ✕
              </button>
            </div>
            <Calendar
              days={days}
              dayKey={dayKey}
              todayKey={props.todayKey}
              onPick={(next) => {
                props.onPickDay(next);
                closeMenus();
              }}
            />
          </Menu>
          <FilterMenu
            groups={filterGroups}
            hidden={props.hidden}
            onHidden={props.onHidden}
            {...menuProps("filter")}
            onClose={closeMenus}
          />
        </nav>

        <div className="toolbar-utils">
          <RunStatus timeZone={timeZone} owner={owner} {...menuProps("run")} onClose={closeMenus} />
          <div className="toolbar-stack clock">
            <button type="button" className="clock-now" title="回到今天，时间线滚到现在" onClick={props.onJumpToNow}>
              <LiveClock timeZone={timeZone} />
            </button>
            <Menu
              label={zoneLabel(props.timeZones, timeZone)}
              align="right"
              buttonClassName="menu-button-small"
              {...menuProps("zone")}
              onClose={closeMenus}
            >
              {props.timeZones.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="menu-row"
                  role="menuitemradio"
                  aria-checked={option.id === timeZone}
                  onClick={() => {
                    props.onPickTimeZone(option.id);
                    closeMenus();
                  }}
                >
                  <span className="radio" aria-hidden="true" />
                  <span className="menu-row-name">
                    {option.label} <span className="zone-id">{option.id}</span>
                  </span>
                  <span className="menu-row-count">{offsetLabel(new Date(), option.id)}</span>
                </button>
              ))}
            </Menu>
          </div>
          {owner ? (
            <a className="icon-link" href="/config" title="配置" aria-label="配置">
              <SettingsIcon />
            </a>
          ) : (
            <a className="icon-link" href="/pair" title="所有者登录" aria-label="所有者登录">
              <KeyIcon />
            </a>
          )}
        </div>
      </div>

      <div className="toolbar-center">
        <div className="toolbar-stack stats" title="所选日期的轮次、作品数与成功率">
          <span className="stack-main">成功率 {stats.rate}%</span>
          <span className="stack-sub">
            {stats.runs} 轮 · {stats.works} 作品
          </span>
        </div>
        {owner && <RunOnceMenu {...menuProps("run-once")} onClose={closeMenus} />}
        {owner && <AutoRunToggle timeZone={timeZone} />}
      </div>
    </header>
  );
}

/** 每秒刷新的时钟；挂载前显示占位，避免与服务端渲染不一致 */
function LiveClock({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <span className="clock-time">{now === null ? "--:--:--" : formatZonedClockWithSeconds(now, timeZone)}</span>;
}

/** 时区按钮上的文字，如 “本机 UTC+8” */
function zoneLabel(options: readonly TimeZoneOption[], timeZone: string): string {
  const label = options.find((option) => option.id === timeZone)?.label ?? timeZone;
  return `${label} ${offsetLabel(new Date(), timeZone)}`;
}

/** 按出现次数降序，同频按名称排序 */
function tally(values: readonly string[]): CheckItem[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

/** 所有者登录入口图标（钥匙） */
function KeyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="5.5" cy="10.5" r="3" />
      <path d="M7.8 8.2 14 2M11 5l2 2M9.5 6.5l2 2" strokeLinecap="round" />
    </svg>
  );
}

/** 配置入口图标（三条滑杆） */
function SettingsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M2 4h7M13 4h1M2 8h2M8 8h6M2 12h8" strokeLinecap="round" />
      <circle cx="11" cy="4" r="1.6" />
      <circle cx="6" cy="8" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
    </svg>
  );
}

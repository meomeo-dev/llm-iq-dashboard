import React from "react";
import type { Moment } from "../timeline/moments";
import type { NowMark } from "../timeline/TimelineAxis";
import type { OpenCell } from "../timeline/RunGrid";
import { RunGrid } from "../timeline/RunGrid";
import { SlotLegend, StatusLegend } from "../timeline/FolderTile";
import { ExportMenu } from "../export/ExportMenu";
import { planSlots } from "../timeline/effort-slots";
import { isFiltered, type HiddenFilters } from "../toolbar/filters";
import { EmptyDay } from "./EmptyDay";
import type { DayOption } from "../timeline/moments";

interface DashboardBoardProps {
  moments: readonly Moment[];
  efforts: readonly string[];
  nowMark: NowMark | null;
  dayKey: string;
  timeZone: string;
  hidden: HiddenFilters;
  runStarts: readonly string[];
  dayMomentsCount: number;
  days: readonly DayOption[];
  todayKey: string;
  jumpCount: number;
  onOpenCell: (cell: OpenCell) => void;
  onPickDay: (dayKey: string) => void;
}

/**
 * 看板主体面板：执行时间线标题栏、图例、导出菜单与矩阵网格。
 */
export function DashboardBoard({
  moments,
  efforts,
  nowMark,
  dayKey,
  timeZone,
  hidden,
  runStarts,
  dayMomentsCount,
  days,
  todayKey,
  jumpCount,
  onOpenCell,
  onPickDay,
}: DashboardBoardProps) {
  return (
    <main className="board">
      <section className="board-panel">
        <div className="board-head">
          <h2 className="board-title">
            执行时间线 <span className="board-title-sub">（24 小时）</span>
          </h2>
          <SlotLegend slots={planSlots(efforts)} />
          <StatusLegend />
          <ExportMenu
            moments={moments}
            efforts={efforts}
            now={nowMark}
            dayKey={dayKey}
            timeZone={timeZone}
            filtered={isFiltered(hidden)}
          />
        </div>
        <RunGrid
          scrollKey={`${dayKey}|${timeZone}|${jumpCount}`}
          now={nowMark}
          moments={moments}
          efforts={efforts}
          onOpen={onOpenCell}
          emptyContent={
            <EmptyDay
              hasRuns={runStarts.length > 0}
              dayHasRuns={dayMomentsCount > 0}
              isToday={dayKey === todayKey}
              latestDay={days.find((day) => day.dayKey !== dayKey)?.dayKey ?? null}
              onPickDay={onPickDay}
            />
          }
        />
      </section>
    </main>
  );
}

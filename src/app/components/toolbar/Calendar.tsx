"use client";

import { useState } from "react";
import type { DayOption } from "../timeline/moments";
import {
  monthCells,
  monthOf,
  shiftMonth,
  WEEKDAYS,
} from "./calendar-grid";

/**
 * 月历：有运行的日子与今天可选，格内标出轮数，初始显示所选日期所在月。
 * 日期键为 YYYY-MM-DD，已按所选时区换算（见 zoned-time.ts）。
 */
export function Calendar({
  days,
  dayKey,
  todayKey,
  onPick,
}: {
  days: readonly DayOption[];
  dayKey: string | null;
  /** 所选时区下的今天；无运行也可选 */
  todayKey: string;
  onPick: (dayKey: string) => void;
}) {
  const counts = new Map(days.map((day) => [day.dayKey, day.momentCount]));
  const [month, setMonth] = useState(() => monthOf(dayKey ?? todayKey));
  const cells = monthCells(month);

  return (
    <div className="calendar" role="dialog" aria-label="选择日期">
      <div className="calendar-head">
        <button type="button" className="calendar-nav" aria-label="上个月" onClick={() => setMonth(shiftMonth(month, -1))}>
          ‹
        </button>
        <span className="calendar-month">
          {month.year} 年 {month.month} 月
        </span>
        <button type="button" className="calendar-nav" aria-label="下个月" onClick={() => setMonth(shiftMonth(month, 1))}>
          ›
        </button>
      </div>
      <div className="calendar-grid">
        {WEEKDAYS.map((name) => (
          <span key={name} className="calendar-weekday">
            {name}
          </span>
        ))}
        {cells.map((cell, index) => {
          if (cell === null) return <span key={`pad-${index}`} />;
          const count = counts.get(cell) ?? 0;
          return (
            <button
              key={cell}
              type="button"
              className={["calendar-day", cell === dayKey && "selected", cell === todayKey && "today"].filter(Boolean).join(" ")}
              disabled={count === 0 && cell !== todayKey}
              aria-pressed={cell === dayKey}
              title={count === 0 ? undefined : `${count} 轮`}
              onClick={() => onPick(cell)}
            >
              {Number(cell.slice(8, 10))}
              {count > 0 && <span className="calendar-count">{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

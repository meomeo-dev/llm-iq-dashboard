"use client";

import { useState } from "react";
import type { DayOption } from "../timeline/moments";

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

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

interface Month {
  year: number;
  /** 1–12 */
  month: number;
}

function monthOf(dayKey: string): Month {
  return { year: Number(dayKey.slice(0, 4)), month: Number(dayKey.slice(5, 7)) };
}

function shiftMonth({ year, month }: Month, delta: number): Month {
  const shifted = new Date(year, month - 1 + delta, 1);
  return { year: shifted.getFullYear(), month: shifted.getMonth() + 1 };
}

/** 从周一开始排，月初之前用 null 补齐；返回的是日期键 */
function monthCells({ year, month }: Month): Array<string | null> {
  const first = new Date(year, month - 1, 1);
  const leading = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: Array<string | null> = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(toDayKey(new Date(year, month - 1, day)));
  return cells;
}

function toDayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

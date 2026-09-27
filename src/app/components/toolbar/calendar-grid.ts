export interface Month {
  year: number;
  /** 1–12 */
  month: number;
}

export const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

export function monthOf(dayKey: string): Month {
  return { year: Number(dayKey.slice(0, 4)), month: Number(dayKey.slice(5, 7)) };
}

export function shiftMonth({ year, month }: Month, delta: number): Month {
  const shifted = new Date(year, month - 1 + delta, 1);
  return { year: shifted.getFullYear(), month: shifted.getMonth() + 1 };
}

/** 从周一开始排，月初之前用 null 补齐；返回的是日期键 */
export function monthCells({ year, month }: Month): Array<string | null> {
  const first = new Date(year, month - 1, 1);
  const leading = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: Array<string | null> = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(toDayKey(new Date(year, month - 1, day)));
  return cells;
}

export function toDayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

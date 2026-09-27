/**
 * 日期窗口到数据仓 UTC 分区的映射。
 *
 * 保证数据仓目录布局（runs/YYYY/MM/DD）与时间窗口 [from, to) 的双向映射确定、无遗漏。
 */

import { RUNS_DIR } from "../data-repo/contract";

const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_FORMAT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * 计算时间窗口 [from, to) 覆盖到的全部 UTC 日期（YYYY-MM-DD），按升序排列。
 * 若 from >= to 则返回空数组。
 */
export function utcDatesBetween(from: Date, to: Date): string[] {
  if (from.getTime() >= to.getTime()) return [];

  const lastMs = to.getTime() - 1;
  const lastDate = new Date(lastMs);

  let cur = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  const end = Date.UTC(
    lastDate.getUTCFullYear(),
    lastDate.getUTCMonth(),
    lastDate.getUTCDate(),
  );

  const dates: string[] = [];
  while (cur <= end) {
    const d = new Date(cur);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    dates.push(`${y}-${m}-${day}`);
    cur += DAY_MS;
  }
  return dates;
}

/**
 * 将 UTC 日期（YYYY-MM-DD）转换为数据仓相对路径（runs/YYYY/MM/DD）；
 * 非法格式返回 null。
 */
export function dayPartitionPath(dateStr: string): string | null {
  const match = DATE_FORMAT_PATTERN.exec(dateStr);
  if (match === null) return null;
  const [, year, month, day] = match;
  return `${RUNS_DIR}/${year}/${month}/${day}`;
}

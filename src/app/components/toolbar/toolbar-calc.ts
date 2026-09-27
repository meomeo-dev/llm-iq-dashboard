import type { CheckItem } from "./CheckList";
import { offsetLabel, type TimeZoneOption } from "../timeline/zoned-time";

/** 时区按钮上的文字，如 “本机 UTC+8” */
export function zoneLabel(options: readonly TimeZoneOption[], timeZone: string): string {
  const label = options.find((option) => option.id === timeZone)?.label ?? timeZone;
  return `${label} ${offsetLabel(new Date(), timeZone)}`;
}

/** 按出现次数降序，同频按名称排序 */
export function tally(values: readonly string[]): CheckItem[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

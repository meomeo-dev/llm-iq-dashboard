/**
 * 按所选时区换算日期与钟点，基于浏览器自带的 Intl。
 * 日期键为 YYYY-MM-DD 的日历日期，本身不带时区；时区换算发生在生成日期键时。
 */

export interface TimeZoneOption {
  /** IANA 时区名，如 Asia/Shanghai */
  id: string;
  label: string;
}

/** 常用时区；浏览器本地与调度时区由调用方插在最前面 */
const COMMON_TIME_ZONES: readonly TimeZoneOption[] = [
  { id: "UTC", label: "UTC" },
  { id: "Asia/Shanghai", label: "上海" },
  { id: "Asia/Tokyo", label: "东京" },
  { id: "Asia/Singapore", label: "新加坡" },
  { id: "Europe/London", label: "伦敦" },
  { id: "Europe/Berlin", label: "柏林" },
  { id: "America/New_York", label: "纽约" },
  { id: "America/Los_Angeles", label: "洛杉矶" },
  { id: "America/Sao_Paulo", label: "圣保罗" },
];

const SECONDS_PER_DAY = 86_400;

export function browserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/** 本机、调度时区在前，其后是常用时区；同一 IANA 名只保留第一个 */
export function listTimeZones(scheduleTimeZone: string | null): TimeZoneOption[] {
  const leading: TimeZoneOption[] = [{ id: browserTimeZone(), label: "本机" }];
  if (scheduleTimeZone !== null) leading.push({ id: scheduleTimeZone, label: "调度时区" });
  const seen = new Set<string>();
  return [...leading, ...COMMON_TIME_ZONES].filter((option) => {
    if (seen.has(option.id)) return false;
    seen.add(option.id);
    return true;
  });
}

/** 时区名不合法时 Intl 会抛错，外部来源的时区名须先校验 */
export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

// 按时区缓存 DateTimeFormat：创建开销大，时间线一次渲染要换算上百次
const partsFormatters = new Map<string, Intl.DateTimeFormat>();

function zonedParts(date: Date, timeZone: string): ZonedParts {
  let formatter = partsFormatters.get(timeZone);
  if (formatter === undefined) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      // h23：午夜为 00，部分引擎默认给出 24
      hourCycle: "h23",
    });
    partsFormatters.set(timeZone, formatter);
  }
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

export function zonedDayKey(date: Date, timeZone: string): string {
  const { year, month, day } = zonedParts(date, timeZone);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** 一天中的位置，0 = 00:00:00，1 = 24:00:00 */
export function zonedDayFraction(date: Date, timeZone: string): number {
  const { hour, minute, second } = zonedParts(date, timeZone);
  return (hour * 3600 + minute * 60 + second) / SECONDS_PER_DAY;
}

/** “21:59” */
export function formatZonedClock(date: Date, timeZone: string): string {
  const { hour, minute } = zonedParts(date, timeZone);
  return `${pad(hour)}:${pad(minute)}`;
}

/** “21:59:30” */
export function formatZonedClockWithSeconds(date: Date, timeZone: string): string {
  const { hour, minute, second } = zonedParts(date, timeZone);
  return `${pad(hour)}:${pad(minute)}:${pad(second)}`;
}

/** “2026/09/23 21:59:30” */
export function formatZonedDateTime(date: Date, timeZone: string): string {
  const { year, month, day } = zonedParts(date, timeZone);
  return `${year}/${pad(month)}/${pad(day)} ${formatZonedClockWithSeconds(date, timeZone)}`;
}

/** “UTC+8”“UTC−3:30”“UTC±0”：随日期变化，夏令时期间会不同 */
export function offsetLabel(date: Date, timeZone: string): string {
  const name = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;
  // 零偏移在不同 ICU 版本里写作 “GMT” 或 “GMT+0”，统一成 “UTC±0”
  if (name === undefined || name === "GMT" || name === "GMT+0") return "UTC±0";
  return name.replace("GMT", "UTC").replace("-", "−");
}

/** 日期键的显示文字，如 “09/24 周四”；按 UTC 解析与格式化，星期不受本机时区影响 */
export function formatDayLabel(dayKey: string): string {
  const date = new Date(`${dayKey}T00:00:00Z`);
  const monthDay = date.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit", timeZone: "UTC" });
  const weekday = date.toLocaleDateString("zh-CN", { weekday: "short", timeZone: "UTC" });
  return `${monthDay} ${weekday}`;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

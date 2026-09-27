import { formatZonedClock } from "../components/timeline/zoned-time";
import type { AutoRunView } from "@/core/auto-run";

export interface ScheduleDraft {
  cron: string | null;
  intervalMinutes: number | null;
  timezone: string | null;
  runOnStart: boolean;
}

/** cron 与间隔互斥：未选中的一方置 null，写回时从 YAML 删除；两者皆空即不定时 */
export type ScheduleMode = "none" | "cron" | "interval";

export function getScheduleMode(value: ScheduleDraft): ScheduleMode {
  if (value.cron !== null) return "cron";
  if (value.intervalMinutes !== null) return "interval";
  return "none";
}

export function switchScheduleMode(
  value: ScheduleDraft,
  next: ScheduleMode,
): ScheduleDraft {
  if (next === "none") {
    return { ...value, cron: null, intervalMinutes: null, runOnStart: false };
  }
  if (next === "cron") {
    return {
      ...value,
      cron: value.cron ?? "0 */6 * * *",
      intervalMinutes: null,
    };
  }
  return {
    ...value,
    cron: null,
    intervalMinutes: value.intervalMinutes ?? 360,
  };
}

export function resolveTimeZone(valueTz: string | null): string {
  if (valueTz !== null) return valueTz;
  if (typeof Intl !== "undefined") {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  return "Asia/Shanghai";
}

export interface ScheduleNotice {
  kind: "warn" | "ok" | "muted";
  message: string;
  showActivateButton: boolean;
}

export function getScheduleNotice(
  scheduled: boolean,
  isMasterEnabled: boolean,
  state: AutoRunView | null,
  timeZone: string,
): ScheduleNotice {
  if (scheduled && !isMasterEnabled) {
    return {
      kind: "warn",
      message:
        "⚠️ 状态说明：定时节奏已设置，但自动任务开关当前处于“已暂停”状态。定时点到达时将自动跳过，不消耗 API 配额。",
      showActivateButton: true,
    };
  }
  if (scheduled && isMasterEnabled) {
    const nextRun = state?.nextRunAt
      ? `下次触发预计于 ${formatZonedClock(new Date(state.nextRunAt), timeZone)}`
      : "按设定间隔自动发起评测";
    return {
      kind: "ok",
      message: `✅ 状态说明：自动任务正常运行中。${nextRun}。`,
      showActivateButton: false,
    };
  }
  return {
    kind: "muted",
    message: "○ 状态说明：下方选了“不定时”，调度器不会自动触发任何任务。",
    showActivateButton: false,
  };
}

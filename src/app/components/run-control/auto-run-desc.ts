import type { AutoRunView } from "@/core/auto-run";
import { formatZonedClock } from "../timeline/zoned-time";

export function subline(state: AutoRunView | null, timeZone: string): string {
  if (state === null) return "读取中…";
  if (!state.enabled) return "已暂停";
  if (state.schedule.cron === null && state.schedule.intervalMinutes === null) return "未设节奏";
  if (state.schedulerPid === null) return "调度器未运行";
  if (state.pendingRun !== null) return state.pendingRun.waitingFor !== null ? `排队中，等 ${state.pendingRun.waitingFor} 结束` : "排队中，等上一轮结束";
  if (state.nextRunAt !== null) return `下次 ${formatZonedClock(new Date(state.nextRunAt), timeZone)}`;
  return `每 ${state.schedule.intervalMinutes} 分钟`;
}

export function describeSchedule(state: AutoRunView | null): string {
  if (state === null) return "自动任务";
  if (state.schedule.cron === null && state.schedule.intervalMinutes === null) {
    return "自动任务：配置里没有定时节奏，到点不会触发。在配置页设置 cron 或固定间隔后生效。";
  }
  const rhythm = state.schedule.cron !== null ? `cron ${state.schedule.cron}` : `每 ${state.schedule.intervalMinutes} 分钟`;
  const zone = state.schedule.timezone !== null ? `（${state.schedule.timezone}）` : "";
  const scheduler = state.schedulerPid !== null ? `调度器 pid ${state.schedulerPid}` : "调度器未运行";
  const statusDesc = state.enabled ? "运行中" : "已暂停（到点跳过执行）";
  return `自动任务（${statusDesc}）：按 ${rhythm}${zone} 自动评测。${scheduler}。点击开关可一键开启/暂停。`;
}

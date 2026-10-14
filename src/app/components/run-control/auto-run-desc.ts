import type { AutoRunView } from "@/core/auto-run";
import type { Locale } from "@/i18n";
import { formatZonedClock } from "../timeline/zoned-time";

export function subline(state: AutoRunView | null, timeZone: string, locale: Locale = "zh-CN"): string {
  const isEn = locale === "en";
  if (state === null) return isEn ? "Loading…" : "读取中…";
  if (!state.enabled) return isEn ? "Paused" : "已暂停";
  if (state.schedule.cron === null && state.schedule.intervalMinutes === null) {
    return isEn ? "No schedule" : "未设节奏";
  }
  if (state.schedulerPid === null) return isEn ? "Scheduler offline" : "调度器未运行";
  if (state.pendingRun !== null) {
    if (isEn) {
      return state.pendingRun.waitingFor !== null
        ? `Queued after ${state.pendingRun.waitingFor}`
        : "Queued for current round";
    }
    return state.pendingRun.waitingFor !== null
      ? `排队中，等 ${state.pendingRun.waitingFor} 结束`
      : "排队中，等上一轮结束";
  }
  if (state.nextRunAt !== null) {
    const clock = formatZonedClock(new Date(state.nextRunAt), timeZone);
    return isEn ? `Next ${clock}` : `下次 ${clock}`;
  }
  return isEn ? `Every ${state.schedule.intervalMinutes}m` : `每 ${state.schedule.intervalMinutes} 分钟`;
}

export function describeSchedule(state: AutoRunView | null, locale: Locale = "zh-CN"): string {
  const isEn = locale === "en";
  if (state === null) return isEn ? "Auto-Run" : "自动任务";
  if (state.schedule.cron === null && state.schedule.intervalMinutes === null) {
    return isEn
      ? "Auto-Run: No cron or interval configured. Set a schedule in Configuration to enable automatic runs."
      : "自动任务：配置里没有定时节奏，到点不会触发。在配置页设置 cron 或固定间隔后生效。";
  }
  if (isEn) {
    const rhythm =
      state.schedule.cron !== null ? `cron ${state.schedule.cron}` : `every ${state.schedule.intervalMinutes}m`;
    const zone = state.schedule.timezone !== null ? ` (${state.schedule.timezone})` : "";
    const scheduler =
      state.schedulerPid !== null ? `Scheduler pid ${state.schedulerPid}` : "Scheduler offline";
    const statusDesc = state.enabled ? "Running" : "Paused (scheduled triggers skipped)";
    return `Auto-Run (${statusDesc}): runs on ${rhythm}${zone}. ${scheduler}. Click switch to toggle.`;
  }
  const rhythm = state.schedule.cron !== null ? `cron ${state.schedule.cron}` : `每 ${state.schedule.intervalMinutes} 分钟`;
  const zone = state.schedule.timezone !== null ? `（${state.schedule.timezone}）` : "";
  const scheduler = state.schedulerPid !== null ? `调度器 pid ${state.schedulerPid}` : "调度器未运行";
  const statusDesc = state.enabled ? "运行中" : "已暂停（到点跳过执行）";
  return `自动任务（${statusDesc}）：按 ${rhythm}${zone} 自动评测。${scheduler}。点击开关可一键开启/暂停。`;
}

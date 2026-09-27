"use client";

import { useEffect, useState } from "react";
import { actionFetch } from "../action-fetch";
import type { AutoRunView } from "@/core/auto-run";
import { publishAutoRun, useLiveAutoRun, type LiveAutoRun } from "../live-state/live-store";
import { formatZonedClock } from "../timeline/zoned-time";

interface SwitchFailure {
  message: string;
  /** 失败时的推送状态；推送变化后这条报错即过期 */
  seen: LiveAutoRun | null;
}

/**
 * 自动任务开关：上行为开关，下行说明下一次触发时间或不触发的原因。默认关闭
 * （见 core/auto-run.ts）；关闭只影响之后的触发，正在跑的一轮照常跑完。
 * 状态经 /api/events 推送。
 */
export function AutoRunToggle({ timeZone }: { timeZone: string }) {
  const pushed = useLiveAutoRun();
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<SwitchFailure | null>(null);

  const state = pushed !== null && !("error" in pushed) ? pushed : null;
  const switchError = failure !== null && failure.seen === pushed ? failure.message : null;
  const error = switchError ?? (pushed !== null && "error" in pushed ? pushed.error : null);

  useEffect(() => {
    if (failure !== null) {
      const timer = setTimeout(() => setFailure(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [failure]);

  const toggle = async (): Promise<void> => {
    if (state === null) return;
    setBusy(true);
    const result = await putSwitch(!state.enabled);
    setBusy(false);
    if ("error" in result) return setFailure({ message: result.error, seen: pushed });
    setFailure(null);
    publishAutoRun(result);
  };

  const enabled = state?.enabled === true;
  return (
    <div className="toolbar-stack auto-run" title={error ?? describeSchedule(state)}>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        className="auto-run-switch"
        disabled={state === null || busy}
        onClick={() => void toggle()}
      >
        <span className="auto-run-track" aria-hidden="true" />
        自动任务
      </button>
      <span className={error !== null ? "stack-sub auto-run-error" : "stack-sub"}>
        {error !== null ? (switchError ? "切换失败" : "读取失败") : subline(state, timeZone)}
      </span>
    </div>
  );
}

function subline(state: AutoRunView | null, timeZone: string): string {
  if (state === null) return "读取中…";
  if (!state.enabled) return "已暂停";
  if (state.schedule.cron === null && state.schedule.intervalMinutes === null) return "未设节奏";
  if (state.schedulerPid === null) return "调度器未运行";
  if (state.nextRunAt !== null) return `下次 ${formatZonedClock(new Date(state.nextRunAt), timeZone)}`;
  return `每 ${state.schedule.intervalMinutes} 分钟`;
}

function describeSchedule(state: AutoRunView | null): string {
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

async function putSwitch(enabled: boolean): Promise<AutoRunView | { error: string }> {
  try {
    const response = await actionFetch("/api/auto-run", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
    const body = (await response.json()) as AutoRunView & { error?: string };
    return response.ok ? body : { error: body.error ?? "请求失败" };
  } catch (cause) {
    return { error: cause instanceof Error ? cause.message : String(cause) };
  }
}

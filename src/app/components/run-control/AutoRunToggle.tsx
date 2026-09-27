"use client";

import { useEffect, useState } from "react";
import { actionFetch } from "../action-fetch";
import type { AutoRunView } from "@/core/auto-run";
import { publishAutoRun, useLiveAutoRun, type LiveAutoRun } from "../live-state/live-store";
import { describeSchedule, subline } from "./auto-run-desc";

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
export function AutoRunToggle({
  timeZone,
  readOnly = false,
}: {
  timeZone: string;
  readOnly?: boolean;
}) {
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
    if (readOnly || state === null) return;
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
      <AutoRunControl
        readOnly={readOnly}
        enabled={enabled}
        state={state}
        busy={busy}
        onToggle={() => void toggle()}
      />
      <span className={error !== null ? "stack-sub auto-run-error" : "stack-sub"}>
        {error !== null ? (switchError ? "切换失败" : "读取失败") : subline(state, timeZone)}
      </span>
    </div>
  );
}

interface AutoRunControlProps {
  readOnly: boolean;
  enabled: boolean;
  state: AutoRunView | null;
  busy: boolean;
  onToggle: () => void;
}

function AutoRunControl({ readOnly, enabled, state, busy, onToggle }: AutoRunControlProps) {
  if (readOnly) {
    return (
      <div className="auto-run-readonly-status" aria-label="自动任务状态（只读）">
        <span
          className={`auto-run-dot ${enabled ? "dot-running" : "dot-paused"}`}
          aria-hidden="true"
        />
        <span>自动任务</span>
      </div>
    );
  }
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      className="auto-run-switch"
      disabled={state === null || busy}
      onClick={onToggle}
    >
      <span className="auto-run-track" aria-hidden="true" />
      自动任务
    </button>
  );
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

"use client";

import type { RunOptionsView } from "@/app/api/run/route";
import { RunForecast } from "./RunForecast";
import type { StartMode } from "./run-once-profiles";
import { StopRunButton } from "./StopRunButton";

export type Notice = { kind: "ok" | "error"; text: string } | null;

interface RunOnceFooterProps {
  options: RunOptionsView | null;
  targetIds: readonly string[];
  promptCount: number;
  notice: Notice;
  activeRunId: string | null;
  ownRunActive: boolean;
  stopping: boolean;
  busy: boolean;
  /** 开始按钮的形态：直接开始 / 先选上游 / 没有可用上游 */
  mode: StartMode;
  onStart: () => void;
}

/** 按钮文字：直接开始时带调用数，多上游时提示先选，一个都不可用时写原因 */
function startLabel(mode: StartMode, busy: boolean, ownRunActive: boolean): string {
  if (busy) return "发起中…";
  if (ownRunActive) return "本轮执行中…";
  if (mode.kind === "choose") return "选择 Profile 后开始";
  if (mode.kind === "none") return mode.reason;
  return `开始（${mode.calls} 次调用）`;
}

export function RunOnceFooter({
  options,
  targetIds,
  promptCount,
  notice,
  activeRunId,
  ownRunActive,
  stopping,
  busy,
  mode,
  onStart,
}: RunOnceFooterProps) {
  const nothingToRun = mode.kind === "none" || (mode.kind === "direct" && mode.calls === 0);
  return (
    <footer className="run-once-foot">
      {options !== null && (
        <RunForecast costs={options.costs} targetIds={targetIds} promptCount={promptCount} />
      )}
      {notice !== null && <p className={`run-once-notice ${notice.kind}`}>{notice.text}</p>}
      {activeRunId !== null && !ownRunActive && (
        <p className="run-once-notice error">轮次 {activeRunId} 仍在执行，跑完再发起</p>
      )}
      {/* 可在此就地停止当前轮次 */}
      {activeRunId !== null && <StopRunButton runId={activeRunId} stopping={stopping} />}
      <button
        type="button"
        className="run-once-start"
        disabled={busy || nothingToRun || activeRunId !== null}
        onClick={onStart}
      >
        {startLabel(mode, busy, ownRunActive)}
      </button>
    </footer>
  );
}

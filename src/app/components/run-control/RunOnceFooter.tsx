"use client";

import type { RunOptionsView } from "@/app/api/run/route";
import { RunForecast } from "./RunForecast";
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
  calls: number;
  onStart: () => void;
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
  calls,
  onStart,
}: RunOnceFooterProps) {
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
        disabled={busy || calls === 0 || activeRunId !== null}
        onClick={onStart}
      >
        {busy ? "发起中…" : ownRunActive ? "本轮执行中…" : `开始（${calls} 次调用）`}
      </button>
    </footer>
  );
}

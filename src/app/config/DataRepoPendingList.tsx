import React from "react";
import type { PendingRun } from "@/core/sync/data-repo-panel-types";

interface DataRepoPendingListProps {
  runs: readonly PendingRun[];
  selected: ReadonlySet<string>;
  disabled: boolean;
  onToggle: (runId: string) => void;
  onSetAll: (on: boolean) => void;
}

/** runId 形如 20260929T150913Z，显示为 2026-09-29 15:09 UTC */
export function formatRunIdTime(runId: string): string {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})\d{2}Z$/.exec(runId);
  if (m === null) return runId;
  return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]} UTC`;
}

/**
 * 待导出轮次清单：每轮一行，勾选后"导出"与"演练"只处理勾选的轮次。
 * 题目白名单在导出时另行生效，这里只列本轮记录里的题目与上游。
 */
export function DataRepoPendingList({ runs, selected, disabled, onToggle, onSetAll }: DataRepoPendingListProps) {
  if (runs.length === 0) return null;
  const selectedCount = runs.filter((run) => selected.has(run.runId)).length;
  const allSelected = selectedCount === runs.length;
  return (
    <div className="data-repo-pending">
      <div className="data-repo-pending-head">
        <label className="data-repo-pending-all">
          <input
            type="checkbox"
            checked={allSelected}
            disabled={disabled}
            onChange={(event) => onSetAll(event.target.checked)}
          />
          待导出 {runs.length} 轮，已勾选 {selectedCount} 轮
        </label>
        <span className="data-repo-pending-hint">未勾选的留在本机，下次仍在清单里</span>
      </div>
      <ul className="data-repo-pending-items">
        {runs.map((run) => (
          <li key={run.runId} className={selected.has(run.runId) ? "" : "unselected"}>
            <label>
              <input
                type="checkbox"
                checked={selected.has(run.runId)}
                disabled={disabled}
                onChange={() => onToggle(run.runId)}
              />
              <span className="data-repo-pending-time">{formatRunIdTime(run.runId)}</span>
              <code className="data-repo-pending-id">{run.runId}</code>
              <span className="data-repo-pending-prompts">{run.promptIds.join("、") || "（无题目记录）"}</span>
              <span className="data-repo-pending-count">成功 {run.ok}/{run.attempts}</span>
              {run.profiles.length > 0 && (
                <span className="data-repo-pending-profiles">上游 {run.profiles.join("、")}</span>
              )}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

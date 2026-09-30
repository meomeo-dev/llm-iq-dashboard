import React from "react";
import type { PendingRun } from "@/core/sync/data-repo-panel-types";
import { PendingRunRow } from "./DataRepoPendingRun";
import { runPick, type SelectionState } from "./pending-selection-model";

export { formatRunIdTime } from "./DataRepoPendingRun";

interface DataRepoPendingListProps {
  runs: readonly PendingRun[];
  state: SelectionState;
  disabled: boolean;
  onToggleRun: (run: PendingRun) => void;
  onToggleAttempt: (run: PendingRun, key: string) => void;
  onSetAll: (on: boolean) => void;
  /** 丢弃：记入台账不再导出，可在"已丢弃"里恢复 */
  onDiscard: (runIds: string[]) => void;
}

/**
 * 待导出轮次清单：勾选后"导出"与"演练"只处理勾选的轮次，展开一轮可逐次调用预览并挑选子集。
 * 题目白名单在导出时另行生效，这里只列本轮记录里的题目与上游。
 */
export function DataRepoPendingList(props: DataRepoPendingListProps) {
  const { runs, state, disabled, onSetAll, onDiscard } = props;
  if (runs.length === 0) return null;
  const picks = runs.map((run) => runPick(state, run));
  const selectedCount = picks.filter((pick) => pick !== "none").length;
  const partial = picks.filter((pick) => pick === "some").length;
  const unselected = runs.filter((_, index) => picks[index] === "none").map((run) => run.runId);
  return (
    <div className="data-repo-pending">
      <div className="data-repo-pending-head">
        <label className="data-repo-pending-all">
          <input
            type="checkbox"
            checked={selectedCount === runs.length}
            disabled={disabled}
            onChange={(event) => onSetAll(event.target.checked)}
          />
          待导出 {runs.length} 轮，已勾选 {selectedCount} 轮{partial > 0 ? `（其中 ${partial} 轮只选了部分调用）` : ""}
        </label>
        <span className="data-repo-pending-hint">
          未勾选的留在本机，下次仍在清单里；不要的可以丢弃
          {unselected.length > 0 && (
            <button type="button" className="data-repo-link-button" disabled={disabled} onClick={() => onDiscard(unselected)}>
              丢弃未勾选的 {unselected.length} 轮
            </button>
          )}
        </span>
      </div>
      <ul className="data-repo-pending-items">
        {runs.map((run) => (
          <PendingRunRow
            key={run.runId}
            run={run}
            state={state}
            disabled={disabled}
            onToggleRun={props.onToggleRun}
            onToggleAttempt={props.onToggleAttempt}
            onDiscard={onDiscard}
          />
        ))}
      </ul>
    </div>
  );
}

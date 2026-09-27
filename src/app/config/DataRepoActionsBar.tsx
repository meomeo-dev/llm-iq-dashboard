import React from "react";
import type { SyncActionMode } from "@/core/sync/data-repo-panel-types";
import {
  ACTION_LABELS,
  type ActionState,
} from "./data-repo-panel-model";

interface DataRepoActionsBarProps {
  actions: Record<SyncActionMode, ActionState>;
  inFlightMode: SyncActionMode | null;
  onTriggerAction: (mode: SyncActionMode) => void;
  onOpenPushDialog: () => void;
}

const MODES: SyncActionMode[] = ["dry-run", "export", "confirm", "push"];

/** 数据仓面板同步动作工具栏 */
export function DataRepoActionsBar({
  actions,
  inFlightMode,
  onTriggerAction,
  onOpenPushDialog,
}: DataRepoActionsBarProps) {
  const handleClick = (mode: SyncActionMode) => {
    if (mode === "push") {
      onOpenPushDialog();
    } else {
      onTriggerAction(mode);
    }
  };

  return (
    <div className="data-repo-actions-bar">
      <div className="data-repo-buttons">
        {MODES.map((mode) => {
          const action = actions[mode];
          const isCurrentBusy = inFlightMode === mode;
          return (
            <div key={mode} className="data-repo-action-item">
              <button
                type="button"
                className={`data-repo-btn data-repo-btn-${mode}`}
                disabled={!action.enabled || inFlightMode !== null}
                title={action.disabledReason ?? action.hint ?? undefined}
                onClick={() => handleClick(mode)}
              >
                {isCurrentBusy ? `正在${action.label}…` : action.label}
              </button>
              {action.hint && (
                <span className="data-repo-btn-hint">{action.hint}</span>
              )}
            </div>
          );
        })}
      </div>

      {inFlightMode !== null && (
        <span className="status busy data-repo-busy-status">
          正在执行{ACTION_LABELS[inFlightMode]}，请稍候…
        </span>
      )}
    </div>
  );
}

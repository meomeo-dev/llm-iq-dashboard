import React from "react";
import type { DataRepoStatus, SyncActionMode } from "@/core/sync/data-repo-panel-types";
import {
  derivePipeline,
  type PipelineModel,
  type PipelinePrimaryAction,
} from "./data-repo-pipeline-model";

export interface DataRepoPipelineProps {
  status?: DataRepoStatus | null;
  inFlightMode?: SyncActionMode | null;
  pipeline?: PipelineModel;
  /** 面板勾选的待导出轮次数；没有勾选清单时省略 */
  selectedCount?: number | null;
  onTriggerAction: (mode: SyncActionMode) => void;
  onOpenPushDialog: () => void;
  onRefresh?: () => void;
}

/** 渲染单步状态条 */
function PipelineStepItem({
  step,
  index,
}: {
  step: PipelineModel["steps"][number];
  index: number;
}) {
  return (
    <div className={`data-repo-pipeline-step ${step.status}`}>
      <div className="data-repo-pipeline-step-header">
        <span className="data-repo-pipeline-step-badge">
          {step.status === "completed" ? "✓" : index + 1}
        </span>
        <span className="data-repo-pipeline-step-label">{step.label}</span>
      </div>
      <span className="data-repo-pipeline-step-count">{step.countText}</span>
    </div>
  );
}

/** 渲染主按钮或重新检查 */
function PipelinePrimaryArea({
  primary,
  inFlight,
  onPrimaryClick,
  onRefresh,
}: {
  primary: PipelinePrimaryAction | null;
  inFlight: SyncActionMode | null;
  onPrimaryClick: () => void;
  onRefresh?: () => void;
}) {
  if (!primary) {
    return (
      <button
        type="button"
        className="data-repo-pipeline-btn data-repo-pipeline-btn-refresh"
        disabled={inFlight !== null}
        onClick={onRefresh}
      >
        重新检查
      </button>
    );
  }
  const cls = "data-repo-pipeline-disabled-reason data-repo-pipeline-disabled-link";
  return (
    <div className="data-repo-pipeline-primary-wrap">
      <button
        type="button"
        className={`data-repo-pipeline-btn data-repo-pipeline-btn-primary data-repo-pipeline-btn-${primary.mode}`}
        disabled={!primary.enabled || inFlight !== null}
        title={primary.disabledReason ?? undefined}
        onClick={onPrimaryClick}
      >
        {primary.label}
      </button>
      {primary.disabledReason &&
        (primary.disabledLink ? (
          <a href={primary.disabledLink} className={cls}>
            {primary.disabledReason}
          </a>
        ) : (
          <span className="data-repo-pipeline-disabled-reason">
            {primary.disabledReason}
          </span>
        ))}
    </div>
  );
}

/** 数据仓同步发布流水线组件 */
export function DataRepoPipeline({
  status = null,
  inFlightMode = null,
  pipeline: customPipeline,
  selectedCount = null,
  onTriggerAction,
  onOpenPushDialog,
  onRefresh,
}: DataRepoPipelineProps) {
  const pipeline = customPipeline ?? derivePipeline(status, inFlightMode, selectedCount);
  const { steps, description, staticNotice, primaryAction, secondaryAction } =
    pipeline;

  const handlePrimaryClick = () => {
    if (!primaryAction || !primaryAction.enabled || inFlightMode !== null) return;
    if (primaryAction.mode === "push") {
      onOpenPushDialog();
    } else {
      onTriggerAction(primaryAction.mode);
    }
  };

  return (
    <div className="data-repo-pipeline">
      <div className="data-repo-pipeline-steps">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            {idx > 0 && <span className="data-repo-pipeline-connector">→</span>}
            <PipelineStepItem step={step} index={idx} />
          </React.Fragment>
        ))}
      </div>
      {staticNotice && (
        <div className="data-repo-pipeline-static-notice">{staticNotice}</div>
      )}
      <div className="data-repo-pipeline-action-bar">
        <div className="data-repo-pipeline-main">
          <span className="data-repo-pipeline-desc">{description}</span>
          <PipelinePrimaryArea
            primary={primaryAction}
            inFlight={inFlightMode}
            onPrimaryClick={handlePrimaryClick}
            onRefresh={onRefresh}
          />
        </div>
        <div className="data-repo-pipeline-secondary">
          <button
            type="button"
            className="data-repo-pipeline-btn data-repo-pipeline-btn-secondary"
            disabled={!secondaryAction.enabled || inFlightMode !== null}
            title={secondaryAction.disabledReason ?? undefined}
            onClick={() => onTriggerAction("dry-run")}
          >
            {secondaryAction.label}
          </button>
        </div>
      </div>
    </div>
  );
}

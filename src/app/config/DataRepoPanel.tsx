"use client";

import React, { useState } from "react";
import type {
  DataRepoStatus,
  SyncActionMode,
  SyncActionResult,
} from "@/core/sync/data-repo-panel-types";
import {
  ACTION_LABELS,
  deriveActionResultSummary,
  deriveCountsSummary,
  deriveHealthStatus,
  derivePushConfirmation,
  extractReportIssues,
  type ActionResultSummary,
} from "./data-repo-panel-model";
import { DataRepoCards } from "./DataRepoCards";
import { DataRepoDiscardedList } from "./DataRepoDiscardedList";
import { DataRepoGithubCard } from "./DataRepoGithubCard";
import { DataRepoIssuesList } from "./DataRepoIssuesList";
import { DataRepoPendingList } from "./DataRepoPendingList";
import { DataRepoPipeline } from "./DataRepoPipeline";
import { DataRepoPushDialog } from "./DataRepoPushDialog";
import { useDataRepoActions, type FetchFn } from "./use-data-repo-actions";
import { usePendingSelection, type PendingSelection } from "./use-pending-selection";

export interface DataRepoPanelProps {
  initialStatus?: DataRepoStatus | null;
  initialInFlightMode?: SyncActionMode | null;
  initialShowPushDialog?: boolean;
  initialActionResult?: SyncActionResult | null;
  fetchFn?: FetchFn;
  autoLoad?: boolean;
}

/** 面板标题里的仓名：配置了地址就显示 owner/repo，没配沿用缺省仓名 */
function repositoryLabel(status: DataRepoStatus | null): string {
  const url = status?.repository;
  if (!url) return "llm-iq-data";
  return url.replace(/^https:\/\/github\.com\//, "");
}

function DataRepoHeader({ label }: { label: string }) {
  return (
    <header>
      <h2>数据仓</h2>
      <p>公开评测数据仓（{label}）的同步与发布状态。</p>
    </header>
  );
}

/** 渲染提示或禁用说明的精简区块 */
function DataRepoNoticeSection({ message, label }: { message: string; label: string }) {
  return (
    <section id="data-repo" className="config-section data-repo-section">
      <DataRepoHeader label={label} />
      <p className="data-repo-notice">{message}</p>
    </section>
  );
}

/** 本地副本指向别的仓：同步已被执行器拒绝，告诉所有者两条出路 */
function DataRepoMismatchBar({ status }: { status: DataRepoStatus | null }) {
  if (status?.repo?.remoteMismatch !== true) return null;
  return (
    <div className="status error data-repo-error-bar">
      本地副本的 origin 与配置的数据仓地址不是同一个仓，同步已拒绝：改「数据仓设置」里的地址，
      或换一个空目录作本地路径让执行器重新 clone。
    </div>
  );
}

/** 错误提示与最近操作结果摘要横条 */
function DataRepoSummaryBar({
  error,
  summary,
}: {
  error: string | null;
  summary: ActionResultSummary | null;
}) {
  return (
    <>
      {error && <div className="status error data-repo-error-bar">{error}</div>}
      {summary && (
        <div
          className={`data-repo-action-summary ${summary.ok ? "ok" : "error"}`}
        >
          <span className="data-repo-summary-label">
            最近操作结果（{ACTION_LABELS[summary.mode]}）：
          </span>
          <span className="data-repo-summary-text">{summary.text}</span>
        </div>
      )}
    </>
  );
}

/** 检查特殊状态说明文本 */
function getSpecialNotice(
  status: DataRepoStatus | null,
  loading: boolean,
): string | null {
  if (loading && status === null) return "正在读取数据仓状态…";
  if (status !== null && !status.configured) {
    return "当前配置未启用数据仓（dataRepo）。如需同步评测数据到公开数据仓，在上方「数据仓设置」区块启用并保存。";
  }
  if (status !== null && status.deploy.readonly) {
    return "当前为只读部署（只读展台或远程数据源），数据仓同步功能已禁用。";
  }
  return null;
}

/** 集中推导展示子模型 */
function derivePanelData(
  status: DataRepoStatus | null,
  actionResult: SyncActionResult | null,
) {
  return {
    health: deriveHealthStatus(status),
    counts: deriveCountsSummary(status),
    pushConfirm: derivePushConfirmation(status),
    summary: deriveActionResultSummary(
      actionResult ?? status?.lastAction ?? null,
    ),
    issues: extractReportIssues(
      actionResult?.report ?? status?.lastAction?.report ?? null,
    ),
  };
}

/** 待导出清单（按轮次与调用勾选、丢弃）与已丢弃清单（恢复） */
function DataRepoSelectionSection({
  pending,
  discarded,
  disabled,
  onLedgerAction,
}: {
  pending: PendingSelection;
  discarded: readonly string[];
  disabled: boolean;
  onLedgerAction: (mode: "discard" | "restore", runIds: string[]) => void;
}) {
  return (
    <>
      <DataRepoPendingList
        runs={pending.runs}
        state={pending.state}
        disabled={disabled}
        onToggleRun={pending.toggleRun}
        onToggleAttempt={pending.toggleAttempt}
        onSetAll={pending.setAll}
        onDiscard={(runIds) => onLedgerAction("discard", runIds)}
      />
      <DataRepoDiscardedList runIds={discarded} disabled={disabled} onRestore={(runIds) => onLedgerAction("restore", runIds)} />
    </>
  );
}

/** 配置页数据仓同步控制面板 */
export function DataRepoPanel({
  initialStatus,
  initialInFlightMode = null,
  initialShowPushDialog = false,
  initialActionResult = null,
  fetchFn,
  autoLoad,
}: DataRepoPanelProps) {
  const {
    status,
    loading,
    inFlightMode: hookMode,
    actionResult: hookResult,
    error,
    refresh,
    executeAction,
  } = useDataRepoActions({ fetchFn, initialStatus, autoLoad });

  const [showPushDialog, setShowPushDialog] = useState(initialShowPushDialog);
  const currentInFlight = hookMode ?? initialInFlightMode;
  const currentResult = hookResult ?? initialActionResult;
  const pending = usePendingSelection(status);

  const label = repositoryLabel(status);
  const notice = getSpecialNotice(status, loading);
  if (notice !== null) return <DataRepoNoticeSection message={notice} label={label} />;

  const { health, counts, pushConfirm, summary, issues } =
    derivePanelData(status, currentResult);

  return (
    <section id="data-repo" className="config-section data-repo-section">
      <DataRepoHeader label={label} />

      <DataRepoCards health={health} counts={counts} />
      <DataRepoMismatchBar status={status} />
      {status?.github && <DataRepoGithubCard github={status.github} repositoryName={label} />}
      {status?.notice && (
        <div className="status notice data-repo-notice-bar">{status.notice}</div>
      )}

      <DataRepoPipeline
        status={status}
        inFlightMode={currentInFlight}
        selectedCount={pending.selectedCount}
        onTriggerAction={(mode) => void executeAction(mode, undefined, pending.scope)}
        onOpenPushDialog={() => setShowPushDialog(true)}
        onRefresh={() => void refresh()}
      />
      <DataRepoSelectionSection
        pending={pending}
        discarded={status?.local.discarded ?? []}
        disabled={currentInFlight !== null}
        onLedgerAction={(mode, runIds) => void executeAction(mode, undefined, { runIds })}
      />

      <DataRepoSummaryBar error={error} summary={summary} />
      <DataRepoIssuesList rejected={issues.rejected} skipped={issues.skipped} />

      <DataRepoPushDialog
        isOpen={showPushDialog}
        aheadCommits={pushConfirm.aheadCommits}
        pendingPublishCount={pushConfirm.pendingPublishCount}
        canConfirm={pushConfirm.canConfirm}
        disabledReason={pushConfirm.disabledReason}
        isBusy={currentInFlight === "push"}
        onConfirm={() => {
          setShowPushDialog(false);
          void executeAction("push", { aheadCommits: pushConfirm.aheadCommits }, pending.scope);
        }}
        onCancel={() => setShowPushDialog(false)}
      />
    </section>
  );
}

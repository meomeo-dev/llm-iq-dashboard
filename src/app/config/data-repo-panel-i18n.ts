/**
 * English localization helpers for DataRepoPanel and DataRepoPipeline models.
 */

import type {
  DataRepoStatus,
  SyncActionMode,
  SyncActionResult,
} from "@/core/sync/data-repo-panel-types";
import type { SyncReport } from "@/core/sync/sync-orchestrator";
import type { ConfirmPublishedReport } from "@/core/sync/confirm-published";
import type { LedgerDecisionReport } from "@/core/sync/ledger-decisions";
import type {
  ActionResultSummary,
  DataRepoCountsSummary,
  HealthInfo,
  PushConfirmationModel,
} from "./data-repo-panel-model";
import type {
  PipelineModel,
  PipelinePrimaryAction,
  PipelineSecondaryAction,
  PipelineStage,
  PipelineStep,
  StepStatus,
} from "./data-repo-pipeline-model";

export const ACTION_LABELS_EN: Record<SyncActionMode, string> = {
  "dry-run": "Dry Run",
  export: "Export & Commit",
  confirm: "Confirm Published",
  push: "Push & Publish",
  discard: "Discard",
  restore: "Restore",
};

const SKIP_REASON_LABELS_EN: Record<string, string> = {
  idempotent: "already exported",
  "内容无变化": "already exported",
  "已导出": "already exported",
  incomplete: "incomplete",
  "未完成": "incomplete",
  "unpublishable-prompt": "unpublishable",
  "不可发布": "unpublishable",
  "invalid-run-id": "invalid run ID",
  "无效轮次": "invalid run ID",
  rejected: "rejected",
  "被拒绝": "rejected",
  abandoned: "abandoned",
  "已废弃": "abandoned",
  empty: "empty run",
  "空轮次": "empty run",
  discarded: "discarded",
  "no-selected-attempts": "selected attempts not in run",
};

export function deriveHealthStatusEn(status: DataRepoStatus | null): HealthInfo {
  if (status === null) {
    return { level: "unavailable", label: "Unavailable", reason: "Status not loaded" };
  }
  if (!status.configured) {
    return { level: "unavailable", label: "Unavailable", reason: "Data repository (dataRepo) not configured" };
  }
  if (status.deploy.readonly) {
    return { level: "unavailable", label: "Unavailable", reason: "Read-only deployment; sync disabled" };
  }
  if (status.repo === null) {
    return { level: "unavailable", label: "Unavailable", reason: "Data repo working copy unreachable" };
  }
  if (!status.repo.reachable) {
    return { level: "unavailable", label: "Unavailable", reason: `Data repo path unreachable: ${status.repo.path}` };
  }
  if (!status.repo.isGitRepo) {
    return { level: "unavailable", label: "Unavailable", reason: `Path is not a valid Git repository: ${status.repo.path}` };
  }
  return deriveWarningOrHealthyEn(status);
}

function deriveWarningOrHealthyEn(status: DataRepoStatus): HealthInfo {
  const repo = status.repo!;
  if (!repo.clean) {
    return { level: "warning", label: "Warning", reason: "Data repo working tree has uncommitted changes" };
  }
  if (repo.behind !== null && repo.behind > 0) {
    return { level: "warning", label: "Warning", reason: `Behind upstream branch by ${repo.behind} commit(s); pull first` };
  }
  if (repo.upstream === null) {
    return { level: "warning", label: "Warning", reason: "Upstream remote branch not configured" };
  }
  if (status.notice !== null && status.notice.trim() !== "") {
    return { level: "warning", label: "Warning", reason: status.notice };
  }
  if (status.lastAction !== null && !status.lastAction.ok) {
    return { level: "warning", label: "Warning", reason: `Last action failed: ${status.lastAction.error ?? "execution error"}` };
  }
  const running = status.local.running ?? 0;
  if (running > 0) {
    const after = status.autoSync === false ? "select in the list below to export after completion" : "will auto-export after completion";
    return { level: "healthy", label: "Healthy", reason: `${running} run(s) in progress; ${after}` };
  }
  return { level: "healthy", label: "Healthy", reason: "Data repository is healthy" };
}

export function checkPushCapabilityReasonEn(status: DataRepoStatus): string | null {
  if (
    status.pushCapability === "unavailable" ||
    (!status.pushCapability && status.deploy.externalRunner)
  ) {
    return status.deploy.externalRunner
      ? "Runner is not connected to GitHub; connect above before pushing"
      : "No push credentials inside container; push from the host machine";
  }
  return null;
}

export function derivePushConfirmationEn(status: DataRepoStatus | null): PushConfirmationModel {
  if (status === null || status.repo === null) {
    return { aheadCommits: [], pendingPublishCount: 0, canConfirm: false, disabledReason: "Data repository unreachable" };
  }
  const aheadCommits = status.repo.aheadCommits ?? [];
  const pendingPublishCount = status.ledger.exported;
  const capabilityReason = checkPushCapabilityReasonEn(status);
  if (capabilityReason !== null) {
    return { aheadCommits, pendingPublishCount, canConfirm: false, disabledReason: capabilityReason };
  }
  if (aheadCommits.length === 0) {
    return { aheadCommits, pendingPublishCount, canConfirm: false, disabledReason: "No commits ahead of upstream; nothing to push" };
  }
  return { aheadCommits, pendingPublishCount, canConfirm: true, disabledReason: null };
}

function isConfirmReport(report: SyncActionResult["report"]): report is ConfirmPublishedReport {
  return report !== null && Array.isArray((report as ConfirmPublishedReport).confirmed);
}

function formatSkippedBreakdownEn(skipped: Array<{ runId: string; reason: string }>): string {
  if (skipped.length === 0) return "skipped 0 runs";
  const counts = new Map<string, number>();
  for (const item of skipped) {
    const label = SKIP_REASON_LABELS_EN[item.reason] ?? item.reason;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  const parts = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => `${label} ${count}`);
  return `skipped ${skipped.length} run(s) (${parts.join(", ")})`;
}

export function deriveActionResultSummaryEn(result: SyncActionResult | null): ActionResultSummary | null {
  if (result === null) return null;
  if (!result.ok || result.error !== null) {
    const error = result.error ?? "Execution failed";
    return {
      text: `Failed: ${error}`,
      ok: false,
      mode: result.mode,
      exportedCount: 0,
      skippedCount: 0,
      rejectedCount: 0,
      redactedCount: 0,
      publishedCount: 0,
      error,
    };
  }
  if (result.mode === "discard" || result.mode === "restore") {
    const report = result.report as LedgerDecisionReport | null;
    const changed = report?.changed.length ?? 0;
    const verb = result.mode === "discard" ? "Discarded" : "Restored";
    const unchanged = (report?.unchanged ?? []).map((item) => `${item.runId} (${item.reason})`);
    const text = unchanged.length > 0 ? `${verb} ${changed} run(s); unchanged: ${unchanged.join(", ")}` : `${verb} ${changed} run(s)`;
    return { text, ok: true, mode: result.mode, exportedCount: 0, skippedCount: 0, rejectedCount: 0, redactedCount: 0, publishedCount: 0, error: null };
  }
  if (result.mode === "confirm") {
    const publishedCount = isConfirmReport(result.report) ? result.report.confirmed.length : 0;
    const text = publishedCount > 0 ? `Remote contains ${publishedCount} run(s), marked as published` : "Remote does not yet contain any pending runs";
    return { text, ok: true, mode: result.mode, exportedCount: 0, skippedCount: 0, rejectedCount: 0, redactedCount: 0, publishedCount, error: null };
  }
  if (result.mode === "push") {
    const publishedCount = isConfirmReport(result.report)
      ? result.report.confirmed.length
      : ((result.report as SyncReport | null)?.ledgerTransitions?.published?.length ?? 0);
    return { text: `Pushed; ${publishedCount} run(s) marked as published`, ok: true, mode: result.mode, exportedCount: 0, skippedCount: 0, rejectedCount: 0, redactedCount: 0, publishedCount, error: null };
  }
  const report = result.report as SyncReport | null;
  const exportedCount = report?.exported?.length ?? 0;
  const skipped = report?.skipped ?? [];
  const rejectedCount = report?.rejected?.length ?? 0;
  const redactedCount = report?.redactions?.reduce((acc, r) => acc + (r.redactions?.length ?? 1), 0) ?? 0;
  const publishedCount = report?.ledgerTransitions?.published?.length ?? 0;
  const prefix = result.mode === "dry-run" ? "Dry run: exportable " : "Exported ";
  let text = `${prefix}${exportedCount} run(s); ${formatSkippedBreakdownEn(skipped)}`;
  if (rejectedCount > 0) text += `; rejected ${rejectedCount} run(s)`;
  if (redactedCount > 0) text += `; redacted ${redactedCount} item(s)`;
  if (publishedCount > 0) text += `; published ${publishedCount} run(s)`;
  return { text, ok: true, mode: result.mode, exportedCount, skippedCount: skipped.length, rejectedCount, redactedCount, publishedCount, error: null };
}

export function deriveCountsSummaryEn(status: DataRepoStatus | null): DataRepoCountsSummary {
  if (status === null) {
    return { localText: "Not loaded", ledgerText: "Not loaded", manifestText: "Not loaded", repoText: "Not loaded", unpublishableText: null, rejectedText: null };
  }
  const runningText = (status.local.running ?? 0) > 0 ? `, ${status.local.running} running` : "";
  const localText = `Total ${status.local.totalRuns} run(s), ${status.local.pending.length} pending export${runningText}`;
  const ledgerText = `${status.ledger.exported} pending publish, ${status.ledger.published} published`;
  const manifestText = status.manifest
    ? `Total ${status.manifest.totalRuns} run(s), latest ${status.manifest.latestDay ?? "none"}`
    : "No manifest data";
  const repo = status.repo;
  const repoText = repo
    ? `Branch ${repo.branch ?? "unknown"}, upstream ${repo.upstream ?? "unconfigured"}, ahead ${repo.ahead ?? 0}, behind ${repo.behind ?? 0}`
    : "No repository info";
  const byReason = status.ledger.skippedByReason;
  const unpublishableCount = byReason
    ? (byReason["unpublishable-prompt"] ?? 0) + (byReason.abandoned ?? 0) + (byReason.empty ?? 0)
    : Math.max(0, (status.ledger.skipped ?? 0) - (status.local.rejected?.length ?? 0));
  const rejectedCount = byReason ? (byReason.rejected ?? 0) : (status.local.rejected?.length ?? 0);
  return {
    localText,
    ledgerText,
    manifestText,
    repoText,
    unpublishableText: unpublishableCount > 0 ? `${unpublishableCount} unpublishable run(s)` : null,
    rejectedText: rejectedCount > 0 ? `${rejectedCount} rejected run(s) (manual review required)` : null,
  };
}

function checkCommonBlockerEn(status: DataRepoStatus | null, inFlightMode: SyncActionMode | null): string | null {
  if (inFlightMode !== null) return `Running ${ACTION_LABELS_EN[inFlightMode]}, please wait`;
  if (status === null) return "Status not loaded";
  if (status.deploy.readonly) return "Sync actions are disabled in read-only deployment";
  if (!status.configured) return "Data repository not configured";
  if (status.repo === null || !status.repo.reachable) return "Data repository unreachable";
  if (!status.repo.isGitRepo) return "Data repository is not a valid Git repository";
  return null;
}

function buildPipelineStepsEn(status: DataRepoStatus | null, activeStage: PipelineStage | "all-published"): PipelineStep[] {
  const pendingCount = status?.local.pending.length ?? 0;
  const aheadCount = status?.repo?.ahead ?? 0;
  const exportedCount = status?.ledger.exported ?? 0;
  const publishedCount = status?.ledger.published ?? 0;
  const pushExtra = exportedCount > 0 ? ` (${exportedCount} run(s))` : "";
  const stepStatus = (stage: PipelineStage): StepStatus => {
    if (activeStage === "all-published") return "completed";
    if (stage === activeStage) return "current";
    if (activeStage === "published") return "completed";
    if (activeStage === "exported" && stage === "local") return "completed";
    return "pending";
  };
  return [
    { id: "local", label: "Local Runs", countText: `${pendingCount} pending export`, status: stepStatus("local") },
    { id: "exported", label: "Exported (Local Commit)", countText: `${aheadCount} commit(s) to push${pushExtra}`, status: stepStatus("exported") },
    { id: "published", label: "Published (GitHub)", countText: `${publishedCount} published`, status: stepStatus("published") },
  ];
}

function resolvePrimaryActionEn(
  kind: "export" | "push" | "confirm" | "none",
  status: DataRepoStatus,
  commonBlocker: string | null,
  inFlight: SyncActionMode | null,
  selectedCount: number | null,
): PipelinePrimaryAction | null {
  const labelFor = (def: string) => (inFlight === null || inFlight === "dry-run" ? def : `${ACTION_LABELS_EN[inFlight]}…`);
  if (kind === "export") {
    const count = selectedCount ?? status.local.pending.length;
    const reason = commonBlocker ?? (!status.repo?.clean ? "Working tree has uncommitted changes; clean or commit first" : null) ?? (count === 0 ? "Select runs to export below first" : null);
    return { mode: "export", label: labelFor(`Export ${count} Run(s)`), enabled: reason === null, disabledReason: reason };
  }
  if (kind === "push") {
    const repo = status.repo!;
    const capReason = checkPushCapabilityReasonEn(status);
    const reason =
      commonBlocker ??
      (!repo.clean ? "Working tree has uncommitted changes; clean or commit first" : null) ??
      (repo.behind !== null && repo.behind > 0 ? `Behind upstream by ${repo.behind} commit(s); pull first` : null) ??
      capReason ??
      (repo.upstream === null ? "Upstream branch not configured; cannot push" : null);
    const link = commonBlocker === null && repo.clean && !(repo.behind && repo.behind > 0) && capReason !== null && status.deploy.externalRunner ? "#data-repo" : null;
    return { mode: "push", label: labelFor("Push & Publish"), enabled: reason === null, disabledReason: reason, disabledLink: link };
  }
  if (kind === "confirm") {
    const reason = commonBlocker ?? (status.repo?.upstream === null ? "Upstream branch not configured; cannot confirm publish status" : null);
    return { mode: "confirm", label: labelFor("Confirm Published"), enabled: reason === null, disabledReason: reason };
  }
  return null;
}

export function derivePipelineEn(
  status: DataRepoStatus | null,
  inFlightMode: SyncActionMode | null = null,
  selectedCount: number | null = null,
): PipelineModel {
  const commonBlocker = checkCommonBlockerEn(status, inFlightMode);
  const secondaryAction: PipelineSecondaryAction = {
    mode: "dry-run",
    label: inFlightMode === "dry-run" ? "Dry Running…" : "Dry Run (No Write)",
    enabled: commonBlocker === null,
    disabledReason: commonBlocker,
  };
  const staticNotice =
    status?.deploy.externalRunner === true
      ? status.autoSync === false
        ? "Does not auto-export after runs: select runs below to export; pushing requires confirmation here."
        : "Auto-exports after runs; pushing requires confirmation here."
      : null;
  if (status === null) {
    return { steps: buildPipelineStepsEn(null, "local"), currentStage: "local", description: "Status not loaded", staticNotice, primaryAction: null, secondaryAction };
  }
  const ahead = status.repo?.ahead ?? 0;
  const stageInfo: { stage: PipelineStage | "all-published"; description: string; kind: "export" | "push" | "confirm" | "none" } =
    status.local.pending.length > 0
      ? { stage: "local", description: `${status.local.pending.length} local run(s) not yet exported to data repo`, kind: "export" }
      : ahead > 0
        ? { stage: "exported", description: `${ahead} local commit(s) waiting to push to GitHub${status.ledger.exported > 0 ? ` (${status.ledger.exported} run(s))` : ""}`, kind: "push" }
        : status.ledger.exported > 0
          ? { stage: "published", description: `${status.ledger.exported} run(s) on remote not yet marked as published`, kind: "confirm" }
          : { stage: "all-published", description: `All ${status.ledger.published} run(s) published; local and remote are in sync`, kind: "none" };
  return {
    steps: buildPipelineStepsEn(status, stageInfo.stage),
    currentStage: stageInfo.stage,
    description: stageInfo.description,
    staticNotice,
    primaryAction: resolvePrimaryActionEn(stageInfo.kind, status, commonBlocker, inFlightMode, selectedCount),
    secondaryAction,
  };
}

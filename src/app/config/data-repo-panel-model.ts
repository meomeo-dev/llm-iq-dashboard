/**
 * 数据仓面板展示模型推导纯函数。
 *
 * 依据 GET /api/data-repo 返回的 DataRepoStatus，归约出：
 * 1. 仓库健康等级（正常 / 注意 / 不可用）及原因；
 * 2. 四项动作（预演 / 导出 / 确认 / 推送）的可用状态与禁用提示；
 * 3. 推送二次确认框展示数据（领先提交短哈希列表、待发布轮次数）；
 * 4. 计数指标文案；
 * 5. 最近动作结果的结构化摘要与拦截轮次列表。
 */

import type {
  DataRepoStatus,
  SyncActionMode,
  SyncActionResult,
} from "@/core/sync/data-repo-panel-types";
import type { SyncReport } from "@/core/sync/sync-orchestrator";
import type { ConfirmPublishedReport } from "@/core/sync/confirm-published";

export type HealthLevel = "healthy" | "warning" | "unavailable";

export interface HealthInfo {
  level: HealthLevel;
  label: "正常" | "注意" | "不可用";
  reason: string;
}

export interface ActionState {
  mode: SyncActionMode;
  label: string;
  enabled: boolean;
  disabledReason: string | null;
  hint: string | null;
}

export interface PushConfirmationModel {
  aheadCommits: string[];
  pendingPublishCount: number;
  canConfirm: boolean;
  disabledReason: string | null;
}

export interface ActionResultSummary {
  text: string;
  ok: boolean;
  mode: SyncActionMode;
  exportedCount: number;
  skippedCount: number;
  rejectedCount: number;
  redactedCount: number;
  publishedCount: number;
  error: string | null;
}

export interface DataRepoCountsSummary {
  localText: string;
  ledgerText: string;
  manifestText: string;
  repoText: string;
}

export interface RejectedIssue {
  runId: string;
  file: string;
  reason: string;
}

export interface SkippedIssue {
  runId: string;
  reason: string;
}

export const ACTION_LABELS: Record<SyncActionMode, string> = {
  "dry-run": "预演",
  export: "导出提交",
  confirm: "确认发布",
  push: "推送发布",
};

/** 推导数据仓整体健康等级及面向所有者的中文说明 */
export function deriveHealthStatus(status: DataRepoStatus | null): HealthInfo {
  if (status === null) {
    return { level: "unavailable", label: "不可用", reason: "状态未加载" };
  }
  if (!status.configured) {
    return {
      level: "unavailable",
      label: "不可用",
      reason: "未配置数据仓 (dataRepo)",
    };
  }
  if (status.deploy.readonly) {
    return {
      level: "unavailable",
      label: "不可用",
      reason: "只读部署，无法同步数据仓",
    };
  }
  if (status.repo === null) {
    return {
      level: "unavailable",
      label: "不可用",
      reason: "数据仓工作副本不可达",
    };
  }
  if (!status.repo.reachable) {
    return {
      level: "unavailable",
      label: "不可用",
      reason: `数据仓路径不可达: ${status.repo.path}`,
    };
  }
  if (!status.repo.isGitRepo) {
    return {
      level: "unavailable",
      label: "不可用",
      reason: `路径不是有效 Git 仓库: ${status.repo.path}`,
    };
  }
  return deriveWarningOrHealthy(status);
}

/** 细化判断注意等级或正常 */
function deriveWarningOrHealthy(status: DataRepoStatus): HealthInfo {
  const repo = status.repo!;
  if (!repo.clean) {
    return { level: "warning", label: "注意", reason: "数据仓工作区有未提交的改动" };
  }
  if (repo.behind !== null && repo.behind > 0) {
    return {
      level: "warning",
      label: "注意",
      reason: `落后上游分支 ${repo.behind} 个提交，建议先拉取同步`,
    };
  }
  if (repo.upstream === null) {
    return { level: "warning", label: "注意", reason: "未配置上游远程分支" };
  }
  if (status.notice !== null && status.notice.trim() !== "") {
    return { level: "warning", label: "注意", reason: status.notice };
  }
  if (status.lastAction !== null && !status.lastAction.ok) {
    return {
      level: "warning",
      label: "注意",
      reason: `最近一次操作失败: ${status.lastAction.error ?? "执行异常"}`,
    };
  }
  if (status.local.incomplete > 0) {
    return {
      level: "warning",
      label: "注意",
      reason: `有 ${status.local.incomplete} 轮执行未完成或缺少结果`,
    };
  }
  return { level: "healthy", label: "正常", reason: "数据仓状态健康" };
}

/** 检查所有动作通用的禁用前置条件 */
function checkCommonDisableReason(
  status: DataRepoStatus | null,
  inFlightMode: SyncActionMode | null,
): string | null {
  if (inFlightMode !== null) {
    return `正在执行${ACTION_LABELS[inFlightMode]}，请稍候`;
  }
  if (status === null) {
    return "状态未加载";
  }
  if (status.deploy.readonly) {
    return "只读部署下不可执行同步操作";
  }
  if (!status.configured) {
    return "未配置数据仓";
  }
  if (status.repo === null || !status.repo.reachable) {
    return "数据仓不可达";
  }
  if (!status.repo.isGitRepo) {
    return "数据仓不是有效 Git 仓库";
  }
  return null;
}

/** 推导导出动作的可用性 */
function deriveExportState(
  status: DataRepoStatus,
  commonReason: string | null,
): ActionState {
  const mode: SyncActionMode = "export";
  const label = ACTION_LABELS[mode];
  if (commonReason !== null) {
    return { mode, label, enabled: false, disabledReason: commonReason, hint: null };
  }
  if (!status.repo!.clean) {
    return {
      mode,
      label,
      enabled: false,
      disabledReason: "工作区有未提交的改动，请先清理或提交",
      hint: null,
    };
  }
  const hint = status.local.pending.length === 0 ? "无新轮次" : null;
  return { mode, label, enabled: true, disabledReason: null, hint };
}

function checkPushDisableReason(status: DataRepoStatus, commonReason: string | null): string | null {
  if (commonReason !== null) return commonReason;
  if (
    status.pushCapability === "unavailable" ||
    (!status.pushCapability && status.deploy.externalRunner)
  ) {
    return "容器内无推送凭据，请在宿主机推送";
  }
  if (status.repo!.upstream === null) return "未配置上游分支，无法推送";
  if (!status.repo!.clean) return "工作区有未提交的改动，请先清理或提交";
  const ahead = status.repo!.ahead ?? 0;
  if (ahead <= 0 || status.repo!.aheadCommits.length === 0) {
    return "没有领先上游的提交，无需推送";
  }
  return null;
}

/** 推导推送动作的可用性 */
function derivePushState(
  status: DataRepoStatus,
  commonReason: string | null,
): ActionState {
  const mode: SyncActionMode = "push";
  const label = ACTION_LABELS[mode];
  const disabledReason = checkPushDisableReason(status, commonReason);
  return { mode, label, enabled: disabledReason === null, disabledReason, hint: null };
}

/** 推导四个动作各自的可用性与禁用原因 */
export function deriveActionStates(
  status: DataRepoStatus | null,
  inFlightMode: SyncActionMode | null = null,
): Record<SyncActionMode, ActionState> {
  const commonReason = checkCommonDisableReason(status, inFlightMode);

  const dryRunState: ActionState = {
    mode: "dry-run",
    label: ACTION_LABELS["dry-run"],
    enabled: commonReason === null,
    disabledReason: commonReason,
    hint: status && status.local.pending.length === 0 ? "无待同步轮次" : null,
  };

  const confirmState: ActionState = {
    mode: "confirm",
    label: ACTION_LABELS.confirm,
    enabled: commonReason === null && (status?.repo?.upstream !== null),
    disabledReason:
      commonReason ?? (status?.repo?.upstream === null ? "未配置上游分支，无法确认发布状态" : null),
    hint: null,
  };

  const safeStatus = status ?? createEmptyStatus();

  return {
    "dry-run": dryRunState,
    export: deriveExportState(safeStatus, commonReason),
    confirm: confirmState,
    push: derivePushState(safeStatus, commonReason),
  };
}

/** 空状态兜底，仅用于类型安全推导 */
function createEmptyStatus(): DataRepoStatus {
  return {
    configured: false,
    deploy: { readonly: false, externalRunner: false },
    repo: null,
    manifest: null,
    ledger: {
      exported: 0,
      published: 0,
      lastExportedAt: null,
      lastPublishedAt: null,
    },
    local: { totalRuns: 0, pending: [], incomplete: 0 },
    lastAction: null,
    notice: null,
    github: {
      state: "disconnected",
      login: null,
      appSlug: null,
      appSettingsUrl: null,
    },
    pushCapability: "unavailable",
  };
}

/** 推导推送二次确认对话框内容 */
export function derivePushConfirmation(
  status: DataRepoStatus | null,
): PushConfirmationModel {
  if (status === null || status.repo === null) {
    return {
      aheadCommits: [],
      pendingPublishCount: 0,
      canConfirm: false,
      disabledReason: "数据仓不可达",
    };
  }
  const aheadCommits = status.repo.aheadCommits ?? [];
  const pendingPublishCount = Math.max(
    0,
    status.ledger.exported - status.ledger.published,
  );
  if (status.deploy.externalRunner) {
    return {
      aheadCommits,
      pendingPublishCount,
      canConfirm: false,
      disabledReason: "容器内无推送凭据，请在宿主机推送",
    };
  }
  if (aheadCommits.length === 0) {
    return {
      aheadCommits,
      pendingPublishCount,
      canConfirm: false,
      disabledReason: "没有领先上游的提交，无需推送",
    };
  }
  return { aheadCommits, pendingPublishCount, canConfirm: true, disabledReason: null };
}

/** 推导动作结果摘要 */
export function deriveActionResultSummary(
  result: SyncActionResult | null,
): ActionResultSummary | null {
  if (result === null) return null;
  if (!result.ok || result.error !== null) {
    const error = result.error ?? "执行失败";
    return {
      text: `执行失败：${error}`,
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
  return formatSuccessSummary(result);
}

/** 格式化成功的动作结果 */
function formatSuccessSummary(result: SyncActionResult): ActionResultSummary {
  if (result.mode === "confirm") {
    const report = result.report as ConfirmPublishedReport | null;
    const publishedCount = report?.confirmed.length ?? 0;
    return {
      text: `已发布 ${publishedCount} 轮`,
      ok: true,
      mode: result.mode,
      exportedCount: 0,
      skippedCount: 0,
      rejectedCount: 0,
      redactedCount: 0,
      publishedCount,
      error: null,
    };
  }

  const report = result.report as SyncReport | null;
  const exportedCount = report?.exported.length ?? 0;
  const skippedCount = report?.skipped.length ?? 0;
  const rejectedCount = report?.rejected.length ?? 0;
  const redactedCount =
    report?.redactions.reduce(
      (acc, r) => acc + (r.redactions?.length ?? 1),
      0,
    ) ?? 0;
  const publishedCount = report?.ledgerTransitions?.published?.length ?? 0;

  const prefix = result.mode === "dry-run" ? "预演：" : "";
  const text = `${prefix}导出 ${exportedCount} 轮、跳过 ${skippedCount} 轮、拒绝 ${rejectedCount} 轮、脱敏 ${redactedCount} 处、已发布 ${publishedCount} 轮`;

  return {
    text,
    ok: true,
    mode: result.mode,
    exportedCount,
    skippedCount,
    rejectedCount,
    redactedCount,
    publishedCount,
    error: null,
  };
}

/** 从同步报告提取被拦截或跳过的轮次清单 */
export function extractReportIssues(
  report: SyncReport | ConfirmPublishedReport | null,
): {
  rejected: RejectedIssue[];
  skipped: SkippedIssue[];
} {
  if (!report || !("rejected" in report)) {
    return { rejected: [], skipped: [] };
  }
  const syncReport = report as SyncReport;
  const rejected: RejectedIssue[] = [];
  for (const item of syncReport.rejected ?? []) {
    for (const reason of item.reasons ?? []) {
      rejected.push({
        runId: item.runId,
        file: reason.file,
        reason: reason.reason,
      });
    }
  }
  const skipped: SkippedIssue[] = (syncReport.skipped ?? []).map((s) => ({
    runId: s.runId,
    reason: s.reason,
  }));
  return { rejected, skipped };
}

/** 推导各项指标计数的展示文案 */
export function deriveCountsSummary(
  status: DataRepoStatus | null,
): DataRepoCountsSummary {
  if (status === null) {
    return {
      localText: "未加载",
      ledgerText: "未加载",
      manifestText: "未加载",
      repoText: "未加载",
    };
  }
  const incompleteText =
    status.local.incomplete > 0 ? `，未完成 ${status.local.incomplete} 轮` : "";
  const localText = `总计 ${status.local.totalRuns} 轮，待导出 ${status.local.pending.length} 轮${incompleteText}`;
  const ledgerText = `已导出 ${status.ledger.exported} 轮，已发布 ${status.ledger.published} 轮`;
  const manifestText = status.manifest
    ? `总计 ${status.manifest.totalRuns} 轮，最近更新 ${status.manifest.latestDay ?? "无"}`
    : "暂无清单数据";
  const repo = status.repo;
  const repoText = repo
    ? `分支 ${repo.branch ?? "未知"}，上游 ${repo.upstream ?? "未配置"}，领先 ${repo.ahead ?? 0}，落后 ${repo.behind ?? 0}`
    : "无仓库信息";

  return { localText, ledgerText, manifestText, repoText };
}

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
  unpublishableText: string | null;
  rejectedText: string | null;
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
  // 中断的轮次由执行进程启动时收尾或保留策略清理，用户无法处理，面板不展示
  const running = status.local.running ?? 0;
  if (running > 0) {
    return { level: "healthy", label: "正常", reason: `${running} 轮正在执行，结束后自动导出` };
  }
  return { level: "healthy", label: "正常", reason: "数据仓状态健康" };
}

import { checkPushCapabilityReason } from "./data-repo-pipeline-model";

export {
  derivePipeline,
  type PipelineModel,
  type PipelineStep,
  type PipelineStage,
  type StepStatus,
  type PipelinePrimaryAction,
  type PipelineSecondaryAction,
} from "./data-repo-pipeline-model";


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
  // 台账里 exported 即"已导出、尚未发布"的轮次数
  const pendingPublishCount = status.ledger.exported;
  const capabilityReason = checkPushCapabilityReason(status);
  if (capabilityReason !== null) {
    return { aheadCommits, pendingPublishCount, canConfirm: false, disabledReason: capabilityReason };
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

const SKIP_REASON_LABELS: Record<string, string> = {
  idempotent: "已导出",
  "内容无变化": "已导出",
  "已导出": "已导出",
  incomplete: "未完成",
  "未完成": "未完成",
  "unpublishable-prompt": "不可发布",
  "不可发布": "不可发布",
  "invalid-run-id": "无效轮次",
  "无效轮次": "无效轮次",
  rejected: "被拒绝",
  "被拒绝": "被拒绝",
  abandoned: "已废弃",
  "已废弃": "已废弃",
  empty: "空轮次",
  "空轮次": "空轮次",
};

/** 确认发布与执行器推送的结果都是 ConfirmPublishedReport（带 confirmed 清单） */
function isConfirmReport(report: SyncActionResult["report"]): report is ConfirmPublishedReport {
  return report !== null && Array.isArray((report as ConfirmPublishedReport).confirmed);
}

/** 统计并格式化跳过原因明细 */
function formatSkippedBreakdown(
  skipped: Array<{ runId: string; reason: string }>,
): string {
  if (skipped.length === 0) return "跳过 0 轮";
  const counts = new Map<string, number>();
  for (const item of skipped) {
    const label = SKIP_REASON_LABELS[item.reason] ?? item.reason;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  const parts = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => `${label} ${count}`);
  return `跳过 ${skipped.length} 轮（${parts.join("、")}）`;
}

/** 结果摘要的公共骨架：只有文案与已发布数不同 */
function publishedSummary(
  result: SyncActionResult,
  text: string,
  publishedCount: number,
): ActionResultSummary {
  return {
    text,
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

/** 格式化确认发布结果摘要 */
function formatConfirmSummary(result: SyncActionResult): ActionResultSummary {
  const publishedCount = isConfirmReport(result.report) ? result.report.confirmed.length : 0;
  const text =
    publishedCount > 0
      ? `远端已包含 ${publishedCount} 轮，登记为已发布`
      : "远端尚未包含任何待确认轮次";
  return publishedSummary(result, text, publishedCount);
}

/** 格式化推送发布结果摘要：执行器推送返回确认清单，进程内推送返回同步报告 */
function formatPushSummary(result: SyncActionResult): ActionResultSummary {
  const publishedCount = isConfirmReport(result.report)
    ? result.report.confirmed.length
    : ((result.report as SyncReport | null)?.ledgerTransitions?.published?.length ?? 0);
  return publishedSummary(result, `已推送，${publishedCount} 轮登记为已发布`, publishedCount);
}

/** 格式化导出或预演结果摘要 */
function formatExportOrDryRunSummary(
  result: SyncActionResult,
): ActionResultSummary {
  const report = result.report as SyncReport | null;
  const exportedCount = report?.exported?.length ?? 0;
  const skipped = report?.skipped ?? [];
  const rejectedCount = report?.rejected?.length ?? 0;
  const redactedCount =
    report?.redactions?.reduce(
      (acc, r) => acc + (r.redactions?.length ?? 1),
      0,
    ) ?? 0;
  const publishedCount = report?.ledgerTransitions?.published?.length ?? 0;

  const prefix = result.mode === "dry-run" ? "预演：可导出 " : "导出 ";
  let text = `${prefix}${exportedCount} 轮；${formatSkippedBreakdown(skipped)}`;
  if (rejectedCount > 0) text += `；拒绝 ${rejectedCount} 轮`;
  if (redactedCount > 0) text += `；脱敏 ${redactedCount} 处`;
  if (publishedCount > 0) text += `；已发布 ${publishedCount} 轮`;

  return {
    text,
    ok: true,
    mode: result.mode,
    exportedCount,
    skippedCount: skipped.length,
    rejectedCount,
    redactedCount,
    publishedCount,
    error: null,
  };
}

/** 格式化成功的动作结果 */
function formatSuccessSummary(result: SyncActionResult): ActionResultSummary {
  if (result.mode === "confirm") return formatConfirmSummary(result);
  if (result.mode === "push") return formatPushSummary(result);
  return formatExportOrDryRunSummary(result);
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
      unpublishableText: null,
      rejectedText: null,
    };
  }
  const runningText = (status.local.running ?? 0) > 0 ? `，执行中 ${status.local.running} 轮` : "";
  const localText =
    `总计 ${status.local.totalRuns} 轮，待导出 ${status.local.pending.length} 轮${runningText}`;
  // 台账 exported 只计尚未发布的轮次
  const ledgerText = `待发布 ${status.ledger.exported} 轮，已发布 ${status.ledger.published} 轮`;
  const manifestText = status.manifest
    ? `总计 ${status.manifest.totalRuns} 轮，最近更新 ${status.manifest.latestDay ?? "无"}`
    : "暂无清单数据";
  const repo = status.repo;
  const repoText = repo
    ? `分支 ${repo.branch ?? "未知"}，上游 ${repo.upstream ?? "未配置"}，领先 ${repo.ahead ?? 0}，落后 ${repo.behind ?? 0}`
    : "无仓库信息";

  const byReason = status.ledger.skippedByReason;
  const unpublishableCount = byReason
    ? (byReason["unpublishable-prompt"] ?? 0) + (byReason.abandoned ?? 0) + (byReason.empty ?? 0)
    : Math.max(0, (status.ledger.skipped ?? 0) - (status.local.rejected?.length ?? 0));
  const rejectedCount = byReason
    ? (byReason.rejected ?? 0)
    : (status.local.rejected?.length ?? 0);
  const unpublishableText =
    unpublishableCount > 0 ? `不可发布 ${unpublishableCount} 轮` : null;
  const rejectedText =
    rejectedCount > 0 ? `被拒绝 ${rejectedCount} 轮（需人工处理）` : null;

  return {
    localText,
    ledgerText,
    manifestText,
    repoText,
    unpublishableText,
    rejectedText,
  };
}

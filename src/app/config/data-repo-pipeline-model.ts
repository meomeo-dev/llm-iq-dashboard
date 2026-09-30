/**
 * 数据仓发布流水线展示模型推导纯函数。
 *
 * 将 DataRepoStatus 归约为流水线视图模型：
 * 1. 三段步骤条：本地结果 -> 已导出（本地提交） -> 已发布（GitHub）；
 * 2. 单一主动作与说明文案；
 * 3. 推送不可用原因与链接；
 * 4. 次要动作（预演）。
 */

import type {
  DataRepoStatus,
  SyncActionMode,
} from "@/core/sync/data-repo-panel-types";

export type PipelineStage = "local" | "exported" | "published";

export type StepStatus = "completed" | "current" | "pending";

export interface PipelineStep {
  id: PipelineStage;
  label: string;
  countText: string;
  status: StepStatus;
}

export interface PipelinePrimaryAction {
  mode: "export" | "push" | "confirm";
  label: string;
  enabled: boolean;
  disabledReason: string | null;
  disabledLink?: string | null;
}

export interface PipelineSecondaryAction {
  mode: "dry-run";
  label: string;
  enabled: boolean;
  disabledReason: string | null;
}

export interface PipelineModel {
  steps: PipelineStep[];
  currentStage: PipelineStage | "all-published";
  description: string;
  staticNotice: string | null;
  primaryAction: PipelinePrimaryAction | null;
  secondaryAction: PipelineSecondaryAction;
}

type ActionKind = "export" | "push" | "confirm" | "none";

const ACTION_NAMES: Record<SyncActionMode, string> = {
  "dry-run": "预演",
  export: "导出提交",
  confirm: "确认发布",
  push: "推送发布",
  discard: "丢弃",
  restore: "恢复",
};

/** 检查所有动作通用的基础不可用原因 */
function checkCommonBlocker(
  status: DataRepoStatus | null,
  inFlightMode: SyncActionMode | null,
): string | null {
  if (inFlightMode !== null) {
    return `正在执行${ACTION_NAMES[inFlightMode]}，请稍候`;
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

/** 推送凭据是否可用：分容器部署下须已连接 GitHub（执行器上报 github-app 能力） */
export function checkPushCapabilityReason(status: DataRepoStatus): string | null {
  if (
    status.pushCapability === "unavailable" ||
    (!status.pushCapability && status.deploy.externalRunner)
  ) {
    return status.deploy.externalRunner
      ? "执行器未连接 GitHub，请先在上方连接后再推送"
      : "容器内无推送凭据，请在宿主机推送";
  }
  return null;
}

/** 检查推送专属的外部环境或凭据原因；分容器部署下附带指向 GitHub 卡片的链接 */
function checkPushEnvironmentBlocker(status: DataRepoStatus): {
  reason: string | null;
  link: string | null;
} {
  const capabilityReason = checkPushCapabilityReason(status);
  if (capabilityReason !== null) {
    return { reason: capabilityReason, link: status.deploy.externalRunner ? "#data-repo" : null };
  }
  if (status.repo!.upstream === null) {
    return { reason: "未配置上游分支，无法推送", link: null };
  }
  return { reason: null, link: null };
}

/** 推导推送动作的禁用原因与引导链接 */
function checkPushBlocker(
  status: DataRepoStatus,
  commonBlocker: string | null,
): { reason: string | null; link: string | null } {
  if (commonBlocker !== null) {
    return { reason: commonBlocker, link: null };
  }
  const repo = status.repo!;
  if (!repo.clean) {
    return { reason: "工作区有未提交的改动，请先清理或提交", link: null };
  }
  if (repo.behind !== null && repo.behind > 0) {
    return {
      reason: `落后上游分支 ${repo.behind} 个提交，建议先拉取同步`,
      link: null,
    };
  }
  return checkPushEnvironmentBlocker(status);
}

/** 主按钮文案：写入类动作执行中时一律显示"正在…"，预演执行中只禁用不改文案 */
function resolvePrimaryLabel(
  defaultLabel: string,
  inFlightMode: SyncActionMode | null,
): string {
  if (inFlightMode === null || inFlightMode === "dry-run") return defaultLabel;
  return `正在${ACTION_NAMES[inFlightMode]}…`;
}

/** 构造流水线三段步骤条数据 */
function buildPipelineSteps(
  status: DataRepoStatus | null,
  activeStage: PipelineStage | "all-published",
): PipelineStep[] {
  const pendingCount = status?.local.pending.length ?? 0;
  const aheadCount = status?.repo?.ahead ?? 0;
  const exportedCount = status?.ledger.exported ?? 0;
  const publishedCount = status?.ledger.published ?? 0;

  const pushExtra = exportedCount > 0 ? `（含 ${exportedCount} 轮）` : "";
  const pushCountText = `待推送 ${aheadCount} 个提交${pushExtra}`;

  const stepStatus = (stage: PipelineStage): StepStatus => {
    if (activeStage === "all-published") return "completed";
    if (stage === activeStage) return "current";
    if (activeStage === "published") return "completed";
    if (activeStage === "exported" && stage === "local") return "completed";
    return "pending";
  };

  return [
    {
      id: "local",
      label: "本地结果",
      countText: `待导出 ${pendingCount} 轮`,
      status: stepStatus("local"),
    },
    {
      id: "exported",
      label: "已导出（本地提交）",
      countText: pushCountText,
      status: stepStatus("exported"),
    },
    {
      id: "published",
      label: "已发布（GitHub）",
      countText: `已发布 ${publishedCount} 轮`,
      status: stepStatus("published"),
    },
  ];
}

/** 推导导出主按钮；selectedCount 为面板勾选的轮次数，null 表示没有勾选清单（全部） */
function buildExportAction(
  status: DataRepoStatus,
  commonBlocker: string | null,
  inFlight: SyncActionMode | null,
  selectedCount: number | null,
): PipelinePrimaryAction {
  const count = selectedCount ?? status.local.pending.length;
  const defaultLabel = `导出 ${count} 轮`;
  const label = resolvePrimaryLabel(defaultLabel, inFlight);
  const dirty = !status.repo?.clean;
  const reason =
    commonBlocker ??
    (dirty ? "工作区有未提交的改动，请先清理或提交" : null) ??
    (count === 0 ? "先在下方勾选要导出的轮次" : null);
  return {
    mode: "export",
    label,
    enabled: reason === null,
    disabledReason: reason,
  };
}

/** 推导推送主按钮 */
function buildPushAction(
  status: DataRepoStatus,
  commonBlocker: string | null,
  inFlight: SyncActionMode | null,
): PipelinePrimaryAction {
  const label = resolvePrimaryLabel("推送发布", inFlight);
  const { reason, link } = checkPushBlocker(status, commonBlocker);
  return {
    mode: "push",
    label,
    enabled: reason === null,
    disabledReason: reason,
    disabledLink: link,
  };
}

/** 推导确认发布主按钮 */
function buildConfirmAction(
  status: DataRepoStatus,
  commonBlocker: string | null,
  inFlight: SyncActionMode | null,
): PipelinePrimaryAction {
  const label = resolvePrimaryLabel("确认发布", inFlight);
  const noUpstream = status.repo?.upstream === null;
  const reason = commonBlocker ?? (noUpstream ? "未配置上游分支，无法确认发布状态" : null);
  return {
    mode: "confirm",
    label,
    enabled: reason === null,
    disabledReason: reason,
  };
}

/** 推导次要预演动作 */
function buildSecondaryAction(
  commonBlocker: string | null,
  inFlight: SyncActionMode | null,
): PipelineSecondaryAction {
  return {
    mode: "dry-run",
    label: inFlight === "dry-run" ? "正在预演…" : "预演（不写入）",
    enabled: commonBlocker === null,
    disabledReason: commonBlocker,
  };
}

/** 分析当前状态所处阶段与说明 */
function resolveStageInfo(status: DataRepoStatus): {
  stage: PipelineStage | "all-published";
  description: string;
  actionKind: ActionKind;
} {
  if (status.local.pending.length > 0) {
    return {
      stage: "local",
      description: `有 ${status.local.pending.length} 轮本地结果尚未导出到数据仓`,
      actionKind: "export",
    };
  }
  const ahead = status.repo?.ahead ?? 0;
  if (ahead > 0) {
    const kCount = status.ledger.exported;
    const kPart = kCount > 0 ? `（含 ${kCount} 轮）` : "";
    return {
      stage: "exported",
      description: `${ahead} 个本地提交等待推送到 GitHub${kPart}`,
      actionKind: "push",
    };
  }
  if (status.ledger.exported > 0) {
    return {
      stage: "published",
      description: `${status.ledger.exported} 轮已在远端，尚未登记为已发布`,
      actionKind: "confirm",
    };
  }
  return {
    stage: "all-published",
    description: `全部 ${status.ledger.published} 轮已发布，本地与远端一致`,
    actionKind: "none",
  };
}

/** 根据动作类型装配主动作对象 */
function resolvePrimaryAction(
  kind: ActionKind,
  status: DataRepoStatus,
  commonBlocker: string | null,
  inFlight: SyncActionMode | null,
  selectedCount: number | null,
): PipelinePrimaryAction | null {
  if (kind === "export") {
    return buildExportAction(status, commonBlocker, inFlight, selectedCount);
  }
  if (kind === "push") {
    return buildPushAction(status, commonBlocker, inFlight);
  }
  if (kind === "confirm") {
    return buildConfirmAction(status, commonBlocker, inFlight);
  }
  return null;
}

/** 分容器部署时说明导出与推送由谁触发；按配置的 autoSync 说，不假定 */
function describeAutoSync(status: DataRepoStatus | null): string | null {
  if (status?.deploy.externalRunner !== true) return null;
  // 旧状态快照没有 autoSync 字段，沿用原来的措辞
  return status.autoSync === false
    ? "轮次结束后不自动导出：在下方清单勾选后导出；推送需你在此确认。"
    : "轮次结束后自动导出；推送需你在此确认。";
}

/**
 * 推导数据仓发布流水线模型。
 */
export function derivePipeline(
  status: DataRepoStatus | null,
  inFlightMode: SyncActionMode | null = null,
  selectedCount: number | null = null,
): PipelineModel {
  const commonBlocker = checkCommonBlocker(status, inFlightMode);
  const secondaryAction = buildSecondaryAction(commonBlocker, inFlightMode);
  const staticNotice = describeAutoSync(status);

  if (status === null) {
    return {
      steps: buildPipelineSteps(null, "local"),
      currentStage: "local",
      description: "状态未加载",
      staticNotice,
      primaryAction: null,
      secondaryAction,
    };
  }

  const { stage, description, actionKind } = resolveStageInfo(status);
  const primaryAction = resolvePrimaryAction(
    actionKind,
    status,
    commonBlocker,
    inFlightMode,
    selectedCount,
  );

  return {
    steps: buildPipelineSteps(status, stage),
    currentStage: stage,
    description,
    staticNotice,
    primaryAction,
    secondaryAction,
  };
}

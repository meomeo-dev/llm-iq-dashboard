/**
 * 数据仓同步编排器（sync-orchestrator）。
 *
 * 协调：
 * 1. 发现并过滤待同步轮次；
 * 2. 导出、脱敏、幂等与冲突检查；
 * 3. 写入数据仓目录、更新日索引与顶层清单；
 * 4. 提交 Git 与可选的推送及祖先校验；
 * 5. 原子维护本地同步台账（sync-state.json）。
 */

import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import {
  dayPartition,
  runDirPath,
  type Redaction,
} from "../data-repo/contract";
import type { ProfileConfig } from "../config/profiles";
import type { LeakGuard } from "../leak-guard";
import {
  assertGitUserConfigured,
  assertRepoClean,
  commitSync,
  fetchAndFastForward,
  getDirectoryLatestCommit,
  getUpstream,
  isCommitInUpstream,
  pushCurrentBranch,
} from "./data-repo-git";
import {
  exportRun,
  type ExportOptions,
  type ReadyExportResult,
} from "./export-run";
import { isContentIdentical } from "./sync-content-check";
import { updateRepoIndices, writeAllExportedRuns } from "./sync-writer";
import {
  loadSyncLedger,
  saveSyncLedger,
  type SyncLedger,
} from "./sync-ledger";
import {
  recordSkippedRejected,
  recordSkippedPlain,
} from "./ledger-skip";
export {
  confirmPublished,
  type ConfirmPublishedOptions,
  type ConfirmPublishedReport,
} from "./confirm-published";
import { effectiveSelection, isDiscarded } from "./ledger-decisions";
import { exportOptionsFor, resolveSyncContext, type SyncContext } from "./sync-scope";
export { syncOptionsFromConfig, type SyncScope } from "./sync-scope";

export interface SyncOptions {
  repoPath: string;
  dataDir?: string;
  runIds?: readonly string[];
  dryRun?: boolean;
  push?: boolean;
  leakGuard?: LeakGuard;
  /**
   * 配置里登记的 profile：其公开视图随记录发布，其 key 文件纳入泄漏指纹。
   * 缺省为空——所有 profile 调用都扣下，指纹只含三家 CLI 的登录凭据
   */
  profiles?: readonly ProfileConfig[];
  /** 允许发布的题目 id；缺省或 null 为全部 */
  publishPrompts?: readonly string[] | null;
  /** 按轮次的导出子集（attemptKey）；只对尚未导出的轮次生效，已导出的沿用台账，见 effectiveSelection */
  attemptSelection?: Readonly<Record<string, readonly string[]>>;
  log?: (message: string) => void;
}


export interface RunRedactionGroup {
  runId: string;
  redactions: Redaction[];
}

export interface LedgerTransitions {
  exported: string[];
  published: string[];
}

export interface SyncReport {
  success: boolean;
  dryRun: boolean;
  totalCandidates: number;
  exported: string[];
  skipped: Array<{ runId: string; reason: string }>;
  conflicts: string[];
  rejected: Array<{
    runId: string;
    reasons: Array<{ file: string; reason: string }>;
  }>;
  redactions: RunRedactionGroup[];
  ledgerTransitions: LedgerTransitions;
  commit: string | null;
  pushed: boolean;
  error?: string;
}

/** 预检仓库状态与上游配置 */
async function preparePreflight(
  repoPath: string,
  dryRun: boolean,
  push: boolean,
): Promise<void> {
  if (dryRun) return;
  await assertRepoClean(repoPath);
  await assertGitUserConfigured(repoPath);
  if (push) {
    await fetchAndFastForward(repoPath);
  }
}

/** 收集待检查的候选轮次 ID 列表 */
async function collectCandidateIds(
  options: SyncOptions,
  runsDir: string,
): Promise<string[]> {
  if (options.runIds && options.runIds.length > 0) {
    return [...options.runIds];
  }
  try {
    const entries = await readdir(runsDir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory() && dayPartition(e.name) !== null)
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
}

/** 补记数据仓已有目录的轮次到台账（status: exported） */
async function backfillIdempotentLedger(
  repoPath: string,
  runId: string,
  relativeRunDir: string,
  res: ReadyExportResult,
  ledger: SyncLedger,
  newlyExported: string[],
): Promise<void> {
  const existing = ledger[runId];
  if (existing?.status === "exported" || existing?.status === "published") {
    return;
  }

  const dirCommit = await getDirectoryLatestCommit(repoPath, relativeRunDir);
  ledger[runId] = {
    status: "exported",
    exportedAt: new Date().toISOString(),
    ...(dirCommit !== null ? { commit: dirCommit } : {}),
    redactions: res.redactions,
    ...(res.attemptKeys !== undefined ? { attempts: res.attemptKeys } : {}),
  };
  newlyExported.push(runId);
}

/** 处理已有目录的幂等与冲突检查 */
async function checkExistingTargetDir(
  repoPath: string,
  runId: string,
  relativeRunDir: string,
  res: ReadyExportResult,
  dryRun: boolean,
  ledger: SyncLedger,
  newlyExportedRunIds: string[],
  report: SyncReport,
): Promise<void> {
  const targetDir = join(repoPath, relativeRunDir);
  const identical = await isContentIdentical(targetDir, res);
  if (identical) {
    report.skipped.push({ runId, reason: "idempotent" });
    if (!dryRun) {
      await backfillIdempotentLedger(
        repoPath,
        runId,
        relativeRunDir,
        res,
        ledger,
        newlyExportedRunIds,
      );
    }
  } else {
    report.conflicts.push(runId);
  }
}

/** 评估单个候选轮次：导出、脱敏、幂等与冲突判定 */
async function evaluateSingleCandidate(
  runId: string,
  repoPath: string,
  exportOpts: ExportOptions,
  dryRun: boolean,
  ledger: SyncLedger,
  newlyExportedRunIds: string[],
  newlySkippedRunIds: string[],
  report: SyncReport,
): Promise<{ ready?: ReadyExportResult; redactions?: Redaction[] }> {
  const res = await exportRun(runId, exportOpts);
  if (res.status === "skipped") {
    report.skipped.push({ runId, reason: res.reason });
    // 不可发布题目与空轮次都记入台账，否则会一直算作待导出
    if (!dryRun && (res.reason === "unpublishable-prompt" || res.reason === "empty")) {
      if (recordSkippedPlain(ledger, runId, res.reason)) {
        newlySkippedRunIds.push(runId);
      }
    }
    return {};
  }
  if (res.status === "rejected") {
    report.rejected.push({ runId, reasons: res.reasons });
    if (!dryRun) {
      if (recordSkippedRejected(ledger, runId, res.reasons)) {
        newlySkippedRunIds.push(runId);
      }
    }
    return {};
  }
  const relativeRunDir = runDirPath(runId);
  if (relativeRunDir === null) {
    report.skipped.push({ runId, reason: "invalid-run-id" });
    return {};
  }
  if (existsSync(join(repoPath, relativeRunDir))) {
    await checkExistingTargetDir(
      repoPath,
      runId,
      relativeRunDir,
      res,
      dryRun,
      ledger,
      newlyExportedRunIds,
      report,
    );
    return { redactions: res.redactions };
  }
  return { ready: res, redactions: res.redactions };
}

/** 逐轮评估候选轮次：收集准备导出的轮次与全部脱敏记录 */
async function evaluateCandidates(
  candidateIds: readonly string[],
  repoPath: string,
  exportOpts: ExportOptions,
  dryRun: boolean,
  ledger: SyncLedger,
  newlyExportedRunIds: string[],
  newlySkippedRunIds: string[],
  report: SyncReport,
): Promise<{ readyToExport: ReadyExportResult[]; allRedactions: RunRedactionGroup[] }> {
  const readyToExport: ReadyExportResult[] = [];
  const allRedactions: RunRedactionGroup[] = [];

  for (const runId of candidateIds) {
    const outcome = await evaluateSingleCandidate(
      runId,
      repoPath,
      exportOpts,
      dryRun,
      ledger,
      newlyExportedRunIds,
      newlySkippedRunIds,
      report,
    );
    if (outcome.redactions && outcome.redactions.length > 0) {
      allRedactions.push({ runId, redactions: outcome.redactions });
    }
    if (outcome.ready) {
      readyToExport.push(outcome.ready);
    }
  }

  return { readyToExport, allRedactions };
}

/** 推送当前分支并检验祖先关系，将已上游包含的 exported 轮次标为 published */
async function publishContainedRuns(
  repoPath: string,
  ledger: SyncLedger,
  dataDirPath: string,
  newlyPublished: string[],
): Promise<void> {
  await pushCurrentBranch(repoPath);
  const upstream = await getUpstream(repoPath);
  const publishedAt = new Date().toISOString();

  for (const [runId, entry] of Object.entries(ledger)) {
    if (entry.status === "exported" && entry.commit) {
      const contained = await isCommitInUpstream(
        repoPath,
        entry.commit,
        upstream ?? undefined,
      );
      if (contained) {
        entry.status = "published";
        entry.publishedAt = publishedAt;
        newlyPublished.push(runId);
      }
    }
  }

  if (newlyPublished.length > 0) {
    await saveSyncLedger(ledger, dataDirPath);
  }
}

/** 提交 Git 并将新导出的轮次记录到本地台账，同时持久化新增 exported 记录 */
async function commitAndRecordExported(
  repoPath: string,
  readyToExport: readonly ReadyExportResult[],
  ledger: SyncLedger,
  dataDirPath: string,
  newlyExportedRunIds: string[],
): Promise<string | null> {
  let commitSha: string | null = null;
  if (readyToExport.length > 0) {
    commitSha = await commitSync(
      repoPath,
      readyToExport.map((r) => r.runId),
    );
    const nowIso = new Date().toISOString();
    for (const item of readyToExport) {
      ledger[item.runId] = {
        status: "exported",
        exportedAt: nowIso,
        ...(commitSha !== null ? { commit: commitSha } : {}),
        redactions: item.redactions,
        ...(item.attemptKeys !== undefined ? { attempts: item.attemptKeys } : {}),
      };
      newlyExportedRunIds.push(item.runId);
    }
  }

  if (newlyExportedRunIds.length > 0) {
    await saveSyncLedger(ledger, dataDirPath);
  }
  return commitSha;
}

/**
 * 执行数据仓同步流水线。
 */
function createInitialReport(dryRun: boolean): SyncReport {
  return {
    success: true,
    dryRun,
    totalCandidates: 0,
    exported: [],
    skipped: [],
    conflicts: [],
    rejected: [],
    redactions: [],
    ledgerTransitions: { exported: [], published: [] },
    commit: null,
    pushed: false,
  };
}

/** 执行推送流程并更新报告与台账 */
async function executePushStep(
  repoPath: string,
  ledger: SyncLedger,
  dataDirPath: string,
  newlyPublishedRunIds: string[],
  report: SyncReport,
): Promise<void> {
  try {
    await publishContainedRuns(repoPath, ledger, dataDirPath, newlyPublishedRunIds);
    report.pushed = true;
  } catch (pushError) {
    report.success = false;
    report.error = pushError instanceof Error ? pushError.message : String(pushError);
    throw pushError;
  }
}

/** 持久化导出产物、更新索引并完成提交记账 */
async function persistExportedData(
  repoPath: string,
  readyToExport: readonly ReadyExportResult[],
  ledger: SyncLedger,
  dataDirPath: string,
  newlyExportedRunIds: string[],
): Promise<{ exportedRunIds: string[]; commitSha: string | null }> {
  const { exportedRunIds, affectedDates } = await writeAllExportedRuns(
    repoPath,
    readyToExport,
  );
  await updateRepoIndices(repoPath, affectedDates);
  const commitSha = await commitAndRecordExported(
    repoPath,
    readyToExport,
    ledger,
    dataDirPath,
    newlyExportedRunIds,
  );
  return { exportedRunIds, commitSha };
}


/** 持久化产物、更新台账并在必要时执行推送 */
async function finalizeSyncData(
  ctx: SyncContext,
  readyToExport: readonly ReadyExportResult[],
  ledger: SyncLedger,
  newlyExportedRunIds: string[],
  newlySkippedRunIds: string[],
  newlyPublishedRunIds: string[],
  report: SyncReport,
): Promise<void> {
  const { exportedRunIds, commitSha } = await persistExportedData(
    ctx.repoPath,
    readyToExport,
    ledger,
    ctx.dataDirPath,
    newlyExportedRunIds,
  );
  report.exported = exportedRunIds;
  report.commit = commitSha;

  if (newlySkippedRunIds.length > 0 && newlyExportedRunIds.length === 0) {
    await saveSyncLedger(ledger, ctx.dataDirPath);
  }

  if (ctx.push) {
    await executePushStep(ctx.repoPath, ledger, ctx.dataDirPath, newlyPublishedRunIds, report);
  }
}

/**
 * 执行数据仓同步流水线。
 */
export async function syncDataRepo(options: SyncOptions): Promise<SyncReport> {
  const ctx = await resolveSyncContext(options);
  const report = createInitialReport(ctx.dryRun);
  await preparePreflight(ctx.repoPath, ctx.dryRun, ctx.push);
  const ledger: SyncLedger = await loadSyncLedger(ctx.dataDirPath);
  // 丢弃的轮次任何同步都不导出，包括显式点名；要导出先在面板恢复
  const candidateIds = (await collectCandidateIds(options, ctx.runsDir)).filter((id) => !isDiscarded(ledger[id]));
  report.totalCandidates = candidateIds.length;

  const newlyExportedRunIds: string[] = [];
  const newlySkippedRunIds: string[] = [];
  const newlyPublishedRunIds: string[] = [];
  const exportOpts = {
    ...exportOptionsFor(ctx, options),
    attemptSelection: effectiveSelection(ledger, options.attemptSelection, candidateIds),
  };

  const { readyToExport, allRedactions } = await evaluateCandidates(
    candidateIds,
    ctx.repoPath,
    exportOpts,
    ctx.dryRun,
    ledger,
    newlyExportedRunIds,
    newlySkippedRunIds,
    report,
  );
  report.redactions = allRedactions;

  if (ctx.dryRun) {
    report.exported = readyToExport.map((r) => r.runId);
    return report;
  }

  await finalizeSyncData(
    ctx,
    readyToExport,
    ledger,
    newlyExportedRunIds,
    newlySkippedRunIds,
    newlyPublishedRunIds,
    report,
  );

  report.ledgerTransitions = {
    exported: newlyExportedRunIds,
    published: newlyPublishedRunIds,
  };
  return report;
}


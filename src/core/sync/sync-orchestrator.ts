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
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  dayPartition,
  runDirPath,
  type Redaction,
  type RunSummary,
} from "../data-repo/contract";
import { buildLeakGuard, type LeakGuard } from "../leak-guard";
import { dataRoot } from "../paths";
import {
  assertRepoClean,
  commitSync,
  fetchAndFastForward,
  getDirectoryLatestCommit,
  getUpstream,
  isCommitInUpstream,
  pushCurrentBranch,
} from "./data-repo-git";
import {
  buildRunSummary,
  updateDayIndex,
  updateManifest,
} from "./data-repo-index";
import {
  exportRun,
  type ExportOptions,
  type ReadyExportResult,
} from "./export-run";
import {
  loadSyncLedger,
  saveSyncLedger,
  type SyncLedger,
} from "./sync-ledger";

export interface SyncOptions {
  repoPath: string;
  dataDir?: string;
  runIds?: readonly string[];
  dryRun?: boolean;
  push?: boolean;
  leakGuard?: LeakGuard;
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

/** 比较目标目录已有产物是否与本次导出完全一致 */
async function isContentIdentical(
  targetDir: string,
  exported: ReadyExportResult,
): Promise<boolean> {
  const targetRunJson = join(targetDir, "run.json");
  if (!existsSync(targetRunJson)) return false;

  try {
    const existingJson = await readFile(targetRunJson, "utf8");
    if (existingJson.trim() !== exported.jsonText.trim()) {
      return false;
    }

    const entries = await readdir(targetDir);
    const existingSvgs = new Set(
      entries.filter((name) => name.endsWith(".svg")),
    );
    const newSvgs = new Set(exported.svgFiles.map((s) => s.filename));

    if (existingSvgs.size !== newSvgs.size) return false;
    for (const name of newSvgs) {
      if (!existingSvgs.has(name)) return false;
      const existingSvgContent = await readFile(join(targetDir, name), "utf8");
      const newSvgItem = exported.svgFiles.find((s) => s.filename === name);
      if (existingSvgContent !== newSvgItem?.content) return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * 补记数据仓已有目录的轮次到台账（status: exported）。
 */
async function backfillIdempotentLedger(
  repoPath: string,
  runId: string,
  relativeRunDir: string,
  redactions: Redaction[],
  ledger: SyncLedger,
  newlyExported: string[],
): Promise<void> {
  if (ledger[runId] !== undefined) return;

  const dirCommit = await getDirectoryLatestCommit(repoPath, relativeRunDir);
  ledger[runId] = {
    status: "exported",
    exportedAt: new Date().toISOString(),
    ...(dirCommit !== null ? { commit: dirCommit } : {}),
    redactions,
  };
  newlyExported.push(runId);
}

/**
 * 推送当前分支并检验祖先关系，将已上游包含的 exported 轮次标为 published。
 */
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

/**
 * 执行数据仓同步流水线。
 */
export async function syncDataRepo(options: SyncOptions): Promise<SyncReport> {
  const dryRun = options.dryRun === true;
  const push = options.push === true;
  const repoPath = options.repoPath;
  const dataDirPath = options.dataDir ?? dataRoot();
  const runsDir = join(dataDirPath, "runs");
  const leakGuard = options.leakGuard ?? (await buildLeakGuard());

  const report: SyncReport = {
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

  if (!dryRun) {
    await assertRepoClean(repoPath);
    if (push) {
      await fetchAndFastForward(repoPath);
    }
  }

  // 1. 收集候选 runId
  let candidateIds: string[] = [];
  if (options.runIds && options.runIds.length > 0) {
    candidateIds = [...options.runIds];
  } else {
    try {
      const entries = await readdir(runsDir, { withFileTypes: true });
      candidateIds = entries
        .filter((e) => e.isDirectory() && dayPartition(e.name) !== null)
        .map((e) => e.name)
        .sort();
    } catch {
      candidateIds = [];
    }
  }

  report.totalCandidates = candidateIds.length;

  const readyToExport: ReadyExportResult[] = [];
  const exportOpts: ExportOptions = { runsDir, leakGuard };
  const ledger: SyncLedger = await loadSyncLedger(dataDirPath);
  const newlyExportedRunIds: string[] = [];
  const newlyPublishedRunIds: string[] = [];
  const allRedactions: RunRedactionGroup[] = [];

  // 2. 逐轮处理与脱敏
  for (const runId of candidateIds) {
    const res = await exportRun(runId, exportOpts);
    if (res.status === "skipped") {
      report.skipped.push({ runId, reason: res.reason });
      continue;
    }
    if (res.status === "rejected") {
      report.rejected.push({ runId, reasons: res.reasons });
      continue;
    }

    if (res.redactions.length > 0) {
      allRedactions.push({ runId, redactions: res.redactions });
    }

    const relativeRunDir = runDirPath(runId);
    if (relativeRunDir === null) {
      report.skipped.push({ runId, reason: "invalid-run-id" });
      continue;
    }

    const targetDir = join(repoPath, relativeRunDir);
    if (existsSync(targetDir)) {
      const identical = await isContentIdentical(targetDir, res);
      if (identical) {
        report.skipped.push({ runId, reason: "idempotent" });
        if (!dryRun) {
          await backfillIdempotentLedger(
            repoPath,
            runId,
            relativeRunDir,
            res.redactions,
            ledger,
            newlyExportedRunIds,
          );
        }
      } else {
        report.conflicts.push(runId);
      }
      continue;
    }

    readyToExport.push(res);
  }

  report.redactions = allRedactions;

  if (dryRun) {
    report.exported = readyToExport.map((r) => r.runId);
    return report;
  }

  // 3. 写入数据仓
  const affectedDates = new Map<string, RunSummary[]>();

  for (const item of readyToExport) {
    const partition = dayPartition(item.runId);
    if (partition === null) continue;

    const targetDir = join(repoPath, partition.path, item.runId);
    await mkdir(targetDir, { recursive: true });

    await writeFile(join(targetDir, "run.json"), item.jsonText, "utf8");

    for (const svg of item.svgFiles) {
      await writeFile(join(targetDir, svg.filename), svg.content, "utf8");
    }

    const summary = buildRunSummary(item.publicRecord);
    const dateSummaries = affectedDates.get(partition.date) ?? [];
    dateSummaries.push(summary);
    affectedDates.set(partition.date, dateSummaries);

    report.exported.push(item.runId);
  }

  // 4. 更新日索引与清单
  for (const [date, summaries] of affectedDates.entries()) {
    await updateDayIndex(repoPath, date, summaries);
  }
  if (affectedDates.size > 0) {
    await updateManifest(repoPath);
  }

  // 5. Git 提交
  let commitSha: string | null = null;
  if (report.exported.length > 0) {
    commitSha = await commitSync(repoPath, report.exported);
    report.commit = commitSha;
  }

  // 6. 更新同步台账（exported 状态）
  const nowIso = new Date().toISOString();
  for (const item of readyToExport) {
    ledger[item.runId] = {
      status: "exported",
      exportedAt: nowIso,
      ...(commitSha !== null ? { commit: commitSha } : {}),
      redactions: item.redactions,
    };
    newlyExportedRunIds.push(item.runId);
  }

  if (newlyExportedRunIds.length > 0) {
    await saveSyncLedger(ledger, dataDirPath);
  }

  // 7. 若要求推送，执行 push 并将已上游包含的轮次标记为 published
  if (push) {
    try {
      await publishContainedRuns(
        repoPath,
        ledger,
        dataDirPath,
        newlyPublishedRunIds,
      );
      report.pushed = true;
    } catch (pushError) {
      report.success = false;
      report.error =
        pushError instanceof Error ? pushError.message : String(pushError);
      throw pushError;
    }
  }

  report.ledgerTransitions = {
    exported: newlyExportedRunIds,
    published: newlyPublishedRunIds,
  };

  return report;
}

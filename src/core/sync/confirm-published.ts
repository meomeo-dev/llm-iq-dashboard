/**
 * 数据仓发布确认（confirm-published）。
 *
 * 机制：
 * 1. 检查数据仓上游追踪分支，若无上游则报错中止且台账不变；
 * 2. 执行 git fetch（带超时，公开仓库支持匿名 https）；若失败报错中止且台账不变；
 * 3. 扫描本地台账（sync-state.json）中 status 为 exported 且包含 commit 的轮次；
 * 4. 沿用 merge-base --is-ancestor 判定该 commit 是否已被上游分支包含；
 * 5. dry-run 下只报告将被确认的轮次，不写台账；
 * 6. 实际模式下将已包含的轮次标为 status: "published"，记录 publishedAt 并落盘。
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { dataRoot } from "../paths";
import {
  getUpstream,
  gitExec,
  isCommitInUpstream,
} from "./data-repo-git";
import {
  loadSyncLedger,
  saveSyncLedger,
  type SyncLedger,
} from "./sync-ledger";

export interface ConfirmPublishedOptions {
  repoPath: string;
  dataDir?: string;
  runIds?: readonly string[];
  dryRun?: boolean;
  log?: (message: string) => void;
}

export interface ConfirmPublishedReport {
  success: boolean;
  dryRun: boolean;
  upstream: string | null;
  confirmed: string[];
  ledgerTransitions: {
    published: string[];
  };
  error?: string;
}

/** 校验仓库与上游配置，并执行 git fetch 同步最新远端引用 */
async function prepareUpstream(repoPath: string): Promise<string> {
  if (!existsSync(repoPath) || !existsSync(join(repoPath, ".git"))) {
    throw new Error(`数据仓目录不存在或不是 Git 仓库：${repoPath}`);
  }

  const upstream = await getUpstream(repoPath);
  if (upstream === null) {
    throw new Error("数据仓未配置上游追踪分支 (upstream)，无法执行发布确认");
  }

  try {
    await gitExec(repoPath, ["fetch"]);
  } catch (fetchError) {
    const msg =
      fetchError instanceof Error ? fetchError.message : String(fetchError);
    throw new Error(`数据仓 fetch 失败：${msg}`);
  }

  return upstream;
}

/** 筛选台账中已被上游追踪分支包含的 exported 轮次 */
async function findContainedRuns(
  repoPath: string,
  ledger: SyncLedger,
  upstream: string,
  runIds?: readonly string[],
): Promise<string[]> {
  const confirmed: string[] = [];
  const filterSet = runIds && runIds.length > 0 ? new Set(runIds) : null;

  for (const [runId, entry] of Object.entries(ledger)) {
    if (filterSet && !filterSet.has(runId)) {
      continue;
    }
    if (entry.status === "exported" && entry.commit) {
      const contained = await isCommitInUpstream(
        repoPath,
        entry.commit,
        upstream,
      );
      if (contained) {
        confirmed.push(runId);
      }
    }
  }

  return confirmed;
}

/** 将已确认的轮次在本地台账中更新为 published 状态并保存 */
async function markPublishedInLedger(
  ledger: SyncLedger,
  confirmed: readonly string[],
  dataDirPath: string,
): Promise<void> {
  const publishedAt = new Date().toISOString();
  for (const runId of confirmed) {
    const entry = ledger[runId];
    if (entry) {
      entry.status = "published";
      entry.publishedAt = publishedAt;
    }
  }
  await saveSyncLedger(ledger, dataDirPath);
}

export async function confirmPublished(
  options: ConfirmPublishedOptions,
): Promise<ConfirmPublishedReport> {
  const dryRun = options.dryRun === true;
  const repoPath = options.repoPath;
  const dataDirPath = options.dataDir ?? dataRoot();

  const upstream = await prepareUpstream(repoPath);
  const ledger = await loadSyncLedger(dataDirPath);
  const confirmed = await findContainedRuns(
    repoPath,
    ledger,
    upstream,
    options.runIds,
  );

  if (!dryRun && confirmed.length > 0) {
    await markPublishedInLedger(ledger, confirmed, dataDirPath);
  }

  return {
    success: true,
    dryRun,
    upstream,
    confirmed,
    ledgerTransitions: {
      published: confirmed,
    },
  };
}


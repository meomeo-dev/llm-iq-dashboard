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
import { buildPushEnv, readGithubConnection } from "../github-auth";
import { dataRoot } from "../paths";
import { acquireDataRepoSyncLock } from "./data-repo-action-lock";
import { prepareCheckout } from "./sync-scope";
import {
  assertRepoClean,
  getAheadCommits,
  getPushTarget,
  getUpstream,
  gitExec,
  isCommitInUpstream,
  pushCurrentBranch,
  verifyUpstreamContains,
} from "./data-repo-git";
import {
  loadSyncLedger,
  saveSyncLedger,
  type SyncLedger,
} from "./sync-ledger";

export interface ConfirmPublishedOptions {
  repoPath: string;
  repository?: string | null;
  dataDir?: string;
  runIds?: readonly string[];
  dryRun?: boolean;
  skipLock?: boolean;
  log?: (message: string) => void;
}

export interface PushConfirmedOptions {
  repoPath: string;
  repository?: string | null;
  dataDir?: string;
  confirmedAheadCommits?: readonly string[];
  skipLock?: boolean;
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
  const lock = options.skipLock ? null : await acquireDataRepoSyncLock(dataDirPath);
  if (lock !== null && !lock.acquired) {
    throw new Error(lock.reason ?? "已有一个数据仓动作正在执行");
  }

  try {
    await prepareCheckout({
      repoPath,
      repository: options.repository ?? null,
      log: options.log,
    });
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
  } finally {
    await lock?.release();
  }
}

async function executeConfirmedPush(
  repoPath: string,
  confirmedAheadCommits?: readonly string[],
): Promise<void> {
  await assertRepoClean(repoPath);
  const currentAhead = await getAheadCommits(repoPath);
  if (confirmedAheadCommits !== undefined) {
    const matched =
      currentAhead.length === confirmedAheadCommits.length &&
      currentAhead.every((sha, idx) => sha === confirmedAheadCommits[idx]);
    if (!matched) {
      throw new Error("待推送提交清单已发生变化，请刷新面板后重新确认");
    }
  }
  if (currentAhead.length === 0) {
    throw new Error("没有待推送的本地提交，请先执行导出后再推送");
  }

  const conn = await readGithubConnection();
  const target = conn.state === "connected" ? await getPushTarget(repoPath) : undefined;
  const pushEnv = target ? await buildPushEnv(target.pushUrl) : undefined;
  await pushCurrentBranch(repoPath, pushEnv, target);

  const latestSha = currentAhead[0]!;
  const contained = await verifyUpstreamContains(repoPath, latestSha, target?.upstreamBranch, pushEnv);
  if (!contained) {
    throw new Error(`推送后远程分支未包含提交 (${latestSha})，推送校验失败`);
  }
}

/**
 * 仅将已确认的本地领先提交推送到上游并执行发布确认，绝不在此步骤顺带导出或创建新提交。
 */
export async function pushConfirmedCommits(
  options: PushConfirmedOptions,
): Promise<ConfirmPublishedReport> {
  const repoPath = options.repoPath;
  const dataDirPath = options.dataDir ?? dataRoot();
  const lock = options.skipLock ? null : await acquireDataRepoSyncLock(dataDirPath);
  if (lock !== null && !lock.acquired) {
    throw new Error(lock.reason ?? "已有一个数据仓动作正在执行");
  }

  try {
    await prepareCheckout({ repoPath, repository: options.repository ?? null });
    await executeConfirmedPush(repoPath, options.confirmedAheadCommits);
    return await confirmPublished({
      repoPath,
      repository: options.repository,
      dataDir: dataDirPath,
      dryRun: false,
      skipLock: true,
    });
  } finally {
    await lock?.release();
  }
}


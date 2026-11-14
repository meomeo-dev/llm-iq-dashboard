/**
 * 面板同步动作的分发：看板进程就地执行与执行器代为执行共用这一份。
 * 丢弃与恢复只改本地台账；其余动作走同步流水线，按请求里的轮次与调用子集限定范围。
 */

import type { AppConfig } from "../config";
import {
  confirmPublished,
  pushConfirmedCommits,
  type ConfirmPublishedReport,
} from "./confirm-published";
import type { SyncActionRequest } from "./data-repo-panel-types";
import { discardRuns, restoreRuns, type LedgerDecisionReport } from "./ledger-decisions";
import { syncDataRepo, type SyncReport } from "./sync-orchestrator";
import { syncOptionsFromConfig } from "./sync-scope";

export type SyncActionReport = SyncReport | ConfirmPublishedReport | LedgerDecisionReport;

export async function performSyncAction(
  action: SyncActionRequest,
  config: AppConfig,
  dataDir?: string,
  options?: { skipLock?: boolean },
): Promise<SyncActionReport> {
  const { mode, runIds = [] } = action;
  if (mode === "discard") return discardRuns(runIds, dataDir);
  if (mode === "restore") return restoreRuns(runIds, dataDir);
  const scope = {
    ...syncOptionsFromConfig(config),
    dataDir,
    runIds: action.runIds,
    attemptSelection: action.attempts,
    skipLock: options?.skipLock,
  };
  if (mode === "dry-run") return syncDataRepo({ ...scope, dryRun: true });
  if (mode === "export") return syncDataRepo({ ...scope, dryRun: false, push: false });
  if (mode === "confirm") {
    return confirmPublished({
      repoPath: scope.repoPath,
      repository: scope.repository,
      dataDir,
      dryRun: false,
      skipLock: options?.skipLock,
    });
  }
  return pushConfirmedCommits({
    repoPath: scope.repoPath,
    repository: scope.repository,
    dataDir,
    confirmedAheadCommits: action.confirmation?.aheadCommits,
    skipLock: options?.skipLock,
  });
}

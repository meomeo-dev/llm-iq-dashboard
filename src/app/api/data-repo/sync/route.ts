/**
 * POST /api/data-repo/sync：所有者触发数据仓同步动作（演练、导出、发布确认、推送）。
 *
 * 需所有者写操作权限（x-pelican-action: 1）；只读部署 403；未配置 409；非法请求体 400；
 * 动作并发 409；externalRunner 下 push 409；push 确认提交不一致 409。
 */

import { NextResponse } from "next/server";
import { audit } from "@/core/auth/audit";
import { clientIp, requireOwnerAction } from "@/core/auth/guard";
import { loadConfig, type AppConfig } from "@/core/config";
import { configPath } from "@/core/paths";
import {
  enqueueRequest,
  requestRunnerDataRepoStatus,
  waitForRequest,
} from "@/core/requests";
import { externalRunner } from "@/core/runner-link";
import { acquireDataRepoSyncLock } from "@/core/sync/data-repo-action-lock";
import { getAheadCommits } from "@/core/sync/data-repo-git";
import type {
  SyncActionMode,
  SyncActionRequest,
  SyncActionResult,
} from "@/core/sync/data-repo-panel-types";
import { saveLastAction } from "@/core/sync/data-repo-status";
import {
  confirmPublished,
  syncDataRepo,
  syncOptionsFromConfig,
  type ConfirmPublishedReport,
  type SyncReport,
} from "@/core/sync/sync-orchestrator";
import { parseSyncActionRequest } from "./sync-request";

export const dynamic = "force-dynamic";

const RUNNER_SYNC_TIMEOUT_MS = 120_000;

function isAheadCommitsMatch(actual: string[], confirmed?: string[]): boolean {
  if (!confirmed) return false;
  if (actual.length !== confirmed.length) return false;
  return actual.every((sha, idx) => sha === confirmed[idx]);
}

async function checkExternalRunnerPush(actionRequest: SyncActionRequest): Promise<string | null> {
  const runnerStatus = await requestRunnerDataRepoStatus();
  if (runnerStatus?.pushCapability !== "github-app") {
    return "容器内无推送凭据，请在宿主机推送";
  }
  if (!actionRequest.confirmation?.aheadCommits || actionRequest.confirmation.aheadCommits.length === 0) {
    return "推送前须先确认领先提交清单";
  }
  return null;
}

async function startViaRunner(
  action: SyncActionRequest,
  who: { deviceId: string; ip: string | null },
): Promise<NextResponse> {
  const queued = await enqueueRequest("sync-data", { syncAction: action });
  const settled = await waitForRequest(queued.id, RUNNER_SYNC_TIMEOUT_MS);
  if (settled?.state === "done" && settled.result?.syncResult) {
    const result = settled.result.syncResult;
    await audit({
      action: "sync-data",
      outcome: result.ok ? "ok" : "error",
      deviceId: who.deviceId,
      ip: who.ip,
      detail: `${action.mode} 经执行器完成 ${result.ok ? "成功" : (result.error ?? "失败")}`,
    });
    return NextResponse.json(result);
  }
  const error =
    settled?.state === "failed"
      ? (settled.result?.error ?? "执行器处理失败")
      : "执行器未响应：确认 runner 容器正在运行";
  return NextResponse.json({ error }, { status: settled?.state === "failed" ? 409 : 503 });
}

async function performLocalSync(
  mode: SyncActionMode,
  config: AppConfig,
): Promise<SyncReport | ConfirmPublishedReport> {
  const scope = syncOptionsFromConfig(config);
  if (mode === "dry-run") {
    return syncDataRepo({ ...scope, dryRun: true });
  }
  if (mode === "export") {
    return syncDataRepo({ ...scope, dryRun: false, push: false });
  }
  if (mode === "confirm") {
    return confirmPublished({ repoPath: scope.repoPath, dryRun: false });
  }
  return syncDataRepo({ ...scope, dryRun: false, push: true });
}

async function executeLocalSync(
  config: AppConfig,
  mode: SyncActionMode,
  who: { deviceId: string; ip: string | null },
): Promise<NextResponse> {
  const startedAt = new Date().toISOString();
  let ok = true;
  let report: SyncReport | ConfirmPublishedReport | null = null;
  let error: string | null = null;

  try {
    report = await performLocalSync(mode, config);
  } catch (cause) {
    ok = false;
    error = cause instanceof Error ? cause.message : String(cause);
  }

  const finishedAt = new Date().toISOString();
  const result: SyncActionResult = {
    mode,
    startedAt,
    finishedAt,
    ok,
    report,
    executedBy: "web",
    error,
  };
  await saveLastAction(result);
  await audit({
    action: "sync-data",
    outcome: ok ? "ok" : "error",
    deviceId: who.deviceId,
    ip: who.ip,
    detail: `${mode} ${ok ? "成功" : (error ?? "失败")}`,
  });
  return NextResponse.json(result);
}

export async function POST(request: Request): Promise<NextResponse> {
  const guard = await requireOwnerAction(request, "sync-data");
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const full = loadConfig(configPath());
  if (!full.dataRepo) {
    return NextResponse.json({ error: "未配置数据仓 (dataRepo)" }, { status: 409 });
  }

  let actionRequest: SyncActionRequest;
  try {
    actionRequest = parseSyncActionRequest(await request.text());
  } catch (cause) {
    return NextResponse.json({ error: (cause as Error).message }, { status: 400 });
  }

  const lock = await acquireDataRepoSyncLock();
  if (!lock.acquired) {
    return NextResponse.json({ error: lock.reason }, { status: 409 });
  }

  const who = { deviceId: guard.owner.deviceId, ip: clientIp(request) };
  try {
    if (externalRunner()) {
      if (actionRequest.mode === "push") {
        const pushErr = await checkExternalRunnerPush(actionRequest);
        if (pushErr) return NextResponse.json({ error: pushErr }, { status: 409 });
      }
      return await startViaRunner(actionRequest, who);
    }

    if (actionRequest.mode === "push") {
      const currentAhead = await getAheadCommits(full.dataRepo.path);
      if (!isAheadCommitsMatch(currentAhead, actionRequest.confirmation?.aheadCommits)) {
        return NextResponse.json({
          error: "待推送提交清单已发生变化，请刷新面板后重新确认",
        }, { status: 409 });
      }
    }

    return await executeLocalSync(full, actionRequest.mode, who);
  } finally {
    await lock.release();
  }
}

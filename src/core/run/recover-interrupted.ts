/**
 * 执行进程启动时收尾上一个进程退出前没跑完的轮次。
 *
 * 执行进程是唯一的执行方，它启动时磁盘上任何 inProgress 的 run.json 都不可能还在跑：
 *   - 有 run.json：置 inProgress=false，cancelledAt 取最近一次落盘时刻，attempts 保持已完成的调用；
 *     progress.json 同步补 finishedAt / cancelledAt，没跑完的调用标 cancelled；随后走运行结束的自动导出，
 *     已完成的作品照常进入数据仓。
 *   - 只有 progress.json（连第一次 run.json 都没写出）：目录里没有任何结果，直接删除。
 *   - 有产物却没有 run.json：无法重建记录，留给保留策略处理。
 */

import { readdir, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import type { AppConfig } from "../config";
import { runDir } from "../paths";
import type { RunProgress } from "../progress";
import { listRunIds, saveRun, writeJsonAtomic } from "../store";
import type { RunRecord } from "../types";
import { postRunSync } from "./post-sync";
import type { Logger } from "./prepare";

const RUN_FILE = "run.json";
const PROGRESS_FILE = "progress.json";

export interface RecoveryReport {
  /** 已收尾并交给自动导出的轮次 */
  finalized: string[];
  /** 没有任何结果、已删除的目录 */
  discarded: string[];
}

async function readJson<T>(runId: string, filename: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(join(runDir(runId), filename), "utf8")) as T;
  } catch {
    return null;
  }
}

/** 收尾一轮：run.json 与 progress.json 都标为已停止，时刻取最近一次落盘 */
async function finalizeRun(runId: string, record: RunRecord): Promise<void> {
  const stoppedAt = record.finishedAt;
  await saveRun({ ...record, inProgress: false, cancelledAt: record.cancelledAt ?? stoppedAt });
  const progress = await readJson<RunProgress>(runId, PROGRESS_FILE);
  if (progress === null) return;
  for (const lane of progress.lanes) {
    for (const call of lane.calls) {
      if (call.state === "queued" || call.state === "running") call.state = "cancelled";
    }
  }
  progress.finishedAt = progress.finishedAt ?? stoppedAt;
  progress.cancelledAt = progress.cancelledAt ?? stoppedAt;
  progress.updatedAt = new Date().toISOString();
  await writeJsonAtomic(runId, PROGRESS_FILE, progress);
}

/** 目录里除了进度文件什么都没有 */
async function holdsOnlyProgress(runId: string): Promise<boolean> {
  const entries = await readdir(runDir(runId));
  return entries.length > 0 && entries.every((name) => name === PROGRESS_FILE);
}

async function recoverOne(runId: string, config: AppConfig, log: Logger, report: RecoveryReport): Promise<void> {
  const record = await readJson<RunRecord>(runId, RUN_FILE);
  if (record === null) {
    if (await holdsOnlyProgress(runId)) {
      await rm(runDir(runId), { recursive: true, force: true });
      report.discarded.push(runId);
      log(`[${runId}] 上次进程退出前没有写出任何结果，删除空目录`);
    }
    return;
  }
  if (record.inProgress !== true) return;
  await finalizeRun(runId, record);
  report.finalized.push(runId);
  log(`[${runId}] 上次进程退出前未收尾，按已停止收尾：保留 ${record.attempts.length} 次已完成的调用`);
  await postRunSync(config, runId, log);
}

/** 扫描全部轮次目录，收尾中断的轮次；单个目录出错只记日志，不影响其余目录与启动 */
export async function recoverInterruptedRuns(config: AppConfig, log: Logger): Promise<RecoveryReport> {
  const report: RecoveryReport = { finalized: [], discarded: [] };
  for (const runId of await listRunIds()) {
    try {
      await recoverOne(runId, config, log, report);
    } catch (cause) {
      log(`[${runId}] 收尾失败：${cause instanceof Error ? cause.message : String(cause)}`);
    }
  }
  return report;
}

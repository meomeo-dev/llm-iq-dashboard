/**
 * 全局作业双向互斥检测（active-work.ts）：
 * 组合鹈鹕基准轮次（含采样阶段与 AI 语义评审阶段 isJudging）与模型指纹后台作业（fill / check），
 * 供调度器、手动执行与指纹作业做跨进程互斥，同时不改变 progress.ts 中 findActiveRun() 的原有返回契约。
 */

import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { findActiveFingerprintJob } from "./model-fingerprint/job";
import { dataRoot } from "./paths";
import { isProcessAlive, processStartMark } from "./process-identity";
import { listProgressViews } from "./progress";
import { externalRunner, heartbeatCovers, readFreshHeartbeat } from "./runner-link";
import type { RunRecord } from "./types";

const EXECUTION_LOCK_FILE = "active-execution.lock";

export interface ActiveWorkItem {
  readonly runId: string;
  readonly kind: "run" | "fingerprint";
  readonly trigger?: RunRecord["trigger"];
}

interface ExecutionLockPayload {
  kind: "run" | "fingerprint";
  runId: string;
  trigger?: RunRecord["trigger"];
  pid: number;
  pidStart: string | null;
  lockedAt: string;
  token: string;
}

export type ExecutionLockResult =
  | { acquired: true; conflict: null; release: () => Promise<void> }
  | { acquired: false; conflict: ActiveWorkItem; release: () => Promise<void> };

export function executionLockFilePath(): string {
  return join(dataRoot(), EXECUTION_LOCK_FILE);
}

async function readActiveExecutionLock(): Promise<ExecutionLockPayload | null> {
  try {
    const raw = await readFile(executionLockFilePath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<ExecutionLockPayload>;
    if (
      (parsed.kind !== "run" && parsed.kind !== "fingerprint") ||
      typeof parsed.runId !== "string" ||
      typeof parsed.pid !== "number"
    ) {
      return null;
    }
    const alive = externalRunner()
      ? heartbeatCovers(await readFreshHeartbeat(), parsed.pid, parsed.pidStart ?? null)
      : isProcessAlive(parsed.pid, parsed.pidStart ?? null);
    if (!alive) return null;
    return parsed as ExecutionLockPayload;
  } catch {
    return null;
  }
}

async function tryWriteLockFile(lockPath: string, payload: ExecutionLockPayload): Promise<ExecutionLockResult | null> {
  try {
    await writeFile(lockPath, `${JSON.stringify(payload)}\n`, { encoding: "utf8", flag: "wx" });
    return {
      acquired: true,
      conflict: null,
      release: async () => {
        try {
          const raw = await readFile(lockPath, "utf8");
          const current = JSON.parse(raw) as { token?: string };
          if (current.token === payload.token) await unlink(lockPath);
        } catch {}
      },
    };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "EEXIST") throw err;
    const holder = await readActiveExecutionLock();
    if (holder !== null) {
      return {
        acquired: false,
        conflict: { runId: holder.runId, kind: holder.kind, trigger: holder.trigger },
        release: async () => {},
      };
    }
    await unlink(lockPath).catch(() => {});
    return null;
  }
}

/**
 * 原子获取跨进程全局执行锁（data/active-execution.lock，O_CREAT | O_EXCL），
 * 覆盖从入口到 progress.json / jobs/<jobId>.json 落盘前以及收尾前的全部时间窗。
 */
export async function acquireExecutionLock(item: ActiveWorkItem): Promise<ExecutionLockResult> {
  const existing = await findActiveWork();
  if (existing !== null) {
    return { acquired: false, conflict: existing, release: async () => {} };
  }
  await mkdir(dataRoot(), { recursive: true });
  const lockPath = executionLockFilePath();
  const pidStart = processStartMark(process.pid);
  const token = `${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const payload: ExecutionLockPayload = {
    kind: item.kind,
    runId: item.runId,
    ...(item.trigger !== undefined ? { trigger: item.trigger } : {}),
    pid: process.pid,
    pidStart,
    lockedAt: new Date().toISOString(),
    token,
  };

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const res = await tryWriteLockFile(lockPath, payload);
    if (res !== null) return res;
  }
  const fallback = await findActiveWork();
  return {
    acquired: false,
    conflict: fallback ?? { runId: item.runId, kind: item.kind, trigger: item.trigger },
    release: async () => {},
  };
}

/**
 * 检查任一进程中是否有正在执行的鹈鹕轮次（含 AI 评审阶段）或模型指纹作业。
 */
export async function findActiveWork(): Promise<ActiveWorkItem | null> {
  const locked = await readActiveExecutionLock();
  if (locked !== null) {
    return {
      runId: locked.runId,
      kind: locked.kind,
      trigger: locked.trigger,
    };
  }
  const progressViews = await listProgressViews();
  const activeRun = progressViews.find((view) => view.alive && !view.jobKind);
  if (activeRun !== undefined) {
    return {
      runId: activeRun.runId,
      kind: "run",
      trigger: activeRun.trigger,
    };
  }
  const activeJob = await findActiveFingerprintJob();
  if (activeJob !== null) {
    return {
      runId: activeJob.jobId,
      kind: "fingerprint",
    };
  }
  return null;
}

/**
 * 生成 409 冲突提示：当阻断方为基准轮次时保持原有文案格式，确保前端 run-once-api.ts 正则兼容。
 */
export function describeActiveWorkConflict(active: ActiveWorkItem): string {
  if (active.kind === "run") {
    const trigger = active.trigger === "schedule" ? "定时" : "手动";
    return `已有一轮正在执行（${trigger} ${active.runId}）`;
  }
  return `模型指纹作业正在执行（${active.runId}）`;
}

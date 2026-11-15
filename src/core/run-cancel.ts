/**
 * 停止一轮执行：data/runs/<runId>/cancel.json
 *
 * 一轮可能跑在看板进程（手动执行）或调度器进程（定时执行）中。看板写入停止请求，
 * 执行进程每秒检查一次，发现后不再发起排队中的调用并终止执行中的调用。
 *
 * 请求文件只写不删，兼作本轮被人停下的记录。
 */

import { access, unlink } from "node:fs/promises";
import { join } from "node:path";
import { runDir } from "./paths";
import { writeJsonPathAtomic } from "./store";

const CANCEL_FILE = "cancel.json";
/** 执行进程发现停止请求的最长延迟 */
const CANCEL_CHECK_MS = 1_000;

export interface CancelRequest {
  requestedAt: string;
}

const activeWatches = new Map<string, Set<AbortController>>();

export async function requestCancelAt(
  cancelFilePath: string,
  now: Date = new Date(),
): Promise<CancelRequest> {
  const request: CancelRequest = { requestedAt: now.toISOString() };
  await writeJsonPathAtomic(cancelFilePath, request);
  const controllers = activeWatches.get(cancelFilePath);
  if (controllers) {
    for (const ctrl of controllers) {
      if (!ctrl.signal.aborted) ctrl.abort(new Error("收到停止请求"));
    }
    activeWatches.delete(cancelFilePath);
  }
  return request;
}

export async function requestCancel(runId: string, now: Date = new Date()): Promise<CancelRequest> {
  return requestCancelAt(join(runDir(runId), CANCEL_FILE), now);
}

export interface CancelWatch {
  /** 发现停止请求后 aborted 变为 true，并触发 abort 事件 */
  signal: AbortSignal;
  /** 一轮结束时调用，停掉检查计时器 */
  stop: () => void;
}

/** 定期检查给定取消文件路径有没有收到停止请求 */
export function watchCancelAt(
  cancelFilePath: string,
  intervalMs: number = CANCEL_CHECK_MS,
): CancelWatch {
  const controller = new AbortController();
  let set = activeWatches.get(cancelFilePath);
  if (!set) {
    set = new Set();
    activeWatches.set(cancelFilePath, set);
  }
  set.add(controller);
  const cleanup = () => {
    clearInterval(timer);
    const cur = activeWatches.get(cancelFilePath);
    if (cur) {
      cur.delete(controller);
      if (cur.size === 0) activeWatches.delete(cancelFilePath);
    }
  };
  let checking = false;
  const timer = setInterval(() => {
    // 上一次检查未返回时跳过，避免磁盘卡顿时检查堆积
    if (checking || controller.signal.aborted) return;
    checking = true;
    void access(cancelFilePath)
      .then(() => {
        cleanup();
        if (!controller.signal.aborted) controller.abort(new Error("收到停止请求"));
      })
      .catch(() => {
        // 文件不存在即没有停止请求
      })
      .finally(() => {
        checking = false;
      });
  }, intervalMs);
  return { signal: controller.signal, stop: cleanup };
}

/** 执行方调用：开始定期检查这一轮有没有收到停止请求 */
export function watchCancel(runId: string, intervalMs: number = CANCEL_CHECK_MS): CancelWatch {
  return watchCancelAt(join(runDir(runId), CANCEL_FILE), intervalMs);
}

/** 原地重跑曾经被取消的轮次前，清除上一次遗留的 cancel.json */
export async function clearCancel(runId: string): Promise<void> {
  await unlink(join(runDir(runId), CANCEL_FILE)).catch(() => undefined);
}

/**
 * 停止一轮执行：data/runs/<runId>/cancel.json
 *
 * 一轮可能跑在看板进程（手动执行）或调度器进程（定时执行）中。看板写入停止请求，
 * 执行进程每秒检查一次，发现后不再发起排队中的调用并终止执行中的调用。
 *
 * 请求文件只写不删，兼作本轮被人停下的记录。
 */

import { access } from "node:fs/promises";
import { join } from "node:path";
import { runDir } from "./paths";
import { writeJsonAtomic } from "./store";

const CANCEL_FILE = "cancel.json";
/** 执行进程发现停止请求的最长延迟 */
const CANCEL_CHECK_MS = 1_000;

export interface CancelRequest {
  requestedAt: string;
}

export async function requestCancel(runId: string, now: Date = new Date()): Promise<CancelRequest> {
  const request: CancelRequest = { requestedAt: now.toISOString() };
  await writeJsonAtomic(runId, CANCEL_FILE, request);
  return request;
}

export interface CancelWatch {
  /** 发现停止请求后 aborted 变为 true，并触发 abort 事件 */
  signal: AbortSignal;
  /** 一轮结束时调用，停掉检查计时器 */
  stop: () => void;
}

/** 执行方调用：开始定期检查这一轮有没有收到停止请求 */
export function watchCancel(runId: string, intervalMs: number = CANCEL_CHECK_MS): CancelWatch {
  const controller = new AbortController();
  const path = join(runDir(runId), CANCEL_FILE);
  let checking = false;
  const timer = setInterval(() => {
    // 上一次检查未返回时跳过，避免磁盘卡顿时检查堆积
    if (checking || controller.signal.aborted) return;
    checking = true;
    void access(path)
      .then(() => {
        clearInterval(timer);
        controller.abort(new Error("收到停止请求"));
      })
      .catch(() => {
        // 文件不存在即没有停止请求
      })
      .finally(() => {
        checking = false;
      });
  }, intervalMs);
  return { signal: controller.signal, stop: () => clearInterval(timer) };
}

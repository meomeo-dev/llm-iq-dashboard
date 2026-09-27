/**
 * 跨进程判断登记的进程是否仍在运行。
 *
 * 容器重启后 pid 从小号重新分配，旧 pid 可能对应新容器里的其他进程，因此同时比对
 * 启动标记（Linux /proc/<pid>/stat 的 starttime）。无 /proc 的系统标记为 null，
 * 只比对 pid；macOS 的 pid 递增轮转，撞号风险可忽略。
 */

import { readFileSync } from "node:fs";

/** /proc/<pid>/stat 中 starttime 是第 22 个字段；进程名（第 2 个字段）可能含空格与括号 */
const STARTTIME_FIELD = 22;

/** 从 stat 行取出 starttime。进程名以最后一个 ')' 结束，之后从第 3 个字段起按空格切分 */
export function parseStartTime(statLine: string): string | null {
  const nameEnd = statLine.lastIndexOf(")");
  if (nameEnd === -1) return null;
  const fields = statLine.slice(nameEnd + 1).trim().split(/\s+/);
  return fields[STARTTIME_FIELD - 3] ?? null;
}

/** 进程的启动标记；非 Linux 或进程不存在时为 null */
export function processStartMark(pid: number): string | null {
  try {
    return parseStartTime(readFileSync(`/proc/${pid}/stat`, "utf8"));
  } catch {
    return null;
  }
}

/**
 * 进程是否存活：signal 0 只检查存在性，EPERM（属于其他用户）也算存活；
 * 给出 startMark 时还要求启动标记一致。仅在同一台机器（同一容器）内有效。
 */
export function isProcessAlive(pid: number, startMark: string | null = null): boolean {
  try {
    process.kill(pid, 0);
  } catch (cause) {
    if ((cause as NodeJS.ErrnoException).code !== "EPERM") return false;
  }
  if (startMark === null) return true;
  return processStartMark(pid) === startMark;
}

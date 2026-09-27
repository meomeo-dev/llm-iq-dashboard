/**
 * 看板与执行器分进程（分容器）时的联络：模式开关与执行器心跳。
 *
 * `PELICAN_RUNNER=external` 的看板不在进程内执行调用、不拉起调度器，一切经 `data/`
 * 交给执行器（`pnpm runner`）。看板看不见执行器的 pid（不同容器），执行器每隔一段
 * 时间把自己的 pid 与启动标记写进 `data/runner.json`，看板以"心跳新鲜且 pid 一致"
 * 判断某轮的执行进程是否还在。
 */

import { readJsonFile, writeJsonFile } from "./auth/store";
import { processStartMark } from "./process-identity";

const RUNNER_FILE = "runner.json";
export const HEARTBEAT_INTERVAL_MS = 15_000;
/** 超过这么久没有心跳即视为执行器不在 */
export const HEARTBEAT_STALE_MS = 45_000;

type Env = Readonly<Record<string, string | undefined>>;

export function externalRunner(env: Env = process.env): boolean {
  return env.PELICAN_RUNNER?.trim() === "external";
}

export interface RunnerHeartbeat {
  pid: number;
  pidStart: string | null;
  startedAt: string;
  heartbeatAt: string;
}

export async function writeHeartbeat(startedAt: Date, now: Date = new Date()): Promise<void> {
  const beat: RunnerHeartbeat = {
    pid: process.pid,
    pidStart: processStartMark(process.pid),
    startedAt: startedAt.toISOString(),
    heartbeatAt: now.toISOString(),
  };
  await writeJsonFile(RUNNER_FILE, beat);
}

/** 新鲜的心跳；没有文件、格式不对或已过期时为 null */
export async function readFreshHeartbeat(now: Date = new Date()): Promise<RunnerHeartbeat | null> {
  const stored = (await readJsonFile(RUNNER_FILE)) as Partial<RunnerHeartbeat> | null;
  if (stored === null || typeof stored.pid !== "number" || typeof stored.heartbeatAt !== "string") return null;
  if (now.getTime() - Date.parse(stored.heartbeatAt) > HEARTBEAT_STALE_MS) return null;
  return {
    pid: stored.pid,
    pidStart: typeof stored.pidStart === "string" ? stored.pidStart : null,
    startedAt: typeof stored.startedAt === "string" ? stored.startedAt : stored.heartbeatAt,
    heartbeatAt: stored.heartbeatAt,
  };
}

/** 登记了 pid 的进程是否就是仍在心跳的执行器 */
export function heartbeatCovers(beat: RunnerHeartbeat | null, pid: number, pidStart: string | null): boolean {
  if (beat === null || beat.pid !== pid) return false;
  return beat.pidStart === null || pidStart === null || beat.pidStart === pidStart;
}

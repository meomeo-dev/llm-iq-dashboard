/**
 * 自动任务的运行态开关与调度器进程登记，文件位于产物目录，看板与调度器共同读写。
 *
 * 配置里的 schedule 决定节奏，这里决定此刻是否允许自动执行，看板上拨动即生效。
 * - auto-run.json：开关。文件不存在即关闭：自动任务消耗 CLI 配额，须由人明确打开。
 * - scheduler.json：常驻调度器的 pid，看板据此判断是否需要拉起。
 */

import { Cron } from "croner";
import { readFileSync } from "node:fs";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { loadConfig, type ScheduleConfig } from "./config";
import { configPath, dataRoot } from "./paths";
import { isProcessAlive, processStartMark } from "./process-identity";
import { externalRunner, readFreshHeartbeat } from "./runner-link";

const SWITCH_FILE = "auto-run.json";
const SCHEDULER_FILE = "scheduler.json";

export interface AutoRunSwitch {
  enabled: boolean;
  /** 最近一次拨动的时刻；从未拨动过为 null */
  updatedAt: string | null;
}

export interface SchedulerProcess {
  pid: number;
  startedAt: string;
  /** 进程启动标记，与 pid 一起认定进程（见 process-identity.ts）；旧记录可能缺失 */
  pidStart?: string | null;
}

const SWITCH_OFF: AutoRunSwitch = { enabled: false, updatedAt: null };

export async function readAutoRunSwitch(): Promise<AutoRunSwitch> {
  const stored = await readJson(SWITCH_FILE);
  if (stored === null || typeof stored !== "object") return SWITCH_OFF;
  const { enabled, updatedAt } = stored as Partial<AutoRunSwitch>;
  // 只认字面量 true：文件损坏时按关闭处理
  return { enabled: enabled === true, updatedAt: typeof updatedAt === "string" ? updatedAt : null };
}

export async function writeAutoRunSwitch(enabled: boolean, now: Date = new Date()): Promise<AutoRunSwitch> {
  const next: AutoRunSwitch = { enabled, updatedAt: now.toISOString() };
  await writeJson(SWITCH_FILE, next);
  return next;
}

export async function recordSchedulerProcess(pid: number, now: Date = new Date()): Promise<void> {
  const record: SchedulerProcess = { pid, startedAt: now.toISOString(), pidStart: processStartMark(pid) };
  await writeJson(SCHEDULER_FILE, record);
}

/** 登记的调度器仍存活时返回，否则为 null；分容器部署时调度器就是执行器，看心跳 */
export async function readLiveScheduler(): Promise<SchedulerProcess | null> {
  if (externalRunner()) {
    const beat = await readFreshHeartbeat();
    return beat === null ? null : { pid: beat.pid, startedAt: beat.startedAt, pidStart: beat.pidStart };
  }
  const stored = (await readJson(SCHEDULER_FILE)) as Partial<SchedulerProcess> | null;
  if (stored === null || typeof stored.pid !== "number" || typeof stored.startedAt !== "string") return null;
  const pidStart = typeof stored.pidStart === "string" ? stored.pidStart : null;
  return isProcessAlive(stored.pid, pidStart) ? { pid: stored.pid, startedAt: stored.startedAt, pidStart } : null;
}

/** 看板上自动任务开关的完整状态；/api/auto-run 与 /api/events 共用 */
export interface AutoRunView {
  enabled: boolean;
  updatedAt: string | null;
  /** 活着的调度器 pid；null 表示没有调度器在跑 */
  schedulerPid: number | null;
  /** 配置里的调度节奏；schedule.enabled 为 false 时开关打开也不会跑 */
  schedule: Pick<ScheduleConfig, "enabled" | "cron" | "intervalMinutes" | "timezone">;
  /** 按 cron 推算的下一个触发点；间隔调度或未配置时为 null */
  nextRunAt: string | null;
}

function loadScheduleSafely(): Pick<ScheduleConfig, "enabled" | "cron" | "intervalMinutes" | "timezone"> {
  try {
    return loadConfig(configPath()).schedule;
  } catch {
    try {
      const text = readFileSync(configPath(), "utf8");
      const parsed = parseYaml(text) as Record<string, unknown> | null;
      const s = (parsed && typeof parsed === "object" ? parsed.schedule : null) as Record<string, unknown> | null;
      if (s && typeof s === "object") {
        return {
          enabled: s.enabled !== false,
          cron: typeof s.cron === "string" ? s.cron : null,
          intervalMinutes: typeof s.intervalMinutes === "number" ? s.intervalMinutes : null,
          timezone: typeof s.timezone === "string" ? s.timezone : null,
        };
      }
    } catch {
      // 忽略文件解析错误，返回安全默认值
    }
    return { enabled: false, cron: null, intervalMinutes: null, timezone: null };
  }
}

export async function describeAutoRun(now: Date = new Date()): Promise<AutoRunView> {
  const schedule = loadScheduleSafely();
  const toggle = await readAutoRunSwitch();
  const scheduler = await readLiveScheduler();
  return {
    enabled: toggle.enabled,
    updatedAt: toggle.updatedAt,
    schedulerPid: scheduler?.pid ?? null,
    schedule: {
      enabled: schedule.enabled,
      cron: schedule.cron,
      intervalMinutes: schedule.intervalMinutes,
      timezone: schedule.timezone,
    },
    nextRunAt: nextCronRun(schedule, now),
  };
}

function nextCronRun(schedule: Pick<ScheduleConfig, "enabled" | "cron" | "timezone">, now: Date): string | null {
  if (!schedule.enabled || schedule.cron === null) return null;
  const timezone = schedule.timezone !== null ? { timezone: schedule.timezone } : {};
  try {
    const job = new Cron(schedule.cron, { paused: true, ...timezone });
    return job.nextRun(now)?.toISOString() ?? null;
  } catch {
    return null;
  }
}

async function readJson(filename: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(join(dataRoot(), filename), "utf8"));
  } catch {
    return null;
  }
}

/** 写临时文件再原子替换，另一进程随时可能读取 */
async function writeJson(filename: string, value: unknown): Promise<void> {
  await mkdir(dataRoot(), { recursive: true });
  const target = join(dataRoot(), filename);
  const staging = `${target}.staging`;
  await writeFile(staging, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(staging, target);
}

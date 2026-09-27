/**
 * 常驻调度器。
 *
 * 1. 不重入：上一轮未结束时跳过本次触发，不排队。单轮可能长达十几分钟，排队会
 *    累积延迟，同一模型的并行调用也会挤占配额。
 * 2. 单轮抛错只记日志，进程不退出，下一个触发点照常执行。
 * 3. 每个触发点读取 auto-run.json（见 auto-run.ts），开关关闭则跳过；
 *    正在执行的一轮不受影响。
 * 4. 配置随改随生效，与“跑一次”同口径：每个触发点重读配置，按最新的定时目标与
 *    题目开一轮；节奏（cron / 间隔 / 时区）每 RHYTHM_CHECK_MS 核对一次，变了即
 *    重建定时器。不定时（两者皆空）时只核对、不触发。
 */

import { Cron } from "croner";
import { readAutoRunSwitch } from "./auto-run";
import { hasRhythm, type AppConfig, type ScheduleRhythm } from "./config";
import { findActiveRun } from "./progress";
import { scheduledRound } from "./run-selection";
import { executeRun, type Logger } from "./runner";

/** 节奏改动生效的最长延迟；看板显示的“下一次触发”按最新配置推算，两者至多差这么久 */
export const RHYTHM_CHECK_MS = 30_000;

export interface SchedulerHandle {
  stop(): void;
  /** 下一次触发时刻；基于间隔或不定时返回 null */
  nextRun(): Date | null;
}

/** 每次调用都读一份最新配置；读不到时抛错 */
export type ConfigSource = () => AppConfig;

interface ArmedTimer {
  rhythm: ScheduleRhythm;
  stop(): void;
  nextRun(): Date | null;
}

function createSchedulerTick(readConfig: ConfigSource, log: Logger): () => Promise<void> {
  let running = false;
  return async (): Promise<void> => {
    if (running) {
      log("上一轮尚未结束，跳过本次触发");
      return;
    }
    running = true;
    try {
      const skipReason = await reasonToSkip();
      if (skipReason !== null) {
        log(skipReason);
        return;
      }
      await executeRun(scheduledRound(readConfig()), { trigger: "schedule", log });
    } catch (cause) {
      log(`本轮执行失败：${describe(cause)}`);
    } finally {
      running = false;
    }
  };
}

/** 启动时读不到配置直接抛错；之后读失败只记日志，沿用已生效的节奏 */
export function startScheduler(
  readConfig: ConfigSource,
  log: Logger,
  rhythmCheckMs: number = RHYTHM_CHECK_MS,
): SchedulerHandle {
  const initial = readConfig();
  const tick = createSchedulerTick(readConfig, log);

  let timer = arm(initial.schedule, tick, log);
  const watcher = watchRhythm(readConfig, log, rhythmCheckMs, (next) => {
    if (sameRhythm(next, timer.rhythm)) return;
    timer.stop();
    log("配置里的节奏已改动，重建定时器");
    timer = arm(next, tick, log);
  });

  if (initial.schedule.runOnStart) void tick();

  return {
    stop: () => {
      clearInterval(watcher);
      timer.stop();
    },
    nextRun: () => timer.nextRun(),
  };
}

/** 定期重读节奏交给 onRhythm；同一错误只记一次，配置恢复后再出错会重新记 */
function watchRhythm(
  readConfig: ConfigSource,
  log: Logger,
  periodMs: number,
  onRhythm: (rhythm: ScheduleRhythm) => void,
): NodeJS.Timeout {
  let lastError: string | null = null;
  return setInterval(() => {
    try {
      onRhythm(readConfig().schedule);
      lastError = null;
    } catch (cause) {
      const message = describe(cause);
      if (message !== lastError) log(`重读配置失败，沿用当前节奏：${message}`);
      lastError = message;
    }
  }, periodMs);
}

/** 开关关闭或已有轮次在执行（含看板手动发起的）时返回跳过原因 */
async function reasonToSkip(): Promise<string | null> {
  const { enabled } = await readAutoRunSwitch();
  if (!enabled) return "自动任务已关闭（看板开关），跳过本次触发";
  const active = await findActiveRun();
  if (active !== null) return `轮次 ${active.runId} 仍在执行，跳过本次触发`;
  return null;
}

function arm(schedule: ScheduleRhythm, tick: () => Promise<void>, log: Logger): ArmedTimer {
  const rhythm: ScheduleRhythm = {
    cron: schedule.cron,
    intervalMinutes: schedule.intervalMinutes,
    timezone: schedule.timezone,
  };
  if (!hasRhythm(rhythm)) {
    log("配置里没有定时节奏（cron 与 intervalMinutes 都未设置），不会自动执行");
    return { rhythm, stop: () => {}, nextRun: () => null };
  }
  return rhythm.cron !== null
    ? armCron(rhythm, rhythm.cron, tick, log)
    : armInterval(rhythm, rhythm.intervalMinutes ?? 0, tick, log);
}

function armCron(rhythm: ScheduleRhythm, expression: string, tick: () => Promise<void>, log: Logger): ArmedTimer {
  const { timezone } = rhythm;
  const job = new Cron(expression, timezone !== null ? { timezone } : {}, tick);
  const next = job.nextRun();
  log(`cron 调度已启动：${expression}${timezone !== null ? ` (${timezone})` : ""}`);
  log(`下一次触发：${next !== null ? next.toISOString() : "无"}`);
  return { rhythm, stop: () => job.stop(), nextRun: () => job.nextRun() };
}

function armInterval(rhythm: ScheduleRhythm, minutes: number, tick: () => Promise<void>, log: Logger): ArmedTimer {
  const timer = setInterval(() => void tick(), minutes * 60_000);
  log(`间隔调度已启动：每 ${minutes} 分钟一轮`);
  return { rhythm, stop: () => clearInterval(timer), nextRun: () => null };
}

function sameRhythm(a: ScheduleRhythm, b: ScheduleRhythm): boolean {
  return a.cron === b.cron && a.intervalMinutes === b.intervalMinutes && a.timezone === b.timezone;
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

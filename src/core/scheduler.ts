/**
 * 常驻调度器。
 *
 * 1. 不重入：上一轮未结束时跳过本次触发，不排队。单轮可能长达十几分钟，排队会
 *    累积延迟，同一模型的并行调用也会挤占配额。
 * 2. 单轮抛错只记日志，进程不退出，下一个触发点照常执行。
 * 3. 每个触发点读取 auto-run.json（见 auto-run.ts），开关关闭则跳过；
 *    正在执行的一轮不受影响。
 */

import { Cron } from "croner";
import { readAutoRunSwitch } from "./auto-run";
import type { AppConfig } from "./config";
import { findActiveRun } from "./progress";
import { scheduledRound } from "./run-selection";
import { executeRun, type Logger } from "./runner";

export interface SchedulerHandle {
  stop(): void;
  /** 下一次触发时刻；基于间隔的调度返回 null */
  nextRun(): Date | null;
}

export function startScheduler(config: AppConfig, log: Logger): SchedulerHandle {
  const { schedule } = config;
  if (!schedule.enabled) {
    log("调度已在配置中关闭（schedule.enabled: false），不会自动执行");
    return { stop: () => {}, nextRun: () => null };
  }

  let running = false;

  const tick = async (): Promise<void> => {
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
      await executeRun(scheduledRound(config), { trigger: "schedule", log });
    } catch (cause) {
      log(`本轮执行失败：${cause instanceof Error ? cause.message : cause}`);
    } finally {
      running = false;
    }
  };

  if (schedule.runOnStart) void tick();

  return schedule.cron !== null
    ? startCron(schedule.cron, schedule.timezone, tick, log)
    : startInterval(schedule.intervalMinutes ?? 0, tick, log);
}

/** 开关关闭或已有轮次在执行（含看板手动发起的）时返回跳过原因 */
async function reasonToSkip(): Promise<string | null> {
  const { enabled } = await readAutoRunSwitch();
  if (!enabled) return "自动任务已关闭（看板开关），跳过本次触发";
  const active = await findActiveRun();
  if (active !== null) return `轮次 ${active.runId} 仍在执行，跳过本次触发`;
  return null;
}

function startCron(
  expression: string,
  timezone: string | null,
  tick: () => Promise<void>,
  log: Logger,
): SchedulerHandle {
  const job = new Cron(expression, timezone !== null ? { timezone } : {}, tick);
  const next = job.nextRun();
  log(`cron 调度已启动：${expression}${timezone !== null ? ` (${timezone})` : ""}`);
  log(`下一次触发：${next !== null ? next.toISOString() : "无"}`);
  return { stop: () => job.stop(), nextRun: () => job.nextRun() };
}

function startInterval(
  minutes: number,
  tick: () => Promise<void>,
  log: Logger,
): SchedulerHandle {
  const periodMs = minutes * 60_000;
  const timer = setInterval(() => void tick(), periodMs);
  log(`间隔调度已启动：每 ${minutes} 分钟一轮`);
  return { stop: () => clearInterval(timer), nextRun: () => null };
}

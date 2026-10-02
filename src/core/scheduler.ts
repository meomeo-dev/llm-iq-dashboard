/**
 * 常驻调度器。
 *
 * 1. 一次只跑一轮、不并行：同一模型的并行调用会挤占配额。到点时有轮次在跑（看板手动发起的，
 *    或自己的上一轮还没收尾）就把这次触发排进队列，每 ACTIVE_POLL_MS 看一次，空下来立即开跑；
 *    队列只容一轮，排队期间再到点只合并、不累积，免得一次长时间手动轮次之后连跑好几轮。
 *    排队状态写进 scheduler.json 给看板显示；进程退出排队随之作废。
 *    手动轮次不排队：有轮次在跑时看板直接拒绝（见 app/api/run），两个来源互不干扰。
 * 2. 单轮抛错只记日志，进程不退出，下一个触发点照常执行。
 * 3. 每个触发点读取 auto-run.json（见 auto-run.ts），开关关闭则跳过；
 *    正在执行的一轮不受影响。
 * 4. 配置随改随生效，与“跑一次”同口径：每个触发点重读配置，按最新的定时目标与
 *    题目开一轮；节奏（cron / 间隔 / 时区）每 RHYTHM_CHECK_MS 核对一次，变了即
 *    重建定时器。不定时（两者皆空）时只核对、不触发。
 */

import { Cron } from "croner";
import { readAutoRunSwitch, writeSchedulerPending, type PendingScheduledRun } from "./auto-run";
import { hasRhythm, type AppConfig, type ScheduleRhythm } from "./config";
import { findActiveRun } from "./progress";
import { scheduledRound } from "./run-selection";
import { executeRun, type Logger } from "./runner";

/** 节奏改动生效的最长延迟；看板显示的“下一次触发”按最新配置推算，两者至多差这么久 */
export const RHYTHM_CHECK_MS = 30_000;
/** 排队中的定时轮次多久看一次前面的轮次结束没有 */
export const ACTIVE_POLL_MS = 15_000;

/** 调度器依赖，测试里替换；缺省接真实的进度文件、开关文件与执行器 */
export interface SchedulerDeps {
  /** 任一进程里正在执行的轮次 */
  activeRun: () => Promise<{ runId: string } | null>;
  autoRunEnabled: () => Promise<boolean>;
  execute: (config: AppConfig, log: Logger) => Promise<unknown>;
  /** 排队状态落盘给看板 */
  setPending: (pending: PendingScheduledRun | null) => Promise<void>;
  pollMs: number;
}

const DEFAULT_DEPS: SchedulerDeps = {
  activeRun: findActiveRun,
  autoRunEnabled: async () => (await readAutoRunSwitch()).enabled,
  execute: (config, log) => executeRun(config, { trigger: "schedule", log }),
  setPending: writeSchedulerPending,
  pollMs: ACTIVE_POLL_MS,
};

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

type Blocker = "disabled" | { runId: string | null } | null;

/**
 * 触发点的处理：能开就开，开不了就排队。排队用定时轮询而不是事件，因为挡住它的轮次
 * 可能在另一个进程（看板的手动轮次）里，只有进度文件可看。
 */
class ScheduledRoundQueue {
  private running = false;
  private pending: PendingScheduledRun | null = null;
  private poller: NodeJS.Timeout | undefined;
  private polling = false;

  constructor(private readonly readConfig: ConfigSource, private readonly log: Logger, private readonly deps: SchedulerDeps) {}

  /** 到点：直接开跑，或排队等前面的轮次 */
  async tick(): Promise<void> {
    if (this.pending !== null) {
      this.log("已有一轮定时轮次在排队，本次触发合并");
      return;
    }
    const block = await this.blocker();
    if (block === "disabled") {
      this.log("自动任务已关闭（看板开关），跳过本次触发");
      return;
    }
    if (block === null) {
      await this.launch();
      return;
    }
    this.pending = { since: new Date().toISOString(), waitingFor: block.runId };
    this.log(block.runId === null ? "上一轮尚未结束，定时轮次排队等它结束" : `轮次 ${block.runId} 仍在执行，定时轮次排队等它结束`);
    await this.deps.setPending(this.pending);
    this.poller = setInterval(() => void this.poll(), this.deps.pollMs);
  }

  stop(): void {
    clearInterval(this.poller);
  }

  private async launch(): Promise<void> {
    this.running = true;
    try {
      await this.deps.execute(scheduledRound(this.readConfig()), this.log);
    } catch (cause) {
      this.log(`本轮执行失败：${describe(cause)}`);
    } finally {
      this.running = false;
    }
  }

  /** 开关关了这次触发就此作废；有轮次在跑返回它（自己的上一轮 runId 为 null） */
  private async blocker(): Promise<Blocker> {
    if (!(await this.deps.autoRunEnabled())) return "disabled";
    if (this.running) return { runId: null };
    const active = await this.deps.activeRun();
    return active === null ? null : { runId: active.runId };
  }

  private async clearPending(): Promise<void> {
    clearInterval(this.poller);
    this.poller = undefined;
    this.pending = null;
    await this.deps.setPending(null);
  }

  /** 排队期间每隔 pollMs 看一次：开关关了作废，空下来就开跑 */
  private async poll(): Promise<void> {
    if (this.polling) return;
    this.polling = true;
    try {
      const block = await this.blocker();
      if (block === "disabled") {
        this.log("排队期间自动任务被关闭，排队的定时轮次作废");
        await this.clearPending();
      } else if (block === null) {
        this.log("前面的轮次已结束，排队的定时轮次开跑");
        await this.clearPending();
        await this.launch();
      }
    } catch (cause) {
      this.log(`排队轮询失败：${describe(cause)}`);
    } finally {
      this.polling = false;
    }
  }
}

/** 启动时读不到配置直接抛错；之后读失败只记日志，沿用已生效的节奏 */
export function startScheduler(
  readConfig: ConfigSource,
  log: Logger,
  rhythmCheckMs: number = RHYTHM_CHECK_MS,
  overrides: Partial<SchedulerDeps> = {},
): SchedulerHandle {
  const initial = readConfig();
  const queue = new ScheduledRoundQueue(readConfig, log, { ...DEFAULT_DEPS, ...overrides });
  const tick = (): Promise<void> => queue.tick();

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
      queue.stop();
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

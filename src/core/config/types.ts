/**
 * 配置类型定义与节奏判断
 */

import type { CliKind, EffortLevel, Target } from "../types";
import type { PromptSpec } from "../prompt";
import type { RotationConfig } from "../variables";
import type { BudgetConfig } from "../budget";

/** 数据仓同步配置 */
export interface DataRepoConfig {
  /** 本地数据仓的绝对路径（按进程 cwd 解析） */
  path: string;
  /** 每轮评测结束后是否自动触发同步 */
  autoSync: boolean;
  /** 同步提交后是否自动推送至远端 */
  push: boolean;
}

/**
 * 定时任务的节奏。只描述“何时触发”；到点是否真的执行由看板的“自动任务”开关
 * （auto-run.json）决定，两者不重叠。cron 与 intervalMinutes 都为 null 即不定时。
 */
export interface ScheduleConfig {
  /** cron 表达式与 intervalMinutes 二选一，cron 优先 */
  cron: string | null;
  intervalMinutes: number | null;
  timezone: string | null;
  /** 调度器启动时是否立刻先跑一轮；须同时设置节奏 */
  runOnStart: boolean;
}

/** 节奏本身，不含启动行为；调度器据此判断是否要重建定时器 */
export type ScheduleRhythm = Pick<ScheduleConfig, "cron" | "intervalMinutes" | "timezone">;

/** 是否设置了定时节奏；两者皆空即不定时 */
export function hasRhythm(schedule: Pick<ScheduleConfig, "cron" | "intervalMinutes">): boolean {
  return schedule.cron !== null || schedule.intervalMinutes !== null;
}

export interface RunConfig {
  /**
   * 本轮要跑的提示词条目。经典版作锚点、变量版防背答案，
   * 两者成绩的差异可揭示记忆效应。
   */
  promptIds: string[];
  /**
   * 同时在跑的模型数上限。CLI 限速按模型计算，故不同模型并行，
   * 同一模型的各强度、各提示词串行。
   */
  concurrency: number;
  /** 全局默认超时（毫秒），最低优先级 */
  defaultTimeoutMs: number;
  /**
   * 按 CLI 覆盖超时（毫秒）。优先级：targets[].timeoutMs >
   * run.timeoutByEffort[effort] > run.timeoutByCli[cli] > run.defaultTimeoutMs。
   */
  timeoutByCli: Partial<Record<CliKind, number>>;
  /** 按思考强度覆盖超时（毫秒），优先于按 CLI；高强度档耗时主要取决于思考深度 */
  timeoutByEffort: Partial<Record<EffortLevel, number>>;
  /** 提示词变量的轮换周期；默认按 UTC 每天一换，同一天各轮取值相同便于对照 */
  rotation: RotationConfig;
}

export interface RetentionConfig {
  /** 历史轮次保留的天数，更早的整轮删除；null 表示全部保留 */
  days: number | null;
}

export interface AppConfig {
  schedule: ScheduleConfig;
  run: RunConfig;
  retention: RetentionConfig;
  /** 成本上限；不写即不限 */
  budget: BudgetConfig;
  targets: Target[];
  /** 用户自定义的提示词条目，与内置预设合并 */
  customPrompts: PromptSpec[];
  /** 探测不到的模型可以在这里手填，主要服务于没有列举命令的 claude */
  customModels: Partial<Record<CliKind, string[]>>;
  /** 数据仓同步配置；未配置时为 null */
  dataRepo?: DataRepoConfig | null;
}

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
  /** 允许发布的题目 id；null 表示全部。导出时不在清单里的题目连同其调用一并剔除 */
  publishPrompts: string[] | null;
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
  /**
   * 同时在跑的 profile 数上限（默认 profile 也算一个）。每个 profile 一个独立进程，
   * profile 之间并行，每个 profile 内部仍按 concurrency 分道。
   */
  profileConcurrency: number;
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

/**
 * 上游类型的起步清单，只用于展示与数据仓记录。配置里写了 upstreamTypes 即以配置为准，
 * 用户可增删；profiles[].upstreamType 必须取其中之一。
 */
export const DEFAULT_UPSTREAM_TYPES: readonly string[] = [
  "chatgpt-plus",
  "chatgpt-pro",
  "chatgpt-pro-5x",
  "chatgpt-team",
  "chatgpt-enterprise",
  "official-api-key",
  "azure",
  "compatible",
];

export interface ProfilePricing {
  /** 相对价格目录官价的倍率；缺省价 = 官价 × 倍率 */
  multiplier: number;
  /** 逐模型逐计价项手填的每百万 token 单价（USD），优先于缺省价 */
  overrides: Record<string, Record<string, number>>;
}

/**
 * 一家 CLI 通往某个第三方上游的一套完整配置，凭据是 API key（经凭据目录注入）。
 * 默认 profile（登录态）不在此列表里；baseUrl 与 queryParams 只用于生成该 profile 的
 * CLI 配置，不进入记录与接口响应。
 */
export interface ProfileConfig {
  /** 全局唯一，kebab-case；`default` 保留给隐式 profile。同时是目标 id 与 key 文件名的一段 */
  name: string;
  /** 页面与记录上的显示名，自由文本（可含中文与标点）；未填为 null，显示时退回 name */
  label: string | null;
  cli: CliKind;
  /** 取 upstreamTypes 之一 */
  upstreamType: string;
  /** 上游侧分组名，自由文本；未填为 null */
  group: string | null;
  /** 上游官网，https；未填为 null */
  website: string | null;
  /** 上游接口地址，https */
  baseUrl: string;
  /** 追加到接口地址的查询参数，如 Azure 的 api-version */
  queryParams: Record<string, string>;
  /** 该上游可用的模型：从上游 /models 同步或手填；新建时可以为空 */
  models: string[];
  pricing: ProfilePricing;
  /** 停用后该 profile 的目标不进定时任务、不可手动选，配置与目标保留 */
  enabled: boolean;
}

export interface RetentionConfig {
  /** 历史轮次保留的天数，更早的整轮删除；null 表示全部保留 */
  days: number | null;
}

/** AI 层的一个裁判：走该 CLI 的登录态，按 cli/model@effort 写进记录的 judges[] */
export interface JudgeModel {
  cli: CliKind;
  model: string;
  effort: EffortLevel;
}

export interface JudgeAiConfig {
  /** 关闭后只出代码层分，记录停在「待复核」 */
  enabled: boolean;
  /** 候选裁判，按顺序取第一个厂商与被评作品不同的；为空即不评 */
  judges: JudgeModel[];
  /** 单次裁判调用的超时（毫秒） */
  timeoutMs: number;
}

export interface JudgeConfig {
  /** 关闭后调用结束时不评审；已有的评审记录照常显示 */
  enabled: boolean;
  /** AI 语义层（ACR-020）；不写即关闭 */
  ai: JudgeAiConfig;
}

export interface AppConfig {
  schedule: ScheduleConfig;
  run: RunConfig;
  retention: RetentionConfig;
  /** 作品评审开关（ACR-019）；不写即开启 */
  judge: JudgeConfig;
  /** 成本上限；不写即不限 */
  budget: BudgetConfig;
  /** 上游类型清单，profiles[].upstreamType 的取值范围；未配置时为起步清单 */
  upstreamTypes: string[];
  /** 登记的非默认 profile；targets[].profile 只能引用这里的名字或 DEFAULT_PROFILE */
  profiles: ProfileConfig[];
  targets: Target[];
  /** 用户自定义的提示词条目，与内置预设合并 */
  customPrompts: PromptSpec[];
  /** 探测不到的模型可以在这里手填，主要服务于没有列举命令的 claude */
  customModels: Partial<Record<CliKind, string[]>>;
  /** 数据仓同步配置；未配置时为 null */
  dataRepo?: DataRepoConfig | null;
}

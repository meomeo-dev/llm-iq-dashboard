/**
 * 配置加载与校验。配置定义调度节奏与被测矩阵（policy）；调用与落盘机制在
 * adapters/ 与 store.ts。校验尽早失败（fail fast），启动时一次报出全部问题。
 */

import { Cron } from "croner";
import { constants, copyFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import {
  buildTargetId,
  CLI_KINDS,
  EFFORT_LEVELS,
  type CliKind,
  type EffortLevel,
  type Target,
} from "./types";
import { resolvePrompt, type PromptSpec } from "./prompt";
import { parsePrompts } from "./config-prompts";
import type { RotationConfig } from "./variables";
import type { BudgetConfig } from "./budget";
import { applyCeiling, readCeiling } from "./ceiling";

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

const DEFAULT_TIMEOUT_MS = 1_800_000;
const DEFAULT_CONCURRENCY = 2;

/** 与配置文件同目录的起步模板，随代码入库；配置文件本身不入库 */
const STARTER_FILE = "pelican.example.yaml";

/**
 * 配置文件不存在且同目录有起步模板时复制一份。只认同目录模板，路径写错时照常报错；
 * COPYFILE_EXCL 保证并发启动时只有一个进程复制成功。
 */
function ensureConfigFile(path: string): void {
  if (existsSync(path)) return;
  const starter = join(dirname(path), STARTER_FILE);
  if (!existsSync(starter)) return;
  try {
    copyFileSync(starter, path, constants.COPYFILE_EXCL);
    console.log(`已从 ${starter} 生成初始配置 ${path}`);
  } catch (cause) {
    if ((cause as NodeJS.ErrnoException).code !== "EEXIST") throw cause;
  }
}

/** 读取并校验配置文件，任何问题都汇总后一次性抛出；文件不存在时先按起步模板生成 */
export function loadConfig(path: string): AppConfig {
  ensureConfigFile(path);
  const raw = readRawConfig(path);
  const errors: string[] = [];

  const schedule = parseSchedule(raw.schedule, errors);
  const run = parseRun(raw.run, errors);
  const retention = parseRetention(raw.retention, errors);
  const budget = parseBudget(raw.budget, errors);
  const targets = parseTargets(raw.targets, run, errors);
  const customPrompts = parsePrompts(raw.prompts, errors);
  const customModels = parseCustomModels(raw.customModels, errors);
  const dataRepo = parseDataRepo(raw.dataRepo, errors);

  if (errors.length > 0) {
    throw new Error(`配置文件 ${path} 校验失败：\n  - ${errors.join("\n  - ")}`);
  }

  // 未知提示词由 registry 抛出带候选列表的错误
  for (const promptId of run.promptIds) resolvePrompt(promptId, customPrompts);

  // 宿主机上限最后套用：预算只能在上限之下，extraArgs 默认不放行
  return applyCeiling(
    { schedule, run, retention, budget, targets, customPrompts, customModels, dataRepo },
    readCeiling(),
  );
}

interface RawConfig {
  schedule?: unknown;
  run?: unknown;
  retention?: unknown;
  budget?: unknown;
  targets?: unknown;
  prompts?: unknown;
  customModels?: unknown;
  dataRepo?: unknown;
}

function readRawConfig(path: string): RawConfig {
  let text: string;
  try {
    text = readFileSync(path, "utf8");
  } catch (cause) {
    throw new Error(`无法读取配置文件 ${path}：${(cause as Error).message}`);
  }
  const parsed: unknown = parseYaml(text);
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`配置文件 ${path} 顶层必须是一个映射（mapping）`);
  }
  return parsed as RawConfig;
}

function parseSchedule(raw: unknown, errors: string[]): ScheduleConfig {
  const node = asRecord(raw) ?? {};
  const cron = optionalString(node.cron);
  const intervalMinutes = optionalNumber(node.intervalMinutes);
  const runOnStart = node.runOnStart === true;

  // 开关只有一个（看板的“自动任务”），配置里再写一个会让两处状态互相矛盾
  if ("enabled" in node) {
    errors.push(
      "schedule.enabled 不是配置项：到点是否执行由看板的“自动任务”开关决定，" +
        "请删除这一行；不要定时就同时删掉 cron 与 intervalMinutes",
    );
  }
  if (intervalMinutes !== null && intervalMinutes <= 0) {
    errors.push(`schedule.intervalMinutes 必须为正数，当前为 ${intervalMinutes}`);
  }
  const timezone = optionalString(node.timezone);
  // 调度器随配置热更新节奏，写坏的 cron 须在保存时拦下，而不是到重建定时器时才报。
  // croner 构造时只校验表达式，时区要到推算下一次触发时才校验，故两步都做
  if (cron !== null) {
    try {
      const probe = new Cron(cron, { paused: true, ...(timezone !== null ? { timezone } : {}) });
      probe.nextRun();
      probe.stop();
    } catch (cause) {
      errors.push(`schedule.cron 或 timezone 无效：${cause instanceof Error ? cause.message : String(cause)}`);
    }
  }
  if (runOnStart && cron === null && intervalMinutes === null) {
    errors.push("schedule.runOnStart 需要同时设置 cron 或 intervalMinutes");
  }
  return { cron, intervalMinutes, timezone, runOnStart };
}

/** 不写 retention 时全部保留；删除历史不可逆，须显式开启 */
function parseRetention(raw: unknown, errors: string[]): RetentionConfig {
  const node = asRecord(raw) ?? {};
  const days = optionalNumber(node.days);
  if (days !== null && (!Number.isInteger(days) || days < 1)) {
    errors.push(`retention.days 必须是不小于 1 的整数，当前为 ${days}`);
    return { days: null };
  }
  return { days };
}

/** budget.perRoundUsd / perDayUsd：正数美元，缺省为不限 */
function parseBudget(raw: unknown, errors: string[]): BudgetConfig {
  const node = asRecord(raw) ?? {};
  const cap = (key: "perRoundUsd" | "perDayUsd"): number | null => {
    if (node[key] === undefined || node[key] === null) return null;
    const value = optionalNumber(node[key]);
    if (value !== null && value > 0) return value;
    errors.push(`budget.${key} 必须是正数（美元），当前为 ${String(node[key])}`);
    return null;
  };
  return { perRoundUsd: cap("perRoundUsd"), perDayUsd: cap("perDayUsd") };
}

function parseRun(raw: unknown, errors: string[]): RunConfig {
  const node = asRecord(raw) ?? {};
  const concurrency = optionalNumber(node.concurrency) ?? DEFAULT_CONCURRENCY;
  const defaultTimeoutMs =
    optionalNumber(node.defaultTimeoutMs) ?? DEFAULT_TIMEOUT_MS;

  if (concurrency < 1) {
    errors.push(`run.concurrency 必须 >= 1，当前为 ${concurrency}`);
  }
  if (defaultTimeoutMs < 1000) {
    errors.push(`run.defaultTimeoutMs 至少 1000ms，当前为 ${defaultTimeoutMs}`);
  }
  return {
    promptIds: parsePromptIds(node, errors),
    concurrency,
    defaultTimeoutMs,
    timeoutByCli: parseTimeoutMap(node.timeoutByCli, "timeoutByCli", isCliKind, errors),
    timeoutByEffort: parseTimeoutMap(node.timeoutByEffort, "timeoutByEffort", isEffortLevel, errors),
    rotation: parseRotation(node.rotation, errors),
  };
}

const DEFAULT_ROTATION: RotationConfig = { period: "day", timeZone: "UTC" };

/** run.rotation：period 取 day / run，timezone 为 IANA 时区名 */
function parseRotation(raw: unknown, errors: string[]): RotationConfig {
  const node = asRecord(raw) ?? {};
  const period = optionalString(node.period) ?? DEFAULT_ROTATION.period;
  const timeZone = optionalString(node.timezone) ?? DEFAULT_ROTATION.timeZone;
  // 两项都校验后再返回，一次报全
  const validPeriod = period === "day" || period === "run";
  if (!validPeriod) errors.push(`run.rotation.period 只能是 day 或 run，当前为 ${period}`);
  if (!isKnownTimeZone(timeZone)) errors.push(`run.rotation.timezone 不是有效的时区名：${timeZone}`);
  if (!validPeriod || !isKnownTimeZone(timeZone)) return DEFAULT_ROTATION;
  return { period, timeZone };
}

function isKnownTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

/** 按 CLI 或按强度的超时覆盖，单位毫秒；键必须是已知的 CLI / 强度档位 */
function parseTimeoutMap<K extends string>(
  raw: unknown,
  field: string,
  isKnownKey: (key: string) => key is K,
  errors: string[],
): Partial<Record<K, number>> {
  if (raw === undefined || raw === null) return {};
  const node = asRecord(raw);
  if (node === null) {
    errors.push(`run.${field} 必须是一个映射`);
    return {};
  }

  const result: Partial<Record<K, number>> = {};
  for (const [key, value] of Object.entries(node)) {
    if (!isKnownKey(key)) {
      errors.push(`run.${field} 含有未知的键：${key}`);
      continue;
    }
    const ms = optionalNumber(value);
    if (ms === null || ms < 1000) {
      errors.push(`run.${field}.${key} 必须是不小于 1000 的毫秒数`);
      continue;
    }
    result[key] = ms;
  }
  return result;
}

/** 兼容单数形式 `promptId`，存在时优先于 promptIds */
function parsePromptIds(node: Record<string, unknown>, errors: string[]): string[] {
  const single = optionalString(node.promptId);
  if (single !== null) return [single];

  const raw = node.promptIds;
  if (raw === undefined || raw === null) return ["classic-v1"];
  if (!Array.isArray(raw)) {
    errors.push("run.promptIds 必须是字符串数组");
    return ["classic-v1"];
  }

  const ids = raw.filter((id): id is string => typeof id === "string" && id.trim() !== "");
  if (ids.length === 0) {
    errors.push("run.promptIds 为空");
    return ["classic-v1"];
  }
  return [...new Set(ids.map((id) => id.trim()))];
}

/** 手填模型清单，按 CLI 分组 */
function parseCustomModels(
  raw: unknown,
  errors: string[],
): Partial<Record<CliKind, string[]>> {
  if (raw === undefined || raw === null) return {};
  const node = asRecord(raw);
  if (node === null) {
    errors.push("customModels 必须是一个映射");
    return {};
  }

  const result: Partial<Record<CliKind, string[]>> = {};
  for (const [key, value] of Object.entries(node)) {
    if (!isCliKind(key)) {
      errors.push(`customModels 含有未知的 CLI：${key}`);
      continue;
    }
    if (!Array.isArray(value) || value.some((v) => typeof v !== "string")) {
      errors.push(`customModels.${key} 必须是字符串数组`);
      continue;
    }
    result[key] = (value as string[]).map((v) => v.trim()).filter((v) => v !== "");
  }
  return result;
}

function parseTargets(raw: unknown, run: RunConfig, errors: string[]): Target[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    errors.push("targets 必须是非空数组");
    return [];
  }

  const seen = new Set<string>();
  const targets: Target[] = [];

  raw.forEach((item, index) => {
    const where = `targets[${index}]`;
    const node = asRecord(item);
    if (!node) {
      errors.push(`${where} 必须是一个映射`);
      return;
    }
    const cli = optionalString(node.cli);
    const model = optionalString(node.model);
    const effort = optionalString(node.effort);

    if (!isCliKind(cli)) {
      errors.push(`${where}.cli 必须是 ${CLI_KINDS.join(" / ")}，当前为 ${cli}`);
      return;
    }
    if (model === null) {
      errors.push(`${where}.model 缺失`);
      return;
    }
    if (!isEffortLevel(effort)) {
      errors.push(
        `${where}.effort 必须是 ${EFFORT_LEVELS.join(" / ")}，当前为 ${effort}`,
      );
      return;
    }

    const id = buildTargetId(cli, model, effort);
    if (seen.has(id)) {
      errors.push(`${where} 与前面的条目重复：${id}`);
      return;
    }
    seen.add(id);

    targets.push({
      id,
      cli,
      model,
      effort,
      label: optionalString(node.label) ?? `${model} · ${effort}`,
      // 优先级：单项 > 按强度 > 按 CLI > 全局默认
      timeoutMs:
        optionalNumber(node.timeoutMs) ??
        run.timeoutByEffort[effort] ??
        run.timeoutByCli[cli] ??
        run.defaultTimeoutMs,
      extraArgs: parseExtraArgs(node.extraArgs, where, errors),
      enabled: node.enabled !== false,
    });
  });

  if (!targets.some((target) => target.enabled) && errors.length === 0) {
    errors.push("targets 中没有任何已启用的条目：定时任务至少要有一项");
  }
  return targets;
}

function parseExtraArgs(raw: unknown, where: string, errors: string[]): string[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw) || raw.some((arg) => typeof arg !== "string")) {
    errors.push(`${where}.extraArgs 必须是字符串数组`);
    return [];
  }
  return raw as string[];
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function optionalNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function isCliKind(value: string | null): value is CliKind {
  return value !== null && (CLI_KINDS as readonly string[]).includes(value);
}

function isEffortLevel(value: string | null): value is EffortLevel {
  return value !== null && (EFFORT_LEVELS as readonly string[]).includes(value);
}

/** dataRepo: path 必填（相对路径按 cwd 解析），autoSync / push 默认 false */
function parseDataRepo(raw: unknown, errors: string[]): DataRepoConfig | null {
  if (raw === undefined || raw === null) return null;
  const node = asRecord(raw);
  if (node === null) {
    errors.push("dataRepo 必须是一个映射");
    return null;
  }

  const rawPath = optionalString(node.path);
  if (rawPath === null) {
    errors.push("dataRepo.path 必填");
  }

  if (node.autoSync !== undefined && typeof node.autoSync !== "boolean") {
    errors.push("dataRepo.autoSync 必须是布尔值");
  }

  if (node.push !== undefined && typeof node.push !== "boolean") {
    errors.push("dataRepo.push 必须是布尔值");
  }

  if (rawPath === null) return null;
  return {
    path: resolve(process.cwd(), rawPath),
    autoSync: node.autoSync === true,
    push: node.push === true,
  };
}


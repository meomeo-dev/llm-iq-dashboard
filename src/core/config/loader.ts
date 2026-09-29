/**
 * 配置文件读取、结构解析与全量校验
 */

import { Cron } from "croner";
import { constants, copyFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import type { CliKind, EffortLevel } from "../types";
import { resolvePrompt } from "../prompt";
import { parsePrompts } from "../config-prompts";
import { applyCeiling, readCeiling } from "../ceiling";
import type { BudgetConfig } from "../budget";
import type { RotationConfig } from "../variables";
import type {
  AppConfig,
  DataRepoConfig,
  RetentionConfig,
  RunConfig,
  ScheduleConfig,
} from "./types";
import { asRecord, isCliKind, isEffortLevel, optionalNumber, optionalString } from "./parsers-common";
import { parseProfiles, parseUpstreamTypes } from "./profiles";
import { parseTargets } from "./targets";

const DEFAULT_TIMEOUT_MS = 1_800_000;
const DEFAULT_CONCURRENCY = 2;
const STARTER_FILE = "pelican.example.yaml";

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

interface RawConfig {
  schedule?: unknown;
  run?: unknown;
  retention?: unknown;
  budget?: unknown;
  upstreamTypes?: unknown;
  profiles?: unknown;
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

function validateCronExpression(cron: string, timezone: string | null, errors: string[]): void {
  try {
    const probe = new Cron(cron, { paused: true, ...(timezone !== null ? { timezone } : {}) });
    probe.nextRun();
    probe.stop();
  } catch (cause) {
    errors.push(`schedule.cron 或 timezone 无效：${cause instanceof Error ? cause.message : String(cause)}`);
  }
}

export function parseSchedule(raw: unknown, errors: string[]): ScheduleConfig {
  const node = asRecord(raw) ?? {};
  const cron = optionalString(node.cron);
  const intervalMinutes = optionalNumber(node.intervalMinutes);
  const runOnStart = node.runOnStart === true;
  const timezone = optionalString(node.timezone);

  if ("enabled" in node) {
    errors.push(
      "schedule.enabled 不是配置项：到点是否执行由看板的“自动任务”开关决定，" +
        "请删除这一行；不要定时就同时删掉 cron 与 intervalMinutes",
    );
  }
  if (intervalMinutes !== null && intervalMinutes <= 0) {
    errors.push(`schedule.intervalMinutes 必须为正数，当前为 ${intervalMinutes}`);
  }
  if (cron !== null) validateCronExpression(cron, timezone, errors);

  if (runOnStart && cron === null && intervalMinutes === null) {
    errors.push("schedule.runOnStart 需要同时设置 cron 或 intervalMinutes");
  }
  return { cron, intervalMinutes, timezone, runOnStart };
}

export function parseRetention(raw: unknown, errors: string[]): RetentionConfig {
  const node = asRecord(raw) ?? {};
  const days = optionalNumber(node.days);
  if (days !== null && (!Number.isInteger(days) || days < 1)) {
    errors.push(`retention.days 必须是不小于 1 的整数，当前为 ${days}`);
    return { days: null };
  }
  return { days };
}

export function parseBudget(raw: unknown, errors: string[]): BudgetConfig {
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

function parseTimeoutMap<K extends string>(
  raw: unknown,
  field: string,
  isValidKey: (key: string | null) => key is K,
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
    if (!isValidKey(key)) {
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

export function parseRun(raw: unknown, errors: string[]): RunConfig {
  const node = asRecord(raw) ?? {};
  const concurrency = optionalNumber(node.concurrency) ?? DEFAULT_CONCURRENCY;
  const defaultTimeoutMs = optionalNumber(node.defaultTimeoutMs) ?? DEFAULT_TIMEOUT_MS;

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

export function parseCustomModels(
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

export function parseDataRepo(raw: unknown, errors: string[]): DataRepoConfig | null {
  if (raw === undefined || raw === null) return null;
  const node = asRecord(raw);
  if (node === null) {
    errors.push("dataRepo 必须是一个映射");
    return null;
  }

  const rawPath = optionalString(node.path);
  if (rawPath === null) errors.push("dataRepo.path 必填");

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

/** 读取并校验配置文件，任何问题都汇总后一次性抛出；文件不存在时先按起步模板生成 */
export function loadConfig(path: string): AppConfig {
  ensureConfigFile(path);
  const raw = readRawConfig(path);
  const errors: string[] = [];

  const schedule = parseSchedule(raw.schedule, errors);
  const run = parseRun(raw.run, errors);
  const retention = parseRetention(raw.retention, errors);
  const budget = parseBudget(raw.budget, errors);
  const upstreamTypes = parseUpstreamTypes(raw.upstreamTypes, errors);
  const profiles = parseProfiles(raw.profiles, upstreamTypes, errors);
  const targets = parseTargets(raw.targets, run, profiles, errors);
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
    {
      schedule, run, retention, budget, upstreamTypes, profiles, targets,
      customPrompts, customModels, dataRepo,
    },
    readCeiling(),
  );
}

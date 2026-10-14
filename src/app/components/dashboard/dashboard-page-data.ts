import { loadConfig } from "@/core/config";
import { knownProfiles } from "@/core/data-source";
import { isRemoteDataSource } from "@/core/deploy-mode";
import { configPath } from "@/core/paths";
import {
  BUILTIN_PROMPTS,
  FRONTIER_INDIVIDUAL_PROMPT_MAP,
  listPrompts,
  type PromptSpec,
  type PromptStandard,
} from "@/core/prompt";
import { toProfileViews, type ProfileView } from "@/core/profile-view";
import type { DashboardCard } from "@/core/types";

const HOUR_MS = 60 * 60 * 1000;
/** 时区偏移范围 UTC−12 到 UTC+14，任一时区的某一天都落在 UTC 同名日期加此余量的窗口内 */
const EARLIEST_OFFSET_MS = 14 * HOUR_MS;
const LATEST_OFFSET_MS = 12 * HOUR_MS;
const DAY_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 只载入所选那天的轮次。服务端不知道浏览器所选时区，按覆盖所有时区的宽窗口取数，
 * 由客户端精确分天；未选日期时取最近 24 小时。
 */
export function cardWindow(dayKey: string | null, now: Date): { from: Date; to: Date } {
  const dayStart = dayKey !== null && DAY_KEY_PATTERN.test(dayKey) ? Date.parse(`${dayKey}T00:00:00Z`) : NaN;
  if (Number.isNaN(dayStart)) return { from: new Date(now.getTime() - 24 * HOUR_MS), to: new Date(now.getTime() + HOUR_MS) };
  return { from: new Date(dayStart - EARLIEST_OFFSET_MS), to: new Date(dayStart + 24 * HOUR_MS + LATEST_OFFSET_MS) };
}

/** 跨轮次、跨模型统一按执行时刻从新到旧；日期选择以此为序 */
export function sortNewestFirst(cards: readonly DashboardCard[]): DashboardCard[] {
  return [...cards].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

export interface DashboardSettings {
  prompts: readonly PromptSpec[];
  scheduleTimeZone: string | null;
  /**
   * 上游 profile 的公开视图（无接口地址与 key）：本地数据源来自配置；
   * 远程数据源只信已读到的记录（记录不带官网，展台不出外链），所以要在载入卡片之后再读
   */
  profiles: readonly ProfileView[];
}

/**
 * 提示词显示名取全部已登记条目（含已停用的），保证历史结果在筛选里显示正确名称。
 * 配置缺失或损坏时退回内置条目、不带调度时区，上游改从记录里取，页面仍能呈现历史。
 */
export function readDashboardSettings(): DashboardSettings {
  try {
    const config = loadConfig(configPath());
    return {
      prompts: listPrompts(config.customPrompts),
      scheduleTimeZone: config.schedule.timezone,
      profiles: isRemoteDataSource() ? knownProfiles() : toProfileViews(config.profiles),
    };
  } catch {
    return { prompts: BUILTIN_PROMPTS, scheduleTimeZone: null, profiles: knownProfiles() };
  }
}

/** 汇总题库标准映射：包含套题各候选的特异性标准与前沿独立题标准 */
export function buildPromptStandards(prompts: readonly PromptSpec[]): Record<string, PromptStandard> {
  const promptStandards: Record<string, PromptStandard> = {};
  for (const spec of prompts) {
    if (spec.standard) promptStandards[spec.id] = spec.standard;
    if (spec.candidates && spec.candidates.length > 0) {
      for (const cand of spec.candidates) {
        const candStd =
          cand.standard ??
          FRONTIER_INDIVIDUAL_PROMPT_MAP.get(cand.id)?.standard ??
          spec.standard;
        if (candStd) {
          promptStandards[`${spec.id}::${cand.label}`] = candStd;
          promptStandards[`${spec.id}::${cand.id}`] = candStd;
          promptStandards[cand.label] = candStd;
          promptStandards[cand.id] = candStd;
        }
      }
    }
  }
  for (const [id, spec] of FRONTIER_INDIVIDUAL_PROMPT_MAP.entries()) {
    if (spec.standard) {
      promptStandards[id] = spec.standard;
      promptStandards[spec.label] = spec.standard;
    }
  }
  return promptStandards;
}

const REMOTE_CONTEXT_EN: Record<string, string> = {
  获取轮次开始时间列表失败: "Failed to fetch run start timestamps",
  加载轮次卡片数据失败: "Failed to load benchmark round cards",
  获取运行记录列表失败: "Failed to fetch run record list",
};

/** 将 RemoteDataSource 的中文降级/异常提示转换为当前语言 */
export function localizeRemoteNotice(notice: string, locale: "en" | "zh-CN" = "zh-CN"): string {
  if (locale !== "en") return notice;
  if (notice === "部分轮次加载失败") return "Some benchmark rounds failed to load";
  if (notice === "全部轮次加载失败") return "All benchmark rounds failed to load";
  const repoVer = /^不支持的数据仓版本 \(schemaVersion: (.+)\)，请升级看板$/.exec(notice);
  if (repoVer) return `Unsupported data repository schema (schemaVersion: ${repoVer[1]}). Please upgrade the dashboard.`;
  const dayVer = /^不支持的日索引版本 \(schemaVersion: (.+)\)，请升级看板$/.exec(notice);
  if (dayVer) return `Unsupported day index schema (schemaVersion: ${dayVer[1]}). Please upgrade the dashboard.`;
  const runVer = /^不支持的运行记录版本 \(publicSchemaVersion: (.+)\)，请升级看板$/.exec(notice);
  if (runVer) return `Unsupported run record schema (publicSchemaVersion: ${runVer[1]}). Please upgrade the dashboard.`;
  const pullErr = /^(.+)：远程数据源拉取失败（(.+)）$/.exec(notice);
  if (pullErr) {
    const ctx = REMOTE_CONTEXT_EN[pullErr[1]!] ?? pullErr[1]!;
    const detail = pullErr[2]!
      .replace("数据仓清单缺少 days 数组", "Data repository manifest is missing the days array")
      .replace("日索引缺少 runs 数组", "Day index is missing the runs array")
      .replace("运行记录缺少 attempts 数组", "Run record is missing the attempts array")
      .replace(/^解析 JSON 失败 /u, "Failed to parse JSON ");
    return `${ctx}: remote data source fetch failed (${detail})`;
  }
  return notice;
}

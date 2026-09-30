import { loadConfig } from "@/core/config";
import { knownProfiles } from "@/core/data-source";
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
   * 上游 profile 的公开视图（无接口地址与 key）：有配置时来自配置；
   * 没有（展台、远程数据源）时来自已读到的记录，所以要在载入卡片之后再读
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
    const configured = toProfileViews(config.profiles);
    return {
      prompts: listPrompts(config.customPrompts),
      scheduleTimeZone: config.schedule.timezone,
      profiles: configured.length > 0 ? configured : knownProfiles(),
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

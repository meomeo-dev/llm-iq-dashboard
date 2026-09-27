/**
 * 工具栏的筛选状态：每个维度（即卡片字段名）一个隐藏集合，新出现的取值默认可见。
 */

import type { DashboardCard } from "@/core/types";

export const FILTER_KEYS = ["cli", "model", "effort", "promptId"] as const;

export type FilterKey = (typeof FILTER_KEYS)[number];

export type HiddenFilters = Readonly<Record<FilterKey, ReadonlySet<string>>>;

export const NO_FILTERS: HiddenFilters = {
  cli: new Set(),
  model: new Set(),
  effort: new Set(),
  promptId: new Set(),
};

export function isCardShown(card: DashboardCard, hidden: HiddenFilters): boolean {
  return FILTER_KEYS.every((key) => !hidden[key].has(card[key]));
}

export function isFiltered(hidden: HiddenFilters): boolean {
  return FILTER_KEYS.some((key) => hidden[key].size > 0);
}

/**
 * 工具栏的筛选状态：每个维度一个隐藏集合，新出现的取值默认可见。
 * 维度即卡片字段名，只有 `profile` 例外：登录态的卡片没有该字段，记为 `default`。
 */

import { DEFAULT_PROFILE, type DashboardCard } from "@/core/types";

export const FILTER_KEYS = ["cli", "profile", "model", "effort", "promptId"] as const;

export type FilterKey = (typeof FILTER_KEYS)[number];

export type HiddenFilters = Readonly<Record<FilterKey, ReadonlySet<string>>>;

export const NO_FILTERS: HiddenFilters = {
  cli: new Set(),
  profile: new Set(),
  model: new Set(),
  effort: new Set(),
  promptId: new Set(),
};

/** 卡片在某个维度上的取值 */
export function cardFilterValue(card: DashboardCard, key: FilterKey): string {
  return key === "profile" ? (card.profile ?? DEFAULT_PROFILE) : card[key];
}

export function isCardShown(card: DashboardCard, hidden: HiddenFilters): boolean {
  return FILTER_KEYS.every((key) => !hidden[key].has(cardFilterValue(card, key)));
}

export function isFiltered(hidden: HiddenFilters): boolean {
  return FILTER_KEYS.some((key) => hidden[key].size > 0);
}

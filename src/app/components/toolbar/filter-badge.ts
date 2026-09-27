import type { CheckItem } from "./CheckList";
import type { FilterGroup } from "./FilterMenu";
import type { HiddenFilters } from "./filters";

/**
 * 部分筛掉时显示 “3/5”，否则显示总数。只数当天列出的取值：隐藏集合可能含别的日子
 * 才有的取值，不能用它的大小相减。
 */
export function calculateFilterBadge(
  items: readonly CheckItem[],
  hidden: ReadonlySet<string>,
): { text: string; filtered: boolean } {
  const total = items.length;
  const shown = items.filter((item) => !hidden.has(item.value)).length;
  return shown === total ? { text: String(total), filtered: false } : { text: `${shown}/${total}`, filtered: true };
}

export function countFilteredGroups(groups: readonly FilterGroup[], hidden: HiddenFilters): number {
  return groups.filter((group) => calculateFilterBadge(group.items, hidden[group.key]).filtered).length;
}

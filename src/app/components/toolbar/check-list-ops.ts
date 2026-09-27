/**
 * 筛选菜单复选清单的纯集合操作逻辑。
 *
 * 状态为隐藏集合（hidden），新出现的取值默认可见；
 * 批量操作只作用于清单里列出的取值，当天未出现的取值保持不变。
 */

export function isAllShown(hidden: ReadonlySet<string>, values: readonly string[]): boolean {
  return values.every((value) => !hidden.has(value));
}

export function showAllHidden(hidden: ReadonlySet<string>, values: readonly string[]): Set<string> {
  const valueSet = new Set(values);
  return new Set([...hidden].filter((value) => !valueSet.has(value)));
}

export function invertHidden(hidden: ReadonlySet<string>, values: readonly string[]): Set<string> {
  const next = new Set(hidden);
  for (const value of values) {
    if (next.has(value)) next.delete(value);
    else next.add(value);
  }
  return next;
}

export function toggleHidden(hidden: ReadonlySet<string>, value: string): Set<string> {
  const next = new Set(hidden);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

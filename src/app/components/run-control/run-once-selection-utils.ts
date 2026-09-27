/**
 * “跑一次”多选集合的纯函数操作。
 */

export function toggled(set: ReadonlySet<string>, ids: readonly string[]): ReadonlySet<string> {
  const next = new Set(set);
  for (const id of ids) {
    if (next.has(id)) next.delete(id);
    else next.add(id);
  }
  return next;
}

export function without(set: ReadonlySet<string>, ids: readonly string[]): ReadonlySet<string> {
  return new Set([...set].filter((id) => !ids.includes(id)));
}

"use client";

export interface CheckItem {
  value: string;
  label: string;
  count: number;
  /** 行首的小标记，如 CLI 的纹理色块 */
  marker?: React.ReactNode;
}

interface CheckListProps {
  items: readonly CheckItem[];
  /** 被筛掉的取值；勾选 = 不在其中 */
  hidden: ReadonlySet<string>;
  onChange: (hidden: ReadonlySet<string>) => void;
}

/**
 * 筛选菜单的复选清单，顶部是批量操作。状态为隐藏集合，新出现的取值默认可见；
 * 批量操作只作用于清单里列出的取值，当天未出现的取值保持不变。
 */
export function CheckList({ items, hidden, onChange }: CheckListProps) {
  const values = items.map((item) => item.value);
  const allShown = values.every((value) => !hidden.has(value));

  const showAll = (): void => onChange(new Set([...hidden].filter((value) => !values.includes(value))));
  const invert = (): void => {
    const next = new Set(hidden);
    for (const value of values) {
      if (next.has(value)) next.delete(value);
      else next.add(value);
    }
    onChange(next);
  };
  const toggle = (value: string): void => {
    const next = new Set(hidden);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    onChange(next);
  };

  return (
    <>
      <div className="check-bulk">
        <button type="button" onClick={showAll} disabled={allShown}>
          全选
        </button>
        <button type="button" onClick={invert} disabled={items.length === 0}>
          反选
        </button>
      </div>
      {items.map((item) => (
        <label key={item.value} className="menu-row">
          <input type="checkbox" checked={!hidden.has(item.value)} onChange={() => toggle(item.value)} />
          <span className="checkbox" aria-hidden="true" />
          {item.marker}
          <span className="menu-row-name">{item.label}</span>
          <span className="menu-row-count">{item.count}</span>
        </label>
      ))}
    </>
  );
}

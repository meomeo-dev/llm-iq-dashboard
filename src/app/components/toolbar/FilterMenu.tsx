"use client";

import { useState } from "react";
import { CheckList, type CheckItem } from "./CheckList";
import type { FilterKey, HiddenFilters } from "./filters";
import { Menu } from "../menu/Menu";

export interface FilterGroup {
  key: FilterKey;
  label: string;
  items: CheckItem[];
}

interface FilterMenuProps {
  groups: readonly FilterGroup[];
  hidden: HiddenFilters;
  onHidden: (key: FilterKey, values: ReadonlySet<string>) => void;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

/**
 * 两级筛选菜单：左列是维度（CLI / 模型 / 强度 / 提示词），右侧是所选维度的复选清单。
 * 按钮徽章为正在筛选的维度数，未筛选时不显示。
 */
export function FilterMenu({ groups, hidden, onHidden, open, onToggle, onClose }: FilterMenuProps) {
  const [activeKey, setActiveKey] = useState<FilterKey>("cli");
  const active = groups.find((group) => group.key === activeKey) ?? groups[0];
  const filteredCount = groups.filter((group) => badge(group.items, hidden[group.key]).filtered).length;

  return (
    <Menu
      label="筛选"
      badge={filteredCount > 0 ? { text: String(filteredCount), filtered: true } : undefined}
      panelClassName="filter-panel"
      open={open}
      onToggle={onToggle}
      onClose={onClose}
    >
      <div className="filter-panel-head-bar">
        <span className="filter-panel-title">结果筛选</span>
        <button type="button" className="filter-panel-close-btn" onClick={onClose} aria-label="关闭">
          ✕
        </button>
      </div>
      <div className="filter-panel-content">
        <div className="filter-groups" role="tablist" aria-label="筛选维度">
          {groups.map((group) => {
            const groupBadge = badge(group.items, hidden[group.key]);
            return (
              <button
                key={group.key}
                type="button"
                role="tab"
                aria-selected={group.key === active?.key}
                className="filter-group"
                onClick={() => setActiveKey(group.key)}
                onPointerEnter={() => setActiveKey(group.key)}
              >
                <span>{group.label}</span>
                <span className={groupBadge.filtered ? "menu-badge filtered" : "menu-badge"}>{groupBadge.text}</span>
                <span className="filter-group-arrow" aria-hidden="true">
                  ›
                </span>
              </button>
            );
          })}
        </div>
        {active !== undefined && (
          <div className="filter-items" role="tabpanel">
            <CheckList
              items={active.items}
              hidden={hidden[active.key]}
              onChange={(values) => onHidden(active.key, values)}
            />
          </div>
        )}
      </div>
    </Menu>
  );
}

/**
 * 部分筛掉时显示 “3/5”，否则显示总数。只数当天列出的取值：隐藏集合可能含别的日子
 * 才有的取值，不能用它的大小相减。
 */
function badge(items: readonly CheckItem[], hidden: ReadonlySet<string>): { text: string; filtered: boolean } {
  const total = items.length;
  const shown = items.filter((item) => !hidden.has(item.value)).length;
  return shown === total ? { text: String(total), filtered: false } : { text: `${shown}/${total}`, filtered: true };
}

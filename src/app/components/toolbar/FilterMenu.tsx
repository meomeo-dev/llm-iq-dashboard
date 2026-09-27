"use client";

import { useState } from "react";
import { CheckList, type CheckItem } from "./CheckList";
import { countFilteredGroups } from "./filter-badge";
import type { FilterKey, HiddenFilters } from "./filters";
import { FilterTabs } from "./FilterTabs";
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
  const filteredCount = countFilteredGroups(groups, hidden);

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
        <FilterTabs groups={groups} activeKey={active?.key ?? "cli"} hidden={hidden} onSelectKey={setActiveKey} />
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

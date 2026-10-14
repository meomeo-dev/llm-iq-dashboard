import { useI18n } from "@/i18n";
import type { FilterGroup } from "./FilterMenu";
import type { FilterKey, HiddenFilters } from "./filters";
import { calculateFilterBadge } from "./filter-badge";

interface FilterTabsProps {
  groups: readonly FilterGroup[];
  activeKey: FilterKey;
  hidden: HiddenFilters;
  onSelectKey: (key: FilterKey) => void;
}

export function FilterTabs({ groups, activeKey, hidden, onSelectKey }: FilterTabsProps) {
  const { locale } = useI18n();
  return (
    <div className="filter-groups" role="tablist" aria-label={locale === "en" ? "Filter dimensions" : "筛选维度"}>
      {groups.map((group) => {
        const groupBadge = calculateFilterBadge(group.items, hidden[group.key]);
        return (
          <button
            key={group.key}
            type="button"
            role="tab"
            aria-selected={group.key === activeKey}
            className="filter-group"
            onClick={() => onSelectKey(group.key)}
            onPointerEnter={() => onSelectKey(group.key)}
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
  );
}

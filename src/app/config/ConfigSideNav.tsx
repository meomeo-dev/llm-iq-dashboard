"use client";

import React, { useEffect, useState } from "react";
import { CONFIG_NAV_ITEMS, type ConfigNavItem } from "./config-nav-items";

export interface ConfigSideNavProps {
  items?: readonly ConfigNavItem[];
  activeId?: string;
}

/** 监听视口可见区块及 URL hash 变化，推导当前激活的导航项 id */
function useActiveSectionId(
  items: readonly ConfigNavItem[],
  controlledId?: string
): [string, (id: string) => void] {
  const [activeId, setActiveId] = useState<string>(
    () => controlledId ?? items[0]?.id ?? ""
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hashId = window.location.hash.replace(/^#/, "");
    if (hashId && items.some((item) => item.id === hashId)) {
      setActiveId(hashId);
    }

    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        visible.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );
        setActiveId(visible[0]!.target.id);
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  return [controlledId ?? activeId, setActiveId];
}

/** 平滑滚动到目标元素并同步更新 URL hash */
function navigateToSection(item: ConfigNavItem): void {
  const el = document.getElementById(item.id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
  if (typeof window !== "undefined") {
    window.history.pushState(null, "", item.href);
  }
}

/** 配置页左侧固定导航栏（移动端折叠为横向滚动胶囊条） */
export function ConfigSideNav({
  items = CONFIG_NAV_ITEMS,
  activeId: controlledId,
}: ConfigSideNavProps): React.JSX.Element {
  const [currentId, setActiveId] = useActiveSectionId(items, controlledId);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: ConfigNavItem
  ) => {
    e.preventDefault();
    setActiveId(item.id);
    navigateToSection(item);
  };

  return (
    <nav className="config-side-nav" aria-label="配置页导航">
      <ul className="config-nav-list">
        {items.map((item) => {
          const isCurrent = item.id === currentId;
          return (
            <li key={item.id} className="config-nav-item">
              <a
                href={item.href}
                className={`config-nav-link${isCurrent ? " active" : ""}`}
                aria-current={isCurrent ? "location" : undefined}
                onClick={(e) => handleClick(e, item)}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

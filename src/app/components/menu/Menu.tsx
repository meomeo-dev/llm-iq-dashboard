"use client";

import { useEffect, useRef } from "react";

export interface MenuProps {
  label: React.ReactNode;
  /** 靠右的菜单向左展开，免得面板超出窗口 */
  align?: "left" | "right";
  badge?: { text: string; filtered: boolean };
  /** 面板的附加类名，用于内容较宽的面板 */
  panelClassName?: string;
  /** 按钮的附加类名，用于堆叠块里的小号按钮 */
  buttonClassName?: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

/** 折叠菜单：按钮 + 下拉面板；点面板外或按 Esc 关闭 */
export function Menu(props: MenuProps) {
  const { label, align = "left", badge, panelClassName, buttonClassName, open, onToggle, onClose, children } = props;
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent): void => {
      if (root.current !== null && !root.current.contains(event.target as Node)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div className="menu" ref={root}>
      <button
        type="button"
        className={["menu-button", buttonClassName].filter(Boolean).join(" ")}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={onToggle}
      >
        {label}
        {badge !== undefined && <span className={badge.filtered ? "menu-badge filtered" : "menu-badge"}>{badge.text}</span>}
        <span className="caret" aria-hidden="true" />
      </button>
      {open && (
        <>
          <div className="menu-backdrop" onPointerDown={onClose} aria-hidden="true" />
          <div className={["menu-panel", align === "right" && "align-right", panelClassName].filter(Boolean).join(" ")} role="menu">
            {children}
          </div>
        </>
      )}
    </div>
  );
}

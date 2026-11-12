"use client";

import { useEffect, useId, useRef } from "react";
import { useMenuDismiss } from "./use-menu-dismiss";
import { getTabStops, hasActiveOverlay, isInsideActiveOverlay } from "../ui/use-overlay-stack";

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
  /** 挂载在 .menu 根容器下但位于 .menu-panel 之外的二级浮层（避免被 .menu-panel 的 transform 限制 fixed 包含块） */
  afterPanel?: React.ReactNode;
}

/** 折叠菜单：按钮 + 下拉面板；点面板外或按 Esc 关闭 */
export function Menu(props: MenuProps) {
  const { label, align = "left", badge, panelClassName, buttonClassName, open, onToggle, onClose, children, afterPanel } = props;
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const panelId = useId();
  useMenuDismiss(open, root, onClose, trigger);

  useEffect(() => {
    if (open && panel.current && document.activeElement === trigger.current) {
      getTabStops(panel.current)[0]?.focus({ preventScroll: true });
    }
  }, [open]);

  return (
    <div className="menu" ref={root} onKeyDown={(event) => {
      if (!open || event.key !== "Escape" || event.defaultPrevented) return;
      if (hasActiveOverlay() && !isInsideActiveOverlay(root.current)) return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
      trigger.current?.focus({ preventScroll: true });
    }}>
      <button
        ref={trigger}
        type="button"
        className={["menu-button", buttonClassName].filter(Boolean).join(" ")}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={onToggle}
      >
        {label}
        {badge !== undefined && <span className={badge.filtered ? "menu-badge filtered" : "menu-badge"}>{badge.text}</span>}
        <span className="caret" aria-hidden="true" />
      </button>
      {open && (
        <>
          <div className="menu-backdrop" onPointerDown={onClose} aria-hidden="true" />
          <div id={panelId} ref={panel}
            className={["menu-panel", align === "right" && "align-right", panelClassName].filter(Boolean).join(" ")}
            role="menu">
            {children}
          </div>
          {afterPanel}
        </>
      )}
    </div>
  );
}

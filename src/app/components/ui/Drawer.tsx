"use client";

import React, { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useOverlayStack } from "./use-overlay-stack";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  ariaLabel?: string;
  subtitle?: React.ReactNode;
  toolbar?: React.ReactNode;
  closeLabel?: string;
  portal?: boolean;
  backdropClassName?: string;
  className?: string;
  bodyClassName?: string;
  children?: React.ReactNode;
}

/**
 * 统一右侧滑出抽屉原语（复用 `useOverlayStack`，具备 Escape 关闭、背景滚动锁定与防拖拽误关能力）。
 */
export function Drawer({
  open,
  onClose,
  title,
  ariaLabel,
  subtitle,
  toolbar,
  closeLabel = "Close",
  portal = false,
  backdropClassName,
  className,
  bodyClassName,
  children,
}: DrawerProps): React.ReactElement | null {
  useOverlayStack(open, onClose);
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open) return null;

  const backdropClasses = ["ui-drawer-backdrop", backdropClassName].filter(Boolean).join(" ");
  const drawerClasses = ["ui-drawer", className].filter(Boolean).join(" ");
  const bodyClasses = ["ui-drawer-body", bodyClassName].filter(Boolean).join(" ");

  const node = (
    <div
      className={backdropClasses}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        className={drawerClasses}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : titleId}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header className="ui-drawer-head">
          <div className="ui-modal-title-group">
            <h3 id={titleId} className="ui-modal-title">
              {title}
            </h3>
            {subtitle !== undefined && subtitle !== null ? (
              <div className="ui-modal-subtitle">{subtitle}</div>
            ) : null}
          </div>
          <button
            type="button"
            className="ui-overlay-close"
            onClick={onClose}
            aria-label={closeLabel}
            title={closeLabel}
          >
            ×
          </button>
        </header>
        {toolbar !== undefined && toolbar !== null ? (
          <div className="ui-drawer-toolbar">{toolbar}</div>
        ) : null}
        <div className={bodyClasses}>{children}</div>
      </aside>
    </div>
  );

  if (portal && mounted && typeof document !== "undefined") {
    return createPortal(node, document.body);
  }
  return node;
}

export interface CollapsibleProps {
  summary: React.ReactNode;
  summaryExtra?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  className?: string;
  summaryClassName?: string;
  bodyClassName?: string;
  children?: React.ReactNode;
}

/**
 * 统一页内原生 `<details>` 折叠面板原语：带自动旋转指示箭头与右侧摘要槽。
 */
export function Collapsible({
  summary,
  summaryExtra,
  defaultOpen,
  open,
  onToggle,
  className,
  summaryClassName,
  bodyClassName,
  children,
}: CollapsibleProps): React.ReactElement {
  const detailsClasses = ["ui-collapsible", className].filter(Boolean).join(" ");
  const summaryClasses = ["ui-collapsible-summary", summaryClassName].filter(Boolean).join(" ");
  const bodyClasses = ["ui-collapsible-body", bodyClassName].filter(Boolean).join(" ");

  return (
    <details
      className={detailsClasses}
      open={open ?? defaultOpen}
      onToggle={
        onToggle
          ? (event) => onToggle((event.currentTarget as HTMLDetailsElement).open)
          : undefined
      }
    >
      <summary className={summaryClasses}>
        <span className="ui-collapsible-label">
          <span className="ui-collapsible-arrow" aria-hidden="true">
            ▸
          </span>
          {summary}
        </span>
        {summaryExtra !== undefined && summaryExtra !== null ? (
          <span className="ui-collapsible-extra">{summaryExtra}</span>
        ) : null}
      </summary>
      <div className={bodyClasses}>{children}</div>
    </details>
  );
}

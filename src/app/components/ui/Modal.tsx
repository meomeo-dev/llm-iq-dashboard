"use client";

import React, { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useOverlayStack } from "./use-overlay-stack";

export type ModalSize = "sm" | "md" | "lg" | "columns";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  ariaLabel?: string;
  subtitle?: React.ReactNode;
  headerActions?: React.ReactNode;
  subHeader?: React.ReactNode;
  footer?: React.ReactNode;
  closeLabel?: string;
  size?: ModalSize;
  colCount?: number;
  portal?: boolean;
  backdropClassName?: string;
  className?: string;
  bodyClassName?: string;
  children?: React.ReactNode;
}

interface ModalDialogHeaderProps {
  titleId: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  headerActions?: React.ReactNode;
  closeLabel: string;
  onClose: () => void;
}

function ModalDialogHeader({
  titleId,
  title,
  subtitle,
  headerActions,
  closeLabel,
  onClose,
}: ModalDialogHeaderProps): React.ReactElement {
  return (
    <header className="ui-modal-head">
      <div className="ui-modal-title-group">
        <h2 id={titleId} className="ui-modal-title">
          {title}
        </h2>
        {subtitle !== undefined && subtitle !== null ? (
          <div className="ui-modal-subtitle">{subtitle}</div>
        ) : null}
      </div>
      <div className="ui-modal-head-actions">
        {headerActions}
        <button
          type="button"
          className="ui-overlay-close"
          onClick={onClose}
          aria-label={closeLabel}
          title={closeLabel}
        >
          ×
        </button>
      </div>
    </header>
  );
}

/**
 * 统一模态弹窗原语：
 * - 集成 `useOverlayStack`（Escape 栈顶响应、滚动锁定、焦点恢复、防穿透关闭父级 Menu）
 * - 默认原位渲染（100% 兼容 `renderToStaticMarkup` 无 DOM 单测）；即使开启 `portal={true}`，
 *   SSR 阶段仍原位输出完整 DOM 树，仅在客户端挂载后通过 `createPortal` 挂入 `document.body`。
 */
export function Modal(props: ModalProps): React.ReactElement | null {
  const { open, onClose, closeLabel = "Close", size = "md", portal = false } = props;
  useOverlayStack(open, onClose);
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open) return null;

  const backdropClasses = ["ui-modal-backdrop", props.backdropClassName].filter(Boolean).join(" ");
  const dialogClasses = ["ui-modal", `ui-modal-${size}`, props.className].filter(Boolean).join(" ");
  const bodyClasses = ["ui-modal-body", props.bodyClassName].filter(Boolean).join(" ");
  const dialogStyle =
    props.colCount !== undefined
      ? ({ "--col-count": props.colCount, "--upstream-count": props.colCount } as React.CSSProperties)
      : undefined;

  const node = (
    <div
      className={backdropClasses}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={dialogClasses}
        style={dialogStyle}
        role="dialog"
        aria-modal="true"
        aria-label={props.ariaLabel}
        aria-labelledby={props.ariaLabel ? undefined : titleId}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <ModalDialogHeader
          titleId={titleId}
          title={props.title}
          subtitle={props.subtitle}
          headerActions={props.headerActions}
          closeLabel={closeLabel}
          onClose={onClose}
        />
        {props.subHeader}
        <div className={bodyClasses}>{props.children}</div>
        {props.footer !== undefined && props.footer !== null ? (
          <footer className="ui-modal-foot">{props.footer}</footer>
        ) : null}
      </div>
    </div>
  );

  if (portal && mounted && typeof document !== "undefined") {
    return createPortal(node, document.body);
  }
  return node;
}

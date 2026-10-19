"use client";

import React, { useState } from "react";
import Link from "next/link";

export type ButtonVariant = "default" | "primary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  busy?: boolean;
  busyLabel?: React.ReactNode;
}

function buildButtonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  busy: boolean,
  className?: string,
): string {
  return ["ui-btn", `ui-btn-${variant}`, `ui-btn-${size}`, busy ? "is-busy" : "", className]
    .filter(Boolean)
    .join(" ");
}

/**
 * 统一按钮原语：支持 4 种语义变体、2 档尺寸，以及 1×1 Grid 防抖动叠层（busyLabel）。
 */
export function Button({
  variant = "default",
  size = "md",
  busy = false,
  busyLabel,
  type = "button",
  disabled,
  className,
  children,
  ...rest
}: ButtonProps): React.ReactElement {
  const classes = buildButtonClasses(variant, size, busy, className);
  const isDisabled = Boolean(disabled || busy);

  return (
    <button type={type} disabled={isDisabled} className={classes} {...rest}>
      {busyLabel !== undefined ? (
        <span className="ui-btn-stack">
          <span className={busy ? "ui-btn-layer is-hidden" : "ui-btn-layer"}>{children}</span>
          <span
            className={busy ? "ui-btn-layer" : "ui-btn-layer is-hidden"}
            aria-hidden={!busy}
          >
            {busyLabel}
          </span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export interface ButtonLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * 具备与 Button 一致视觉样式的路由导航链接原语（替代幽灵类 `<a className="button">`）。
 */
export function ButtonLink({
  href,
  variant = "default",
  size = "md",
  className,
  children,
  ...rest
}: ButtonLinkProps): React.ReactElement {
  const classes = buildButtonClasses(variant, size, false, className);
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

export interface ConfirmButtonProps extends Omit<ButtonProps, "onClick"> {
  confirmLabel: React.ReactNode;
  cancelLabel?: React.ReactNode;
  confirmPrompt?: React.ReactNode;
  confirmVariant?: ButtonVariant;
  onConfirm: () => Promise<void> | void;
}

/**
 * 统一二次确认按钮原语（idle -> confirming -> busy），用于停止运行、重置样本、删除配置等高危操作。
 */
export function ConfirmButton({
  confirmLabel,
  cancelLabel = "Cancel",
  confirmPrompt,
  confirmVariant = "danger",
  onConfirm,
  variant = "default",
  size = "md",
  busy = false,
  busyLabel,
  disabled,
  className,
  children,
  ...rest
}: ConfirmButtonProps): React.ReactElement {
  const [confirming, setConfirming] = useState(false);
  const [internalBusy, setInternalBusy] = useState(false);
  const isBusy = busy || internalBusy;

  if (!confirming) {
    return (
      <Button
        variant={variant}
        size={size}
        busy={isBusy}
        busyLabel={busyLabel}
        disabled={disabled}
        className={className}
        onClick={() => setConfirming(true)}
        {...rest}
      >
        {children}
      </Button>
    );
  }

  const handleConfirm = async (): Promise<void> => {
    setInternalBusy(true);
    try {
      await onConfirm();
    } finally {
      setInternalBusy(false);
      setConfirming(false);
    }
  };

  return (
    <span className="ui-confirm-group">
      {confirmPrompt ? <span className="ui-confirm-prompt">{confirmPrompt}</span> : null}
      <Button
        variant={confirmVariant}
        size={size}
        busy={isBusy}
        busyLabel={busyLabel}
        disabled={disabled}
        onClick={() => {
          void handleConfirm();
        }}
      >
        {confirmLabel}
      </Button>
      <Button
        variant="default"
        size={size}
        disabled={isBusy}
        onClick={() => setConfirming(false)}
      >
        {cancelLabel}
      </Button>
    </span>
  );
}

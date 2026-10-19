import React from "react";

export type AlertBannerTone = "info" | "ok" | "warn" | "err";

export interface AlertBannerProps {
  tone?: AlertBannerTone;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
  role?: "status" | "alert";
  className?: string;
  children?: React.ReactNode;
}

/**
 * 统一页内状态通知横幅原语（支持 4 种语义色调、右侧操作槽与关闭按钮，零内联颜色覆盖）。
 */
export function AlertBanner({
  tone = "info",
  title,
  actions,
  onDismiss,
  dismissLabel = "Dismiss",
  role = "status",
  className,
  children,
}: AlertBannerProps): React.ReactElement {
  const classes = ["ui-alert-banner", `ui-alert-${tone}`, className].filter(Boolean).join(" ");

  return (
    <div className={classes} role={role}>
      <div className="ui-alert-content">
        {title !== undefined && title !== null ? (
          <span className="ui-alert-title">{title}</span>
        ) : null}
        {children !== undefined && children !== null ? (
          <div className="ui-alert-body">{children}</div>
        ) : null}
      </div>
      {actions || onDismiss ? (
        <div className="ui-alert-actions">
          {actions}
          {onDismiss ? (
            <button
              type="button"
              className="ui-overlay-close"
              onClick={onDismiss}
              aria-label={dismissLabel}
              title={dismissLabel}
            >
              ×
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export interface EmptyStateProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/**
 * 统一空状态引导面板原语（用于无运行记录、筛选结果为空、尚未执行指纹核验等场景）。
 */
export function EmptyState({
  title,
  description,
  action,
  className,
  children,
}: EmptyStateProps): React.ReactElement {
  const classes = ["ui-empty-state", className].filter(Boolean).join(" ");

  return (
    <section className={classes}>
      <h2 className="ui-empty-title">{title}</h2>
      {description !== undefined && description !== null ? (
        <p className="ui-empty-desc">{description}</p>
      ) : null}
      {children}
      {action ? <div className="ui-empty-actions">{action}</div> : null}
    </section>
  );
}

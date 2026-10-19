import React from "react";
import Link from "next/link";

export interface PageShellProps {
  width?: "wide" | "narrow" | "full";
  as?: "main" | "div";
  className?: string;
  children?: React.ReactNode;
}

/**
 * 统一页面级宽度与内边距外壳（wide=1600px, narrow=720px, full=100vw）。
 */
export function PageShell({
  width = "wide",
  as: Tag = "main",
  className,
  children,
}: PageShellProps): React.ReactElement {
  const classes = ["ui-page-shell", `ui-page-shell-${width}`, className]
    .filter(Boolean)
    .join(" ");
  return <Tag className={classes}>{children}</Tag>;
}

export interface PageHeaderProps {
  title: React.ReactNode;
  titleClassName?: string;
  leadingSlot?: React.ReactNode;
  subtitle?: React.ReactNode;
  backHref?: string;
  backLabel?: React.ReactNode;
  centerSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  sticky?: boolean;
  className?: string;
}

/**
 * 统一二级页面与工具页顶栏（标题 + Next Link 返回导航 + 副标题块 + 居中区 + 右侧操作区）。
 * 返回链接与操作控件严格与 `<h1>` 兄弟并列，避免将交互控件嵌套进标题标签。
 */
export function PageHeader({
  title,
  titleClassName,
  leadingSlot,
  subtitle,
  backHref,
  backLabel,
  centerSlot,
  actionsSlot,
  sticky = false,
  className,
}: PageHeaderProps): React.ReactElement {
  const classes = ["ui-page-header", sticky ? "is-sticky" : "", className]
    .filter(Boolean)
    .join(" ");
  const titleClasses = ["ui-page-title", titleClassName].filter(Boolean).join(" ");

  return (
    <header className={classes}>
      <div className="ui-page-header-left">
        <div className="ui-page-title-row">
          {leadingSlot}
          <h1 className={titleClasses}>{title}</h1>
          {backHref && backLabel ? (
            <Link href={backHref} className="ui-back-link">
              {backLabel}
            </Link>
          ) : null}
        </div>
        {subtitle !== undefined && subtitle !== null ? (
          <div className="ui-page-subtitle">{subtitle}</div>
        ) : null}
      </div>
      {centerSlot ? <div className="ui-page-header-center">{centerSlot}</div> : null}
      {actionsSlot ? <div className="ui-page-header-actions">{actionsSlot}</div> : null}
    </header>
  );
}

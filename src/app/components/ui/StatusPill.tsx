import React from "react";

export type StatusPillTone = "neutral" | "ok" | "warn" | "err" | "accent";
export type StatusPillVariant = "subtle" | "outline" | "solid";

export interface StatusPillProps {
  tone?: StatusPillTone;
  variant?: StatusPillVariant;
  dot?: boolean;
  mono?: boolean;
  onClick?: () => void;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * 统一语义状态胶囊徽章（支持 5 种语义色、可选圆点指示器、等宽数字以及可点击交互态）。
 */
export function StatusPill({
  tone = "neutral",
  variant = "subtle",
  dot = false,
  mono = false,
  onClick,
  title,
  className,
  children,
}: StatusPillProps): React.ReactElement {
  const classes = [
    "ui-pill",
    `ui-pill-${tone}`,
    `ui-pill-${variant}`,
    mono ? "is-mono" : "",
    onClick ? "is-interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {dot ? <span className="ui-pill-dot" aria-hidden="true" /> : null}
      {children}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={classes} title={title} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <span className={classes} title={title}>
      {content}
    </span>
  );
}

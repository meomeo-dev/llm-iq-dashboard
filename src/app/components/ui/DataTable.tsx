import React from "react";

export type DataTableVariant = "matrix" | "compact";

export interface DataTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  variant?: DataTableVariant;
  stickyFirstColWidth?: string;
  wrapClassName?: string;
  scrollLabel?: string;
  children?: React.ReactNode;
}

/**
 * 统一数据表格原语：
 * - `variant="matrix"`：宽矩阵表，带横向滚动容器与 `.ui-col-sticky-1` / `.ui-col-sticky-2` 冻结列支持；
 * - `variant="compact"`：100% 适应父容器宽度，无最小宽度强制，适用于弹窗、抽屉与配置卡片内嵌表。
 */
export function DataTable({
  variant = "compact",
  stickyFirstColWidth,
  wrapClassName,
  scrollLabel,
  className,
  children,
  ...rest
}: DataTableProps): React.ReactElement {
  const wrapClasses = ["ui-table-wrap", wrapClassName].filter(Boolean).join(" ");
  const tableClasses = ["ui-table", `ui-table-${variant}`, className].filter(Boolean).join(" ");
  const wrapStyle = stickyFirstColWidth
    ? ({ "--ui-sticky-col-1-w": stickyFirstColWidth } as React.CSSProperties)
    : undefined;

  return (
    <div className={wrapClasses} style={wrapStyle}
      role={scrollLabel ? "region" : undefined} aria-label={scrollLabel}
      tabIndex={scrollLabel ? 0 : undefined}>
      <table className={tableClasses} {...rest}>
        {children}
      </table>
    </div>
  );
}

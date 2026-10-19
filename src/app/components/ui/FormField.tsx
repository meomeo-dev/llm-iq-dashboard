import React from "react";

export interface FormFieldProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  htmlFor?: string;
  layout?: "stack" | "inline";
  className?: string;
  children?: React.ReactNode;
}

/**
 * 统一表单字段包装器：提供作用域隔离的 `.ui-field` / `.ui-label` / `.ui-field-hint` / `.ui-field-error`，
 * 替代污染全局的裸 `label` / `input` / `select` 标签规则。
 */
export function FormField({
  label,
  hint,
  error,
  htmlFor,
  layout = "stack",
  className,
  children,
}: FormFieldProps): React.ReactElement {
  const classes = [
    "ui-field",
    layout === "inline" ? "ui-field-inline" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {label !== undefined && label !== null ? (
        <label className="ui-label" htmlFor={htmlFor}>
          {label}
        </label>
      ) : null}
      {children}
      {hint !== undefined && hint !== null ? (
        <span className="ui-field-hint">{hint}</span>
      ) : null}
      {error !== undefined && error !== null ? (
        <span className="ui-field-error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export interface CheckboxFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  hint?: React.ReactNode;
  rowClassName?: string;
}

/**
 * 统一复选框行原语（`.ui-check-row`），消除各页面自定义 `.checkbox` 与内联 flex 对齐样式。
 */
export function CheckboxField({
  label,
  hint,
  rowClassName,
  className,
  ...rest
}: CheckboxFieldProps): React.ReactElement {
  const rowClasses = ["ui-check-row", rowClassName].filter(Boolean).join(" ");
  return (
    <label className={rowClasses}>
      <input type="checkbox" className={className} {...rest} />
      <span>{label}</span>
      {hint !== undefined && hint !== null ? (
        <span className="ui-field-hint">{hint}</span>
      ) : null}
    </label>
  );
}

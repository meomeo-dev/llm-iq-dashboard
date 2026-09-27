import React from "react";

/** 所有者登录入口图标（钥匙） */
export function KeyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="5.5" cy="10.5" r="3" />
      <path d="M7.8 8.2 14 2M11 5l2 2M9.5 6.5l2 2" strokeLinecap="round" />
    </svg>
  );
}

/** 配置入口图标（三条滑杆） */
export function SettingsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M2 4h7M13 4h1M2 8h2M8 8h6M2 12h8" strokeLinecap="round" />
      <circle cx="11" cy="4" r="1.6" />
      <circle cx="6" cy="8" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
    </svg>
  );
}

/** 品牌标识与名称 */
export function ToolbarBrand() {
  return (
    <div className="brand" title="鹈鹕自行车基准">
      <span className="brand-mark" aria-hidden="true">
        &gt;_
      </span>
      <h1 className="brand-title">鹈鹕自行车基准</h1>
    </div>
  );
}

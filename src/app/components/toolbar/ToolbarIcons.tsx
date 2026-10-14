import React from "react";
import { useI18n } from "@/i18n";

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

/** 项目源码仓库；与 package.json 的 repository 一致（见 repository-link 测试） */
export const PROJECT_REPOSITORY_URL = "https://github.com/meomeo-dev/llm-iq-dashboard";

/** GitHub 标志：路径取自 Primer Octicons 19.40.0 的 mark-github-16，未改形（MIT，见 THIRD_PARTY_NOTICES） */
export function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M6.766 11.328c-2.063-.25-3.516-1.734-3.516-3.656 0-.781.281-1.625.75-2.188-.203-.515-.172-1.609.063-2.062.625-.078 1.468.25 1.968.703.594-.187 1.219-.281 1.985-.281.765 0 1.39.094 1.953.265.484-.437 1.344-.765 1.969-.687.218.422.25 1.515.046 2.047.5.593.766 1.39.766 2.203 0 1.922-1.453 3.375-3.547 3.64.531.344.89 1.094.89 1.954v1.625c0 .468.391.734.86.547C13.781 14.359 16 11.53 16 8.03 16 3.61 12.406 0 7.984 0 3.563 0 0 3.61 0 8.031a7.88 7.88 0 0 0 5.172 7.422c.422.156.828-.125.828-.547v-1.25c-.219.094-.5.156-.75.156-1.031 0-1.64-.562-2.078-1.609-.172-.422-.36-.672-.719-.719-.187-.015-.25-.093-.25-.187 0-.188.313-.328.625-.328.453 0 .844.281 1.25.86.313.452.64.655 1.031.655s.641-.14 1-.5c.266-.265.47-.5.657-.656" />
    </svg>
  );
}

/** 只读展台的源码入口：新标签页打开项目仓库 */
export function RepositoryLink() {
  const { locale } = useI18n();
  const label = locale === "en" ? "GitHub Repository" : "GitHub 仓库";
  return (
    <a
      className="icon-link"
      href={PROJECT_REPOSITORY_URL}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      aria-label={label}
    >
      <GitHubIcon />
    </a>
  );
}

/** 品牌标识与名称 */
export function ToolbarBrand() {
  const { t } = useI18n();
  return (
    <div className="brand" title={t.toolbar.brandTitle}>
      <span className="brand-mark" aria-hidden="true">
        &gt;_
      </span>
      <h1 className="brand-title">{t.toolbar.brandTitle}</h1>
    </div>
  );
}

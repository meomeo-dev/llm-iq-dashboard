"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/i18n";
import {
  FingerprintIcon,
  KeyIcon,
  PelicanNavIcon,
  RepositoryLink,
  SettingsIcon,
} from "./ToolbarIcons";

export type PageGroupId = "pelican" | "fingerprint";

export interface PageGroupNavProps {
  /** 当前所在页面（"pelican" 对应 "/"，"fingerprint" 对应 "/fingerprint"） */
  readonly active: PageGroupId;
  /** 页面主标题（可选） */
  readonly pageTitle?: string;
  readonly className?: string;
}

/**
 * 看板页面组统一导航切换器（鹈鹕基准 `/` ⇄ 模型指纹 `/fingerprint`）：
 * 在主看板与指纹页、登录配对态/未登录访客态/只读展台模式下始终可见。
 */
export function PageGroupNav({
  active,
  pageTitle,
  className,
}: PageGroupNavProps): React.ReactElement {
  const { t } = useI18n();
  const classes = ["brand", "page-group-brand", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {pageTitle && <h1 className="brand-title">{pageTitle}</h1>}
      <nav className="page-group-nav" aria-label={t.toolbar.navGroupAria}>
        <Link
          href="/"
          className={`page-group-link${active === "pelican" ? " is-active" : ""}`}
          aria-current={active === "pelican" ? "page" : undefined}
          title={t.toolbar.brandTitle}
        >
          <PelicanNavIcon />
          <span className="page-group-label">{t.toolbar.navPelican}</span>
        </Link>
        <Link
          href="/fingerprint"
          className={`page-group-link${active === "fingerprint" ? " is-active" : ""}`}
          aria-current={active === "fingerprint" ? "page" : undefined}
          title={t.toolbar.fingerprintLinkTitle}
        >
          <FingerprintIcon />
          <span className="page-group-label">{t.toolbar.navFingerprint}</span>
        </Link>
      </nav>
    </div>
  );
}

export interface PageAuthActionsProps {
  readonly owner: boolean;
  readonly readonly: boolean;
  readonly configHref?: string;
  readonly configTitle?: string;
  readonly pairHref?: string;
}

/**
 * 页面顶栏右侧统一的模式与权限入口（只读展台徽章 + GitHub 仓库 / 所有者配置入口 / 访客配对登录入口）。
 */
export function PageAuthActions({
  owner,
  readonly,
  configHref = "/config",
  configTitle,
  pairHref = "/pair",
}: PageAuthActionsProps): React.ReactElement {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const resolvedConfigTitle = configTitle ?? (isEn ? "Configuration" : "配置");
  const pairTitle = isEn ? "Owner Sign-In" : "所有者登录";

  if (readonly) {
    return (
      <>
        <span className="badge-readonly" title={isEn ? "Read-only Showcase" : "只读展台"}>
          {isEn ? "Showcase" : "只读展台"}
        </span>
        <RepositoryLink />
      </>
    );
  }
  if (owner) {
    return (
      <a className="icon-link" href={configHref} title={resolvedConfigTitle} aria-label={resolvedConfigTitle}>
        <SettingsIcon />
      </a>
    );
  }
  return (
    <a className="icon-link" href={pairHref} title={pairTitle} aria-label={pairTitle}>
      <KeyIcon />
    </a>
  );
}

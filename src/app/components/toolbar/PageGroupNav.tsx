"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n";
import { Menu } from "../menu/Menu";
import {
  FingerprintIcon,
  KeyIcon,
  PelicanNavIcon,
  PromptsNavIcon,
  RepositoryLink,
  SettingsIcon,
} from "./ToolbarIcons";

export type PageGroupId = "pelican" | "fingerprint" | "prompts";

export interface PageGroupNavProps {
  /** 当前所在页面（"pelican" -> "/"，"fingerprint" -> "/fingerprint"，"prompts" -> "/prompts"） */
  readonly active: PageGroupId;
  /** 保留兼容属性（已按设计移除顶栏左侧重复文字标题） */
  readonly pageTitle?: string;
  readonly className?: string;
  readonly open?: boolean;
  readonly onToggle?: () => void;
  readonly onClose?: () => void;
}

/**
 * 看板页面组统一导航下拉菜单（鹈鹕基准 `/` ⇄ 模型指纹 `/fingerprint` ⇄ 测评题目 `/prompts`）：
 * 移除左侧重复文字标题，采用下拉选择切换页面组。
 */
export function PageGroupNav({
  active,
  className,
  open,
  onToggle,
  onClose,
}: PageGroupNavProps): React.ReactElement {
  const { t } = useI18n();
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const handleToggle = onToggle ?? (() => setInternalOpen((prev) => !prev));
  const handleClose = onClose ?? (() => setInternalOpen(false));
  const classes = ["brand", "page-group-brand", className].filter(Boolean).join(" ");
  const items: ReadonlyArray<{
    id: PageGroupId;
    href: string;
    label: string;
    title: string;
    icon: React.ReactElement;
  }> = [
    { id: "pelican", href: "/", label: t.toolbar.navPelican, title: t.toolbar.brandTitle, icon: <PelicanNavIcon /> },
    { id: "fingerprint", href: "/fingerprint", label: t.toolbar.navFingerprint, title: t.toolbar.fingerprintLinkTitle, icon: <FingerprintIcon /> },
    { id: "prompts", href: "/prompts", label: t.toolbar.navPrompts, title: t.toolbar.promptsLinkTitle, icon: <PromptsNavIcon /> },
  ];
  const current = items.find((item) => item.id === active) ?? items[0]!;

  return (
    <div className={classes} aria-label={t.toolbar.navGroupAria}>
      <Menu
        label={
          <>
            {current.icon}
            <span className="page-group-label">{current.label}</span>
          </>
        }
        buttonClassName="page-group-trigger"
        panelClassName="page-group-panel"
        open={isOpen}
        onToggle={handleToggle}
        onClose={handleClose}
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            role="menuitemradio"
            aria-checked={active === item.id}
            className="menu-row page-group-option"
            title={item.title}
            onClick={handleClose}
          >
            <span className="radio" aria-hidden="true" />
            {item.icon}
            <span className="menu-row-name">{item.label}</span>
          </Link>
        ))}
      </Menu>
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

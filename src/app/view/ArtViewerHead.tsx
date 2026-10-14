import React from "react";
import type { DashboardCard } from "@/core/types";
import { LanguageSwitch, useI18n } from "@/i18n";
import {
  costTitle,
  formatBindingBadge,
  formatBytes,
  formatCost,
  formatDuration,
  judgeCostLine,
  rawSvgHref,
  statusText,
} from "../components/card/card-format";
import { ProfileName } from "../components/profile/ProfileName";
import { useStoredTimeZone } from "../components/timeline/use-stored-time-zone";
import { formatZonedDateTime } from "../components/timeline/zoned-time";
import { ArtViewerSiblings } from "./ArtViewerSiblings";

interface ArtViewerHeadProps {
  card: DashboardCard;
  /** 同轮同模型同强度同题的作品（含当前）；只有一件时不显示切换条 */
  siblings?: readonly DashboardCard[];
}

/**
 * 单件作品查看页顶部元信息与下载/原始 SVG 操作按钮。
 */
export function ArtViewerHead({ card, siblings = [] }: ArtViewerHeadProps) {
  const { locale, hasProvider } = useI18n();
  const isEn = locale === "en";
  const [timeZone] = useStoredTimeZone();
  const raw = rawSvgHref(card);
  const effort = card.appliedEffort !== card.effort ? `${card.effort} → ${card.appliedEffort}` : card.effort;

  return (
    <header className="viewer-head">
      <div className="viewer-heading">
        <h1 className="viewer-title">
          {card.profile === undefined ? (
            card.label
          ) : (
            <>
              {card.model} · {effort} · <ProfileName name={card.profile} cards={[card]} />
            </>
          )}
        </h1>
        <p className="viewer-meta">
          <span suppressHydrationWarning>
            {timeZone === null ? card.startedAt : formatZonedDateTime(new Date(card.startedAt), timeZone)}
          </span>
          <span className={`status-text status-${card.status}`}>{statusText(card.status, locale)}</span>
          <span>{isEn ? `Time ${formatDuration(card.durationMs)}` : `耗时 ${formatDuration(card.durationMs)}`}</span>
          <span title={costTitle(card, locale)}>
            {isEn ? `API-Eq ${formatCost(card.cost)}` : `API 等价 ${formatCost(card.cost)}`}
          </span>
          {card.judgeCost != null && (
            <span title={judgeCostLine(card.judgeCost, locale) ?? ""}>
              {isEn ? `Judge ${formatCost(card.judgeCost.cost)}` : `评审 ${formatCost(card.judgeCost.cost)}`}
            </span>
          )}
          {card.svgBytes !== null && <span>{formatBytes(card.svgBytes)}</span>}
          <span>effort: {effort}</span>
          <span>{card.promptId}</span>
        </p>
        <div className="badges">
          {Object.entries(card.bindings).map(([name, value]) => {
            const badgeText = formatBindingBadge(name, value, locale);
            return (
              <span key={name} className="badge binding" title={badgeText}>
                {badgeText}
              </span>
            );
          })}
        </div>
      </div>
      <ArtViewerSiblings current={card} siblings={siblings} />
      {raw !== null ? (
        <nav className="viewer-actions">
          {hasProvider && <LanguageSwitch />}
          <a href={raw} target="_blank" rel="noopener">
            {isEn ? "Raw SVG ↗" : "原始 SVG ↗"}
          </a>
          <a href={raw} download={card.svgFile ?? undefined}>
            {isEn ? "Download" : "下载"}
          </a>
        </nav>
      ) : hasProvider ? (
        <nav className="viewer-actions">
          <LanguageSwitch />
        </nav>
      ) : null}
    </header>
  );
}

import React from "react";
import type { DashboardCard } from "@/core/types";
import {
  costTitle,
  formatBytes,
  formatCost,
  formatDuration,
  rawSvgHref,
  STATUS_TEXT,
} from "../components/card/card-format";
import { useStoredTimeZone } from "../components/timeline/use-stored-time-zone";
import { formatZonedDateTime } from "../components/timeline/zoned-time";

interface ArtViewerHeadProps {
  card: DashboardCard;
}

/** 单件作品查看页顶部元信息与下载/原始 SVG 操作按钮 */
export function ArtViewerHead({ card }: ArtViewerHeadProps) {
  const [timeZone] = useStoredTimeZone();
  const raw = rawSvgHref(card);
  const effort = card.appliedEffort !== card.effort ? `${card.effort} → ${card.appliedEffort}` : card.effort;

  return (
    <header className="viewer-head">
      <div className="viewer-heading">
        <h1 className="viewer-title">{card.label}</h1>
        <p className="viewer-meta">
          <span suppressHydrationWarning>
            {timeZone === null ? card.startedAt : formatZonedDateTime(new Date(card.startedAt), timeZone)}
          </span>
          <span className={`status-text status-${card.status}`}>{STATUS_TEXT[card.status]}</span>
          <span>耗时 {formatDuration(card.durationMs)}</span>
          <span title={costTitle(card)}>API 等价 {formatCost(card.cost)}</span>
          {card.svgBytes !== null && <span>{formatBytes(card.svgBytes)}</span>}
          <span>effort: {effort}</span>
          <span>{card.promptId}</span>
        </p>
        <div className="badges">
          {Object.entries(card.bindings).map(([name, value]) => (
            <span key={name} className="badge binding" title={`${name}: ${value}`}>
              {name}: {value}
            </span>
          ))}
        </div>
      </div>
      {raw !== null && (
        <nav className="viewer-actions">
          <a href={raw} target="_blank" rel="noopener">
            原始 SVG ↗
          </a>
          <a href={raw} download={card.svgFile ?? undefined}>
            下载
          </a>
        </nav>
      )}
    </header>
  );
}

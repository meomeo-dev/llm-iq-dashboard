"use client";

import type { DashboardCard } from "@/core/types";
import type { Locale } from "@/i18n";
import { LazySvgFrame } from "./LazySvgFrame";
import { localizeCardError, statusText, viewHref } from "./card-format";

export function ArtFrame({ card, art, locale }: { card: DashboardCard; art: string; locale: Locale }) {
  const href = viewHref(card);
  const frame = <LazySvgFrame href={art} className="card-frame" />;
  if (href === null) return frame;
  return (
    <a
      className="card-frame-link"
      href={href}
      target="_blank"
      rel="noopener"
      title={locale === "en" ? "Open full artwork view" : "单独查看大图"}
    >
      {frame}
    </a>
  );
}

export function FailureFrame({ card, locale }: { card: DashboardCard; locale: Locale }) {
  const statusLabel = statusText(card.status, locale);
  const reason = localizeCardError(card.error, card.status, locale) ?? statusLabel;
  return (
    <div className={`frame card-frame frame-failed failed-${card.status}`} title={reason}>
      <span className="failure-status">{statusLabel}</span>
      <p>{reason}</p>
    </div>
  );
}

export function RedactedFrame({ card, locale }: { card: DashboardCard; locale: Locale }) {
  const fallback = locale === "en" ? "Redacted (Unpublished)" : "已脱敏，未发布";
  const reason = localizeCardError(card.error, card.status, locale) ?? fallback;
  return (
    <div className="frame card-frame frame-redacted" title={reason}>
      <span className="redacted-status">{fallback}</span>
      <p>{reason}</p>
    </div>
  );
}

export function LiveFrame({ liveState, locale }: { liveState: "queued" | "running"; locale: Locale }) {
  const isEn = locale === "en";
  const label =
    liveState === "running" ? (isEn ? "Generating SVG…" : "模型生成中…") : isEn ? "Queued in lane…" : "道内排队等待…";
  return (
    <div className={`frame card-frame frame-live live-${liveState}`}>
      <span className="live-status">{liveState === "running" ? (isEn ? "Running" : "执行中") : isEn ? "Queued" : "排队中"}</span>
      <p>{label}</p>
    </div>
  );
}

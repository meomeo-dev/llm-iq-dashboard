"use client";

import type { DashboardCard } from "@/core/types";
import { useI18n } from "@/i18n";
import { localizeCardError, rawSvgHref, statusText } from "../card/card-format";
import { LazySvgFrame } from "../card/LazySvgFrame";

/** 作品缩略图：成功的显示 SVG，进行中/排队中显示动态占位，失败的用条纹底加 ✕，尺寸由外层网格决定 */
export function Thumb({ card }: { card: DashboardCard }) {
  const { locale } = useI18n();
  if (card.liveState === "running") {
    const runningLabel = locale === "en" ? "Running" : "执行中";
    return (
      <span className="thumb thumb-running" title={`${card.label} · ${runningLabel}`}>
        <span className="thumb-spinner" aria-hidden="true" />
      </span>
    );
  }
  if (card.liveState === "queued") {
    const queuedLabel = locale === "en" ? "Queued" : "排队中";
    return (
      <span className="thumb thumb-queued" title={`${card.label} · ${queuedLabel}`}>
        <span className="thumb-queued-dot" aria-hidden="true">…</span>
      </span>
    );
  }
  const detail =
    card.status === "ok"
      ? statusText(card.status, locale)
      : (localizeCardError(card.error, card.status, locale) ??
        (locale === "en" ? statusText(card.status, locale) : card.status));
  const title = `${card.label} · ${detail}`;
  const art = rawSvgHref(card);
  if (art === null) {
    return (
      <span className={`thumb thumb-failed failed-${card.status}`} title={title}>
        ✕
      </span>
    );
  }
  return (
    <span className="thumb" title={title}>
      <LazySvgFrame href={art} className="thumb-art" />
    </span>
  );
}

"use client";

import { useState } from "react";
import type { ProfileView } from "@/core/profile-view";
import { useI18n, type Locale } from "@/i18n";
import { Menu } from "../menu/Menu";
import { useProfiles } from "../profile/profiles-context";
import type { Moment } from "../timeline/moments";
import type { NowMark } from "../timeline/TimelineAxis";
import { formatDayLabel, formatZonedDateTime, offsetLabel } from "../timeline/zoned-time";
import { buildThumbnails, downloadPng, downloadSvg, localizeExportError, readPalette } from "./export-image";
import { renderTimelinePortraitSvg } from "./timeline-portrait-svg";
import { renderTimelineSvg, type TimelineExport } from "./timeline-svg";

type Format = "png" | "svg";
/** 横版是完整 24 小时轨道，竖版是它的行列转置：模型按列、轮次按行 */
type Layout = "landscape" | "portrait";
type Choice = `${Layout}-${Format}`;

interface ExportMenuProps {
  /** 当天经过筛选、正显示在矩阵里的轮次 */
  moments: readonly Moment[];
  efforts: readonly string[];
  now: NowMark | null;
  dayKey: string;
  timeZone: string;
  filtered: boolean;
}

/** 导出当天全部轮次与行：横版是完整 24 小时轨道，竖版是模型按列、轮次按行的转置，都不受视口与横向滚动限制 */
export function ExportMenu(props: ExportMenuProps) {
  const { locale, t } = useI18n();
  const { profiles } = useProfiles();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<Choice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isEn = locale === "en";

  const exportAs = async (choice: Choice): Promise<void> => {
    const [layout, format] = choice.split("-") as [Layout, Format];
    setBusy(choice);
    setError(null);
    try {
      const input = await buildInput(props, profiles, layout, locale);
      const rendered = layout === "portrait" ? renderTimelinePortraitSvg(input) : renderTimelineSvg(input);
      const suffix = layout === "portrait" ? "-portrait" : "";
      const filename = `pelican-timeline${suffix}-${props.dayKey}-${props.timeZone.replaceAll("/", "_")}.${format}`;
      if (format === "svg") downloadSvg(rendered, filename);
      else await downloadPng(rendered, filename);
      setOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(null);
    }
  };

  return (
    <Menu label={t.toolbar.exportButton} align="right" panelClassName="export-panel" open={open} onToggle={() => setOpen(!open)} onClose={() => setOpen(false)}>
      <ExportRow choice="landscape-png" busy={busy} onPick={exportAs} locale={locale} name={isEn ? "PNG Image" : "PNG 图片"} hint={isEn ? "Landscape · 2× Retina" : "横版 · 2 倍清晰度"} />
      <ExportRow choice="landscape-svg" busy={busy} onPick={exportAs} locale={locale} name={isEn ? "SVG Vector" : "SVG 矢量"} hint={isEn ? "Landscape · Lossless" : "横版 · 无损缩放"} />
      <ExportRow choice="portrait-png" busy={busy} onPick={exportAs} locale={locale} name={isEn ? "Portrait PNG" : "竖版 PNG"} hint={isEn ? "Vertical time · 2× Retina" : "时间竖排 · 2 倍清晰度"} />
      <ExportRow choice="portrait-svg" busy={busy} onPick={exportAs} locale={locale} name={isEn ? "Portrait SVG" : "竖版 SVG"} hint={isEn ? "Vertical time · Lossless" : "时间竖排 · 无损缩放"} />
      {error !== null && <p className="export-error">{isEn ? `Export failed: ${localizeExportError(error, locale)}` : `导出失败：${localizeExportError(error, locale)}`}</p>}
    </Menu>
  );
}

function ExportRow({
  choice,
  busy,
  onPick,
  locale,
  name,
  hint,
}: {
  choice: Choice;
  busy: Choice | null;
  onPick: (choice: Choice) => void;
  locale: Locale;
  name: string;
  hint: string;
}) {
  return (
    <button type="button" className="menu-row" disabled={busy !== null} onClick={() => onPick(choice)}>
      <span className="menu-row-name">{busy === choice ? (locale === "en" ? `Generating ${name}…` : `正在生成 ${name}…`) : name}</span>
      <span className="menu-row-count">{hint}</span>
    </button>
  );
}

/** 两种版式共用的输入：标题按版式区分，说明、缩略图、配色相同 */
async function buildInput(
  { moments, efforts, now, dayKey, timeZone, filtered }: ExportMenuProps,
  profiles: readonly ProfileView[],
  layout: Layout,
  locale: Locale,
): Promise<TimelineExport> {
  const isEn = locale === "en";
  const results = moments.reduce((sum, moment) => sum + moment.cards.length, 0);
  const subtitle = isEn
    ? [
        `${formatDayLabel(dayKey, locale)} (${dayKey})`,
        `${timeZone} ${offsetLabel(new Date(), timeZone)}`,
        `${moments.length} runs · ${results} results${filtered ? " (filtered)" : ""}`,
        `Exported at ${formatZonedDateTime(new Date(), timeZone)}`,
      ].join(" · ")
    : [
        `${formatDayLabel(dayKey)}（${dayKey}）`,
        `${timeZone} ${offsetLabel(new Date(), timeZone)}`,
        `${moments.length} 轮 · ${results} 个结果${filtered ? "（已按筛选）" : ""}`,
        `导出于 ${formatZonedDateTime(new Date(), timeZone)}`,
      ].join(" · ");
  const title = isEn
    ? layout === "portrait"
      ? "Pelican Bicycle Benchmark · Execution Timeline"
      : "Pelican Bicycle Benchmark · Execution Timeline (24h)"
    : layout === "portrait"
      ? "鹈鹕自行车基准 · 执行时间线"
      : "鹈鹕自行车基准 · 执行时间线（24 小时）";
  return {
    title,
    subtitle,
    moments,
    efforts,
    now,
    thumbnails: await buildThumbnails(moments),
    palette: readPalette(),
    profiles,
    locale,
  };
}

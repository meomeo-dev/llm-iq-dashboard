"use client";

import { useState } from "react";
import { Menu } from "../menu/Menu";
import type { Moment } from "../timeline/moments";
import type { NowMark } from "../timeline/TimelineAxis";
import { formatDayLabel, formatZonedDateTime, offsetLabel } from "../timeline/zoned-time";
import { buildThumbnails, downloadPng, downloadSvg, readPalette } from "./export-image";
import { renderTimelineSvg, type RenderedSvg } from "./timeline-svg";

type Format = "png" | "svg";

interface ExportMenuProps {
  /** 当天经过筛选、正显示在矩阵里的轮次 */
  moments: readonly Moment[];
  efforts: readonly string[];
  now: NowMark | null;
  dayKey: string;
  timeZone: string;
  filtered: boolean;
}

/** 导出完整的 24 小时轨道与全部泳道，不受视口与横向滚动限制 */
export function ExportMenu(props: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<Format | null>(null);
  const [error, setError] = useState<string | null>(null);

  const exportAs = async (format: Format): Promise<void> => {
    setBusy(format);
    setError(null);
    try {
      const rendered = await render(props);
      const filename = `pelican-timeline-${props.dayKey}-${props.timeZone.replaceAll("/", "_")}.${format}`;
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
    <Menu label="导出" align="right" panelClassName="export-panel" open={open} onToggle={() => setOpen(!open)} onClose={() => setOpen(false)}>
      <ExportRow format="png" busy={busy} onPick={exportAs} name="PNG 图片" hint="2 倍清晰度，适合分享" />
      <ExportRow format="svg" busy={busy} onPick={exportAs} name="SVG 矢量" hint="无损缩放，体积更小" />
      {error !== null && <p className="export-error">导出失败：{error}</p>}
    </Menu>
  );
}

function ExportRow({
  format,
  busy,
  onPick,
  name,
  hint,
}: {
  format: Format;
  busy: Format | null;
  onPick: (format: Format) => void;
  name: string;
  hint: string;
}) {
  return (
    <button type="button" className="menu-row" disabled={busy !== null} onClick={() => onPick(format)}>
      <span className="menu-row-name">{busy === format ? `正在生成 ${name}…` : name}</span>
      <span className="menu-row-count">{hint}</span>
    </button>
  );
}

async function render({ moments, efforts, now, dayKey, timeZone, filtered }: ExportMenuProps): Promise<RenderedSvg> {
  const results = moments.reduce((sum, moment) => sum + moment.cards.length, 0);
  const subtitle = [
    `${formatDayLabel(dayKey)}（${dayKey}）`,
    `${timeZone} ${offsetLabel(new Date(), timeZone)}`,
    `${moments.length} 轮 · ${results} 个结果${filtered ? "（已按筛选）" : ""}`,
    `导出于 ${formatZonedDateTime(new Date(), timeZone)}`,
  ].join(" · ");
  return renderTimelineSvg({
    title: "鹈鹕自行车基准 · 执行时间线（24 小时）",
    subtitle,
    moments,
    efforts,
    now,
    thumbnails: await buildThumbnails(moments),
    palette: readPalette(),
  });
}

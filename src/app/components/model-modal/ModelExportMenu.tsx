"use client";

import { useState } from "react";
import { profileLabel } from "@/core/profile-view";
import { DEFAULT_PROFILE, type DashboardCard } from "@/core/types";
import { buildThumbnails, downloadPng, downloadSvg, readPalette } from "../export/export-image";
import { renderResultSetSvg, type ResultSetColumn } from "../export/result-set-svg";
import { Menu } from "../menu/Menu";
import { profileColor } from "../profile/profile-color";
import { useProfiles } from "../profile/profiles-context";
import type { Moment } from "../timeline/moments";
import type { Row } from "../timeline/rows";
import { formatDayLabel } from "../timeline/zoned-time";

type Format = "png" | "svg";

interface ModelExportMenuProps {
  moment: Moment;
  row: Row;
  cards: readonly DashboardCard[];
  /** 列：登录态在前，其余按配置顺序 */
  upstreams: readonly string[];
  efforts: readonly string[];
  timeZone: string;
}

/** 弹窗里的结果集导出：整个矩阵（含横向滚动看不到的列）画成一张图，不受窗口大小限制 */
export function ModelExportMenu({ moment, row, cards, upstreams, efforts, timeZone }: ModelExportMenuProps) {
  const { profiles } = useProfiles();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<Format | null>(null);
  const [error, setError] = useState<string | null>(null);

  const exportAs = async (format: Format): Promise<void> => {
    setBusy(format);
    setError(null);
    try {
      const columns: ResultSetColumn[] = upstreams.map((name) => ({
        name,
        label: profileLabel(name, profiles),
        color: name === DEFAULT_PROFILE ? null : profileColor(name),
      }));
      const okCount = cards.filter((card) => card.status === "ok").length;
      const tail = upstreams.length > 1 ? `${upstreams.length} 个上游` : `${cards.length} 个强度`;
      const rendered = renderResultSetSvg({
        title: `${row.cli} · ${row.model}`,
        subtitle: `${formatDayLabel(moment.dayKey)} ${moment.clock} 这一轮 · ${row.promptId} · ${tail} · 成功 ${okCount}`,
        cards, columns, efforts, timeZone,
        thumbnails: await buildThumbnails([{ ...moment, cards: [...cards] }]),
        palette: readPalette(),
      });
      const filename = `pelican-${moment.runId}-${row.cli}-${row.model}-${row.promptId}.${format}`;
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
    <Menu label="导出" align="right" panelClassName="export-panel" buttonClassName="modal-export-btn" open={open} onToggle={() => setOpen(!open)} onClose={() => setOpen(false)}>
      <button type="button" className="menu-row" disabled={busy !== null} onClick={() => exportAs("png")}>
        <span className="menu-row-name">{busy === "png" ? "正在生成 PNG 图片…" : "PNG 图片"}</span>
        <span className="menu-row-count">2 倍清晰度，适合分享</span>
      </button>
      <button type="button" className="menu-row" disabled={busy !== null} onClick={() => exportAs("svg")}>
        <span className="menu-row-name">{busy === "svg" ? "正在生成 SVG 矢量…" : "SVG 矢量"}</span>
        <span className="menu-row-count">无损缩放，作品保留动画</span>
      </button>
      {error !== null && <p className="export-error">导出失败：{error}</p>}
    </Menu>
  );
}

"use client";

import { useState } from "react";
import { profileLabel } from "@/core/profile-view";
import { DEFAULT_PROFILE, type DashboardCard } from "@/core/types";
import { useI18n } from "@/i18n";
import { exportResultSet, type ResultSetFormat } from "../export/result-set-export";
import { GIF_FPS, GIF_SECONDS } from "../export/result-set-gif";
import type { ResultSetColumn } from "../export/result-set-svg";
import { Menu } from "../menu/Menu";
import { profileColor } from "../profile/profile-color";
import { useProfiles } from "../profile/profiles-context";
import type { Moment } from "../timeline/moments";
import type { Row } from "../timeline/rows";
import { formatDayLabel } from "../timeline/zoned-time";

interface ModelExportMenuProps {
  moment: Moment;
  row: Row;
  cards: readonly DashboardCard[];
  /** 列：登录态在前，其余按配置顺序 */
  upstreams: readonly string[];
  efforts: readonly string[];
  timeZone: string;
}

function listFormats(isEn: boolean): ReadonlyArray<{ format: ResultSetFormat; name: string; hint: string }> {
  return isEn
    ? [
        { format: "gif", name: "GIF Animation", hint: `${GIF_SECONDS}s at ${GIF_FPS} fps, animated artwork` },
        { format: "png", name: "PNG Image", hint: "2× Retina, ready to share" },
        { format: "svg", name: "SVG Vector", hint: "Lossless scale, preserves animation" },
      ]
    : [
        { format: "gif", name: "GIF 动图", hint: `${GIF_SECONDS} 秒 ${GIF_FPS} 帧/秒，作品动起来` },
        { format: "png", name: "PNG 图片", hint: "2 倍清晰度，适合分享" },
        { format: "svg", name: "SVG 矢量", hint: "无损缩放，作品保留动画" },
      ];
}

/** 弹窗里的结果集导出：整个矩阵（含横向滚动看不到的列）画成一张图，不受窗口大小限制 */
export function ModelExportMenu({ moment, row, cards, upstreams, efforts, timeZone }: ModelExportMenuProps) {
  const { locale, t } = useI18n();
  const { profiles } = useProfiles();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<ResultSetFormat | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isEn = locale === "en";
  const formats = listFormats(isEn);

  const exportAs = async (format: ResultSetFormat): Promise<void> => {
    setBusy(format);
    setError(null);
    setProgress(null);
    try {
      const columns: ResultSetColumn[] = upstreams.map((name) => ({
        name,
        label: name === DEFAULT_PROFILE && isEn ? t.viewer.modal.officialLogin : profileLabel(name, profiles),
        color: name === DEFAULT_PROFILE ? null : profileColor(name),
      }));
      const okCount = cards.filter((card) => card.status === "ok").length;
      const tail = isEn
        ? upstreams.length > 1 ? `${upstreams.length} upstreams` : `${cards.length} efforts`
        : upstreams.length > 1 ? `${upstreams.length} 个上游` : `${cards.length} 个强度`;
      const subtitle = isEn
        ? `${formatDayLabel(moment.dayKey, locale)} ${moment.clock} round · ${row.promptId} · ${tail} · ${okCount} ok`
        : `${formatDayLabel(moment.dayKey)} ${moment.clock} 这一轮 · ${row.promptId} · ${tail} · 成功 ${okCount}`;
      const input = { title: `${row.cli} · ${row.model}`, subtitle, cards, columns, efforts, timeZone, locale };
      const filename = `pelican-${moment.runId}-${row.cli}-${row.model}-${row.promptId}.${format}`;
      await exportResultSet(format, input, filename, (done, total) => {
        setProgress(done < total ? (isEn ? `Capturing frame ${done}/${total}…` : `正在取帧 ${done}/${total}…`) : isEn ? "Encoding…" : "正在编码…");
      });
      setOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(null);
      setProgress(null);
    }
  };

  return (
    <Menu label={t.toolbar.exportButton} align="right" panelClassName="export-panel" buttonClassName="modal-export-btn" open={open} onToggle={() => setOpen(!open)} onClose={() => setOpen(false)}>
      {formats.map(({ format, name, hint }) => (
        <button key={format} type="button" className="menu-row" disabled={busy !== null} onClick={() => exportAs(format)}>
          <span className="menu-row-name">{busy === format ? (progress ?? (isEn ? `Generating ${name}…` : `正在生成 ${name}…`)) : name}</span>
          <span className="menu-row-count">{hint}</span>
        </button>
      ))}
      {error !== null && <p className="export-error">{isEn ? `Export failed: ${error}` : `导出失败：${error}`}</p>}
    </Menu>
  );
}

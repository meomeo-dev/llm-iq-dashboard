"use client";

import { useState } from "react";
import { profileLabel } from "@/core/profile-view";
import { DEFAULT_PROFILE, type DashboardCard } from "@/core/types";
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

const FORMATS: ReadonlyArray<{ format: ResultSetFormat; name: string; hint: string }> = [
  { format: "gif", name: "GIF 动图", hint: `${GIF_SECONDS} 秒 ${GIF_FPS} 帧/秒，作品动起来` },
  { format: "png", name: "PNG 图片", hint: "2 倍清晰度，适合分享" },
  { format: "svg", name: "SVG 矢量", hint: "无损缩放，作品保留动画" },
];

/** 弹窗里的结果集导出：整个矩阵（含横向滚动看不到的列）画成一张图，不受窗口大小限制 */
export function ModelExportMenu({ moment, row, cards, upstreams, efforts, timeZone }: ModelExportMenuProps) {
  const { profiles } = useProfiles();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<ResultSetFormat | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const exportAs = async (format: ResultSetFormat): Promise<void> => {
    setBusy(format);
    setError(null);
    setProgress(null);
    try {
      const columns: ResultSetColumn[] = upstreams.map((name) => ({
        name,
        label: profileLabel(name, profiles),
        color: name === DEFAULT_PROFILE ? null : profileColor(name),
      }));
      const okCount = cards.filter((card) => card.status === "ok").length;
      const tail = upstreams.length > 1 ? `${upstreams.length} 个上游` : `${cards.length} 个强度`;
      const input = {
        title: `${row.cli} · ${row.model}`,
        subtitle: `${formatDayLabel(moment.dayKey)} ${moment.clock} 这一轮 · ${row.promptId} · ${tail} · 成功 ${okCount}`,
        cards, columns, efforts, timeZone,
      };
      const filename = `pelican-${moment.runId}-${row.cli}-${row.model}-${row.promptId}.${format}`;
      await exportResultSet(format, input, filename, (done, total) => {
        setProgress(done < total ? `正在取帧 ${done}/${total}…` : "正在编码…");
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
    <Menu label="导出" align="right" panelClassName="export-panel" buttonClassName="modal-export-btn" open={open} onToggle={() => setOpen(!open)} onClose={() => setOpen(false)}>
      {FORMATS.map(({ format, name, hint }) => (
        <button key={format} type="button" className="menu-row" disabled={busy !== null} onClick={() => exportAs(format)}>
          <span className="menu-row-name">{busy === format ? (progress ?? `正在生成 ${name}…`) : name}</span>
          <span className="menu-row-count">{hint}</span>
        </button>
      ))}
      {error !== null && <p className="export-error">导出失败：{error}</p>}
    </Menu>
  );
}

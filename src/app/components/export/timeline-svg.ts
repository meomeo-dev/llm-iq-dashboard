/**
 * 把一天的时间轴泳道画成独立 SVG：完整 24 小时轨道、按模型分行、2×2 文件夹格子。
 * 列布局与分行复用 track-layout.ts、rows.ts，与看板一一对应。缩略图以 <image> 嵌入，
 * 各自成为独立文档：id 不会冲突，残留脚本也不会执行。
 */

import type { ProfileView } from "@/core/profile-view";
import type { DashboardCard } from "@/core/types";
import { profileColor } from "../profile/profile-color";
import {
  cellUpstreams,
  folderCell,
  OVERFLOW_SLOT,
  planSlots,
  SLOT_CORNERS,
  slotCount,
  type FolderCell,
} from "../timeline/effort-slots";
import { momentHealth, type Moment } from "../timeline/moments";
import { listRows, rowKeyOf, type Row } from "../timeline/rows";
import type { NowMark } from "../timeline/TimelineAxis";
import {
  AXIS_HEIGHT,
  AXIS_LINE_Y,
  CELL_WIDTH,
  HEAD_HEIGHT,
  hourLabelVisible,
  hourX,
  layoutColumns,
  timeX,
  type Column,
} from "../timeline/track-layout";

/**
 * 与 globals.css 的 --lane-label-width / --lane-head-height / --cell-height /
 * --tile-size / --folder-padding / --folder-gap 一致
 */
const LABEL_WIDTH = 176;
const LANE_HEAD_HEIGHT = 36;
const ROW_HEIGHT = 236;
const TILE_SIZE = 216;
const FOLDER_PADDING = 16;
const FOLDER_GAP = 12;
const MINI_SIZE = (TILE_SIZE - FOLDER_PADDING * 2 - FOLDER_GAP) / 2;
const PAD = 32;
const HEADER_HEIGHT = 72;
const HOUR_LABELS = [0, 3, 6, 9, 12, 15, 18, 21, 24];
/** 作为图片渲染时无法加载网页字体，使用各平台的系统字体 */
const FONT = "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif";

export interface Palette {
  bg: string;
  surface: string;
  surfaceHi: string;
  border: string;
  text: string;
  textDim: string;
  textFaint: string;
  accent: string;
  ok: string;
  warn: string;
  err: string;
}

export interface TimelineExport {
  title: string;
  subtitle: string;
  moments: readonly Moment[];
  efforts: readonly string[];
  now: NowMark | null;
  /** 成功作品的 data URI，键见 thumbnailKey */
  thumbnails: ReadonlyMap<string, string>;
  palette: Palette;
  /** 配置里的上游，决定色点顺序与每角的代表作品；缺省为空 */
  profiles?: readonly ProfileView[];
}

export interface RenderedSvg {
  svg: string;
  width: number;
  height: number;
}

export function thumbnailKey(card: Pick<DashboardCard, "runId" | "targetId" | "promptId">): string {
  return `${card.runId}/${card.targetId}/${card.promptId}`;
}

/** 泳道区域各绘制函数共用的上下文 */
interface TrackContext {
  input: TimelineExport;
  columns: readonly Column[];
  trackLeft: number;
  width: number;
  showPrompt: boolean;
  /** 格子四角对应的档位，与看板一致 */
  slots: readonly string[];
}

export function renderTimelineSvg(input: TimelineExport): RenderedSvg {
  const { columns, width: trackWidth } = layoutColumns(input.moments, CELL_WIDTH);
  const cards = input.moments.flatMap((moment) => moment.cards);
  const rows = listRows(cards);
  const trackLeft = PAD + LABEL_WIDTH;
  const axisTop = PAD + HEADER_HEIGHT;
  const matrixTop = axisTop + AXIS_HEIGHT + HEAD_HEIGHT;
  const width = trackLeft + trackWidth + PAD;
  const height = matrixTop + LANE_HEAD_HEIGHT + Math.max(rows.length, 1) * ROW_HEIGHT + PAD;
  const showPrompt = new Set(cards.map((card) => card.promptId)).size > 1;
  const context: TrackContext = { input, columns, trackLeft, width, showPrompt, slots: planSlots(input.efforts) };

  const body: string[] = [
    `<rect width="${width}" height="${height}" fill="${input.palette.bg}"/>`,
    header(input),
    axis(context, axisTop),
    matrixHead(context, rows.length, matrixTop),
    ...rows.map((row, index) => rowSvg(context, row, matrixTop + LANE_HEAD_HEIGHT + index * ROW_HEIGHT)),
  ];
  const lanesTop = matrixTop + LANE_HEAD_HEIGHT;
  if (input.moments.length === 0) {
    body.push(text(trackLeft + 24, lanesTop + 40, "这一天还没有符合筛选的执行结果", input.palette.textDim, 14));
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}" font-family="${FONT}">${body.join("")}</svg>`;
  return { svg, width, height };
}

function header(input: TimelineExport): string {
  const { palette } = input;
  return (
    text(PAD, PAD + 26, input.title, palette.text, 22, "font-weight=\"600\"") +
    text(PAD, PAD + 52, input.subtitle, palette.textDim, 13)
  );
}

/** 24 小时轴：轴线、刻度、钟点、每轮的健康点与列头、现在线 */
function axis({ input, columns, trackLeft }: TrackContext, top: number): string {
  const { palette } = input;
  const lineY = top + AXIS_LINE_Y;
  const headY = top + AXIS_HEIGHT + HEAD_HEIGHT / 2;
  const x = (value: number): number => trackLeft + value;
  const parts = [line(x(hourX(0)), lineY, x(hourX(24)), lineY, palette.border, 1)];
  for (let hour = 0; hour <= 24; hour += 1) {
    const major = hour % 3 === 0;
    parts.push(line(x(hourX(hour)), lineY - (major ? 8 : 4), x(hourX(hour)), lineY, major ? palette.textDim : palette.textFaint, major ? 1.5 : 1));
  }
  const nowX = input.now === null ? null : timeX(input.now.fraction);
  for (const hour of HOUR_LABELS.filter((item) => hourLabelVisible(item, nowX))) {
    parts.push(text(x(hourX(hour)), lineY - 14, String(hour).padStart(2, "0"), palette.textDim, 11, 'text-anchor="middle"'));
  }
  for (const { moment, exactX, x: columnX } of columns) {
    parts.push(line(x(exactX), lineY, x(columnX), headY - 9, palette.textFaint, 1));
    parts.push(`<circle cx="${x(exactX)}" cy="${lineY}" r="4" fill="${healthColor(moment, palette)}" stroke="${palette.bg}" stroke-width="2"/>`);
    parts.push(text(x(columnX), headY + 4, moment.clock, palette.text, 12, 'text-anchor="middle" font-weight="600"'));
  }
  if (input.now !== null && nowX !== null) {
    const lineX = x(nowX);
    parts.push(`<line x1="${lineX}" y1="${top + 12}" x2="${lineX}" y2="${top + AXIS_HEIGHT + HEAD_HEIGHT}" stroke="${palette.accent}" stroke-width="2" stroke-dasharray="4 4"/>`);
    parts.push(text(lineX + 6, top + 12, `现在 ${input.now.clock}`, palette.accent, 11));
  }
  return parts.join("");
}

/** 矩阵表头：模型数与格内位置图例 */
function matrixHead({ input, width, slots, trackLeft }: TrackContext, rowCount: number, top: number): string {
  const { palette } = input;
  const legend = slots
    .map((slot, index) => `${SLOT_CORNERS[index] ?? ""} ${slot === OVERFLOW_SLOT ? "其余档位" : slot}`)
    .join("    ");
  return (
    `<rect x="0" y="${top}" width="${width}" height="${LANE_HEAD_HEIGHT}" fill="${palette.surface}"/>` +
    line(0, top + LANE_HEAD_HEIGHT, width, top + LANE_HEAD_HEIGHT, palette.border, 1) +
    text(PAD, top + 23, "模型", palette.text, 13, 'font-weight="600"') +
    text(PAD + 36, top + 23, `${rowCount} 个`, palette.textFaint, 12) +
    (legend === "" ? "" : text(trackLeft + 12, top + 23, `格内位置    ${legend}`, palette.textDim, 12))
  );
}

function rowSvg(context: TrackContext, row: Row, top: number): string {
  const { palette, profiles = [] } = context.input;
  const nameY = context.showPrompt ? top + ROW_HEIGHT / 2 - 3 : top + ROW_HEIGHT / 2 + 4;
  const parts = [
    line(0, top + ROW_HEIGHT, context.width, top + ROW_HEIGHT, palette.border, 0.5),
    text(PAD, nameY, `${row.cli} · ${row.model}`, palette.text, 12),
  ];
  if (context.showPrompt) parts.push(text(PAD, nameY + 16, row.promptId, palette.textFaint, 11));
  // 行标题下的上游色点，与看板一致；只有登录态时不画
  const rowCards = context.input.moments.flatMap((moment) => moment.cards).filter((card) => rowKeyOf(card) === row.key);
  cellUpstreams(rowCards, profiles).forEach((name, index) => {
    const dotY = nameY + (context.showPrompt ? 28 : 14);
    parts.push(`<circle cx="${PAD + 4 + index * 12}" cy="${dotY}" r="4" fill="${profileColor(name)}"/>`);
  });
  for (const { moment, x } of context.columns) {
    const cell = folderCell(moment, row, context.slots, context.input.efforts, profiles);
    if (cell === null) continue;
    parts.push(folderSvg(context, cell, context.trackLeft + x - TILE_SIZE / 2, top + (ROW_HEIGHT - TILE_SIZE) / 2));
  }
  return parts.join("");
}

/** 文件夹格子：圆角底板 + 2×2 小图，每角固定一个档位，与看板的 .folder 同形 */
function folderSvg(context: TrackContext, cell: FolderCell, x: number, y: number): string {
  const { palette } = context.input;
  const parts = [
    `<rect x="${x}" y="${y}" width="${TILE_SIZE}" height="${TILE_SIZE}" rx="44" ` +
      `fill="${palette.surfaceHi}" stroke="${palette.border}"/>`,
  ];
  context.slots.forEach((slot, index) => {
    const miniX = x + FOLDER_PADDING + (index % 2) * (MINI_SIZE + FOLDER_GAP);
    const miniY = y + FOLDER_PADDING + Math.floor(index / 2) * (MINI_SIZE + FOLDER_GAP);
    parts.push(miniSvg(context, cell, slot, index, miniX, miniY));
  });
  return parts.join("");
}

/** 文件夹里的一个角：作品、失败标记、空位或溢出计数 */
function miniSvg(context: TrackContext, cell: FolderCell, slot: string, index: number, x: number, y: number): string {
  const { palette } = context.input;
  const box = `x="${x}" y="${y}" width="${MINI_SIZE}" height="${MINI_SIZE}" rx="18"`;
  const center = { x: x + MINI_SIZE / 2, y: y + MINI_SIZE / 2 };
  if (slot === OVERFLOW_SLOT) {
    return cell.overflow === 0 ? "" : text(center.x, center.y + 6, `+${cell.overflow}`, palette.textDim, 18, 'text-anchor="middle" font-weight="600"');
  }
  const card = cell.slotCards[index] ?? null;
  if (card === null) return `<rect ${box} fill="none" stroke="${palette.border}" stroke-dasharray="3 3"/>`;
  const art = context.input.thumbnails.get(thumbnailKey(card));
  const content =
    art === undefined
      ? `<rect ${box} fill="${palette.surface}"/>` + text(center.x, center.y + 7, "✕", palette.err, 20, 'text-anchor="middle"')
      : `<rect ${box} fill="#fff"/><image href="${escapeXml(art)}" x="${x + 2}" y="${y + 2}" ` +
        `width="${MINI_SIZE - 4}" height="${MINI_SIZE - 4}" preserveAspectRatio="xMidYMid meet"/>`;
  const dot = `<circle cx="${x + MINI_SIZE - 10}" cy="${y + 10}" r="5" fill="${statusColor(card, palette)}" stroke="${palette.surfaceHi}" stroke-width="2"/>`;
  return content + dot + countBadge(cell, slot, x, y, palette);
}

/** 这一角有多个上游的结果时，左下角标 `×N` */
function countBadge(cell: FolderCell, slot: string, x: number, y: number, palette: Palette): string {
  const count = slotCount(cell, slot);
  if (count <= 1) return "";
  const label = `×${count}`;
  const width = 10 + label.length * 7;
  return (
    `<rect x="${x + 6}" y="${y + MINI_SIZE - 22}" width="${width}" height="16" rx="8" fill="${palette.bg}" fill-opacity="0.8"/>` +
    text(x + 6 + width / 2, y + MINI_SIZE - 10, label, palette.text, 11, 'text-anchor="middle" font-weight="600"')
  );
}

function healthColor(moment: Moment, palette: Palette): string {
  const health = momentHealth(moment);
  if (health === "ok") return palette.ok;
  return health === "partial" ? palette.warn : palette.err;
}

function statusColor(card: DashboardCard, palette: Palette): string {
  if (card.status === "ok") return palette.ok;
  return card.status === "no-svg" ? palette.warn : palette.err;
}

function line(x1: number, y1: number, x2: number, y2: number, stroke: string, width: number): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}"/>`;
}

function text(x: number, y: number, content: string, fill: string, size: number, extra = ""): string {
  return `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" ${extra}>${escapeXml(content)}</text>`;
}

function escapeXml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

/**
 * 把一个格子的结果集（弹窗里的内容）画成独立 SVG：标题 + 卡片。多上游时列 = 上游、行 = 强度，
 * 单上游时按强度排成一行。每张卡片与看板的 PelicanCard 同形：表头（时刻 + 两行徽章）、4:3 白底图框、
 * 页脚（状态、耗时、成本、体积、触发方式、评审结论）。
 * 作品以 <image> 嵌入 data URI，各自成为独立文档；背景全部不透明，栅格化后没有透明区域。
 * 文字宽度按字形估算并截断，不依赖浏览器测量，服务端与测试里也能画。
 */

import type { DashboardCard } from "@/core/types";
import { formatBytes, formatCost, formatDuration, JUDGE_TEXT, judgeCostBrief, STATUS_TEXT } from "../card/card-format";
import { formatZonedDateTime } from "../timeline/zoned-time";
import { escapeXml, thumbnailKey, type Palette, type RenderedSvg } from "./timeline-svg";

export interface ResultSetColumn {
  /** `default` 为登录态 */
  name: string;
  label: string;
  /** 色点颜色；登录态为 null */
  color: string | null;
}

export interface ResultSetExport {
  title: string;
  subtitle: string;
  cards: readonly DashboardCard[];
  /** 列：登录态在前，其余按配置顺序；只有一列时不画列标题 */
  columns: readonly ResultSetColumn[];
  /** 强度档位，按高低；只画有结果的 */
  efforts: readonly string[];
  timeZone: string;
  /** 成功作品的 data URI，键见 thumbnailKey */
  thumbnails: ReadonlyMap<string, string>;
  palette: Palette;
  /** `embed` 把作品嵌进图里（PNG / SVG）；`blank` 只留白底框并报告位置，帧由 GIF 录制逐帧画上 */
  artMode?: "embed" | "blank";
}

/** 一件作品在合成图里的内框（已扣掉图框内边距），GIF 逐帧把作品画在这里 */
export interface ArtFrame {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RenderedResultSet extends RenderedSvg {
  artFrames: ArtFrame[];
}

const PAD = 32;
const HEADER_HEIGHT = 72;
const GAP = 16;
const CARD_WIDTH = 300;
const CARD_HEAD = 96;
const FRAME_HEIGHT = (CARD_WIDTH * 3) / 4;
const FRAME_PAD = 10;
/** 页脚两行，与看板卡片同高 */
const CARD_FOOT = 70;
const CARD_HEIGHT = CARD_HEAD + FRAME_HEIGHT + CARD_FOOT;
const CARD_PAD = 14;
const ROW_LABEL_WIDTH = 56;
const COLUMN_HEAD = 28;
/** 单上游时一行最多几张卡 */
const CARDS_PER_ROW = 4;
const FONT = "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif";
const STRIPES_ID = "result-set-stripes";

export function renderResultSetSvg(input: ResultSetExport): RenderedResultSet {
  const efforts = input.efforts.filter((effort) => input.cards.some((card) => card.effort === effort));
  const matrix = input.columns.length > 1;
  const cells = matrix ? matrixCells(input, efforts) : rowCells(input, efforts);
  const columns = matrix ? input.columns.length : Math.min(CARDS_PER_ROW, Math.max(1, cells.length));
  const rows = matrix ? efforts.length : Math.ceil(cells.length / CARDS_PER_ROW);
  const gridLeft = PAD + (matrix ? ROW_LABEL_WIDTH : 0);
  const gridTop = PAD + HEADER_HEIGHT + (matrix ? COLUMN_HEAD + GAP : 0);
  const width = gridLeft + columns * (CARD_WIDTH + GAP) - GAP + PAD;
  const height = gridTop + Math.max(rows, 1) * (CARD_HEIGHT + GAP) - GAP + PAD;
  const { palette } = input;
  const artFrames: ArtFrame[] = [];

  const body = [
    stripesPattern(palette),
    `<rect width="${width}" height="${height}" fill="${palette.bg}"/>`,
    text(PAD, PAD + 26, input.title, palette.text, 22, 'font-weight="600"'),
    text(PAD, PAD + 52, clip(input.subtitle, width - PAD * 2, 13), palette.textDim, 13),
  ];
  if (matrix) body.push(columnHeads(input, gridLeft, PAD + HEADER_HEIGHT));
  if (matrix) efforts.forEach((effort, row) => body.push(text(PAD, gridTop + row * (CARD_HEIGHT + GAP) + 18, effort, palette.textDim, 12.5)));
  for (const cell of cells) {
    const x = gridLeft + cell.column * (CARD_WIDTH + GAP);
    const y = gridTop + cell.row * (CARD_HEIGHT + GAP);
    body.push(cell.card === null ? emptyCell(x, y, palette) : cardSvg(input, cell.card, x, y, artFrames));
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}" font-family="${FONT}">${body.join("")}</svg>`;
  return { svg, width, height, artFrames };
}

interface Cell {
  column: number;
  row: number;
  /** 矩阵里没跑的格子为 null */
  card: DashboardCard | null;
}

function matrixCells(input: ResultSetExport, efforts: readonly string[]): Cell[] {
  const cells: Cell[] = [];
  efforts.forEach((effort, row) => {
    input.columns.forEach((column, columnIndex) => {
      const card = input.cards.find((item) => item.effort === effort && (item.profile ?? "default") === column.name) ?? null;
      cells.push({ column: columnIndex, row, card });
    });
  });
  return cells;
}

function rowCells(input: ResultSetExport, efforts: readonly string[]): Cell[] {
  const ordered = [...input.cards].sort((a, b) => efforts.indexOf(a.effort) - efforts.indexOf(b.effort));
  return ordered.map((card, index) => ({ column: index % CARDS_PER_ROW, row: Math.floor(index / CARDS_PER_ROW), card }));
}

function columnHeads(input: ResultSetExport, left: number, top: number): string {
  const { palette } = input;
  return input.columns
    .map((column, index) => {
      const x = left + index * (CARD_WIDTH + GAP);
      const dot = column.color === null ? "" : `<circle cx="${x + 6}" cy="${top + 14}" r="4" fill="${column.color}"/>`;
      const textX = column.color === null ? x : x + 16;
      const label = clip(column.label, CARD_WIDTH - (textX - x), 13);
      return dot + text(textX, top + 18, label, column.color === null ? palette.textDim : palette.text, 13, 'font-weight="600"');
    })
    .join("");
}

function emptyCell(x: number, y: number, palette: Palette): string {
  return (
    `<rect x="${x}" y="${y}" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" rx="10" fill="none" stroke="${palette.border}" stroke-dasharray="4 4"/>` +
    text(x + CARD_WIDTH / 2, y + CARD_HEIGHT / 2 + 5, "—", palette.textFaint, 16, 'text-anchor="middle"')
  );
}

/** 一张卡片：表头（时刻、徽章）、图框、页脚；与看板卡片一样不画副标题 */
function cardSvg(input: ResultSetExport, card: DashboardCard, x: number, y: number, artFrames: ArtFrame[]): string {
  const { palette } = input;
  return (
    `<rect x="${x}" y="${y}" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" rx="10" fill="${palette.surface}" stroke="${palette.border}"/>` +
    text(x + CARD_PAD, y + 26, formatZonedDateTime(new Date(card.startedAt), input.timeZone), palette.text, 14.5, 'font-weight="600"') +
    badgeRows(cardBadges(input, card), x + CARD_PAD, y + 38, CARD_WIDTH - CARD_PAD * 2, palette) +
    frameSvg(input, card, x, y + CARD_HEAD, artFrames) +
    footerSvg(card, x, y + CARD_HEAD + FRAME_HEIGHT, palette)
  );
}

interface Badge {
  label: string;
  color: string;
  /** 上游色点 */
  dot?: string | null;
}

/** 与看板卡片表头同序：CLI、模型、强度、上游（登录态不出）、题目、变量取值 */
function cardBadges(input: ResultSetExport, card: DashboardCard): Badge[] {
  const { palette } = input;
  const folded = card.effortHonored && card.appliedEffort !== card.effort;
  const effort: Badge = !card.effortHonored
    ? { label: "强度不可调", color: palette.warn }
    : { label: `effort: ${folded ? `${card.effort} → ${card.appliedEffort}` : card.effort}`, color: folded ? palette.warn : palette.textDim };
  const column = input.columns.find((item) => item.name === card.profile);
  const profile: Badge[] = card.profile === undefined ? [] : [{ label: column?.label ?? card.profile, color: palette.text, dot: column?.color ?? null }];
  return [
    { label: card.cli, color: palette.text },
    { label: card.model, color: palette.textDim },
    effort,
    ...profile,
    { label: card.promptId, color: palette.textFaint },
    ...Object.entries(card.bindings).map(([k, v]) => ({ label: `${k}: ${v}`, color: palette.accent })),
  ];
}

/** 徽章最多两行（与看板表头同高），放不下的省略 */
function badgeRows(badges: readonly Badge[], x: number, y: number, maxWidth: number, palette: Palette): string {
  const parts: string[] = [];
  let cursor = x;
  let row = 0;
  for (const badge of badges) {
    const dotWidth = badge.dot ? 12 : 0;
    const width = estimateWidth(badge.label, 11.5) + 14 + dotWidth;
    if (cursor + width > x + maxWidth) {
      if (cursor === x || row === 1) break;
      row = 1;
      cursor = x;
    }
    const top = y + row * 26;
    const dot = badge.dot ? `<circle cx="${cursor + 11}" cy="${top + 10}" r="4" fill="${badge.dot}"/>` : "";
    parts.push(
      `<rect x="${cursor}" y="${top}" width="${round(width)}" height="20" rx="6" fill="${palette.surfaceHi}" stroke="${palette.border}"/>` +
        dot + text(cursor + 7 + dotWidth, top + 14, badge.label, badge.color, 11.5),
    );
    cursor += width + 6;
  }
  return parts.join("");
}

/** 图框：成功的作品白底等比居中；失败或已脱敏的用条纹底写原因 */
function frameSvg(input: ResultSetExport, card: DashboardCard, x: number, y: number, artFrames: ArtFrame[]): string {
  const { palette } = input;
  const key = thumbnailKey(card);
  const art = input.thumbnails.get(key);
  if (art !== undefined) {
    const inner = { key, x: x + FRAME_PAD, y: y + FRAME_PAD, width: CARD_WIDTH - FRAME_PAD * 2, height: FRAME_HEIGHT - FRAME_PAD * 2 };
    artFrames.push(inner);
    const white = `<rect x="${x}" y="${y}" width="${CARD_WIDTH}" height="${FRAME_HEIGHT}" fill="#fff"/>`;
    if (input.artMode === "blank") return white;
    return (
      white +
      `<image href="${escapeXml(art)}" x="${inner.x}" y="${inner.y}" width="${inner.width}" height="${inner.height}" ` +
      `preserveAspectRatio="xMidYMid meet"/>`
    );
  }
  const redacted = card.status === "ok";
  const status = redacted ? "已脱敏，未发布" : STATUS_TEXT[card.status];
  const reason = card.error ?? status;
  const color = card.status === "no-svg" ? palette.warn : card.status === "ok" ? palette.textDim : palette.err;
  const lines = wrap(reason, CARD_WIDTH - 40, 12, 5);
  const startY = y + FRAME_HEIGHT / 2 - (lines.length * 17) / 2 - 4;
  return (
    `<rect x="${x}" y="${y}" width="${CARD_WIDTH}" height="${FRAME_HEIGHT}" fill="url(#${STRIPES_ID})"/>` +
    text(x + CARD_WIDTH / 2, startY, status, color, 13, 'text-anchor="middle" font-weight="600"') +
    lines.map((line, index) => text(x + CARD_WIDTH / 2, startY + 22 + index * 17, line, palette.textFaint, 12, 'text-anchor="middle"')).join("")
  );
}

/**
 * 页脚三行，与看板同序：第一行状态与紧跟的评审结论（按结论染色）；第二行耗时、成本、体积、触发方式；
 * 有裁判成本时第三行「裁判 $x · n 次问答 · token」
 */
function footerSvg(card: DashboardCard, x: number, y: number, palette: Palette): string {
  const redacted = card.status === "ok" && card.svgFile === null;
  const statusColor = redacted ? palette.textDim : card.status === "ok" ? palette.ok : card.status === "no-svg" ? palette.warn : palette.err;
  const status = redacted ? "已脱敏" : STATUS_TEXT[card.status];
  const cost = `${card.profile === undefined ? "" : "官价 "}${formatCost(card.cost)}`;
  const second = [`耗时 ${formatDuration(card.durationMs)}`, cost, card.svgBytes === null ? null : formatBytes(card.svgBytes), card.trigger === "schedule" ? "定时" : "手动"]
    .filter((item): item is string => item !== null)
    .join("   ");
  const statusWidth = estimateWidth(status, 12.5);
  const judge = judgeTag(card, palette);
  return (
    `<line x1="${x}" y1="${y}" x2="${x + CARD_WIDTH}" y2="${y}" stroke="${palette.border}"/>` +
    text(x + CARD_PAD, y + 19, status, statusColor, 12.5, 'font-weight="600"') +
    (judge === null ? "" : text(x + CARD_PAD + statusWidth + 12, y + 19, judge.label, judge.color, 12, 'font-weight="600"')) +
    text(x + CARD_PAD, y + 38, clip(second, CARD_WIDTH - CARD_PAD * 2, 12), palette.textDim, 12) +
    (card.judgeCost == null ? "" : text(x + CARD_PAD, y + 57, clip(judgeCostBrief(card.judgeCost), CARD_WIDTH - CARD_PAD * 2, 12), palette.textDim, 12))
  );
}

/** 评审标签：与看板页脚同文案「智商在线 94」；没有评审记录的卡片不画 */
function judgeTag(card: DashboardCard, palette: Palette): { label: string; color: string } | null {
  const judge = card.judge;
  if (judge == null) return null;
  const { verdict, score } = judge.total;
  const color = verdict === "online" ? palette.ok : verdict === "degraded" ? palette.err : palette.textDim;
  return { label: `${JUDGE_TEXT[verdict]} ${score}`, color };
}

function stripesPattern(palette: Palette): string {
  return (
    `<defs><pattern id="${STRIPES_ID}" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(135)">` +
    `<rect width="20" height="20" fill="${palette.surface}"/><rect width="10" height="20" fill="${palette.surfaceHi}"/></pattern></defs>`
  );
}

const WIDE_CHAR = /[⺀-鿿豈-﫿＀-￯　-〿 -⁯]/u;

/** 按字形估算文字宽度：中日韩与全角按 1 em，其余按 0.58 em */
export function estimateWidth(value: string, size: number): number {
  let width = 0;
  for (const char of value) width += WIDE_CHAR.test(char) ? size : size * 0.58;
  return width;
}

/** 超过宽度时截断并加省略号 */
export function clip(value: string, maxWidth: number, size: number): string {
  if (estimateWidth(value, size) <= maxWidth) return value;
  const chars = [...value];
  while (chars.length > 0 && estimateWidth(`${chars.join("")}…`, size) > maxWidth) chars.pop();
  return `${chars.join("")}…`;
}

/** 按宽度折行，最多 maxLines 行；放不下的部分并入末行截断加省略号 */
export function wrap(value: string, maxWidth: number, size: number, maxLines: number): string[] {
  const chars = [...value];
  const lines: string[] = [];
  let current = "";
  for (const [index, char] of chars.entries()) {
    if (estimateWidth(current + char, size) <= maxWidth) {
      current += char;
      continue;
    }
    lines.push(current);
    current = char;
    if (lines.length === maxLines) {
      lines[maxLines - 1] = clip(`${lines[maxLines - 1]}${chars.slice(index).join("")}`, maxWidth, size);
      return lines;
    }
  }
  if (current !== "") lines.push(current);
  return lines;
}

function text(x: number, y: number, content: string, fill: string, size: number, extra = ""): string {
  return `<text x="${round(x)}" y="${round(y)}" fill="${fill}" font-size="${size}" ${extra}>${escapeXml(content)}</text>`;
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

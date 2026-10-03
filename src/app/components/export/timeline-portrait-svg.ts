/**
 * 竖版导出：横版的行列转置。模型（CLI · 模型 × 题目）按列横排，列头与横版的行标签同形
 * （名称、题目、上游色点、鹈鹕通过率）；每一轮一行，从上往下按时间排列，行左是健康点、钟点
 * 与结果数，格子落在对应模型的列里。行高相等，不按时间间隔伸缩，没有 24 小时轨道与现在线。
 * 格子与列头的画法与横版（timeline-svg.ts）共用。
 */

import { folderCell, OVERFLOW_SLOT, planSlots, SLOT_CORNERS } from "../timeline/effort-slots";
import type { DashboardCard } from "@/core/types";
import type { Moment } from "../timeline/moments";
import { listRows, rowKeyOf, type Row } from "../timeline/rows";
import { wrap } from "./result-set-svg";
import {
  FONT,
  TILE_SIZE,
  folderSvg,
  healthColor,
  labelLines,
  line,
  text,
  type FolderDrawContext,
  type LabelContext,
  type RenderedSvg,
  type TimelineExport,
} from "./timeline-svg";

const PAD = 32;
/** 行左的时刻栏 */
export const TIME_COLUMN_WIDTH = 120;
export const COLUMN_GAP = 16;
/** 行高，与横版的 --cell-height 一致 */
export const ROW_HEIGHT = 236;
const HEAD_PADDING = 12;
const LINE_HEIGHT = 18;
/** 没有任何列时的最小宽度，放得下标题与空数据提示 */
const MIN_WIDTH = 560;

interface PortraitContext extends FolderDrawContext, LabelContext {
  input: TimelineExport;
  /** 列 = 横版的行，顺序相同 */
  columns: readonly Row[];
  width: number;
}

/** 画好的一段：从某个 top 开始占 height 像素 */
interface Block {
  svg: string;
  height: number;
}

export function renderTimelinePortraitSvg(input: TimelineExport): RenderedSvg {
  const cards = input.moments.flatMap((moment) => moment.cards);
  const columns = listRows(cards);
  const contentWidth = TIME_COLUMN_WIDTH + Math.max(0, columns.length * (TILE_SIZE + COLUMN_GAP) - COLUMN_GAP);
  const width = Math.max(MIN_WIDTH, PAD * 2 + contentWidth);
  const context: PortraitContext = {
    input,
    slots: planSlots(input.efforts),
    showPrompt: new Set(cards.map((card) => card.promptId)).size > 1,
    columns,
    width,
  };
  const byTime = [...input.moments].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  const top = header(context);
  const head = columnHead(context, cards, top.height);
  const rowsTop = top.height + head.height;
  const rows = byTime.map((moment, index) => momentRow(context, moment, rowsTop + index * ROW_HEIGHT));
  const empty = byTime.length === 0 ? text(PAD, rowsTop + 40, "这一天还没有符合筛选的执行结果", input.palette.textDim, 14) : "";
  const height = rowsTop + Math.max(byTime.length * ROW_HEIGHT, byTime.length === 0 ? 64 : 0) + PAD;
  const body = `<rect width="${width}" height="${height}" fill="${input.palette.bg}"/>` + top.svg + head.svg + rows.join("") + empty;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}" font-family="${FONT}">${body}</svg>`;
  return { svg, width, height };
}

/** 列 index 的左边缘 x */
function columnX(index: number): number {
  return PAD + TIME_COLUMN_WIDTH + index * (TILE_SIZE + COLUMN_GAP);
}

/** 标题、折行的说明与格内位置图例 */
function header({ input, slots, width }: PortraitContext): Block {
  const { palette } = input;
  const subtitleLines = wrap(input.subtitle, width - PAD * 2, 13, 3);
  const parts = [text(PAD, PAD + 24, input.title, palette.text, 22, 'font-weight="600"')];
  subtitleLines.forEach((item, index) => parts.push(text(PAD, PAD + 50 + index * LINE_HEIGHT, item, palette.textDim, 13)));
  const legendY = PAD + 50 + subtitleLines.length * LINE_HEIGHT + 10;
  const legend = slots.map((slot, index) => `${SLOT_CORNERS[index] ?? ""} ${slot === OVERFLOW_SLOT ? "其余档位" : slot}`).join("    ");
  if (legend !== "") parts.push(text(PAD, legendY, `格内位置    ${legend}`, palette.textDim, 12));
  return { svg: parts.join(""), height: legendY + 16 };
}

/** 列头：左侧「模型 N 个」，每列与横版行标签同样的几行，顶对齐；高度取最高的一列 */
function columnHead(context: PortraitContext, cards: readonly DashboardCard[], top: number): Block {
  const { palette } = context.input;
  const stacks = context.columns.map((row, index) => labelLines(context, row, cards.filter((card) => rowKeyOf(card) === row.key), columnX(index)));
  const tallest = Math.max(0, ...stacks.map((lines) => lines.reduce((sum, item) => sum + item.height, 0)));
  const height = tallest + HEAD_PADDING * 2;
  const parts = [
    `<rect x="0" y="${top}" width="${context.width}" height="${height}" fill="${palette.surface}"/>`,
    line(0, top + height, context.width, top + height, palette.border, 1),
    text(PAD, top + HEAD_PADDING + 13, "模型", palette.text, 13, 'font-weight="600"'),
    text(PAD + 36, top + HEAD_PADDING + 13, `${context.columns.length} 个`, palette.textFaint, 12),
  ];
  for (const lines of stacks) {
    let lineTop = top + HEAD_PADDING;
    for (const item of lines) {
      parts.push(item.draw(lineTop));
      lineTop += item.height;
    }
  }
  return { svg: parts.join(""), height };
}

/** 一轮一行：行左是健康点、钟点与结果数，格子落在各自模型的列里，行底一条分隔线 */
function momentRow(context: PortraitContext, moment: Moment, top: number): string {
  const { palette, profiles = [] } = context.input;
  const centerY = top + ROW_HEIGHT / 2;
  const parts = [
    line(0, top + ROW_HEIGHT, context.width, top + ROW_HEIGHT, palette.border, 0.5),
    `<circle cx="${PAD + 5}" cy="${centerY - 5}" r="5" fill="${healthColor(moment, palette)}"/>`,
    text(PAD + 16, centerY, moment.clock, palette.text, 14, 'font-weight="600"'),
    text(PAD, centerY + LINE_HEIGHT, `${moment.cards.length} 个结果 · 成功 ${moment.okCount}`, palette.textDim, 11),
  ];
  context.columns.forEach((row, index) => {
    const cell = folderCell(moment, row, context.slots, context.input.efforts, profiles);
    if (cell === null) return;
    parts.push(folderSvg(context, cell, columnX(index), top + (ROW_HEIGHT - TILE_SIZE) / 2));
  });
  return parts.join("");
}

/**
 * 时间轨道的几何：轴与矩阵共用一条 x 轴，横向滚动。比例是分段线性的：缺省 1 小时
 * HOUR_WIDTH 像素，相邻两轮挨得太近放不下两列时，只把这两轮之间的那一段撑到一个列宽，
 * 其余时段不受影响；刻度、现在线与列都按同一映射定位，所以刻度不等距但位置准确。
 * 每轮一列，列中心对准准确时刻；只有时间戳完全相同的轮次无法靠撑开分开，后一列右移，
 * 轴上标记留在原处。
 *
 * 高度常量须与 globals.css 的 --axis-height / --head-height / --lane-head-height /
 * --cell-height 保持同步。
 */

import type { Moment } from "./moments";

export const HOUR_WIDTH = 320;
/** 列宽，与 globals.css 的 --cell-width 一致 */
export const CELL_WIDTH = 232;
export const AXIS_HEIGHT = 56;
export const HEAD_HEIGHT = 30;
/** 轴线在轴区里的纵向位置 */
export const AXIS_LINE_Y = 34;
/**
 * 轨道两端留白，避免 00 点附近的刻度与格子被滚动容器截掉一半；须大于 CELL_WIDTH / 2。
 */
export const TRACK_PADDING = 120;
/** 相邻两列之间至少留的空隙 */
const COLUMN_GAP = 6;
/** 小于这个像素数的右移视作浮点误差，列仍算落在准确时刻 */
const PUSH_TOLERANCE = 0.5;

/** 分段线性比例上的一个锚点：一天中的位置（0–1）对应轨道上的 x */
export interface ScaleAnchor {
  fraction: number;
  x: number;
}

/** 按 fraction 递增排列的锚点，首尾固定为 00:00 与 24:00；相邻锚点之间线性插值 */
export type TimeScale = readonly ScaleAnchor[];

/** 没有轮次时的等比例轴 */
export const UNIFORM_SCALE: TimeScale = [
  { fraction: 0, x: TRACK_PADDING },
  { fraction: 1, x: TRACK_PADDING + HOUR_WIDTH * 24 },
];

export interface Column {
  moment: Moment;
  /** 准确时刻在轴上的 x */
  exactX: number;
  /** 列中心的 x；未被推开时等于 exactX */
  x: number;
}

export interface TrackLayout {
  columns: Column[];
  /** 轨道总宽：整天加两端留白，最后一列被推出 24:00 时再加宽 */
  width: number;
  /** 这一天的时间比例，轴刻度与现在线都按它定位 */
  scale: TimeScale;
}

/** 按时间从早到晚排列，重叠时只向右推，第一列始终位于准确时刻 */
export function layoutColumns(moments: readonly Moment[], cellWidth: number): TrackLayout {
  const byTime = [...moments].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  const scale = buildScale(byTime, cellWidth);
  const columns: Column[] = [];
  for (const moment of byTime) {
    const exactX = timeX(moment.fraction, scale);
    const previous = columns[columns.length - 1];
    const pushedX = previous === undefined ? exactX : previous.x + cellWidth + COLUMN_GAP;
    // 撑开后的列刚好相切，浮点误差不算被推开
    const x = pushedX - exactX > PUSH_TOLERANCE ? pushedX : exactX;
    columns.push({ moment, exactX, x });
  }
  const last = columns[columns.length - 1];
  const dayWidth = scale[scale.length - 1]!.x + TRACK_PADDING;
  const width = last === undefined ? dayWidth : Math.max(dayWidth, last.x + cellWidth / 2 + COLUMN_GAP);
  return { columns, width, scale };
}

/**
 * 以 00:00、各轮时刻、24:00 为锚点建比例：每一段缺省按 HOUR_WIDTH 换算，两端都是轮次
 * 且按缺省放不下两列的那一段撑到「列宽加空隙」。只撑不压，时刻相同的轮次合并成一个锚点。
 */
export function buildScale(byTime: readonly Moment[], cellWidth: number): TimeScale {
  const momentFractions = [...new Set(byTime.map((moment) => moment.fraction))].sort((a, b) => a - b);
  const anchors: ScaleAnchor[] = [{ fraction: 0, x: TRACK_PADDING }];
  // 累计撑开量单独记，x 由准确时刻加撑开量得出，不让逐段相加的浮点误差积到 24:00
  let stretch = 0;
  const place = (fraction: number, minWidth: number): void => {
    const previous = anchors[anchors.length - 1]!;
    const natural = (fraction - previous.fraction) * 24 * HOUR_WIDTH;
    stretch += Math.max(0, minWidth - natural);
    anchors.push({ fraction, x: TRACK_PADDING + fraction * 24 * HOUR_WIDTH + stretch });
  };
  momentFractions.forEach((fraction, index) => {
    const betweenMoments = index > 0 && fraction > 0;
    place(fraction, betweenMoments ? cellWidth + COLUMN_GAP : 0);
  });
  if (anchors[anchors.length - 1]!.fraction < 1) place(1, 0);
  return anchors;
}

/** 一天中的位置（0–1）在轨道上的 x：在所属分段内线性插值 */
export function timeX(fraction: number, scale: TimeScale = UNIFORM_SCALE): number {
  const upperIndex = scale.findIndex((anchor) => anchor.fraction >= fraction);
  if (upperIndex <= 0) {
    const edge = upperIndex === 0 ? scale[0]! : scale[scale.length - 1]!;
    return edge.x + (fraction - edge.fraction) * 24 * HOUR_WIDTH;
  }
  const lower = scale[upperIndex - 1]!;
  const upper = scale[upperIndex]!;
  const ratio = (fraction - lower.fraction) / (upper.fraction - lower.fraction);
  return lower.x + ratio * (upper.x - lower.x);
}

export function hourX(hour: number, scale: TimeScale = UNIFORM_SCALE): number {
  return timeX(hour / 24, scale);
}

/** 与现在标签距离小于此值的钟点数字不显示，避免重叠 */
const NOW_LABEL_CLEARANCE = 44;

export function hourLabelVisible(hour: number, nowX: number | null, scale: TimeScale = UNIFORM_SCALE): boolean {
  return nowX === null || Math.abs(hourX(hour, scale) - nowX) >= NOW_LABEL_CLEARANCE;
}

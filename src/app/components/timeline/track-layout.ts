/**
 * 时间轨道的几何：轴与矩阵共用一条 x 轴，1 小时 = HOUR_WIDTH 像素，整天固定宽度、
 * 横向滚动。每轮一列，列中心对准准确时刻；相互重叠时后一列右移，轴上标记留在原处。
 *
 * 高度常量须与 globals.css 的 --axis-height / --head-height / --lane-head-height /
 * --cell-height 保持同步。
 */

import type { Moment } from "./moments";

export const HOUR_WIDTH = 320;
export const DAY_WIDTH = HOUR_WIDTH * 24;
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
}

/** 按时间从早到晚排列，重叠时只向右推，第一列始终位于准确时刻 */
export function layoutColumns(moments: readonly Moment[], cellWidth: number): TrackLayout {
  const byTime = [...moments].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  const columns: Column[] = [];
  for (const moment of byTime) {
    const exactX = timeX(moment.fraction);
    const previous = columns[columns.length - 1];
    const x = previous === undefined ? exactX : Math.max(exactX, previous.x + cellWidth + COLUMN_GAP);
    columns.push({ moment, exactX, x });
  }
  const last = columns[columns.length - 1];
  const dayWidth = DAY_WIDTH + TRACK_PADDING * 2;
  const width = last === undefined ? dayWidth : Math.max(dayWidth, last.x + cellWidth / 2 + COLUMN_GAP);
  return { columns, width };
}

/** 一天中的位置（0–1）在轨道上的 x */
export function timeX(fraction: number): number {
  return TRACK_PADDING + fraction * DAY_WIDTH;
}

export function hourX(hour: number): number {
  return timeX(hour / 24);
}

/** 与现在标签距离小于此值的钟点数字不显示，避免重叠 */
const NOW_LABEL_CLEARANCE = 44;

export function hourLabelVisible(hour: number, nowX: number | null): boolean {
  return nowX === null || Math.abs(hourX(hour) - nowX) >= NOW_LABEL_CLEARANCE;
}

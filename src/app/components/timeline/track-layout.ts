/**
 * 时间轨道的几何：轴与矩阵共用一条 x 轴，横向滚动。1 小时的像素数按当天轮次的疏密伸缩：
 * 缺省 HOUR_WIDTH，相邻两轮挨得近时放大到相邻列不重叠为止（上限 HOUR_WIDTH_MAX），
 * 免得被推开的列离自己的时刻越来越远。每轮一列，列中心对准准确时刻；仍重叠时后一列右移，
 * 轴上标记留在原处。
 *
 * 高度常量须与 globals.css 的 --axis-height / --head-height / --lane-head-height /
 * --cell-height 保持同步。
 */

import type { Moment } from "./moments";

export const HOUR_WIDTH = 320;
/** 伸缩上限：再密的轮次（间隔不到 15 分钟）就只能推开 */
export const HOUR_WIDTH_MAX = 960;
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
  /** 这一天 1 小时的像素数，轴刻度与现在线都按它定位 */
  hourWidth: number;
}

/** 按时间从早到晚排列，重叠时只向右推，第一列始终位于准确时刻 */
export function layoutColumns(moments: readonly Moment[], cellWidth: number): TrackLayout {
  const byTime = [...moments].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  const hourWidth = fitHourWidth(byTime, cellWidth);
  const columns: Column[] = [];
  for (const moment of byTime) {
    const exactX = timeX(moment.fraction, hourWidth);
    const previous = columns[columns.length - 1];
    const x = previous === undefined ? exactX : Math.max(exactX, previous.x + cellWidth + COLUMN_GAP);
    columns.push({ moment, exactX, x });
  }
  const last = columns[columns.length - 1];
  const dayWidth = hourWidth * 24 + TRACK_PADDING * 2;
  const width = last === undefined ? dayWidth : Math.max(dayWidth, last.x + cellWidth / 2 + COLUMN_GAP);
  return { columns, width, hourWidth };
}

/**
 * 让相邻两列都放得下所需的小时宽度：取各相邻轮次「列宽加空隙 ÷ 间隔小时数」的最大值，
 * 夹在缺省与上限之间；超出上限的那几对（间隔太短）不参与，交给推开处理。
 */
export function fitHourWidth(byTime: readonly Moment[], cellWidth: number): number {
  let needed = HOUR_WIDTH;
  for (let index = 1; index < byTime.length; index += 1) {
    const gapHours = (byTime[index]!.fraction - byTime[index - 1]!.fraction) * 24;
    if (gapHours <= 0) continue;
    const widthForPair = (cellWidth + COLUMN_GAP) / gapHours;
    if (widthForPair <= HOUR_WIDTH_MAX) needed = Math.max(needed, widthForPair);
  }
  return Math.ceil(needed);
}

/** 一天中的位置（0–1）在轨道上的 x */
export function timeX(fraction: number, hourWidth = HOUR_WIDTH): number {
  return TRACK_PADDING + fraction * hourWidth * 24;
}

export function hourX(hour: number, hourWidth = HOUR_WIDTH): number {
  return timeX(hour / 24, hourWidth);
}

/** 与现在标签距离小于此值的钟点数字不显示，避免重叠 */
const NOW_LABEL_CLEARANCE = 44;

export function hourLabelVisible(hour: number, nowX: number | null, hourWidth = HOUR_WIDTH): boolean {
  return nowX === null || Math.abs(hourX(hour, hourWidth) - nowX) >= NOW_LABEL_CLEARANCE;
}

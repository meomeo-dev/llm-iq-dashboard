/**
 * 格子内 2×2 四角到强度档位的映射，当天所有格子一致，便于横向比较。
 * 档位多于四个时前三个各占一角，其余收进第四角显示为 “+N”。
 */

import type { DashboardCard } from "@/core/types";
import type { Moment } from "./moments";
import type { Row } from "./rows";

export const SLOT_COUNT = 4;

/** 第四角的溢出标记（非档位名），渲染为 “+N” */
export const OVERFLOW_SLOT = "…";

/** 当天出现的档位（已按高低排序）映射到四个角 */
export function planSlots(efforts: readonly string[]): string[] {
  if (efforts.length <= SLOT_COUNT) return [...efforts];
  return [...efforts.slice(0, SLOT_COUNT - 1), OVERFLOW_SLOT];
}

export interface FolderCell {
  /** 这一格的全部结果，按档位高低排 */
  cards: DashboardCard[];
  /** 与 slots 一一对应：该角的结果；没跑就是 null */
  slotCards: Array<DashboardCard | null>;
  /** 收进溢出角的结果数 */
  overflow: number;
}

/** 某一轮里某一行的格子；这一行在这一轮没有任何结果时返回 null */
export function folderCell(
  moment: Moment,
  row: Row,
  slots: readonly string[],
  efforts: readonly string[],
): FolderCell | null {
  const rank = (card: DashboardCard): number => efforts.indexOf(card.effort);
  const cards = moment.cards
    .filter((card) => card.cli === row.cli && card.model === row.model && card.promptId === row.promptId)
    .sort((a, b) => rank(a) - rank(b));
  if (cards.length === 0) return null;
  const named = new Set(slots.filter((slot) => slot !== OVERFLOW_SLOT));
  return {
    cards,
    slotCards: slots.map((slot) => cards.find((card) => card.effort === slot) ?? null),
    overflow: cards.filter((card) => !named.has(card.effort)).length,
  };
}

/** 图例文字：左上、右上、左下、右下依次对应的档位 */
export const SLOT_CORNERS = ["↖", "↗", "↙", "↘"];

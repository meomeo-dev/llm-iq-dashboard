/**
 * 格子内 2×2 四角到强度档位的映射，当天所有格子一致，便于横向比较。
 * 档位多于四个时前三个各占一角，其余收进第四角显示为 “+N”。
 */

import type { Verdict } from "@/core/judge/schema";
import { orderProfileNames, type ProfileView } from "@/core/profile-view";
import { DEFAULT_PROFILE, type DashboardCard } from "@/core/types";
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
  /** 这一格的全部结果，按档位高低排；同档位内登录态在前，其余按配置顺序 */
  cards: DashboardCard[];
  /** 与 slots 一一对应：该角的代表结果（多个上游时取登录态，否则配置顺序第一个）；没跑就是 null */
  slotCards: Array<DashboardCard | null>;
  /** 收进溢出角的结果数 */
  overflow: number;
}

/** 卡片来自哪个上游；登录态的卡片没有 profile 字段 */
export function upstreamOf(card: Pick<DashboardCard, "profile">): string {
  return card.profile ?? DEFAULT_PROFILE;
}

/** 某一轮里某一行的格子；这一行在这一轮没有任何结果时返回 null */
export function folderCell(
  moment: Moment,
  row: Row,
  slots: readonly string[],
  efforts: readonly string[],
  profiles: readonly ProfileView[] = [],
): FolderCell | null {
  const rowCards = moment.cards.filter(
    (card) => card.cli === row.cli && card.model === row.model && card.promptId === row.promptId,
  );
  const upstreams = orderProfileNames(rowCards.map(upstreamOf), profiles);
  const rank = (card: DashboardCard): number => efforts.indexOf(card.effort);
  const upstreamRank = (card: DashboardCard): number => upstreams.indexOf(upstreamOf(card));
  const cards = rowCards.sort((a, b) => rank(a) - rank(b) || upstreamRank(a) - upstreamRank(b));
  if (cards.length === 0) return null;
  const named = new Set(slots.filter((slot) => slot !== OVERFLOW_SLOT));
  return {
    cards,
    slotCards: slots.map((slot) => cards.find((card) => card.effort === slot) ?? null),
    overflow: cards.filter((card) => !named.has(card.effort)).length,
  };
}

/** 这一角有几个上游的结果；大于 1 时格子上标 `×N` */
export function slotCount(cell: FolderCell, slot: string): number {
  return new Set(cell.cards.filter((card) => card.effort === slot).map(upstreamOf)).size;
}

/** 一个角最多逐件列几个评审结论图标；再多就改为按结论计数 */
export const SLOT_MARK_LIMIT = 3;

/** 计数显示上限 */
export const SLOT_COUNT_CAP = 99;

/** 计数模式下结论的固定顺序 */
const VERDICT_ORDER: readonly Verdict[] = ["online", "degraded", "pending"];

export type SlotMarks =
  /** 逐件：顺序与弹窗里的上游列一致 */
  | { kind: "list"; verdicts: Verdict[] }
  /** 计数：只列出现过的结论，按在线、降智、待复核排 */
  | { kind: "summary"; counts: Array<{ verdict: Verdict; count: number }> };

/**
 * 这一角各上游作品的评审结论（ACR-019）。没有评审记录的作品在有记录的同伴旁按待复核占位，
 * 保持与弹窗列的顺序对应；整角都没有评审记录（题目没有评分标准）时不出图标；
 * 超过 SLOT_MARK_LIMIT 件时逐件列不下，改为按结论计数。
 */
export function slotMarks(cell: FolderCell, slot: string): SlotMarks {
  const cards = cell.cards.filter((card) => card.effort === slot);
  if (!cards.some((card) => card.judge != null)) return { kind: "list", verdicts: [] };
  const verdicts = cards.map((card): Verdict => card.judge?.total.verdict ?? "pending");
  if (verdicts.length <= SLOT_MARK_LIMIT) return { kind: "list", verdicts };
  const counts = VERDICT_ORDER
    .map((verdict) => ({ verdict, count: verdicts.filter((item) => item === verdict).length }))
    .filter((item) => item.count > 0);
  return { kind: "summary", counts };
}

/** 这一格出现过的第三方上游（登录态不算），登录态在前的顺序里去掉登录态 */
export function cellUpstreams(cards: readonly DashboardCard[], profiles: readonly ProfileView[]): string[] {
  return orderProfileNames(cards.map(upstreamOf), profiles).filter((name) => name !== DEFAULT_PROFILE);
}

/** 图例文字：左上、右上、左下、右下依次对应的档位 */
export const SLOT_CORNERS = ["↖", "↗", "↙", "↘"];

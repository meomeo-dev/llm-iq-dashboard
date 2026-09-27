/**
 * 把卡片按轮次聚合成时刻（moment），对应时间线上的一个标记与矩阵里的一列。
 * 日期与钟点在聚合时按所选时区算好（见 zoned-time.ts），换时区需重新聚合。
 */

import type { DashboardCard } from "@/core/types";
import { formatZonedClock, zonedDayFraction, zonedDayKey } from "./zoned-time";

export interface Moment {
  runId: string;
  startedAt: string;
  /** 所选时区下的日期键 YYYY-MM-DD，用于按天切换 */
  dayKey: string;
  /** 所选时区下在一天中的位置，0 = 00:00，1 = 24:00 */
  fraction: number;
  /** 所选时区下的钟点，如 “21:59” */
  clock: string;
  cards: DashboardCard[];
  okCount: number;
}

export interface DayOption {
  dayKey: string;
  momentCount: number;
}

/** 按轮次聚合，时刻从新到旧排列 */
export function groupMoments(cards: readonly DashboardCard[], timeZone: string): Moment[] {
  const byRun = new Map<string, DashboardCard[]>();
  for (const card of cards) {
    byRun.set(card.runId, [...(byRun.get(card.runId) ?? []), card]);
  }

  return [...byRun.entries()]
    .map(([runId, runCards]) => toMoment(runId, runCards, timeZone))
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

function toMoment(runId: string, runCards: DashboardCard[], timeZone: string): Moment {
  // 同一轮的卡片共享开始时刻；runId 来自其中一张卡片，查找必有结果
  const startedAt = runCards.find((card) => card.runId === runId)?.runStartedAt ?? "";
  const at = new Date(startedAt);
  return {
    runId,
    startedAt,
    dayKey: zonedDayKey(at, timeZone),
    fraction: zonedDayFraction(at, timeZone),
    clock: formatZonedClock(at, timeZone),
    cards: runCards,
    okCount: runCards.filter((card) => card.status === "ok").length,
  };
}

/**
 * 有数据的日期，从新到旧。取自全部轮次的开始时刻：页面只载入所选那天的卡片，
 * 日历需要标出保留期内每一天。
 */
export function listDays(runStarts: readonly string[], timeZone: string): DayOption[] {
  const counts = new Map<string, number>();
  for (const startedAt of runStarts) {
    const dayKey = zonedDayKey(new Date(startedAt), timeZone);
    counts.set(dayKey, (counts.get(dayKey) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([dayKey, momentCount]) => ({ dayKey, momentCount }))
    .sort((a, b) => b.dayKey.localeCompare(a.dayKey));
}

/** 只保留满足条件的卡片，并重算成功数 */
export function filterMoment(moment: Moment, keep: (card: DashboardCard) => boolean): Moment {
  const cards = moment.cards.filter(keep);
  return { ...moment, cards, okCount: cards.filter((card) => card.status === "ok").length };
}

/** 成功比例决定时间线标记的语义色 */
export function momentHealth(moment: Moment): "ok" | "partial" | "failed" {
  if (moment.okCount === moment.cards.length) return "ok";
  return moment.okCount === 0 ? "failed" : "partial";
}

/** 思考强度档位从低到高 */
export const EFFORT_ORDER = ["low", "medium", "high", "xhigh", "max", "ultra"];

/** 数据里出现过的强度档位，按档位高低排；未知档位排在已知档位之后 */
export function listEfforts(cards: readonly { effort: string }[]): string[] {
  const rank = (effort: string): number => {
    const index = EFFORT_ORDER.indexOf(effort);
    return index === -1 ? EFFORT_ORDER.length : index;
  };
  return [...new Set(cards.map((card) => card.effort))].sort(
    (a, b) => rank(a) - rank(b) || a.localeCompare(b),
  );
}

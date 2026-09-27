import type { PromptStandard } from "@/core/prompt";
import type { DashboardCard } from "@/core/types";
import type { OpenCell } from "../timeline/RunGrid";
import { type Moment } from "../timeline/moments";
import { rowKeyOf, type Row } from "../timeline/rows";

/** 尚无任何轮次时时间线里的引导 */
export const FIRST_RUN_HINT = "还没有运行记录。所有者登录后点右上角“▶ 跑一次”开始。";

/** 现在线的刷新间隔 */
export const NOW_INTERVAL_MS = 60_000;

export interface OpenCellDetail {
  moment: Moment;
  row: Row;
  bindings?: Record<string, string>;
}

/** 从当前可见的数据里找回打开的格子；找不到时返回 null */
export function resolveOpenCell(
  open: OpenCell | null,
  moments: readonly Moment[],
): OpenCellDetail | null {
  if (open === null) return null;
  const moment = moments.find((item) => item.runId === open.runId);
  const card = moment?.cards.find((item) => rowKeyOf(item) === open.rowKey);
  if (moment === undefined || card === undefined) return null;
  return {
    moment,
    row: { key: open.rowKey, cli: card.cli, model: card.model, promptId: card.promptId },
    bindings: card.bindings,
  };
}

/** 汇总所选日期的轮次数、作品数与成功率（四舍五入百分比） */
export function summarize(cards: readonly DashboardCard[]): { runs: number; works: number; rate: number } {
  const runs = new Set(cards.map((card) => card.runId)).size;
  const ok = cards.filter((card) => card.status === "ok").length;
  return { runs, works: cards.length, rate: cards.length === 0 ? 0 : Math.round((ok / cards.length) * 100) };
}

/** 解析所选格子的客观黄金标准；优先匹配 candidate 级特异性标准 */
export function resolvePromptStandard(
  promptStandards: Readonly<Record<string, PromptStandard>>,
  promptId: string,
  bindings?: Record<string, string>,
): PromptStandard | null {
  const candidate = bindings?.["回目"] || bindings?.["candidate"];
  if (candidate) {
    return (
      promptStandards[`${promptId}::${candidate}`] ??
      promptStandards[candidate] ??
      promptStandards[promptId] ??
      null
    );
  }
  return promptStandards[promptId] ?? null;
}

/** 决定当前生效的看板日期键 */
export function resolveDashboardDayKey(options: {
  pickedDay: string | null;
  defaultShowcaseDay: string | null;
  todayKey: string | null;
}): string | null {
  const { pickedDay, defaultShowcaseDay, todayKey } = options;
  return pickedDay ?? defaultShowcaseDay ?? todayKey;
}

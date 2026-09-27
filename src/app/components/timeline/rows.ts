/** 矩阵的分行规则，看板网格与导出图共用 */

import type { DashboardCard } from "@/core/types";

/**
 * 一行是一个模型在一条提示词下的结果；强度不参与分行，各档收在同一格
 * （见 effort-slots.ts）。
 */
export interface Row {
  key: string;
  cli: string;
  model: string;
  promptId: string;
}

export function rowKeyOf(card: Pick<DashboardCard, "cli" | "model" | "promptId">): string {
  return `${card.cli}/${card.model}/${card.promptId}`;
}

/** 出现过的 CLI · 模型 × 提示词，按 CLI、模型、提示词排序 */
export function listRows(cards: readonly DashboardCard[]): Row[] {
  const rows = new Map<string, Row>();
  for (const card of cards) {
    const key = rowKeyOf(card);
    if (!rows.has(key)) rows.set(key, { key, cli: card.cli, model: card.model, promptId: card.promptId });
  }
  return [...rows.values()].sort(
    (a, b) => a.cli.localeCompare(b.cli) || a.model.localeCompare(b.model) || a.promptId.localeCompare(b.promptId),
  );
}

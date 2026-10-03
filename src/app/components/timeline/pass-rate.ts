/**
 * 行标签里的鹈鹕通过率：只有带评分标准的题目（动态鹈鹕车）才统计，按行数「智商在线」的件数
 * 与测试总数，再按思考强度分列。分母是页面上当前能看到的卡片（选定日期、时区与筛选之后），
 * 失败、无 SVG、待复核与评审中的都算在分母里，读者对着格子逐一核算得上。
 */

import { rubricFor } from "@/core/judge/schema";
import type { DashboardCard } from "@/core/types";
import { listEfforts } from "./moments";

export interface PassCount {
  /** 评审结论为「智商在线」的件数 */
  online: number;
  /** 可见的测试件数 */
  total: number;
}

export interface RowPassRate {
  total: PassCount;
  /** 按思考强度从低到高，只列这一行出现过的档位 */
  byEffort: Array<PassCount & { effort: string }>;
}

/** 这一行（一个题目下的一个模型）的通过率；题目没有评分标准时返回 null，不显示 */
export function rowPassRate(promptId: string, cards: readonly DashboardCard[]): RowPassRate | null {
  if (rubricFor(promptId) === null) return null;
  const byEffort = listEfforts(cards).map((effort) => ({
    effort,
    ...countPass(cards.filter((card) => card.effort === effort)),
  }));
  return { total: countPass(cards), byEffort };
}

function countPass(cards: readonly DashboardCard[]): PassCount {
  const online = cards.filter((card) => card.judge?.total.verdict === "online").length;
  return { online, total: cards.length };
}

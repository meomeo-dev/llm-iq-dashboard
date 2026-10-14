"use client";

import type { DashboardCard } from "@/core/types";
import { useI18n } from "@/i18n";
import { judgeText } from "../card/card-format";
import { rowPassRate } from "./pass-rate";

interface RowPassRateProps {
  promptId: string;
  /** 这一行当前可见的全部卡片 */
  cards: readonly DashboardCard[];
}

/**
 * 行标签下的鹈鹕通过率：「合计 在线/总数」，其下按思考强度分列成树状；
 * 分列区最多露出四行，更多的在区域内滚动（见 timeline-board.css）。题目没有评分标准时不渲染。
 */
export function RowPassRate({ promptId, cards }: RowPassRateProps) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const rate = rowPassRate(promptId, cards);
  if (rate === null) return null;
  const last = rate.byEffort.length - 1;
  const onlineLabel = judgeText("online", locale);
  return (
    <div
      className="row-pass"
      title={
        isEn
          ? `${onlineLabel} count / visible attempts (filtered by date, timezone, and filters)`
          : `${onlineLabel}的件数 / 当前可见的测试数（随日期、时区与筛选变化）`
      }
      aria-label={`${onlineLabel} ${rate.total.online}/${rate.total.total}`}
    >
      <span className="row-pass-total">
        {isEn ? `Total ${rate.total.online}/${rate.total.total}` : `合计 ${rate.total.online}/${rate.total.total}`}
      </span>
      <ul className="row-pass-efforts">
        {rate.byEffort.map((item, index) => (
          <li key={item.effort}>
            <span className="row-pass-branch" aria-hidden="true">
              {index === last ? "└" : "├"}
            </span>
            {item.effort} {item.online}/{item.total}
          </li>
        ))}
      </ul>
    </div>
  );
}

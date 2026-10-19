import React from "react";
import type { Judgement } from "@/core/judge/schema";
import type { DashboardCard } from "@/core/types";
import type { Locale } from "@/i18n";
import { judgeText, judgeTitle, pendingJudgeText } from "../card/card-format";
import type { PendingJudgeState } from "../run-status/run-phase";
import { StatusPill, type StatusPillTone } from "../ui/StatusPill";

export interface JudgeStatusBadgeProps {
  judge: Judgement;
  judgeCost?: DashboardCard["judgeCost"];
  liveState?: PendingJudgeState | null;
  locale: Locale;
  showMaxScore?: boolean;
  withTooltip?: boolean;
  className?: string;
}

function resolveJudgeTone(stateKey: string): StatusPillTone {
  switch (stateKey) {
    case "online":
      return "ok";
    case "degraded":
      return "err";
    case "judging":
      return "accent";
    case "interrupted":
      return "warn";
    default:
      return "neutral";
  }
}

/**
 * 统一作品评审状态与得分胶囊（供 PelicanCard 页脚与 JudgeDrawer 头部复用）。
 */
export function JudgeStatusBadge({
  judge,
  judgeCost = null,
  liveState = null,
  locale,
  showMaxScore = false,
  withTooltip = false,
  className,
}: JudgeStatusBadgeProps): React.ReactElement {
  if (liveState !== null) {
    const info = pendingJudgeText(liveState, locale);
    const stateKey = liveState === "interrupted" ? "interrupted" : "judging";
    return (
      <StatusPill
        tone={resolveJudgeTone(stateKey)}
        mono
        title={info.title}
        className={[className, `judge-${stateKey}`].filter(Boolean).join(" ")}
      >
        {info.label}
      </StatusPill>
    );
  }

  const stateKey = judge.total.verdict;
  const scoreLabel = showMaxScore
    ? `${judge.total.score}/${judge.total.maxScore}`
    : `${judge.total.score}`;

  return (
    <StatusPill
      tone={resolveJudgeTone(stateKey)}
      mono
      title={withTooltip ? judgeTitle(judge, judgeCost, locale) : undefined}
      className={[className, `judge-${stateKey}`].filter(Boolean).join(" ")}
    >
      {judgeText(stateKey, locale)} {scoreLabel}
    </StatusPill>
  );
}

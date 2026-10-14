"use client";

import React from "react";
import type { PromptStandard } from "@/core/prompt";
import type { DashboardCard } from "@/core/types";
import { localizePromptStandard, useI18n } from "@/i18n";
import { ReferenceSourceDisplay } from "../components/ReferenceSourceDisplay";
import { useLiveProgress } from "../components/live-state/live-store";
import { pendingJudgeState } from "../components/run-status/run-phase";
import { JudgeDrawer } from "./JudgeDrawer";

interface ArtViewerFootProps {
  card: DashboardCard;
  standard?: PromptStandard | null;
}

/** 单件作品查看页底部抽屉：原始提示词与客观标准判定规则 */
export function ArtViewerFoot({ card, standard }: ArtViewerFootProps) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const progress = useLiveProgress();
  const liveState =
    card.judge?.total.verdict === "pending"
      ? pendingJudgeState(progress, card.runId, card.judge.subject.attemptKey, Date.now())
      : null;
  const candidate = card.bindings["回目"] || card.bindings["candidate"];
  const stdId = candidate ?? card.promptId;
  const localizedStd = localizePromptStandard(stdId, standard, locale);

  return (
    <footer className="viewer-foot">
      {card.promptText !== "" && (
        <details className="viewer-drawer viewer-prompt">
          <summary>
            <span className="drawer-icon" aria-hidden="true">💬</span>
            <span className="drawer-title">{isEn ? "Prompt" : "提示词"}</span>
          </summary>
          <div className="viewer-drawer-body">
            <p>{card.promptText}</p>
            {card.harnessGuard !== undefined && (
              <p
                className="viewer-harness-guard"
                title={
                  isEn
                    ? "Harness guard was enabled for this round and appended after the prompt text"
                    : "本轮开了直出约束：这段话附在题目原文之后一并发给模型"
                }
              >
                <span className="viewer-harness-guard-label">
                  {isEn ? "Harness Guard" : "直出约束"}
                </span>
                {card.harnessGuard}
              </p>
            )}
          </div>
        </details>
      )}
      {card.judge != null && <JudgeDrawer judge={card.judge} judgeCost={card.judgeCost ?? null} liveState={liveState} />}
      {localizedStd != null && (
        <details className="viewer-drawer viewer-standard">
          <summary>
            <span className="drawer-icon" aria-hidden="true">📐</span>
            <span className="drawer-title">
              {isEn ? "Objective Reference Standard & Criteria" : "客观参考标准与判定依据"}
            </span>
            <span className="drawer-core-pill">{localizedStd.coreKey}</span>
          </summary>
          <div className="viewer-drawer-body standard-body">
            <div className="standard-grid">
              <div className="standard-col">
                <div className="standard-heading">
                  <span className="standard-tag gt">Ground Truth</span>
                  <h4>{isEn ? "Objective Ground Truth" : "客观黄金标准"}</h4>
                </div>
                <p className="standard-desc">{localizedStd.groundTruth}</p>
              </div>
              <div className="standard-col">
                <div className="standard-heading">
                  <span className="standard-tag eval">Evaluation</span>
                  <h4>{isEn ? "Evaluation Criteria" : "判断与鉴别标准"}</h4>
                </div>
                <p className="standard-desc">{localizedStd.evaluationCriteria}</p>
              </div>
            </div>
            {localizedStd.referenceSource && (
              <div className="standard-source-row">
                <span className="source-label">{isEn ? "Reference: " : "出处参考："}</span>
                <ReferenceSourceDisplay source={localizedStd.referenceSource} className="source-link" />
              </div>
            )}
          </div>
        </details>
      )}
    </footer>
  );
}

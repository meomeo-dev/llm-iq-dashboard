"use client";

import React from "react";
import type { PromptStandard } from "@/core/prompt";
import type { DashboardCard } from "@/core/types";
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
  // 待复核作品在本轮评审队列里时，抽屉胶囊跟卡片一样显示排队 / 评审中 / 中断
  const progress = useLiveProgress();
  const liveState = card.judge?.total.verdict === "pending"
    ? pendingJudgeState(progress, card.runId, card.judge.subject.attemptKey, Date.now())
    : null;
  return (
    <footer className="viewer-foot">
      {card.promptText !== "" && (
        <details className="viewer-drawer viewer-prompt">
          <summary>
            <span className="drawer-icon" aria-hidden="true">💬</span>
            <span className="drawer-title">提示词</span>
          </summary>
          <div className="viewer-drawer-body">
            <p>{card.promptText}</p>
          </div>
        </details>
      )}
      {card.judge != null && <JudgeDrawer judge={card.judge} judgeCost={card.judgeCost ?? null} liveState={liveState} />}
      {standard != null && (
        <details className="viewer-drawer viewer-standard">
          <summary>
            <span className="drawer-icon" aria-hidden="true">📐</span>
            <span className="drawer-title">客观参考标准与判定依据</span>
            <span className="drawer-core-pill">{standard.coreKey}</span>
          </summary>
          <div className="viewer-drawer-body standard-body">
            <div className="standard-grid">
              <div className="standard-col">
                <div className="standard-heading">
                  <span className="standard-tag gt">Ground Truth</span>
                  <h4>客观黄金标准</h4>
                </div>
                <p className="standard-desc">{standard.groundTruth}</p>
              </div>
              <div className="standard-col">
                <div className="standard-heading">
                  <span className="standard-tag eval">Evaluation</span>
                  <h4>判断与鉴别标准</h4>
                </div>
                <p className="standard-desc">{standard.evaluationCriteria}</p>
              </div>
            </div>
            {standard.referenceSource && (
              <div className="standard-source-row">
                <span className="source-label">出处参考：</span>
                <ReferenceSourceDisplay source={standard.referenceSource} className="source-link" />
              </div>
            )}
          </div>
        </details>
      )}
    </footer>
  );
}

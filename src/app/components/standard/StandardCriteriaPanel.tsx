"use client";

import React from "react";
import type { PromptStandard } from "@/core/prompt";
import { useI18n } from "@/i18n";
import { ReferenceSourceDisplay } from "../ReferenceSourceDisplay";
import { StatusPill } from "../ui/StatusPill";

export interface StandardCriteriaPanelProps {
  standard: PromptStandard;
  className?: string;
}

/**
 * 共享客观黄金标准与判定依据双栏面板（供 ModelStandardPanel 与 ArtViewerFoot 复用）。
 */
export function StandardCriteriaPanel({
  standard,
  className,
}: StandardCriteriaPanelProps): React.ReactElement {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <div className={["standard-criteria-panel", className].filter(Boolean).join(" ")}>
      <div className="standard-grid">
        <div className="standard-col">
          <div className="standard-heading">
            <StatusPill tone="ok" className="standard-tag gt">
              Ground Truth
            </StatusPill>
            <h4>{isEn ? "Objective Ground Truth" : "客观黄金标准"}</h4>
          </div>
          <p className="standard-desc">{standard.groundTruth}</p>
        </div>
        <div className="standard-col">
          <div className="standard-heading">
            <StatusPill tone="accent" className="standard-tag eval">
              Evaluation
            </StatusPill>
            <h4>{isEn ? "Evaluation Criteria" : "判断与鉴别标准"}</h4>
          </div>
          <p className="standard-desc">{standard.evaluationCriteria}</p>
        </div>
      </div>
      {standard.referenceSource ? (
        <div className="standard-source-row">
          <span className="source-label">{isEn ? "Reference: " : "出处参考："}</span>
          <ReferenceSourceDisplay source={standard.referenceSource} className="source-link" />
        </div>
      ) : null}
    </div>
  );
}

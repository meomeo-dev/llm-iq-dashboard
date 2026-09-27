"use client";

import type { PromptStandard } from "@/core/prompt";
import { ReferenceSourceDisplay } from "../ReferenceSourceDisplay";

interface ModelStandardPanelProps {
  standard: PromptStandard;
}

export function ModelStandardPanel({ standard }: ModelStandardPanelProps) {
  return (
    <section className="modal-standard-panel" aria-label="客观参考标准与判定依据">
      <div className="modal-standard-grid">
        <div className="modal-standard-col">
          <div className="standard-heading">
            <span className="standard-tag gt">Ground Truth</span>
            <h4>客观黄金标准</h4>
          </div>
          <p className="standard-desc">{standard.groundTruth}</p>
        </div>
        <div className="modal-standard-col">
          <div className="standard-heading">
            <span className="standard-tag eval">Evaluation</span>
            <h4>判断与鉴别标准</h4>
          </div>
          <p className="standard-desc">{standard.evaluationCriteria}</p>
        </div>
      </div>
      {standard.referenceSource && (
        <div className="modal-standard-source">
          <span className="source-label">出处参考：</span>
          <ReferenceSourceDisplay source={standard.referenceSource} className="source-link" />
        </div>
      )}
    </section>
  );
}

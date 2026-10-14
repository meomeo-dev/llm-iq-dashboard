import React from "react";
import { useI18n } from "@/i18n";
import type { DataRepoCountsSummary, HealthInfo } from "./data-repo-panel-model";

interface DataRepoCardsProps {
  health: HealthInfo;
  counts: DataRepoCountsSummary;
}

/** 数据仓健康状态标牌与统计指标卡片组 */
export function DataRepoCards({ health, counts }: DataRepoCardsProps) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <div className="data-repo-overview">
      <div className={`data-repo-health-bar ${health.level}`}>
        <span className={`data-repo-health-badge ${health.level}`}>
          {health.label}
        </span>
        <span className="data-repo-health-desc">{health.reason}</span>
      </div>

      <div className="data-repo-cards">
        <div className="data-repo-card">
          <span className="data-repo-card-title">{isEn ? "Local Runs" : "本地轮次"}</span>
          <span className="data-repo-card-value">{counts.localText}</span>
        </div>
        <div className="data-repo-card">
          <span className="data-repo-card-title">{isEn ? "Sync Ledger" : "同步台账"}</span>
          <span className="data-repo-card-value">{counts.ledgerText}</span>
          {counts.unpublishableText && (
            <span className="data-repo-card-value">{counts.unpublishableText}</span>
          )}
          {counts.rejectedText && (
            <span className="data-repo-card-value">{counts.rejectedText}</span>
          )}
        </div>
        <div className="data-repo-card">
          <span className="data-repo-card-title">{isEn ? "Public Manifest" : "公开清单"}</span>
          <span className="data-repo-card-value">{counts.manifestText}</span>
        </div>
        <div className="data-repo-card">
          <span className="data-repo-card-title">{isEn ? "Git Repository" : "Git 仓库"}</span>
          <span className="data-repo-card-value">{counts.repoText}</span>
        </div>
      </div>
    </div>
  );
}

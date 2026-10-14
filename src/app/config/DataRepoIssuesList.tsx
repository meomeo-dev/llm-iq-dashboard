import React from "react";
import { useI18n } from "@/i18n";
import {
  localizeRejectedReasonEn,
  localizeSkippedReasonEn,
} from "./data-repo-panel-i18n";
import type { RejectedIssue, SkippedIssue } from "./data-repo-panel-model";

interface DataRepoIssuesListProps {
  rejected: RejectedIssue[];
  skipped: SkippedIssue[];
}

/** 展示脱敏泄漏拦截或幂等跳过的轮次清单 */
export function DataRepoIssuesList({
  rejected,
  skipped,
}: DataRepoIssuesListProps) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  if (rejected.length === 0 && skipped.length === 0) return null;

  return (
    <div className="data-repo-issues">
      <h3 className="data-repo-issues-title">
        {isEn ? "Sync Inspection Log" : "同步排查记录"}
      </h3>

      {rejected.length > 0 && (
        <div className="data-repo-issue-group rejected">
          <span className="data-repo-issue-heading">
            {isEn
              ? "Runs blocked by security scan (not exported):"
              : "已被安全扫描拦截的轮次（不予导出）："}
          </span>
          <ul className="data-repo-issue-items">
            {rejected.map((item, idx) => (
              <li key={`${item.runId}-${item.file}-${idx}`}>
                <code>{item.runId}</code> ({item.file}):{" "}
                {isEn ? localizeRejectedReasonEn(item.reason) : item.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {skipped.length > 0 && (
        <div className="data-repo-issue-group skipped">
          <span className="data-repo-issue-heading">
            {isEn ? "Skipped runs:" : "跳过的轮次："}
          </span>
          <ul className="data-repo-issue-items">
            {skipped.map((item) => (
              <li key={item.runId}>
                <code>{item.runId}</code>:{" "}
                {isEn ? localizeSkippedReasonEn(item.reason) : item.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

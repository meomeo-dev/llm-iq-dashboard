import React from "react";
import { useI18n } from "@/i18n/context";

interface DataRepoPushDialogProps {
  isOpen: boolean;
  aheadCommits: string[];
  pendingPublishCount: number;
  canConfirm: boolean;
  disabledReason: string | null;
  isBusy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** 推送二次确认对话框：列出即将公开的领先提交与待发布轮次数 */
export function DataRepoPushDialog({
  isOpen,
  aheadCommits,
  pendingPublishCount,
  canConfirm,
  disabledReason,
  isBusy,
  onConfirm,
  onCancel,
}: DataRepoPushDialogProps) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  if (!isOpen) return null;

  const confirmText = isBusy ? (isEn ? "Pushing…" : "正在推送…") : isEn ? "Confirm Push" : "确认推送";

  return (
    <div className="data-repo-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="data-repo-push-title">
      <div className="data-repo-dialog">
        <header className="data-repo-dialog-header">
          <h3 id="data-repo-push-title">
            {isEn ? "Confirm Push to Remote Data Repository" : "确认推送到远程数据仓"}
          </h3>
          <p className="data-repo-dialog-desc">
            {isEn
              ? "Pushing will publish local commits to the public repository, releasing artworks and data for the runs below. This action cannot be undone; please review carefully."
              : "推送将向公开仓库发布本地提交，公开以下轮次的作品与数据。操作不可撤销，请仔细核对。"}
          </p>
        </header>

        <div className="data-repo-dialog-meta">
          <div className="data-repo-dialog-stat">
            <span className="label">{isEn ? "Runs to Publish" : "待公开轮次数"}</span>
            <span className="value">{isEn ? `${pendingPublishCount} run(s)` : `${pendingPublishCount} 轮`}</span>
          </div>
          <div className="data-repo-dialog-stat">
            <span className="label">{isEn ? "Commits Ahead" : "领先提交数"}</span>
            <span className="value">{isEn ? `${aheadCommits.length} commit(s)` : `${aheadCommits.length} 个`}</span>
          </div>
        </div>

        <div className="data-repo-commits-container">
          <span className="data-repo-commits-title">
            {isEn ? "Local commits to be pushed:" : "将要推送的本地提交："}
          </span>
          <ul className="data-repo-commit-list">
            {aheadCommits.map((hash) => (
              <li key={hash} className="data-repo-commit-item"><code>{hash}</code></li>
            ))}
          </ul>
        </div>

        {disabledReason && <p className="status error data-repo-dialog-disabled-reason">{disabledReason}</p>}

        <footer className="data-repo-dialog-actions">
          <button type="button" className="data-repo-btn-cancel" onClick={onCancel} disabled={isBusy}>
            {isEn ? "Cancel" : "取消"}
          </button>
          <button type="button" className="data-repo-btn-confirm" onClick={onConfirm} disabled={!canConfirm || isBusy}>
            {confirmText}
          </button>
        </footer>
      </div>
    </div>
  );
}

import React from "react";

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
  if (!isOpen) return null;

  return (
    <div
      className="data-repo-dialog-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="data-repo-push-title"
    >
      <div className="data-repo-dialog">
        <header className="data-repo-dialog-header">
          <h3 id="data-repo-push-title">确认推送到远程数据仓</h3>
          <p className="data-repo-dialog-desc">
            推送将向公开仓库发布本地提交，公开以下轮次的作品与数据。操作不可撤销，请仔细核对。
          </p>
        </header>

        <div className="data-repo-dialog-meta">
          <div className="data-repo-dialog-stat">
            <span className="label">待公开轮次数</span>
            <span className="value">{pendingPublishCount} 轮</span>
          </div>
          <div className="data-repo-dialog-stat">
            <span className="label">领先提交数</span>
            <span className="value">{aheadCommits.length} 个</span>
          </div>
        </div>

        <div className="data-repo-commits-container">
          <span className="data-repo-commits-title">将要推送的本地提交：</span>
          <ul className="data-repo-commit-list">
            {aheadCommits.map((hash) => (
              <li key={hash} className="data-repo-commit-item">
                <code>{hash}</code>
              </li>
            ))}
          </ul>
        </div>

        {disabledReason && (
          <p className="status error data-repo-dialog-disabled-reason">
            {disabledReason}
          </p>
        )}

        <footer className="data-repo-dialog-actions">
          <button
            type="button"
            className="data-repo-btn-cancel"
            onClick={onCancel}
            disabled={isBusy}
          >
            取消
          </button>
          <button
            type="button"
            className="data-repo-btn-confirm"
            onClick={onConfirm}
            disabled={!canConfirm || isBusy}
          >
            {isBusy ? "正在推送…" : "确认推送"}
          </button>
        </footer>
      </div>
    </div>
  );
}

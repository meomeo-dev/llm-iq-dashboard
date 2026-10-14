import React from "react";
import { useI18n } from "@/i18n";
import { formatRunIdTime } from "./DataRepoPendingRun";

interface DataRepoDiscardedListProps {
  runIds: readonly string[];
  disabled: boolean;
  onRestore: (runIds: string[]) => void;
}

/** 已丢弃的轮次：不再导出，过了保留期随修剪删除；恢复后回到待导出清单 */
export function DataRepoDiscardedList({ runIds, disabled, onRestore }: DataRepoDiscardedListProps) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  if (runIds.length === 0) return null;
  return (
    <details className="data-repo-discarded">
      <summary>
        {isEn
          ? `${runIds.length} discarded run(s) (will not be exported; auto-deleted after retention)`
          : `已丢弃 ${runIds.length} 轮（不会导出，过了保留期自动删除）`}
      </summary>
      <ul>
        {runIds.map((runId) => (
          <li key={runId}>
            <span className="data-repo-pending-time">{formatRunIdTime(runId)}</span>
            <code className="data-repo-pending-id">{runId}</code>
            <button type="button" className="data-repo-link-button" disabled={disabled} onClick={() => onRestore([runId])}>
              {isEn ? "Restore" : "恢复"}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}

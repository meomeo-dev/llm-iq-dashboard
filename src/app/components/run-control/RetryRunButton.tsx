"use client";

import { useState } from "react";
import { useI18n, type Locale } from "@/i18n";
import { actionFetch } from "../action-fetch";
import { useLiveProgress } from "../live-state/live-store";

export interface RetryRunButtonProps {
  runId: string;
  count: number;
  targetIds?: readonly string[];
  promptIds?: readonly string[];
  includeNoSvg?: boolean;
}

/**
 * 原地重跑指定轮次（或当前四宫格）内的失败项与未完成项。
 * 复用原轮次 runId 锁定的 prompts 与 harnessGuard，不新建额外时间线列。
 */
export function RetryRunButton({
  runId,
  count,
  targetIds,
  promptIds,
  includeNoSvg = true,
}: RetryRunButtonProps) {
  const { locale } = useI18n();
  const progress = useLiveProgress();
  const isEn = locale === "en";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (count <= 0) return null;

  const anyActive = (progress ?? []).some((run) => run.alive);

  const onRetry = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    const failure = await postRetryRun(
      {
        retryRunId: runId,
        targetIds: targetIds ? [...targetIds] : [],
        promptIds: promptIds ? [...promptIds] : [],
        includeNoSvg,
      },
      locale,
    );
    setBusy(false);
    setError(failure);
  };

  const label = busy
    ? isEn ? "Retrying…" : "重试中…"
    : isEn ? `↻ Retry Failed (${count})` : `↻ 重试失败项（${count}）`;

  return (
    <span className="run-retry-group">
      {error !== null && <span className="run-retry-error">{error}</span>}
      <button
        type="button"
        className="run-retry"
        disabled={busy || anyActive}
        title={
          isEn
            ? "Retry failed or incomplete calls in-place within this run (reuses locked prompts & candidates)"
            : "在本轮内原地重跑失败或未完成的调用（复用原轮锁定的提示词与候选项）"
        }
        onClick={() => void onRetry()}
      >
        {label}
      </button>
    </span>
  );
}

async function postRetryRun(
  payload: {
    retryRunId: string;
    targetIds: string[];
    promptIds: string[];
    includeNoSvg: boolean;
  },
  locale: Locale,
): Promise<string | null> {
  try {
    const response = await actionFetch("/api/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) return null;
    const body = (await response.json()) as { error?: string };
    return body.error ?? (locale === "en" ? "Retry failed" : "重试失败");
  } catch (cause) {
    return cause instanceof Error ? cause.message : String(cause);
  }
}

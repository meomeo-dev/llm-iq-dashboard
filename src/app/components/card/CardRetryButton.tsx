"use client";

import { useState } from "react";
import type { DashboardCard } from "@/core/types";
import type { Locale } from "@/i18n";
import { actionFetch } from "../action-fetch";
import { useLiveProgress } from "../live-state/live-store";
import { useProfiles } from "../profile/profiles-context";

/**
 * 单张失败卡片（error / timeout / no-svg）的原地重试按钮：
 * 仅对已配对所有者显示，复用原轮次 runId 锁定的提示词与候选项发起单次重跑。
 */
export function CardRetryButton({
  card,
  isLive,
  locale,
}: {
  card: DashboardCard;
  isLive: boolean;
  locale: Locale;
}) {
  const { owner } = useProfiles();
  const progress = useLiveProgress();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!owner || isLive || card.status === "ok") {
    return null;
  }

  const anyActive = (progress ?? []).some((run) => run.alive);
  const isEn = locale === "en";

  const onRetry = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    const err = await postCardRetry(card, locale);
    setBusy(false);
    if (err !== null) setError(err);
  };

  const label = busy
    ? isEn ? "Retrying…" : "重试中…"
    : error !== null
      ? isEn ? "↻ Retry!" : "↻ 重试!"
      : isEn ? "↻ Retry" : "↻ 重试";

  const title = error
    ?? (anyActive
      ? isEn ? "Another run is active; wait for it to finish before retrying" : "当前已有轮次在执行，请等待结束后重试"
      : isEn
        ? "Retry this attempt in-place within the same run (reuses locked prompt & candidate)"
        : "在同一轮次内原地重跑该调用（复用原轮锁定的提示词与候选项）");

  return (
    <button
      type="button"
      className={`card-retry-btn${error !== null ? " is-error" : ""}`}
      disabled={busy || anyActive}
      title={title}
      onClick={() => void onRetry()}
    >
      {label}
    </button>
  );
}

async function postCardRetry(card: DashboardCard, locale: Locale): Promise<string | null> {
  try {
    const response = await actionFetch("/api/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        retryRunId: card.runId,
        targetIds: [card.targetId],
        promptIds: [card.promptId],
        includeNoSvg: true,
      }),
    });
    if (response.ok) return null;
    const body = (await response.json()) as { error?: string };
    return body.error ?? (locale === "en" ? "Retry failed" : "重试失败");
  } catch (cause) {
    return cause instanceof Error ? cause.message : String(cause);
  }
}

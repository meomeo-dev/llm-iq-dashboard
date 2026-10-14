"use client";

import { useState } from "react";
import { useI18n, type Locale } from "@/i18n";
import { actionFetch } from "../action-fetch";

/**
 * 停止一轮执行，需点两次确认以防误触。只发出 `POST /api/run/cancel`；停止状态由
 * 进度推送带回，经 stopping 传入。已完成的结果保留。
 */
export function StopRunButton({ runId, stopping }: { runId: string; stopping: boolean }) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (stopping) {
    return (
      <button type="button" className="run-stop" disabled>
        {isEn ? "Stopping…" : "正在停止…"}
      </button>
    );
  }

  const stop = async (): Promise<void> => {
    setBusy(true);
    const failure = await postCancel(runId, locale);
    setBusy(false);
    setConfirming(false);
    setError(failure);
  };

  return (
    <span className="run-stop-group">
      {error !== null && <span className="run-stop-error">{error}</span>}
      {confirming ? (
        <>
          <button type="button" className="run-stop confirm" disabled={busy} onClick={() => void stop()}>
            {busy ? (isEn ? "Requesting…" : "请求中…") : isEn ? "Confirm Stop" : "确认停止"}
          </button>
          <button type="button" className="run-stop-cancel" disabled={busy} onClick={() => setConfirming(false)}>
            {isEn ? "Keep Running" : "不停了"}
          </button>
        </>
      ) : (
        <button
          type="button"
          className="run-stop"
          title={
            isEn
              ? "Cancel queued calls and terminate active calls; completed results are preserved"
              : "不再发起排队中的调用，终止执行中的调用；已完成的结果保留"
          }
          onClick={() => setConfirming(true)}
        >
          {isEn ? "Stop Run" : "停止本轮"}
        </button>
      )}
    </span>
  );
}

/** 成功返回 null，失败返回说明 */
async function postCancel(runId: string, locale: Locale): Promise<string | null> {
  try {
    const response = await actionFetch("/api/run/cancel", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ runId }),
    });
    if (response.ok) return null;
    const body = (await response.json()) as { error?: string };
    return body.error ?? (locale === "en" ? "Stop failed" : "停止失败");
  } catch (cause) {
    return cause instanceof Error ? cause.message : String(cause);
  }
}

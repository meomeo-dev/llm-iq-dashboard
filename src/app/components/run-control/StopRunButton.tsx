"use client";

import { useState } from "react";
import { actionFetch } from "../action-fetch";

/**
 * 停止一轮执行，需点两次确认以防误触。只发出 `POST /api/run/cancel`；停止状态由
 * 进度推送带回，经 stopping 传入。已完成的结果保留。
 */
export function StopRunButton({ runId, stopping }: { runId: string; stopping: boolean }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (stopping) {
    return (
      <button type="button" className="run-stop" disabled>
        正在停止…
      </button>
    );
  }

  const stop = async (): Promise<void> => {
    setBusy(true);
    const failure = await postCancel(runId);
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
            {busy ? "请求中…" : "确认停止"}
          </button>
          <button type="button" className="run-stop-cancel" disabled={busy} onClick={() => setConfirming(false)}>
            不停了
          </button>
        </>
      ) : (
        <button
          type="button"
          className="run-stop"
          title="不再发起排队中的调用，终止执行中的调用；已完成的结果保留"
          onClick={() => setConfirming(true)}
        >
          停止本轮
        </button>
      )}
    </span>
  );
}

/** 成功返回 null，失败返回说明 */
async function postCancel(runId: string): Promise<string | null> {
  try {
    const response = await actionFetch("/api/run/cancel", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ runId }),
    });
    if (response.ok) return null;
    const body = (await response.json()) as { error?: string };
    return body.error ?? "停止失败";
  } catch (cause) {
    return cause instanceof Error ? cause.message : String(cause);
  }
}

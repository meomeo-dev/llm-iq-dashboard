"use client";

import { useCallback, useEffect, useState } from "react";
import { actionFetch } from "../action-fetch";
import type { ReadinessView } from "@/app/api/readiness/route";
import type { ReadinessRecord } from "@/capabilities/readiness-cache";
import { useDismissedClis } from "./use-dismissed-clis";
import "./cli-status.css";

/**
 * 页首的 CLI 状态提示：配置用到的 CLI 未安装或未登录时出现并给出登录命令，否则不渲染。
 * 状态读缓存，从未检查过的 CLI 自动检查一次。不改配置：未登录 CLI 的目标仅暂不在
 * “跑一次”中列出，登录后恢复。“不再提示”按浏览器记住。
 */
export function CliStatusBanner() {
  const [view, setView] = useState<ReadinessView | null>(null);
  const [checking, setChecking] = useState(false);
  const [dismissed, dismiss] = useDismissedClis();

  const recheck = useCallback(async (): Promise<void> => {
    setChecking(true);
    const next = await requestView("POST");
    setChecking(false);
    if (next !== null) setView(next);
  }, []);

  useEffect(() => {
    void requestView("GET").then((cached) => {
      if (cached === null) return;
      setView(cached);
      if (cached.used.some((cli) => cached.clis[cli] === undefined)) void recheck();
    });
  }, [recheck]);

  const problems = view === null ? [] : blockingRecords(view).filter((record) => !dismissed.has(record.cli));
  if (view === null || problems.length === 0) return null;
  const signedOut = problems.filter((record) => record.state === "signed-out").map((record) => record.cli);
  const missing = problems.filter((record) => record.state === "missing");
  return (
    <aside className="cli-banner" role="status">
      {signedOut.length > 0 && (
        <p>
          <b>{signedOut.join("、")}</b> 未登录，其模型暂不可选。登录：
          <CopyableCommand command={`${view.onboardCommand} ${signedOut.join(" ")}`} />
          <DismissButton onClick={() => dismiss(signedOut)} />
        </p>
      )}
      {/* 未安装时原因里已带安装或重建命令，原样给出 */}
      {missing.map((record) => (
        <p key={record.cli}>
          {record.detail}
          <DismissButton onClick={() => dismiss([record.cli])} />
        </p>
      ))}
      <button type="button" onClick={() => void recheck()} disabled={checking}>
        {checking ? "检查中…" : "重新检查"}
      </button>
    </aside>
  );
}

function DismissButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="cli-banner-dismiss" onClick={onClick}>
      不再提示
    </button>
  );
}

/** 附复制按钮的命令，便于粘贴到终端执行 */
function CopyableCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async (): Promise<void> => {
    await navigator.clipboard.writeText(command).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <>
      <code>{command}</code>
      <button type="button" className="cli-banner-copy" onClick={() => void copy()}>
        {copied ? "已复制" : "复制"}
      </button>
    </>
  );
}

function blockingRecords(view: ReadinessView): ReadinessRecord[] {
  return view.used
    .map((cli) => view.clis[cli])
    .filter((record): record is ReadinessRecord => record !== undefined)
    .filter((record) => record.state === "missing" || record.state === "signed-out");
}

async function requestView(method: "GET" | "POST"): Promise<ReadinessView | null> {
  try {
    const response = await actionFetch("/api/readiness", { method });
    return response.ok ? ((await response.json()) as ReadinessView) : null;
  } catch {
    return null;
  }
}

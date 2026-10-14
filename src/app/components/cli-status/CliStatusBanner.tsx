"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReadinessView } from "@/app/api/readiness/route";
import type { ReadinessRecord } from "@/capabilities/readiness-cache";
import { useI18n, type Locale } from "@/i18n";
import { actionFetch } from "../action-fetch";
import { useDismissedClis } from "./use-dismissed-clis";
import "./cli-status.css";

/**
 * 页首的 CLI 状态提示：配置用到的 CLI 未安装或未登录时出现并给出登录命令，否则不渲染。
 */
export function CliStatusBanner() {
  const { locale } = useI18n();
  const isEn = locale === "en";
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
          <b>{signedOut.join(isEn ? ", " : "、")}</b>{" "}
          {isEn
            ? "not signed in; models for these CLIs are unavailable. Sign in:"
            : "未登录，其模型暂不可选。登录："}
          <CopyableCommand command={`${view.onboardCommand} ${signedOut.join(" ")}`} locale={locale} />
          <DismissButton onClick={() => dismiss(signedOut)} locale={locale} />
        </p>
      )}
      {missing.map((record) => (
        <p key={record.cli}>
          {localizeReadinessDetail(record.detail, locale)}
          <DismissButton onClick={() => dismiss([record.cli])} locale={locale} />
        </p>
      ))}
      <button type="button" onClick={() => void recheck()} disabled={checking}>
        {checking ? (isEn ? "Checking…" : "检查中…") : isEn ? "Re-check" : "重新检查"}
      </button>
    </aside>
  );
}

export function localizeReadinessDetail(detail: string | null, locale: Locale): string {
  if (detail === null) return "";
  if (locale === "zh-CN") return detail;
  return detail
    .replace(/不在 PATH 中。安装：/g, "is not in PATH. Install: ")
    .replace(/未安装。安装：/g, "is not installed. Install: ")
    .replace(/未登录。登录：/g, "is not signed in. Sign in: ")
    .replace(/已安装且已登录/g, "is installed and signed in");
}

function DismissButton({ onClick, locale }: { onClick: () => void; locale: Locale }) {
  return (
    <button type="button" className="cli-banner-dismiss" onClick={onClick}>
      {locale === "en" ? "Dismiss" : "不再提示"}
    </button>
  );
}

function CopyableCommand({ command, locale }: { command: string; locale: Locale }) {
  const [copied, setCopied] = useState(false);
  const isEn = locale === "en";
  const copy = async (): Promise<void> => {
    await navigator.clipboard.writeText(command).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <>
      <code>{command}</code>
      <button type="button" className="cli-banner-copy" onClick={() => void copy()}>
        {copied ? (isEn ? "Copied" : "已复制") : isEn ? "Copy" : "复制"}
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

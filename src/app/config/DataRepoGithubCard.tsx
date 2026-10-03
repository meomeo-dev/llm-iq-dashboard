"use client";

import React, { useEffect, useState } from "react";
import type { GithubConnection } from "@/core/sync/data-repo-panel-types";

export interface DataRepoGithubCardProps {
  github?: GithubConnection | null;
  onDisconnect?: () => Promise<void> | void;
  /** 安装按钮上显示的目标仓名；缺省为公共数据仓 */
  repositoryName?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  state_mismatch: "OAuth 校验失败（state 不匹配），请重试",
  app_convert_failed: "GitHub App 凭据转换失败，请重试",
  exchange_failed: "换取 GitHub 访问令牌失败，请重试",
  invalid_session: "授权会话无效或应用不存在，请重新连接",
  missing_code: "GitHub 未返回授权码，请重试",
};

interface BodyProps {
  state: string;
  login?: string | null;
  appSlug?: string | null;
  settingsUrl: string;
  repositoryName: string;
  busy: boolean;
  onDisconnect: () => void;
}

function DataRepoGithubBody({ state, login, appSlug, settingsUrl, repositoryName, busy, onDisconnect }: BodyProps) {
  if (state === "disconnected") {
    return (
      <>
        <p className="data-repo-github-desc">未连接 GitHub App，执行器无法向远端推送。</p>
        <a href="/api/data-repo/github/connect" className="data-repo-btn data-repo-btn-primary">
          连接 GitHub
        </a>
      </>
    );
  }
  if (state === "app-created") {
    return (
      <>
        <p className="data-repo-github-desc">GitHub App（{appSlug}）已创建，请安装到目标仓库。</p>
        <a href="/api/data-repo/github/connect" className="data-repo-btn data-repo-btn-primary">
          继续安装到 {repositoryName}
        </a>
      </>
    );
  }
  if (state === "connected") {
    return (
      <div className="data-repo-github-connected">
        <span className="data-repo-github-login">账号: <strong>{login}</strong></span>
        <div className="data-repo-github-actions">
          <button type="button" className="data-repo-btn" onClick={onDisconnect} disabled={busy}>
            {busy ? "正在断开…" : "断开 GitHub"}
          </button>
          <a href={settingsUrl} target="_blank" rel="noreferrer" className="data-repo-github-link">
            在 GitHub 上管理应用
          </a>
        </div>
      </div>
    );
  }
  return (
    <>
      <p className="data-repo-github-desc">授权凭据已失效（原账号: {login ?? "未知"}），需重新连接。</p>
      <a href="/api/data-repo/github/connect" className="data-repo-btn data-repo-btn-primary">
        重新连接
      </a>
    </>
  );
}

export function DataRepoGithubCard({ github, onDisconnect, repositoryName = "llm-iq-data" }: DataRepoGithubCardProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("github") === "error") {
      const reason = params.get("reason") ?? "unknown";
      setErrorMsg(ERROR_MESSAGES[reason] ?? `GitHub 授权失败（原因码: ${reason}）`);
    }
  }, []);

  async function handleDisconnect() {
    setBusy(true);
    try {
      if (onDisconnect) {
        await onDisconnect();
      } else {
        await fetch("/api/data-repo/github/disconnect", {
          method: "POST",
          headers: { "x-pelican-action": "1" },
        });
        window.location.reload();
      }
    } finally {
      setBusy(false);
    }
  }

  const state = github?.state ?? "disconnected";
  const login = github?.login;
  const appSlug = github?.appSlug;
  const settingsUrl = github?.appSettingsUrl ?? (appSlug ? `https://github.com/settings/apps/${appSlug}` : "#");

  return (
    <div className="data-repo-github-card">
      <div className="data-repo-github-header">
        <span className="data-repo-card-title">GitHub App 推送授权</span>
        <span className={`data-repo-github-badge ${state}`}>
          {state === "connected" && "已连接"}
          {state === "app-created" && "待安装"}
          {state === "reconnect-required" && "需重新连接"}
          {state === "disconnected" && "未连接"}
        </span>
      </div>
      {errorMsg && <div className="status error data-repo-github-error">{errorMsg}</div>}
      <div className="data-repo-github-body">
        <DataRepoGithubBody
          state={state}
          login={login}
          appSlug={appSlug}
          settingsUrl={settingsUrl}
          repositoryName={repositoryName}
          busy={busy}
          onDisconnect={() => void handleDisconnect()}
        />
      </div>
    </div>
  );
}

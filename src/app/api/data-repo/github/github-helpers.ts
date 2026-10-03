import { NextResponse } from "next/server";
import type { DataRepoConfig } from "@/core/config";
import { externalRunner } from "@/core/runner-link";
import {
  clearGithubCredentials,
  convertManifest,
  exchangeCode,
  fetchRepositoryId,
  fetchUserLogin,
  parseGitHubRemote,
  readAccessToken,
  readGithubApp,
  readGithubConnection,
  revokeGrant,
  writeAccessToken,
  writeGithubApp,
  writeGithubUser,
  type GithubConnection,
} from "@/core/github-auth";
import { requestRunnerDataRepoStatus, requestRunnerGithubAction } from "@/core/requests";
import { gitExec } from "@/core/sync/data-repo-git";

export const GITHUB_STATE_COOKIE = "pelican_github_state";
export const GITHUB_COOKIE_PATH = "/api/data-repo/github";

export function htmlEscape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * 浏览器实际访问的站点源（协议 + 主机[:端口]）。
 * 容器内 request.url 反映的是监听地址（如 0.0.0.0:3000），不能用于对外回跳地址；
 * 以 Host 头为准，反向代理场景取 X-Forwarded-* 头。
 */
export function requestOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const host = forwardedHost ?? request.headers.get("host");
  if (!host) {
    return new URL(request.url).origin;
  }
  const proto = forwardedProto ?? new URL(request.url).protocol.replace(":", "");
  return `${proto}://${host}`;
}

export function renderBouncePage(request: Request): NextResponse {
  const url = new URL(request.url);
  const target = `${url.pathname}${url.search}`;
  const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${htmlEscape(target)}"><title>正在跳转...</title></head><body><p>正在跳转...</p></body></html>`;
  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export function getStateCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [name, ...val] = part.trim().split("=");
    if (name === GITHUB_STATE_COOKIE) {
      return decodeURIComponent(val.join("=").trim());
    }
  }
  return null;
}

export async function resolveExistingApp(): Promise<{
  slug: string | null;
  clientId: string | null;
  state: string;
} | null> {
  if (externalRunner()) {
    const status = await requestRunnerDataRepoStatus();
    if (!status?.github?.appSlug) return null;
    return {
      slug: status.github.appSlug,
      clientId: status.github.clientId ?? null,
      state: status.github.state,
    };
  }
  const app = await readGithubApp();
  if (!app) return null;
  const conn = await readGithubConnection();
  return {
    slug: app.slug,
    clientId: app.client_id,
    state: conn.state,
  };
}

export async function resolveExistingAppSlug(): Promise<string | null> {
  const app = await resolveExistingApp();
  return app?.slug ?? null;
}

export async function performAppConvert(code: string): Promise<string> {
  if (externalRunner()) {
    const res = await requestRunnerGithubAction("github-app-convert", code);
    if (!res.ok || !res.connection?.appSlug) {
      throw new Error(res.error ?? "执行器清单转换失败");
    }
    return res.connection.appSlug;
  }
  const creds = await convertManifest(code);
  await writeGithubApp(creds);
  return creds.slug;
}

/** 目标仓：配置里的 repository 优先，没配才看本地副本的 origin，都没有用缺省仓 */
async function resolveRepoFullNameAndId(
  dataRepo?: Pick<DataRepoConfig, "path" | "repository"> | null,
): Promise<{ fullName: string; repoId: number | null }> {
  let fullName = "meomeo-dev/llm-iq-data";
  let repoId: number | null = null;
  if (!dataRepo) return { fullName, repoId };
  try {
    const remote = dataRepo.repository
      ?? (await gitExec(dataRepo.path, ["remote", "get-url", "origin"])).trim();
    const parsed = parseGitHubRemote(remote);
    if (parsed) {
      fullName = parsed;
      const parts = parsed.split("/");
      if (parts.length === 2 && parts[0] && parts[1]) {
        repoId = await fetchRepositoryId(parts[0], parts[1]);
      }
    }
  } catch {
    // 忽略未配置 remote
  }
  return { fullName, repoId };
}

export async function performTokenExchange(
  code: string,
  dataRepo?: Pick<DataRepoConfig, "path" | "repository"> | null,
): Promise<void> {
  if (externalRunner()) {
    const res = await requestRunnerGithubAction("github-token-exchange", code);
    if (!res.ok) {
      throw new Error(res.error ?? "执行器换取令牌失败");
    }
    return;
  }
  const app = await readGithubApp();
  if (!app) {
    throw new Error("缺少 GitHub App 凭据");
  }
  const { fullName, repoId } = await resolveRepoFullNameAndId(dataRepo);
  const tokens = await exchangeCode(app, code, repoId);
  const login = await fetchUserLogin(tokens.access_token);
  const now = Date.now();
  const expiresAt = tokens.expires_in
    ? new Date(now + tokens.expires_in * 1000).toISOString()
    : null;
  const refreshExpiresAt = tokens.refresh_token_expires_in
    ? new Date(now + tokens.refresh_token_expires_in * 1000).toISOString()
    : null;
  await writeGithubUser({
    login,
    refresh_token: tokens.refresh_token,
    expiresAt,
    refreshExpiresAt,
    repositoryFullName: fullName,
  });
  await writeAccessToken(tokens.access_token);
}

export interface DisconnectResult {
  ok: boolean;
  revoked: boolean;
  revokeError?: string;
  github: GithubConnection;
}

export async function performDisconnect(): Promise<DisconnectResult> {
  if (externalRunner()) {
    const res = await requestRunnerGithubAction("github-disconnect");
    const connection =
      res.connection ?? {
        state: "disconnected",
        login: null,
        appSlug: null,
        appSettingsUrl: null,
      };
    const revoked = res.disconnectResult?.revoked ?? res.ok;
    const revokeError = res.disconnectResult?.revokeError;
    return {
      ok: res.ok,
      revoked,
      ...(revokeError ? { revokeError } : {}),
      github: connection,
    };
  }
  let revoked = true;
  let revokeError: string | undefined;
  try {
    const app = await readGithubApp();
    const token = await readAccessToken();
    if (app && token) {
      await revokeGrant(app, token);
    }
  } catch (cause) {
    revoked = false;
    revokeError = `撤销 GitHub 授权失败: ${cause instanceof Error ? cause.message : String(cause)}`;
  } finally {
    await clearGithubCredentials().catch(() => {});
  }
  const github = await readGithubConnection();
  return {
    ok: true,
    revoked,
    ...(revokeError ? { revokeError } : {}),
    github,
  };
}

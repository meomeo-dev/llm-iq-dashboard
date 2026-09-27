/**
 * GitHub API 客户端：清单转换、令牌交换、刷新与授权撤销。
 *
 * 依据 ACR-011：
 * 1. 注入 fetch（默认全局 fetch），统一 15 秒超时；
 * 2. 识别 GitHub OAuth 200 + error 报错形态；
 * 3. 任何错误信息经过泄漏扫描与模式抹除，绝不含 code、令牌或 client_secret。
 */

import { sanitizeLocalPaths, scanText } from "../sync/leak-scan";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_OAUTH_BASE = "https://github.com/login/oauth";
const TIMEOUT_MS = 15_000;
const USER_AGENT = "llm-iq-dashboard";

export interface GitHubAppCredentials {
  id: number;
  slug: string;
  client_id: string;
  client_secret: string;
  createdAt: string;
}

export interface GitHubTokenResponse {
  access_token: string;
  refresh_token: string | null;
  expires_in: number | null;
  refresh_token_expires_in: number | null;
  token_type?: string;
  scope?: string;
}

export interface GitHubAppRef {
  client_id: string;
  client_secret: string;
}

/**
 * 脱敏错误信息：抹除所有已知密钥、本地路径及匹配泄漏模式的字符串。
 */
export function sanitizeApiError(
  rawMessage: string,
  secretsToRedact: Array<string | null | undefined> = [],
): string {
  let cleaned = sanitizeLocalPaths(rawMessage);
  for (const secret of secretsToRedact) {
    if (secret && secret.length >= 4) {
      cleaned = cleaned.replaceAll(secret, "[REDACTED]");
    }
  }
  const scan = scanText(cleaned);
  if (scan.leaked && scan.reason === "secret-pattern") {
    cleaned = cleaned
      .replace(/gh[pousr]_[A-Za-z0-9]+/g, "[REDACTED]")
      .replace(/github_pat_[A-Za-z0-9_]+/g, "[REDACTED]");
  }
  return cleaned;
}

function getSignal(timeoutMs: number = TIMEOUT_MS): AbortSignal {
  return AbortSignal.timeout(timeoutMs);
}

/**
 * 转换 manifest code 为 GitHub App 凭据，丢弃 pem 与 webhook_secret。
 */
export async function convertManifest(
  code: string,
  fetchFn: typeof fetch = fetch,
): Promise<GitHubAppCredentials> {
  const url = `${GITHUB_API_BASE}/app-manifests/${encodeURIComponent(code)}/conversions`;
  try {
    const res = await fetchFn(url, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": USER_AGENT,
      },
      signal: getSignal(),
    });
    const body = (await res.json()) as Record<string, unknown>;
    if (!res.ok || body.error) {
      const errDetail = String(body.message ?? body.error_description ?? body.error ?? res.statusText);
      throw new Error(`GitHub 清单转换失败: ${errDetail}`);
    }
    return {
      id: Number(body.id),
      slug: String(body.slug),
      client_id: String(body.client_id),
      client_secret: String(body.client_secret),
      createdAt: new Date().toISOString(),
    };
  } catch (cause) {
    const msg = cause instanceof Error ? cause.message : String(cause);
    throw new Error(sanitizeApiError(msg, [code]));
  }
}

/**
 * 查询指定 GitHub 仓库的 repository_id；查询失败或不可达返回 null。
 */
export async function fetchRepositoryId(
  owner: string,
  repo: string,
  fetchFn: typeof fetch = fetch,
): Promise<number | null> {
  const url = `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  try {
    const res = await fetchFn(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": USER_AGENT,
      },
      signal: getSignal(),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { id?: number };
    return typeof body.id === "number" ? body.id : null;
  } catch {
    return null;
  }
}

/**
 * 根据授权码换取访问令牌与刷新令牌。
 */
export async function exchangeCode(
  app: GitHubAppRef,
  code: string,
  repositoryId?: number | null,
  fetchFn: typeof fetch = fetch,
): Promise<GitHubTokenResponse> {
  const url = `${GITHUB_OAUTH_BASE}/access_token`;
  const payload: Record<string, unknown> = {
    client_id: app.client_id,
    client_secret: app.client_secret,
    code,
  };
  if (repositoryId !== undefined && repositoryId !== null) {
    payload.repository_id = repositoryId;
  }

  try {
    const res = await fetchFn(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
      },
      body: JSON.stringify(payload),
      signal: getSignal(),
    });
    const body = (await res.json()) as Record<string, unknown>;
    if (!res.ok || body.error) {
      const errDetail = String(body.error_description ?? body.error ?? res.statusText);
      throw new Error(`GitHub 换取令牌失败: ${errDetail}`);
    }
    return parseTokenResponse(body);
  } catch (cause) {
    const msg = cause instanceof Error ? cause.message : String(cause);
    throw new Error(sanitizeApiError(msg, [code, app.client_secret]));
  }
}

function parseTokenResponse(body: Record<string, unknown>): GitHubTokenResponse {
  const refreshTokenVal =
    body.refresh_token !== undefined && body.refresh_token !== null
      ? String(body.refresh_token)
      : null;
  const expiresInVal =
    typeof body.expires_in === "number" ? body.expires_in : null;
  const refreshExpiresInVal =
    typeof body.refresh_token_expires_in === "number"
      ? body.refresh_token_expires_in
      : null;
  return {
    access_token: String(body.access_token),
    refresh_token: refreshTokenVal,
    expires_in: expiresInVal,
    refresh_token_expires_in: refreshExpiresInVal,
    token_type: body.token_type ? String(body.token_type) : undefined,
    scope: body.scope ? String(body.scope) : undefined,
  };
}

/**
 * 刷新用户令牌。
 */
export async function refreshToken(
  app: GitHubAppRef,
  refresh: string,
  fetchFn: typeof fetch = fetch,
): Promise<GitHubTokenResponse> {
  const url = `${GITHUB_OAUTH_BASE}/access_token`;
  try {
    const res = await fetchFn(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
      },
      body: JSON.stringify({
        client_id: app.client_id,
        client_secret: app.client_secret,
        grant_type: "refresh_token",
        refresh_token: refresh,
      }),
      signal: getSignal(),
    });
    const body = (await res.json()) as Record<string, unknown>;
    if (!res.ok || body.error) {
      const errDetail = String(body.error_description ?? body.error ?? res.statusText);
      throw new Error(`GitHub 刷新令牌失败: ${errDetail}`);
    }
    return parseTokenResponse(body);
  } catch (cause) {
    const msg = cause instanceof Error ? cause.message : String(cause);
    throw new Error(sanitizeApiError(msg, [refresh, app.client_secret]));
  }
}

/**
 * 获取当前授权用户的 login 用户名。
 */
export async function fetchUserLogin(
  accessToken: string,
  fetchFn: typeof fetch = fetch,
): Promise<string> {
  const url = `${GITHUB_API_BASE}/user`;
  try {
    const res = await fetchFn(url, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": USER_AGENT,
      },
      signal: getSignal(),
    });
    const body = (await res.json()) as Record<string, unknown>;
    if (!res.ok || !body.login) {
      throw new Error(`无法获取 GitHub 用户名: ${res.statusText}`);
    }
    return String(body.login);
  } catch (cause) {
    const msg = cause instanceof Error ? cause.message : String(cause);
    throw new Error(sanitizeApiError(msg, [accessToken]));
  }
}

/**
 * 撤销用户的应用授权（DELETE /applications/{client_id}/grant）。
 */
export async function revokeGrant(
  app: GitHubAppRef,
  accessToken: string,
  fetchFn: typeof fetch = fetch,
): Promise<void> {
  const url = `${GITHUB_API_BASE}/applications/${encodeURIComponent(app.client_id)}/grant`;
  const basicAuth = Buffer.from(`${app.client_id}:${app.client_secret}`).toString("base64");
  try {
    const res = await fetchFn(url, {
      method: "DELETE",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
      },
      body: JSON.stringify({ access_token: accessToken }),
      signal: getSignal(),
    });
    if (!res.ok && res.status !== 204 && res.status !== 404) {
      throw new Error(`GitHub 撤销授权失败: HTTP ${res.status}`);
    }
  } catch (cause) {
    const msg = cause instanceof Error ? cause.message : String(cause);
    throw new Error(sanitizeApiError(msg, [accessToken, app.client_secret]));
  }
}

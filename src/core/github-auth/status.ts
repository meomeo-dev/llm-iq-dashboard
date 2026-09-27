/**
 * GitHub 连接状态查询。
 *
 * 依据 ACR-011：
 * 仅返回不含密钥的聚合状态：
 * state: "disconnected" | "app-created" | "connected" | "reconnect-required"
 */

import { readGithubApp, readGithubUser } from "./credential-store";

export type GithubConnectionState =
  | "disconnected"
  | "app-created"
  | "connected"
  | "reconnect-required";

export interface GithubConnection {
  state: GithubConnectionState;
  login: string | null;
  appSlug: string | null;
  appSettingsUrl: string | null;
  clientId?: string | null;
}

/**
 * 读取当前 GitHub 连接状态，不包含任何密钥信息。
 */
export async function readGithubConnection(
  customSecretsDir?: string,
): Promise<GithubConnection> {
  const app = await readGithubApp(customSecretsDir);
  if (!app) {
    return {
      state: "disconnected",
      login: null,
      appSlug: null,
      appSettingsUrl: null,
      clientId: null,
    };
  }

  const appSlug = app.slug;
  const appSettingsUrl = `https://github.com/settings/apps/${appSlug}`;
  const clientId = app.client_id;

  const user = await readGithubUser(customSecretsDir);
  if (!user) {
    return {
      state: "app-created",
      login: null,
      appSlug,
      appSettingsUrl,
      clientId,
    };
  }

  const refreshExpiry = user.refreshExpiresAt ? Date.parse(user.refreshExpiresAt) : NaN;
  const isExpired = Number.isFinite(refreshExpiry) && Date.now() >= refreshExpiry;

  if (user.reconnectRequired || isExpired) {
    return {
      state: "reconnect-required",
      login: user.login,
      appSlug,
      appSettingsUrl,
      clientId,
    };
  }

  return {
    state: "connected",
    login: user.login,
    appSlug,
    appSettingsUrl,
    clientId,
  };
}

/**
 * GitHub 推送环境变量与参数生成器（push-env）。
 *
 * 依据 ACR-011：
 * 1. 远程必须为 https://github.com/<owner>/<repo>(.git) 且与授权仓库一致（不区分大小写）；
 * 2. 访问令牌剩余有效期不足 10 分钟时自动刷新并持久化；
 * 3. 生成 GIT_ASKPASS、GIT_TERMINAL_PROMPT=0 与 PELICAN_GIT_TOKEN_FILE；
 * 4. 令牌本身绝不进入环境变量与命令行参数。
 */

import { join } from "node:path";
import { refreshToken } from "./github-api";
import {
  readAccessToken,
  readGithubApp,
  readGithubUser,
  tokenFilePath,
  writeAccessToken,
  writeGithubUser,
  type GitHubUserRecord,
} from "./credential-store";

const REFRESH_THRESHOLD_MS = 10 * 60 * 1000;
const GITHUB_REMOTE_PATTERN =
  /^https:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+?)(?:\.git)?\/?$/i;

export interface PushEnvResult {
  env: {
    GIT_ASKPASS: string;
    GIT_TERMINAL_PROMPT: "0";
    PELICAN_GIT_TOKEN_FILE: string;
  };
  gitArgs: string[];
}

export interface BuildPushEnvOptions {
  customSecretsDir?: string;
  fetchFn?: typeof fetch;
  now?: number;
}

/**
 * 解析并提取 GitHub HTTPS 远程地址的 repositoryFullName (owner/repo)。
 */
export function parseGitHubRemote(remoteUrl: string): string | null {
  const match = GITHUB_REMOTE_PATTERN.exec(remoteUrl.trim());
  if (!match || !match[1] || !match[2]) {
    return null;
  }
  return `${match[1]}/${match[2]}`;
}

/**
 * 校验远程地址是否与已授权的数据仓匹配。
 */
function assertRemoteMatches(remoteUrl: string, expectedFullName: string): void {
  const remoteFullName = parseGitHubRemote(remoteUrl);
  if (!remoteFullName) {
    throw new Error(
      `非法的远程仓库地址 "${remoteUrl}"：必须为 https://github.com/<owner>/<repo>(.git) 格式`,
    );
  }
  if (remoteFullName.toLowerCase() !== expectedFullName.toLowerCase()) {
    throw new Error(
      `远程地址 "${remoteFullName}" 与授权仓库 "${expectedFullName}" 不匹配`,
    );
  }
}

/**
 * 若访问令牌在阈值时间内即将过期，执行刷新并写回凭据存储。
 */
async function ensureFreshToken(
  user: GitHubUserRecord,
  secretsDir?: string,
  fetchFn?: typeof fetch,
  nowMs: number = Date.now(),
): Promise<void> {
  if (!user.refresh_token || !user.expiresAt) return;
  const expiresAtMs = Date.parse(user.expiresAt);
  if (Number.isFinite(expiresAtMs) && expiresAtMs - nowMs >= REFRESH_THRESHOLD_MS) {
    return;
  }

  const app = await readGithubApp(secretsDir);
  if (!app) {
    throw new Error("缺少 GitHub App 凭据，无法刷新令牌");
  }

  try {
    const refreshed = await refreshToken(app, user.refresh_token, fetchFn);
    const newExpiresAt = refreshed.expires_in
      ? new Date(nowMs + refreshed.expires_in * 1000).toISOString()
      : null;
    const newRefreshExpiresAt = refreshed.refresh_token_expires_in
      ? new Date(nowMs + refreshed.refresh_token_expires_in * 1000).toISOString()
      : null;

    await writeGithubUser(
      {
        ...user,
        refresh_token: refreshed.refresh_token,
        expiresAt: newExpiresAt,
        refreshExpiresAt: newRefreshExpiresAt,
        reconnectRequired: false,
      },
      secretsDir,
    );
    await writeAccessToken(refreshed.access_token, secretsDir);
  } catch (cause) {
    await writeGithubUser({ ...user, reconnectRequired: true }, secretsDir).catch(() => {});
    throw cause;
  }
}

/**
 * 构建推送专用的 Git 环境变量与参数。
 */
export async function buildPushEnv(
  remoteUrl: string,
  storeOrOptions?: string | BuildPushEnvOptions,
  optionalFetchFn?: typeof fetch,
): Promise<PushEnvResult> {
  const options: BuildPushEnvOptions =
    typeof storeOrOptions === "string"
      ? { customSecretsDir: storeOrOptions, fetchFn: optionalFetchFn }
      : (storeOrOptions ?? {});

  const dir = options.customSecretsDir;
  const user = await readGithubUser(dir);
  if (!user) {
    throw new Error("未连接 GitHub 或凭据不存在，无法构建推送环境");
  }

  assertRemoteMatches(remoteUrl, user.repositoryFullName);
  await ensureFreshToken(user, dir, options.fetchFn, options.now);

  const token = await readAccessToken(dir);
  if (!token) {
    throw new Error("缺少有效的 GitHub Access Token 文件");
  }

  return {
    env: {
      GIT_ASKPASS: join(process.cwd(), "docker/git-askpass.sh"),
      GIT_TERMINAL_PROMPT: "0",
      PELICAN_GIT_TOKEN_FILE: tokenFilePath(dir),
    },
    gitArgs: ["-c", "credential.helper="],
  };
}

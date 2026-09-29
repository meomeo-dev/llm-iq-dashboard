/**
 * GitHub 凭据专用存储（credential-store）。
 *
 * 依据 ACR-011：
 * 1. 凭据目录 PELICAN_SECRETS_DIR，默认 <dataRoot()>/secrets；
 * 2. 目录权限 0o700，文件权限 0o600，staging 原子写后 rename；
 * 3. 存储文件：github-app.json、github-user.json、github-access-token；
 * 4. 清除操作仅删除上述已知文件，不影响卷内其他内容。
 */

import { chmod, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { dataRoot } from "../paths";
import type { GitHubAppCredentials } from "./github-api";

export interface GitHubUserRecord {
  login: string;
  refresh_token: string | null;
  expiresAt: string | null;
  refreshExpiresAt: string | null;
  repositoryFullName: string;
  reconnectRequired?: boolean;
}

const FILE_APP = "github-app.json";
const FILE_USER = "github-user.json";
const FILE_TOKEN = "github-access-token";

export function secretsDir(customDir?: string): string {
  if (customDir && customDir.trim() !== "") {
    return customDir;
  }
  const envDir = process.env.PELICAN_SECRETS_DIR;
  if (envDir && envDir.trim() !== "") {
    return envDir.trim();
  }
  return join(dataRoot(), "secrets");
}

export function tokenFilePath(customDir?: string): string {
  return join(secretsDir(customDir), FILE_TOKEN);
}

async function ensureDirSecure(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true, mode: 0o700 });
  await chmod(dir, 0o700).catch(() => {});
}

/** 目录 0700、文件 0600，临时文件后原子替换；profile 的 API key 也用它写（见 core/profile-credentials.ts） */
export async function secureWriteFile(filePath: string, content: string): Promise<void> {
  const dir = dirname(filePath);
  await ensureDirSecure(dir);

  const staging = `${filePath}.staging`;
  await writeFile(staging, content, { encoding: "utf8", mode: 0o600 });
  await chmod(staging, 0o600).catch(() => {});
  await rename(staging, filePath);
  await chmod(filePath, 0o600).catch(() => {});
}

export async function readGithubApp(
  customDir?: string,
): Promise<GitHubAppCredentials | null> {
  const target = join(secretsDir(customDir), FILE_APP);
  try {
    const text = await readFile(target, "utf8");
    return JSON.parse(text) as GitHubAppCredentials;
  } catch {
    return null;
  }
}

export async function writeGithubApp(
  app: GitHubAppCredentials,
  customDir?: string,
): Promise<void> {
  const dir = secretsDir(customDir);
  await ensureDirSecure(dir);
  const target = join(dir, FILE_APP);
  await secureWriteFile(target, `${JSON.stringify(app, null, 2)}\n`);
}

export async function readGithubUser(
  customDir?: string,
): Promise<GitHubUserRecord | null> {
  const target = join(secretsDir(customDir), FILE_USER);
  try {
    const text = await readFile(target, "utf8");
    return JSON.parse(text) as GitHubUserRecord;
  } catch {
    return null;
  }
}

export async function writeGithubUser(
  user: GitHubUserRecord,
  customDir?: string,
): Promise<void> {
  const dir = secretsDir(customDir);
  await ensureDirSecure(dir);
  const target = join(dir, FILE_USER);
  await secureWriteFile(target, `${JSON.stringify(user, null, 2)}\n`);
}

export async function readAccessToken(customDir?: string): Promise<string | null> {
  const target = join(secretsDir(customDir), FILE_TOKEN);
  try {
    const text = await readFile(target, "utf8");
    const trimmed = text.trim();
    return trimmed.length > 0 ? trimmed : null;
  } catch {
    return null;
  }
}

export async function writeAccessToken(
  token: string,
  customDir?: string,
): Promise<void> {
  const dir = secretsDir(customDir);
  await ensureDirSecure(dir);
  const target = join(dir, FILE_TOKEN);
  await secureWriteFile(target, `${token.trim()}\n`);
}

/**
 * 清除已保存的 GitHub 凭据，仅删除已知文件。
 */
export async function clearGithubCredentials(customDir?: string): Promise<void> {
  const dir = secretsDir(customDir);
  const filesToDelete = [
    join(dir, FILE_APP),
    join(dir, `${FILE_APP}.staging`),
    join(dir, FILE_USER),
    join(dir, `${FILE_USER}.staging`),
    join(dir, FILE_TOKEN),
    join(dir, `${FILE_TOKEN}.staging`),
  ];

  for (const file of filesToDelete) {
    await rm(file, { force: true }).catch(() => {});
  }
}

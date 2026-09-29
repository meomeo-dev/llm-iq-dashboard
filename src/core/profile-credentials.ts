/**
 * 非默认 profile 的 API key 存储。
 *
 * key 放在凭据目录 `<secretsDir>/profiles/<cli>/<name>.key`（目录 0700、文件 0600、临时文件后
 * 原子替换），分容器部署时只有执行器挂载该目录。看板要显示"是否已填"，但读不到凭据目录，
 * 所以写 key 的一方同时在产物目录维护一份不含 key 的状态表 `profile-credentials.json`。
 */

import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { secretsDir, secureWriteFile } from "./github-auth/credential-store";
import { dataRoot } from "./paths";
import type { CliKind } from "./types";

const STATUS_FILE = "profile-credentials.json";
/** API key 的长度上限；超出多半是粘错了内容 */
const MAX_KEY_LENGTH = 4096;

export interface ProfileCredentialStatus {
  /** 最近一次写入 key 的时刻 */
  updatedAt: string;
}

/** 键为 `cli:name` */
export type ProfileCredentialTable = Record<string, ProfileCredentialStatus>;

export function credentialKey(cli: CliKind, name: string): string {
  return `${cli}:${name}`;
}

export function profileKeyPath(cli: CliKind, name: string): string {
  return join(secretsDir(), "profiles", cli, `${name}.key`);
}

/** 去掉首尾空白；空、含空白或控制字符、超长时返回错误说明 */
export function validateApiKey(raw: unknown): { ok: true; key: string } | { ok: false; error: string } {
  if (typeof raw !== "string") return { ok: false, error: "apiKey 必须是字符串" };
  const key = raw.trim();
  if (key === "") return { ok: false, error: "apiKey 不能为空" };
  if (key.length > MAX_KEY_LENGTH) return { ok: false, error: `apiKey 超过 ${MAX_KEY_LENGTH} 个字符` };
  if ([...key].some((ch) => ch <= " " || ch === "\u007f")) {
    return { ok: false, error: "apiKey 不能含空白或控制字符" };
  }
  return { ok: true, key };
}

export async function writeProfileKey(cli: CliKind, name: string, key: string, now: Date = new Date()): Promise<void> {
  await secureWriteFile(profileKeyPath(cli, name), `${key}\n`);
  const table = await readCredentialStatus();
  table[credentialKey(cli, name)] = { updatedAt: now.toISOString() };
  await writeCredentialStatus(table);
}

export async function deleteProfileKey(cli: CliKind, name: string): Promise<void> {
  const path = profileKeyPath(cli, name);
  await rm(path, { force: true });
  await rm(`${path}.staging`, { force: true });
  const table = await readCredentialStatus();
  delete table[credentialKey(cli, name)];
  await writeCredentialStatus(table);
}

/** 运行时取 key；没有文件时为 null */
export async function readProfileKey(cli: CliKind, name: string): Promise<string | null> {
  try {
    const key = (await readFile(profileKeyPath(cli, name), "utf8")).trim();
    return key === "" ? null : key;
  } catch {
    return null;
  }
}

/** 文件缺失或损坏时按空表处理：界面显示为"未填"，不阻断配置页 */
export async function readCredentialStatus(): Promise<ProfileCredentialTable> {
  try {
    const parsed: unknown = JSON.parse(await readFile(join(dataRoot(), STATUS_FILE), "utf8"));
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as ProfileCredentialTable;
  } catch {
    return {};
  }
}

async function writeCredentialStatus(table: ProfileCredentialTable): Promise<void> {
  const root = dataRoot();
  await mkdir(root, { recursive: true });
  const target = join(root, STATUS_FILE);
  const staging = `${target}.staging`;
  await writeFile(staging, `${JSON.stringify(table, null, 2)}\n`, "utf8");
  await rename(staging, target);
}

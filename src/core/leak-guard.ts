/**
 * 输出泄漏拦截（leak guard）：模型输出落盘前比对三家 CLI 凭据文件的指纹。
 *
 * 每轮开始时读取凭据文件，只保留其中令牌样式子串的滑窗 HMAC，密钥每个进程随机生成、
 * 不落盘；扫描输出时用同样的窗口计算并比对。指纹不可逆，内存里没有凭据明文，
 * 扫描本身不会成为第二个泄露点（见 docs/security/public-exposure-design.md §4.5）。
 */

import { createHmac, randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Env } from "./ceiling";

/** 令牌样式子串：连续的 base64 / URL-safe 字符；短于窗口的不计 */
const TOKEN_CHARS = /[A-Za-z0-9_\-.=]+/g;
/** 滑窗宽度。凭据令牌远长于此；窗口比对使令牌嵌在更长的字符串里也能命中 */
export const WINDOW = 20;

export interface LeakGuard {
  /** 指纹数量；为 0 表示没有读到任何凭据文件 */
  readonly size: number;
  /** 文本是否含任一凭据令牌的片段 */
  hits(text: string): boolean;
}

/** 三家 CLI 的凭据文件位置，与各 CLI 的目录约定一致；不存在的文件忽略 */
export function credentialFiles(env: Env = process.env, home: string = homedir()): string[] {
  const claudeDir = env.CLAUDE_CONFIG_DIR?.trim() || join(home, ".claude");
  const codexDir = env.CODEX_HOME?.trim() || join(home, ".codex");
  return [
    join(claudeDir, ".credentials.json"),
    join(codexDir, "auth.json"),
    join(home, ".gemini", "antigravity-cli", "antigravity-oauth-token"),
  ];
}

export async function buildLeakGuard(files: readonly string[] = credentialFiles()): Promise<LeakGuard> {
  const contents = await Promise.all(files.map((file) => readFile(file, "utf8").catch(() => "")));
  return leakGuardFromText(contents);
}

/** 由凭据文本直接构建，供单测与不读文件的调用方使用 */
export function leakGuardFromText(secrets: readonly string[]): LeakGuard {
  const key = randomBytes(32);
  const fingerprints = new Set<string>();
  for (const text of secrets) {
    for (const token of tokenCandidates(text)) {
      for (const window of slide(token)) fingerprints.add(fingerprint(key, window));
    }
  }
  return {
    size: fingerprints.size,
    hits(text: string): boolean {
      if (fingerprints.size === 0) return false;
      for (const token of tokenCandidates(text)) {
        for (const window of slide(token)) {
          if (fingerprints.has(fingerprint(key, window))) return true;
        }
      }
      return false;
    },
  };
}

function tokenCandidates(text: string): string[] {
  return (text.match(TOKEN_CHARS) ?? []).filter((token) => token.length >= WINDOW);
}

function* slide(token: string): Generator<string> {
  for (let start = 0; start + WINDOW <= token.length; start += 1) yield token.slice(start, start + WINDOW);
}

function fingerprint(key: Buffer, window: string): string {
  return createHmac("sha256", key).update(window).digest("base64");
}

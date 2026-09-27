/**
 * 共享泄漏扫描规则（leak-scan）。
 *
 * 发布前对 run.json 文本与每个 SVG 执行：
 * 1. local-path：本机绝对路径
 * 2. private-key：私钥块
 * 3. secret-pattern：常见云厂商与服务令牌
 * 4. leak-guard：凭据指纹库比对
 */

import type { LeakGuard } from "../leak-guard";

export type LeakReason = "local-path" | "private-key" | "secret-pattern" | "leak-guard";

export interface LeakScanHit {
  leaked: true;
  reason: LeakReason;
}

export interface LeakScanClean {
  leaked: false;
}

export type LeakScanResult = LeakScanHit | LeakScanClean;

/**
 * 1. 本机绝对路径（local-path）：
 * /Users/<名>/、/home/<名>/、/root/、C:\Users\<名>\（盘符与大小写不敏感，正反斜杠都算）。
 */
const LOCAL_PATH_PATTERN =
  /(?:[a-zA-Z]:)?[/\\](?:Users|home)[/\\][^/\\\r\n\t "']+[/\\]|[/\\]root[/\\]/i;

/** 替换匹配到的用户家目录为 ~ 形式 */
const LOCAL_PATH_REPLACE_PATTERN =
  /(?:[a-zA-Z]:)?[/\\](?:Users|home)[/\\][^/\\\r\n\t "']+[/\\]|[/\\]root[/\\]/gi;

/** 2. 私钥块（private-key） */
const PRIVATE_KEY_PATTERN = /-----BEGIN [^\r\n]+PRIVATE KEY-----/;

/** 3. 令牌样式（secret-pattern）中的固定前缀/正则 */
const GH_TOKEN_PATTERN = /(?<![A-Za-z0-9_-])gh[pousr]_[A-Za-z0-9]{36,}/;
const GITHUB_PAT_PATTERN = /(?<![A-Za-z0-9_-])github_pat_[A-Za-z0-9_]{22,}/;
const AWS_AKIA_PATTERN = /(?<![A-Za-z0-9_-])AKIA[0-9A-Z]{16}/;
const SLACK_TOKEN_PATTERN = /(?<![A-Za-z0-9_-])xox[abprs]-[A-Za-z0-9-]{10,}/;
const GOOGLE_AIZA_PATTERN = /(?<![A-Za-z0-9_-])AIza[0-9A-Za-z_-]{35}/;
const BEARER_TOKEN_PATTERN = /Bearer [A-Za-z0-9._~+/-]{20,}/;
const JWT_PATTERN =
  /(?<![A-Za-z0-9_-])eyJ[A-Za-z0-9_-]{7,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/;

/** sk- / sk-ant- / sk-proj- 需同时包含数字与大写字母，避免常见标识误报 */
const OPENAI_OR_ANTHROPIC_SK_PATTERN =
  /(?<![A-Za-z0-9_-])(?:sk-ant-|sk-proj-|sk-)[A-Za-z0-9_-]{32,}/g;

/** 将文本中的本机绝对路径替换为 ~ 形式 */
export function sanitizeLocalPaths(text: string): string {
  return text.replace(LOCAL_PATH_REPLACE_PATTERN, (match) => {
    return match.includes("\\") ? "~\\" : "~/";
  });
}

/** 检查是否匹配 secret-pattern 规则 */
export function checkSecretPattern(text: string): boolean {
  if (GH_TOKEN_PATTERN.test(text)) return true;
  if (GITHUB_PAT_PATTERN.test(text)) return true;
  if (AWS_AKIA_PATTERN.test(text)) return true;
  if (SLACK_TOKEN_PATTERN.test(text)) return true;
  if (GOOGLE_AIZA_PATTERN.test(text)) return true;
  if (BEARER_TOKEN_PATTERN.test(text)) return true;
  if (JWT_PATTERN.test(text)) return true;

  OPENAI_OR_ANTHROPIC_SK_PATTERN.lastIndex = 0;
  let skMatch: RegExpExecArray | null = OPENAI_OR_ANTHROPIC_SK_PATTERN.exec(text);
  while (skMatch !== null) {
    const candidate = skMatch[0];
    const hasDigit = /\d/.test(candidate);
    const hasUpper = /[A-Z]/.test(candidate);
    if (hasDigit && hasUpper) return true;
    skMatch = OPENAI_OR_ANTHROPIC_SK_PATTERN.exec(text);
  }

  return false;
}

/**
 * 扫描文本是否命中共享泄漏规则或凭据指纹。
 */
export function scanText(text: string, leakGuard?: LeakGuard): LeakScanResult {
  if (LOCAL_PATH_PATTERN.test(text)) {
    return { leaked: true, reason: "local-path" };
  }

  if (PRIVATE_KEY_PATTERN.test(text)) {
    return { leaked: true, reason: "private-key" };
  }

  if (checkSecretPattern(text)) {
    return { leaked: true, reason: "secret-pattern" };
  }

  if (leakGuard !== undefined && leakGuard.hits(text)) {
    return { leaked: true, reason: "leak-guard" };
  }

  return { leaked: false };
}

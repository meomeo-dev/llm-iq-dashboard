/**
 * 全仓 CLI 共享参数解析、正交词典归一化、拼写纠错与 TTY 安全确认基座。
 */

import { createInterface } from "node:readline/promises";

/**
 * 剥离 pnpm v10 在任意位置透传的 `--` 分隔符。
 */
export function stripPnpmSeparators(argv: readonly string[]): string[] {
  return argv.filter((arg) => arg !== "--");
}

/**
 * 将 `--flag=value` 或 `-c=value` 形式展开为独立 token，同时保留普通参数值内部的 `=`（如 `p1=c1`）。
 */
export function expandEqualsTokens(argv: readonly string[]): string[] {
  const expanded: string[] = [];
  for (const token of argv) {
    if (token.startsWith("--")) {
      const eqIndex = token.indexOf("=");
      if (eqIndex > 2) {
        expanded.push(token.slice(0, eqIndex), token.slice(eqIndex + 1));
        continue;
      }
    } else if (/^-[a-zA-Z]=/.test(token)) {
      expanded.push(token.slice(0, 2), token.slice(3));
      continue;
    }
    expanded.push(token);
  }
  return expanded;
}

/**
 * 单复数与历史同义词映射表（统一归并为单数标准名）。
 * 注意：不映射 `--declared`，以便单独检测 `--model` 与 `--declared` 冲突。
 */
export const CANONICAL_FLAG_ALIASES: Readonly<Record<string, string>> = {
  "--clis": "--cli",
  "--models": "--model",
  "--efforts": "--effort",
  "--profiles": "--profile",
  "--prompts": "--prompt",
  "--probes": "--probe",
  "--runs": "--run",
  "--only": "--run",
  "--candidates": "--candidate",
  "--targets": "--target",
  "-y": "--yes",
  "-c": "--config",
  "-h": "--help",
};

export function canonicalizeFlag(flag: string): string {
  return CANONICAL_FLAG_ALIASES[flag] ?? flag;
}

function isOptionFlagToken(token: string | undefined): boolean {
  if (token === undefined) return false;
  return token === "--" || token.startsWith("--") || /^-[a-zA-Z]/.test(token);
}

/**
 * 最高优先级检测 `--help` / `-h` / 顶层 `help` 子命令。
 * 即使出现在带值参数之后（如 `["--cli", "-h"]` 或 `["-c", "/tmp/c.yaml", "help"]`）也识别为帮助请求。
 */
export function hasHelpFlag(argv: readonly string[]): boolean {
  const tokens = expandEqualsTokens(stripPnpmSeparators(argv));
  if (tokens.some((arg) => arg === "--help" || arg === "-h")) return true;
  let idx = 0;
  while (idx < tokens.length) {
    const canon = canonicalizeFlag(tokens[idx]!);
    if (canon === "--config" || canon === "--data-dir") {
      idx += isOptionFlagToken(tokens[idx + 1]) ? 1 : 2;
      continue;
    }
    break;
  }
  return tokens[idx] === "help";
}

/**
 * 拆分逗号分隔值并去空白。
 */
export function parseCsvValues(raw: string): string[] {
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

/**
 * 归一化多值选项（同时支持 `--flag a,b` 与 `--flag a --flag b`），保序去重。
 */
export function normalizeMultiValueFlag(
  existing: readonly string[] | undefined,
  raw: string,
  flagName: string,
): string[] {
  const values = parseCsvValues(raw);
  if (values.length === 0) {
    throw new Error(`参数 ${flagName} 不能为空`);
  }
  const merged = existing ? [...existing] : [];
  for (const val of values) {
    if (!merged.includes(val)) merged.push(val);
  }
  return merged;
}

/**
 * 消费紧随 flag 之后的非空取值（允许 `-1` 等负数传给下游数值校验器）。
 */
export function consumeFlagValue(argsList: readonly string[], index: number, flag: string): string {
  const val = argsList[index + 1];
  if (val === undefined || isOptionFlagToken(val)) {
    throw new Error(`参数 ${flag} 缺少取值`);
  }
  return val;
}

/**
 * 校验并修剪必填字符串参数。
 */
export function requireNonEmptyTrimmed(flag: string, value: string): string {
  const trimmed = value.trim();
  if (trimmed === "") throw new Error(`参数 ${flag} 不能为空`);
  return trimmed;
}

/**
 * 合并 `--model` 与 `--declared`：同集合允许（去重保序），集合不等时显式报错。
 */
export function resolveModelAndDeclared(
  modelValues: readonly string[] | undefined,
  declaredValues: readonly string[] | undefined,
): string[] | undefined {
  const mSet = new Set(modelValues ?? []);
  const dSet = new Set(declaredValues ?? []);
  if (mSet.size === 0 && dSet.size === 0) return undefined;
  if (mSet.size > 0 && dSet.size > 0) {
    const sameSet = mSet.size === dSet.size && [...mSet].every((v) => dSet.has(v));
    if (!sameSet) {
      throw new Error(
        `--model (${[...mSet].join(",")}) 与 --declared (${[...dSet].join(",")}) 取值冲突，请只指定其一`,
      );
    }
  }
  return mSet.size > 0 ? [...mSet] : [...dSet];
}

/**
 * 提取并应用全局路径参数 `--config` / `-c` 与 `--data-dir`（写入环境变量并返回剩余参数）。
 * 若当前命令包含 `--help` / `-h` / `help`，保持零副作用（不改 env、不因缺值或 `-d` 抛错）。
 */
export function extractGlobalPathFlags(
  argv: readonly string[],
  env: Record<string, string | undefined> = process.env,
): string[] {
  const tokens = expandEqualsTokens(stripPnpmSeparators(argv));
  const helpMode = hasHelpFlag(tokens);
  const remaining: string[] = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]!;
    if (token === "-d") {
      if (helpMode) continue;
      throw new Error("未知选项：-d（提示：--data-dir 不绑定 -d 短选项；预演请用 --dry-run）");
    }
    const canon = canonicalizeFlag(token);
    if (canon === "--config" || canon === "--data-dir") {
      if (helpMode) {
        if (tokens[i + 1] !== undefined && !isOptionFlagToken(tokens[i + 1])) i += 1;
        continue;
      }
      const value = requireNonEmptyTrimmed(token, consumeFlagValue(tokens, i, token));
      if (canon === "--config") env.PELICAN_CONFIG = value;
      else env.PELICAN_DATA_DIR = value;
      i += 1;
      continue;
    }
    remaining.push(token);
  }
  return remaining;
}

/**
 * 计算两个字符串的 Damerau-Levenshtein（含相邻字符转置）编辑距离。
 */
export function damerauLevenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i += 1) dp[i]![0] = i;
  for (let j = 0; j <= n; j += 1) dp[0]![j] = j;

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let best = Math.min(dp[i - 1]![j]! + 1, dp[i]![j - 1]! + 1, dp[i - 1]![j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        best = Math.min(best, dp[i - 2]![j - 2]! + 1);
      }
      dp[i]![j] = best;
    }
  }
  return dp[m]![n]!;
}

/**
 * 在候选列表中查找距离 <= maxDistance 的最近似项。
 */
export function suggestClosestMatch(
  input: string,
  candidates: readonly string[],
  maxDistance: number = 2,
): string | null {
  let bestCandidate: string | null = null;
  let bestDistance = maxDistance + 1;
  for (const candidate of candidates) {
    const dist = damerauLevenshtein(input.toLowerCase(), candidate.toLowerCase());
    if (dist < bestDistance) {
      bestDistance = dist;
      bestCandidate = candidate;
    }
  }
  return bestCandidate;
}

/**
 * 格式化未知选项报错信息（附带相似选项纠错与 `--help` 指引）。
 */
export function formatCliError(
  flag: string,
  validFlags: readonly string[],
  helpCommand?: string,
): string {
  const suggestion = suggestClosestMatch(flag, validFlags, 2);
  const parts = [`未知选项：${flag}`];
  if (suggestion) parts.push(`（您是否想输入 ${suggestion}？）`);
  if (helpCommand) parts.push(`运行 ${helpCommand} 查看可用选项。`);
  return parts.join(" ");
}

export interface ConfirmOrAbortOptions {
  yes?: boolean;
  customConfirm?: (prompt: string) => Promise<boolean>;
  isInteractive?: boolean;
  nonTtyHint?: string;
  writeError?: (line: string) => void;
  writeInfo?: (line: string) => void;
}

async function promptReadlineYesNo(promptText: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(`${promptText} [y/N]: `);
    return /^y(es)?$/i.test(answer.trim());
  } catch {
    return false;
  } finally {
    rl.close();
  }
}

/**
 * TTY 感知的高危/计费操作二次确认：
 * 优先级：yes -> customConfirm（单测注入）-> isTTY 检查 -> readline [y/N]。
 * 非 TTY 未传 --yes 或用户取消时均将 process.exitCode 设为 1 并返回 false。
 */
export async function confirmOrAbort(
  promptText: string,
  options: ConfirmOrAbortOptions = {},
): Promise<boolean> {
  if (options.yes) return true;
  const writeInfo = options.writeInfo ?? ((line: string) => console.log(line));
  const writeError = options.writeError ?? ((line: string) => console.error(line));

  if (options.customConfirm) {
    const accepted = await options.customConfirm(promptText);
    if (!accepted) {
      writeInfo("已取消执行。");
      process.exitCode = 1;
    }
    return accepted;
  }

  const interactive = options.isInteractive ?? Boolean(process.stdin.isTTY && process.stdout.isTTY);
  if (!interactive) {
    const hint = options.nonTtyHint ? `（示例：${options.nonTtyHint}）` : "";
    writeError(
      `错误：当前为非交互终端（non-TTY），请显式追加 --yes 跳过确认，或使用 --dry-run 预演${hint}。`,
    );
    process.exitCode = 1;
    return false;
  }

  const accepted = await promptReadlineYesNo(promptText);
  if (!accepted) {
    writeInfo("已取消执行。");
    process.exitCode = 1;
  }
  return accepted;
}

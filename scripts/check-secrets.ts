/**
 * 发布前密钥扫描（check:secrets）：对 git 已跟踪的文本文件逐行套用与数据仓发布同一套泄漏规则
 * （私钥块、常见厂商令牌），再加一条「赋值启发」抓中转商等自定义形状的 key；同时核对本机配置、
 * 产物目录与 .env 没被意外加进版本库。策略与白名单见 config/secret-scan-policy.yaml。
 * 命中即非零退出；GitHub 的 push protection 只认厂商格式，这一道补的是它认不出的那部分。
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { checkPrivateKey, checkSecretPattern } from "../src/core/sync/leak-scan";

interface Policy {
  ignore: string[];
  allow: Array<{ path: string; reason: string }>;
  forbidden: string[];
}

interface Hit {
  file: string;
  line: number;
  rule: "private-key" | "secret-pattern" | "assignment";
  preview: string;
}

const POLICY_PATH = "config/secret-scan-policy.yaml";
const BINARY_EXTENSIONS = /\.(png|jpe?g|gif|webp|ico|woff2?|ttf|otf|pdf|zip|gz)$/i;

/** 键名像密钥、值是 32 位以上的随机串；值须同时含字母与数字，排除 xxxx 之类占位 */
const ASSIGNMENT_PATTERN =
  /(?:api[_-]?key|secret|token|passw(?:or)?d|credential)["']?\s*[:=]\s*["']?([A-Za-z0-9_\-]{32,})/i;

function loadPolicy(): Policy {
  const raw = parse(readFileSync(POLICY_PATH, "utf8")) as Partial<Policy>;
  return { ignore: raw.ignore ?? [], allow: raw.allow ?? [], forbidden: raw.forbidden ?? [] };
}

/** 以 / 结尾按前缀匹配，否则精确匹配 */
function matchesPath(file: string, entries: readonly string[]): boolean {
  return entries.some((entry) => (entry.endsWith("/") ? file.startsWith(entry) : file === entry));
}

function trackedFiles(): string[] {
  return execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
}

function looksRandom(value: string): boolean {
  return /[A-Za-z]/.test(value) && /\d/.test(value) && new Set(value).size > 8;
}

function scanLine(line: string): Hit["rule"] | null {
  if (checkPrivateKey(line)) return "private-key";
  if (checkSecretPattern(line)) return "secret-pattern";
  const assignment = ASSIGNMENT_PATTERN.exec(line);
  if (assignment !== null && looksRandom(assignment[1])) return "assignment";
  return null;
}

function scanFile(file: string): Hit[] {
  if (BINARY_EXTENSIONS.test(file)) return [];
  const buffer = readFileSync(file);
  if (buffer.subarray(0, 8000).includes(0)) return [];
  const hits: Hit[] = [];
  buffer.toString("utf8").split("\n").forEach((line, index) => {
    const rule = scanLine(line);
    if (rule !== null) hits.push({ file, line: index + 1, rule, preview: line.trim().slice(0, 60) });
  });
  return hits;
}

function main(): number {
  const policy = loadPolicy();
  const files = trackedFiles();
  const forbidden = files.filter((file) => matchesPath(file, policy.forbidden));
  const allowed = new Set(policy.allow.map((item) => item.path));
  const hits = files
    .filter((file) => !matchesPath(file, policy.ignore) && !allowed.has(file))
    .flatMap(scanFile);

  for (const file of forbidden) console.log(`[禁止入库] ${file}`);
  for (const hit of hits) console.log(`[${hit.rule}] ${hit.file}:${hit.line}  ${hit.preview}`);
  const problems = forbidden.length + hits.length;
  console.log(`扫描 ${files.length} 个已跟踪文件，白名单 ${allowed.size} 个，问题 ${problems} 项`);
  if (problems > 0) {
    console.log("[失败] 密钥扫描未通过：确认是假值请在 config/secret-scan-policy.yaml 登记并写明原因");
    return 1;
  }
  console.log("[通过] 密钥扫描通过！");
  return 0;
}

process.exit(main());

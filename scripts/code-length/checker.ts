/**
 * 代码长度检查核心逻辑模块。
 */

import { existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import ts from "typescript";
import { countFileLines, extractFunctions } from "./ast";
import { findTargetFiles } from "./matcher";
import type {
  ASTFunctionInfo,
  CodeLengthPolicy,
  ExpiredAllowlistEntry,
  LengthCheckReport,
  LengthViolation,
} from "./types";

const DEFAULT_FILE_CAPS: Record<string, number> = {
  ts: 500,
  tsx: 300,
  css: 300,
};

const DEFAULT_FN_CAPS: Record<string, number> = {
  ts: 50,
  tsx: 80,
};

function getFileLimit(ext: string, policy: CodeLengthPolicy): number {
  return policy.thresholds.files[ext] ?? DEFAULT_FILE_CAPS[ext] ?? 500;
}

function getFunctionLimit(ext: string, policy: CodeLengthPolicy): number {
  return policy.thresholds.functions[ext] ?? DEFAULT_FN_CAPS[ext] ?? 50;
}

function checkFileLength(
  relPath: string,
  lines: number,
  limit: number,
  policy: CodeLengthPolicy,
): LengthViolation | null {
  if (lines <= limit) return null;
  const allow = policy.allowlist.find(
    (a) => a.path === relPath && a.symbol === undefined,
  );
  const effectiveLimit = allow ? allow.limit : limit;
  const exempted = allow !== undefined && lines <= allow.limit;

  return {
    type: "file",
    file: relPath,
    lines,
    limit: effectiveLimit,
    standardLimit: limit,
    excess: lines - effectiveLimit,
    exempted,
    reason: allow?.reason,
  };
}

function checkFunctionLength(
  relPath: string,
  fn: ASTFunctionInfo,
  limit: number,
  policy: CodeLengthPolicy,
): LengthViolation | null {
  if (fn.lineCount <= limit) return null;
  const allow = policy.allowlist.find(
    (a) => a.path === relPath && a.symbol === fn.name,
  );
  const effectiveLimit = allow ? allow.limit : limit;
  const exempted = allow !== undefined && fn.lineCount <= allow.limit;

  return {
    type: "function",
    file: relPath,
    symbol: fn.name,
    lines: fn.lineCount,
    limit: effectiveLimit,
    standardLimit: limit,
    excess: fn.lineCount - effectiveLimit,
    exempted,
    reason: allow?.reason,
  };
}

function detectExpiredAllowlist(
  cwd: string,
  policy: CodeLengthPolicy,
): ExpiredAllowlistEntry[] {
  const expired: ExpiredAllowlistEntry[] = [];
  for (const entry of policy.allowlist) {
    const fullPath = join(cwd, entry.path);
    if (!existsSync(fullPath)) continue;
    const content = readFileSync(fullPath, "utf8");
    const ext = extname(entry.path).slice(1);

    if (entry.symbol === undefined) {
      const actual = countFileLines(content);
      const standardLimit = getFileLimit(ext, policy);
      if (actual <= standardLimit) {
        expired.push({ ...entry, actual, standardLimit });
      }
    } else {
      const sf = ts.createSourceFile(fullPath, content, ts.ScriptTarget.Latest, true);
      const fns = extractFunctions(sf);
      const fn = fns.find((f) => f.name === entry.symbol);
      const standardLimit = getFunctionLimit(ext, policy);
      if (fn && fn.lineCount <= standardLimit) {
        expired.push({ ...entry, actual: fn.lineCount, standardLimit });
      }
    }
  }
  return expired;
}

export function checkCodeLength(options: {
  cwd?: string;
  policy: CodeLengthPolicy;
}): LengthCheckReport {
  const cwd = options.cwd ?? process.cwd();
  const policy = options.policy;
  const files = findTargetFiles(cwd, policy.include, policy.exclude);

  const violations: LengthViolation[] = [];

  for (const relPath of files) {
    const fullPath = join(cwd, relPath);
    const content = readFileSync(fullPath, "utf8");
    const ext = extname(relPath).slice(1);
    const lines = countFileLines(content);
    const fileLimit = getFileLimit(ext, policy);

    const fileV = checkFileLength(relPath, lines, fileLimit, policy);
    if (fileV) violations.push(fileV);

    if (ext === "ts" || ext === "tsx") {
      const sf = ts.createSourceFile(fullPath, content, ts.ScriptTarget.Latest, true);
      const fns = extractFunctions(sf);
      const fnLimit = getFunctionLimit(ext, policy);
      for (const fn of fns) {
        const fnV = checkFunctionLength(relPath, fn, fnLimit, policy);
        if (fnV) violations.push(fnV);
      }
    }
  }

  violations.sort((a, b) => b.excess - a.excess);
  const unexemptedViolations = violations.filter((v) => !v.exempted);
  const exemptedViolations = violations.filter((v) => v.exempted);
  const expiredAllowlist = detectExpiredAllowlist(cwd, policy);

  return {
    totalFiles: files.length,
    violations,
    unexemptedViolations,
    exemptedViolations,
    expiredAllowlist,
    success: unexemptedViolations.length === 0,
  };
}

#!/usr/bin/env tsx
/**
 * Web 设计系统与组件原语静态门禁（check-ui-hygiene.ts）。
 *
 * 检查规则：
 *   UI-00: Tier 1 原语目录（src/app/components/ui）严禁 import @/core/* 业务模块
 *   UI-01: 基于 TS AST 禁止静态 JSX 内联样式（仅放行 --* 与动态计算的几何/哈希色）
 *   UI-02: 禁止裸色值字面量、非 Token font-size 与非标 @media 断点（640px/900px/1200px）
 *   UI-03: 禁止顶层裸标签（UI-03a）、后代裸交互标签（UI-03b）与连续 :not() 链（UI-03c）
 *   UI-04: 跨目录主类名唯一所有权（UI-04a）、顶层单类名跨目录泄漏（UI-04b）与 CSS 变量校验（UI-04c）
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import {
  checkCssSelectors,
  checkCssValuesAndMedia,
  checkCssVariablesAndOwnership,
  stripCssComments,
  type EnforcedCssRecord,
  type EnforcedTsxRecord,
} from "./ui-hygiene/css-rules";
import { checkTsxFile } from "./ui-hygiene/tsx-rules";
import {
  DEFAULT_ENFORCED_PATHS,
  type UiHygieneOptions,
  type UiHygieneReport,
  type UiViolation,
} from "./ui-hygiene/types";

function walkFiles(dirOrFile: string, out: string[] = []): string[] {
  if (!existsSync(dirOrFile)) return out;
  const st = statSync(dirOrFile);
  if (st.isFile()) {
    if (/\.(?:ts|tsx|css)$/.test(dirOrFile)) out.push(dirOrFile);
    return out;
  }
  for (const entry of readdirSync(dirOrFile, { withFileTypes: true })) {
    const full = join(dirOrFile, entry.name);
    if (entry.isDirectory()) walkFiles(full, out);
    else if (/\.(?:ts|tsx|css)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function collectDefinedCssVariables(cwd: string): {
  definedVars: Set<string>;
  globalTokenVars: Set<string>;
} {
  const definedVars = new Set<string>();
  const globalTokenVars = new Set<string>();
  const allAppFiles = walkFiles(resolve(cwd, "src/app"));

  for (const absFile of allAppFiles) {
    const rel = relative(cwd, absFile).replace(/\\/g, "/");
    const content = readFileSync(absFile, "utf8");
    const isGlobal = rel === "src/app/tokens.css" || rel === "src/app/globals.css";
    if (rel.endsWith(".css")) {
      const stripped = stripCssComments(content);
      const defRe = /(--[a-zA-Z0-9_-]+)\s*:/g;
      let match: RegExpExecArray | null;
      while ((match = defRe.exec(stripped)) !== null) {
        definedVars.add(match[1]!);
        if (isGlobal) globalTokenVars.add(match[1]!);
      }
    } else {
      const inlineVarRe = /["'](--[a-zA-Z0-9_-]+)["']\s*:/g;
      let match: RegExpExecArray | null;
      while ((match = inlineVarRe.exec(content)) !== null) {
        definedVars.add(match[1]!);
      }
    }
  }
  return { definedVars, globalTokenVars };
}

export function checkUiHygiene(options: UiHygieneOptions): UiHygieneReport {
  const enforcedPaths = options.enforcedPaths ?? DEFAULT_ENFORCED_PATHS;
  const fileSet = new Set<string>();
  for (const p of enforcedPaths) {
    for (const f of walkFiles(resolve(options.cwd, p))) fileSet.add(f);
  }
  const files = [...fileSet].sort();
  const violations: UiViolation[] = [];
  const enforcedCssRecords: EnforcedCssRecord[] = [];
  const enforcedTsxRecords: EnforcedTsxRecord[] = [];

  for (const absFile of files) {
    const relFile = relative(options.cwd, absFile).replace(/\\/g, "/");
    const content = readFileSync(absFile, "utf8");
    if (relFile.endsWith(".css")) {
      const stripped = stripCssComments(content);
      violations.push(...checkCssValuesAndMedia(relFile, stripped));
      const sel = checkCssSelectors(relFile, stripped);
      violations.push(...sel.violations);
      enforcedCssRecords.push({ relFile, stripped, ...sel });
    } else if (relFile.endsWith(".tsx") || relFile.endsWith(".ts")) {
      const tsxRes = checkTsxFile(relFile, content);
      violations.push(...tsxRes.violations);
      enforcedTsxRecords.push({ relFile, usedClasses: tsxRes.usedClasses });
    }
  }

  const { definedVars, globalTokenVars } = collectDefinedCssVariables(options.cwd);
  violations.push(
    ...checkCssVariablesAndOwnership(
      enforcedCssRecords,
      definedVars,
      globalTokenVars,
      enforcedTsxRecords,
    ),
  );
  return { success: violations.length === 0, checkedFiles: files.length, enforcedPaths, violations };
}

export function runUiHygieneCli(
  args: readonly string[] = process.argv.slice(2),
  out: (msg: string) => void = console.log,
): UiHygieneReport {
  let cwd = process.cwd();
  let enforcedPaths: string[] | undefined;
  let json = false;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--cwd" && args[i + 1]) {
      cwd = resolve(process.cwd(), args[i + 1]!);
      i += 1;
    } else if (arg === "--paths" && args[i + 1]) {
      enforcedPaths = args[i + 1]!.split(",").map((s) => s.trim()).filter(Boolean);
      i += 1;
    } else if (arg === "--json") {
      json = true;
    }
  }

  const report = checkUiHygiene({ cwd, enforcedPaths });
  if (json) {
    out(JSON.stringify(report, null, 2));
  } else if (report.success) {
    out(
      `✓ UI hygiene check passed (${report.checkedFiles} files across [${report.enforcedPaths.join(", ")}])`,
    );
  } else {
    out(`✗ UI hygiene check found ${report.violations.length} violation(s):`);
    for (const v of report.violations) {
      out(`  [${v.rule}] ${v.file}:${v.line} — ${v.message}`);
    }
  }
  return report;
}

if (process.argv[1]?.endsWith("check-ui-hygiene.ts")) {
  const report = runUiHygieneCli();
  process.exit(report.success ? 0 : 1);
}

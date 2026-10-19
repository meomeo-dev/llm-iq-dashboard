import { dirname } from "node:path";
import type { UiViolation } from "./types";

const ALLOWED_BREAKPOINTS = new Set([
  "640px",
  "641px",
  "900px",
  "901px",
  "1200px",
  "1201px",
]);

const FORBIDDEN_BARE_TARGET_TAGS = new Set([
  "button",
  "input",
  "select",
  "textarea",
  "label",
]);

const RAW_COLOR_RE = /#[0-9a-fA-F]{3,8}\b|\brgba?\s*\(|\bhsla?\s*\(/;

export function stripCssComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, (match) =>
    match.replace(/[^\n]/g, " "),
  );
}

function lineAtOffset(text: string, offset: number): number {
  let line = 1;
  for (let i = 0; i < offset && i < text.length; i += 1) {
    if (text.charCodeAt(i) === 10) line += 1;
  }
  return line;
}

export function checkCssValuesAndMedia(relFile: string, stripped: string): UiViolation[] {
  const violations: UiViolation[] = [];
  const isTokensFile = relFile === "src/app/tokens.css";
  const isColorExempt = isTokensFile || relFile === "src/app/globals.css";
  const lines = stripped.split("\n");

  for (let idx = 0; idx < lines.length; idx += 1) {
    const line = lines[idx]!;
    const lineNo = idx + 1;
    if (!isColorExempt && RAW_COLOR_RE.test(line)) {
      violations.push({
        rule: "UI-02",
        file: relFile,
        line: lineNo,
        message: `Raw color literal in CSS; use a semantic variable from tokens.css`,
        snippet: line.trim(),
      });
    }
    if (!isTokensFile) {
      const fontMatch = /font-size\s*:\s*([^;}]+)/i.exec(line);
      if (fontMatch) {
        const val = fontMatch[1]!.trim();
        if (!val.includes("var(--text-") && val !== "inherit" && val !== "100%") {
          violations.push({
            rule: "UI-02",
            file: relFile,
            line: lineNo,
            message: `Non-token font-size "${val}"; use var(--text-2xs..xl)`,
          });
        }
      }
    }
    if (line.includes("@media")) {
      const bpRegex = /(?:max|min)-width\s*:\s*(\d+(?:\.\d+)?px)/gi;
      let match: RegExpExecArray | null;
      while ((match = bpRegex.exec(line)) !== null) {
        const bp = match[1]!;
        if (!ALLOWED_BREAKPOINTS.has(bp)) {
          violations.push({
            rule: "UI-02",
            file: relFile,
            line: lineNo,
            message: `Non-standard @media breakpoint "${bp}"; allowed: 640px, 900px, 1200px`,
          });
        }
      }
    }
  }
  return violations;
}

export function extractCssRuleHeaders(
  stripped: string,
): Array<{ selectorText: string; line: number }> {
  const headers: Array<{ selectorText: string; line: number }> = [];
  let tokenStart = 0;
  let inKeyframes = false;
  let keyframesDepth = 0;
  let depth = 0;

  for (let i = 0; i < stripped.length; i += 1) {
    const ch = stripped[i];
    if (ch === "{") {
      const rawHeader = stripped.slice(tokenStart, i).trim();
      const headerLine = lineAtOffset(
        stripped,
        tokenStart + (stripped.slice(tokenStart, i).search(/\S/) || 0),
      );
      depth += 1;
      if (/^@(?:-webkit-)?keyframes\b/i.test(rawHeader)) {
        inKeyframes = true;
        keyframesDepth = depth;
      } else if (!inKeyframes && !rawHeader.startsWith("@") && rawHeader.length > 0) {
        headers.push({ selectorText: rawHeader, line: headerLine });
      }
      tokenStart = i + 1;
    } else if (ch === "}") {
      if (inKeyframes && depth === keyframesDepth) {
        inKeyframes = false;
      }
      depth = Math.max(0, depth - 1);
      tokenStart = i + 1;
    } else if (ch === ";" && depth === 0) {
      tokenStart = i + 1;
    }
  }
  return headers;
}

function splitTopLevel(input: string, sepCheck: (ch: string) => boolean): string[] {
  const parts: string[] = [];
  let paren = 0;
  let bracket = 0;
  let current = "";
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i]!;
    if (ch === "(") paren += 1;
    else if (ch === ")") paren = Math.max(0, paren - 1);
    else if (ch === "[") bracket += 1;
    else if (ch === "]") bracket = Math.max(0, bracket - 1);

    if (paren === 0 && bracket === 0 && sepCheck(ch)) {
      if (current.trim().length > 0) parts.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim().length > 0) parts.push(current.trim());
  return parts;
}

export interface CssSelectorScanResult {
  violations: UiViolation[];
  leadingClasses: Map<string, number>;
  standaloneClasses: Map<string, number>;
  referencedClasses: Map<string, number>;
}

function recordBranchClasses(
  segments: readonly string[],
  line: number,
  leadingClasses: Map<string, number>,
  standaloneClasses: Map<string, number>,
  referencedClasses: Map<string, number>,
): void {
  const firstSeg = segments[0]!;
  const clsMatch = /^\.([a-zA-Z0-9_-]+)/.exec(firstSeg);
  if (clsMatch && !leadingClasses.has(clsMatch[1]!)) {
    leadingClasses.set(clsMatch[1]!, line);
  }
  if (segments.length === 1) {
    const baseOnly = firstSeg.replace(/:[a-zA-Z0-9_-]+(?:\([^)]*\))?|\[[^\]]*\]/g, "");
    const singleMatch = /^\.([a-zA-Z0-9_-]+)$/.exec(baseOnly);
    if (singleMatch && !standaloneClasses.has(singleMatch[1]!)) {
      standaloneClasses.set(singleMatch[1]!, line);
    }
  }
  for (const seg of segments) {
    const cleaned = seg.replace(/:not\([^)]*\)/g, "");
    const re = /\.([a-zA-Z0-9_-]+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(cleaned)) !== null) {
      if (!referencedClasses.has(m[1]!)) referencedClasses.set(m[1]!, line);
    }
  }
}

function checkSelectorBranch(
  relFile: string,
  branch: string,
  line: number,
  res: CssSelectorScanResult,
): void {
  if (/:not\([^)]+\)[^,>+~\s]*:not\(/.test(branch)) {
    res.violations.push({
      rule: "UI-03c",
      file: relFile,
      line,
      message: `Chained :not(...):not(...) selector is fragile: "${branch}"`,
    });
  }
  const segments = splitTopLevel(branch, (ch) => /\s|>|\+|~/.test(ch));
  if (segments.length === 0) return;
  const firstSeg = segments[0]!;
  if (!firstSeg.startsWith(".")) {
    res.violations.push({
      rule: "UI-03a",
      file: relFile,
      line,
      message: `Selector "${branch}" must start with a scoped .className (found "${firstSeg}")`,
    });
  } else {
    recordBranchClasses(
      segments,
      line,
      res.leadingClasses,
      res.standaloneClasses,
      res.referencedClasses,
    );
  }
  const lastSeg = segments[segments.length - 1]!;
  const withoutNot = lastSeg.replace(/:not\([^)]*\)/g, "");
  if (withoutNot.includes(".")) return;
  const tag = /^([a-zA-Z][a-zA-Z0-9-]*)/.exec(withoutNot)?.[1]?.toLowerCase();
  if (!tag || !FORBIDDEN_BARE_TARGET_TAGS.has(tag)) return;
  const prevSeg = segments.length >= 2 ? segments[segments.length - 2]! : "";
  const isCheckboxInputExempt =
    tag === "input" && (prevSeg.includes(".ui-check-row") || prevSeg.includes(".menu-row"));
  if (!isCheckboxInputExempt) {
    res.violations.push({
      rule: "UI-03b",
      file: relFile,
      line,
      message: `Bare interactive tag "${tag}" in selector "${branch}"; use an explicit class (.ui-btn, .ui-input, .ui-label)`,
    });
  }
}

export function checkCssSelectors(relFile: string, stripped: string): CssSelectorScanResult {
  const res: CssSelectorScanResult = {
    violations: [],
    leadingClasses: new Map(),
    standaloneClasses: new Map(),
    referencedClasses: new Map(),
  };
  if (relFile === "src/app/tokens.css" || relFile === "src/app/globals.css") {
    return res;
  }
  for (const { selectorText, line } of extractCssRuleHeaders(stripped)) {
    for (const branch of splitTopLevel(selectorText, (ch) => ch === ",")) {
      checkSelectorBranch(relFile, branch, line, res);
    }
  }
  return res;
}

function checkFileCssVariables(
  relFile: string,
  stripped: string,
  definedVars: ReadonlySet<string>,
  globalTokenVars: ReadonlySet<string>,
  violations: UiViolation[],
): void {
  const lines = stripped.split("\n");
  for (let idx = 0; idx < lines.length; idx += 1) {
    const lineText = lines[idx]!;
    const varRegex = /var\(\s*(--[a-zA-Z0-9_-]+)\s*(?:,\s*([^)]+))?\)/g;
    let match: RegExpExecArray | null;
    while ((match = varRegex.exec(lineText)) !== null) {
      const varName = match[1]!;
      const fallback = match[2]?.trim();
      if (!definedVars.has(varName)) {
        violations.push({
          rule: "UI-04c",
          file: relFile,
          line: idx + 1,
          message: `Undefined CSS variable "${varName}"`,
        });
      } else if (fallback !== undefined && globalTokenVars.has(varName)) {
        violations.push({
          rule: "UI-04c",
          file: relFile,
          line: idx + 1,
          message: `Global token "${varName}" must not include a literal fallback "${fallback}"`,
        });
      }
    }
  }
}

export interface EnforcedCssRecord {
  relFile: string;
  stripped: string;
  leadingClasses: Map<string, number>;
  standaloneClasses?: Map<string, number>;
  referencedClasses?: Map<string, number>;
}

export interface EnforcedTsxRecord {
  relFile: string;
  usedClasses: Map<string, number>;
}

function checkStandaloneClassLeaks(
  enforcedCssFiles: ReadonlyArray<EnforcedCssRecord>,
  enforcedTsxFiles: ReadonlyArray<EnforcedTsxRecord>,
  violations: UiViolation[],
): void {
  const standaloneOwners = new Map<string, { dir: string; file: string; line: number }>();
  for (const item of enforcedCssFiles) {
    const dir = dirname(item.relFile);
    if (dir.startsWith("src/app/components")) continue;
    for (const [cls, line] of (item.standaloneClasses ?? new Map()).entries()) {
      if (cls.startsWith("ui-")) continue;
      if (!standaloneOwners.has(cls)) {
        standaloneOwners.set(cls, { dir, file: item.relFile, line });
      }
    }
  }
  for (const item of enforcedCssFiles) {
    const dir = dirname(item.relFile);
    for (const [cls, line] of (item.referencedClasses ?? new Map()).entries()) {
      const owner = standaloneOwners.get(cls);
      if (owner && owner.dir !== dir) {
        violations.push({
          rule: "UI-04b",
          file: item.relFile,
          line,
          message: `Standalone class ".${cls}" defined in ${owner.file}:${owner.line} leaked across directory (${dir})`,
        });
      }
    }
  }
  for (const tsx of enforcedTsxFiles) {
    const dir = dirname(tsx.relFile);
    for (const [cls, line] of tsx.usedClasses.entries()) {
      const owner = standaloneOwners.get(cls);
      if (owner && owner.dir !== dir) {
        violations.push({
          rule: "UI-04b",
          file: tsx.relFile,
          line,
          message: `Standalone class ".${cls}" defined in ${owner.file}:${owner.line} referenced in ${tsx.relFile}`,
        });
      }
    }
  }
}

export function checkCssVariablesAndOwnership(
  enforcedCssFiles: ReadonlyArray<EnforcedCssRecord>,
  definedVars: ReadonlySet<string>,
  globalTokenVars: ReadonlySet<string>,
  enforcedTsxFiles: ReadonlyArray<EnforcedTsxRecord> = [],
): UiViolation[] {
  const violations: UiViolation[] = [];
  const classOwners = new Map<string, { dir: string; file: string; line: number }>();

  for (const { relFile, stripped, leadingClasses } of enforcedCssFiles) {
    const dir = dirname(relFile);
    for (const [cls, line] of leadingClasses.entries()) {
      if (cls.startsWith("ui-")) continue;
      const existing = classOwners.get(cls);
      if (existing && existing.dir !== dir) {
        violations.push({
          rule: "UI-04a",
          file: relFile,
          line,
          message: `Leading class ".${cls}" collides with ${existing.file}:${existing.line} (${existing.dir})`,
        });
      } else if (!existing) {
        classOwners.set(cls, { dir, file: relFile, line });
      }
    }
    checkFileCssVariables(relFile, stripped, definedVars, globalTokenVars, violations);
  }
  checkStandaloneClassLeaks(enforcedCssFiles, enforcedTsxFiles, violations);
  return violations;
}

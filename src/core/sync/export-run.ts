/**
 * 轮次导出与脱敏处理（export-run）。
 *
 * 构造 PublicRunRecord：
 * 1. rawFile 恒为 null，用量缺失时从同名 .txt 转录解析回填；
 * 2. 规范化旧版记录（顶层 promptId/promptText）；
 * 3. 扫描并脱敏 SVG 作品（命中则 svgFile 置 null，记录 redaction）；
 * 4. 替换 run.json 文本中的本机绝对路径为 ~ 形式；
 * 5. 扫描 run.json，若命中凭据/私钥/路径规则则整轮拒绝发布。
 */

import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  DATA_REPO_SCHEMA_VERSION,
  dayPartition,
  type PublicAttempt,
  type PublicRunRecord,
  type Redaction,
  UNPUBLISHABLE_PROMPT_IDS,
} from "../data-repo/contract";
import type { LeakGuard } from "../leak-guard";
import { runDir } from "../paths";
import { usageFromTranscript } from "../../pricing/usage";
import type { Attempt, RunRecord } from "../types";
import { sanitizeLocalPaths, scanText, type LeakReason } from "./leak-scan";

export type ExportStatus = "ready" | "skipped" | "rejected";

export interface SvgExportItem {
  filename: string;
  content: string;
}

export interface ReadyExportResult {
  status: "ready";
  runId: string;
  publicRecord: PublicRunRecord;
  jsonText: string;
  svgFiles: SvgExportItem[];
  redactions: Redaction[];
}

export interface SkippedExportResult {
  status: "skipped";
  runId: string;
  reason: "incomplete" | "invalid-run-id" | "unpublishable-prompt" | "empty";
}

export interface RejectedExportResult {
  status: "rejected";
  runId: string;
  reasons: Array<{ file: string; reason: LeakReason }>;
}

export type ExportRunResult =
  | ReadyExportResult
  | SkippedExportResult
  | RejectedExportResult;

export interface ExportOptions {
  runsDir?: string;
  leakGuard?: LeakGuard;
}

interface LegacyRunRecord
  extends Omit<RunRecord, "prompts" | "attempts" | "inProgress"> {
  prompts?: RunRecord["prompts"];
  inProgress?: boolean;
  promptId?: string;
  promptText?: string;
  attempts: Array<
    Omit<Attempt, "promptId" | "appliedEffort" | "effortHonored"> &
      Partial<Pick<Attempt, "promptId" | "appliedEffort" | "effortHonored">>
  >;
}

/** 规范化旧版 RunRecord，复用与 store.ts 一致的口径 */
export function normalizeLegacyRun(raw: LegacyRunRecord): RunRecord {
  const legacyPromptId = raw.promptId ?? "classic-v1";
  const prompts =
    raw.prompts ??
    [{ promptId: legacyPromptId, text: raw.promptText ?? "", bindings: {} }];

  const attempts: Attempt[] = raw.attempts.map((attempt) => ({
    ...attempt,
    promptId: attempt.promptId ?? legacyPromptId,
    appliedEffort: attempt.appliedEffort ?? attempt.effort,
    effortHonored: attempt.effortHonored ?? true,
  }));

  const { promptId: _pId, promptText: _pText, ...rest } = raw;
  return { ...rest, prompts, attempts, inProgress: raw.inProgress ?? false };
}

/**
 * 剔除永不发布的题目（题面与调用一并去掉）；不剩任何题目时返回 null，整轮不发布。
 */
export function withoutUnpublishablePrompts(run: RunRecord): RunRecord | null {
  const blocked = new Set(UNPUBLISHABLE_PROMPT_IDS);
  const prompts = run.prompts.filter((prompt) => !blocked.has(prompt.promptId));
  const attempts = run.attempts.filter((attempt) => !blocked.has(attempt.promptId));
  if (prompts.length === 0) return null;
  return { ...run, prompts, attempts };
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * 尝试从同名 .txt 转录回填用量。
 */
async function resolveUsage(
  dir: string,
  attempt: Attempt,
): Promise<PublicAttempt["usage"]> {
  if (attempt.usage !== undefined) return attempt.usage;

  const candidates: string[] = [];
  if (attempt.rawFile !== null) candidates.push(attempt.rawFile);
  if (attempt.svgFile !== null && attempt.svgFile.endsWith(".svg")) {
    candidates.push(attempt.svgFile.slice(0, -4) + ".txt");
  }
  candidates.push(`${attempt.targetId}__${attempt.promptId}.txt`);
  candidates.push(`${attempt.targetId}.txt`);

  for (const filename of candidates) {
    const fullPath = join(dir, filename);
    if (await fileExists(fullPath)) {
      try {
        const text = await readFile(fullPath, "utf8");
        const usage = usageFromTranscript(attempt.cli, text);
        if (usage !== null) return usage;
      } catch {
        // 读取或解析失败，继续尝试下一个候选
      }
    }
  }
  return null;
}

/**
 * 导出单个运行轮次。
 */
/** 读取并校验运行轮次，若未完成或包含禁用提示词则返回跳过原因 */
async function loadRunRecord(
  runId: string,
  options: ExportOptions,
): Promise<{ dir: string; run: RunRecord } | SkippedExportResult> {
  if (dayPartition(runId) === null) {
    return { status: "skipped", runId, reason: "invalid-run-id" };
  }

  const dir = options.runsDir ? join(options.runsDir, runId) : runDir(runId);
  const runFile = join(dir, "run.json");

  let parsed: LegacyRunRecord;
  try {
    const rawJson = await readFile(runFile, "utf8");
    parsed = JSON.parse(rawJson) as LegacyRunRecord;
  } catch {
    return { status: "skipped", runId, reason: "incomplete" };
  }

  const localRun = normalizeLegacyRun(parsed);
  if (localRun.inProgress) {
    return { status: "skipped", runId, reason: "incomplete" };
  }
  // 一次调用都没完成的轮次（如刚开始就被取消）没有可发布的内容
  if (localRun.attempts.length === 0) {
    return { status: "skipped", runId, reason: "empty" };
  }
  const run = withoutUnpublishablePrompts(localRun);
  if (run === null) {
    return { status: "skipped", runId, reason: "unpublishable-prompt" };
  }

  return { dir, run };
}

/** 扫描并处理单项 attempt 的 SVG 文件，命中泄漏则生成 redaction 并置空文件名 */
async function processAttemptSvg(
  dir: string,
  svgFile: string | null,
  leakGuard?: LeakGuard,
): Promise<{
  finalSvgFile: string | null;
  svgItem: SvgExportItem | null;
  redaction: Redaction | null;
}> {
  if (svgFile === null) {
    return { finalSvgFile: null, svgItem: null, redaction: null };
  }

  const svgPath = join(dir, svgFile);
  if (!(await fileExists(svgPath))) {
    return { finalSvgFile: null, svgItem: null, redaction: null };
  }

  try {
    const svgContent = await readFile(svgPath, "utf8");
    const scan = scanText(svgContent, leakGuard);
    if (scan.leaked) {
      return {
        finalSvgFile: null,
        svgItem: null,
        redaction: { file: svgFile, reason: scan.reason },
      };
    }
    return {
      finalSvgFile: svgFile,
      svgItem: { filename: svgFile, content: svgContent },
      redaction: null,
    };
  } catch {
    return { finalSvgFile: null, svgItem: null, redaction: null };
  }
}

/** 批量处理 attempt 列表：回填用量、脱敏 SVG 与构建 PublicAttempt */
async function processAttempts(
  dir: string,
  attempts: readonly Attempt[],
  leakGuard?: LeakGuard,
): Promise<{
  publicAttempts: PublicAttempt[];
  svgFiles: SvgExportItem[];
  redactions: Redaction[];
}> {
  const redactions: Redaction[] = [];
  const svgFiles: SvgExportItem[] = [];
  const publicAttempts: PublicAttempt[] = [];

  for (const attempt of attempts) {
    const usage = await resolveUsage(dir, attempt);
    const { finalSvgFile, svgItem, redaction } = await processAttemptSvg(
      dir,
      attempt.svgFile,
      leakGuard,
    );

    if (redaction !== null) redactions.push(redaction);
    if (svgItem !== null) svgFiles.push(svgItem);

    const { rawFile: _rawFile, ...restAttempt } = attempt;
    publicAttempts.push({
      ...restAttempt,
      rawFile: null,
      svgFile: finalSvgFile,
      usage,
    });
  }

  return { publicAttempts, svgFiles, redactions };
}

/** 构建 PublicRunRecord，执行文本脱敏与整轮泄漏检查 */
function buildAndScanRecord(
  run: RunRecord,
  publicAttempts: PublicAttempt[],
  redactions: Redaction[],
  leakGuard?: LeakGuard,
): { publicRecord: PublicRunRecord; jsonText: string; leakReason: LeakReason | null } {
  const { attempts: _attempts, inProgress: _inProg, ...runRest } = run;
  const publicRecord: PublicRunRecord = {
    ...runRest,
    publicSchemaVersion: DATA_REPO_SCHEMA_VERSION,
    inProgress: false,
    attempts: publicAttempts,
    redactions,
  };

  const jsonText = `${JSON.stringify(publicRecord, null, 2)}\n`;
  const sanitizedJson = sanitizeLocalPaths(jsonText);
  const jsonScan = scanText(sanitizedJson, leakGuard);

  if (jsonScan.leaked) {
    return { publicRecord, jsonText: sanitizedJson, leakReason: jsonScan.reason };
  }

  const finalRecord =
    sanitizedJson === jsonText
      ? publicRecord
      : (JSON.parse(sanitizedJson) as PublicRunRecord);

  return { publicRecord: finalRecord, jsonText: sanitizedJson, leakReason: null };
}

/**
 * 导出单个运行轮次。
 */
export async function exportRun(
  runId: string,
  options: ExportOptions = {},
): Promise<ExportRunResult> {
  const loaded = await loadRunRecord(runId, options);
  if ("status" in loaded) {
    return loaded;
  }

  const { dir, run } = loaded;
  const { publicAttempts, svgFiles, redactions } = await processAttempts(
    dir,
    run.attempts,
    options.leakGuard,
  );

  const { publicRecord, jsonText, leakReason } = buildAndScanRecord(
    run,
    publicAttempts,
    redactions,
    options.leakGuard,
  );

  if (leakReason !== null) {
    return {
      status: "rejected",
      runId,
      reasons: [{ file: "run.json", reason: leakReason }],
    };
  }

  return {
    status: "ready",
    runId,
    publicRecord,
    jsonText,
    svgFiles,
    redactions,
  };
}


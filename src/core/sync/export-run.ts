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
  type PublicProfile,
  type PublicRunRecord,
  type Redaction,
  UNPUBLISHABLE_PROMPT_IDS,
} from "../data-repo/contract";
import type { LeakGuard } from "../leak-guard";
import { runDir } from "../paths";
import type { ProfileView } from "../profile-view";
import { usageFromTranscript } from "../../pricing/usage";
import type { Attempt, RunRecord } from "../types";
import { withSelectedAttempts } from "./attempt-selection";
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
  /** 未导出的 profile 调用数（其 profile 不在导出时的配置里），见 withoutUnregisteredProfileAttempts */
  withheldProfileAttempts: number;
  /** 本次按子集导出时的子集（attemptKey，原样来自选择），供台账沿用；整轮导出时缺省 */
  attemptKeys?: string[];
}

export interface SkippedExportResult {
  status: "skipped";
  runId: string;
  /** no-selected-attempts：给了子集但一个都对不上本轮的调用，不记台账 */
  reason: "incomplete" | "invalid-run-id" | "unpublishable-prompt" | "empty" | "no-selected-attempts";
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
  /** 导出时配置里登记的 profile 公开视图；调用的 profile 不在其中则扣下不发布。缺省为空 */
  profiles?: readonly ProfileView[];
  /** 允许发布的题目 id；缺省或 null 为全部 */
  publishPrompts?: readonly string[] | null;
  /** 按轮次给出的导出子集（attemptKey）；没有这一轮的条目即整轮 */
  attemptSelection?: Readonly<Record<string, readonly string[]>>;
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
 * 剔除永不发布的题目与不在白名单里的题目（题面与调用一并去掉）；不剩任何题目时返回 null，整轮不发布。
 * publishPrompts 缺省或 null 表示全部题目都允许。
 */
export function withoutUnpublishablePrompts(
  run: RunRecord,
  publishPrompts: readonly string[] | null = null,
): RunRecord | null {
  const blocked = new Set(UNPUBLISHABLE_PROMPT_IDS);
  const allowed = publishPrompts === null ? null : new Set(publishPrompts);
  const publishable = (promptId: string): boolean =>
    !blocked.has(promptId) && (allowed === null || allowed.has(promptId));
  const prompts = run.prompts.filter((prompt) => publishable(prompt.promptId));
  const attempts = run.attempts.filter((attempt) => publishable(attempt.promptId));
  if (prompts.length === 0) return null;
  return { ...run, prompts, attempts };
}

/**
 * 剔除 profile 不在导出时配置里的调用：没有它的公开视图，记录里就描述不了这条结果，
 * 去掉字段导出又会把第三方上游的结果冒充登录态。登录态与已登记 profile 的调用保留。
 */
export function withoutUnregisteredProfileAttempts(
  run: RunRecord,
  registered: ReadonlySet<string>,
): { run: RunRecord; withheld: number } {
  const attempts = run.attempts.filter(
    (attempt) => attempt.profile === undefined || registered.has(attempt.profile),
  );
  return { run: { ...run, attempts }, withheld: run.attempts.length - attempts.length };
}

/** 本轮调用用到的 profile 公开视图，按配置顺序、去掉官网；没有则为空 */
export function profilesUsedBy(run: RunRecord, views: readonly ProfileView[]): PublicProfile[] {
  const used = new Set(run.attempts.map((attempt) => attempt.profile));
  return views.filter((view) => used.has(view.name)).map(toPublicProfile);
}

function toPublicProfile({ website: _website, ...view }: ProfileView): PublicProfile {
  return view;
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
): Promise<{ dir: string; run: RunRecord; withheldProfileAttempts: number } | SkippedExportResult> {
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
  const picked = options.attemptSelection?.[runId];
  const selected = withSelectedAttempts(localRun, picked === undefined ? null : new Set(picked));
  if (selected === null) {
    return { status: "skipped", runId, reason: "no-selected-attempts" };
  }
  const publishable = withoutUnpublishablePrompts(selected, options.publishPrompts ?? null);
  if (publishable === null) {
    return { status: "skipped", runId, reason: "unpublishable-prompt" };
  }
  // 调用全被扣下的轮次没有可发布的内容，与空轮次同样处理
  const registered = new Set((options.profiles ?? []).map((view) => view.name));
  const { run, withheld } = withoutUnregisteredProfileAttempts(publishable, registered);
  if (run.attempts.length === 0) {
    return { status: "skipped", runId, reason: "empty" };
  }

  return { dir, run, withheldProfileAttempts: withheld };
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

/**
 * 构建 PublicRunRecord，执行文本脱敏与整轮泄漏检查。
 * `profiles` 只在本轮用到 profile 时写入：只有登录态的记录与引入 profile 之前逐字相同，
 * 已导出的轮次重新评估时才不会被判为内容冲突。
 */
function buildAndScanRecord(
  run: RunRecord,
  publicAttempts: PublicAttempt[],
  redactions: Redaction[],
  options: ExportOptions,
): { publicRecord: PublicRunRecord; jsonText: string; leakReason: LeakReason | null } {
  const { attempts: _attempts, inProgress: _inProg, ...runRest } = run;
  const profiles = profilesUsedBy(run, options.profiles ?? []);
  const publicRecord: PublicRunRecord = {
    ...runRest,
    publicSchemaVersion: DATA_REPO_SCHEMA_VERSION,
    inProgress: false,
    attempts: publicAttempts,
    redactions,
    ...(profiles.length > 0 ? { profiles } : {}),
  };
  const leakGuard = options.leakGuard;

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

  const { dir, run, withheldProfileAttempts } = loaded;
  const picked = options.attemptSelection?.[runId];
  const { publicAttempts, svgFiles, redactions } = await processAttempts(
    dir,
    run.attempts,
    options.leakGuard,
  );

  const { publicRecord, jsonText, leakReason } = buildAndScanRecord(
    run,
    publicAttempts,
    redactions,
    options,
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
    withheldProfileAttempts,
    ...(picked === undefined ? {} : { attemptKeys: [...new Set(picked)].sort() }),
  };
}


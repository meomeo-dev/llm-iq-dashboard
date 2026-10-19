#!/usr/bin/env tsx
/**
 * 对本地 data/runs 里有评分标准的作品跑静态评审并落盘 .judge.json。
 *
 * 选项：
 *   --dry-run            只打印，不写文件
 *   --limit <n>          最多评 n 幅
 *   --run, --only <text> 只评 runId 或 attemptKey 含 text 的作品
 *   --verbose            逐条打印闸门与标准的理由
 *   --no-render          只出静态分，不启动浏览器
 *   --ai                 代码层之后再跑 AI 层（读配置 judge.ai，真实调用裁判 CLI、消耗配额）
 *   --ai-only            不重跑代码层，只对已有的「待复核」记录跑 AI 层
 *   -y, --yes            跳过 --ai / --ai-only 的交互式 [y/N] 确认
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  canonicalizeFlag,
  confirmOrAbort,
  consumeFlagValue,
  expandEqualsTokens,
  extractGlobalPathFlags,
  formatCliError,
  hasHelpFlag,
  normalizeMultiValueFlag,
  stripPnpmSeparators,
} from "../src/bin/cli-args";
import { loadConfig, type AppConfig } from "../src/core/config";
import { aiEligible, carryAiResults, judgeWithAi } from "../src/core/judge/ai-judge";
import { closeJudgeBrowser } from "../src/core/judge/browser";
import { judgeArtifact } from "../src/core/judge/judge-attempt";
import { attemptKeyOf, loadJudgement, saveJudgement } from "../src/core/judge/judge-store";
import { rubricFor, type Judgement } from "../src/core/judge/schema";
import { judgeStatic } from "../src/core/judge/static-judge";
import { configPath, runDir, runsRoot } from "../src/core/paths";
import type { RunRecord } from "../src/core/types";
import { judgeCostOf } from "../src/pricing/judge-cost";

const VALID_JUDGE_FLAGS: readonly string[] = [
  "--dry-run",
  "--limit",
  "--only",
  "--run",
  "--runs",
  "--verbose",
  "--no-render",
  "--ai",
  "--ai-only",
  "--yes",
  "-y",
  "--config",
  "-c",
  "--data-dir",
  "--help",
  "-h",
];

export interface JudgeBackfillOptions {
  dryRun: boolean;
  limit: number;
  only: string | null;
  onlyList?: string[];
  verbose: boolean;
  render: boolean;
  ai: "off" | "after" | "only";
  yes: boolean;
}

export function formatJudgeBackfillHelp(): string {
  return [
    "用法: pnpm judge:backfill [-- <options>]",
    "别名: pnpm pelican judge [options]",
    "",
    "说明:",
    "  对本地 data/runs 中有评分标准的作品执行静态/渲染层或 AI 裁判回填。",
    "",
    "选项:",
    "  --dry-run               仅运行静态层预演并打印结果，不写文件、不调 AI 裁判",
    "  --run, --only <text>    仅评审 runId 或 attemptKey 匹配 text 的作品（别名: --runs）",
    "  --limit <n>             最多评审 n 幅作品",
    "  --no-render             跳过 Chromium 渲染层，仅计算静态分",
    "  --verbose               打印每条闸门（G1-G5）与评分标准（C1-C9）明细",
    "  --ai                    代码层完成后继续调用 AI 裁判（真实消耗配额，需确认或传 --yes）",
    "  --ai-only               仅对已有「待复核」记录调用 AI 裁判（需确认或传 --yes）",
    "  -y, --yes               跳过 --ai / --ai-only 的交互式 [y/N] 确认",
    "  -c, --config <path>     覆盖配置文件路径（同 PELICAN_CONFIG）",
    "  --data-dir <path>       覆盖数据目录路径（同 PELICAN_DATA_DIR）",
    "  -h, --help              显示此帮助信息并退出",
    "",
    "示例:",
    "  pnpm pelican judge --dry-run --limit 10",
    "  pnpm judge:backfill -- --run 20261019T000000Z --ai-only --yes",
  ].join("\n");
}

export function parseJudgeBackfillOptions(args: readonly string[]): JudgeBackfillOptions {
  const tokens = expandEqualsTokens(stripPnpmSeparators(extractGlobalPathFlags(args)));
  const opts: JudgeBackfillOptions = {
    dryRun: false,
    limit: Number.POSITIVE_INFINITY,
    only: null,
    verbose: false,
    render: true,
    ai: "off",
    yes: false,
  };
  for (let i = 0; i < tokens.length; i += 1) {
    const arg = tokens[i]!;
    if (i === 0 && arg === "backfill") continue;
    const canonical = canonicalizeFlag(arg);
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--verbose") opts.verbose = true;
    else if (arg === "--no-render") opts.render = false;
    else if (arg === "--ai") opts.ai = "after";
    else if (arg === "--ai-only") opts.ai = "only";
    else if (canonical === "--yes") opts.yes = true;
    else if (arg === "--limit") {
      const raw = consumeFlagValue(tokens, i, "--limit");
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 0) throw new Error(`--limit 必须为非负整数，收到：${raw}`);
      opts.limit = n;
      i += 1;
    } else if (canonical === "--run") {
      const val = consumeFlagValue(tokens, i, arg);
      opts.onlyList = normalizeMultiValueFlag(opts.onlyList, val, arg);
      opts.only = opts.onlyList[0] ?? null;
      i += 1;
    } else {
      throw new Error(formatCliError(arg, VALID_JUDGE_FLAGS, "pnpm judge:backfill -- --help"));
    }
  }
  return opts;
}

async function loadRun(runId: string): Promise<RunRecord | null> {
  try {
    return JSON.parse(await readFile(join(runDir(runId), "run.json"), "utf8")) as RunRecord;
  } catch {
    return null;
  }
}

function layerSummary(judgement: Judgement): string {
  const layers: { label: string; sources: string[] }[] = [
    { label: "代码层", sources: ["static", "render"] },
    { label: "AI 层", sources: ["ai"] },
  ];
  return layers.map(({ label, sources }) => {
    const items = judgement.criteria.filter((c) => sources.includes(c.source));
    const max = items.reduce((sum, c) => sum + c.maxScore, 0);
    const pending = items.some((c) => c.score === null);
    const score = items.reduce((sum, c) => sum + (c.score ?? 0), 0);
    return `${label} ${pending ? "-" : score}/${max}`;
  }).join("，");
}

function printJudgement(judgement: Judgement, verbose: boolean, writeLine: (line: string) => void): void {
  const { subject, total } = judgement;
  const judgeCost = judgeCostOf(judgement);
  const costNote = judgeCost === null ? "" : `，裁判 ${judgeCost.asks} 次问答 ${judgeCost.cost.usd === null ? "未计价" : `$${judgeCost.cost.usd.toFixed(4)}`}`;
  writeLine(`${subject.runId}/${subject.attemptKey}  ${String(total.score).padStart(3)}  ${total.verdict}  ${layerSummary(judgement)}${costNote}`);
  if (!verbose) return;
  for (const gate of judgement.gates) writeLine(`    ${gate.id} ${gate.passed ? "✓" : "✗"} ${gate.title}：${gate.evidence}`);
  for (const c of judgement.criteria) {
    const score = c.score === null ? "  -" : String(c.score).padStart(3);
    writeLine(`    ${c.id} ${score}/${String(c.maxScore).padStart(2)} ${c.title}：${c.reason ?? "待 AI 层判定"}`);
  }
}

function loadAiConfig(): AppConfig["judge"]["ai"] {
  const config = loadConfig(configPath());
  if (!config.judge.ai.enabled) throw new Error("配置里 judge.ai 未开启或没有裁判，--ai 无法执行");
  return config.judge.ai;
}

interface PendingAiTask {
  judgement: Judgement;
  attemptKey: string;
  promptText: string;
}

function matchesOnlyFilter(targetKey: string, opts: JudgeBackfillOptions): boolean {
  const patterns = opts.onlyList?.length ? opts.onlyList : opts.only ? [opts.only] : [];
  if (patterns.length === 0) return true;
  return patterns.some((p) => targetKey.includes(p));
}

async function evaluateCodeStage(
  run: RunRecord,
  attempt: RunRecord["attempts"][number],
  opts: JudgeBackfillOptions,
  writeLine: (line: string) => void,
): Promise<{ done?: Judgement; pendingAi?: PendingAiTask } | null> {
  const rubric = rubricFor(attempt.promptId);
  if (!rubric || attempt.status !== "ok" || !attempt.svgFile) return null;
  const attemptKey = attemptKeyOf(attempt.svgFile);
  if (!matchesOnlyFilter(`${run.runId}/${attemptKey}`, opts)) return null;
  const source = await readFile(join(runDir(run.runId), attempt.svgFile), "utf8");
  const subject = {
    runId: run.runId,
    attemptKey,
    promptId: attempt.promptId,
    cli: attempt.cli,
    model: attempt.model,
    effort: attempt.effort,
    svgFile: attempt.svgFile,
  };
  const existing = opts.ai === "only" || opts.dryRun ? null : await loadJudgement(run.runId, attemptKey);
  const fresh = opts.ai === "only"
    ? null
    : opts.dryRun
      ? judgeStatic({ source, rubric, subject })
      : await judgeArtifact({ subject, source, render: opts.render, log: (line) => { if (opts.verbose) writeLine(`    ${line}`); } });
  const codeLayer = fresh === null ? null : carryAiResults(fresh, existing);
  if (codeLayer && codeLayer !== fresh) await saveJudgement(codeLayer);
  if (opts.ai === "off" || opts.dryRun) {
    return codeLayer ? { done: codeLayer } : null;
  }
  const candidate = codeLayer ?? (await loadJudgement(run.runId, attemptKey));
  if (!candidate) return null;
  const blocked = aiEligible(candidate);
  if (blocked) {
    if (opts.verbose) writeLine(`    [judge-ai] ${attemptKey} 跳过：${blocked}`);
    return { done: candidate };
  }
  const promptText = run.prompts.find((p) => p.promptId === attempt.promptId)?.text ?? "";
  return { pendingAi: { judgement: candidate, attemptKey, promptText } };
}

async function collectBackfillStage(
  runIds: readonly string[],
  opts: JudgeBackfillOptions,
  writeLine: (line: string) => void,
): Promise<{ judged: number; toCallAi: PendingAiTask[] }> {
  let count = 0;
  let judged = 0;
  const toCallAi: PendingAiTask[] = [];
  for (const runId of runIds) {
    if (count >= opts.limit) break;
    const run = await loadRun(runId);
    if (!run) continue;
    for (const attempt of run.attempts) {
      if (count >= opts.limit) break;
      const stage = await evaluateCodeStage(run, attempt, opts, writeLine);
      if (!stage) continue;
      count += 1;
      if (stage.done) {
        printJudgement(stage.done, opts.verbose, writeLine);
        judged += 1;
      } else if (stage.pendingAi) {
        toCallAi.push(stage.pendingAi);
      }
    }
  }
  return { judged, toCallAi };
}

export async function runJudgeBackfillCli(
  argv: readonly string[] = process.argv.slice(2),
  writeLine: (line: string) => void = console.log,
  customConfirm?: (prompt: string) => Promise<boolean>,
): Promise<void> {
  if (argv.length >= 0) {
    throw new Error("历史作品评审回填命令（judge:backfill）已停用");
  }
  if (hasHelpFlag(stripPnpmSeparators(argv))) {
    writeLine(formatJudgeBackfillHelp());
    return;
  }
  const opts = parseJudgeBackfillOptions(argv);
  const ai = opts.ai === "off" || opts.dryRun ? null : loadAiConfig();

  let runIds: string[] = [];
  try {
    runIds = (await readdir(runsRoot())).filter((name) => /^[0-9]{8}T[0-9]{6}Z$/.test(name)).sort().reverse();
  } catch {
    runIds = [];
  }
  const { judged: baseJudged, toCallAi } = await collectBackfillStage(runIds, opts, writeLine);
  let judged = baseJudged;

  if (ai !== null && toCallAi.length > 0) {
    const confirmed = await confirmOrAbort(
      `确认调用 AI 裁判复核 ${toCallAi.length} 幅作品（模式=${opts.ai}，真实消耗配额）吗？`,
      {
        yes: opts.yes,
        customConfirm,
        nonTtyHint: "pnpm judge:backfill -- --ai-only --yes",
        writeInfo: writeLine,
        writeError: writeLine,
      },
    );
    if (!confirmed) {
      await closeJudgeBrowser();
      return;
    }
    for (const task of toCallAi) {
      const outcome = await judgeWithAi({ config: ai, judgement: task.judgement, promptText: task.promptText, log: (line) => writeLine(`    ${line}`) });
      if (!outcome.ok) writeLine(`    [judge-ai] ${task.attemptKey} 未评：${outcome.reason}`);
      printJudgement(outcome.ok ? outcome.judgement : task.judgement, opts.verbose, writeLine);
      judged += 1;
    }
  }
  writeLine(`${opts.dryRun ? "预演" : "已写入"} ${judged} 幅`);
  await closeJudgeBrowser();
}

const isMainModule =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  runJudgeBackfillCli(process.argv.slice(2)).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

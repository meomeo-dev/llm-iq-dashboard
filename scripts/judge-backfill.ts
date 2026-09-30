#!/usr/bin/env tsx
/**
 * 对本地 data/runs 里有评分标准的作品跑静态评审并落盘 .judge.json。
 *
 * 选项：
 *   --dry-run        只打印，不写文件
 *   --limit <n>      最多评 n 幅
 *   --only <text>    只评 attemptKey 含 text 的作品
 *   --verbose        逐条打印闸门与标准的理由
 *   --no-render      只出静态分，不启动浏览器
 *   --ai             代码层之后再跑 AI 层（读配置 judge.ai，真实调用裁判 CLI、消耗配额）
 *   --ai-only        不重跑代码层，只对已有的「待复核」记录跑 AI 层
 * 重跑代码层时，同一 rubric 版本下已有的 AI 分原样带过来，不会被冲掉。
 *
 * 退出码：0 正常；1 某幅作品读取或评审抛错。
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { loadConfig } from "../src/core/config";
import { aiEligible, carryAiResults, judgeWithAi } from "../src/core/judge/ai-judge";
import { closeJudgeBrowser } from "../src/core/judge/browser";
import { judgeArtifact } from "../src/core/judge/judge-attempt";
import { attemptKeyOf, loadJudgement, saveJudgement } from "../src/core/judge/judge-store";
import { judgeCostOf } from "../src/pricing/judge-cost";
import { rubricFor, type Judgement } from "../src/core/judge/schema";
import { judgeStatic } from "../src/core/judge/static-judge";
import { configPath, runDir, runsRoot } from "../src/core/paths";
import type { AppConfig } from "../src/core/config";
import type { RunRecord } from "../src/core/types";

interface Options {
  dryRun: boolean;
  limit: number;
  only: string | null;
  verbose: boolean;
  render: boolean;
  ai: "off" | "after" | "only";
}

function parseOptions(args: readonly string[]): Options {
  const opts: Options = { dryRun: false, limit: Number.POSITIVE_INFINITY, only: null, verbose: false, render: true, ai: "off" };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--") continue;
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--verbose") opts.verbose = true;
    else if (arg === "--no-render") opts.render = false;
    else if (arg === "--ai") opts.ai = "after";
    else if (arg === "--ai-only") opts.ai = "only";
    else if (arg === "--limit") opts.limit = Number(args[++i] ?? "0");
    else if (arg === "--only") opts.only = args[++i] ?? null;
    else throw new Error(`未知参数：${arg}`);
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

/** 各层小计：代码层（static / render）与 AI 层分开，未判定的层写 - */
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

function printJudgement(judgement: Judgement, verbose: boolean): void {
  const { subject, total } = judgement;
  const judgeCost = judgeCostOf(judgement);
  const costNote = judgeCost === null ? "" : `，裁判 ${judgeCost.asks} 次问答 ${judgeCost.cost.usd === null ? "未计价" : `$${judgeCost.cost.usd.toFixed(4)}`}`;
  console.log(`${subject.runId}/${subject.attemptKey}  ${String(total.score).padStart(3)}  ${total.verdict}  ${layerSummary(judgement)}${costNote}`);
  if (!verbose) return;
  for (const gate of judgement.gates) console.log(`    ${gate.id} ${gate.passed ? "✓" : "✗"} ${gate.title}：${gate.evidence}`);
  for (const c of judgement.criteria) {
    const score = c.score === null ? "  -" : String(c.score).padStart(3);
    console.log(`    ${c.id} ${score}/${String(c.maxScore).padStart(2)} ${c.title}：${c.reason ?? "待 AI 层判定"}`);
  }
}

/** AI 层：读本机配置的裁判；关闭或没配时报错退出，免得静默跳过 */
function loadAiConfig(): AppConfig["judge"]["ai"] {
  const config = loadConfig(configPath());
  if (!config.judge.ai.enabled) throw new Error("配置里 judge.ai 未开启或没有裁判，--ai 无法执行");
  return config.judge.ai;
}

async function judgeAi(
  ai: AppConfig["judge"]["ai"], runId: string, attemptKey: string, promptText: string, fresh: Judgement | null, verbose: boolean,
): Promise<Judgement | null> {
  const judgement = fresh ?? (await loadJudgement(runId, attemptKey));
  if (!judgement) return null;
  const blocked = aiEligible(judgement);
  if (blocked) {
    if (verbose) console.log(`    [judge-ai] ${attemptKey} 跳过：${blocked}`);
    return judgement;
  }
  const outcome = await judgeWithAi({ config: ai, judgement, promptText, log: (line) => console.log(`    ${line}`) });
  if (!outcome.ok) console.log(`    [judge-ai] ${attemptKey} 未评：${outcome.reason}`);
  return outcome.ok ? outcome.judgement : judgement;
}

async function main(): Promise<void> {
  const opts = parseOptions(process.argv.slice(2));
  const ai = opts.ai === "off" ? null : loadAiConfig();
  const runIds = (await readdir(runsRoot())).filter((name) => /^[0-9]{8}T[0-9]{6}Z$/.test(name)).sort().reverse();
  let judged = 0;
  for (const runId of runIds) {
    if (judged >= opts.limit) break;
    const run = await loadRun(runId);
    if (!run) continue;
    for (const attempt of run.attempts) {
      if (judged >= opts.limit) break;
      const rubric = rubricFor(attempt.promptId);
      if (!rubric || attempt.status !== "ok" || !attempt.svgFile) continue;
      const attemptKey = attemptKeyOf(attempt.svgFile);
      // --only 同时匹配轮次 id 与作品键：传 runId 即整轮，传作品键片段即单件
      if (opts.only && !`${runId}/${attemptKey}`.includes(opts.only)) continue;
      const source = await readFile(join(runDir(runId), attempt.svgFile), "utf8");
      const subject = { runId, attemptKey, promptId: attempt.promptId, cli: attempt.cli, model: attempt.model, effort: attempt.effort, svgFile: attempt.svgFile };
      // 预演只跑静态层：渲染层会写联系图文件，不算“不落盘”
      const existing = opts.ai === "only" || opts.dryRun ? null : await loadJudgement(runId, attemptKey);
      const fresh = opts.ai === "only"
        ? null
        : opts.dryRun
          ? judgeStatic({ source, rubric, subject })
          : await judgeArtifact({ subject, source, render: opts.render, log: (line) => { if (opts.verbose) console.log(`    ${line}`); } });
      const codeLayer = fresh === null ? null : carryAiResults(fresh, existing);
      if (codeLayer && codeLayer !== fresh) await saveJudgement(codeLayer);
      const promptText = run.prompts.find((p) => p.promptId === attempt.promptId)?.text ?? "";
      const judgement = ai && !opts.dryRun ? await judgeAi(ai, runId, attemptKey, promptText, codeLayer, opts.verbose) : codeLayer;
      if (!judgement) continue;
      printJudgement(judgement, opts.verbose);
      judged += 1;
    }
  }
  console.log(`${opts.dryRun ? "预演" : "已写入"} ${judged} 幅`);
  await closeJudgeBrowser();
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

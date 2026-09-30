#!/usr/bin/env tsx
/**
 * 对本地 data/runs 里有评分标准的作品跑静态评审并落盘 .judge.json。
 *
 * 选项：
 *   --dry-run        只打印，不写文件
 *   --limit <n>      最多评 n 幅
 *   --only <text>    只评 attemptKey 含 text 的作品
 *   --verbose        逐条打印闸门与标准的理由
 *
 * 退出码：0 正常；1 某幅作品读取或评审抛错。
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { attemptKeyOf, saveJudgement } from "../src/core/judge/judge-store";
import { rubricFor, type Judgement } from "../src/core/judge/schema";
import { judgeStatic } from "../src/core/judge/static-judge";
import { runDir, runsRoot } from "../src/core/paths";
import type { RunRecord } from "../src/core/types";

interface Options {
  dryRun: boolean;
  limit: number;
  only: string | null;
  verbose: boolean;
}

function parseOptions(args: readonly string[]): Options {
  const opts: Options = { dryRun: false, limit: Number.POSITIVE_INFINITY, only: null, verbose: false };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--") continue;
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--verbose") opts.verbose = true;
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
  console.log(`${subject.runId}/${subject.attemptKey}  ${String(total.score).padStart(3)}  ${total.verdict}  ${layerSummary(judgement)}`);
  if (!verbose) return;
  for (const gate of judgement.gates) console.log(`    ${gate.id} ${gate.passed ? "✓" : "✗"} ${gate.title}：${gate.evidence}`);
  for (const c of judgement.criteria) {
    const score = c.score === null ? "  -" : String(c.score).padStart(3);
    console.log(`    ${c.id} ${score}/${String(c.maxScore).padStart(2)} ${c.title}：${c.reason ?? "待 AI 层判定"}`);
  }
}

async function main(): Promise<void> {
  const opts = parseOptions(process.argv.slice(2));
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
      if (opts.only && !attemptKey.includes(opts.only)) continue;
      const source = await readFile(join(runDir(runId), attempt.svgFile), "utf8");
      const judgement = judgeStatic({
        source, rubric,
        subject: { runId, attemptKey, promptId: attempt.promptId, cli: attempt.cli, model: attempt.model, effort: attempt.effort, svgFile: attempt.svgFile },
      });
      printJudgement(judgement, opts.verbose);
      if (!opts.dryRun) await saveJudgement(judgement);
      judged += 1;
    }
  }
  console.log(`${opts.dryRun ? "预演" : "已写入"} ${judged} 幅`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

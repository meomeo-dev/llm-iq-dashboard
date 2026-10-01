/**
 * AI 语义层（ACR-020 / ACR-021）：把联系表放进一个只含图片的临时目录，以评审模式请裁判 CLI 先盲描述、
 * 再看首帧定位四类部位重切细节表、最后按 C5–C8 打分，并入评审记录后落盘。
 * 定位失败沿用代码层的表；其余任何一步失败都不抛错，记录保持「待复核」。
 */

import { copyFile, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openSessionPool, type AgentReply, type AgentSession } from "../../adapters/index";
import type { JudgeAiConfig, JudgeModel } from "../config/types";
import { runDir } from "../paths";
import type { Target } from "../types";
import { usageFromTranscript } from "../../pricing/usage";
import type { TokenUsage } from "../../pricing/types";
import {
  AI_PROMPT_VERSION, blindPrompt, blindRecognizedPelican, judgePrompt, parseJudgeReply, trimBlindDescription, type AiScore,
} from "./ai-prompt";
import { relocateDetails } from "./ai-locate";
import { saveJudgement } from "./judge-store";
import { rubricFor, summarizeTotal, type ContactSheet, type Judgement, type RubricSpec } from "./schema";

export interface AiJudgeInput {
  config: JudgeAiConfig;
  judgement: Judgement;
  /** 题目原文，给裁判看的 */
  promptText: string;
  log?: (line: string) => void;
}

export type AiOutcome = { ok: true; judgement: Judgement } | { ok: false; reason: string };

/** 裁判厂商不得与被评作品相同；按配置顺序，前一个调用失败（未登录、超时）时换下一个 */
export function pickJudges(config: JudgeAiConfig, subjectCli: string): JudgeModel[] {
  return config.judges.filter((judge) => judge.cli !== subjectCli);
}

/** 只评通过全部闸门、还停在「待复核」且有联系表的记录 */
export function aiEligible(judgement: Judgement): string | null {
  if (!judgement.gates.every((g) => g.passed)) return "闸门未通过，不进入 AI 层";
  if (judgement.total.verdict !== "pending") return `已判 ${judgement.total.verdict}`;
  if (!judgement.contactSheet) return "没有联系表（渲染层未跑）";
  return null;
}

export async function judgeWithAi(input: AiJudgeInput): Promise<AiOutcome> {
  const { judgement, config } = input;
  const log = input.log ?? (() => {});
  const rubric = rubricFor(judgement.subject.promptId);
  const blocked = aiEligible(judgement);
  if (!rubric || !config.enabled) return { ok: false, reason: "AI 层未开启或题目无评分标准" };
  if (blocked) return { ok: false, reason: blocked };
  const judges = pickJudges(config, judgement.subject.cli);
  if (judges.length === 0) return { ok: false, reason: `没有厂商不同于 ${judgement.subject.cli} 的裁判` };
  const workdir = await mkdtemp(join(tmpdir(), "pelican-judge-"));
  const pool = openSessionPool();
  const failures: string[] = [];
  try {
    const files = await stageSheets(judgement.subject.runId, judgement.contactSheet!, workdir);
    for (const judge of judges) {
      const asker = new JudgeAsker(pool.sessionFor(judge.cli), judge, config.timeoutMs, workdir);
      const outcome = await judgeOnce(judgement, rubric, judge, asker, input.promptText, files, log);
      if (outcome.ok) {
        log(`[judge-ai] ${judgement.subject.attemptKey} ${outcome.judgement.total.score} 分 ${outcome.judgement.total.verdict}（裁判 ${judge.cli}/${judge.model}）`);
        return outcome;
      }
      failures.push(`${judge.cli}/${judge.model}：${outcome.reason}`);
      log(`[judge-ai] ${judgement.subject.attemptKey} 裁判 ${judge.cli}/${judge.model} 失败，${outcome.reason}`);
    }
    return { ok: false, reason: failures.join("；") };
  } catch (cause) {
    return { ok: false, reason: cause instanceof Error ? cause.message : String(cause) };
  } finally {
    await pool.closeAll();
    await rm(workdir, { recursive: true, force: true });
  }
}

/** 一个裁判的完整流程：盲描述 → 定位重切 → 逐项判定 → 并分落盘；失败时仍存转录供排查 */
async function judgeOnce(
  original: Judgement, rubric: RubricSpec, judge: JudgeModel, asker: JudgeAsker, promptText: string, staged: string[],
  log: (line: string) => void,
): Promise<AiOutcome> {
  const started = Date.now();
  const blind = await asker.ask(blindPrompt(original.contactSheet!), [original.contactSheet!.file]);
  if (blind.error || blind.timedOut) return await giveUp(original, asker, `盲描述失败：${blind.error ?? "超时"}`);
  const description = trimBlindDescription(blind.text);
  // 定位失败不算失败：沿用代码层几何推断的细节表继续打分
  const located = await relocateDetails(original, asker);
  if (!located.ok) log(`[judge-ai] ${original.subject.attemptKey} 定位未采用，沿用代码层取景框：${located.reason}`);
  const judgement = located.ok ? located.judgement : original;
  const sheet = judgement.contactSheet!;
  const files = located.ok ? await stageSheets(judgement.subject.runId, sheet, asker.workdir) : staged;
  const scores = await askScores(asker, promptText, sheet, rubric, files);
  if (!scores.ok) return await giveUp(judgement, asker, scores.reason);
  const rawFile = await asker.saveTranscript(judgement.subject.runId, judgement.subject.attemptKey);
  const judged = applyAiResults(judgement, rubric, scores.scores, description, {
    id: `${judge.cli}/${judge.model}@${judge.effort}`, judgedAt: new Date().toISOString(), durationMs: Date.now() - started, rawFile,
    usage: asker.usage(), asks: asker.asks,
  });
  await saveJudgement(judged);
  return { ok: true, judgement: judged };
}

/** 解析失败重试一次；仍失败则放弃 */
async function askScores(
  asker: JudgeAsker, promptText: string, sheet: ContactSheet, rubric: RubricSpec, files: string[],
): Promise<{ ok: true; scores: AiScore[] } | { ok: false; reason: string }> {
  let lastReason = "";
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const reply = await asker.ask(judgePrompt(promptText, sheet, rubric), files);
    if (reply.error || reply.timedOut) return { ok: false, reason: `判定调用失败：${reply.error ?? "超时"}` };
    const parsed = parseJudgeReply(reply.text, rubric);
    if (parsed.ok) return parsed;
    lastReason = parsed.reason;
  }
  return { ok: false, reason: `判定回答两次都解析失败：${lastReason}` };
}

async function giveUp(judgement: Judgement, asker: JudgeAsker, reason: string): Promise<AiOutcome> {
  await asker.saveTranscript(judgement.subject.runId, judgement.subject.attemptKey);
  return { ok: false, reason };
}

/** 把帧序表与各细节表复制进临时目录，裁判只看得到这些文件 */
async function stageSheets(runId: string, sheet: ContactSheet, workdir: string): Promise<string[]> {
  const files = [sheet.file, ...sheet.details.map((d) => d.file)];
  for (const file of files) await copyFile(join(runDir(runId), file), join(workdir, file));
  return files;
}

/** 一次评审里对同一裁判的多次提问，转录累积后存成一个 .judge-ai.txt */
class JudgeAsker {
  private readonly transcripts: string[] = [];
  private readonly target: Target;
  /** 已发出的问答次数（含解析失败后的重试） */
  asks = 0;

  constructor(private readonly session: AgentSession, judge: JudgeModel, private readonly timeoutMs: number, readonly workdir: string) {
    this.target = {
      id: `judge__${judge.cli}__${judge.model}__${judge.effort}`, cli: judge.cli, model: judge.model, effort: judge.effort,
      label: `裁判 ${judge.cli}/${judge.model}`, timeoutMs, extraArgs: [], enabled: true,
    };
  }

  async ask(promptText: string, readableFiles: string[]): Promise<AgentReply> {
    const reply = await this.session.ask({
      target: this.target, promptText, workdir: this.workdir, appliedEffort: this.target.effort, effortAdjustable: true,
      timeoutMs: this.timeoutMs, review: { readableFiles },
    });
    this.asks += 1;
    this.transcripts.push(`===== prompt =====\n${promptText}\n===== transcript =====\n${reply.transcript}\n===== answer =====\n${reply.text}`);
    return reply;
  }

  /** 全部问答的用量合计：用量解析按 CLI 的事件标记逐行取，拼在一起的转录照样能读 */
  usage(): TokenUsage | null {
    return usageFromTranscript(this.target.cli, this.transcripts.join("\n"));
  }

  async saveTranscript(runId: string, attemptKey: string): Promise<string> {
    const file = `${attemptKey}.judge-ai.txt`;
    await writeFile(join(runDir(runId), file), this.transcripts.join("\n\n"), "utf8");
    return file;
  }
}

/**
 * 重跑代码层时把已有记录里的 AI 分带过来：同一 rubric 版本下 AI 层的判断不因代码层重算而失效，
 * 免得回填一次就把花过配额的裁判结果冲掉。版本不同或旧记录没有 AI 分时原样返回新记录。
 */
export function carryAiResults(fresh: Judgement, existing: Judgement | null): Judgement {
  const actor = existing?.judges.find((j) => j.kind === "ai");
  if (!existing || !actor || existing.rubric.version !== fresh.rubric.version) return fresh;
  const criteria = fresh.criteria.map((c) => {
    const old = existing.criteria.find((item) => item.id === c.id);
    return c.source === "ai" && old && old.score !== null ? { ...c, score: old.score, reason: old.reason } : c;
  });
  const judges = [...fresh.judges.filter((j) => j.kind !== "ai"), actor];
  return {
    ...fresh, criteria, judges, blindDescription: existing.blindDescription,
    total: summarizeTotal(fresh.gates, criteria, fresh.rubric, actor.judgedAt),
  };
}

interface AiActorInfo {
  id: string;
  judgedAt: string;
  durationMs: number;
  rawFile: string;
  usage: TokenUsage | null;
  asks: number;
}

/** 把 AI 分并进记录：C6 受盲描述约束；judges 追加 ai 一项；总分与结论重算 */
export function applyAiResults(
  judgement: Judgement, rubric: RubricSpec, scores: readonly AiScore[], blindDescription: string, actor: AiActorInfo,
): Judgement {
  const recognized = blindRecognizedPelican(blindDescription);
  const criteria = judgement.criteria.map((c) => {
    const given = scores.find((s) => s.id === c.id);
    if (!given || c.source !== "ai") return c;
    if (c.id === "C6" && !recognized) {
      const cap = Math.floor(c.maxScore / 2);
      return { ...c, score: Math.min(given.score, cap), reason: `${given.reason}（盲描述未认出鹈鹕，上限减半为 ${cap}）` };
    }
    return { ...c, score: given.score, reason: given.reason };
  });
  const judges = [...judgement.judges.filter((j) => j.kind !== "ai"), { kind: "ai" as const, promptVersion: AI_PROMPT_VERSION, ...actor }];
  return {
    ...judgement, criteria, judges, blindDescription,
    total: summarizeTotal(judgement.gates, criteria, { ...judgement.rubric, passThreshold: rubric.passThreshold }, actor.judgedAt),
  };
}

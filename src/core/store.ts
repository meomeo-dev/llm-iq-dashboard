/**
 * 运行记录的持久化。用目录加纯文件而非数据库，产物可直接用编辑器、git、rsync 处理。
 *
 *   data/runs/<runId>/run.json            一次调度的全部元信息，进行中逐次更新
 *   data/runs/<runId>/progress.json       逐调用的执行状态（见 progress.ts）
 *   data/runs/<runId>/<targetId>.svg      提取出的作品
 *   data/runs/<runId>/<targetId>.txt      CLI 原始事件流与 stderr，失败排查的依据
 */

import { access, mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { attemptKeyOf, loadJudgement } from "./judge/judge-store";
import { withCurrentThreshold } from "./judge/schema";
import { runDir, runsRoot } from "./paths";
import type { Attempt, DashboardCard, RunRecord } from "./types";
import { usageAndCost } from "../pricing/attempt-cost";
import { judgeCostOf } from "../pricing/judge-cost";

const RUN_FILE = "run.json";

export async function ensureRunDir(runId: string): Promise<string> {
  const dir = runDir(runId);
  await mkdir(dir, { recursive: true });
  return dir;
}

/** 写入一件产物，返回相对 run 目录的文件名，供 run.json 引用 */
export async function writeArtifact(
  runId: string,
  filename: string,
  content: string,
): Promise<string> {
  await writeFile(join(runDir(runId), filename), content, "utf8");
  return filename;
}

export async function saveRun(record: RunRecord): Promise<void> {
  await writeJsonAtomic(record.runId, RUN_FILE, record);
}

/** 写临时文件再原子替换，看板在轮次进行中读取时不会读到写了一半的文件 */
export async function writeJsonAtomic(runId: string, filename: string, value: unknown): Promise<void> {
  await ensureRunDir(runId);
  const staging = `${filename}.staging`;
  await writeArtifact(runId, staging, `${JSON.stringify(value, null, 2)}\n`);
  await rename(join(runDir(runId), staging), join(runDir(runId), filename));
}

/** 按 runId 倒序列出运行记录。runId 定长且由 UTC 时刻派生，字典序即时间序 */
export async function listRuns(limit: number): Promise<RunRecord[]> {
  const ids = await listRunIds();
  const records: RunRecord[] = [];

  for (const id of ids.slice(0, limit)) {
    const record = await readRun(id);
    if (record !== null) records.push(record);
  }
  return records;
}

/** 全部 runId，新的在前 */
export async function listRunIds(): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(runsRoot(), { withFileTypes: true });
  } catch {
    // 一次都没跑过时目录还不存在，等同于空历史
    return [];
  }
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();
}

/** runId 的紧凑 UTC 形式（见 runner.ts 的 formatRunId） */
const RUN_ID_PATTERN = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/;

/** 从 runId 还原轮次开始时刻，按时间筛选时无需读 run.json；非 runId 形式返回 null */
export function runIdTime(runId: string): Date | null {
  const match = RUN_ID_PATTERN.exec(runId);
  if (match === null) return null;
  const [year, month, day, hour, minute, second] = match.slice(1).map(Number) as [
    number, number, number, number, number, number,
  ];
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}

/** 全部轮次的开始时刻（ISO），新的在前，供日历计数；没有 run.json 的空目录不计入 */
export async function listRunStarts(): Promise<string[]> {
  const starts: string[] = [];
  for (const id of await listRunIds()) {
    const at = runIdTime(id);
    if (at !== null && (await hasRunFile(id))) starts.push(at.toISOString());
  }
  return starts;
}

async function hasRunFile(runId: string): Promise<boolean> {
  try {
    await access(join(runDir(runId), RUN_FILE));
    return true;
  } catch {
    return false;
  }
}

async function readRun(runId: string): Promise<RunRecord | null> {
  try {
    const text = await readFile(join(runDir(runId), RUN_FILE), "utf8");
    return normalizeRun(JSON.parse(text) as LegacyRunRecord);
  } catch {
    // 缺失或损坏的记录跳过，不影响看板其余部分
    return null;
  }
}

/** 旧版记录：提示词挂在 run 上，attempt 缺 promptId / appliedEffort / effortHonored */
type LegacyRunRecord = Omit<RunRecord, "prompts" | "attempts" | "inProgress"> & {
  prompts?: RunRecord["prompts"];
  inProgress?: boolean;
  promptId?: string;
  promptText?: string;
  attempts: Array<
    Omit<Attempt, "promptId" | "appliedEffort" | "effortHonored"> &
      Partial<Pick<Attempt, "promptId" | "appliedEffort" | "effortHonored">>
  >;
};

/** 在读取时把旧版记录补齐为当前结构；磁盘上的原文件作为原始证据，不回写 */
function normalizeRun(raw: LegacyRunRecord): RunRecord {
  const legacyPromptId = raw.promptId ?? "classic-v1";
  const prompts =
    raw.prompts ??
    [{ promptId: legacyPromptId, text: raw.promptText ?? "", bindings: {} }];

  const attempts: Attempt[] = raw.attempts.map((attempt) => ({
    ...attempt,
    promptId: attempt.promptId ?? legacyPromptId,
    // 旧版不折叠强度，实际强度即请求强度
    appliedEffort: attempt.appliedEffort ?? attempt.effort,
    effortHonored: attempt.effortHonored ?? true,
  }));

  const { promptId: _promptId, promptText: _promptText, ...rest } = raw;
  // 旧版只在整轮结束时写 run.json，缺字段即视为已完成
  return { ...rest, prompts, attempts, inProgress: raw.inProgress ?? false };
}

/**
 * 把开始时刻落在 [from, to) 内的轮次摊平成卡片，分组维度由客户端切换。
 *
 * 卡片只带作品文件名，SVG 源码由浏览器在作品进入视口时经 `/art` 按需取（见 ACR-003）。
 */
export async function loadCardsBetween(from: Date, to: Date): Promise<DashboardCard[]> {
  const ids = (await listRunIds()).filter((id) => {
    const at = runIdTime(id);
    return at !== null && at >= from && at < to;
  });
  const cards: DashboardCard[] = [];
  for (const id of ids) {
    const run = await readRun(id);
    if (run !== null) cards.push(...(await cardsOfRun(run, run.attempts)));
  }
  return cards;
}

/**
 * 单件作品的卡片，供单独查看页与原始 SVG 接口使用。svgFile 来自 URL，只接受
 * run.json 里登记过的文件名，防止路径穿越。
 */
export async function loadCard(runId: string, svgFile: string): Promise<DashboardCard | null> {
  if (runIdTime(runId) === null) return null;
  const run = await readRun(runId);
  const attempt = run?.attempts.find((item) => item.svgFile === svgFile);
  if (run === null || attempt === undefined) return null;
  const [card] = await cardsOfRun(run, [attempt]);
  return card ?? null;
}

/** 单件作品的卡片连同 SVG 源码；文件已不在（被保留期清理）时 svg 为 null */
export async function loadArt(runId: string, svgFile: string): Promise<{ card: DashboardCard; svg: string | null } | null> {
  const card = await loadCard(runId, svgFile);
  if (card === null) return null;
  return { card, svg: await readSvg(card.runId, card) };
}

async function cardsOfRun(run: RunRecord, attempts: readonly Attempt[]): Promise<DashboardCard[]> {
  const byId = new Map(run.prompts.map((prompt) => [prompt.promptId, prompt]));
  const cards: DashboardCard[] = [];
  for (const attempt of attempts) {
    const prompt = byId.get(attempt.promptId);
    cards.push({
      ...attempt,
      runId: run.runId,
      runStartedAt: run.startedAt,
      trigger: run.trigger,
      runInProgress: run.inProgress,
      promptText: prompt?.text ?? "",
      bindings: prompt?.bindings ?? {},
      ...(await usageAndCost(run.runId, attempt)),
      judge: attempt.svgFile === null ? null : withJudgeThreshold(await loadJudgement(run.runId, attemptKeyOf(attempt.svgFile))),
      judgeCost: null,
    });
    const last = cards[cards.length - 1]!;
    last.judgeCost = judgeCostOf(last.judge);
  }
  return cards;
}

async function readSvg(runId: string, attempt: Attempt): Promise<string | null> {
  if (attempt.svgFile === null) return null;
  try {
    return await readFile(join(runDir(runId), attempt.svgFile), "utf8");
  } catch {
    return null;
  }
}

/** 展示用的评审记录按当前及格线重定结论；没有记录时仍是 null */
function withJudgeThreshold(judgement: Awaited<ReturnType<typeof loadJudgement>>): Awaited<ReturnType<typeof loadJudgement>> {
  return judgement === null ? null : withCurrentThreshold(judgement);
}

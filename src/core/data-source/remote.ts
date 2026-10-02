/**
 * 远程数据源实现：从公开数据仓（meomeo-dev/llm-iq-data）读取历史记录与作品。
 *
 * 链路：
 * 1. 读根目录 index.json（DataRepoManifest）
 * 2. 按请求时间窗覆盖到的 UTC 日期拉取各 runs/YYYY/MM/DD/index.json（DayIndex）
 * 3. 并发读取命中时间窗的各轮 runs/YYYY/MM/DD/<runId>/run.json（PublicRunRecord）
 * 4. 复用与本地一致的卡片构造与成本折算
 */

import {
  DATA_REPO_SCHEMA_VERSION,
  DAY_INDEX_FILE,
  MANIFEST_FILE,
  PUBLIC_RUN_FILE,
  runDirPath,
  type DataRepoManifest,
  type DayIndex,
  type PublicRunRecord,
  type RunSummary,
} from "../data-repo/contract";
import { getDataRepoUrl } from "../deploy-mode";
import { usageAndCost } from "../../pricing/attempt-cost";
import { judgeCostOf } from "../../pricing/judge-cost";
import { withCurrentRules, type Judgement } from "../judge/schema";
import type { ProfileView } from "../profile-view";
import { runIdTime } from "../store";
import type { DashboardCard, RunRecord } from "../types";
import { FetchPool } from "./fetch-pool";
import type { DataRepoHealth, DataSource } from "./interface";
import { utcDatesBetween } from "./utc-partitions";

export const CALENDAR_DETAIL_DAYS = 62;

export type FetchFn = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export interface RemoteDataSourceOptions {
  repoUrl?: string;
  fetchFn?: FetchFn;
  timeoutMs?: number;
  concurrency?: number;
}

export class RemoteDataSource implements DataSource {
  private readonly repoUrl: string;
  private readonly fetchFn: FetchFn;
  private readonly timeoutMs: number;
  private readonly pool: FetchPool;
  private notice: string | null = null;
  /** 记录里出现过的 profile 视图，键为 name，按首次出现排序 */
  private readonly profiles = new Map<string, ProfileView>();

  constructor(options?: RemoteDataSourceOptions) {
    this.repoUrl = (options?.repoUrl ?? getDataRepoUrl()).replace(/\/+$/, "");
    this.fetchFn = options?.fetchFn ?? fetch;
    this.timeoutMs = options?.timeoutMs ?? 10_000;
    this.pool = new FetchPool({ concurrency: options?.concurrency ?? 6 });
  }

  getNotice(): string | null {
    return this.notice;
  }

  /** 清空请求缓存（测试时重置） */
  clearCache(): void {
    this.pool.clearCache();
    this.profiles.clear();
  }

  knownProfiles(): readonly ProfileView[] {
    return [...this.profiles.values()];
  }

  /** 全部轮次的开始时刻（ISO），新的在前，供日历计数 */
  async listRunStarts(refDate = new Date()): Promise<string[]> {
    try {
      const manifest = await this.fetchManifest();
      const refUtcStr = refDate.toISOString().slice(0, 10);
      const refUtcTime = Date.parse(`${refUtcStr}T00:00:00.000Z`);
      const msPerDay = 24 * 60 * 60 * 1000;

      const results = await Promise.all(
        manifest.days.map(async (day) => {
          const dayUtcTime = Date.parse(`${day.date}T00:00:00.000Z`);
          const diffDays = Math.floor((refUtcTime - dayUtcTime) / msPerDay);
          const isRecent = diffDays >= 0 && diffDays < CALENDAR_DETAIL_DAYS;

          if (isRecent) {
            try {
              const dayIndex = await this.fetchDayIndex(day.path);
              return extractRunStartsFromDayIndex(dayIndex);
            } catch {
              return synthesizeRunStarts(day.date, day.runs);
            }
          }
          return synthesizeRunStarts(day.date, day.runs);
        }),
      );
      this.notice = null;
      const allStarts = results.flat();
      return allStarts.sort((a, b) => b.localeCompare(a));
    } catch (err) {
      this.handleError("获取轮次开始时间列表失败", err);
      return [];
    }
  }

  /** 把开始时刻落在 [from, to) 内的轮次摊平成卡片，从新到旧 */
  async loadCardsBetween(from: Date, to: Date): Promise<DashboardCard[]> {
    try {
      const manifest = await this.fetchManifest();
      const coveredDates = new Set(utcDatesBetween(from, to));
      if (coveredDates.size === 0) return [];

      const matchingDays = manifest.days.filter((d) => coveredDates.has(d.date));
      if (matchingDays.length === 0) return [];

      const dayIndices = await Promise.all(
        matchingDays.map((d) => this.fetchDayIndex(d.path)),
      );

      const targetRuns = this.filterRunsInRange(dayIndices, from, to);
      const { cards, failedCount } = await this.loadTargetRunCards(targetRuns);

      this.updateNoticeOnRunFailures(failedCount, targetRuns.length, cards.length);
      return cards.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    } catch (err) {
      this.handleError("加载轮次卡片数据失败", err);
      return [];
    }
  }

  /** 单件作品的卡片 */
  async loadCard(runId: string, svgFile: string): Promise<DashboardCard | null> {
    if (runIdTime(runId) === null) return null;
    const dir = runDirPath(runId);
    if (dir === null) return null;
    try {
      const run = await this.fetchPublicRun(dir);
      const attempt = run.attempts.find((item) => item.svgFile === svgFile);
      if (attempt === undefined) return null;
      const [card] = await this.cardsOfPublicRun({ ...run, attempts: [attempt] });
      return card ?? null;
    } catch {
      return null;
    }
  }

  /** 单件作品的卡片连同 SVG 源码 */
  async loadArt(
    runId: string,
    svgFile: string,
  ): Promise<{ card: DashboardCard; svg: string | null } | null> {
    const card = await this.loadCard(runId, svgFile);
    if (card === null) return null;
    const dir = runDirPath(runId);
    if (dir === null) return null;
    try {
      const res = await this.fetchWithTimeout(`${this.repoUrl}/${dir}/${svgFile}`, 86400);
      if (!res.ok) return { card, svg: null };
      const svg = await res.text();
      return { card, svg };
    } catch {
      return { card, svg: null };
    }
  }

  /** 联系图不进数据仓，展台没有 */
  async loadContactSheet(): Promise<Buffer | null> {
    return null;
  }

  /** 按 runId 倒序列出运行记录，供外部工具查询 */
  async listRuns(limit: number): Promise<RunRecord[]> {
    try {
      const manifest = await this.fetchManifest();
      const runs: PublicRunRecord[] = [];
      for (const day of manifest.days) {
        if (runs.length >= limit) break;
        try {
          const dayIndex = await this.fetchDayIndex(day.path);
          const sortedRuns = [...dayIndex.runs].reverse();
          for (const r of sortedRuns) {
            if (runs.length >= limit) break;
            try {
              runs.push(await this.fetchPublicRun(r.path));
            } catch {
              // 忽略拉取失败的单轮
            }
          }
        } catch {
          // 忽略该日索引错误
        }
      }
      this.notice = null;
      return runs as unknown as RunRecord[];
    } catch (err) {
      this.handleError("获取运行记录列表失败", err);
      return [];
    }
  }

  /** 数据仓健康检查探针：探测根清单 index.json */
  async checkHealth(): Promise<DataRepoHealth> {
    try {
      const manifest = await this.fetchManifest();
      return {
        reachable: true,
        schemaVersion: manifest.schemaVersion,
        totalRuns: manifest.totalRuns,
        latestDay: manifest.days[0]?.date ?? null,
      };
    } catch (err) {
      const reason = sanitizeErrorReason(err);
      return {
        reachable: false,
        schemaVersion: null,
        totalRuns: null,
        latestDay: null,
        reason: `远程数据源不可达（${reason}）`,
      };
    }
  }

  private filterRunsInRange(
    dayIndices: DayIndex[],
    from: Date,
    to: Date,
  ): RunSummary[] {
    const targetRuns: RunSummary[] = [];
    for (const di of dayIndices) {
      for (const r of di.runs) {
        const at = runIdTime(r.runId) ?? new Date(r.startedAt);
        if (at >= from && at < to) {
          targetRuns.push(r);
        }
      }
    }
    return targetRuns;
  }

  private async loadTargetRunCards(
    targetRuns: RunSummary[],
  ): Promise<{ cards: DashboardCard[]; failedCount: number }> {
    let failedCount = 0;
    const runRecords = await Promise.all(
      targetRuns.map(async (r) => {
        try {
          return await this.fetchPublicRun(r.path);
        } catch (e) {
          failedCount++;
          console.error(`读取远程轮次 ${r.runId} 失败:`, e);
          return null;
        }
      }),
    );

    const cards: DashboardCard[] = [];
    for (const run of runRecords) {
      if (run !== null) {
        cards.push(...(await this.cardsOfPublicRun(run)));
      }
    }
    return { cards, failedCount };
  }

  private updateNoticeOnRunFailures(
    failedCount: number,
    targetCount: number,
    cardCount: number,
  ): void {
    if (failedCount > 0 && cardCount > 0) {
      this.notice = "部分轮次加载失败";
    } else if (failedCount > 0 && targetCount > 0 && cardCount === 0) {
      this.notice = "全部轮次加载失败";
    } else {
      this.notice = null;
    }
  }

  private async fetchManifest(): Promise<DataRepoManifest> {
    const data = await this.fetchJson<DataRepoManifest>(MANIFEST_FILE);
    if (data.schemaVersion !== DATA_REPO_SCHEMA_VERSION) {
      throw new Error(
        `不支持的数据仓版本 (schemaVersion: ${String(data.schemaVersion)})，请升级看板`,
      );
    }
    if (!Array.isArray(data.days)) {
      throw new Error("数据仓清单缺少 days 数组");
    }
    return data;
  }

  private async fetchDayIndex(dayPath: string): Promise<DayIndex> {
    const data = await this.fetchJson<DayIndex>(`${dayPath}/${DAY_INDEX_FILE}`);
    if (data.schemaVersion !== DATA_REPO_SCHEMA_VERSION) {
      throw new Error(
        `不支持的日索引版本 (schemaVersion: ${String(data.schemaVersion)})，请升级看板`,
      );
    }
    if (!Array.isArray(data.runs)) {
      throw new Error("日索引缺少 runs 数组");
    }
    return data;
  }

  private async fetchPublicRun(runPath: string): Promise<PublicRunRecord> {
    const data = await this.fetchJson<PublicRunRecord>(`${runPath}/${PUBLIC_RUN_FILE}`);
    if (data.publicSchemaVersion !== DATA_REPO_SCHEMA_VERSION) {
      throw new Error(
        `不支持的运行记录版本 (publicSchemaVersion: ${String(data.publicSchemaVersion)})，请升级看板`,
      );
    }
    if (!Array.isArray(data.attempts)) {
      throw new Error("运行记录缺少 attempts 数组");
    }
    return data;
  }

  private async fetchJson<T>(relPath: string): Promise<T> {
    const url = `${this.repoUrl}/${relPath.replace(/^\/+/, "")}`;
    const res = await this.fetchWithTimeout(url, 60);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText} (${url})`);
    }
    try {
      return (await res.json()) as T;
    } catch (cause) {
      throw new Error(`解析 JSON 失败 (${url}): ${describeError(cause)}`);
    }
  }

  private async fetchWithTimeout(url: string, revalidateSec: number): Promise<Response> {
    return this.pool.fetch(url, async () => {
      const init: RequestInit & { next?: { revalidate: number } } = {
        signal: AbortSignal.timeout(this.timeoutMs),
        next: { revalidate: revalidateSec },
      };
      return this.fetchFn(url, init);
    });
  }

  private async cardsOfPublicRun(run: PublicRunRecord): Promise<DashboardCard[]> {
    for (const profile of run.profiles ?? []) {
      // 公开记录不带官网，展台上的信息卡据此不出外链
      if (!this.profiles.has(profile.name)) this.profiles.set(profile.name, { ...profile, website: null });
    }
    const byId = new Map(run.prompts.map((p) => [p.promptId, p]));
    const redactionMap = new Map(run.redactions.map((r) => [r.file, r.reason]));
    const cards: DashboardCard[] = [];

    for (const attempt of run.attempts) {
      const prompt = byId.get(attempt.promptId);
      const isRedacted = attempt.status === "ok" && attempt.svgFile === null;
      let error = attempt.error;
      if (isRedacted) {
        const reason = redactionMap.get(`${attempt.targetId}.svg`) ?? run.redactions[0]?.reason;
        error = reason ? `已脱敏，未发布（${reason}）` : "已脱敏，未发布";
      }

      const cardAttempt = { ...attempt, error };
      const costInfo = await usageAndCost(run.runId, cardAttempt);

      cards.push({
        ...cardAttempt,
        runId: run.runId,
        runStartedAt: run.startedAt,
        trigger: run.trigger,
        runInProgress: false,
        promptText: prompt?.text ?? "",
        bindings: prompt?.bindings ?? {},
        ...costInfo,
        // 公开记录内嵌的评审记录没有联系图与转录引用（ACR-020）；旧记录没有此字段
        judge: attempt.judge == null ? null : withCurrentRules(attempt.judge as Judgement),
        judgeCost: judgeCostOf(attempt.judge ?? null),
      });
    }
    return cards;
  }

  private handleError(context: string, err: unknown): void {
    const msg = describeError(err);
    console.error(`${context}：${msg}`);
    if (
      msg.includes("不支持的数据仓版本") ||
      msg.includes("不支持的日索引版本") ||
      msg.includes("不支持的运行记录版本")
    ) {
      this.notice = msg;
    } else {
      this.notice = `${context}：远程数据源拉取失败（${msg}）`;
    }
  }
}

/** 消除错误描述中的本机绝对路径与潜在敏感信息 */
export function sanitizeErrorReason(err: unknown): string {
  const msg = describeError(err);
  const sanitized = msg
    .replace(/(?:\/Users|\/home|\/root|[A-Za-z]:\\Users)[^\s:"')]+/gi, "[REDACTED_PATH]")
    .trim();
  return sanitized.length > 0 ? sanitized : "未知错误";
}

function describeError(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export function synthesizeRunStarts(date: string, runsCount: number): string[] {
  const count = Math.max(0, runsCount);
  const iso = `${date}T12:00:00.000Z`;
  return Array.from({ length: count }, () => iso);
}

function extractRunStartsFromDayIndex(dayIndex: DayIndex): string[] {
  const starts: string[] = [];
  for (const run of dayIndex.runs) {
    const at = runIdTime(run.runId);
    if (at !== null) {
      starts.push(at.toISOString());
    } else if (run.startedAt) {
      starts.push(run.startedAt);
    }
  }
  return starts;
}


/**
 * 远程数据源实现：从公开数据仓（xumetide-dev/llm-iq-data）读取历史记录与作品。
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
import { runIdTime } from "../store";
import type { DashboardCard, RunRecord } from "../types";
import type { DataSource } from "./interface";
import { utcDatesBetween } from "./utc-partitions";

export type FetchFn = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export interface RemoteDataSourceOptions {
  repoUrl?: string;
  fetchFn?: FetchFn;
  timeoutMs?: number;
}

export class RemoteDataSource implements DataSource {
  private readonly repoUrl: string;
  private readonly fetchFn: FetchFn;
  private readonly timeoutMs: number;
  private notice: string | null = null;

  constructor(options?: RemoteDataSourceOptions) {
    this.repoUrl = (options?.repoUrl ?? getDataRepoUrl()).replace(/\/+$/, "");
    this.fetchFn = options?.fetchFn ?? fetch;
    this.timeoutMs = options?.timeoutMs ?? 10_000;
  }

  getNotice(): string | null {
    return this.notice;
  }

  /** 全部轮次的开始时刻（ISO），新的在前，供日历计数 */
  async listRunStarts(): Promise<string[]> {
    try {
      const manifest = await this.fetchManifest();
      const dayIndices = await Promise.all(
        manifest.days.map(async (day) => {
          try {
            return await this.fetchDayIndex(day.path);
          } catch {
            return null;
          }
        }),
      );

      const starts: string[] = [];
      for (const dayIndex of dayIndices) {
        if (dayIndex === null) continue;
        for (const run of dayIndex.runs) {
          const at = runIdTime(run.runId);
          if (at !== null) {
            starts.push(at.toISOString());
          } else if (run.startedAt) {
            starts.push(run.startedAt);
          }
        }
      }
      this.notice = null;
      return starts.sort().reverse();
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

      const targetRuns: RunSummary[] = [];
      for (const di of dayIndices) {
        for (const r of di.runs) {
          const at = runIdTime(r.runId) ?? new Date(r.startedAt);
          if (at >= from && at < to) {
            targetRuns.push(r);
          }
        }
      }

      const runRecords = await Promise.all(
        targetRuns.map(async (r) => {
          try {
            return await this.fetchPublicRun(r.path);
          } catch (e) {
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

      this.notice = null;
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
      // 文件名登记校验：只接受 run.json 登记过的作品（未脱敏的 svgFile）
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
              const runRecord = await this.fetchPublicRun(r.path);
              runs.push(runRecord);
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
    const init: RequestInit & { next?: { revalidate: number } } = {
      signal: AbortSignal.timeout(this.timeoutMs),
      next: { revalidate: revalidateSec },
    };
    return this.fetchFn(url, init);
  }

  private async cardsOfPublicRun(run: PublicRunRecord): Promise<DashboardCard[]> {
    const byId = new Map(run.prompts.map((p) => [p.promptId, p]));
    const redactionMap = new Map(run.redactions.map((r) => [r.file, r.reason]));
    const cards: DashboardCard[] = [];

    for (const attempt of run.attempts) {
      const prompt = byId.get(attempt.promptId);
      // 被脱敏拦截的作品：attempt.status 为 ok 但 svgFile 为 null
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
      });
    }
    return cards;
  }

  private handleError(context: string, err: unknown): void {
    const msg = describeError(err);
    console.error(`${context}：${msg}`);
    if (msg.includes("不支持的数据仓版本") || msg.includes("不支持的日索引版本") || msg.includes("不支持的运行记录版本")) {
      this.notice = msg;
    } else {
      this.notice = `${context}：远程数据源拉取失败（${msg}）`;
    }
  }
}

function describeError(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

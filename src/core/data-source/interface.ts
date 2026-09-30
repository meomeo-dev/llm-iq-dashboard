/**
 * 数据源抽象接口：统一 local 与 remote 数据读取。
 * 页面与路由只经这一层读轮次数据。
 */

import type { ProfileView } from "../profile-view";
import type { DashboardCard, RunRecord } from "../types";

export interface DataRepoHealth {
  reachable: boolean;
  schemaVersion: number | null;
  totalRuns: number | null;
  latestDay: string | null;
  reason?: string;
}

export interface DataSource {
  /** 全部轮次的开始时刻（ISO），新的在前，供日历计数 */
  listRunStarts(): Promise<string[]>;

  /** 把开始时刻落在 [from, to) 内的轮次摊平成卡片，从新到旧 */
  loadCardsBetween(from: Date, to: Date): Promise<DashboardCard[]>;

  /** 单件作品的卡片，用于详情或原始接口校验 */
  loadCard(runId: string, svgFile: string): Promise<DashboardCard | null>;

  /** 单件作品的卡片连同 SVG 源码；文件不可得时 svg 为 null */
  loadArt(runId: string, svgFile: string): Promise<{ card: DashboardCard; svg: string | null } | null>;

  /** 按 runId 倒序列出运行记录，供外部工具查询 */
  listRuns(limit: number): Promise<RunRecord[]>;

  /** 评审联系图 PNG；远程数据源不同步联系图，恒为 null */
  loadContactSheet(runId: string, file: string): Promise<Buffer | null>;

  /** 远程数据源当前的提示或报错（如有降级）；本地数据源恒为 null */
  getNotice?(): string | null;

  /** 数据仓健康检查探针；仅远程数据源有实际探针 */
  checkHealth?(): Promise<DataRepoHealth>;

  /**
   * 已读到的记录里出现过的上游 profile 公开视图，按首次出现排序；展台没有配置文件，
   * 上游的显示名与倍率只能从记录里来。本地数据源不实现，页面改读配置
   */
  knownProfiles?(): readonly ProfileView[];
}


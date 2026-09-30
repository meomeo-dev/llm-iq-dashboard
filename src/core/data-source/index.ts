/**
 * 数据源统一入口：根据部署模式分发到 local 或 remote 实现。
 * 页面与路由统一经本模块读取数据。
 */

import { isRemoteDataSource } from "../deploy-mode";
import type { ProfileView } from "../profile-view";
import type { DashboardCard, RunRecord } from "../types";
import type { DataRepoHealth, DataSource } from "./interface";
import { LocalDataSource } from "./local";
import { RemoteDataSource } from "./remote";

export * from "./fetch-pool";
export * from "./interface";
export * from "./local";
export * from "./remote";
export * from "./utc-partitions";

let localInstance: LocalDataSource | null = null;
let remoteInstance: RemoteDataSource | null = null;

export function getDataSource(): DataSource {
  if (isRemoteDataSource()) {
    if (remoteInstance === null) {
      remoteInstance = new RemoteDataSource();
    }
    return remoteInstance;
  }
  if (localInstance === null) {
    localInstance = new LocalDataSource();
  }
  return localInstance;
}

/** 全部轮次的开始时刻（ISO），新的在前 */
export async function listRunStarts(): Promise<string[]> {
  return getDataSource().listRunStarts();
}

/** 把开始时刻落在 [from, to) 内的轮次摊平成卡片，从新到旧 */
export async function loadCardsBetween(from: Date, to: Date): Promise<DashboardCard[]> {
  return getDataSource().loadCardsBetween(from, to);
}

/** 单件作品的卡片 */
export async function loadCard(runId: string, svgFile: string): Promise<DashboardCard | null> {
  return getDataSource().loadCard(runId, svgFile);
}

/** 单件作品的卡片连同 SVG 源码 */
export async function loadArt(
  runId: string,
  svgFile: string,
): Promise<{ card: DashboardCard; svg: string | null } | null> {
  return getDataSource().loadArt(runId, svgFile);
}

/** 按 runId 倒序列出运行记录 */
export async function listRuns(limit: number): Promise<RunRecord[]> {
  return getDataSource().listRuns(limit);
}

/** 评审联系图 PNG（帧序表或某类细节表） */
export async function loadContactSheet(runId: string, file: string): Promise<Buffer | null> {
  return getDataSource().loadContactSheet(runId, file);
}

/** 已读到的记录里出现过的上游 profile 视图；本地数据源为空 */
export function knownProfiles(): readonly ProfileView[] {
  return getDataSource().knownProfiles?.() ?? [];
}

/** 获取远程数据源当前的提示信息（如有） */
export function getRemoteNotice(): string | null {
  return getDataSource().getNotice?.() ?? null;
}

/** 探测数据仓健康状态；非远程模式返回 null */
export async function checkDataRepoHealth(): Promise<DataRepoHealth | null> {
  const ds = getDataSource();
  if (typeof ds.checkHealth === "function") {
    return ds.checkHealth();
  }
  return null;
}

/** 供单测重置单例实例与请求缓存 */
export function _resetDataSourceInstancesForTest(): void {
  localInstance = null;
  remoteInstance = null;
}

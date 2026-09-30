/**
 * 本地数据源实现：直接委托 src/core/store.ts 的持久化读取函数。
 */

import { loadContactSheet } from "../judge/judge-store";
import { listRunStarts, loadCardsBetween, loadCard, loadArt, listRuns } from "../store";
import type { DashboardCard, RunRecord } from "../types";
import type { DataSource } from "./interface";

export class LocalDataSource implements DataSource {
  async listRunStarts(): Promise<string[]> {
    return listRunStarts();
  }

  async loadCardsBetween(from: Date, to: Date): Promise<DashboardCard[]> {
    return loadCardsBetween(from, to);
  }

  async loadCard(runId: string, svgFile: string): Promise<DashboardCard | null> {
    return loadCard(runId, svgFile);
  }

  async loadArt(runId: string, svgFile: string): Promise<{ card: DashboardCard; svg: string | null } | null> {
    return loadArt(runId, svgFile);
  }

  async listRuns(limit: number): Promise<RunRecord[]> {
    return listRuns(limit);
  }

  async loadContactSheet(runId: string, file: string): Promise<Buffer | null> {
    return loadContactSheet(runId, file);
  }

  getNotice(): string | null {
    return null;
  }
}

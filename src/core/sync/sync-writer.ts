/**
 * 数据仓文件写入与索引持久化模块。
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { dayPartition, type RunSummary } from "../data-repo/contract";
import { buildRunSummary, updateDayIndex, updateManifest } from "./data-repo-index";
import type { ReadyExportResult } from "./export-run";

/** 写入单轮导出的 run.json 与全部 svg 文件 */
export async function writeExportedRunFiles(
  repoPath: string,
  item: ReadyExportResult,
): Promise<{ partitionDate: string; summary: RunSummary } | null> {
  const partition = dayPartition(item.runId);
  if (partition === null) return null;

  const targetDir = join(repoPath, partition.path, item.runId);
  await mkdir(targetDir, { recursive: true });

  await writeFile(join(targetDir, "run.json"), item.jsonText, "utf8");
  for (const svg of item.svgFiles) {
    await writeFile(join(targetDir, svg.filename), svg.content, "utf8");
  }

  const summary = buildRunSummary(item.publicRecord);
  return { partitionDate: partition.date, summary };
}

/** 批量写入所有就绪的导出轮次并归拢受影响日期 */
export async function writeAllExportedRuns(
  repoPath: string,
  items: readonly ReadyExportResult[],
): Promise<{
  exportedRunIds: string[];
  affectedDates: Map<string, RunSummary[]>;
}> {
  const exportedRunIds: string[] = [];
  const affectedDates = new Map<string, RunSummary[]>();

  for (const item of items) {
    const written = await writeExportedRunFiles(repoPath, item);
    if (written !== null) {
      const list = affectedDates.get(written.partitionDate) ?? [];
      list.push(written.summary);
      affectedDates.set(written.partitionDate, list);
      exportedRunIds.push(item.runId);
    }
  }

  return { exportedRunIds, affectedDates };
}

/** 更新所有受影响日期的日索引以及仓库根清单 */
export async function updateRepoIndices(
  repoPath: string,
  affectedDates: Map<string, RunSummary[]>,
): Promise<void> {
  for (const [date, summaries] of affectedDates.entries()) {
    await updateDayIndex(repoPath, date, summaries);
  }
  if (affectedDates.size > 0) {
    await updateManifest(repoPath);
  }
}

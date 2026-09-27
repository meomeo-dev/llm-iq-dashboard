/**
 * 数据仓索引与清单维护（data-repo-index）。
 *
 * 维护：
 * 1. runs/YYYY/MM/DD/index.json（DayIndex，runs 按 runId 升序）；
 * 2. 根目录 index.json（DataRepoManifest，days 新的在前，totalRuns 汇总）；
 * 3. 确定性 updatedAt：取全部轮次中最新的 finishedAt（从最新日索引读取）；
 *    数据仓为空时沿用已有 index.json 的 updatedAt，没有则用当前时刻；
 * 4. 读已有 index.json 时仅 ENOENT 容错，损坏或非法形状抛错中止。
 */

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  DATA_REPO_SCHEMA_VERSION,
  DAY_INDEX_FILE,
  MANIFEST_FILE,
  RUNS_DIR,
  runDirPath,
  type DataRepoManifest,
  type DayEntry,
  type DayIndex,
  type PublicRunRecord,
  type RunSummary,
} from "../data-repo/contract";

const DEFAULT_REPO_NAME = "llm-iq-data";
const DEFAULT_REPO_DESCRIPTION = "LLM-IQ Benchmark Open Data";
const DEFAULT_REPOSITORY_URL = "https://github.com/xumetide-dev/llm-iq-data";

/** 从 PublicRunRecord 提取 RunSummary */
export function buildRunSummary(record: PublicRunRecord): RunSummary {
  const path = runDirPath(record.runId);
  if (path === null) {
    throw new Error(`非法的 runId，无法计算分区路径：${record.runId}`);
  }

  const ok = record.attempts.filter((a) => a.status === "ok").length;
  const promptIds = [...new Set(record.prompts.map((p) => p.promptId))];

  return {
    runId: record.runId,
    startedAt: record.startedAt,
    finishedAt: record.finishedAt,
    trigger: record.trigger,
    promptIds,
    attempts: record.attempts.length,
    ok,
    path,
  };
}

/**
 * 更新或创建指定日期的 DayIndex（runs/YYYY/MM/DD/index.json）。
 * 按 runId 升序排列。损坏或形状错误时抛错。
 */
export async function updateDayIndex(
  repoDir: string,
  date: string,
  newSummaries: readonly RunSummary[],
): Promise<DayIndex> {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) {
    throw new Error(`非法的日期格式：${date}，期望 YYYY-MM-DD`);
  }

  const partitionDir = join(repoDir, RUNS_DIR, year, month, day);
  await mkdir(partitionDir, { recursive: true });
  const indexFile = join(partitionDir, DAY_INDEX_FILE);

  let existingRuns: RunSummary[] = [];
  try {
    const raw = await readFile(indexFile, "utf8");
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      const msg = parseErr instanceof Error ? parseErr.message : String(parseErr);
      throw new Error(`日索引 ${indexFile} JSON 损坏: ${msg}`);
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error(`日索引 ${indexFile} 格式错误，期望 JSON 对象`);
    }
    const dayObj = parsed as Partial<DayIndex>;
    if (!Array.isArray(dayObj.runs)) {
      throw new Error(`日索引 ${indexFile} 格式错误，缺少 runs 数组`);
    }
    existingRuns = dayObj.runs;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      existingRuns = [];
    } else {
      throw error;
    }
  }

  const runMap = new Map<string, RunSummary>();
  for (const item of existingRuns) {
    runMap.set(item.runId, item);
  }
  for (const item of newSummaries) {
    runMap.set(item.runId, item);
  }

  const runs = [...runMap.values()].sort((a, b) => a.runId.localeCompare(b.runId));
  const dayIndex: DayIndex = {
    schemaVersion: DATA_REPO_SCHEMA_VERSION,
    date,
    runs,
  };

  await writeFile(indexFile, `${JSON.stringify(dayIndex, null, 2)}\n`, "utf8");
  return dayIndex;
}

/**
 * 遍历 runs/ 目录发现所有已建立的日索引。
 */
async function scanAllDays(repoDir: string): Promise<DayEntry[]> {
  const runsRoot = join(repoDir, RUNS_DIR);
  const days: DayEntry[] = [];

  let years: string[] = [];
  try {
    const entries = await readdir(runsRoot, { withFileTypes: true });
    years = entries
      .filter((e) => e.isDirectory() && /^\d{4}$/.test(e.name))
      .map((e) => e.name);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw err;
  }

  for (const year of years) {
    let months: string[] = [];
    try {
      const entries = await readdir(join(runsRoot, year), { withFileTypes: true });
      months = entries
        .filter((e) => e.isDirectory() && /^\d{2}$/.test(e.name))
        .map((e) => e.name);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw err;
    }

    for (const month of months) {
      let dayDirs: string[] = [];
      try {
        const entries = await readdir(join(runsRoot, year, month), {
          withFileTypes: true,
        });
        dayDirs = entries
          .filter((e) => e.isDirectory() && /^\d{2}$/.test(e.name))
          .map((e) => e.name);
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw err;
      }

      for (const day of dayDirs) {
        const date = `${year}-${month}-${day}`;
        const dayIndexPath = join(runsRoot, year, month, day, DAY_INDEX_FILE);
        try {
          const raw = await readFile(dayIndexPath, "utf8");
          let parsed: unknown;
          try {
            parsed = JSON.parse(raw);
          } catch (parseErr) {
            const msg =
              parseErr instanceof Error ? parseErr.message : String(parseErr);
            throw new Error(`日索引 ${dayIndexPath} JSON 损坏: ${msg}`);
          }
          if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            throw new Error(`日索引 ${dayIndexPath} 格式错误，期望 JSON 对象`);
          }
          const dayObj = parsed as Partial<DayIndex>;
          if (!Array.isArray(dayObj.runs)) {
            throw new Error(`日索引 ${dayIndexPath} 缺少 runs 数组`);
          }
          days.push({
            date,
            runs: dayObj.runs.length,
            path: `${RUNS_DIR}/${year}/${month}/${day}`,
          });
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            // 目录存在但日索引尚未生成，跳过
          } else {
            throw error;
          }
        }
      }
    }
  }

  return days;
}

/**
 * 汇总各日索引，更新数据仓根目录的 DataRepoManifest（index.json）。
 * 保留已有 name、description、repository。
 * updatedAt 遵循确定性生成规则。
 */
export async function updateManifest(
  repoDir: string,
  now = new Date(),
): Promise<DataRepoManifest> {
  const manifestPath = join(repoDir, MANIFEST_FILE);

  let name = DEFAULT_REPO_NAME;
  let description = DEFAULT_REPO_DESCRIPTION;
  let repository = DEFAULT_REPOSITORY_URL;
  let existingUpdatedAt: string | null = null;

  try {
    const raw = await readFile(manifestPath, "utf8");
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      const msg = parseErr instanceof Error ? parseErr.message : String(parseErr);
      throw new Error(`数据仓清单 ${manifestPath} JSON 损坏: ${msg}`);
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error(`数据仓清单 ${manifestPath} 格式错误，期望 JSON 对象`);
    }
    const obj = parsed as Record<string, unknown>;
    if (obj.schemaVersion === undefined && obj.version === undefined) {
      throw new Error(
        `数据仓清单 ${manifestPath} 缺少 schemaVersion 或 version 字段`,
      );
    }

    if (typeof obj.name === "string" && obj.name.trim() !== "") {
      name = obj.name;
    }
    if (typeof obj.description === "string" && obj.description.trim() !== "") {
      description = obj.description;
    }
    if (typeof obj.repository === "string" && obj.repository.trim() !== "") {
      repository = obj.repository;
    }
    if (typeof obj.updatedAt === "string" && obj.updatedAt.trim() !== "") {
      existingUpdatedAt = obj.updatedAt;
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // 仅当文件不存在时使用默认元信息
    } else {
      throw error;
    }
  }

  const days = await scanAllDays(repoDir);
  days.sort((a, b) => b.date.localeCompare(a.date));

  const totalRuns = days.reduce((sum, item) => sum + item.runs, 0);

  // 确定性 updatedAt：从最新的日索引读取最新一轮的 finishedAt
  let latestFinishedAt: string | null = null;
  for (const day of days) {
    if (day.runs > 0) {
      const dayIndexPath = join(repoDir, day.path, DAY_INDEX_FILE);
      const raw = await readFile(dayIndexPath, "utf8");
      const parsed = JSON.parse(raw) as DayIndex;
      if (Array.isArray(parsed.runs) && parsed.runs.length > 0) {
        for (const r of parsed.runs) {
          if (r.finishedAt) {
            if (
              latestFinishedAt === null ||
              r.finishedAt.localeCompare(latestFinishedAt) > 0
            ) {
              latestFinishedAt = r.finishedAt;
            }
          }
        }
        if (latestFinishedAt !== null) {
          break;
        }
      }
    }
  }

  const updatedAt =
    latestFinishedAt ?? (existingUpdatedAt ?? now.toISOString());

  const manifest: DataRepoManifest = {
    schemaVersion: DATA_REPO_SCHEMA_VERSION,
    name,
    description,
    repository,
    updatedAt,
    totalRuns,
    days,
  };

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return manifest;
}

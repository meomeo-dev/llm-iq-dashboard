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
/** 读取并校验已有日索引中的运行记录 */
async function readExistingDayRuns(indexFile: string): Promise<RunSummary[]> {
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
    return dayObj.runs;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
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

  const existingRuns = await readExistingDayRuns(indexFile);
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

/** 列出指定目录下匹配正则表达式的子目录名列表 */
async function listMatchingDirs(dir: string, pattern: RegExp): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory() && pattern.test(e.name)).map((e) => e.name);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

/** 尝试读取单日索引并组装 DayEntry */
async function loadDayEntry(
  runsRoot: string,
  year: string,
  month: string,
  day: string,
): Promise<DayEntry | null> {
  const date = `${year}-${month}-${day}`;
  const dayIndexPath = join(runsRoot, year, month, day, DAY_INDEX_FILE);
  try {
    const raw = await readFile(dayIndexPath, "utf8");
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      const msg = parseErr instanceof Error ? parseErr.message : String(parseErr);
      throw new Error(`日索引 ${dayIndexPath} JSON 损坏: ${msg}`);
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error(`日索引 ${dayIndexPath} 格式错误，期望 JSON 对象`);
    }
    const dayObj = parsed as Partial<DayIndex>;
    if (!Array.isArray(dayObj.runs)) {
      throw new Error(`日索引 ${dayIndexPath} 缺少 runs 数组`);
    }
    return {
      date,
      runs: dayObj.runs.length,
      path: `${RUNS_DIR}/${year}/${month}/${day}`,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * 遍历 runs/ 目录发现所有已建立的日索引。
 */
async function scanAllDays(repoDir: string): Promise<DayEntry[]> {
  const runsRoot = join(repoDir, RUNS_DIR);
  const days: DayEntry[] = [];
  const years = await listMatchingDirs(runsRoot, /^\d{4}$/);

  for (const year of years) {
    const months = await listMatchingDirs(join(runsRoot, year), /^\d{2}$/);
    for (const month of months) {
      const dayDirs = await listMatchingDirs(join(runsRoot, year, month), /^\d{2}$/);
      for (const day of dayDirs) {
        const entry = await loadDayEntry(runsRoot, year, month, day);
        if (entry !== null) {
          days.push(entry);
        }
      }
    }
  }

  return days;
}

interface ManifestMeta {
  name: string;
  description: string;
  repository: string;
  existingUpdatedAt: string | null;
}

/** 读取已有根清单元信息，损坏时报错中止 */
async function loadManifestMeta(manifestPath: string): Promise<ManifestMeta> {
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
      throw new Error(`数据仓清单 ${manifestPath} 缺少 schemaVersion 或 version 字段`);
    }

    if (typeof obj.name === "string" && obj.name.trim() !== "") name = obj.name;
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
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  return { name, description, repository, existingUpdatedAt };
}

/** 确定性计算最新已完成时刻：从最新日索引读取最新一轮的 finishedAt */
async function findLatestFinishedAt(
  repoDir: string,
  days: readonly DayEntry[],
): Promise<string | null> {
  for (const day of days) {
    if (day.runs === 0) continue;
    const dayIndexPath = join(repoDir, day.path, DAY_INDEX_FILE);
    const raw = await readFile(dayIndexPath, "utf8");
    const parsed = JSON.parse(raw) as DayIndex;
    if (Array.isArray(parsed.runs) && parsed.runs.length > 0) {
      let maxAt: string | null = null;
      for (const r of parsed.runs) {
        if (r.finishedAt && (maxAt === null || r.finishedAt.localeCompare(maxAt) > 0)) {
          maxAt = r.finishedAt;
        }
      }
      if (maxAt !== null) return maxAt;
    }
  }
  return null;
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
  const meta = await loadManifestMeta(manifestPath);

  const days = await scanAllDays(repoDir);
  days.sort((a, b) => b.date.localeCompare(a.date));

  const totalRuns = days.reduce((sum, item) => sum + item.runs, 0);
  const latestFinishedAt = await findLatestFinishedAt(repoDir, days);
  const updatedAt =
    latestFinishedAt ?? (meta.existingUpdatedAt ?? now.toISOString());

  const manifest: DataRepoManifest = {
    schemaVersion: DATA_REPO_SCHEMA_VERSION,
    name: meta.name,
    description: meta.description,
    repository: meta.repository,
    updatedAt,
    totalRuns,
    days,
  };

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return manifest;
}


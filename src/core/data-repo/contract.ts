/**
 * 公开数据仓（xumetide-dev/llm-iq-data）的布局与记录契约。
 *
 * 写入方是同步流水线（src/core/sync），读取方是远程数据源（DATA_SOURCE=remote 的看板）
 * 与数据仓自身的校验脚本。三方只认本文件：改字段先改这里并提升 DATA_REPO_SCHEMA_VERSION。
 *
 * 布局（均为数据仓根的相对路径，分区日期取 runId 的 UTC 日期）：
 *
 *   index.json                              DataRepoManifest
 *   runs/YYYY/MM/DD/index.json              DayIndex
 *   runs/YYYY/MM/DD/<runId>/run.json        PublicRunRecord
 *   runs/YYYY/MM/DD/<runId>/<svgFile>       作品，文件名即 PublicAttempt.svgFile
 *
 * 数据仓只追加：已发布的轮次目录不改写、不删除；清单与日索引随追加重写。
 */

import type { Attempt, RunRecord } from "../types";
import type { TokenUsage } from "../../pricing/types";

export const DATA_REPO_SCHEMA_VERSION = 1;

export const MANIFEST_FILE = "index.json";
export const DAY_INDEX_FILE = "index.json";
export const PUBLIC_RUN_FILE = "run.json";
export const RUNS_DIR = "runs";

/** 数据仓根的 index.json：全量轮次的轻量目录，读取方据此决定拉哪几天 */
export interface DataRepoManifest {
  schemaVersion: typeof DATA_REPO_SCHEMA_VERSION;
  name: string;
  description: string;
  /** 数据仓的 GitHub 地址 */
  repository: string;
  /** 最近一次追加的时刻（ISO） */
  updatedAt: string;
  totalRuns: number;
  /** 有轮次的日期，新的在前 */
  days: DayEntry[];
}

export interface DayEntry {
  /** UTC 日期 YYYY-MM-DD */
  date: string;
  runs: number;
  /** 该日分区目录，形如 runs/2026/09/27 */
  path: string;
}

/** runs/YYYY/MM/DD/index.json：一天内各轮次的摘要，按 runId 升序 */
export interface DayIndex {
  schemaVersion: typeof DATA_REPO_SCHEMA_VERSION;
  date: string;
  runs: RunSummary[];
}

export interface RunSummary {
  runId: string;
  startedAt: string;
  finishedAt: string;
  trigger: RunRecord["trigger"];
  promptIds: string[];
  /** 本轮调用总数与成功出图数 */
  attempts: number;
  ok: number;
  /** 轮次目录，形如 runs/2026/09/27/20260927T021708Z */
  path: string;
}

/** 脱敏后的单次调用：去掉原始转录引用，用量已从转录回填 */
export interface PublicAttempt extends Omit<Attempt, "rawFile" | "usage"> {
  /** 公开记录不带原始转录，恒为 null，保留字段使读取方与本地记录同形 */
  rawFile: null;
  usage: TokenUsage | null;
}

/** 某个文件因脱敏被拦下未发布的说明 */
export interface Redaction {
  file: string;
  /** 机器可读原因，如 local-path、secret-pattern */
  reason: string;
}

/** 数据仓里的 run.json：只收已结束的轮次 */
export interface PublicRunRecord extends Omit<RunRecord, "attempts" | "inProgress"> {
  publicSchemaVersion: typeof DATA_REPO_SCHEMA_VERSION;
  inProgress: false;
  attempts: PublicAttempt[];
  /** 被拦下的作品；为空数组表示全部发布 */
  redactions: Redaction[];
}

const RUN_ID_PATTERN = /^(\d{4})(\d{2})(\d{2})T\d{6}Z$/;

/** runId 的 UTC 日期分区 {date: YYYY-MM-DD, path: runs/YYYY/MM/DD}；非 runId 形式返回 null */
export function dayPartition(runId: string): Pick<DayEntry, "date" | "path"> | null {
  const match = RUN_ID_PATTERN.exec(runId);
  if (match === null) return null;
  const [, year, month, day] = match;
  return { date: `${year}-${month}-${day}`, path: `${RUNS_DIR}/${year}/${month}/${day}` };
}

/** 轮次目录在数据仓里的相对路径；非 runId 形式返回 null */
export function runDirPath(runId: string): string | null {
  const partition = dayPartition(runId);
  return partition === null ? null : `${partition.path}/${runId}`;
}

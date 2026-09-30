/**
 * 公开数据仓（meomeo-dev/llm-iq-data）的布局与记录契约。
 *
 * 写入方是同步流水线（src/core/sync），读取方是远程数据源（DATA_SOURCE=remote 的看板）
 * 与数据仓自身的校验脚本。三方只认本文件：改字段先改这里。只增可选字段不升
 * DATA_REPO_SCHEMA_VERSION——读取方按版本号整体拒收，升版会让尚未重新部署的展台在数据
 * 推送后立刻不可用；改语义或删字段才升版。
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

import type { ProfileView } from "../profile-view";
import type { Attempt, RunRecord } from "../types";
import type { TokenUsage } from "../../pricing/types";

export const DATA_REPO_SCHEMA_VERSION = 1;

export const MANIFEST_FILE = "index.json";
export const DAY_INDEX_FILE = "index.json";
export const PUBLIC_RUN_FILE = "run.json";
export const RUNS_DIR = "runs";

/**
 * 永不发布到数据仓的题目：仅供本地测试，或已从题库移除但可能残留在本地历史结果中。
 * 同步时剔除这些题目的调用与题面，整轮只含这些题目时跳过；数据仓校验脚本对它们同样拒收。
 */
export const UNPUBLISHABLE_PROMPT_IDS: readonly string[] = ["leijun-v1"];

/** 数据仓根的 index.json：全量轮次的轻量目录，读取方据此决定拉哪几天 */
export interface DataRepoManifest {
  schemaVersion: typeof DATA_REPO_SCHEMA_VERSION;
  name: string;
  description: string;
  /** 数据仓的 GitHub 地址 */
  repository: string;
  /** 最新一轮的 finishedAt（ISO），可由目录树确定性重建 */
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

/**
 * 随记录发布的上游 profile：与看板页面下发的公开视图同一份字段白名单（PROFILE_VIEW_FIELDS），
 * 按导出时的配置快照，只含本轮调用用到的。接口地址、查询参数与 key 状态永远不在其中。
 */
export type PublicProfile = ProfileView;

/**
 * 脱敏后的单次调用：去掉原始转录引用，用量已从转录回填。
 * `profile`（继承自 Attempt）指向 PublicRunRecord.profiles 里的一项；登录态不写。
 */
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
  /** 本轮调用用到的上游 profile；只有登录态时为空数组。引入前的旧记录没有此字段，读取方按空处理 */
  profiles?: PublicProfile[];
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

/**
 * 数据仓面板状态聚合（data-repo-status）。
 *
 * 聚合配置、Git 工作副本状态、数据仓根清单、本地同步台账、本地未同步轮次与最近一次动作。
 * 所有只读操作异常均安全隔离，反映于 notice，不导致整站 500。
 */

import { existsSync, readFileSync } from "node:fs";
import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { parse as parseYaml } from "yaml";
import type { AppConfig } from "../config";
import { isReadonly } from "../deploy-mode";
import { configPath as defaultAppConfigPath, dataRoot } from "../paths";
import { requestRunnerDataRepoStatus } from "../requests";
import { externalRunner } from "../runner-link";
import { inspectGitRepo } from "./data-repo-git";
import type {
  DataRepoStatus,
  GithubConnection,
  PushCapability,
  SyncActionResult,
} from "./data-repo-panel-types";
import { loadSyncLedger, type SyncLedger } from "./sync-ledger";
import { readGithubConnection } from "../github-auth";

export const LAST_ACTION_FILE = "data-repo-last-action.json";

export interface CollectDataRepoStatusOptions {
  dataDir?: string;
  configPath?: string;
  rawPath?: string;
  timeoutMs?: number;
  secretsDir?: string;
  fetchRunnerStatus?: () => Promise<{
    repo: DataRepoStatus["repo"];
    manifest: DataRepoStatus["manifest"];
    github?: GithubConnection;
    pushCapability?: PushCapability;
  } | null>;
}

export function lastActionPath(customDataDir?: string): string {
  return join(customDataDir ?? dataRoot(), LAST_ACTION_FILE);
}

export async function readLastAction(
  customDataDir?: string,
): Promise<SyncActionResult | null> {
  const filePath = lastActionPath(customDataDir);
  try {
    const text = await readFile(filePath, "utf8");
    return JSON.parse(text) as SyncActionResult;
  } catch {
    return null;
  }
}

export async function saveLastAction(
  result: SyncActionResult,
  customDataDir?: string,
): Promise<void> {
  const target = lastActionPath(customDataDir);
  await mkdir(dirname(target), { recursive: true });
  const staging = `${target}.staging`;
  await writeFile(staging, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  await rename(staging, target);
}

export function getRawDataRepoPath(
  config: AppConfig,
  customConfigPath?: string,
): string {
  try {
    const p = customConfigPath ?? defaultAppConfigPath();
    if (existsSync(p)) {
      const text = readFileSync(p, "utf8");
      const parsed = parseYaml(text) as { dataRepo?: { path?: string } } | null;
      if (typeof parsed?.dataRepo?.path === "string") {
        return parsed.dataRepo.path;
      }
    }
  } catch {
    // 忽略异常，使用 config 中的回退值
  }
  return config.dataRepo?.path ?? "";
}

export async function readDataRepoManifest(
  repoPath: string,
): Promise<DataRepoStatus["manifest"]> {
  const manifestPath = join(repoPath, "index.json");
  try {
    const text = await readFile(manifestPath, "utf8");
    const m = JSON.parse(text) as {
      totalRuns?: number;
      updatedAt?: string;
      days?: Array<{ date: string }>;
    };
    return {
      totalRuns: typeof m.totalRuns === "number" ? m.totalRuns : 0,
      updatedAt: typeof m.updatedAt === "string" ? m.updatedAt : "",
      latestDay:
        Array.isArray(m.days) && m.days.length > 0 && m.days[0]?.date
          ? m.days[0].date
          : null,
    };
  } catch {
    return null;
  }
}

function createEmptyLedgerMetrics(): DataRepoStatus["ledger"] {
  return {
    exported: 0,
    published: 0,
    skipped: 0,
    skippedByReason: {
      "unpublishable-prompt": 0,
      rejected: 0,
      abandoned: 0,
    },
    lastExportedAt: null,
    lastPublishedAt: null,
  };
}

function summarizeLedgerRecords(rawLedger: SyncLedger): DataRepoStatus["ledger"] {
  const metrics = createEmptyLedgerMetrics();
  const byReason = metrics.skippedByReason!;

  for (const record of Object.values(rawLedger)) {
    if (record.status === "exported") metrics.exported += 1;
    else if (record.status === "published") metrics.published += 1;
    else if (record.status === "skipped") {
      metrics.skipped = (metrics.skipped ?? 0) + 1;
      if (record.reason in byReason) {
        byReason[record.reason as keyof typeof byReason] += 1;
      }
    }
    if (record.exportedAt && (!metrics.lastExportedAt || record.exportedAt > metrics.lastExportedAt)) {
      metrics.lastExportedAt = record.exportedAt;
    }
    if (record.publishedAt && (!metrics.lastPublishedAt || record.publishedAt > metrics.lastPublishedAt)) {
      metrics.lastPublishedAt = record.publishedAt;
    }
  }
  return metrics;
}

async function collectLedgerMetrics(
  dataDir: string,
  notices: string[],
): Promise<{ ledger: DataRepoStatus["ledger"]; rawLedger: SyncLedger }> {
  try {
    const rawLedger = await loadSyncLedger(dataDir);
    return {
      ledger: summarizeLedgerRecords(rawLedger),
      rawLedger,
    };
  } catch (cause) {
    const msg = cause instanceof Error ? cause.message : String(cause);
    notices.push(`读取同步台账失败: ${msg}`);
    return {
      ledger: createEmptyLedgerMetrics(),
      rawLedger: {},
    };
  }
}

async function checkSingleRunDir(
  runDir: string,
  runId: string,
  rawLedger: SyncLedger,
): Promise<{ isPending: boolean; isIncomplete: boolean }> {
  const runJsonPath = join(runDir, "run.json");
  try {
    const text = await readFile(runJsonPath, "utf8");
    const run = JSON.parse(text) as { inProgress?: boolean };
    if (run.inProgress === true) {
      return { isPending: false, isIncomplete: true };
    }
    const isPending = rawLedger[runId] === undefined;
    return { isPending, isIncomplete: false };
  } catch {
    return { isPending: false, isIncomplete: true };
  }
}

async function collectLocalRuns(
  dataDir: string,
  rawLedger: SyncLedger,
  notices: string[],
): Promise<DataRepoStatus["local"]> {
  const runsDir = join(dataDir, "runs");
  try {
    const entries = await readdir(runsDir, { withFileTypes: true });
    const dirNames = entries.filter((e) => e.isDirectory()).map((e) => e.name);
    const pending: string[] = [];
    const rejected: string[] = [];
    let incomplete = 0;

    for (const runId of dirNames) {
      const outcome = await checkSingleRunDir(join(runsDir, runId), runId, rawLedger);
      if (outcome.isIncomplete) incomplete += 1;
      if (outcome.isPending) pending.push(runId);
      const ledgerEntry = rawLedger[runId];
      if (ledgerEntry?.status === "skipped" && ledgerEntry.reason === "rejected") {
        rejected.push(runId);
      }
    }
    pending.sort((a, b) => b.localeCompare(a));
    rejected.sort((a, b) => b.localeCompare(a));
    return { totalRuns: dirNames.length, pending, incomplete, rejected };
  } catch {
    return { totalRuns: 0, pending: [], incomplete: 0, rejected: [] };
  }
}

async function resolveRepoState(
  config: AppConfig,
  rawPath: string,
  options: CollectDataRepoStatusOptions | undefined,
  notices: string[],
): Promise<{
  repo: DataRepoStatus["repo"];
  manifest: DataRepoStatus["manifest"];
  github?: GithubConnection;
  pushCapability?: PushCapability;
}> {
  const repoPath = config.dataRepo?.path;
  if (!repoPath) return { repo: null, manifest: null };

  if (existsSync(repoPath)) {
    const inspection = await inspectGitRepo(repoPath);
    if (!inspection.isGitRepo) notices.push("数据仓目录不是有效的 Git 仓库");
    const manifest = await readDataRepoManifest(repoPath);
    return { repo: { path: rawPath, ...inspection }, manifest };
  }

  if (externalRunner()) {
    const fetchStatus =
      options?.fetchRunnerStatus ?? (() => requestRunnerDataRepoStatus(options?.timeoutMs));
    const runnerRes = await fetchStatus().catch(() => null);
    if (runnerRes) return runnerRes;
    notices.push("执行器代答数据仓状态不可得");
    return { repo: null, manifest: null };
  }

  notices.push(`数据仓路径不可达：${rawPath}`);
  return {
    repo: {
      path: rawPath,
      reachable: false,
      isGitRepo: false,
      clean: false,
      branch: null,
      upstream: null,
      ahead: null,
      behind: null,
      aheadCommits: [],
    },
    manifest: null,
  };
}

/**
 * 聚合当前数据仓状态，供所有者面板回显。
 */
export async function collectDataRepoStatus(
  config: AppConfig,
  options?: CollectDataRepoStatusOptions,
): Promise<DataRepoStatus> {
  const configured = config.dataRepo !== null && config.dataRepo !== undefined;
  const deploy = { readonly: isReadonly(), externalRunner: externalRunner() };
  const dataDir = options?.dataDir ?? dataRoot();
  const rawPath = options?.rawPath ?? getRawDataRepoPath(config, options?.configPath);
  const notices: string[] = [];

  const { ledger, rawLedger } = await collectLedgerMetrics(dataDir, notices);
  const local = await collectLocalRuns(dataDir, rawLedger, notices);
  const lastAction = await readLastAction(dataDir);
  const repoState = configured
    ? await resolveRepoState(config, rawPath, options, notices)
    : { repo: null, manifest: null };

  const { github, pushCapability } = await resolveGithubAndPushCapability(
    deploy.externalRunner,
    repoState.github,
    repoState.pushCapability,
    options?.secretsDir,
  );

  return {
    configured,
    deploy,
    repo: repoState.repo,
    manifest: repoState.manifest,
    ledger,
    local,
    lastAction,
    notice: notices.length > 0 ? notices.join("；") : null,
    github,
    pushCapability,
  };
}

async function resolveGithubAndPushCapability(
  external: boolean,
  runnerGithub?: GithubConnection,
  runnerCapability?: PushCapability,
  secretsDir?: string,
): Promise<{ github: GithubConnection; pushCapability: PushCapability }> {
  if (external) {
    const fallbackGithub: GithubConnection = {
      state: "disconnected",
      login: null,
      appSlug: null,
      appSettingsUrl: null,
    };
    return {
      github: runnerGithub ?? fallbackGithub,
      pushCapability: runnerCapability ?? "unavailable",
    };
  }
  const github = await readGithubConnection(secretsDir);
  const pushCapability: PushCapability =
    github.state === "connected" ? "github-app" : "host-credentials";
  return { github, pushCapability };
}

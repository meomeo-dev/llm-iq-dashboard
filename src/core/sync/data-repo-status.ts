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
import { runIdTime } from "../store";
import { externalRunner } from "../runner-link";
import { describeCheckout, sameGithubRepo } from "./data-repo-checkout";
import { inspectGitRepo } from "./data-repo-git";
import type {
  DataRepoStatus,
  GithubConnection,
  PendingAttempt,
  PendingRun,
  PushCapability,
  SyncActionResult,
} from "./data-repo-panel-types";
import { attemptKey } from "./attempt-selection";
import { isDiscarded } from "./ledger-decisions";
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
      empty: 0,
      discarded: 0,
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

/** 开始后不超过这个时长的未完成轮次视为仍在执行；更早的视为已中断（进程退出、未收尾） */
const RUNNING_WINDOW_MS = 6 * 60 * 60 * 1000;

type LocalRunState = "completed" | "running" | "interrupted";

/** 未完成轮次按开始时刻分成"仍在执行"与"已中断"，目录名不含时刻的一律视为中断 */
function classifyUnfinished(runId: string, now: number): LocalRunState {
  const startedAt = runIdTime(runId);
  if (startedAt === null) return "interrupted";
  return now - startedAt.getTime() <= RUNNING_WINDOW_MS ? "running" : "interrupted";
}

interface LocalAttemptShape {
  targetId?: string;
  promptId?: string;
  cli?: string;
  model?: string;
  effort?: string;
  status?: string;
  profile?: string;
  svgFile?: string | null;
}

interface LocalRunShape {
  inProgress?: boolean;
  prompts?: Array<{ promptId?: string }>;
  attempts?: LocalAttemptShape[];
}

function toPendingAttempt(attempt: LocalAttemptShape): PendingAttempt | null {
  const { targetId, promptId } = attempt;
  if (typeof targetId !== "string" || typeof promptId !== "string") return null;
  return {
    key: attemptKey({ targetId, promptId }),
    promptId,
    cli: attempt.cli ?? "",
    model: attempt.model ?? "",
    effort: attempt.effort ?? "",
    ...(typeof attempt.profile === "string" ? { profile: attempt.profile } : {}),
    status: attempt.status ?? "",
    svgFile: typeof attempt.svgFile === "string" ? attempt.svgFile : null,
  };
}

/** 待导出轮次的摘要：题目按记录顺序去重，上游按首次出现去重 */
function summarizePendingRun(runId: string, run: LocalRunShape): PendingRun {
  const attempts = run.attempts ?? [];
  const items = attempts.map(toPendingAttempt).filter((item): item is PendingAttempt => item !== null);
  const promptIds = [...new Set([
    ...(run.prompts ?? []).map((prompt) => prompt.promptId),
    ...attempts.map((attempt) => attempt.promptId),
  ])].filter((id): id is string => typeof id === "string");
  const profiles = [...new Set(attempts.map((attempt) => attempt.profile))]
    .filter((name): name is string => typeof name === "string");
  const ok = attempts.filter((attempt) => attempt.status === "ok").length;
  return { runId, promptIds, attempts: attempts.length, ok, profiles, items };
}

async function checkSingleRunDir(
  runDir: string,
  runId: string,
  rawLedger: SyncLedger,
  now: number,
): Promise<{ pending: PendingRun | null; state: LocalRunState }> {
  const runJsonPath = join(runDir, "run.json");
  try {
    const text = await readFile(runJsonPath, "utf8");
    const run = JSON.parse(text) as LocalRunShape;
    if (run.inProgress === true) {
      return { pending: null, state: classifyUnfinished(runId, now) };
    }
    const pending = rawLedger[runId] === undefined ? summarizePendingRun(runId, run) : null;
    return { pending, state: "completed" };
  } catch {
    return { pending: null, state: classifyUnfinished(runId, now) };
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
    const pendingRuns: PendingRun[] = [];
    const rejected: string[] = [];
    const discarded: string[] = [];
    let running = 0;
    let interrupted = 0;
    const now = Date.now();

    for (const runId of dirNames) {
      const outcome = await checkSingleRunDir(join(runsDir, runId), runId, rawLedger, now);
      if (outcome.state === "running") running += 1;
      if (outcome.state === "interrupted") interrupted += 1;
      if (outcome.pending !== null) pendingRuns.push(outcome.pending);
      const ledgerEntry = rawLedger[runId];
      if (ledgerEntry?.status === "skipped" && ledgerEntry.reason === "rejected") {
        rejected.push(runId);
      }
      if (isDiscarded(ledgerEntry)) discarded.push(runId);
    }
    pendingRuns.sort((a, b) => b.runId.localeCompare(a.runId));
    rejected.sort((a, b) => b.localeCompare(a));
    discarded.sort((a, b) => b.localeCompare(a));
    return {
      totalRuns: dirNames.length,
      pending: pendingRuns.map((run) => run.runId),
      pendingRuns,
      incomplete: running + interrupted,
      running,
      interrupted,
      rejected,
      discarded,
    };
  } catch {
    return {
      totalRuns: 0, pending: [], pendingRuns: [], incomplete: 0, running: 0, interrupted: 0, rejected: [], discarded: [],
    };
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
      originUrl: null,
      ahead: null,
      behind: null,
      aheadCommits: [],
    },
    manifest: null,
  };
}

/** 配置了仓地址且本地副本是 git 仓时比对 origin；对不上写进 notices，面板据此报警并拒绝同步 */
function detectRemoteMismatch(
  repository: string | null,
  repo: DataRepoStatus["repo"],
  notices: string[],
): boolean {
  if (repository === null || repo === null || !repo.isGitRepo) return false;
  const originUrl = repo.originUrl ?? null;
  if (sameGithubRepo(repository, originUrl)) return false;
  const note = describeCheckout({ kind: "mismatch", repository, originUrl });
  if (note !== null) notices.push(note);
  return true;
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
  const repository = config.dataRepo?.repository ?? null;
  const remoteMismatch = detectRemoteMismatch(repository, repoState.repo, notices);

  const { github, pushCapability } = await resolveGithubAndPushCapability(
    deploy.externalRunner,
    repoState.github,
    repoState.pushCapability,
    options?.secretsDir,
  );

  return {
    configured,
    repository,
    autoSync: config.dataRepo?.autoSync === true,
    deploy,
    repo: repoState.repo === null ? null : { ...repoState.repo, remoteMismatch },
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

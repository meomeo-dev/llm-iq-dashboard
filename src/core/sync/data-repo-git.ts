/**
 * 数据仓 Git 操作适配器（data-repo-git）。
 *
 * 约定：
 * 1. 开始前必须保持工作区干净（git status --porcelain 为空）；
 * 2. 一次同步生成一个提交，message 为 `chore(data): sync <N> run(s)`，正文列出 runId；
 * 3. --push 时执行 git push（绝不使用 force）；
 * 4. 原样继承环境变量（不覆盖 GIT_CONFIG_GLOBAL / GIT_CONFIG_SYSTEM）；
 * 5. 命令带超时（push/fetch 120s，其余 30s）。
 */

import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const LONG_TIMEOUT_MS = 120_000;
const SHORT_TIMEOUT_MS = 30_000;



export interface GitExecOptions {
  timeoutMs?: number;
  gitArgs?: string[];
  env?: Record<string, string | undefined>;
}

export interface GitPushEnv {
  env?: Record<string, string>;
  gitArgs?: string[];
}

/**
 * 执行 Git 命令并返回 stdout。
 * push/fetch 默认 120s 超时，其余命令 30s 超时。
 */
export async function gitExec(
  repoDir: string,
  args: string[],
  customTimeoutOrOptions?: number | GitExecOptions,
): Promise<string> {
  const isLong = args.some((a) => a === "push" || a === "fetch");
  const options =
    typeof customTimeoutOrOptions === "object"
      ? customTimeoutOrOptions
      : { timeoutMs: customTimeoutOrOptions };
  const timeout = options.timeoutMs ?? (isLong ? LONG_TIMEOUT_MS : SHORT_TIMEOUT_MS);
  const gitArgs = options.gitArgs ?? [];
  const execEnv = options.env ? { ...process.env, ...options.env } : process.env;
  const fullArgs = [...gitArgs, "-C", repoDir, ...args];

  try {
    const { stdout } = await execFileAsync("git", fullArgs, {
      encoding: "utf8",
      timeout,
      env: execEnv,
    });
    return stdout;
  } catch (error) {
    const err = error as NodeJS.ErrnoException & {
      killed?: boolean;
      signal?: string;
    };
    if (err.code === "ETIMEDOUT" || err.killed) {
      const timeoutSec = Math.round(timeout / 1000);
      throw new Error(
        `Git 命令执行超时（超过 ${timeoutSec} 秒）：git ${args.join(" ")}`,
      );
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Git 命令执行失败 (git ${args.join(" ")}): ${message}`);
  }
}

/**
 * 校验数据仓工作区是否干净。
 */
export async function assertRepoClean(repoDir: string): Promise<void> {
  const status = await gitExec(repoDir, ["status", "--porcelain"]);
  if (status.trim() !== "") {
    throw new Error("数据仓工作区不干净，请先提交或清理未提交的修改后再同步");
  }
}

/**
 * 校验数据仓是否已配置 Git 提交身份（user.name 与 user.email）。
 * 缺失时抛出清晰中文错误提示。
 */
export async function assertGitUserConfigured(repoDir: string): Promise<void> {
  let name = "";
  let email = "";
  try {
    name = (await gitExec(repoDir, ["config", "user.name"])).trim();
  } catch {
    name = "";
  }
  try {
    email = (await gitExec(repoDir, ["config", "user.email"])).trim();
  } catch {
    email = "";
  }
  if (!name || !email) {
    throw new Error(
      "数据仓未配置 Git 提交身份 (user.name/user.email)，请在数据仓内执行 " +
        'git config user.name "..." 与 git config user.email "..." 进行设置',
    );
  }
}

/**
 * 获取当前分支对应的上游追踪分支。
 * 若尚未设置上游则返回 null。
 */
export async function getUpstream(repoDir: string): Promise<string | null> {
  try {
    const stdout = await gitExec(repoDir, ["rev-parse", "--abbrev-ref", "@{u}"]);
    const trimmed = stdout.trim();
    return trimmed.length > 0 ? trimmed : null;
  } catch {
    return null;
  }
}

/**
 * 若存在上游分支，先拉取并执行快进合并。
 * 无法快进合并时中止并报错。若无上游则直接跳过。
 */
export async function fetchAndFastForward(repoDir: string): Promise<void> {
  const upstream = await getUpstream(repoDir);
  if (upstream === null) {
    return;
  }

  await gitExec(repoDir, ["fetch"]);
  try {
    await gitExec(repoDir, ["merge", "--ff-only", "@{u}"]);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`远程分支无法快进合并 (git merge --ff-only @{u})：${msg}`);
  }
}

/**
 * 暂存已导出的数据并创建提交。
 * 若无变更则返回 null。
 */
export async function commitSync(
  repoDir: string,
  runIds: readonly string[],
): Promise<string | null> {
  await gitExec(repoDir, ["add", "-A"]);
  const status = await gitExec(repoDir, ["status", "--porcelain"]);
  if (status.trim() === "") {
    return null;
  }

  await assertGitUserConfigured(repoDir);

  const subject = `chore(data): sync ${runIds.length} run(s)`;
  const body = runIds.map((id) => `- ${id}`).join("\n");
  const message = `${subject}\n\n${body}\n`;

  await gitExec(repoDir, ["commit", "-m", message]);
  const sha = await gitExec(repoDir, ["rev-parse", "HEAD"]);
  return sha.trim();
}

export interface GitPushTarget {
  remote: string;
  pushUrl: string;
  upstreamBranch: string;
}

export interface PushTargetRef {
  pushUrl?: string;
  upstreamBranch?: string;
}

/**
 * 获取当前分支的推送目标（remote、pushUrl、上游分支名）。
 */
export async function getPushTarget(repoDir: string): Promise<GitPushTarget> {
  const currentBranch = await getCurrentBranch(repoDir);
  let remote = "origin";
  let upstreamBranch = currentBranch ?? "main";

  if (currentBranch) {
    try {
      const configuredRemote = (
        await gitExec(repoDir, ["config", `branch.${currentBranch}.remote`])
      ).trim();
      if (configuredRemote) remote = configuredRemote;
    } catch {}

    try {
      const configuredMerge = (
        await gitExec(repoDir, ["config", `branch.${currentBranch}.merge`])
      ).trim();
      if (configuredMerge) {
        upstreamBranch = configuredMerge.replace(/^refs\/heads\//, "");
      }
    } catch {}
  }

  const pushUrl = (
    await gitExec(repoDir, ["remote", "get-url", "--push", remote])
  ).trim();
  return { remote, pushUrl, upstreamBranch };
}

/**
 * 推送当前分支到远端（绝不 force）。
 * 仅在显式传入 pushEnv 时使用 App 推送环境；不传则使用宿主机默认凭据。
 * 可选 target 指定目标 pushUrl 与上游分支名（HEAD:<upstreamBranch>）。
 */
export async function pushCurrentBranch(
  repoDir: string,
  pushEnv?: GitPushEnv,
  target?: PushTargetRef,
): Promise<void> {
  const args = ["push"];
  if (target?.pushUrl && target?.upstreamBranch) {
    args.push(target.pushUrl, `HEAD:${target.upstreamBranch}`);
  }
  if (pushEnv) {
    await gitExec(repoDir, args, {
      gitArgs: pushEnv.gitArgs,
      env: pushEnv.env,
    });
  } else {
    await gitExec(repoDir, args);
  }
}

/**
 * 校验指定提交是否已被上游包含；若未包含先 fetch 远端后再校验。
 */
export async function verifyUpstreamContains(
  repoDir: string,
  commitSha: string,
  upstreamBranch?: string,
  pushEnv?: GitPushEnv,
): Promise<boolean> {
  let contained = await isCommitInUpstream(repoDir, commitSha, upstreamBranch);
  if (!contained) {
    try {
      await gitExec(
        repoDir,
        ["fetch"],
        pushEnv ? { gitArgs: pushEnv.gitArgs, env: pushEnv.env } : undefined,
      );
      contained = await isCommitInUpstream(repoDir, commitSha, upstreamBranch);
    } catch {}
  }
  return contained;
}

/**
 * 校验指定提交是否已被上游分支包含（merge-base --is-ancestor）。
 */
export async function isCommitInUpstream(
  repoDir: string,
  commitSha: string,
  upstreamBranch?: string,
): Promise<boolean> {
  let upstream = upstreamBranch;
  if (!upstream) {
    const detected = await getUpstream(repoDir);
    if (detected !== null) {
      upstream = detected;
    } else {
      const currentBranch = (
        await gitExec(repoDir, ["rev-parse", "--abbrev-ref", "HEAD"])
      ).trim();
      upstream = `origin/${currentBranch}`;
    }
  }

  try {
    await gitExec(repoDir, [
      "merge-base",
      "--is-ancestor",
      commitSha,
      upstream,
    ]);
    return true;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("超时")) {
      throw error;
    }
    return false;
  }
}

/**
 * 获取最近一次修改指定目录的提交 SHA。
 */
export async function getDirectoryLatestCommit(
  repoDir: string,
  relativeDirPath: string,
): Promise<string | null> {
  try {
    const stdout = await gitExec(repoDir, [
      "log",
      "-1",
      "--format=%H",
      "--",
      relativeDirPath,
    ]);
    const trimmed = stdout.trim();
    return trimmed.length > 0 ? trimmed : null;
  } catch {
    return null;
  }
}

/**
 * 推送并验证远程分支已包含本次提交（向下兼容包装）。
 */
export async function pushAndVerify(
  repoDir: string,
  commitSha: string,
): Promise<void> {
  await pushCurrentBranch(repoDir);
  const included = await isCommitInUpstream(repoDir, commitSha);
  if (!included) {
    throw new Error(
      `推送后远程分支未包含指定提交 (${commitSha})，推送校验失败`,
    );
  }
}

/**
 * 检查指定目录是否为有效的 Git 仓库。
 */
export async function isGitRepository(repoDir: string): Promise<boolean> {
  if (!existsSync(repoDir)) return false;
  try {
    const stdout = await gitExec(repoDir, ["rev-parse", "--is-inside-work-tree"]);
    return stdout.trim() === "true";
  } catch {
    return false;
  }
}

/**
 * 获取当前所在分支名称；detached HEAD 或无分支时返回 null。
 */
export async function getCurrentBranch(repoDir: string): Promise<string | null> {
  try {
    const stdout = await gitExec(repoDir, ["rev-parse", "--abbrev-ref", "HEAD"]);
    const trimmed = stdout.trim();
    return trimmed.length > 0 && trimmed !== "HEAD" ? trimmed : null;
  } catch {
    return null;
  }
}

/**
 * 检查当前工作区是否干净（无未暂存、暂存或未跟踪文件）。
 */
export async function isWorkingTreeClean(repoDir: string): Promise<boolean> {
  try {
    const stdout = await gitExec(repoDir, ["status", "--porcelain"]);
    return stdout.trim() === "";
  } catch {
    return false;
  }
}

/**
 * 获取本地分支相对于上游的 ahead / behind 提交数。
 * 无上游或执行失败时返回 null。
 */
export async function getAheadBehind(
  repoDir: string,
): Promise<{ ahead: number; behind: number } | null> {
  try {
    const stdout = await gitExec(repoDir, [
      "rev-list",
      "--left-right",
      "--count",
      "@{u}...HEAD",
    ]);
    const parts = stdout.trim().split(/\s+/);
    const behindStr = parts[0];
    const aheadStr = parts[1];
    if (behindStr !== undefined && aheadStr !== undefined) {
      const behind = Number.parseInt(behindStr, 10);
      const ahead = Number.parseInt(aheadStr, 10);
      return {
        ahead: Number.isNaN(ahead) ? 0 : ahead,
        behind: Number.isNaN(behind) ? 0 : behind,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 获取本地领先上游的提交短哈希列表，新的在前。
 * 无上游或无领先提交时返回空数组。
 */
export async function getAheadCommits(repoDir: string): Promise<string[]> {
  try {
    const stdout = await gitExec(repoDir, [
      "rev-list",
      "--abbrev-commit",
      "@{u}..HEAD",
    ]);
    const trimmed = stdout.trim();
    if (trimmed === "") return [];
    return trimmed.split("\n").map((line) => line.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

export interface GitRepoInspection {
  reachable: boolean;
  isGitRepo: boolean;
  clean: boolean;
  branch: string | null;
  upstream: string | null;
  ahead: number | null;
  behind: number | null;
  aheadCommits: string[];
}

function emptyInspection(reachable: boolean): GitRepoInspection {
  return {
    reachable,
    isGitRepo: false,
    clean: false,
    branch: null,
    upstream: null,
    ahead: null,
    behind: null,
    aheadCommits: [],
  };
}

async function collectUpstreamMetrics(
  repoDir: string,
  upstream: string | null,
): Promise<{ ahead: number | null; behind: number | null; aheadCommits: string[] }> {
  if (upstream === null) {
    return { ahead: null, behind: null, aheadCommits: [] };
  }
  const counts = await getAheadBehind(repoDir);
  const aheadCommits = await getAheadCommits(repoDir);
  return {
    ahead: counts?.ahead ?? null,
    behind: counts?.behind ?? null,
    aheadCommits,
  };
}

/**
 * 综合探查数据仓工作副本状态，不抛错，各字段返回明确结果。
 */
export async function inspectGitRepo(repoDir: string): Promise<GitRepoInspection> {
  if (!existsSync(repoDir)) return emptyInspection(false);
  if (!(await isGitRepository(repoDir))) return emptyInspection(true);

  const [clean, branch, upstream] = await Promise.all([
    isWorkingTreeClean(repoDir),
    getCurrentBranch(repoDir),
    getUpstream(repoDir),
  ]);
  const metrics = await collectUpstreamMetrics(repoDir, upstream);

  return {
    reachable: true,
    isGitRepo: true,
    clean,
    branch,
    upstream,
    ahead: metrics.ahead,
    behind: metrics.behind,
    aheadCommits: metrics.aheadCommits,
  };
}



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
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const LONG_TIMEOUT_MS = 120_000;
const SHORT_TIMEOUT_MS = 30_000;

/**
 * 执行 Git 命令并返回 stdout。
 * push/fetch 默认 120s 超时，其余命令 30s 超时。
 */
export async function gitExec(
  repoDir: string,
  args: string[],
  customTimeoutMs?: number,
): Promise<string> {
  const isLong = args.some((a) => a === "push" || a === "fetch");
  const timeout = customTimeoutMs ?? (isLong ? LONG_TIMEOUT_MS : SHORT_TIMEOUT_MS);

  try {
    const { stdout } = await execFileAsync("git", ["-C", repoDir, ...args], {
      encoding: "utf8",
      timeout,
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

  const subject = `chore(data): sync ${runIds.length} run(s)`;
  const body = runIds.map((id) => `- ${id}`).join("\n");
  const message = `${subject}\n\n${body}\n`;

  await gitExec(repoDir, ["commit", "-m", message]);
  const sha = await gitExec(repoDir, ["rev-parse", "HEAD"]);
  return sha.trim();
}

/**
 * 推送当前分支到远端（绝不 force）。
 */
export async function pushCurrentBranch(repoDir: string): Promise<void> {
  await gitExec(repoDir, ["push"]);
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

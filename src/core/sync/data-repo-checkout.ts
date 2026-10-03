/**
 * 数据仓本地副本的准备（ACR-023）。
 *
 * 配置里有 dataRepo.repository 时，执行器启动与同步前把本地路径准备成该仓的工作副本：
 * 路径不存在或是空目录就 clone；已是 git 仓则比对 origin，不一致只报告不动它；
 * 非空又不是 git 仓也只报告。没配地址时什么都不做，仓库仍由本地副本的 origin 决定。
 */

import { existsSync } from "node:fs";
import { mkdir, readdir, realpath } from "node:fs/promises";
import { dirname } from "node:path";
import type { DataRepoConfig } from "../config";
import { getOriginUrl, gitExec } from "./data-repo-git";

export type CheckoutOutcome =
  /** 配置里没有 repository */
  | { kind: "unconfigured" }
  | { kind: "cloned"; repository: string; path: string }
  /** 已是该仓的工作副本 */
  | { kind: "ready"; repository: string; originUrl: string }
  /** 本地副本的 origin 不是配置的仓；originUrl 为 null 表示没有 origin */
  | { kind: "mismatch"; repository: string; originUrl: string | null }
  /** 路径非空又不是 git 仓根目录，不敢动 */
  | { kind: "not-git"; path: string };

export interface EnsureCheckoutOptions {
  log?: (message: string) => void;
  cloneTimeoutMs?: number;
}

/** clone 全仓作品可能很大，比普通 push / fetch 给更长的时间 */
const CLONE_TIMEOUT_MS = 10 * 60_000;

/** GitHub 远程地址的 https 与 ssh 两种写法，取 owner/repo */
const GITHUB_REMOTE_FORMS = [
  /^https:\/\/github\.com\/([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?$/,
  /^git@github\.com:([^/\s]+)\/([^/\s]+?)(?:\.git)?$/,
];

/** 把 GitHub 地址归一成小写的 owner/repo，https 与 ssh 写法指同一仓；认不出来返回 null */
export function githubRepoSlug(url: string): string | null {
  for (const form of GITHUB_REMOTE_FORMS) {
    const [, owner, repo] = form.exec(url.trim()) ?? [];
    if (owner && repo) return `${owner}/${repo}`.toLowerCase();
  }
  return null;
}

/** 配置的仓地址与本地 origin 是否指同一个 GitHub 仓 */
export function sameGithubRepo(repository: string, originUrl: string | null): boolean {
  if (originUrl === null) return false;
  const expected = githubRepoSlug(repository);
  return expected !== null && expected === githubRepoSlug(originUrl);
}

/**
 * 路径是不是一个 git 仓的根目录。只看「在 git 工作树里」不够：数据仓路径若写在
 * 本仓库目录下，空目录也会被判成在工作树里，origin 读到的是外层仓的
 */
async function isRepoRoot(path: string): Promise<boolean> {
  try {
    const toplevel = (await gitExec(path, ["rev-parse", "--show-toplevel"])).trim();
    if (toplevel === "") return false;
    return (await realpath(toplevel)) === (await realpath(path));
  } catch {
    return false;
  }
}

async function isMissingOrEmptyDir(path: string): Promise<boolean> {
  if (!existsSync(path)) return true;
  try {
    return (await readdir(path)).length === 0;
  } catch {
    return false;
  }
}

async function cloneInto(repository: string, path: string, options: EnsureCheckoutOptions): Promise<void> {
  const parent = dirname(path);
  await mkdir(parent, { recursive: true });
  options.log?.(`数据仓：本地没有副本，按 ${repository} clone 到 ${path}`);
  // 私有仓没有凭据时让 git 直接失败，不要停在终端提示上等输入
  await gitExec(parent, ["clone", "--", repository, path], {
    timeoutMs: options.cloneTimeoutMs ?? CLONE_TIMEOUT_MS,
    env: { GIT_TERMINAL_PROMPT: "0" },
  });
  // git 会把 url.<base>.insteadOf 改写后的地址存进 origin；把它钉回配置的地址，
  // 之后的 origin 比对才以配置为准（改写规则在抓取与推送时照样生效）
  await gitExec(path, ["remote", "set-url", "origin", repository]);
}

/**
 * 按配置把数据仓本地副本准备好。只在路径不存在或为空目录时 clone，已有内容绝不覆盖。
 */
export async function ensureDataRepoCheckout(
  config: Pick<DataRepoConfig, "path" | "repository">,
  options: EnsureCheckoutOptions = {},
): Promise<CheckoutOutcome> {
  const { repository, path } = config;
  if (repository === null) return { kind: "unconfigured" };

  if (await isRepoRoot(path)) {
    const originUrl = await getOriginUrl(path);
    if (originUrl !== null && sameGithubRepo(repository, originUrl)) {
      return { kind: "ready", repository, originUrl };
    }
    return { kind: "mismatch", repository, originUrl };
  }

  if (!(await isMissingOrEmptyDir(path))) return { kind: "not-git", path };
  await cloneInto(repository, path, options);
  return { kind: "cloned", repository, path };
}

/** 面板与日志里给人看的一句话 */
export function describeCheckout(outcome: CheckoutOutcome): string | null {
  switch (outcome.kind) {
    case "unconfigured":
    case "ready":
      return null;
    case "cloned":
      return `数据仓已从 ${outcome.repository} clone 到 ${outcome.path}`;
    case "mismatch":
      return outcome.originUrl === null
        ? `数据仓本地副本没有 origin 远程，与配置的 ${outcome.repository} 对不上`
        : `数据仓本地副本的 origin 是 ${outcome.originUrl}，与配置的 ${outcome.repository} 不是同一个仓`;
    case "not-git":
      return `数据仓路径 ${outcome.path} 非空且不是 git 仓，不会自动 clone`;
  }
}

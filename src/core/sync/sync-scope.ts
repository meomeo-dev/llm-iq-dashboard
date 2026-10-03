/**
 * 同步范围与上下文：从生效配置取同步要用的三项（数据仓路径、profile 清单、题目白名单），
 * 并把 SyncOptions 解析成一次同步的上下文（含泄漏指纹）与导出参数。
 */

import { join } from "node:path";
import type { AppConfig } from "../config";
import { buildLeakGuard, credentialFiles, type LeakGuard } from "../leak-guard";
import { dataRoot } from "../paths";
import { profileKeyPath } from "../profile-credentials";
import { toProfileViews } from "../profile-view";
import { describeCheckout, ensureDataRepoCheckout } from "./data-repo-checkout";
import type { ExportOptions } from "./export-run";
import type { SyncOptions } from "./sync-orchestrator";

export type SyncScope = Pick<SyncOptions, "repoPath" | "repository" | "profiles" | "publishPrompts">;

/** 未配置数据仓时抛错 */
export function syncOptionsFromConfig(config: AppConfig): SyncScope {
  if (!config.dataRepo) throw new Error("未配置数据仓 (dataRepo)");
  return {
    repoPath: config.dataRepo.path,
    repository: config.dataRepo.repository,
    profiles: config.profiles,
    publishPrompts: config.dataRepo.publishPrompts,
  };
}

export interface SyncContext {
  dryRun: boolean;
  push: boolean;
  repoPath: string;
  dataDirPath: string;
  runsDir: string;
  leakGuard: LeakGuard;
}

/** 配置了仓地址时先把本地副本准备好；origin 对不上或目录不是 git 仓就中止，不往错的仓里写 */
async function prepareCheckout(options: SyncOptions): Promise<void> {
  if (!options.repository) return;
  const outcome = await ensureDataRepoCheckout(
    { path: options.repoPath, repository: options.repository },
    { log: options.log },
  );
  const note = describeCheckout(outcome);
  if (outcome.kind === "mismatch" || outcome.kind === "not-git") throw new Error(note ?? outcome.kind);
  if (note !== null) options.log?.(note);
}

/**
 * 解析一次同步的上下文；先按配置地址把本地副本准备好（ACR-023），
 * 指纹覆盖三家 CLI 的登录凭据与全部已登记 profile 的 key，与运行阶段同一口径
 */
export async function resolveSyncContext(options: SyncOptions): Promise<SyncContext> {
  await prepareCheckout(options);
  const dryRun = options.dryRun === true;
  const push = options.push === true;
  const repoPath = options.repoPath;
  const dataDirPath = options.dataDir ?? dataRoot();
  const runsDir = join(dataDirPath, "runs");
  const profileKeys = (options.profiles ?? []).map((profile) => profileKeyPath(profile.cli, profile.name));
  const leakGuard = options.leakGuard ?? (await buildLeakGuard([...credentialFiles(), ...profileKeys]));
  return { dryRun, push, repoPath, dataDirPath, runsDir, leakGuard };
}

export function exportOptionsFor(ctx: SyncContext, options: SyncOptions): ExportOptions {
  return {
    runsDir: ctx.runsDir,
    leakGuard: ctx.leakGuard,
    profiles: toProfileViews(options.profiles ?? []),
    publishPrompts: options.publishPrompts ?? null,
  };
}

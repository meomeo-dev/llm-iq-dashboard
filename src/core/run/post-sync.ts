/**
 * 运行结束后的数据仓自动同步与发布确认
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import type { AppConfig } from "../config";
import type { Logger } from "./prepare";
import { confirmPublished, syncDataRepo, syncOptionsFromConfig } from "../sync/sync-orchestrator";

async function performSync(config: AppConfig, runId: string, push: boolean, log: Logger): Promise<void> {
  try {
    await syncDataRepo({
      ...syncOptionsFromConfig(config),
      runIds: [runId],
      push,
      log,
    });
  } catch (syncError) {
    log(`[${runId}] 数据仓自动同步失败：${syncError instanceof Error ? syncError.message : String(syncError)}`);
  }
}

async function performConfirm(repoPath: string, runId: string, log: Logger): Promise<void> {
  try {
    const confirmReport = await confirmPublished({
      repoPath,
      log,
    });
    if (confirmReport.confirmed.length > 0) {
      log(
        `[${runId}] 数据仓发布确认：新确认 ${confirmReport.confirmed.length} 轮已发布 (${confirmReport.confirmed.join(", ")})`,
      );
    }
  } catch (confirmError) {
    log(`[${runId}] 数据仓发布确认失败：${confirmError instanceof Error ? confirmError.message : String(confirmError)}`);
  }
}

export async function postRunSync(config: AppConfig, runId: string, log: Logger): Promise<void> {
  if (!config.dataRepo?.autoSync) return;
  const repoPath = config.dataRepo.path;
  if (!existsSync(repoPath) || !existsSync(join(repoPath, ".git"))) {
    log(`[${runId}] 数据仓目录未挂载或不是 Git 仓库 (${repoPath})，跳过自动同步`);
    return;
  }

  await performSync(config, runId, config.dataRepo.push, log);
  if (!config.dataRepo.push) {
    await performConfirm(repoPath, runId, log);
  }
}

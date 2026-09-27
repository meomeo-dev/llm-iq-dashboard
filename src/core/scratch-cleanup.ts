/**
 * 临时工作目录的清理：本轮结束后删除自己的目录；开始前清理被中断轮次留下的孤儿目录。
 */

import { readdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { dataRoot } from "./paths";
import type { Logger } from "./runner";

/** 删除本轮的临时工作目录 */
export async function discardScratch(runId: string): Promise<void> {
  await rm(join(dataRoot(), "scratch", runId), { recursive: true, force: true });
}

/**
 * 早于此时长的残留临时目录视为孤儿。须远大于单次调用超时上限（max 档 45 分钟），
 * 以免误删另一进程（调度器或手动执行）正在使用的工作目录。
 */
const ORPHAN_SCRATCH_AGE_MS = 3 * 60 * 60 * 1000;

/**
 * 清理被中断轮次（Ctrl-C、重启、崩溃，discardScratch 未执行）留下的临时目录；
 * 失败只记日志，不影响本轮执行。
 */
export async function pruneOrphanScratch(log: Logger): Promise<void> {
  const root = join(dataRoot(), "scratch");
  let entries: string[];
  try {
    entries = await readdir(root);
  } catch {
    return; // 目录不存在即无可清理
  }

  const cutoff = Date.now() - ORPHAN_SCRATCH_AGE_MS;
  for (const name of entries) {
    const path = join(root, name);
    try {
      if ((await stat(path)).mtimeMs < cutoff) {
        await rm(path, { recursive: true, force: true });
        log(`清理残留临时目录 scratch/${name}`);
      }
    } catch (cause) {
      log(`清理 scratch/${name} 失败：${cause instanceof Error ? cause.message : cause}`);
    }
  }
}

/**
 * 数据仓同步动作互斥锁（data-repo-action-lock）。
 *
 * 结合进程内标记（globalThis）与文件标记（data-repo-sync.lock），
 * 防止同一时刻多个同步动作（演练、导出、发布确认、推送）并发执行。
 */

import { existsSync } from "node:fs";
import { readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { dataRoot } from "../paths";

const SYNC_LOCK_SYMBOL = Symbol.for("pelican.dataRepoSyncInFlight");
const LOCK_FILE_NAME = "data-repo-sync.lock";
const LOCK_STALE_MS = 10 * 60 * 1000;

interface GlobalLockHolder {
  [SYNC_LOCK_SYMBOL]?: boolean;
}

export interface SyncLockResult {
  acquired: boolean;
  release: () => Promise<void>;
  reason?: string;
}

export function syncLockFilePath(customDataDir?: string): string {
  return join(customDataDir ?? dataRoot(), LOCK_FILE_NAME);
}

async function isFileLockActive(lockFile: string): Promise<boolean> {
  if (!existsSync(lockFile)) return false;
  try {
    const text = await readFile(lockFile, "utf8");
    const data = JSON.parse(text) as { lockedAt?: string };
    if (!data.lockedAt) return false;
    const elapsed = Date.now() - Date.parse(data.lockedAt);
    return elapsed < LOCK_STALE_MS;
  } catch {
    return false;
  }
}

/**
 * 尝试获取同步动作互斥锁。成功返回 release 函数，失败返回 reason。
 */
export async function acquireDataRepoSyncLock(
  customDataDir?: string,
): Promise<SyncLockResult> {
  const holder = globalThis as GlobalLockHolder;
  if (holder[SYNC_LOCK_SYMBOL] === true) {
    return {
      acquired: false,
      release: async () => {},
      reason: "已有一个数据仓动作正在执行",
    };
  }

  const lockFile = syncLockFilePath(customDataDir);
  if (await isFileLockActive(lockFile)) {
    return {
      acquired: false,
      release: async () => {},
      reason: "已有一个数据仓动作正在执行",
    };
  }

  holder[SYNC_LOCK_SYMBOL] = true;
  try {
    const payload = JSON.stringify({
      lockedAt: new Date().toISOString(),
      pid: process.pid,
    });
    await writeFile(lockFile, `${payload}\n`, "utf8");
  } catch {
    // 写入文件失败时回滚内存锁
    holder[SYNC_LOCK_SYMBOL] = false;
    return {
      acquired: false,
      release: async () => {},
      reason: "创建同步锁文件失败",
    };
  }

  return {
    acquired: true,
    release: async () => {
      holder[SYNC_LOCK_SYMBOL] = false;
      await unlink(lockFile).catch(() => {});
    },
  };
}

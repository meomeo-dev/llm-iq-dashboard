/**
 * 数据仓同步动作互斥锁（data-repo-action-lock）。
 *
 * 结合进程内标记（globalThis）与文件标记（data-repo-sync.lock），
 * 防止同一时刻多个同步动作（演练、导出、发布确认、推送）并发执行。
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
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

function buildRelease(holder: GlobalLockHolder, lockFile: string, token: string): () => Promise<void> {
  return async () => {
    holder[SYNC_LOCK_SYMBOL] = false;
    try {
      const raw = await readFile(lockFile, "utf8");
      const parsed = JSON.parse(raw) as { token?: string };
      if (parsed.token !== undefined && parsed.token !== token) return;
      await unlink(lockFile);
    } catch {
      // 忽略删除异常
    }
  };
}

/**
 * 尝试获取同步动作互斥锁。成功返回 release 函数，失败返回 reason。
 */
export async function acquireDataRepoSyncLock(
  customDataDir?: string,
): Promise<SyncLockResult> {
  const holder = globalThis as GlobalLockHolder;
  if (holder[SYNC_LOCK_SYMBOL] === true) {
    return { acquired: false, release: async () => {}, reason: "已有一个数据仓动作正在执行" };
  }

  holder[SYNC_LOCK_SYMBOL] = true;
  const lockFile = syncLockFilePath(customDataDir);
  const token = `${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    await mkdir(dirname(lockFile), { recursive: true });
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const payload = JSON.stringify({ lockedAt: new Date().toISOString(), pid: process.pid, token });
        await writeFile(lockFile, `${payload}\n`, { encoding: "utf8", flag: "wx" });
        return { acquired: true, release: buildRelease(holder, lockFile, token) };
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== "EEXIST") throw err;
        if (await isFileLockActive(lockFile)) {
          holder[SYNC_LOCK_SYMBOL] = false;
          return { acquired: false, release: async () => {}, reason: "已有一个数据仓动作正在执行" };
        }
        await unlink(lockFile).catch(() => {});
      }
    }
  } catch {
    // 写入文件失败时回滚内存锁
  }

  holder[SYNC_LOCK_SYMBOL] = false;
  return { acquired: false, release: async () => {}, reason: "创建同步锁文件失败" };
}

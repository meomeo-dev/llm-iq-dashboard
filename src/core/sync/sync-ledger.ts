/**
 * 同步台账（sync-ledger）。
 *
 * 持久化于 `<PELICAN_DATA_DIR>/sync-state.json`。
 * 记录每个 runId 的同步状态：
 * - exported：已导出并生成本地提交，尚未确认推送到远程
 * - published：已推送并经远程分支祖先校验确认包含
 */

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { dataRoot } from "../paths";
import type { Redaction } from "../data-repo/contract";

export type SyncStatus = "exported" | "published";

export interface RunSyncRecord {
  status: SyncStatus;
  exportedAt: string;
  commit?: string;
  publishedAt?: string;
  redactions: Redaction[];
}

export type SyncLedger = Record<string, RunSyncRecord>;

export const SYNC_LEDGER_FILE = "sync-state.json";

export function syncLedgerPath(customDataDir?: string): string {
  const root = customDataDir ?? dataRoot();
  return join(root, SYNC_LEDGER_FILE);
}

/**
 * 读取同步台账。仅当文件不存在（ENOENT）时返回空对象（等价于全部未发布）。
 * JSON 损坏或格式错误时报错中止。
 */
export async function loadSyncLedger(
  customDataDir?: string,
): Promise<SyncLedger> {
  const filePath = syncLedgerPath(customDataDir);
  try {
    const text = await readFile(filePath, "utf8");
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (parseErr) {
      const msg =
        parseErr instanceof Error ? parseErr.message : String(parseErr);
      throw new Error(`同步台账 ${filePath} JSON 损坏: ${msg}`);
    }
    if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as SyncLedger;
    }
    throw new Error(`同步台账 ${filePath} 格式错误，期望 JSON 对象`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

/**
 * 原子写入同步台账：写 staging 文件后 rename，避免并发读到半写文件。
 */
export async function saveSyncLedger(
  ledger: SyncLedger,
  customDataDir?: string,
): Promise<void> {
  const target = syncLedgerPath(customDataDir);
  const dir = dirname(target);
  await mkdir(dir, { recursive: true });

  const staging = `${target}.staging`;
  const content = `${JSON.stringify(ledger, null, 2)}\n`;
  await writeFile(staging, content, "utf8");
  await rename(staging, target);
}

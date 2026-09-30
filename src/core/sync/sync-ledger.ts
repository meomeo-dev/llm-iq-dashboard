/**
 * 同步台账（sync-ledger）。
 *
 * 持久化于 `<PELICAN_DATA_DIR>/sync-state.json`。
 * 记录每个 runId 的同步状态：
 * - exported：已导出并生成本地提交，尚未确认推送到远程
 * - published：已推送并经远程分支祖先校验确认包含
 * - skipped：不发布，reason 说明原因；discarded 为所有者在面板上丢弃，可恢复
 */

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { dataRoot } from "../paths";
import type { Redaction } from "../data-repo/contract";

export type SyncStatus = "exported" | "published" | "skipped";

/**
 * empty：轮次结束时没有任何完成的调用（如刚开始就被取消），没有可发布的内容；
 * discarded：所有者在面板上丢弃，见 ledger-decisions.ts
 */
export type SkipReason = "unpublishable-prompt" | "rejected" | "abandoned" | "empty" | "discarded";

export interface NormalRunSyncRecord {
  status: "exported" | "published";
  exportedAt: string;
  commit?: string;
  publishedAt?: string;
  redactions: Redaction[];
  /** 只导出了部分调用时的子集（attemptKey），再次评估沿用；整轮导出时缺省 */
  attempts?: string[];
}

export interface SkippedRunSyncRecord {
  status: "skipped";
  reason: SkipReason;
  skippedAt: string;
  details?: Array<{ file: string; reason: string }>;
  exportedAt?: string;
  commit?: string;
  publishedAt?: string;
  redactions?: Redaction[];
}

export type RunSyncRecord = NormalRunSyncRecord | SkippedRunSyncRecord;

export type SyncLedger = Record<string, RunSyncRecord>;

export const SYNC_LEDGER_FILE = "sync-state.json";

export function syncLedgerPath(customDataDir?: string): string {
  const root = customDataDir ?? dataRoot();
  return join(root, SYNC_LEDGER_FILE);
}

const VALID_SKIP_REASONS = new Set<string>([
  "unpublishable-prompt",
  "rejected",
  "abandoned",
  "empty",
  "discarded",
]);

function validateLedgerRecord(
  runId: string,
  record: unknown,
  filePath: string,
): void {
  if (record === null || typeof record !== "object" || Array.isArray(record)) {
    throw new Error(`同步台账 ${filePath} 格式错误: 记录 ${runId} 不是有效对象`);
  }
  const rec = record as Record<string, unknown>;
  const status = rec.status;
  if (status !== "exported" && status !== "published" && status !== "skipped") {
    throw new Error(
      `同步台账 ${filePath} 格式错误: 记录 ${runId} 包含未知的 status "${String(status)}"`,
    );
  }
  if (status === "skipped") {
    if (typeof rec.reason !== "string" || !VALID_SKIP_REASONS.has(rec.reason)) {
      throw new Error(
        `同步台账 ${filePath} 格式错误: 记录 ${runId} skipped 缺少有效 reason "${String(rec.reason)}"`,
      );
    }
    if (typeof rec.skippedAt !== "string" || rec.skippedAt.trim() === "") {
      throw new Error(
        `同步台账 ${filePath} 格式错误: 记录 ${runId} skipped 缺少 skippedAt`,
      );
    }
  }
  const attemptsValid = Array.isArray(rec.attempts) && rec.attempts.every((key) => typeof key === "string");
  if (rec.attempts !== undefined && !attemptsValid) {
    throw new Error(`同步台账 ${filePath} 格式错误: 记录 ${runId} 的 attempts 必须是字符串数组`);
  }
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
      const ledgerObj = parsed as Record<string, unknown>;
      for (const [runId, record] of Object.entries(ledgerObj)) {
        validateLedgerRecord(runId, record, filePath);
      }
      return ledgerObj as SyncLedger;
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

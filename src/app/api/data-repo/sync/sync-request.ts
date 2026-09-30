/**
 * 解析并校验数据仓同步动作请求体（POST /api/data-repo/sync）。
 */

import { dayPartition } from "@/core/data-repo/contract";
import type {
  SyncActionMode,
  SyncActionRequest,
} from "@/core/sync/data-repo-panel-types";

const VALID_MODES = new Set<SyncActionMode>([
  "dry-run",
  "export",
  "confirm",
  "push",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseConfirmation(
  raw: unknown,
  mode: SyncActionMode,
): { aheadCommits: string[] } | undefined {
  if (mode === "push") {
    if (!isRecord(raw)) {
      throw new Error("push 模式必须提供 confirmation 确认对象");
    }
    if (!Array.isArray(raw.aheadCommits) || !raw.aheadCommits.every((c) => typeof c === "string")) {
      throw new Error("push 模式必须提供 confirmation.aheadCommits 字符串数组");
    }
    return { aheadCommits: raw.aheadCommits as string[] };
  }
  if (isRecord(raw) && Array.isArray(raw.aheadCommits) && raw.aheadCommits.every((c) => typeof c === "string")) {
    return { aheadCommits: raw.aheadCommits as string[] };
  }
  return undefined;
}

/** runIds：缺省为全部；给了就必须是非空的 runId 数组（空数组会被编排器当作全部，这里拒绝） */
function parseRunIds(raw: unknown): string[] | undefined {
  if (raw === undefined || raw === null) return undefined;
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error("runIds 必须是非空的 runId 数组");
  }
  const runIds = [...new Set(raw)];
  for (const item of runIds) {
    if (typeof item !== "string" || dayPartition(item) === null) {
      throw new Error(`runIds 含有非法的 runId: ${String(item)}`);
    }
  }
  return runIds as string[];
}

/**
 * 解析并校验同步请求体。非法时抛出明确中文错误。
 */
export function parseSyncActionRequest(text: string): SyncActionRequest {
  if (text.trim() === "") {
    throw new Error("请求体不能为空");
  }
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch (cause) {
    const msg = cause instanceof Error ? cause.message : String(cause);
    throw new Error(`JSON 解析失败: ${msg}`);
  }

  if (!isRecord(body)) {
    throw new Error("请求体必须是 JSON 对象");
  }

  const mode = body.mode as SyncActionMode;
  if (!VALID_MODES.has(mode)) {
    throw new Error(`未知的同步模式: ${String(body.mode)}，仅支持 dry-run、export、confirm、push`);
  }

  const confirmation = parseConfirmation(body.confirmation, mode);
  const runIds = parseRunIds(body.runIds);
  return {
    mode,
    ...(runIds !== undefined ? { runIds } : {}),
    ...(confirmation !== undefined ? { confirmation } : {}),
  };
}

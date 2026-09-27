/**
 * 事件流（JSONL）的安全取值原语。各家 CLI 的事件字段随版本变化，取不到时返回
 * null，使格式变化只导致少识别信息而不抛错。
 */

export type JsonRecord = Record<string, unknown>;

/** 解析一行 JSON 对象；非 JSON 行（CLI 夹带的日志）返回 null */
export function parseJsonLine(line: string): JsonRecord | null {
  try {
    return asRecord(JSON.parse(line));
  } catch {
    return null;
  }
}

export function asRecord(value: unknown): JsonRecord | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  return value as JsonRecord;
}

export function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

/** 取有限数值；缺失或非数值返回 null */
export function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/** 沿键路径逐层取对象，任何一层缺失即返回 null */
export function recordAt(root: JsonRecord | null, ...keys: string[]): JsonRecord | null {
  let current: JsonRecord | null = root;
  for (const key of keys) {
    if (current === null) return null;
    current = asRecord(current[key]);
  }
  return current;
}

/** 取 stderr 的最后几行作为失败说明；CLI 报错通常在末尾 */
export function tailLines(text: string, count: number): string {
  return text.trim().split("\n").slice(-count).join("\n");
}

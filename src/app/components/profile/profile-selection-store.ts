/**
 * 浏览器 localStorage 安全读写与上游 Profile 勾选列表持久化辅助模块。
 */

function resolveStorage(storage?: Storage): Storage | undefined {
  if (storage) return storage;
  try {
    return typeof window !== "undefined" ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
}

export function safeLocalStorageGet(key: string, storage?: Storage): string | null {
  const s = resolveStorage(storage);
  if (!s) return null;
  try {
    return s.getItem(key);
  } catch {
    return null;
  }
}

export function safeLocalStorageSet(key: string, value: string, storage?: Storage): void {
  const s = resolveStorage(storage);
  if (!s) return;
  try {
    s.setItem(key, value);
  } catch {
    // 隐私模式或存储超额时静默忽略
  }
}

export function readStoredStringList(key: string, storage?: Storage): string[] | null {
  const raw = safeLocalStorageGet(key, storage);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return null;
  }
}

export function writeStoredStringList(
  key: string,
  items: Iterable<string>,
  storage?: Storage,
): void {
  safeLocalStorageSet(key, JSON.stringify([...items]), storage);
}

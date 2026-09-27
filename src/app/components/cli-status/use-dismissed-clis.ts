"use client";

import { useCallback, useEffect, useState } from "react";

/** 点过“不再提示”的 CLI，存于本浏览器的 localStorage，不改配置 */
const STORAGE_KEY = "pelican.cliBanner.dismissed";

export function useDismissedClis(): [ReadonlySet<string>, (clis: readonly string[]) => void] {
  const [dismissed, setDismissed] = useState<ReadonlySet<string>>(new Set());

  // 挂载后再读：服务端渲染时没有 localStorage
  useEffect(() => setDismissed(readStored()), []);

  const dismiss = useCallback((clis: readonly string[]): void => {
    const next = new Set([...readStored(), ...clis]);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      // 写入失败（隐私模式等）时仅在本页有效
    }
    setDismissed(next);
  }, []);

  return [dismissed, dismiss];
}

function readStored(): Set<string> {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return new Set(Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []);
  } catch {
    return new Set();
  }
}

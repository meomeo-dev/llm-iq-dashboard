"use client";

import { useEffect, useState } from "react";
import { safeLocalStorageGet, safeLocalStorageSet } from "../profile/profile-selection-store";
import { hasClientHydrated } from "./use-now";
import { browserTimeZone, isValidTimeZone } from "./zoned-time";

/** 所选时区的 localStorage 键，看板与单独查看页共用 */
const TIME_ZONE_STORAGE_KEY = "pelican.timeZone";

let cachedTimeZone: string | null = null;

function resolveClientTimeZone(): string {
  if (cachedTimeZone !== null) return cachedTimeZone;
  const stored = safeLocalStorageGet(TIME_ZONE_STORAGE_KEY);
  cachedTimeZone = stored !== null && isValidTimeZone(stored) ? stored : browserTimeZone();
  return cachedTimeZone;
}

/**
 * 所选时区：优先取已保存且合法的值，否则用浏览器本机时区。
 * 首屏水合前为 null；已水合后在页面组切换时同步返回缓存时区，消除空白帧与二次挂载。
 */
export function useStoredTimeZone(): [string | null, (timeZone: string) => void] {
  const [timeZone, setTimeZone] = useState<string | null>(() =>
    hasClientHydrated() ? resolveClientTimeZone() : null,
  );
  useEffect(() => {
    setTimeZone(resolveClientTimeZone());
  }, []);
  const pick = (next: string): void => {
    cachedTimeZone = next;
    safeLocalStorageSet(TIME_ZONE_STORAGE_KEY, next);
    setTimeZone(next);
  };
  return [timeZone, pick];
}

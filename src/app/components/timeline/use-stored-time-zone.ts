"use client";

import { useEffect, useState } from "react";
import { browserTimeZone, isValidTimeZone } from "./zoned-time";

/** 所选时区的 localStorage 键，看板与单独查看页共用 */
const TIME_ZONE_STORAGE_KEY = "pelican.timeZone";

/**
 * 所选时区：优先取已保存且合法的值，否则用浏览器本机时区。挂载前为 null，
 * 因为服务端渲染时没有浏览器时区。
 */
export function useStoredTimeZone(): [string | null, (timeZone: string) => void] {
  const [timeZone, setTimeZone] = useState<string | null>(null);
  useEffect(() => {
    const stored = window.localStorage.getItem(TIME_ZONE_STORAGE_KEY);
    setTimeZone(stored !== null && isValidTimeZone(stored) ? stored : browserTimeZone());
  }, []);
  const pick = (next: string): void => {
    window.localStorage.setItem(TIME_ZONE_STORAGE_KEY, next);
    setTimeZone(next);
  };
  return [timeZone, pick];
}

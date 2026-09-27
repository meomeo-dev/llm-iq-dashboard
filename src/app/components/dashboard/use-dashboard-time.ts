"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NOW_INTERVAL_MS } from "./dashboard-calc";

/** 挂载后才返回当前时刻：服务端没有浏览器时区，提前渲染会与客户端不一致 */
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), NOW_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);
  return now;
}

/** 所选日期写进 URL（?day=）供服务端按天载入；跟随今天时去掉参数，地址未变则不跳转 */
export function useDayInUrl(pickedDay: string | null): void {
  const router = useRouter();
  useEffect(() => {
    const target = pickedDay === null ? "" : `?day=${pickedDay}`;
    if (window.location.search === target) return;
    router.replace(`/${target}`, { scroll: false });
  }, [router, pickedDay]);
}

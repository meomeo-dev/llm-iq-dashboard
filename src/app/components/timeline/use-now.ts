"use client";

import { useEffect, useState } from "react";

/** 刷新“现在”竖线与时钟的间隔：分钟级即可 */
export const NOW_INTERVAL_MS = 60_000;

let clientHydrated = false;

export function hasClientHydrated(): boolean {
  return clientHydrated;
}

/** 挂载后才返回当前时刻：服务端与首屏水合阶段返回 null，客户端路由切页时同步返回当前时刻避免空白帧 */
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(() => (clientHydrated ? new Date() : null));
  useEffect(() => {
    clientHydrated = true;
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), NOW_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);
  return now;
}

export const useNowTick = useNow;

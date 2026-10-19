"use client";

import { useEffect, useState } from "react";
import { hasClientHydrated } from "../timeline/use-now";
import { formatZonedClockWithSeconds } from "../timeline/zoned-time";

/** 每秒刷新的时钟；挂载前显示占位，客户端切页时直接显示当前时刻避免闪烁 */
export function LiveClock({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState<Date | null>(() => (hasClientHydrated() ? new Date() : null));
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <span className="clock-time">{now === null ? "--:--:--" : formatZonedClockWithSeconds(now, timeZone)}</span>;
}

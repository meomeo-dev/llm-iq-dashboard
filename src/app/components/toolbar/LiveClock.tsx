"use client";

import { useEffect, useState } from "react";
import { formatZonedClockWithSeconds } from "../timeline/zoned-time";

/** 每秒刷新的时钟；挂载前显示占位，避免与服务端渲染不一致 */
export function LiveClock({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <span className="clock-time">{now === null ? "--:--:--" : formatZonedClockWithSeconds(now, timeZone)}</span>;
}

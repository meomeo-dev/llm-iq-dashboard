"use client";

import { useEffect, useRef } from "react";

/**
 * 时间线横向滚动锚点定位：当日期或泳道 key 变化时，将目标 x 坐标居中显示。
 */
export function useScrollAnchor(anchorX: number | null, scrollKey: string) {
  const scroller = useRef<HTMLDivElement>(null);
  const anchor = useRef(anchorX);
  anchor.current = anchorX;
  useEffect(() => {
    const element = scroller.current;
    if (element === null || anchor.current === null) return;
    element.scrollLeft = anchor.current - element.clientWidth / 2;
  }, [scrollKey]);
  return scroller;
}

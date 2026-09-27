"use client";

import { useEffect, useRef, useState } from "react";
import { fetchArtSource } from "./art-source";
import { SvgFrame } from "./SvgFrame";

/** 作品距视口这么远时开始预取 */
const PRELOAD_MARGIN = "300px";

interface Loaded {
  href: string;
  source: string | null;
  error: string | null;
}

/**
 * 按需加载的作品框：接近视口时经 `/art` 取 SVG 源码，交给 SvgFrame 净化并挂载
 * （见 ACR-003）。取回前渲染同尺寸空框，尺寸由调用方 CSS 决定，布局不跳动。
 */
export function LazySvgFrame({ href, className }: { href: string; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  // 地址变化后丢弃上一件作品的结果，回到空框
  const current = loaded?.href === href ? loaded : null;

  useEffect(() => {
    const host = hostRef.current;
    if (host === null) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        fetchArtSource(href).then(
          (source) => !cancelled && setLoaded({ href, source, error: null }),
          (cause: unknown) => !cancelled && setLoaded({ href, source: null, error: describe(cause) }),
        );
      },
      { rootMargin: PRELOAD_MARGIN },
    );
    observer.observe(host);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [href]);

  if (current?.source != null) return <SvgFrame source={current.source} className={className} />;
  const classes = ["frame", className].filter(Boolean).join(" ");
  if (current?.error != null) {
    return (
      <div className={`${classes} frame-failed`}>
        <p>{current.error}</p>
      </div>
    );
  }
  return <div className={`${classes} frame-loading`} ref={hostRef} aria-busy="true" />;
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

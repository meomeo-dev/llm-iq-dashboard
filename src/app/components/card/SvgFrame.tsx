"use client";

import { useEffect, useRef, useState } from "react";
import { sanitizeSvg } from "./svg-sanitize";
import { scopeSvgIds } from "./svg-scope";
import { fitToFrame } from "./svg-fit";

/**
 * 固定尺寸的作品框：净化后的 SVG 按 contain 缩放进框内，框尺寸由调用方 CSS 决定，
 * 与作品宽高比无关。卡片与表盘缩略图共用。
 *
 * 净化后的元素直接挂进 DOM，不用 dangerouslySetInnerHTML；净化只在浏览器端的
 * useEffect 中执行，服务端渲染的 HTML 不含模型生成的标记；净化逻辑即使有疏漏，
 * 非浏览器消费者也取不到原样标记。
 */
export function SvgFrame({ source, className }: { source: string; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (host === null) return;

    const { element, error: failure } = sanitizeSvg(source);
    host.replaceChildren();
    // id 隔离须在挂载前完成：进入文档后重名 id 会互相抢引用
    if (element !== null) host.appendChild(fitToFrame(scopeSvgIds(element)));
    setError(failure);
  }, [source]);

  const classes = ["frame", className].filter(Boolean).join(" ");
  if (error !== null) {
    return (
      <div className={`${classes} frame-failed`}>
        <p>{error}</p>
      </div>
    );
  }
  return <div className={`${classes} frame-art`} ref={hostRef} />;
}

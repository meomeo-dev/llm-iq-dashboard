import React from "react";
import { parseReferenceSource } from "./dashboard/reference-source";

interface ReferenceSourceDisplayProps {
  readonly source: string;
  readonly className?: string;
}

/**
 * 权威出处参考安全渲染组件。
 *
 * 解决学术文献引文直接放入 <a href> 导致浏览器作为相对路径跳转自身站内 404 的问题：
 * 1. 纯 URL：渲染为新窗口打开的权威外链；
 * 2. 包含 DOI 或 URL 的学术引文：提取学术 DOI / 链接并渲染 [权威文献 ↗] 外链，引文作为文本说明；
 * 3. 纯文本引用：以普通文本呈现，绝不包裹为相对 URL 的 <a> 标签。
 */
export function ReferenceSourceDisplay({
  source,
  className = "source-link",
}: ReferenceSourceDisplayProps) {
  const parsed = parseReferenceSource(source);

  if (parsed.kind === "empty") return null;

  if (parsed.kind === "url") {
    return (
      <a href={parsed.url} target="_blank" rel="noopener noreferrer" className={className}>
        {parsed.url} ↗
      </a>
    );
  }

  if (parsed.kind === "citation_with_link") {
    return (
      <span className="source-citation-wrap" style={{ wordBreak: "break-word" }}>
        <span className="source-citation-text">{parsed.text}</span>
        <a
          href={parsed.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${className} source-ext-link`}
          style={{ marginLeft: "8px", display: "inline-flex", alignItems: "center", gap: "2px", fontWeight: "600" }}
          title={`在新标签页打开权威出处：${parsed.url}`}
        >
          [权威文献 ↗]
        </a>
      </span>
    );
  }

  return <span className="source-citation-text">{parsed.text}</span>;
}

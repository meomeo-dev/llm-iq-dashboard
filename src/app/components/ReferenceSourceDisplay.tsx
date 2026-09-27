import React from "react";

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
  const trimmed = source.trim();
  if (!trimmed) return null;

  // 1. 如果本身是合法的绝对 HTTP/HTTPS URL
  if (/^https?:\/\//i.test(trimmed)) {
    return (
      <a href={trimmed} target="_blank" rel="noopener noreferrer" className={className}>
        {trimmed} ↗
      </a>
    );
  }

  // 2. 如果包含 DOI（如 10.1126/science.1214081）或包含嵌入式 URL
  const doiMatch = trimmed.match(/10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/);
  const urlMatch = trimmed.match(/https?:\/\/[^\s,;"<>]+/i);

  const targetUrl = urlMatch ? urlMatch[0] : (doiMatch ? `https://doi.org/${doiMatch[0]}` : null);

  if (targetUrl) {
    return (
      <span className="source-citation-wrap" style={{ wordBreak: "break-word" }}>
        <span className="source-citation-text">{trimmed}</span>
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${className} source-ext-link`}
          style={{ marginLeft: "8px", display: "inline-flex", alignItems: "center", gap: "2px", fontWeight: "600" }}
          title={`在新标签页打开权威出处：${targetUrl}`}
        >
          [权威文献 ↗]
        </a>
      </span>
    );
  }

  // 3. 纯文本文献引文，不渲染为 <a> 标签，防止浏览器相对路径跳转自身站内
  return <span className="source-citation-text">{trimmed}</span>;
}

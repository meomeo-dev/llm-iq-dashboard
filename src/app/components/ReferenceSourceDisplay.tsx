import React from "react";
import {
  parseReferenceSource,
  REFERENCE_SEGMENT_SEPARATOR,
  type ReferenceSourceKind,
} from "./dashboard/reference-source";

interface ReferenceSourceDisplayProps {
  readonly source: string;
  readonly className?: string;
}

/**
 * 权威出处参考安全渲染组件。
 *
 * 解决学术文献引文直接放入 <a href> 导致浏览器作为相对路径跳转自身站内 404 的问题：
 * 1. 纯 URL：渲染为新窗口打开的权威外链；Wikidata 编号链接到实体页；
 * 2. 包含 DOI 或 URL 的学术引文：提取学术 DOI / 链接并渲染 [权威文献 ↗] 外链，引文作为文本说明；
 * 3. 纯文本引用与仓库内路径：以普通文本呈现，绝不包裹为相对 URL 的 <a> 标签。
 *
 * 以「 · 」分隔的多条出处逐段渲染，每段各自成链，互不混入对方的 href。
 */
export function ReferenceSourceDisplay({
  source,
  className = "source-link",
}: ReferenceSourceDisplayProps) {
  const segments = parseReferenceSource(source);
  const [onlySegment] = segments;

  if (onlySegment === undefined) return null;
  if (segments.length === 1) return renderSegment(onlySegment, className);

  return (
    <span className="source-segments" style={{ wordBreak: "break-word" }}>
      {segments.map((segment, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="source-sep">{REFERENCE_SEGMENT_SEPARATOR}</span>}
          {renderSegment(segment, className)}
        </React.Fragment>
      ))}
    </span>
  );
}

function renderSegment(segment: ReferenceSourceKind, className: string) {
  if (segment.kind === "url") {
    return (
      <a href={segment.url} target="_blank" rel="noopener noreferrer" className={className}>
        {segment.label} ↗
      </a>
    );
  }

  if (segment.kind === "citation_with_link") {
    return (
      <span className="source-citation-wrap" style={{ wordBreak: "break-word" }}>
        <span className="source-citation-text">{segment.text}</span>
        <a
          href={segment.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${className} source-ext-link`}
          style={{ marginLeft: "8px", display: "inline-flex", alignItems: "center", gap: "2px", fontWeight: "600" }}
          title={`在新标签页打开权威出处：${segment.url}`}
        >
          [权威文献 ↗]
        </a>
      </span>
    );
  }

  return <span className="source-citation-text">{segment.text}</span>;
}

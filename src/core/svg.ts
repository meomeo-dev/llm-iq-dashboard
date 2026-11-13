/**
 * 从 CLI 的自由文本输出中提取 SVG。用索引扫描而非正则：片段可能长达上万行，
 * 正则回溯难读且边界情形易出错。
 */

import { JSDOM } from "jsdom";

const OPEN_TAG = "<svg";
const CLOSE_TAG = "</svg>";
const XMLNS = "http://www.w3.org/2000/svg";

let cachedDomParser: DOMParser | null = null;

function getXmlParser(): DOMParser {
  if (cachedDomParser === null) {
    cachedDomParser = new (new JSDOM("").window.DOMParser)();
  }
  return cachedDomParser;
}

function isWellFormedSvgXml(source: string): boolean {
  try {
    const doc = getXmlParser().parseFromString(source, "image/svg+xml");
    return (
      doc.getElementsByTagName("parsererror").length === 0 &&
      doc.documentElement?.tagName.toLowerCase() === "svg"
    );
  } catch {
    return false;
  }
}

export interface ExtractedSvg {
  source: string;
  bytes: number;
}

/**
 * 返回全文中成对闭合且最长的 <svg>…</svg> 片段。
 *
 * 处理以下模型常见异常：
 * 1. 深度追踪：处理嵌套 <svg> 与前段因 Token 超限截断而未闭合的残片；
 * 2. 多段输出：优先筛选通过 XML 语法校验且不包含 markdown 代码块标记的有效作品，
 *    并在其中取最长者（过滤前置草图与被截断重试的残片）。
 */
export function extractSvg(output: string): ExtractedSvg | null {
  const rawCandidates: string[] = [];
  let cursor = 0;

  while (cursor < output.length) {
    const start = output.indexOf(OPEN_TAG, cursor);
    if (start === -1) break;

    // 排除 <svgfoo> 这类同前缀标签：合法情形下 <svg 之后只能是空白或 > 或 /
    const next = output[start + OPEN_TAG.length];
    if (next !== undefined && !isTagBoundary(next)) {
      cursor = start + OPEN_TAG.length;
      continue;
    }

    const closeAt = findMatchingClose(output, start);
    if (closeAt !== -1) {
      rawCandidates.push(output.slice(start, closeAt + CLOSE_TAG.length));
    }
    cursor = start + OPEN_TAG.length;
  }

  if (rawCandidates.length === 0) return null;

  const normalizedCandidates = rawCandidates.map((c) =>
    normalizeSvgXml(ensureStyleCdata(ensureNamespace(c.trim()))),
  );

  const validCandidates = normalizedCandidates.filter(
    (c) => !c.includes("```") && isWellFormedSvgXml(c),
  );

  let best: string;
  if (validCandidates.length > 0) {
    best = validCandidates.reduce((prev, curr) => (curr.length > prev.length ? curr : prev));
  } else {
    const cleanCandidates = normalizedCandidates.filter((c) => !c.includes("```"));
    const pool = cleanCandidates.length > 0 ? cleanCandidates : normalizedCandidates;
    best = pool.reduce((prev, curr) => (curr.length > prev.length ? curr : prev));
  }

  return { source: best, bytes: Buffer.byteLength(best, "utf8") };
}

/**
 * 寻找与 startPos 处的 <svg 深度匹配的 </svg> 闭合标签位置。
 * 跨过注视与 CDATA，并在深度降为 0 时返回闭合索引；未正常闭合则返回 -1。
 */
function findMatchingClose(output: string, startPos: number): number {
  let depth = 0;
  let pos = startPos;

  while (pos < output.length) {
    if (output.startsWith("<!--", pos)) {
      const end = output.indexOf("-->", pos);
      if (end !== -1) {
        pos = end + 3;
        continue;
      }
    }
    if (output.startsWith("<![CDATA[", pos)) {
      const end = output.indexOf("]]>", pos);
      if (end !== -1) {
        pos = end + 3;
        continue;
      }
    }

    const nextOpen = output.indexOf(OPEN_TAG, pos);
    const nextClose = output.indexOf(CLOSE_TAG, pos);
    if (nextClose === -1) return -1;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      const nextChar = output[nextOpen + OPEN_TAG.length];
      if (nextChar !== undefined && isTagBoundary(nextChar)) {
        depth += 1;
      }
      pos = nextOpen + OPEN_TAG.length;
    } else {
      depth -= 1;
      if (depth === 0) return nextClose;
      pos = nextClose + CLOSE_TAG.length;
    }
  }

  return -1;
}

/**
 * 从回答文本里找出它声称写入的 .svg 文件路径，用于回收未内联交付的作品
 * （如 agy 的 claude-sonnet-4-6 会无视考场规则存文件）。只认 `file://` 开头、
 * `.svg` 结尾的路径，避免把正文提到的其他文件当成产物。
 */
export function extractSvgFilePath(answer: string): string | null {
  const SCHEME = "file://";
  const EXT = ".svg";

  const start = answer.indexOf(SCHEME);
  if (start === -1) return null;

  const end = answer.indexOf(EXT, start);
  if (end === -1) return null;

  const url = answer.slice(start, end + EXT.length);
  try {
    return decodeURIComponent(new URL(url).pathname);
  } catch {
    return null;
  }
}

function isTagBoundary(ch: string): boolean {
  return ch === ">" || ch === "/" || ch === " " || ch === "\n" || ch === "\t" || ch === "\r";
}

/** 补上缺失的 xmlns：内联 HTML 可以省略，独立的 .svg 文件缺了它无法被查看器打开 */
function ensureNamespace(svg: string): string {
  if (svg.includes("xmlns=")) return svg;
  const headEnd = svg.indexOf(">");
  if (headEnd === -1) return svg;
  return `${svg.slice(0, headEnd)} xmlns="${XMLNS}"${svg.slice(headEnd)}`;
}

/** 补上缺失的 CDATA：模型在 <style> 中常写裸 & 或 <，独立 .svg 文件缺了 CDATA 无法被严格 XML 查看器打开 */
function ensureStyleCdata(svg: string): string {
  return svg.replace(/<style(\s[^>]*)?>([\s\S]*?)<\/style>/gi, (match, attrs = "", content) => {
    if (content.includes("<![CDATA[")) return match;
    return `<style${attrs}><![CDATA[${content}]]></style>`;
  });
}

/** 规整模型在 XML 中常见的非规范标记（注释多短横线、标签内重复属性） */
function normalizeSvgXml(svg: string): string {
  let clean = svg.replace(/<!--([\s\S]*?)-->/g, (_match, body: string) => {
    return `<!--${body.replace(/--+/g, "-")}-->`;
  });

  clean = clean.replace(/<([a-zA-Z0-9:-]+)(\s+[^>]*?)(\/?>)/g, (_match, tagName: string, attrs: string, closing: string) => {
    const seen = new Set<string>();
    const cleanedAttrs = attrs.replace(
      /([a-zA-Z0-9:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g,
      (attrMatch: string, name: string) => {
        const lower = name.toLowerCase();
        if (seen.has(lower)) return "";
        seen.add(lower);
        return attrMatch;
      },
    );
    return `<${tagName}${cleanedAttrs}${closing}`;
  });

  return clean;
}

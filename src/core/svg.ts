/**
 * 从 CLI 的自由文本输出中提取 SVG。用索引扫描而非正则：片段可能长达上万行，
 * 正则回溯难读且边界情形易出错。
 */

const OPEN_TAG = "<svg";
const CLOSE_TAG = "</svg>";
const XMLNS = "http://www.w3.org/2000/svg";

export interface ExtractedSvg {
  source: string;
  bytes: number;
}

/**
 * 返回全文中最长的成对 <svg>…</svg> 片段。模型常在正式作品前后附带草图或示例
 * 片段，最长者通常是交付物。
 */
export function extractSvg(output: string): ExtractedSvg | null {
  let best: string | null = null;
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

    const closeAt = output.indexOf(CLOSE_TAG, start);
    if (closeAt === -1) break;

    const candidate = output.slice(start, closeAt + CLOSE_TAG.length);
    if (best === null || candidate.length > best.length) best = candidate;
    cursor = closeAt + CLOSE_TAG.length;
  }

  if (best === null) return null;
  const source = normalizeSvgXml(ensureStyleCdata(ensureNamespace(best.trim())));
  return { source, bytes: Buffer.byteLength(source, "utf8") };
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


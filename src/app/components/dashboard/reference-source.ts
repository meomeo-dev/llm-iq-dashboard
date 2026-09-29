export type ReferenceSourceKind =
  | { kind: "url"; url: string; label: string }
  | { kind: "citation_with_link"; text: string; url: string }
  | { kind: "plain_text"; text: string };

/** 多条出处在同一字符串里以「 · 」分隔，如「维基 URL · Wikidata Q83125 · 调研文档路径」。 */
export const REFERENCE_SEGMENT_SEPARATOR = " · ";

const WIKIDATA_ENTITY_BASE = "https://www.wikidata.org/wiki/";

/**
 * 解析出处参考字符串，按「 · 」拆成多段，逐段提取 URL 或学术 DOI 链接。
 * 纯文本文献引文与仓库内相对路径不生成外链，避免相对路径跳转错误。
 * 空串或全空白返回空数组。
 */
export function parseReferenceSource(source: string): ReferenceSourceKind[] {
  return source
    .split(REFERENCE_SEGMENT_SEPARATOR)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
    .map(parseReferenceSegment);
}

function parseReferenceSegment(segment: string): ReferenceSourceKind {
  // 1. 整段是一个不含空白的绝对 HTTP/HTTPS URL
  if (/^https?:\/\/\S+$/i.test(segment)) {
    return { kind: "url", url: segment, label: segment };
  }

  // 2. Wikidata 实体编号（如「Wikidata Q83125」）链接到实体页
  const wikidataMatch = segment.match(/^Wikidata (Q\d+)$/);
  if (wikidataMatch) {
    return { kind: "url", url: `${WIKIDATA_ENTITY_BASE}${wikidataMatch[1]}`, label: segment };
  }

  // 3. 如果包含 DOI（如 10.1126/science.1214081）或包含嵌入式 URL
  const doiMatch = segment.match(/10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/);
  const urlMatch = segment.match(/https?:\/\/[^\s,;"<>]+/i);
  const targetUrl = urlMatch ? urlMatch[0] : (doiMatch ? `https://doi.org/${doiMatch[0]}` : null);

  if (targetUrl) {
    return { kind: "citation_with_link", text: segment, url: targetUrl };
  }

  // 4. 纯文本文献引文或仓库内路径，不渲染为 <a> 标签，防止浏览器相对路径跳转自身站内
  return { kind: "plain_text", text: segment };
}

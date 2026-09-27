export type ReferenceSourceKind =
  | { kind: "empty" }
  | { kind: "url"; url: string }
  | { kind: "citation_with_link"; text: string; url: string }
  | { kind: "plain_text"; text: string };

/**
 * 解析出处参考字符串，提取 URL 或学术 DOI 链接。
 * 纯文本文献引文不生成外链，避免相对路径跳转错误。
 */
export function parseReferenceSource(source: string): ReferenceSourceKind {
  const trimmed = source.trim();
  if (!trimmed) return { kind: "empty" };

  // 1. 如果本身是合法的绝对 HTTP/HTTPS URL
  if (/^https?:\/\//i.test(trimmed)) {
    return { kind: "url", url: trimmed };
  }

  // 2. 如果包含 DOI（如 10.1126/science.1214081）或包含嵌入式 URL
  const doiMatch = trimmed.match(/10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/);
  const urlMatch = trimmed.match(/https?:\/\/[^\s,;"<>]+/i);
  const targetUrl = urlMatch ? urlMatch[0] : (doiMatch ? `https://doi.org/${doiMatch[0]}` : null);

  if (targetUrl) {
    return { kind: "citation_with_link", text: trimmed, url: targetUrl };
  }

  // 3. 纯文本文献引文，不渲染为 <a> 标签，防止浏览器相对路径跳转自身站内
  return { kind: "plain_text", text: trimmed };
}

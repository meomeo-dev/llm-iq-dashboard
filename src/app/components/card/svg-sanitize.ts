/**
 * SVG 净化（sanitization）。
 *
 * 看板展示模型生成、未经审阅的标记，内联即在本页源域运行第三方内容：<script> 与
 * on* 属性会执行，<foreignObject> 可嵌入任意 HTML，外部 href 会发起请求并泄露访问
 * 行为。这些须在进入 DOM 前剥除。
 *
 * 流程为解析成文档树、按规则剪枝、importNode 挂载，不做字符串拼接或正则替换：
 * 字符串过滤易被绕过，以浏览器解析器的结果为准。
 */

/** 无展示价值、可携带可执行内容或注入外部文档的元素 */
const FORBIDDEN_ELEMENTS = new Set([
  "script",
  "foreignobject",
  "iframe",
  "object",
  "embed",
  "audio",
  "video",
  "handler",
  "set",
]);

/** 可引用资源的属性，逐一审查取值 */
const URL_ATTRIBUTES = ["href", "xlink:href", "src", "from", "to", "values"];

export interface SanitizeResult {
  element: SVGElement | null;
  error: string | null;
}

export function sanitizeSvg(source: string): SanitizeResult {
  const normalized = normalizeXmlWellFormedness(source);
  const doc = new DOMParser().parseFromString(normalized, "image/svg+xml");

  // 解析失败时 parseFromString 不抛错，返回含 parsererror 的文档
  if (doc.getElementsByTagName("parsererror").length > 0) {
    return { element: null, error: "SVG 无法解析为合法 XML" };
  }

  const root = doc.documentElement;
  if (root.tagName.toLowerCase() !== "svg") {
    return { element: null, error: `根元素不是 <svg>，而是 <${root.tagName}>` };
  }

  pruneTree(root);
  fitToContainer(root);
  return { element: document.importNode(root, true) as unknown as SVGElement, error: null };
}

/** 深度优先剪枝；先收集再删除，避免遍历中改动集合 */
function pruneTree(root: Element): void {
  const doomed: Element[] = [];
  const walk = (node: Node): void => {
    // HTML 文档不支持直接挂载 CDATASection 节点，转为普通 Text 节点供 document.importNode 使用
    if (node.nodeType === 4 /* Node.CDATA_SECTION_NODE */) {
      const text = node.ownerDocument?.createTextNode(node.nodeValue ?? "") ?? null;
      if (text !== null && node.parentNode !== null) {
        node.parentNode.replaceChild(text, node);
      }
      return;
    }
    if (node.nodeType !== 1 /* Node.ELEMENT_NODE */) return;

    const el = node as Element;
    if (FORBIDDEN_ELEMENTS.has(el.tagName.toLowerCase())) {
      doomed.push(el);
      return;
    }
    scrubAttributes(el);
    for (const child of [...el.childNodes]) walk(child);
  };

  walk(root);
  for (const node of doomed) node.remove();
}

/**
 * 容错处理：修复模型输出中破坏 W3C XML 规范的常见语法问题：
 * 1. <style> 块若未包含 CDATA，将其自动包裹，避免选择器/注释中含 & 或 < 导致解析失败；
 * 2. XML 规范严禁在注释内部出现连续短横线 `--`（如常见分割线 `<!-- ------------ -->`），将其规整为单个短横线；
 * 3. XML 规范严禁同一个标签内出现同名属性（如两个 font-family），去重仅保留首个有效声明。
 */
export function normalizeXmlWellFormedness(svg: string): string {
  // 1. <style> 块 CDATA 包裹
  let normalized = svg.replace(/<style(\s[^>]*)?>([\s\S]*?)<\/style>/gi, (match, attrs = "", content) => {
    if (content.includes("<![CDATA[")) return match;
    return `<style${attrs}><![CDATA[${content}]]></style>`;
  });

  // 2. 规整 XML 注释中的连续破折号
  normalized = normalized.replace(/<!--([\s\S]*?)-->/g, (_match, body: string) => {
    return `<!--${body.replace(/--+/g, "-")}-->`;
  });

  // 3. 开始标签内的重复属性去重
  normalized = normalized.replace(/<([a-zA-Z0-9:-]+)(\s+[^>]*?)(\/?>)/g, (_match, tagName: string, attrs: string, closing: string) => {
    const seen = new Set<string>();
    const cleanedAttrs = attrs.replace(
      /([a-zA-Z0-9:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g,
      (attrMatch: string, name: string) => {
        const lower = name.toLowerCase();
        if (seen.has(lower)) {
          return "";
        }
        seen.add(lower);
        return attrMatch;
      },
    );
    return `<${tagName}${cleanedAttrs}${closing}`;
  });

  return normalized;
}

function scrubAttributes(node: Element): void {
  for (const attr of [...node.attributes]) {
    const name = attr.name.toLowerCase();

    // 移除全部事件处理器属性（onclick、onload 等）
    if (name.startsWith("on")) {
      node.removeAttribute(attr.name);
      continue;
    }
    if (URL_ATTRIBUTES.includes(name) && !isSafeReference(attr.value)) {
      node.removeAttribute(attr.name);
      continue;
    }
    // 内联样式里的 url() 同样能发起外部请求
    if (name === "style" && containsExternalUrl(attr.value)) {
      node.removeAttribute(attr.name);
    }
  }
}

/**
 * 只放行文档内锚点（#id）与内联 data URI 图片。
 * 外部 http(s) 会泄露访问行为，javascript: 可直接执行。
 */
function isSafeReference(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (normalized === "") return true;
  if (normalized.startsWith("#")) return true;
  if (normalized.startsWith("data:image/")) return true;
  // 动画属性（from/to/values）的取值通常是数字或颜色，不含协议分隔符
  return !normalized.includes(":");
}

function containsExternalUrl(style: string): boolean {
  const normalized = style.toLowerCase();
  return normalized.includes("url(") && !normalized.includes("url(#");
}

/**
 * 让作品适配容器：模型常写死 width / height，将其转成 viewBox 后移除，尺寸交由
 * CSS 控制。缺 viewBox 的 SVG 无法等比缩放。
 */
function fitToContainer(root: Element): void {
  if (!root.hasAttribute("viewBox")) {
    const width = parseLength(root.getAttribute("width"));
    const height = parseLength(root.getAttribute("height"));
    if (width !== null && height !== null) {
      root.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }
  }
  root.removeAttribute("width");
  root.removeAttribute("height");
}

/** 接受 "800" 与 "800px"，拒绝百分比（无法折算成 viewBox 坐标） */
function parseLength(value: string | null): number | null {
  if (value === null) return null;
  const trimmed = value.trim().toLowerCase();
  if (trimmed.endsWith("%")) return null;
  const numeric = Number.parseFloat(trimmed);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

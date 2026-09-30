/**
 * 从 <style> 文本里取出评审需要的两样东西：哪些 @keyframes 含旋转，哪些选择器挂了动画。
 * 只做括号配对与声明拆分，不引入 CSS 解析库；模型写的样式块都很短。
 */

export interface CssAnimationRule {
  selector: string;
  animationName: string | null;
  durationMs: number | null;
  infinite: boolean;
  transformOrigin: string | null;
  transformBox: string | null;
}

/** 只声明了变换原点、没挂动画的规则，如 `#rear { transform-origin: 100px 200px }` */
export interface CssOriginRule {
  selector: string;
  transformOrigin: string | null;
  transformBox: string | null;
}

export interface StyleSheetInfo {
  /** 关键帧名 → 关键帧体是否含 rotate( */
  keyframes: Map<string, boolean>;
  rules: CssAnimationRule[];
  origins: CssOriginRule[];
}

/** 解析一段或多段 <style> 文本；多段拼接后处理 */
export function parseStyleSheet(cssText: string): StyleSheetInfo {
  const info: StyleSheetInfo = { keyframes: new Map(), rules: [], origins: [] };
  for (const block of splitTopLevelBlocks(stripComments(cssText))) {
    const head = block.head.trim();
    if (head.startsWith("@keyframes") || head.startsWith("@-webkit-keyframes")) {
      const name = head.split(/\s+/)[1];
      if (name) info.keyframes.set(name, block.body.includes("rotate("));
      continue;
    }
    if (head.startsWith("@")) continue;
    const decls = parseDeclarations(block.body);
    const animated = decls.has("animation") || decls.has("animation-name");
    const hasOrigin = decls.has("transform-origin") || decls.has("transform-box");
    for (const selector of head.split(",")) {
      if (animated) info.rules.push(ruleFrom(selector.trim(), decls));
      else if (hasOrigin) info.origins.push(originFrom(selector.trim(), decls));
    }
  }
  return info;
}

/** 解析行内 style 属性；没有动画时返回 null */
export function parseInlineAnimation(styleAttr: string): CssAnimationRule | null {
  const decls = parseDeclarations(styleAttr);
  if (!decls.has("animation") && !decls.has("animation-name")) return null;
  return ruleFrom("", decls);
}

/** 把 "1.2s" / "800ms" 换成毫秒；解析不了返回 null */
export function parseCssDuration(token: string): number | null {
  const text = token.trim();
  if (text.endsWith("ms")) return finiteOrNull(Number(text.slice(0, -2)));
  if (text.endsWith("s")) return finiteOrNull(Number(text.slice(0, -1)) * 1000);
  return null;
}

function ruleFrom(selector: string, decls: Map<string, string>): CssAnimationRule {
  const shorthand = decls.get("animation");
  const tokens = shorthand ? shorthand.split(/\s+/).filter(Boolean) : [];
  const shorthandDuration = tokens.map(parseCssDuration).find((ms) => ms !== null) ?? null;
  const shorthandName = tokens.find((t) => parseCssDuration(t) === null && !isAnimationKeyword(t)) ?? null;
  const longhandDuration = decls.get("animation-duration");
  const iteration = decls.get("animation-iteration-count") ?? "";
  return {
    selector,
    animationName: decls.get("animation-name") ?? shorthandName,
    durationMs: longhandDuration ? parseCssDuration(longhandDuration) : shorthandDuration,
    infinite: tokens.includes("infinite") || iteration.includes("infinite"),
    transformOrigin: decls.get("transform-origin") ?? null,
    transformBox: decls.get("transform-box") ?? null,
  };
}

function originFrom(selector: string, decls: Map<string, string>): CssOriginRule {
  return {
    selector,
    transformOrigin: decls.get("transform-origin") ?? null,
    transformBox: decls.get("transform-box") ?? null,
  };
}

const ANIMATION_KEYWORDS = new Set([
  "linear", "ease", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end",
  "infinite", "normal", "reverse", "alternate", "alternate-reverse",
  "none", "forwards", "backwards", "both", "running", "paused",
]);

function isAnimationKeyword(token: string): boolean {
  return ANIMATION_KEYWORDS.has(token) || token.startsWith("cubic-bezier(") || token.startsWith("steps(");
}

function parseDeclarations(body: string): Map<string, string> {
  const decls = new Map<string, string>();
  for (const part of body.split(";")) {
    const colon = part.indexOf(":");
    if (colon === -1) continue;
    decls.set(part.slice(0, colon).trim().toLowerCase(), part.slice(colon + 1).trim());
  }
  return decls;
}

interface CssBlock {
  head: string;
  body: string;
}

/** 按顶层花括号拆块；@keyframes 内部的嵌套块整段留在 body 里 */
function splitTopLevelBlocks(css: string): CssBlock[] {
  const blocks: CssBlock[] = [];
  let depth = 0;
  let headStart = 0;
  let bodyStart = 0;
  for (let i = 0; i < css.length; i += 1) {
    const ch = css[i];
    if (ch === "{") {
      if (depth === 0) bodyStart = i + 1;
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        blocks.push({ head: css.slice(headStart, bodyStart - 1), body: css.slice(bodyStart, i) });
        headStart = i + 1;
      }
      if (depth < 0) depth = 0;
    }
  }
  return blocks;
}

function stripComments(css: string): string {
  let out = "";
  let cursor = 0;
  while (cursor < css.length) {
    const start = css.indexOf("/*", cursor);
    if (start === -1) break;
    const end = css.indexOf("*/", start + 2);
    out += css.slice(cursor, start);
    cursor = end === -1 ? css.length : end + 2;
  }
  return out + css.slice(cursor);
}

function finiteOrNull(value: number): number | null {
  return Number.isFinite(value) ? value : null;
}

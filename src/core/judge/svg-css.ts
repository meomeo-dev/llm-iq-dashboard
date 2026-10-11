/**
 * 从 <style> 文本里取出评审需要的东西：哪些 @keyframes 含旋转，哪些选择器挂了动画，以及
 * 自定义属性（`--x`）的声明。只做括号配对与声明拆分，不引入 CSS 解析库；模型写的样式块都很短。
 *
 * var() 按浏览器的规则代入：取元素自身或祖先上的声明，没有声明时用回退值；两者都没有时，
 * 浏览器把整条声明当作无效，动画不会播放，这里同样不认这条动画。
 */

export interface CssAnimationRule {
  selector: string;
  animationName: string | null;
  durationMs: number | null;
  infinite: boolean;
  transformOrigin: string | null;
  transformBox: string | null;
  /** 规则里的原始声明；含 var() 时按目标元素代入后重新解析，见 resolveAnimationRule */
  declarations: ReadonlyMap<string, string>;
}

/** 自定义属性声明，如 `:root { --cycle: 1.6s }` */
export interface CssCustomProperty {
  selector: string;
  name: string;
  value: string;
}

/** 按名字查某个元素上生效的自定义属性；查不到返回 null */
export type CustomPropertyLookup = (name: string) => string | null;

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
  /** 文档顺序；同一元素上多条同名声明取最后一条 */
  customProperties: CssCustomProperty[];
}

/** 解析一段或多段 <style> 文本；多段拼接后处理 */
export function parseStyleSheet(cssText: string): StyleSheetInfo {
  const info: StyleSheetInfo = { keyframes: new Map(), rules: [], origins: [], customProperties: [] };
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
    const custom = [...decls].filter(([name]) => name.startsWith("--"));
    for (const selector of head.split(",").map((s) => s.trim())) {
      if (animated) info.rules.push(ruleFrom(selector, decls));
      else if (hasOrigin) info.origins.push(originFrom(selector, decls));
      for (const [name, value] of custom) info.customProperties.push({ selector, name, value });
    }
  }
  return info;
}

/** 与动画是否播放直接相关的声明：其中的 var() 无效时浏览器不播放这条动画 */
const ANIMATION_DECLARATIONS = new Set(["animation", "animation-name", "animation-duration"]);

export function usesVariables(rule: CssAnimationRule): boolean {
  return [...rule.declarations.values()].some((value) => value.includes("var("));
}

/**
 * 把规则里的 var() 按 lookup 代入后重新解析。动画相关声明代入失败时返回 null（浏览器里
 * 这条动画不播放）；其他声明代入失败按未声明处理，如 transform-origin 回到初始值。
 */
export function resolveAnimationRule(rule: CssAnimationRule, lookup: CustomPropertyLookup): CssAnimationRule | null {
  const resolved = new Map<string, string>();
  for (const [name, value] of rule.declarations) {
    const substituted = substituteVariables(value, lookup, 0);
    if (substituted !== null) resolved.set(name, substituted);
    else if (ANIMATION_DECLARATIONS.has(name)) return null;
  }
  return ruleFrom(rule.selector, resolved);
}

/** 自定义属性互相引用的层数上限；超过视为循环引用，浏览器同样当作无效 */
const MAX_VARIABLE_DEPTH = 8;

function substituteVariables(value: string, lookup: CustomPropertyLookup, depth: number): string | null {
  if (depth > MAX_VARIABLE_DEPTH) return null;
  let out = "";
  let cursor = 0;
  for (;;) {
    const start = value.indexOf("var(", cursor);
    if (start === -1) return out + value.slice(cursor);
    const end = closingParen(value, start + 3);
    if (end === -1) return null;
    const { name, fallback } = splitVarArguments(value.slice(start + 4, end));
    const raw = lookup(name) ?? fallback;
    if (raw === null) return null;
    const inner = substituteVariables(raw.trim(), lookup, depth + 1);
    if (inner === null) return null;
    out += value.slice(cursor, start) + inner;
    cursor = end + 1;
  }
}

/** open 处是左括号，返回与之配对的右括号下标；不配对返回 -1 */
function closingParen(text: string, open: number): number {
  let depth = 0;
  for (let i = open; i < text.length; i += 1) {
    if (text[i] === "(") depth += 1;
    else if (text[i] === ")" && (depth -= 1) === 0) return i;
  }
  return -1;
}

/** `--x, 2s` → 名字与回退值；回退值可含逗号与括号，只在第一个顶层逗号处切开 */
function splitVarArguments(args: string): { name: string; fallback: string | null } {
  let depth = 0;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "(") depth += 1;
    else if (args[i] === ")") depth -= 1;
    else if (args[i] === "," && depth === 0) return { name: args.slice(0, i).trim(), fallback: args.slice(i + 1) };
  }
  return { name: args.trim(), fallback: null };
}

/** 解析行内 style 属性；没有动画时返回 null */
export function parseInlineAnimation(styleAttr: string): CssAnimationRule | null {
  const decls = parseDeclarations(styleAttr);
  if (!decls.has("animation") && !decls.has("animation-name")) return null;
  return ruleFrom("", decls);
}

/** 把 "1.2s" / "800ms" / "calc(1.6s / 2)" 换成毫秒；解析不了返回 null */
export function parseCssDuration(token: string): number | null {
  const text = token.trim();
  if (text.startsWith("calc(") && text.endsWith(")")) return evaluateTimeCalc(text.slice(5, -1));
  if (text.endsWith("ms")) return finiteOrNull(Number(text.slice(0, -2)));
  if (text.endsWith("s")) return finiteOrNull(Number(text.slice(0, -1)) * 1000);
  return null;
}

/** calc() 里只认一个时间与若干数字的乘除，如 `1.6s / 2`、`2 * 0.8s`；其余写法返回 null */
function evaluateTimeCalc(expression: string): number | null {
  const tokens = expression.replaceAll("*", " * ").replaceAll("/", " / ").trim().split(/\s+/);
  if (tokens.length % 2 === 0) return null;
  let value = 1;
  let timeSeen = false;
  for (let i = 0; i < tokens.length; i += 2) {
    const operator = i === 0 ? "*" : tokens[i - 1];
    const operand = tokens[i] ?? "";
    const time = /[a-z]$/i.test(operand) ? parseCssDuration(operand) : null;
    const factor = time ?? finiteOrNull(Number(operand));
    // 时间只能出现一次且不能当除数；除以零在 CSS 里无效
    if (factor === null || (time !== null && (timeSeen || operator === "/"))) return null;
    if (time !== null) timeSeen = true;
    if (operator === "*") value *= factor;
    else if (operator === "/" && factor !== 0) value /= factor;
    else return null;
  }
  return timeSeen ? value : null;
}

function ruleFrom(selector: string, decls: ReadonlyMap<string, string>): CssAnimationRule {
  const shorthand = decls.get("animation");
  const tokens = shorthand ? splitTopLevelWhitespace(shorthand) : [];
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
    declarations: decls,
  };
}

/** 按顶层空白切开简写：`calc(1.6s / 2)` 这类带括号的值保持完整 */
function splitTopLevelWhitespace(value: string): string[] {
  const tokens: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of value) {
    if (ch === "(") depth += 1;
    else if (ch === ")") depth -= 1;
    if (depth === 0 && /\s/.test(ch)) {
      if (current) tokens.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);
  return tokens;
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

/** 声明名统一小写；自定义属性（`--x`）区分大小写，保持原样 */
export function parseDeclarations(body: string): Map<string, string> {
  const decls = new Map<string, string>();
  for (const part of body.split(";")) {
    const colon = part.indexOf(":");
    if (colon === -1) continue;
    const name = part.slice(0, colon).trim();
    decls.set(name.startsWith("--") ? name : name.toLowerCase(), part.slice(colon + 1).trim());
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

/**
 * 把一幅 SVG 解析成评审用的模型：解析错误、安全项、每个动画的目标元素与旋转中心、
 * 以及在元素树上量圆心的几何辅助。只认 translate 变换；遇到 rotate / scale / matrix
 * 时把结果标为不精确，由渲染层兜底。
 */

import { JSDOM } from "jsdom";
import { parseCssDuration, parseInlineAnimation, parseStyleSheet, type CssAnimationRule, type StyleSheetInfo } from "./svg-css";

export interface Point {
  x: number;
  y: number;
}

/** 量出来的坐标，exact 为 false 表示路径上有非平移变换，数值只能参考 */
export interface Measured extends Point {
  exact: boolean;
}

export type AnimationKind = "smil-rotate" | "smil-other" | "css-rotate" | "css-other";

/** 旋转中心的坐标系：local 是目标元素自身坐标，absolute 是 viewBox 坐标 */
export type CenterMode = "local" | "absolute" | "fill-box-center" | "unknown";

export interface AnimationInfo {
  target: Element;
  kind: AnimationKind;
  /** 供理由文本使用的元素描述，如 g#rear-wheel */
  name: string;
  durMs: number | null;
  indefinite: boolean;
  rotateCenter: Point | null;
  centerMode: CenterMode;
  /** SMIL 的 additive="sum"；CSS 动画视为 true（transform 由 CSS 叠加） */
  additive: boolean;
  /**
   * SMIL rotate 已写了中心点，元素上又有非零的 CSS transform-origin：浏览器两者叠加，
   * 实际绕两倍处旋转，部件会飞离
   */
  doubleOrigin: boolean;
  /** <animate> 指向的属性在目标上不存在（如 <g> 上 animate d），浏览器里不产生任何动作 */
  inert: boolean;
}

export interface SvgModel {
  root: Element;
  viewBox: { x: number; y: number; width: number; height: number } | null;
  animations: AnimationInfo[];
  hasScript: boolean;
  hasForeignObject: boolean;
  hasRasterImage: boolean;
  externalRefs: string[];
}

export type ParseResult = { ok: true; model: SvgModel } | { ok: false; error: string };

export function parseSvgModel(source: string): ParseResult {
  const { window } = new JSDOM("");
  const doc = new window.DOMParser().parseFromString(source, "image/svg+xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) return { ok: false, error: firstLine(parseError.textContent ?? "parse error") };
  const root = doc.documentElement;
  if (root.tagName.toLowerCase() !== "svg") return { ok: false, error: `根元素是 <${root.tagName}> 而非 <svg>` };
  return {
    ok: true,
    model: {
      root,
      viewBox: parseViewBox(root.getAttribute("viewBox")),
      animations: collectAnimations(root),
      hasScript: root.querySelector("script") !== null,
      hasForeignObject: root.querySelector("foreignObject") !== null,
      hasRasterImage: root.querySelector("image") !== null,
      externalRefs: collectExternalRefs(root),
    },
  };
}

export function describeElement(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const id = el.getAttribute("id");
  if (id) return `${tag}#${id}`;
  const cls = el.getAttribute("class");
  return cls ? `${tag}.${cls.trim().split(/\s+/)[0]}` : tag;
}

export interface CircleHit {
  center: Measured;
  radius: number;
  element: Element;
}

/**
 * 元素子树里半径最大的圆（circle 或 ellipse），圆心换算到 origin 的局部坐标。
 * 子树里的 <use> 按其 href 指向的定义展开一层，x / y 计入平移。
 */
export function largestCircle(origin: Element): CircleHit | null {
  let best: CircleHit | null = null;
  const consider = (hit: CircleHit | null) => {
    if (hit && (!best || hit.radius > best.radius)) best = hit;
  };
  const tag = origin.tagName.toLowerCase();
  if (tag === "circle" || tag === "ellipse") consider(selfCircle(origin));
  for (const el of origin.querySelectorAll("circle, ellipse")) {
    const radius = circleRadius(el);
    if (radius === null) continue;
    const local = { x: numberAttr(el, "cx"), y: numberAttr(el, "cy") };
    consider({ center: offsetBetween(el, origin, local), radius, element: el });
  }
  for (const use of origin.querySelectorAll("use")) consider(circleBehindUse(use, origin));
  return best;
}

export interface RenderedCircle {
  absCenter: Measured;
  radius: number;
  element: Element;
}

/**
 * 画面上直接渲染的所有圆（含经 <use> 实例化的定义里的圆），圆心换算到 viewBox 坐标。
 * 辐条组不含轮圈时，用它按“同心”找轮圈。
 */
export function renderedCircles(root: Element): RenderedCircle[] {
  const out: RenderedCircle[] = [];
  for (const el of root.querySelectorAll("circle, ellipse")) {
    const radius = circleRadius(el);
    if (radius === null || insideDefs(el)) continue;
    out.push({ absCenter: offsetBetween(el, root, { x: numberAttr(el, "cx"), y: numberAttr(el, "cy") }), radius, element: el });
  }
  for (const use of root.querySelectorAll("use")) {
    if (insideDefs(use)) continue;
    const hit = circleBehindUse(use, use);
    if (hit) out.push({ absCenter: offsetBetween(use, root, hit.center), radius: hit.radius, element: hit.element });
  }
  return out;
}

/** 圆心落在 point 附近（半径 5%，至少 2 个单位）的最大的圆 */
export function concentricCircle(circles: readonly RenderedCircle[], point: Point): RenderedCircle | null {
  let best: RenderedCircle | null = null;
  for (const c of circles) {
    const tolerance = Math.max(2, c.radius * 0.05);
    if (Math.hypot(c.absCenter.x - point.x, c.absCenter.y - point.y) > tolerance) continue;
    if (!best || c.radius > best.radius) best = c;
  }
  return best;
}

/** 元素（或其最近的带 id 祖先）被哪些 <use> 实例化；不被引用时返回空数组 */
export function useInstancesOf(el: Element, root: Element): { definition: Element; uses: Element[] }[] {
  const out: { definition: Element; uses: Element[] }[] = [];
  let cursor: Element | null = el;
  while (cursor && cursor !== root) {
    const id = cursor.getAttribute("id");
    if (id) {
      const uses = [...root.querySelectorAll("use")].filter((u) => (u.getAttribute("href") ?? u.getAttribute("xlink:href")) === `#${id}`);
      if (uses.length > 0) out.push({ definition: cursor, uses });
    }
    cursor = cursor.parentElement;
  }
  return out;
}

/** 从根到元素的子元素下标序列；浏览器里按同一份 XML 解析后据此找回同一元素 */
export function elementPath(el: Element, root: Element): number[] {
  const path: number[] = [];
  let cursor: Element | null = el;
  while (cursor && cursor !== root) {
    const parent: Element | null = cursor.parentElement;
    if (!parent) break;
    path.unshift([...parent.children].indexOf(cursor));
    cursor = parent;
  }
  return path;
}

/** 元素是否位于 <defs> 之下（不直接渲染，只经 <use> 出现） */
export function insideDefs(el: Element): boolean {
  return el.closest("defs") !== null;
}

/** 把 el 局部坐标里的点换算到祖先 ancestor 的局部坐标（公开给部件识别用） */
export function pointInAncestor(el: Element, ancestor: Element, point: Point): Measured {
  return offsetBetween(el, ancestor, point);
}

function circleBehindUse(use: Element, origin: Element): CircleHit | null {
  const href = use.getAttribute("href") ?? use.getAttribute("xlink:href") ?? "";
  if (!href.startsWith("#")) return null;
  const referenced = use.ownerDocument.querySelector(`[id="${href.slice(1)}"]`);
  if (!referenced || referenced.contains(use)) return null;
  const inner = referenced.tagName.toLowerCase() === "circle" || referenced.tagName.toLowerCase() === "ellipse"
    ? selfCircle(referenced)
    : largestCircle(referenced);
  if (!inner) return null;
  const shifted = { x: inner.center.x + numberAttr(use, "x"), y: inner.center.y + numberAttr(use, "y") };
  const center = offsetBetween(use, origin, shifted);
  return { center: { ...center, exact: center.exact && inner.center.exact }, radius: inner.radius, element: inner.element };
}

function selfCircle(el: Element): CircleHit | null {
  const radius = circleRadius(el);
  if (radius === null) return null;
  const t = parseTranslate(el.getAttribute("transform"));
  return { center: { x: numberAttr(el, "cx") + t.x, y: numberAttr(el, "cy") + t.y, exact: t.exact }, radius, element: el };
}

/** 元素局部坐标系原点在 viewBox 坐标里的位置（沿祖先累加 translate） */
export function absoluteOffset(el: Element, root: Element): Measured {
  return offsetBetween(el, root, { x: 0, y: 0 });
}

/** 把 el 局部坐标里的点换算到祖先 ancestor 的局部坐标（含 el 自身的 transform，不含 ancestor 的） */
function offsetBetween(el: Element, ancestor: Element, point: Point): Measured {
  const out: Measured = { ...point, exact: true };
  let cursor: Element | null = el;
  while (cursor && cursor !== ancestor) {
    const t = parseTranslate(cursor.getAttribute("transform"));
    out.x += t.x;
    out.y += t.y;
    if (!t.exact) out.exact = false;
    cursor = cursor.parentElement;
  }
  if (cursor !== ancestor) out.exact = false;
  return out;
}

/**
 * transform 属性是否真的移动了内容：translate(0 0)、scale(1)、rotate(任意)、单位 matrix 都不算。
 * SMIL 非叠加动画会整段替换这个属性，只有它含位移或缩放时替换才会让部件飞离。
 */
export function hasDisplacingTransform(transform: string | null): boolean {
  if (!transform) return false;
  for (const call of transform.split(")")) {
    const open = call.indexOf("(");
    if (open === -1) continue;
    const fn = call.slice(0, open).trim();
    const args = call.slice(open + 1).split(/[\s,]+/).filter(Boolean).map(Number);
    if (fn === "translate" && ((args[0] ?? 0) !== 0 || (args[1] ?? 0) !== 0)) return true;
    if (fn === "scale" && ((args[0] ?? 1) !== 1 || (args[1] ?? args[0] ?? 1) !== 1)) return true;
    if (fn === "matrix" && args.join(",") !== "1,0,0,1,0,0") return true;
    if (fn === "skewX" || fn === "skewY") return true;
  }
  return false;
}

/** 只累加 translate；出现其他变换函数时标记不精确 */
export function parseTranslate(transform: string | null): Measured {
  const out: Measured = { x: 0, y: 0, exact: true };
  if (!transform) return out;
  for (const call of transform.split(")")) {
    const open = call.indexOf("(");
    if (open === -1) continue;
    const fn = call.slice(0, open).trim();
    const args = call.slice(open + 1).split(/[\s,]+/).filter(Boolean).map(Number);
    if (fn === "translate") {
      out.x += args[0] ?? 0;
      out.y += args[1] ?? 0;
    } else if (fn !== "" ) {
      out.exact = false;
    }
  }
  return out;
}

function collectAnimations(root: Element): AnimationInfo[] {
  const styles = [...root.querySelectorAll("style")].map((s) => s.textContent ?? "").join("\n");
  const sheet = parseStyleSheet(styles);
  return [...collectSmilAnimations(root, sheet), ...collectCssAnimations(root, sheet)];
}

function collectSmilAnimations(root: Element, sheet: StyleSheetInfo): AnimationInfo[] {
  const out: AnimationInfo[] = [];
  for (const anim of root.querySelectorAll("animate, animateTransform, animateMotion, set")) {
    const target = smilTarget(anim, root);
    if (!target) continue;
    const isRotate = anim.tagName === "animateTransform" && anim.getAttribute("type") === "rotate";
    const rotateCenter = isRotate ? smilRotateCenter(anim) : null;
    out.push({
      target,
      kind: isRotate ? "smil-rotate" : "smil-other",
      name: describeElement(target),
      durMs: parseSmilDuration(anim.getAttribute("dur")),
      indefinite: anim.getAttribute("repeatCount") === "indefinite" || anim.getAttribute("repeatDur") === "indefinite",
      rotateCenter,
      centerMode: isRotate ? "local" : "unknown",
      additive: anim.getAttribute("additive") === "sum",
      doubleOrigin: rotateCenter !== null && (rotateCenter.x !== 0 || rotateCenter.y !== 0) && hasCssOrigin(target, sheet),
      inert: isInertAnimate(anim, target),
    });
  }
  return out;
}

const GEOMETRY_ATTRIBUTES = new Set(["d", "points", "x", "y", "cx", "cy", "r", "rx", "ry", "x1", "y1", "x2", "y2", "width", "height"]);

/** <animate attributeName="d"> 挂在没有 d 的 <g> 上是常见笔误，动画对画面没有影响 */
function isInertAnimate(anim: Element, target: Element): boolean {
  if (anim.tagName !== "animate") return false;
  const name = anim.getAttribute("attributeName") ?? "";
  return GEOMETRY_ATTRIBUTES.has(name) && !target.hasAttribute(name);
}

/** 元素是否带非零的 CSS transform-origin（规则、行内 style 或同名属性） */
function hasCssOrigin(target: Element, sheet: StyleSheetInfo): boolean {
  const inline = parseInlineAnimation(target.getAttribute("style") ?? "")?.transformOrigin
    ?? inlineDeclaration(target.getAttribute("style") ?? "", "transform-origin");
  const fromSheet = sheet.origins.filter((o) => safeMatches(target, o.selector)).at(-1)?.transformOrigin
    ?? sheet.rules.filter((r) => safeMatches(target, r.selector)).at(-1)?.transformOrigin;
  const origin = inline ?? fromSheet ?? target.getAttribute("transform-origin");
  if (!origin) return false;
  const tokens = origin.trim().split(/\s+/);
  return tokens.some((t) => t !== "0" && t !== "0px" && t !== "0%");
}

function inlineDeclaration(style: string, name: string): string | null {
  for (const part of style.split(";")) {
    const colon = part.indexOf(":");
    if (colon !== -1 && part.slice(0, colon).trim().toLowerCase() === name) return part.slice(colon + 1).trim();
  }
  return null;
}

function smilTarget(anim: Element, root: Element): Element | null {
  const href = anim.getAttribute("href") ?? anim.getAttribute("xlink:href");
  if (href?.startsWith("#")) return root.querySelector(`[id="${href.slice(1)}"]`);
  return anim.parentElement;
}

/** rotate 的 from / values 首项形如 "0 cx cy"；缺 cx cy 时按规范取 (0,0) */
function smilRotateCenter(anim: Element): Point {
  const first = anim.getAttribute("from") ?? anim.getAttribute("values")?.split(";")[0] ?? "";
  const parts = first.trim().split(/[\s,]+/).filter(Boolean).map(Number);
  return { x: parts[1] ?? 0, y: parts[2] ?? 0 };
}

function collectCssAnimations(root: Element, sheet: StyleSheetInfo): AnimationInfo[] {
  const out: AnimationInfo[] = [];
  for (const rule of sheet.rules) {
    for (const target of safeQuery(root, rule.selector)) out.push(cssAnimationInfo(target, rule, sheet, root));
  }
  for (const target of root.querySelectorAll("[style*='animation']")) {
    const rule = parseInlineAnimation(target.getAttribute("style") ?? "");
    if (rule) out.push(cssAnimationInfo(target, rule, sheet, root));
  }
  return out;
}

function cssAnimationInfo(target: Element, rule: CssAnimationRule, sheet: StyleSheetInfo, root: Element): AnimationInfo {
  const rotates = rule.animationName !== null && sheet.keyframes.get(rule.animationName) === true;
  const origin = rotates ? cssTransformOrigin(target, rule, sheet, root) : { center: null, mode: "unknown" as const };
  return {
    target,
    kind: rotates ? "css-rotate" : "css-other",
    name: describeElement(target),
    durMs: rule.durationMs,
    indefinite: rule.infinite,
    rotateCenter: origin.center,
    centerMode: origin.mode,
    additive: true,
    doubleOrigin: false,
    inert: false,
  };
}

/** transform-origin 依次取：动画规则、行内 style、只声明原点的规则、同名 SVG 属性 */
function cssTransformOrigin(target: Element, rule: CssAnimationRule, sheet: StyleSheetInfo, root: Element): { center: Point | null; mode: CenterMode } {
  const inline = parseInlineAnimation(target.getAttribute("style") ?? "");
  const sheetOrigin = sheet.origins.filter((o) => safeMatches(target, o.selector)).at(-1);
  const origin = rule.transformOrigin ?? inline?.transformOrigin ?? sheetOrigin?.transformOrigin ?? target.getAttribute("transform-origin");
  const box = rule.transformBox ?? inline?.transformBox ?? sheetOrigin?.transformBox ?? target.getAttribute("transform-box");
  if (!origin) return { center: box === "fill-box" ? null : { x: 0, y: 0 }, mode: box === "fill-box" ? "fill-box-center" : "absolute" };
  const tokens = origin.trim().split(/\s+/);
  if (box === "fill-box") {
    const centered = tokens.every((t) => t === "center" || t === "50%");
    return { center: null, mode: centered ? "fill-box-center" : "unknown" };
  }
  const x = cssLength(tokens[0] ?? "0", root, "width");
  const y = cssLength(tokens[1] ?? "0", root, "height");
  if (x === null || y === null) return { center: null, mode: "unknown" };
  return { center: { x, y }, mode: "absolute" };
}

/** px / 无单位按用户坐标；百分比按 viewBox；关键字 center 视为 50% */
function cssLength(token: string, root: Element, axis: "width" | "height"): number | null {
  const vb = parseViewBox(root.getAttribute("viewBox"));
  const keyword = token === "center" ? "50%" : token;
  if (keyword.endsWith("%")) {
    if (!vb) return null;
    const ratio = Number(keyword.slice(0, -1)) / 100;
    return axis === "width" ? vb.x + vb.width * ratio : vb.y + vb.height * ratio;
  }
  const value = Number(keyword.endsWith("px") ? keyword.slice(0, -2) : keyword);
  return Number.isFinite(value) ? value : null;
}

function safeMatches(el: Element, selector: string): boolean {
  try {
    return selector !== "" && el.matches(selector);
  } catch {
    return false;
  }
}

function safeQuery(root: Element, selector: string): Element[] {
  if (!selector) return [];
  try {
    return [...root.querySelectorAll(selector)];
  } catch {
    return [];
  }
}

function collectExternalRefs(root: Element): string[] {
  const refs: string[] = [];
  for (const el of root.querySelectorAll("[href], [xlink\\:href], [src]")) {
    const value = el.getAttribute("href") ?? el.getAttribute("xlink:href") ?? el.getAttribute("src") ?? "";
    if (/^(https?:)?\/\//i.test(value.trim())) refs.push(value.trim());
  }
  return refs;
}

export function parseSmilDuration(dur: string | null): number | null {
  if (!dur) return null;
  const text = dur.trim();
  if (/^[0-9.]+(s|ms)$/.test(text)) return parseCssDuration(text);
  const bare = Number(text);
  return Number.isFinite(bare) ? bare * 1000 : null;
}

function parseViewBox(value: string | null): SvgModel["viewBox"] {
  if (!value) return null;
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length < 4 || !parts.every(Number.isFinite)) return null;
  const [x, y, width, height] = parts as [number, number, number, number];
  if (width <= 0 || height <= 0) return null;
  return { x, y, width, height };
}

function circleRadius(el: Element): number | null {
  const r = el.tagName.toLowerCase() === "circle"
    ? numberAttr(el, "r")
    : Math.max(numberAttr(el, "rx"), numberAttr(el, "ry"));
  return r > 0 ? r : null;
}

function numberAttr(el: Element, name: string): number {
  const value = Number(el.getAttribute(name) ?? "0");
  return Number.isFinite(value) ? value : 0;
}

function firstLine(text: string): string {
  return text.trim().split("\n")[0] ?? text;
}

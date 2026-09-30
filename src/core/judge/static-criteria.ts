/**
 * 静态解析层对 C1–C4 的给分：先从动画列表里认出车轮、曲柄与其余部件，再逐项量。
 * 每条理由都写实测值，看板展开时读者能核对。
 */

import type { CriterionResult, CriterionSpec } from "./schema";
import {
  absoluteOffset, concentricCircle, insideDefs, largestCircle, pointInAncestor, renderedCircles, useInstancesOf,
  type AnimationInfo, type Measured, type Point, type RenderedCircle, type SvgModel,
} from "./svg-model";

interface WheelPart {
  anim: AnimationInfo;
  /** 圆心（目标元素局部坐标）与半径 */
  circle: { center: Measured; radius: number };
  absCenter: Measured;
}

export interface BikeParts {
  wheels: WheelPart[];
  crank: AnimationInfo | null;
  others: AnimationInfo[];
}

/** 旋转动画里圆最大的两个是车轮，剩下的旋转动画里挑最像曲柄的，其余归“其他” */
export function identifyParts(model: SvgModel): BikeParts {
  const rotating = model.animations.filter((a) => a.kind === "smil-rotate" || a.kind === "css-rotate");
  const circles = renderedCircles(model.root);
  const candidates = rotating
    .flatMap((anim) => wheelCandidates(anim, model.root, circles))
    .sort((a, b) => b.circle.radius - a.circle.radius);
  const wheels = candidates.slice(0, 2);
  const wheelTargets = new Set(wheels.map((w) => w.anim.target));
  const rest = rotating.filter((a) => !wheelTargets.has(a.target));
  const crank = pickCrank(rest, wheels, model.root);
  const used = new Set([...wheelTargets, ...(crank ? [crank.target] : [])]);
  return { wheels, crank, others: model.animations.filter((a) => !used.has(a.target)) };
}

/**
 * 一个旋转动画对应的车轮候选。目标子树里有圆就用它（偏心的按偏差扣分）；
 * 只有辐条时，按旋转中心在整幅画里找同心的最大圆当轮圈。目标经 <use> 实例化时每个实例一个候选。
 */
function wheelCandidates(anim: AnimationInfo, root: Element, circles: readonly RenderedCircle[]): WheelPart[] {
  const centers = rotationAbsCenters(anim, root);
  const inner = largestCircle(anim.target);
  if (inner) {
    return centers.map((abs) => ({ anim, circle: { center: inner.center, radius: inner.radius }, absCenter: shiftBy(abs, inner.center, anim) }));
  }
  const out: WheelPart[] = [];
  for (const abs of centers) {
    const rim = concentricCircle(circles, abs);
    if (!rim || !anim.rotateCenter) continue;
    out.push({ anim, circle: { center: { ...anim.rotateCenter, exact: abs.exact }, radius: rim.radius }, absCenter: rim.absCenter });
  }
  return out;
}

/** 子树里的圆相对目标局部原点的位置，叠到旋转中心的绝对位置上得到圆心绝对位置 */
function shiftBy(abs: Measured, local: Measured, anim: AnimationInfo): Measured {
  const rc = anim.rotateCenter ?? { x: 0, y: 0 };
  return { x: abs.x - rc.x + local.x, y: abs.y - rc.y + local.y, exact: abs.exact && local.exact };
}

/** 旋转中心在 viewBox 坐标里的位置；目标经 <use> 实例化时每个实例一个 */
function rotationAbsCenters(anim: AnimationInfo, root: Element): Measured[] {
  const rc = anim.rotateCenter;
  if (anim.centerMode === "absolute" && rc) return [{ ...rc, exact: true }];
  const local = anim.centerMode === "local" && rc ? rc : { x: 0, y: 0 };
  const instances = useInstancesOf(anim.target, root)[0];
  if (!instances) return insideDefs(anim.target) ? [] : [pointInAncestor(anim.target, root, local)];
  const inDefinition = pointInAncestor(anim.target, instances.definition, local);
  return instances.uses.map((use) =>
    pointInAncestor(use, root, { x: inDefinition.x + numberAttr(use, "x"), y: inDefinition.y + numberAttr(use, "y") }));
}

/** 曲柄：五通落在两轮之间的优先，其次不叫腿的，最后取文档顺序第一个 */
function pickCrank(rest: readonly AnimationInfo[], wheels: readonly WheelPart[], root: Element): AnimationInfo | null {
  if (rest.length === 0) return null;
  const inBand = wheels.length === 2
    ? rest.filter((a) => rotationAbsCenters(a, root).some((c) => withinWheelBand(c, wheels)))
    : [];
  const pool = inBand.length > 0 ? inBand : rest;
  return pool.find((a) => largestCircle(a.target) !== null && !isLegNamed(a.target))
    ?? pool.find((a) => !isLegNamed(a.target))
    ?? pool[0]
    ?? null;
}

function withinWheelBand(center: Point, wheels: readonly WheelPart[]): boolean {
  const [a, b] = wheels as [WheelPart, WheelPart];
  const radius = (a.circle.radius + b.circle.radius) / 2;
  const withinX = center.x >= Math.min(a.absCenter.x, b.absCenter.x) && center.x <= Math.max(a.absCenter.x, b.absCenter.x);
  const withinY = center.y >= Math.min(a.absCenter.y, b.absCenter.y) - radius && center.y <= Math.max(a.absCenter.y, b.absCenter.y) + radius;
  return withinX && withinY;
}

export function scoreWheels(parts: BikeParts, model: SvgModel, spec: CriterionSpec): CriterionResult {
  if (parts.wheels.length === 0) return result(spec, 0, "未找到含圆且带旋转动画的车轮");
  const notes: string[] = [];
  let points = 0;
  for (const wheel of parts.wheels) {
    const verdict = rotationCenterScore(wheel.anim, wheel.circle, wheel.absCenter);
    points += verdict.points;
    notes.push(`${wheel.anim.name} ${verdict.note}`);
  }
  if (parts.wheels.length === 1) notes.push("只找到一个车轮");
  return result(spec, Math.round((spec.maxScore * points) / 2), [...new Set(notes)].join("；"));
}

export function scoreCrank(parts: BikeParts, model: SvgModel, spec: CriterionSpec): CriterionResult {
  const crank = parts.crank;
  if (!crank) return result(spec, 0, "车轮之外没有旋转动画，未找到曲柄");
  if (!crank.additive && hasOwnTransform(crank.target)) {
    return result(spec, 0, `${crank.name} 的 animateTransform 未加 additive="sum"，动画会覆盖自身 transform`);
  }
  const circle = largestCircle(crank.target);
  const verdict = circle
    ? rotationCenterScore(crank, circle, addMeasured(absoluteOffset(crank.target, model.root), circle.center))
    : null;
  // 组内的圆只有与旋转中心大致同心时才当牙盘看；偏在曲柄末端的是脚踏，不参与判定
  const chainring = verdict?.concentric ? verdict : null;
  const position = crankPosition(crank, parts, model);
  const points = Math.min(position.points, chainring?.points ?? 1);
  const notes = [`${crank.name} ${position.note}`, chainring ? chainring.note : verdict ? "组内的圆偏在曲柄末端，视为脚踏，按位置判" : "曲柄组内无圆，按位置判"];
  return result(spec, Math.round(spec.maxScore * points), notes.join("；"));
}

export function scoreLoop(parts: BikeParts, spec: CriterionSpec): CriterionResult {
  const key = [...parts.wheels.map((w) => w.anim), ...(parts.crank ? [parts.crank] : [])];
  if (key.length === 0) return result(spec, 0, "没有车轮或曲柄动画");
  const looping = key.filter((a) => a.indefinite);
  const note = looping.length === key.length
    ? `${key.length} 个旋转动画都是 indefinite / infinite`
    : `${key.length - looping.length} 个旋转动画不是无限循环：${key.filter((a) => !a.indefinite).map((a) => a.name).join("、")}`;
  return result(spec, Math.round((spec.maxScore * looping.length) / key.length), note);
}

const LEG_NAME = /leg|foot|feet|thigh|shin|knee|calf/i;

export function scoreLegs(parts: BikeParts, spec: CriterionSpec): CriterionResult {
  const reference = parts.crank?.durMs ?? parts.wheels[0]?.anim.durMs ?? null;
  const candidates = parts.others.filter((a) => a.durMs !== null);
  if (candidates.length === 0) return result(spec, 0, "车轮与曲柄之外没有带时长的动画，未找到腿部运动");
  const named = candidates.filter((a) => isLegNamed(a.target));
  const firstNamed = named[0];
  if (reference === null) {
    return firstNamed
      ? result(spec, Math.round(spec.maxScore / 2), `找到腿部动画 ${firstNamed.name}，但曲柄周期未知`)
      : result(spec, 0, "曲柄周期未知且没有命名为腿的动画");
  }
  const namedMatch = named.find((a) => periodMatches(a.durMs!, reference));
  if (namedMatch) return result(spec, spec.maxScore, `${namedMatch.name} 周期 ${ms(namedMatch.durMs!)} 与曲柄 ${ms(reference)} 同步`);
  const anyMatch = candidates.find((a) => periodMatches(a.durMs!, reference));
  if (anyMatch) return result(spec, spec.maxScore, `${anyMatch.name} 周期 ${ms(anyMatch.durMs!)} 与曲柄 ${ms(reference)} 同步（未命名为腿，是否为腿待渲染层核对）`);
  if (firstNamed) return result(spec, Math.round(spec.maxScore / 3), `${firstNamed.name} 周期 ${ms(firstNamed.durMs!)} 与曲柄 ${ms(reference)} 不成整数比`);
  return result(spec, 0, `${candidates.length} 个其他动画的周期都与曲柄 ${ms(reference)} 无关`);
}

/** 旋转中心与圆心的偏差：不超过半径 5% 记满分，超过一个半径记零分，中间线性 */
function rotationCenterScore(
  anim: AnimationInfo,
  circle: { center: Measured; radius: number },
  absCenter: Measured,
): { points: number; note: string; concentric: boolean } {
  if (!anim.additive && hasOwnTransform(anim.target)) {
    return { points: 0, concentric: true, note: `animateTransform 未加 additive="sum"，动画会覆盖自身 transform，轮子会飞离` };
  }
  if (anim.centerMode === "fill-box-center") return { points: 1, concentric: true, note: "transform-box: fill-box 且原点居中" };
  if (anim.centerMode === "unknown" || anim.rotateCenter === null) return { points: 0.5, concentric: true, note: "旋转中心无法静态判定" };
  const expected = anim.centerMode === "local" ? circle.center : absCenter;
  const dist = distance(anim.rotateCenter, expected);
  const tolerance = circle.radius * 0.05;
  const points = dist <= tolerance ? 1 : Math.max(0, 1 - (dist - tolerance) / (circle.radius - tolerance));
  const exactness = expected.exact ? "" : "（路径含非平移变换，量测不精确）";
  return { points, concentric: dist <= circle.radius, note: `旋转中心偏离圆心 ${dist.toFixed(1)}，半径 ${circle.radius.toFixed(1)}${exactness}` };
}

/** 五通应在两轮之间、轴线上下一个半径内 */
function crankPosition(crank: AnimationInfo, parts: BikeParts, model: SvgModel): { points: number; note: string } {
  if (parts.wheels.length < 2) return { points: 0.8, note: "车轮不足两个，无法核对五通位置" };
  const center = crankAbsoluteCenter(crank, model);
  if (!center) return { points: 0.8, note: "旋转中心无法静态定位" };
  const [a, b] = parts.wheels as [WheelPart, WheelPart];
  const where = `五通 (${center.x.toFixed(0)}, ${center.y.toFixed(0)})`;
  if (withinWheelBand(center, parts.wheels)) return { points: 1, note: `${where} 在两轮之间` };
  return { points: 0.25, note: `${where} 不在两轮之间（轮心 (${a.absCenter.x.toFixed(0)}, ${a.absCenter.y.toFixed(0)}) 与 (${b.absCenter.x.toFixed(0)}, ${b.absCenter.y.toFixed(0)})）` };
}

function crankAbsoluteCenter(crank: AnimationInfo, model: SvgModel): Point | null {
  if (crank.rotateCenter === null || crank.centerMode === "fill-box-center" || crank.centerMode === "unknown") return null;
  return rotationAbsCenters(crank, model.root)[0] ?? null;
}

/** id / class、紧邻的注释、title / desc 子元素里提到腿脚都算命名 */
function isLegNamed(el: Element): boolean {
  let cursor: Element | null = el;
  for (let depth = 0; cursor && depth < 3; depth += 1) {
    const label = `${cursor.getAttribute("id") ?? ""} ${cursor.getAttribute("class") ?? ""} ${precedingComment(cursor)}`;
    if (LEG_NAME.test(label)) return true;
    const caption = cursor.querySelector(":scope > title, :scope > desc")?.textContent ?? "";
    if (LEG_NAME.test(caption)) return true;
    cursor = cursor.parentElement;
  }
  return false;
}

const COMMENT_NODE = 8;
const TEXT_NODE = 3;

function precedingComment(el: Element): string {
  let node = el.previousSibling;
  while (node && node.nodeType === TEXT_NODE && (node.textContent ?? "").trim() === "") node = node.previousSibling;
  return node && node.nodeType === COMMENT_NODE ? node.textContent ?? "" : "";
}

function numberAttr(el: Element, name: string): number {
  const value = Number(el.getAttribute(name) ?? "0");
  return Number.isFinite(value) ? value : 0;
}

function periodMatches(a: number, b: number): boolean {
  const ratio = Math.max(a, b) / Math.min(a, b);
  return Math.abs(ratio - Math.round(ratio)) < 0.02;
}

function hasOwnTransform(el: Element): boolean {
  const value = el.getAttribute("transform");
  return value !== null && value.trim() !== "";
}

function addMeasured(a: Measured, b: Measured): Measured {
  return { x: a.x + b.x, y: a.y + b.y, exact: a.exact && b.exact };
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function ms(value: number): string {
  return `${Math.round(value)}ms`;
}

function result(spec: CriterionSpec, score: number, reason: string): CriterionResult {
  return { id: spec.id, source: "static", title: spec.title, standard: spec.standard, maxScore: spec.maxScore, score, reason };
}

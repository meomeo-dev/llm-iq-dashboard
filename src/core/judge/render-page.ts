/**
 * 在浏览器页面里执行的量测脚本。这里的函数由 Playwright 序列化后送进页面运行，
 * 只能引用参数、DOM 与随 PAGE_HELPERS 一起注入的助手，不能引用本模块的其他符号或常量。
 */

/** 要跟踪的元素：point 给出时量该局部坐标点经变换后的位置，否则量包围盒中心 */
export interface TrackSpec {
  key: string;
  path: number[];
  point: { x: number; y: number } | null;
}

export interface TrackSample {
  key: string;
  /** 量测点在根坐标系里的位置 */
  x: number;
  y: number;
  width: number;
  height: number;
  /** 量测点是否落在 viewBox 之外 */
  outside: boolean;
}

export interface StageInfo {
  viewBox: { x: number; y: number; width: number; height: number };
}

/** 统一根元素尺寸、补 viewBox、暂停全部动画；返回 viewBox 供越界判断 */
export function prepareStage(size: number): StageInfo {
  const root = document.documentElement as unknown as SVGSVGElement;
  if (!root.getAttribute("viewBox")) {
    const w = Number.parseFloat(root.getAttribute("width") ?? "");
    const h = Number.parseFloat(root.getAttribute("height") ?? "");
    if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) root.setAttribute("viewBox", `0 0 ${w} ${h}`);
    else {
      const box = root.getBBox();
      root.setAttribute("viewBox", `${box.x} ${box.y} ${Math.max(box.width, 1)} ${Math.max(box.height, 1)}`);
    }
  }
  root.setAttribute("width", String(size));
  root.setAttribute("height", String(size));
  root.setAttribute("preserveAspectRatio", "xMidYMid meet");
  root.pauseAnimations();
  for (const animation of document.getAnimations()) animation.pause();
  const vb = root.viewBox.baseVal;
  return { viewBox: { x: vb.x, y: vb.y, width: vb.width, height: vb.height } };
}

/** 把 SMIL 与 CSS 动画一起定格到 ms 时刻，等两帧让布局更新 */
export function seekTo(ms: number): Promise<void> {
  const root = document.documentElement as unknown as SVGSVGElement;
  root.setCurrentTime(ms / 1000);
  for (const animation of document.getAnimations()) animation.currentTime = ms;
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

/** 把根元素的 viewBox 换成给定区域：动画已定格，只改取景框，用来截关键部位的放大图 */
export function setViewBox(box: StageInfo["viewBox"]): void {
  document.documentElement.setAttribute("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
}

export function measureTracks(tracks: TrackSpec[]): TrackSample[] {
  const root = document.documentElement as unknown as SVGSVGElement;
  const vb = root.viewBox.baseVal;
  // 元素 → 屏幕 再乘 根 → 屏幕 的逆，得到元素局部坐标到根用户坐标（viewBox 单位）的变换
  const rootToScreen = root.getScreenCTM();
  const out: TrackSample[] = [];
  for (const track of tracks) {
    const node = resolvePath(root, track.path);
    if (!(node instanceof SVGGraphicsElement) || !rootToScreen) continue;
    const toScreen = node.getScreenCTM();
    if (!toScreen) continue;
    const ctm = rootToScreen.inverse().multiply(toScreen);
    const box = node.getBBox();
    const local = track.point ?? { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const point = new DOMPoint(local.x, local.y).matrixTransform(ctm);
    // 贴着边缘（含正好落在 viewBox 原点）也算出画布：部件中心不会合法地压在画框上
    const marginX = vb.width * 0.005;
    const marginY = vb.height * 0.005;
    const outside = point.x < vb.x + marginX || point.x > vb.x + vb.width - marginX
      || point.y < vb.y + marginY || point.y > vb.y + vb.height - marginY;
    out.push({ key: track.key, x: point.x, y: point.y, width: box.width, height: box.height, outside });
  }
  return out;
}

/** 脚尖在腿子树里的位置：第几个几何元素、沿路径的弧长；首帧定下后逐帧追踪同一点 */
export interface FootAnchor {
  shape: number;
  length: number;
}

/** 一条腿：hip 给出时是目标局部坐标里的髋关节（旋转中心），否则取腿上最高点当髋 */
export interface LegSpec {
  key: string;
  path: number[];
  hip: { x: number; y: number } | null;
  /** 首帧量出的脚尖；null 时取离髋最远的采样点并把它报回来 */
  anchor: FootAnchor | null;
  /** 首帧离脚尖最近的脚踏点（根坐标）；给出后逐帧随曲柄搬运，量它是否还贴在腿上 */
  startPedal: { x: number; y: number } | null;
}

export interface FeetSpec {
  legs: LegSpec[];
  /** 曲柄：center 是目标局部坐标里的五通，缺省取采样点重心 */
  crank: { path: number[]; center: { x: number; y: number } | null } | null;
  /** 曲柄伸出长度的上限（取车轮半径）：曲柄组里离五通更远的几何不是曲柄，不参与量测 */
  maxReach: number;
  /** 首帧曲柄组到根坐标的变换；与当前帧相除得到曲柄的刚体运动 */
  baseCrank: Matrix2D | null;
}

/** 2×3 仿射矩阵 [a, b, c, d, e, f]，与 SVG 的 matrix() 同序 */
export type Matrix2D = [number, number, number, number, number, number];

export interface FootSample {
  key: string;
  /** 脚尖与髋在根坐标里的位置 */
  foot: { x: number; y: number };
  hip: { x: number; y: number };
  anchor: FootAnchor;
  /** 脚踏区里离脚尖最近的采样点，及其距离 */
  pedal: { x: number; y: number };
  gap: number;
  /** 首帧脚踏点随曲柄搬到这一帧后，离腿下半段最近采样点的距离（首帧就是 pedal 自己到腿的距离） */
  deviation: number;
}

export interface FeetMeasure {
  /** 五通到曲柄最远采样点的距离，即曲柄臂加脚踏的伸出长度；量不到为 0 */
  crankReach: number;
  /** 曲柄组这一帧到根坐标的变换；跨帧相除就是曲柄的刚体运动 */
  crank: Matrix2D | null;
  /** 五通在根坐标里的位置 */
  axle: { x: number; y: number } | null;
  feet: FootSample[];
}

/**
 * 下面这些几何助手在页面里跑，供 measureFeet 等页面函数调用。它们随 PAGE_HELPERS 一起序列化进页面，
 * 所以只能引用参数、DOM 与彼此，不能引用本模块的其他符号或常量。
 */

/** 按子元素下标路径找元素 */
export function resolvePath(root: Element, path: number[]): Element | undefined {
  let node: Element | undefined = root;
  for (const index of path) node = node?.children[index];
  return node;
}

/** 元素局部坐标 → 根用户坐标的变换；不是图形元素时为 null */
export function matrixToRoot(node: Element, toRoot: DOMMatrix): DOMMatrix | null {
  const ctm = node instanceof SVGGraphicsElement ? node.getScreenCTM() : null;
  return ctm ? toRoot.multiply(ctm) : null;
}

/** 子树里的几何元素（含自身），文档顺序 */
export function shapesOf(node: Element): SVGGeometryElement[] {
  return [node, ...node.querySelectorAll("*")].filter((el): el is SVGGeometryElement => el instanceof SVGGeometryElement);
}

/** 子树里每个几何元素沿路径 16 等分采样，换算到根坐标；<use> 的影子树量不到 */
export function samplePoints(node: Element, toRoot: DOMMatrix): { point: DOMPoint; anchor: FootAnchor }[] {
  const out: { point: DOMPoint; anchor: FootAnchor }[] = [];
  shapesOf(node).forEach((shape, index) => {
    const matrix = matrixToRoot(shape, toRoot);
    const total = shape.getTotalLength();
    if (!matrix || !(total > 0)) return;
    for (let i = 0; i <= 16; i += 1) {
      const length = (total * i) / 16;
      out.push({ point: shape.getPointAtLength(length).matrixTransform(matrix), anchor: { shape: index, length } });
    }
  });
  return out;
}

export function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** 曲柄这一帧的量测：变换、五通、伸出长度与脚踏区（伸出长度最外 30%）；量不到为 null */
export function measureCrank(spec: FeetSpec, root: Element, toRoot: DOMMatrix): {
  crank: Matrix2D; axle: DOMPoint; crankReach: number; pedalZone: DOMPoint[];
} | null {
  const node = spec.crank ? resolvePath(root, spec.crank.path) : undefined;
  const matrix = node ? matrixToRoot(node, toRoot) : null;
  if (!spec.crank || !node || !matrix) return null;
  const points = samplePoints(node, toRoot).map((s) => s.point);
  if (points.length === 0) return null;
  const centroid = new DOMPoint(points.reduce((sum, p) => sum + p.x, 0) / points.length, points.reduce((sum, p) => sum + p.y, 0) / points.length);
  const axle = spec.crank.center ? new DOMPoint(spec.crank.center.x, spec.crank.center.y).matrixTransform(matrix) : centroid;
  const arm = points.filter((p) => distance(p, axle) <= spec.maxReach);
  const crankReach = Math.max(0, ...arm.map((p) => distance(p, axle)));
  if (!(crankReach > 0)) return null;
  const crank: Matrix2D = [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f];
  return { crank, axle, crankReach, pedalZone: arm.filter((p) => distance(p, axle) >= crankReach * 0.7) };
}

/** 首帧根坐标里的点按曲柄从 base 到 now 的刚体运动搬过来：now · base⁻¹ · p */
export function carryByCrank(base: Matrix2D, now: Matrix2D, p: { x: number; y: number }): DOMPoint {
  // getScreenCTM 给的是旧式 SVGMatrix，与 DOMMatrix 不能直接相乘，统一用数组构造 DOMMatrix
  return new DOMPoint(p.x, p.y).matrixTransform(new DOMMatrix(now).multiply(new DOMMatrix(base).inverse()));
}

/** 一条腿这一帧的量测；腿量不到或没有脚踏区时为 null */
export function measureLeg(
  leg: LegSpec, spec: FeetSpec, root: Element, toRoot: DOMMatrix, crank: NonNullable<ReturnType<typeof measureCrank>>,
): FootSample | null {
  const node = resolvePath(root, leg.path);
  const matrix = node ? matrixToRoot(node, toRoot) : null;
  if (!node || !matrix) return null;
  const points = samplePoints(node, toRoot);
  if (points.length === 0) return null;
  const topmost = points.reduce((best, s) => (s.point.y < best.point.y ? s : best)).point;
  const hip = leg.hip ? new DOMPoint(leg.hip.x, leg.hip.y).matrixTransform(matrix) : topmost;
  const farthest = points.reduce((best, s) => (distance(s.point, hip) > distance(best.point, hip) ? s : best));
  const reach = distance(farthest.point, hip);
  const anchorShape = leg.anchor ? shapesOf(node)[leg.anchor.shape] : undefined;
  const anchorMatrix = anchorShape ? matrixToRoot(anchorShape, toRoot) : null;
  const foot = leg.anchor && anchorShape && anchorMatrix
    ? anchorShape.getPointAtLength(leg.anchor.length).matrixTransform(anchorMatrix)
    : farthest.point;
  let pedal: DOMPoint | null = null;
  for (const p of crank.pedalZone) if (!pedal || distance(p, foot) < distance(pedal, foot)) pedal = p;
  if (!pedal) return null;
  // 腿的下半段：离髋不少于伸展长度一半的采样点；首帧脚踏点搬过来后应始终贴着它
  const lower = points.filter((s) => distance(s.point, hip) >= reach * 0.5).map((s) => s.point);
  const moved = leg.startPedal && spec.baseCrank ? carryByCrank(spec.baseCrank, crank.crank, leg.startPedal) : pedal;
  const deviation = lower.length > 0 ? Math.min(...lower.map((p) => distance(p, moved))) : 0;
  return {
    key: leg.key, foot: { x: foot.x, y: foot.y }, hip: { x: hip.x, y: hip.y }, anchor: leg.anchor ?? farthest.anchor,
    pedal: { x: pedal.x, y: pedal.y }, gap: distance(foot, pedal), deviation,
  };
}

/** 随页面函数一起注入的助手；顺序无关，都是函数声明 */
export const PAGE_HELPERS = [resolvePath, matrixToRoot, shapesOf, samplePoints, distance, measureCrank, carryByCrank, measureLeg];

/** 脚尖与脚踏的位置：把腿与曲柄的几何沿路径采样后在根坐标里量 */
export function measureFeet(spec: FeetSpec): FeetMeasure {
  const root = document.documentElement as unknown as SVGSVGElement;
  const rootToScreen = root.getScreenCTM();
  const empty: FeetMeasure = { crankReach: 0, crank: null, axle: null, feet: [] };
  if (!rootToScreen) return empty;
  const toRoot = rootToScreen.inverse();
  const crank = measureCrank(spec, root, toRoot);
  if (!crank) return empty;
  const feet: FootSample[] = [];
  for (const leg of spec.legs) {
    const sample = measureLeg(leg, spec, root, toRoot, crank);
    if (sample) feet.push(sample);
  }
  return { crankReach: crank.crankReach, crank: crank.crank, axle: { x: crank.axle.x, y: crank.axle.y }, feet };
}

export interface RiderSpec {
  /** 车轮与曲柄子树（元素路径）：不算骑手 */
  exclude: number[][];
  /** 轮顶线（根坐标 y）：中心落在它以下的几何是车身或地面；没有车轮时为 null，按画面上半 */
  wheelTop: number | null;
}

export type Box = { x: number; y: number; width: number; height: number };

/**
 * 骑手（鹈鹕）在根坐标里的包围盒：排除车轮、曲柄、覆盖画面六成以上的背景，以及轮顶线以下的几何，
 * 其余几何的包围盒取并集。定位头与喙、整体姿态的取景框用。
 */
export function measureRider(spec: RiderSpec): Box | null {
  const root = document.documentElement as unknown as SVGSVGElement;
  const rootToScreen = root.getScreenCTM();
  if (!rootToScreen) return null;
  const toRoot = rootToScreen.inverse();
  const vb = root.viewBox.baseVal;
  const excluded = spec.exclude.map((path) => resolvePath(root, path)).filter((node): node is Element => node !== undefined);
  const wheelTop = spec.wheelTop ?? vb.y + vb.height / 2;
  let union: Box | null = null;
  for (const shape of root.querySelectorAll("*")) {
    if (!(shape instanceof SVGGeometryElement) || shape.closest("defs")) continue;
    if (excluded.some((node) => node.contains(shape))) continue;
    const ctm = shape.getScreenCTM();
    if (!ctm) continue;
    const local = shape.getBBox();
    const matrix = toRoot.multiply(ctm);
    const corners = [
      new DOMPoint(local.x, local.y), new DOMPoint(local.x + local.width, local.y),
      new DOMPoint(local.x, local.y + local.height), new DOMPoint(local.x + local.width, local.y + local.height),
    ].map((p) => p.matrixTransform(matrix));
    const xs = corners.map((p) => p.x);
    const ys = corners.map((p) => p.y);
    const box = { x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
    if (box.width * box.height > vb.width * vb.height * 0.6) continue;
    if (box.y + box.height / 2 >= wheelTop) continue;
    union = union
      ? { x: Math.min(union.x, box.x), y: Math.min(union.y, box.y),
          width: Math.max(union.x + union.width, box.x + box.width) - Math.min(union.x, box.x),
          height: Math.max(union.y + union.height, box.y + box.height) - Math.min(union.y, box.y) }
      : box;
  }
  return union;
}

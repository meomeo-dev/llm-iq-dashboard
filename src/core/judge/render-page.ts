/**
 * 在浏览器页面里执行的量测脚本。这里的函数由 Playwright 序列化后送进页面运行，
 * 只能引用参数与 DOM，不能引用本模块的其他符号。
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

export function measureTracks(tracks: TrackSpec[]): TrackSample[] {
  const root = document.documentElement as unknown as SVGSVGElement;
  const vb = root.viewBox.baseVal;
  // 元素 → 屏幕 再乘 根 → 屏幕 的逆，得到元素局部坐标到根用户坐标（viewBox 单位）的变换
  const rootToScreen = root.getScreenCTM();
  const out: TrackSample[] = [];
  for (const track of tracks) {
    let node: Element | undefined = root;
    for (const index of track.path) node = node?.children[index];
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

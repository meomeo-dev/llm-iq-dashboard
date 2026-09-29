/**
 * 结果集 GIF：静态层（标题、卡片框、文字）栅格化一次，作品逐帧画进各自的图框，交 modern-gif 编码。
 * 帧不靠实时录制——作为图片加载的 SVG 其动画在浏览器里只在文档可见且被观察时前进，画进画布时经常
 * 停在同一帧。改为把时刻烘进作品副本：SMIL 动画的 begin 统一减去 t，CSS 动画加负延时并暂停；每帧一份
 * 副本解码后立即画，帧与帧之间只差 t，不依赖标签页是否可见。
 */

import { Encoder } from "modern-gif";
import { rasterize, svgDataUri } from "./export-image";
import type { ArtFrame, RenderedResultSet } from "./result-set-svg";

export const GIF_FPS = 10;
export const GIF_SECONDS = 3;
/** 单帧像素上限：帧在编码前都驻留内存（30 帧 × 4 字节 × 像素），超出按比例缩小 */
const MAX_FRAME_PIXELS = 1_000_000;
const MAX_COLORS = 255;
const SVG_NS = "http://www.w3.org/2000/svg";
const SMIL_ELEMENTS = "animate, animateTransform, animateMotion, set";

export interface FramePlan {
  count: number;
  delayMs: number;
  /** 合成图到 GIF 的倍率，≤ 1 */
  scale: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function planFrames(width: number, height: number): FramePlan {
  const scale = Math.min(1, Math.sqrt(MAX_FRAME_PIXELS / (width * height)));
  return { count: GIF_FPS * GIF_SECONDS, delayMs: Math.round(1000 / GIF_FPS), scale };
}

/**
 * 作品副本停在第 seconds 秒：SMIL 的 begin 是时钟值（列表）时逐项减去 seconds，缺省视为 0s；
 * 事件或同步基准（如 `click`、`a.end+1s`）不改写，这类动画停在起始态。CSS 动画统一加负延时并暂停，
 * 作者写的 animation-delay 会被覆盖。
 */
export function bakeTime(svg: SVGElement, seconds: number): SVGElement {
  const copy = svg.cloneNode(true) as SVGElement;
  for (const element of copy.querySelectorAll(SMIL_ELEMENTS)) {
    const begin = element.getAttribute("begin");
    const offsets = begin === null ? [0] : begin.split(";").map(parseClock);
    if (offsets.some((offset) => offset === null)) continue;
    element.setAttribute("begin", offsets.map((offset) => `${formatSeconds((offset as number) - seconds)}`).join(";"));
  }
  const style = copy.ownerDocument.createElementNS(SVG_NS, "style");
  style.textContent = `* { animation-delay: ${formatSeconds(-seconds)} !important; animation-play-state: paused !important; }`;
  copy.insertBefore(style, copy.firstChild);
  return copy;
}

/** SMIL 时钟值的常见写法：`1.5s`、`500ms`、`0.2`（秒）；其余返回 null */
export function parseClock(value: string): number | null {
  const match = /^\s*(-?\d+(?:\.\d+)?)\s*(ms|s)?\s*$/.exec(value);
  if (match === null) return null;
  const number = Number.parseFloat(match[1]!);
  return match[2] === "ms" ? number / 1000 : number;
}

function formatSeconds(seconds: number): string {
  return `${Math.round(seconds * 1000) / 1000}s`;
}

/** 作品在框内等比居中（与 preserveAspectRatio="xMidYMid meet" 一致）；不知道作品尺寸时占满框 */
export function fitRect(natural: { width: number; height: number } | null, box: Rect): Rect {
  if (natural === null || natural.width <= 0 || natural.height <= 0) return box;
  const ratio = Math.min(box.width / natural.width, box.height / natural.height);
  const width = natural.width * ratio;
  const height = natural.height * ratio;
  return { x: box.x + (box.width - width) / 2, y: box.y + (box.height - height) / 2, width, height };
}

/** 从 viewBox 读作品的固有尺寸；fitToFrame 已把宽高改成 100%，只能从这里知道比例 */
export function naturalSize(svg: SVGElement): { width: number; height: number } | null {
  const parts = (svg.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) return null;
  return { width: parts[2]!, height: parts[3]! };
}

export function scaleRect(rect: Rect, scale: number): Rect {
  return { x: rect.x * scale, y: rect.y * scale, width: rect.width * scale, height: rect.height * scale };
}

/** modern-gif 的 Worker 脚本地址；打包器把它当静态资源发出（走包的 `./*` 导出，`./worker` 子路径 webpack 解析不到） */
function workerUrl(): string {
  return new URL("modern-gif/dist/worker.js", import.meta.url).href;
}

export type GifProgress = (done: number, total: number) => void;

/**
 * 逐帧合成并编码。`rendered` 须以 artMode: "blank" 渲染；`sources` 是净化并适配后的作品元素，
 * 键与 artFrames 一致。每帧的作品副本用完即弃，帧数据交给 Worker 后主线程不再持有。
 */
export async function encodeResultSetGif(
  rendered: RenderedResultSet,
  sources: ReadonlyMap<string, SVGElement>,
  onProgress: GifProgress,
): Promise<Blob> {
  const plan = planFrames(rendered.width, rendered.height);
  const base = await rasterize(rendered, plan.scale);
  const canvas = document.createElement("canvas");
  canvas.width = base.width;
  canvas.height = base.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (context === null) throw new Error("浏览器无法创建画布");
  const encoder = new Encoder({ width: canvas.width, height: canvas.height, workerUrl: workerUrl(), maxColors: MAX_COLORS, looped: true });
  const frames = rendered.artFrames.filter((frame) => sources.has(frame.key));

  for (let index = 0; index < plan.count; index += 1) {
    const seconds = index / GIF_FPS;
    const images = await Promise.all(frames.map((frame) => loadFrameImage(sources.get(frame.key)!, seconds, frame)));
    context.drawImage(base, 0, 0);
    for (const { image, frame, natural } of images) {
      const rect = fitRect(natural, scaleRect(frame, plan.scale));
      context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
    }
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    await encoder.encode({ data, delay: plan.delayMs });
    onProgress(index + 1, plan.count);
  }
  return encoder.flush("blob");
}

async function loadFrameImage(svg: SVGElement, seconds: number, frame: ArtFrame) {
  const baked = bakeTime(svg, seconds);
  const image = new Image();
  image.src = svgDataUri(new XMLSerializer().serializeToString(baked));
  await image.decode();
  return { image, frame, natural: naturalSize(svg) };
}

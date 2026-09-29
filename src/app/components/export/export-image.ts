/**
 * 导出的浏览器端环节：准备缩略图、读取主题色、栅格化为 PNG、触发下载。
 * 绘制内容见 timeline-svg.ts。
 */

import type { DashboardCard } from "@/core/types";
import type { Moment } from "../timeline/moments";
import { fetchArtSource } from "../card/art-source";
import { rawSvgHref } from "../card/card-format";
import { fitToFrame } from "../card/svg-fit";
import { sanitizeSvg } from "../card/svg-sanitize";
import { thumbnailKey, type Palette, type RenderedSvg } from "./timeline-svg";

/** 画布上限（Chrome 单边约 16384px、面积约 2.68 亿像素）；超出时降低倍率 */
const MAX_CANVAS_SIDE = 16_000;
const MAX_CANVAS_AREA = 200_000_000;
const PNG_SCALE = 2;

/**
 * 取回作品源码（页面数据不含源码，见 ACR-003），经与看板相同的净化后序列化为 data URI；
 * 取不到的作品跳过。XMLSerializer 会补上 xmlns，缺它的 SVG 作为图片加载时是空白。
 */
export async function buildThumbnails(moments: readonly Moment[]): Promise<Map<string, string>> {
  return thumbnailsFrom(await buildArtSources(moments.flatMap((moment) => moment.cards)));
}

/** 净化并适配到框的作品元素，键见 thumbnailKey；取不到或净化后为空的作品不在其中 */
export async function buildArtSources(cards: readonly DashboardCard[]): Promise<Map<string, SVGElement>> {
  const sources = new Map<string, SVGElement>();
  const raws = await Promise.all(cards.map(readSource));
  for (const [index, card] of cards.entries()) {
    const raw = raws[index];
    if (raw === null || raw === undefined) continue;
    const { element } = sanitizeSvg(raw);
    if (element === null) continue;
    sources.set(thumbnailKey(card), fitToFrame(element));
  }
  return sources;
}

export function thumbnailsFrom(sources: ReadonlyMap<string, SVGElement>): Map<string, string> {
  const serializer = new XMLSerializer();
  return new Map([...sources].map(([key, element]) => [key, svgDataUri(serializer.serializeToString(element))]));
}

export function svgDataUri(source: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
}

async function readSource(card: DashboardCard): Promise<string | null> {
  const href = rawSvgHref(card);
  if (href === null) return null;
  try {
    return await fetchArtSource(href);
  } catch {
    return null;
  }
}

/** 从页面 CSS 变量取色，使导出图与看板配色一致 */
export function readPalette(): Palette {
  const style = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string): string => style.getPropertyValue(name).trim() || fallback;
  return {
    bg: read("--bg", "#0b0f17"),
    surface: read("--surface", "#10161f"),
    surfaceHi: read("--surface-hi", "#182030"),
    border: read("--border", "#232d3d"),
    text: read("--text", "#e6e8ee"),
    textDim: read("--text-dim", "#9aa2b1"),
    textFaint: read("--text-faint", "#6b7385"),
    accent: read("--accent", "#4f8df7"),
    ok: read("--ok", "#4ade80"),
    warn: read("--warn", "#fbbf24"),
    err: read("--err", "#f87171"),
  };
}

export function downloadSvg(rendered: RenderedSvg, filename: string): void {
  downloadBlob(new Blob([rendered.svg], { type: "image/svg+xml" }), filename);
}

/** SVG 作为图片解码后画进画布，再编码为 PNG */
export async function downloadPng(rendered: RenderedSvg, filename: string): Promise<void> {
  downloadBlob(await canvasToPng(await rasterize(rendered, pngScale(rendered))), filename);
}

/** SVG 字符串按倍率画进新画布；画布底色由 SVG 自己的背景矩形决定 */
export async function rasterize(rendered: RenderedSvg, scale: number): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(new Blob([rendered.svg], { type: "image/svg+xml" }));
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(rendered.width * scale);
    canvas.height = Math.round(rendered.height * scale);
    const context = canvas.getContext("2d");
    if (context === null) throw new Error("浏览器无法创建画布");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function pngScale({ width, height }: RenderedSvg): number {
  return Math.min(PNG_SCALE, MAX_CANVAS_SIDE / width, MAX_CANVAS_SIDE / height, Math.sqrt(MAX_CANVAS_AREA / (width * height)));
}

function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob === null ? reject(new Error("PNG 编码失败")) : resolve(blob)), "image/png");
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  // 延迟回收：部分浏览器在 click 后立刻回收会导致下载失败
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

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
  const serializer = new XMLSerializer();
  const thumbnails = new Map<string, string>();
  const cards = moments.flatMap((moment) => moment.cards);
  const sources = await Promise.all(cards.map(readSource));
  for (const [index, card] of cards.entries()) {
    const raw = sources[index];
    if (raw === null || raw === undefined) continue;
    const { element } = sanitizeSvg(raw);
    if (element === null) continue;
    const source = serializer.serializeToString(fitToFrame(element));
    thumbnails.set(thumbnailKey(card), `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`);
  }
  return thumbnails;
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
  const scale = pngScale(rendered);
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
    downloadBlob(await canvasToPng(canvas), filename);
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

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  // 延迟回收：部分浏览器在 click 后立刻回收会导致下载失败
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

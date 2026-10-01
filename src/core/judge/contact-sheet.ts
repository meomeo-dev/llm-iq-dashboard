/**
 * 联系图：帧序联系表是一行 8 帧整幅画面；每类关键部位另出一张细节联系表，8 帧共用同一取景框，
 * 帧号与取样时刻和帧序表一致。帧与帧之间留中性灰的间隔，读图的人或模型能分清每一帧的范围。
 */

import type { Browser } from "playwright-core";
import type { Box, FeetMeasure, StageInfo, TrackSample } from "./render-page";
import type { ContactSheetDetail, DetailKind } from "./schema";

export const FRAME_SIZE = 320;
/** 帧间的间隔（像素） */
export const SHEET_GUTTER = 16;
const SHEET_BACKGROUND = "#6b6b6b";

/** 取景框清单里的一项：还没截图、没落盘 */
export type DetailPlan = Omit<ContactSheetDetail, "file">;

export interface DetailInput {
  feet: FeetMeasure;
  /** 首帧的车轮量测：跟踪键 → 位置与半径 */
  wheels: { key: string; sample: TrackSample; radius: number }[];
  /** 骑手（鹈鹕）包围盒；量不到为 null */
  rider: Box | null;
  stage: StageInfo;
}

/**
 * 按首帧量测定各类取景框：
 * - pelican 鹈鹕整体：骑手包围盒外扩 15%
 * - head 头与喙：骑手包围盒上部 40% 那一段
 * - crank 脚踏与脚：以五通为中心，边长为曲柄伸出长度的 4 倍（腿的末端与脚踏都在框内）
 * - saddle 座垫与臀：以腿的髋关节均值为中心；没有腿时取五通上方一个轮半径处
 * - handlebar 翅与车把：代码层量不到车把，这一类只在裁判定位（ai-locate.ts）时出表
 * - wheel-left / wheel-right：以轮心为中心，边长为直径的 1.3 倍
 * 取景框不小于画面短边的 1/5，免得部件画得极小时放大成马赛克
 */
export function detailPlans(input: DetailInput): DetailPlan[] {
  const { feet, wheels, rider, stage } = input;
  const shortSide = Math.min(stage.viewBox.width, stage.viewBox.height);
  const plans: DetailPlan[] = [];
  if (rider) {
    const center = { x: rider.x + rider.width / 2, y: rider.y + rider.height / 2 };
    plans.push(squarePlan("pelican", "鹈鹕整体", center, Math.max(rider.width, rider.height) * 1.15, shortSide, stage, ["C6", "C7", "C8", "C9"]));
    const headHeight = rider.height * 0.4;
    const head = { x: rider.x + rider.width / 2, y: rider.y + headHeight / 2 };
    plans.push(squarePlan("head", "头与喙", head, Math.max(rider.width, headHeight) * 1.1, shortSide, stage, ["C6"]));
  }
  const wheelRadius = wheels.length > 0 ? wheels.reduce((sum, w) => sum + w.radius, 0) / wheels.length : 0;
  if (feet.axle && feet.crankReach > 0) {
    plans.push(squarePlan("crank", "脚踏与脚", feet.axle, feet.crankReach * 4, shortSide, stage, ["C2", "C4", "C7"]));
    const hips = feet.feet.map((s) => s.hip);
    const saddle = hips.length > 0
      ? { x: hips.reduce((sum, h) => sum + h.x, 0) / hips.length, y: hips.reduce((sum, h) => sum + h.y, 0) / hips.length }
      : { x: feet.axle.x, y: feet.axle.y - wheelRadius };
    plans.push(squarePlan("saddle", "座垫与臀", saddle, Math.max(feet.crankReach * 3, wheelRadius), shortSide, stage, ["C7"]));
  }
  const ordered = [...wheels].sort((a, b) => a.sample.x - b.sample.x);
  ordered.forEach((wheel, i) => {
    const kind: DetailKind = i === 0 && ordered.length > 1 ? "wheel-left" : "wheel-right";
    plans.push(squarePlan(kind, i === 0 && ordered.length > 1 ? "左轮" : "右轮", wheel.sample, wheel.radius * 2.6, shortSide, stage, ["C1"]));
  });
  return plans;
}

/** 以 center 为中心造正方形取景框：边长取 wanted 与画面短边 1/5 的较大者，放大倍数按画面长边算 */
export function squarePlan(
  kind: DetailKind, subject: string, center: { x: number; y: number }, wanted: number,
  shortSide: number, stage: StageInfo, criteria: string[],
): DetailPlan {
  const side = round2(Math.max(wanted, shortSide / 5));
  const region = { x: round2(center.x - side / 2), y: round2(center.y - side / 2), width: side, height: side };
  const zoom = Math.max(stage.viewBox.width, stage.viewBox.height) / side;
  return { kind, subject, region, zoom: Math.round(zoom * 10) / 10, criteria };
}

/** 取景框写两位小数：量测值带浮点误差，记录里不该出现 74.49999999999994 */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** 一行帧格：每格左上角标帧号（细节表再带部位与倍数），在浏览器里拼好整体截图，不引入图像库 */
export async function composeContactSheet(browser: Browser, cells: readonly Buffer[], label: (index: number) => string): Promise<Buffer> {
  const width = SHEET_GUTTER + cells.length * (FRAME_SIZE + SHEET_GUTTER);
  const height = FRAME_SIZE + SHEET_GUTTER * 2;
  const items = cells.map((png, i) =>
    `<div class="cell"><img src="data:image/png;base64,${png.toString("base64")}" width="${FRAME_SIZE}" height="${FRAME_SIZE}"><span>${label(i)}</span></div>`);
  const html = `<!doctype html><html><head><style>
    body{margin:0;background:${SHEET_BACKGROUND}}
    .row{display:flex;gap:${SHEET_GUTTER}px;padding:${SHEET_GUTTER}px;width:${width}px;height:${height}px;box-sizing:border-box}
    .cell{position:relative;width:${FRAME_SIZE}px;height:${FRAME_SIZE}px;background:#fff}
    .cell img{display:block}
    .cell span{position:absolute;left:6px;top:4px;font:bold 15px/1 sans-serif;color:#fff;background:rgba(0,0,0,.6);padding:3px 7px;border-radius:4px;white-space:nowrap}
  </style></head><body><div class="row">${items.join("")}</div></body></html>`;
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  try {
    const page = await context.newPage();
    await page.setContent(html, { waitUntil: "load" });
    return await page.screenshot({ type: "png", fullPage: true });
  } finally {
    await context.close();
  }
}

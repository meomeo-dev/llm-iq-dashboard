/**
 * 渲染层：在无头 Chromium 里把作品定格到一个周期内的 8 个时刻，量车轮、曲柄与其他
 * 动画元素的位置，截帧拼成一行 8 帧的联系图，再把结果并进静态层的评审记录。
 */

import { rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Browser, Page } from "playwright-core";
import { acquireJudgeBrowser } from "./browser";
import { runDir } from "../paths";
import { measureTracks, prepareStage, seekTo, type TrackSpec } from "./render-page";
import { applyRenderResults, RENDER_JUDGE_ID, type FrameCapture, type RenderMeasurements } from "./render-score";
import type { Judgement, RubricSpec } from "./schema";
import { identifyParts, type BikeParts } from "./static-criteria";
import { elementPath, parseSvgModel, type SvgModel } from "./svg-model";

export const FRAME_COUNT = 8;
export const FRAME_SIZE = 320;
const DEFAULT_PERIOD_MS = 2000;

export interface RenderJudgeInput {
  source: string;
  judgement: Judgement;
  rubric: RubricSpec;
}

export type RenderOutcome = { ok: true; judgement: Judgement } | { ok: false; reason: string };

export async function renderJudge(input: RenderJudgeInput): Promise<RenderOutcome> {
  const parsed = parseSvgModel(input.source);
  if (!parsed.ok) return { ok: false, reason: parsed.error };
  const handle = await acquireJudgeBrowser();
  if (!handle.ok) return { ok: false, reason: handle.reason };
  const started = Date.now();
  const context = await handle.browser.newContext({ viewport: { width: FRAME_SIZE, height: FRAME_SIZE }, deviceScaleFactor: 1 });
  try {
    const page = await context.newPage();
    const parts = identifyParts(parsed.model);
    const tracks = buildTracks(parts, parsed.model);
    const periodMs = periodOf(parts);
    const measured = await captureFrames(page, input.source, tracks, periodMs);
    const sheet = await composeContactSheet(handle.browser, measured.frames);
    const { runId, attemptKey } = input.judgement.subject;
    const file = await saveContactSheet(runId, attemptKey, sheet);
    const judgedAt = new Date().toISOString();
    const judgement = applyRenderResults(input.judgement, input.rubric, measured, {
      kind: "code", id: RENDER_JUDGE_ID, judgedAt, durationMs: Date.now() - started,
    });
    return { ok: true, judgement: { ...judgement, contactSheet: {
      file, layout: "row", frameCount: FRAME_COUNT, frameSize: FRAME_SIZE, periodMs,
      sampleTimesMs: measured.frames.map((f) => f.timeMs),
    } } };
  } catch (cause) {
    return { ok: false, reason: cause instanceof Error ? cause.message.split("\n")[0] ?? "" : String(cause) };
  } finally {
    await context.close();
  }
}

interface TrackPlan {
  specs: TrackSpec[];
  wheelRadius: Map<string, number>;
  crankKey: string | null;
  otherKeys: string[];
}

/** 车轮量圆心（有内圆）或包围盒中心（<use> 实例、同心轮圈），曲柄与其他元素量包围盒中心 */
function buildTracks(parts: BikeParts, model: SvgModel): TrackPlan {
  const specs: TrackSpec[] = [];
  const wheelRadius = new Map<string, number>();
  parts.wheels.forEach((wheel, i) => {
    const key = `wheel${i + 1}`;
    const element = wheel.instance ?? wheel.anim.target;
    const point = wheel.instance !== null ? null : wheel.innerCircle ? { x: wheel.circle.center.x, y: wheel.circle.center.y } : localCenter(wheel.anim);
    specs.push({ key, path: elementPath(element, model.root), point });
    wheelRadius.set(key, wheel.circle.radius);
  });
  const crankKey = parts.crank ? "crank" : null;
  if (parts.crank) specs.push({ key: "crank", path: elementPath(parts.crank.target, model.root), point: localCenter(parts.crank) });
  const otherKeys = parts.others.map((other, i) => {
    const key = `other${i + 1}`;
    specs.push({ key, path: elementPath(other.target, model.root), point: null });
    return key;
  });
  return { specs, wheelRadius, crankKey, otherKeys };
}

/** SMIL 旋转的局部中心点：正确的动画下它应逐帧不动，动画覆盖或叠加错误时它会跑；CSS 动画量包围盒 */
function localCenter(anim: BikeParts["wheels"][number]["anim"]): { x: number; y: number } | null {
  return anim.centerMode === "local" && anim.rotateCenter ? { x: anim.rotateCenter.x, y: anim.rotateCenter.y } : null;
}

/** 取样周期取车轮与曲柄里最长的时长；都解析不到时按 2 秒 */
function periodOf(parts: BikeParts): number {
  const durations = [...parts.wheels.map((w) => w.anim.durMs), parts.crank?.durMs ?? null]
    .filter((d): d is number => d !== null && d > 0);
  return durations.length > 0 ? Math.round(Math.max(...durations)) : DEFAULT_PERIOD_MS;
}

async function captureFrames(page: Page, source: string, plan: TrackPlan, periodMs: number): Promise<RenderMeasurements> {
  await page.goto(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`, { waitUntil: "load" });
  await page.evaluate(prepareStage, FRAME_SIZE);
  const frames: FrameCapture[] = [];
  for (let k = 0; k < FRAME_COUNT; k += 1) frames.push(await captureAt(page, plan.specs, Math.round((k * periodMs) / FRAME_COUNT)));
  const closure = await captureAt(page, plan.specs, periodMs);
  return { frames, closure, wheelRadius: plan.wheelRadius, crankKey: plan.crankKey, otherKeys: plan.otherKeys };
}

async function captureAt(page: Page, specs: TrackSpec[], timeMs: number): Promise<FrameCapture> {
  await page.evaluate(seekTo, timeMs);
  const samples = await page.evaluate(measureTracks, specs);
  const png = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: FRAME_SIZE, height: FRAME_SIZE } });
  return { timeMs, samples, png };
}

/** 一行 8 帧、帧间无缝、左上角标帧号；在浏览器里拼好整体截图，不引入图像库 */
async function composeContactSheet(browser: Browser, frames: readonly FrameCapture[]): Promise<Buffer> {
  const cells = frames.map((frame, i) =>
    `<div class="cell"><img src="data:image/png;base64,${frame.png.toString("base64")}" width="${FRAME_SIZE}" height="${FRAME_SIZE}"><span>${i + 1}</span></div>`);
  const html = `<!doctype html><html><head><style>
    body{margin:0;background:#fff}
    .row{display:flex;width:${FRAME_SIZE * frames.length}px;height:${FRAME_SIZE}px}
    .cell{position:relative;width:${FRAME_SIZE}px;height:${FRAME_SIZE}px}
    .cell img{display:block}
    .cell span{position:absolute;left:6px;top:4px;font:bold 16px/1 sans-serif;color:#fff;background:rgba(0,0,0,.55);padding:3px 7px;border-radius:4px}
  </style></head><body><div class="row">${cells.join("")}</div></body></html>`;
  const context = await browser.newContext({ viewport: { width: FRAME_SIZE * frames.length, height: FRAME_SIZE }, deviceScaleFactor: 1 });
  try {
    const page = await context.newPage();
    await page.setContent(html, { waitUntil: "load" });
    return await page.screenshot({ type: "png", fullPage: true });
  } finally {
    await context.close();
  }
}

async function saveContactSheet(runId: string, attemptKey: string, png: Buffer): Promise<string> {
  const file = `${attemptKey}.sheet.png`;
  const staging = join(runDir(runId), `${file}.staging`);
  await writeFile(staging, png);
  await rename(staging, join(runDir(runId), file));
  return file;
}

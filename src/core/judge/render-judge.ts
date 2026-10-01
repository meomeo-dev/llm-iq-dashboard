/**
 * 渲染层：在无头 Chromium 里把作品定格到一个周期内的 8 个时刻，量车轮、曲柄与其他
 * 动画元素的位置，截帧拼成一行 8 帧的联系图，再把结果并进静态层的评审记录。
 */

import { rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Page } from "playwright-core";
import { acquireJudgeBrowser } from "./browser";
import { runDir } from "../paths";
import { composeContactSheet, detailPlans, FRAME_SIZE, type DetailPlan } from "./contact-sheet";
import {
  measureFeet, measureRider, measureTracks, PAGE_HELPERS, prepareStage, rootScreenMatrix, seekTo, setViewBox,
  type FeetSpec, type Matrix2D, type StageInfo, type TrackSpec,
} from "./render-page";
import { applyRenderResults, RENDER_JUDGE_ID, type FrameCapture, type RenderMeasurements } from "./render-score";
import type { ContactSheetDetail, Judgement, RubricSpec } from "./schema";
import { identifyParts, legCandidates, type BikeParts } from "./static-criteria";
import { elementPath, parseSvgModel, type SvgModel } from "./svg-model";

export const FRAME_COUNT = 8;
export { FRAME_SIZE } from "./contact-sheet";
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
    const { measured, plans } = await captureFrames(page, input.source, tracks, periodMs);
    const { runId, attemptKey } = input.judgement.subject;
    const frames = measured.frames;
    const file = await saveContactSheet(runId, `${attemptKey}.sheet.png`,
      await composeContactSheet(handle.browser, frames.map((f) => f.png), (i) => `${i + 1}`));
    const details: ContactSheetDetail[] = [];
    for (const [index, plan] of plans.entries()) {
      const sheet = await composeContactSheet(handle.browser, frames.map((f) => f.details[index]!), (i) => `${i + 1} · ${plan.subject} ×${plan.zoom}`);
      details.push({ ...plan, file: await saveContactSheet(runId, `${attemptKey}.sheet.${plan.kind}.png`, sheet) });
    }
    const judgedAt = new Date().toISOString();
    const judgement = applyRenderResults(input.judgement, input.rubric, measured, {
      kind: "code", id: RENDER_JUDGE_ID, judgedAt, durationMs: Date.now() - started,
    });
    return { ok: true, judgement: { ...judgement, contactSheet: {
      file, layout: "row", frameCount: FRAME_COUNT, frameSize: FRAME_SIZE, periodMs,
      sampleTimesMs: frames.map((f) => f.timeMs), details,
    } } };
  } catch (cause) {
    return { ok: false, reason: cause instanceof Error ? cause.message.split("\n")[0] ?? "" : String(cause) };
  } finally {
    await context.close();
  }
}

export interface LocateFrame {
  png: Buffer;
  stage: StageInfo;
  /** 用户坐标 → 像素的矩阵，截图边长为 size */
  matrix: Matrix2D;
  size: number;
}

/** 首帧整幅画面按 size 边长截图，连同换算矩阵一起给定位阶段（ACR-021） */
export async function captureLocateFrame(source: string, size: number): Promise<{ ok: true; frame: LocateFrame } | { ok: false; reason: string }> {
  const handle = await acquireJudgeBrowser();
  if (!handle.ok) return { ok: false, reason: handle.reason };
  const context = await handle.browser.newContext({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  try {
    const page = await context.newPage();
    await page.goto(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`, { waitUntil: "load" });
    const stage = await evaluatePage(page, prepareStage, size);
    await evaluatePage(page, seekTo, 0);
    const matrix = await evaluatePage(page, rootScreenMatrix, undefined);
    if (!matrix) return { ok: false, reason: "根元素没有屏幕矩阵" };
    const png = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: size, height: size } });
    return { ok: true, frame: { png, stage, matrix, size } };
  } catch (cause) {
    return { ok: false, reason: cause instanceof Error ? cause.message.split("\n")[0] ?? "" : String(cause) };
  } finally {
    await context.close();
  }
}

/** 按给定取景框重切 8 帧细节表并落盘，取样时刻沿用帧序表；返回带文件名的清单（ACR-021） */
export async function recaptureDetails(
  source: string, judgement: Judgement, plans: readonly DetailPlan[],
): Promise<{ ok: true; details: ContactSheetDetail[] } | { ok: false; reason: string }> {
  const sheet = judgement.contactSheet;
  if (!sheet) return { ok: false, reason: "没有帧序表" };
  const handle = await acquireJudgeBrowser();
  if (!handle.ok) return { ok: false, reason: handle.reason };
  const context = await handle.browser.newContext({ viewport: { width: FRAME_SIZE, height: FRAME_SIZE }, deviceScaleFactor: 1 });
  try {
    const page = await context.newPage();
    await page.goto(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`, { waitUntil: "load" });
    const stage = await evaluatePage(page, prepareStage, FRAME_SIZE);
    const frames: Buffer[][] = [];
    for (const timeMs of sheet.sampleTimesMs) {
      await evaluatePage(page, seekTo, timeMs);
      frames.push(await captureDetails(page, plans, stage));
    }
    const { runId, attemptKey } = judgement.subject;
    const details: ContactSheetDetail[] = [];
    for (const [index, plan] of plans.entries()) {
      const composed = await composeContactSheet(handle.browser, frames.map((f) => f[index]!), (i) => `${i + 1} · ${plan.subject} ×${plan.zoom}`);
      details.push({ ...plan, file: await saveContactSheet(runId, `${attemptKey}.sheet.${plan.kind}.png`, composed) });
    }
    return { ok: true, details };
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
  feet: FeetSpec;
  /** 车轮与曲柄目标的元素路径：定位骑手时排除 */
  bikeParts: number[][];
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
  const bikeParts = [...parts.wheels.map((w) => w.instance ?? w.anim.target), ...(parts.crank ? [parts.crank.target] : [])]
    .map((el) => elementPath(el, model.root));
  return { specs, wheelRadius, crankKey, otherKeys, feet: buildFeet(parts, model), bikeParts };
}

/** 脚在脚踏上的量测：腿取命名或周期匹配的候选，髋是其旋转中心；曲柄的五通是其旋转中心 */
function buildFeet(parts: BikeParts, model: SvgModel): FeetSpec {
  const crank = parts.crank
    ? { path: elementPath(parts.crank.target, model.root), center: localCenter(parts.crank) }
    : null;
  const legs = legCandidates(parts).map((leg, i) => ({
    key: `leg${i + 1}`, path: elementPath(leg.target, model.root), hip: localCenter(leg), anchor: null, startPedal: null,
  }));
  const maxReach = Math.min(Number.POSITIVE_INFINITY, ...parts.wheels.map((w) => w.circle.radius));
  return { legs, crank, maxReach, baseCrank: null };
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

async function captureFrames(
  page: Page, source: string, plan: TrackPlan, periodMs: number,
): Promise<{ measured: RenderMeasurements; plans: DetailPlan[] }> {
  await page.goto(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`, { waitUntil: "load" });
  const stage = await evaluatePage(page, prepareStage, FRAME_SIZE);
  const first = await captureAt(page, plan, 0, [], stage);
  // 首帧定下三件事：脚尖落在腿的哪个几何、哪段弧长；离脚尖最近的脚踏点与曲柄变换（后续各帧
  // 把它随曲柄搬过去，看是否还贴在腿上）；各类细节的取景框（部件轴心不动，各帧共用同一框才好逐帧比较）
  const anchored: TrackPlan = { ...plan, feet: { ...plan.feet, baseCrank: first.feet.crank, legs: plan.feet.legs.map((leg) => {
    const start = first.feet.feet.find((s) => s.key === leg.key);
    return { ...leg, anchor: start?.anchor ?? null, startPedal: start?.pedal ?? null };
  }) } };
  const wheels = [...plan.wheelRadius].flatMap(([key, radius]) => {
    const sample = first.samples.find((s) => s.key === key);
    return sample ? [{ key, sample, radius }] : [];
  });
  const wheelTop = wheels.length > 0 ? Math.min(...wheels.map((w) => w.sample.y - w.radius)) : null;
  const rider = await evaluatePage(page, measureRider, { exclude: plan.bikeParts, wheelTop });
  const plans = detailPlans({ feet: first.feet, wheels, rider, stage });
  first.details = await captureDetails(page, plans, stage);
  const frames: FrameCapture[] = [first];
  for (let k = 1; k < FRAME_COUNT; k += 1) frames.push(await captureAt(page, anchored, Math.round((k * periodMs) / FRAME_COUNT), plans, stage));
  const closure = await captureAt(page, anchored, periodMs, [], stage);
  return { measured: { frames, closure, wheelRadius: plan.wheelRadius, crankKey: plan.crankKey, otherKeys: plan.otherKeys }, plans };
}

async function captureAt(
  page: Page, plan: TrackPlan, timeMs: number, plans: readonly DetailPlan[], stage: StageInfo,
): Promise<FrameCapture> {
  await evaluatePage(page, seekTo, timeMs);
  const samples = await evaluatePage(page, measureTracks, plan.specs);
  const feet = await evaluatePage(page, measureFeet, plan.feet);
  const png = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: FRAME_SIZE, height: FRAME_SIZE } });
  return { timeMs, samples, feet, png, details: await captureDetails(page, plans, stage) };
}

/** 动画定格不变，只把取景框依次换成各类放大区域各截一张，最后把 viewBox 换回来 */
async function captureDetails(page: Page, plans: readonly DetailPlan[], stage: StageInfo): Promise<Buffer[]> {
  const out: Buffer[] = [];
  try {
    for (const plan of plans) {
      await evaluatePage(page, setViewBox, plan.region);
      out.push(await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: FRAME_SIZE, height: FRAME_SIZE } }));
    }
  } finally {
    if (plans.length > 0) await evaluatePage(page, setViewBox, stage.viewBox);
  }
  return out;
}

/**
 * 把 render-page 的函数送进页面执行：先注入 PAGE_HELPERS 的函数声明，再调用目标函数。
 * tsx / esbuild 会给具名函数包一层 __name(...)，页面里没有这个助手，串成源码时补一个空实现。
 */
async function evaluatePage<A, R>(page: Page, fn: (arg: A) => R, arg: A): Promise<Awaited<R>> {
  const helpers = PAGE_HELPERS.map((helper) => helper.toString()).join("\n");
  const script = `(() => { const __name = (target) => target; ${helpers}\nreturn (${fn.toString()})(${JSON.stringify(arg)}); })()`;
  return await page.evaluate(script) as Awaited<R>;
}

async function saveContactSheet(runId: string, file: string, png: Buffer): Promise<string> {
  const staging = join(runDir(runId), `${file}.staging`);
  await writeFile(staging, png);
  await rename(staging, join(runDir(runId), file));
  return file;
}

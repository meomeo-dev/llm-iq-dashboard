/**
 * 把逐帧量测结果换成渲染层的闸门与分数，并入静态层已写好的评审记录：
 * C1–C4 取静态分与渲染分的较低者，理由并列两层的实测值。
 */

import { summarizeTotal, type CriterionResult, type GateResult, type JudgeActor, type Judgement, type RubricSpec } from "./schema";
import type { TrackSample } from "./render-page";

export const RENDER_JUDGE_ID = "render-judge@1";

/** 一帧：定格时刻、各跟踪元素的量测、截图 */
export interface FrameCapture {
  timeMs: number;
  samples: TrackSample[];
  png: Buffer;
}

export interface RenderMeasurements {
  frames: FrameCapture[];
  /** 定格到整周期处的一帧，与首帧比较判循环闭合 */
  closure: FrameCapture;
  /** 车轮跟踪键 → 半径（静态层量得），用于漂移容差 */
  wheelRadius: Map<string, number>;
  crankKey: string | null;
  otherKeys: string[];
}

export function applyRenderResults(
  judgement: Judgement,
  rubric: RubricSpec,
  measured: RenderMeasurements,
  actor: JudgeActor,
): Judgement {
  const gates = [...judgement.gates.filter((g) => g.source !== "render"), ...renderGates(rubric, measured)];
  const gateFailed = gates.some((g) => !g.passed);
  const criteria = judgement.criteria.map((c) => mergeCriterion(c, renderScore(c, measured, gateFailed)));
  const judges = [...judgement.judges.filter((j) => j.id !== actor.id), actor];
  return { ...judgement, gates, criteria, judges, total: summarizeTotal(gates, criteria, judgement.rubric, actor.judgedAt) };
}

function renderGates(rubric: RubricSpec, measured: RenderMeasurements): GateResult[] {
  return rubric.gates
    .filter((spec) => spec.source === "render")
    .map((spec) => {
      const outcome = spec.id === "G4" ? gateMoving(measured) : spec.id === "G5" ? gateInCanvas(measured) : null;
      return { id: spec.id, source: "render" as const, title: spec.title, standard: spec.standard,
        passed: outcome?.passed ?? false, evidence: outcome?.evidence ?? `渲染层不认识闸门 ${spec.id}` };
    });
}

/** 8 帧截图里只要有两帧不同就算在动 */
function gateMoving(measured: RenderMeasurements): { passed: boolean; evidence: string } {
  const first = measured.frames[0];
  if (!first) return { passed: false, evidence: "没有截到帧" };
  const changed = measured.frames.filter((f) => !f.png.equals(first.png)).length;
  return { passed: changed > 0, evidence: `${measured.frames.length} 帧里 ${changed} 帧与首帧不同` };
}

/** 车轮与曲柄的量测点每一帧都要在 viewBox 内 */
function gateInCanvas(measured: RenderMeasurements): { passed: boolean; evidence: string } {
  const keys = new Set([...measured.wheelRadius.keys(), ...(measured.crankKey ? [measured.crankKey] : [])]);
  const escaped = new Set<string>();
  for (const frame of measured.frames) {
    for (const s of frame.samples) if (keys.has(s.key) && s.outside) escaped.add(s.key);
  }
  if (keys.size === 0) return { passed: true, evidence: "没有可跟踪的车轮或曲柄，按通过" };
  return escaped.size === 0
    ? { passed: true, evidence: `${keys.size} 个部件全程在画布内` }
    : { passed: false, evidence: `${[...escaped].join("、")} 有帧跑出画布` };
}

interface RenderVerdict {
  /** 0–1；null 表示渲染层对这条没有意见，沿用静态分 */
  ratio: number | null;
  note: string;
}

function renderScore(c: CriterionResult, measured: RenderMeasurements, gateFailed: boolean): RenderVerdict | null {
  if (c.source === "ai") return null;
  if (gateFailed) return { ratio: 0, note: "渲染闸门未通过" };
  switch (c.id) {
    case "C1":
      return wheelsDrift(measured);
    case "C2":
      return crankDrift(measured);
    case "C3":
      return loopClosure(measured);
    case "C4":
      return legsMove(measured);
    default:
      return null;
  }
}

/** 轮心逐帧漂移：不超过半径 5% 满分，达到一个半径零分 */
function wheelsDrift(measured: RenderMeasurements): RenderVerdict {
  if (measured.wheelRadius.size === 0) return { ratio: null, note: "无可跟踪的车轮" };
  let total = 0;
  const notes: string[] = [];
  for (const [key, radius] of measured.wheelRadius) {
    const drift = maxDrift(measured.frames, key);
    if (drift === null) { notes.push(`${key} 未量到`); continue; }
    const tolerance = radius * 0.05;
    total += drift <= tolerance ? 1 : Math.max(0, 1 - (drift - tolerance) / (radius - tolerance));
    notes.push(`${key} 轮心漂移 ${drift.toFixed(1)}`);
  }
  return { ratio: total / measured.wheelRadius.size, note: notes.join("，") };
}

/**
 * 曲柄量测点的漂移：SMIL 旋转量的是旋转中心，正确时不动；CSS 动画量包围盒中心，
 * 单臂曲柄会绕五通转一圈，允许到一个对角线，超过三个对角线为零分
 */
function crankDrift(measured: RenderMeasurements): RenderVerdict {
  if (!measured.crankKey) return { ratio: null, note: "无可跟踪的曲柄" };
  const drift = maxDrift(measured.frames, measured.crankKey);
  const first = measured.frames[0]?.samples.find((s) => s.key === measured.crankKey);
  if (drift === null || !first) return { ratio: null, note: "曲柄未量到" };
  const diagonal = Math.hypot(first.width, first.height) || 1;
  const ratio = drift <= diagonal ? 1 : Math.max(0, 1 - (drift - diagonal) / (diagonal * 2));
  return { ratio, note: `曲柄量测点漂移 ${drift.toFixed(1)}（包围盒对角线 ${diagonal.toFixed(1)}）` };
}

/** 整周期处车轮与曲柄应回到首帧位置；背景等其他动画周期不同不算破坏循环 */
function loopClosure(measured: RenderMeasurements): RenderVerdict {
  const first = measured.frames[0];
  if (!first) return { ratio: null, note: "没有截到帧" };
  const keys = [...measured.wheelRadius.keys(), ...(measured.crankKey ? [measured.crankKey] : [])];
  if (keys.length === 0) return { ratio: null, note: "无可跟踪的车轮或曲柄" };
  const gaps = keys.map((key) => {
    const a = first.samples.find((s) => s.key === key);
    const b = measured.closure.samples.find((s) => s.key === key);
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  });
  const worst = Math.max(...gaps);
  const closed = worst <= 1;
  return { ratio: closed ? 1 : 0.5, note: closed ? `t=${measured.closure.timeMs}ms 各部件回到首帧位置，循环闭合` : `t=${measured.closure.timeMs}ms 部件与首帧位置差 ${worst.toFixed(1)}，循环未闭合` };
}

/** 车轮曲柄之外的动画元素至少有一个在动 */
function legsMove(measured: RenderMeasurements): RenderVerdict {
  if (measured.otherKeys.length === 0) return { ratio: null, note: "无其他可跟踪元素" };
  const measurable = measured.otherKeys.filter((key) => measured.frames[0]?.samples.some((s) => s.key === key));
  if (measurable.length === 0) return { ratio: null, note: "其他动画元素都量不到（不在渲染树上）" };
  const moving = measured.otherKeys.filter((key) => (maxDrift(measured.frames, key) ?? 0) > 0.5 || sizeChanges(measured.frames, key));
  return moving.length > 0
    ? { ratio: 1, note: `${moving.length}/${measured.otherKeys.length} 个其他元素有位移` }
    : { ratio: 0, note: "车轮曲柄之外的元素逐帧没有位移" };
}

function maxDrift(frames: readonly FrameCapture[], key: string): number | null {
  const first = frames[0]?.samples.find((s) => s.key === key);
  if (!first) return null;
  let max = 0;
  for (const frame of frames) {
    const s = frame.samples.find((item) => item.key === key);
    if (s) max = Math.max(max, Math.hypot(s.x - first.x, s.y - first.y));
  }
  return max;
}

function sizeChanges(frames: readonly FrameCapture[], key: string): boolean {
  const first = frames[0]?.samples.find((s) => s.key === key);
  if (!first) return false;
  return frames.some((frame) => {
    const s = frame.samples.find((item) => item.key === key);
    return s !== undefined && (Math.abs(s.width - first.width) > 0.5 || Math.abs(s.height - first.height) > 0.5);
  });
}

function mergeCriterion(c: CriterionResult, verdict: RenderVerdict | null): CriterionResult {
  if (!verdict || c.score === null) return c;
  if (verdict.ratio === null) return { ...c, reason: `${c.reason}；渲染：${verdict.note}` };
  const renderScore = Math.round(c.maxScore * verdict.ratio);
  return { ...c, source: "render", score: Math.min(c.score, renderScore), reason: `${c.reason}；渲染：${verdict.note}` };
}

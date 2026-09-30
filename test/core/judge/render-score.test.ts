/** 渲染层结果并入评审记录：闸门、取低、循环闭合 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { applyRenderResults, type FrameCapture, type RenderMeasurements } from "@/core/judge/render-score";
import { ANIMATED_PELICAN_RUBRIC } from "@/core/judge/schema";
import { judgeStatic } from "@/core/judge/static-judge";

const subject = {
  runId: "20260930T000000Z", attemptKey: "k", promptId: "animated-pelican-v1",
  cli: "codex", model: "m", effort: "high", svgFile: "k.svg",
};
const GOOD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <g id="rear" transform="translate(100 200)"><circle r="40"/>
    <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="2s" repeatCount="indefinite" additive="sum"/></g>
  <g id="front" transform="translate(300 200)"><circle r="40"/>
    <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="2s" repeatCount="indefinite" additive="sum"/></g>
  <g id="crank"><circle cx="200" cy="190" r="12"/>
    <animateTransform attributeName="transform" type="rotate" from="0 200 190" to="360 200 190" dur="1s" repeatCount="indefinite"/></g>
  <g id="leg"><path d="M0 0"><animate attributeName="d" values="M0 0;M0 5" dur="1s" repeatCount="indefinite"/></path></g>
</svg>`;
const actor = { kind: "code" as const, id: "render-judge@1", judgedAt: "2026-09-30T00:00:01Z" };

const frame = (timeMs: number, png: string, wheelX: number, legY: number, outside = false): FrameCapture => ({
  timeMs, png: Buffer.from(png),
  samples: [
    { key: "wheel1", x: 100 + wheelX, y: 200, width: 80, height: 80, outside },
    { key: "wheel2", x: 300, y: 200, width: 80, height: 80, outside: false },
    { key: "crank", x: 200, y: 190, width: 30, height: 30, outside: false },
    { key: "other1", x: 200, y: 150 + legY, width: 5, height: 40, outside: false },
  ],
});
const measurements = (frames: FrameCapture[], closure: FrameCapture): RenderMeasurements => ({
  frames, closure, wheelRadius: new Map([["wheel1", 40], ["wheel2", 40]]), crankKey: "crank", otherKeys: ["other1"],
});

describe("applyRenderResults", () => {
  test("全程稳定、循环闭合：渲染层不扣分，加一条 judges", () => {
    const base = judgeStatic({ source: GOOD, subject, rubric: ANIMATED_PELICAN_RUBRIC });
    const frames = Array.from({ length: 8 }, (_, k) => frame(k * 250, `f${k}`, 0, k % 2));
    const j = applyRenderResults(base, ANIMATED_PELICAN_RUBRIC, measurements(frames, frame(2000, "f0", 0, 0)), actor);
    assert.deepEqual(j.gates.map((g) => g.passed), [true, true, true, true, true]);
    assert.equal(j.total.score, 60);
    assert.equal(j.judges.length, 2);
    assert.match(j.criteria[2]?.reason ?? "", /循环闭合/);
  });

  test("轮心漂移一个半径：C1 取渲染分 10；末帧未闭合：C3 减半", () => {
    const base = judgeStatic({ source: GOOD, subject, rubric: ANIMATED_PELICAN_RUBRIC });
    const frames = Array.from({ length: 8 }, (_, k) => frame(k * 250, `f${k}`, k === 4 ? 40 : 0, k % 2));
    const j = applyRenderResults(base, ANIMATED_PELICAN_RUBRIC, measurements(frames, frame(2000, "zz", 6, 0)), actor);
    assert.equal(j.criteria[0]?.score, 10);
    assert.equal(j.criteria[0]?.source, "render");
    assert.equal(j.criteria[2]?.score, 5);
  });

  test("画面不动：G4 不通过，总分 0 判降智", () => {
    const base = judgeStatic({ source: GOOD, subject, rubric: ANIMATED_PELICAN_RUBRIC });
    const frames = Array.from({ length: 8 }, (_, k) => frame(k * 250, "same", 0, 0));
    const j = applyRenderResults(base, ANIMATED_PELICAN_RUBRIC, measurements(frames, frame(2000, "same", 0, 0)), actor);
    assert.equal(j.gates.find((g) => g.id === "G4")?.passed, false);
    assert.equal(j.total.verdict, "degraded");
  });

  test("车轮有帧跑出画布：G5 不通过", () => {
    const base = judgeStatic({ source: GOOD, subject, rubric: ANIMATED_PELICAN_RUBRIC });
    const frames = Array.from({ length: 8 }, (_, k) => frame(k * 250, `f${k}`, 0, 0, k === 3));
    const j = applyRenderResults(base, ANIMATED_PELICAN_RUBRIC, measurements(frames, frame(2000, "f0", 0, 0)), actor);
    assert.match(j.gates.find((g) => g.id === "G5")?.evidence ?? "", /wheel1/);
    assert.equal(j.total.score, 0);
  });
});

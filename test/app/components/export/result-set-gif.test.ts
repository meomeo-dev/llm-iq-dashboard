/**
 * GIF 取帧：帧计划与倍率上限、把时刻烘进作品副本（SMIL begin 改写、CSS 负延时）、作品等比落位。
 */

import assert from "node:assert/strict";
import { before, test } from "node:test";
import { installDom } from "../../../support/dom";

type Gif = typeof import("@/app/components/export/result-set-gif");
type Svg = typeof import("@/app/components/export/result-set-svg");
let bakeTime: Gif["bakeTime"], fitRect: Gif["fitRect"], naturalSize: Gif["naturalSize"];
let parseClock: Gif["parseClock"], planFrames: Gif["planFrames"], scaleRect: Gif["scaleRect"];
let renderResultSetSvg: Svg["renderResultSetSvg"];

before(async () => {
  installDom();
  ({ bakeTime, fitRect, naturalSize, parseClock, planFrames, scaleRect } = await import("@/app/components/export/result-set-gif"));
  ({ renderResultSetSvg } = await import("@/app/components/export/result-set-svg"));
});

function parse(source: string): SVGElement {
  return new DOMParser().parseFromString(source, "image/svg+xml").documentElement as unknown as SVGElement;
}

test("planFrames：3 秒 10 fps 共 30 帧、延时 100ms；面积超过上限时按比例缩小到 100 万像素", () => {
  assert.deepEqual(planFrames(1052, 545), { count: 30, delayMs: 100, scale: 1 });
  const big = planFrames(1652, 1130);
  assert.ok(big.scale < 1);
  assert.ok(Math.abs(1652 * big.scale * (1130 * big.scale) - 1_000_000) < 1);
});

test("bakeTime：begin 缺省与时钟值列表逐项减 t，事件与同步基准不改；注入暂停的 CSS 负延时；原件不变", () => {
  const svg = parse(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">' +
      '<circle r="1"><animate attributeName="r" dur="1s" repeatCount="indefinite"/>' +
      '<animateTransform attributeName="transform" begin="0.75s;2s" dur="1s"/>' +
      '<set attributeName="fill" begin="click"/><animate attributeName="cx" begin="a.end+1s"/>' +
      '<animateMotion begin="500ms" dur="2s"/></circle></svg>',
  );
  const baked = bakeTime(svg, 0.5);
  const begins = [...baked.querySelectorAll("circle > *")].map((el) => el.getAttribute("begin"));
  assert.deepEqual(begins, ["-0.5s", "0.25s;1.5s", "click", "a.end+1s", "0s"]);
  assert.equal(baked.firstElementChild?.tagName, "style");
  assert.match(baked.firstElementChild?.textContent ?? "", /animation-delay: -0.5s !important; animation-play-state: paused !important/);
  assert.equal(svg.querySelector("animate")?.getAttribute("begin"), null);
  assert.equal(bakeTime(svg, 0).querySelector("animate")?.getAttribute("begin"), "0s");
});

test("parseClock / naturalSize / fitRect / scaleRect", () => {
  assert.equal(parseClock("1.5s"), 1.5);
  assert.equal(parseClock("500ms"), 0.5);
  assert.equal(parseClock(" 0.2 "), 0.2);
  assert.equal(parseClock("a.end"), null);
  assert.deepEqual(naturalSize(parse('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"/>')), { width: 900, height: 600 });
  assert.equal(naturalSize(parse('<svg xmlns="http://www.w3.org/2000/svg"/>')), null);
  const box = { x: 10, y: 20, width: 280, height: 205 };
  assert.deepEqual(fitRect({ width: 900, height: 600 }, box), { x: 10, y: 20 + (205 - 280 / 1.5) / 2, width: 280, height: 280 / 1.5 });
  assert.deepEqual(fitRect(null, box), box);
  assert.deepEqual(scaleRect(box, 0.5), { x: 5, y: 10, width: 140, height: 102.5 });
});

test("renderResultSetSvg blank 模式：作品框留白并报告内框位置，不嵌 image", () => {
  const card = {
    runId: "r1", targetId: "t", promptId: "p", cli: "codex", model: "m", effort: "low", appliedEffort: "low", effortHonored: true,
    status: "ok", svgFile: "a.svg", svgBytes: 1, durationMs: 1, startedAt: "2026-09-29T00:00:00Z",
    cost: { status: "unpriced", usd: null, modelId: null, channelId: null, serviceTier: "standard", catalogTag: null, lines: [], note: null },
    bindings: {}, trigger: "manual", error: null, usage: null,
  } as unknown as import("@/core/types").DashboardCard;
  const palette = { bg: "#000", surface: "#111", surfaceHi: "#222", border: "#333", text: "#fff", textDim: "#ccc", textFaint: "#999", accent: "#08f", ok: "#0f0", warn: "#ff0", err: "#f00" };
  const base = { title: "t", subtitle: "s", cards: [card], columns: [{ name: "default", label: "登录态", color: null }], efforts: ["low"], timeZone: "UTC", thumbnails: new Map([["r1/t/p", "data:x"]]), palette };
  const blank = renderResultSetSvg({ ...base, artMode: "blank" });
  assert.doesNotMatch(blank.svg, /<image/);
  assert.deepEqual(blank.artFrames, [{ key: "r1/t/p", x: 32 + 10, y: 32 + 72 + 96 + 10, width: 280, height: 205 }]);
  assert.match(renderResultSetSvg(base).svg, /<image href="data:x"/);
});

/**
 * 竖版导出（横版的行列转置）：模型按列、轮次按行从上到下，列头带通过率，格子落在对应列，空数据提示。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { COLUMN_GAP, ROW_HEIGHT, TIME_COLUMN_WIDTH, renderTimelinePortraitSvg } from "@/app/components/export/timeline-portrait-svg";
import { TILE_SIZE, type Palette, type TimelineExport } from "@/app/components/export/timeline-svg";
import type { Moment } from "@/app/components/timeline/moments";
import type { DashboardCard } from "@/core/types";

const palette: Palette = {
  bg: "#0b0f17", surface: "#10161f", surfaceHi: "#182030", border: "#232d3d", text: "#e6e8ee",
  textDim: "#9aa2b1", textFaint: "#6b7385", accent: "#4f8df7", ok: "#4ade80", warn: "#fbbf24", err: "#f87171",
};

function card(runId: string, model: string, promptId: string, effort: string, verdict: "online" | null): DashboardCard {
  return {
    runId, runStartedAt: `2026-10-02T0${runId.slice(-1)}:00:00Z`, runInProgress: false,
    targetId: `agy__${model}__${effort}`, cli: "agy", model, effort, appliedEffort: effort, effortHonored: true,
    promptId, promptText: "p", label: "x", status: "ok", svgFile: "a.svg", rawFile: "a.raw.txt", svgBytes: 1,
    durationMs: 1, startedAt: "", finishedAt: "", cost: null, usage: null, bindings: {}, trigger: "schedule", error: null,
    judge: verdict === null ? null : { total: { verdict, score: 90 } }, judgeCost: null,
  } as unknown as DashboardCard;
}

function moment(runId: string, clock: string, cards: DashboardCard[]): Moment {
  return { runId, startedAt: `2026-10-02T${clock}:00Z`, dayKey: "2026-10-02", fraction: 0.5, clock, cards, okCount: cards.length };
}

function input(moments: Moment[]): TimelineExport {
  return { title: "鹈鹕自行车基准", subtitle: "s", moments, efforts: ["low", "high"], now: null, thumbnails: new Map(), palette };
}

const PAD = 32;
const columnX = (index: number): number => PAD + TIME_COLUMN_WIDTH + index * (TILE_SIZE + COLUMN_GAP);

test("模型按列横排、轮次按行从上到下；宽度随列数，行高固定", () => {
  const late = moment("r2", "02:00", ["m1", "m2", "m3"].map((model) => card("r2", model, "animated-pelican-v1", "high", "online")));
  const early = moment("r1", "01:00", [card("r1", "m2", "animated-pelican-v1", "high", null)]);
  const { svg, width } = renderTimelinePortraitSvg(input([late, early]));
  assert.equal(width, PAD * 2 + TIME_COLUMN_WIDTH + 3 * TILE_SIZE + 2 * COLUMN_GAP);
  assert.ok(svg.indexOf(">01:00<") < svg.indexOf(">02:00<"), "早的一轮在上");
  assert.ok(svg.indexOf(">agy · m1<") < svg.indexOf(">agy · m2<"), "列头按模型排序");
  const tiles = [...svg.matchAll(/<rect x="(\d+)" y="(\d+)" width="216" height="216"/g)].map((m): [number, number] => [Number(m[1]), Number(m[2])]);
  assert.equal(tiles.length, 4);
  // 第一行只有 m2 一格，落在第二列；第二行三格依次落在三列，与第一行相差一个行高
  assert.deepEqual(tiles.map(([x]) => x), [columnX(1), columnX(0), columnX(1), columnX(2)]);
  const [firstRowTile, secondRowTile] = [tiles[0]!, tiles[2]!];
  assert.equal(secondRowTile[1] - firstRowTile[1], ROW_HEIGHT);
});

test("列头与横版行标签同形：有评分标准的列带合计与分列，没有的不带；多题时写题目", () => {
  const cards = [card("r1", "m1", "animated-pelican-v1", "high", "online"), card("r1", "m1", "classic-v1", "high", null)];
  const { svg } = renderTimelinePortraitSvg(input([moment("r1", "01:00", cards)]));
  const pelicanHead = svg.indexOf(">animated-pelican-v1<");
  const classicHead = svg.indexOf(">classic-v1<");
  assert.ok(pelicanHead > 0 && classicHead > pelicanHead);
  const total = svg.indexOf(">合计 1/1<");
  assert.ok(total > pelicanHead && total < classicHead, "合计只跟在动态鹈鹕那一列的列头下");
  assert.match(svg, />└<\/text><text[^>]*>high 1\/1</);
  assert.equal((svg.match(/合计/g) ?? []).length, 1);
});

test("空数据：保留标题与列头并给提示", () => {
  const { svg, width } = renderTimelinePortraitSvg(input([]));
  assert.match(svg, /这一天还没有符合筛选的执行结果/);
  assert.match(svg, />0 个</);
  assert.ok(width >= 560);
});

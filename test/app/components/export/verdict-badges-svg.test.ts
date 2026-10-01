/** 导出图小格子右下角的评审圆标：逐件圆标靠右排，计数模式成药丸，没有结论为空 */

import assert from "node:assert/strict";
import { test } from "node:test";
import type { Palette } from "@/app/components/export/timeline-svg";
import { verdictBadgesSvg } from "@/app/components/export/verdict-badges-svg";

const palette: Palette = {
  bg: "#0b0f17", surface: "#10161f", surfaceHi: "#182030", border: "#232d3d", text: "#e6e8ee",
  textDim: "#9aa2b1", textFaint: "#6b7385", accent: "#4f8df7", ok: "#4ade80", warn: "#fbbf24", err: "#f87171",
};

test("逐件：每件一个 14px 圆标，最右一个贴右下角内缩 5px，颜色按结论", () => {
  const svg = verdictBadgesSvg({ kind: "list", verdicts: ["online", "degraded"] }, 100, 200, 86, palette);
  assert.equal((svg.match(/<circle /g) ?? []).length, 2);
  assert.match(svg, /<circle cx="174" cy="274" r="7"/, "最右：x 100 + 86 − 5 − 7，y 200 + 86 − 5 − 7");
  assert.match(svg, /<circle cx="158" cy="274" r="7"/, "再往左 16px");
  assert.ok(svg.indexOf('fill="#4ade80"') < svg.indexOf('fill="#f87171"'), "顺序与输入一致");
});

test("计数：每种结论一粒药丸、图标后跟件数，上限 99；没有结论返回空串", () => {
  const svg = verdictBadgesSvg({ kind: "summary", counts: [{ verdict: "online", count: 2 }, { verdict: "pending", count: 120 }] }, 0, 0, 86, palette);
  assert.equal((svg.match(/<rect /g) ?? []).length, 2);
  assert.match(svg, />2</);
  assert.match(svg, />99</);
  assert.equal(verdictBadgesSvg({ kind: "list", verdicts: [] }, 0, 0, 86, palette), "");
});

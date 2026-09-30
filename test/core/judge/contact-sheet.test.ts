/** 细节联系表的取景框：类别、居中、放大倍数与不小于画面短边 1/5 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { detailPlans } from "@/core/judge/contact-sheet";

const stage = { viewBox: { x: 0, y: 0, width: 800, height: 500 } };
const feet = {
  crankReach: 40, crank: null, axle: { x: 380, y: 350 },
  feet: [{ key: "leg1", foot: { x: 420, y: 350 }, hip: { x: 340, y: 230 }, anchor: { shape: 0, length: 0 }, pedal: { x: 420, y: 350 }, gap: 0, deviation: 0 }],
};
const wheels = [
  { key: "wheel1", sample: { key: "wheel1", x: 560, y: 350, width: 200, height: 200, outside: false }, radius: 100 },
  { key: "wheel2", sample: { key: "wheel2", x: 180, y: 350, width: 200, height: 200, outside: false }, radius: 100 },
];

describe("detailPlans", () => {
  test("六类齐全：鹈鹕整体、头与喙、脚踏与脚、座垫与臀、左轮、右轮，按 x 分左右", () => {
    const plans = detailPlans({ feet, wheels, rider: { x: 280, y: 60, width: 200, height: 180 }, stage });
    assert.deepEqual(plans.map((p) => p.kind), ["pelican", "head", "crank", "saddle", "wheel-left", "wheel-right"]);
    const left = plans.find((p) => p.kind === "wheel-left")!;
    assert.equal(left.region.x + left.region.width / 2, 180);
    const crank = plans.find((p) => p.kind === "crank")!;
    assert.equal(crank.region.width, 160);
    assert.equal(crank.region.x + crank.region.width / 2, 380);
    assert.equal(crank.zoom, 5);
    assert.deepEqual(crank.criteria, ["C2", "C4", "C7"]);
    const saddle = plans.find((p) => p.kind === "saddle")!;
    assert.equal(saddle.region.y + saddle.region.height / 2, 230);
    const head = plans.find((p) => p.kind === "head")!;
    assert.equal(head.region.y + head.region.height / 2, 96);
  });

  test("没有曲柄与骑手时只出车轮表；取景框不小于画面短边的 1/5", () => {
    const tiny = { ...feet, crankReach: 0, axle: null };
    const small = [{ key: "wheel1", sample: { ...wheels[0]!.sample, x: 100 }, radius: 10 }];
    const plans = detailPlans({ feet: tiny, wheels: small, rider: null, stage });
    assert.deepEqual(plans.map((p) => p.kind), ["wheel-right"]);
    assert.equal(plans[0]!.region.width, 100);
  });
});

/** 静态评审：闸门、车轮轴心、曲柄、循环与腿部同步的给分 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { ANIMATED_PELICAN_RUBRIC } from "@/core/judge/schema";
import { judgeStatic } from "@/core/judge/static-judge";
import { attemptKeyOf } from "@/core/judge/judge-store";

const subject = {
  runId: "20260930T000000Z", attemptKey: "codex__m__high__animated-pelican-v1", promptId: "animated-pelican-v1",
  cli: "codex", model: "m", effort: "high", svgFile: "codex__m__high__animated-pelican-v1.svg",
};

const judge = (source: string) => judgeStatic({ source, subject, rubric: ANIMATED_PELICAN_RUBRIC, now: new Date("2026-09-30T00:00:00Z") });
const score = (source: string, id: string) => judge(source).criteria.find((c) => c.id === id)?.score;

const SPOKES = '<line x1="0" y1="-40" x2="0" y2="40"/>';
const wheel = (id: string, cx: number, cy: number, dur: string) =>
  `<g id="${id}" transform="translate(${cx} ${cy})"><circle r="40"/>${SPOKES}` +
  `<animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="${dur}" repeatCount="indefinite" additive="sum"/></g>`;

const GOOD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  ${wheel("rear", 100, 200, "2s")}${wheel("front", 300, 200, "2s")}
  <g id="crank"><circle cx="200" cy="190" r="12"/><line x1="200" y1="190" x2="200" y2="215"/>
    <animateTransform attributeName="transform" type="rotate" from="0 200 190" to="360 200 190" dur="1s" repeatCount="indefinite"/></g>
  <g id="leg-near"><path d="M200 150 L200 190"/>
    <animate attributeName="d" values="M200 150 L200 190;M200 150 L205 200;M200 150 L200 190" dur="1s" repeatCount="indefinite"/></g>
</svg>`;

describe("judgeStatic 闸门", () => {
  test("XML 非法：G1 不通过，总分 0 且判降智", () => {
    const j = judge('<svg xmlns="http://www.w3.org/2000/svg"><g></svg>');
    assert.equal(j.gates.find((g) => g.id === "G1")?.passed, false);
    assert.equal(j.total.score, 0);
    assert.equal(j.total.verdict, "degraded");
    assert.ok(j.criteria.every((c) => c.source === "ai" ? c.score === null : c.score === 0));
  });

  test("没有动画：G2 不通过", () => {
    const j = judge('<svg xmlns="http://www.w3.org/2000/svg"><circle r="1"/></svg>');
    assert.equal(j.gates.find((g) => g.id === "G2")?.passed, false);
    assert.equal(j.total.verdict, "degraded");
  });

  test("含 script 或外部引用：G3 不通过", () => {
    const withScript = GOOD.replace("</svg>", "<script>1</script></svg>");
    assert.equal(judge(withScript).gates.find((g) => g.id === "G3")?.passed, false);
    const withRef = GOOD.replace("</svg>", '<image href="https://x/y.png"/></svg>');
    assert.match(judge(withRef).gates.find((g) => g.id === "G3")?.evidence ?? "", /外部引用/);
  });
});

describe("judgeStatic 计分", () => {
  test("规范作品：静态四项满分，AI 项留空，verdict 为 pending", () => {
    const j = judge(GOOD);
    assert.deepEqual(j.criteria.slice(0, 4).map((c) => c.score), [20, 15, 10, 15]);
    assert.equal(j.criteria.find((c) => c.id === "C6")?.score, null);
    assert.equal(j.total.score, 60);
    assert.equal(j.total.verdict, "pending");
    assert.match(j.criteria[0]?.reason ?? "", /g#rear 旋转中心偏离圆心 0\.0/);
  });

  test("translate 组上的 animateTransform 缺 additive=sum：车轮判零分", () => {
    const flying = GOOD.replaceAll(' additive="sum"', "");
    assert.equal(score(flying, "C1"), 0);
    assert.match(judge(flying).criteria[0]?.reason ?? "", /additive/);
  });

  test("绕全局原点旋转而圆心不在原点：偏差超过半径判零分", () => {
    const offCenter = GOOD.replace('<g id="rear" transform="translate(100 200)"><circle r="40"/>',
      '<g id="rear"><circle cx="100" cy="200" r="40"/>');
    assert.equal(score(offCenter, "C1"), 10);
  });

  test("CSS 动画：transform-origin 的像素值与圆心一致时满分", () => {
    const css = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><style>
      @keyframes spin { to { transform: rotate(360deg); } }
      .wheel { animation: spin 2s linear infinite; }
      #rear { transform-origin: 100px 200px; } #front { transform-origin: 300px 200px; }
      #crank { animation: spin 1s linear infinite; transform-box: fill-box; transform-origin: center; }
      .leg { animation: kick 1s infinite; } @keyframes kick { to { transform: translateY(4px); } }
    </style>
      <g id="rear" class="wheel"><circle cx="100" cy="200" r="40"/></g>
      <g id="front" class="wheel"><circle cx="300" cy="200" r="40"/></g>
      <g id="crank"><circle cx="200" cy="190" r="12"/></g>
      <path class="leg" d="M0 0"/>
    </svg>`;
    const j = judge(css);
    // 曲柄用 fill-box 居中，五通位置静态无法定位，C2 只给八成
    assert.deepEqual(j.criteria.slice(0, 4).map((c) => c.score), [20, 12, 10, 15]);
  });

  test("只转辐条、轮圈是兄弟节点，且轮子经 <use> 实例化两次：仍认出两个车轮", () => {
    const spokes = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs>
      <g id="wheel"><circle r="40"/><g><line x1="0" y1="-40" x2="0" y2="40"/>
        <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="2s" repeatCount="indefinite"/></g></g>
    </defs>
      <g transform="translate(100 200)"><use href="#wheel"/></g>
      <g transform="translate(300 200)"><use href="#wheel"/></g>
      <g transform="translate(200 190)"><line x1="0" y1="0" x2="0" y2="25"/>
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1s" repeatCount="indefinite" additive="sum"/></g>
      <!-- Near leg -->
      <path d="M200 150 L200 190"><animate attributeName="d" values="M200 150 L200 190;M200 150 L205 200" dur="1s" repeatCount="indefinite"/></path>
    </svg>`;
    const j = judge(spokes);
    assert.deepEqual(j.criteria.slice(0, 4).map((c) => c.score), [20, 15, 10, 15]);
    assert.match(j.criteria[1]?.reason ?? "", /在两轮之间/);
  });

  test("腿没有命名但周期与曲柄一致：C4 仍满分，理由注明待核对", () => {
    const unnamed = GOOD.replace('<g id="leg-near">', "<g>");
    const c4 = judge(unnamed).criteria.find((c) => c.id === "C4");
    assert.equal(c4?.score, 15);
    assert.match(c4?.reason ?? "", /未命名为腿/);
  });

  test("只播放一次的车轮：循环项按比例扣", () => {
    const once = GOOD.replace('dur="2s" repeatCount="indefinite"', 'dur="2s" repeatCount="1"');
    assert.equal(score(once, "C3"), 7);
  });

  test("腿部周期与曲柄不成整数比：C4 只得三分之一", () => {
    const drift = GOOD.replace('dur="1s" repeatCount="indefinite"/></g>\n</svg>', 'dur="0.7s" repeatCount="indefinite"/></g>\n</svg>');
    assert.equal(score(drift, "C4"), 5);
  });
});

describe("attemptKeyOf", () => {
  test("去掉 .svg 与目录", () => {
    assert.equal(attemptKeyOf("20260930T000000Z/a__b__c__p.svg"), "a__b__c__p");
  });
});

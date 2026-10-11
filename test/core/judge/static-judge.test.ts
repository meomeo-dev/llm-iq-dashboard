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
  <g id="leg-near"><path d="M200 150 L200 190">
    <animate attributeName="d" values="M200 150 L200 190;M200 150 L205 200;M200 150 L200 190" dur="1s" repeatCount="indefinite"/></path></g>
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
    assert.deepEqual(j.criteria.slice(0, 4).map((c) => c.score), [10, 8, 4, 8]);
    assert.equal(j.criteria.find((c) => c.id === "C6")?.score, null);
    assert.equal(j.total.score, 30);
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
    assert.equal(score(offCenter, "C1"), 5);
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
    assert.deepEqual(j.criteria.slice(0, 4).map((c) => c.score), [10, 6, 4, 8]);
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
    assert.deepEqual(j.criteria.slice(0, 4).map((c) => c.score), [10, 8, 4, 8]);
    assert.match(j.criteria[1]?.reason ?? "", /在两轮之间/);
  });

  test("腿没有命名但周期与曲柄一致：C4 仍满分，理由注明待核对", () => {
    const unnamed = GOOD.replace('<g id="leg-near">', "<g>");
    const c4 = judge(unnamed).criteria.find((c) => c.id === "C4");
    assert.equal(c4?.score, 8);
    assert.match(c4?.reason ?? "", /未命名为腿/);
  });

  test("只播放一次的车轮：循环项按比例扣", () => {
    const once = GOOD.replace('dur="2s" repeatCount="indefinite"', 'dur="2s" repeatCount="1"');
    assert.equal(score(once, "C3"), 3);
  });

  test("腿部周期与曲柄不成整数比：C4 只得三分之一", () => {
    const drift = GOOD.replace('dur="1s" repeatCount="indefinite"/></path></g>', 'dur="0.7s" repeatCount="indefinite"/></path></g>');
    assert.equal(score(drift, "C4"), 3);
  });
});

describe("judgeStatic CSS 变量与 calc", () => {
  // 与上面 CSS 用例同构，时长都经 :root 上的变量给出；腿命名为 thigh
  const varArt = (rootDecl: string, legDuration: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><style>
      :root { ${rootDecl} }
      @keyframes spin { to { transform: rotate(360deg); } }
      .wheel { animation: spin var(--cycle) linear infinite; }
      #rear { transform-origin: 100px 200px; } #front { transform-origin: 300px 200px; }
      #crank { animation: spin var(--cycle) linear infinite; transform-origin: 200px 190px; }
      .thigh { animation: kick ${legDuration} linear infinite; } @keyframes kick { to { transform: rotate(20deg); } }
    </style>
      <g id="rear" class="wheel"><circle cx="100" cy="200" r="40"/></g>
      <g id="front" class="wheel"><circle cx="300" cy="200" r="40"/></g>
      <g id="crank"><circle cx="200" cy="190" r="12"/></g>
      <path class="thigh" d="M200 150 L200 190"/>
    </svg>`;

  test(":root 上声明的变量代入时长：曲柄周期已知，腿同步满分", () => {
    const j = judge(varArt("--cycle: 1.6s;", "var(--cycle)"));
    assert.deepEqual(j.criteria.slice(0, 4).map((c) => c.score), [10, 8, 4, 8]);
    assert.match(j.criteria[3]?.reason ?? "", /周期 1600ms 与曲柄 1600ms 同步/);
  });

  test("calc() 里时间与数字的乘除：半周期的腿与曲柄成整数比", () => {
    const c4 = judge(varArt("--cycle: 1.6s;", "calc(var(--cycle) / 2)")).criteria.find((c) => c.id === "C4");
    assert.equal(c4?.score, 8);
    assert.match(c4?.reason ?? "", /周期 800ms/);
  });

  test("变量未声明时用回退值；既没声明也没回退值时浏览器不播放，这条动画不算", () => {
    const fallback = varArt("", "var(--cycle)").replaceAll("var(--cycle)", "var(--cycle, 2s)");
    assert.equal(score(fallback, "C4"), 8);
    const undefinedVar = judge(varArt("", "var(--cycle)"));
    assert.equal(undefinedVar.gates.find((g) => g.id === "G2")?.passed, false);
  });

  test("祖先元素上声明的变量向下继承，近处的声明覆盖远处", () => {
    const scoped = varArt("--cycle: 9s;", "var(--cycle)")
      .replace('<path class="thigh"', '<g style="--cycle: 1.6s"><path class="thigh"')
      .replace('d="M200 150 L200 190"/>', 'd="M200 150 L200 190"/></g>');
    const c4 = judge(scoped).criteria.find((c) => c.id === "C4");
    assert.match(c4?.reason ?? "", /周期 1600ms 与曲柄 9000ms 不成整数比/);
  });
});

describe("attemptKeyOf", () => {
  test("去掉 .svg 与目录", () => {
    assert.equal(attemptKeyOf("20260930T000000Z/a__b__c__p.svg"), "a__b__c__p");
  });
});

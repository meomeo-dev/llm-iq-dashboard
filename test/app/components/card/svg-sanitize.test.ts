/** 必测矩阵 #10：SVG 净化。看板内联未经审阅的模型输出，任一项遗漏即为 XSS */

import assert from "node:assert/strict";
import { before, describe, test } from "node:test";
import { installDom } from "../../../support/dom";

const SVG_NS = 'xmlns="http://www.w3.org/2000/svg"';

type Sanitize = typeof import("@/app/components/card/svg-sanitize").sanitizeSvg;
let sanitizeSvg: Sanitize;

before(async () => {
  installDom();
  ({ sanitizeSvg } = await import("@/app/components/card/svg-sanitize"));
});

function sanitizedMarkup(source: string): string {
  const result = sanitizeSvg(source);
  assert.equal(result.error, null);
  assert.ok(result.element);
  return result.element.outerHTML;
}

describe("sanitizeSvg", () => {
  test("剪除可执行或可嵌入外部文档的元素", () => {
    const markup = sanitizedMarkup(
      `<svg ${SVG_NS}><script>alert(1)</script><foreignObject><div/></foreignObject>` +
        `<set attributeName="href" to="javascript:alert(1)"/><circle r="4"/></svg>`,
    );
    assert.doesNotMatch(markup, /<script|<foreignObject|<set/i);
    assert.match(markup, /<circle/);
  });

  test("剪除全部 on* 事件属性", () => {
    const markup = sanitizedMarkup(`<svg ${SVG_NS} onload="x()"><rect onclick="y()" width="1"/></svg>`);
    assert.doesNotMatch(markup, /onload|onclick/i);
    assert.match(markup, /width="1"/);
  });

  test("外部与 javascript: 引用被剪除，文档内锚点与 data 图片保留", () => {
    const markup = sanitizedMarkup(
      `<svg ${SVG_NS} xmlns:xlink="http://www.w3.org/1999/xlink">` +
        `<a href="javascript:alert(1)"><text>x</text></a>` +
        `<image href="https://tracker.example/p.png"/>` +
        `<use xlink:href="#wheel"/><image href="data:image/png;base64,AAAA"/></svg>`,
    );
    assert.doesNotMatch(markup, /javascript:|tracker\.example/);
    assert.match(markup, /#wheel/);
    assert.match(markup, /data:image\/png/);
  });

  test("动画属性里的 javascript: 取值被剪除", () => {
    const markup = sanitizedMarkup(
      `<svg ${SVG_NS}><a><animate attributeName="href" values="javascript:alert(1)"/></a></svg>`,
    );
    assert.doesNotMatch(markup, /javascript:/);
  });

  test("style 中的外链 url() 被剪除，文档内 url(#id) 保留", () => {
    const markup = sanitizedMarkup(
      `<svg ${SVG_NS}><rect style="fill:url(https://x.example/a)"/>` +
        `<rect style="fill:url(#grad)"/></svg>`,
    );
    assert.doesNotMatch(markup, /x\.example/);
    assert.match(markup, /url\(#grad\)/);
  });

  test("固有尺寸折算为 viewBox 并移除 width / height", () => {
    const markup = sanitizedMarkup(`<svg ${SVG_NS} width="800px" height="600"><g/></svg>`);
    assert.match(markup, /viewBox="0 0 800 600"/);
    assert.doesNotMatch(markup, /\swidth=|\sheight=/);
  });

  test("不合法 XML 返回错误而不是抛出", () => {
    const result = sanitizeSvg(`<svg ${SVG_NS}><g></svg>`);
    assert.equal(result.element, null);
    assert.match(result.error ?? "", /无法解析/);
  });

  test("根元素不是 svg 时返回错误", () => {
    const result = sanitizeSvg(`<g ${SVG_NS}/>`);
    assert.equal(result.element, null);
    assert.match(result.error ?? "", /根元素不是/);
  });

  test("<style> 中的裸 & 与 CSS 在自动 CDATA 包裹后成功解析", () => {
    const markup = sanitizedMarkup(
      `<svg ${SVG_NS}><style>/* Subtle breathing & posture */ .pelican { content: "A & B"; }</style><circle r="4"/></svg>`,
    );
    assert.match(markup, /breathing &amp; posture/);
    assert.match(markup, /<circle/);
  });

  test("已显式包含 <![CDATA[ 的 <style> 可安全导入 HTML DOM", () => {
    const markup = sanitizedMarkup(
      `<svg ${SVG_NS}><style><![CDATA[ @keyframes roll { 0% { transform: rotate(0deg); } } ]]></style><path d="M0 0"/></svg>`,
    );
    assert.match(markup, /@keyframes roll/);
  });
});

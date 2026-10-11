/** 作品挂进 shadow root：样式不外溢、:root 改写、按 viewBox 比例定尺寸 */

import assert from "node:assert/strict";
import { before, describe, test } from "node:test";
import { installDom } from "../../../support/dom";

const SVG_NS = 'xmlns="http://www.w3.org/2000/svg"';

type Sanitize = typeof import("@/app/components/card/svg-sanitize").sanitizeSvg;
let mountInShadow: typeof import("@/app/components/card/svg-shadow").mountInShadow;
let viewBoxSize: typeof import("@/app/components/card/svg-fit").viewBoxSize;
let sanitizeSvg: Sanitize;

before(async () => {
  installDom();
  ({ mountInShadow } = await import("@/app/components/card/svg-shadow"));
  ({ viewBoxSize } = await import("@/app/components/card/svg-fit"));
  ({ sanitizeSvg } = await import("@/app/components/card/svg-sanitize"));
});

function artwork(source: string): SVGElement {
  const { element } = sanitizeSvg(source);
  assert.ok(element);
  return element;
}

function newHost(): HTMLElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  return host;
}

describe("mountInShadow", () => {
  test("作品挂在 shadow root 里，不进入宿主的普通子节点", () => {
    const host = newHost();
    mountInShadow(host, artwork(`<svg ${SVG_NS} viewBox="0 0 10 10"><style>path{fill:red}</style></svg>`));
    assert.equal(host.children.length, 0);
    assert.equal(host.shadowRoot?.querySelectorAll("svg").length, 1);
    assert.equal(document.querySelectorAll("svg style").length, 0);
  });

  test("重复挂载复用同一个 shadow root 并替换旧作品", () => {
    const host = newHost();
    mountInShadow(host, artwork(`<svg ${SVG_NS} viewBox="0 0 10 10"><rect width="1"/></svg>`));
    const shadow = host.shadowRoot;
    mountInShadow(host, artwork(`<svg ${SVG_NS} viewBox="0 0 10 10"><circle r="1"/></svg>`));
    assert.equal(host.shadowRoot, shadow);
    assert.equal(shadow?.querySelectorAll("rect").length, 0);
    assert.equal(shadow?.querySelectorAll("circle").length, 1);
  });

  test(":root 规则改写为 :host，作品声明的 CSS 变量仍可继承", () => {
    const host = newHost();
    mountInShadow(host, artwork(`<svg ${SVG_NS}><style>:root { --speed: 1.6s; }</style></svg>`));
    const css = host.shadowRoot?.querySelector("style")?.textContent ?? "";
    assert.match(css, /:host \{ --speed: 1\.6s; \}/);
    assert.doesNotMatch(css, /:root/);
  });

  test("缺 viewBox 时铺满框", () => {
    const host = newHost();
    mountInShadow(host, artwork(`<svg ${SVG_NS} width="50%" height="50%"></svg>`));
    const svg = host.shadowRoot?.querySelector("svg");
    assert.equal(svg?.style.width, "100%");
    assert.equal(svg?.style.height, "100%");
  });
});

describe("viewBoxSize", () => {
  test("取 viewBox 的宽高，空格与逗号分隔均可", () => {
    assert.deepEqual(viewBoxSize("0 0 1000 500"), { width: 1000, height: 500 });
    assert.deepEqual(viewBoxSize("-10,-10, 300,600"), { width: 300, height: 600 });
  });

  test("缺失、项数不对、非数字或宽高非正时返回 null", () => {
    assert.equal(viewBoxSize(null), null);
    assert.equal(viewBoxSize("0 0 100"), null);
    assert.equal(viewBoxSize("0 0 a 100"), null);
    assert.equal(viewBoxSize("0 0 0 100"), null);
    assert.equal(viewBoxSize("0 0 100 -5"), null);
  });
});

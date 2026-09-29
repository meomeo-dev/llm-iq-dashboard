import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ReferenceSourceDisplay } from "@/app/components/ReferenceSourceDisplay";

(globalThis as unknown as { React: unknown }).React = React;

const fixture = (name: string): string => {
  const filePath = path.resolve(process.cwd(), "test/fixtures/markup/wp-h", `${name}.html`);
  return fs.readFileSync(filePath, "utf-8");
};

describe("ReferenceSourceDisplay 特征测试", () => {
  test("绝对 HTTP/HTTPS URL 渲染为外链", () => {
    const html = renderToStaticMarkup(
      React.createElement(ReferenceSourceDisplay, { source: "https://example.com/paper.pdf" })
    );
    assert.equal(html, fixture("reference-source-display-url"));
  });

  test("学术引文包含 DOI 提取出 DOI 外链", () => {
    const html = renderToStaticMarkup(
      React.createElement(ReferenceSourceDisplay, {
        source: "Nature 580, 123-128 (2020), doi: 10.1038/s41586-020-2649-2",
      })
    );
    assert.equal(html, fixture("reference-source-display-doi"));
  });

  test("学术引文包含嵌入式 URL 提取出外链", () => {
    const html = renderToStaticMarkup(
      React.createElement(ReferenceSourceDisplay, {
        source: "Available at https://arxiv.org/abs/2101.00001 (accessed 2026)",
      })
    );
    assert.equal(html, fixture("reference-source-display-embedded-url"));
  });

  test("纯文本引文渲染为普通文本，不包含 <a> 标签", () => {
    const html = renderToStaticMarkup(
      React.createElement(ReferenceSourceDisplay, {
        source: "Standard Test Method for Cycling IQ, 2025",
      })
    );
    assert.equal(html, fixture("reference-source-display-plain-text"));
  });

  test("「 · 」分隔的多条出处逐段成链，仓库路径不成链", () => {
    const html = renderToStaticMarkup(
      React.createElement(ReferenceSourceDisplay, {
        source:
          "https://en.wikipedia.org/wiki/Tower_Bridge · Wikidata Q83125 · " +
          "docs/research/landmarks/02-london-tower-bridge.md",
      })
    );
    const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((match) => match[1]);
    assert.deepEqual(hrefs, [
      "https://en.wikipedia.org/wiki/Tower_Bridge",
      "https://www.wikidata.org/wiki/Q83125",
    ]);
    assert.match(html, />Wikidata Q83125 ↗</);
    assert.match(
      html,
      /<span class="source-citation-text">docs\/research\/landmarks\/02-london-tower-bridge\.md<\/span>/
    );
  });

  test("URL 开头但后接说明文字时，href 只取 URL 本身", () => {
    const html = renderToStaticMarkup(
      React.createElement(ReferenceSourceDisplay, {
        source: "https://example.com/paper.pdf (accessed 2026)",
      })
    );
    const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((match) => match[1]);
    assert.deepEqual(hrefs, ["https://example.com/paper.pdf"]);
  });

  test("空字符串或空白字符串返回空", () => {
    const html = renderToStaticMarkup(
      React.createElement(ReferenceSourceDisplay, { source: "   " })
    );
    assert.equal(html, "");
  });
});

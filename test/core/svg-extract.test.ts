/**
 * 必测矩阵 #2：作品提取。取错一段或漏取，结果照样显示为成功。
 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { extractSvg, extractSvgFilePath } from "@/core/svg";

describe("extractSvg", () => {
  test("多段 <svg> 取最长的一段", () => {
    const sketch = "<svg><rect/></svg>";
    const artwork = '<svg viewBox="0 0 10 10"><circle r="4"/><path d="M0 0L9 9"/></svg>';
    const extracted = extractSvg(`先给草图 ${sketch}，正式作品：\n${artwork}\n完毕`);
    assert.ok(extracted);
    assert.match(extracted.source, /<circle r="4"\/>/);
  });

  test("缺 xmlns 时补上，并按 UTF-8 计字节", () => {
    const extracted = extractSvg("<svg><text>鹈鹕</text></svg>");
    assert.ok(extracted);
    assert.match(extracted.source, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg">/);
    assert.equal(extracted.bytes, Buffer.byteLength(extracted.source, "utf8"));
  });

  test("<style> 缺 CDATA 时自动补上 CDATA 包裹", () => {
    const extracted = extractSvg("<svg><style>/* A & B */</style></svg>");
    assert.ok(extracted);
    assert.match(extracted.source, /<style><!\[CDATA\[\/\* A & B \*\/\]\]><\/style>/);
  });

  test("同前缀标签 <svgfoo> 不算作品", () => {
    assert.equal(extractSvg("<svgfoo>x</svg>"), null);
  });

  test("没有成对闭合标签时返回 null", () => {
    assert.equal(extractSvg("<svg><circle r='1'/>"), null);
    assert.equal(extractSvg("已保存到文件"), null);
  });

  test("前置未闭合截断残片与重试完整作品共存时，正确提取完整作品", () => {
    const raw = [
      "```xml",
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">',
      "  <path d=\"M 0 0",
      "```xml",
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">',
      '  <circle cx="50" cy="50" r="40" fill="red"/>',
      "</svg>",
      "```",
    ].join("\n");
    const extracted = extractSvg(raw);
    assert.ok(extracted);
    assert.match(extracted.source, /<circle cx="50"/);
    assert.doesNotMatch(extracted.source, /```/);
    assert.doesNotMatch(extracted.source, /<path/);
  });

  test("支持提取包含合法嵌套 <svg> 的外层完整 SVG", () => {
    const nested = [
      '<svg id="outer" viewBox="0 0 100 100">',
      '  <svg id="inner" x="10" y="10" viewBox="0 0 50 50">',
      '    <circle cx="25" cy="25" r="20"/>',
      "  </svg>",
      "</svg>",
    ].join("\n");
    const extracted = extractSvg(nested);
    assert.ok(extracted);
    assert.match(extracted.source, /id="outer"/);
    assert.match(extracted.source, /id="inner"/);
    assert.match(extracted.source, /<\/svg>\s*<\/svg>$/);
  });
});

describe("extractSvgFilePath", () => {
  test("取出 file:// 路径并解码", () => {
    const answer = "已保存到 file:///tmp/pelican%20bike.svg ，请查看。";
    assert.equal(extractSvgFilePath(answer), "/tmp/pelican bike.svg");
  });

  test("不是 .svg 的 file:// 链接不算", () => {
    assert.equal(extractSvgFilePath("见 file:///tmp/notes.txt"), null);
  });
});

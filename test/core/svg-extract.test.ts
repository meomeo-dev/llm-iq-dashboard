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

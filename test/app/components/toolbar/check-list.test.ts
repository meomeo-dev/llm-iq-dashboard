import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CheckList } from "@/app/components/toolbar/CheckList";

(globalThis as unknown as { React: unknown }).React = React;

const fixture = (name: string): string => {
  const filePath = path.resolve(process.cwd(), "test/fixtures/markup/wp-h", `${name}.html`);
  return fs.readFileSync(filePath, "utf-8");
};

describe("CheckList 特征测试", () => {
  test("全部选中：全选按钮禁用，各项勾选", () => {
    const html = renderToStaticMarkup(
      React.createElement(CheckList, {
        items: [
          { value: "a", label: "Model A", count: 10 },
          { value: "b", label: "Model B", count: 5 },
        ],
        hidden: new Set<string>(),
        onChange: () => {},
      })
    );
    assert.equal(html, fixture("check-list-all-checked"));
  });

  test("部分隐藏：全选按钮可用，带 marker", () => {
    const html = renderToStaticMarkup(
      React.createElement(CheckList, {
        items: [
          {
            value: "a",
            label: "Model A",
            count: 10,
            marker: React.createElement("span", { className: "cli-mark" }),
          },
          { value: "b", label: "Model B", count: 5 },
        ],
        hidden: new Set<string>(["a"]),
        onChange: () => {},
      })
    );
    assert.equal(html, fixture("check-list-some-hidden"));
  });

  test("空列表：全选与反选均禁用", () => {
    const html = renderToStaticMarkup(
      React.createElement(CheckList, {
        items: [],
        hidden: new Set<string>(),
        onChange: () => {},
      })
    );
    assert.equal(html, fixture("check-list-empty"));
  });
});

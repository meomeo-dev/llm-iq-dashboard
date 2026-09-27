import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FilterMenu } from "@/app/components/toolbar/FilterMenu";

(globalThis as unknown as { React: unknown }).React = React;

const fixture = (name: string): string => {
  const filePath = path.resolve(process.cwd(), "test/fixtures/markup/wp-h", `${name}.html`);
  return fs.readFileSync(filePath, "utf-8");
};

describe("FilterMenu 特征测试", () => {
  test("关闭状态：仅渲染触发按钮，未筛选时不显示徽章", () => {
    const html = renderToStaticMarkup(
      React.createElement(FilterMenu, {
        groups: [
          {
            key: "cli",
            label: "CLI",
            items: [{ value: "agy", label: "agy", count: 2 }],
          },
        ],
        hidden: {
          cli: new Set<string>(),
          model: new Set<string>(),
          effort: new Set<string>(),
          promptId: new Set<string>(),
        },
        open: false,
        onToggle: () => {},
        onClose: () => {},
        onHidden: () => {},
      })
    );
    assert.equal(html, fixture("filter-menu-closed"));
  });

  test("展开状态：显示多维度标签及激活维度的 CheckList", () => {
    const html = renderToStaticMarkup(
      React.createElement(FilterMenu, {
        groups: [
          {
            key: "cli",
            label: "CLI",
            items: [
              { value: "agy", label: "agy", count: 2 },
              { value: "claude", label: "claude", count: 3 },
            ],
          },
          {
            key: "model",
            label: "模型",
            items: [{ value: "m1", label: "m1", count: 5 }],
          },
        ],
        hidden: {
          cli: new Set<string>(["agy"]),
          model: new Set<string>(),
          effort: new Set<string>(),
          promptId: new Set<string>(),
        },
        open: true,
        onToggle: () => {},
        onClose: () => {},
        onHidden: () => {},
      })
    );
    assert.equal(html, fixture("filter-menu-open-filtered"));
  });
});

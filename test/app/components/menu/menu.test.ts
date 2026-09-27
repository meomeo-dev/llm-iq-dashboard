import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Menu, type MenuProps } from "@/app/components/menu/Menu";

(globalThis as unknown as { React: unknown }).React = React;

const fixture = (name: string): string => {
  const filePath = path.resolve(process.cwd(), "test/fixtures/markup/wp-h", `${name}.html`);
  return fs.readFileSync(filePath, "utf-8");
};

describe("Menu 特征测试", () => {
  test("关闭状态：仅渲染触发按钮", () => {
    const props: MenuProps = {
      label: "Options",
      open: false,
      onToggle: () => {},
      onClose: () => {},
      children: React.createElement("div", null, "child content"),
    };
    const html = renderToStaticMarkup(React.createElement(Menu, props));
    assert.equal(html, fixture("menu-closed"));
  });

  test("展开状态（左对齐）：渲染遮罩与内容面板", () => {
    const props: MenuProps = {
      label: "Actions",
      open: true,
      align: "left",
      onToggle: () => {},
      onClose: () => {},
      children: React.createElement("button", { className: "menu-row", type: "button" }, "Item 1"),
    };
    const html = renderToStaticMarkup(React.createElement(Menu, props));
    assert.equal(html, fixture("menu-open-left"));
  });

  test("展开状态（右对齐 + 徽章 + 自定义样式类）", () => {
    const props: MenuProps = {
      label: "Filter",
      open: true,
      align: "right",
      badge: { text: "2/5", filtered: true },
      panelClassName: "custom-panel",
      buttonClassName: "custom-btn",
      onToggle: () => {},
      onClose: () => {},
      children: React.createElement("div", null, "panel content"),
    };
    const html = renderToStaticMarkup(React.createElement(Menu, props));
    assert.equal(html, fixture("menu-open-right-badge"));
  });
});

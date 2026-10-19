import path from "node:path";
import { describe, test } from "node:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Menu, type MenuProps } from "@/app/components/menu/Menu";
import { expectFixture } from "../../../support/fixtures";

(globalThis as unknown as { React: unknown }).React = React;

const assertFixture = (actual: string, name: string): void => {
  expectFixture(actual, path.resolve(process.cwd(), "test/fixtures/markup/wp-h", `${name}.html`));
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
    assertFixture(html, "menu-closed");
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
    assertFixture(html, "menu-open-left");
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
    assertFixture(html, "menu-open-right-badge");
  });
});

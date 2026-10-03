import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
(globalThis as unknown as { React: typeof React }).React = React;
import ReactDOMServer from "react-dom/server";
import { JSDOM } from "jsdom";
import { CONFIG_NAV_ITEMS } from "@/app/config/config-nav-items";
import { ConfigSideNav } from "@/app/config/ConfigSideNav";

test("CONFIG_NAV_ITEMS 常量契约", () => {
  assert.strictEqual(CONFIG_NAV_ITEMS.length, 11);
  const expectedOrder = [
    { id: "capability", title: "CLI 能力目录", href: "#capability" },
    { id: "prompts", title: "提示词", href: "#prompts" },
    { id: "harness-guard", title: "直出约束", href: "#harness-guard" },
    { id: "profiles", title: "上游 Profile", href: "#profiles" },
    { id: "matrix", title: "被测矩阵", href: "#matrix" },
    { id: "schedule", title: "调度", href: "#schedule" },
    { id: "timeout", title: "执行与超时", href: "#timeout" },
    { id: "judge", title: "作品评审", href: "#judge" },
    { id: "data-repo-settings", title: "数据仓设置", href: "#data-repo-settings" },
    { id: "data-repo", title: "数据仓", href: "#data-repo" },
    { id: "devices", title: "已配对设备", href: "#devices" },
  ];
  assert.deepStrictEqual(CONFIG_NAV_ITEMS, expectedOrder);
});

test("ConfigSideNav 静态渲染与无障碍属性", async (t) => {
  await t.test("导航项数量、顺序、href 与标题完整匹配", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ConfigSideNav)
    );
    const dom = new JSDOM(html);
    const nav = dom.window.document.querySelector("nav");
    assert.ok(nav !== null, "应渲染 <nav> 标签");
    assert.strictEqual(nav.getAttribute("aria-label"), "配置页导航");

    const links = Array.from(dom.window.document.querySelectorAll("nav a"));
    assert.strictEqual(links.length, CONFIG_NAV_ITEMS.length);

    links.forEach((link, index) => {
      const item = CONFIG_NAV_ITEMS[index]!;
      assert.strictEqual(link.getAttribute("href"), item.href);
      assert.strictEqual(link.textContent?.trim(), item.title);
    });
  });

  await t.test(
    "给定 activeId 时，对应项带 aria-current=\"location\" 且仅此一项带该属性",
    () => {
      for (const targetItem of CONFIG_NAV_ITEMS) {
        const html = ReactDOMServer.renderToStaticMarkup(
          React.createElement(ConfigSideNav, { activeId: targetItem.id })
        );
        const dom = new JSDOM(html);
        const links = Array.from(
          dom.window.document.querySelectorAll("nav a")
        );

        links.forEach((link) => {
          const href = link.getAttribute("href");
          if (href === targetItem.href) {
            assert.strictEqual(
              link.getAttribute("aria-current"),
              "location",
              `锚点 ${href} 应携带 aria-current="location"`
            );
          } else {
            assert.strictEqual(
              link.getAttribute("aria-current"),
              null,
              `非激活项 ${href} 不应携带 aria-current`
            );
          }
        });
      }
    }
  );

  await t.test("支持传入自定义 items", () => {
    const customItems = [
      { id: "section-a", title: "板块甲", href: "#section-a" },
      { id: "section-b", title: "板块乙", href: "#section-b" },
    ];
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ConfigSideNav, {
        items: customItems,
        activeId: "section-b",
      })
    );
    const dom = new JSDOM(html);
    const links = Array.from(dom.window.document.querySelectorAll("nav a"));
    assert.strictEqual(links.length, 2);
    assert.strictEqual(links[1]!.getAttribute("aria-current"), "location");
    assert.strictEqual(links[0]!.getAttribute("aria-current"), null);
  });
});

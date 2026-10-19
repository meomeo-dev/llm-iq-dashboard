import path from "node:path";
import { describe, test } from "node:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Calendar } from "@/app/components/toolbar/Calendar";
import { expectFixture } from "../../../support/fixtures";

(globalThis as unknown as { React: unknown }).React = React;

const assertFixture = (actual: string, name: string): void => {
  expectFixture(actual, path.resolve(process.cwd(), "test/fixtures/markup/wp-h", `${name}.html`));
};

describe("Calendar 特征测试", () => {
  test("常规月份：选中今日，显示轮数标记", () => {
    const html = renderToStaticMarkup(
      React.createElement(Calendar, {
        days: [
          { dayKey: "2026-09-27", momentCount: 4 },
          { dayKey: "2026-09-26", momentCount: 2 },
        ],
        dayKey: "2026-09-27",
        todayKey: "2026-09-27",
        onPick: () => {},
      })
    );
    assertFixture(html, "calendar-normal");
  });

  test("所选日期与今天不同：分别标出 selected 与 today", () => {
    const html = renderToStaticMarkup(
      React.createElement(Calendar, {
        days: [{ dayKey: "2026-09-26", momentCount: 3 }],
        dayKey: "2026-09-26",
        todayKey: "2026-09-27",
        onPick: () => {},
      })
    );
    assertFixture(html, "calendar-different-today");
  });

  test("未选中任何日期（dayKey 为 null）", () => {
    const html = renderToStaticMarkup(
      React.createElement(Calendar, {
        days: [],
        dayKey: null,
        todayKey: "2026-09-27",
        onPick: () => {},
      })
    );
    assertFixture(html, "calendar-no-selected");
  });
});

import path from "node:path";
import { describe, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

(globalThis as unknown as { React: typeof React }).React = React;

import { AutoRunToggle } from "@/app/components/run-control/AutoRunToggle";
import { RunForecast } from "@/app/components/run-control/RunForecast";
import { RunOnceMenu } from "@/app/components/run-control/RunOnceMenu";
import { StopRunButton } from "@/app/components/run-control/StopRunButton";
import { UnavailableNote } from "@/app/components/run-control/UnavailableNote";
import type { UnavailableCli } from "@/capabilities/callable-targets";
import { expectFixture } from "../../../support/fixtures";

const FIXTURES_DIR = path.resolve("test/fixtures/markup/wp-f");

function assertFixture(actual: string, name: string): void {
  expectFixture(actual, path.join(FIXTURES_DIR, name));
}

const noop = () => {};

const mockCosts = {
  expected: { "claude/claude-3-7-sonnet/high": 0.05 },
  budget: { perRoundUsd: 1.0, perDayUsd: 10.0 },
  spentLastDayUsd: 0.2,
};

describe("RunControl Components Markup Characterization", () => {
  describe("RunOnceMenu", () => {
    test("closed 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(RunOnceMenu, { open: false, onToggle: noop, onClose: noop }),
      );
      assertFixture(actual, "RunOnceMenu-closed.html");
    });

    test("open 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(RunOnceMenu, { open: true, onToggle: noop, onClose: noop }),
      );
      assertFixture(actual, "RunOnceMenu-open.html");
    });
  });

  describe("AutoRunToggle", () => {
    test("normal 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(AutoRunToggle, { timeZone: "Asia/Shanghai", readOnly: false }),
      );
      assertFixture(actual, "AutoRunToggle-normal.html");
    });

    test("readonly 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(AutoRunToggle, { timeZone: "UTC", readOnly: true }),
      );
      assertFixture(actual, "AutoRunToggle-readonly.html");
    });
  });

  describe("RunForecast", () => {
    test("empty 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(RunForecast, {
          costs: { expected: {}, budget: { perRoundUsd: null, perDayUsd: null }, spentLastDayUsd: 0 },
          targetIds: [],
          promptCount: 0,
        }),
      );
      assertFixture(actual, "RunForecast-empty.html");
    });

    test("populated 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(RunForecast, {
          costs: mockCosts,
          targetIds: ["claude/claude-3-7-sonnet/high"],
          promptCount: 2,
        }),
      );
      assertFixture(actual, "RunForecast-populated.html");
    });

    test("overbudget 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(RunForecast, {
          costs: {
            expected: { "claude/claude-3-7-sonnet/high": 0.5 },
            budget: { perRoundUsd: 0.1, perDayUsd: 0.2 },
            spentLastDayUsd: 0.5,
          },
          targetIds: ["claude/claude-3-7-sonnet/high"],
          promptCount: 1,
        }),
      );
      assertFixture(actual, "RunForecast-overbudget.html");
    });
  });

  describe("StopRunButton", () => {
    test("normal 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(StopRunButton, { runId: "20260927T020000Z", stopping: false }),
      );
      assertFixture(actual, "StopRunButton-normal.html");
    });

    test("stopping 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(StopRunButton, { runId: "20260927T020000Z", stopping: true }),
      );
      assertFixture(actual, "StopRunButton-stopping.html");
    });
  });

  describe("UnavailableNote", () => {
    test("empty 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(UnavailableNote, { unavailable: [] }),
      );
      assertFixture(actual, "UnavailableNote-empty.html");
    });

    test("populated 场景逐字节一致", () => {
      const unavailable: UnavailableCli[] = [
        { cli: "agy", state: "signed-out", detail: "", targets: 1 },
        { cli: "claude", state: "signed-out", detail: "", targets: 1 },
      ];
      const actual = renderToStaticMarkup(
        React.createElement(UnavailableNote, { unavailable }),
      );
      assertFixture(actual, "UnavailableNote-populated.html");
    });
  });
});

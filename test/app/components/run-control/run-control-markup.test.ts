import assert from "node:assert/strict";
import fs from "node:fs";
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

const FIXTURES_DIR = path.resolve("test/fixtures/markup/wp-f");

function loadFixture(name: string): string {
  return fs.readFileSync(path.join(FIXTURES_DIR, name), "utf-8");
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
      assert.equal(actual, loadFixture("RunOnceMenu-closed.html"));
    });

    test("open 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(RunOnceMenu, { open: true, onToggle: noop, onClose: noop }),
      );
      assert.equal(actual, loadFixture("RunOnceMenu-open.html"));
    });
  });

  describe("AutoRunToggle", () => {
    test("normal 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(AutoRunToggle, { timeZone: "Asia/Shanghai", readOnly: false }),
      );
      assert.equal(actual, loadFixture("AutoRunToggle-normal.html"));
    });

    test("readonly 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(AutoRunToggle, { timeZone: "UTC", readOnly: true }),
      );
      assert.equal(actual, loadFixture("AutoRunToggle-readonly.html"));
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
      assert.equal(actual, loadFixture("RunForecast-empty.html"));
    });

    test("populated 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(RunForecast, {
          costs: mockCosts,
          targetIds: ["claude/claude-3-7-sonnet/high"],
          promptCount: 2,
        }),
      );
      assert.equal(actual, loadFixture("RunForecast-populated.html"));
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
      assert.equal(actual, loadFixture("RunForecast-overbudget.html"));
    });
  });

  describe("StopRunButton", () => {
    test("normal 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(StopRunButton, { runId: "20260927T020000Z", stopping: false }),
      );
      assert.equal(actual, loadFixture("StopRunButton-normal.html"));
    });

    test("stopping 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(StopRunButton, { runId: "20260927T020000Z", stopping: true }),
      );
      assert.equal(actual, loadFixture("StopRunButton-stopping.html"));
    });
  });

  describe("UnavailableNote", () => {
    test("empty 场景逐字节一致", () => {
      const actual = renderToStaticMarkup(
        React.createElement(UnavailableNote, { unavailable: [] }),
      );
      assert.equal(actual, loadFixture("UnavailableNote-empty.html"));
    });

    test("populated 场景逐字节一致", () => {
      const unavailable: UnavailableCli[] = [
        { cli: "agy", state: "signed-out", detail: "", targets: 1 },
        { cli: "claude", state: "signed-out", detail: "", targets: 1 },
      ];
      const actual = renderToStaticMarkup(
        React.createElement(UnavailableNote, { unavailable }),
      );
      assert.equal(actual, loadFixture("UnavailableNote-populated.html"));
    });
  });
});

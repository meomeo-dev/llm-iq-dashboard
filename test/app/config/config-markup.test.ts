import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import React from "react";
(globalThis as unknown as { React: typeof React }).React = React;

import ReactDOMServer from "react-dom/server";
import { RotationForm } from "@/app/config/RotationForm";
import { TimeoutForm } from "@/app/config/TimeoutForm";
import { PromptPicker } from "@/app/config/PromptPicker";
import { TargetTable } from "@/app/config/TargetTable";
import { CapabilityPanel } from "@/app/config/CapabilityPanel";
import { ScheduleForm } from "@/app/config/ScheduleForm";

const FIXTURES_DIR = path.resolve(__dirname, "../../fixtures/markup/wp-g");

function readFixture(name: string): string {
  return fs.readFileSync(path.join(FIXTURES_DIR, name), "utf-8");
}

test("RotationForm markup matches fixtures", async (t) => {
  await t.test("day period", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(RotationForm, {
        value: { period: "day", timeZone: "Asia/Shanghai" },
        onChange: () => {},
      })
    );
    assert.strictEqual(html, readFixture("rotationform-day.html"));
  });

  await t.test("run period", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(RotationForm, {
        value: { period: "run", timeZone: "UTC" },
        onChange: () => {},
      })
    );
    assert.strictEqual(html, readFixture("rotationform-run.html"));
  });
});

test("TimeoutForm markup matches fixtures", async (t) => {
  await t.test("default configuration with cli and effort overrides", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(TimeoutForm, {
        run: {
          promptIds: ["pelican-v1"],
          concurrency: 2,
          defaultTimeoutMs: 600000,
          timeoutByCli: { codex: 300000, claude: 900000 },
          timeoutByEffort: { low: 600000, high: 900000, xhigh: 1800000 },
        },
        onChange: () => {},
      })
    );
    assert.strictEqual(html, readFixture("timeoutform-default.html"));
  });

  await t.test("empty overrides", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(TimeoutForm, {
        run: {
          promptIds: ["pelican-v1"],
          concurrency: 1,
          defaultTimeoutMs: 900000,
          timeoutByCli: {},
          timeoutByEffort: {},
        },
        onChange: () => {},
      })
    );
    assert.strictEqual(html, readFixture("timeoutform-empty.html"));
  });

  await t.test("custom high efforts", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(TimeoutForm, {
        run: {
          promptIds: ["pelican-v1", "capybara-v1"],
          concurrency: 4,
          defaultTimeoutMs: 1800000,
          timeoutByCli: { agy: 1200000 },
          timeoutByEffort: { medium: 800000, ultra: 3600000 },
        },
        onChange: () => {},
      })
    );
    assert.strictEqual(html, readFixture("timeoutform-custom-efforts.html"));
  });
});

test("PromptPicker markup matches fixtures", async (t) => {
  const builtinsExample = [
    {
      id: "pelican-v1",
      label: "经典鹈鹕",
      template: "Generate an SVG of a pelican riding a bicycle",
      variables: [],
      candidates: [
        { id: "c1", label: "候选 1", prompt: "p1", text: "p1", criteria: [] },
        { id: "c2", label: "候选 2", prompt: "p2", text: "p2", criteria: [] },
      ],
      source: null,
      verified: true,
      immutable: true,
      originDate: "2024-01-01",
      registeredAt: "2024-01-02",
    },
    {
      id: "var-prompt",
      label: "变量测试",
      template: "SVG of {{animal}}",
      variables: [{ name: "animal", mode: "sequence" as const, values: ["cat", "dog"] }],
      candidates: [],
      source: null,
      verified: false,
      immutable: false,
    },
  ];

  const customExample = [
    {
      id: "custom-1",
      label: "自定义 1",
      template: "Draw {{thing}}",
      variables: [{ name: "thing", mode: "random" as const, values: ["sun", "moon"] }],
      candidates: [],
      source: null,
      verified: false,
      immutable: false,
    },
  ];

  await t.test("default scenario with builtins, candidates and custom prompts", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(PromptPicker, {
        builtins: builtinsExample,
        custom: customExample,
        enabled: ["pelican-v1", "custom-1"],
        onEnabled: () => {},
        onCustom: () => {},
      })
    );
    assert.strictEqual(html, readFixture("promptpicker-default.html"));
  });

  await t.test("minimal scenario with single builtin and no custom", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(PromptPicker, {
        builtins: [builtinsExample[0]!],
        custom: [],
        enabled: ["pelican-v1"],
        onEnabled: () => {},
        onCustom: () => {},
      })
    );
    assert.strictEqual(html, readFixture("promptpicker-minimal.html"));
  });
});

test("TargetTable markup matches fixtures", async (t) => {
  const catalogExample = {
    schemaVersion: 1,
    probedAt: "2026-09-27T00:00:00.000Z",
    clis: [
      {
        cli: "claude" as const,
        available: true,
        models: [
          {
            id: "claude-3-opus",
            displayName: "Claude 3 Opus",
            cli: "claude" as const,
            sources: ["probe" as const],
            efforts: ["high" as const, "medium" as const, "low" as const],
            description: null,
          },
        ],
        efforts: ["high" as const, "medium" as const, "low" as const],
        notes: [],
      },
      {
        cli: "codex" as const,
        available: true,
        models: [
          {
            id: "o3-mini",
            displayName: "o3-mini",
            cli: "codex" as const,
            sources: ["builtin" as const],
            efforts: ["high" as const, "medium" as const, "low" as const],
            description: null,
          },
        ],
        efforts: ["high" as const, "medium" as const, "low" as const],
        notes: [],
      },
      {
        cli: "agy" as const,
        available: true,
        models: [
          {
            id: "gemini-2.5",
            displayName: "Gemini 2.5",
            cli: "agy" as const,
            sources: ["probe" as const],
            efforts: [],
            description: null,
          },
        ],
        efforts: [],
        notes: ["note a"],
      },
    ],
  };

  await t.test("default scenario with enabled/disabled rows and custom model", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(TargetTable, {
        profiles: [],
        targets: [
          {
            id: "claude__opus__high",
            cli: "claude",
            model: "claude-3-opus",
            effort: "high",
            label: "Claude 3 Opus",
            timeoutMs: 900000,
            extraArgs: [],
            enabled: true,
          },
          {
            id: "codex__o3__medium",
            cli: "codex",
            model: "o3-mini",
            effort: "medium",
            label: "",
            timeoutMs: 600000,
            extraArgs: [],
            enabled: false,
          },
        ],
        catalog: catalogExample,
        customModels: { claude: ["claude-custom-1"] },
        onTargets: () => {},
        onCustomModels: () => {},
      })
    );
    assert.strictEqual(html, readFixture("targettable-default.html"));
  });

  await t.test("model with no effort choices", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(TargetTable, {
        profiles: [],
        targets: [
          {
            id: "agy__gemini__medium",
            cli: "agy",
            model: "gemini-2.5",
            effort: "medium",
            label: "Gemini No Effort",
            timeoutMs: 600000,
            extraArgs: [],
            enabled: true,
          },
        ],
        catalog: catalogExample,
        customModels: {},
        onTargets: () => {},
        onCustomModels: () => {},
      })
    );
    assert.strictEqual(html, readFixture("targettable-no-efforts.html"));
  });
});

test("CapabilityPanel markup matches fixtures", async (t) => {
  await t.test("available clis", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(CapabilityPanel, {
        catalog: {
          schemaVersion: 1,
          probedAt: "2026-09-27T12:34:56.000Z",
          clis: [
            {
              cli: "claude",
              available: true,
              models: [
                { id: "claude-3-opus", displayName: "Opus", cli: "claude", sources: ["probe"], efforts: ["high"], description: null },
                { id: "claude-3-sonnet", displayName: "Sonnet", cli: "claude", sources: ["probe"], efforts: ["medium"], description: null },
              ],
              efforts: ["high", "medium"],
              notes: ["Claude CLI v1.2.3"],
            },
          ],
        },
        disabled: false,
        onCatalog: () => {},
      })
    );
    assert.strictEqual(html, readFixture("capabilitypanel-available.html"));
  });

  await t.test("unavailable cli", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(CapabilityPanel, {
        catalog: {
          schemaVersion: 1,
          probedAt: "2026-09-27T12:34:56.000Z",
          clis: [
            {
              cli: "codex",
              available: false,
              models: [],
              efforts: [],
              notes: ["command not found"],
            },
          ],
        },
        disabled: true,
        onCatalog: () => {},
      })
    );
    assert.strictEqual(html, readFixture("capabilitypanel-unavailable.html"));
  });
});

test("ScheduleForm markup matches fixtures", async (t) => {
  await t.test("cron mode with runOnStart", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ScheduleForm, {
        value: { cron: "0 */6 * * *", intervalMinutes: null, timezone: "Asia/Shanghai", runOnStart: true },
        onChange: () => {},
      })
    );
    assert.strictEqual(html, readFixture("scheduleform-cron.html"));
  });

  await t.test("interval mode", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ScheduleForm, {
        value: { cron: null, intervalMinutes: 120, timezone: null, runOnStart: false },
        onChange: () => {},
      })
    );
    assert.strictEqual(html, readFixture("scheduleform-interval.html"));
  });

  await t.test("none mode", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ScheduleForm, {
        value: { cron: null, intervalMinutes: null, timezone: null, runOnStart: false },
        onChange: () => {},
      })
    );
    assert.strictEqual(html, readFixture("scheduleform-none.html"));
  });
});

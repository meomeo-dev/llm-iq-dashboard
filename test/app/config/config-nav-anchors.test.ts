import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
(globalThis as unknown as { React: typeof React }).React = React;
import ReactDOMServer from "react-dom/server";
import { JSDOM } from "jsdom";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { CONFIG_NAV_ITEMS } from "@/app/config/config-nav-items";
import { CapabilityPanel } from "@/app/config/CapabilityPanel";
import { ConfigEditor } from "@/app/config/ConfigEditor";
import { DataRepoPanel } from "@/app/config/DataRepoPanel";
import { DevicePanel } from "@/app/config/DevicePanel";
import type { CapabilitySnapshot } from "@/capabilities/types";
import type { DataRepoStatus } from "@/core/sync/data-repo-panel-types";

const mockRouter = {
  back: () => {},
  forward: () => {},
  refresh: () => {},
  push: () => {},
  replace: () => {},
  prefetch: () => {},
};

function renderWithRouter(node: React.ReactElement): string {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(AppRouterContext.Provider, { value: mockRouter }, node)
  );
}

function createDummyCatalog(): CapabilitySnapshot {
  return {
    schemaVersion: 1,
    probedAt: "2026-09-27T12:00:00.000Z",
    clis: [
      {
        cli: "claude",
        available: true,
        models: [
          {
            id: "claude-3-5-sonnet",
            displayName: "Claude 3.5 Sonnet",
            cli: "claude",
            sources: ["probe"],
            efforts: ["high", "medium"],
            description: null,
          },
        ],
        efforts: ["high", "medium"],
        notes: [],
      },
    ],
  };
}

function createConfiguredRepoStatus(): DataRepoStatus {
  return {
    configured: true,
    deploy: { readonly: false, externalRunner: false },
    repo: {
      path: "../llm-iq-data",
      reachable: true,
      isGitRepo: true,
      clean: true,
      branch: "main",
      upstream: "origin/main",
      ahead: 0,
      behind: 0,
      aheadCommits: [],
    },
    manifest: {
      totalRuns: 10,
      updatedAt: "2026-09-27T08:00:00Z",
      latestDay: "2026-09-27",
    },
    ledger: {
      exported: 10,
      published: 10,
      lastExportedAt: "2026-09-27T08:00:00Z",
      lastPublishedAt: "2026-09-27T08:00:00Z",
    },
    local: { totalRuns: 10, pending: [], incomplete: 0 },
    lastAction: null,
    notice: null,
  };
}

function extractSectionIds(html: string): string[] {
  const dom = new JSDOM(html);
  const sections = Array.from(dom.window.document.querySelectorAll("section[id]"));
  return sections.map((s) => s.id);
}

test("ConfigNav 锚点存在性与唯一性特征测试", async (t) => {
  const catalog = createDummyCatalog();

  await t.test("CapabilityPanel 包含稳定的 capability 锚点", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(CapabilityPanel, {
        catalog,
        disabled: false,
        onCatalog: () => {},
      })
    );
    const ids = extractSectionIds(html);
    assert.deepStrictEqual(ids, ["capability"]);
  });

  await t.test("ConfigEditor 包含所有内嵌区块的独立无重锚点", () => {
    const html = renderWithRouter(
      React.createElement(ConfigEditor, {
        initialConfig: {
          schedule: {
            cron: "0 */6 * * *",
            intervalMinutes: null,
            timezone: "Asia/Shanghai",
            runOnStart: true,
          },
          run: {
            promptIds: ["pelican-v1"],
            concurrency: 1,
            defaultTimeoutMs: 600000,
            timeoutByCli: {},
            timeoutByEffort: {},
            rotation: { period: "day", timeZone: "Asia/Shanghai" },
            harnessGuard: { enabled: false, text: "" },
          },
          upstreamTypes: ["compatible"],
          profiles: [],
          targets: [],
          customPrompts: [],
          customModels: {},
          judge: { enabled: false, ai: { enabled: false, judges: [], timeoutMs: 300000, concurrency: 5 } },
          dataRepo: { path: "../llm-iq-data", repository: "", autoSync: false, push: false },
        },
        builtinPrompts: [],
        initialCatalog: catalog,
        initialCredentials: {},
      })
    );
    const ids = extractSectionIds(html);
    const expected = ["capability", "prompts", "harness-guard", "profiles", "matrix", "schedule", "timeout", "judge", "data-repo-settings"];
    assert.deepStrictEqual(ids, expected);
    assert.strictEqual(new Set(ids).size, ids.length, "区块 id 不得重复");
  });

  await t.test("DataRepoPanel 不可用分支带 id=\"data-repo\"", () => {
    const unconfiguredStatus: DataRepoStatus = {
      ...createConfiguredRepoStatus(),
      configured: false,
      repo: null,
    };
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(DataRepoPanel, {
        initialStatus: unconfiguredStatus,
        autoLoad: false,
      })
    );
    const ids = extractSectionIds(html);
    assert.deepStrictEqual(ids, ["data-repo"]);
  });

  await t.test("DataRepoPanel 正常可用分支带 id=\"data-repo\"", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(DataRepoPanel, {
        initialStatus: createConfiguredRepoStatus(),
        autoLoad: false,
      })
    );
    const ids = extractSectionIds(html);
    assert.deepStrictEqual(ids, ["data-repo"]);
  });

  await t.test("DevicePanel 包含 devices 锚点", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(DevicePanel, {
        pairCommand: "pnpm pair",
        initialView: {
          owner: true,
          device: { id: "d1", name: "MacBook Pro" },
          devices: [
            {
              id: "d1",
              name: "MacBook Pro",
              issuedAt: "2026-09-27T00:00:00Z",
              lastSeenAt: "2026-09-27T01:00:00Z",
              current: true,
            },
          ],
        },
      })
    );
    const ids = extractSectionIds(html);
    assert.deepStrictEqual(ids, ["devices"]);
  });

  await t.test("整页组件组合后，每个 CONFIG_NAV_ITEMS id 都作为 <section id> 出现且唯一", () => {
    const editorHtml = renderWithRouter(
      React.createElement(ConfigEditor, {
        initialConfig: {
          schedule: {
            cron: "0 */6 * * *",
            intervalMinutes: null,
            timezone: "Asia/Shanghai",
            runOnStart: true,
          },
          run: {
            promptIds: ["pelican-v1"],
            concurrency: 1,
            defaultTimeoutMs: 600000,
            timeoutByCli: {},
            timeoutByEffort: {},
            rotation: { period: "day", timeZone: "Asia/Shanghai" },
            harnessGuard: { enabled: false, text: "" },
          },
          upstreamTypes: ["compatible"],
          profiles: [],
          targets: [],
          customPrompts: [],
          customModels: {},
          judge: { enabled: false, ai: { enabled: false, judges: [], timeoutMs: 300000, concurrency: 5 } },
          dataRepo: null,
        },
        builtinPrompts: [],
        initialCatalog: catalog,
        initialCredentials: {},
      })
    );
    const dataRepoHtml = ReactDOMServer.renderToStaticMarkup(
      React.createElement(DataRepoPanel, {
        initialStatus: createConfiguredRepoStatus(),
        autoLoad: false,
      })
    );
    const deviceHtml = ReactDOMServer.renderToStaticMarkup(
      React.createElement(DevicePanel, {
        pairCommand: "pnpm pair",
        initialView: {
          owner: true,
          device: { id: "d1", name: "MacBook Pro" },
          devices: [],
        },
      })
    );

    const fullPageHtml = `${editorHtml}\n${dataRepoHtml}\n${deviceHtml}`;
    const allIds = extractSectionIds(fullPageHtml);

    const navIds = CONFIG_NAV_ITEMS.map((item) => item.id);
    assert.deepStrictEqual(allIds, navIds);
    assert.strictEqual(
      new Set(allIds).size,
      CONFIG_NAV_ITEMS.length,
      "整页所有区块 id 必须唯一"
    );
  });
});

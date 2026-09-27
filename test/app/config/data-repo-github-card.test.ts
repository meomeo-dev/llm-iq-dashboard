/**
 * DataRepoGithubCard 组件与推送按钮可用性推导单测。
 *
 * 覆盖：
 * 1. 四种 GitHub 连接状态（disconnected, app-created, connected, reconnect-required）的按钮与文案；
 * 2. 基于 pushCapability 推导推送按钮可用性与禁用原因说明。
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
(globalThis as unknown as { React: typeof React }).React = React;
import ReactDOMServer from "react-dom/server";
import { DataRepoGithubCard } from "@/app/config/DataRepoGithubCard";
import { derivePipeline } from "@/app/config/data-repo-pipeline-model";
import type { DataRepoStatus, GithubConnection } from "@/core/sync/data-repo-panel-types";

describe("DataRepoGithubCard 组件与推送能力推导", () => {
  describe("四种连接状态的卡片渲染", () => {
    it("状态 1：disconnected（未连接）", () => {
      const conn: GithubConnection = {
        state: "disconnected",
        login: null,
        appSlug: null,
        appSettingsUrl: null,
      };
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(DataRepoGithubCard, { github: conn }),
      );

      assert.ok(html.includes("未连接"));
      assert.ok(html.includes("未连接 GitHub App"));
      assert.ok(html.includes('href="/api/data-repo/github/connect"'));
      assert.ok(html.includes("连接 GitHub"));
    });

    it("状态 2：app-created（应用已创建待安装）", () => {
      const conn: GithubConnection = {
        state: "app-created",
        login: null,
        appSlug: "my-custom-app",
        appSettingsUrl: "https://github.com/settings/apps/my-custom-app",
      };
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(DataRepoGithubCard, { github: conn }),
      );

      assert.ok(html.includes("待安装"));
      assert.ok(html.includes("my-custom-app"));
      assert.ok(html.includes("继续安装到 llm-iq-data"));
      assert.ok(html.includes('href="/api/data-repo/github/connect"'));
    });

    it("状态 3：connected（已连接）", () => {
      const conn: GithubConnection = {
        state: "connected",
        login: "octocat",
        appSlug: "my-app",
        appSettingsUrl: "https://github.com/settings/apps/my-app",
      };
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(DataRepoGithubCard, { github: conn }),
      );

      assert.ok(html.includes("已连接"));
      assert.ok(html.includes("octocat"));
      assert.ok(html.includes("断开 GitHub"));
      assert.ok(html.includes("在 GitHub 上管理应用"));
      assert.ok(html.includes("https://github.com/settings/apps/my-app"));
    });

    it("状态 4：reconnect-required（需重新连接）", () => {
      const conn: GithubConnection = {
        state: "reconnect-required",
        login: "octocat",
        appSlug: "my-app",
        appSettingsUrl: "https://github.com/settings/apps/my-app",
      };
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(DataRepoGithubCard, { github: conn }),
      );

      assert.ok(html.includes("需重新连接"));
      assert.ok(html.includes("授权凭据已失效"));
      assert.ok(html.includes("octocat"));
      assert.ok(html.includes("重新连接"));
      assert.ok(html.includes('href="/api/data-repo/github/connect"'));
    });
  });

  describe("推送按钮可用性依据 pushCapability 推导", () => {
    function createMockStatus(overrides?: Partial<DataRepoStatus>): DataRepoStatus {
      return {
        configured: true,
        deploy: { readonly: false, externalRunner: true },
        repo: {
          path: "../llm-iq-data",
          reachable: true,
          isGitRepo: true,
          clean: true,
          branch: "main",
          upstream: "origin/main",
          ahead: 2,
          behind: 0,
          aheadCommits: ["c1a2b3c", "d4e5f6a"],
        },
        manifest: { totalRuns: 10, updatedAt: "2026-09-27", latestDay: "2026-09-27" },
        ledger: { exported: 10, published: 8, lastExportedAt: null, lastPublishedAt: null },
        local: { totalRuns: 10, pending: [], incomplete: 0 },
        lastAction: null,
        notice: null,
        github: { state: "disconnected", login: null, appSlug: null, appSettingsUrl: null },
        pushCapability: "unavailable",
        ...overrides,
      };
    }

    it("分容器部署下 pushCapability 为 unavailable 时，禁用推送并提示先连接 GitHub", () => {
      const status = createMockStatus({ pushCapability: "unavailable", github: undefined });
      const pipeline = derivePipeline(status);

      assert.equal(pipeline.primaryAction?.enabled, false);
      assert.equal(
        pipeline.primaryAction?.disabledReason,
        "执行器未连接 GitHub，请先在上方连接后再推送",
      );
    });

    it("当分容器部署且 GitHub 未连接时，提示先连接 GitHub 并给出链接", () => {
      const status = createMockStatus({
        pushCapability: "unavailable",
        github: {
          state: "disconnected",
          login: null,
          appSlug: null,
          appSettingsUrl: null,
        },
      });
      const pipeline = derivePipeline(status);

      assert.equal(pipeline.primaryAction?.enabled, false);
      assert.match(pipeline.primaryAction?.disabledReason ?? "", /执行器未连接 GitHub/);
      assert.equal(pipeline.primaryAction?.disabledLink, "#data-repo");
    });

    it("当 pushCapability 为 github-app 时，在分容器部署下放行推送", () => {
      const status = createMockStatus({
        pushCapability: "github-app",
        github: {
          state: "connected",
          login: "octocat",
          appSlug: "my-app",
          appSettingsUrl: null,
        },
      });
      const pipeline = derivePipeline(status);

      assert.equal(pipeline.primaryAction?.enabled, true);
      assert.equal(pipeline.primaryAction?.disabledReason, null);
    });

    it("当 pushCapability 为 host-credentials（单进程）时放行推送", () => {
      const status = createMockStatus({
        deploy: { readonly: false, externalRunner: false },
        pushCapability: "host-credentials",
      });
      const pipeline = derivePipeline(status);

      assert.equal(pipeline.primaryAction?.enabled, true);
      assert.equal(pipeline.primaryAction?.disabledReason, null);
    });

    it("当无领先提交时，即便具备 github-app 能力推送按钮也禁用并说明无需推送", () => {
      const status = createMockStatus({
        pushCapability: "github-app",
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
        ledger: {
          exported: 0,
          published: 8,
          lastExportedAt: null,
          lastPublishedAt: null,
        },
      });
      const pipeline = derivePipeline(status);

      assert.equal(pipeline.primaryAction, null);
    });
  });
});

/** 只读展台工具栏的源码仓库入口：地址与 package.json 一致，新标签页打开且不泄露来源页 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
(globalThis as unknown as { React: typeof React }).React = React;
import ReactDOMServer from "react-dom/server";
import packageJson from "../../../../package.json";
import { PROJECT_REPOSITORY_URL, RepositoryLink } from "@/app/components/toolbar/ToolbarIcons";

describe("RepositoryLink", () => {
  it("仓库地址与 package.json 的 repository、homepage 一致", () => {
    assert.equal(packageJson.repository.url, `${PROJECT_REPOSITORY_URL}.git`);
    assert.ok(packageJson.homepage.startsWith(PROJECT_REPOSITORY_URL));
  });

  it("新标签页打开，带 noopener noreferrer 与无障碍标签，内含 GitHub 标志", () => {
    const html = ReactDOMServer.renderToStaticMarkup(React.createElement(RepositoryLink));
    assert.match(html, new RegExp(`href="${PROJECT_REPOSITORY_URL}"`));
    assert.match(html, /target="_blank"/);
    assert.match(html, /rel="noopener noreferrer"/);
    assert.match(html, /aria-label="GitHub 仓库"/);
    assert.match(html, /<svg[^>]*aria-hidden="true"[^>]*>.*<path d="M6\.766 11\.328/);
  });
});

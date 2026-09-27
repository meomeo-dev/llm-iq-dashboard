/** /art/[runId]/[file] 路由测试：校验文件名登记校验、CSP 与 Cache-Control */

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { afterEach, beforeEach, describe, test } from "node:test";
import { GET } from "@/app/art/[runId]/[file]/route";

const FIXTURE_ROOT = join(process.cwd(), "test", "fixtures", "data-repo");
const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;

describe("/art/[runId]/[file] 路由", () => {
  beforeEach(() => {
    process.env.PELICAN_DATA_SOURCE = "remote";
    process.env.PELICAN_DATA_REPO_URL = "https://fixture.example.com";

    // 劫持 globalThis.fetch 读取本地测试夹具
    globalThis.fetch = async (input: string | URL | Request) => {
      const urlStr = typeof input === "string" ? input : input.toString();
      const url = new URL(urlStr);
      const relPath = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
      const localFilePath = join(FIXTURE_ROOT, relPath);

      try {
        const content = await readFile(localFilePath);
        return new Response(content, {
          status: 200,
          headers: {
            "content-type": localFilePath.endsWith(".json")
              ? "application/json"
              : "image/svg+xml",
          },
        });
      } catch {
        return new Response("Not Found", { status: 404 });
      }
    };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    globalThis.fetch = originalFetch;
  });

  test("remote 模式下返回 SVG，附 CSP 沙箱与可公开缓存头", async () => {
    const res = await GET(new Request("http://127.0.0.1:3000/art/20260927T021708Z/claude__model-b__high.svg"), {
      params: Promise.resolve({
        runId: "20260927T021708Z",
        file: "claude__model-b__high.svg",
      }),
    });

    assert.equal(res.status, 200);
    assert.equal(res.headers.get("content-type"), "image/svg+xml; charset=utf-8");
    assert.equal(res.headers.get("x-content-type-options"), "nosniff");
    assert.equal(res.headers.get("cache-control"), "public, max-age=86400, immutable");
    assert.match(res.headers.get("content-security-policy") ?? "", /sandbox/);

    const body = await res.text();
    assert.match(body, /<svg/);
    assert.match(body, /<circle/);
  });

  test("未在 run.json 中登记的文件名返回 404", async () => {
    const res = await GET(new Request("http://127.0.0.1:3000/art/20260927T021708Z/unknown.svg"), {
      params: Promise.resolve({
        runId: "20260927T021708Z",
        file: "unknown.svg",
      }),
    });

    assert.equal(res.status, 404);
  });

  test("被脱敏拦下的作品在 run.json 中 svgFile 为 null，请求原文件名返回 404", async () => {
    const res = await GET(new Request("http://127.0.0.1:3000/art/20260927T021708Z/codex__model-c__high.svg"), {
      params: Promise.resolve({
        runId: "20260927T021708Z",
        file: "codex__model-c__high.svg",
      }),
    });

    assert.equal(res.status, 404);
  });
});

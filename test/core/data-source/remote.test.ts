/** 远程数据源实现测试：基于 test/fixtures/data-repo 夹具与注入的假 fetch */

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, test } from "node:test";
import { RemoteDataSource, type FetchFn } from "@/core/data-source/remote";

const FIXTURE_ROOT = join(process.cwd(), "test", "fixtures", "data-repo");

/** 创建一个从本地 fixture 目录读取的假 fetch 函数 */
function createFixtureFetch(): FetchFn {
  return async (input: string | URL | Request) => {
    const urlStr = typeof input === "string" ? input : input.toString();
    const url = new URL(urlStr);
    const repoBase = new URL("https://example.com/repo");
    const relPath = decodeURIComponent(
      url.pathname.startsWith(repoBase.pathname)
        ? url.pathname.slice(repoBase.pathname.length).replace(/^\/+/, "")
        : url.pathname.replace(/^\/+/, ""),
    );
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
}

describe("RemoteDataSource 远程数据源", () => {
  const fetchFn = createFixtureFetch();
  const ds = new RemoteDataSource({
    repoUrl: "https://example.com/repo",
    fetchFn,
  });

  test("listRunStarts 获取全部轮次开始时刻，新的在前", async () => {
    const starts = await ds.listRunStarts();
    assert.deepEqual(starts, [
      "2026-09-27T02:17:08.000Z",
      "2026-09-26T12:00:00.000Z",
    ]);
  });

  test("loadCardsBetween 构造卡片与成本，且脱敏作品不当作失败", async () => {
    const from = new Date("2026-09-27T00:00:00.000Z");
    const to = new Date("2026-09-27T23:59:59.000Z");
    const cards = await ds.loadCardsBetween(from, to);

    assert.equal(cards.length, 2);

    // 正常作品
    const normal = cards.find((c) => c.targetId === "claude__model-b__high");
    assert.ok(normal);
    assert.equal(normal.status, "ok");
    assert.equal(normal.svgFile, "claude__model-b__high.svg");
    assert.equal(normal.error, null);

    // 脱敏作品：svgFile 为 null，status 保持 ok（不当作失败），error 显示脱敏状态
    const redacted = cards.find((c) => c.targetId === "codex__model-c__high");
    assert.ok(redacted);
    assert.equal(redacted.status, "ok");
    assert.equal(redacted.svgFile, null);
    assert.match(redacted.error ?? "", /已脱敏，未发布/);
    assert.match(redacted.error ?? "", /local-path/);
  });

  test("loadCard 与 loadArt 严格执行文件名登记校验", async () => {
    // 登记过的正常作品可读取
    const art = await ds.loadArt("20260927T021708Z", "claude__model-b__high.svg");
    assert.ok(art);
    assert.equal(art.card.targetId, "claude__model-b__high");
    assert.match(art.svg ?? "", /<svg/);

    // 未在 run.json 里登记的文件名拒绝读取，返回 null
    const unreg = await ds.loadArt("20260927T021708Z", "secret.svg");
    assert.equal(unreg, null);

    // 穿越路径拒绝读取
    const traversal = await ds.loadArt("20260927T021708Z", "../../index.json");
    assert.equal(traversal, null);

    // 被脱敏拦下的作品文件名在 run.json 中 svgFile 为 null，拒绝读取返回 null
    const redactedArt = await ds.loadArt("20260927T021708Z", "codex__model-c__high.svg");
    assert.equal(redactedArt, null);
  });

  test("网络或格式错误降级为空结果并在页面给出中文提示，不让页面崩溃", async () => {
    const failingFetch: FetchFn = async () => {
      throw new Error("Connection timeout");
    };
    const failingDs = new RemoteDataSource({
      repoUrl: "https://timeout.example.com",
      fetchFn: failingFetch,
    });

    const cards = await failingDs.loadCardsBetween(
      new Date("2026-09-27T00:00:00Z"),
      new Date("2026-09-27T23:59:59Z"),
    );
    assert.deepEqual(cards, []);
    assert.match(failingDs.getNotice() ?? "", /远程数据源拉取失败/);
    assert.match(failingDs.getNotice() ?? "", /Connection timeout/);
  });

  test("schemaVersion 不认识时明确报错提示", async () => {
    const unknownSchemaFetch: FetchFn = async () => {
      return new Response(
        JSON.stringify({
          schemaVersion: 999,
          name: "bad-repo",
          days: [],
        }),
        { status: 200 },
      );
    };
    const badSchemaDs = new RemoteDataSource({
      repoUrl: "https://bad-schema.example.com",
      fetchFn: unknownSchemaFetch,
    });

    const starts = await badSchemaDs.listRunStarts();
    assert.deepEqual(starts, []);
    assert.match(badSchemaDs.getNotice() ?? "", /不支持的数据仓版本/);
    assert.match(badSchemaDs.getNotice() ?? "", /999/);
  });
});

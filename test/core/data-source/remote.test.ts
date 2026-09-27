/** 远程数据源实现测试：基于 test/fixtures/data-repo 夹具与注入的假 fetch */

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, test } from "node:test";
import { RemoteDataSource, sanitizeErrorReason, type FetchFn } from "@/core/data-source/remote";

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

  test("同一请求周期内相同 URL 只取一次（去重缓存）", async () => {
    let callCount = 0;
    const baseFetch = createFixtureFetch();
    const trackingFetch: FetchFn = async (input, init) => {
      callCount++;
      return baseFetch(input, init);
    };

    const cachedDs = new RemoteDataSource({
      repoUrl: "https://example.com/repo",
      fetchFn: trackingFetch,
    });

    // 连续两次读取相同的卡片范围
    const from = new Date("2026-09-27T00:00:00.000Z");
    const to = new Date("2026-09-27T23:59:59.000Z");
    const first = await cachedDs.loadCardsBetween(from, to);
    const firstCallCount = callCount;
    const second = await cachedDs.loadCardsBetween(from, to);

    assert.equal(first.length, second.length);
    // 第二次读取由于命中 URL 缓存，不应产生新的 fetch 调用
    assert.equal(callCount, firstCallCount);
  });

  test("有界并发：并发请求数不超过配置上限", async () => {
    let activeRequests = 0;
    let maxSeenActive = 0;
    const concurrency = 2;

    const slowFetch: FetchFn = async () => {
      activeRequests++;
      maxSeenActive = Math.max(maxSeenActive, activeRequests);
      await new Promise((r) => setTimeout(r, 20));
      activeRequests--;
      return new Response(JSON.stringify({ schemaVersion: 1, days: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };

    const poolDs = new RemoteDataSource({
      repoUrl: "https://concurrency.example.com",
      fetchFn: slowFetch,
      concurrency,
    });

    // 同时发起多个请求
    await Promise.all([
      poolDs.listRunStarts(),
      poolDs.loadCardsBetween(new Date(0), new Date()),
      poolDs.checkHealth(),
    ]);

    assert.ok(maxSeenActive <= concurrency, `最大并发数 ${maxSeenActive} 超出上限 ${concurrency}`);
  });

  test("单请求超时：超时中止并优雅处理", async () => {
    const slowFetch: FetchFn = async (_input, init) => {
      return new Promise<Response>((resolve, reject) => {
        const timer = setTimeout(() => {
          resolve(new Response(JSON.stringify({ schemaVersion: 1, days: [] })));
        }, 500);
        if (init?.signal?.aborted) {
          clearTimeout(timer);
          reject(new Error("Request timed out via abort"));
          return;
        }
        init?.signal?.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new Error("Request timed out via abort"));
        });
      });
    };

    const timeoutDs = new RemoteDataSource({
      repoUrl: "https://timeout-test.example.com",
      fetchFn: slowFetch,
      timeoutMs: 20,
    });

    const starts = await timeoutDs.listRunStarts();
    assert.deepEqual(starts, []);
    assert.match(timeoutDs.getNotice() ?? "", /timed out|超时|拉取失败/i);
  });

  test("单个 run.json 404 只影响该轮，提示部分轮次加载失败且不整页崩溃", async () => {
    const baseFetch = createFixtureFetch();
    const partial404Fetch: FetchFn = async (input, init) => {
      const urlStr = typeof input === "string" ? input : input.toString();
      // 让 09/27 的 run.json 404，但 09/26 的 run.json 正常
      if (urlStr.includes("20260927T021708Z/run.json")) {
        return new Response("Run Record Not Found", { status: 404 });
      }
      return baseFetch(input, init);
    };

    const partialDs = new RemoteDataSource({
      repoUrl: "https://example.com/repo",
      fetchFn: partial404Fetch,
    });

    // 跨两天的窗口：覆盖 09/26 和 09/27
    const from = new Date("2026-09-26T00:00:00.000Z");
    const to = new Date("2026-09-27T23:59:59.000Z");
    const cards = await partialDs.loadCardsBetween(from, to);

    // 09/26 的轮次成功加载（有一张卡片），09/27 的失败
    assert.ok(cards.length > 0, "应当成功返回未失败轮次的卡片");
    assert.equal(partialDs.getNotice(), "部分轮次加载失败");
  });

  test("单个 run.json 为坏 JSON 只影响该轮，提示部分轮次加载失败", async () => {
    const baseFetch = createFixtureFetch();
    const badJsonFetch: FetchFn = async (input, init) => {
      const urlStr = typeof input === "string" ? input : input.toString();
      if (urlStr.includes("20260927T021708Z/run.json")) {
        return new Response("Not valid json {{{", {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }
      return baseFetch(input, init);
    };

    const badJsonDs = new RemoteDataSource({
      repoUrl: "https://example.com/repo",
      fetchFn: badJsonFetch,
    });

    const from = new Date("2026-09-26T00:00:00.000Z");
    const to = new Date("2026-09-27T23:59:59.000Z");
    const cards = await badJsonDs.loadCardsBetween(from, to);

    assert.ok(cards.length > 0);
    assert.equal(badJsonDs.getNotice(), "部分轮次加载失败");
  });

  test("健康检查 checkHealth：正常可达与不可达均返回完整契约且不泄露路径", async () => {
    // 1. 正常可达
    const health = await ds.checkHealth();
    assert.equal(health.reachable, true);
    assert.equal(health.schemaVersion, 1);
    assert.equal(health.totalRuns, 2);
    assert.equal(health.latestDay, "2026-09-27");
    assert.equal(health.reason, undefined);

    // 2. 不可达时给出中文原因，且绝不泄露本机绝对路径
    const failingFetch: FetchFn = async () => {
      throw new Error("connect ECONNREFUSED at /Users/secret-user/repo/data");
    };
    const failingHealthDs = new RemoteDataSource({
      repoUrl: "https://failing.example.com",
      fetchFn: failingFetch,
    });

    const failingHealth = await failingHealthDs.checkHealth();
    assert.equal(failingHealth.reachable, false);
    assert.equal(failingHealth.schemaVersion, null);
    assert.equal(failingHealth.totalRuns, null);
    assert.equal(failingHealth.latestDay, null);
    assert.match(failingHealth.reason ?? "", /远程数据源不可达/);
    assert.ok(!failingHealth.reason?.includes("/Users/secret-user"));

    // 3. sanitizeErrorReason 工具函数单测
    const sanitized = sanitizeErrorReason(new Error("Crash at /home/admin/secret"));
    assert.ok(!sanitized.includes("/home/admin"));
    assert.match(sanitized, /REDACTED_PATH/);
  });
});

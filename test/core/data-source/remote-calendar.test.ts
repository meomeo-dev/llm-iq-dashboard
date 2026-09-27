/**
 * 远程数据源日历拉取上界与按需合成测试（remote-calendar）。
 * 覆盖：
 * 1. 注入假 fetch，统计日索引请求数 ≤ 62；
 * 2. 远期日期（≥62 天）不发日索引请求，按清单 runs 计数合成 UTC 正午时刻；
 * 3. 近期日期（<62 天）拉取日索引得到精确时刻；
 * 4. 单日索引拉取失败时回退到清单计数合成，而不是丢弃；
 * 5. 返回结果保持新的在前（降序）。
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CALENDAR_DETAIL_DAYS,
  RemoteDataSource,
  type FetchFn,
} from "@/core/data-source/remote";
import type { DataRepoManifest, DayIndex } from "@/core/data-repo/contract";

describe("remote-calendar 远程日历拉取上界与计数合成", () => {
  const refDate = new Date("2026-09-27T12:00:00.000Z");

  function createDateString(daysAgo: number): string {
    const t = new Date(refDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return t.toISOString().slice(0, 10);
  }

  it("日索引请求数 ≤ 62，远期按清单合成，近期按精确时刻，新的在前", async () => {
    // 构造一个包含 100 天的 manifest（从 0 天前到 99 天前）
    const totalDays = 100;
    const manifestDays = Array.from({ length: totalDays }, (_, i) => {
      const dateStr = createDateString(i);
      const [y, m, d] = dateStr.split("-");
      return {
        date: dateStr,
        runs: 2,
        path: `runs/${y}/${m}/${d}`,
      };
    });

    const manifest: DataRepoManifest = {
      schemaVersion: 1,
      name: "test-repo",
      description: "test",
      repository: "https://example.com/repo",
      updatedAt: "2026-09-27T12:00:00.000Z",
      totalRuns: totalDays * 2,
      days: manifestDays,
    };

    const requestedUrls: string[] = [];
    const fakeFetch: FetchFn = async (input) => {
      const url = typeof input === "string" ? input : input.toString();
      requestedUrls.push(url);

      if (url.endsWith("index.json") && !url.includes("runs/")) {
        return new Response(JSON.stringify(manifest), { status: 200 });
      }

      // 日索引请求
      const match = url.match(/runs\/(\d{4})\/(\d{2})\/(\d{2})\/index\.json$/);
      if (match) {
        const date = `${match[1]}-${match[2]}-${match[3]}`;
        const dayIndex: DayIndex = {
          schemaVersion: 1,
          date,
          runs: [
            {
              runId: `${match[1]}${match[2]}${match[3]}T080000Z`,
              startedAt: `${date}T08:00:00.000Z`,
              finishedAt: `${date}T08:05:00.000Z`,
              trigger: "schedule",
              promptIds: ["p1"],
              attempts: 1,
              ok: 1,
              path: `runs/${match[1]}/${match[2]}/${match[3]}/${match[1]}${match[2]}${match[3]}T080000Z`,
            },
            {
              runId: `${match[1]}${match[2]}${match[3]}T160000Z`,
              startedAt: `${date}T16:00:00.000Z`,
              finishedAt: `${date}T16:05:00.000Z`,
              trigger: "schedule",
              promptIds: ["p1"],
              attempts: 1,
              ok: 1,
              path: `runs/${match[1]}/${match[2]}/${match[3]}/${match[1]}${match[2]}${match[3]}T160000Z`,
            },
          ],
        };
        return new Response(JSON.stringify(dayIndex), { status: 200 });
      }

      return new Response("Not found", { status: 404 });
    };

    const ds = new RemoteDataSource({
      repoUrl: "https://example.com/repo",
      fetchFn: fakeFetch,
    });

    const starts = await ds.listRunStarts(refDate);

    // 统计日索引请求数
    const dayIndexRequests = requestedUrls.filter((u) => u.includes("runs/"));
    assert.equal(dayIndexRequests.length, CALENDAR_DETAIL_DAYS);
    assert.ok(dayIndexRequests.length <= 62);

    // 总轮次数应等于 100 * 2 = 200
    assert.equal(starts.length, 200);

    // 近期（0 天前，2026-09-27）：应为精确时刻 08:00:00 与 16:00:00
    const todayStarts = starts.filter((s) => s.startsWith("2026-09-27"));
    assert.deepEqual(todayStarts, [
      "2026-09-27T16:00:00.000Z",
      "2026-09-27T08:00:00.000Z",
    ]);

    // 远期（70 天前）：应为合成的 UTC 正午时刻 12:00:00
    const day70Str = createDateString(70);
    const day70Starts = starts.filter((s) => s.startsWith(day70Str));
    assert.deepEqual(day70Starts, [
      `${day70Str}T12:00:00.000Z`,
      `${day70Str}T12:00:00.000Z`,
    ]);

    // 返回列表保持新的在前（降序）
    for (let i = 0; i < starts.length - 1; i++) {
      assert.ok(starts[i]! >= starts[i + 1]!, `时刻未按降序排列: ${starts[i]} < ${starts[i + 1]}`);
    }
  });

  it("单个日索引拉取失败时回退到清单计数合成，而不是丢弃", async () => {
    const todayStr = "2026-09-27";
    const yesterdayStr = "2026-09-26";

    const manifest: DataRepoManifest = {
      schemaVersion: 1,
      name: "test-repo",
      description: "test",
      repository: "https://example.com/repo",
      updatedAt: "2026-09-27T12:00:00.000Z",
      totalRuns: 4,
      days: [
        { date: todayStr, runs: 2, path: "runs/2026/09/27" },
        { date: yesterdayStr, runs: 2, path: "runs/2026/09/26" },
      ],
    };

    const fakeFetch: FetchFn = async (input) => {
      const url = typeof input === "string" ? input : input.toString();

      if (url.endsWith("index.json") && !url.includes("runs/")) {
        return new Response(JSON.stringify(manifest), { status: 200 });
      }

      // 今日成功
      if (url.includes("runs/2026/09/27/index.json")) {
        const dayIndex: DayIndex = {
          schemaVersion: 1,
          date: todayStr,
          runs: [
            {
              runId: "20260927T080000Z",
              startedAt: "2026-09-27T08:00:00.000Z",
              finishedAt: "2026-09-27T08:05:00.000Z",
              trigger: "schedule",
              promptIds: ["p1"],
              attempts: 1,
              ok: 1,
              path: "runs/2026/09/27/20260927T080000Z",
            },
            {
              runId: "20260927T160000Z",
              startedAt: "2026-09-27T16:00:00.000Z",
              finishedAt: "2026-09-27T16:05:00.000Z",
              trigger: "schedule",
              promptIds: ["p1"],
              attempts: 1,
              ok: 1,
              path: "runs/2026/09/27/20260927T160000Z",
            },
          ],
        };
        return new Response(JSON.stringify(dayIndex), { status: 200 });
      }

      // 昨日日索引模拟网络错误或 500 异常
      if (url.includes("runs/2026/09/26/index.json")) {
        return new Response("Internal Server Error", { status: 500 });
      }

      return new Response("Not found", { status: 404 });
    };

    const ds = new RemoteDataSource({
      repoUrl: "https://example.com/repo",
      fetchFn: fakeFetch,
    });

    const starts = await ds.listRunStarts(refDate);

    // 依然应包含 4 轮，昨日失败的 2 轮通过合成得到，不丢失
    assert.equal(starts.length, 4);

    // 今日为精确时刻
    assert.ok(starts.includes("2026-09-27T16:00:00.000Z"));
    assert.ok(starts.includes("2026-09-27T08:00:00.000Z"));

    // 昨日为合成的 UTC 正午时刻
    const yesterdayStarts = starts.filter((s) => s.startsWith(yesterdayStr));
    assert.equal(yesterdayStarts.length, 2);
    assert.deepEqual(yesterdayStarts, [
      `${yesterdayStr}T12:00:00.000Z`,
      `${yesterdayStr}T12:00:00.000Z`,
    ]);
  });

  it("未来日期（diffDays < 0）不拉取日索引，按清单合成", async () => {
    // 假设 refDate 为 2026-09-27，清单中包含 2026-09-28（明日，未来日期）
    const futureDateStr = "2026-09-28";
    const manifest: DataRepoManifest = {
      schemaVersion: 1,
      name: "test-repo",
      description: "test",
      repository: "https://example.com/repo",
      updatedAt: "2026-09-27T12:00:00.000Z",
      totalRuns: 2,
      days: [{ date: futureDateStr, runs: 2, path: "runs/2026/09/28" }],
    };

    const requestedUrls: string[] = [];
    const fakeFetch: FetchFn = async (input) => {
      const url = typeof input === "string" ? input : input.toString();
      requestedUrls.push(url);
      if (url.endsWith("index.json") && !url.includes("runs/")) {
        return new Response(JSON.stringify(manifest), { status: 200 });
      }
      return new Response("Not found", { status: 404 });
    };

    const ds = new RemoteDataSource({
      repoUrl: "https://example.com/repo",
      fetchFn: fakeFetch,
    });

    const starts = await ds.listRunStarts(refDate);

    // 日索引请求数应为 0（未来日期不发日索引请求）
    const dayIndexRequests = requestedUrls.filter((u) => u.includes("runs/"));
    assert.equal(dayIndexRequests.length, 0);

    // 时刻应按清单合成 UTC 正午时刻
    assert.deepEqual(starts, [
      `${futureDateStr}T12:00:00.000Z`,
      `${futureDateStr}T12:00:00.000Z`,
    ]);
  });
});

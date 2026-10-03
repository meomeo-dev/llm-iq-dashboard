/**
 * 远程拉取池的缓存时效：时效内同 URL 只发一次，进行中的请求合并，过期后重新拉取，失败不留缓存。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_CACHE_TTL_MS, FetchPool } from "@/core/data-source/fetch-pool";

function makeClock(start = 1_000_000) {
  let now = start;
  return { now: () => now, advance: (ms: number) => { now += ms; } };
}

test("时效内同 URL 只发一次真实请求；过期后重新拉取并拿到新内容", async () => {
  const clock = makeClock();
  const pool = new FetchPool({ now: clock.now });
  let calls = 0;
  const execute = async () => new Response(`v${++calls}`);

  assert.equal(await (await pool.fetch("u", execute, 60_000)).text(), "v1");
  clock.advance(59_000);
  assert.equal(await (await pool.fetch("u", execute, 60_000)).text(), "v1");
  assert.equal(calls, 1);

  clock.advance(2_000);
  assert.equal(await (await pool.fetch("u", execute, 60_000)).text(), "v2");
  assert.equal(calls, 2);
});

test("进行中的同 URL 请求被合并，不受时效影响", async () => {
  const clock = makeClock();
  const pool = new FetchPool({ now: clock.now });
  let calls = 0;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const execute = async () => { calls++; await gate; return new Response("slow"); };

  const first = pool.fetch("u", execute, 1);
  clock.advance(10);
  const second = pool.fetch("u", execute, 1);
  release();
  assert.deepEqual(await Promise.all([first, second].map(async (p) => (await p).text())), ["slow", "slow"]);
  assert.equal(calls, 1);
});

test("请求失败不留缓存，下一次重试；缺省时效为 60 秒", async () => {
  const clock = makeClock();
  const pool = new FetchPool({ now: clock.now });
  let calls = 0;
  const execute = async () => {
    calls++;
    if (calls === 1) throw new Error("network");
    return new Response("ok");
  };
  await assert.rejects(() => pool.fetch("u", execute), /network/);
  assert.equal(await (await pool.fetch("u", execute)).text(), "ok");
  clock.advance(DEFAULT_CACHE_TTL_MS - 1);
  await pool.fetch("u", execute);
  assert.equal(calls, 2);
  clock.advance(2);
  await pool.fetch("u", execute);
  assert.equal(calls, 3);
});

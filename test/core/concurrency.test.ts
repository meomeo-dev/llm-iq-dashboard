/** 并发原语：定长并发池与计数信号量（裁判并行度按它分配） */

import assert from "node:assert/strict";
import { test } from "node:test";
import { createKeyedSemaphores, createSemaphore, mapWithConcurrency } from "@/core/concurrency";

const tick = (): Promise<void> => new Promise((resolve) => setImmediate(resolve));

test("信号量：同时最多 limit 个持有者，满了按先来后到排队，释放后交给排队最久的", async () => {
  const semaphore = createSemaphore(2);
  const order: string[] = [];
  const first = await semaphore.acquire();
  const second = await semaphore.acquire();
  let thirdGranted = false;
  const third = semaphore.acquire().then((release) => { thirdGranted = true; order.push("third"); return release; });
  const fourth = semaphore.acquire().then((release) => { order.push("fourth"); return release; });
  await tick();
  assert.equal(thirdGranted, false, "两个槽都占着时第三个要等");
  first();
  const releaseThird = await third;
  assert.deepEqual(order, ["third"]);
  second();
  const releaseFourth = await fourth;
  assert.deepEqual(order, ["third", "fourth"]);
  releaseThird();
  releaseFourth();
});

test("信号量：释放函数重复调用不会多放出槽位", async () => {
  const semaphore = createSemaphore(1);
  const release = await semaphore.acquire();
  release();
  release();
  const again = await semaphore.acquire();
  let extraGranted = false;
  void semaphore.acquire().then(() => { extraGranted = true; });
  await tick();
  assert.equal(extraGranted, false);
  again();
});

test("按键分配的信号量：不同裁判各算各的槽位，同一裁判共享", async () => {
  const slotsOf = createKeyedSemaphores(1);
  const releaseA = await slotsOf("agy/gemini@high").acquire();
  const releaseB = await slotsOf("claude/sonnet@high").acquire();
  let secondA = false;
  void slotsOf("agy/gemini@high").acquire().then((release) => { secondA = true; release(); });
  await tick();
  assert.equal(secondA, false, "同一裁判的第二件要等");
  releaseB();
  await tick();
  assert.equal(secondA, false, "别的裁判释放不影响这个裁判");
  releaseA();
  await tick();
  assert.equal(secondA, true);
});

test("并发池：同时在跑的任务不超过 limit，结果按输入顺序", async () => {
  let inFlight = 0;
  let peak = 0;
  const results = await mapWithConcurrency([30, 10, 20, 5], 2, async (delay) => {
    inFlight += 1;
    peak = Math.max(peak, inFlight);
    await new Promise((resolve) => setTimeout(resolve, delay));
    inFlight -= 1;
    return delay * 2;
  });
  assert.deepEqual(results, [60, 20, 40, 10]);
  assert.equal(peak, 2);
});

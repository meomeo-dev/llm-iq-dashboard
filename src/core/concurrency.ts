/** 定长并发池：最多同时运行 limit 个任务，结果按输入顺序返回 */

export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  const workerCount = Math.max(1, Math.min(limit, items.length));
  let cursor = 0;

  // 各 worker 循环领取下一个下标，慢任务不阻塞其余任务
  const workers = Array.from({ length: workerCount }, async () => {
    for (;;) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index] as T, index);
    }
  });

  await Promise.all(workers);
  return results;
}

/** 计数信号量：acquire 拿到槽位后返回释放函数；没有空槽时按先来后到排队 */
export interface Semaphore {
  acquire: () => Promise<() => void>;
}

export function createSemaphore(limit: number): Semaphore {
  const capacity = Math.max(1, Math.floor(limit));
  let inUse = 0;
  const waiting: Array<() => void> = [];
  const release = (): void => {
    const next = waiting.shift();
    // 槽位直接交给排队最久的等待者，inUse 不变
    if (next !== undefined) next();
    else inUse -= 1;
  };
  return {
    acquire: () =>
      new Promise<() => void>((resolve) => {
        const grant = (): void => resolve(onceOnly(release));
        if (inUse < capacity) {
          inUse += 1;
          grant();
        } else {
          waiting.push(grant);
        }
      }),
  };
}

/** 按键各开一个信号量，首次用到某个键时创建；同一键共享同一份槽位 */
export function createKeyedSemaphores(limitPerKey: number): (key: string) => Semaphore {
  const pools = new Map<string, Semaphore>();
  return (key) => {
    const existing = pools.get(key);
    if (existing !== undefined) return existing;
    const created = createSemaphore(limitPerKey);
    pools.set(key, created);
    return created;
  };
}

/** 释放函数只许生效一次，重复调用不会多放一个槽 */
function onceOnly(release: () => void): () => void {
  let done = false;
  return () => {
    if (done) return;
    done = true;
    release();
  };
}

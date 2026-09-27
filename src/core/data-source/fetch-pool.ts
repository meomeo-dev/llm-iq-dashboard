/**
 * 远程数据拉取的并发与缓存控制。
 *
 * 提供有界并发（默认最多 6 个并发连接）与请求级去重缓存，
 * 防止对数据仓高频突发请求导致网络拥塞或速率受限。
 */

export interface FetchPoolOptions {
  /** 最大并发请求数，缺省为 6 */
  concurrency?: number;
}

interface CachedResponse {
  status: number;
  statusText: string;
  headers: [string, string][];
  body: Uint8Array;
}

export class FetchPool {
  private readonly concurrency: number;
  private running = 0;
  private readonly queue: (() => void)[] = [];
  private readonly cache = new Map<string, Promise<CachedResponse>>();

  constructor(options?: FetchPoolOptions) {
    this.concurrency = options?.concurrency ?? 6;
  }

  /**
   * 通过并发池执行 fetch，同一 URL 在缓存有效期间只发一次真实请求。
   * 请求失败时自动移出缓存，允许后续重试。
   */
  async fetch(
    url: string,
    execute: () => Promise<Response>,
  ): Promise<Response> {
    const existing = this.cache.get(url);
    if (existing !== undefined) {
      const cached = await existing;
      return toResponse(cached);
    }

    const task = this.schedule(async () => {
      const rawRes = await execute();
      const status = rawRes.status;
      const statusText = rawRes.statusText;
      const headers: [string, string][] = [];
      rawRes.headers.forEach((val, key) => headers.push([key, val]));
      const arrayBuf = await rawRes.arrayBuffer();
      return {
        status,
        statusText,
        headers,
        body: new Uint8Array(arrayBuf),
      };
    }).catch((err) => {
      this.cache.delete(url);
      throw err;
    });

    this.cache.set(url, task);
    const cached = await task;
    return toResponse(cached);
  }

  /** 清空请求缓存（测试或重置时使用） */
  clearCache(): void {
    this.cache.clear();
  }

  /** 当前正在执行的请求数 */
  get activeCount(): number {
    return this.running;
  }

  /** 当前排队等待的请求数 */
  get pendingCount(): number {
    return this.queue.length;
  }

  private async schedule<T>(task: () => Promise<T>): Promise<T> {
    if (this.running >= this.concurrency) {
      await new Promise<void>((resolve) => this.queue.push(resolve));
    }
    this.running++;
    try {
      return await task();
    } finally {
      this.running--;
      const next = this.queue.shift();
      if (next !== undefined) {
        next();
      }
    }
  }
}

function toResponse(cached: CachedResponse): Response {
  return new Response(Buffer.from(cached.body), {
    status: cached.status,
    statusText: cached.statusText,
    headers: new Headers(cached.headers),
  });
}

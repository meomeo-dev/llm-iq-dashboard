/**
 * 远程数据拉取的并发与缓存控制。
 *
 * 提供有界并发（默认最多 6 个并发连接）与带时效的请求级缓存：同一 URL 在时效内只发一次真实请求，
 * 进行中的请求被后来者合并；过期后再次拉取。时效由调用方按资源给（日索引、记录 60 秒，作品一天），
 * 与交给 fetch 的 revalidate 同一口径——缓存常驻在进程里，没有时效的话 serverless 实例一旦暖起来
 * 就永远看不到数据仓的新提交。
 */

export interface FetchPoolOptions {
  /** 最大并发请求数，缺省为 6 */
  concurrency?: number;
  /** 取当前时刻（毫秒），测试里用来推进时间 */
  now?: () => number;
}

/** 调用方没给时效时的缺省：与 JSON 资源的 revalidate 一致 */
export const DEFAULT_CACHE_TTL_MS = 60_000;

interface CachedResponse {
  status: number;
  statusText: string;
  headers: [string, string][];
  body: Uint8Array;
}

/** 进行中的条目 expiresAt 为无穷大，让并发的同 URL 请求合并；落定后才按时效计 */
interface CacheEntry {
  task: Promise<CachedResponse>;
  expiresAt: number;
}

export class FetchPool {
  private readonly concurrency: number;
  private readonly now: () => number;
  private running = 0;
  private readonly queue: (() => void)[] = [];
  private readonly cache = new Map<string, CacheEntry>();

  constructor(options?: FetchPoolOptions) {
    this.concurrency = options?.concurrency ?? 6;
    this.now = options?.now ?? Date.now;
  }

  /**
   * 通过并发池执行 fetch，同一 URL 在 ttlMs 内只发一次真实请求，过期后重新拉取。
   * 请求失败时自动移出缓存，允许后续重试。
   */
  async fetch(
    url: string,
    execute: () => Promise<Response>,
    ttlMs: number = DEFAULT_CACHE_TTL_MS,
  ): Promise<Response> {
    const existing = this.cache.get(url);
    if (existing !== undefined && this.now() < existing.expiresAt) {
      return toResponse(await existing.task);
    }

    const entry: CacheEntry = { task: Promise.resolve(EMPTY_RESPONSE), expiresAt: Number.POSITIVE_INFINITY };
    entry.task = this.schedule(() => readResponse(execute))
      .then((cached) => {
        entry.expiresAt = this.now() + ttlMs;
        return cached;
      })
      .catch((err: unknown) => {
        if (this.cache.get(url) === entry) this.cache.delete(url);
        throw err;
      });

    this.cache.set(url, entry);
    return toResponse(await entry.task);
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

const EMPTY_RESPONSE: CachedResponse = { status: 0, statusText: "", headers: [], body: new Uint8Array() };

/** 把真实响应整体读进内存，缓存条目才能被多次转成 Response */
async function readResponse(execute: () => Promise<Response>): Promise<CachedResponse> {
  const rawRes = await execute();
  const headers: [string, string][] = [];
  rawRes.headers.forEach((val, key) => headers.push([key, val]));
  const arrayBuf = await rawRes.arrayBuffer();
  return { status: rawRes.status, statusText: rawRes.statusText, headers, body: new Uint8Array(arrayBuf) };
}

function toResponse(cached: CachedResponse): Response {
  return new Response(Buffer.from(cached.body), {
    status: cached.status,
    statusText: cached.statusText,
    headers: new Headers(cached.headers),
  });
}

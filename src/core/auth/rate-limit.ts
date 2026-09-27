/**
 * 进程内滑动窗口限流：按键（来源 IP 或设备）计数，窗口内超过上限即拒绝。
 * 单进程看板不需要跨进程共享；重启即清零，可接受。
 */

export interface RateLimiter {
  /** 记一次并返回是否放行 */
  take(key: string, now?: Date): boolean;
}

export function createRateLimiter(limit: number, windowMs: number): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    take(key: string, now: Date = new Date()): boolean {
      const since = now.getTime() - windowMs;
      const recent = (hits.get(key) ?? []).filter((at) => at > since);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now.getTime());
      hits.set(key, recent);
      return true;
    },
  };
}

/** 限流器挂在 globalThis 上：开发模式热重载路由模块时不重置 */
export function sharedRateLimiter(name: string, limit: number, windowMs: number): RateLimiter {
  const holder = globalThis as Record<symbol, RateLimiter | undefined>;
  const slot = Symbol.for(`pelican.rateLimit.${name}`);
  holder[slot] ??= createRateLimiter(limit, windowMs);
  return holder[slot];
}

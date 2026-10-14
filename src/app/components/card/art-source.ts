/**
 * 作品 SVG 源码的浏览器端取数（见 ACR-003），源码经 `/art/<runId>/<file>` 按需取。
 * 按地址缓存 Promise，同一作品的并发请求共用一次；作品写出后不再改动，缓存无需失效。
 *
 * 取回的是未经审阅的模型输出，调用方必须先交给 sanitizeSvg 净化。
 */

/** 一天约三百件作品；超出上限时淘汰最早取入的，限制内存占用 */
const MAX_CACHED = 500;

const cache = new Map<string, Promise<string>>();

export function localizeArtError(error: string, locale: "en" | "zh-CN" = "zh-CN"): string {
  if (locale !== "en") return error;
  if (error === "作品不存在或已按保留期清理") {
    return "Artwork not found or pruned by retention policy";
  }
  const httpMatch = /^读取作品失败（HTTP (\d+)）$/.exec(error);
  if (httpMatch) return `Failed to load artwork (HTTP ${httpMatch[1]})`;
  return error;
}

export function fetchArtSource(href: string, locale: "en" | "zh-CN" = "zh-CN"): Promise<string> {
  const cached = cache.get(href);
  if (cached !== undefined) return cached;

  const pending = fetch(href).then(async (response) => {
    if (response.status === 404) {
      throw new Error(localizeArtError("作品不存在或已按保留期清理", locale));
    }
    if (!response.ok) {
      throw new Error(localizeArtError(`读取作品失败（HTTP ${response.status}）`, locale));
    }
    return response.text();
  });
  // 失败不缓存，下次需要时重新请求
  pending.catch(() => {
    if (cache.get(href) === pending) cache.delete(href);
  });
  cache.set(href, pending);
  evictOldest();
  return pending;
}

function evictOldest(): void {
  while (cache.size > MAX_CACHED) {
    const oldest = cache.keys().next();
    if (oldest.done === true) return;
    cache.delete(oldest.value);
  }
}

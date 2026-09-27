/**
 * 所有者操作的统一请求入口：写请求带上 `X-Pelican-Action` 头（服务端据此拒绝跨站表单），
 * 会话失效（401）时跳到配对页，回来后仍在原页面。
 */

const ACTION_HEADER = "x-pelican-action";

export async function actionFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set(ACTION_HEADER, "1");
  const response = await fetch(input, { ...init, headers, cache: "no-store" });
  if (response.status === 401 && typeof window !== "undefined") {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.assign(`/pair?next=${next}`);
  }
  return response;
}

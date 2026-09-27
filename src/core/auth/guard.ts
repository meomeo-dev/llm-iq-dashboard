/**
 * 路由守卫：从请求里取 cookie 校验所有者；写操作另要求自定义请求头，
 * 与 SameSite=Strict 一起挡住跨站请求。
 */

import { audit } from "./audit";
import { SESSION_COOKIE, verifySession, type OwnerSession } from "./session";
import { isReadonly } from "../deploy-mode";

/** 写请求必须带的头；浏览器不会替跨站表单自动加上它 */
export const ACTION_HEADER = "x-pelican-action";

export type GuardResult =
  | { ok: true; owner: OwnerSession }
  | { ok: false; status: 401 | 403; error: string };

/** 只读所有者接口：有效 cookie 即可 */
export async function requireOwner(request: Request): Promise<GuardResult> {
  const owner = await verifySession(readCookie(request.headers, SESSION_COOKIE));
  if (owner === null) return { ok: false, status: 401, error: "需要所有者登录" };
  return { ok: true, owner };
}

/** 写操作：cookie 之外还要 X-Pelican-Action 头；拒绝时记审计；只读部署返回 403 */
export async function requireOwnerAction(request: Request, action: string): Promise<GuardResult> {
  if (isReadonly()) {
    return { ok: false, status: 403, error: "只读部署" };
  }
  const guard = await requireOwner(request);
  if (!guard.ok) {
    await audit({ action, outcome: "denied", deviceId: null, ip: clientIp(request), detail: guard.error });
    return guard;
  }
  if (request.headers.get(ACTION_HEADER) !== "1") {
    await audit({ action, outcome: "denied", deviceId: guard.owner.deviceId, ip: clientIp(request), detail: "缺少操作头" });
    return { ok: false, status: 403, error: `写操作须带请求头 ${ACTION_HEADER}: 1` };
  }
  return guard;
}

/** 反向代理后取 X-Forwarded-For 的第一段；没有就返回 null，不猜 */
export function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded !== null && forwarded.trim() !== "") return forwarded.split(",")[0]?.trim() ?? null;
  return request.headers.get("x-real-ip");
}

/** 是否经 TLS 到达：直连 https 或代理声明 https 时 cookie 才加 Secure */
export function isSecureRequest(request: Request): boolean {
  if (request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() === "https") return true;
  return new URL(request.url).protocol === "https:";
}

export function readCookie(headers: Headers, name: string): string | null {
  const header = headers.get("cookie");
  if (header === null) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

/**
 * 配对：`POST /api/pair`，请求体 `{ code }`。配对码由宿主机 `pnpm pair` 打印。
 *
 * 成功即签发设备凭据并写 cookie；失败一律 401，原因只区分"窗口未打开 / 已过期 /
 * 不匹配 / 已锁定"。每个来源 IP 在 10 分钟内最多尝试 5 次。
 */

import { NextResponse } from "next/server";
import { audit } from "@/core/auth/audit";
import { clientIp, isSecureRequest } from "@/core/auth/guard";
import { redeemPairingCode, type PairingOutcome } from "@/core/auth/pairing";
import { sharedRateLimiter } from "@/core/auth/rate-limit";
import { issueSession, SESSION_COOKIE, sessionCookieAttributes } from "@/core/auth/session";

export const dynamic = "force-dynamic";

const PAIR_ATTEMPTS = 5;
const PAIR_WINDOW_MS = 10 * 60 * 1000;

const REASONS: Record<Exclude<PairingOutcome, { ok: true }>["reason"], string> = {
  "no-window": "配对窗口未打开：先在宿主机执行 pnpm pair",
  expired: "配对码已过期：重新执行 pnpm pair",
  mismatch: "配对码不匹配",
  locked: "错误次数过多，配对窗口已关闭：重新执行 pnpm pair",
};

export async function POST(request: Request): Promise<NextResponse> {
  const ip = clientIp(request);
  if (!sharedRateLimiter("pair", PAIR_ATTEMPTS, PAIR_WINDOW_MS).take(ip ?? "local")) {
    await audit({ action: "pair", outcome: "denied", deviceId: null, ip, detail: "限流" });
    return NextResponse.json({ error: "尝试过于频繁，稍后再试" }, { status: 429 });
  }

  let code: unknown;
  try {
    ({ code } = (await request.json()) as { code?: unknown });
  } catch {
    return NextResponse.json({ error: "请求体不是合法 JSON" }, { status: 400 });
  }
  if (typeof code !== "string" || code.trim() === "") {
    return NextResponse.json({ error: "请求体须为 { code: string }" }, { status: 400 });
  }

  const outcome = await redeemPairingCode(code);
  if (!outcome.ok) {
    await audit({ action: "pair", outcome: "denied", deviceId: null, ip, detail: outcome.reason });
    return NextResponse.json({ error: REASONS[outcome.reason] }, { status: 401 });
  }

  const { cookie, device } = await issueSession(outcome.deviceName);
  await audit({ action: "pair", outcome: "ok", deviceId: device.id, ip });
  const response = NextResponse.json({ ok: true, device: { id: device.id, name: device.name } });
  response.cookies.set(SESSION_COOKIE, cookie, sessionCookieAttributes(isSecureRequest(request)));
  return response;
}

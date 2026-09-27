/**
 * 当前会话：`GET /api/session` 返回是否所有者及设备列表（到轮换点时顺带换发 cookie）；
 * `DELETE /api/session` 退出当前设备。两者都不消耗额度，GET 对公开视角只回 `{ owner: false }`。
 */

import { NextResponse } from "next/server";
import { audit } from "@/core/auth/audit";
import { listDevices, revokeDevice } from "@/core/auth/devices";
import { clientIp, isSecureRequest, readCookie, requireOwnerAction } from "@/core/auth/guard";
import { SESSION_COOKIE, sessionCookieAttributes, verifySession } from "@/core/auth/session";

export const dynamic = "force-dynamic";

export interface SessionView {
  owner: boolean;
  device: { id: string; name: string } | null;
  devices: { id: string; name: string; issuedAt: string; lastSeenAt: string; current: boolean }[];
}

export async function GET(request: Request): Promise<NextResponse> {
  const owner = await verifySession(readCookie(request.headers, SESSION_COOKIE));
  if (owner === null) {
    const anonymous: SessionView = { owner: false, device: null, devices: [] };
    return NextResponse.json(anonymous);
  }
  const devices = (await listDevices()).map((device) => ({
    id: device.id,
    name: device.name,
    issuedAt: device.issuedAt,
    lastSeenAt: device.lastSeenAt,
    current: device.id === owner.deviceId,
  }));
  const view: SessionView = { owner: true, device: { id: owner.deviceId, name: owner.deviceName }, devices };
  const response = NextResponse.json(view);
  if (owner.rotatedCookie !== null) {
    response.cookies.set(SESSION_COOKIE, owner.rotatedCookie, sessionCookieAttributes(isSecureRequest(request)));
  }
  return response;
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const guard = await requireOwnerAction(request, "logout");
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });
  await revokeDevice(guard.owner.deviceId);
  await audit({ action: "logout", outcome: "ok", deviceId: guard.owner.deviceId, ip: clientIp(request) });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieAttributes(isSecureRequest(request)), maxAge: 0 });
  return response;
}

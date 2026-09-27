/**
 * 吊销设备：`DELETE /api/devices/<id>`。吊销自己等同退出，顺带清 cookie。
 */

import { NextResponse } from "next/server";
import { audit } from "@/core/auth/audit";
import { revokeDevice } from "@/core/auth/devices";
import { clientIp, isSecureRequest, requireOwnerAction } from "@/core/auth/guard";
import { SESSION_COOKIE, sessionCookieAttributes } from "@/core/auth/session";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, context: RouteContext): Promise<NextResponse> {
  const guard = await requireOwnerAction(request, "revoke-device");
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { id } = await context.params;
  const revoked = await revokeDevice(id);
  await audit({ action: "revoke-device", outcome: revoked ? "ok" : "error", deviceId: guard.owner.deviceId, ip: clientIp(request), detail: id });
  if (!revoked) return NextResponse.json({ error: `没有 id 为 ${id} 的设备` }, { status: 404 });

  const response = NextResponse.json({ ok: true, current: id === guard.owner.deviceId });
  if (id === guard.owner.deviceId) {
    response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieAttributes(isSecureRequest(request)), maxAge: 0 });
  }
  return response;
}

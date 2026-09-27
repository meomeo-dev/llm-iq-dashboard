/**
 * POST /api/data-repo/github/disconnect：断开 GitHub 连接并清除本地凭据。
 *
 * 需所有者动作权限；只读部署 403。
 */

import { NextResponse } from "next/server";
import { clientIp, requireOwnerAction } from "@/core/auth/guard";
import { audit } from "@/core/auth/audit";
import { isReadonly } from "@/core/deploy-mode";
import { performDisconnect } from "../github-helpers";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  if (isReadonly()) {
    return NextResponse.json({ error: "只读部署" }, { status: 403 });
  }

  const guard = await requireOwnerAction(request, "github-disconnect");
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const res = await performDisconnect();

  await audit({
    action: "github-disconnect",
    outcome: res.revoked ? "ok" : "denied",
    deviceId: guard.owner.deviceId,
    ip: clientIp(request),
    detail: res.revoked
      ? "断开 GitHub 连接并清理凭据"
      : `断开 GitHub 连接并清理凭据（${res.revokeError ?? "撤销授权失败"}）`,
  });

  return NextResponse.json({
    ok: res.ok,
    revoked: res.revoked,
    revokeError: res.revokeError,
    github: res.github,
  });
}

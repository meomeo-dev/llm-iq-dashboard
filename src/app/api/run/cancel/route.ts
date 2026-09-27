/**
 * 停止一轮执行：`POST /api/run/cancel`，请求体 `{ runId }`。
 *
 * 写入停止请求后即返回 202（见 core/run-cancel.ts）。执行该轮的进程（看板或调度器）
 * 在一秒内响应，后续状态经 /api/events 推送；CLI 收尾最长约 5 秒，不在请求内等待。
 * 只接受正在执行的轮次，其他轮次返回 409。
 */

import { NextResponse } from "next/server";
import { audit } from "@/core/auth/audit";
import { clientIp, requireOwnerAction } from "@/core/auth/guard";
import { findActiveRun } from "@/core/progress";
import { requestCancel } from "@/core/run-cancel";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  const guard = await requireOwnerAction(request, "cancel-run");
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });

  let runId: unknown;
  try {
    ({ runId } = (await request.json()) as { runId?: unknown });
  } catch {
    return NextResponse.json({ error: "请求体不是合法 JSON" }, { status: 400 });
  }
  if (typeof runId !== "string" || runId === "") {
    return NextResponse.json({ error: "请求体须为 { runId: string }" }, { status: 400 });
  }

  const active = await findActiveRun();
  if (active === null || active.runId !== runId) {
    return NextResponse.json({ error: `轮次 ${runId} 不在执行中，无需停止` }, { status: 409 });
  }
  if (active.cancelledAt != null) {
    return NextResponse.json({ runId, requestedAt: active.cancelledAt }, { status: 202 });
  }

  const { requestedAt } = await requestCancel(runId);
  await audit({ action: "cancel-run", outcome: "ok", deviceId: guard.owner.deviceId, ip: clientIp(request), detail: runId });
  return NextResponse.json({ runId, requestedAt }, { status: 202 });
}

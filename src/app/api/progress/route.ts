/**
 * 执行进度接口：`GET /api/progress`
 *
 * 与 /api/events 推送的 progress 事件同形；与 /api/runs 分开，避免为读进度下发全部结果。
 */

import { NextResponse } from "next/server";
import { readCookie } from "@/core/auth/guard";
import { SESSION_COOKIE, verifySession } from "@/core/auth/session";
import { isReadonly, isRemoteDataSource } from "@/core/deploy-mode";
import { listProgressViews } from "@/core/progress";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  if (isRemoteDataSource()) {
    return NextResponse.json({ runs: [] });
  }
  const cookie = request?.headers ? readCookie(request.headers, SESSION_COOKIE) : null;
  const owner = isReadonly() ? null : await verifySession(cookie);
  const runs = await listProgressViews();
  return NextResponse.json({
    runs: owner !== null ? runs : runs.filter((r) => !r.jobKind),
  });
}

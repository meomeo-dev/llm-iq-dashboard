/**
 * 执行进度接口：`GET /api/progress`
 *
 * 与 /api/events 推送的 progress 事件同形；与 /api/runs 分开，避免为读进度下发全部结果。
 */

import { NextResponse } from "next/server";
import { listProgressViews } from "@/core/progress";
import { isRemoteDataSource } from "@/core/deploy-mode";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  if (isRemoteDataSource()) {
    return NextResponse.json({ runs: [] });
  }
  return NextResponse.json({ runs: await listProgressViews() });
}

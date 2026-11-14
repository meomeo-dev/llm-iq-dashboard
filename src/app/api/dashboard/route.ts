import { NextResponse } from "next/server";
import { loadDashboardWindow } from "@/app/components/dashboard/dashboard-window";

export const dynamic = "force-dynamic";

/** 仅返回所选日期窗口的看板数据，供客户端收到 SSE 变更信号后就地增量更新，不整页刷新 */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const rawDay = url.searchParams.get("day");
  const dayKey = rawDay !== null && rawDay.length > 0 ? rawDay : null;
  const snapshot = await loadDashboardWindow(dayKey);
  return NextResponse.json(snapshot, { headers: { "cache-control": "no-store" } });
}

/**
 * 只读的运行记录接口：`GET /api/runs?limit=20`
 *
 * 供外部工具（脚本、告警等）读取运行记录，无需解析 data/ 目录布局；看板页面走服务端
 * 渲染，不依赖它。
 */

import { NextResponse } from "next/server";
import { listRuns } from "@/core/store";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 200;

export async function GET(request: Request): Promise<NextResponse> {
  const limit = parseLimit(new URL(request.url).searchParams.get("limit"));
  const runs = await listRuns(limit);
  return NextResponse.json({ count: runs.length, runs });
}

/** 取值非法时退回默认值，不报错 */
function parseLimit(raw: string | null): number {
  if (raw === null) return DEFAULT_LIMIT;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(parsed, MAX_LIMIT);
}

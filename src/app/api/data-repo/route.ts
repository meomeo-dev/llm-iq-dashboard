/**
 * GET /api/data-repo：所有者查询数据仓面板聚合状态。
 *
 * 只读部署一律 403；需要所有者会话；未配置 dataRepo 时返回 200 且 configured=false、repo=null。
 * 无副作用、不 fetch 远端。
 */

import { NextResponse } from "next/server";
import { requireOwner } from "@/core/auth/guard";
import { loadConfig } from "@/core/config";
import { isReadonly } from "@/core/deploy-mode";
import { configPath } from "@/core/paths";
import { collectDataRepoStatus } from "@/core/sync/data-repo-status";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  if (isReadonly()) {
    return NextResponse.json({ error: "只读部署" }, { status: 403 });
  }

  const guard = await requireOwner(request);
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  try {
    const config = loadConfig(configPath());
    const status = await collectDataRepoStatus(config);
    return NextResponse.json(status);
  } catch (cause) {
    const msg = cause instanceof Error ? cause.message : String(cause);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

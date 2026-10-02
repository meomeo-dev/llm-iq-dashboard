/**
 * 健康检查接口：`GET /api/health`（公开、只读、无副作用）。
 *
 * 供部署平台（如 Vercel、Docker 心跳探针或外部监控）验证看板运行状态与远程数据仓连通性。
 * 远程源不可达时仍返回 HTTP 200，但在 dataRepo 中标明 reachable=false 与中文原因。
 */

import { NextResponse } from "next/server";
import { checkDataRepoHealth } from "@/core/data-source";
import { getDeployMode } from "@/core/deploy-mode";
import packageJson from "../../../../package.json";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const modeInfo = getDeployMode();
  const mode = {
    readonly: modeInfo.readonly,
    dataSource: modeInfo.dataSource,
  };

  let dataRepo = null;
  if (modeInfo.dataSource === "remote") {
    dataRepo = await checkDataRepoHealth();
  }

  return NextResponse.json({
    mode,
    dataRepo,
    version: packageJson.version,
  });
}

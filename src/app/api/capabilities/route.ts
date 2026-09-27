/**
 * 能力目录接口。
 *
 * `GET`   读缓存，没有缓存则现场探测一次（`agy models` 需联网，耗时十几秒）。
 * `POST`  强制重新探测，用于 CLI 升级后刷新模型清单。
 */

import { NextResponse } from "next/server";
import { requireOwner, requireOwnerAction } from "@/core/auth/guard";
import { readCachedCatalog, refreshCatalog } from "@/capabilities/catalog";
import { probeViaRunner } from "@/core/requests";
import { externalRunner } from "@/core/runner-link";
import { loadConfig } from "@/core/config";
import { configPath } from "@/core/paths";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const guard = await requireOwner(request);
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });
  const cached = await readCachedCatalog();
  if (cached !== null) return NextResponse.json(cached);
  return refresh();
}

export async function POST(request: Request): Promise<NextResponse> {
  const guard = await requireOwnerAction(request, "probe-capabilities");
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });
  return refresh();
}

async function refresh(): Promise<NextResponse> {
  try {
    // 分容器部署：看板容器没有 CLI，交给执行器探测后读缓存
    if (externalRunner()) {
      const snapshot = await probeViaRunner();
      if (snapshot === null) {
        return NextResponse.json({ error: "执行器未响应：确认 runner 容器在运行（docker compose ps）" }, { status: 503 });
      }
      return NextResponse.json(snapshot);
    }
    // 并入自定义模型，否则手填的模型不会出现在界面上
    const custom = readCustomModels();
    return NextResponse.json(await refreshCatalog(custom));
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** 配置损坏时返回空表，不让能力探测一起失败 */
function readCustomModels() {
  try {
    return loadConfig(configPath()).customModels;
  } catch {
    return {};
  }
}

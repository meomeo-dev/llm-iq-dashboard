/**
 * 从 profile 的上游拉取模型清单：`POST` 请求体 `{ cli, name }`，返回 `{ models }`。
 *
 * 只读上游、不改配置；结果交给配置页填进该 profile 的模型栏，由用户删改后随"保存配置"写回。
 * 分容器部署时看板读不到 key，经请求文件交给执行器代拉。
 */

import { NextResponse } from "next/server";
import { requireOwnerAction } from "@/core/auth/guard";
import { loadConfig } from "@/core/config";
import { isCliKind } from "@/core/config/parsers-common";
import { configPath } from "@/core/paths";
import { requestRunnerProfileModels } from "@/core/requests";
import { externalRunner } from "@/core/runner-link";
import { fetchUpstreamModels, type ModelListOutcome } from "@/core/upstream-models";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  const guard = await requireOwnerAction(request, "profile-models");
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "请求体不是合法 JSON" }, { status: 400 });
  }
  const cli = typeof body.cli === "string" ? body.cli : null;
  const name = typeof body.name === "string" ? body.name : null;
  if (!isCliKind(cli) || name === null) return NextResponse.json({ error: "缺少 cli 或 name" }, { status: 400 });

  const outcome = await listModels(cli, name);
  if (!outcome.ok) return NextResponse.json({ error: outcome.error }, { status: 502 });
  return NextResponse.json({ models: outcome.models });
}

async function listModels(cli: Parameters<typeof fetchUpstreamModels>[0], name: string): Promise<ModelListOutcome> {
  if (externalRunner()) return requestRunnerProfileModels({ cli, name });
  try {
    return await fetchUpstreamModels(cli, name, loadConfig(configPath()));
  } catch (cause) {
    return { ok: false, error: cause instanceof Error ? cause.message : String(cause) };
  }
}

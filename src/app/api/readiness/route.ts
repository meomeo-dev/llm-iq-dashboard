/**
 * CLI 就绪状态：`GET /api/readiness` 读缓存，`POST /api/readiness` 重新检查。
 *
 * 只检查配置用到的 CLI。检查约需十秒（agy 列模型要联网），因此 GET 只读缓存
 * （见 capabilities/readiness-cache.ts），由看板按需 POST。
 */

import { NextResponse } from "next/server";
import { requireOwner, requireOwnerAction } from "@/core/auth/guard";
import { checkAndRecord, readReadiness, type ReadinessSnapshot } from "@/capabilities/readiness-cache";
import { commandHint, runsInContainer } from "@/core/command-hint";
import { loadConfig } from "@/core/config";
import { configPath } from "@/core/paths";
import { enqueueRequest, waitForRequest } from "@/core/requests";
import { externalRunner } from "@/core/runner-link";
import type { CliKind } from "@/core/types";

export const dynamic = "force-dynamic";

/** 一次检查约十秒（agy 列模型要联网） */
const RUNNER_CHECK_TIMEOUT_MS = 60_000;

export interface ReadinessView {
  /** 配置里用到的 CLI，按首次出现的顺序 */
  used: CliKind[];
  clis: ReadinessSnapshot;
  /** 一次完成各家登录的命令 */
  onboardCommand: string;
  /** 容器部署：提示里的命令要在宿主机终端执行 */
  inContainer: boolean;
}

export async function GET(request: Request): Promise<NextResponse> {
  const guard = await requireOwner(request);
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });
  try {
    return NextResponse.json(describe(await readReadiness()));
  } catch (cause) {
    return NextResponse.json({ error: message(cause) }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const guard = await requireOwnerAction(request, "check-readiness");
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });
  try {
    if (externalRunner()) {
      const settled = await waitForRequest((await enqueueRequest("check-readiness")).id, RUNNER_CHECK_TIMEOUT_MS);
      if (settled?.state !== "done") {
        const error = settled?.result?.error ?? "执行器未响应：确认 runner 容器在运行（docker compose ps）";
        return NextResponse.json({ error }, { status: 503 });
      }
    } else {
      await checkAndRecord(usedClis());
    }
    return NextResponse.json(describe(await readReadiness()));
  } catch (cause) {
    return NextResponse.json({ error: message(cause) }, { status: 500 });
  }
}

function usedClis(): CliKind[] {
  return [...new Set(loadConfig(configPath()).targets.map((target) => target.cli))];
}

function describe(clis: ReadinessSnapshot): ReadinessView {
  return { used: usedClis(), clis, onboardCommand: commandHint("pnpm onboard"), inContainer: runsInContainer() };
}

function message(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

/**
 * 自动任务开关：`GET /api/auto-run` 读状态，`PUT /api/auto-run` 拨开关。
 *
 * 打开时若无存活的调度器则拉起一个（见 core/scheduler-launcher.ts）。关闭只写开关：
 * 调度器到点跳过，正在跑的一轮不打断，以免留下不完整、不可比的数据。
 */

import { NextResponse } from "next/server";
import { audit } from "@/core/auth/audit";
import { clientIp, requireOwnerAction } from "@/core/auth/guard";
import { describeAutoRun, writeAutoRunSwitch } from "@/core/auto-run";
import { loadConfig } from "@/core/config";
import { applyConfigPatch } from "@/core/config-writer";
import { configPath } from "@/core/paths";
import { launchSchedulerIfNeeded } from "@/core/scheduler-launcher";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json(await describeAutoRun());
  } catch (cause) {
    return NextResponse.json({ error: describe(cause) }, { status: 500 });
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  const guard = await requireOwnerAction(request, "auto-run");
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });

  let enabled: unknown;
  try {
    ({ enabled } = (await request.json()) as { enabled?: unknown });
  } catch {
    return NextResponse.json({ error: "请求体不是合法 JSON" }, { status: 400 });
  }
  if (typeof enabled !== "boolean") {
    return NextResponse.json({ error: "请求体须为 { enabled: boolean }" }, { status: 400 });
  }

  try {
    await writeAutoRunSwitch(enabled);
    await audit({ action: "auto-run", outcome: "ok", deviceId: guard.owner.deviceId, ip: clientIp(request), detail: enabled ? "on" : "off" });

    // 开启自动调度时若配置中被停用，自动同步开启，消除状态割裂
    if (enabled) {
      const cfg = loadConfig(configPath());
      if (!cfg.schedule.enabled) {
        await applyConfigPatch(configPath(), { schedule: { ...cfg.schedule, enabled: true } });
      }
    }

    const launchedPid = await launchSchedulerIfNeeded();
    const state = await describeAutoRun();
    // 新拉起的调度器尚未登记 pid，先报子进程的 pid，避免界面短暂显示“未运行”
    return NextResponse.json({ ...state, schedulerPid: state.schedulerPid ?? launchedPid });
  } catch (cause) {
    return NextResponse.json({ error: describe(cause) }, { status: 500 });
  }
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

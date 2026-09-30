/**
 * 配置读写接口。
 *
 * `GET`  返回当前生效配置与可选的提示词预设，供配置界面渲染。
 * `PUT`  应用一份补丁；写回保留 YAML 注释，且先校验后落盘（见 core/config-writer.ts）。
 */

import { NextResponse } from "next/server";
import { audit } from "@/core/auth/audit";
import { clientIp, requireOwner, requireOwnerAction } from "@/core/auth/guard";
import { loadConfig } from "@/core/config";
import { applyConfigPatch, type ConfigPatch } from "@/core/config-writer";
import { configPath } from "@/core/paths";
import { BUILTIN_PROMPTS } from "@/core/prompt";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const guard = await requireOwner(request);
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });
  try {
    const path = configPath();
    const config = loadConfig(path);
    return NextResponse.json({
      path,
      schedule: config.schedule,
      run: config.run,
      targets: config.targets,
      customPrompts: config.customPrompts,
      customModels: config.customModels,
      judge: config.judge,
      builtinPrompts: BUILTIN_PROMPTS,
    });
  } catch (cause) {
    // 配置损坏时返回可读原因，供界面显示
    return NextResponse.json({ error: describe(cause) }, { status: 500 });
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  const guard = await requireOwnerAction(request, "config");
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });
  const { deviceId } = guard.owner;
  const ip = clientIp(request);

  let patch: ConfigPatch;
  try {
    patch = (await request.json()) as ConfigPatch;
  } catch {
    return NextResponse.json({ error: "请求体不是合法 JSON" }, { status: 400 });
  }

  try {
    const config = await applyConfigPatch(configPath(), patch);
    await audit({ action: "config", outcome: "ok", deviceId, ip });
    return NextResponse.json({ ok: true, config });
  } catch (cause) {
    // 校验失败属于输入错误，返回 400
    await audit({ action: "config", outcome: "error", deviceId, ip, detail: describe(cause) });
    return NextResponse.json({ error: describe(cause) }, { status: 400 });
  }
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

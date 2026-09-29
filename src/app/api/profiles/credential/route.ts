/**
 * profile 的 API key 写入与删除。
 *
 * `GET`    返回哪些 profile 已填 key（只有时刻，没有 key）。
 * `PUT`    请求体 `{ cli, name, apiKey }`，写入凭据目录。
 * `DELETE` 请求体 `{ cli, name }`，删除 key。
 *
 * key 只进不出：任何响应都不回显 key。分容器部署时看板读不到凭据目录，经请求文件交给执行器。
 */

import { NextResponse } from "next/server";
import { audit } from "@/core/auth/audit";
import { clientIp, requireOwner, requireOwnerAction } from "@/core/auth/guard";
import { loadConfig } from "@/core/config";
import { configPath } from "@/core/paths";
import { applyProfileCredential } from "@/core/profile-credential-request";
import { readCredentialStatus } from "@/core/profile-credentials";
import { requestRunnerProfileCredential, type ProfileCredentialAction } from "@/core/requests";
import { externalRunner } from "@/core/runner-link";
import { isCliKind } from "@/core/config/parsers-common";

export const dynamic = "force-dynamic";

const AUDIT_ACTION = "profile-credential";

export async function GET(request: Request): Promise<NextResponse> {
  const guard = await requireOwner(request);
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });
  return NextResponse.json({ credentials: await readCredentialStatus() });
}

export async function PUT(request: Request): Promise<NextResponse> {
  return handleWrite(request, "set");
}

export async function DELETE(request: Request): Promise<NextResponse> {
  return handleWrite(request, "delete");
}

async function handleWrite(request: Request, op: ProfileCredentialAction["op"]): Promise<NextResponse> {
  const guard = await requireOwnerAction(request, AUDIT_ACTION);
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });
  const trail = { action: AUDIT_ACTION, deviceId: guard.owner.deviceId, ip: clientIp(request) };

  const action = await readAction(request, op);
  if ("error" in action) return NextResponse.json({ error: action.error }, { status: 400 });

  const outcome = await dispatch(action);
  // 审计只记 profile 名与动作，不记 key
  const detail = `${op} ${action.cli}:${action.name}${outcome.ok ? "" : `：${outcome.error}`}`;
  await audit({ ...trail, outcome: outcome.ok ? "ok" : "error", detail });
  if (!outcome.ok) return NextResponse.json({ error: outcome.error }, { status: 400 });
  return NextResponse.json({ ok: true, credentials: await readCredentialStatus() });
}

async function readAction(
  request: Request,
  op: ProfileCredentialAction["op"],
): Promise<ProfileCredentialAction | { error: string }> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return { error: "请求体不是合法 JSON" };
  }
  const cli = typeof body.cli === "string" ? body.cli : null;
  const name = typeof body.name === "string" ? body.name : null;
  if (!isCliKind(cli) || name === null) return { error: "缺少 cli 或 name" };
  const apiKey = op === "set" && typeof body.apiKey === "string" ? body.apiKey : null;
  return { op, cli, name, apiKey };
}

async function dispatch(action: ProfileCredentialAction): Promise<{ ok: true } | { ok: false; error: string }> {
  if (externalRunner()) return requestRunnerProfileCredential(action);
  try {
    return await applyProfileCredential(action, loadConfig(configPath()));
  } catch (cause) {
    return { ok: false, error: cause instanceof Error ? cause.message : String(cause) };
  }
}

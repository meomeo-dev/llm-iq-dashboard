/**
 * GET /api/data-repo/github/callback：应用安装与用户授权完成后的回跳接口。
 *
 * 换取访问令牌与刷新令牌并持久化，随后 302 重定向至 /config#data-repo。
 * 失败时 302 至 /config?github=error&reason=<机器码>，绝不回显原始错误。
 */

import { NextResponse } from "next/server";
import { readCookie, requireOwner } from "@/core/auth/guard";
import { SESSION_COOKIE } from "@/core/auth/session";
import { loadConfig } from "@/core/config";
import { isReadonly } from "@/core/deploy-mode";
import { verifyState } from "@/core/github-auth";
import { configPath } from "@/core/paths";
import {
  GITHUB_COOKIE_PATH,
  GITHUB_STATE_COOKIE,
  getStateCookie,
  performTokenExchange,
  renderBouncePage,
  requestOrigin,
  resolveExistingAppSlug,
} from "../github-helpers";

export const dynamic = "force-dynamic";

function errorRedirect(origin: string, reason: string): NextResponse {
  const target = new URL(`/config?github=error&reason=${encodeURIComponent(reason)}`, origin);
  return NextResponse.redirect(target, 302);
}

export async function GET(request: Request): Promise<NextResponse> {
  if (isReadonly()) {
    return NextResponse.json({ error: "只读部署" }, { status: 403 });
  }

  if (!readCookie(request.headers, SESSION_COOKIE)) {
    return renderBouncePage(request);
  }

  const guard = await requireOwner(request);
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = getStateCookie(request);

  if (state) {
    if (!verifyState(expectedState, state)) {
      return errorRedirect(requestOrigin(request), "state_mismatch");
    }
  } else {
    const existingSlug = await resolveExistingAppSlug();
    if (!existingSlug || !expectedState) {
      return errorRedirect(requestOrigin(request), "invalid_session");
    }
  }

  if (!code) {
    return errorRedirect(requestOrigin(request), "missing_code");
  }

  try {
    const full = loadConfig(configPath());
    await performTokenExchange(code, full.dataRepo?.path);

    const redirectRes = NextResponse.redirect(new URL("/config#data-repo", requestOrigin(request)), 302);
    redirectRes.cookies.delete({
      name: GITHUB_STATE_COOKIE,
      path: GITHUB_COOKIE_PATH,
    });
    return redirectRes;
  } catch {
    return errorRedirect(requestOrigin(request), "exchange_failed");
  }
}

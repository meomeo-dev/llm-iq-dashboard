/**
 * GET /api/data-repo/github/app-created：GitHub App 创建后的回跳接口。
 *
 * 校验 state 并将 code 转交转换为应用凭据，随后 302 重定向至应用安装页。
 */

import { NextResponse } from "next/server";
import { readCookie, requireOwner } from "@/core/auth/guard";
import { SESSION_COOKIE } from "@/core/auth/session";
import { isReadonly } from "@/core/deploy-mode";
import { verifyState } from "@/core/github-auth";
import {
  getStateCookie,
  performAppConvert,
  renderBouncePage,
  requestOrigin,
} from "../github-helpers";

export const dynamic = "force-dynamic";

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

  if (!state || !verifyState(expectedState, state)) {
    return NextResponse.json({ error: "OAuth state 校验失败" }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: "缺少授权码 (code)" }, { status: 400 });
  }

  try {
    const slug = await performAppConvert(code);
    return NextResponse.redirect(
      `https://github.com/apps/${slug}/installations/new`,
      302,
    );
  } catch {
    const redirectUrl = new URL("/config?github=error&reason=app_convert_failed", requestOrigin(request));
    return NextResponse.redirect(redirectUrl, 302);
  }
}

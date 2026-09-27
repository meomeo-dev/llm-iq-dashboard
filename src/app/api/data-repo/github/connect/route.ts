/**
 * GET /api/data-repo/github/connect：发起 GitHub App 创建或直接跳转安装。
 *
 * 需所有者权限；只读部署 403。
 */

import { NextResponse } from "next/server";
import { requireOwner } from "@/core/auth/guard";
import { isReadonly } from "@/core/deploy-mode";
import { buildManifest, createState } from "@/core/github-auth";
import { DEFAULT_REPOSITORY_URL } from "@/core/sync/data-repo-index";
import {
  GITHUB_COOKIE_PATH,
  GITHUB_STATE_COOKIE,
  htmlEscape,
  resolveExistingApp,
} from "../github-helpers";

export const dynamic = "force-dynamic";

function renderAutoSubmitForm(state: string, manifestJson: string): string {
  const targetUrl = `https://github.com/settings/apps/new?state=${encodeURIComponent(state)}`;
  return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <title>正在跳转至 GitHub...</title>
  </head>
  <body>
    <form action="${targetUrl}" method="post">
      <input type="hidden" name="manifest" value="${htmlEscape(manifestJson)}">
      <noscript><button type="submit">点击继续前往 GitHub</button></noscript>
    </form>
    <script>document.forms[0].submit();</script>
  </body>
</html>`;
}

function handleExistingAppRedirect(app: {
  slug: string | null;
  clientId: string | null;
  state: string;
}): NextResponse {
  const state = createState();
  let targetUrl: string;
  if (app.state === "reconnect-required" && app.clientId) {
    targetUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(app.clientId)}&state=${encodeURIComponent(state)}`;
  } else {
    targetUrl = `https://github.com/apps/${app.slug}/installations/new`;
  }
  const redirectRes = NextResponse.redirect(targetUrl, 302);
  redirectRes.cookies.set({
    name: GITHUB_STATE_COOKIE,
    value: state,
    httpOnly: true,
    sameSite: "lax",
    path: GITHUB_COOKIE_PATH,
    maxAge: 3600,
  });
  return redirectRes;
}

export async function GET(request: Request): Promise<NextResponse> {
  if (isReadonly()) {
    return NextResponse.json({ error: "只读部署" }, { status: 403 });
  }

  const guard = await requireOwner(request);
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const app = await resolveExistingApp();
  if (app && app.slug) {
    return handleExistingAppRedirect(app);
  }

  const reqUrl = new URL(request.url);
  const origin = reqUrl.origin;
  const manifest = buildManifest(origin, DEFAULT_REPOSITORY_URL);
  const state = createState();
  const html = renderAutoSubmitForm(state, JSON.stringify(manifest));

  const response = new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });

  response.cookies.set({
    name: GITHUB_STATE_COOKIE,
    value: state,
    httpOnly: true,
    sameSite: "lax",
    path: GITHUB_COOKIE_PATH,
    maxAge: 3600,
  });

  return response;
}

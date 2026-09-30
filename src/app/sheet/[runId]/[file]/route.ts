/**
 * 评审联系图：`GET /sheet/<runId>/<file>`，返回渲染层落盘的 PNG（帧序表或某类细节表）。
 * 联系图由本机 Chromium 截屏生成，不是模型产物，按普通图片返回；文件名由 core 侧校验。
 */

import { loadContactSheet } from "@/core/data-source";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ runId: string; file: string }>;
}

export async function GET(_request: Request, { params }: RouteContext): Promise<Response> {
  const { runId, file } = await params;
  const png = await loadContactSheet(runId, file);
  if (png === null) return new Response("联系图不存在或已按保留期清理", { status: 404 });
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "X-Content-Type-Options": "nosniff",
      // 评审记录重跑会覆盖同名文件，不标 immutable
      "Cache-Control": "private, max-age=600",
    },
  });
}

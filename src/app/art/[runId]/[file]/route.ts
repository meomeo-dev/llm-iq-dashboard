/**
 * 原始作品：`GET /art/<runId>/<svgFile>`，原样返回模型写出的 SVG 文件。
 *
 * 作品是未经审阅的模型输出，可能含 `<script>` 与外链。CSP sandbox 将其置于不透明源
 * （opaque origin）：禁止脚本，只加载内联样式与 data: 图片 / 字体，无法访问看板同源数据。
 */

import { loadArt } from "@/core/data-source";
import { isRemoteDataSource } from "@/core/deploy-mode";

export const dynamic = "force-dynamic";

const SANDBOX_POLICY = [
  "sandbox",
  "default-src 'none'",
  "style-src 'unsafe-inline'",
  "img-src data:",
  "font-src data:",
].join("; ");

interface RouteContext {
  params: Promise<{ runId: string; file: string }>;
}

export async function GET(_request: Request, { params }: RouteContext): Promise<Response> {
  const { runId, file } = await params;
  const art = await loadArt(runId, file);
  if (art === null || art.svg === null) {
    return new Response("作品不存在或已按保留期清理", { status: 404 });
  }
  return new Response(art.svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Security-Policy": SANDBOX_POLICY,
      "X-Content-Type-Options": "nosniff",
      // 作品写出后不再改动（过保留期后 404），immutable 让刷新页面时也不回源验证；
      // remote 模式下为公开数据，改为可公开缓存
      "Cache-Control": isRemoteDataSource()
        ? "public, max-age=86400, immutable"
        : "private, max-age=86400, immutable",
    },
  });
}

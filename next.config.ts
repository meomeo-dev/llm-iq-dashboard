import type { NextConfig } from "next";

/**
 * 页面的安全响应头。脚本与样式允许同源内联：Next.js 的水合脚本是内联的，
 * 去掉 'unsafe-inline' 需要 nonce 中间件。`/art` 返回原始 SVG，自带更严的沙箱策略，
 * 不套本表。
 */
const DEV = process.env.NODE_ENV === "development";

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  // 开发模式的热更新运行时靠 eval 与 WebSocket；生产构建没有
  `script-src 'self' 'unsafe-inline'${DEV ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  `connect-src 'self'${DEV ? " ws: wss: http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*" : ""}`,
  "frame-src 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  // 数据仓面板"连接 GitHub"以表单 POST 清单到 github.com 注册 GitHub App
  "form-action 'self' https://github.com",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "no-referrer" },
];

// 页面每次动态读取运行结果，不启用静态导出；配置 outputFileTracingIncludes 打包价格目录
const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  outputFileTracingIncludes: {
    "/**": ["data/pricing/**/*"],
  },
  async headers() {
    return [{ source: "/((?!art/).*)", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "鹈鹕自行车基准 · LLM IQ Dashboard",
  description:
    "定时调用 agy / codex / claude 执行鹈鹕自行车 SVG 基准，并以 24 小时时间线呈现历史结果",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // 主题类浏览器扩展会在水合前改写 <html> 的属性；suppressHydrationWarning
    // 只忽略该元素自身的属性差异，子树不受影响。
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

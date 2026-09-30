/**
 * 渲染层共用的无头 Chromium：进程内只启动一个，用完由调用方 closeJudgeBrowser 关闭。
 * 可执行文件依次取 PELICAN_BROWSER_PATH、本机 Google Chrome、Playwright 自带的 Chromium；
 * 都不可用时返回原因，评审退回只出静态分。
 */

import { chromium, type Browser } from "playwright-core";

const ENV_BROWSER_PATH = "PELICAN_BROWSER_PATH";

let shared: Promise<Browser> | null = null;

export type BrowserHandle = { ok: true; browser: Browser } | { ok: false; reason: string };

export async function acquireJudgeBrowser(): Promise<BrowserHandle> {
  if (shared === null) shared = launch();
  try {
    return { ok: true, browser: await shared };
  } catch (cause) {
    shared = null;
    return { ok: false, reason: cause instanceof Error ? cause.message.split("\n")[0] ?? "" : String(cause) };
  }
}

export async function closeJudgeBrowser(): Promise<void> {
  if (shared === null) return;
  const pending = shared;
  shared = null;
  try {
    await (await pending).close();
  } catch {
    // 启动本就失败或已关闭，无需处理
  }
}

async function launch(): Promise<Browser> {
  const explicit = process.env[ENV_BROWSER_PATH]?.trim();
  if (explicit) return chromium.launch({ executablePath: explicit });
  const attempts: Array<() => Promise<Browser>> = [
    () => chromium.launch({ channel: "chrome" }),
    () => chromium.launch(),
  ];
  let lastError: unknown = null;
  for (const attempt of attempts) {
    try {
      return await attempt();
    } catch (cause) {
      lastError = cause;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(`无可用的 Chromium；可设置 ${ENV_BROWSER_PATH}`);
}

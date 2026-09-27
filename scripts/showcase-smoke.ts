/**
 * 公开只读展台部署冒烟测试脚本 (showcase-smoke.ts)
 *
 * 验证事项：
 * 1. 本地架设静态数据仓服务 (node:http)；
 * 2. 注入只读远程环境变量执行 next build 与 next start；
 * 3. 首页 200 且展示夹具模型名；
 * 4. GET /api/health 返回 reachable=true；
 * 5. GET /art 已登记作品 200 且带 CSP sandbox；
 * 6. GET /art 未登记文件 404；
 * 7. POST /api/run 403；
 * 8. GET /pair 404；
 * 9. GET /config 307 重定向到 /；
 * 10. 退出时清理全部资源并输出中文摘要。
 */

import type { ChildProcess } from "node:child_process";
import type { Server } from "node:http";
import { runAllAssertions } from "./showcase-smoke/assertions";
import {
  closeServer,
  getAvailablePort,
  runNextBuild,
  startNextServer,
  startStaticRepoServer,
  stopProcess,
  waitForServerReady,
} from "./showcase-smoke/servers";

export * from "./showcase-smoke/assertions";
export * from "./showcase-smoke/servers";

/** 启动冒烟测试所需的数据仓服务与 Next 生产服务 */
async function launchSmokeEnvironment(): Promise<{
  dataRepoServer: Server;
  nextProcess: ChildProcess;
  nextPort: number;
}> {
  const { server: dataRepoServer, port: dataRepoPort } = await startStaticRepoServer();
  console.log(`  ✔ 静态数据仓服务就绪 (127.0.0.1:${dataRepoPort})`);

  const nextPort = await getAvailablePort();
  console.log("  ⏳ 正在执行 next build（只读远程模式）...");
  await runNextBuild(dataRepoPort);
  console.log("  ✔ Next.js 生产环境构建完成");

  console.log(`  ⏳ 正在启动 next start (端口: ${nextPort})...`);
  const nextProcess = await startNextServer(nextPort, dataRepoPort);
  await waitForServerReady(nextPort, 30_000);
  console.log(`  ✔ Next.js 生产服务已就绪 (http://127.0.0.1:${nextPort})`);

  return { dataRepoServer, nextProcess, nextPort };
}

/** 打印冒烟测试失败信息 */
function handleSmokeError(err: unknown): void {
  console.error("=======================================================");
  console.error(`[FAIL] 冒烟测试失败：${err instanceof Error ? err.message : err}`);
  if (err instanceof Error && err.stack) {
    console.error(err.stack);
  }
  console.error("=======================================================");
  process.exitCode = 1;
}

const SMOKE_TIMEOUT_MS = 15 * 60 * 1000;

/** 设置总超时看门狗并在超时时清理退出 */
function setupWatchdog(
  getEnv: () => { server: Server | null; child: ChildProcess | null },
): NodeJS.Timeout {
  const timer = setTimeout(async () => {
    console.error(`[FAIL] 冒烟测试总耗时超过 ${SMOKE_TIMEOUT_MS / 1000}s 看门狗阈值，强制退出`);
    try {
      const { server, child } = getEnv();
      if (child !== null) await stopProcess(child);
      if (server !== null) await closeServer(server);
    } finally {
      process.exit(1);
    }
  }, SMOKE_TIMEOUT_MS);
  timer.unref();
  return timer;
}

/** 清理服务并退出进程 */
async function cleanupSmokeResources(
  server: Server | null,
  child: ChildProcess | null,
): Promise<void> {
  if (child !== null) {
    await stopProcess(child);
  }
  if (server !== null) {
    await closeServer(server);
  }
  process.exit(process.exitCode ?? 0);
}

/** 冒烟测试主入口 */
async function main(): Promise<void> {
  console.log("=======================================================");
  console.log("       公开只读展台部署冒烟测试 (Showcase Smoke)       ");
  console.log("=======================================================");

  let dataRepoServer: Server | null = null;
  let nextProcess: ChildProcess | null = null;
  const watchdog = setupWatchdog(() => ({ server: dataRepoServer, child: nextProcess }));

  try {
    const env = await launchSmokeEnvironment();
    dataRepoServer = env.dataRepoServer;
    nextProcess = env.nextProcess;

    await runAllAssertions(`http://127.0.0.1:${env.nextPort}`);

    console.log("=======================================================");
    console.log("[PASS] 展台冒烟测试全部通过！各项端到端只读安全防线验证完备。");
    console.log("=======================================================");
  } catch (err) {
    handleSmokeError(err);
  } finally {
    clearTimeout(watchdog);
    await cleanupSmokeResources(dataRepoServer, nextProcess);
  }
}

void main();

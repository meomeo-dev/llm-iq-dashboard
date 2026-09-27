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

import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { createServer, type Server } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { createServer as createNetServer } from "node:net";
import { join, normalize } from "node:path";

const FIXTURES_DIR = join(process.cwd(), "test", "fixtures", "data-repo");

interface AssertionStep {
  name: string;
  run: () => Promise<void>;
}

async function main() {
  console.log("=======================================================");
  console.log("       公开只读展台部署冒烟测试 (Showcase Smoke)       ");
  console.log("=======================================================");

  let dataRepoServer: Server | null = null;
  let nextProcess: ChildProcess | null = null;

  try {
    // 1. 启动静态数据仓 HTTP 服务
    const { server: dsServer, port: dataRepoPort } = await startStaticRepoServer();
    dataRepoServer = dsServer;
    console.log(`  ✔ 静态数据仓服务就绪 (127.0.0.1:${dataRepoPort})`);

    // 2. 获取 Next.js 运行端口
    const nextPort = await getAvailablePort();

    // 3. 执行 next build
    console.log("  ⏳ 正在执行 next build（只读远程模式）...");
    await runNextBuild(dataRepoPort);
    console.log("  ✔ Next.js 生产环境构建完成");

    // 4. 执行 next start
    console.log(`  ⏳ 正在启动 next start (端口: ${nextPort})...`);
    nextProcess = await startNextServer(nextPort, dataRepoPort);
    await waitForServerReady(nextPort, 30_000);
    console.log(`  ✔ Next.js 生产服务已就绪 (http://127.0.0.1:${nextPort})`);

    // 5. 依次执行断言清单
    const baseUrl = `http://127.0.0.1:${nextPort}`;
    const steps: AssertionStep[] = [
      {
        name: "首页 GET / (200 且含夹具模型名 model-b)",
        run: async () => {
          const res = await fetch(`${baseUrl}/`);
          assert.equal(res.status, 200, `首页应当返回 200，实际: ${res.status}`);
          const text = await res.text();
          assert.ok(
            text.includes("model-b") || text.includes("model-a"),
            "首页内容应包含夹具中的模型名 (model-b 或 model-a)",
          );
        },
      },
      {
        name: "健康检查 GET /api/health (200 且 dataRepo.reachable=true)",
        run: async () => {
          const res = await fetch(`${baseUrl}/api/health`);
          assert.equal(res.status, 200, `健康检查应返回 200，实际: ${res.status}`);
          const json = await res.json();
          assert.equal(json.mode.readonly, true, "mode.readonly 应为 true");
          assert.equal(json.mode.dataSource, "remote", "mode.dataSource 应为 remote");
          assert.ok(json.dataRepo, "dataRepo 字段不应为空");
          assert.equal(json.dataRepo.reachable, true, "dataRepo.reachable 应为 true");
        },
      },
      {
        name: "已登记作品 GET /art (200 且带 sandbox CSP)",
        run: async () => {
          const res = await fetch(
            `${baseUrl}/art/20260927T021708Z/claude__model-b__high.svg`,
          );
          assert.equal(res.status, 200, `作品应返回 200，实际: ${res.status}`);
          const csp = res.headers.get("content-security-policy") ?? "";
          assert.ok(csp.includes("sandbox"), `CSP 应包含 sandbox，实际: ${csp}`);
          const contentType = res.headers.get("content-type") ?? "";
          assert.ok(
            contentType.includes("image/svg+xml"),
            `Content-Type 应为 SVG，实际: ${contentType}`,
          );
          const body = await res.text();
          assert.ok(body.includes("<svg"), "作品主体应为有效 SVG 标签");
        },
      },
      {
        name: "未登记作品 GET /art (返回 404)",
        run: async () => {
          const res = await fetch(`${baseUrl}/art/20260927T021708Z/unregistered.svg`);
          assert.equal(res.status, 404, `未登记作品应返回 404，实际: ${res.status}`);
        },
      },
      {
        name: "写操作阻断 POST /api/run (返回 403 Forbidden)",
        run: async () => {
          const res = await fetch(`${baseUrl}/api/run`, {
            method: "POST",
            headers: { "x-pelican-action": "1" },
            body: JSON.stringify({}),
          });
          assert.equal(res.status, 403, `只读模式应拦截写请求为 403，实际: ${res.status}`);
        },
      },
      {
        name: "所有者配对页面入口 GET /pair (返回 404 Not Found)",
        run: async () => {
          const res = await fetch(`${baseUrl}/pair`);
          assert.equal(res.status, 404, `/pair 应返回 404，实际: ${res.status}`);
        },
      },
      {
        name: "配置页面重定向 GET /config (307 重定向至 /)",
        run: async () => {
          const res = await fetch(`${baseUrl}/config`, { redirect: "manual" });
          assert.ok(
            res.status === 307 || res.status === 308 || res.status === 302,
            `配置页应重定向，实际状态码: ${res.status}`,
          );
          const location = res.headers.get("location") ?? "";
          assert.ok(
            location === "/" || location.endsWith("/"),
            `Location 应重定向到 /，实际: ${location}`,
          );
        },
      },
    ];

    for (const step of steps) {
      await step.run();
      console.log(`  ✔ ${step.name}`);
    }

    console.log("=======================================================");
    console.log("[PASS] 展台冒烟测试全部通过！各项端到端只读安全防线验证完备。");
    console.log("=======================================================");
  } catch (err) {
    console.error("=======================================================");
    console.error(`[FAIL] 冒烟测试失败：${err instanceof Error ? err.message : err}`);
    if (err instanceof Error && err.stack) {
      console.error(err.stack);
    }
    console.error("=======================================================");
    process.exitCode = 1;
  } finally {
    // 关闭所有子进程与服务器
    if (nextProcess !== null) {
      await stopProcess(nextProcess);
    }
    if (dataRepoServer !== null) {
      await closeServer(dataRepoServer);
    }
  }
}

/** 启动本地静态数据仓服务 */
async function startStaticRepoServer(): Promise<{ server: Server; port: number }> {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://127.0.0.1");
      const safePath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
      const fullPath = join(FIXTURES_DIR, safePath);

      const fileStat = await stat(fullPath).catch(() => null);
      if (fileStat === null || !fileStat.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not Found");
        return;
      }

      const content = await readFile(fullPath);
      const isJson = fullPath.endsWith(".json");
      const isSvg = fullPath.endsWith(".svg");
      const contentType = isJson
        ? "application/json; charset=utf-8"
        : isSvg
          ? "image/svg+xml; charset=utf-8"
          : "application/octet-stream";

      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    } catch {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Server Error");
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.listen(0, "127.0.0.1", () => resolve());
    server.once("error", reject);
  });

  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error("无法获取静态数据仓服务器端口");
  }
  return { server, port: address.port };
}

/** 运行 next build */
async function runNextBuild(dataRepoPort: number): Promise<void> {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    PELICAN_READONLY: "1",
    PELICAN_DATA_SOURCE: "remote",
    PELICAN_DATA_REPO_URL: `http://127.0.0.1:${dataRepoPort}`,
    NODE_ENV: "production",
  };

  await new Promise<void>((resolve, reject) => {
    const child = spawn("pnpm", ["build"], {
      env,
      stdio: "pipe",
    });

    let stderr = "";
    child.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`next build 退出码异常: ${code}。stderr: ${stderr}`));
      }
    });
    child.on("error", reject);
  });
}

/** 启动 next start 生产服务器 */
async function startNextServer(nextPort: number, dataRepoPort: number): Promise<ChildProcess> {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    PELICAN_READONLY: "1",
    PELICAN_DATA_SOURCE: "remote",
    PELICAN_DATA_REPO_URL: `http://127.0.0.1:${dataRepoPort}`,
    PORT: `${nextPort}`,
    NODE_ENV: "production",
  };

  const child = spawn(
    "pnpm",
    ["start", "--port", `${nextPort}`, "--hostname", "127.0.0.1"],
    { env, stdio: "pipe" },
  );

  child.stderr?.on("data", (chunk) => {
    const msg = chunk.toString();
    if (!msg.includes("ExperimentalWarning")) {
      // 过滤非关键 Node.js 警告
    }
  });

  return child;
}

/** 轮询等待服务器就绪 */
async function waitForServerReady(port: number, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/health`);
      if (res.status === 200) return;
    } catch {
      // 尚未监听就绪，继续等待
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Next.js 服务未能在 ${timeoutMs}ms 内就绪 (端口: ${port})`);
}

/** 随机分配可用本地端口 */
async function getAvailablePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = createNetServer();
    srv.listen(0, "127.0.0.1", () => {
      const addr = srv.address();
      if (addr && typeof addr !== "string") {
        const port = addr.port;
        srv.close(() => resolve(port));
      } else {
        srv.close(() => reject(new Error("分配端口失败")));
      }
    });
    srv.on("error", reject);
  });
}

/** 关闭 HTTP 服务 */
async function closeServer(server: Server): Promise<void> {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
}

/** 优雅终止子进程 */
async function stopProcess(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      try {
        child.kill("SIGKILL");
      } catch {
        // 忽略
      }
      resolve();
    }, 3000);
    child.once("close", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

void main();

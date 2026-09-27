/**
 * 展台冒烟测试的子进程与服务器管理模块。
 */

import { spawn, type ChildProcess } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { createServer as createNetServer } from "node:net";
import { join, normalize } from "node:path";

const FIXTURES_DIR = join(process.cwd(), "test", "fixtures", "data-repo");

/** 处理静态数据仓 HTTP 请求 */
async function handleStaticFileRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
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
    const contentType = fullPath.endsWith(".json")
      ? "application/json; charset=utf-8"
      : fullPath.endsWith(".svg")
        ? "image/svg+xml; charset=utf-8"
        : "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Server Error");
  }
}

/** 启动本地静态数据仓 HTTP 服务 */
export async function startStaticRepoServer(): Promise<{ server: Server; port: number }> {
  const server = createServer(handleStaticFileRequest);

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

/** 运行 next build（只读远程模式） */
export async function runNextBuild(dataRepoPort: number): Promise<void> {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    PELICAN_READONLY: "1",
    PELICAN_DATA_SOURCE: "remote",
    PELICAN_DATA_REPO_URL: `http://127.0.0.1:${dataRepoPort}`,
    NODE_ENV: "production",
  };

  await new Promise<void>((resolve, reject) => {
    const child = spawn("pnpm", ["build"], { env, stdio: "pipe" });
    let stderr = "";
    child.stdout?.resume();
    child.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`next build 退出码异常: ${code}。stderr: ${stderr}`));
    });
    child.on("error", reject);
  });
}

/** 启动 next start 生产服务器 */
export async function startNextServer(
  nextPort: number,
  dataRepoPort: number,
): Promise<ChildProcess> {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    PELICAN_READONLY: "1",
    PELICAN_DATA_SOURCE: "remote",
    PELICAN_DATA_REPO_URL: `http://127.0.0.1:${dataRepoPort}`,
    PORT: `${nextPort}`,
    NODE_ENV: "production",
  };

  const child = spawn("pnpm", ["start", "--port", `${nextPort}`, "--hostname", "127.0.0.1"], {
    env,
    stdio: "pipe",
  });
  child.stdout?.resume();
  child.stderr?.resume();
  return child;
}

/** 轮询等待服务器就绪 */
export async function waitForServerReady(port: number, timeoutMs: number): Promise<void> {
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
export async function getAvailablePort(): Promise<number> {
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

/** 关闭 HTTP 服务，并在有界等待时间内强制退出 */
export async function closeServer(server: Server, timeoutMs: number = 5000): Promise<void> {
  return new Promise<void>((resolve) => {
    let finished = false;
    const finish = () => {
      if (!finished) {
        finished = true;
        resolve();
      }
    };

    const timer = setTimeout(finish, timeoutMs);
    timer.unref();

    try {
      if (typeof server.closeAllConnections === "function") {
        server.closeAllConnections();
      }
    } catch {
      // 忽略关闭异常
    }

    server.close(() => {
      clearTimeout(timer);
      finish();
    });
  });
}

/** 优雅终止子进程 */
export async function stopProcess(child: ChildProcess): Promise<void> {
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
    timer.unref();
    child.once("close", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

/**
 * 展台冒烟测试基础设施单测：验证 closeServer 对带 keep-alive 客户端连接的有界等待与强制关闭保证。
 * 每一步都设有上限，测试自身不会因网络或沙箱异常而无限等待。
 */

import assert from "node:assert/strict";
import http from "node:http";
import net from "node:net";
import { describe, it } from "node:test";
import { closeServer } from "../../scripts/showcase-smoke/servers";

const STEP_TIMEOUT_MS = 3000;

/** 给单步等待加上限，超时即拒绝，避免挂起 */
function withTimeout<T>(label: string, promise: Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} 超过 ${STEP_TIMEOUT_MS}ms`)), STEP_TIMEOUT_MS);
    timer.unref();
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); },
    );
  });
}

function listen(server: http.Server): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      if (addr === null || typeof addr === "string") {
        reject(new Error("无法获取监听端口"));
        return;
      }
      resolve(addr.port);
    });
  });
}

/** 建立一条发过请求、收到响应后仍保持打开的 keep-alive 连接 */
function openKeepAliveClient(port: number): Promise<net.Socket> {
  return new Promise<net.Socket>((resolve, reject) => {
    const client = net.connect({ host: "127.0.0.1", port });
    client.setTimeout(STEP_TIMEOUT_MS, () => client.destroy(new Error("客户端 socket 超时")));
    client.once("error", reject);
    client.once("data", () => resolve(client));
    client.once("connect", () => {
      client.write("GET / HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: keep-alive\r\n\r\n");
    });
  });
}

describe("showcase-smoke 服务基础设施", () => {
  it(
    "带一个未关闭的 keep-alive 客户端连接时，closeServer 仍在有界时间内完成",
    { timeout: 15_000 },
    async () => {
      const server = http.createServer((_req, res) => {
        res.writeHead(200, { "Content-Type": "text/plain", Connection: "keep-alive" });
        res.end("ok");
      });
      let client: net.Socket | null = null;

      try {
        const port = await withTimeout("监听", listen(server));
        client = await withTimeout("建立 keep-alive 连接", openKeepAliveClient(port));
        assert.strictEqual(client.destroyed, false);

        const start = Date.now();
        await closeServer(server, 2000);
        const duration = Date.now() - start;

        assert(duration < 2500, `closeServer 未在有界时间内完成，耗时 ${duration}ms`);
        assert.strictEqual(server.listening, false);
      } finally {
        client?.destroy();
        server.closeAllConnections();
        server.close();
      }
    },
  );
});

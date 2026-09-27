/**
 * 展台冒烟测试基础设施单测：验证 closeServer 对带 keep-alive 客户端连接的有界等待与强制关闭保证。
 */

import assert from "node:assert/strict";
import http from "node:http";
import net from "node:net";
import { describe, it } from "node:test";
import { closeServer } from "../../scripts/showcase-smoke/servers";

describe("showcase-smoke 服务基础设施", () => {
  it("带一个未关闭的 keep-alive 客户端连接时，closeServer 仍在有界时间内完成", async () => {
    const server = http.createServer((_req, res) => {
      res.writeHead(200, {
        "Content-Type": "text/plain",
        Connection: "keep-alive",
      });
      res.end("ok");
    });

    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", () => resolve());
    });

    const addr = server.address();
    assert(addr && typeof addr !== "string");
    const port = addr.port;

    // 建立一个 keep-alive 客户端长连接并发送请求
    const client = net.connect({ host: "127.0.0.1", port });
    await new Promise<void>((resolve) => {
      client.on("connect", () => {
        client.write(
          "GET / HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: keep-alive\r\n\r\n",
        );
        resolve();
      });
    });

    // 等待接收到 HTTP 响应，确保长连接处于就绪状态
    await new Promise<void>((resolve) => {
      client.once("data", () => resolve());
    });

    // 客户端保持 socket 打开（不调用 client.end() 或 destroy()）
    assert.strictEqual(client.destroyed, false);

    // 调用 closeServer，并设定 2000ms 有界等待
    const start = Date.now();
    await closeServer(server, 2000);
    const duration = Date.now() - start;

    // 断言有界时间内成功完成，且服务已不再监听
    assert(duration < 2500, `closeServer 未在有界时间内完成，耗时 ${duration}ms`);
    assert.strictEqual(server.listening, false);

    // 清理测试用的客户端连接
    client.destroy();
  });
});

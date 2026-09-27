/**
 * codex app-server 的最小 JSON-RPC 客户端（stdio，每行一条 JSON 消息）。
 *
 * 不用 `codex exec`：每个 exec 进程启动时各自刷新模型列表，并发时会报
 * “failed to refresh available models: timeout waiting for child process to exit”
 * 并卡死至超时。app-server 长驻，一轮内的 codex 调用各开一个 thread 共用它。
 *
 * 只实现基准需要的子集：请求/响应配对、按 threadId 分发通知、拒绝全部审批。
 */

import { LineSplitter, spawnDetached, terminateGroup } from "./exec";
import { asRecord, asString, parseJsonLine, recordAt, type JsonRecord } from "./json-lines";

/** 分发给订阅者的消息；进程意外退出时会收到一条合成的 EXIT_METHOD 消息 */
export type ThreadListener = (message: JsonRecord) => void;

export const EXIT_METHOD = "$exit";

const INITIALIZE_TIMEOUT_MS = 60_000;
/** stderr 只留尾部，避免长驻进程无限累积 */
const STDERR_TAIL_CHARS = 4_000;

/** 逐 token 的增量通知：完整内容会在 item/completed 里给出，订阅只会让存档膨胀 */
const OPTED_OUT_NOTIFICATIONS = [
  "item/agentMessage/delta",
  "item/reasoning/textDelta",
  "item/reasoning/summaryTextDelta",
  "item/reasoning/summaryPartAdded",
  "item/commandExecution/outputDelta",
  "item/fileChange/outputDelta",
];

/**
 * 审批全部拒绝，未知请求回“不支持”。每个服务端请求都必须应答，否则服务端会一直等待。
 */
const DECLINE_RESPONSES: Readonly<Record<string, JsonRecord>> = {
  "item/commandExecution/requestApproval": { decision: "decline" },
  "item/fileChange/requestApproval": { decision: "decline" },
  execCommandApproval: { decision: "denied" },
  applyPatchApproval: { decision: "denied" },
};

interface PendingRequest {
  resolve: (result: JsonRecord | null) => void;
  reject: (error: Error) => void;
}

type ServerProcess = ReturnType<typeof spawnDetached>;

export class CodexAppServer {
  private nextId = 1;
  private readonly pending = new Map<number, PendingRequest>();
  private readonly listeners = new Map<string, ThreadListener>();
  private exitError: Error | null = null;
  private stderrTail = "";

  private constructor(private readonly child: ServerProcess) {}

  static async start(): Promise<CodexAppServer> {
    const child = spawnDetached({ binary: "codex", args: ["app-server"] }, process.cwd());
    const server = new CodexAppServer(child);
    server.wire();

    await server.request(
      "initialize",
      {
        clientInfo: { name: "pelican-bench", version: "1.0.0" },
        capabilities: { optOutNotificationMethods: OPTED_OUT_NOTIFICATIONS },
      },
      INITIALIZE_TIMEOUT_MS,
    );
    server.send({ method: "initialized" });
    return server;
  }

  /** 发起请求并等待响应；超时或进程退出时 reject */
  request(method: string, params: JsonRecord, timeoutMs: number): Promise<JsonRecord | null> {
    if (this.exitError !== null) return Promise.reject(this.exitError);

    const id = this.nextId;
    this.nextId += 1;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`codex app-server 的 ${method} 在 ${timeoutMs}ms 内未响应`));
      }, timeoutMs);

      this.pending.set(id, {
        resolve: (result) => {
          clearTimeout(timer);
          resolve(result);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });
      this.send({ id, method, params });
    });
  }

  /** 订阅某个 thread 的通知与服务端请求，返回取消订阅函数 */
  subscribe(threadId: string, listener: ThreadListener): () => void {
    this.listeners.set(threadId, listener);
    return () => this.listeners.delete(threadId);
  }

  /** 结束长驻进程并终止整个进程组，避免残留子进程继续消耗配额 */
  async close(): Promise<void> {
    if (this.exitError !== null) return;
    const closed = new Promise<void>((resolve) => this.child.once("close", () => resolve()));
    this.child.stdin.end();
    terminateGroup(this.child.pid);
    await closed;
  }

  private wire(): void {
    const splitter = new LineSplitter((line) => this.dispatch(line));
    this.child.stdout.setEncoding("utf8");
    this.child.stderr.setEncoding("utf8");
    this.child.stdout.on("data", (chunk: string) => splitter.push(chunk));
    this.child.stderr.on("data", (chunk: string) => {
      this.stderrTail = (this.stderrTail + chunk).slice(-STDERR_TAIL_CHARS);
    });
    this.child.on("error", (cause) => {
      this.shutdown(new Error(`无法启动 codex app-server：${cause.message}`));
    });
    this.child.on("close", (code) => {
      const detail = this.stderrTail.trim().split("\n").slice(-3).join("\n");
      this.shutdown(new Error(`codex app-server 已退出（退出码 ${code}）${detail ? `：${detail}` : ""}`));
    });
  }

  private dispatch(line: string): void {
    const message = parseJsonLine(line);
    if (message === null) return;

    const method = asString(message.method);
    const hasId = message.id !== undefined && message.id !== null;

    if (method !== null && hasId) this.answerServerRequest(method, message);
    else if (hasId) this.settleResponse(message);
    else if (method !== null) this.routeToThread(message);
  }

  private settleResponse(message: JsonRecord): void {
    const pending = this.pending.get(Number(message.id));
    if (pending === undefined) return;
    this.pending.delete(Number(message.id));

    const error = asRecord(message.error);
    if (error !== null) {
      pending.reject(new Error(asString(error.message) ?? JSON.stringify(error)));
      return;
    }
    pending.resolve(asRecord(message.result));
  }

  private answerServerRequest(method: string, message: JsonRecord): void {
    // 转发给订阅者，存档里可见模型尝试执行的命令或改动的文件
    this.routeToThread(message);

    const decline = DECLINE_RESPONSES[method];
    if (decline !== undefined) {
      this.send({ id: message.id, result: decline });
      return;
    }
    this.send({
      id: message.id,
      error: { code: -32601, message: `pelican-bench 不支持 ${method}` },
    });
  }

  private routeToThread(message: JsonRecord): void {
    const params = asRecord(message.params);
    const threadId = asString(params?.threadId) ?? asString(recordAt(params, "thread")?.id);
    if (threadId === null) return;
    this.listeners.get(threadId)?.(message);
  }

  /** 进程已不可用：挂起的请求全部失败，正在等待的 thread 收到合成的退出消息 */
  private shutdown(error: Error): void {
    if (this.exitError !== null) return;
    this.exitError = error;

    for (const pending of this.pending.values()) pending.reject(error);
    this.pending.clear();

    const exitMessage = { method: EXIT_METHOD, params: { message: error.message } };
    for (const listener of this.listeners.values()) listener(exitMessage);
  }

  private send(message: JsonRecord): void {
    if (this.exitError !== null) return;
    this.child.stdin.write(`${JSON.stringify(message)}\n`);
  }
}

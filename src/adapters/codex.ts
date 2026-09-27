/**
 * Codex CLI 适配器，经由 `codex app-server`。
 *
 * 一轮一个 app-server 进程（第一次提问时惰性启动，close 时终止），每次提问开一个
 * ephemeral thread：`thread/start → turn/start → 等待 turn/completed`。
 * 不用 `codex exec` 的原因见 codex-app-server.ts。
 *
 * - 思考强度通过 turn/start 的 `effort` 字段传递；
 * - 沙箱只读、审批策略 never：模型尝试写盘或执行命令时由服务端直接拒绝，不会卡在
 *   等待审批上。
 */

import { CodexAppServer, EXIT_METHOD } from "./codex-app-server";
import { asArray, asRecord, asString, recordAt, type JsonRecord } from "./json-lines";
import type { AgentAdapter, AgentReply, AgentRequest, AgentSession } from "./types";

/** 超时后中断 turn 的等待上限；中断失败不影响本次记为超时 */
const INTERRUPT_TIMEOUT_MS = 10_000;

export const codexAdapter: AgentAdapter = {
  openSession(): AgentSession {
    let server: Promise<CodexAppServer> | null = null;

    return {
      async ask(request) {
        server ??= CodexAppServer.start();
        return askCodex(await server, request);
      },
      async close() {
        if (server === null) return;
        // 启动失败无需关闭，错误已由 ask 报告
        const started = await server.catch(() => null);
        await started?.close();
      },
    };
  },
};

/** 某个 turn 的通知逐条累积出的状态 */
interface TurnState {
  texts: string[];
  notes: string[];
  error: string | null;
  finished: boolean;
}

async function runTurn(
  server: CodexAppServer,
  threadId: string,
  watch: ThreadWatch,
  request: AgentRequest,
  remaining: () => number,
): Promise<{ timedOut: boolean }> {
  const turn = await server.request("turn/start", buildTurnParams(threadId, request), remaining());
  const turnId = asString(recordAt(turn, "turn")?.id);

  const settled = await settlesWithin(watch.finished, remaining(), request.signal);
  const timedOut = !settled && request.signal?.aborted !== true;
  // 超时或停止时中断 turn：app-server 长驻，不中断会继续消耗配额
  if (!settled && turnId !== null) {
    await server
      .request("turn/interrupt", { threadId, turnId }, INTERRUPT_TIMEOUT_MS)
      .catch(() => null);
  }
  return { timedOut };
}

async function askCodex(server: CodexAppServer, request: AgentRequest): Promise<AgentReply> {
  const { target, effortAdjustable, timeoutMs } = request;
  if (target.extraArgs.length > 0) {
    return failedReply(
      "codex 经由 app-server 调用，不接受命令行 extraArgs；请从该目标的配置中移除",
      effortAdjustable,
    );
  }

  const deadline = Date.now() + timeoutMs;
  const remaining = () => Math.max(deadline - Date.now(), 1);
  const threadId = await startThread(server, request, remaining());
  const watch = watchThread(server, threadId);

  try {
    const { timedOut } = await runTurn(server, threadId, watch, request, remaining);
    return {
      text: watch.state.texts.join("\n\n"),
      // 只读沙箱下无法写文件，作品只在回答正文里
      writtenFiles: [],
      transcript: watch.transcript.join("\n"),
      timedOut,
      error: watch.state.error,
      notes: watch.state.notes,
      effortHonored: effortAdjustable,
    };
  } finally {
    watch.unsubscribe();
  }
}

async function startThread(
  server: CodexAppServer,
  request: AgentRequest,
  timeoutMs: number,
): Promise<string> {
  const started = await server.request(
    "thread/start",
    {
      model: request.target.model,
      cwd: request.workdir,
      sandbox: "read-only",
      // untrusted：每条命令与每次改文件都进入审批，而适配器一律拒绝（见 codex-app-server.ts），
      // 模型因此读不到任何文件；never 会让 read-only 沙箱内的读取直接放行
      approvalPolicy: "untrusted",
      // 基准调用不需要留在 codex 的会话历史里
      ephemeral: true,
    },
    timeoutMs,
  );
  const threadId = asString(recordAt(started, "thread")?.id);
  if (threadId === null) throw new Error("codex app-server 的 thread/start 未返回 thread id");
  return threadId;
}

export function buildTurnParams(threadId: string, request: AgentRequest): JsonRecord {
  return {
    threadId,
    input: [{ type: "text", text: request.promptText, text_elements: [] }],
    // 不可调的模型不传 effort，交给服务端用模型默认值
    ...(request.effortAdjustable ? { effort: request.appliedEffort } : {}),
  };
}

interface ThreadWatch {
  state: TurnState;
  transcript: string[];
  /** turn 结束（完成、失败或进程退出）时 resolve */
  finished: Promise<void>;
  unsubscribe: () => void;
}

/** 必须在 turn/start 之前订阅，否则可能漏掉开头的通知 */
function watchThread(server: CodexAppServer, threadId: string): ThreadWatch {
  const state: TurnState = { texts: [], notes: [], error: null, finished: false };
  const transcript: string[] = [];
  let markFinished = () => {};
  const finished = new Promise<void>((resolve) => (markFinished = resolve));

  const unsubscribe = server.subscribe(threadId, (message) => {
    transcript.push(JSON.stringify(message));
    absorbNotification(state, message);
    if (state.finished) markFinished();
  });
  return { state, transcript, finished, unsubscribe };
}

function absorbNotification(state: TurnState, message: JsonRecord): void {
  const params = asRecord(message.params);

  switch (message.method) {
    case "item/completed":
      absorbItem(state, asRecord(params?.item));
      return;
    case "error":
      // willRetry 为真时服务端会自行重试，不算失败
      if (params?.willRetry !== true) {
        state.error = asString(recordAt(params, "error")?.message) ?? "codex 报告错误";
      }
      return;
    case "turn/completed": {
      const turn = recordAt(params, "turn");
      if (turn?.status === "failed") {
        state.error = asString(recordAt(turn, "error")?.message) ?? "codex turn 失败";
      }
      state.finished = true;
      return;
    }
    case EXIT_METHOD:
      state.error = asString(params?.message) ?? "codex app-server 已退出";
      state.finished = true;
      return;
    default:
      return;
  }
}

function absorbItem(state: TurnState, item: JsonRecord | null): void {
  if (item?.type === "agentMessage") {
    const text = asString(item.text);
    if (text !== null && text.trim() !== "") state.texts.push(text);
    return;
  }
  if (item?.type === "fileChange") {
    const paths = asArray(item.changes)
      .map((change) => asString(asRecord(change)?.path))
      .filter((path): path is string => path !== null);
    state.notes.push(`模型尝试写文件（只读沙箱已拦截）：${paths.join(", ")}`);
  }
}

/** promise 在时限内完成返回 true；超时或 signal 触发返回 false。不取消 promise 本身 */
async function settlesWithin(promise: Promise<void>, timeoutMs: number, signal?: AbortSignal): Promise<boolean> {
  if (signal?.aborted === true) return false;
  let timer: NodeJS.Timeout | undefined;
  let onAbort: (() => void) | undefined;
  const giveUp = new Promise<false>((resolve) => {
    timer = setTimeout(() => resolve(false), timeoutMs);
    onAbort = () => resolve(false);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
  const settled = await Promise.race([promise.then(() => true as const), giveUp]);
  clearTimeout(timer);
  if (onAbort !== undefined) signal?.removeEventListener("abort", onAbort);
  return settled;
}

function failedReply(error: string, effortHonored: boolean): AgentReply {
  return {
    text: "",
    writtenFiles: [],
    transcript: "",
    timedOut: false,
    error,
    notes: [],
    effortHonored,
  };
}

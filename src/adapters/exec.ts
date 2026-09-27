/** 子进程执行器：运行命令并逐行交出输出，不涉及任何 CLI 的语义 */

import { spawn, type ChildProcess } from "node:child_process";

export interface Command {
  /** 可执行文件名，交由 PATH 解析 */
  binary: string;
  args: string[];
}

export interface StreamOptions {
  cwd: string;
  timeoutMs: number;
  /** 轮次被停止时触发，按超时的同一方式终止整个进程组 */
  signal?: AbortSignal;
  /** stdout 每收到完整一行回调一次 */
  onLine: (line: string) => void;
}

export interface ExecOutcome {
  stdout: string;
  stderr: string;
  /** 被超时终止时为 null */
  exitCode: number | null;
  timedOut: boolean;
}

/** SIGTERM 之后给 CLI 自己收尾的宽限期 */
const GRACE_MS = 5_000;

interface StreamContext {
  stdoutChunks: string[];
  stderrChunks: string[];
  splitter: LineSplitter;
  timedOut: boolean;
  settled: boolean;
}

function setupTermination(
  pid: number | undefined,
  timeoutMs: number,
  signal: AbortSignal | undefined,
  onTimeout: () => void,
): { killTimer: NodeJS.Timeout; cleanupSignal: () => void } {
  const killTimer = setTimeout(() => {
    onTimeout();
    terminateGroup(pid);
  }, timeoutMs);

  const onAbort = (): void => terminateGroup(pid);
  if (signal?.aborted === true) onAbort();
  else signal?.addEventListener("abort", onAbort, { once: true });

  const cleanupSignal = (): void => {
    signal?.removeEventListener("abort", onAbort);
  };
  return { killTimer, cleanupSignal };
}

function pipeChildOutput(child: ChildProcess, ctx: StreamContext): void {
  child.stdout?.setEncoding("utf8");
  child.stderr?.setEncoding("utf8");
  child.stdout?.on("data", (chunk: string) => {
    ctx.stdoutChunks.push(chunk);
    ctx.splitter.push(chunk);
  });
  child.stderr?.on("data", (chunk: string) => ctx.stderrChunks.push(chunk));
}

/**
 * 执行一次调用，超时则终止整个进程组（先 SIGTERM，宽限期后 SIGKILL）。
 * CLI 会派生子进程，只杀 CLI 本身会留下孤儿进程继续占用模型配额。
 */
export async function execStreaming(
  command: Command,
  options: StreamOptions,
): Promise<ExecOutcome> {
  return new Promise((resolve, reject) => {
    const child = spawnDetached(command, options.cwd);
    const ctx: StreamContext = {
      stdoutChunks: [],
      stderrChunks: [],
      splitter: new LineSplitter(options.onLine),
      timedOut: false,
      settled: false,
    };

    const { killTimer, cleanupSignal } = setupTermination(
      child.pid,
      options.timeoutMs,
      options.signal,
      () => { ctx.timedOut = true; },
    );

    pipeChildOutput(child, ctx);

    child.on("error", (cause) => {
      if (ctx.settled) return;
      ctx.settled = true;
      clearTimeout(killTimer);
      cleanupSignal();
      reject(new Error(`无法启动 ${command.binary}：${cause.message}`));
    });

    child.on("close", (code) => {
      if (ctx.settled) return;
      ctx.settled = true;
      clearTimeout(killTimer);
      cleanupSignal();
      ctx.splitter.flush();
      resolve({
        stdout: ctx.stdoutChunks.join(""),
        stderr: ctx.stderrChunks.join(""),
        exitCode: ctx.timedOut ? null : code,
        timedOut: ctx.timedOut,
      });
    });

    // 提示词经参数传入；stdin 须立即关闭，否则部分 CLI 会一直等待输入
    child.stdin?.end();
  });
}

/**
 * 以独立进程组启动（detached），信号可送达整个进程组。
 * CI / NO_COLOR 关闭交互式渲染与颜色码，保持输出可解析。
 */
export function spawnDetached(command: Command, cwd: string) {
  return spawn(command.binary, command.args, {
    cwd,
    detached: true,
    stdio: ["pipe", "pipe", "pipe"],
    env: { ...process.env, NO_COLOR: "1", CI: "1" },
  });
}

/** 向进程组发 SIGTERM，宽限期后 SIGKILL */
export function terminateGroup(pid: number | undefined): void {
  killGroup(pid, "SIGTERM");
  setTimeout(() => killGroup(pid, "SIGKILL"), GRACE_MS).unref();
}

/** 负 pid 表示整个进程组 */
function killGroup(pid: number | undefined, signal: NodeJS.Signals): void {
  if (pid === undefined) return;
  try {
    process.kill(-pid, signal);
  } catch {
    // 进程组已退出时抛 ESRCH，忽略
  }
}

/** 把任意切分的数据块重组为完整的行；管道不保证按行交付 */
export class LineSplitter {
  private pending = "";

  constructor(private readonly onLine: (line: string) => void) {}

  push(chunk: string): void {
    const parts = (this.pending + chunk).split("\n");
    this.pending = parts.pop() ?? "";
    for (const line of parts) this.emit(line);
  }

  /** 进程结束时最后一行可能没有换行符 */
  flush(): void {
    this.emit(this.pending);
    this.pending = "";
  }

  private emit(line: string): void {
    if (line.trim() !== "") this.onLine(line);
  }
}

/** 存档用的原始记录：stdout 在前，stderr 附后 */
export function composeTranscript(outcome: Pick<ExecOutcome, "stdout" | "stderr">): string {
  if (outcome.stderr.trim() === "") return outcome.stdout;
  return `${outcome.stdout}\n===== stderr =====\n${outcome.stderr}`;
}

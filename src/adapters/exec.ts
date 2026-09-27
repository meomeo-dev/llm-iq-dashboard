/** 子进程执行器：运行命令并逐行交出输出，不涉及任何 CLI 的语义 */

import { spawn } from "node:child_process";

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

    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];
    const splitter = new LineSplitter(options.onLine);
    let timedOut = false;
    let settled = false;

    const killTimer = setTimeout(() => {
      timedOut = true;
      terminateGroup(child.pid);
    }, options.timeoutMs);
    const onAbort = (): void => terminateGroup(child.pid);
    // 轮次已停止时立即终止刚启动的进程
    if (options.signal?.aborted === true) onAbort();
    else options.signal?.addEventListener("abort", onAbort, { once: true });

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      stdoutChunks.push(chunk);
      splitter.push(chunk);
    });
    child.stderr.on("data", (chunk: string) => stderrChunks.push(chunk));

    child.on("error", (cause) => {
      if (settled) return;
      settled = true;
      clearTimeout(killTimer);
      options.signal?.removeEventListener("abort", onAbort);
      reject(new Error(`无法启动 ${command.binary}：${cause.message}`));
    });

    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(killTimer);
      options.signal?.removeEventListener("abort", onAbort);
      splitter.flush();
      resolve({
        stdout: stdoutChunks.join(""),
        stderr: stderrChunks.join(""),
        exitCode: timedOut ? null : code,
        timedOut,
      });
    });

    // 提示词经参数传入；stdin 须立即关闭，否则部分 CLI 会一直等待输入
    child.stdin.end();
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

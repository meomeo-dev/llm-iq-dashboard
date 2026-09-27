/**
 * 探测用的命令执行器，执行元信息查询（help、模型列表、登录状态）。
 * 长时间的模型调用走 adapters/exec.ts；这里失败即返回，不抛错。
 */

import { execFile, type ExecFileException } from "node:child_process";
import { tmpdir } from "node:os";

/**
 * 探测超时。`agy models` 需联网拉取目录，单次约 14 秒、并行时更慢；
 * 超时过短会导致间歇性的空目录。
 */
const PROBE_TIMEOUT_MS = 60_000;

export interface CommandOutput {
  ok: boolean;
  stdout: string;
  error: string | null;
  /** 可执行文件不在 PATH 中（ENOENT）。预检据此区分“没装”与“装了但出错” */
  notFound: boolean;
}

export async function runProbeCommand(
  binary: string,
  args: string[],
): Promise<CommandOutput> {
  return new Promise((resolve) => {
    execFile(
      binary,
      args,
      {
        timeout: PROBE_TIMEOUT_MS,
        maxBuffer: 8 * 1024 * 1024,
        cwd: tmpdir(),
        env: { ...process.env, NO_COLOR: "1", CI: "1" },
      },
      (cause, stdout, stderr) => {
        // stdout 为空时改用 stderr：agy 的 --help 写在 stderr 且以 0 退出；
        // 两个流不合并，以免污染 codex 输出在 stdout 的 JSON
        const usable = stdout.trim() !== "" ? stdout : stderr;
        resolve({
          ok: usable.trim() !== "",
          stdout: usable,
          error: cause !== null ? describeFailure(binary, cause) : null,
          notFound: cause?.code === "ENOENT",
        });
      },
    );
  });
}

function describeFailure(binary: string, cause: ExecFileException): string {
  if (cause.code === "ENOENT") return `${binary} 不在 PATH 中`;
  if (cause.killed === true) return `${binary} 探测超时`;
  return `${binary} 探测失败：${cause.message.split("\n")[0] ?? cause.message}`;
}

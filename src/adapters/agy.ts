/**
 * agy CLI 适配器。
 *
 * 调用形态：`agy --print <prompt> --model <model> [--effort <level>]
 *            --output-format stream-json --sandbox --dangerously-skip-permissions`
 *
 * 强度参数：有强度变体的模型必须用基名 + `--effort`，无变体的模型不能带
 * `--effort`；带后缀的完整标识可用，但不能再附 `--effort`。违反时 agy 的报错：
 *
 *     --model gemini-3.8-flash-low --effort high → conflicts with --effort=high
 *     --model gemini-3.8-flash（无 --effort）    → requires --effort (...)
 *     --model claude-sonnet-4-6 --effort low     → --effort is not supported for model
 *
 * 最后一种在模型清单拉取失败时也会误报，见 CATALOG_RETRY_DELAYS_MS。
 *
 * 作品取回：agy 在 print 模式下不加载工作目录里的 GEMINI.md / AGENTS.md，gemini 按
 * agy 自带的系统提示把 SVG 写进 `~/.gemini/antigravity-cli/scratch/`，最终回答常为
 * 空，因此解析事件流中的写入路径。
 *
 * 权限：只加 `--sandbox`，不加 `--dangerously-skip-permissions`。headless 模式下未授权的
 * 命令与文件读取会被自动拒绝，模型读不到工作目录之外的任何东西；作品仍经
 * `write_to_file` 事件取回（写入不需要审批）。
 */

import { EFFORT_LEVELS, type EffortLevel } from "../core/types";
import { composeTranscript, execStreaming } from "./exec";
import {
  asArray,
  asRecord,
  asString,
  parseJsonLine,
  recordAt,
  tailLines,
  type JsonRecord,
} from "./json-lines";
import { statelessSession } from "./stateless-session";
import type { AgentAdapter, AgentReply, AgentRequest, WrittenFile } from "./types";
import { findSvgPaths, readWrittenFile } from "./written-files";

export const agyAdapter: AgentAdapter = {
  openSession: () => statelessSession(askAgy),
};

/** 事件流逐行累积出的状态 */
interface AgyStream {
  /** 调用开始时刻，用于排除更早调用留下的同名旧文件 */
  startedAt: Date;
  /** 按事件顺序排列的作品候选，越靠后越新 */
  candidates: FileCandidate[];
  result: JsonRecord | null;
  errors: string[];
}

interface FileCandidate {
  path: string;
  /**
   * 写文件工具的产出在事件到达时立即读回，因为 scratch 目录全局共享，并发调用可能
   * 随后覆盖同名文件；命令里提到的路径（null）在进程结束后再读。
   */
  earlyRead: Promise<WrittenFile | null> | null;
}

const WRITE_TOOL = "write_to_file";

/** 见文件头“权限”一节 */
const HEADLESS_PERMISSION_ARGS = ["--sandbox"];

/**
 * 模型清单拉取失败时的重试间隔。agy 启动时拉取清单以把基名解析为带档位的变体；
 * 拉取偶尔以 EOF 失败（日志 `loadCodeAssist: EOF`），此时会把合法的 `--effort`
 * 误报为不受支持并立即退出。
 */
const CATALOG_RETRY_DELAYS_MS = [5_000, 15_000];

async function askAgy(request: AgentRequest): Promise<AgentReply> {
  const transcripts: string[] = [];
  const notes: string[] = [];
  for (let attempt = 0; ; attempt += 1) {
    const reply = await askAgyOnce(request);
    transcripts.push(reply.transcript);
    const delay = CATALOG_RETRY_DELAYS_MS[attempt];
    if (!isCatalogGlitch(reply, request) || delay === undefined || request.signal?.aborted === true) {
      // 保留每次尝试的原始输出，供排查 agy 故障
      return {
        ...reply,
        transcript: transcripts.join("\n\n===== retry =====\n\n"),
        notes: [...notes, ...reply.notes],
      };
    }
    notes.push(
      `agy 拉取模型清单失败，误报“--effort 不受支持”；` +
        `${delay / 1000} 秒后第 ${attempt + 1} 次重试`,
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

/**
 * 识别模型清单拉取失败：能力目录标明模型可调（因此带了 --effort），agy 却报不支持。
 * 不可调的模型不带 --effort，不会被误判重试。
 */
function isCatalogGlitch(reply: AgentReply, request: AgentRequest): boolean {
  if (!request.effortAdjustable || hasEffortSuffix(request.target.model)) return false;
  return reply.error?.includes("--effort is not supported for model") === true;
}

async function askAgyOnce(request: AgentRequest): Promise<AgentReply> {
  const { target, promptText, workdir, timeoutMs, signal } = request;
  const effortArgs = resolveEffortArgs(target.model, request);
  const stream: AgyStream = { startedAt: new Date(), candidates: [], result: null, errors: [] };

  const outcome = await execStreaming(
    {
      binary: "agy",
      args: [
        "--print",
        promptText,
        "--model",
        target.model,
        ...effortArgs,
        "--output-format",
        "stream-json",
        ...HEADLESS_PERMISSION_ARGS.filter((arg) => !target.extraArgs.includes(arg)),
        ...target.extraArgs,
      ],
    },
    { cwd: workdir, timeoutMs, signal, onLine: (line) => absorbEvent(stream, line) },
  );

  return {
    text: asString(recordAt(stream.result, "result")?.response) ?? "",
    writtenFiles: await readCandidates(stream),
    transcript: composeTranscript(outcome),
    timedOut: outcome.timedOut,
    error: describeError(stream, outcome.exitCode, outcome.stderr),
    notes: describeDenials(stream.result),
    effortHonored: effortArgs.length > 0 || hasEffortSuffix(target.model),
  };
}

function absorbEvent(stream: AgyStream, line: string): void {
  const event = parseJsonLine(line);
  if (event === null) return;

  const error = readErrorMessage(event);
  if (error !== null) stream.errors.push(error);

  if (event.event === "result") {
    stream.result = event;
    return;
  }

  const step = recordAt(event, "step_update");
  if (step?.step_type !== "tool" || step.state !== "DONE") return;

  const parameters = recordAt(step, "tool_info", "parameters");
  const writtenPath = asString(parameters?.TargetFile);
  if (step.tool_name === WRITE_TOOL && writtenPath !== null) {
    const earlyRead = readWrittenFile(writtenPath, stream.startedAt);
    stream.candidates.push({ path: writtenPath, earlyRead });
    return;
  }
  // 脚本生成的 SVG 不经过写文件工具，只会在后续命令（渲染、校验）里被提到
  const commandLine = asString(parameters?.CommandLine);
  for (const path of findSvgPaths(commandLine ?? "")) {
    stream.candidates.push({ path, earlyRead: null });
  }
}

/** 同一路径被多次提到时只保留最后一次的位置，顺序即新旧 */
async function readCandidates(stream: AgyStream): Promise<WrittenFile[]> {
  const lastIndexByPath = new Map(stream.candidates.map((item, index) => [item.path, index]));
  const latest = stream.candidates.filter(
    (item, index) => lastIndexByPath.get(item.path) === index,
  );
  const files = await Promise.all(
    latest.map((item) => item.earlyRead ?? readWrittenFile(item.path, stream.startedAt)),
  );
  return files.filter((file): file is WrittenFile => file !== null);
}

/** 参数类错误的位置随 agy 版本变化：顶层 `error`、`error.message` 或 `result.error` */
function readErrorMessage(event: JsonRecord): string | null {
  return (
    asString(event.error) ??
    asString(recordAt(event, "error")?.message) ??
    asString(recordAt(event, "result")?.error)
  );
}

function describeError(
  stream: AgyStream,
  exitCode: number | null,
  stderr: string,
): string | null {
  if (stream.errors.length > 0) return stream.errors.join("\n");
  if (exitCode === null || exitCode === 0) return null;
  // 被拒绝的工具调用也会让 agy 以非零码退出，但那是模型行为，由 notes 表达
  if (stream.result !== null) return null;
  return tailLines(stderr, 3) || `agy 以退出码 ${exitCode} 结束`;
}

function describeDenials(result: JsonRecord | null): string[] {
  const actions = asArray(recordAt(result, "result")?.denied_actions)
    .map((action) => {
      const record = asRecord(action);
      return asString(record?.display_name) ?? asString(record?.action);
    })
    .filter((name): name is string => name !== null);
  if (actions.length === 0) return [];
  return [`模型调用的工具被 headless 模式拒绝：${[...new Set(actions)].join(", ")}`];
}

/** 后缀检查必须在前：带后缀的标识即使被判为可调，再附 `--effort` 也会报 conflicts */
function resolveEffortArgs(model: string, request: AgentRequest): string[] {
  if (hasEffortSuffix(model)) return [];
  if (!request.effortAdjustable) return [];
  return ["--effort", request.appliedEffort];
}

function hasEffortSuffix(model: string): boolean {
  return EFFORT_LEVELS.some((effort: EffortLevel) => model.endsWith(`-${effort}`));
}

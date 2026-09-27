/**
 * Claude Code CLI 适配器。
 *
 * 调用形态：`claude -p <prompt> --model <model> --effort <level>
 *            --output-format stream-json --verbose --tools ""`
 *
 * 使用事件流：Write 工具写出的 SVG 完整内容在 `tool_use` 事件里，被拒的工具列在
 * `result` 事件的 `permission_denials` 里；单个 JSON 信封只含最后一句回答。
 */

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

export const claudeAdapter: AgentAdapter = {
  openSession: () => statelessSession(askClaude),
};

/** 事件流逐行累积出的状态 */
interface ClaudeStream {
  texts: string[];
  /**
   * 最后一轮回答的正文片段。输出达到上限时 CLI 自动追加续写提示，模型在新消息里
   * 从断处接着写，而 `result` 只含最后一条消息，因此需自行拼接续写链。
   */
  answer: string[];
  continuations: number;
  writtenFiles: WrittenFile[];
  result: JsonRecord | null;
}

/**
 * Claude Code 2.1.x 在输出达到上限后自动发出的续写提示的开头。
 * CLI 改了措辞时匹配失败，退化为只读 result。
 */
const CONTINUATION_PROMPT = "Output token limit hit";

export function buildClaudeArgs(request: AgentRequest): string[] {
  const { target, promptText, appliedEffort } = request;
  return [
    "-p",
    promptText,
    "--model",
    target.model,
    "--effort",
    appliedEffort,
    "--output-format",
    "stream-json",
    // print 模式下 stream-json 必须配 --verbose，否则 CLI 拒绝执行
    "--verbose",
    // 基准只要一张内联 SVG，不给模型任何工具：读文件、跑命令一律拒绝
    "--tools",
    "",
    ...target.extraArgs,
  ];
}

async function askClaude(request: AgentRequest): Promise<AgentReply> {
  const { workdir, timeoutMs, signal } = request;
  const stream: ClaudeStream = { texts: [], answer: [], continuations: 0, writtenFiles: [], result: null };

  const outcome = await execStreaming(
    {
      binary: "claude",
      args: buildClaudeArgs(request),
    },
    { cwd: workdir, timeoutMs, signal, onLine: (line) => absorbEvent(stream, line) },
  );

  return {
    text: finalAnswer(stream),
    writtenFiles: stream.writtenFiles,
    transcript: composeTranscript(outcome),
    timedOut: outcome.timedOut,
    error: describeError(stream.result, outcome.exitCode, outcome.stderr),
    notes: [...describeContinuations(stream), ...describeDenials(stream.result)],
    // claude 的 --effort 对所有模型一致生效
    effortHonored: true,
  };
}

function absorbEvent(stream: ClaudeStream, line: string): void {
  const event = parseJsonLine(line);
  if (event === null) return;

  if (event.type === "result") {
    stream.result = event;
    return;
  }
  if (event.type === "user") {
    // 续写提示之后接着同一段回答；其余 user 事件是工具结果，其后回答从头累积
    if (isContinuationPrompt(event)) stream.continuations += 1;
    else stream.answer = [];
    return;
  }
  if (event.type !== "assistant") return;

  for (const block of asArray(recordAt(event, "message")?.content)) {
    const part = asRecord(block);
    if (part?.type === "text") {
      const text = asString(part.text);
      if (text !== null) {
        stream.texts.push(text);
        stream.answer.push(text);
      }
    }
    if (part?.type === "tool_use") captureWrite(stream, asRecord(part.input));
  }
}

/**
 * 有续写时片段直接相接（断点可能在属性值中间，不能加分隔符）；否则取 result；
 * 超时没有 result 时退回已收到的正文片段。
 */
function finalAnswer(stream: ClaudeStream): string {
  if (stream.continuations > 0 && stream.answer.length > 0) return stream.answer.join("");
  return asString(stream.result?.result) ?? stream.texts.join("\n\n");
}

function isContinuationPrompt(event: JsonRecord): boolean {
  const content = recordAt(event, "message")?.content;
  if (typeof content === "string") return content.startsWith(CONTINUATION_PROMPT);
  return asArray(content).some((block) => asString(asRecord(block)?.text)?.startsWith(CONTINUATION_PROMPT) === true);
}

function describeContinuations(stream: ClaudeStream): string[] {
  if (stream.continuations === 0) return [];
  return [`单次输出达到上限，CLI 自动续写 ${stream.continuations} 次；回答按续写链拼接`];
}

/** Write 工具的入参已含完整文件内容，无需读盘 */
function captureWrite(stream: ClaudeStream, input: JsonRecord | null): void {
  const path = asString(input?.file_path);
  const content = asString(input?.content);
  if (path !== null && content !== null) stream.writtenFiles.push({ path, content });
}

function describeError(
  result: JsonRecord | null,
  exitCode: number | null,
  stderr: string,
): string | null {
  if (result !== null) {
    if (result.is_error !== true) return null;
    return asString(result.result) ?? `claude 报告失败（${String(result.subtype)}）`;
  }
  // 无 result 事件：超时（由 timedOut 表达）或 CLI 启动阶段即退出
  if (exitCode === null || exitCode === 0) return null;
  return tailLines(stderr, 3) || `claude 以退出码 ${exitCode} 结束`;
}

function describeDenials(result: JsonRecord | null): string[] {
  const tools = asArray(result?.permission_denials)
    .map((denial) => asString(asRecord(denial)?.tool_name))
    .filter((name): name is string => name !== null);
  if (tools.length === 0) return [];
  return [`模型调用的工具被 headless 模式拒绝：${[...new Set(tools)].join(", ")}`];
}

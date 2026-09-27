/**
 * 从 CLI 原始输出（落盘的 .txt 转录）解析 token 用量。
 *
 * 三家的用量口径不同，这里统一成互不重叠的计价项：
 * - claude：result 事件的 usage。input、缓存写入（分 5 分钟与 1 小时）、缓存读取、
 *   output 四项并列；thinking 含在 output 内。一次调用只有一个 result 事件（自动续写
 *   发生在同一进程里）。
 * - codex：thread/tokenUsage/updated 通知的 total 是线程累计值，取最后一条。
 *   cachedInputTokens、cacheWriteInputTokens 是 inputTokens 的子集，reasoning 是
 *   outputTokens 的子集（totalTokens = input + output）。
 * - agy：result 事件的 result.usage（整次调用的累计值；不取 step_update 的逐步用量）。
 *   cache_read_tokens 与 input_tokens 并列（缓存读取可多于 input），thinking 含在
 *   output 内（total = input + output）。重试时有多个 result，逐个累加，失败的尝试
 *   同样消耗 token。
 *
 * 转录里没有用量事件（旧版 CLI、调用未开始即失败）时返回 null，不记作 0。
 */

import type { CliKind } from "../core/types";
import { asNumber, asString, parseJsonLine, recordAt, type JsonRecord } from "../adapters/json-lines";
import type { TokenUsage, UsageMeter } from "./types";

/** 先用子串筛掉无关行，避免对几百 KB 的转录逐行 JSON.parse */
const MARKERS: Record<CliKind, string> = {
  claude: '"type":"result"',
  codex: "thread/tokenUsage/updated",
  agy: '"event":"result"',
};

type Tally = Partial<Record<UsageMeter, number>>;

export function usageFromTranscript(cli: CliKind, transcript: string): TokenUsage | null {
  const events: JsonRecord[] = [];
  for (const line of transcript.split("\n")) {
    if (!line.includes(MARKERS[cli])) continue;
    const event = parseJsonLine(line);
    if (event !== null) events.push(event);
  }
  if (cli === "claude") return claudeUsage(events);
  if (cli === "codex") return codexUsage(events);
  return agyUsage(events);
}

function count(record: JsonRecord | null, key: string): number {
  return record === null ? 0 : (asNumber(record[key]) ?? 0);
}

function add(tally: Tally, meter: UsageMeter, tokens: number): void {
  if (tokens > 0) tally[meter] = (tally[meter] ?? 0) + tokens;
}

function claudeUsage(events: JsonRecord[]): TokenUsage | null {
  const results = events.filter((event) => event.type === "result" && recordAt(event, "usage") !== null);
  if (results.length === 0) return null;
  const tokens: Tally = {};
  let reasoning = 0;
  let reported: number | null = null;
  let fast = false;
  for (const result of results) {
    const usage = recordAt(result, "usage");
    const creation = recordAt(usage, "cache_creation");
    add(tokens, "input", count(usage, "input_tokens"));
    add(tokens, "cache_read", count(usage, "cache_read_input_tokens"));
    add(tokens, "output", count(usage, "output_tokens"));
    // 旧版只给缓存写入总数、不分 TTL，按默认的 5 分钟档计
    if (creation === null) add(tokens, "cache_write_5m", count(usage, "cache_creation_input_tokens"));
    add(tokens, "cache_write_5m", count(creation, "ephemeral_5m_input_tokens"));
    add(tokens, "cache_write_1h", count(creation, "ephemeral_1h_input_tokens"));
    reasoning += count(recordAt(usage, "output_tokens_details"), "thinking_tokens");
    fast ||= asString(usage?.speed) === "fast";
    const cost = asNumber(result.total_cost_usd);
    if (cost !== null) reported = (reported ?? 0) + cost;
  }
  return { tokens, reasoningTokens: reasoning, serviceTier: fast ? "fast" : "standard", reportedCostUsd: reported };
}

function codexUsage(events: JsonRecord[]): TokenUsage | null {
  const last = events.filter((event) => event.method === "thread/tokenUsage/updated").at(-1);
  const total = recordAt(last ?? null, "params", "tokenUsage", "total");
  if (total === null) return null;
  const cached = count(total, "cachedInputTokens");
  const written = count(total, "cacheWriteInputTokens");
  const tokens: Tally = {};
  add(tokens, "input", Math.max(0, count(total, "inputTokens") - cached - written));
  add(tokens, "cache_read", cached);
  add(tokens, "cache_write", written);
  add(tokens, "output", count(total, "outputTokens"));
  const reasoning = count(total, "reasoningOutputTokens");
  return { tokens, reasoningTokens: reasoning, serviceTier: "standard", reportedCostUsd: null };
}

function agyUsage(events: JsonRecord[]): TokenUsage | null {
  const usages = events
    .filter((event) => event.event === "result")
    .map((event) => recordAt(event, "result", "usage"))
    .filter((usage): usage is JsonRecord => usage !== null);
  if (usages.length === 0) return null;
  const tokens: Tally = {};
  let reasoning = 0;
  for (const usage of usages) {
    add(tokens, "input", count(usage, "input_tokens"));
    add(tokens, "cache_read", count(usage, "cache_read_tokens"));
    add(tokens, "output", count(usage, "output_tokens"));
    reasoning += count(usage, "thinking_tokens");
  }
  return { tokens, reasoningTokens: reasoning, serviceTier: "standard", reportedCostUsd: null };
}

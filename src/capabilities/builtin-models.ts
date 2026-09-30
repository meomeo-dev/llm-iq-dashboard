/**
 * 内置候选模型，供没有历史记录的新环境使用，UI 上标为 `builtin`，排在探测结果之后，
 * 会随 CLI 升级过时，CLI 发布新模型时随代码更新。
 * - claude 没有列举命令，只能靠这份清单；
 * - codex 的列举要求登录态，只经 profile 调用、不登录的部署（如容器）探测不到模型；
 * - agy 的列举也要登录，且常因网络失败，探测不到时靠这份清单列出候选。
 * 档位照搬 CLI 的声明：空数组表示该模型不可调强度。
 */

import type { CliKind } from "../core/types";
import type { ProbedModel } from "./types";

const CLAUDE_EFFORTS = ["low", "medium", "high", "xhigh", "max"] as const;

const CLAUDE_FALLBACK: ProbedModel[] = [
  { id: "claude-opus-5-5", displayName: "Claude Opus 5.5", efforts: [...CLAUDE_EFFORTS], description: null },
  { id: "claude-sonnet-5-5", displayName: "Claude Sonnet 5.5", efforts: [...CLAUDE_EFFORTS], description: null },
  { id: "claude-opus-5", displayName: "Claude Opus 5", efforts: [...CLAUDE_EFFORTS], description: null },
  { id: "claude-sonnet-5", displayName: "Claude Sonnet 5", efforts: [...CLAUDE_EFFORTS], description: null },
  {
    id: "claude-fable-5-1",
    displayName: "Claude Fable 5.1",
    efforts: [...CLAUDE_EFFORTS],
    description: null,
  },
  {
    id: "claude-haiku-4-5-20251001",
    displayName: "Claude Haiku 4.5",
    efforts: [...CLAUDE_EFFORTS],
    description: null,
  },
];

const CODEX_EFFORTS_TO_MAX = ["low", "medium", "high", "xhigh", "max"] as const;
const CODEX_EFFORTS_TO_ULTRA = [...CODEX_EFFORTS_TO_MAX, "ultra"] as const;

const CODEX_FALLBACK: ProbedModel[] = [
  { id: "gpt-6.1-sol", displayName: "GPT-6.1-Sol", efforts: [...CODEX_EFFORTS_TO_ULTRA], description: null },
  { id: "gpt-6-sol", displayName: "GPT-6-Sol", efforts: [...CODEX_EFFORTS_TO_ULTRA], description: null },
  { id: "gpt-6-astra", displayName: "GPT-6-Astra", efforts: [...CODEX_EFFORTS_TO_ULTRA], description: null },
  { id: "gpt-6-luna", displayName: "GPT-6-Luna", efforts: [...CODEX_EFFORTS_TO_MAX], description: null },
];

const AGY_FALLBACK: ProbedModel[] = [
  { id: "gemini-3.8-flash", displayName: "Gemini 3.8 Flash", efforts: ["low", "medium", "high"], description: null },
  { id: "gemini-3.7-flash", displayName: "Gemini 3.7 Flash", efforts: ["low", "medium", "high"], description: null },
  { id: "gemini-3.6-flash", displayName: "Gemini 3.6 Flash", efforts: ["low", "medium", "high"], description: null },
  { id: "gemini-3.1-pro", displayName: "Gemini 3.1 Pro", efforts: ["low", "high"], description: null },
  { id: "claude-opus-4-6-thinking", displayName: "Claude Opus 4.6 (Thinking)", efforts: [], description: null },
  { id: "claude-sonnet-4-6", displayName: "Claude Sonnet 4.6 (Thinking)", efforts: [], description: null },
  { id: "gpt-oss-120b", displayName: "GPT-OSS 120B", efforts: ["medium"], description: null },
];

const BUILTIN: Readonly<Record<CliKind, ProbedModel[]>> = {
  claude: CLAUDE_FALLBACK,
  codex: CODEX_FALLBACK,
  agy: AGY_FALLBACK,
};

export function builtinModels(cli: CliKind): ProbedModel[] {
  return BUILTIN[cli];
}

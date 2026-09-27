/**
 * 内置候选模型，供没有历史记录的新环境使用，UI 上标为 `builtin`，会随 CLI 升级过时。
 * 只有 claude（无列举命令）需要；能探测的 CLI 不加内置清单，避免过时名字混入目录。
 */

import type { CliKind } from "../core/types";
import type { ProbedModel } from "./types";

const CLAUDE_EFFORTS = ["low", "medium", "high", "xhigh", "max"] as const;

const CLAUDE_FALLBACK: ProbedModel[] = [
  { id: "claude-opus-5-5", displayName: "Claude Opus 5.5", efforts: [...CLAUDE_EFFORTS], description: null },
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

const BUILTIN: Readonly<Partial<Record<CliKind, ProbedModel[]>>> = {
  claude: CLAUDE_FALLBACK,
};

export function builtinModels(cli: CliKind): ProbedModel[] {
  return BUILTIN[cli] ?? [];
}

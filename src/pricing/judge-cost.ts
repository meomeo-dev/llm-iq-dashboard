/**
 * 读取侧：AI 层裁判的用量与成本。用量在评审时从裁判转录解析并存在评审记录里；成本与作品
 * 同口径，按价格目录在读取时折算，不落盘。裁判走登录态，不涉及上游倍率。
 */

import type { Judgement } from "../core/judge/schema";
import { isCliKind } from "../core/config/parsers-common";
import { estimateCost } from "./catalog";
import { loadPriceCatalog } from "./catalog-files";
import type { CostEstimate, TokenUsage } from "./types";

export interface JudgeCost {
  /** 裁判 id，形如 agy/gemini-3.8-flash@high */
  judgeId: string;
  usage: TokenUsage | null;
  asks: number;
  cost: CostEstimate;
}

/** 没有 AI 层裁判时为 null；裁判 id 解析不出 cli / model 时按无法计价处理 */
export function judgeCostOf(judgement: Judgement | null): JudgeCost | null {
  const actor = judgement?.judges.find((j) => j.kind === "ai");
  if (!actor) return null;
  const usage = actor.usage ?? null;
  const call = parseJudgeId(actor.id, actor.judgedAt);
  const cost = call === null
    ? estimateCost(loadPriceCatalog(), { cli: "claude", model: "", startedAt: actor.judgedAt }, null)
    : estimateCost(loadPriceCatalog(), call, usage);
  return { judgeId: actor.id, usage, asks: actor.asks ?? 0, cost };
}

function parseJudgeId(id: string, startedAt: string): { cli: "claude" | "codex" | "agy"; model: string; startedAt: string } | null {
  const slash = id.indexOf("/");
  const at = id.lastIndexOf("@");
  if (slash < 0) return null;
  const cli = id.slice(0, slash);
  const model = at > slash ? id.slice(slash + 1, at) : id.slice(slash + 1);
  return isCliKind(cli) && model !== "" ? { cli, model, startedAt } : null;
}

/** 结果卡片与单独查看页共用的文案与格式；不带 "use client"，服务端组件也会引用。 */

import { criterionFloors } from "@/core/judge/schema";
import type { Judgement, Verdict } from "@/core/judge/schema";
import type { DashboardCard } from "@/core/types";

export const STATUS_TEXT: Record<DashboardCard["status"], string> = {
  ok: "成功",
  "no-svg": "无 SVG",
  error: "调用失败",
  timeout: "超时",
};

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  // 先取整到秒再拆分：分开取整时 119.6s 会写成 1m60s
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}m${total % 60}s`;
}

export function formatBytes(bytes: number): string {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

/** token 数与体积同一种写法：千以上一位小数加 K，不带单位字——页脚里谁都知道这是 token */
export function formatTokens(tokens: number): string {
  return tokens < 1000 ? `${tokens}` : `${(tokens / 1000).toFixed(1)}K`;
}

/** 单独查看页的地址；只有抽出了 SVG 的结果才有 */
export function viewHref(card: Pick<DashboardCard, "runId" | "svgFile">): string | null {
  return card.svgFile === null ? null : `/view/${card.runId}/${encodeURIComponent(card.svgFile)}`;
}

/** 原样的 SVG 文件（沙箱响应头，见 app/art/[runId]/[file]/route.ts） */
export function rawSvgHref(card: Pick<DashboardCard, "runId" | "svgFile">): string | null {
  return card.svgFile === null ? null : `/art/${card.runId}/${encodeURIComponent(card.svgFile)}`;
}

/** API 等价成本的简写；无法计价时为"—"，部分计价加"≥"表示下限 */
export function formatCost(cost: DashboardCard["cost"]): string {
  if (cost.usd === null) return "—";
  const prefix = cost.status === "partial" ? "≥" : "";
  // 页脚为定宽单行：一美元以下保留三位小数，明细见悬停说明
  if (cost.usd < 0.001) return `${prefix}<$0.001`;
  return `${prefix}$${cost.usd.toFixed(cost.usd < 1 ? 3 : 2)}`;
}

/** 成本的悬停说明：口径、逐项明细、目录版本，以及 CLI 自报成本（可对照） */
export function costTitle(card: Pick<DashboardCard, "cost" | "usage" | "profile">): string {
  const { cost, usage } = card;
  const lines = [
    "API 等价成本：按模型厂商自营 API 标价折算（global、按量、基础上下文档）",
    // 第三方上游的倍率只在信息卡里显示，这里的数字不乘倍率
    card.profile === undefined ? null : `经上游 ${card.profile}：显示官价，未乘倍率`,
    cost.modelId === null ? null : `${cost.channelId ?? "?"} · ${cost.modelId} · ${cost.serviceTier}`,
    ...cost.lines.map(
      (line) => `${line.meter}  ${line.tokens.toLocaleString("en-US")} tok × $${line.unitPrice}/M = $${line.usd.toFixed(4)}`,
    ),
    usage !== null && usage.reasoningTokens > 0 ? `其中推理 ${usage.reasoningTokens.toLocaleString("en-US")} tok 已计入 output` : null,
    usage?.reportedCostUsd == null ? null : `CLI 自报 $${usage.reportedCostUsd.toFixed(4)}`,
    cost.note,
    cost.catalogTag === null ? null : `价格目录 ${cost.catalogTag}`,
  ];
  return lines.filter((line): line is string => line !== null).join("\n");
}

/** 评审标签文案（ACR-019）：online 智商在线、degraded 降智、pending 待复核 */
export const JUDGE_TEXT: Record<Verdict, string> = {
  online: "智商在线",
  degraded: "降智",
  pending: "待复核",
};

/**
 * 裁判成本的悬停说明：第一行谁评的、几次问答，其后与作品成本同一套明细（口径、计价项逐行、
 * 目录版本），两处悬停读起来口径一致。
 */
export function judgeCostLine(judgeCost: DashboardCard["judgeCost"]): string | null {
  if (judgeCost === null) return null;
  return [`AI 层裁判 ${judgeCost.judgeId} · ${judgeCost.asks} 次问答`, costTitle({ cost: judgeCost.cost, usage: judgeCost.usage })].join("\n");
}

/** 页脚第三行的短句：钱、问答次数、token 总数（与体积同一种写法）；裁判是谁与逐项明细放在悬停说明里 */
export function judgeCostBrief(judgeCost: NonNullable<DashboardCard["judgeCost"]>): string {
  const tokens = judgeCost.usage === null
    ? "用量未知"
    : formatTokens(Object.values(judgeCost.usage.tokens).reduce((sum, n) => sum + n, 0));
  return `裁判 ${formatCost(judgeCost.cost)} · ${judgeCost.asks} 次问答 · ${tokens}`;
}

/** 评审的悬停说明：闸门与每条标准的分与理由（关键标准低于门槛的标出），末尾是裁判成本 */
export function judgeTitle(judge: Judgement, judgeCost: DashboardCard["judgeCost"] = null): string {
  const costLine = judgeCostLine(judgeCost);
  const floors = criterionFloors(judge.rubric);
  const lines = [
    `${JUDGE_TEXT[judge.total.verdict]} ${judge.total.score}/${judge.total.maxScore}（及格线 ${judge.rubric.passThreshold}）`,
    ...judge.gates.map((g) => `${g.passed ? "✓" : "✗"} ${g.id} ${g.title}：${g.evidence}`),
    ...judge.criteria.map((c) =>
      c.score === null
        ? `${c.id} -/${c.maxScore} ${c.title}：待 AI 层判定`
        : `${c.id} ${c.score}/${c.maxScore}${c.score < (floors.get(c.id) ?? 0) ? "（低于门槛，不计分）" : ""} ${c.title}：${c.reason ?? ""}`,
    ),
    ...(costLine === null ? [] : [costLine]),
  ];
  return lines.join("\n");
}

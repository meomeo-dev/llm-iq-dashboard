/** 结果卡片与单独查看页共用的文案与格式；不带 "use client"，服务端组件也会引用。 */

import { criterionFloors } from "@/core/judge/schema";
import type { Judgement, Verdict } from "@/core/judge/schema";
import type { AttemptStatus, DashboardCard } from "@/core/types";
import { localizeCandidateLabel, localizeCriterion, localizeGate, type Locale } from "@/i18n";
import type { PendingJudgeState } from "../run-status/run-phase";

export const STATUS_TEXT: Record<DashboardCard["status"], string> = {
  ok: "成功",
  "no-svg": "无 SVG",
  error: "调用失败",
  timeout: "超时",
};

const STATUS_TEXT_EN: Record<DashboardCard["status"], string> = {
  ok: "OK",
  "no-svg": "No SVG",
  error: "Error",
  timeout: "Timeout",
};

export function statusText(status: DashboardCard["status"], locale: Locale = "zh-CN"): string {
  return locale === "en" ? STATUS_TEXT_EN[status] : STATUS_TEXT[status];
}

export function formatBindingBadge(name: string, value: string, locale: Locale = "zh-CN"): string {
  if (locale !== "en") return `${name}: ${value}`;
  const labelName = name === "回目" ? "Scene" : name;
  return `${labelName}: ${localizeCandidateLabel(value, value, locale)}`;
}

export function localizeCardError(
  error: string | null,
  _status: AttemptStatus = "error",
  locale: Locale = "zh-CN",
): string | null {
  if (error === null || locale !== "en") return error;
  if (error === "已脱敏，未发布") return "Redacted (Unpublished)";
  const redactedMatch = /^已脱敏，未发布（(.+)）$/.exec(error);
  if (redactedMatch) return `Redacted, unpublished (${redactedMatch[1]})`;
  const timeoutMatch = /^超过 (\d+) 秒未返回，已终止[\s\S]*$/.exec(error);
  if (timeoutMatch) {
    return `Timed out after ${timeoutMatch[1]}s and terminated. CLI latency may fluctuate; increase run.timeoutByCli or run.timeoutByEffort in configuration.`;
  }
  if (error === "回答中未找到成对的 <svg>…</svg>") {
    return "No matching <svg>…</svg> tags found in response";
  }
  if (error === "输出含凭据指纹，已拦截：作品与转录未保存" || error === "输出含凭据指纹，已拦截且不落盘") {
    return "Output contained credential fingerprint and was blocked without saving";
  }
  const preflightMatch = /^预检未通过，未发起调用：(.+)$/.exec(error);
  if (preflightMatch) return `Preflight check failed, call skipped: ${preflightMatch[1]}`;
  const unregisteredMatch = /^profile (.+) 未登记，未发起调用$/.exec(error);
  if (unregisteredMatch) return `Profile ${unregisteredMatch[1]} is not registered; call skipped`;
  const disabledMatch = /^profile (.+) 已停用，未发起调用$/.exec(error);
  if (disabledMatch) return `Profile ${disabledMatch[1]} is disabled; call skipped`;
  const missingKeyMatch = /^profile (.+) 还没有填 API key，未发起调用$/.exec(error);
  if (missingKeyMatch) return `Profile ${missingKeyMatch[1]} is missing an API key; call skipped`;
  return error;
}

function localizeCostNote(note: string | null, locale: Locale): string | null {
  if (note === null || locale !== "en") return note;
  if (note === "转录中没有用量记录") return "No token usage record in transcript";
  const syncMatch = /^价格目录未同步，运行 (.+)$/.exec(note);
  if (syncMatch) return `Pricing catalog not synced; run ${syncMatch[1]}`;
  const modelMatch = /^价格目录中找不到唯一对应 (.+) 的模型$/.exec(note);
  if (modelMatch) return `No unique model match for ${modelMatch[1]} in pricing catalog`;
  const priceMatch = /^价格目录中没有 (.+) 在该时刻的 (.+) 档自营 API 价格$/.exec(note);
  if (priceMatch) return `No official API price in catalog for ${priceMatch[1]} (${priceMatch[2]} tier) at that time`;
  const meterMatch = /^目录中没有这些计价项的价格：(.+)$/.exec(note);
  if (meterMatch) return `Missing catalog prices for meters: ${meterMatch[1]!.replaceAll("、", ", ")}`;
  return note;
}

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
export function costTitle(
  card: Pick<DashboardCard, "cost" | "usage" | "profile">,
  locale: Locale = "zh-CN",
): string {
  const { cost, usage } = card;
  const isEn = locale === "en";
  const lines = [
    isEn
      ? "API-Equivalent Cost: calculated at official vendor API rates (global, pay-as-you-go, base context tier)"
      : "API 等价成本：按模型厂商自营 API 标价折算（global、按量、基础上下文档）",
    card.profile === undefined
      ? null
      : isEn
        ? `Via profile ${card.profile}: official list price (multiplier not applied)`
        : `经上游 ${card.profile}：显示官价，未乘倍率`,
    cost.modelId === null ? null : `${cost.channelId ?? "?"} · ${cost.modelId} · ${cost.serviceTier}`,
    ...cost.lines.map(
      (line) => `${line.meter}  ${line.tokens.toLocaleString("en-US")} tok × $${line.unitPrice}/M = $${line.usd.toFixed(4)}`,
    ),
    usage !== null && usage.reasoningTokens > 0
      ? isEn
        ? `Includes ${usage.reasoningTokens.toLocaleString("en-US")} reasoning tok in output`
        : `其中推理 ${usage.reasoningTokens.toLocaleString("en-US")} tok 已计入 output`
      : null,
    usage?.reportedCostUsd == null
      ? null
      : isEn
        ? `CLI self-reported $${usage.reportedCostUsd.toFixed(4)}`
        : `CLI 自报 $${usage.reportedCostUsd.toFixed(4)}`,
    localizeCostNote(cost.note, locale),
    cost.catalogTag === null ? null : isEn ? `Pricing catalog ${cost.catalogTag}` : `价格目录 ${cost.catalogTag}`,
  ];
  return lines.filter((line): line is string => line !== null).join("\n");
}

/** 评审标签文案（ACR-019）：online 智商在线、degraded 降智、pending 待复核 */
export const JUDGE_TEXT: Record<Verdict, string> = {
  online: "智商在线",
  degraded: "降智",
  pending: "待复核",
};

const JUDGE_TEXT_EN: Record<Verdict, string> = {
  online: "Sharp",
  degraded: "Degraded",
  pending: "Pending",
};

export function judgeText(verdict: Verdict, locale: Locale = "zh-CN"): string {
  return locale === "en" ? JUDGE_TEXT_EN[verdict] : JUDGE_TEXT[verdict];
}

/** 待复核作品在评审队列里的实时状态文案与悬停说明（见 run-phase.ts 的 pendingJudgeState） */
export const PENDING_JUDGE_TEXT: Record<PendingJudgeState, { label: string; title: string }> = {
  queued: { label: "待评审", title: "排队等 AI 层评审" },
  running: { label: "评审中…", title: "AI 层裁判正在看联系图打分" },
  interrupted: { label: "评审中断", title: "评审进程中途退出，执行器下次启动时续评" },
};

const PENDING_JUDGE_TEXT_EN: Record<PendingJudgeState, { label: string; title: string }> = {
  queued: { label: "Queued", title: "Queued for AI judge evaluation" },
  running: { label: "Judging…", title: "AI judge is inspecting contact sheets" },
  interrupted: { label: "Judge Interrupted", title: "Judging exited early and will resume on next runner start" },
};

export function pendingJudgeText(
  state: PendingJudgeState,
  locale: Locale = "zh-CN",
): { label: string; title: string } {
  return locale === "en" ? PENDING_JUDGE_TEXT_EN[state] : PENDING_JUDGE_TEXT[state];
}

/**
 * 裁判成本的悬停说明：第一行谁评的、几次问答，其后与作品成本同一套明细（口径、计价项逐行、
 * 目录版本），两处悬停读起来口径一致。
 */
export function judgeCostLine(
  judgeCost: DashboardCard["judgeCost"],
  locale: Locale = "zh-CN",
): string | null {
  if (judgeCost === null) return null;
  const head =
    locale === "en"
      ? `AI Judge ${judgeCost.judgeId} · ${judgeCost.asks} turns`
      : `AI 层裁判 ${judgeCost.judgeId} · ${judgeCost.asks} 次问答`;
  return [head, costTitle({ cost: judgeCost.cost, usage: judgeCost.usage }, locale)].join("\n");
}

/** 页脚第三行的短句：钱、问答次数、token 总数（与体积同一种写法）；裁判是谁与逐项明细放在悬停说明里 */
export function judgeCostBrief(
  judgeCost: NonNullable<DashboardCard["judgeCost"]>,
  locale: Locale = "zh-CN",
): string {
  const isEn = locale === "en";
  const tokens =
    judgeCost.usage === null
      ? isEn
        ? "usage unknown"
        : "用量未知"
      : formatTokens(Object.values(judgeCost.usage.tokens).reduce((sum, n) => sum + n, 0));
  return isEn
    ? `Judge ${formatCost(judgeCost.cost)} · ${judgeCost.asks} turns · ${tokens}`
    : `裁判 ${formatCost(judgeCost.cost)} · ${judgeCost.asks} 次问答 · ${tokens}`;
}

/** 评审的悬停说明：闸门与每条标准的分与理由（关键标准低于门槛的标出），末尾是裁判成本 */
export function judgeTitle(
  judge: Judgement,
  judgeCost: DashboardCard["judgeCost"] = null,
  locale: Locale = "zh-CN",
): string {
  const isEn = locale === "en";
  const costLine = judgeCostLine(judgeCost, locale);
  const floors = criterionFloors(judge.rubric);
  const lines = [
    isEn
      ? `${judgeText(judge.total.verdict, locale)} ${judge.total.score}/${judge.total.maxScore} (pass threshold ${judge.rubric.passThreshold})`
      : `${JUDGE_TEXT[judge.total.verdict]} ${judge.total.score}/${judge.total.maxScore}（及格线 ${judge.rubric.passThreshold}）`,
    ...judge.gates.map((rawGate) => {
      const g = localizeGate(rawGate, locale);
      return `${g.passed ? "✓" : "✗"} ${g.id} ${g.title}${isEn ? ": " : "："}${g.evidence}`;
    }),
    ...judge.criteria.map((rawCrit) => {
      const c = localizeCriterion(rawCrit, locale);
      if (c.score === null) {
        return isEn
          ? `${c.id} -/${c.maxScore} ${c.title}: pending AI judge`
          : `${c.id} -/${c.maxScore} ${c.title}：待 AI 层判定`;
      }
      const floorNote =
        c.score < (floors.get(c.id) ?? 0)
          ? isEn
            ? " (below floor, not counted)"
            : "（低于门槛，不计分）"
          : "";
      return `${c.id} ${c.score}/${c.maxScore}${floorNote} ${c.title}${isEn ? ": " : "："}${c.reason ?? ""}`;
    }),
    ...(costLine === null ? [] : [costLine]),
  ];
  return lines.join("\n");
}

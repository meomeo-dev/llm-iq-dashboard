/**
 * 价格目录（meomeo-dev/llm-pricing-catalog 的 Release 附件）的查价逻辑，纯函数、不碰磁盘。
 *
 * 计价口径是"API 等价成本"：模型厂商自营 API（anthropic-api、openai-api、gemini-api）
 * 的按量标价，global 地域、不含套餐与承诺折扣，按调用开始时刻取当时生效的价格。
 * 只取基础上下文档（context_min_tokens = 0）：用量是一次调用的累计值，拆不出单次
 * 请求的输入长度；基准题的单次请求远低于各家长上下文阶梯（200K 起）。
 */

import { commandHint } from "../core/command-hint";
import type { CliKind } from "../core/types";
import type { CostEstimate, CostLine, TokenUsage, UsageMeter } from "./types";

export const FIRST_PARTY_CHANNELS = ["anthropic-api", "openai-api", "gemini-api"] as const;

/** CLI → 目录里的客户端 ID；客户端专有的模型标签（如 agy 的 gemini-3.1-pro-high）按它解析 */
export const CLIENT_OF_CLI: Record<CliKind, string> = {
  claude: "claude-code",
  codex: "codex",
  agy: "agy",
};

export interface PriceRow {
  modelId: string;
  channelId: string;
  serviceTier: string;
  meter: string;
  /** 每百万 token 的单价（USD） */
  amount: number;
  validFrom: string;
  validTo: string | null;
}

export interface IdentifierRow {
  identifier: string;
  identifierKey: string;
  namespaceKind: string;
  clientId: string;
  modelId: string;
  impliedServiceTier: string;
  validFrom: string | null;
  validTo: string | null;
}

export interface PriceCatalog {
  tag: string;
  prices: PriceRow[];
  identifiers: IdentifierRow[];
}

/** 与目录 identifier_key 同一公式：小写，空格、下划线与点号统一为连字符 */
export function identifierKey(text: string): string {
  return text.replace(/[ _.]/g, "-").toLowerCase();
}

function validAt(row: { validFrom: string | null; validTo: string | null }, at: string): boolean {
  return (row.validFrom === null || row.validFrom <= at) && (row.validTo === null || at < row.validTo);
}

/**
 * 模型名 → 目录模型。先按原文精确匹配，再按宽松键匹配；同一名字在该 CLI 的客户端
 * 命名空间里有登记时只认那里的登记。命中多个模型时不猜，返回 null。
 */
export function resolveModel(
  catalog: PriceCatalog,
  cli: CliKind,
  label: string,
  at: string,
): IdentifierRow | null {
  const client = CLIENT_OF_CLI[cli];
  const inScope = catalog.identifiers.filter(
    (row) => validAt(row, at) && (row.clientId === client || row.namespaceKind === "catalog"),
  );
  for (const matches of [
    inScope.filter((row) => row.identifier === label),
    inScope.filter((row) => row.identifierKey === identifierKey(label)),
  ]) {
    const own = matches.filter((row) => row.clientId === client);
    const chosen = own.length > 0 ? own : matches;
    if (new Set(chosen.map((row) => row.modelId)).size === 1) return chosen[0] ?? null;
  }
  return null;
}

/** 某模型在厂商自营渠道、某服务档、某时刻生效的单价（按计价项） */
export function pricesAt(
  catalog: PriceCatalog,
  modelId: string,
  serviceTier: string,
  at: string,
): { channelId: string; byMeter: Map<string, number> } | null {
  const rows = catalog.prices.filter((row) => row.modelId === modelId);
  const channelId = FIRST_PARTY_CHANNELS.find((channel) => rows.some((row) => row.channelId === channel));
  if (channelId === undefined) return null;
  const current = rows.filter(
    (row) => row.channelId === channelId && row.serviceTier === serviceTier && validAt(row, at),
  );
  if (current.length === 0) return null;
  return { channelId, byMeter: new Map(current.map((row) => [row.meter, row.amount])) };
}

/** 一次调用的 API 等价成本 */
export function estimateCost(
  catalog: PriceCatalog | null,
  call: { cli: CliKind; model: string; startedAt: string },
  usage: TokenUsage | null,
): CostEstimate {
  const unpriced = (note: string, extra: Partial<CostEstimate> = {}): CostEstimate => ({
    status: "unpriced", usd: null, modelId: null, channelId: null,
    serviceTier: usage?.serviceTier ?? "standard", catalogTag: catalog?.tag ?? null,
    lines: [], note, ...extra,
  });
  if (usage === null) return unpriced("转录中没有用量记录");
  if (catalog === null) return unpriced(`价格目录未同步，运行 ${commandHint("pnpm pricing:sync")}`);
  const model = resolveModel(catalog, call.cli, call.model, call.startedAt);
  if (model === null) return unpriced(`价格目录中找不到唯一对应 ${call.model} 的模型`);
  const tier = usage.serviceTier === "fast" ? "fast" : model.impliedServiceTier || "standard";
  const prices = pricesAt(catalog, model.modelId, tier, call.startedAt);
  if (prices === null) {
    return unpriced(`价格目录中没有 ${model.modelId} 在该时刻的 ${tier} 档自营 API 价格`, {
      modelId: model.modelId, serviceTier: tier,
    });
  }
  return priceUsage(usage, prices, { modelId: model.modelId, serviceTier: tier, catalogTag: catalog.tag });
}

function priceUsage(
  usage: TokenUsage,
  prices: { channelId: string; byMeter: Map<string, number> },
  identity: Pick<CostEstimate, "modelId" | "serviceTier" | "catalogTag">,
): CostEstimate {
  const lines: CostLine[] = [];
  const missing: UsageMeter[] = [];
  for (const [meter, tokens] of Object.entries(usage.tokens) as [UsageMeter, number][]) {
    const unitPrice = prices.byMeter.get(meter);
    if (unitPrice === undefined) missing.push(meter);
    else lines.push({ meter, tokens, unitPrice, usd: (tokens * unitPrice) / 1_000_000 });
  }
  return {
    ...identity,
    status: missing.length === 0 ? "priced" : "partial",
    usd: lines.reduce((sum, line) => sum + line.usd, 0),
    channelId: prices.channelId,
    lines,
    note: missing.length === 0 ? null : `目录中没有这些计价项的价格：${missing.join("、")}`,
  };
}

/**
 * 用量与成本的类型。
 *
 * 用量是事实（CLI 报告的 token 数），成本是派生值（按价格目录折算）。run.json 只记
 * 用量，成本在读取时按调用时刻的目录价计算，目录更正价格后历史成本随之更新。
 */

/** 计价项，取值与价格目录的 meter_id 一致 */
export type UsageMeter =
  | "input"
  | "cache_read"
  | "cache_write"
  | "cache_write_5m"
  | "cache_write_1h"
  | "output";

export interface TokenUsage {
  /** 各计价项的 token 数，彼此不重叠：input 不含缓存读写，output 含推理 token */
  tokens: Partial<Record<UsageMeter, number>>;
  /** 推理（思考）token，已计入 output，只供展示 */
  reasoningTokens: number;
  /** 服务档：claude 的快速模式为 fast，其余为 standard */
  serviceTier: "standard" | "fast";
  /** CLI 自报的美元成本（仅 claude 提供），用于核对目录折算 */
  reportedCostUsd: number | null;
}

/** 按计价项折算的一行 */
export interface CostLine {
  meter: UsageMeter;
  tokens: number;
  /** 每百万 token 的单价（USD） */
  unitPrice: number;
  usd: number;
}

/**
 * 一次调用的"API 等价成本"：按模型厂商自营 API 的标价（global、按量、基础上下文档）
 * 折算，与实际是否经订阅调用无关。
 *
 * - priced：用到的计价项都有价格
 * - partial：部分计价项目录里没有价格，usd 只含有价格的部分
 * - unpriced：无法计价（没有用量、模型解析不到、目录未同步或没有该档价格），见 note
 */
export interface CostEstimate {
  status: "priced" | "partial" | "unpriced";
  usd: number | null;
  modelId: string | null;
  channelId: string | null;
  serviceTier: string;
  /** 价格目录的 Release tag，标明成本出自哪一版数据 */
  catalogTag: string | null;
  lines: CostLine[];
  note: string | null;
}

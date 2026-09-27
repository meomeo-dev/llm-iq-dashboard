/** 领域类型（domain types），不依赖 Next.js、文件系统或 CLI 细节，前后端共用。 */

import type { CostEstimate, TokenUsage } from "../pricing/types";
import type { RenderedPrompt } from "./variables";

/** 被调度的命令行工具种类 */
export type CliKind = "claude" | "codex" | "agy";

export const CLI_KINDS: readonly CliKind[] = ["claude", "codex", "agy"];

/**
 * 统一的思考强度刻度（reasoning effort），取三家 CLI 原生取值的并集，由适配器映射。
 * EFFORT_LEVELS 的顺序即强度由低到高，foldEffort 依赖此顺序。
 */
export type EffortLevel = "low" | "medium" | "high" | "xhigh" | "max" | "ultra";

export const EFFORT_LEVELS: readonly EffortLevel[] = [
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
  "ultra",
];

/**
 * 把请求档位折叠为 supported 中不超过它的最高档（如只支持 low/high 时 medium → low）；
 * 请求低于所有支持档位时取最低档。
 */
export function foldEffort(
  requested: EffortLevel,
  supported: readonly EffortLevel[],
): EffortLevel {
  if (supported.length === 0) return requested;
  if (supported.includes(requested)) return requested;

  const ceiling = EFFORT_LEVELS.indexOf(requested);
  const reachable = supported
    .filter((level) => EFFORT_LEVELS.indexOf(level) < ceiling)
    .sort((a, b) => EFFORT_LEVELS.indexOf(b) - EFFORT_LEVELS.indexOf(a));

  const lowest = [...supported].sort(
    (a, b) => EFFORT_LEVELS.indexOf(a) - EFFORT_LEVELS.indexOf(b),
  )[0] as EffortLevel;
  return reachable[0] ?? lowest;
}

/**
 * 由 CLI、模型、强度派生目标标识，同时用作产物文件名。
 * 服务端配置加载与浏览器配置界面共用此规则，保证 id 与历史产物一致。
 */
export function buildTargetId(
  cli: CliKind,
  model: string,
  effort: EffortLevel,
): string {
  return `${cli}__${sanitizeSegment(model)}__${effort}`;
}

/** 折叠路径不安全的字符，使 id 可以直接当文件名用 */
function sanitizeSegment(value: string): string {
  return [...value].map((ch) => (isFilenameSafe(ch) ? ch : "-")).join("");
}

function isFilenameSafe(ch: string): boolean {
  const isDigit = ch >= "0" && ch <= "9";
  const isLower = ch >= "a" && ch <= "z";
  const isUpper = ch >= "A" && ch <= "Z";
  return isDigit || isLower || isUpper || ch === "-" || ch === ".";
}

/** 一次调度中的一个被测对象：CLI × 模型 × 思考强度 */
export interface Target {
  /** 稳定标识，形如 `claude__claude-opus-5__high`，同时用作产物文件名 */
  id: string;
  cli: CliKind;
  model: string;
  effort: EffortLevel;
  /** 仪表盘上显示的人类可读名称 */
  label: string;
  /** 单次调用的超时上限（毫秒） */
  timeoutMs: number;
  /** 透传给该 CLI 的额外参数，用于适配器默认值覆盖不到的个别开关 */
  extraArgs: string[];
  /**
   * 是否进入定时任务，同时是“跑一次”的默认勾选。false 的条目仍属被测矩阵，
   * 可在“跑一次”里手动选；与题目的 run.promptIds 作用对称。
   */
  enabled: boolean;
}

/**
 * 单次调用的结局。no-svg 是基准结果（模型作答但无可用 SVG），error 是调用链故障。
 */
export type AttemptStatus = "ok" | "no-svg" | "error" | "timeout";

export interface Attempt {
  targetId: string;
  /** 本次用的提示词条目；一轮可以同时跑多条提示词 */
  promptId: string;
  cli: CliKind;
  model: string;
  /** 用户请求的强度档 */
  effort: EffortLevel;
  /** 实际传给 CLI 的强度档；与 effort 不同表示已折叠降级 */
  appliedEffort: EffortLevel;
  /** 强度是否传给 CLI 并生效；为 false 时模型不支持调节，effort 仅用于分组 */
  effortHonored: boolean;
  label: string;
  status: AttemptStatus;
  /** 相对 data/runs 的 SVG 路径；仅 status 为 ok 时非空 */
  svgFile: string | null;
  /** 相对 data/runs 的原始输出路径，用于事后排查 */
  rawFile: string | null;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  /** 提取出的 SVG 字节数，可粗略反映详尽程度 */
  svgBytes: number | null;
  /** status 非 ok 时的失败说明 */
  error: string | null;
  /** CLI 报告的 token 用量；无用量事件时为 null，字段缺失时读取方从 rawFile 解析 */
  usage?: TokenUsage | null;
}

/** 一次完整调度的记录，落盘为 data/runs/<runId>/run.json */
export interface RunRecord {
  /** 由起始时刻派生的可排序标识，形如 20260922T071300Z */
  runId: string;
  /** 本轮使用的提示词，含渲染后的文本与变量取值，使变量版的历史结果可解释 */
  prompts: RenderedPrompt[];
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  /** 触发来源：定时调度还是手动执行 */
  trigger: "schedule" | "manual";
  /**
   * 本轮仍在进行，每完成一次调用落盘一次；此时 attempts 只含已完成的调用，
   * finishedAt 为最近一次落盘时刻。
   */
  inProgress: boolean;
  /** 本轮被手动停止的时刻；attempts 只含停止前已完成的调用。未停止时缺省 */
  cancelledAt?: string;
  /** 首次因预算上限未发起调用的原因；未被预算拦下时缺省 */
  budgetStop?: string;
  attempts: Attempt[];
}

/** 前端消费的扁平视图：把 run 的时间信息下放到每个 attempt，便于单一瀑布流排序 */
export interface DashboardCard extends Attempt {
  runId: string;
  runStartedAt: string;
  trigger: RunRecord["trigger"];
  /** 所属轮次尚未跑完，同一轮的其余格子稍后才会出现 */
  runInProgress: boolean;
  /** 本次实际提问的完整文本 */
  promptText: string;
  /** 本次的变量取值；无变量时为空对象 */
  bindings: Record<string, string>;
  usage: TokenUsage | null;
  /** 按价格目录折算的 API 等价成本，读取时计算，不落盘 */
  cost: CostEstimate;
}

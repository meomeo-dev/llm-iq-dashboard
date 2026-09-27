/**
 * 能力目录（capability catalog）的领域类型。
 *
 * codex 给出结构化模型目录并逐模型声明强度档，agy 给纯文本模型列表，claude 没有
 * 列举命令；因此目录由多个来源合并，每一项标注来源。
 */

import type { CliKind, EffortLevel } from "../core/types";

/**
 * 一个候选项的来源。可信度从高到低：
 * - `probe`   本次启动时从 CLI 实际探测到
 * - `history` 历史运行记录中成功跑通过，即便当前探测不到也确实可用
 * - `custom`  用户手动填写
 * - `builtin` 仓库内置的候选，最可能过时
 */
export type CapabilitySource = "probe" | "history" | "custom" | "builtin";

export interface ModelOption {
  /** 传给 CLI 的模型标识 */
  id: string;
  displayName: string;
  cli: CliKind;
  /** 同一模型可能被多个来源同时佐证 */
  sources: CapabilitySource[];
  /**
   * 该模型支持的强度档：
   * - 非空数组：可调，且只能取这些档；
   * - 空数组：不可调，传强度参数会被 CLI 拒绝；
   * - null：CLI 未按模型声明，回退到 CliCapability.efforts。
   */
  efforts: EffortLevel[] | null;
  description: string | null;
}

export interface CliCapability {
  cli: CliKind;
  /** 可执行文件是否在 PATH 中且能响应 */
  available: boolean;
  models: ModelOption[];
  /** CLI 级别支持的强度档，通常从 --help 文本解析 */
  efforts: EffortLevel[];
  /** 探测过程中的非致命问题，原样展示给用户 */
  notes: string[];
}

export interface CapabilitySnapshot {
  /**
   * 缓存结构版本。改动 ModelOption / CliCapability 的语义时必须递增：旧缓存缺少
   * 新字段会让调用逻辑静默走错分支。版本不符即丢弃并重新探测。
   */
  schemaVersion: number;
  probedAt: string;
  clis: CliCapability[];
}

/** 探针只向 CLI 查询事实，合并与回退由 catalog 负责 */
export interface CapabilityProbe {
  readonly cli: CliKind;
  /** 探测不到时返回空数组，不抛错 */
  probe(): Promise<ProbeResult>;
}

export interface ProbeResult {
  available: boolean;
  models: ProbedModel[];
  efforts: EffortLevel[];
  notes: string[];
}

export interface ProbedModel {
  id: string;
  displayName: string;
  efforts: EffortLevel[] | null;
  description: string | null;
}

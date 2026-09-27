/**
 * 提示词相关类型定义
 */

import type { VariableSpec } from "../variables";

/**
 * 题目的客观参考标准（Ground Truth）与判断标准（Evaluation Criteria）。
 * 为评判大模型输出的正确性与空间/物理/文学理解深度提供不可妥协的客观对照依据。
 */
export interface PromptStandard {
  /** 核心考点与鉴别维度（如：非线性空间映射、阿基米德浮力定律、三维视错觉拓扑） */
  readonly coreKey: string;
  /** 客观黄金参考标准（Ground Truth）：具体的几何角度、物理定律、机械构型或出处原型 */
  readonly groundTruth: string;
  /** 判断与鉴别标准（Evaluation Criteria）：何为满分，何为空间推理或物理违背等扣分/失误 */
  readonly evaluationCriteria: string;
  /** 权威参考来源链接（维基百科、学术基准、原作者博文等） */
  readonly referenceSource?: string | null;
}

/** 候选集里的一条：一个回目的名场面 */
export interface PromptCandidate {
  /** 稳定标识，如 `xiyou-027`（书名拼音 + 三位回数），写入运行记录 */
  readonly id: string;
  /** 看板徽章上显示的名字，如 “第27回 三打白骨精” */
  readonly label: string;
  /** 完整的提示词，逐字发送 */
  readonly text: string;
  /** 客观黄金参考标准与判断依据（单题特异标准） */
  readonly standard?: PromptStandard | null;
}

export interface PromptSpec {
  /** 稳定标识，写入每条运行记录 */
  readonly id: string;
  readonly label: string;
  /** 模板文本，`{{name}}` 为变量占位；无变量时即最终文本 */
  readonly template: string;
  readonly variables: readonly VariableSpec[];
  /** 候选集：非空时每个轮换周期抽一条作提示词，template 仅作说明；与 variables 互斥 */
  readonly candidates: readonly PromptCandidate[];
  readonly source: string | null;
  /** 出处是否已核对：原文条目对照作者公开发布，候选集对照原著回目 */
  readonly verified: boolean;
  /** 不可变条目：禁止带变量、禁止编辑、不能被自定义条目覆盖 */
  readonly immutable: boolean;
  /** 题目在社区、原作者或公开网络首次出现的时间（格式 YYYY-MM 或 YYYY-MM-DD） */
  readonly originDate?: string | null;
  /** 本基准仓库/看板正式收录该题目的日期（格式 YYYY-MM-DD） */
  readonly registeredAt?: string | null;
  /** 客观黄金参考标准与判断依据 */
  readonly standard?: PromptStandard | null;
}

/** 题目的生命周期与时间追踪信息 */
export interface PromptLifecycle {
  readonly originDate: string | null;
  readonly registeredAt: string | null;
  readonly originAgeText: string | null;
  readonly daysSinceCollected: number | null;
  readonly collectedAgeText: string | null;
  readonly status: "active" | "aging" | "legacy";
}

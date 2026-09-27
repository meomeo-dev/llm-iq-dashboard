/**
 * 提示词校验类型与配置
 */

export interface PromptValidationError {
  /** 出错的属性路径，如 `fe-ai-v1.candidates[2].standard.groundTruth` */
  readonly path: string;
  /** 具体的校验失败原因描述 */
  readonly message: string;
  /** 发生校验违规时的实际值（供调试与快速定位） */
  readonly actualValue?: unknown;
}

export interface PromptValidationResult {
  readonly valid: boolean;
  readonly errors: readonly PromptValidationError[];
}

export interface PromptValidationOptions {
  /** 是否强制要求提供客观黄金标准（standard），默认 true */
  readonly requireStandard?: boolean;
  /** 是否强制要求 candidates 里的每个候选也必须带独立针对性 standard，默认 false */
  readonly requireCandidateStandard?: boolean;
  /** 是否强制要求包含首发与收录时间（originDate / registeredAt），默认 true */
  readonly requireLifecycleDates?: boolean;
  /** 是否要求 template 必须包含 SVG 相关要求，默认 true */
  readonly requireSvgRequirement?: boolean;
  /** 允许的 ID 正则表达式，默认 /^[a-zA-Z0-9_-]+$/ */
  readonly idPattern?: RegExp;
}

export const DEFAULT_OPTIONS: Required<PromptValidationOptions> = {
  requireStandard: true,
  requireCandidateStandard: false,
  requireLifecycleDates: true,
  requireSvgRequirement: true,
  idPattern: /^[a-zA-Z0-9_-]+$/,
};

export const DATE_PATTERN = /^\d{4}-\d{2}(-\d{2})?$/;
export const REGISTERED_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

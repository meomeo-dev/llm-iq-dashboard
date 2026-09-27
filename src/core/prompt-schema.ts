/**
 * 提示词数据模型契约（Schema）与完整性校验（Validator）。
 *
 * 为题目与套题数据提供确定性的字段结构约束、语义完整性校验与运行时门禁，
 * 避免因手写新增或外部配置导入时属性缺失导致评测和看板展示失真。
 */

export type {
  PromptValidationError,
  PromptValidationResult,
  PromptValidationOptions,
} from "./prompt/validation-types";

export { validatePromptStandard } from "./prompt/validation-standard";
export { validatePromptCandidate } from "./prompt/validation-candidate";
export {
  validatePromptSpec,
  assertValidPromptSpec,
  validatePromptRegistry,
} from "./prompt/validation-spec";

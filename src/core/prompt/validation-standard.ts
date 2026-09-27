/**
 * 客观黄金标准（PromptStandard）结构与内容校验
 */

import type { PromptValidationError } from "./validation-types";

function validateCoreKey(obj: Record<string, unknown>, path: string, errors: PromptValidationError[]): void {
  if (typeof obj.coreKey !== "string") {
    errors.push({
      path: `${path}.coreKey`,
      message: "核心考点 (coreKey) 必须为非空字符串",
      actualValue: obj.coreKey,
    });
  } else if (obj.coreKey.trim().length < 2) {
    errors.push({
      path: `${path}.coreKey`,
      message: `核心考点 (coreKey) 描述过短（至少 2 个字符），当前长度：${obj.coreKey.trim().length}`,
      actualValue: obj.coreKey,
    });
  }
}

function validateGroundTruth(obj: Record<string, unknown>, path: string, errors: PromptValidationError[]): void {
  if (typeof obj.groundTruth !== "string") {
    errors.push({
      path: `${path}.groundTruth`,
      message: "客观黄金参考标准 (groundTruth) 必须为非空字符串",
      actualValue: obj.groundTruth,
    });
  } else if (obj.groundTruth.trim().length < 10) {
    errors.push({
      path: `${path}.groundTruth`,
      message: `客观黄金参考标准 (groundTruth) 描述过短（至少 10 个字符），当前长度：${obj.groundTruth.trim().length}`,
      actualValue: obj.groundTruth,
    });
  }
}

function validateEvaluationCriteria(obj: Record<string, unknown>, path: string, errors: PromptValidationError[]): void {
  if (typeof obj.evaluationCriteria !== "string") {
    errors.push({
      path: `${path}.evaluationCriteria`,
      message: "判断与鉴别标准 (evaluationCriteria) 必须为非空字符串",
      actualValue: obj.evaluationCriteria,
    });
  } else if (obj.evaluationCriteria.trim().length < 10) {
    errors.push({
      path: `${path}.evaluationCriteria`,
      message: `判断与鉴别标准 (evaluationCriteria) 描述过短（至少 10 个字符），当前长度：${obj.evaluationCriteria.trim().length}`,
      actualValue: obj.evaluationCriteria,
    });
  }
}

function validateReferenceSource(obj: Record<string, unknown>, path: string, errors: PromptValidationError[]): void {
  if (obj.referenceSource === undefined || obj.referenceSource === null) return;
  if (typeof obj.referenceSource !== "string" || obj.referenceSource.trim().length === 0) {
    errors.push({
      path: `${path}.referenceSource`,
      message: "参考来源 (referenceSource) 若提供则必须为非空字符串",
      actualValue: obj.referenceSource,
    });
    return;
  }
  const refStr = obj.referenceSource;
  if (refStr.includes("---") || refStr.includes("####") || refStr.includes("净室设计理念")) {
    errors.push({
      path: `${path}.referenceSource`,
      message: "参考来源 (referenceSource) 含有未清理的 Markdown 标题、分割线或调研报告草稿残留",
      actualValue: obj.referenceSource,
    });
  }
}

/**
 * 校验客观黄金标准（PromptStandard）的结构完整性与文本有效性
 */
export function validatePromptStandard(
  standard: unknown,
  path = "standard",
): PromptValidationError[] {
  const errors: PromptValidationError[] = [];
  if (standard === undefined || standard === null) {
    errors.push({
      path,
      message: "客观黄金标准 (standard) 缺失或为 null",
      actualValue: standard,
    });
    return errors;
  }

  if (typeof standard !== "object" || Array.isArray(standard)) {
    errors.push({
      path,
      message: "客观黄金标准 (standard) 必须为一个对象",
      actualValue: standard,
    });
    return errors;
  }

  const obj = standard as Record<string, unknown>;
  validateCoreKey(obj, path, errors);
  validateGroundTruth(obj, path, errors);
  validateEvaluationCriteria(obj, path, errors);
  validateReferenceSource(obj, path, errors);
  return errors;
}

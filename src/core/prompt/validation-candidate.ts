/**
 * 候选集单项（PromptCandidate）校验
 */

import { DEFAULT_OPTIONS, type PromptValidationError, type PromptValidationOptions } from "./validation-types";
import { validatePromptStandard } from "./validation-standard";

function validateCandidateId(
  obj: Record<string, unknown>,
  path: string,
  idPattern: RegExp,
  errors: PromptValidationError[],
): void {
  if (typeof obj.id !== "string" || obj.id.trim().length === 0) {
    errors.push({
      path: `${path}.id`,
      message: "候选条目 ID 必须为非空字符串",
      actualValue: obj.id,
    });
  } else if (!idPattern.test(obj.id)) {
    errors.push({
      path: `${path}.id`,
      message: `候选条目 ID 格式不合法（只允许字母、数字、短横线与下划线）：${obj.id}`,
      actualValue: obj.id,
    });
  }
}

function validateCandidateLabel(obj: Record<string, unknown>, path: string, errors: PromptValidationError[]): void {
  if (typeof obj.label !== "string" || obj.label.trim().length === 0) {
    errors.push({
      path: `${path}.label`,
      message: "候选条目标签 (label) 必须为非空字符串",
      actualValue: obj.label,
    });
  }
}

function validateCandidateText(
  obj: Record<string, unknown>,
  path: string,
  requireSvg: boolean,
  errors: PromptValidationError[],
): void {
  if (typeof obj.text !== "string" || obj.text.trim().length === 0) {
    errors.push({
      path: `${path}.text`,
      message: "候选条目提示词文本 (text) 必须为非空字符串",
      actualValue: obj.text,
    });
  } else if (requireSvg && !obj.text.toLowerCase().includes("svg")) {
    errors.push({
      path: `${path}.text`,
      message: "候选条目提示词文本必须明确要求输出 SVG 矢量图",
      actualValue: obj.text,
    });
  }
}

/**
 * 校验候选集单项（PromptCandidate）
 */
export function validatePromptCandidate(
  candidate: unknown,
  index: number,
  parentId: string,
  options: PromptValidationOptions = {},
): PromptValidationError[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors: PromptValidationError[] = [];
  const path = `${parentId}.candidates[${index}]`;

  if (candidate === undefined || candidate === null || typeof candidate !== "object" || Array.isArray(candidate)) {
    errors.push({
      path,
      message: "候选条目必须为一个对象",
      actualValue: candidate,
    });
    return errors;
  }

  const obj = candidate as Record<string, unknown>;
  validateCandidateId(obj, path, opts.idPattern, errors);
  validateCandidateLabel(obj, path, errors);
  validateCandidateText(obj, path, opts.requireSvgRequirement, errors);

  if (opts.requireCandidateStandard || (obj.standard !== undefined && obj.standard !== null)) {
    errors.push(...validatePromptStandard(obj.standard, `${path}.standard`));
  }

  return errors;
}

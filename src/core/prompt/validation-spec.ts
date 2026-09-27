/**
 * PromptSpec 整体契约与 Registry 集合校验
 */

import type { PromptSpec } from "./types";
import {
  DATE_PATTERN,
  DEFAULT_OPTIONS,
  REGISTERED_DATE_PATTERN,
  type PromptValidationError,
  type PromptValidationOptions,
  type PromptValidationResult,
} from "./validation-types";
import { validatePromptStandard } from "./validation-standard";
import { validatePromptCandidate } from "./validation-candidate";

function validateSpecIdAndLabel(
  obj: Record<string, unknown>,
  path: string,
  idPattern: RegExp,
  errors: PromptValidationError[],
): void {
  if (typeof obj.id !== "string" || obj.id.trim().length === 0) {
    errors.push({
      path: `${path}.id`,
      message: "题目 ID (id) 必须为非空字符串",
      actualValue: obj.id,
    });
  } else if (!idPattern.test(obj.id)) {
    errors.push({
      path: `${path}.id`,
      message: `题目 ID 格式不合法（只允许字母、数字、短横线与下划线）：${obj.id}`,
      actualValue: obj.id,
    });
  }

  if (typeof obj.label !== "string" || obj.label.trim().length === 0) {
    errors.push({
      path: `${path}.label`,
      message: "题目标签 (label) 必须为非空字符串",
      actualValue: obj.label,
    });
  }
}

function validateSpecTemplate(
  obj: Record<string, unknown>,
  path: string,
  isSuite: boolean,
  requireSvg: boolean,
  errors: PromptValidationError[],
): void {
  if (typeof obj.template !== "string" || obj.template.trim().length === 0) {
    errors.push({
      path: `${path}.template`,
      message: "题目模板 (template) 必须为非空字符串",
      actualValue: obj.template,
    });
  } else if (!isSuite && requireSvg && !obj.template.toLowerCase().includes("svg")) {
    errors.push({
      path: `${path}.template`,
      message: "单题模板必须明确要求输出 SVG 矢量图",
      actualValue: obj.template,
    });
  }
}

function validateCandidatesList(
  candidates: unknown[],
  path: string,
  opts: Required<PromptValidationOptions>,
  errors: PromptValidationError[],
): void {
  const candidateIdSet = new Set<string>();
  candidates.forEach((cand, idx) => {
    errors.push(...validatePromptCandidate(cand, idx, path, opts));
    if (cand && typeof (cand as Record<string, unknown>).id === "string") {
      const candId = (cand as Record<string, unknown>).id as string;
      if (candidateIdSet.has(candId)) {
        errors.push({
          path: `${path}.candidates[${idx}].id`,
          message: `候选集内部 ID 重复：${candId}`,
          actualValue: candId,
        });
      }
      candidateIdSet.add(candId);
    }
  });
}

function validateSpecVariablesAndCandidates(
  obj: Record<string, unknown>,
  path: string,
  isSuite: boolean,
  opts: Required<PromptValidationOptions>,
  errors: PromptValidationError[],
): void {
  const hasVariables = Array.isArray(obj.variables) && obj.variables.length > 0;
  if (hasVariables && isSuite) {
    errors.push({
      path,
      message: "题目不可同时声明 variables（变量）与 candidates（候选集）",
    });
  }

  if (obj.candidates !== undefined && !Array.isArray(obj.candidates)) {
    errors.push({
      path: `${path}.candidates`,
      message: "candidates 若存在必须为数组",
      actualValue: obj.candidates,
    });
  } else if (Array.isArray(obj.candidates)) {
    validateCandidatesList(obj.candidates, path, opts, errors);
  }
}

function validateSpecSourceAndFlags(
  obj: Record<string, unknown>,
  path: string,
  errors: PromptValidationError[],
): void {
  if (typeof obj.source === "string") {
    if (obj.source.includes("---") || obj.source.includes("####") || obj.source.includes("净室设计理念")) {
      errors.push({
        path: `${path}.source`,
        message: "题目来源 (source) 含有未清理的 Markdown 标题、分割线或调研报告草稿残留",
        actualValue: obj.source,
      });
    }
  }
  if (typeof obj.verified !== "boolean") {
    errors.push({
      path: `${path}.verified`,
      message: "verified 必须为布尔值",
      actualValue: obj.verified,
    });
  }
  if (typeof obj.immutable !== "boolean") {
    errors.push({
      path: `${path}.immutable`,
      message: "immutable 必须为布尔值",
      actualValue: obj.immutable,
    });
  }
}

function validateSpecLifecycleDates(
  obj: Record<string, unknown>,
  path: string,
  errors: PromptValidationError[],
): void {
  if (typeof obj.originDate !== "string" || !DATE_PATTERN.test(obj.originDate)) {
    errors.push({
      path: `${path}.originDate`,
      message: `首发时间 (originDate) 必须符合 YYYY-MM 或 YYYY-MM-DD 格式，当前为：${String(obj.originDate)}`,
      actualValue: obj.originDate,
    });
  }
  if (typeof obj.registeredAt !== "string" || !REGISTERED_DATE_PATTERN.test(obj.registeredAt)) {
    errors.push({
      path: `${path}.registeredAt`,
      message: `收录时间 (registeredAt) 必须符合 YYYY-MM-DD 格式，当前为：${String(obj.registeredAt)}`,
      actualValue: obj.registeredAt,
    });
  }
}

/**
 * 校验完整 PromptSpec 数据契约
 */
export function validatePromptSpec(
  spec: unknown,
  options: PromptValidationOptions = {},
): PromptValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors: PromptValidationError[] = [];

  if (spec === undefined || spec === null || typeof spec !== "object" || Array.isArray(spec)) {
    return {
      valid: false,
      errors: [{ path: "spec", message: "PromptSpec 必须为一个非空对象", actualValue: spec }],
    };
  }

  const obj = spec as Record<string, unknown>;
  const path = typeof obj.id === "string" ? obj.id : "unknown-id";
  const isSuite = Array.isArray(obj.candidates) && obj.candidates.length > 0;

  validateSpecIdAndLabel(obj, path, opts.idPattern, errors);
  validateSpecTemplate(obj, path, isSuite, opts.requireSvgRequirement, errors);
  validateSpecVariablesAndCandidates(obj, path, isSuite, opts, errors);
  validateSpecSourceAndFlags(obj, path, errors);
  if (opts.requireLifecycleDates) validateSpecLifecycleDates(obj, path, errors);

  if (opts.requireStandard || (obj.standard !== undefined && obj.standard !== null)) {
    errors.push(...validatePromptStandard(obj.standard, `${path}.standard`));
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 断言目标对象完全符合 PromptSpec Schema，若不符合则抛出格式化详细错误异常
 */
export function assertValidPromptSpec(
  spec: unknown,
  options: PromptValidationOptions = {},
): asserts spec is PromptSpec {
  const result = validatePromptSpec(spec, options);
  if (!result.valid) {
    const details = result.errors.map((e) => `  - [${e.path}] ${e.message}`).join("\n");
    const specId = (spec as Record<string, unknown>)?.id ?? "unknown";
    throw new Error(`提示词数据结构校验失败 (${specId})：\n${details}`);
  }
}

/**
 * 全量校验一个题目集合（如 Registry 或自检列表），检查是否存在重复 ID 以及各项完整性
 */
export function validatePromptRegistry(
  prompts: Iterable<PromptSpec>,
  options: PromptValidationOptions = {},
): PromptValidationResult {
  const errors: PromptValidationError[] = [];
  const seenIds = new Set<string>();

  for (const spec of prompts) {
    if (seenIds.has(spec.id)) {
      errors.push({
        path: spec.id,
        message: `题库中存在重复的题目 ID: ${spec.id}`,
        actualValue: spec.id,
      });
    }
    seenIds.add(spec.id);

    const specResult = validatePromptSpec(spec, options);
    if (!specResult.valid) {
      errors.push(...specResult.errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

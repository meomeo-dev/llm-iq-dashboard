/**
 * 提示词数据模型契约（Schema）与完整性校验（Validator）。
 *
 * 为题目与套题数据提供确定性的字段结构约束、语义完整性校验与运行时门禁，
 * 避免因手写新增或外部配置导入时属性缺失导致评测和看板展示失真。
 */

import type { PromptCandidate, PromptSpec, PromptStandard } from "./prompt";

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

const DEFAULT_OPTIONS: Required<PromptValidationOptions> = {
  requireStandard: true,
  requireCandidateStandard: false,
  requireLifecycleDates: true,
  requireSvgRequirement: true,
  idPattern: /^[a-zA-Z0-9_-]+$/,
};

const DATE_PATTERN = /^\d{4}-\d{2}(-\d{2})?$/;
const REGISTERED_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

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

  // 1. coreKey: 核心考点与鉴别维度
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

  // 2. groundTruth: 客观黄金事实、几何角度或物理定律
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

  // 3. evaluationCriteria: 判断与鉴别标准
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

  // 4. referenceSource: 权威参考来源链接（可选，但若存在必须为有效字符串且不能混入 Markdown 标题或草稿残留）
  if (obj.referenceSource !== undefined && obj.referenceSource !== null) {
    if (typeof obj.referenceSource !== "string" || obj.referenceSource.trim().length === 0) {
      errors.push({
        path: `${path}.referenceSource`,
        message: "参考来源 (referenceSource) 若提供则必须为非空字符串",
        actualValue: obj.referenceSource,
      });
    } else {
      const refStr = obj.referenceSource;
      if (refStr.includes("---") || refStr.includes("####") || refStr.includes("净室设计理念")) {
        errors.push({
          path: `${path}.referenceSource`,
          message: "参考来源 (referenceSource) 含有未清理的 Markdown 标题、分割线或调研报告草稿残留",
          actualValue: obj.referenceSource,
        });
      }
    }
  }

  return errors;
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

  // id
  if (typeof obj.id !== "string" || obj.id.trim().length === 0) {
    errors.push({
      path: `${path}.id`,
      message: "候选条目 ID 必须为非空字符串",
      actualValue: obj.id,
    });
  } else if (!opts.idPattern.test(obj.id)) {
    errors.push({
      path: `${path}.id`,
      message: `候选条目 ID 格式不合法（只允许字母、数字、短横线与下划线）：${obj.id}`,
      actualValue: obj.id,
    });
  }

  // label
  if (typeof obj.label !== "string" || obj.label.trim().length === 0) {
    errors.push({
      path: `${path}.label`,
      message: "候选条目标签 (label) 必须为非空字符串",
      actualValue: obj.label,
    });
  }

  // text
  if (typeof obj.text !== "string" || obj.text.trim().length === 0) {
    errors.push({
      path: `${path}.text`,
      message: "候选条目提示词文本 (text) 必须为非空字符串",
      actualValue: obj.text,
    });
  } else if (opts.requireSvgRequirement && !obj.text.toLowerCase().includes("svg")) {
    errors.push({
      path: `${path}.text`,
      message: "候选条目提示词文本必须明确要求输出 SVG 矢量图",
      actualValue: obj.text,
    });
  }

  // standard
  if (opts.requireCandidateStandard) {
    errors.push(...validatePromptStandard(obj.standard, `${path}.standard`));
  } else if (obj.standard !== undefined && obj.standard !== null) {
    errors.push(...validatePromptStandard(obj.standard, `${path}.standard`));
  }

  return errors;
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
  const id = typeof obj.id === "string" ? obj.id : "unknown-id";
  const path = id;

  // 1. id
  if (typeof obj.id !== "string" || obj.id.trim().length === 0) {
    errors.push({
      path: `${path}.id`,
      message: "题目 ID (id) 必须为非空字符串",
      actualValue: obj.id,
    });
  } else if (!opts.idPattern.test(obj.id)) {
    errors.push({
      path: `${path}.id`,
      message: `题目 ID 格式不合法（只允许字母、数字、短横线与下划线）：${obj.id}`,
      actualValue: obj.id,
    });
  }

  // 2. label
  if (typeof obj.label !== "string" || obj.label.trim().length === 0) {
    errors.push({
      path: `${path}.label`,
      message: "题目标签 (label) 必须为非空字符串",
      actualValue: obj.label,
    });
  }

  // 3. template
  const isSuite = Array.isArray(obj.candidates) && obj.candidates.length > 0;
  if (typeof obj.template !== "string" || obj.template.trim().length === 0) {
    errors.push({
      path: `${path}.template`,
      message: "题目模板 (template) 必须为非空字符串",
      actualValue: obj.template,
    });
  } else if (!isSuite && opts.requireSvgRequirement && !obj.template.toLowerCase().includes("svg")) {
    errors.push({
      path: `${path}.template`,
      message: "单题模板必须明确要求输出 SVG 矢量图",
      actualValue: obj.template,
    });
  }

  // 4. variables 与 candidates 互斥与有效性
  const hasVariables = Array.isArray(obj.variables) && obj.variables.length > 0;
  if (hasVariables && isSuite) {
    errors.push({
      path: `${path}`,
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
    const candidateIdSet = new Set<string>();
    obj.candidates.forEach((cand, idx) => {
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

  // 4.5. source 格式与纯净度
  if (typeof obj.source === "string") {
    if (obj.source.includes("---") || obj.source.includes("####") || obj.source.includes("净室设计理念")) {
      errors.push({
        path: `${path}.source`,
        message: "题目来源 (source) 含有未清理的 Markdown 标题、分割线或调研报告草稿残留",
        actualValue: obj.source,
      });
    }
  }

  // 5. verified & immutable
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

  // 6. 生命周期时间属性（originDate & registeredAt）
  if (opts.requireLifecycleDates) {
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

  // 7. 客观黄金标准（standard）
  if (opts.requireStandard) {
    errors.push(...validatePromptStandard(obj.standard, `${path}.standard`));
  } else if (obj.standard !== undefined && obj.standard !== null) {
    errors.push(...validatePromptStandard(obj.standard, `${path}.standard`));
  }

  return {
    valid: errors.length === 0,
    errors,
  };
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

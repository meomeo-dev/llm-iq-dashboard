/**
 * 自定义提示词与变量规格的解析校验。模板与变量定义在加载时交叉校验，
 * 避免错误拖到运行时让一整轮白跑。
 */

import type { PromptSpec, PromptStandard } from "./prompt";
import { validatePromptStandard } from "./prompt-schema";
import { referencedVariables, type VariableMode, type VariableSpec } from "./variables";

const MODES: readonly VariableMode[] = ["fixed", "random", "sequence", "shuffle"];

export function parsePrompts(raw: unknown, errors: string[]): PromptSpec[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) {
    errors.push("prompts 必须是数组");
    return [];
  }

  const seen = new Set<string>();
  const prompts: PromptSpec[] = [];

  raw.forEach((item, index) => {
    const spec = parseOne(item, `prompts[${index}]`, errors);
    if (spec === null) return;
    if (seen.has(spec.id)) {
      errors.push(`prompts[${index}] 的 id 与前面的条目重复：${spec.id}`);
      return;
    }
    seen.add(spec.id);
    prompts.push(spec);
  });

  return prompts;
}

function parseOne(item: unknown, where: string, errors: string[]): PromptSpec | null {
  const node = asRecord(item);
  if (node === null) {
    errors.push(`${where} 必须是一个映射`);
    return null;
  }

  const id = optionalString(node.id);
  const template = optionalString(node.template);
  if (id === null) {
    errors.push(`${where}.id 缺失`);
    return null;
  }
  if (template === null) {
    errors.push(`${where}.template 缺失`);
    return null;
  }

  const variables = parseVariables(node.variables, where, errors);
  checkReferences(template, variables, where, errors);
  const standard = parseStandard(node.standard, where, errors);

  return {
    id,
    label: optionalString(node.label) ?? id,
    template,
    variables,
    // 候选集只用于内置条目；自定义条目用变量表达轮换
    candidates: [],
    source: optionalString(node.source),
    verified: node.verified === true,
    // 不可变性只属于内置锚点，配置不能覆盖
    immutable: false,
    originDate: optionalString(node.originDate),
    registeredAt: optionalString(node.registeredAt),
    standard,
  };
}

function parseVariables(raw: unknown, where: string, errors: string[]): VariableSpec[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) {
    errors.push(`${where}.variables 必须是数组`);
    return [];
  }

  const variables: VariableSpec[] = [];

  raw.forEach((item, index) => {
    const at = `${where}.variables[${index}]`;
    const node = asRecord(item);
    if (node === null) {
      errors.push(`${at} 必须是一个映射`);
      return;
    }

    const name = optionalString(node.name);
    const mode = optionalString(node.mode) ?? "sequence";
    if (name === null) {
      errors.push(`${at}.name 缺失`);
      return;
    }
    if (!isMode(mode)) {
      errors.push(`${at}.mode 必须是 ${MODES.join(" / ")}，当前为 ${mode}`);
      return;
    }

    const values = parseValues(node, at, errors);
    if (values.length === 0) {
      errors.push(`${at} 没有任何候选取值`);
      return;
    }
    variables.push({ name, mode, values });
  });

  return variables;
}

/** 接受单数 `value: x`（常用于 fixed 模式）或 `values` 数组 */
function parseValues(
  node: Record<string, unknown>,
  at: string,
  errors: string[],
): string[] {
  const single = optionalString(node.value);
  if (single !== null) return [single];

  const raw = node.values;
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) {
    errors.push(`${at}.values 必须是字符串数组`);
    return [];
  }

  const values = raw.filter((v): v is string => typeof v === "string" && v.trim() !== "");
  if (values.length !== raw.length) {
    errors.push(`${at}.values 含有非字符串或空白条目`);
  }
  return values.map((v) => v.trim());
}

/**
 * 双向校验模板与变量：未定义的引用会在提示词里原样留下 `{{name}}`，
 * 未被引用的定义通常是改名遗漏。
 */
function checkReferences(
  template: string,
  variables: readonly VariableSpec[],
  where: string,
  errors: string[],
): void {
  const defined = new Set(variables.map((v) => v.name));
  const referenced = referencedVariables(template);

  for (const name of referenced) {
    if (!defined.has(name)) {
      errors.push(`${where}.template 引用了未定义的变量 {{${name}}}`);
    }
  }
  for (const variable of variables) {
    if (!referenced.includes(variable.name)) {
      errors.push(`${where}.variables 定义了模板中未使用的变量 ${variable.name}`);
    }
  }
}

function isMode(value: string): value is VariableMode {
  return (MODES as readonly string[]).includes(value);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function parseStandard(raw: unknown, where: string, errors: string[]): PromptStandard | null {
  if (raw === undefined || raw === null) return null;
  const node = asRecord(raw);
  if (node === null) {
    errors.push(`${where}.standard 必须是一个映射`);
    return null;
  }
  const coreKey = optionalString(node.coreKey);
  const groundTruth = optionalString(node.groundTruth);
  const evaluationCriteria = optionalString(node.evaluationCriteria);
  const referenceSource = optionalString(node.referenceSource);

  const candidateStandard = {
    coreKey: coreKey ?? "",
    groundTruth: groundTruth ?? "",
    evaluationCriteria: evaluationCriteria ?? "",
    referenceSource,
  };

  const validationErrors = validatePromptStandard(candidateStandard, `${where}.standard`);
  if (validationErrors.length > 0) {
    for (const err of validationErrors) {
      errors.push(`${err.path}: ${err.message}`);
    }
    return null;
  }

  return {
    coreKey: coreKey!,
    groundTruth: groundTruth!,
    evaluationCriteria: evaluationCriteria!,
    referenceSource,
  };
}

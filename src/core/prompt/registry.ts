/**
 * 提示词注册表构建与题目解析
 */

import { BUILTIN_PROMPTS } from "./builtin";
import type { PromptCandidate, PromptSpec, PromptStandard } from "./types";
import { FRONTIER_INDIVIDUAL_PROMPT_MAP } from "../prompts";
import { assertValidPromptSpec } from "../prompt-schema";

/** 合并内置条目与自定义条目；自定义条目覆盖不可变条目时抛错 */
export function buildRegistry(
  custom: readonly PromptSpec[] = [],
): ReadonlyMap<string, PromptSpec> {
  const registry = new Map<string, PromptSpec>(
    BUILTIN_PROMPTS.map((spec) => [spec.id, spec]),
  );

  for (const spec of custom) {
    // 校验自定义题目数据结构合规性
    assertValidPromptSpec(spec, {
      requireStandard: false, // 自定义题目允许暂无黄金标准，但若有则必须合规
      requireLifecycleDates: false, // 自定义题目允许缺省日期
      requireSvgRequirement: false, // 允许灵活自定义
    });

    const existing = registry.get(spec.id);
    if (existing?.immutable === true) {
      throw new Error(
        `提示词 "${spec.id}" 是不可变的基准锚点，不能被自定义条目覆盖`,
      );
    }
    registry.set(spec.id, spec);
  }
  return registry;
}

export function listPrompts(custom: readonly PromptSpec[] = []): PromptSpec[] {
  return [...buildRegistry(custom).values()];
}

function deriveCandidatePrompt(parent: PromptSpec, candidate: PromptCandidate): PromptSpec {
  return {
    id: candidate.id,
    label: candidate.label,
    template: candidate.text,
    variables: [],
    candidates: [],
    source: parent.source,
    verified: parent.verified,
    immutable: parent.immutable,
    originDate: parent.originDate,
    registeredAt: parent.registeredAt,
    standard: candidate.standard ?? parent.standard,
  };
}

function deriveFromCandidates(registry: ReadonlyMap<string, PromptSpec>, id: string): PromptSpec | null {
  for (const parent of registry.values()) {
    if (parent.candidates && parent.candidates.length > 0) {
      const candidate = parent.candidates.find((c) => c.id === id);
      if (candidate) return deriveCandidatePrompt(parent, candidate);
    }
  }
  return null;
}

/** 查不到即抛错：未登记的 promptId 属于配置错误 */
export function resolvePrompt(
  id: string,
  custom: readonly PromptSpec[] = [],
): PromptSpec {
  const registry = buildRegistry(custom);
  const spec = registry.get(id);
  if (spec) return spec;

  // 1. 尝试从前沿单题映射表中检索
  const individual = FRONTIER_INDIVIDUAL_PROMPT_MAP.get(id);
  if (individual) return individual;

  // 2. 尝试从套题候选集（candidates）中检索并派生
  const derived = deriveFromCandidates(registry, id);
  if (derived) return derived;

  const known = [...registry.keys(), ...FRONTIER_INDIVIDUAL_PROMPT_MAP.keys()].join(", ");
  throw new Error(`未知的 promptId "${id}"，已登记的提示词：${known}`);
}

function matchCandidateStandard(
  spec: PromptSpec | undefined,
  candidateKey: string | undefined,
): PromptStandard | null {
  if (!spec?.candidates || spec.candidates.length === 0 || !candidateKey) return null;
  const matched = spec.candidates.find(
    (c) =>
      c.label === candidateKey ||
      c.id === candidateKey ||
      c.label.includes(candidateKey) ||
      candidateKey.includes(c.label),
  );
  if (!matched) return null;
  if (matched.standard) return matched.standard;
  const indiv = FRONTIER_INDIVIDUAL_PROMPT_MAP.get(matched.id);
  return indiv?.standard ?? null;
}

function matchFrontierStandard(candidateKey: string | undefined, id: string): PromptStandard | null {
  if (candidateKey) {
    const byKey = FRONTIER_INDIVIDUAL_PROMPT_MAP.get(candidateKey);
    if (byKey?.standard) return byKey.standard;
    for (const indiv of FRONTIER_INDIVIDUAL_PROMPT_MAP.values()) {
      if (indiv.label.includes(candidateKey) || candidateKey.includes(indiv.label)) {
        if (indiv.standard) return indiv.standard;
      }
    }
  }
  const indiv = FRONTIER_INDIVIDUAL_PROMPT_MAP.get(id);
  return indiv?.standard ?? null;
}

/** 获取指定题目的客观参考标准（若未登记或无标准则返回 null） */
export function resolvePromptStandard(
  id: string,
  bindingsOrCustom?: Readonly<Record<string, string>> | readonly PromptSpec[] | null,
  custom: readonly PromptSpec[] = [],
): PromptStandard | null {
  const isCustomList = Array.isArray(bindingsOrCustom);
  const bindings = isCustomList ? null : (bindingsOrCustom as Readonly<Record<string, string>> | null | undefined);
  const actualCustom = isCustomList ? (bindingsOrCustom as readonly PromptSpec[]) : custom;
  try {
    const registry = buildRegistry(actualCustom);
    const spec = registry.get(id);
    const candidateKey = bindings?.["回目"] || bindings?.["candidate"];

    const candidateStd = matchCandidateStandard(spec, candidateKey);
    if (candidateStd) return candidateStd;

    if (spec?.standard) return spec.standard;

    const frontierStd = matchFrontierStandard(candidateKey, id);
    if (frontierStd) return frontierStd;

    return resolvePrompt(id, actualCustom).standard ?? null;
  } catch {
    return null;
  }
}

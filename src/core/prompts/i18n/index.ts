/**
 * 题库展示元数据与分组名称的双语定位入口。
 */

import type { Locale } from "../../../i18n/types";
import type { PromptCandidate, PromptSpec, PromptStandard } from "../../prompt/types";
import {
  CLASSICS_CANDIDATES_EN,
  extractEnglishFromPromptText,
  LANDMARK_SLUGS_EN,
  PROMPT_LABELS_EN,
  splitParenthesizedLabel,
} from "./labels-en";
import { STANDARDS_EN, translateTechnicalTextToEn } from "./standards-en";

export { splitParenthesizedLabel };

const GROUP_LABELS_EN: Readonly<Record<string, string>> = {
  "经典基准": "Classic Benchmarks",
  "四大名著（文学与叙事构图）": "Four Classic Novels (Narrative Composition)",
  "四大名著": "Four Classic Novels",
  "世界地标（微缩景观）": "World Landmarks (Isometric Miniatures)",
  "世界地标": "World Landmarks",
  "2026 前沿工程评测 (FE-1 ~ FE-8)": "2026 Frontier Engineering (FE-1 ~ FE-8)",
  "前沿工程 (FE)": "Frontier Engineering (FE)",
  "2026 前沿视觉特效 (VFX)": "2026 Frontier Visual Effects (VFX)",
  "前沿视效 (VFX)": "Frontier Visual Effects (VFX)",
  "微观物理与前沿探索": "Micro-Physics & Frontier Science",
  "物理与工程": "Physics & Engineering",
  "2026-09": "2026-09 Viral Spatial & Hardware",
  "自定义提示词": "Custom Prompts",
  "其他": "Other",
};

/**
 * 按语种返回题目的展示名称（不改动题目 ID 与 template）。
 */
export function localizePromptLabel(
  id: string,
  rawLabel: string,
  locale: Locale,
): string {
  if (locale === "zh-CN") {
    return splitParenthesizedLabel(rawLabel, "zh-CN") ?? rawLabel;
  }
  const explicit = PROMPT_LABELS_EN[id];
  if (explicit !== undefined) return explicit;

  const fromParens = splitParenthesizedLabel(rawLabel, "en");
  if (fromParens !== null) return fromParens;

  return rawLabel;
}

/**
 * 按语种返回候选条目（回目 / 地标 / FE / VFX 单题）的展示名称。
 */
export function localizeCandidateLabel(
  id: string,
  rawLabel: string,
  locale: Locale,
  candidateText?: string,
): string {
  if (locale === "zh-CN") {
    return splitParenthesizedLabel(rawLabel, "zh-CN") ?? rawLabel;
  }

  // 1. 四大名著静动态候选（如 xiyou-027 / xiyou-anim-027）
  const classicAnimMatch = id.match(/^(shuihu|xiyou|sanguo|honglou)-anim-(\d{3})$/);
  if (classicAnimMatch) {
    const baseId = `${classicAnimMatch[1]}-${classicAnimMatch[2]}`;
    const baseEn = CLASSICS_CANDIDATES_EN[baseId];
    if (baseEn) return `${baseEn} (Animated)`;
  }
  const classicEn = CLASSICS_CANDIDATES_EN[id];
  if (classicEn !== undefined) return classicEn;

  // 2. 城市地标静动态候选（landmark-<slug> / landmark-anim-<slug>）
  if (id.startsWith("landmark-anim-")) {
    const slug = id.slice("landmark-anim-".length);
    const baseEn = LANDMARK_SLUGS_EN[slug];
    if (baseEn) return `${baseEn} (Animated)`;
  }
  if (id.startsWith("landmark-")) {
    const slug = id.slice("landmark-".length);
    const baseEn = LANDMARK_SLUGS_EN[slug];
    if (baseEn) return baseEn;
  }

  // 3. 括号内含英文名的候选
  const fromParens = splitParenthesizedLabel(rawLabel, "en");
  if (fromParens !== null) return `${id}: ${fromParens}`;

  // 4. FE / VFX 候选题面首句内嵌的英文标题
  const fromText = extractEnglishFromPromptText(candidateText);
  if (fromText !== null) return `${id}: ${fromText}`;

  return rawLabel;
}

/**
 * 按语种返回黄金参考标准（PromptStandard）的展示对象。
 */
export function localizePromptStandard(
  id: string,
  standard: PromptStandard | null | undefined,
  locale: Locale,
  englishTitle?: string,
): PromptStandard | null {
  if (!standard) return null;
  if (locale === "zh-CN") return standard;

  const explicit = STANDARDS_EN[id];
  if (explicit) {
    return {
      coreKey: explicit.coreKey,
      groundTruth: explicit.groundTruth,
      evaluationCriteria: explicit.evaluationCriteria,
      referenceSource: standard.referenceSource ?? null,
    };
  }

  const resolvedTitle =
    englishTitle ??
    PROMPT_LABELS_EN[id] ??
    splitParenthesizedLabel(standard.coreKey, "en") ??
    id;

  return {
    coreKey: resolvedTitle,
    groundTruth: translateTechnicalTextToEn(standard.groundTruth, resolvedTitle),
    evaluationCriteria: translateTechnicalTextToEn(
      standard.evaluationCriteria,
      resolvedTitle,
    ),
    referenceSource: standard.referenceSource ?? null,
  };
}

/**
 * 返回按当前语言转换了展示字段（label、standard、candidates[].label/standard）的 PromptSpec 浅拷贝视图，
 * 严禁修改 template 与 candidates[].text。
 */
export function localizePromptSpec(spec: PromptSpec, locale: Locale): PromptSpec {
  if (locale === "zh-CN") return spec;
  const label = localizePromptLabel(spec.id, spec.label, locale);
  const standard = localizePromptStandard(spec.id, spec.standard, locale, label);
  const candidates: PromptCandidate[] = spec.candidates.map((cand) => {
    const candLabel = localizeCandidateLabel(
      cand.id,
      cand.label,
      locale,
      cand.text,
    );
    return {
      ...cand,
      label: candLabel,
      standard: localizePromptStandard(cand.id, cand.standard, locale, candLabel),
    };
  });
  return {
    ...spec,
    label,
    standard,
    candidates,
  };
}

/**
 * 按语种返回题库分组名称。
 */
export function localizePromptGroupLabel(
  groupKey: string,
  locale: Locale,
): string {
  if (locale === "zh-CN") return groupKey;
  return GROUP_LABELS_EN[groupKey] ?? groupKey;
}

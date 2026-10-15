/**
 * 题库展示元数据与分组名称的双语定位入口。
 */

import type { Locale } from "../../../i18n/types";
import { BUILTIN_PROMPTS, ARCHIVED_PROMPTS } from "../../prompt/builtin";
import type {
  PromptCandidate,
  PromptSpec,
  PromptStandard,
} from "../../prompt/types";
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

interface CandidateLookupEntry {
  id: string;
  suiteId: string;
  enLabel: string;
}

interface CandidateLookup {
  byId: ReadonlyMap<string, CandidateLookupEntry>;
  byLabel: ReadonlyMap<string, CandidateLookupEntry>;
}

let cachedLookup: CandidateLookup | null = null;

function computeCandidateEnLabel(
  id: string,
  rawLabel: string,
  candidateText?: string,
): string | null {
  const classicAnimMatch = id.match(
    /^(shuihu|xiyou|sanguo|honglou)-anim-(\d{3})$/,
  );
  if (classicAnimMatch) {
    const baseId = `${classicAnimMatch[1]}-${classicAnimMatch[2]}`;
    const baseEn = CLASSICS_CANDIDATES_EN[baseId];
    if (baseEn) return `${baseEn} (Animated)`;
  }
  const classicEn = CLASSICS_CANDIDATES_EN[id];
  if (classicEn !== undefined) return classicEn;

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

  const fromText = extractEnglishFromPromptText(candidateText);
  if (fromText !== null) return `${id}: ${fromText}`;

  const fromParens = splitParenthesizedLabel(rawLabel, "en");
  if (fromParens !== null) return `${id}: ${fromParens}`;

  return null;
}

function getCandidateLookup(): CandidateLookup {
  if (cachedLookup) return cachedLookup;
  const byId = new Map<string, CandidateLookupEntry>();
  const byLabel = new Map<string, CandidateLookupEntry>();
  for (const spec of [...BUILTIN_PROMPTS, ...ARCHIVED_PROMPTS]) {
    for (const cand of spec.candidates) {
      const enLabel =
        computeCandidateEnLabel(cand.id, cand.label, cand.text) ?? cand.label;
      const entry: CandidateLookupEntry = {
        id: cand.id,
        suiteId: spec.id,
        enLabel,
      };
      byId.set(cand.id, entry);
      byLabel.set(cand.label.trim(), entry);
    }
  }
  cachedLookup = { byId, byLabel };
  return cachedLookup;
}

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
 * 同时支持传入候选 ID 或 `run.json` 中落盘的中文候选 `label`（如 `card.bindings["回目"]`）。
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

  const lookup = getCandidateLookup();
  const entry =
    lookup.byId.get(id) ??
    lookup.byLabel.get(id.trim()) ??
    lookup.byLabel.get(rawLabel.trim());
  if (entry) return entry.enLabel;

  const direct = computeCandidateEnLabel(id, rawLabel, candidateText);
  if (direct !== null) return direct;

  return rawLabel;
}

/**
 * 按语种返回黄金参考标准（PromptStandard）的展示对象。
 * 支持传入题目 ID、候选 ID 或中文候选 `label`（如 `card.bindings["回目"]`）。
 */
export function localizePromptStandard(
  id: string,
  standard: PromptStandard | null | undefined,
  locale: Locale,
  englishTitle?: string,
): PromptStandard | null {
  if (!standard) return null;
  if (locale === "zh-CN") return standard;

  const lookup = getCandidateLookup();
  const candEntry = lookup.byId.get(id) ?? lookup.byLabel.get(id.trim());
  const explicit =
    STANDARDS_EN[id] ??
    (candEntry
      ? (STANDARDS_EN[candEntry.id] ?? STANDARDS_EN[candEntry.suiteId])
      : undefined);

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
    candEntry?.enLabel ??
    splitParenthesizedLabel(standard.coreKey, "en") ??
    id;

  return {
    coreKey: resolvedTitle,
    groundTruth: translateTechnicalTextToEn(
      standard.groundTruth,
      resolvedTitle,
    ),
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
export function localizePromptSpec(
  spec: PromptSpec,
  locale: Locale,
): PromptSpec {
  if (locale === "zh-CN") return spec;
  const label = localizePromptLabel(spec.id, spec.label, locale);
  const standard = localizePromptStandard(
    spec.id,
    spec.standard,
    locale,
    label,
  );
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
      standard: localizePromptStandard(
        cand.id,
        cand.standard,
        locale,
        candLabel,
      ),
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

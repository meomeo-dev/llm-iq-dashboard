/**
 * 「测评题目」（/prompts）题库目录构建、多维筛选检索与提示词原文复制纯模型。
 *
 * 严格遵守提示词不可变性（I-001）：展示层本地化仅作用于 label / standard / rubric，
 * 绝不修改 PromptSpec.template 或 PromptCandidate.text。
 */

import { BENCHMARK_2026_11_H1_IDS } from "@/core/prompt/bank/benchmarks/2026-11-h1/ids";
import { rubricFor, type RubricSpec } from "@/core/judge/schema";
import {
  ARCHIVED_PROMPTS,
  BUILTIN_PROMPTS,
  promptLifecycle,
  type PromptLifecycle,
  type PromptSpec,
  type PromptStandard,
} from "@/core/prompt";
import {
  localizeCandidateLabel,
  localizeCriterion,
  localizeGate,
  localizePromptGroupLabel,
  localizePromptLabel,
  localizePromptStandard,
  type Locale,
} from "@/i18n";

export type PromptFeatureFilter =
  | "all"
  | "suite"
  | "animated"
  | "standard"
  | "rubric"
  | "scheduled";

export type PromptScopeFilter = "active" | "all" | "archived";

export interface PromptFilterState {
  query: string;
  groupKey: string;
  feature: PromptFeatureFilter;
  scope: PromptScopeFilter;
}

export const DEFAULT_PROMPT_FILTER: PromptFilterState = {
  query: "",
  groupKey: "all",
  feature: "all",
  scope: "active",
};

export interface PromptCandidateItem {
  id: string;
  label: string;
  rawLabel: string;
  /** 发给模型的原始提示词文本（逐字锁定，严禁篡改） */
  text: string;
  standard: PromptStandard | null;
}

export interface PromptRubricGateItem {
  id: string;
  source: "static" | "render";
  title: string;
  standard: string;
}

export interface PromptRubricCriterionItem {
  id: string;
  source: "static" | "render" | "ai";
  layer: "code" | "ai";
  title: string;
  standard: string;
  maxScore: number;
  minScore?: number;
}

export interface PromptRubricView {
  id: string;
  version: number;
  passThreshold: number;
  codePoints: number;
  aiPoints: number;
  gates: readonly PromptRubricGateItem[];
  criteria: readonly PromptRubricCriterionItem[];
}

export interface PromptCatalogItem {
  id: string;
  label: string;
  rawLabel: string;
  groupKey: string;
  groupLabel: string;
  /** 发给模型的母版提示词模板（逐字锁定，严禁篡改） */
  template: string;
  variables: PromptSpec["variables"];
  variableCount: number;
  candidates: readonly PromptCandidateItem[];
  candidateCount: number;
  isSuite: boolean;
  isAnimated: boolean;
  isLocked: boolean;
  isCustom: boolean;
  isArchived: boolean;
  isScheduled: boolean;
  source: string | null;
  verified: boolean;
  /** 卡片预览标准：优先题级 standard，题组则回退至首候选场景的 standard */
  standard: PromptStandard | null;
  /** 严格题级 standard（不含候选回退） */
  promptStandard: PromptStandard | null;
  rubric: PromptRubricView | null;
  lifecycle: PromptLifecycle;
  originDate: string | null;
  registeredAt: string | null;
}

export interface PromptGroupSummary {
  key: string;
  label: string;
  count: number;
}

export interface PromptCatalogStats {
  totalPrompts: number;
  totalScenes: number;
  rubricPrompts: number;
  archivedPrompts: number;
  groups: readonly PromptGroupSummary[];
}

export interface BuildPromptCatalogOptions {
  locale: Locale;
  prompts?: readonly PromptSpec[];
  archivedPrompts?: readonly PromptSpec[];
  scheduledPromptIds?: ReadonlySet<string> | readonly string[];
  includeArchived?: boolean;
  now?: Date;
}

const CLASSIC_IDS: ReadonlySet<string> = new Set([
  "classic-v1",
  "upgraded-v2",
  "animated-pelican-v1",
  "animated-armadillo-fishnet-mars-v1",
  "animated-lemur-scooter-front-v1",
]);

const SEPTEMBER_2026_IDS: ReadonlySet<string> = new Set([
  "animated-iso-vintage-pc-v1",
  "animated-iso-amber-crt-v1",
  "animated-iso-server-rack-v1",
  "animated-iso-camera-exploded-v1",
  "animated-human-hand-kinetic-v1",
  "animated-fish-cloud-amodal-v1",
  "animated-island-chest-containment-v1",
  "animated-tree-reader-occlusion-v1",
]);

const OCTOBER_2026_IDS: ReadonlySet<string> = new Set([
  "animated-jansen-walker-v1",
  "animated-jumping-spider-leap-v1",
  "animated-centipede-wave-gait-v1",
  "animated-open-differential-v1",
  "animated-ferris-leveling-v1",
  "animated-octopus-organ-v1",
  "animated-peacock-bicycle-v1",
  "animated-nautilus-spiral-v1",
]);

const MICRO_PHYSICS_IDS: ReadonlySet<string> = new Set([
  "quantum-double-slit-v1",
  "ferrofluid-spikes-v1",
  "jwst-deployment-v1",
  "tokamak-plasma-v1",
  "gaa-nanosheet-v1",
  "crispr-cas9-rloop-v1",
  "pulsar-jet-v1",
  "quantum-double-slit",
  "ferrofluid-spikes",
  "jwst-deployment",
  "tokamak-plasma",
  "gaa-nanosheet",
  "crispr-cas9",
  "pulsar-jet",
]);

const BUILTIN_ID_SET: ReadonlySet<string> = new Set(BUILTIN_PROMPTS.map((p) => p.id));
const ARCHIVED_ID_SET: ReadonlySet<string> = new Set(ARCHIVED_PROMPTS.map((p) => p.id));

const ANIMATION_RE =
  /<animate(?:Transform|Motion)?\b|@keyframes\b|\bSMIL\b|\banimated\s+SVG\b/i;

const NOVEMBER_2026_H1_IDS: ReadonlySet<string> = new Set(BENCHMARK_2026_11_H1_IDS);

export function classifyPromptGroupKey(id: string, isCustom: boolean): string {
  if (isCustom) return "自定义提示词";
  if (CLASSIC_IDS.has(id)) return "经典基准";
  if (
    id.startsWith("shuihu") ||
    id.startsWith("xiyou") ||
    id.startsWith("sanguo") ||
    id.startsWith("honglou")
  ) {
    return "四大名著（文学与叙事构图）";
  }
  if (id.startsWith("landmarks-")) return "世界地标（微缩景观）";
  if (SEPTEMBER_2026_IDS.has(id)) return "2026-09";
  if (OCTOBER_2026_IDS.has(id)) return "2026-10";
  if (NOVEMBER_2026_H1_IDS.has(id)) return "2026-11-h1";
  if (id.startsWith("fe-")) return "2026 前沿工程评测 (FE-1 ~ FE-8)";
  if (id.startsWith("vfx-")) return "2026 前沿视觉特效 (VFX)";
  if (MICRO_PHYSICS_IDS.has(id)) return "微观物理与前沿探索";
  if (ARCHIVED_ID_SET.has(id)) return "物理与工程";
  return "自定义提示词";
}

function detectAnimatedPrompt(spec: PromptSpec, rubric: RubricSpec | null): boolean {
  if (spec.id.includes("animated") || spec.id.includes("-anim")) return true;
  if (rubric?.gates.some((g) => g.id === "G2")) return true;
  if (ANIMATION_RE.test(spec.template)) return true;
  return spec.candidates.some((c) => ANIMATION_RE.test(c.text));
}

function buildLocalizedRubricView(
  spec: RubricSpec | null,
  locale: Locale,
): PromptRubricView | null {
  if (!spec) return null;
  const gates: PromptRubricGateItem[] = spec.gates.map((g) => {
    const loc = localizeGate({ ...g, passed: true, evidence: "" }, locale);
    return { id: g.id, source: g.source, title: loc.title, standard: loc.standard };
  });
  let codePoints = 0;
  let aiPoints = 0;
  const criteria: PromptRubricCriterionItem[] = spec.criteria.map((c) => {
    const loc = localizeCriterion({ ...c, score: null, reason: null }, locale);
    const layer = c.source === "ai" ? "ai" : "code";
    if (layer === "ai") aiPoints += c.maxScore;
    else codePoints += c.maxScore;
    return {
      id: c.id,
      source: c.source,
      layer,
      title: loc.title,
      standard: loc.standard,
      maxScore: c.maxScore,
      ...(c.minScore !== undefined ? { minScore: c.minScore } : {}),
    };
  });
  return {
    id: spec.id,
    version: spec.version,
    passThreshold: spec.passThreshold,
    codePoints,
    aiPoints,
    gates,
    criteria,
  };
}

function mapPromptCandidates(
  spec: PromptSpec,
  locale: Locale,
): PromptCandidateItem[] {
  return spec.candidates.map((cand) => {
    const candLabel = localizeCandidateLabel(cand.id, cand.label, locale, cand.text);
    return {
      id: cand.id,
      label: candLabel,
      rawLabel: cand.label,
      text: cand.text,
      standard: localizePromptStandard(
        cand.id,
        cand.standard ?? spec.standard,
        locale,
        candLabel,
      ),
    };
  });
}

function toPromptCatalogItem(
  spec: PromptSpec,
  locale: Locale,
  isArchived: boolean,
  scheduledSet: ReadonlySet<string>,
  now?: Date,
): PromptCatalogItem {
  const isCustom = !spec.immutable && !BUILTIN_ID_SET.has(spec.id) && !ARCHIVED_ID_SET.has(spec.id);
  const groupKey = classifyPromptGroupKey(spec.id, isCustom);
  const label = localizePromptLabel(spec.id, spec.label, locale);
  const promptStandard = localizePromptStandard(spec.id, spec.standard, locale, label);
  const candidates = mapPromptCandidates(spec, locale);
  const rawRubric = rubricFor(spec.id);
  const firstCandStd = candidates.find((c) => c.standard !== null)?.standard ?? null;

  return {
    id: spec.id,
    label,
    rawLabel: spec.label,
    groupKey,
    groupLabel: localizePromptGroupLabel(groupKey, locale),
    template: spec.template,
    variables: spec.variables,
    variableCount: spec.variables.length,
    candidates,
    candidateCount: candidates.length,
    isSuite: candidates.length > 0,
    isAnimated: detectAnimatedPrompt(spec, rawRubric),
    isLocked: spec.id === "classic-v1",
    isCustom,
    isArchived,
    isScheduled: scheduledSet.has(spec.id),
    source: spec.source,
    verified: spec.verified,
    standard: promptStandard ?? firstCandStd,
    promptStandard,
    rubric: buildLocalizedRubricView(rawRubric, locale),
    lifecycle: promptLifecycle(spec, now, locale),
    originDate: spec.originDate ?? null,
    registeredAt: spec.registeredAt ?? null,
  };
}

export function buildPromptCatalog(options: BuildPromptCatalogOptions): PromptCatalogItem[] {
  const activePrompts = options.prompts ?? BUILTIN_PROMPTS;
  const includeArchived = options.includeArchived ?? true;
  const archivedPrompts = includeArchived ? (options.archivedPrompts ?? ARCHIVED_PROMPTS) : [];
  const scheduledSet =
    options.scheduledPromptIds instanceof Set
      ? options.scheduledPromptIds
      : new Set(options.scheduledPromptIds ?? activePrompts.map((p) => p.id));

  const seenIds = new Set<string>();
  const items: PromptCatalogItem[] = [];

  for (const spec of activePrompts) {
    if (seenIds.has(spec.id)) continue;
    seenIds.add(spec.id);
    items.push(
      toPromptCatalogItem(
        spec,
        options.locale,
        ARCHIVED_ID_SET.has(spec.id),
        scheduledSet,
        options.now,
      ),
    );
  }
  for (const spec of archivedPrompts) {
    if (seenIds.has(spec.id)) continue;
    seenIds.add(spec.id);
    items.push(toPromptCatalogItem(spec, options.locale, true, scheduledSet, options.now));
  }
  return items;
}

function matchesScopeFilter(item: PromptCatalogItem, scope: PromptScopeFilter): boolean {
  if (scope === "active") return !item.isArchived;
  if (scope === "archived") return item.isArchived;
  return true;
}

function matchesFeatureFilter(item: PromptCatalogItem, feature: PromptFeatureFilter): boolean {
  switch (feature) {
    case "suite":
      return item.isSuite;
    case "animated":
      return item.isAnimated;
    case "standard":
      return item.standard !== null;
    case "rubric":
      return item.rubric !== null;
    case "scheduled":
      return item.isScheduled;
    default:
      return true;
  }
}

function matchesTokenInItem(item: PromptCatalogItem, token: string): boolean {
  if (
    item.id.toLowerCase().includes(token) ||
    item.label.toLowerCase().includes(token) ||
    item.rawLabel.toLowerCase().includes(token) ||
    item.groupLabel.toLowerCase().includes(token) ||
    item.template.toLowerCase().includes(token)
  ) {
    return true;
  }
  if (
    item.standard &&
    (item.standard.coreKey.toLowerCase().includes(token) ||
      item.standard.groundTruth.toLowerCase().includes(token) ||
      item.standard.evaluationCriteria.toLowerCase().includes(token))
  ) {
    return true;
  }
  return item.candidates.some(
    (c) =>
      c.id.toLowerCase().includes(token) ||
      c.label.toLowerCase().includes(token) ||
      c.rawLabel.toLowerCase().includes(token) ||
      c.text.toLowerCase().includes(token) ||
      Boolean(
        c.standard &&
          (c.standard.coreKey.toLowerCase().includes(token) ||
            c.standard.groundTruth.toLowerCase().includes(token) ||
            c.standard.evaluationCriteria.toLowerCase().includes(token)),
      ),
  );
}

export function filterPromptCatalog(
  items: readonly PromptCatalogItem[],
  filter: PromptFilterState,
): PromptCatalogItem[] {
  const tokens = filter.query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  return items.filter((item) => {
    if (!matchesScopeFilter(item, filter.scope)) return false;
    if (filter.groupKey !== "all" && item.groupKey !== filter.groupKey) return false;
    if (!matchesFeatureFilter(item, filter.feature)) return false;
    if (tokens.length === 0) return true;
    return tokens.every((token) => matchesTokenInItem(item, token));
  });
}

export function computePromptCatalogStats(
  items: readonly PromptCatalogItem[],
  scope: PromptScopeFilter = "active",
): PromptCatalogStats {
  const scopedItems = items.filter((item) => matchesScopeFilter(item, scope));
  const groupMap = new Map<string, PromptGroupSummary>();
  let totalScenes = 0;
  let rubricPrompts = 0;

  for (const item of scopedItems) {
    totalScenes += item.candidateCount > 0 ? item.candidateCount : 1;
    if (item.rubric !== null) rubricPrompts += 1;
    const existing = groupMap.get(item.groupKey);
    if (existing) {
      existing.count += 1;
    } else {
      groupMap.set(item.groupKey, {
        key: item.groupKey,
        label: item.groupLabel,
        count: 1,
      });
    }
  }
  const archivedPrompts = items.filter((item) => item.isArchived).length;
  return {
    totalPrompts: scopedItems.length,
    totalScenes,
    rubricPrompts,
    archivedPrompts,
    groups: [...groupMap.values()],
  };
}

/**
 * 解析一键复制的原始提示词文本（严禁对 template 或 candidate.text 做任何裁剪或改写）。
 * - 若指定了 candidateId 且命中，返回该候选的完整 text；
 * - 若为候选集题组且未指定（或未命中）candidateId，返回首个候选的完整 text；
 * - 否则返回母版 template。
 */
export function resolveCopyablePromptText(
  item: Pick<PromptCatalogItem, "template" | "candidates">,
  candidateId?: string | null,
): string {
  if (candidateId) {
    const matched = item.candidates.find((c) => c.id === candidateId);
    if (matched) return matched.text;
  }
  if (item.candidates.length > 0) {
    return item.candidates[0]!.text;
  }
  return item.template;
}

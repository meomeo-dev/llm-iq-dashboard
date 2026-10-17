/**
 * 模型指纹「发起渠道核验」面板的数据状态与视图模型（复用“跑一次”的选择器与 Profile 模态契约）。
 */

import type { RunProfileOption, RunTargetOption } from "@/app/api/run/run-options";
import type { RunOptionsView, RunPromptOption } from "@/app/api/run/route";
import type { PromptGroup } from "@/app/components/run-control/run-once-grouping";
import {
  profileChoices,
  resolvePickedProfiles,
  type ProfileChoice,
  type StartMode,
} from "@/app/components/run-control/run-once-profiles";
import type { ModelFingerprintConfig } from "@/core/config/types";
import { PROFILE_CLIS } from "@/core/config/profiles";
import type { ModelStatusEntry, ProbeGapSummary } from "@/core/model-fingerprint/plan";
import { getProbe } from "@/core/model-fingerprint/probes";
import type { SelfTestReport } from "@/core/model-fingerprint/self-test";
import {
  isProbeId,
  PROBE_IDS,
  resolveProbeTargetSamples,
  type ProbeId,
} from "@/core/model-fingerprint/types";
import { buildTargetId, DEFAULT_PROFILE, type CliKind } from "@/core/types";
import type { FingerprintMessages, Locale } from "@/i18n";
import { resolveActiveProbes, type FingerprintProfileSummary } from "./fingerprint-model";

export interface CheckTargetItem extends RunTargetOption {
  cli: CliKind;
  usableProbes: ProbeId[];
  missingProbes: ProbeId[];
  estimatedCallsByProbe: Partial<Record<ProbeId, number>>;
  missingCallsByProbe: Partial<Record<ProbeId, number>>;
  expectedConsistency: number | null;
}

export interface UnreadyCheckModel {
  cli: CliKind;
  model: string;
  usableCount: number;
  totalCount: number;
}

export interface CheckForecastSummary {
  totalEstimatedCalls: number;
  totalMaxCalls: number;
  executableProbes: ProbeId[];
  skippedProbes: { probe: ProbeId; estimatedCalls: number }[];
  expectedConsistency: number | null;
}

export interface CheckSelectionState {
  mode: StartMode;
  choices: ProfileChoice[];
  pickedProfiles: ReadonlySet<string>;
  chosenCalls: number;
  roundDescription: string;
  loginOnlyNote: string | null;
  forecast: CheckForecastSummary;
}

export interface CheckTargetDraft {
  cli: CliKind;
  profile: string;
  declaredModel: string;
  probes: ProbeId[];
}

function supportsProfiles(cli: string): boolean {
  return (PROFILE_CLIS as readonly string[]).includes(cli);
}

function lookupExpectedConsistency(
  cli: CliKind,
  model: string,
  selfTest?: SelfTestReport | null,
  selfTestByCli?: Partial<Record<CliKind, SelfTestReport>>,
): number | null {
  const report = selfTestByCli?.[cli] ?? selfTest ?? null;
  const matched = report?.modelSelfBounds[model];
  return matched ? matched.expectedConsistency : null;
}

function buildTargetItemFromRow(
  row: ModelStatusEntry,
  activeProbes: readonly ProbeId[],
  config: ModelFingerprintConfig,
  selfTest?: SelfTestReport | null,
  selfTestByCli?: Partial<Record<CliKind, SelfTestReport>>,
): CheckTargetItem | null {
  const gapEntries = Object.values(row.probes).filter((g): g is ProbeGapSummary => g !== undefined);
  const effort = gapEntries.find((g) => g.appliedEffort !== null)?.appliedEffort ?? config.effort;
  const usableProbes: ProbeId[] = [];
  const missingProbes: ProbeId[] = [];
  const estimatedCallsByProbe: Partial<Record<ProbeId, number>> = {};
  const missingCallsByProbe: Partial<Record<ProbeId, number>> = {};

  for (const probeId of activeProbes) {
    const gap = row.probes[probeId];
    if (gap?.usable) {
      usableProbes.push(probeId);
      const codec = getProbe(probeId).resolveCodec({ cli: row.cli, model: row.model }, config.modelPrompts);
      estimatedCallsByProbe[probeId] = Math.ceil(config.valuesPerCheck / codec.valuesPerCall);
    } else {
      missingProbes.push(probeId);
      missingCallsByProbe[probeId] = gap?.estimatedCalls ?? 0;
    }
  }
  if (usableProbes.length === 0) return null;

  return {
    id: buildTargetId(row.cli, row.model, effort),
    label: `${row.cli}/${row.model}`,
    cli: row.cli,
    model: row.model,
    effort,
    defaultSelected: true,
    usableProbes,
    missingProbes,
    estimatedCallsByProbe,
    missingCallsByProbe,
    expectedConsistency: lookupExpectedConsistency(row.cli, row.model, selfTest, selfTestByCli),
  };
}

export function buildCheckTargetsView(params: {
  config: ModelFingerprintConfig;
  matrix: readonly ModelStatusEntry[];
  selfTest?: SelfTestReport | null;
  selfTestByCli?: Partial<Record<CliKind, SelfTestReport>>;
}): { targets: CheckTargetItem[]; unreadyModels: UnreadyCheckModel[] } {
  const { config, matrix, selfTest, selfTestByCli } = params;
  const activeProbes = resolveActiveProbes(config.probes);
  const targets: CheckTargetItem[] = [];
  const unreadyModels: UnreadyCheckModel[] = [];

  for (const row of matrix) {
    const item = buildTargetItemFromRow(row, activeProbes, config, selfTest, selfTestByCli);
    if (item) {
      targets.push(item);
    } else {
      unreadyModels.push({
        cli: row.cli,
        model: row.model,
        usableCount: 0,
        totalCount: activeProbes.length,
      });
    }
  }
  return { targets, unreadyModels };
}

export function buildCheckProbeOptions(
  config: ModelFingerprintConfig,
  fpMessages: FingerprintMessages,
): { items: RunPromptOption[]; groups: PromptGroup[]; allIds: ProbeId[]; defaultIds: ProbeId[] } {
  const activeSet = new Set(resolveActiveProbes(config.probes));
  const items: RunPromptOption[] = PROBE_IDS.map((probeId) => {
    const meta = fpMessages.probes[probeId];
    const targetValues = resolveProbeTargetSamples(probeId, config);
    return {
      id: probeId,
      label: meta.label,
      subtitle: `${probeId} · ${meta.desc} · ≥${targetValues}`,
      defaultSelected: activeSet.has(probeId),
    };
  });
  return {
    items,
    groups: [{ name: fpMessages.check.probesLabel, items }],
    allIds: [...PROBE_IDS],
    defaultIds: PROBE_IDS.filter((p) => activeSet.has(p)),
  };
}

export function reconcileCheckTargets(
  targets: readonly CheckTargetItem[],
  current: ReadonlySet<string>,
  initialized: boolean,
): ReadonlySet<string> {
  const validIds = new Set(targets.map((t) => t.id));
  if (!initialized) {
    return new Set(targets.filter((t) => t.defaultSelected).map((t) => t.id));
  }
  const kept = [...current].filter((id) => validIds.has(id));
  if (kept.length === 0 && current.size > 0 && targets.length > 0) {
    return new Set(targets.filter((t) => t.defaultSelected).map((t) => t.id));
  }
  return new Set(kept);
}

function toCheckProfileOptions(
  profiles: readonly FingerprintProfileSummary[],
  locale: Locale,
): RunProfileOption[] {
  const isEn = locale === "en";
  return profiles.map((p) => {
    const baseLabel = p.label && p.label !== p.name ? `${p.name} (${p.label})` : p.name;
    const disabledSuffix = p.enabled === false ? (isEn ? " (Disabled)" : "（已停用）") : "";
    return {
      name: p.name,
      label: `${baseLabel}${disabledSuffix}`,
      cli: p.cli ?? "codex",
      // 渠道核验支持对未加入定时任务的 profile 发起检测（collect.ts allowDisabled: true），只校验 hasKey 与 models
      enabled: true,
      hasKey: p.hasKey ?? true,
      models: p.models ? [...p.models] : [],
    };
  });
}

function computeTargetCallsForProbes(
  target: CheckTargetItem,
  selectedProbes: readonly ProbeId[],
): number {
  return selectedProbes.reduce(
    (sum, p) => sum + (target.usableProbes.includes(p) ? (target.estimatedCallsByProbe[p] ?? 0) : 0),
    0,
  );
}

function computeTotalCheckCalls(
  selectedTargets: readonly CheckTargetItem[],
  selectedProbes: readonly ProbeId[],
  profiles: readonly string[],
): number {
  const profileMult = Math.max(1, profiles.length);
  return selectedTargets.reduce((sum, t) => {
    const perRun = computeTargetCallsForProbes(t, selectedProbes);
    return sum + perRun * (supportsProfiles(t.cli) ? profileMult : 1);
  }, 0);
}

function computeCheckForecast(
  config: ModelFingerprintConfig,
  selectedTargets: readonly CheckTargetItem[],
  selectedProbes: readonly ProbeId[],
  multiplierProfiles: readonly string[],
): CheckForecastSummary {
  const execSet = new Set<ProbeId>();
  const skippedMap = new Map<ProbeId, number>();
  for (const t of selectedTargets) {
    for (const p of selectedProbes) {
      if (t.usableProbes.includes(p)) {
        execSet.add(p);
      } else {
        const prev = skippedMap.get(p) ?? 0;
        skippedMap.set(p, Math.max(prev, t.missingCallsByProbe[p] ?? 0));
      }
    }
  }
  const totalEstimatedCalls = computeTotalCheckCalls(selectedTargets, selectedProbes, multiplierProfiles);
  const rates = selectedTargets
    .map((t) => t.expectedConsistency)
    .filter((r): r is number => r !== null);
  return {
    totalEstimatedCalls,
    totalMaxCalls: totalEstimatedCalls * config.checkAttempts,
    executableProbes: PROBE_IDS.filter((p) => execSet.has(p)),
    skippedProbes: PROBE_IDS.filter((p) => skippedMap.has(p) && !execSet.has(p)).map((p) => ({
      probe: p,
      estimatedCalls: skippedMap.get(p) ?? 0,
    })),
    expectedConsistency: rates.length > 0 ? Math.min(...rates) : null,
  };
}

function shortenItems(items: readonly string[], locale: Locale): string {
  const sep = locale === "en" ? ", " : "、";
  if (items.length <= 3) return items.join(sep);
  return locale === "en"
    ? `${items.slice(0, 3).join(sep)}... (${items.length} total)`
    : `${items.slice(0, 3).join(sep)} 等 ${items.length} 个`;
}

function resolveCheckStartMode(
  selectedTargets: readonly CheckTargetItem[],
  selectedProbes: readonly ProbeId[],
  choices: readonly ProfileChoice[],
  baseCalls: number,
  locale: Locale,
): StartMode {
  const isEn = locale === "en";
  if (selectedTargets.length === 0 || selectedProbes.length === 0) {
    return { kind: "direct", profiles: undefined, calls: 0 };
  }
  if (baseCalls === 0) {
    return {
      kind: "none",
      reason: isEn ? "Selected probes have no full baseline" : "所选探针尚无满额基准样本",
    };
  }
  if (choices.length > 1) {
    const available = choices.filter((c) => c.available);
    return available.length === 0
      ? { kind: "none", reason: isEn ? "No available profiles" : "没有可用的上游" }
      : { kind: "choose" };
  }
  return { kind: "direct", profiles: choices.length === 1 ? [choices[0]!.id] : undefined, calls: baseCalls };
}

function buildCheckRoundMeta(
  selectedTargets: readonly CheckTargetItem[],
  probeOptions: readonly RunPromptOption[],
  pickedProbes: ReadonlySet<string>,
  locale: Locale,
): { roundDescription: string; loginOnlyNote: string | null } {
  const isEn = locale === "en";
  const combos = selectedTargets.map((t) => `${t.model} · ${t.effort}`);
  const probeTitles = probeOptions.filter((p) => pickedProbes.has(p.id)).map((p) => p.label);
  const roundDescription = `${shortenItems(combos, locale)} × ${shortenItems(probeTitles, locale)}`;
  const loginOnlyNames = selectedTargets
    .filter((t) => !supportsProfiles(t.cli))
    .map((t) => `${t.cli} ${t.model}`);
  const loginOnlyNote =
    loginOnlyNames.length > 0
      ? isEn
        ? `${[...new Set(loginOnlyNames)].join(", ")} run on official login only`
        : `${[...new Set(loginOnlyNames)].join("、")} 只跑登录态`
      : null;
  return { roundDescription, loginOnlyNote };
}

export function computeCheckSelectionState(params: {
  config: ModelFingerprintConfig;
  targets: readonly CheckTargetItem[];
  probeOptions: readonly RunPromptOption[];
  profiles: readonly FingerprintProfileSummary[];
  pickedTargets: ReadonlySet<string>;
  pickedProbes: ReadonlySet<string>;
  storedProfiles: readonly string[] | null;
  locale: Locale;
}): CheckSelectionState {
  const { config, targets, probeOptions, profiles, pickedTargets, pickedProbes, storedProfiles, locale } = params;
  const selectedTargets = targets.filter((t) => pickedTargets.has(t.id));
  const selectedProbes = PROBE_IDS.filter((p) => pickedProbes.has(p));
  const mockOptions: RunOptionsView = {
    targets: [...targets],
    unavailable: [],
    profiles: toCheckProfileOptions(profiles, locale),
    loginUnavailable: [],
    prompts: [...probeOptions],
    activeRunId: null,
    costs: { expected: {}, spentLastDayUsd: 0, budget: { perRoundUsd: null, perDayUsd: null } },
  };

  const choices = profileChoices(mockOptions, pickedTargets, locale);
  const pickedProfileList = resolvePickedProfiles(choices, storedProfiles);
  const baseCalls = computeTotalCheckCalls(selectedTargets, selectedProbes, [DEFAULT_PROFILE]);
  const chosenCalls = computeTotalCheckCalls(selectedTargets, selectedProbes, pickedProfileList);
  const mode = resolveCheckStartMode(selectedTargets, selectedProbes, choices, baseCalls, locale);
  const { roundDescription, loginOnlyNote } = buildCheckRoundMeta(selectedTargets, probeOptions, pickedProbes, locale);
  const activeMultiplier = mode.kind === "choose" ? pickedProfileList : [DEFAULT_PROFILE];
  const forecast = computeCheckForecast(config, selectedTargets, selectedProbes, activeMultiplier);

  return {
    mode,
    choices,
    pickedProfiles: new Set(pickedProfileList),
    chosenCalls,
    roundDescription,
    loginOnlyNote,
    forecast,
  };
}

export function buildCheckBatchDrafts(params: {
  targets: readonly CheckTargetItem[];
  pickedTargets: ReadonlySet<string>;
  pickedProbes: ReadonlySet<string>;
  profiles?: readonly string[];
}): CheckTargetDraft[] {
  const { targets, pickedTargets, pickedProbes, profiles } = params;
  const selectedProbes = PROBE_IDS.filter((p) => pickedProbes.has(p));
  const drafts: CheckTargetDraft[] = [];

  for (const target of targets) {
    if (!pickedTargets.has(target.id)) continue;
    const executableProbes = selectedProbes.filter((p) => target.usableProbes.includes(p));
    if (executableProbes.length === 0) continue;
    if (supportsProfiles(target.cli) && profiles && profiles.length > 0) {
      for (const prof of profiles) {
        drafts.push({
          cli: target.cli,
          profile: prof === DEFAULT_PROFILE ? "" : prof,
          declaredModel: target.model,
          probes: executableProbes,
        });
      }
    } else {
      drafts.push({
        cli: target.cli,
        profile: "",
        declaredModel: target.model,
        probes: executableProbes,
      });
    }
  }
  return drafts;
}

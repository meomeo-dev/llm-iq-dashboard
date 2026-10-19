/**
 * 模型指纹「发起渠道核验」面板的数据状态与视图模型（复用“跑一次”的选择器与 Profile 模态契约）。
 */

import type { RunTargetOption } from "@/app/api/run/run-options";
import type { RunPromptOption } from "@/app/api/run/route";
import type { PromptGroup } from "@/app/components/run-control/run-once-grouping";
import {
  resolvePickedProfiles,
  shorten,
  supportsProfiles,
  type ProfileChoice,
  type StartMode,
} from "@/app/components/run-control/run-once-profiles";
import type { ModelFingerprintConfig } from "@/core/config/types";
import type { ModelStatusEntry, ProbeGapSummary } from "@/core/model-fingerprint/plan";
import { getProbe } from "@/core/model-fingerprint/probes";
import type { SelfTestReport } from "@/core/model-fingerprint/self-test";
import {
  PROBE_IDS,
  resolveProbeTargetSamples,
  resolveProbeValuesPerCheck,
  type ProbeId,
} from "@/core/model-fingerprint/types";
import { buildTargetId, DEFAULT_PROFILE, type CliKind } from "@/core/types";
import type { FingerprintMessages, Locale } from "@/i18n";
import { resolveActiveProbes, type FingerprintProfileSummary } from "./fingerprint-model";

export interface CheckTargetItem extends RunTargetOption {
  cli: CliKind;
  usableProbes: ProbeId[];
  missingProbes: ProbeId[];
  totalProbes: number;
  estimatedCallsByProbe: Partial<Record<ProbeId, number>>;
  missingCallsByProbe: Partial<Record<ProbeId, number>>;
  unitCostByProbe: Partial<Record<ProbeId, number | null>>;
  expectedConsistency: number | null;
  matchedProfiles: string[];
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
  estimatedCostUsd: number | null;
  executableProbes: ProbeId[];
  skippedProbes: { probe: ProbeId; estimatedCalls: number }[];
  expectedConsistency: number | null;
}

export interface CheckSelectionState {
  mode: StartMode;
  choices: ProfileChoice[];
  panelChoices: ProfileChoice[];
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

export const supportsCheckProfiles = supportsProfiles;

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

export function isProfileApplicableToTarget(
  profileName: string,
  target: { cli: CliKind; model: string },
  availableProfiles?: readonly FingerprintProfileSummary[],
): boolean {
  if (profileName === DEFAULT_PROFILE || profileName === "") return true;
  if (!supportsCheckProfiles(target.cli)) return false;
  if (!availableProfiles || availableProfiles.length === 0) return true;
  const meta = availableProfiles.find((p) => p.name === profileName);
  if (!meta) return true;
  if (meta.cli && meta.cli !== target.cli) return false;
  if (meta.models && meta.models.length > 0 && !meta.models.includes(target.model)) return false;
  return true;
}

function buildTargetItemFromRow(
  row: ModelStatusEntry,
  activeProbes: readonly ProbeId[],
  config: ModelFingerprintConfig,
  profiles: readonly FingerprintProfileSummary[],
  selfTest?: SelfTestReport | null,
  selfTestByCli?: Partial<Record<CliKind, SelfTestReport>>,
): CheckTargetItem {
  const gapEntries = Object.values(row.probes).filter((g): g is ProbeGapSummary => g !== undefined);
  const effort = gapEntries.find((g) => g.appliedEffort != null)?.appliedEffort ?? config.effort;
  const usableProbes: ProbeId[] = [];
  const missingProbes: ProbeId[] = [];
  const estimatedCallsByProbe: Partial<Record<ProbeId, number>> = {};
  const missingCallsByProbe: Partial<Record<ProbeId, number>> = {};
  const unitCostByProbe: Partial<Record<ProbeId, number | null>> = {};

  for (const probeId of activeProbes) {
    const gap = row.probes[probeId];
    const codec = getProbe(probeId).resolveCodec({ cli: row.cli, model: row.model }, config.modelPrompts);
    const checkValues = resolveProbeValuesPerCheck(probeId, config);
    estimatedCallsByProbe[probeId] = Math.ceil(checkValues / codec.valuesPerCall);
    unitCostByProbe[probeId] = gap?.unitCostUsd ?? null;
    if (gap?.usable) {
      usableProbes.push(probeId);
    } else {
      missingProbes.push(probeId);
      missingCallsByProbe[probeId] = gap?.estimatedCalls ?? 0;
    }
  }
  const matchedProfiles = supportsCheckProfiles(row.cli)
    ? profiles.filter((p) => isProfileApplicableToTarget(p.name, row, profiles)).map((p) => p.label || p.name)
    : [];

  return {
    id: buildTargetId(row.cli, row.model, effort),
    label: `${row.cli}/${row.model}`,
    cli: row.cli,
    model: row.model,
    effort,
    defaultSelected: usableProbes.length > 0,
    usableProbes,
    missingProbes,
    totalProbes: activeProbes.length,
    estimatedCallsByProbe,
    missingCallsByProbe,
    unitCostByProbe,
    expectedConsistency: lookupExpectedConsistency(row.cli, row.model, selfTest, selfTestByCli),
    matchedProfiles,
  };
}

export function buildCheckTargetsView(params: {
  config: ModelFingerprintConfig;
  matrix: readonly ModelStatusEntry[];
  profiles?: readonly FingerprintProfileSummary[];
  selfTest?: SelfTestReport | null;
  selfTestByCli?: Partial<Record<CliKind, SelfTestReport>>;
}): { targets: CheckTargetItem[]; unreadyModels: UnreadyCheckModel[] } {
  const { config, matrix, profiles = [], selfTest, selfTestByCli } = params;
  const activeProbes = resolveActiveProbes(config.probes);
  const targets: CheckTargetItem[] = [];
  const unreadyModels: UnreadyCheckModel[] = [];

  for (const row of matrix) {
    const item = buildTargetItemFromRow(row, activeProbes, config, profiles, selfTest, selfTestByCli);
    targets.push(item);
    if (item.usableProbes.length === 0) {
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
    const checkValues = resolveProbeValuesPerCheck(probeId, config);
    const defaultPerCall = getProbe(probeId).defaultCodec.valuesPerCall;
    const checkCalls = Math.ceil(checkValues / defaultPerCall);
    return {
      id: probeId,
      label: meta.label,
      subtitle: `${probeId} · ${meta.desc} · ≥${targetValues} (check: ${checkCalls}×${defaultPerCall}=${checkValues})`,
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

export {
  CHECK_PROFILE_STORAGE_KEY,
  CHECK_SELECTION_STORAGE_KEY,
  readStoredCheckProfiles,
  readStoredCheckSelection,
  reconcileCheckTargets,
  resolveCheckProbes,
  writeStoredCheckProfiles,
  writeStoredCheckSelection,
} from "./fingerprint-check-store";

function buildUnionProfileChoices(
  combos: readonly CheckTargetItem[],
  profiles: readonly FingerprintProfileSummary[],
  locale: Locale,
): ProfileChoice[] {
  if (combos.length === 0) return [];
  const isEn = locale === "en";
  const clis = new Set(combos.map((c) => c.cli));
  const login: ProfileChoice = {
    id: DEFAULT_PROFILE,
    label: isEn ? "Official Login" : "登录态",
    available: true,
    reason: null,
  };
  const upstreams = profiles
    .filter((p) => clis.has(p.cli ?? "codex"))
    .map((p): ProfileChoice => {
      const cli = p.cli ?? "codex";
      const cliCombos = combos.filter((c) => c.cli === cli);
      const matched = cliCombos.filter((c) => isProfileApplicableToTarget(p.name, c, profiles));
      const hasKey = p.hasKey ?? true;
      const baseLabel = p.label && p.label.trim() !== "" ? p.label : p.name;
      const disabledSuffix = p.enabled === false ? (isEn ? " (Disabled)" : "（已停用）") : "";
      const available = hasKey && matched.length > 0;
      const reason = !hasKey
        ? isEn ? "Missing API key" : "未填 key"
        : matched.length === 0
          ? isEn ? "No matching selected model" : "不含所选模型"
          : matched.length < cliCombos.length
            ? isEn ? `${matched.length}/${cliCombos.length} models` : `适用 ${matched.length}/${cliCombos.length} 个模型`
            : null;
      return { id: p.name, label: `${baseLabel}${disabledSuffix}`, available, reason };
    });
  return [login, ...upstreams];
}

function computeTargetCallsForProbes(
  target: CheckTargetItem,
  selectedProbes: readonly ProbeId[],
): number {
  const effective = target.usableProbes.length > 0
    ? selectedProbes.filter((p) => target.usableProbes.includes(p))
    : selectedProbes;
  return effective.reduce((sum, p) => sum + (target.estimatedCallsByProbe[p] ?? 0), 0);
}

function computeTotalCheckCalls(
  selectedTargets: readonly CheckTargetItem[],
  selectedProbes: readonly ProbeId[],
  profiles: readonly string[],
  availableProfiles?: readonly FingerprintProfileSummary[],
): number {
  return selectedTargets.reduce((sum, t) => {
    const perRun = computeTargetCallsForProbes(t, selectedProbes);
    if (!supportsCheckProfiles(t.cli)) return sum + perRun;
    const applicableCount = profiles.filter((prof) => isProfileApplicableToTarget(prof, t, availableProfiles)).length;
    return sum + perRun * applicableCount;
  }, 0);
}

function computeTotalCheckCost(
  selectedTargets: readonly CheckTargetItem[],
  selectedProbes: readonly ProbeId[],
  profiles: readonly string[],
  availableProfiles?: readonly FingerprintProfileSummary[],
): number | null {
  let total = 0;
  let hasCost = false;
  for (const t of selectedTargets) {
    const effective = t.usableProbes.length > 0 ? selectedProbes.filter((p) => t.usableProbes.includes(p)) : selectedProbes;
    let perRunCost = 0;
    let targetHasCost = false;
    for (const p of effective) {
      const unit = t.unitCostByProbe[p] ?? null;
      if (unit !== null) {
        perRunCost += (t.estimatedCallsByProbe[p] ?? 0) * unit;
        targetHasCost = true;
      }
    }
    if (!targetHasCost) continue;
    const count = !supportsCheckProfiles(t.cli) ? 1 : profiles.filter((prof) => isProfileApplicableToTarget(prof, t, availableProfiles)).length;
    if (count > 0) {
      total += perRunCost * count;
      hasCost = true;
    }
  }
  return hasCost ? Math.round(total * 1_000_000) / 1_000_000 : null;
}

function computeCheckForecast(
  config: ModelFingerprintConfig,
  selectedTargets: readonly CheckTargetItem[],
  selectedProbes: readonly ProbeId[],
  multiplierProfiles: readonly string[],
  availableProfiles?: readonly FingerprintProfileSummary[],
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
  const totalEstimatedCalls = computeTotalCheckCalls(
    selectedTargets,
    selectedProbes,
    multiplierProfiles,
    availableProfiles,
  );
  const estimatedCostUsd = computeTotalCheckCost(
    selectedTargets,
    selectedProbes,
    multiplierProfiles,
    availableProfiles,
  );
  const rates = selectedTargets
    .map((t) => t.expectedConsistency)
    .filter((r): r is number => r !== null);
  return {
    totalEstimatedCalls,
    totalMaxCalls: totalEstimatedCalls * config.checkAttempts,
    estimatedCostUsd,
    executableProbes: PROBE_IDS.filter((p) => execSet.has(p)),
    skippedProbes: PROBE_IDS.filter((p) => skippedMap.has(p) && !execSet.has(p)).map((p) => ({
      probe: p,
      estimatedCalls: skippedMap.get(p) ?? 0,
    })),
    expectedConsistency: rates.length > 0 ? Math.min(...rates) : null,
  };
}

function resolveCheckStartMode(
  selectedTargets: readonly CheckTargetItem[],
  selectedProbes: readonly ProbeId[],
  choices: readonly ProfileChoice[],
  baseCalls: number,
  availableProfiles: readonly FingerprintProfileSummary[],
  locale: Locale,
): StartMode {
  const isEn = locale === "en";
  if (selectedTargets.length === 0 || selectedProbes.length === 0) {
    return { kind: "direct", profiles: undefined, calls: 0 };
  }
  if (choices.length > 0) {
    const available = choices.filter((c) => c.available);
    if (available.length === 0) {
      return { kind: "none", reason: isEn ? "No available profiles" : "没有可用的上游" };
    }
    if (available.length === 1) {
      const only = available[0]!;
      const calls = computeTotalCheckCalls(selectedTargets, selectedProbes, [only.id], availableProfiles);
      return { kind: "direct", profiles: [only.id], calls };
    }
    return { kind: "choose" };
  }
  return { kind: "direct", profiles: undefined, calls: baseCalls };
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
  const roundDescription = `${shorten(combos, locale)} × ${shorten(probeTitles, locale)}`;
  const loginOnlyNames = selectedTargets
    .filter((t) => !supportsCheckProfiles(t.cli))
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
  const pickedProfileCombos = selectedTargets.filter((t) => supportsCheckProfiles(t.cli));
  const allProfileCombos = targets.filter((t) => supportsCheckProfiles(t.cli));

  const choices = buildUnionProfileChoices(pickedProfileCombos, profiles, locale);
  const panelChoices = buildUnionProfileChoices(
    pickedProfileCombos.length > 0 ? pickedProfileCombos : allProfileCombos,
    profiles,
    locale,
  );
  const pickedProfileList = resolvePickedProfiles(choices, storedProfiles);
  const baseCalls = computeTotalCheckCalls(selectedTargets, selectedProbes, [DEFAULT_PROFILE], profiles);
  const chosenCalls = computeTotalCheckCalls(selectedTargets, selectedProbes, pickedProfileList, profiles);
  const mode = resolveCheckStartMode(selectedTargets, selectedProbes, choices, baseCalls, profiles, locale);
  const { roundDescription, loginOnlyNote } = buildCheckRoundMeta(selectedTargets, probeOptions, pickedProbes, locale);
  const activeMultiplier =
    mode.kind === "direct" && mode.profiles ? mode.profiles : [DEFAULT_PROFILE];
  const forecast = computeCheckForecast(config, selectedTargets, selectedProbes, activeMultiplier, profiles);

  return {
    mode,
    choices,
    panelChoices,
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
  availableProfiles?: readonly FingerprintProfileSummary[];
}): CheckTargetDraft[] {
  const { targets, pickedTargets, pickedProbes, profiles, availableProfiles } = params;
  const selectedProbes = PROBE_IDS.filter((p) => pickedProbes.has(p));
  const drafts: CheckTargetDraft[] = [];

  for (const target of targets) {
    if (!pickedTargets.has(target.id)) continue;
    const executableProbes = selectedProbes.filter((p) => target.usableProbes.includes(p));
    if (executableProbes.length === 0) continue;
    if (supportsCheckProfiles(target.cli) && profiles && profiles.length > 0) {
      for (const prof of profiles) {
        if (!isProfileApplicableToTarget(prof, target, availableProfiles)) continue;
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

export function checkStartLabel(
  mode: StartMode,
  busy: boolean,
  jobActive: boolean,
  locale: Locale,
): string {
  const isEn = locale === "en";
  if (busy && !jobActive) return isEn ? "Starting…" : "发起中…";
  if (jobActive) return isEn ? "Verification running…" : "核验执行中…";
  if (mode.kind === "choose") return isEn ? "Select Profiles & Start" : "选择 Profile 后开始";
  if (mode.kind === "none") return mode.reason;
  return isEn ? `Start (${mode.calls} calls)` : `开始（${mode.calls} 次调用）`;
}

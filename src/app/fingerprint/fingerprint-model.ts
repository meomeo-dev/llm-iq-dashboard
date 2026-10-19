/**
 * 模型统计指纹核验页面的纯函数视图模型与请求构造器。
 */

import { actionFetch } from "@/app/components/action-fetch";
import type { ActiveWorkItem } from "@/core/active-work";
import type { ModelFingerprintConfig } from "@/core/config/types";
import type { FingerprintJobView } from "@/core/model-fingerprint/job";
import type {
  FillPlan,
  ModelStatusEntry,
  ProbeGapSummary,
  VerificationCheckPlan,
} from "@/core/model-fingerprint/plan";
import type { SelfTestReport } from "@/core/model-fingerprint/self-test";
import {
  PROBE_IDS,
  resolveProbeTargetSamples,
  type DecodedAttemptSummary,
  type FingerprintCheckRecord,
  type ProbeId,
} from "@/core/model-fingerprint/types";
import { orderProfileNames, type ProfileView } from "@/core/profile-view";
import type { CliKind } from "@/core/types";

export interface MatrixCellViewModel {
  probeId: ProbeId;
  validValues: number;
  targetValues: number;
  missingValues: number;
  estimatedCalls: number;
  usable: boolean;
  statusClass: "ready" | "partial" | "empty";
  progressText: string;
  intraProbeSim?: number | null;
  intraProbeLowerBound?: number | null;
  spentCostUsd?: number | null;
  estimatedCostUsd?: number | null;
  totalTokens?: number | null;
  totalDurationMs?: number;
}

export interface MatrixRowViewModel {
  cli: CliKind;
  model: string;
  usableProbes: number;
  totalProbes: number;
  totalMissingValues: number;
  totalEstimatedCalls: number;
  totalSpentCostUsd: number | null;
  totalEstimatedCostUsd: number | null;
  totalTokens: number | null;
  canExport: boolean;
  appliedEffort?: string | null;
  effortHonored?: boolean | null;
  cliVersions?: string[];
  cells: MatrixCellViewModel[];
}

export interface FingerprintProfileSummary {
  name: string;
  label?: string | null;
  cli?: CliKind;
  enabled?: boolean;
  hasKey?: boolean;
  models?: string[];
  upstreamType?: string;
  group?: string | null;
  website?: string | null;
  multiplier?: number;
}

export interface FingerprintApiSnapshot {
  modelFingerprint: ModelFingerprintConfig;
  defaultTimeZone?: string | null;
  profiles: FingerprintProfileSummary[];
  matrix: ModelStatusEntry[];
  fillPlan?: FillPlan;
  selfTest?: SelfTestReport | null;
  selfTestByCli?: Partial<Record<CliKind, SelfTestReport>>;
  activeJob: FingerprintJobView | null;
  activeWork?: ActiveWorkItem | null;
  checks: FingerprintCheckRecord[];
}

export interface SelectedProbeCell {
  cli: CliKind;
  model: string;
  probe: ProbeId;
}

export interface ProbeCellDetailResponse {
  cli: CliKind;
  model: string;
  probe: ProbeId;
  gap: ProbeGapSummary;
  attempts: DecodedAttemptSummary[];
}

export function resolveActiveProbes(probes?: readonly ProbeId[]): readonly ProbeId[] {
  return probes && probes.length > 0 ? probes : PROBE_IDS;
}

export function cellStatusClass(
  validValues: number,
  targetValues: number,
): "ready" | "partial" | "empty" {
  if (validValues >= targetValues && targetValues > 0) {
    return "ready";
  }
  if (validValues > 0) {
    return "partial";
  }
  return "empty";
}

export function formatCellProgress(validValues: number, targetValues: number): string {
  return `${validValues}/${targetValues}`;
}

function toCellViewModel(gap: ProbeGapSummary, fallbackTargetValues: number): MatrixCellViewModel {
  const targetValues = gap.targetValues ?? fallbackTargetValues;
  return {
    probeId: gap.probe,
    validValues: gap.validValues,
    targetValues,
    missingValues: gap.missingValues,
    estimatedCalls: gap.estimatedCalls,
    usable: gap.usable,
    statusClass: cellStatusClass(gap.validValues, targetValues),
    progressText: formatCellProgress(gap.validValues, targetValues),
    intraProbeSim: gap.intraProbeSim ?? null,
    intraProbeLowerBound: gap.intraProbeLowerBound ?? null,
    spentCostUsd: gap.spentCostUsd ?? null,
    estimatedCostUsd: gap.estimatedCostUsd ?? null,
    totalTokens: gap.totalTokens ?? null,
    totalDurationMs: gap.totalDurationMs ?? 0,
  };
}

function emptyCellViewModel(probeId: ProbeId, targetValues: number): MatrixCellViewModel {
  return {
    probeId,
    validValues: 0,
    targetValues,
    missingValues: targetValues,
    estimatedCalls: 0,
    usable: false,
    statusClass: "empty",
    progressText: `0/${targetValues}`,
    intraProbeSim: null,
    intraProbeLowerBound: null,
    spentCostUsd: null,
    estimatedCostUsd: null,
    totalTokens: null,
    totalDurationMs: 0,
  };
}

function sumNullableMetrics(values: readonly (number | null | undefined)[]): number | null {
  let sum = 0;
  let has = false;
  for (const v of values) {
    if (typeof v === "number" && Number.isFinite(v)) {
      sum += v;
      has = true;
    }
  }
  return has ? Math.round(sum * 1_000_000) / 1_000_000 : null;
}

export function buildMatrixViewModel(
  matrix: readonly ModelStatusEntry[],
  probes: readonly ProbeId[],
  samplesPerProbe: number,
  samplesByProbe?: Partial<Record<ProbeId, number>>,
): MatrixRowViewModel[] {
  const activeProbes = resolveActiveProbes(probes);
  return matrix.map((row) => {
    const gapEntries = Object.values(row.probes).filter((g): g is ProbeGapSummary => g !== undefined);
    const firstWithEffort = gapEntries.find((g) => g.appliedEffort !== null);
    const cliVersions = Array.from(
      new Set(
        gapEntries
          .flatMap((g) => g.cliVersions)
          .map((v) => v.replace(new RegExp(`^${row.cli}\\s+${row.cli}(?:-cli)?\\s+`, "i"), `${row.cli} `)),
      ),
    );
    const cells: MatrixCellViewModel[] = activeProbes.map((probeId) => {
      const probeTarget = resolveProbeTargetSamples(probeId, { samplesPerProbe, samplesByProbe });
      const gap = row.probes[probeId];
      return gap ? toCellViewModel(gap, probeTarget) : emptyCellViewModel(probeId, probeTarget);
    });
    const usableProbes = cells.filter((c) => c.usable).length;
    const totalMissingValues = cells.reduce((sum, c) => sum + c.missingValues, 0);
    const totalEstimatedCalls = cells.reduce((sum, c) => sum + c.estimatedCalls, 0);
    const totalSpentCostUsd = sumNullableMetrics(cells.map((c) => c.spentCostUsd));
    const totalEstimatedCostUsd = sumNullableMetrics(cells.map((c) => c.estimatedCostUsd));
    const totalTokens = sumNullableMetrics(cells.map((c) => c.totalTokens));
    const canExport = cells.some((c) => c.validValues > 0);
    return {
      cli: row.cli,
      model: row.model,
      usableProbes,
      totalProbes: activeProbes.length,
      totalMissingValues,
      totalEstimatedCalls,
      totalSpentCostUsd,
      totalEstimatedCostUsd,
      totalTokens,
      canExport,
      appliedEffort: firstWithEffort?.appliedEffort ?? null,
      effortHonored: firstWithEffort?.effortHonored ?? null,
      cliVersions,
      cells,
    };
  });
}

export function formatSimilarityScore(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }
  return value.toFixed(4);
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }
  return `${(value * 100).toFixed(1)}%`;
}

export function sortCheckRecordsDescending(
  checks: readonly FingerprintCheckRecord[],
): FingerprintCheckRecord[] {
  return [...checks].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export interface FillRequestOptions {
  cli?: CliKind;
  profile?: string;
  profilesByCli?: Partial<Record<CliKind, string>>;
  model?: string;
  probes?: ProbeId[];
  count?: number;
}

export function listFillableCliProfiles(
  cli: CliKind,
  profiles: readonly FingerprintProfileSummary[],
): FingerprintProfileSummary[] {
  return profiles.filter((p) => (p.cli ?? "codex") === cli && p.hasKey !== false);
}

export function defaultFillProfilesByCli(
  profiles: readonly FingerprintProfileSummary[],
  matrix: readonly { cli: CliKind; model: string }[] = [],
): Partial<Record<CliKind, string>> {
  const clis = new Set<CliKind>(profiles.map((p) => p.cli ?? "codex"));
  const out: Partial<Record<CliKind, string>> = {};
  for (const cli of clis) {
    const usable = listFillableCliProfiles(cli, profiles);
    if (usable.length === 0) continue;
    const cliModels = matrix.filter((m) => m.cli === cli).map((m) => m.model);
    const pool = usable.some((p) => p.enabled !== false)
      ? usable.filter((p) => p.enabled !== false)
      : usable;
    let best: FingerprintProfileSummary | undefined = pool[0];
    let bestCover = -1;
    for (const candidate of pool) {
      const models = candidate.models ?? [];
      const cover = models.length === 0 ? cliModels.length : cliModels.filter((m) => models.includes(m)).length;
      if (cover > bestCover) {
        bestCover = cover;
        best = candidate;
      }
    }
    out[cli] = best?.name ?? "default";
  }
  return out;
}

export function buildFillRequestBody(options: FillRequestOptions & { action?: "fill" | "plan" }): string {
  const profile = options.profile && options.profile.trim() !== "" ? options.profile.trim() : undefined;
  return JSON.stringify({
    action: options.action ?? "fill",
    mode: "fill",
    cli: options.cli,
    profile,
    profilesByCli: options.profilesByCli,
    model: options.model,
    probes: options.probes,
    count: options.count,
  });
}

export function buildCheckRequestBody(options: {
  action?: "check" | "plan";
  cli: CliKind;
  profile?: string;
  declaredModel: string;
  probes?: ProbeId[];
  targets?: readonly {
    cli: CliKind;
    profile?: string;
    declaredModel: string;
    probes?: ProbeId[];
  }[];
}): string {
  const targets = options.targets?.map((t) => ({
    cli: t.cli,
    profile: t.profile && t.profile.trim() !== "" ? t.profile.trim() : undefined,
    model: t.declaredModel.trim(),
    probes: t.probes && t.probes.length > 0 ? t.probes : undefined,
  }));
  return JSON.stringify({
    action: options.action ?? "check",
    mode: "check",
    cli: options.cli,
    profile: options.profile && options.profile.trim() !== "" ? options.profile.trim() : undefined,
    model: options.declaredModel.trim(),
    probes: options.probes && options.probes.length > 0 ? options.probes : undefined,
    ...(targets && targets.length > 0 ? { targets } : {}),
  });
}

export function buildSampleMutationBody(options: {
  action: "exclude" | "include" | "reset";
  cli: CliKind;
  model: string;
  probe: ProbeId;
  reqId?: string;
}): string {
  return JSON.stringify({
    cli: options.cli,
    model: options.model,
    probe: options.probe,
    exclude: options.action === "exclude" && options.reqId ? [options.reqId] : undefined,
    include: options.action === "include" && options.reqId ? [options.reqId] : undefined,
    reset: options.action === "reset" ? true : undefined,
  });
}

export async function fetchFingerprintSnapshot(): Promise<FingerprintApiSnapshot> {
  const res = await fetch("/api/fingerprint", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`);
  }
  return data as FingerprintApiSnapshot;
}

export async function postFingerprintJson<T>(bodyJson: string): Promise<T> {
  const res = await actionFetch("/api/fingerprint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: bodyJson,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`);
  }
  return data as T;
}

export async function patchSampleJson<T>(bodyJson: string): Promise<T> {
  const res = await actionFetch("/api/fingerprint/samples", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: bodyJson,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`);
  }
  return data as T;
}

export {
  downloadFingerprintBundle,
  uploadFingerprintBundle,
  type BundleImportResponse,
} from "./use-fingerprint-bundle";

export function normalizeCheckProfile(profile: string | undefined): string {
  const trimmed = (profile ?? "").trim();
  return trimmed.length === 0 ? "default" : trimmed;
}

export function resolveActiveCheckView(record: FingerprintCheckRecord): FingerprintCheckRecord {
  const latest = record.rescores[record.rescores.length - 1];
  return latest ? { ...record, ...latest } : record;
}

export function isRecordCheckPassed(record: FingerprintCheckRecord): boolean {
  const active = resolveActiveCheckView(record);
  if (active.verdict === "consistent") return true;
  return (
    active.verdict === "inconclusive" &&
    active.inconclusiveReason === "single-reference-only" &&
    active.selfSim !== null &&
    active.selfLowerBound !== null &&
    active.selfSim >= active.selfLowerBound
  );
}

export function orderCheckRecordsByProfile(
  records: readonly FingerprintCheckRecord[],
  profiles: readonly ProfileView[] = [],
): FingerprintCheckRecord[] {
  const orderedNames = orderProfileNames(records.map((r) => normalizeCheckProfile(r.profile)), profiles);
  const rankOf = new Map(orderedNames.map((n, idx) => [n, idx]));
  return [...records].sort(
    (a, b) => (rankOf.get(normalizeCheckProfile(a.profile)) ?? 999) - (rankOf.get(normalizeCheckProfile(b.profile)) ?? 999),
  );
}

export function toProfileViews(
  profiles: readonly FingerprintProfileSummary[],
): ProfileView[] {
  return profiles.map((p) => ({
    name: p.name,
    label: p.label ?? p.name,
    cli: p.cli ?? "codex",
    upstreamType: p.upstreamType ?? "compatible",
    group: p.group ?? null,
    website: p.website ?? null,
    multiplier: p.multiplier ?? 1,
    enabled: p.enabled ?? true,
  }));
}

export type { FillPlan, VerificationCheckPlan };


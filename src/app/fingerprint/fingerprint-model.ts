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
import type { ProfileView } from "@/core/profile-view";
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
}

export interface MatrixRowViewModel {
  cli: CliKind;
  model: string;
  usableProbes: number;
  totalProbes: number;
  totalMissingValues: number;
  totalEstimatedCalls: number;
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
}

export interface FingerprintApiSnapshot {
  modelFingerprint: ModelFingerprintConfig;
  profiles: FingerprintProfileSummary[];
  matrix: ModelStatusEntry[];
  fillPlan: FillPlan;
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
  };
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
    const cliVersions = Array.from(new Set(gapEntries.flatMap((g) => g.cliVersions)));
    const cells: MatrixCellViewModel[] = activeProbes.map((probeId) => {
      const probeTarget = resolveProbeTargetSamples(probeId, {
        samplesPerProbe,
        samplesByProbe,
      });
      const gap = row.probes[probeId];
      if (gap) return toCellViewModel(gap, probeTarget);
      return {
        probeId,
        validValues: 0,
        targetValues: probeTarget,
        missingValues: probeTarget,
        estimatedCalls: 0,
        usable: false,
        statusClass: "empty",
        progressText: `0/${probeTarget}`,
        intraProbeSim: null,
        intraProbeLowerBound: null,
      };
    });
    const usableProbes = cells.filter((c) => c.usable).length;
    const totalMissingValues = cells.reduce((sum, c) => sum + c.missingValues, 0);
    const totalEstimatedCalls = cells.reduce((sum, c) => sum + c.estimatedCalls, 0);
    return {
      cli: row.cli,
      model: row.model,
      usableProbes,
      totalProbes: activeProbes.length,
      totalMissingValues,
      totalEstimatedCalls,
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

export function buildFillRequestBody(options: {
  action?: "fill" | "plan";
  cli?: CliKind;
  model?: string;
  probes?: ProbeId[];
  count?: number;
}): string {
  return JSON.stringify({
    action: options.action ?? "fill",
    mode: "fill",
    cli: options.cli,
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

export function toProfileViews(
  profiles: readonly FingerprintProfileSummary[],
): ProfileView[] {
  return profiles.map((p) => ({
    name: p.name,
    label: p.label ?? p.name,
    cli: p.cli ?? "codex",
    upstreamType: "compatible",
    group: null,
    website: null,
    multiplier: 1,
    enabled: p.enabled ?? true,
  }));
}

export type { FillPlan, VerificationCheckPlan };

/**
 * 模型指纹模块纯领域类型、枚举与常量（零 I/O，供前后端、配置与 i18n 共用）
 */

import type { TokenUsage } from "../../pricing/types";
import type { CliKind, EffortLevel } from "../types";

export const PROBE_IDS = [
  "uuid",
  "number",
  "seed",
  "palette",
  "words-en",
  "words-zh",
] as const;

export type ProbeId = (typeof PROBE_IDS)[number];

export function isProbeId(value: string): value is ProbeId {
  return (PROBE_IDS as readonly string[]).includes(value);
}

export const PROBE_OUTCOMES = [
  "ok",
  "timeout",
  "content-filter",
  "error",
  "leak-blocked",
] as const;

export type ProbeOutcome = (typeof PROBE_OUTCOMES)[number];

export const CANONICAL_REJECTION_REASONS = [
  "invalid_format",
  "duplicate_segments",
  "low_char_diversity",
] as const;

export type CanonicalRejectionReason = (typeof CANONICAL_REJECTION_REASONS)[number];

export const REJECTION_REASONS = [
  "tool_write_instead_of_inline",
  "empty_output",
  "invalid_format",
  "duplicate_segments",
  "low_char_diversity",
  "no_candidate",
] as const;

export type RejectionReason = (typeof REJECTION_REASONS)[number];

export const VERDICTS = [
  "consistent",
  "inconsistent",
  "inconclusive",
  "not-comparable",
] as const;

export type Verdict = (typeof VERDICTS)[number];

export const INCONCLUSIVE_REASONS = [
  "below-self-lower-bound",
  "within-threshold-margin",
  "single-reference-only",
  "candidates-indistinguishable",
] as const;

export type InconclusiveReason = (typeof INCONCLUSIVE_REASONS)[number];

export const DEFAULT_FINGERPRINT_EFFORT: EffortLevel = "low";
export const DEFAULT_SAMPLES_PER_PROBE = 20;
export const DEFAULT_SAMPLES_BY_PROBE: Readonly<Record<ProbeId, number>> = {
  uuid: 40,
  number: 40,
  seed: 50,
  palette: 60,
  "words-en": 60,
  "words-zh": 80,
};
export const MIN_SAMPLES_PER_PROBE = 10;
export const DEFAULT_VALUES_PER_CALL = 5;
export const DEFAULT_VALUES_PER_CHECK = 1;
export const DEFAULT_CHECK_ATTEMPTS = 3;
export const DEFAULT_TARGET_ACCURACY = 0.95;
export const DEFAULT_MAX_CALLS_FACTOR = 3;
export const DEFAULT_FINGERPRINT_CONCURRENCY = 5;
export const MAX_FINGERPRINT_CONCURRENCY = 20;
export const MIN_PAIRWISE_THRESHOLD = 1e-4;
export const MAX_SELF_TEST_FOLDS = 50;

export function resolveProbeTargetSamples(
  probe: ProbeId,
  options?: {
    samplesPerProbe?: number;
    samplesByProbe?: Partial<Record<ProbeId, number>>;
  },
): number {
  const byProbe = options?.samplesByProbe?.[probe];
  if (typeof byProbe === "number" && Number.isInteger(byProbe) && byProbe >= 1) {
    return byProbe;
  }
  if (
    typeof options?.samplesPerProbe === "number" &&
    Number.isInteger(options.samplesPerProbe) &&
    options.samplesPerProbe >= 1
  ) {
    return options.samplesPerProbe;
  }
  return DEFAULT_SAMPLES_BY_PROBE[probe];
}

export interface CodecTarget {
  cli: CliKind;
  model: string;
}

export interface ModelPromptOverride {
  prompt?: string;
  valuesPerCall?: number;
}

export type ModelPromptOverrides = Record<
  string,
  Partial<Record<ProbeId, ModelPromptOverride>>
>;

export interface FingerprintReferenceTarget {
  cli: CliKind;
  model: string;
}

export interface AttemptExtractInput {
  rawText: string;
  valuesPerCall: number;
  codecId?: string;
  wroteFile?: boolean;
}

export interface ExtractionResult {
  values: string[];
  matchedCodecId: string | null;
  rejectionReason: RejectionReason | null;
}

export interface ProbeFeatures {
  readonly chars: readonly string[];
  readonly bigrams: readonly string[];
  readonly segments?: readonly string[];
}

export interface ProbeAttempt {
  at: string;
  profile: string;
  reqId: string;
  codecId?: string;
  valuesPerCall: number;
  outcome: ProbeOutcome;
  wroteFile?: boolean;
  excluded?: boolean;
  rawText: string;
  durationMs: number;
  usage: TokenUsage | null;
  estimatedCostUsd: number | null;
  cliVersion: string;
}

export interface ProbeSampleSet {
  probe: ProbeId;
  cli: CliKind;
  environment: string;
  model: string;
  requestedEffort: EffortLevel;
  appliedEffort: EffortLevel;
  effortHonored: boolean;
  attempts: ProbeAttempt[];
}

export interface QualifiedProbeValue {
  reqId: string;
  value: string;
}

export interface DecodedAttemptSummary {
  reqId: string;
  at: string;
  profile: string;
  codecId: string;
  valuesPerCall: number;
  outcome: ProbeOutcome;
  wroteFile: boolean;
  excluded: boolean;
  durationMs: number;
  usage: TokenUsage | null;
  estimatedCostUsd: number | null;
  cliVersion: string;
  values: string[];
  matchedCodecId: string | null;
  rejectionReason: RejectionReason | null;
  sampleSelfSim: number | null;
  activeWindowCount: number;
}

export interface SkippedProbeInfo {
  probe: ProbeId;
  missingValues: number;
  estimatedCalls: number;
}

export interface FailedProbeInfo {
  probe: ProbeId;
  collectedValues: number;
  attemptsUsed: number;
  lastReason: RejectionReason | ProbeOutcome;
}

export interface UncomparedModelInfo {
  model: string;
  missingProbes: ProbeId[];
}

export interface ModelComparisonResult {
  candidateModel: string;
  candidateAppliedEffort: EffortLevel;
  sharedProbes: ProbeId[];
  probeDeltas: Partial<Record<ProbeId, number>>;
  scoreDiff: number;
  rawScoreDiff: number;
  threshold: number | null;
  distinguishable: boolean;
  candidateSelfSim: number;
  candidateLowerBound: number;
}

export interface ModelRankingEntry {
  model: string;
  meanSim: number;
}

export interface CheckRescoreEntry {
  rescoredAt: string;
  validProbes: ProbeId[];
  probeScores: Partial<Record<ProbeId, Record<string, number>>>;
  selfSim: number | null;
  selfLowerBound: number | null;
  expectedConsistency: number | null;
  expectedFalseInconsistentRate: number | null;
  verdict: Verdict;
  inconclusiveReason: InconclusiveReason | null;
  closestCandidate: string | null;
  comparisons: ModelComparisonResult[];
  ranking: ModelRankingEntry[];
}

export interface FingerprintCheckRecord {
  checkId: string;
  createdAt: string;
  cli: CliKind;
  profile: string;
  environment: string;
  declaredModel: string;
  requestedEffort: EffortLevel;
  appliedEffort: EffortLevel;
  effortHonored: boolean;
  cliVersion: string;
  selectedProbes: ProbeId[];
  skippedProbes: SkippedProbeInfo[];
  validProbes: ProbeId[];
  failedProbes: FailedProbeInfo[];
  uncomparedModels: UncomparedModelInfo[];
  probeAttempts: Partial<Record<ProbeId, ProbeAttempt[]>>;
  probeScores: Partial<Record<ProbeId, Record<string, number>>>;
  selfSim: number | null;
  selfLowerBound: number | null;
  expectedConsistency: number | null;
  expectedFalseInconsistentRate: number | null;
  verdict: Verdict;
  inconclusiveReason: InconclusiveReason | null;
  closestCandidate: string | null;
  comparisons: ModelComparisonResult[];
  ranking: ModelRankingEntry[];
  rescores: CheckRescoreEntry[];
}

export type FingerprintJobKind = "fill" | "check";

export interface FingerprintJobRecord {
  jobId: string;
  kind: FingerprintJobKind;
  pid: number;
  pidStart?: string | null;
  startedAt: string;
  updatedAt: string;
  finishedAt: string | null;
  cancelledAt?: string | null;
  completedCalls: number;
  totalEstimatedCalls: number;
  failedCalls?: number;
  currentTarget?: string | null;
  currentProbe?: ProbeId | null;
  checkId?: string | null;
  error?: string | null;
  laneLimit?: number;
  lanes?: import("../progress").LaneProgress[];
}

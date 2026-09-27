import { type CliKind, type EffortLevel } from "@/core/types";

export interface RunDraft {
  promptIds: string[];
  concurrency: number;
  defaultTimeoutMs: number;
  timeoutByCli: Partial<Record<CliKind, number>>;
  timeoutByEffort?: Partial<Record<EffortLevel, number>>;
}

export interface EffortTierDefinition {
  level: EffortLevel;
  label: string;
  desc: string;
  defaultSec: number;
}

export const LOW_EFFORTS: EffortTierDefinition[] = [
  { level: "low", label: "low (低)", desc: "轻度思考", defaultSec: 600 },
  { level: "medium", label: "medium (中)", desc: "标准思考", defaultSec: 600 },
  { level: "high", label: "high (高)", desc: "深度思考", defaultSec: 600 },
];

export const HIGH_EFFORTS: EffortTierDefinition[] = [
  { level: "xhigh", label: "xhigh (极高)", desc: "强化深度思考", defaultSec: 1800 },
  { level: "max", label: "max (最大)", desc: "极限思考", defaultSec: 1800 },
  { level: "ultra", label: "ultra (超级)", desc: "极限超长思考", defaultSec: 1800 },
];

export const RECOMMENDED_EFFORT_PRESETS: Partial<Record<EffortLevel, number>> = {
  low: 600_000,
  medium: 600_000,
  high: 600_000,
  xhigh: 1_800_000,
  max: 1_800_000,
  ultra: 1_800_000,
};

export function updateCliTimeout(
  run: RunDraft,
  cli: CliKind,
  seconds: number | null,
): RunDraft {
  const next = { ...run.timeoutByCli };
  if (seconds === null) delete next[cli];
  else next[cli] = seconds * 1000;
  return { ...run, timeoutByCli: next };
}

export function updateEffortTimeout(
  run: RunDraft,
  effort: EffortLevel,
  seconds: number | null,
): RunDraft {
  const next = { ...(run.timeoutByEffort ?? {}) };
  if (seconds === null) delete next[effort];
  else next[effort] = seconds * 1000;
  return { ...run, timeoutByEffort: next };
}

export function applyRecommendedPresets(run: RunDraft): RunDraft {
  return {
    ...run,
    defaultTimeoutMs: 1_800_000,
    timeoutByEffort: { ...RECOMMENDED_EFFORT_PRESETS },
  };
}

export function formatSeconds(ms: number | undefined): number | "" {
  return ms === undefined ? "" : Math.round(ms / 1000);
}

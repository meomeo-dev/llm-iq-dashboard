import type { JudgeConfig, ProfileConfig } from "@/core/config";
import type { PromptSpec } from "@/core/prompt";
import type { CliKind, EffortLevel, Target } from "@/core/types";
import type { RotationConfig } from "@/core/variables";
import type { ScheduleDraft } from "./ScheduleForm";

export interface EditableConfig {
  schedule: ScheduleDraft;
  run: {
    promptIds: string[];
    concurrency: number;
    defaultTimeoutMs: number;
    timeoutByCli: Partial<Record<CliKind, number>>;
    timeoutByEffort?: Partial<Record<EffortLevel, number>>;
    rotation: RotationConfig;
  };
  upstreamTypes: string[];
  profiles: ProfileConfig[];
  targets: Target[];
  customPrompts: PromptSpec[];
  customModels: Partial<Record<CliKind, string[]>>;
  judge: JudgeConfig;
}

export type ConfigEditorStatus =
  | { kind: "idle" }
  | { kind: "busy"; message: string }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string };

export function describeError(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

export function buildConfigPatchBody(draft: EditableConfig): string {
  return JSON.stringify({
    schedule: draft.schedule,
    run: draft.run,
    upstreamTypes: draft.upstreamTypes,
    profiles: draft.profiles,
    targets: draft.targets,
    prompts: draft.customPrompts,
    customModels: draft.customModels,
    judge: draft.judge,
  });
}

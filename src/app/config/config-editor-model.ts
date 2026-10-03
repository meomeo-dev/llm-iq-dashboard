import type { HarnessGuardConfig, JudgeConfig, ProfileConfig } from "@/core/config";
import type { PromptSpec } from "@/core/prompt";
import type { CliKind, EffortLevel, Target } from "@/core/types";
import type { RotationConfig } from "@/core/variables";
import type { DataRepoDraft } from "./DataRepoForm";
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
    harnessGuard: HarnessGuardConfig;
  };
  upstreamTypes: string[];
  profiles: ProfileConfig[];
  targets: Target[];
  customPrompts: PromptSpec[];
  customModels: Partial<Record<CliKind, string[]>>;
  judge: JudgeConfig;
  /** 数据仓设置；null 表示不启用（保存时删掉整段 dataRepo） */
  dataRepo: DataRepoDraft | null;
}

export type ConfigEditorStatus =
  | { kind: "idle" }
  | { kind: "busy"; message: string }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string };

export function describeError(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

/** 地址与路径去掉首尾空白；地址留空写成 null，写回时会删掉 repository 键 */
function dataRepoPatchOf(dataRepo: DataRepoDraft | null) {
  if (dataRepo === null) return null;
  const repository = dataRepo.repository.trim();
  return {
    path: dataRepo.path.trim(),
    repository: repository === "" ? null : repository,
    autoSync: dataRepo.autoSync,
    push: dataRepo.push,
  };
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
    dataRepo: dataRepoPatchOf(draft.dataRepo),
  });
}
